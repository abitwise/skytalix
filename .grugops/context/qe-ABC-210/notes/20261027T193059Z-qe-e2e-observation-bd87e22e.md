---
id: 20261027T193059Z-qe-e2e-observation-bd87e22e
kind: observation
by: qe-e2e
at: 2026-10-27T19:30:59Z
verified_by: 
confidence: high: deterministic probes, lanes and plants as run at d71fc369; raw/ holds every output
refs:
  - ABC-210
  - EPIC-008
  - ADR-0051
  - ADR-0050
  - ADR-0026
  - ADR-0024
  - ADR-0034
  - ADR-0031
  - ADR-0028
  - ADR-0049
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - G1
  - G2
  - G4
  - G5
  - G6
  - G7
  - G8
  - G9
  - G10
  - G11
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - S1
  - P1
  - P2
  - QE-210-a
  - QE-210-b
  - QE-210-c
  - QE-210-d
  - QE-207-g
  - plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
  - plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
  - memory-bank/50-decisions/ADR-0051-a-check-extension-arrives-at-the-horizon-once-per-line-behind-a-test-only-off-door-pair.md
  - arch-design-ABC-210/20261027T041209Z-architect-design-decision-c5d0e464
  - arch-design-ABC-210/20261027T041209Z-architect-design-observation-8e6a40c2
  - arch-accept-adr0051/20261027T062436Z-architect-design-decision-e83d5703
  - ticket-to-pr-ABC-210/20261027T065341Z-software-engineer-decision-8c4e8b4b
  - ticket-to-pr-ABC-210/20261027T065341Z-software-engineer-observation-548912ef
  - orch-2026-10-27j/20261027T065502Z-orchestrator-decision-334b383d
  - orch-2026-10-27f/20261027T041414Z-orchestrator-decision-75af453c
  - owner-word-2026-10-27/20261027T062043Z-orchestrator-decision-047d411f
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - owner-word-2026-10-26b/20261026T132424Z-orchestrator-decision-2ae5fc12
  - owner-delegation-2026-10-22/20261022T140148Z-orchestrator-decision-5aaf7cec
  - bapm-epic008-g6-rule/20261025T122057Z-ba-pm-decision-8e51ba1e
  - grugops/qe-ABC-210
  - d71fc369
  - a17d5945
supersedes: 
seal: sha256:308be26d91d694574e0d04fe2819ffc5f268ec7e3947a828e65b55078703fe73
---

# QE gate ABC-210 at merge `d71fc369`: A1 6 156/6 156 cells out of tree, A2 and A3 as ruled, P1 bites at depth 2, the moved rows are exactly the ruled set, 26/26 plants red; the LOW has no value effect found

