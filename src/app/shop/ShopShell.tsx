import type { ReactNode } from "react";
import PageShell from "../components/PageShell";
import { SHOP_VENDORS, compoundCount } from "../lib/shop";
import SavedButton from "./SavedButton";

export type ShopTab = "vendors" | "catalog" | "saved";

/** Two tabs, each a page: who to buy from, then what to buy. Saved at the end. */
const TABS = [
  { key: "vendors", label: "Vendors", href: "/shop", count: SHOP_VENDORS.length },
  { key: "catalog", label: "Catalog", href: "/shop/catalog", count: compoundCount() },
];

/**
 * The site's page anatomy with the shop's tabs and the saved list at the
 * end. A vendor profile passes `ownTabs` and draws its own section tabs in
 * the body instead: the shop's Catalog tab on a profile opened the whole
 * catalog where the reader expected the store's.
 */
export default function ShopShell({
  active,
  crumbs,
  eyebrow,
  title,
  lead,
  actions,
  ownTabs = false,
  children,
}: {
  active?: ShopTab;
  crumbs?: { label: string; href?: string }[];
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  ownTabs?: boolean;
  children: ReactNode;
}) {
  return (
    <PageShell
      eyebrow={eyebrow}
      crumbs={crumbs}
      title={title}
      lead={lead}
      actions={actions}
      tabs={ownTabs ? undefined : TABS}
      active={active}
      tabsEnd={ownTabs ? undefined : <SavedButton active={active === "saved"} />}
    >
      {children}
    </PageShell>
  );
}
