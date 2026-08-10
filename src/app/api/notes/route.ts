import { NextResponse } from "next/server";

/**
 * Anonymous community-note submissions.
 *
 * Everything that arrives here is untrusted text from an unauthenticated
 * stranger, aimed at a health site. So this route validates hard, never
 * echoes input back, and forwards to a moderation target rather than
 * publishing anything directly. Nothing submitted here reaches the site
 * without a human approving it.
 *
 * ── Wiring it up ────────────────────────────────────────────────────────────
 * Set NOTES_WEBHOOK_URL to a moderation endpoint, a Cloud Function in
 * regen-app/functions writing to a `communityNoteSubmissions` collection is
 * the natural home, but a Slack incoming webhook works for launch.
 * With it unset the route returns 503 and the form says submissions aren't
 * open, which is the honest failure: better a closed form than one that
 * silently swallows what people write.
 */

const MAX_BODY = 600;
const MAX_COMPOUND = 60;

// Per-IP throttle. In-memory, so it resets on deploy and doesn't span
// instances, enough to stop casual flooding, not a substitute for the real
// rate limiting that belongs at the edge.
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;

function throttled(ip: string): boolean {
  const now = Date.now();
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    HITS.set(ip, recent);
    return true;
  }
  recent.push(now);
  HITS.set(ip, recent);
  return false;
}

export async function POST(req: Request) {
  const target = process.env.NOTES_WEBHOOK_URL;
  if (!target) {
    return NextResponse.json(
      { error: "Submissions aren't open yet." },
      { status: 503 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (throttled(ip)) {
    return NextResponse.json(
      { error: "You've sent a few already. Try again later." },
      { status: 429 }
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const { compound, body, website } = (payload ?? {}) as Record<string, unknown>;

  // Honeypot: a real person never fills a field they can't see.
  if (typeof website === "string" && website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (typeof compound !== "string" || typeof body !== "string") {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const c = compound.trim();
  const b = body.trim();

  if (c.length < 2 || c.length > MAX_COMPOUND) {
    return NextResponse.json({ error: "Compound name looks wrong." }, { status: 400 });
  }
  if (b.length < 20) {
    return NextResponse.json(
      { error: "Give it a bit more detail, at least a couple of sentences." },
      { status: 400 }
    );
  }
  if (b.length > MAX_BODY) {
    return NextResponse.json(
      { error: `Keep it under ${MAX_BODY} characters.` },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(target, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        compound: c,
        body: b,
        submittedAt: new Date().toISOString(),
        source: "regen-site/community-notes",
        // No IP, no fingerprint, no headers forwarded. The form is anonymous
        // and the moderation queue shouldn't hold identifying data either.
      }),
    });
    if (!res.ok) throw new Error(`moderation target responded ${res.status}`);
  } catch {
    return NextResponse.json(
      { error: "Couldn't send that right now. Try again shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
