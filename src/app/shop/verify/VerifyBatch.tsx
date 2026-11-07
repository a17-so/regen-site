"use client";

import { useState } from "react";
import type { Coa } from "../../lib/shop";

const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "");

/** Batch lookup over the COA archive shipped with the page. */
export default function VerifyBatch({ rows, compoundNames }: { rows: Coa[]; compoundNames: Record<string, string> }) {
  const [q, setQ] = useState("");
  const [result, setResult] = useState<Coa[] | null>(null);

  function run(e: React.FormEvent) {
    e.preventDefault();
    const n = norm(q);
    if (n.length < 4) {
      setResult([]);
      return;
    }
    const exact = rows.filter((r) => r.batch && norm(r.batch) === n);
    setResult(exact.length ? exact : rows.filter((r) => r.batch && norm(r.batch).includes(n)).slice(0, 10));
  }

  return (
    <>
      <form className="sh-toolbar sh-verify-form" onSubmit={run}>
        <input
          className="sh-filter"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Batch number, e.g. OR-LPBPC10-626-B6"
          aria-label="Batch number"
          autoComplete="off"
        />
        <button className="btn btn-tiny btn-primary" type="submit">
          Verify
        </button>
      </form>
      {result !== null &&
        (result.length === 0 ? (
          <div className="sh-pane sh-pane--pad sh-narrow">
            <div className="sh-kicker">Not in the archive</div>
            <p>
              No certificate on file carries that batch number. That is not a verdict on the vial: the archive holds the
              batches recorded during vendor research, not every lot ever sold. Check the vendor&apos;s own COA page, and if
              you have the certificate, <a href="/shop/submit">submit it</a>.
            </p>
          </div>
        ) : (
          <div className="sh-pane sh-pane--table">
            <table className="sh-table">
              <thead>
                <tr>
                  <th scope="col">Batch #</th>
                  <th scope="col">Vendor</th>
                  <th scope="col">Product</th>
                  <th scope="col">Tested</th>
                  <th scope="col">Result</th>
                  <th scope="col">
                    <span className="sr-only">Certificate</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.map((r, i) => (
                  <tr key={`${r.vendorSlug}-${r.batch ?? i}`}>
                    <td>
                      <code>{r.batch}</code>
                    </td>
                    <td>
                      <a href={`/shop/vendors/${r.vendorSlug}`}>{r.vendorName}</a>
                    </td>
                    <td>{r.compoundSlug ? <a href={`/shop/${r.compoundSlug}`}>{compoundNames[r.compoundSlug] ?? r.productName}</a> : r.productName}</td>
                    <td>
                      {r.date ?? "Undated"}
                      {r.lab ? <span className="sh-sub">{r.lab}</span> : null}
                    </td>
                    <td>
                      {r.purity !== null ? `${r.purity}% purity` : "Purity not stated"}
                      {r.netContentMg ? <span className="sh-sub">{r.netContentMg} mg measured</span> : null}
                    </td>
                    <td className="sh-col-actions">
                      {r.pdf && (
                        <a className="btn btn-tiny btn-glass" href={r.pdf} target="_blank" rel="noopener noreferrer nofollow">
                          Open PDF
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </>
  );
}
