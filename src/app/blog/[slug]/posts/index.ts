import type { PostMeta } from "./types";
import tesamorelinPharmacokineticsAndClinicalUtility from "./tesamorelin-pharmacokinetics-and-clinical-utility";
import readingFreeTestosterone from "./reading-free-testosterone";
import reconstitutionWithoutAnxiety from "./reconstitution-without-anxiety";
import retatrutideVsTirzepatide from "./retatrutide-vs-tirzepatide";

// One entry per post file above, keyed by slug. New posts add one import +
// one line here — never edit an existing post's file to add another.
export const POSTS: Record<string, PostMeta> = {
  "tesamorelin-pharmacokinetics-and-clinical-utility": tesamorelinPharmacokineticsAndClinicalUtility,
  "reading-free-testosterone": readingFreeTestosterone,
  "reconstitution-without-anxiety": reconstitutionWithoutAnxiety,
  "retatrutide-vs-tirzepatide": retatrutideVsTirzepatide,
};
