/**
 * FAQ category grouping — a plain module so both the server page (rail
 * links, metadata) and the client list can import it; data exported from
 * a "use client" file reaches server components as an unusable reference.
 */
export const CATEGORIES: { id: string; label: string; ids: string[] }[] = [
  { id: "protocol", label: "Protocol", ids: ["how-schedule", "miss-dose"] },
  { id: "vials", label: "Vials & dosing", ids: ["reconstitution", "expiry"] },
  { id: "biomarkers", label: "Biomarkers", ids: ["biomarkers", "drift"] },
  { id: "evidence", label: "Evidence & AI", ids: ["grades", "ai-sources"] },
];
