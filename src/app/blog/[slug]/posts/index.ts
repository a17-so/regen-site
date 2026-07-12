import type { PostMeta } from "./types";
import readingFreeTestosterone from "./reading-free-testosterone";
import reconstitutionWithoutAnxiety from "./reconstitution-without-anxiety";
import retatrutideVsTirzepatide from "./retatrutide-vs-tirzepatide";
import whatToLookForInPeptideProtocolManagementWorkflowsForDosingAccuracy from "./what-to-look-for-in-peptide-protocol-management-workflow-for-dosing-accuracy";

// One entry per post file above, keyed by slug. New posts add one import +
// one line here — never edit an existing post's file to add another.
export const POSTS: Record<string, PostMeta> = {
  "reading-free-testosterone": readingFreeTestosterone,
  "reconstitution-without-anxiety": reconstitutionWithoutAnxiety,
  "retatrutide-vs-tirzepatide": retatrutideVsTirzepatide,
  "what-to-look-for-in-peptide-protocol-management-workflow-for-dosing-accuracy":
    whatToLookForInPeptideProtocolManagementWorkflowsForDosingAccuracy,
};
