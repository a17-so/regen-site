import type { ReactNode } from "react";

/** One way out to a vendor: what it opens, and where on REGEN it started. */
export interface Handoff {
  vendorSlug: string;
  vendorName: string;
  url: string;
  compoundSlug?: string | null;
  compoundName?: string | null;
  label?: string | null;
  priceUsd?: number | null;
  currency?: "USD" | "AUD" | null;
  code?: string | null;
  /** Where on REGEN it started: compound page, saved list, vendor profile. */
  from: "compound" | "saved" | "vendor";
}

/**
 * A link out to a vendor's store, in a new tab, marked sponsored. REGEN
 * sells nothing and keeps no accounts, so nothing is recorded: the order
 * happens on the vendor's site.
 */
export default function HandoffLink({
  handoff,
  className,
  children,
  ...rest
}: {
  handoff: Handoff;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  title?: string;
}) {
  return (
    <a className={className} href={handoff.url} target="_blank" rel="noopener noreferrer nofollow sponsored" data-from={handoff.from} {...rest}>
      {children}
    </a>
  );
}
