---
id: 20260812T200200Z-ba-pm-decision-two-rows-written-against-the-grammar-not-a-longer-list-3d0a2b15
kind: decision
by: ba-pm
at: 2026-08-12T20:02:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ADR-0011
  - A6.1
  - A6.2
  - A6.3
  - A6.4
  - A5.2
  - A5.6
  - L3
  - L4
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
supersedes:
---

# `A6.3` and `A6.4` are written against the GRAMMAR, because a longer list is exactly the defect that produced `Wtypebrace` and `Wenumerated`

> **`kind: decision`** — the row wording, the naming, and what was deliberately NOT written are BA/PM's
> and are recorded here. The measurements they rest on are in the sibling `observation` and every one
> is a run. Soft kind, no stamp required, none claimed.

## The instruction this hop was given, and the answer

The Orchestrator's brief: *"`G1` is a criterion defeated by the next spelling of the class it was
written to catch. Write the row so the spelling after this one is also covered, or say plainly that it
is not and name the limit in the ticket."*

**Both. The row covers the whole class, and the one variant left below it is named as `L3`.**

## `A6.3` — the type-only exclusion is pinned to the WORD, not to the brace

**The set is CLOSED BY GRAMMAR, and that is why the row is not four more samples.** After the `type`
keyword in a type-only declaration carrying a specifier, TypeScript admits exactly **three** clause
shapes and no fourth:

| clause shape | `import` | `export` |
|---|---|---|
| `{ … }` | `import type { A } from` | `export type { A } from` |
| `* [as ns]` | `import type * as ns from` | `export type * from` · `export type * as ns from` |
| bare identifier (default) | `import type Default from` | **not a form** |

`import type Default, { A } from` is `TS1363` and does not exist. **There is no sixth cell for a next
spelling to arrive in** — which is a stronger statement than *"we sampled more spellings"*, and it is
the reason `A6.3` covers the build after `Wtypebrace` rather than only `Wtypebrace`.

**The row's four witnesses are `A6.2`'s two `{ … }` rows' complement**, and `export type * as ns` is in
there deliberately as the `*` shape's **second spelling**, to demonstrate that the shape and not the
spelling is what is pinned.

## `A6.4` — the runtime-importer forms are GENERALISED, not enumerated

`Wenumerated` misses `export * as history from "./history.ts";` — ordinary ESM, `WLAUNDER`'s own
laundering shape. The row requires the guard RED on it.

**The honest bound, and it differs from `A6.3`'s.** `Wenumplus` — the same enumeration with `as <ident>`
patched into its star branch — passes `A6.4`, and **measured, it is not wrong**: against the ESM
re-export clause set (`*`, `* as ns`, `{ … }`, also closed) it agrees with the generalisation on every
build run at this hop, including the multi-line brace forms. **So `A6.4` selects the generalisation over
one SPECIFIC enumeration and cannot forbid enumeration as a technique.** That is the same
verdict-not-technique shape `A6.2`'s ceiling note already argues for, and it is stated in the ticket
rather than left as an implied stronger claim.

**The argument FOR the generalisation is historical, not speculative: `export * as ns from` was added
to ESM in ES2020.** The clause set an enumeration must track **has grown once already** — which is
precisely how `Wenumerated`'s author enumerated correctly for the language they learned and still
missed a form. **That is an argument for the row; it is not a claim the row enforces it.**

## `L3` — the limit, named because it could NOT be closed with a row

**`Wtypespace`** (`(?!type\b)` → `(?!type\s)`) is green on all six type-only witnesses and passes every
row on this page. **The only build that separates it from the landed expression is `WTYPETIGHT`** —
`import type{ GameHistory } from "./history.ts";` — landed **green**, `Wtypespace` **RED**.

**Measured: `biome check` REJECTS `WTYPETIGHT`.** So **no lint-clean witness separates them**, and a
required verdict on a build the `lint` gate already refuses would be a row against source that cannot
exist in this repo. **Marked as `L3` with an owner and a trigger rather than smoothed into a row that
reads stronger than it is.** Its trigger is deliberately the SAME as `L2`'s anchoring clause, so one hop
clears both.

*(`Wtypeset` — the three clause shapes enumerated explicitly — also passes `A6.3` and is **not wrong**:
on lint-clean source it is behaviourally identical to `(?!type\b)`. Recorded in the ticket so nobody
reports it as an eleventh wrong build.)*

## `L4` — one measured false negative of `(?!type\b)`, not constructible here

`import type from "./history.ts";` — a default import whose binding is named `type` — is a real runtime
importer and the landed expression is **green** on it. **Not constructible as a working build**:
`src/history.ts` has zero default exports. **Bounds the mutant's fidelity, not the row's validity, and
it is NOT a defect in the containment** — `(?!type\b)` remains the right token and every alternative
measured at this hop misses it too. Trigger: the first `export default` added to `src/history.ts`.

## What I did NOT touch, and it is on the record because the pressure ran the other way

- **`A5.2` — NOT touched, and I am saying so loudly as the brief requires.** QE established it is **the
  only positive-detection witness in the whole criteria set** — the only row requiring the guard to
  actually FIND a real runtime importer, at a real line, in this codebase's own inline-type spelling
  (`src/turn-loop.ts:52`). It is also the row that closes `L2`'s over-anchored half. **Not a word of it
  moved.** I re-ran its shape as a negative control instead: `import { type GameHistory, newGame } from
  "./history.ts";` is **RED** under landed, `Wtypespace` and `Wtypeset` alike, so none of the candidate
  expressions weakens it. *(Related and worth carrying: under this repo's `verbatimModuleSyntax: true`,
  even an all-inline-type `import { type GameHistory } from "./history.ts";` still evaluates the module
  body — measured **RED**, correctly.)*
- **`A5.6` — NOT touched.** QE settled that it adds nothing the build did not already have **and is not
  vacuous** — it is `W4count`'s sole catcher — and that the Engineer's refusal to take credit was right.
  **Not re-opened.**
- **`A6.2`'s justification — NOT weakened.** QE confirmed the asymmetry is **structural**: BASE
  witnesses the `import` side of type-blindness and is structurally incapable of witnessing the `export`
  side. `A6.3` sits **beside** it and does not subsume it: `A6.3`'s four builds are all green under
  `Whalfguard` too, so `A6.2` remains the sole catcher of `Whalfguard` and neither row may be dropped
  for the other.
- **`ADR-0011` — READ, NOT OPENED FOR EDIT, and no row implies it is wrong.** Both new rows are
  satisfied by the ruled expression verbatim; no clause, alternative or ledger row is implicated. **The
  brief's stop condition — *if a row implies the ADR is wrong, say so and stop* — did not fire, and I
  checked it deliberately rather than by omission.**
- **`plans/board.md`, `plans/nfr-catalog.md`, `ABC-028`, `ABC-019` and every merged ticket — NOT
  opened for edit.** No `src/` byte written.
