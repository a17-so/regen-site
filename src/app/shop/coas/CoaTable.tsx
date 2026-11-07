"use client";

import { useMemo, useState } from "react";
import type { Coa } from "../../lib/shop";

/** The certificate archive with a text filter over vendor, compound, batch, lab. */
export default function CoaTable({ rows, compoundNames }: { rows: Coa[]; compoundNames: Record<string, string> }) {
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return rows;
    return rows.filter((r) =>
      [r.vendorName, r.productName, r.batch, r.lab, r.compoundSlug ? compoundNames[r.compoundSlug] : ""]
        .filter(Boolean)
        .some((s) => String(s).toLowerCase().includes(n))
    );
  }, [q, rows, compoundNames]);
  return (
    <>
      <div className="sh-toolbar">
        <input
          className="sh-filter"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by vendor, compound, batch, or lab"
          aria-label="Filter certificates"
        />
        <span className="sh-count">
          {shown.length} of {rows.length}
        </span>
      </div>
      <div className="sh-pane sh-pane--table">
        <table className="sh-table">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Vendor</th>
              <th scope="col">Compound</th>
              <th scope="col">Batch #</th>
              <th scope="col">Purity</th>
              <th scope="col">Lab · test</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r, i) => (
              <tr key={`${r.vendorSlug}-${r.batch ?? ""}-${i}`}>
                <td>{r.date ?? <span className="lib-none">Undated</span>}</td>
                <td>
                  <a href={`/shop/vendors/${r.vendorSlug}`}>{r.vendorName}</a>
                </td>
                <td>
                  {r.compoundSlug ? <a href={`/shop/${r.compoundSlug}`}>{compoundNames[r.compoundSlug] ?? r.productName}</a> : r.productName}
                  {r.netContentMg ? <span className="sh-sub">{r.netContentMg} mg measured</span> : null}
                </td>
                <td>
                  {r.batch ? (
                    r.pdf ? (
                      <a href={r.pdf} target="_blank" rel="noopener noreferrer nofollow">
                        <code>{r.batch}</code>
                      </a>
                    ) : (
                      <code>{r.batch}</code>
                    )
                  ) : (
                    <span className="lib-none">None</span>
                  )}
                </td>
                <td className="sh-col-num">{r.purity !== null ? `${r.purity}%` : <span className="lib-none">n/a</span>}</td>
                <td>
                  {r.lab ?? <span className="lib-none">Not named</span>}
                  {r.method ? <span className="sh-sub">{r.method}</span> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
