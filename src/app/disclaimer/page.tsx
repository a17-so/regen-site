import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Non-Medical Disclaimer · REGEN",
};

const TOC = [
  { id: "read", label: "01 Read this first" },
  { id: "not-medical", label: "02 Not medical advice" },
  { id: "device", label: "03 Not a medical device" },
  { id: "accuracy", label: "04 Accuracy" },
  { id: "ai", label: "05 AI outputs" },
  { id: "clinician", label: "06 Talk to a clinician" },
  { id: "emergencies", label: "07 Emergencies" },
  { id: "risk", label: "08 Your own risk" },
  { id: "contact", label: "09 Contact" },
];

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Non-Medical Disclaimer."
      updated="Last updated May 18th, 2026"
      toc={TOC}
    >
      <h2 id="read">01 • Read this first</h2>
      <p>
        REGEN is a personal tracking and reference tool for adults who have
        already, on their own initiative and in consultation with their own
        healthcare providers, decided to run a peptide or pharmacological
        protocol. We do not prescribe, recommend, diagnose, or treat anything.
        This disclaimer is the most important page on our site. Read it
        carefully.
      </p>

      <h2 id="not-medical">02 • REGEN is not medical advice</h2>
      <p>
        Nothing in REGEN, including the app, the dashboards, the AI assistant,
        the calculators, the biomarker reference ranges, the dose schedules, the
        photo recognition, this website, or any communication from our team,
        constitutes medical advice, diagnosis, prescription, or treatment of any
        condition.
      </p>
      <p>
        We are not your doctor. We are not anyone&apos;s doctor. We are a
        software company.
      </p>

      <h2 id="device">03 • Not a medical device</h2>
      <p>
        REGEN is not registered as a medical device with the U.S. Food and Drug
        Administration, the European Medicines Agency, or any other regulatory
        body. Its outputs are informational and educational. They have not been
        evaluated to diagnose, cure, mitigate, treat, or prevent any disease.
      </p>

      <h2 id="accuracy">04 • Accuracy is not guaranteed</h2>
      <p>
        We work hard to keep the reference data, peptide profiles, half-lives,
        and reconstitution math accurate. We are humans writing software, and we
        make mistakes. Always cross-check any number that matters against the
        original source (cited in-app), against the label on your vial, and
        against a qualified healthcare provider.
      </p>

      <h2 id="ai">05 • REGEN AI outputs</h2>
      <p>
        The AI assistant in REGEN generates text based on inputs you provide and
        on a reference corpus of peer-reviewed literature. It can be wrong. It
        can be confidently wrong. It can cite a real paper while drawing a
        conclusion the paper does not support. Treat every AI response as a
        starting point for further verification, never as a final answer.
      </p>

      <h2 id="clinician">06 • Talk to a clinician</h2>
      <p>
        Before starting, stopping, or changing any peptide, supplement,
        medication, dose, or protocol, consult a licensed healthcare provider who
        knows your individual medical history. This is especially important if
        you are pregnant, nursing, taking other medications, or have any chronic
        condition.
      </p>

      <h2 id="emergencies">07 • Emergencies</h2>
      <p>
        If you are experiencing a medical emergency, including but not limited
        to severe injection-site reactions, allergic reactions, breathing
        difficulty, chest pain, or thoughts of self-harm, stop using the app and
        call your local emergency number immediately (911 in the US, 112 in the
        EU, 999 in the UK).
      </p>

      <h2 id="risk">08 • Use at your own risk</h2>
      <p>
        You assume all responsibility for any decision you make on the basis of
        information accessed through REGEN. You agree that REGEN Health Inc., its
        officers, employees, contributors, and affiliates are not liable for any
        adverse outcome, physical, psychological, financial, or otherwise,
        arising from your use of the Services.
      </p>

      <h2 id="contact">09 • Questions</h2>
      <p>
        If anything on this page is unclear, write to{" "}
        <a href="mailto:hello@regen.app">hello@regen.app</a> before you act. We
        would rather have a conversation than be misunderstood.
      </p>
    </LegalPage>
  );
}