Task `qe-ABC-210`. `grugops/qe-ABC-210` = `grugops/ABC-210` `a96f36b0` + `main` `a17d5945` → merge `d71fc369` (no conflict).
Head's `src/` equals `a96f36b0`'s. Base = the merge-base `a17d5945`, whose `src/ data/ tools/ package*.json` equal `b5c67ab7`'s
(ABC-208's merge). Trees are `git archive`s in `<scratchpad>/qe210/trees/`. Plain node v26.11.1. Own `npm ci --ignore-scripts`.
Raw: `raw/gates`, `raw/deep`, `raw/probes`, `raw/plants`, `raw/audit`, `raw/qe-scripts`.

## Mandatory gates at `d71fc369` (`raw/gates`)
- lint rc 0 (130 files), typecheck rc 0, build rc 0 (22 dist files, 0 from `tools/`).
- `npm test` rc 0: 64 files, **2 161 / 2 161**, 482 suites. `last-run.json` success, 0 failed, 0 pending, 0 todo.
  Duration 8.55 s (real 9.70 s), started at load1 7.57, AC, 0 foreign vitest: **`G8` MET** (≤ 10 s at load1 ≤ 8).
- Skip count 0; `test-skip-integrity.js --skip-count 0` → `No findings.` Lane inventory 64 = 64.

## Deep lanes, deterministic (`raw/deep`; one file per run, heap 400)
- SEARCH_DEEP: check-extension **43/43**, null-move **44/44**, search 57, ordering 38, transposition 40, quiescence 37, pvs-lmr 29.
- PUZZLE_DEEP 18/18: **`G1` 54/58** = baseline (no NEWLY line; `A4` class B under `ADR-0034` d2, none missed beyond base's four).
- ENGINE_DEEP and the real-engine lanes ran unfiltered in the real-clock session (timing note).

## `A1`, out of tree (`raw/probes/a1-*.txt`; `qe-gate-ABC-208`'s `a1.mts`, re-paired)
- Cells compare move, score and nodes (engine: and depth). Pairs: base `search()` vs head `searchWithoutCheckExtension`; base
  `chooseMove` vs head `chooseMoveWithoutCheckExtension`; all 9 older search doors and all 3 older engine doors (the null-move
  pair included) base vs head.
- **Sweep, the `ABC-078` `A3` corpus at that sweep's budgets** (endgames + children at 3 and 5; the broad corpus at 5;
  `tickingClock(1)`; depths read d1–d5): **5 772/5 772**. Unpruned doors at d1–3 (185 cells each not run above d3).
- **Six roots:** search doors d1–6, engine doors at maxDepth 3/5/6 on a frozen clock: **384/384**. Capped for cost:
  unpruned doors above d3 (18 + 18), `searchWithoutOrdering` above d4 (12).
- **Total 6 156/6 156, 0 mismatches.** Both sentences hold: the new pair equals base's shipped path, and every older door equals
  its pre-ticket self.
- Bite: head's shipped path differs from base's on 303/457 sweep search cells, 221/393 sweep engine cells, and at d6 on 6/6
  roots in both recursions. So the probe can see the change.

## `A2` (rows re-run in the lanes above; plants below)
- The five horizon rows (both recursions, each door's exact move per `ADR-0051` d8), the line-length instrument (d1 on the five
  rows; d5 on four roots: ply 6, never 7) and the cap row (d1 ply 2, never 3; d2 reaches 3): green in the default and deep lanes.
- Blind spots: the instrument reads ply at qply-0 `quiesce` calls only, so it says nothing about lines that end in a mate or
  stalemate found at an extended node; the five rows pin the door's move for the newest door only (the older doors are held
  by `A1`, out of tree).

## `A3`
- d6 nodes against the door: kiwipete **249 811 / 237 007 = 1.054×**, position-6 **110 654 / 109 912 = 1.007×** (bar 1.5×).
- Drift d5 on the 190: `search()` **93.58 %** within 25 cp of 187, max **116** cp; `chooseMove` **94.12 %**, max 116
  (position-4/f1f2, 708 → 824). Bars ≥ 90 % and ≤ 174 cp: met. Mate flips 0 (a report).
- Same-depth mate floor on the 287: **0 of 189** violated.
- All equal the ruling's and the SE's figures.

## `P1` re-planted (`raw/plants`)
- Three fixture bugs planted in `REPEATS_AT_PLY_4` (the black rook gone; the black queen gone; the fixture one move outside the
  cycle): each **reds the depth-2 (−502) row**, and the depth-4 and 6-tick rows with it.
- The class of bug that moved the pin (a repetition seen inside the horizon) also still bites at depth 2: the every-node
  no-cap extension, the interior extension, the depth-1 extension and the out-of-check extension each red the d2 row.
- d2 reads −502 on base, on head and on head's door; d3 reads 0 on head and −485 on the door (as the ruling says).

## Moved rows, audited against the ruled set (`raw/audit`)
- Head's test diff edits exactly: 2 export lists (`ABC-077` `A6`, `ABC-078` `A4`, with its `.length` line), 2 `QE-208-c` door
  maps (and their titles), 5 re-points (d5 drift ×2, the mate floor, "changes the work" ×2), P1, P2 (`zugzwang.005` d13) and the
  table-sanity row "8 to 13" (P2, …334b383d). Plus the new file. Nothing else.
