import type { PostMeta } from "./types";
import tissueRecoveryBpc157VsTb500Mechanisms from "./tissue-recovery-bpc-157-vs-tb-500-mechanisms";
import pharmacologicalProfilesPt141VsMelanotanIi from "./pharmacological-profiles-pt-141-vs-melanotan-ii";
import pharmacokineticProfilesCjc1295VsSermorelin from "./pharmacokinetic-profiles-cjc-1295-vs-sermorelin";
import tesamorelinPharmacokineticsAndClinicalUtility from "./tesamorelin-pharmacokinetics-and-clinical-utility";
import readingFreeTestosterone from "./reading-free-testosterone";
import reconstitutionWithoutAnxiety from "./reconstitution-without-anxiety";
import retatrutideVsTirzepatide from "./retatrutide-vs-tirzepatide";

// One entry per post file above, keyed by slug. New posts add one import +
// one line here — never edit an existing post's file to add another.
export const POSTS: Record<string, PostMeta> = {
  "tissue-recovery-bpc-157-vs-tb-500-mechanisms": tissueRecoveryBpc157VsTb500Mechanisms,
  "pharmacological-profiles-pt-141-vs-melanotan-ii": pharmacologicalProfilesPt141VsMelanotanIi,
  "pharmacokinetic-profiles-cjc-1295-vs-sermorelin": pharmacokineticProfilesCjc1295VsSermorelin,
  "tesamorelin-pharmacokinetics-and-clinical-utility": tesamorelinPharmacokineticsAndClinicalUtility,
  "reading-free-testosterone": readingFreeTestosterone,
  "reconstitution-without-anxiety": reconstitutionWithoutAnxiety,
  "retatrutide-vs-tirzepatide": retatrutideVsTirzepatide,
};
