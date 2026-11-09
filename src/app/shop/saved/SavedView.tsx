"use client";

import { clearCart, removeFromCart, useCart, type CartItem } from "../../lib/cart";
import { money } from "../../lib/shop";
import HandoffLink from "../HandoffLink";

/**
 * The saved list, in the shop's sheet anatomy: one pane, one section per
 * vendor (its name, the code for its checkout), a hairline row per pack
 * (compound, pack, price, open, remove), and the vendor's checkout at the
 * foot. Empty, it says so and nothing more. The list lives in this
 * browser; there are no accounts.
 */
export default function SavedView({ vendorUrls }: { vendorUrls: Record<string, string | null> }) {
  const items = useCart();
  if (!items.length) {
    return (
      <div className="sh-pane sh-empty-state sh-empty-state--bare">
        <h2>Nothing saved yet</h2>
      </div>
    );
  }
  const groups = new Map<string, CartItem[]>();
  for (const it of items) {
    if (!groups.has(it.vendorSlug)) groups.set(it.vendorSlug, []);
    groups.get(it.vendorSlug)!.push(it);
  }
  return (
    <>
      <div className="sh-sizes">
        <span className="sh-count">
          {items.length} pack{items.length === 1 ? "" : "s"} from {groups.size} vendor{groups.size === 1 ? "" : "s"}
          {" · Saved in this browser"}
        </span>
        <div className="sh-sizes-end">
          <button type="button" className="sh-clear" onClick={() => clearCart()}>
            Clear all
          </button>
        </div>
      </div>
      <div className="sh-pane sh-sheet">
        {[...groups.entries()].map(([vendorSlug, list]) => {
          const v = list[0];
          const store = vendorUrls[vendorSlug] ?? v.vendorUrl;
          const usd = list.filter((i) => i.currency === "USD");
          const sub = usd.reduce((n, i) => n + i.priceUsd * (i.qty || 1), 0);
          return (
            <section key={vendorSlug} className="sh-sheet-sec">
              <div className="sh-sheet-head">
                <h2>
                  <a className="sh-vendor-name sh-saved-vendor" href={`/shop/vendors/${vendorSlug}`}>
                    {v.vendorName}
                  </a>
                </h2>
                <span className="sh-sheet-note">{v.code ? `Use code ${v.code} at checkout` : "No code at this store"}</span>
              </div>
              <ul className="sh-saved-rows">
                {list.map((i) => (
                  <li key={i.key}>
                    <span className="sh-saved-main">
                      <a className="sh-vendor-name" href={`/shop/${i.compoundSlug}`}>
                        {i.compoundName}
                      </a>
                      <span>{i.label}</span>
                    </span>
                    <strong className="sh-saved-price">{money(i.priceUsd, i.currency)}</strong>
                    <span className="sh-offer-actions">
                      <button type="button" className="sh-icon-btn" aria-label={`Remove ${i.compoundName} from Saved`} title="Remove" onClick={() => removeFromCart(i.key)}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                          <path d="M4 4l8 8M12 4l-8 8" />
                        </svg>
                      </button>
                      <HandoffLink
                        className="sh-icon-btn sh-icon-btn--go"
                        handoff={{
                          vendorSlug: i.vendorSlug,
                          vendorName: i.vendorName,
                          url: i.productUrl,
                          compoundSlug: i.compoundSlug,
                          compoundName: i.compoundName,
                          label: i.label,
                          priceUsd: i.priceUsd,
                          currency: i.currency,
                          code: i.code,
                          from: "saved",
                        }}
                        aria-label={`Open ${i.compoundName} at ${i.vendorName}`}
                        title={`Open at ${i.vendorName}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                          <path d="M4.5 11.5l7-7M5.5 4.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </HandoffLink>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="sh-saved-foot">
                <span className="sh-sheet-note">{usd.length ? `${money(sub)} before shipping and the code` : "Priced in the store's currency"}</span>
                {store && (
                  <HandoffLink
                    className="btn btn-glass btn-tiny"
                    handoff={{ vendorSlug, vendorName: v.vendorName, url: store, code: v.code, from: "saved" }}
                  >
                    Check out at {v.vendorName}
                  </HandoffLink>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
