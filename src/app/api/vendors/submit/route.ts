import { NextResponse } from "next/server";
import { SHOP_VENDORS } from "../../../lib/shop";

/**
 * Vendor submissions from /shop/submit.
 *
 * 1. Dedupe against the 42 researched vendors by domain, so a known store is
 *    answered immediately and never emailed.
 * 2. Forward new stores to VENDOR_SUBMISSIONS_WEBHOOK_URL (the same pattern
 *    the newsletter uses), which delivers to the team's inbox. Unset, the
 *    route returns 503 and the form says submissions are closed, so an
 *    address can never be silently dropped.
 *
 * The AI pre-check against the research playbook (is this store worth a
 * dossier?) attaches here once an ANTHROPIC_API_KEY is on the deployment:
 * it runs after the dedupe and its verdict rides in the same email.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof body.website === "string" && body.website.trim()) {
    // Honeypot filled: pretend success, send nothing.
    return NextResponse.json({ ok: true, known: false });
  }
  const url = String(body.url ?? "").trim();
  const name = String(body.name ?? "").trim().slice(0, 80);
  const notes = String(body.notes ?? "").trim().slice(0, 1500);
  const email = String(body.email ?? "").trim().slice(0, 120);
  let host: string;
  try {
    host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return NextResponse.json({ error: "Enter the store's full URL, starting with https://" }, { status: 400 });
  }
  if (!name) return NextResponse.json({ error: "Enter the store's name." }, { status: 400 });

  const known = SHOP_VENDORS.find((v) => (v.domain ?? "").replace(/^www\./, "").toLowerCase() === host);
  if (known) return NextResponse.json({ ok: true, known: true, slug: known.slug });

  const target = process.env.VENDOR_SUBMISSIONS_WEBHOOK_URL;
  if (!target) {
    return NextResponse.json({ error: "Submissions are not open yet. Email us instead." }, { status: 503 });
  }
  const res = await fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "vendor_submission",
      receivedAt: new Date().toISOString(),
      store: { name, url, host },
      notes,
      email: email || null,
      userAgent: req.headers.get("user-agent"),
    }),
  }).catch(() => null);
  if (!res || !res.ok) return NextResponse.json({ error: "Could not deliver the submission. Try again later." }, { status: 502 });
  return NextResponse.json({ ok: true, known: false });
}
