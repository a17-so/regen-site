import type { PostMeta } from "./types";
import PostCta from "../PostCta";

function Content() {
  return (
    <>
      <h2 id="evaluating-claims">01  -  Evaluating digital health app claims</h2>
      <p>Evaluating health software starts with whether clinical claims are backed by peer-reviewed literature. In an <a href="https://pubmed.ncbi.nlm.nih.gov/31304366/" target="_blank" rel="noopener noreferrer">evaluation of 73 top-ranking consumer mental health apps</a>, 64% claimed effectiveness at diagnosing a condition or improving symptoms, mood or self-management; scientific language appeared in 44% of descriptions, and only one app included a citation to published literature.</p>
      <p>Those findings are about mental-health app store listings, not about Shotsy or REGEN. The same checklist still applies when someone is logging a GLP-1 such as <a href="/library/semaglutide">Semaglutide</a>: look for checkable sources rather than unbacked efficacy language. Related compound pages in the REGEN Library grade evidence by study design.</p>

      <figure className="post-figure">
        <img src="/blog-charts/shotsy-app.png" alt="Privacy gaps reported across separate health-app studies (not a single ranked comparison)" loading="lazy" />
        <figcaption>Privacy gaps reported across separate health-app studies (not a single ranked comparison) · Source: REGEN analysis of the cited studies</figcaption>
      </figure>

      <h2 id="privacy-meds-apps">02  -  Privacy risks in medication trackers</h2>
      <p>Selecting a medication tracker also means checking how personal data is shared. In an <a href="https://pubmed.ncbi.nlm.nih.gov/30894349/" target="_blank" rel="noopener noreferrer">analysis of 24 top-rated medicines-related Android apps</a>, 19 (79%) shared user data; 55 unique entities received or processed that data, and 37 (67%) provided services related to collection and analysis such as analytics or advertising.</p>
      <p>That traffic study covered medicines-related Android apps generally. It does not measure Shotsy or REGEN; it shows why a privacy policy and a clear list of third-party recipients matter before you store injection dates in any tracker.</p>

      <h2 id="third-party-transmission">03  -  Data transmission to third parties</h2>
      <p>A cross-sectional <a href="https://pubmed.ncbi.nlm.nih.gov/31002321/" target="_blank" rel="noopener noreferrer">study of 36 top-ranked apps for depression and smoking cessation</a> found that 25 (69%) had a privacy policy, while data transmission to third parties was detected in 33 of 36 apps (92%). Twenty-nine of 36 (81%) sent data to Google or Facebook for advertising, marketing or analytics.</p>
      <p>Those apps were chosen for depression and smoking cessation rankings, not for GLP-1 tracking. The pattern still flags a practical question for any health logger: where does traffic go once a dose is recorded.</p>

      <h2 id="privacy-policies">04  -  Privacy policies in mobile health tools</h2>
      <p>In a <a href="https://pubmed.ncbi.nlm.nih.gov/34135009/" target="_blank" rel="noopener noreferrer">cross-sectional study of 20,991 mHealth apps on Google Play</a>, 88.0% included code that could potentially collect user data, 3.9% transmitted user information in their traffic, and 28.1% provided no privacy policy.</p>
      <p>Missing documentation does not prove misuse, but it removes a checkable promise. For peptide and GLP-1 trackers, a readable privacy policy and an explicit third-party list are baseline filters before comparing feature lists.</p>

      <PostCta variant="ai" />

      <h2 id="readable-numbers">05  -  Readable displays for tracked numbers</h2>
      <p>How numbers are shown changes how people read them. In an <a href="https://pubmed.ncbi.nlm.nih.gov/28040686/" target="_blank" rel="noopener noreferrer">online experiment with 1620 adults</a>, showing hypothetical lab results as number lines instead of tables reduced perceived urgency for near-normal results without changing perceptions of extreme values; gradient displays gave the greatest sensitivity to changes in results.</p>
      <p>That experiment used hypothetical lab results, not GLP-1 dose logs. The design lesson still applies to any tracker that surfaces trends: a clear scale beats a raw table when the goal is to see whether a value is near normal or extreme.</p>

      <h2 id="what-to-check">06  -  What to check before you rely on a tracker</h2>
      <p>Put together, the published evidence on other health apps points to three checks before trusting any GLP-1 or peptide tracker: whether claims cite literature you can open, whether privacy policy and traffic destinations are explicit, and whether tracked numbers are displayed in a way that makes near-normal versus extreme values obvious.</p>
      <p>REGEN describes dose logging and check-ins on one timeline, <a href="/library">REGEN Library</a> pages with evidence grades (including <a href="/library/semaglutide">Semaglutide</a>), and Regen AI answers with cited sources  -  one cited source instead of forty tabs. Our <a href="/library">how we grade page</a> explains how those grades are set. The studies above are about other apps, not about REGEN.</p>

      <h2 id="faq">FAQ</h2>
        <h3 id="faq-1">What do studies suggest checking in a GLP-1 tracker?</h3>
        <p>Published studies of other health apps highlight three filters: claims that cite literature, an explicit privacy policy and third-party list, and displays that make near-normal versus extreme values easy to read.</p>
        <h3 id="faq-2">Do health apps share user data?</h3>
        <p>In a BMJ traffic analysis of 24 medicines-related Android apps, 79% shared user data. In a study of 36 depression and smoking apps, 92% transmitted data to third parties.</p>
        <h3 id="faq-3">How common are privacy policies in mHealth apps?</h3>
        <p>In a study of 20,991 Google Play mHealth apps, 28.1% provided no privacy policy, and 88.0% included code that could potentially collect user data.</p>
        <h3 id="faq-4">Why does display format matter in a tracker?</h3>
        <p>In an experiment with 1620 adults, number-line and gradient displays of hypothetical lab results helped people judge near-normal versus extreme values better than tables.</p>
    </>
  );
}

