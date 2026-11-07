"use client";

import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { firebaseAuth, firebaseConfigured } from "./firebase";

export type AuthState = { status: "unconfigured" } | { status: "loading" } | { status: "out" } | { status: "in"; user: User };

/** Auth state for client components. "unconfigured" until the Web app exists. */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>(() => (firebaseConfigured() ? { status: "loading" } : { status: "unconfigured" }));
  useEffect(() => {
    const auth = firebaseAuth();
    if (!auth) return;
    return onAuthStateChanged(auth, (user) => setState(user ? { status: "in", user } : { status: "out" }));
  }, []);
  return state;
}

export async function signInWithGoogle(): Promise<void> {
  const auth = firebaseAuth();
  if (!auth) throw new Error("Sign-in is not open yet.");
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await signInWithPopup(auth, provider);
}

export async function signInWithApple(): Promise<void> {
  const auth = firebaseAuth();
  if (!auth) throw new Error("Sign-in is not open yet.");
  const provider = new OAuthProvider("apple.com");
  provider.addScope("email");
  provider.addScope("name");
  await signInWithPopup(auth, provider);
}

export async function signOut(): Promise<void> {
  const auth = firebaseAuth();
  if (auth) await fbSignOut(auth);
}
