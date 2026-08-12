---
id: 20260812T102500Z-qe-e2e-observation-sole-catchers-and-the-new-false-positive-9c6e3a2b
kind: observation
by: qe-e2e
at: 2026-08-12T10:25:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ADR-0011
  - A6.1
  - A6.2
  - A5.6
  - L2
  - src/history-pane.nfr.test.ts
supersedes:
---

# The three targets, answered by measurement — `A6.2` IS the sole catcher, `A5.6` adds nothing this build did not already have, and the widening opened ONE new false-positive class that `lint` does not contain

> **`kind: observation`, not `finding`** — no `§14-gate` verdict record under this task,
> `human_admission` **`off`**. Every verdict below is a run.

## Target 1 — is `A6.2` genuinely the sole catcher of `Whalfguard`? **YES, and it is the only row of the fourteen that touches it**

`Whalfguard` was run against **all fourteen** required verdicts. **Twelve are satisfied. Exactly two
kill it, and both are `A6.2`'s type-only rows:**

- `WTYPEREEXPORT` → `expected [ 'zobrist.ts' ] to deeply equal []`
- `WTYPEREEXPORT-PANEL` → `expected [ 'status-panel.ts' ] to deeply equal []`

It is green on BASE on **both** trees, RED on all four `A6.1` verdicts with the correct build's
messages verbatim, green on `WPERFT-DYN` on both trees, and RED on `A5.3`, both `A5.4` builds and
`A5.6`. **The Engineer's claim is upheld and it was not accepted — it was re-run.**

**So `A6.2`'s stated justification is NOT weaker than written. It is exactly as strong as written,
and the reason is structural, not lucky.** The two type-only spellings are asymmetric: the `import`
side IS witnessed by BASE (both `history-pane.ts:61` and `status-panel.ts:42` hold
`import type { GameHistory } from "./history.ts";`), so the mirror-image half-guard dies on
`A5.1`/`A5.2` without any constructed build. The `export` side is not witnessed by BASE, because **no
production module holds a re-export of any local module** — so `Whalfguard` walks past every row that
runs on committed source. **`A6.2` is the only place that asymmetry is closed.**

**And now the limit, stated plainly because the brief asked for it plainly.** `A6.2`'s only witness
must be **CONSTRUCTED**. Nothing in the committed suite goes red if a later hop regresses the
expression to `Whalfguard`: `npm test` is 752/752 under `Whalfguard`, on both trees. **The row is
only as good as the next person re-running it out of tree.** That is a real, nameable limit and it is
not a defect in the row — it is the price of a property whose failing witness this tree is
structurally incapable of producing. The honest containment is that `A6.2` is written down at all;
the honest residual is that it is **not executable in CI** and no criterion says so.

## Target 2 — can a build satisfy both and still be wrong? **YES. Two of them.**

`Wtypebrace` (false-positive direction, three correct type-only builds turned RED) and `Wenumerated`
(false-negative direction, `export * as ns from` missed). Both pass all fourteen. Full matrix in the
sibling `failed-attempt`. **`A6.1` + `A6.2` as a conjunction is genuinely stronger than either alone
— and it is still not tight.**

## Target 3 — is `A5.6` doing anything the delivered expression did not already do? **NO — and it is still not vacuous**

**Measured on `WSWAP`, tree 17:**

| expression | assertion | verdict |
|---|---|---|
| **delivered** | `toEqual` | **RED** — `expected [ 'zobrist.ts' ] to deeply equal [ 'turn-loop.ts' ]` |
| **landed** | `toEqual` | **RED** — identical message |
| **delivered** | `W4count` (`toHaveLength`) | **green** |
| **landed** | `W4count` | **green** |

**`A5.6`'s verdict is expression-independent.** It is a row about the ASSERTION; the containment
changed only the EXPRESSION; the row was met before this build and is met after it, and **this build
neither earned nor endangered it.** The Engineer taking no credit is correct.

**But it is not vacuous, and I tested that rather than assuming it.** `W4count` was run against all
fourteen verdicts: it satisfies **thirteen** — including all four `A6.1` rows, where it goes RED on
cardinality (`expected [ 'zobrist.ts' ] to have a length of +0 but got 1`;
`expected [ 'turn-loop.ts', 'zobrist.ts' ] to have a length of 1 but got 2`) — and it is **GREEN on
`A5.6`'s `WSWAP`, alone.** **`A5.6` IS the sole catcher of `W4count`, measured, and `A6` did not
subsume it.**

**Two honest bounds on the row, neither of which makes it wrong:**

