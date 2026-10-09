---
id: 20261009T164755Z-architect-design-observation-scratch-checks-a1-replaced-a2-hit-rates-a4-discard-mutant-39129557
kind: observation
by: architect-design
at: 2026-10-09T16:47:55Z
verified_by:
confidence: high
refs:
  - ABC-082
  - ABC-079
  - ABC-081
  - ABC-121
  - ADR-0026
  - ADR-0028
  - src/quiescence.test.ts
  - src/transposition.test.ts
  - src/search.pvs-lmr.test.ts
  - src/search.ts
  - .grugops/context/ruling-abc082-levels/probe/scratch-checks.sh
  - .grugops/context/ruling-abc082-levels/probe/scratch-checks.out.txt
  - .grugops/context/ticket-to-pr-ABC-082/probe/mutants-ledger.json
supersedes:
---

# Scratch-copy checks: A1 green with the replacement pair and red under no-quiescence; A2 on base, branch and a never-store mutant; A4's `search()` row: only fixture (b) reds a "re-search but discard it" mutant

Hand-authored, no `seal`.

**Method.** `bash probe/scratch-checks.sh <repo> <scratch>`. Every check runs in a fresh
`git archive` copy of a commit with `node_modules` symlinked. The real `src/` is never edited.
Base is `5ebe1d8` and the branch is `bef7d43`. Run 2026-10-09T16:46:22Z, load 2.06 / 2.53 / 3.91,
Apple M3. Output is verbatim in `probe/scratch-checks.out.txt`. Everything was also run once by
hand at 16:42–16:44Z, with the same readings.

## Ruling 1: `ABC-079` `A1` with the C2 pair in place (two FEN edits, `src/quiescence.test.ts:206`, `:218`)

- `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts`: **37 passed (37)**.
  `A1 depth 3: losing capture chosen 0/24 with quiescence, 0/24 without`.
- **Mutant:** both of A1's with-quiescence arms are swapped to `searchWithoutQuiescence`. The
  depth-1 row is **red**: 24 > 1. The depth-3 row stays green at 0/24.
  - That is pre-existing and documented in the row's own comment: at depth 3 the bare leaf sees
    the recapture too, so that arm is reported, not asserted.
  - The depth-3 row guards against regressions. It does not discriminate quiescence. The
    replacement leaves that unchanged.

## Ruling 2: `ABC-081` `A2` (deep rows, plus the position-3 default guard printed by an added `console.log`)

| tree | position-3 d4 (default guard) | kiwipete fixed d5 | position-6 fixed d5 | kiwipete ID→5 | position-6 ID→5 |
|---|---:|---:|---:|---:|---:|
| base `5ebe1d8` | 21.80% | 15.95% | 15.38% | 39.58% | 45.08% |
| branch `bef7d43` | 16.22% | 15.63% | **14.46%** (red at 15%) | 40.54% | 44.98% |
| branch, mutant: `search.ts` interior never stores | **0.00%** | **0.00%** | **0.00%** | 40.54% | 44.98% |

- The default guard moved the most (−5.58 pp). It stays green at 15%, but only by 1.22 pp.
- The mutant's ID columns do not move because `deepenTo` runs `engine.ts`'s own recursion, which
  the mutant does not touch. The fixed columns are the ones the assertions read: all three are
  red.

## Ruling 3: `ABC-121` `A4` `search()` row, (b) `A4_SEARCH_FEN` `[10, "b1c1"]` against (a) `A4_FEN` `[95, "h5e5"]`

- **The Engineer's six re-search mutants die at the re-search COUNT assertion on both
  fixtures.** `mutants-ledger.json`: each one fails with "no reduced fail-high was re-searched …
  expected 0 to be greater than 0". So they do not tell (a) from (b).
- **New mutant:** `searchMove` in `src/search.ts` runs the full-depth LMR re-search and throws its
  result away (`score =` becomes `const discarded =`). The count assertion passes, because the
  re-search happens.

| fixture on the `search()` row | clean | discard mutant |
|---|---|---|
| (b) `A4_SEARCH_FEN`, `[10, "b1c1"]` (the branch) | 20 / 20 | **red**: `expected -20 to be 10` |
| (a) `A4_FEN`, `[95, "h5e5"]` (reverted) | 20 / 20 | **20 / 20, survives** |

- The `chooseMove` row cannot see this mutant: it runs `engine.ts`'s recursion.
- So under (a), nothing in `search.pvs-lmr.test.ts`'s default lane reds a `search()` that does
  the re-search and ignores it.