const post: PostMeta = {
  title: "Shotsy App: What to Look For in a GLP-1 Tracker",
  category: "Science",
  date: "Nov 6, 2026",
  readTime: "3 min read",
  cover: "/blog/shotsy-app/cover",
  lead: "People searching for the Shotsy app are usually comparing GLP-1 trackers. Published studies of other health apps show three practical filters: cited claims, clear privacy and data-sharing practices, and readable number displays.",
  stat: { value: "79%", label: "of 24 top-rated medicines-related Android apps shared user data (BMJ 2019 traffic analysis)" },
  description: "Shotsy app searchers: what published studies of health apps say to check  -  citations, privacy, and readable tracking  -  before relying on a GLP-1 tracker.",
  datePublished: "2026-11-06",
  dateModified: "2026-11-06",
  author: { initials: "EM", name: "Ekam Mehat", role: "REGEN Editorial" },
  toc: [
    { id: "evaluating-claims", label: "01  -  Evaluating digital health app claims" },
    { id: "privacy-meds-apps", label: "02  -  Privacy risks in medication trackers" },
    { id: "third-party-transmission", label: "03  -  Data transmission to third parties" },
    { id: "privacy-policies", label: "04  -  Privacy policies in mobile health tools" },
    { id: "readable-numbers", label: "05  -  Readable displays for tracked numbers" },
    { id: "what-to-check", label: "06  -  What to check before you rely on a tracker" }
  ],
  faq: [
    { q: "What do studies suggest checking in a GLP-1 tracker?", a: "Published studies of other health apps highlight three filters: claims that cite literature, an explicit privacy policy and third-party list, and displays that make near-normal versus extreme values easy to read." },
    { q: "Do health apps share user data?", a: "In a BMJ traffic analysis of 24 medicines-related Android apps, 79% shared user data. In a study of 36 depression and smoking apps, 92% transmitted data to third parties." },
    { q: "How common are privacy policies in mHealth apps?", a: "In a study of 20,991 Google Play mHealth apps, 28.1% provided no privacy policy, and 88.0% included code that could potentially collect user data." },
    { q: "Why does display format matter in a tracker?", a: "In an experiment with 1620 adults, number-line and gradient displays of hypothetical lab results helped people judge near-normal versus extreme values better than tables." }
  ],
  Content,
};

export default post;
