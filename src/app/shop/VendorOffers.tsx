"use client";

import { useMemo, useState } from "react";
import { money, packLabel, perMg, mg, type OfferRow, type Variant } from "../lib/shop";
import { addToCart, itemKey, removeFromCart, useCart } from "../lib/cart";
import { Facts, Seal, VendorMark } from "./VendorParts";
import SegBar from "./SegBar";
import HandoffLink from "./HandoffLink";

/**
 * The compound page's one job: which vendor, at what price, then out.
 * 2026-11-11 ("doesn't fit my vision of simplicity in purchase"): the top is
 * ONE pick card, the best-scored vendor at the chosen size with its price
 * and one Buy button, the size as the only control and the cheapest option
 * named in one line beneath. The four-stat strip, the sort toggle and "All
 * sizes" are gone. Then one quiet heading and one pane with one row per
 * vendor: rank, mark, name, ONE fact line in a buyer's words ("Third-party
 * tested · 81 COAs · 4.3 on Trustpilot"), the picked pack's price as the
 * lead number with per mg beneath (the packs as the row-scale SegBar when
 * there is more than one), Save and Get it. The Testing column, the header
 * row and the batch numbers are gone; the vendor's profile holds them.
 */
export default function VendorOffers({
  rows,
  sizes,
  compoundSlug,
  compoundName,
}: {
  rows: OfferRow[];
  sizes: number[];
  compoundSlug: string;
  compoundName: string;
}) {
  const saved = useCart();
  const defaultSize = useMemo(() => {
    const counts = new Map<number, number>();
    for (const r of rows) for (const v of r.variants) if (v.sizeMg) counts.set(v.sizeMg, (counts.get(v.sizeMg) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]?.[0] ?? null;
  }, [rows]);
  const [size, setSize] = useState<number | null>(defaultSize);
  const [picked, setPicked] = useState<Record<string, string>>({});

  const shown = useMemo(() => {
    const list = rows
      .map((r) => {
        const variants = r.variants.filter((v) => size === null || v.sizeMg === size || v.sizeMg === null);
        const best = variants.slice().sort((a, b) => (perMg(a) ?? Infinity) - (perMg(b) ?? Infinity) || a.priceUsd - b.priceUsd)[0];
        return { ...r, variants, best };
      })
      .filter((r) => r.variants.length && r.best);
    return list;
  }, [rows, size]);
  const pick = shown[0];
  const cheapest = useMemo(
    () =>
      shown
        .filter((r) => r.currency === "USD" && perMg(r.best!) !== null)
        .sort((a, b) => perMg(a.best!)! - perMg(b.best!)!)[0],
    [shown]
  );
  const tested = rows.filter((r) => r.independentlyTested).length;

  const vkey = (v: Variant) => `${v.sizeMg ?? ""}|${v.quantity ?? ""}|${v.priceUsd}`;
  const label = (v: Variant) => `${packLabel(v)}${v.sizeMg ? ` · ${mg(v.sizeMg)}` : ""}`;
  const keyFor = (r: OfferRow, v: Variant) => itemKey({ vendorSlug: r.vendorSlug, productUrl: r.productUrl, label: label(v), priceUsd: v.priceUsd });
  function toggleSave(r: OfferRow, v: Variant) {
    const k = keyFor(r, v);
    if (saved.some((s) => s.key === k)) removeFromCart(k);
    else
      addToCart({
        compoundSlug,
        compoundName,
        vendorSlug: r.vendorSlug,
        vendorName: r.vendorName,
        vendorUrl: null,
        productUrl: r.productUrl,
        label: label(v),
        priceUsd: v.priceUsd,
        currency: r.currency,
        code: r.code,
      });
  }
  /** The one fact line a buyer reads: tested, how many certificates, what people say. */
  const factsFor = (r: OfferRow) => {
    const f: string[] = [];
    if (r.independentlyTested) f.push("Third-party tested");
    else if (r.coaArchive || r.coaCount) f.push("Tests published");
    else f.push("No public testing");
    if (r.coaCount) f.push(`${r.coaCount} COAs`);
    if (r.trustpilotAverage !== null) f.push(`${r.trustpilotAverage.toFixed(1)} on Trustpilot`);
    return f;
  };

  return (
    <>
      <section className="sh-pane sh-pick" aria-label={`Our pick for ${compoundName}`}>
        {pick ? (
          <div className="sh-pick-main">
            <div className="sh-pick-vendor">
              <p className="sh-pick-eyebrow">Our pick{size ? ` for ${mg(size)}` : ""}</p>
              <span className="sh-pick-id">
                <VendorMark v={{ name: pick.vendorName, logoUrl: pick.logoUrl }} size={44} />
                <span>
                  <a className="sh-pick-name" href={`/shop/vendors/${pick.vendorSlug}`}>
                    {pick.vendorName}
                  </a>
                  <Seal verification={pick.verification} size={16} />
                </span>
              </span>
              <Facts items={factsFor(pick)} />
            </div>
            <div className="sh-pick-price">
              <strong>{money(pick.best!.priceUsd, pick.currency)}</strong>
              <span>
                {label(pick.best!)}
                {perMg(pick.best!) !== null && pick.currency === "USD" ? ` · ${money(perMg(pick.best!)!)} per mg` : ""}
              </span>
              {pick.code && <span className="sh-pick-code">Code {pick.code} at checkout</span>}
            </div>
            <HandoffLink
              className="btn btn-accent sh-pick-buy"
              handoff={{
                vendorSlug: pick.vendorSlug,
                vendorName: pick.vendorName,
                url: pick.productUrl,
                compoundSlug,
                compoundName,
                label: label(pick.best!),
                priceUsd: pick.best!.priceUsd,
                currency: pick.currency,
                code: pick.code,
                from: "compound",
              }}
            >
              Buy at {pick.vendorName}
            </HandoffLink>
          </div>
        ) : (
          <p className="sh-empty">No vendor in the catalog lists {compoundName} at this size.</p>
        )}
        <div className="sh-pick-foot">
          {sizes.length > 1 && (
            <SegBar label="Vial size" value={size} onChange={setSize} options={sizes.map((s) => ({ value: s as number | null, label: mg(s) }))} />
          )}
          {cheapest && pick && cheapest.vendorSlug !== pick.vendorSlug && (
            <a className="sh-pick-cheap" href={`#offer-${cheapest.vendorSlug}`}>
              Cheapest at this size: {cheapest.vendorName}, {money(perMg(cheapest.best!)!)} per mg
              <span aria-hidden="true">{"\u00a0→"}</span>
            </a>
          )}
        </div>
      </section>

      {shown.length > 0 && (
        <h2 className="sh-offers-head">
          {shown.length} vendor{shown.length === 1 ? "" : "s"} sell {compoundName}
          {size ? ` at ${mg(size)}` : ""}
          <span>{tested ? ` · ${tested} third-party tested` : ""}</span>
        </h2>
      )}
      {shown.length === 0 ? null : (
        <div className="sh-pane sh-offers">
          <ol className="sh-list">
            {shown.map((r, i) => {
              const sel = r.variants.find((v) => vkey(v) === picked[r.vendorSlug]) ?? r.best!;
              const pm = perMg(sel);
              const isSaved = saved.some((s) => s.key === keyFor(r, sel));
              return (
                <li key={r.vendorSlug} id={`offer-${r.vendorSlug}`} className="sh-offer">
                  <span className="sh-offer-rank">{String(i + 1).padStart(2, "0")}</span>
                  <div className="sh-offer-vendor">
                    <VendorMark v={{ name: r.vendorName, logoUrl: r.logoUrl }} size={36} />
                    <div className="sh-offer-id">
                      <span className="sh-offer-title">
                        <a className="sh-vendor-name" href={`/shop/vendors/${r.vendorSlug}`}>
                          {r.vendorName}
                        </a>
                        <Seal verification={r.verification} size={13} />
                      </span>
                      <Facts items={factsFor(r)} />
                    </div>
                  </div>

                  <div className="sh-offer-price">
                    <strong>{money(sel.priceUsd, r.currency)}</strong>
                    <span className="sh-offer-sub">
                      {label(sel)}
                      {pm !== null && r.currency === "USD" ? ` · ${money(pm)} per mg` : ""}
                    </span>
                    {r.variants.length > 1 && (
                      <SegBar
                        small
                        label={`${r.vendorName} packs`}
                        value={vkey(sel)}
                        onChange={(k) => setPicked((o) => ({ ...o, [r.vendorSlug]: k }))}
                        options={r.variants.map((v, _i, all) => {
                          // A pack whose vial count the store never states is named by its
                          // price; two packs with the same count get the price beside it.
                          const named = v.quantity ? packLabel(v) : null;
                          const twin = named && all.filter((x) => x.quantity && packLabel(x) === named).length > 1;
                          return { value: vkey(v), label: !named ? money(v.priceUsd, r.currency) : twin ? `${named} · ${money(v.priceUsd, r.currency)}` : named };
                        })}
                      />
                    )}
                  </div>

                  <div className="sh-offer-actions">
                    <button
                      type="button"
                      className={`sh-icon-btn${isSaved ? " is-on" : ""}`}
                      aria-pressed={isSaved}
                      aria-label={isSaved ? `Remove ${r.vendorName} from Saved` : `Save ${r.vendorName}`}
                      title={isSaved ? "Saved" : "Save"}
                      onClick={() => toggleSave(r, sel)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M4 2.5h8v11l-4-2.6-4 2.6z" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <HandoffLink
                      className="sh-icon-btn sh-icon-btn--go"
                      handoff={{
                        vendorSlug: r.vendorSlug,
                        vendorName: r.vendorName,
                        url: r.productUrl,
                        compoundSlug,
                        compoundName,
                        label: label(sel),
                        priceUsd: sel.priceUsd,
                        currency: r.currency,
                        code: r.code,
                        from: "compound",
                      }}
                      aria-label={`Open ${compoundName} at ${r.vendorName}`}
                      title={`Open at ${r.vendorName}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                        <path d="M4.5 11.5l7-7M5.5 4.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </HandoffLink>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </>
  );
}
