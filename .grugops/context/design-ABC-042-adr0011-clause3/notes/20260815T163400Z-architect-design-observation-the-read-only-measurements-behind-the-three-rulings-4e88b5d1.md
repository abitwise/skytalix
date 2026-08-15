---
id: 20260815T163400Z-architect-design-observation-the-read-only-measurements-behind-the-three-rulings-4e88b5d1
kind: observation
by: architect-design
at: 2026-08-15T16:34:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - G6
  - Q3
  - E2
  - ADR-0011
  - ADR-0002
  - src/history-pane.nfr.test.ts
supersedes: 
---

# The read-only measurements the three rulings rest on — protocol first, so a later hop can reproduce or refute them

> **Neutral `observation`.** No `kind: finding` is admissible on this install; nothing here is stamped
> and nothing here needs to be. **Every number below is a READ of the delivered tree at base
> `grugops/refinement-ABC-042-a6-nearmiss` @ `59ea767`.**

## Protocol

The guard's own expression and file enumeration were transcribed from `src/history-pane.nfr.test.ts`
(`productionModulesIn`'s `readdirSync` filter, and the containment expression at `:324`) and applied
under `node -e` **in place, read-only**. **Nothing under `src/` was opened for writing, no file in any
worktree was written by a measurement, and the suite was not run** — this hop changes no executable
byte, so there is nothing for a suite run to tell me that the ticket's own gate has not already told the
tree.

## 1. The licence census at the delivered tip — `G6`'s premise

| | |
|---|---|
| production modules (clause 1) | **20** |
| `runtimeImporters` of `src/history.ts` under the containment expression | **`["cli.ts", "turn-loop.ts"]`** |
| `LICENSED_DRIVERS` (`:219`) | **`["turn-loop.ts", "cli.ts"]`** |
| the equality | **holds — the guard is green and the licence is correct** |

**So clause 3's PROPERTY is satisfied and its INSTRUMENT is green.** The gap is entirely in the sentence
that says who may be in that array — which is what makes this a wording ruling and not a defect report.

## 2. `ADR-0002`'s two clauses, quoted rather than paraphrased — `G6`'s two faults

- **clause 4** (`:146-147`): *"`gameStatus`'s `positionCounts` gets exactly one supplier: the history
  module. No other caller constructs that map. The signature does not change."* — **no driver is
  required by it, and nothing about importing is stated.**
- **clause 2** (`:134-136`): *"One module above the core owns the game, and its authoritative state is
  the move list. A small history module (`src/history.ts` …) owns exactly `{ the initial position,
  Move[] }`"* — **the game-owning module is `src/history.ts`, the IMPORTEE.**

## 3. The comparator and what pins it — `Q3`'s premise

| | |
|---|---|
| the comparator | `:335`, `expect(runtimeImporters).toEqual(production.filter(…))` |
| occurrences of that comparison in the file | **one** |
| assertions pinning it | **zero** |
| the sibling tripwire that DOES exist | `:441-442`, pinning `/<expression>/m.test(` — the **regex literal**, not the comparator |
| the block that already reads the file into `instrument` | `:437-443` |

**The repair's site is therefore a block that is already reading the file**, which is why the price is
four lines and no new I/O.

## 4. `process` across all 20 production modules — `E2`'s premise

| spelling | modules |
|---|---|
| `process.argv` (any bracket or dot form) | **`cli.ts` only — zero merged modules** |
| `process.stdout` / `process.stderr` | `cli.ts`, `frame.ts`, `glyph-mode.ts`, `turn-loop.ts` |
| …of which a real acquisition or read | **`cli.ts`** (the two handles) and **`glyph-mode.ts:117`** (`isTTY`, the named merged exception) |
| …of which docblock text only | `frame.ts:21,25,209`; `turn-loop.ts:151` |
| `process.` at all | the four above plus `perft-bench.ts`, `render.ts`, `status-panel.ts` |

**Two readings this table kills.** A whole-tree occurrence test for `A9` reds on a correct tree at four
docblock sites. And `E2` is not live: there is no merged module for a widened guard to catch.

## 5. What I did NOT measure, so nothing here is over-read

- **No build was constructed and no mutant was run.** Every previous ruling of mine on this ticket
  carried a constructed-build ledger; this one does not, because **no ruling here changes what any
  instrument does**. `M15` (`Q3`'s weakening) is QE's measurement at `quality-gate-ABC-042` and is cited,
  not reproduced — reproducing it would prove a defect nobody disputes and would cost a suite run.
- **The clause-3 admission test cannot be measured at all.** No instrument reads that sentence, so
  "which builds change verdict" is not a question about it. Section 3 of the `G6` decision states the
  reading I performed instead, and labels it a reading.
- **No lane figure is claimed.** Nothing in this hop touches a test lane, and the four lines `Q3`'s row
  will cost are an in-memory `String.includes` — **not a lane reading and must not be quoted as one.**
