---
subtask: ticket-to-pr-ABC-207
role: software-engineer
ticket: plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md
ref: .grugops/context/ticket-to-pr-ABC-207/
branch: new grugops/ABC-207 from main, worktree ../wt-ABC-207
width: 1 of 3 (no real-clock timing, no G6, no games)
---

# Build ABC-207: per-piece mobility weights + early-queen term

## Do
- Own worktree and `npm ci --ignore-scripts`. Build exactly to the page's `## Design ruling` (Architect `arch-design-ABC-207/…a21b7cc9`, `…439d6f8c`; Orchestrator `orch-2026-10-25aa/…6eda769c`): MOBILITY_WEIGHT as ruled, applied before the unchanged ±100 cp clamp; `evaluateWithoutMobility` keeps the exact-difference property; the early-queen term as ruled, outside the clamp, with no new export. Add the A1/A2/A3 relation and mirror rows (≥ 10 new positions) in `src/evaluate*.test.ts`.
- Pins: only the 12 rows in 4 files that the ruling names, each by its stated route. Any relation red, any other row moving, or any level red → STOP to Architect.
- Red-first where the page names plants. Frozen-clock d7/d8 counts on kiwipete and position-6 for base and head (must equal the ruling's), reported, not graded.
- Gates: lint, typecheck, build, `npm test` + `last-run.json` (Duration), skips, SEARCH_DEEP, ENGINE_DEEP (deterministic rows; filter real-clock rows out by name), PUZZLE_DEEP. No real-clock timing.

## Fences
- Only `src/evaluate.ts`, the test files the ruling names, your worktree and `<scratchpad>/se207/`. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task ticket-to-pr-ABC-207). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Delivered to the ruling. All 12 ruled rows moved by their routes, with every value equal to the ruling. No relation, level, bound or other row moved. No STOP.**
- Branch `grugops/ABC-207` in `../wt-ABC-207`, with its own `npm ci --ignore-scripts`, from `main` `26c43d28`.
- Code `5050cce9`. Tip **`5477df21`** (notes). Not pushed, not merged.
- Plants ran on scratch copies under `<scratchpad>/se207/`. None of them touched `src/`.

| criterion | at the tip |
|---|---|
| Scope 1 | `MOBILITY_WEIGHT` `[0, 0, 4, 4, 2, 1, 4]` by `pieceType`, applied to each reach before the unchanged ±100 clamp. `squaresReached` is unchanged. `evaluateWithoutMobility` passes an all-zero array |
| Scope 2 | 25 cp per side: queen off d1/d8 and ≥ 2 of the four minors home. Outside the clamp, flag set in the walk, one private helper, no new export |
| A1 | 7 new rows in `src/evaluate.king-mobility.test.ts`. One-square steps: Q 1 < R 2 < B 4 = N 4, with the clamp out of play on every pair |
| A2 | `evaluate` Qa4 vs Qd1, minors home: −7 (strictly lower). Term through `evaluateWithoutMobility`: −25; developed 0; no minors 0 |
| A3 (SE part) | mirror and ±100 bound on 15 new positions; the term reads outside the clamp on a clamped board (cap exactly 100). Red-first at base: 2 / 7 red (`A1`, `A2` criterion). Plants: queen weight 4 or 2, term 0, minors condition dropped, white-only, and term inside the clamp each turn ≥ 1 row red |
| moved rows | 12 in 4 files: 10 re-pins, 1 re-find (`pvs-lmr` `A4` `search()` → position-3 after 1. Rb3 Kg5, −1 / b3c3; `ADR-0028` d2), 2 by the oracle rule (kiwipete 20 / e2a6, position-6 78 / c3d5; equal on all three searches). `N3`, `noLmrResearch` and `noResearch` (and each per recursion) bite. One re-read inside row 6: table-off 1 533 → 1 512 |
| gates | lint, typecheck and build rc 0. `npm test` 62 files, **2 097 / 2 097**. `last-run.json` success, 0 failed, 0 pending, 0 todo, Duration 6.94 s (not a reading). Skips 0: `No findings.` Deep lanes, real-clock rows filtered by name: PUZZLE 54/58 (baseline 54/58), SEARCH_DEEP search 57, ordering 38, transposition 40, quiescence 37 and pvs-lmr 29, all green; ENGINE_DEEP engine 54 + 6 filtered, levels 37 + 4 filtered. `A5` cells and d5 drift (98.93 %, max 45) equal the ruling |
| Test note 4 | frozen-clock nodes, base → head: kiwipete d7 609 900 → 602 091, d8 1 735 339 → 1 700 946; position-6 d7 586 333 → 469 639, **d8 1 355 149 → 1 111 000**. These equal the ruling's counts. Reported, not graded |

Notes are sealed via `admitAndAppend` (`contextRoot` = the worktree's `.grugops/context`) and read back 3/3 with seals ok, in `../wt-ABC-207/.grugops/context/ticket-to-pr-ABC-207/notes/`: decision `…71735f56` (weights and term), decision `…84f82342` (moved pins), observation `…723cbf60` (red-first, plants, counts and gates).

### Trace row
| ABC-207 (ticket-to-pr-ABC-207) | mobility weighted per piece (N 4, B 4, R 2, Q 1, K 4) before the ±100 cp clamp; an early queen trip with ≥ 2 minors home costs 25 cp | EPIC-008 | — | no ADR (ADR-0031 d2 form unchanged); no bound moved; NFR-005/G6 predicted MET by frozen-clock counts (UNKNOWN - verify) | grugops/ABC-207 @ 5477df21 (code 5050cce9)<br>src/evaluate.ts; src/evaluate.king-mobility.test.ts (+7 rows: A1, A2 ×3, A3 ×3); search.ordering, search.pvs-lmr, transposition, quiescence tests (12 ruled rows); .grugops/context/ticket-to-pr-ABC-207/notes/ (3) | red-first 2/7 at base; 6 plants each bite; N3/noLmrResearch/noResearch bite; npm test 62/2097; deep lanes green (real-clock filtered); PUZZLE 54/58; skips 0, No findings. | owed: QE verdict signs (owner delegation 2026-10-22) | — | In Development → In Review (QE: G2/G5/G6/G8/G9/G11, D/S1, N8-LANE) |
