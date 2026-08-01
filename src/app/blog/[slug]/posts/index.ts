import type { PostMeta } from "./types";
import selectTrial from "./select-trial";
import bpc157Peptides from "./bpc-157-peptides";
import mitochondriaL from "./mitochondria-l";
import pharmacologicalNuancesOfGnrhAnalogs from "./pharmacological-nuances-of-gnrh-analogs";
import clinicalEvidenceRealityCheckBpc157AndGhkCu from "./clinical-evidence-reality-check-bpc-157-and-ghk-cu";
import epithalonAndTelomeraseActivationRisks from "./epithalon-and-telomerase-activation-risks";
import aod9604AndTheRealityOfCommercialWeightLossClaims from "./aod-9604-and-the-reality-of-commercial-weight-loss-claims";
import selankImmunomodulationAndGeneExpression from "./selank-immunomodulation-and-gene-expression";
import oralVsInjectableGlp1sOrforglipronPharmacokinetics from "./oral-vs-injectable-glp-1s-orforglipron-pharmacokinetics";
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
  "select-trial": selectTrial,
  "bpc-157-peptides": bpc157Peptides,
  "mitochondria-l": mitochondriaL,
  "pharmacological-nuances-of-gnrh-analogs": pharmacologicalNuancesOfGnrhAnalogs,
  "clinical-evidence-reality-check-bpc-157-and-ghk-cu": clinicalEvidenceRealityCheckBpc157AndGhkCu,
  "epithalon-and-telomerase-activation-risks": epithalonAndTelomeraseActivationRisks,
  "aod-9604-and-the-reality-of-commercial-weight-loss-claims": aod9604AndTheRealityOfCommercialWeightLossClaims,
  "selank-immunomodulation-and-gene-expression": selankImmunomodulationAndGeneExpression,
  "oral-vs-injectable-glp-1s-orforglipron-pharmacokinetics": oralVsInjectableGlp1sOrforglipronPharmacokinetics,
  "tissue-recovery-bpc-157-vs-tb-500-mechanisms": tissueRecoveryBpc157VsTb500Mechanisms,
  "pharmacological-profiles-pt-141-vs-melanotan-ii": pharmacologicalProfilesPt141VsMelanotanIi,
  "pharmacokinetic-profiles-cjc-1295-vs-sermorelin": pharmacokineticProfilesCjc1295VsSermorelin,
  "tesamorelin-pharmacokinetics-and-clinical-utility": tesamorelinPharmacokineticsAndClinicalUtility,
  "reading-free-testosterone": readingFreeTestosterone,
  "reconstitution-without-anxiety": reconstitutionWithoutAnxiety,
  "retatrutide-vs-tirzepatide": retatrutideVsTirzepatide,
};
