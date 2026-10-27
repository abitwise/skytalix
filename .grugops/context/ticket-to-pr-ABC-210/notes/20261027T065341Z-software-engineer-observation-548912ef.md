---
id: 20261027T065341Z-software-engineer-observation-548912ef
kind: observation
by: software-engineer
at: 2026-10-27T06:53:41Z
verified_by: 
confidence: high: deterministic counts equal the ruling's; plants on scratch copies; gates as run; durations are not readings
refs:
  - ABC-210
  - EPIC-008
  - ADR-0051
  - ADR-0050
  - ADR-0026
  - ADR-0024
  - NFR-005
  - NFR-008
  - A1
  - A2
  - A3
  - plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
  - memory-bank/50-decisions/ADR-0051-a-check-extension-arrives-at-the-horizon-once-per-line-behind-a-test-only-off-door-pair.md
  - owner-word-2026-10-27/20261027T062043Z-orchestrator-decision-047d411f
  - orch-2026-10-27f/20261027T041414Z-orchestrator-decision-75af453c
  - arch-design-ABC-210/20261027T041209Z-architect-design-decision-c5d0e464
  - arch-design-ABC-210/20261027T041209Z-architect-design-observation-8e6a40c2
  - bapm-amend-ABC-210/20261027T041844Z-ba-pm-decision-ae96d6d3
  - bapm-amend-ABC-210/20261027T041844Z-ba-pm-observation-6f7cb75e
  - grugops/ABC-210
  - dc4edb32
  - P1
  - P2
supersedes: 
seal: sha256:720ac5a7fa9f37995dd2f2996dc41ecbe32c4c6f34013c2b1db7a3fbe21d4d91
---

# SE: ABC-210 red-first, plants, deterministic counts, A1 self-check and gates. Every figure equals the ruling's. No real-clock timing, no G6, no games

Task `ticket-to-pr-ABC-210`, at `dc4edb32`. Plants and probes ran on scratch copies under `<scratchpad>/se210/`, never in `src/`.

## Red-first: head's pins at the build before they were moved
- Default lane with only the production change: 2 123 / 2 128, and exactly the 5 rows the ruling predicts red: 2 export lists,
  2 QE-208-c door maps, P1 (−485 read 0). This is equal to the Architect's `hd` probe.
- Probe: `REPEATS_AT_PLY_4` d2/d3/d4 head 0 vs door: −502/−502, 0/−485, 0/0.

## Plants (8, each its own scratch copy; the new file's default rows)
| plant | red rows of 33 |
|---|---|
| dead predicate (always 0) | 19: predicate ×3, A2 ×10, instrument ×5, cap row |
| +2 plies | 9: predicate ×3, instrument ×5, cap row |
| no cap | 3: predicate ×2 (at/past cap), cap row |
| interior extension (no depth test) | 2: predicate (depth 1, depth 4) |
| extension out of check | 2: predicate (out of check ×2) |
| chooseMove switch off | 12: engine literal row, chooseMove A2 ×5, instrument ×5, cap row |
| engine child loses the count (0) | 2: engine source row, cap row |
| searchWithoutCheckExtension wired on | 11: search literal row, search A2 ×5, instrument ×5 |

## Deterministic counts (base `main` `5dfd818c` / head `dc4edb32`, scratch exports)
- Frozen-clock `chooseMove` (`now: () => 0`, `maxDepth: k`), nodes to complete k:
  kiwipete d6 309 541 → 324 937, d7 590 489 → 610 577, d8 1 259 463 → 1 302 377;
  position-6 d6 52 265 → 52 341, d7 180 941 → 181 191, d8 355 565 → 358 872. **All equal the ruling's table.** Reported, not graded.
- `search(…, 6).nodes` against the door: kiwipete 249 811 / 237 007 = 1.054×; position-6 110 654 / 109 912 = 1.007× (bar 1.5×).
- A1 self-check only (QE runs A1 out of tree): head's two new doors and all 12 older doors against base, six roots, search d1–4
  (unpruned door d1–3), engine maxDepth 3 and 5: **282/282 cells node-, score- and move-equal.**

## Deep readings (one file per run, heap 400, real-clock rows filtered by name)
- check-extension (SEARCH_DEEP) 43/43. Instrument: four roots at d5 reach ply 6, never 7, in both recursions.
  Drift d5 on the 190: `search()` 93.58 % within 25 cp of 187, max 116 (position-4/f1f2 708 → 824). `chooseMove` 94.12 %, max 116.
  Mate flips 0 (a report). Mate floor d5 → d5: 0 of 189.
- null-move (SEARCH_DEEP) 44/44. `zugzwang.005` plays f4d5 at depth 13. The re-pointed rows read their pre-ticket figures:
  100.00 %/max 25 and 100.00 %/max 8; mate floor 0 of 189.
- SEARCH_DEEP search 57, ordering 38, transposition 40, quiescence 37, pvs-lmr 29: all green.
- ENGINE_DEEP, filtered: engine 54 (+6 filtered), levels 38 (+3), transposition 25 (+1), pvs-lmr 20 (+1), legal 37, gameend 47: all green.
- PUZZLE_DEEP **G1 54/58**, baseline 54/58: base's four misses (mate-in-3 seeds 24, 234, 288, 580), no NEWLY line.

## Gates at `dc4edb32`
- lint rc 0 (130 files); typecheck rc 0; build rc 0.
- `npm test` rc 0: 64 files, **2 161 / 2 161** (= 2 128 + 33). `last-run.json`: success, 0 failed / pending / todo.
- Duration 8.96 s at the first full run; 11.79 s and 11.34 s later at load1 about 10. Base was 8.40 s. These are not readings.
  The new file's 33 default rows take 17 ms of test time on their own (N8-LANE bar 650 ms CPU).
- Skip count 0; `test-skip-integrity` No findings. Lane inventory 64 = 64.

## Flags (LOW) and owed elsewhere
- `AGENTS.md` § Commands has no line for the new file's deep lane:
  `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.check-extension.test.ts` (43 rows). This is the
  Orchestrator's; AGENTS.md is outside this page's Scope.
- ADR-0050 d9's table still reads `zugzwang.005` at 12 (owed to `arch-accept-adr0051`).
- An extended node is searched as an interior node. Like every interior node it does not consult `leafEndReason`, so a dead-position or
  75-move draw is not scored at that node (its children's leaves still are). Mate scores the same ply (`-(MATE_SCORE - ply)`).
  This follows the ruling as written; noted for the reviewer.
- Not run: any real-clock search, G2, G5, G6, G8, G9, G11, D, LADDER/UCI/CLI deep lanes.
