import type { PostMeta } from "./types";
import PostCta from "../PostCta";

function Content() {
  return (
    <>
      <h2 id="what-a-glp-1-tracker-records"><span className="lib-ch-num" aria-hidden="true">01</span>What a GLP-1 tracker app records</h2>
      <p>A GLP-1 tracker app is a log for people taking medicines such as semaglutide, tirzepatide or liraglutide. At minimum it records each injection with its date and time, so gaps and delays are visible instead of half-remembered. The <a href="/library/semaglutide">REGEN semaglutide library page</a> and <a href="/library/tirzepatide">tirzepatide library page</a> summarize the published research on each medicine.</p>
      <p>The more useful trackers also put weight, notes and lab results on the same timeline as the doses. In REGEN, each logged dose goes into a dose log on one timeline with its timing window, and a missed dose is logged as skipped rather than silently disappearing.</p>

      <figure className="post-figure">
        <img src="/blog-charts/glp-1-tracker-app.png" alt="One-year discontinuation was 64.8% without type 2 diabetes and 46.5% with type 2 diabetes among 125,474 US adults starting GLP-1 medicines (Rodriguez 2025)" loading="lazy" />
        <figcaption>One-year discontinuation was 64.8% without type 2 diabetes and 46.5% with type 2 diabetes among 125,474 US adults starting GLP-1 medicines (Rodriguez 2025) · Source: REGEN analysis of the cited studies</figcaption>
      </figure>

      <h2 id="how-often-people-stop"><span className="lib-ch-num" aria-hidden="true">02</span>How often people stop GLP-1 medicines</h2>
      <p>A 2025 study of US health records followed 125,474 adults with overweight or obesity who newly started liraglutide, semaglutide or tirzepatide between 2018 and 2023. <a href="https://pubmed.ncbi.nlm.nih.gov/39888616/" target="_blank" rel="noopener noreferrer">One-year discontinuation was 64.8% for patients without type 2 diabetes</a> and 46.5% for patients with type 2 diabetes.</p>
      <p>In the same study, higher weight loss was associated with lower discontinuation, while <a href="https://pubmed.ncbi.nlm.nih.gov/39888616/" target="_blank" rel="noopener noreferrer">moderate or severe gastrointestinal adverse events were associated with a higher hazard of discontinuation</a>. It is an observational study, so it shows associations, not causes.</p>

      <h2 id="side-effects-over-time"><span className="lib-ch-num" aria-hidden="true">03</span>Recording side effects over time</h2>
      <p>Digestive side effects are the most commonly reported ones in the trials. In STEP 1, a 68-week trial of 1961 adults without diabetes, nausea and diarrhea were the most common adverse events with semaglutide; they were <a href="https://pubmed.ncbi.nlm.nih.gov/33567185/" target="_blank" rel="noopener noreferrer">typically transient and mild-to-moderate in severity and subsided with time</a>.</p>
      <p>A dated record makes that kind of pattern easier to describe accurately: when a symptom started, how long it lasted, and which injection it followed. REGEN puts Apple Health data and manual entries on one timeline with the dose log, so those details sit next to the doses they followed.</p>

      <PostCta variant="labs" />

      <h2 id="when-treatment-stopped"><span className="lib-ch-num" aria-hidden="true">04</span>What the trials found when treatment stopped</h2>
      <p>STEP 4 looked at what happened after a switch to placebo. In that trial, 803 adults who completed a 20-week run-in on once-weekly semaglutide were randomized to continue it or switch to placebo for 48 weeks. From week 20 to week 68, mean body weight change was <a href="https://pubmed.ncbi.nlm.nih.gov/33755728/" target="_blank" rel="noopener noreferrer">-7.9% with continued semaglutide vs +6.9% after the switch to placebo</a>.</p>
      <p>In the STEP 1 extension, 327 participants were followed for a year after semaglutide and the lifestyle program were withdrawn. They <a href="https://pubmed.ncbi.nlm.nih.gov/35441470/" target="_blank" rel="noopener noreferrer">regained two-thirds of their prior weight loss</a>, and cardiometabolic improvements reverted towards baseline for most variables. Each trial describes its own population, and neither tested a tracking app.</p>

      <h2 id="lab-results-on-one-timeline"><span className="lib-ch-num" aria-hidden="true">05</span>Lab results on the same timeline</h2>
      <p>Many people taking GLP-1 medicines get repeat bloodwork, and one result rarely says much on its own. A 2011 paper explains that reference change values provide <a href="https://pubmed.ncbi.nlm.nih.gov/21958344/" target="_blank" rel="noopener noreferrer">objective tools for assessment of the significance of differences in serial results</a> from an individual, combining lab imprecision with normal biological variation.</p>
      <p>REGEN lets you upload a lab PDF, enter results by hand or sync from Apple Health, then shows each biomarker as a trend line against its reference range and flags what moved. The <a href="/faq">REGEN FAQ</a> covers what the app does and how data is handled.</p>

      <PostCta variant="ai" />

      <h2 id="research-on-tracking-apps"><span className="lib-ch-num" aria-hidden="true">06</span>What research says about tracking apps</h2>
      <p>No published trials have tested GLP-1 tracker apps specifically, but medication tracking apps have been studied. A 2025 systematic review of 14 randomized trials of apps in chronic conditions such as hypertension and Parkinson disease found that <a href="https://pubmed.ncbi.nlm.nih.gov/40743450/" target="_blank" rel="noopener noreferrer">all 14 studies reported that app interventions improved medication adherence</a>, and 10 showed a statistically significant improvement.</p>
      <p>Those trials covered prescribed medicines for other conditions, so they do not show what a GLP-1 tracker does on its own. Next to the log, the REGEN Library grades the evidence for each compound, and Regen AI answers questions with cited sources: one cited source instead of forty tabs.</p>

      <div className="lib-faq">
        <h2 id="faq">Frequently asked questions</h2>
        <details>
          <summary>What is a GLP-1 tracker app?</summary>
          <p>It is an app for recording GLP-1 medicine injections with their dates and times, often alongside weight, notes and lab results. REGEN combines a dose log, bloodwork trends and research summaries with evidence grades in one app.</p>
        </details>
        <details>
          <summary>What does a good GLP-1 tracker app record?</summary>
          <p>Each injection with its date and time, missed doses, and lab results shown as trends against reference ranges. A 2011 paper explains that judging change between serial lab results needs reference change values.</p>
        </details>
        <details>
          <summary>How common is it to stop GLP-1 medicines?</summary>
          <p>In a 2025 study of 125,474 US adults who started liraglutide, semaglutide or tirzepatide, one-year discontinuation was 64.8% for those without type 2 diabetes and 46.5% for those with it.</p>
        </details>
        <details>
          <summary>Do medication tracking apps improve adherence?</summary>
          <p>In studies of prescribed medicines for other conditions, often yes. A 2025 review of 14 randomized trials found all 14 reported improved adherence, and 10 were statistically significant. No trials have tested GLP-1 trackers specifically.</p>
        </details>
      </div>
</>
  );
}

