import type { ReactNode } from "react";
import { Crumbs } from "../library/parts";

export interface PageTab {
  key: string;
  label: string;
  href: string;
  count?: number;
}

/**
 * The one page anatomy for Library, Science, Shop, and Account: a
 * left-aligned head (eyebrow or crumbs, headline with at most one accent
 * phrase, lede, an optional actions line), the section's underline tabs,
 * then the body. Every hub and index page goes through this, so the site
 * shares one left edge, one rhythm, and one way to switch sections.
 */
export default function PageShell({
  eyebrow,
  crumbs,
  title,
  lead,
  actions,
  tabs,
  active,
  tabsEnd,
  align,
  nav,
  children,
}: {
  eyebrow?: string;
  crumbs?: { label: string; href?: string }[];
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  tabs?: PageTab[];
  active?: string;
  tabsEnd?: ReactNode;
  /** "center" centres the head and the tab bar. Science is the one hub
      that does, by request; every other hub keeps the left edge. */
  align?: "left" | "center";
  /** A ready-made tab bar for the tabs slot, in place of `tabs`: Science
      passes a client bar that filters in place. */
  nav?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={`lib-page pg${align === "center" ? " pg--center" : ""}`}>
      <header className="pg-head">
        {crumbs && <Crumbs trail={crumbs} />}
        {eyebrow && !crumbs && <p className="pg-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="pg-lead">{lead}</p>}
        {actions && <div className="pg-head-actions">{actions}</div>}
      </header>
      {nav ??
        ((tabs || tabsEnd) && (
        <nav className="pg-tabs" aria-label="Sections">
          {tabs?.map((t) => (
            <a key={t.key} href={t.href} aria-current={active === t.key ? "page" : undefined}>
              {t.label}
              {t.count !== undefined && <span className="pg-tab-n">{t.count}</span>}
            </a>
          ))}
          {tabsEnd}
        </nav>
        ))}
      <div className="pg-body">{children}</div>
    </div>
  );
}
