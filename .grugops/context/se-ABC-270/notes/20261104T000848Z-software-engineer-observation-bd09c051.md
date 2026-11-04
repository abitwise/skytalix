---
id: 20261104T000848Z-software-engineer-observation-bd09c051
kind: observation
by: software-engineer
at: 2026-11-04T00:08:48Z
verified_by: 
confidence: high (test diff read back; every run's exit code and count recorded; mutants restored by git checkout)
refs:
  - se-ABC-270
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
  - K0
  - K1
  - K2
  - K3
  - K4
  - G2
  - G6
  - NFR-005
  - NFR-008
  - NFR-009
  - QE-270-a
  - 4cb84035
  - 8f086ee8
  - 795a6b61
  - 0f393c18
  - src/evaluate.ts
  - src/evaluate-params.ts
  - src/evaluate.queen-on.test.ts
  - src/evaluate.taper.test.ts
  - src/evaluate.king-mobility.test.ts
  - qe-ABC-270-freeze/20261103T222633Z-qe-e2e-decision-fa82b3f3
  - qe-ABC-270-freeze/20261103T222638Z-qe-e2e-observation-543b10d8
  - sha256:68769ea9712097ff1a366b6ad952a71376579fba94d6625c032062dd5e19c681
supersedes: 
seal: sha256:fa001bc49b794635e7269d9d8f05a35e9f4f822a0903644879712ff9d0eff05e
---

# se-ABC-270 tests: 16 rows added, 2 pawn-ending rows replaced by their phase-24 twins (ADR-0068 d5), 0 expectations moved. npm test 2 588 → 2 604 / 2 604; every deep lane green on the build. Six planted mutants (swapped queen flags in evaluate and in the per-king read, flag always on, queen-on eg ignored, slots swapped, flag from the wrong colour's queen) each turn the new file red

Software Engineer, task `se-ABC-270`, branch `grugops/ABC-270`, code `795a6b61`. Every run under `flock <scratch>/host-test.lock`; one-file vitest with `NODE_OPTIONS=--max-old-space-size=400`.

## Rows added (default lane, no search)
- **`src/evaluate.queen-on.test.ts` (new, 13 rows):**
  - the three pairs are `{ 0, 0 }`;
  - QE's frozen set as copied: 7 pairs + 1 control; A and B differ only on the removed squares, which hold the subject's enemy queens;
  - K1 (c), per king through `kingExposureForTest`: at 0 each king's exposure is its base cp in both halves; at 2 × base the subject king's A is exactly 3 × its B in each half (and equals QE's `seam2xCp`), the other king is equal, QC8 moves nothing;
  - each pair counts its own feature (`{ mg: 1, eg: 3 }` on one pair at a time: exposure = base + count in mg, base + 3 × count in eg, for sQ / hQ / oQ, both kings, all 16 positions);
  - through `evaluate` and `evaluateWithoutTaper`: 0 → 2 × base moves white's view by QE's frozen `seamNetWpov` (QP2's A reads 0 here, which is why the per-king read exists, `QE-270-a`);
  - the queen-on eg halves enter the blend: `{ mg: 0, eg: 24 }` moves only the phase-0 score, by −24 × (white's count − black's), and leaves `evaluateWithoutTaper` alone;
  - K1 (a): mirror `Object.is` on G3's 184 + `TAPER_MIRROR_POSITIONS` + QE's positions, at 0 and at 2 × base, 0 mismatches;
  - K1 (b): `evaluate` `Object.is` the pre-ticket `evaluate` on G3's 184, `TAPER_DOOR_CORPUS`'s 176 (every taper-corpus FEN, the KP rows among them, and mirrors) and QE's 14 distinct pair FENs plus their mirrors (28). The `*_PRE` values were read on the pre-ticket tree (`git archive` of `main`'s `src/` `4cb84035`) before any build code ran (`raw/scripts/freeze-pre.ts`); 0 `-0` among them;
  - the source row: the walk holds `if (type >= QUEEN) { if (type === KING) {`, no `type === QUEEN`, one `pieceType(` and one `squaresReached(`; each king gets the enemy's flag; `kingExposure` adds the queen-on terms before its file loop, and the loop never reads the flag.
- **`src/evaluate.taper.test.ts`:** the parameter-table row lists the three new pairs (still only `PASSED` and `PST.king` differ); `A9`'s bound now adds each queen-on pair to its base term per file (K1 (d)); one new row proves the bound reads each queen-on pair's maxima (an eg of 6 000 turns it red; mg 30 raises the mg bound). `A9` prints unchanged |Σ mg| / |Σ eg| at 0.
- **`src/evaluate.king-mobility.test.ts`:** A2 (b) and A3 (b) re-found at phase 24 (K1 (e)), each with a "red with its term zeroed" row through `withParametersForTest`; the four twin FENs join A1's mirror list.

## Rows replaced (not re-pinned)
- `ABC-083` A2 (b) and A3 (b), the pawn-ending (phase-0) rows, are replaced by their phase-24 twins, as `ADR-0068` d5 directs. Both old rows read green before and after (A2 g6 −3 vs 0; A3 e5 −13 vs f5 +1, white's view). Report: zeroed, the old A2 row goes red (+12) but the old A3 row stays green (e5 −3 vs f5 +1), so on today's tables it no longer proved its term (`raw/out/gates/old-rows-*.out`).
- No other expectation changed. No number in any existing row moved (K2).

## Bite (planted mutants, each restored by `git checkout`, `raw/out/mutants.txt`)
| mutant | new file |
|---|---|
| M1 swapped flags in `evaluate`'s two `kingExposure` calls | 3 failed / 13 |
| M1b swapped flag in `kingExposureForTest` | 2 failed |
| M2 flag always on | 5 failed |
| M3 queen-on shelter eg ignored at load | 4 failed |
| M4 half-open queen-on slot loaded from the open pair | 4 failed |
| M5 black flag set by a white queen in the walk | 2 failed |

## Runs
- `npm test`: base (detached `main` worktree `f920bb48`, `src/` `4cb84035`) **2 588 / 2 588**, 66 files, Duration 9.53 s; head **2 604 / 2 604**, 67 files, Duration 9.69 s (`N8-LANE` report, before → after; wall includes lock wait for the head run).
- `npm run lint`, `npm run typecheck`, `npm run build`: exit 0 (`raw/out/gates/`).
- Deep lanes on the build (`raw/scripts/deep.sh`, `raw/out/deep-head/exits.txt`), each exit 0 unless noted: see the acceptance note for the table.
