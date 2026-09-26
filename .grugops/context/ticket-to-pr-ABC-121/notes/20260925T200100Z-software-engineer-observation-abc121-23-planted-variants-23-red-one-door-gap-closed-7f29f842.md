---
id: 20260925T200100Z-software-engineer-observation-abc121-23-planted-variants-23-red-one-door-gap-closed-7f29f842
kind: observation
by: software-engineer
at: 2026-09-25T20:01:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ADR-0026
  - .grugops/context/validate-adr0026/notes/20260925T145600Z-architect-design-observation-bounded-oracle-misses-three-of-six-wrong-lmrs-7c1d05ab.md
  - .grugops/context/ticket-to-pr-ABC-121/probe/mutants.mjs
  - .grugops/context/ticket-to-pr-ABC-121/probe/mutants.json
  - .grugops/context/ticket-to-pr-ABC-121/probe/mutants-ledger.txt
supersedes:
---

# Planted variants: 23 of 23 red at `9823c27`, including the review's seven, each in the build itself; one survivor found and closed

Hand-authored, no `seal`. Harness: `probe/mutants.mjs`. It copies `src/` to a scratch tree outside
the repository and applies one exact-string mutation, asserting that the pattern matched once.
It runs the six search/engine test files in the default lane. For the review's seven variants,
and for any survivor, it also runs the deep `A1` rows (`SEARCH_DEEP=1 -t A1`). The full ledger,
naming every red row, is `probe/mutants-ledger.txt`.

## The review's seven (test note 6), in BOTH recursions at once

| variant | rows that red it (default lane / deep `A1`) | test note 6 expected |
|---|---|---|
| `tactical` | `A3` table ×4 / deep engine drift d5 | `A3` — ✅, plus the engine drift |
| `r2` | `A3` "exactly one ply" ×2, `A4` ×2 / mate floor | `A3` + mate floor — ✅, plus `A4` |
| `noLmrResearch` | **`A4` ×2 only** (search and engine); no deep row | `A4` only — ✅ exactly |
| `noResearch` | `A4` ×2 / drift d5 ×2 | drift d5 — ✅, plus `A4` |
| `early` | `A3` (index 2, depth 2), `A4` ×2 / drift d5 ×2 | drift max — ✅ |
| `gross` | 16 default rows / mate floor + drift ×2 | all — ✅ |
| `pvsNoResearch` | `ABC-077` `A1` (position-4 d2), `A4` ×2, `ABC-078` `A3` abort ×2, `ABC-080` Scope ×2, `ABC-081` `A5` / drift d5 ×2 | drift + mate floor — drift ✅, **mate floor did NOT red it** |

- **`pvsNoResearch` and the mate floor.** In the build, PVS's re-search lives in the one
  `searchMove` that `searchWithoutReductions` also runs. A PVS window bug therefore breaks both
  sides of the floor at once, and it compares broken with broken. The review's probe had a
  separate PVS-only reference. So the floor is not a PVS detector in this build; `ABC-077` `A1`
  is, as `ADR-0026` decision 5 intends, and it fired. **ADR-0026's Consequences list is
  optimistic on this one line.** Recorded for Architect/Design, and it changes no row.
- **`tactical` is red on the engine-shape drift at d5.** The review measured the fixed shape
  only, where it stays green.

## Sixteen more, one per wiring or clause

- Each recursion alone: `noLmrResearch` engine-only / search-only (`A4`'s own row each),
  `pvsNoResearch` engine-only / search-only (4 rows each), `noResearch` engine-only.
- Each predicate clause: `reduces-at-root`, `ignores-in-check`, `ignores-gives-check`,
  `ignores-promotion` (all red on `A3`'s table), and `no-unmake-in-predicate` (8 rows, `A3`'s
  purity check among them).
- Wiring: `search-literal-reduction` and `engine-bypasses-predicate` (red on `A3`'s source row),
  `door-withoutReductions-reduces` (the default PVS-identity guard), `door-pre121-has-pvs`
  (12 merged work rows), `engine-door-pre121-has-pvs` (`ABC-080` `G1` 358, `ABC-081` `A3`).
- **`engine-door-withoutReductions-reduces` SURVIVED every lane at first**, the deep `A1` rows
  included. With the engine's reference reducing, it IS `chooseMove`, so the engine drift and
  `A4`'s engine row compare it with itself. **Closed** by one default-lane row, "the engine doors
  bite": kp-vs-k deepened to d6, the reference scores what the pre-`ABC-121` engine scores and
  spends different nodes from `chooseMove`. The mutant was re-run and is now red. The row went
  into commit 2 by amend, before anything was pushed or shared.

## What this ledger does not show

- These are 23 plausible bugs, not every bug; the review's caveat `…b58e2d14` item 1 stands.
- The harness has no timeout per mutant. None hung.
