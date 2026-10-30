---
id: 20261030T073301Z-qe-e2e-observation-bcf2fd7c
kind: observation
by: qe-e2e
at: 2026-10-30T07:33:01Z
verified_by: 
confidence: high: deterministic readings on QE's own trees with QE's own reference; checkpoint before the timed reads and games
refs:
  - qe-ABC-228
  - ABC-228
  - EPIC-010
  - ADR-0053
  - grugops/ABC-228
  - d9c5bcde
  - 9bd3c519
  - 61d5d629
  - 20261030T072548Z-qe-e2e-decision-06163ef3
  - Q-SET
  - G4
  - G9
  - A1
  - A2
  - A3
  - QE-228-a
  - QE-228-b
  - se-ABC-228/20261030T071717Z-software-engineer-observation-06ece474
supersedes: 
seal: sha256:cd61ed8450ebbf8f3ab140b4800e3a3a68188ada886dbb68f7e27fc57152287c
---

# qe-ABC-228 checks, part 1: the Q-SET freeze-review, the A1 identity, lint / typecheck / build

QE/E2E, task `qe-ABC-228`, at `grugops/ABC-228` `d9c5bcde` (code `9bd3c519`) against base `61d5d629`, after the PREREG (`20261030T072548Z-qe-e2e-decision-06163ef3`, committed `184c5855`). Deterministic readings only, in plain `node` on QE's own `git archive` trees. No timed read and no game has run yet. **This is a checkpoint, not the verdict:** the work was paused here at the owner's request (a connection reset), and the rest of the PREREG is still owed (listed at the end).

## Q-SET freeze-review (`raw/qset/`)
QE read every row with QE's own brute-force reference (`raw/qe-scripts/qset-read.mjs`): plain negamax, `legalMoves` in check below the cap, otherwise stand pat plus `legalCaptures`.
- **The SE's 12 rows: all hold.** Each row is the kind it claims (check source, evasion list, mate geometry), and each value equals QE's reference and the SE's pins. In check: Q2 −536 (pre −548); Bf1 −217; the capture of the checker 984; material loss −544 (pre 423); double check −385; the promotion block −328. Mates: Q1 29 999; exchange 29 997; cxd8=Q 29 999; exd6 e.p. 29 999; each is 5 less from ply 5, and the pre-ticket rules read no mate. The one-evasion row reads 708, not a mate. `search(…, 1)` reads 29 997 with d1d8, and the door reads 201.
- **QE's 6 PREREG rows: all hold, as predicted.**
  - `QE-C1`, knight check, pawn takes the checker: 131 (static −292).
  - `QE-C2`, pawn check with an en-passant evasion: 181 (static 14).
  - `QE-C3`, the checker taken by a capturing promotion: 940 (static −349; pre-ticket 938).
  - `QE-M1`, mated in quiescence with a negative sign: **−29 998**. `search` and `chooseMove` read −29 998 at depths 1–3, so the distance agrees across the leaf boundary; the door reads −179 at d1.
  - `QE-M2`, a smothered mate by a knight capture: **29 999**, and **29 994** from ply 5.
  - `QE-M3`, a direct call on a checkmated node: **−30 000** at ply 0, **−29 997** at ply 3, and the static −174 at the cap.
- **QE predicate error, v1 → v2 (kept in `qset-v1.txt`).** v1 asserted "the pre-ticket rules read the static score" on the in-check rows. That is wrong where a capture evades, because the pre-ticket rule stands pat and then searches captures, the capture of the checker included. 4 checks failed: `SE-C3`, `QE-C1`, `QE-C2` and `QE-C3`. v2 predicts the pre-ticket value exactly with a pre-ticket negamax. All pass, and no product fault is involved.
- **Finding QE-228-a (LOW, test strength).** On `SE-C3`, `QE-C1` and `QE-C2`, the shipped rule and the pre-ticket rule read the **same** value (984, 131, 181): when the best evasion is a capture, the old capture search already finds it. These rows meet `A2` as written (≠ static, = the best evasion, = brute force), but they cannot detect a regression to the pre-ticket rule. A discriminating capture-of-the-checker row was read post-PREREG as INFO: `QE-C4` (`5rk1/6pp/8/8/8/8/PPP2n2/3Q1R1K w - - 0 1`). Nf2+ forks Kh1 and Qd1, and Rxf2 is the best evasion at **475**, against static 652 and pre-ticket 652. It passes. QE's first INFO board (`QE-C4a`, without Rf1) was mis-described by QE: Qxf2 is not legal there. It is kept as read, under its true kind (a fork, every evasion a king move: −797 against 148).
- **The freeze.** `Q-SET` = the SE's 12 rows plus QE's 6 (`raw/qset/qset-qe.json`), with `QE-C4` recommended as a 19th row. QE does not edit `src/`. Moving QE's rows into `src/quiescence.test.ts` is a follow-up for the SE (gap **QE-228-b**, LOW).

## A1 identity (`G4`), reproduced (`raw/identity/a1.txt`)
The SE's `a1.mjs` was run unchanged on QE's trees, on a corpus of 276 positions.
- The new search door against base `search()` at d1–4: 1 104 rows, **0 differ**, sha `7a5924b5bf81f303` on both sides.
- The new engine door against base `chooseMove` to depth 4: 276 rows, **0 differ**, `aa3b9cfae2b2631b`.
- Every older door against its pre-ticket self: 0 rows differ. That is seven search doors at d3, two at d2, and three engine doors to depth 4.
- Non-vacuity: 832 of 1 104 rows differ. Every sha equals the SE's `raw/a1.txt`. Wall 3 min 48 s.

## Gates so far
- `npm run lint` exit 0 (129 files). `npm run typecheck` exit 0. `npm run build` exit 0. Own `npm ci --ignore-scripts --offline`.
- **G9:** `git diff 61d5d629 d9c5bcde -- src/levels.ts` is empty. `DEFAULT_BUDGET_MS` and `HARD_CEILING_MS` are untouched. `tools/` and `data/` are untouched.
- Production files in the delivered diff: `src/engine.ts`, `src/quiescence.ts`, `src/search.ts` and `src/transposition.ts`. So UAT is owed, and the QE verdict signs it.

## Still owed (the PREREG, in order)
1. `npm test` with the skip count and `test-skip-integrity`.
2. The deep lanes, one file each (`raw/qe-scripts/deep.mjs`): G1, G5, G7 and `A4`.
3. G8: base and head interleaved (`g8.mjs`).
4. The ALONE timing session: G6, then G11. **On a G6 miss, STOP before the smokes.**
5. The smokes: D, then R, ALONE at width 1 (`driver.mjs`).
6. The `npm exec` ruling and the verdict.
