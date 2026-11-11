"use client";

import { useMemo, useState } from "react";
import { money, packLabel, perMg, mg, type OfferRow, type Variant } from "../lib/shop";
import { addToCart, itemKey, removeFromCart, useCart } from "../lib/cart";
import { Facts, Seal, VendorMark } from "./VendorParts";
import GlassTabs from "../components/GlassTabs";
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
 * lead number with per mg beneath (one pack, the best value at the size),
 * Save and Get it. The Testing column, the header
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
  /** The ranking after the pick; the pick is not repeated below it. */
  const rest = shown.slice(1);
  const cheapest = useMemo(
    () =>
      shown
        .filter((r) => r.currency === "USD" && perMg(r.best!) !== null)
        .sort((a, b) => perMg(a.best!)! - perMg(b.best!)!)[0],
    [shown]
  );
  // Counted over the vendors SHOWN at this size, not every vendor.
  const tested = shown.filter((r) => r.independentlyTested).length;

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
      {/* ONE control (the size), ONE slim pick row in the list's own
          anatomy with the price and a Buy button side by side, then the
          rest of the ranking. 2026-11-11, after two rejected big cards
          ("the cost and buy button are misplaced", "even more ass"). */}
      {/* The size is the site's own filter bar (GlassTabs, the Library and
          Science control and its glide), and a size change cross-fades the
          pick and the list instead of swapping them in one frame. Each row
          shows ONE pack, the best value at this size; the per-row pack
          pickers read as clutter (2026-11-11, "the whole mg system ...
          seems so cluttery and cheap"). */}
      {sizes.length > 1 && (
        <div className="sh-pick-size">
          <GlassTabs
            label="Vial size"
            tabs={sizes.map((s) => ({ key: String(s), label: mg(s), href: `#${s}-mg` }))}
            value={size === null ? null : String(size)}
            onPick={(k) => setSize(Number(k))}
          />
        </div>
      )}
      <div className="sh-sizeswap" key={size ?? "all"}>
      {pick ? (
        <section className="sh-pane sh-pickrow" aria-label={`Our pick for ${compoundName}`}>
          <div className="sh-offer-vendor">
            <VendorMark v={{ name: pick.vendorName, logoUrl: pick.logoUrl }} size={40} />
            <div className="sh-offer-id">
              <span className="sh-pickrow-eyebrow">Our pick{size ? ` at ${mg(size)}` : ""}</span>
              <span className="sh-offer-title">
                <a className="sh-vendor-name sh-pickrow-name" href={`/shop/vendors/${pick.vendorSlug}`}>
                  {pick.vendorName}
                </a>
                <Seal verification={pick.verification} size={14} />
              </span>
              <Facts items={factsFor(pick)} />
            </div>
          </div>
          <div className="sh-pickrow-buy">
            <div className="sh-pickrow-price">
              <strong>{money(pick.best!.priceUsd, pick.currency)}</strong>
              <span>
                {label(pick.best!)}
                {perMg(pick.best!) !== null && pick.currency === "USD" ? ` · ${money(perMg(pick.best!)!)} per mg` : ""}
                {pick.code ? ` · code ${pick.code}` : ""}
              </span>
            </div>
            <HandoffLink
              className="btn btn-accent btn-tiny"
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
              Buy
            </HandoffLink>
          </div>
        </section>
      ) : (
        <p className="sh-empty">No vendor in the catalog lists {compoundName} at this size.</p>
      )}

      {rest.length > 0 && (
        <div className="sh-offers-head">
          <h2>
            {rest.length} more vendor{rest.length === 1 ? "" : "s"}
            {size ? ` at ${mg(size)}` : ""}
            <span>{tested ? ` · ${tested} third-party tested` : ""}</span>
          </h2>
          {cheapest && pick && cheapest.vendorSlug !== pick.vendorSlug && (
            <a className="sh-pick-cheap" href={`#offer-${cheapest.vendorSlug}`}>
              Cheapest: {cheapest.vendorName}, {money(perMg(cheapest.best!)!)} per mg
            </a>
          )}
        </div>
      )}
      {rest.length === 0 ? null : (
        <div className="sh-pane sh-offers">
          <ol className="sh-list">
            {rest.map((r, i) => {
              const sel = r.best!;
              const pm = perMg(sel);
              const isSaved = saved.some((s) => s.key === keyFor(r, sel));
              return (
                <li key={r.vendorSlug} id={`offer-${r.vendorSlug}`} className="sh-offer">
                  <span className="sh-offer-rank">{String(i + 2).padStart(2, "0")}</span>
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
      </div>
    </>
  );
}
