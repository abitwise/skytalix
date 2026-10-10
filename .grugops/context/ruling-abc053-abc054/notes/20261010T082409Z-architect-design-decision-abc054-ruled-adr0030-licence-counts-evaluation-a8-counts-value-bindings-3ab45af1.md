---
id: 20261010T082409Z-architect-design-decision-abc054-ruled-adr0030-licence-counts-evaluation-a8-counts-value-bindings-3ab45af1
kind: decision
by: architect-design
at: 2026-10-10T08:24:09Z
verified_by:
confidence: high
refs:
  - ABC-054
  - ABC-041
  - ABC-057
  - ADR-0030
  - ADR-0011
  - src/history-pane.nfr.test.ts
  - src/render-seam.test.ts
  - tsconfig.json
  - 20261010T082409Z-architect-design-observation-premises-rechecked-and-the-ledgers-behind-adr0029-adr0030-151fda8a
supersedes:
---

# `ABC-054` ruled in `ADR-0030` (proposed): the licence counts EVALUATION and is already right. `A8` counts VALUE BINDINGS. Half the premise does not hold

This decision is hand-authored. The evidence is note `…151fda8a`.

## Said plainly, because the ticket was cut on it

**The "false RED" half of `ABC-054`'s premise does not hold.** Under this repository's `verbatimModuleSyntax: true`
(set since 2026-07-22, before the cut), `import { type X, type Y } from "./m.ts"` **evaluates `m.ts`**. That was
measured under Node type stripping, which is the shipped runtime, and under vitest. The licence guard holds
`ADR-0011` clause 3's *evaluation* property, so **its red on that form is a true red.** The "false GREEN" half
holds, and it is the only defect: `A8` borrowed the evaluation instrument for a consumption claim.

## The ruling

- **Licence guard: "imports" = evaluates.** The regex is **unchanged**. The docblock states that the inline
  all-type form counts and why, and that the repair is `import type` (`A3`). That is prose only, the Engineer's.
- **`A8`: "consumes" = an `import` statement binding at least one value** (a default, `* as ns`, or a non-`type`
  brace specifier). Re-exports are excluded, which fails safe. Read textually from the specifier list, with no new
  dependency. On `X3b` it reports `render.ts` → **`[]`** (`A2`); on BASE it reports ≥ 1 for each of the three
  (`A4`). Both were measured with a reference implementation.
- **`A1`'s six cells** are in `ADR-0030`. Only one cell differs between the two guards: the inline all-type
  form, which counts for the licence and does not count for `A8`.
- **The second-implementation property is NOT adopted** (it is out of the ticket's scope, as cut).

## Owed elsewhere, not done here

- **Owner:** accept `ADR-0030`, or not.
- **BA/PM:**
  - re-score `ABC-054` DoR item 10. This hop marked only part (ii) with the ADR id. Part (i), the ordering on
    `ABC-041`, is met (`ABC-041` is `Done`) but is not this ruling's to discharge;
  - re-cut `ABC-054`'s scope to match: the licence half becomes docblock prose;
  - `ABC-041` `A8`'s wording changes "runtime importer" to "runtime consumer";
  - pair the licence docblock prose with `ABC-057`, which is the same paragraph.
- **Residuals `C1` / `C2`** (an unused-but-imported value binding counted as a consumer; a re-export chain
  under-counted) are owned by Architect/Design, with their triggers in the ADR.
