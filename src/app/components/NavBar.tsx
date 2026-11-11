import { appStoreQr } from "../lib/qr";
import Nav, { type NavMenu } from "./Nav";
import { CATEGORIES } from "../lib/guideVocab";
import { GUIDE_INDEX, categoryCount } from "../lib/guides";
import { BLOG_POSTS } from "../lib/blogData";
import { SCIENCE_CATEGORIES, categoryHref, categoryTitle } from "../blog/ScienceParts";
import { SHOP_VENDORS, compoundCount } from "../lib/shop";

/** The three sections and their dropdowns, from the same data the hubs read. */
function menus(): NavMenu[] {
  return [
    {
      key: "library",
      label: "Library",
      href: "/library",
      items: [
        { label: "All peptides", href: "/library", meta: String(GUIDE_INDEX.length) },
        ...CATEGORIES.map((c) => ({ label: c.label, href: `/library/${c.slug}`, meta: String(categoryCount(c.slug)) })),
      ],
    },
    {
      key: "science",
      label: "Science",
      href: "/blog",
      items: [
        { label: "All articles", href: "/blog", meta: String(BLOG_POSTS.length) },
        ...SCIENCE_CATEGORIES.map((c) => ({
          label: categoryTitle(c),
          href: categoryHref(c),
          meta: String(BLOG_POSTS.filter((p) => p.category === c).length),
        })),
      ],
    },
    {
      key: "shop",
      label: "Marketplace",
      href: "/shop",
      items: [
        { label: "Vendors", href: "/shop", meta: String(SHOP_VENDORS.length) },
        { label: "Catalog", href: "/shop/catalog", meta: String(compoundCount()) },
        { label: "Saved", href: "/shop/saved" },
        { label: "Submit a vendor", href: "/shop/submit" },
      ],
    },
  ];
}

/**
 * Server wrapper around <Nav>.
 *
 * Nav is a client component, so it can't call the QR generator or read the
 * data modules itself. This builds the App Store QR matrix and the three
 * dropdown menus at request time and hands them down as plain data.
 */
export default async function NavBar({
  appStoreUrl,
  sectionBase,
  slot,
}: {
  appStoreUrl: string;
  sectionBase?: string;
  /** Retired: the bar carries the site search now. See <Nav>. */
  slot?: React.ReactNode;
}) {
  const qr = await appStoreQr(appStoreUrl);
  return <Nav appStoreUrl={appStoreUrl} sectionBase={sectionBase} qr={qr} menus={menus()} slot={slot} />;
}