const post: PostMeta = {
  title: "GLP-1 Tracker App: What to Look For",
  category: "Science",
  date: "Nov 2, 2026",
  readTime: "4 min read",
  cover: "/blog/glp-1-tracker-app/cover",
  lead: "A GLP-1 tracker app records each injection, when it happened and what followed, with lab results on the same timeline. That record matters because in a 2025 study of 125,474 US adults starting GLP-1 medicines, 64.8% of those without type 2 diabetes had stopped within a year.",
  stat: { value: "64.8%", label: "of US adults without type 2 diabetes stopped their GLP-1 medicine within a year (2025 study)" },
  description: "What to look for in a GLP-1 tracker app: injection logs, side effect notes and lab trends, plus what research shows about stopping treatment.",
  datePublished: "2026-11-02",
  dateModified: "2026-11-02",
  author: { initials: "EM", name: "Ekam Mehat", role: "REGEN Editorial" },
  toc: [
    { id: "what-a-glp-1-tracker-records", label: "What a GLP-1 tracker app records" },
    { id: "how-often-people-stop", label: "How often people stop GLP-1 medicines" },
    { id: "side-effects-over-time", label: "Recording side effects over time" },
    { id: "when-treatment-stopped", label: "What the trials found when treatment stopped" },
    { id: "lab-results-on-one-timeline", label: "Lab results on the same timeline" },
    { id: "research-on-tracking-apps", label: "What research says about tracking apps" }
  ],
  faq: [
    { q: "What is a GLP-1 tracker app?", a: "It is an app for recording GLP-1 medicine injections with their dates and times, often alongside weight, notes and lab results. REGEN combines a dose log, bloodwork trends and research summaries with evidence grades in one app." },
    { q: "What does a good GLP-1 tracker app record?", a: "Each injection with its date and time, missed doses, and lab results shown as trends against reference ranges. A 2011 paper explains that judging change between serial lab results needs reference change values." },
    { q: "How common is it to stop GLP-1 medicines?", a: "In a 2025 study of 125,474 US adults who started liraglutide, semaglutide or tirzepatide, one-year discontinuation was 64.8% for those without type 2 diabetes and 46.5% for those with it." },
    { q: "Do medication tracking apps improve adherence?", a: "In studies of prescribed medicines for other conditions, often yes. A 2025 review of 14 randomized trials found all 14 reported improved adherence, and 10 were statistically significant. No trials have tested GLP-1 trackers specifically." }
  ],
  Content,
};

export default post;
