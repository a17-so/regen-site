/**
 * Editorial headlines, one per compound.
 *
 * A bare compound name ("TB-500") is a weak <h1> and a weak SERP entry: it
 * repeats the URL and tells a reader nothing. Each headline below names the
 * mechanism or the claim the compound is actually looked up for, so the title
 * carries the long-tail phrasing people search alongside the name.
 *
 * Written from this catalog's own mechanism and evidence fields. Keep them
 * factual: a headline promising an effect the grade does not support is the
 * fastest way to lose a health-content ranking.
 */
export const HEADLINES: Record<string, string> = {
  "bpc-157": "BPC-157: The Gastric Peptide Studied for Soft-Tissue Repair",
  "tb-500": "TB-500: How a Thymosin Beta-4 Fragment Targets Systemic Recovery",
  ipamorelin: "Ipamorelin: The Selective GH Secretagogue That Spares Cortisol",
  tesamorelin: "Tesamorelin: The Approved GHRH Analog for Visceral Fat",
  "ghk-cu": "GHK-Cu: The Copper Tripeptide Behind Collagen Remodeling",
  semaglutide: "Semaglutide: How GLP-1 Agonism Reshaped Weight Management",
  tirzepatide: "Tirzepatide: The Dual GIP/GLP-1 Agonist and What Trials Show",
  "pt-141": "PT-141: The Melanocortin Agonist That Acts on the Brain",
  "mots-c": "MOTS-c: The Mitochondrial Peptide Studied for Metabolic Flexibility",
  retatrutide: "Retatrutide: The Triple Agonist Posting the Largest Weight Losses",
  "igf-1-lr3": "IGF-1 LR3: Long-Acting Growth Signalling and Its Real Risks",
  "ghrp-2": "GHRP-2: A Potent GH Pulse and What It Costs in Prolactin",
  "ghrp-6": "GHRP-6: The Original GH Releaser and Its Appetite Problem",
  semax: "Semax: The ACTH-Derived Nootropic and Its BDNF Mechanism",
  selank: "Selank: Anxiolytic Nootropic Effects Without Sedation",
  "melanotan-ii": "Melanotan II: Tanning, Libido, and Serious Safety Cautions",
  "cjc-1295": "CJC-1295 (DAC): How the DAC Tag Stretches GH Release to Days",
  "cjc-1295-no-dac": "CJC-1295 (no-DAC): Pulsatile GH Release That Mimics Nature",
  "bpc-157-tb-500-blend": "BPC-157 + TB-500: Pairing Local and Systemic Tissue Repair",
  "cjc-1295-no-dac-ipamorelin-blend":
    "CJC-1295 + Ipamorelin: The Physiological GH Pulse Stack",
  adamax: "Adamax: The Modified Semax Analog and Its Thin Evidence Base",
  "mk-677": "MK-677: Oral Ghrelin Agonism and Around-the-Clock IGF-1",
  liraglutide: "Liraglutide: The Daily GLP-1 That Preceded Semaglutide",
  exenatide: "Exenatide: The First-in-Class GLP-1 and Its Clinical Legacy",
  orforglipron: "Orforglipron: The First Oral Non-Peptide GLP-1 Pill",
  "nad-plus": "NAD+: Cellular Energy, DNA Repair, and the Delivery Problem",
  glutathione: "Glutathione: The Master Antioxidant and Its Absorption Limits",
  somatropin: "Somatropin (HGH): Recombinant Growth Hormone and Its Approvals",
  kpv: "KPV: Anti-Inflammatory alpha-MSH Signalling Without Pigmentation",
  epithalon: "Epithalon: Telomerase Activation Claims and the Risk Question",
  dsip: "DSIP: Delta-Wave Sleep Claims and the Evidence Behind Them",
  "kisspeptin-10": "Kisspeptin-10: The Upstream Switch of the Reproductive Axis",
  "ll-37": "LL-37: The Human Cathelicidin and Its Antimicrobial Role",
  vip: "VIP: Vasodilation, Immune Modulation, and Cleared Indications",
  "ahk-cu": "AHK-Cu: The Copper Tripeptide Studied for Hair Follicles",
  klow: "KLOW Blend: Four Peptides for Inflammation and Repair",
  glow: "GLOW Blend: Copper-Peptide Skin Remodeling Plus Tissue Repair",
  "tesamorelin-ipamorelin-blend":
    "Tesamorelin + Ipamorelin: Pairing an Approved GHRH With a Ghrelin Agonist",
  oxytocin: "Oxytocin: Approved for Labor, Studied Far Beyond It",
  pinealon: "Pinealon: A Peptide Bioregulator With Preclinical-Only Data",
  "thymosin-alpha-1": "Thymosin Alpha-1: Approved in 35+ Countries, Not by the FDA",
  larazotide: "Larazotide: The Zonulin Antagonist That Reached Phase 3",
  "ss-31": "SS-31 (Elamipretide): Mitochondria-Targeting With a Real Approval",
  "melanotan-i": "Melanotan I (Afamelanotide): The Only Approved Melanotan",
  "5-amino-1mq": "5-Amino-1MQ: NNMT Inhibition and the Missing Human Trials",
  gonadorelin: "Gonadorelin: Synthetic GnRH and Its Role Alongside TRT",
  humanin: "Humanin: The Mitochondrial Peptide Studied for Neuroprotection",
  sermorelin: "Sermorelin: The Classic GHRH Fragment and Its Fast Clearance",
  "snap-8": "SNAP-8: The 'Topical Botox' Claim Against the Actual Evidence",
  dihexa: "Dihexa: Rodent Memory Data and the Retraction Behind It",
  "follistatin-344": "Follistatin-344: Myostatin Blockade and a Product Problem",
  hcg: "hCG: Restoring Natural Testosterone and Sperm Production",
  "slu-pp-332": "SLU-PP-332: The 'Exercise Pill' Mechanism, Tested in Mice",
  "slu-pp-915": "SLU-PP-915: The First Orally-Active Pan-ERR Agonist",
};

/** Headline for a compound, falling back to a composed pattern. */
export function headlineFor(slug: string, name: string): string {
  return HEADLINES[slug] ?? `${name}: Uses, Dosage, Side Effects, and Evidence`;
}
