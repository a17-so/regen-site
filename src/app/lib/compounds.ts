/**
 * Lean compound index, slug, display name, evidence grade, one-line blurb.
 *
 * Generated from regen-app/data/catalogs/library/{peptides,stacks}.json. The
 * full catalog is 1.5MB and the site has no use for chapters, trials, or
 * sources, this is the ~6KB slice the community database actually needs.
 *
 * Stack grades are DERIVED, not authored: a stack inherits the weakest grade
 * among its components, because a combination is only as evidenced as its
 * weakest part. Everything else carries the grade set in the app.
 *
 * Regenerate by re-running the generator in the app repo after a catalog change.
 */

export type Tier = "S" | "A" | "B" | "C" | "D" | "F";

export interface CompoundRef {
  slug: string;
  name: string;
  tier: Tier;
  blurb: string;
}

/** Grade groupings, worded for a reader rather than a rubric. */
export const TIER_GROUPS: Record<Tier, { label: string; note: string }> = {
  S: { label: "Approved or dominant evidence", note: "Regulatory approval behind the use it is bought for." },
  A: { label: "Strong data or narrow approvals", note: "Human RCTs, or an approval that is real but narrow." },
  B: { label: "Real science, mixed results", note: "Human data that is observational or inconsistent." },
  C: { label: "Off-label or thin data", note: "Reviews, related-compound evidence, or off-label use." },
  D: { label: "Hype outruns data", note: "Preclinical only, abandoned, or cautioned against." },
  F: { label: "Serious evidence concerns", note: "No clinical evidence at all." },
};

export const TIER_ORDER: Tier[] = ["S", "A", "B", "C", "D", "F"];

/** Short grade names, for badges where the full group wording is too long. */
export const TIERS: Record<Tier, { label: string }> = {
  S: { label: "Regulatory approval" },
  A: { label: "Human RCTs" },
  B: { label: "Observational" },
  C: { label: "Reviews / indirect" },
  D: { label: "Preclinical only" },
  F: { label: "No clinical evidence" },
};

