---
id: 20261104T010223Z-qe-e2e-observation-aa889eb8
kind: observation
by: qe-e2e
at: 2026-11-04T01:02:23Z
verified_by: 
confidence: high: deterministic counts and Object.is readings by QE's own scripts, one process each, H against main src 4cb84035, under the host lock; K1 (c) checked against a re-implementation of the stated rule, not the build's code
refs:
  - qe-ABC-270
  - grugops/ABC-270
  - ABC-270
  - EPIC-011
  - E3a
  - ADR-0068
  - ADR-0067
  - ADR-0064
  - ADR-0028
  - ABC-083
  - ABC-274
  - ABC-239
  - K0
  - K1
  - K2
  - K3
  - K4
  - F1
  - F2
  - F5
  - G2
  - G6
  - S2
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - QE-270-a
  - QE-270-d
  - QE-270-e
  - QE-270-f
  - QE-270-g
  - UAT
  - 4b9c5357
  - 4cb84035
  - 795a6b61
  - 0f393c18
  - fb920c14
  - src/evaluate.ts
  - src/evaluate-params.ts
  - src/evaluate.queen-on.test.ts
  - src/evaluate.taper.test.ts
  - src/evaluate.king-mobility.test.ts
  - qe-ABC-270/20261104T001924Z-qe-e2e-decision-f8ab73a7
  - qe-ABC-270-freeze/20261103T222633Z-qe-e2e-decision-fa82b3f3
  - qe-ABC-270-freeze/20261103T222638Z-qe-e2e-observation-543b10d8
  - se-ABC-270/20261104T000848Z-software-engineer-decision-007dc90a
  - se-ABC-270/20261104T000848Z-software-engineer-observation-15cac083
  - se-ABC-270/20261104T000848Z-software-engineer-observation-bd09c051
  - se-ABC-270/20261104T000848Z-software-engineer-observation-77fd2bd9
  - sha256:68769ea9712097ff1a366b6ad952a71376579fba94d6625c032062dd5e19c681
supersedes: 
seal: sha256:042093ccc3ed69191576b7e21fd56ad86931cf4820fa9b792bff26ec725f82ab
---

# qe-ABC-270 K0 and K1, re-read independently by QE's own scripts, one process each, against `main` `src/` `4cb84035`: **K0 7 / 7 exact + 4 door counts, cross-build 0 / 9 120; K1 (a) mirror 0 / 368 264 at non-zero queen-on values; K1 (b) 0 / 4 840 290 `Object.is` misses; K1 (c) QE's 7 frozen pairs exactly 3 × per king in each half (QP2 graded per king), the control still, and 0 misses over 184 132 positions where the seam and the hot path both equal the stated rule; K1 (d) green; K1 (e) both twins green on base and build, red with the term zeroed, FENs literal. `QE-270-a` closed**

QE/E2E, task `qe-ABC-270`. H = `grugops/ABC-270` `795a6b61` (`src/` `0f393c18`); B = `main` `4b9c5357` (`src/` `4cb84035`, unmoved since the cut, so K0 has one set of counts). Every run under `flock <scratch>/host-test.lock`. Scripts `raw/scripts/`, outputs `raw/out/`.

