---
id: 20261026T035949Z-qe-e2e-observation-78e6edcd
kind: observation
by: qe-e2e
at: 2026-10-26T03:59:49Z
verified_by: 
confidence: high: deterministic cross-build and frozen-clock counts at ddc307a9 against main ef9711ec; no real-clock reading
refs:
  - ABC-208
  - EPIC-008
  - ADR-0050
  - ADR-0026
  - ADR-0034
  - ADR-0020
  - ADR-0027
  - ADR-0049
  - NFR-004
  - NFR-005
  - NFR-008
  - G1
  - G4
  - G6
  - A1
  - A2
  - A3
  - A4
  - A6
  - QE-208-a
  - QE-208-b
  - QE-208-c
  - QE-208-d
  - QE-208-e
  - QE-208-f
  - plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
  - memory-bank/50-decisions/ADR-0050-null-move-pruning-arrives-at-null-window-nodes-with-r-3-behind-a-test-only-off-door-pair-guarded-below-three-non-pawn-pieces.md
  - arch-design-ABC-208/20261026T023232Z-architect-design-decision-012b1053
  - arch-design-ABC-208/20261026T023232Z-architect-design-observation-bae20026
  - ticket-to-pr-ABC-208/20261026T030739Z-software-engineer-decision-e0666f5b
  - ticket-to-pr-ABC-208/20261026T030739Z-software-engineer-observation-83c40265
  - orch-2026-10-26e/20261026T023422Z-orchestrator-decision-749ff988
  - orch-2026-10-26g/20261026T030853Z-orchestrator-decision-c8b5492f
  - grugops/qe-gate-ABC-208
  - grugops/ABC-208
  - 80345eb9
  - afb6b32f
  - ef9711ec
  - ddc307a9
supersedes: 
seal: sha256:b00c200c464def74a827498a3ff8d3bff3db005e6fb4fd86ca7580866cae9ab3
---

# QE/E2E static gate ABC-208, the criteria evidence: A1 cross-build 4 795/4 795 + 258/258 with bite counts; frozen-clock pre-check (8 counts, base vs head); A2 7/7 with an independent KPK bitbase; A3 = ruling; a false-mate probe 0; G1 54/58. No real-clock timing

Task `qe-gate-ABC-208`, at `ddc307a9`. Trees: `git archive` of `main` `ef9711ec` (base; `src/` equals the merge-base
`2e7899fc`) and of `ddc307a9` (head) into `<scratchpad>/qe208gate/trees/`. Both were checked against the worktree's
`src/`; exactly the 8 ruled files differ. Plain node v26.11.1, run directly on `.ts`. Every count here is deterministic (a fixed
depth, a frozen clock, or `tickingClock(1)`). Scripts and outputs are in `raw/`.

## A1, out of tree (`raw/qe-scripts/a1.mts`)
- **Sweep: the `ABC-078` `A3` corpus at that sweep's budgets.** The endgames plus their in-progress children (92) at 3 and 5;
  the broad corpus (209 = six roots, their children, 25 position-3 grandchildren) at 5. Clock `tickingClock(1)`, as
  `identityDivergences`. Engine cells per position and budget: base `chooseMove` vs head `chooseMoveWithoutNullMove`, plus
  both older engine doors base vs head (move, score, nodes, depth). Search cells at every depth the sweep reads (the depth
  base's `chooseMoveWithoutReductions` completed, plus base `chooseMove`'s if different): base `search()` vs head
  `searchWithoutNullMove`, plus all 8 older search doors base vs head (move, score, nodes).
  - Depths read: endgames@3 d3 ×92; endgames@5 d4 ×68, d5 ×58; broad@5 d1 ×10, d2 ×85, d3 ×81, d4 ×45, d5 ×1.
  - **4 795/4 795 equal; 0 mismatches.** Per pair: new engine door 393/393; `chooseMoveWithoutReductions` 393/393;
    `chooseMoveWithoutPvsOrReductions` 393/393; new search door 440/440; `searchWithoutQuiescence`, `…Ordering`,
    `…Killers`, `…Table`, `…Reductions` and `…PvsOrReductions` 440/440 each; `searchWithoutPruning` and
    `…PruningOrQuiescence` 268/268 each.
  - Capped: the two unpruned doors at d3 (172 cells each not run at d4/d5, cost). With prune off, alpha never rises
    (`src/search.ts` `if (!prune) continue;`), so their windows stay infinite and no node passes `alpha + 1 === beta`.
  - Bite (head shipped vs base shipped): differs on 82/440 search cells and 38/393 engine cells.