export const COMPOUNDS: CompoundRef[] = [
  { slug: "bpc-157", name: "BPC-157", tier: "A", blurb: "A synthetic peptide derived from a gastric protein, used for soft-tissue healing, gut…" },
  { slug: "tb-500", name: "TB-500", tier: "A", blurb: "A synthetic fragment of Thymosin Beta-4 used for systemic recovery, muscle repair, and…" },
  { slug: "ipamorelin", name: "Ipamorelin", tier: "C", blurb: "A selective GH secretagogue (ghrelin mimetic) that raises growth hormone with minimal…" },
  { slug: "tesamorelin", name: "Tesamorelin", tier: "S", blurb: "An FDA-approved GHRH analog known for reducing stubborn visceral fat and raising IGF-1…" },
  { slug: "ghk-cu", name: "GHK-Cu", tier: "S", blurb: "A copper-binding tripeptide used for skin remodeling, collagen synthesis, hair growth,…" },
  { slug: "semaglutide", name: "Semaglutide", tier: "S", blurb: "A GLP-1 receptor agonist that reduces appetite and improves glucose control, widely…" },
  { slug: "tirzepatide", name: "Tirzepatide", tier: "S", blurb: "A dual GIP/GLP-1 receptor agonist offering strong appetite suppression and glucose…" },
  { slug: "pt-141", name: "PT-141", tier: "S", blurb: "A melanocortin agonist used to enhance sexual desire and arousal in both men and…" },
  { slug: "mots-c", name: "MOTS-c", tier: "C", blurb: "A mitochondrial-derived peptide that supports metabolic flexibility, insulin…" },
  { slug: "retatrutide", name: "Retatrutide", tier: "S", blurb: "An investigational triple GIP/GLP-1/glucagon receptor agonist producing some of the…" },
  { slug: "igf-1-lr3", name: "IGF-1 LR3", tier: "F", blurb: "A long-acting analog of insulin-like growth factor 1 that drives muscle growth and…" },
  { slug: "ghrp-2", name: "GHRP-2", tier: "D", blurb: "A potent growth hormone releasing peptide (ghrelin mimetic) that triggers a strong GH…" },
  { slug: "ghrp-6", name: "GHRP-6", tier: "D", blurb: "An early growth hormone releasing peptide known for a strong GH pulse and pronounced…" },
  { slug: "semax", name: "Semax", tier: "B", blurb: "A Russian nootropic peptide derived from ACTH that supports focus, memory, and…" },
  { slug: "selank", name: "Selank", tier: "C", blurb: "A tuftsin-derived anxiolytic nootropic that lowers anxiety and supports calm focus…" },
  { slug: "melanotan-ii", name: "Melanotan II", tier: "B", blurb: "A synthetic melanocortin agonist used to darken skin (tanning), with libido effects…" },
  { slug: "cjc-1295", name: "CJC-1295 (DAC)", tier: "D", blurb: "The long-acting form of CJC-1295: a DAC tag extends its half-life to days for a…" },
  { slug: "cjc-1295-no-dac", name: "CJC-1295 (no-DAC)", tier: "C", blurb: "The short-acting form of CJC-1295 (Mod GRF 1-29): a sharp, pulsatile GH release that…" },
  { slug: "bpc-157-tb-500-blend", name: "BPC-157 + TB-500 Blend", tier: "B", blurb: "A single-vial blend of BPC-157 and TB-500 • local plus systemic tissue repair in one…" },
  { slug: "cjc-1295-no-dac-ipamorelin-blend", name: "CJC-1295 (no-DAC) + Ipamorelin Blend", tier: "B", blurb: "A single-vial blend pairing short-acting CJC-1295 (no-DAC) with Ipamorelin for a…" },
  { slug: "adamax", name: "Adamax", tier: "F", blurb: "A synthetic nonapeptide analog of Semax with N-terminal acetylation and adamantyl…" },
  { slug: "mk-677", name: "MK-677", tier: "A", blurb: "An oral ghrelin-receptor agonist that raises growth hormone and IGF-1 around the clock…" },
  { slug: "liraglutide", name: "Liraglutide", tier: "S", blurb: "A once-daily GLP-1 receptor agonist, the class predecessor to semaglutide and…" },
  { slug: "exenatide", name: "Exenatide", tier: "S", blurb: "The first-in-class GLP-1 receptor agonist, derived from a peptide found in Gila…" },
  { slug: "orforglipron", name: "Orforglipron", tier: "A", blurb: "The first oral, non-peptide GLP-1 receptor agonist pill with no food or water…" },
  { slug: "nad-plus", name: "NAD+", tier: "C", blurb: "A naturally occurring cellular coenzyme central to energy metabolism and DNA repair…" },
  { slug: "glutathione", name: "Glutathione", tier: "D", blurb: "The body's master antioxidant tripeptide, sold as an IV/injectable and oral wellness…" },
  { slug: "somatropin", name: "Somatropin (HGH)", tier: "S", blurb: "Recombinant human growth hormone, a 191-amino-acid polypeptide identical to the…" },
  { slug: "kpv", name: "KPV", tier: "D", blurb: "A synthetic tripeptide fragment of alpha-MSH studied for anti-inflammatory effects…" },
  { slug: "epithalon", name: "Epithalon", tier: "D", blurb: "A synthetic tetrapeptide analog of a natural pineal gland peptide, studied for…" },
  { slug: "dsip", name: "DSIP (Delta Sleep-Inducing Peptide)", tier: "D", blurb: "A nonapeptide originally isolated from rabbit brain, studied for its role in inducing…" },
  { slug: "kisspeptin-10", name: "Kisspeptin-10", tier: "B", blurb: "A decapeptide fragment of human kisspeptin, sitting upstream of the entire…" },
  { slug: "ll-37", name: "LL-37", tier: "D", blurb: "The human cathelicidin antimicrobial peptide, part of the body's first line of…" },
  { slug: "vip", name: "VIP (Vasoactive Intestinal Peptide)", tier: "C", blurb: "A 28-amino-acid neuropeptide with broad vasodilator, anti-inflammatory, and…" },
  { slug: "ahk-cu", name: "AHK-Cu (Copper Tripeptide-3)", tier: "D", blurb: "A copper-binding tripeptide related to GHK-Cu, with research skewed toward…" },
  { slug: "klow", name: "KLOW Blend", tier: "B", blurb: "A single-vial 4-peptide blend combining GHK-Cu, KPV, BPC-157, and TB-500 • the most…" },
  { slug: "glow", name: "GLOW Blend", tier: "B", blurb: "A copper-peptide-forward single-vial blend pairing GHK-Cu's skin remodeling with…" },
  { slug: "tesamorelin-ipamorelin-blend", name: "Tesamorelin + Ipamorelin Blend", tier: "B", blurb: "A single-vial blend pairing FDA-approved GHRH analog Tesamorelin with the selective…" },
  { slug: "oxytocin", name: "Oxytocin", tier: "B", blurb: "A naturally occurring nonapeptide, FDA-approved as Pitocin for labor, and separately…" },
  { slug: "pinealon", name: "Pinealon", tier: "F", blurb: "A Khavinson-group tripeptide bioregulator, studied preclinically for neuroprotective…" },
  { slug: "thymosin-alpha-1", name: "Thymosin Alpha-1", tier: "A", blurb: "A 28-amino-acid thymic peptide approved in 35+ countries as Zadaxin for immune support…" },
  { slug: "larazotide", name: "Larazotide", tier: "D", blurb: "An oral zonulin antagonist that holds the gut's tight junctions shut against gluten…" },
  { slug: "ss-31", name: "SS-31 (Elamipretide)", tier: "B", blurb: "A mitochondria-targeting tetrapeptide, FDA-approved in September 2025 for Barth…" },
  { slug: "melanotan-i", name: "Melanotan I (Afamelanotide)", tier: "B", blurb: "The only melanotan with FDA approval, cleared as Scenesse in 2019 for a rare disorder…" },
  { slug: "5-amino-1mq", name: "5-Amino-1MQ", tier: "C", blurb: "An NNMT-inhibiting small molecule studied for fat loss in obese mice, no human trials…" },
  { slug: "gonadorelin", name: "Gonadorelin", tier: "C", blurb: "A synthetic copy of GnRH, the body's own upstream trigger for testosterone, used by…" },
  { slug: "humanin", name: "Humanin", tier: "C", blurb: "A mitochondrial-derived peptide discovered protecting neurons from Alzheimer's-linked…" },
  { slug: "sermorelin", name: "Sermorelin", tier: "C", blurb: "A classic 29-amino-acid GHRH fragment, historically FDA-approved as Geref, clears…" },
  { slug: "snap-8", name: "SNAP-8", tier: "D", blurb: "The 'topical Botox' marketing peptide, a lab-dish mechanism with no controlled human…" },
  { slug: "dihexa", name: "Dihexa", tier: "F", blurb: "An oral angiotensin IV analog studied as a memory aid in rodents, the foundational…" },
  { slug: "follistatin-344", name: "Follistatin-344", tier: "F", blurb: "A myostatin-blocking peptide with real biology behind it, but the injectable product…" },
  { slug: "hcg", name: "hCG (Human Chorionic Gonadotropin)", tier: "S", blurb: "An FDA-approved hormone that mimics LH, restoring the body's own testosterone and…" },
  { slug: "slu-pp-332", name: "SLU-PP-332", tier: "C", blurb: "A pan-ERR agonist nicknamed the 'exercise pill', reduced fat mass and raised…" },
  { slug: "slu-pp-915", name: "SLU-PP-915", tier: "C", blurb: "The first orally-active pan-ERR agonist, raised exercise capacity in mice even when…" },
  { slug: "summer-ascension-stack", name: "Summer Ascension Stack", tier: "B", blurb: "Aggressive Retatrutide-driven fat loss paired with a supporting GH blend layered in…" },
  { slug: "wolverine-recovery-stack", name: "Wolverine Recovery Stack", tier: "B", blurb: "BPC-157 and TB-500 work together to rebuild connective tissue and gut lining, while a…" },
  { slug: "lean-machine-stack", name: "Lean Machine Stack", tier: "B", blurb: "Tirzepatide curbs appetite for steady, sustainable fat loss, while a supporting GH…" },
  { slug: "limitless-stack", name: "Limitless Stack", tier: "C", blurb: "Semax sharpens mental focus and drive for deep work, while Selank keeps you calm,…" },
];

export const bySlug = (s: string) => COMPOUNDS.find((c) => c.slug === s);

export function groupedByTier(): { tier: Tier; items: CompoundRef[] }[] {
  return TIER_ORDER.map((tier) => ({
    tier,
    items: COMPOUNDS.filter((c) => c.tier === tier).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((g) => g.items.length > 0);
}
