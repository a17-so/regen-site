"use client";

import { useMemo, useState } from "react";
import { money, packLabel, perMg, mg, type OfferRow, type Variant } from "../lib/shop";
import { addToCart, itemKey, removeFromCart, useCart } from "../lib/cart";

/**
 * The compound page's one job: which vendor, on what evidence, at what
 * price, then out. One row per vendor in one pane. The toolbar picks the
 * vial size and the order; each row shows its best pack for that size with
 * the rest one click away, the latest certificate, purity, the code, Save,
 * and Get it. Get it is the only accent on the page.
 */
export default function CompareTable({
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
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const shown = useMemo(() => {
    const list = rows
      .map((r) => {
        const variants = r.variants.filter((v) => size === null || v.sizeMg === size || v.sizeMg === null);
        // Best pack: cheapest per mg when the maths exists, else cheapest.
        const best = variants.slice().sort((a, b) => (perMg(a) ?? Infinity) - (perMg(b) ?? Infinity) || a.priceUsd - b.priceUsd)[0];
        return { ...r, variants, best };
      })
      .filter((r) => r.variants.length && r.best);
    if (sort === "price") list.sort((a, b) => (perMg(a.best!) ?? Infinity) - (perMg(b.best!) ?? Infinity) || a.best!.priceUsd - b.best!.priceUsd);
    return list;
  }, [rows, size, sort]);

  function keyFor(r: OfferRow, v: Variant) {
    return itemKey({ vendorSlug: r.vendorSlug, productUrl: r.productUrl, label: label(v), priceUsd: v.priceUsd });
  }
  function label(v: Variant) {
    return `${packLabel(v)}${v.sizeMg ? ` · ${mg(v.sizeMg)}` : ""}`;
  }
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

  return (
    <>
      <div className="sh-toolbar">
        <div className="sh-seg" role="group" aria-label="Dose per vial">
          <span className="sh-seg-label">Dose per vial</span>
          <button type="button" aria-pressed={size === null} onClick={() => setSize(null)}>
            All
          </button>
          {sizes.map((s) => (
            <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(s)}>
              {mg(s)}
            </button>
          ))}
        </div>
        <div className="sh-toolbar-right">
          <span className="sh-count">
            {shown.length} vendor{shown.length === 1 ? "" : "s"}
          </span>
          <label className="sh-sort">
            Sort
            <select value={sort} onChange={(e) => setSort(e.target.value as "recommended" | "price")}>
              <option value="recommended">Recommended</option>
              <option value="price">Price per mg</option>
            </select>
          </label>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="sh-empty">No vendor in the catalog lists {compoundName} at this size.</p>
      ) : (
        <div className="sh-pane sh-pane--table">
          <table className="sh-table">
            <thead>
              <tr>
                <th scope="col" className="sh-col-rank">
                  #
                </th>
                <th scope="col">Vendor</th>
                <th scope="col">Price</th>
                <th scope="col">Per mg</th>
                <th scope="col">Latest COA</th>
                <th scope="col">Purity</th>
                <th scope="col">Code</th>
                <th scope="col" className="sh-col-actions">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r, i) => {
                const best = r.best!;
                const pm = perMg(best);
                const others = r.variants.filter((v) => v !== best);
                const isOpen = Boolean(open[r.vendorSlug]);
                const isSaved = saved.some((s) => s.key === keyFor(r, best));
                return (
                  <tr key={r.vendorSlug}>
                    <td className="sh-col-rank">{i + 1}</td>
                    <td>
                      <div className="sh-vendor">
                        {r.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.logoUrl} alt="" width={28} height={28} loading="lazy" />
                        ) : (
                          <span className="sh-vendor-mark" aria-hidden="true">
                            {r.vendorName.slice(0, 1)}
                          </span>
                        )}
                        <div>
                          <a className="sh-vendor-name" href={`/shop/vendors/${r.vendorSlug}`}>
                            {r.vendorName}
                          </a>
                          <div className="sh-badges">
                            {sort === "recommended" && i === 0 && <span className="sh-badge sh-badge--ink">Recommended</span>}
                            {r.independentlyTested && <span className="sh-badge">Tested</span>}
                            {r.coaArchive && <span className="sh-badge">Public COAs</span>}
                            {r.country && <span className="sh-badge">{r.country === "United States" ? "USA" : r.country}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="sh-col-price">
                      <strong>{money(best.priceUsd, r.currency)}</strong>
                      <span className="sh-sub">{label(best)}</span>
                      {others.length > 0 && (
                        <button type="button" className="sh-more" aria-expanded={isOpen} onClick={() => setOpen((o) => ({ ...o, [r.vendorSlug]: !isOpen }))}>
                          {isOpen ? "Fewer" : `+${others.length} more`}
                        </button>
                      )}
                      {isOpen && (
                        <ul className="sh-packs">
                          {others.map((v, j) => {
                            const p = perMg(v);
                            const k = keyFor(r, v);
                            const on = saved.some((s) => s.key === k);
                            return (
                              <li key={j}>
                                <span>
                                  {money(v.priceUsd, r.currency)} <span className="sh-sub">{label(v)}</span>
                                  {p !== null && r.currency === "USD" ? <span className="sh-sub"> · {money(p)}/mg</span> : null}
                                </span>
                                <button type="button" className="sh-save" aria-pressed={on} onClick={() => toggleSave(r, v)}>
                                  {on ? "Saved" : "Save"}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </td>
                    <td className="sh-col-num">{pm !== null && r.currency === "USD" ? `${money(pm)}` : <span className="lib-none">n/a</span>}</td>
                    <td>
                      {r.latestCoa?.date ? (
                        r.latestCoa.pdf ? (
                          <a href={r.latestCoa.pdf} target="_blank" rel="noopener noreferrer nofollow">
                            {r.latestCoa.date}
                          </a>
                        ) : (
                          r.latestCoa.date
                        )
                      ) : (
                        <span className="lib-none">Not on file</span>
                      )}
                      {r.latestCoa?.batch && <span className="sh-sub">{r.latestCoa.batch}</span>}
                    </td>
                    <td className="sh-col-num">{r.purity !== null ? `${r.purity}%` : <span className="lib-none">n/a</span>}</td>
                    <td>{r.code ? <code>{r.code}</code> : <span className="lib-none">None</span>}</td>
                    <td className="sh-col-actions">
                      <button type="button" className="sh-save" aria-pressed={isSaved} onClick={() => toggleSave(r, best)}>
                        {isSaved ? "Saved" : "Save"}
                      </button>
                      <a className="sh-get" href={r.productUrl} target="_blank" rel="noopener noreferrer nofollow sponsored">
                        Get it
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
