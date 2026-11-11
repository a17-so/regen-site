import { NextResponse } from "next/server";
import { SHOP_VENDORS } from "../../../lib/shop";

/**
 * Vendor submissions from /shop/submit.
 *
 * 1. Dedupe against the researched vendors by domain, so a known store is
 *    answered immediately and never emailed.
 * 2. Email new stores to the team for approval (2026-11-10: "vendor sign ups
 *    go to our emails to approve them and then when they are approved they
 *    join"). Sent through Resend's REST API with RESEND_API_KEY to
 *    VENDOR_SUBMISSIONS_EMAIL (comma-separated for several inboxes), from
 *    VENDOR_SUBMISSIONS_FROM (a sender on a domain verified in Resend).
 *    Reply-To is the vendor's own address, so approving is a reply.
 * 3. VENDOR_SUBMISSIONS_WEBHOOK_URL still works as an alternative delivery
 *    (Zapier, Make, a Cloud Function).
 *
 * With neither configured the route returns 503 and the form says
 * submissions are closed, so an address can never be silently dropped.
 */

type Submission = {
  kind: "vendor" | "certificate";
  receivedAt: string;
  store: { name: string; url: string; host: string };
  notes: string;
  details: Record<string, string>;
  email: string | null;
  userAgent: string | null;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function emailBody(s: Submission) {
  const rows: [string, string][] = [
    ["Store", s.store.name],
    ["Website", s.store.url],
    ["Contact", s.email ?? "None given"],
    ["Type", s.kind === "certificate" ? "Certificate submission" : "New vendor"],
    ...Object.entries(s.details),
    ...(s.notes ? ([["Notes", s.notes]] as [string, string][]) : []),
    ["Received", s.receivedAt],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html =
    `<h2 style="font-family:sans-serif">New ${s.kind === "certificate" ? "certificate" : "vendor"} submission: ${esc(s.store.name)}</h2>` +
    `<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 16px 6px 0;color:#6c6c6c;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`
      )
      .join("") +
    `</table><p style="font-family:sans-serif;font-size:13px;color:#6c6c6c">Approve by replying to the vendor. Approved stores join the Marketplace once researched.</p>`;
  return { text, html };
}

async function deliverByEmail(s: Submission): Promise<boolean | null> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.VENDOR_SUBMISSIONS_EMAIL;
  if (!key || !to) return null;
  const from = process.env.VENDOR_SUBMISSIONS_FROM || "REGEN Marketplace <onboarding@resend.dev>";
  const { text, html } = emailBody(s);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((a) => a.trim()).filter(Boolean),
      subject: `Marketplace submission: ${s.store.name} (${s.store.host})`,
      text,
      html,
      ...(s.email ? { reply_to: s.email } : {}),
    }),
  }).catch(() => null);
  return !!res && res.ok;
}

async function deliverByWebhook(s: Submission): Promise<boolean | null> {
  const target = process.env.VENDOR_SUBMISSIONS_WEBHOOK_URL;
  if (!target) return null;
  const res = await fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "vendor_submission", ...s }),
  }).catch(() => null);
  return !!res && res.ok;
}

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
  const kind = body.kind === "coa" ? "certificate" : "vendor";
  // The onboarding's answers, one short string per step field.
  const details: Record<string, string> = {};
  if (body.details && typeof body.details === "object") {
    for (const [k, v] of Object.entries(body.details as Record<string, unknown>)) {
      if (k !== "website" && typeof v === "string" && v.trim()) details[k.slice(0, 40)] = v.trim().slice(0, 500);
    }
  }
  let host: string;
  try {
    host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return NextResponse.json({ error: "Enter the store's full URL, starting with https://" }, { status: 400 });
  }
  if (!name) return NextResponse.json({ error: "Enter the store's name." }, { status: 400 });

  const known = SHOP_VENDORS.find((v) => (v.domain ?? "").replace(/^www\./, "").toLowerCase() === host);
  if (known) return NextResponse.json({ ok: true, known: true, slug: known.slug });

  const submission: Submission = {
    kind,
    receivedAt: new Date().toISOString(),
    store: { name, url, host },
    notes,
    details,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null,
    userAgent: req.headers.get("user-agent"),
  };

  const results = await Promise.all([deliverByEmail(submission), deliverByWebhook(submission)]);
  if (results.every((r) => r === null)) {
    return NextResponse.json({ error: "Submissions are not open yet. Email us instead." }, { status: 503 });
  }
  if (!results.some((r) => r === true)) {
    return NextResponse.json({ error: "Could not deliver the submission. Try again later." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, known: false });
}