- **Six-roots extension (the design probe's set):** search doors d1–4 (the unpruned two d1–3), engine doors maxDepth 3/5/6 on a
  frozen clock. **258/258 equal.** Bite: shipped `search()` differs on 10/24 (d3–4 on 5 roots), shipped `chooseMove` on 15/18.
  - **At maxDepth 6, 5/6 roots differ, not 6/6.** Position-3 is node-equal at every depth (6 154 at maxDepth 6), because the
    three-piece guard leaves it no null move.
- Total **5 053/5 053**. The Architect's 222 = 6 × (7 × 4 + 3 × 3); this run is 258 = 6 × (7 × 4 + 2 × 3 + 3 × 3) on the roots.

## Test note 4, the frozen-clock pre-check (`raw/qe-scripts/frozen.mts`; `chooseMove`, `now: () => 0`, `maxDepth: k`)
| board | base d7 | head d7 | base d8 | head d8 |
|---|---:|---:|---:|---:|
| kiwipete | 609 900 | 590 489 (−3.2 %) | 1 735 339 | 1 259 463 (−27.4 %) |
| position-6 | 586 333 | 180 941 (−69.1 %) | 1 355 149 | 355 565 (−73.8 %) |
- Head d9: kiwipete 2 907 475, position-6 940 109. Head's `chooseMoveWithoutNullMove` reads base's count exactly at d6, d7 and d8
  on both boards. **All equal the ruling's and the SE's tables.**
- **Does not stop the run:** head is below base at d7 and d8 on both boards.
- Reported, not graded: at d6 kiwipete head needs **more** (248 056 → 309 541, +24.8 %; it is in `…bae20026`'s table), and at d4
  `search()` too (18 079 → 18 522). Position-6 d6 is 180 658 → 52 265. Base completes d7 on kiwipete at 3 s (`…a34270bf`), so
  d6 is not a depth base straddles there.

## A2 (`SEARCH_DEEP=1`, `src/search.null-move.test.ts`, verbose)
- 7/7 at the ruled depths: `.001` e1f1 d9, `.004` h3h4 d11, `.005` f4d5 d12, `kpk-b6c6`, `-c6d6`, `-d6e6`, `-e6f6` at d8. The
  instrument rows are green (>100 null moves inspected, 0 in check, 0 below three pieces), as are the pawn-only rows.
- **K+P labels, checked independently** (`raw/qe-scripts/kpk.py`: a KPK retrograde bitbase on Stockfish's classification
  rules, offline). Each root is a WIN with 6 legal moves, and the recorded move is the **only** winning one, in all four rows.
  The CPW labels were not re-derived here (no engine or network); they rest on `ADR-0050` d9's Stockfish 19 corroboration.

## A3 (the same run)
- `search()` vs `searchWithoutNullMove` d5: 100.00 % within 25 cp of 187, max 25 cp (position-5/e1f2, −228 → −203).
- `chooseMove` vs `chooseMoveWithoutNullMove` deepened to 5: 100.00 %, max 8 cp (position-6/f3d4, 565 → 573). Mate flips 0.
- Mate floor d5 → d5 on the 287: 0 of 189.
- **The unchecked direction** (`raw/qe-scripts/mates.mts`). The floor only checks positions the door scores as a mate, and
  "no longer" admits a shorter one. At d5 with null move on, against the door:
  - the 287: 189 door mates; 0 null-only mates, 0 shorter, 0 longer, 0 lost, 0 sign flips;
  - the 190: 3 door mates, 0 of each;
  - `chooseMove` on the 287 (a recursion the ADR's floor does not cover): 190 door mates, 0 of each.

## G1 (`PUZZLE_DEEP=1`, verbose)
- `PUZZLES shipped: solved 54/58, baseline 54/58, budget 25 step 1`. MISSED seeds 24, 234, 288, 580 (mate-in-3), base's four.
  No NEWLY line. 18/18 rows green.
