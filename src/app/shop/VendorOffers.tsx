"use client";

import { useMemo, useState } from "react";
import { money, packLabel, perMg, mg, type OfferRow, type Variant } from "../lib/shop";
import { addToCart, itemKey, removeFromCart, useCart } from "../lib/cart";
import { Facts, Seal, VendorMark } from "./VendorParts";
import SegBar from "./SegBar";
import HandoffLink from "./HandoffLink";

/**
 * The compound page's one job: which vendor, on what evidence, at what
 * price, then out. One pane, one header row, one aligned row per vendor:
 * vendor (mark, name, facts) · price (the picked pack's price as the lead
 * number, its size and per mg beneath, the other packs as quiet switches)
 * · latest COA · purity · two icon buttons (save, open at the vendor).
 * Every row uses the same three type steps as the rest of the shop:
 * 15/600 for the thing, 13 subtext for what qualifies it, 12 subtle for
 * column labels. Nothing in a row is bolder than the vendor name except
 * the price.
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
  const [sort, setSort] = useState<"recommended" | "price">("recommended");
  const [picked, setPicked] = useState<Record<string, string>>({});

  const shown = useMemo(() => {
    const list = rows
      .map((r) => {
        const variants = r.variants.filter((v) => size === null || v.sizeMg === size || v.sizeMg === null);
        const best = variants.slice().sort((a, b) => (perMg(a) ?? Infinity) - (perMg(b) ?? Infinity) || a.priceUsd - b.priceUsd)[0];
        return { ...r, variants, best };
      })
      .filter((r) => r.variants.length && r.best);
    if (sort === "price") list.sort((a, b) => (perMg(a.best!) ?? Infinity) - (perMg(b.best!) ?? Infinity) || a.best!.priceUsd - b.best!.priceUsd);
    return list;
  }, [rows, size, sort]);

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
  const factsFor = (r: OfferRow) =>
    [r.independentlyTested ? "Third-party tested" : null, r.coaArchive ? "Public COAs" : null].filter(Boolean) as string[];

  return (
    <>
      <div className="sh-sizes">
        <SegBar
          label="Vial size"
          value={size}
          onChange={setSize}
          options={[{ value: null, label: "All sizes" }, ...sizes.map((s) => ({ value: s as number | null, label: mg(s) }))]}
        />
        <div className="sh-sizes-end">
          <span className="sh-count">
            {shown.length} vendor{shown.length === 1 ? "" : "s"}
          </span>
          <SegBar
            label="Sort"
            value={sort}
            onChange={setSort}
            options={[
              { value: "recommended", label: "Best score" },
              { value: "price", label: "Lowest per mg" },
            ]}
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="sh-empty">No vendor in the catalog lists {compoundName} at this size.</p>
      ) : (
        <div className="sh-pane sh-offers">
          <div className="sh-offer sh-offer--head" aria-hidden="true">
            <span>Vendor</span>
            <span>Price</span>
            <span>Testing</span>
            <span />
          </div>
          <ol className="sh-list">
            {shown.map((r) => {
              const sel = r.variants.find((v) => vkey(v) === picked[r.vendorSlug]) ?? r.best!;
              const pm = perMg(sel);
              const isSaved = saved.some((s) => s.key === keyFor(r, sel));
              return (
                <li key={r.vendorSlug} className="sh-offer">
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
                      {pm !== null && r.currency === "USD" ? ` · ${money(pm)}/mg` : ""}
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

                  <div className="sh-offer-cell" data-label="Testing">
                    {r.latestCoa?.date ? (
                      r.latestCoa.pdf ? (
                        <a href={r.latestCoa.pdf} target="_blank" rel="noopener noreferrer nofollow">
                          COA {r.latestCoa.date}
                        </a>
                      ) : (
                        <span>COA {r.latestCoa.date}</span>
                      )
                    ) : (
                      <span className="lib-none">No COA on file</span>
                    )}
                    <span className="sh-offer-sub">
                      {[r.latestCoa?.batch ? `Batch ${r.latestCoa.batch}` : null, r.purity !== null ? `${r.purity}% avg purity` : null].filter(Boolean).join(" · ") || "Purity not reported"}
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
    </>
  );
}
