import type { ReactNode } from "react";
import { Crumbs } from "../library/parts";
import ShopTabs, { type ShopTab } from "./ShopTabs";

/**
 * One skeleton for every shop page: a left-aligned head (crumbs, title,
 * lead, optional actions), the shop's tab bar, then the body. Nothing on a
 * shop page sits outside this, so the pages share one left edge, one
 * vertical rhythm, and one way to move between sections.
 */
export default function ShopShell({
  active,
  crumbs,
  title,
  lead,
  actions,
  children,
}: {
  active?: ShopTab;
  crumbs: { label: string; href?: string }[];
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="lib-page sh-shell">
      <header className="sh-head">
        <Crumbs trail={crumbs} />
        <h1>{title}</h1>
        {lead && <p className="sh-lead">{lead}</p>}
        {actions && <div className="sh-head-actions">{actions}</div>}
      </header>
      <ShopTabs active={active} />
      <div className="sh-body">{children}</div>
    </div>
  );
}
