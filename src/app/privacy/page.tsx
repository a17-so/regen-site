import Link from "next/link";
import Navbar from "../components/Navbar";

export default function PrivacyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white animate-fade-in">
      <Navbar />

      <div className="w-full max-w-7xl px-6 pb-20 md:px-12">
        <div className="mx-auto w-full max-w-3xl">
          <div className="pt-6 md:pt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#181818] hover:opacity-70 transition-opacity"
            >
              <span aria-hidden="true">←</span>
              back home
            </Link>
          </div>

          <header className="mt-8">
            <h1 className="font-heading text-4xl font-black tracking-tighter text-gradient-primary md:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm font-semibold text-black/60">
              Last updated: January 10, 2026
            </p>
          </header>

          <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-black/75">
            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Overview
              </h2>
              <p>
                This Privacy Policy explains how A17 Labs LLC ("A17 Labs", "we",
                "us") collects, uses, and shares information about you when you
                use our websites, apps, and services (collectively, the
                "Services").
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Information we collect
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <span className="font-semibold text-[#181818]">
                    Usage data
                  </span>
                  : interactions with our Services, device and browser
                  information, approximate location, and diagnostics.
                </li>
                <li>
                  <span className="font-semibold text-[#181818]">
                    Account data
                  </span>
                  : profile details you provide when you create or update an
                  account.
                </li>
                <li>
                  <span className="font-semibold text-[#181818]">
                    Communications
                  </span>
                  : messages you send to us (for example, support requests).
                </li>
                <li>
                  <span className="font-semibold text-[#181818]">Face data</span>
                  : if you upload a selfie in our apps, we process that image to
                  provide AI-powered features such as makeup predictions. We do
                  not collect biometric identifiers or perform facial
                  recognition.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                How we use information
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Provide, maintain, and improve the Services.</li>
                <li>Personalize experiences and develop new features.</li>
                <li>Communicate with you about updates, security, and support.</li>
                <li>
                  Detect, prevent, and respond to fraud, abuse, and security
                  issues.
                </li>
                <li>Comply with legal obligations.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Face data policy
              </h2>
              <p>
                A17 Labs provides features that allow you to upload photos (such
                as selfies) for AI analysis. We are committed to protecting your
                privacy and follow the practices below.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <span className="font-semibold text-[#181818]">
                    Collection and use
                  </span>
                  : we process images you upload to provide the specific
                  analysis or prediction feature you request.
                </li>
                <li>
                  <span className="font-semibold text-[#181818]">
                    Storage and retention
                  </span>
                  : if you choose to save results, we store related data to
                  provide a historical dashboard. This data is purged upon
                  account deletion or after 24 months of account inactivity.
                </li>
                <li>
                  <span className="font-semibold text-[#181818]">
                    Third-party processing (AI providers)
                  </span>
                  : to perform analysis, we securely transmit face data to our
                  third-party cloud AI providers, including{" "}
                  <span className="font-semibold text-[#181818]">OpenAI</span>{" "}
                  and{" "}
                  <span className="font-semibold text-[#181818]">
                    Google (Gemini)
                  </span>
                  .
                </li>
                <li>
                  <span className="font-semibold text-[#181818]">
                    Third-party retention
                  </span>
                  : our agreements with these providers require zero-retention
                  policies for API data. Data is processed ephemerally and not
                  used for model training.
                </li>
                <li>
                  <span className="font-semibold text-[#181818]">
                    No biometrics
                  </span>
                  : we do not create biometric identifiers and do not use face
                  data for identification or authentication.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Sharing
              </h2>
              <p>
                We may share information with vendors and service providers who
                help us operate the Services; when required by law or to protect
                rights and safety; or with your consent. We do not sell your
                personal information.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Data retention
              </h2>
              <p>
                We retain information for as long as necessary to provide the
                Services, comply with legal obligations, and resolve disputes.
                As noted above, specific data types like face data are subject
                to automatic purging after 24 months of account inactivity or
                upon account deletion.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Your choices
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Access, update, or delete certain account information.</li>
                <li>
                  Control communications by adjusting settings or opting out.
                </li>
                <li>Manage cookie and device permissions at the system level.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Children’s privacy
              </h2>
              <p>
                Our Services are not directed to children under 13, and we do
                not knowingly collect personal information from children under
                13.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Changes to this policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                post the updated version on this page with a new effective date.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Contact
              </h2>
              <p>
                Questions or concerns? Visit our{" "}
                <Link
                  href="/support"
                  className="font-semibold text-[#181818] underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  Support
                </Link>{" "}
                page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
