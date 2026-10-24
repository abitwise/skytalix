---
id: 20261023T222449Z-software-engineer-decision-18a6a03c
kind: decision
by: software-engineer
at: 2026-10-23T22:24:49Z
verified_by: 
confidence: high on the build; STOP open on 3 deep-lane reds; OD-205-1 owed
refs:
  - ABC-205
  - EPIC-008
  - ADR-0031
  - ADR-0028
  - ADR-0026
  - ADR-0024
  - ABC-079
  - ABC-083
  - ABC-170
  - ABC-212
  - NFR-005
  - NFR-008
  - 613f4548
  - 51997b7e
  - 68be197f
  - grugops/ABC-205
  - arch-design-ABC-205/20261023T215851Z-architect-design-decision-1fb6e1bc
  - arch-design-ABC-205/20261023T215851Z-architect-design-observation-8232146f
  - plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
supersedes: 
seal: sha256:812ed52260205fbf5d31a2a117bb078eab5bed6f784e7430fa73d576b3762278
---

# Software Engineer: ABC-205 built to the Design ruling. 10 of the 11 ruled rows re-pinned or re-picked; OD-205-1's cell left red and untouched. STOP to Architect on 3 deep-lane reds the ruling did not name

Branch `grugops/ABC-205`, worktree `../wt-ABC-205`, from `main` `f47b3429`. Code `613f4548`, re-pins `51997b7e` and `68be197f`. Not pushed or merged.

## Build (src/evaluate.ts)
- Queen scale ×3 (`KING_EXPOSURE_QUEEN_SCALE`) on each king's whole `kingExposure` penalty while the enemy has a queen. Flags and phase come from the existing walk. `QUEEN` comes from `position.ts`, which was already imported.
- Tapered king square, `kingSquare()`: `((mg·phase + eg·(24−phase))/24)|0`. mg is the unchanged `KING_TABLE`. eg is `KING_ENDGAME_TABLE`, our own 40 − 15·m (the literal was checked against the rule over 64 squares). Phase is N1 B1 R2 Q4, clamped to 24.
- Gate: a positive mg counts only when `shelterMissing` is 0. That is one shelter test, computed once per king. `kingExposure` now takes the missing count.
- The comments at `:58` and `:187` now point to ABC-205 and the addendum. The header credits the king endgame table to this project.
- No new export or import edge. `evaluateWithoutMobility` is unchanged.
- The build matches the architect's probe candidate exactly on the 184-position corpus plus the 30 relation FENs (0 differences), which is why every ruled figure reproduces.

## Tests (src/evaluate.king-mobility.test.ts, appended; 25/25)
- A1: 8 pairs (4 castled on g1, 4 uncastled on e1). Assertion: (intact − broken) with the queen is strictly greater than with a rook on d8.
- A2: ending e4 > g1; middlegame g1 > e2.
- A3: queens-only and full middlegame. The drop is strictly greater than the base figures 31 and 87.
- A3b: drop > 21.
- A4: mirror over the 184 + ABC-083's 20 + 37 new positions, queens on and off.
- Mutants:
  - scale = 1 reds the 4 e1 rows of A1;
  - eg = mg reds A2's ending row;
  - gate off reds A3b only.

## The 11 ruled rows
1. transposition `A1` knight-g1 `w K`: 894 → 919 (re-pin).
2. transposition `A1` knight-g1 `w -`: 894 → 919 (re-pin). The pair now also reads equal at depths 5 (943) and 6 (936); the comment says so.
3. transposition `A1` position-3: 1 325 / 1 523 → 1 357 / 1 529 nodes (re-pin).
4. transposition `A5` perpetual: 7 832 → 7 356 nodes; f7f8 and score 0 unchanged (re-pin).
5. transposition `A5` bite: −488 → −496 (re-pin).
6. ordering `A4` position-6 d2: 8 887 / 4 419 / 3 871 → 8 095 / 4 722 / 3 993 (re-pin). `A3`'s guard reads 49.33% against its 65% level.
7. ordering `G1`: 354 → 349 (re-pin). N3, re-planted in a scratch copy of engine.ts, reads 351.
8. pvs-lmr `A4` `search()`: [19, b3f3] → [−7, b3f3]. Re-pinned, not re-found: the fixture still bites both variants in both shapes. `lmr-ref.ts` was verified faithful on the build first.
9. pvs-lmr `A4` `chooseMove()`: same as row 8.
10. engine `ABC-170` `A1`: fixture re-picked under ADR-0028 d2. kp-vs-k ties e1d2 and e2e3 at 91. The new fixture is `8/8/4k3/8/8/4P3/5K2/8 w - - 0 1`: unique e3e4 on base (+7) and build (+15), depth 7 on both.
11. quiescence `A5` position-6 d1: 10.957x against 10x. NOT moved (OD-205-1).

## Deep pins moved by rule
- quiescence bare leaf position-6 d3: 2 355 → 2 315, c3d5.
- `ORACLE_AT_DEPTH_3`, oracle re-run and equal to `search()` and the pre-ABC-121 search:
  - kiwipete 70 → 40, e2a6 (387 s);
  - position-6 84 → 160, c3d5 (46 s).

## STOP to Architect/Design (not edited)
- S1: transposition `A4` mate-reuse row [SEARCH_DEEP]. The pre-ABC-121 engine reaches depth 9 at 160 ticks, against the pinned 10; its score is still −29 992. It reaches depth 10 at 180 ticks. Shipped `chooseMove` is unchanged (depth 11, −29 992). Whether the reuse still happens at 180 ticks was not probed.
- S2/S3: pvs-lmr `A1` drift at d5, `search()` and `chooseMove`: max 79 cp against the 75 cp level, on position-6/e2d2 (56 → 135). Within 25 cp: 96.79% / 97.33%.
  - Same position: base 51, scale-only 41, taper-only 83. The taper drives it.
  - This is an ADR-0026 level, so it is not a pin I may move.
