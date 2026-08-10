import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy · REGEN",
};

const TOC = [
  { id: "intro", label: "01 Intro" },
  { id: "collect", label: "02 What we collect" },
  { id: "use", label: "03 How we use it" },
  { id: "share", label: "04 Sharing" },
  { id: "storage", label: "05 Storage & security" },
  { id: "rights", label: "06 Your rights" },
  { id: "children", label: "07 Children" },
  { id: "changes", label: "08 Changes" },
  { id: "contact", label: "09 Contact" },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy."
      updated="Last updated May 18th, 2026"
      toc={TOC}
    >
      <h2 id="intro">01 • Our position on your data</h2>
      <p>
        REGEN tracks the most sensitive data a person can record about
        themselves, dose logs, biomarkers, photos of their own body. We treat
        it accordingly. This page explains, in plain language, what we collect
        and what we do not. If anything here is unclear, write to us.
      </p>
      <p>
        <strong>The short version:</strong> we collect the minimum needed to run
        the app, we encrypt it end-to-end, we never sell it, and you can delete
        it at any time.
      </p>

      <h2 id="collect">02 • What we collect</h2>
      <p>To operate REGEN we collect:</p>
      <ul>
        <li><strong>Account data</strong>: email, password hash, sign-up date.</li>
        <li><strong>Protocol data</strong>: the peptides you&apos;ve added, doses you&apos;ve logged, schedules you&apos;ve set.</li>
        <li><strong>Biomarker data</strong>: values you enter manually (testosterone, lipids, glucose, etc.) or import from a connected lab.</li>
        <li><strong>App telemetry</strong>: anonymized crash reports and feature-usage counts. No identifiers, no tracking pixels.</li>
      </ul>
      <p>
        We do not collect contacts, location, advertising IDs, or third-party
        social graphs.
      </p>

      <h2 id="use">03 • How we use it</h2>
      <p>
        Your data is used to make REGEN function: render your dashboard, fire
        your reminders, run the AI assistant, generate trends. That&apos;s it. We
        do not use your data to train shared models. We do not use your data for
        advertising. We do not sell or rent your data to anyone.
      </p>

      <h2 id="share">04 • Sharing</h2>
      <p>
        We share data only when you ask us to (e.g. exporting a read-only
        protocol link for your coach) or when required by law. Where we use
        vendors (cloud hosting, email delivery) they are bound by data-processing
        agreements and have access only to the minimum required to perform their
        function.
      </p>

      <h2 id="storage">05 • Storage & security</h2>
      <p>
        Protocol and biomarker data is encrypted at rest with AES-256 and in
        transit with TLS 1.3. Cloud sync uses zero-knowledge envelope encryption
       , the keys live on your device, not on our servers. We could not decrypt
        your data even if compelled.
      </p>
      <p>
        Photos and notes never leave your device unless you explicitly opt into
        cloud backup.
      </p>

      <h2 id="rights">06 • Your rights</h2>
      <p>You can, at any time, from inside the app:</p>
      <ul>
        <li>Export your full data set as JSON or CSV.</li>
        <li>Delete your account and erase every record we hold.</li>
        <li>Withdraw consent for telemetry.</li>
        <li>Request a copy of any data tied to your account.</li>
      </ul>
      <p>
        Residents of the EU, UK, California, and other jurisdictions with
        applicable privacy laws have the rights granted under those laws (GDPR,
        UK-GDPR, CCPA, etc.). Email{" "}
        <a href="mailto:privacy@regen.app">privacy@regen.app</a> and we will
        respond within 30 days.
      </p>

      <h2 id="children">07 • Children</h2>
      <p>
        REGEN is for adults. We do not knowingly collect data from anyone under
        18. If you believe a minor has registered for an account, write to us and
        we will remove it.
      </p>

      <h2 id="changes">08 • Changes</h2>
      <p>
        If we materially change this policy we will notify you in-app and by
        email at least 30 days before the change takes effect. The current
        version date is at the top of this page.
      </p>

      <h2 id="contact">09 • Contact</h2>
      <p>
        Questions, deletion requests, or anything else, write to{" "}
        <a href="mailto:privacy@regen.app">privacy@regen.app</a>. We read every
        message.
      </p>
    </LegalPage>
  );
}
