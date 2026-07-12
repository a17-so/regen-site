import type { PostMeta } from "./types";

function Content() {
  return (
    <>
      <h2 id="map">01 - Map the real-world workflow and decision points</h2>
      <p>
        Peptide dosing teams run into drift the moment a protocol moves from a
        spreadsheet to the bench. Vial labels, reconstitution steps, and dose
        math have to line up from preparation through administration, but daily
        practice often introduces miscalculations and mismatched inventory.
      </p>
      <p>
        The right software should reflect the actual journey from receipt to
        dosing, not just a theoretical workflow diagram. If the tool cannot
        model the steps operators already follow, it will not improve accuracy.
      </p>

      <h2 id="steps">02 - Operational steps from receipt to dosing</h2>
      <p>
        Start by tracing the work in order: receiving materials, labeling
        vials, documenting steps, reconstituting, calculating the dose, and
        administering it. Each step should produce a traceable event that feeds
        the next decision.
      </p>
      <ul>
        <li>Receive and inspect materials</li>
        <li>Label vials with IDs</li>
        <li>Document steps and times</li>
      </ul>

      <h2 id="decisions">03 - Key decision points that influence accuracy</h2>
      <p>
        Accuracy is usually lost at decision points, not in the final injection.
        The software should force clarity around solvents, volumes, timing of
        checks, and how partial vials are handled.
      </p>
      <ul>
        <li>Solvent choice and volume</li>
        <li>Verification timing</li>
        <li>Handle partial vials</li>
      </ul>

      <h2 id="math">04 - Check the math layer</h2>
      <p>
        Reconstitution math converts stock concentration into a usable dosing
        concentration. Good workflow software should make that conversion
        explicit, repeatable, and hard to mis-enter.
      </p>
      <div className="callout">
        <strong>Core formulas</strong>
        <p>Dose = target mass / concentration</p>
        <p>Volume needed = dose / stock</p>
        <p>Account for dead space</p>
      </div>
      <p>
        Spreadsheet-free workflows reduce miscalculations by removing manual
        re-entry and enforcing the sequence of operations.
      </p>

      <h2 id="system">05 - Prove the system of record</h2>
      <p>
        A serious protocol platform should be more than a calculator. It should
        serve as a system of record for protocols, dose records, inventory
        events, approvals, and audit history.
      </p>
      <ul>
        <li>Audit-ready records</li>
        <li>Version history and access control</li>
        <li>Real-time inventory updates</li>
      </ul>

      <h2 id="collaboration">06 - Compare collaboration and governance</h2>
      <p>
        Teams need shared spaces, clear ownership, and visible change history so
        that a dosing decision can be reviewed later without reconstructing it
        from memory.
      </p>
      <p>
        That means collaboration tools, role definitions, and governance rules
        matter as much as the dose calculator itself.
      </p>
      <ul>
        <li>Shared workspaces and tasks</li>
        <li>Comment threads and version history</li>
        <li>Defined collaboration norms</li>
      </ul>

      <h2 id="regen">07 - Explain how REGEN supports the categorized workflow</h2>
      <p>
        REGEN maps to the categorized workflow by consolidating steps from
        protocol creation through dosing and post-dose logging. It provides a
        single source of truth for decisions, integrates reconstitution math,
        and flags deviations as they happen.
      </p>
      <p>
        That fit matters because the best workflow tool is the one operators can
        actually trust on a busy day, when accuracy depends on the sequence,
        not just the formula.
      </p>
      <ul>
        <li>Maps to prep, mix, and dose stages</li>
        <li>Single source of truth for protocols and dose records</li>
        <li>Highlights deviations for quick review</li>
      </ul>

      <h2 id="requirements">08 - Review operational requirements and closing takeaways</h2>
      <p>
        Implementation should include data mapping, governance policies, and a
        training plan. Also account for privacy, security, and change
        management so the workflow improves without creating new failure modes.
      </p>
      <ul>
        <li>Clear user roles and approvals</li>
        <li>Audit-ready records and provenance</li>
        <li>Lot numbers, expiry fields, and vial lifecycle events</li>
      </ul>
      <p>
        The buying question is not whether a tool can store peptide data. It is
        whether it can keep dosing accurate, auditable, and collaborative when
        the workflow becomes real.
      </p>
    </>
  );
}

const post: PostMeta = {
  title: "What to Look for in Peptide Protocol Management Workflows for Dosing Accuracy",
  category: "Protocols",
  date: "July 12, 2026",
  readTime: "7 min read",
  cover: "/screens/screen-inventory.png",
  lead: "A practical guide for evaluating peptide protocol management software through the lens of dosing accuracy, workflow fit, auditability, and team collaboration.",
  author: { initials: "JA", name: "Jordan Avery", role: "Engineer, REGEN" },
  toc: [
    { id: "map", label: "01 Map the workflow" },
    { id: "steps", label: "02 Operational steps" },
    { id: "decisions", label: "03 Decision points" },
    { id: "math", label: "04 Math layer" },
    { id: "system", label: "05 System of record" },
    { id: "collaboration", label: "06 Collaboration and governance" },
    { id: "regen", label: "07 REGEN fit" },
    { id: "requirements", label: "08 Requirements and takeaways" },
  ],
  Content,
};

export default post;
