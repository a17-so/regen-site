import { SHOP_COAS, SHOP_VENDORS } from "../lib/shop";
import SavedButton from "./SavedButton";

export type ShopTab = "catalog" | "vendors" | "coas" | "labs" | "verify" | "saved";

/**
 * The shop's sections, as underline tabs: each one is a page, the active
 * one is marked by ink and a rule, never a fill. The saved list sits at the
 * end of the same bar so it is always one click away and never floats.
 */
export default function ShopTabs({ active }: { active?: ShopTab }) {
  const tabs: { key: ShopTab; label: string; href: string }[] = [
    { key: "catalog", label: "Catalog", href: "/shop" },
    { key: "vendors", label: `Vendors`, href: "/shop/vendors" },
    { key: "coas", label: `COAs`, href: "/shop/coas" },
    { key: "labs", label: "Labs", href: "/shop/labs" },
    { key: "verify", label: "Verify", href: "/shop/verify" },
  ];
  const counts: Partial<Record<ShopTab, number>> = { vendors: SHOP_VENDORS.length, coas: SHOP_COAS.length };
  return (
    <nav className="sh-tabs" aria-label="Shop sections">
      {tabs.map((t) => (
        <a key={t.key} href={t.href} aria-current={active === t.key ? "page" : undefined}>
          {t.label}
          {counts[t.key] !== undefined && <span className="sh-tab-n">{counts[t.key]}</span>}
        </a>
      ))}
      <SavedButton active={active === "saved"} />
    </nav>
  );
}
