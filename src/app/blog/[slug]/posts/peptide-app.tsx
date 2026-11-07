import type { PostMeta } from "./types";
import PostCta from "../PostCta";

function Content() {
  return (
    <>
      <h2 id="what-a-peptide-app-should-do">01 — What a peptide app should do</h2>
      <p>People search for a peptide app when they want one place to log what they take, keep track of lab results and look up research. Before you download one, three questions are worth asking: where does your data go, does the app back its claims with published research, and does it show lab results in a way that is easy to read.</p>
      <p>Peptide research ranges from large human trials to a few animal studies, so the research part matters. The <a href="/library">REGEN Library</a> grades the evidence for each compound, and the <a href="/library">how we grade page</a> explains what each grade means. The rest of this post looks at what studies of health apps found on each question.</p>

      <figure className="post-figure">
        <img src="/blog-charts/peptide-app.png" alt="Share of 36 top-ranked depression and smoking-cessation apps with a privacy policy, sending data to Google or Facebook, and sending data to any third party (Huckvale 2019)" loading="lazy" />
        <figcaption>Share of 36 top-ranked depression and smoking-cessation apps with a privacy policy, sending data to Google or Facebook, and sending data to any third party (Huckvale 2019) · Source: REGEN analysis of the cited studies</figcaption>
      </figure>

      <h2 id="where-your-data-goes">02 — Where your data goes</h2>
      <p>A 2019 study in The BMJ tested 24 top-rated medicines-related Android apps by watching the data they sent while being used. It found that <a href="https://pubmed.ncbi.nlm.nih.gov/30894349/" target="_blank" rel="noopener noreferrer">19 of 24 apps (79%) shared user data</a>, and that 55 unique entities received or processed that data.</p>
      <p>Of those 55 entities, <a href="https://pubmed.ncbi.nlm.nih.gov/30894349/" target="_blank" rel="noopener noreferrer">37 (67%) provided services related to the collection and analysis of user data</a>, including analytics or advertising. The authors described sharing of user data as routine in the apps they studied.</p>

      <h2 id="policies-versus-behavior">03 — What the privacy policy says versus what the app does</h2>
      <p>A 2019 study in JAMA Network Open looked at 36 top-ranked apps for depression and smoking cessation and compared their privacy policies with the data they actually sent. Twenty-five of the 36 apps (69%) had a privacy policy at all, and data <a href="https://pubmed.ncbi.nlm.nih.gov/31002321/" target="_blank" rel="noopener noreferrer">transmission to a third party was detected in 33 of 36 apps (92%)</a>.</p>
      <p>In that study, 29 of 36 apps (81%) sent data to Google or Facebook for advertising, marketing or analytics. Only <a href="https://pubmed.ncbi.nlm.nih.gov/31002321/" target="_blank" rel="noopener noreferrer">12 of the 28 apps sending data to Google and 6 of the 12 sending data to Facebook disclosed it</a>, so reading the policy alone did not tell users the whole story.</p>

      <PostCta variant="ai" />

      <h2 id="how-common-the-problem-is">04 — How common the problem is</h2>
      <p>The largest study of this kind, published in The BMJ in 2021, examined 20,991 medical and health and fitness apps on Google Play. It found that <a href="https://pubmed.ncbi.nlm.nih.gov/34135009/" target="_blank" rel="noopener noreferrer">88.0% included code that could potentially collect user data</a>, 3.9% transmitted user information in their traffic, and 28.1% provided no privacy policy.</p>
      <p>The same study found that <a href="https://pubmed.ncbi.nlm.nih.gov/34135009/" target="_blank" rel="noopener noreferrer">23.0% of user data transmissions used insecure communication protocols</a>. A practical first step with any app, including REGEN, is to read its privacy policy before you sign up; ours is on the <a href="/privacy">privacy page</a>.</p>

      <h2 id="science-language-versus-citations">05 — Scientific language is not the same as evidence</h2>
      <p>A 2019 study in npj Digital Medicine coded the app store descriptions of 73 top-ranking mental health apps. <a href="https://pubmed.ncbi.nlm.nih.gov/31304366/" target="_blank" rel="noopener noreferrer">Most of them (64%) claimed effectiveness</a> at diagnosing a condition or improving symptoms, mood or self-management, and scientific language was the most common way those claims were supported (44%).</p>
      <p>Yet <a href="https://pubmed.ncbi.nlm.nih.gov/31304366/" target="_blank" rel="noopener noreferrer">only one app in that study included a citation to published literature</a>. For a peptide app, the equivalent check is whether answers and compound pages link to sources you can open yourself, rather than just sounding scientific.</p>

      <PostCta variant="labs" />

      <h2 id="how-lab-results-are-shown">06 — How lab results are shown</h2>
      <p>How an app displays lab results changes how people read them. In an online experiment with <a href="https://pubmed.ncbi.nlm.nih.gov/28040686/" target="_blank" rel="noopener noreferrer">1,620 adults shown hypothetical lab results</a>, number-line displays reduced perceived urgency for near-normal results compared with tables, without changing how people saw extreme values, and <a href="https://pubmed.ncbi.nlm.nih.gov/28040686/" target="_blank" rel="noopener noreferrer">gradient displays gave the greatest sensitivity to changes in results</a>.</p>
      <p>REGEN lets you upload lab reports and follow 57+ biomarkers as trends over time, alongside Library evidence grades and Regen AI answers that cite their sources. Those are the features we built around the three questions above; the studies here are about other health apps, not about REGEN.</p>

      <h2 id="faq">FAQ</h2>
        <h3 id="faq-1">What should a peptide app do?</h3>
        <p>A useful peptide app lets you log what you track, follow lab results over time and look up research, with sources you can open and check. It should also be clear about where your data goes.</p>
        <h3 id="faq-2">Do health apps share user data?</h3>
        <p>Often. A 2019 study found 19 of 24 top-rated medicines-related apps (79%) shared user data, and another found data sent to third parties in 33 of 36 depression and smoking-cessation apps (92%).</p>
        <h3 id="faq-3">Do health apps back up their claims with research?</h3>
        <p>Rarely, in the studies available. Of 73 top-ranking mental health apps, 64% claimed effectiveness, but only one cited published literature.</p>
        <h3 id="faq-4">Why does the way lab results are displayed matter?</h3>
        <p>In an experiment with 1,620 adults, number-line displays reduced worry about near-normal results compared with tables without changing how people saw extreme values.</p>
    </>
  );
}