- Cross-run, base's own test files on head's `src/`: default lane **5 red / 2 128** (the 2 export lists, the 2 door maps, P1);
  deep lanes (real-clock rows filtered by name) red only `zugzwang.005` at d12 and the two d5 drift rows (and the same export
  list and P1 again). The mate floor and the two "changes the work" rows stay green either way, as ruled. 0 other reds.
- The re-pointed rows read their pre-ticket figures exactly: 100.00 % / max 25 cp, 100.00 % / max 8 cp, mate floor 0 of 189
  (equal to `qe-ABC-209`'s base-era run). `ABC-121`'s rows read 97.86 % / max 63 cp, as before.
- `G4`: the `ABC-078` `A3` identity sweep, the `ADR-0026` oracle and every pre-ticket door node-for-node: met (rows green; `A1`).

## Plants (26 default-lane, 4 deep; each on a scratch copy of head, restored and `cmp`-verified)
- The SE's 8, re-planted: dead predicate 19 red, +2 plies 11, no cap 3, interior extension 3, out of check 4, `chooseMove` switch
  off 12, engine child loses the count 2, `searchWithoutCheckExtension` wired on 11. (The SE's counts differ by 0–2 rows on
  three of them; the extra reds are transposition `A5` rows (P1's d2 row, the 6-tick row), `QE-208-a` and `ABC-170` `A2`.)
- QE's own 15: engine door wired on 11; search child loses the count 2; search or engine count not kept 2 each; root count 1
  (search, engine) 11 each; cap 2 → 2; depth-1 too 3; every node no cap 6; depth only (count kept, depth not) 12; extension after
  the leaf test 12; null child loses the count (search, engine) 1 each; extension before the repetition scan 1. Plus the 3 P1 plants.
- **26/26 red at least one row.** Three are caught only by the static source row: both null-child count plants and the
  extension placed before the repetition scan. **All three are equivalent mutants.** A node that tries a null move has
  depth ≥ 2, and a line that has been extended stays at depth ≤ 1, so the count handed to a null child is always 0. A
  repetition returns exactly 0 whatever the depth. So no behaviour row can red them, and none is owed.
- Deep (check-extension, null-move, transposition; SEARCH_DEEP): none 0/127; dead predicate 23 (the oracle rows stay green, as
  `ADR-0051` d7 says; the instrument rows red); +2 plies 15; every node no cap 16 (the predicate ×4, the cap row, the d5
  instrument ×4, A3 nodes on position-6, both drift rows, `zugzwang.005`, P1 and the two depth-4 fixture rows).

## The LOW in …334b383d: an extended node does not itself test dead-position / 75-move draws (`raw/probes/low.txt`)
- **No row exercises it.** No search or engine row runs a position at a halfmove clock ≥ 149 or an insufficient-material check;
  the clock-150 FENs live in `gameend`, `legal` and `turn-loop` rows, which do not search.
- **Dead position: no value effect is possible.** Material only falls, and no pawn is left to promote, so every child of a dead
  position is dead and its leaves read 0. Probe: K+N v K and K+B v K checks at d1–3, head = door.
- **75-move: no value effect found.** The 471 roots of the 190-shaped corpus plus the 287, at clock 149, at d1 and d2: 942 cells.
  Head ≠ door on 10, as at their own clocks. On 2 the difference is not the same as at the own clock. Both are one position-3
  child at d2 (head h4g4 0, door c7c6 22). A per-move breakdown traces them to root quiet moves becoming 75-move draws in
  both builds alike, not to the extended node (c7c6 reads −128 on head and 22 on the door at both clocks). A constructed
  position, White a queen down with a quiet check the defender can capture, reads head = door at d1–3.
- In principle an extended node at clock ≥ 150 with a capture or pawn evasion is searched on where the rule says draw. That is
  the same class as every interior node today (an interior node never tests the 75-move rule; only leaves do). D games never
  reach clock 150 (the tool adjudicates the fifty-move rule at 100 plies). **No fix owed, as the ruling expects.**
