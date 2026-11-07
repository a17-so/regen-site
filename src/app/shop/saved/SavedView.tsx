"use client";

import { clearCart, removeFromCart, useCart, type CartItem } from "../../lib/cart";
import { money } from "../../lib/shop";

/**
 * The saved list, grouped by vendor. REGEN sells nothing, so each group ends
 * in the vendor's own checkout with the code to use there.
 */
export default function SavedView({ vendorUrls }: { vendorUrls: Record<string, string | null> }) {
  const items = useCart();
  if (!items.length) {
    return (
      <div className="sh-pane sh-pane--pad sh-narrow">
        <div className="sh-kicker">Nothing saved yet</div>
        <p>
          Save a pack on any compound page and it lands here, grouped by vendor, with the code to use at that vendor&apos;s
          checkout. Saved in this browser until web sign-in is live.
        </p>
        <a className="btn btn-tiny btn-primary" href="/shop#catalog">
          Browse the catalog
        </a>
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
      <div className="sh-toolbar">
        <span className="sh-count">
          {items.length} pack{items.length === 1 ? "" : "s"} from {groups.size} vendor{groups.size === 1 ? "" : "s"}
        </span>
        <button type="button" className="sh-link-btn" onClick={() => clearCart()}>
          Clear all
        </button>
      </div>
      <div className="sh-pane">
        <ul className="sh-list">
          {[...groups.entries()].map(([vendorSlug, list]) => {
            const v = list[0];
            const store = vendorUrls[vendorSlug] ?? v.vendorUrl;
            const sub = list.filter((i) => i.currency === "USD").reduce((n, i) => n + i.priceUsd, 0);
            return (
              <li key={vendorSlug} className="sh-list-row sh-saved-group">
                <div className="sh-saved-head">
                  <a className="sh-vendor-name" href={`/shop/vendors/${vendorSlug}`}>
                    {v.vendorName}
                  </a>
                  <span className="sh-sub">
                    {v.code ? (
                      <>
                        Code <code>{v.code}</code> at checkout
                      </>
                    ) : (
                      "No code for this vendor"
                    )}
                  </span>
                </div>
                <ul className="sh-saved-items">
                  {list.map((i) => (
                    <li key={i.key}>
                      <a href={`/shop/${i.compoundSlug}`}>{i.compoundName}</a>
                      <span className="sh-sub">{i.label}</span>
                      <span className="sh-col-num">{money(i.priceUsd, i.currency)}</span>
                      <a className="sh-link-btn" href={i.productUrl} target="_blank" rel="noopener noreferrer nofollow sponsored">
                        Open
                      </a>
                      <button type="button" className="sh-link-btn" onClick={() => removeFromCart(i.key)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="sh-saved-foot">
                  <span className="sh-sub">{money(sub)} before shipping and codes</span>
                  {store && (
                    <a className="btn btn-tiny btn-primary" href={store} target="_blank" rel="noopener noreferrer nofollow sponsored">
                      Checkout at {v.vendorName}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
