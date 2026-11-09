import PageShell from "../components/PageShell";
import { BLOG_POSTS } from "../lib/blogData";
import PostCta from "./[slug]/PostCta";
import { ScienceBody, ScienceProvider, ScienceTabs } from "./ScienceIndex";

/**
 * The Science hub, as both `/blog` and `/blog/category/<slug>` render it:
 * the centred head, the filtering tab bar, the featured pane, the picks,
 * the grid. A category page is this with the tab preselected; the only
 * thing that differs between the routes is the metadata.
 */
export default function ScienceHubView({ initial }: { initial: string }) {
  return (
    <ScienceProvider initial={initial} posts={BLOG_POSTS}>
      <PageShell
        align="center"
        eyebrow="Science"
        title="What the research actually says."
        lead="What the trials found, how the compounds work, and what your lab numbers mean, in plain language."
        nav={<ScienceTabs />}
      >
        <ScienceBody cta={<PostCta variant="hub" />} />
      </PageShell>
    </ScienceProvider>
  );
}
