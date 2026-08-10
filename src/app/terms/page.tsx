import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions · REGEN",
};

const TOC = [
  { id: "agree", label: "01 Agreement" },
  { id: "service", label: "02 The service" },
  { id: "account", label: "03 Your account" },
  { id: "use", label: "04 Acceptable use" },
  { id: "ip", label: "05 IP & content" },
  { id: "ai", label: "06 REGEN AI" },
  { id: "billing", label: "07 Billing" },
  { id: "termination", label: "08 Termination" },
  { id: "warranty", label: "09 No warranty" },
  { id: "liability", label: "10 Liability" },
  { id: "law", label: "11 Governing law" },
  { id: "contact", label: "12 Contact" },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions."
      updated="Last updated May 18th, 2026"
      toc={TOC}
    >
      <h2 id="agree">01 • Agreement to our legal terms</h2>
      <p>
        We are <strong>REGEN Health Inc.</strong> (&ldquo;Company,&rdquo;
        &ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;). We operate the
        mobile application REGEN (the &ldquo;App&rdquo;), as well as any other
        related products and services that refer or link to these legal terms
        (the &ldquo;Legal Terms&rdquo;) (collectively, the
        &ldquo;Services&rdquo;).
      </p>
      <p>
        You can contact us by email at{" "}
        <a href="mailto:hello@regen.app">hello@regen.app</a>, or by mail to
        REGEN Health Inc., 1 Market St, Suite 400, San Francisco, CA 94105,
        United States.
      </p>
      <p>
        These Legal Terms constitute a legally binding agreement between you,
        whether personally or on behalf of an entity (&ldquo;you&rdquo;), and
        REGEN Health Inc., concerning your access to and use of the Services. By
        accessing the Services, you agree that you have read, understood, and
        agreed to be bound by all of these Legal Terms.{" "}
        <strong>
          If you do not agree, you must discontinue use immediately.
        </strong>
      </p>

      <h2 id="service">02 • The service</h2>
      <p>
        REGEN is a tracking, reference, and decision-support tool for adults who
        have already chosen to run peptide or pharmacological protocols. We
        provide software, content, and computational tools. We do not provide
        medical care, prescriptions, or diagnoses. See our{" "}
        <a href="/disclaimer">Non-Medical Disclaimer</a> for the long form.
      </p>

      <h2 id="account">03 • Your account</h2>
      <p>
        You must be at least 18 years old to use REGEN. You are responsible for
        keeping your credentials secure and for all activity under your account.
        If you believe your account has been compromised, write to us
        immediately.
      </p>

      <h2 id="use">04 • Acceptable use</h2>
      <p>
        You agree not to: (a) use the Services for any illegal purpose; (b)
        attempt to reverse engineer, scrape, or interfere with the Services; (c)
        impersonate any person or entity; (d) upload content that is unlawful,
        harmful, or infringes the rights of others; (e) use the Services to
        provide medical care to third parties unless you are a licensed clinician
        operating within your scope of practice.
      </p>

      <h2 id="ip">05 • Intellectual property & content</h2>
      <p>
        The Services, including all software, designs, text, graphics, and
        logos, are owned by REGEN Health Inc. and protected by copyright,
        trademark, and other laws. You retain ownership of the content you upload
        (protocol logs, biomarkers, photos). By uploading content, you grant us a
        limited, non-exclusive license to process it for the purpose of operating
        the Services for you.
      </p>

      <h2 id="ai">06 • REGEN AI</h2>
      <p>
        REGEN AI generates responses based on the inputs you provide and on
        peer-reviewed literature in our reference corpus. Its outputs are{" "}
        <strong>informational, not medical advice</strong>. Always confirm with a
        qualified healthcare provider before acting on any AI-generated response.
        We are not liable for decisions you make based on AI output.
      </p>

      <h2 id="billing">07 • Billing & subscriptions</h2>
      <p>
        REGEN Pro is a paid subscription. Charges are processed by the App Store
        or Google Play and are subject to their billing terms. Subscriptions
        renew automatically unless cancelled at least 24 hours before the end of
        the current period. Refund requests are handled by the store you
        purchased through.
      </p>

      <h2 id="termination">08 • Termination</h2>
      <p>
        We may suspend or terminate your access at any time for breach of these
        Terms, for legal reasons, or to protect the integrity of the Services.
        You may terminate by deleting your account in-app. Provisions intended to
        survive termination (IP, liability, governing law) survive.
      </p>

      <h2 id="warranty">09 • Disclaimer of warranties</h2>
      <p>
        THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
        AVAILABLE.&rdquo; TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL
        WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A
        PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE
        SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR MEDICALLY ACCURATE.
      </p>

      <h2 id="liability">10 • Limitation of liability</h2>
      <p>
        TO THE FULLEST EXTENT PERMITTED BY LAW, REGEN HEALTH INC. SHALL NOT BE
        LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
        DAMAGES, OR FOR ANY LOSS OF PROFITS, DATA, OR HEALTH OUTCOMES ARISING
        FROM OR RELATED TO YOUR USE OF THE SERVICES. OUR TOTAL LIABILITY SHALL
        NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.
      </p>

      <h2 id="law">11 • Governing law & disputes</h2>
      <p>
        These Terms are governed by the laws of the State of Delaware, United
        States, without regard to its conflict-of-law principles. Disputes shall
        be resolved by binding arbitration in San Francisco, California, under
        the rules of the American Arbitration Association, except either party
        may seek injunctive relief in a court of competent jurisdiction.
      </p>

      <h2 id="contact">12 • Contact</h2>
      <p>
        Questions about these Terms? Write to{" "}
        <a href="mailto:legal@regen.app">legal@regen.app</a>.
      </p>
    </LegalPage>
  );
}
