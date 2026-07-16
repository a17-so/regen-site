import type { PostMeta } from "./types";
import kpvTripeptideAndTargetedInflammatoryModulation from "./kpv-tripeptide-and-targeted-inflammatory-modulation";
import tesamorelinPharmacokineticsAndClinicalUtility from "./tesamorelin-pharmacokinetics-and-clinical-utility";
import hcgVsGonadorelinClinicalUtility from "./hcg-vs-gonadorelin-clinical-utility";
import thymosinAlpha1ClinicalProfiles from "./thymosin-alpha-1-clinical-profiles";
import readingFreeTestosterone from "./reading-free-testosterone";
import reconstitutionWithoutAnxiety from "./reconstitution-without-anxiety";
import retatrutideVsTirzepatide from "./retatrutide-vs-tirzepatide";

// One entry per post file above, keyed by slug. New posts add one import +
// one line here — never edit an existing post's file to add another.
export const POSTS: Record<string, PostMeta> = {
  "kpv-tripeptide-and-targeted-inflammatory-modulation": kpvTripeptideAndTargetedInflammatoryModulation,
  "tesamorelin-pharmacokinetics-and-clinical-utility": tesamorelinPharmacokineticsAndClinicalUtility,
  "hcg-vs-gonadorelin-clinical-utility": hcgVsGonadorelinClinicalUtility,
  "thymosin-alpha-1-clinical-profiles": thymosinAlpha1ClinicalProfiles,
  "reading-free-testosterone": readingFreeTestosterone,
  "reconstitution-without-anxiety": reconstitutionWithoutAnxiety,
  "retatrutide-vs-tirzepatide": retatrutideVsTirzepatide,
};
