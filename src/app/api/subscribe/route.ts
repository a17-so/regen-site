import { NextResponse } from "next/server";

/**
 * Newsletter signup.
 *
 * Forwards to NEWSLETTER_WEBHOOK_URL, point it at whatever list you use
 * (ConvertKit, Loops, a Cloud Function). With it unset the route returns 503
 * and the form says signups aren't open, which is the honest failure: a field
 * that accepts an address and drops it on the floor is worse than no field.
 */

const HITS = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

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
  const target = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!target) {
    return NextResponse.json({ error: "Signups aren't open yet." }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (throttled(ip)) {
    return NextResponse.json({ error: "Too many attempts. Try later." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const { email, website } = (payload ?? {}) as Record<string, unknown>;

  // Honeypot, a real person never fills a field they can't see.
  if (typeof website === "string" && website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
    return NextResponse.json({ error: "That doesn't look like an email." }, { status: 400 });
  }

  try {
    const res = await fetch(target, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        source: "regen-site/footer",
        subscribedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error(String(res.status));
  } catch {
    return NextResponse.json({ error: "Couldn't sign you up right now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
