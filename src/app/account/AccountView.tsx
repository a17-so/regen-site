"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { signInWithApple, signInWithGoogle, signOut, useAuth } from "../lib/auth";
import { firestore } from "../lib/firebase";
import { useCart, cartCount } from "../lib/cart";
import { AppleIcon } from "../components/icons";

interface StackItem {
  id: string;
  peptideSlug: string;
  peptideName: string;
  targetDose: number | null;
  unit: string | null;
  frequency: string | null;
  status: string;
}

const FREQ: Record<string, string> = {
  daily: "daily",
  every_other_day: "every other day",
  once_a_week: "once a week",
  "2x_week": "twice a week",
  "2x_day": "twice a day",
  every_n_days: "every few days",
  weekdays: "on set days",
};

/**
 * The account page: sign in with the account used in the app, see the
 * stack the app holds (users/{uid}/inventory), and jump from each compound
 * to its vendors. Reads only; the app stays the writer of the plan.
 */
export default function AccountView({ shopSlugs }: { shopSlugs: Record<string, string> }) {
  const auth = useAuth();
  const cart = useCart();
  const [stack, setStack] = useState<StackItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (auth.status !== "in") {
      setStack(null);
      return;
    }
    const db = firestore();
    if (!db) return;
    let cancelled = false;
    getDocs(collection(db, "users", auth.user.uid, "inventory"))
      .then((snap) => {
        if (cancelled) return;
        const rows: StackItem[] = snap.docs.map((d) => {
          const x = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            peptideSlug: String(x.peptideSlug ?? ""),
            peptideName: String(x.peptideName ?? x.peptideSlug ?? "Compound"),
            targetDose: typeof x.targetDose === "number" ? x.targetDose : null,
            unit: typeof x.unit === "string" ? x.unit : null,
            frequency: typeof x.frequency === "string" ? x.frequency : null,
            status: typeof x.status === "string" ? x.status : "active",
          };
        });
        setStack(rows.filter((r) => r.status !== "archived"));
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Could not load your stack."));
    return () => {
      cancelled = true;
    };
  }, [auth]);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  if (auth.status === "unconfigured") {
    return (
      <div className="lib-facts-pane ac-pane">
        <h2>Sign-in opens soon</h2>
        <p>
          Accounts on the web use the same Google or Apple login as the app, so your stack and your cart follow you.
          The web login is being connected to the app&apos;s project; until then the cart stays on this device.
        </p>
        <p className="ac-cart-note">
          {cartCount(cart)} item{cartCount(cart) === 1 ? "" : "s"} saved in this browser. <a href="/shop/cart">Open the cart</a>.
        </p>
      </div>
    );
  }

  if (auth.status === "loading") return <p className="ac-muted">Checking your session.</p>;

  if (auth.status === "out") {
    return (
      <div className="lib-facts-pane ac-pane">
        <h2>Sign in</h2>
        <p>Use the account you use in the REGEN app. Google and Apple only, the same as the app.</p>
        <div className="ac-buttons">
          <button className="btn btn-sm btn-primary" type="button" disabled={busy} onClick={() => run(signInWithGoogle)}>
            Continue with Google
          </button>
          <button className="btn btn-sm btn-glass" type="button" disabled={busy} onClick={() => run(signInWithApple)}>
            <AppleIcon size={16} /> Continue with Apple
          </button>
        </div>
        {error && <p className="sh-form-error">{error}</p>}
      </div>
    );
  }

  const u = auth.user;
  return (
    <div className="ac-grid">
      <div className="lib-facts-pane ac-pane">
        <div className="ac-who">
          {u.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={u.photoURL} alt="" width={44} height={44} referrerPolicy="no-referrer" />
          ) : (
            <span className="sc-avatar">{(u.displayName ?? u.email ?? "?").slice(0, 1)}</span>
          )}
          <div>
            <strong>{u.displayName ?? "REGEN member"}</strong>
            <span>{u.email ?? "Apple private relay"}</span>
          </div>
        </div>
        <button className="btn btn-sm btn-glass" type="button" onClick={() => run(signOut)}>
          Sign out
        </button>
      </div>

      <section className="ac-stack" aria-labelledby="stack-h">
        <h2 id="stack-h">Your stack</h2>
        {error && <p className="sh-form-error">{error}</p>}
        {stack === null && !error && <p className="ac-muted">Loading from the app.</p>}
        {stack && stack.length === 0 && (
          <p className="ac-muted">Nothing in the app yet. Add a compound there and it shows here, with its vendors one tap away.</p>
        )}
        {stack && stack.length > 0 && (
          <ul className="sh-rows">
            {stack.map((s) => {
              const shop = shopSlugs[s.peptideSlug];
              return (
                <li key={s.id} className="lib-card ac-item">
                  <div>
                    <strong>{s.peptideName}</strong>
                    <span className="ac-item-sub">
                      {s.targetDose !== null ? `${s.targetDose} ${s.unit ?? ""}` : "Dose not set"}
                      {s.frequency ? ` · ${FREQ[s.frequency] ?? s.frequency}` : ""}
                      {s.status !== "active" ? ` · ${s.status}` : ""}
                    </span>
                  </div>
                  {shop ? (
                    <a className="btn btn-sm btn-primary" href={`/shop/${shop}`}>
                      Compare vendors
                    </a>
                  ) : (
                    <span className="ac-muted">Not in the shop yet</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="ac-cart" aria-labelledby="cart-h">
        <h2 id="cart-h">Cart</h2>
        <p className="ac-muted">
          {cartCount(cart)} item{cartCount(cart) === 1 ? "" : "s"} saved. <a href="/shop/cart">Open the cart</a>.
        </p>
      </section>
    </div>
  );
}