const post: PostMeta = {
  title: "Peptide App: What to Look For Before You Download",
  category: "Science",
  date: "Nov 4, 2026",
  readTime: "4 min read",
  cover: "/blog/peptide-app/cover",
  lead: "A good peptide app is clear about where your data goes, links its claims to published research and shows lab results in a readable way. Studies of health apps suggest those basics are often missing: in one, data was sent to third parties by 33 of 36 top-ranked apps (92%).",
  stat: { value: "92%", label: "of 36 top-ranked depression and smoking-cessation apps sent data to third parties (2019 study)" },
  description: "What to look for in a peptide app before you download: data sharing, privacy policies, cited research and readable lab results, with what studies found.",
  datePublished: "2026-11-04",
  dateModified: "2026-11-04",
  author: { initials: "EM", name: "Ekam Mehat", role: "REGEN Editorial" },
  toc: [
    { id: "what-a-peptide-app-should-do", label: "01 \u2014 What a peptide app should do" },
    { id: "where-your-data-goes", label: "02 \u2014 Where your data goes" },
    { id: "policies-versus-behavior", label: "03 \u2014 What the privacy policy says versus what the app does" },
    { id: "how-common-the-problem-is", label: "04 \u2014 How common the problem is" },
    { id: "science-language-versus-citations", label: "05 \u2014 Scientific language is not the same as evidence" },
    { id: "how-lab-results-are-shown", label: "06 \u2014 How lab results are shown" }
  ],
  faq: [
    { q: "What should a peptide app do?", a: "A useful peptide app lets you log what you track, follow lab results over time and look up research, with sources you can open and check. It should also be clear about where your data goes." },
    { q: "Do health apps share user data?", a: "Often. A 2019 study found 19 of 24 top-rated medicines-related apps (79%) shared user data, and another found data sent to third parties in 33 of 36 depression and smoking-cessation apps (92%)." },
    { q: "Do health apps back up their claims with research?", a: "Rarely, in the studies available. Of 73 top-ranking mental health apps, 64% claimed effectiveness, but only one cited published literature." },
    { q: "Why does the way lab results are displayed matter?", a: "In an experiment with 1,620 adults, number-line displays reduced worry about near-normal results compared with tables without changing how people saw extreme values." }
  ],
  Content,
};

export default post;
