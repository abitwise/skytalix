---
id: 20260925T084700Z-software-engineer-observation-abc080-18-mutants-18-killed-m11-found-surviving-then-closed-e4a2c9f0
kind: observation
by: software-engineer
at: 2026-09-25T08:47:00Z
verified_by:
confidence: high
refs:
  - ABC-080
  - ABC-079
  - src/search.ts
  - src/engine.ts
  - src/quiescence.ts
  - .grugops/context/ticket-to-pr-ABC-080/probe/mutants.mjs
  - .grugops/context/ticket-to-pr-ABC-080/probe/mutants.json
supersedes:
---

# ABC-080 mutants: 18 run, 18 killed in the DEFAULT lane. M11 survived the first pass and was closed

Hand-authored, no `seal`. `probe/mutants.mjs` applies each mutant as one string replacement,
runs the default lane of `search.ordering`, `search`, `engine`, `quiescence` and `search.qe`
test files (vitest JSON), and writes the original bytes back. `git status` was clean of `src`
changes after each run. Full failing-row lists: `probe/mutants.json`.

| mutant | killed by (default lane) |
|---|---|
| M1 comparator does not sort | 11 rows: comparator units, `A3` guard, `A4` pins, Scope tie, `quiescence` fingerprint |
| M2 comparator sorts ascending | 13 rows, including `engine` `A2` node bound and `A4` behavioural depth |
| M3 `search.ts` never offers killers | `A4` d2 pin, `A6` search |
| M4 `search.ts` offers killers of ply+1 | `A4` d2 pin, `A6` search |
| M5 `search.ts` records killers at ply+1 | `A4` d2 pin, `A6` search |
| M6 one killer table shared by every `search()` | `A6` ×2, three `quiescence` `A4` node rows |
| M7 `engine.ts` interior unordered | `A6` chooseMove (**one row**) |
| M8 `engine.ts` MVV-LVA only | `A6` chooseMove (**one row**) |
| M9 `engine.ts` offers killers of ply+1 | `A6` chooseMove (**one row**) |
| M10 `engine.ts` table shared across calls | `A6` chooseMove (**one row**) |
| M11 `engine.ts` root list unordered | Scope tie row (**one row, added for it**) |
| M12 killers ranked above captures | `A4` d2 pin, `G4` node pin |
| M13 `mvvLvaKey` promotion term dropped (`ABC-079` QE `G4`) | comparator promotion row, `G4` node pin (275) |
| M14 `KillerTable` records captures | killer-table unit, `A4` d2 pin |
| M15 hash move ignored | comparator hash row (**unit only; the arm is dormant**) |
| M16 killer duplicate check removed | killer-table unit (**one row**) |
| M17 one killer slot, not two | killer-table unit (**one row**) |
| M18 killer slots offered oldest first | comparator killer row, `A4` d2 pin |

**M11 survived the first pass.** Neither the identity sweep (move + score) nor any other row
saw an engine whose ROOT list was left in generation order. Root order decides ties only, and
no sweep position has a tied best move. The ruling's point 3 ("both recursions consume the same
comparator") was therefore unguarded at the root. It is now closed by the tied-root row,
`ac5215c`: position-6 after 1. Bxf7+, Rxf7 = Qxf7 = 230 at d1.

**Thin, and named so a QE hop can thicken it if it wants.** M7–M10 (the engine's interior
ordering and its killer table) die on ONE row each, `A6`'s chooseMove case. The engine's
move-and-score identity sweep cannot see them, because they are lossless. M15–M17 die on one
unit row each.
