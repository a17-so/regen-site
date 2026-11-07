import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { JsonLd } from "../../components/JsonLd";
import { LIBRARY_ROBOTS } from "../../lib/library";
import { SHOP_COMPOUNDS, compoundBySlug, money, offerRowsFor, shopHref, shopSearchRows } from "../../lib/shop";
import { guideBySlug, guideHref } from "../../lib/guides";
import { SITE_URL } from "../../library/parts";
import LibrarySearch from "../../library/LibrarySearch";
import ShopShell from "../ShopShell";
import CompareTable from "../CompareTable";

export function generateStaticParams() {
  return SHOP_COMPOUNDS.map((c) => ({ compound: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ compound: string }> }): Promise<Metadata> {
  const { compound } = await params;
  const c = compoundBySlug(compound);
  if (!c) return {};
  const title = `${c.name}: Compare Vendors, Prices and COAs`;
  const description = `${c.name} from ${c.vendorCount} researched vendor${c.vendorCount === 1 ? "" : "s"}${
    c.minUsdPerMg !== null ? `, from ${money(c.minUsdPerMg)} per mg` : ""
  }. Live prices by vial size, published COAs, and who ships from where.`;
  return {
    title: `${title} | REGEN Shop`,
    description,
    alternates: { canonical: `${SITE_URL}${shopHref(c.slug)}` },
    robots: LIBRARY_ROBOTS,
    openGraph: { type: "website", url: `${SITE_URL}${shopHref(c.slug)}`, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CompoundShopPage({ params }: { params: Promise<{ compound: string }> }) {
  const { compound } = await params;
  const c = compoundBySlug(compound);
  if (!c) notFound();
  const appStoreUrl = buildAppStoreUrl();
  const rows = offerRowsFor(c);
  const guide = c.guideSlug ? guideBySlug(c.guideSlug) : undefined;
  const calculator = c.kind === "compound" ? `/tools/${c.slug}` : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${c.name} vendors`,
    url: `${SITE_URL}${shopHref(c.slug)}`,
    numberOfItems: rows.length,
    itemListElement: rows.map((r, i) => ({ "@type": "ListItem", position: i + 1, name: `${c.name} from ${r.vendorName}`, url: r.productUrl })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" slot={<LibrarySearch rows={shopSearchRows()} variant="nav" />} />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <ShopShell
          active="catalog"
          crumbs={[{ label: "Shop", href: "/shop" }, { label: c.name }]}
          title={c.name}
          lead={
            <>
              {c.vendorCount} vendor{c.vendorCount === 1 ? "" : "s"}
              {c.minUsdPerMg !== null ? ` · from ${money(c.minUsdPerMg)} per mg` : ""}
              {c.kind === "blend" ? " · blend" : ""}
              {guide ? ` · ${guide.summary}` : ""}
            </>
          }
          actions={
            guide || calculator ? (
              <p className="sh-links">
                {guide && <a href={guideHref(guide.slug)}>Read the guide</a>}
                {guide && calculator && <span aria-hidden="true"> · </span>}
                {calculator && <a href={calculator}>Reconstitution calculator</a>}
              </p>
            ) : undefined
          }
        >
          <CompareTable rows={rows} sizes={c.sizesMg} compoundSlug={c.slug} compoundName={c.name} />
          <p className="sh-note">
            Prices were read from each vendor&apos;s own catalog and can change; the vendor&apos;s page is the price. REGEN
            may earn a referral when an order uses a code shown here. The order is the research pipeline&apos;s ranking
            (testing, COA archive, operator disclosure, reviews) and is not for sale. Research use only; nothing here is
            medical advice.
          </p>
        </ShopShell>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
