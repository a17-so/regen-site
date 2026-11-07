"use client";

/**
 * Firebase on the web, the SAME project as the iOS app (`regen-health-app`,
 * Firestore database `regen`), so a reader who signs in here with the Google
 * or Apple account they use in the app gets the same UID and sees their own
 * stack. Google and Apple only, matching the app's providers.
 *
 * Config comes from NEXT_PUBLIC_FIREBASE_* (see .env.example). Until the Web
 * app is registered in the Firebase console and those are set, `firebaseApp()`
 * returns null and every auth surface shows its "not open yet" state instead
 * of throwing.
 */
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "regen-health-app",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const FIREBASE_DATABASE_ID = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID ?? "regen";

export function firebaseConfigured(): boolean {
  return Boolean(CONFIG.apiKey && CONFIG.authDomain && CONFIG.appId);
}

export function firebaseApp(): FirebaseApp | null {
  if (!firebaseConfigured()) return null;
  return getApps()[0] ?? initializeApp(CONFIG);
}

export function firebaseAuth(): Auth | null {
  const app = firebaseApp();
  return app ? getAuth(app) : null;
}

export function firestore(): Firestore | null {
  const app = firebaseApp();
  return app ? getFirestore(app, FIREBASE_DATABASE_ID) : null;
}