1. **`A5.6` cannot be observed on the tree the gate runs on.** Its `Given` needs a licence entry whose
   file exists, and this tree has none. Same shape as `A5.2`–`A5.5`, and by design — recorded so a
   reader does not go looking for it in a gate log.
2. **The `WSWAP` mutant as constructed does not typecheck** — `tsc --noEmit` on that tree gives six
   `TS2304 Cannot find name 'gameStatusOf' / 'takeBack' / 'playMove'`, because making the loop's
   import type-only leaves its runtime bindings undefined. The guard reads SOURCE TEXT, so the verdict
   is unaffected; and a **compiling** equivalent is constructible (a loop that legitimately stops
   calling the history module). **So this bounds the mutant's fidelity, not the row's validity, and I
   am not reporting it as a defect.**

## What the widening COST that nobody named — one NEW false-positive class, and `lint` does not contain it

`ADR-0011`'s cost-3 block argues that *"the static halves are anchored (`^`, `/m`), which is what
fences them from block-comment continuation lines"*, and `L2` says an Engineer landing the anchored
ruled expression *"satisfies this by construction"*. **Measured on the landed build, tree 16:**

| build | line prepended to `src/zobrist.ts` | required | **landed** | **delivered** | **`biome check`** |
|---|---|---|---|---|---|
| **`WEXPORT-STRING`** | `export const HISTORY_SPEC = 'from "./history.ts";';` | green | **RED — false positive** | **green** | **PASSES — uncontained** |
| **`WCOMMENT-REEXPORT`** | a `/* … */` block holding `export { repetitionCounts } from "./history.ts";` at column 0 | green | **RED — false positive** | **green** | **PASSES — uncontained** |
| `WCOMMENT-IMPORT` (control) | the same block with the `import` keyword | green | **RED** | **RED** | — |

Both false positives report `expected [ 'zobrist.ts' ] to deeply equal []` — **a correct build with
zero runtime imports of `history.ts`, turned red.**

**The split, stated honestly rather than charged wholesale to this build:**

- **`WCOMMENT-REEXPORT` is PRE-EXISTING IN KIND.** The control proves it: the delivered expression is
  RED on the same block with the `import` keyword. Anchoring fences a **JSDoc continuation line**
  (` * …`) — which is what this codebase writes — but it does **not** fence a column-0 line inside a
  bare `/* … */` block. **`ADR-0011`'s cost-3 sentence is too strong as written**, and it was written
  about a rejected alternative, so nothing turns on it.
- **`WEXPORT-STRING` is NEW, and it is this widening's own cost.** The delivered expression required a
  line to begin with `import`, and in valid TypeScript a line beginning `import` + whitespace is an
  import statement. **A line beginning `export` + whitespace is an ordinary declaration** —
  `export const`, `export function`, `export class` — so the widening moved `[^;]*` from a surface
  where it could only span import syntax onto one where it can span **arbitrary initialiser text**,
  including a string that quotes the specifier. **`L2`'s trigger is *"the first production module that
  quotes `"./history.ts"` inside a comment or a string"* — that trigger now fires against the
  ANCHORED expression, which `L2` says it cannot.**

**Neither is contained by the `lint` gate — measured, not reasoned:** the repo's own
`@biomejs/biome 2.5.5` exits `0` on both sources.

**How big is it? Small, and I will not inflate it.** The rare part is not the `export` prefix, it is
`from\s+"./history.ts";` appearing inside a semicolon-free span. No production module holds such a
string today. **The defect is the RECORD claiming the risk is closed, not the expression carrying it.**

## The containment argument that DOES hold — verified at source rather than cited

The docblock's *"THE RESIDUAL IS THE TWO DYNAMIC FORMS"* leans on `lint` containing every other
spelling the anchored expression misses. **Every one was built and run through the repo's own biome:**

| spelling | landed regex | `biome check` |
|---|---|---|
| `  import "./history.ts";` (indented) | MISSED | **FAILS — contained** |
| `import { newGame } from './history.ts';` (single-quoted) | MISSED | **FAILS — contained** |
| `import { newGame } from "./history.ts"` (no semicolon) | MISSED | **FAILS — contained** |
| `import { newGame } from "./history.ts" ;` (space before `;`) | MISSED | **FAILS — contained** |
| `import{newGame}from"./history.ts";` (no whitespace) | MISSED | **FAILS — contained** |

**Five for five. QE's old containment argument is now a measurement instead of an argument.** The one
thing the docblock does not say is that the residual is **conditional on `lint` staying in
`mandatory_gates` and on `biome.json`'s formatter config** — an honest documentation gap, not a
defect.
