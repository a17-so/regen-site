import Link from "next/link";
import Navbar from "../components/Navbar";

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="mt-3 text-sm font-semibold text-black/60">
              Effective: August 25, 2025
            </p>
          </header>

          <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-black/75">
            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Agreement to terms
              </h2>
              <p>
                These Terms of Service ("Terms") govern your access to and use
                of the websites, apps, and services provided by A17 Labs LLC
                ("A17 Labs", "we", "us"). By accessing or using our Services,
                you agree to be bound by these Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Use of the Services
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>You must comply with all applicable laws and regulations.</li>
                <li>
                  You may not misuse the Services, interfere with their
                  operation, or access them using methods other than our
                  provided interfaces.
                </li>
                <li>
                  We may modify, suspend, or discontinue the Services at any
                  time.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Accounts
              </h2>
              <p>
                You are responsible for the activity on your account and for
                maintaining the security of your login credentials. Notify us
                immediately of any unauthorized use.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Content and intellectual property
              </h2>
              <p>
                The Services and their original content, features, and
                functionality are and will remain the exclusive property of A17
                Labs LLC and its licensors. All trademarks, logos, and service
                marks are the property of their respective owners.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Prohibited conduct
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Reverse engineering, scraping, or bypassing access controls.</li>
                <li>Uploading malicious code or interfering with network operations.</li>
                <li>Violating others&apos; rights or applicable laws.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Disclaimers
              </h2>
              <p>
                The Services are provided "as is" without warranties of any
                kind, either express or implied. To the maximum extent
                permitted by law, we disclaim all warranties, including implied
                warranties of merchantability, fitness for a particular
                purpose, and non-infringement.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Limitation of liability
              </h2>
              <p>
                To the fullest extent permitted by law, A17 Labs LLC and its
                affiliates will not be liable for any indirect, incidental,
                special, consequential, or punitive damages, or any loss of
                profits or revenues.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Termination
              </h2>
              <p>
                We may suspend or terminate your access to the Services at any
                time, with or without cause or notice.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Governing law
              </h2>
              <p>
                These Terms are governed by the laws of the State of Delaware,
                without regard to its conflict of law principles.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Changes
              </h2>
              <p>
                We may update these Terms from time to time. Continued use of
                the Services after changes become effective constitutes your
                acceptance of the revised Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-[#181818]">
                Contact
              </h2>
              <p>
                Questions? Visit our{" "}
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
