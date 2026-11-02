# se-ABC-268 acceptance: A1 met (cross-build node-equal), A2 met (21 plants red), A3 met (drift max 10 / 0 cp, mate 0/189, zugzwang 7/7, cut audit 0 of 2 943), A4 met; every head, door and audit count reproduces the probe exactly

At `grugops/ABC-268` `df984484` against `main` `ca6e8506` (src tree `f2388e40`, the probe's tree, so no re-derived count). Every reading is deterministic (fixed depth, or `chooseMove` on a frozen clock with `maxDepth` / `maxNodes`) and ran under the host lock. Raw output in `raw/`.

## A1 / G4 / F7: cross-build, out of tree (`raw/a1.txt`, `raw/scripts/a1.mjs`, se-ABC-264's script re-pointed)
- Corpus 276 (six roots, six endgames, every in-progress child). 0 differ on nodes, score and move in every pair:
  - head `searchWithoutFutility` vs base `search()` d1-4: 1 104 rows, sha `98c554876f946df4` both sides;
  - head `chooseMoveWithoutFutility` vs base `chooseMove` to 4: 276 rows, sha `16053ea24626369f` both sides;
  - every older door vs its base self: QuietPromotions `477fbd2e…`/`32a44406…`, QuiescenceEvasions `7a5924b5…`/`aa3b9cfa…`, NullMove, Reductions, PvsOrReductions, Table, Ordering, Killers, Quiescence (d3), Pruning, PruningOrQuiescence (d2), the three older engine doors (to 4).
- Non-vacuity: head `search()` differs from base on 389 / 1 104 rows; head `chooseMove` to 4 on 181 / 276.
- Export lists: `ABC-077` A6 +3 (`futileMove`, `futilityNode`, `searchWithoutFutility`); `ABC-078` A4 +1 (`chooseMoveWithoutFutility`).

## A2 (default lane, `src/search.futility.test.ts`)
- `futilityNode` boundary at d = 1, 2, 3, White (ply 1) and Black (ply 3 / 40): true at alpha = eval + M[d] exactly, false at − 1.
- Seven guard rows, each on a node where the margin alone would prune (asserted per row), each false with 0 evaluations paid: ply 0; PV window; d = 0; d = 4 (alpha clear of a 750 margin); in check; alpha alone in the band (stubbed eval −25 000, alpha −MATE_FLOOR, beta inside); beta alone in the band (alpha MATE_FLOOR − 1). Band edges one centipawn inside on either side prune.
- `futileMove`: false at index 0, for a non-checking capture, for each of the four non-capturing non-checking promotions, for a quiet check; true for a quiet silent move at 1, 2, 40.
- Purity: `structuredClone` equality after both predicates on five boards (every legal move for `futileMove`).
- Constant row: declaration `[0, 150, 350, 550]`, not exported, no write pattern in any production module, named only in `src/search.ts`.
- Source rows (both `negamax` bodies): one `futilityNode` call, gated on the switch, with `alphaIn`; ordered after `tableCutoff`, `nullMoveReduction`, `legalMoves`, `const alphaIn`; the loop's first statement `if (futile && futileMove(position, move, index)) { index++; continue; }`; nothing made or stored in between; store through `boundOf(best, alphaIn, beta)`. `futility` is a field of `Switches` and `Heuristics` only (not `EngineOptions`, not module state, `search()` signature unchanged).
- Doors: each exported entry passes exactly one `futility` literal, only the shipped one true (13 search entries, 7 engine entries); work rows at depth 4.
- **Planted defects, 21 of 21 red** (`raw/plants.txt`, `raw/scripts/plants.py`): margin compare `<` (6 red), margin value 350→351 (3), margin index d−1 (7); each guard dropped — root, null window, depth 0, alpha band, beta band, in check (1 each); depth range widened to 4 with a 750 margin (1); band edge `>` for `>=` (1); `futileMove` index-0, capture, promotion, gives-check clauses dropped (3/1/1/1); skip without `index++` (1); engine current alpha for `alphaIn` (1); engine switch unwired (2); engine `remaining − 1` (1); new door `futility: true` (2); an older door `futility: true` (1). Tree restored after each (`git status` clean).

## A3 (`SEARCH_DEEP=1`, `raw/a3-a4.txt`)
- (a) Drift d5 on the 190: `search()` vs door **100.00 % of 187 within 25 cp, max 10 cp** (position-3/b4b2 41 → 51); `chooseMove` vs door **100.00 %, max 0 cp**. 0 mate sign flips, 0 mate-status flips. Bar met.
- (b) Mate floor on the 287 at d5: **0 of 189** violated; 0 longer, 0 shorter.
- (c) Zugzwang: the seven rows play their recorded moves on the shipped `chooseMove` at 9/11/12/8/8/8/8 (`src/search.null-move.test.ts` A2, SEARCH_DEEP 44/44; and the report rows here). Nodes head / door: zugzwang.001 56 156 / 78 946 (0.711×); **zugzwang.004 905 900 / 587 282 (1.543×, still h3h4)**; zugzwang.005 1 310 019 / 2 412 618 (0.543×); kpk-b6c6 2 605 / 2 998; kpk-c6d6 3 369 / 4 271; kpk-d6e6 3 289 / 4 201; kpk-e6f6 2 718 / 3 548. Probe figures reproduced exactly. No depth re-pinned.
- (d) **Cut audit** (scratch copy outside the repo, hook never in `src/`; `raw/scripts/audit-patch.py`, `raw/scripts/audit-driver.ts` = probe3.ts audit mode on the shipped switch; `raw/fire-audit.out`): `search()` d6 over the 190 (the six endgames included, as probe3's corpus), every 10th firing node: **30 272 firing, 2 943 sampled (d1 1 918 / d2 966 / d3 59), 0 flips, 0 ≥ 100 cp, 0 ≥ 200 cp, door noise 0.** Exact match to the ticket's reproduction counts. Bars (≤ 0.5 %, 0 ≥ 200 cp) met by this reading; QE grades A3 (d).
- Firing at d6: head 14 311 902 / door 17 826 686 nodes = **0.8028×**, **901 655 moves skipped** — the A6 firing figure, reproduced.

## A4 (`SEARCH_DEEP=1`)
| reading | head | door | ratio | probe |
|---|---|---|---|---|
| `search()` d8 kiwipete | 888 786 | 1 116 785 | 0.7958× | equal |
| `search()` d8 position-6 | 1 262 046 | 1 602 457 | 0.7876× | equal |
| `chooseMove` to 8 kiwipete | 1 306 981 | 1 575 537 | 0.8295× | equal |
| `chooseMove` to 8 position-6 | 391 451 | 476 244 | 0.8220× | equal |
- Bar ≤ 0.88× on each: met. Root move and score unchanged on all four (e2a6 −60 / −59, c3d5 74).
- (b) Reach at 47 000 nodes on the 190: **5.558 → 5.837 (+0.279)**, 54 deeper, 1 shallower, 6 root moves differ. Bar ≥ +0.20: met. Equal to the probe.
- (c) G6: see the gates note (SE reading, met; QE grades).

## Rows re-pointed / re-pinned (ADR-0061 d6, test note 3)
- Re-pointed (figures unchanged, read): `src/quiescence.test.ts` `ABC-229` A3 node ratio (kiwipete 1.019×, position-6 1.000×) and both `ABC-229` d5 drift rows (100 %, max 8 cp) — shipped side `search()` / `chooseMove` → `searchWithoutFutility` / `chooseMoveWithoutFutility`.
- Literal maps grown by the new doors: QE-208-c `nullMove` (both modules); `ABC-228` `quiescenceEvasions` and `ABC-229` `quietPromotions` (both modules).
- Export lists (`ABC-077` A6, `ABC-078` A4).
- **No value row moved and no fixture re-pinned:** the `ABC-229` INFO row kpk-b6c6 still reads 902 / b6c6 on the shipped path; `ABC-086` A6 (ENGINE_DEEP) green unchanged; no zugzwang depth re-pinned.
