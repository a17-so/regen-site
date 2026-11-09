"use client";

import { useSyncExternalStore } from "react";

/**
 * The cart, as a saved list. REGEN is an aggregator: nothing is bought here,
 * so the cart holds the packs a reader picked across vendors and sends them
 * to each vendor's own checkout with the discount code. Stored per browser
 * in localStorage for now; once sign-in lands it mirrors to the account so
 * the app's Shop tab sees the same list.
 */
export interface CartItem {
  key: string;
  compoundSlug: string;
  compoundName: string;
  vendorSlug: string;
  vendorName: string;
  vendorUrl: string | null;
  productUrl: string;
  label: string;
  priceUsd: number;
  currency: "USD" | "AUD";
  code: string | null;
  qty: number;
}

const KEY = "regen.cart.v1";
const listeners = new Set<() => void>();
let cache: CartItem[] | null = null;

function read(): CartItem[] {
  if (cache) return cache;
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
    cache = raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(items: CartItem[]) {
  cache = items;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Private mode or blocked storage: the in-memory list still works for
    // the session.
  }
  for (const l of listeners) l();
}

const EMPTY: CartItem[] = [];

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function itemKey(i: Pick<CartItem, "vendorSlug" | "productUrl" | "label" | "priceUsd">): string {
  return `${i.vendorSlug}|${i.productUrl}|${i.label}|${i.priceUsd}`;
}

export function addToCart(item: Omit<CartItem, "key" | "qty">, qty = 1) {
  const key = itemKey(item);
  const items = read().slice();
  const i = items.findIndex((x) => x.key === key);
  if (i === -1) items.push({ ...item, key, qty });
  else items[i] = { ...items[i], qty: items[i].qty + qty };
  write(items);
}

export function setQty(key: string, qty: number) {
  const items = read()
    .map((x) => (x.key === key ? { ...x, qty } : x))
    .filter((x) => x.qty > 0);
  write(items);
}

export function removeFromCart(key: string) {
  write(read().filter((x) => x.key !== key));
}

export function clearCart() {
  write([]);
}

/** Replace the whole list (the account sync applying the account's copy). */
export function replaceCart(items: CartItem[]) {
  write(items);
}

/** The current list, outside React. */
export function cartSnapshot(): CartItem[] {
  return read();
}

/** Subscribe outside React (the account sync watches local changes). */
export function onCartChange(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((n, x) => n + x.qty, 0);
}
