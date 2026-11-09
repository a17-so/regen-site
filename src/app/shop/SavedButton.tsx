"use client";

import { cartCount, useCart } from "../lib/cart";

/** The saved list, at the end of the tab bar. Count from local storage. */
export default function SavedButton({ active }: { active?: boolean }) {
  const n = cartCount(useCart());
  return (
    <a href="/shop/saved" className="pg-tabs-saved" aria-current={active ? "page" : undefined}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M4 2.5h8v11l-4-2.6-4 2.6z" strokeLinejoin="round" />
      </svg>
      Saved
      {n > 0 && <span className="pg-tab-n">{n}</span>}
    </a>
  );
}
