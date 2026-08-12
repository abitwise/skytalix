---
id: 20260812T200300Z-ba-pm-observation-L2-was-banked-and-is-false-and-the-two-halves-are-asymmetric-4e1b3c26
kind: observation
by: ba-pm
at: 2026-08-12T20:03:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ADR-0011
  - L2
  - A5.2
  - A6
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
supersedes:
---

# `L2` said the anchor closes the false-positive risk "by construction". It does not — and the two halves are ASYMMETRIC: every false NEGATIVE the anchor causes is contained by `lint`, and the false POSITIVE it causes is not

> **`kind: observation`.** Every verdict below is a run at this hop, against the landed expression at
> `src/history-pane.nfr.test.ts:317` and through this repo's own `@biomejs/biome 2.5.5`. No stamp is
> claimed; `human_admission` is `off`.

## What `L2` banked, and what is wrong with it

`L2` was written at `refinement-ABC-029-rows`, a hop that **did not open `src/`** (`## Test notes` 12).
It says `ADR-0011`'s ruled expression *"IS anchored, so an Engineer landing it verbatim satisfies this
by construction"*. **The Engineer's own trace row then banked it forward — *"`ADR-0011`'s ruled
expression landed BYTE-IDENTICAL, so limit `L2` closes by construction."*** A limit was recorded as
closed on the strength of a sentence nobody had run.

**Two things are wrong, both measured:**

1. **The other anchoring direction is closed by a ROW, not by construction, and `L2` never mentioned
   it.** The over-anchored variant (`/m` dropped) dies on **`A5.2`** — because
   `src/turn-loop.ts:52` holds an **inline** type modifier at **line 52**, so `A5.2` is the only row
   that requires the guard to find a real importer at a real line number.
2. **The false-positive risk `L2` attributes to the UNANCHORED variant is carried by the ANCHORED one.**

## The measurement, run at this hop

| build | line prepended to `src/zobrist.ts` | **landed (anchored)** | **delivered (pre-containment)** | **`biome check`** |
|---|---|---|---|---|
| **`WEXPORT-STRING`** | `export const HISTORY_SPEC = 'from "./history.ts";';` | **RED — false positive on a correct build with ZERO runtime imports** | **green** | **PASSES — UNCONTAINED** |

**Why the anchor stopped helping.** The delivered expression required a line to begin with `import`,
and in valid TypeScript a line beginning `import` + whitespace **is** an import statement. **A line
beginning `export` + whitespace is an ordinary declaration** — `export const`, `export function`,
`export class`. The widening moved `[^;]*` from a surface where it could only span import syntax onto
one where it can span **arbitrary initialiser text**, including a string that quotes the specifier.
**`L2`'s own trigger — *the first production module that quotes `"./history.ts"` inside a comment or a
string* — now fires against the ANCHORED expression, which `L2` says it cannot.**

## THE COMPENSATING HALF, RE-MEASURED AND PUT BESIDE THE LIMIT RATHER THAN LEFT IN A NOTE

The Orchestrator's instruction was explicit: keep the compensating half **beside** the restated limit,
in the ticket. It is now in `L2` itself. Re-run at this hop, not cited:

| spelling the landed regex MISSES | `biome check` |
|---|---|
| `  import "./history.ts";` (indented) | **FAILS — contained** |
| `import { newGame } from './history.ts';` (single-quoted) | **FAILS — contained** |
| `import { newGame } from "./history.ts"` (no semicolon) | **FAILS — contained** |
| `import { newGame } from "./history.ts" ;` (space before `;`) | **FAILS — contained** |
| `import{newGame}from"./history.ts";` (no whitespace) | **FAILS — contained** |

**Five for five. QE's containment argument reproduces independently.**

## THE SENTENCE WORTH CARRYING FORWARD

**The two halves are asymmetric, and that asymmetry IS the limit.** Every **false negative** the anchor
causes is caught by `lint`; the **false positive** the widening causes is not. **`biome check` passes on
`WEXPORT-STRING`.** So the anchor's cost is contained and its benefit is not — the opposite of what the
struck text claims.

**Method note, because a containment claim was nearly built on a bad measurement.** My first biome run
reported `WEXPORT-STRING` as *contained*. It was an artefact of my own mutation — prepending with a
single newline puts the statement against the file's docblock and trips
`assist/source/organizeImports`. Caught by running the **unmutated control** through biome. Every
verdict above was re-taken with a blank line after the prepended statement, and the unmutated
`zobrist.ts` **passes**. **Recorded rather than quietly fixed.**

## What is NOT claimed, and what did NOT move

- **How big it is, without inflation.** The rare part is not the `export` prefix; it is
  `from\s+"./history.ts";` inside a semicolon-free span. **No production module holds such a string
  today** — this ticket's own `A4` sweep is why that is a measurement. **The defect is the RECORD
  claiming the risk was closed, not the expression carrying it.**
- **No row moves and the expression is NOT re-opened.** `WEXPORT-STRING` is a correct build and no
  criterion says it must be green, so this is a **marked limit**, not a required verdict. Converting it
  into one would need a comment/string discriminator, which `ADR-0011`'s own priced rejection already
  calls *"a harder expression"* — and that condition is now named in the size rationale.
- **`ADR-0011` was READ, NOT OPENED.** Its cost-3 sentence (*"anchored … fences them from block-comment
  continuation lines"*) is too strong in the same way, is **pre-existing in kind**, and sits in the
  rationale for a **rejected** alternative — Architect/Design's, on its existing trigger. **Nothing here
  asks for an ADR change, and no row of mine depends on one.**
- **One unstated condition recorded once:** the containment's *"the residual is the two dynamic forms"*
  is **conditional on `lint` staying in `quality.mandatory_gates`** (it is: `["lint","typecheck","unit","build"]`)
  **and on `biome.json`'s formatter config.** Neither is asserted by any criterion. A documentation gap,
  **not worth its own hop**, and it is now written where the next reader of `L2` will hit it.