## K0, node identity (`a1.ts`, `qe-ABC-274`'s, unchanged but its first comment line; `raw/out/a1.out`)
- `chooseMove`, frozen clock: kiwipete d8 / d9 **1 296 788 / 2 733 330**; position-6 d8 / d9 / d10 **404 930 / 926 005 / 1 692 669**. `search()` d8 kiwipete / position-6 **839 514 / 1 533 901**. Each equals the ticket's K0 and `ADR-0068` d6, on H and on B, with the same depth, score and move.
- Older doors, pre-ticket counts on both: `chooseMoveWithoutTaper` d8 1 306 981 / 391 451; `searchWithoutTaper` d8 888 786 / 1 262 046.
- **Cross-build:** 190 positions (G3's 184 + 6 endgames); `search` and 9 search doors at d1–3 (Pruning doors d1–2), `chooseMove` and 7 engine doors at d3, door lists equal on both trees: **9 120 rows (8 360 door rows), 0 mismatches** in nodes, score or move.

## K1 (units)
- **(a) Mirror** (`k1.ts` part 2): `evaluate` and `evaluateWithoutTaper` `Object.is` on each position against its mirror, over 92 066 distinct FENs, at the queen-on pairs at distinct values (mg ≠ eg: 7/11, 13/3, 5/17) and at 2 × base: **0 mismatches in 368 264 rows.** At 0 it is K1 (b)'s mirror rows below (0 / 62 055). The build's own A1 / B1 (a) / K1 (a) rows are green in `npm test`.
- **(b) Value identity** (`a2.ts`, `qe-ABC-274`'s, unchanged but its first comment line; `raw/out/a2.out`): H against B in one process, every evaluation entry (`evaluate`, `evaluateWithoutTaper`, `evaluateWithoutMobility`, `evaluateWithoutPawnCache`, twice each, and `evaluateAtPhase` at phases 0–30) over G3's 184, every FEN string in `src/evaluate.taper-corpus.ts` (296, the KP rows and the door corpus among them), the mate corpus (287), 9 extreme boards and 61 397 seeded random-play positions, each mirrored: **4 840 290 rows, 0 `Object.is` misses**, 0 `phaseOf` misses. QE's 28 pair positions are covered by the build's own K1 (b) row (green) and by K1 (c) at 0 below.
- **(c) The queen-on structure through the seam** (`k1.ts` part 1, `raw/out/k1.out`). Rows read from `pairs.json` itself (sha256 `68769ea9…c681`, checked); per king through `kingExposureForTest` inside `withParametersForTest`:
  - at 0, every king in every A and B reads its frozen base cp in both halves;
  - at 2 × base, every king reads its frozen `seam2xCp`. **Each subject king's A is exactly 3 × its B in mg and in eg:** QP1 75 / 25, QP2 105 / 35, QP3 75 / 25, QP4 120 / 40, QP5 180 / 60, QP6 105 / 35, QP7 150 / 50. Each other king is equal in A and B; QC8 moves nothing; QP7 (two queens) reads 3 ×, not 5 ×;
  - through `evaluate` and through `evaluateWithoutTaper`, the 0 → 2 × white-POV change equals the frozen `seamNetWpov` on all 16 positions (QP2 A reads 0, as frozen). **QP2 is graded per king, so `QE-270-a` is closed by the read.**
  - **Beyond the frozen set** (part 2): over 184 132 positions (92 066 FENs and mirrors; 130 122 with a queen flag, 68 934 with both; each feature hit tens of thousands of times), per king and per half, the seam's change at the distinct values equals QE's re-implementation of the **stated rule** (`qe-ABC-270-freeze` `verify.mjs`'s `counts()`, not the build's code) × the values; its value at 0 equals 15 s + 10 h + 20 o; and the **hot path's** change (`evaluateWithoutTaper` and `evaluateAtPhase(·, 24)` for mg, `evaluateAtPhase(·, 0)` for eg) equals black's predicted change minus white's: **0 misses in 368 264 seam rows and 552 396 hot-path rows.** This reads the walk's own flags, which the test seam's separate scan cannot see.
- **(d) Range row:** `ABC-274` A9 and the new K1 (d) row green in `npm test`; the bound adds each queen-on pair to its base term per file and prints |Σ mg| ≤ 15 910, |Σ eg| ≤ 17 510 at 0 (unchanged; read in the diff: no expected number moved).
- **(e) The re-found rows** (`k1e.ts`, `raw/out/k1e.out`), on B and on H, identical readings:
  - all four twin FENs at phase 24; the same pawn shapes as the old pawn-ending rows (pieces stripped, compared) and equal, symmetric material;
  - A2 (b) twin: sheltered 0, g6 −3 (**green**); `KING_SHELTER_MISSING` zeroed: g6 +12 ≥ 0 (**red**). A3 (b) twin: f5 +13, e5 +11 (**green**); `KING_FILE_HALF_OPEN` zeroed: e5 +21 ≥ 13 (**red**). Green on `main` too, so `ADR-0068` d5's "go once green on `main`" holds and F5 does not fire;
  - **literal FENs** (`bapm-ABC-239-rulings` line): each of the four twin FENs appears in `src/evaluate.king-mobility.test.ts` as one full double-quoted literal, twice (its constant and the A1 mirror list); no template or concatenation builds one;
  - the old rows, for the record (same on B and H): A2 (b) g6 −3 vs 0, zeroed +12 (it bit); A3 (b) e5 −13 vs f5 +1, zeroed e5 −3 vs +1 (**it no longer bit** on `ABC-215`'s tables, as the Engineer noted). The twin restores the bite.
- **Source row:** read in the diff: the walk's single non-pawn compare became `type >= QUEEN` (QUEEN 5, KING 6), with KING / QUEEN told apart inside; one `pieceType(` and one `squaresReached(` per piece as before; `kingExposure` takes the enemy-queen flag and adds the three packed queen-on terms once, before its unchanged file loop; the phase stays an argument (C1). The build's source-text row is green.
