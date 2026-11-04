# se-ABC-271 acceptance: K0 7/7 exact (nodes, score, move byte-identical to main), K1 (a)–(e) green, K2 exactly the two memo-size re-pins, K3 G2 R 1.0343 on QE's six roots (Engineer pre-read, not QE's graded read), K4 G6 MET; F1–F3 do not fire

Software Engineer, task `se-ABC-271`, build `10f29a82` (`src/` `08e56302`) against `main` `3a08d244` (`src/` `4fb3da04`). Every run went under `flock <scratch>/host-test.lock`, except the four mutation runs disclosed in the tests note. Outputs are in `.grugops/context/se-ABC-271/raw/out/`.

## K0, node identity (ADR-0070 d5): MET, 7 / 7 exact
| row | frozen | build | main copy |
|---|---:|---:|---:|
| `chooseMove` kiwipete d8 / d9 | 766 275 / 1 725 150 | 766 275 / 1 725 150 | same |
| `chooseMove` position-6 d8 / d9 / d10 | 87 475 / 253 724 / 533 916 | 87 475 / 253 724 / 533 916 | same |
| `search()` d8 kiwipete / position-6 | 605 117 / 406 787 | 605 117 / 406 787 | same |
- Read twice: the new deep row (`SEARCH_DEEP=1 src/evaluate.passer.test.ts`, which asserts each count against `FROZEN.k0`), and `raw/scripts/k0x.ts` on the build and on a `git archive` copy of `main`. The two `k0x` outputs (nodes, score, move) are **byte-identical** (`raw/out/k0-main.out`, `k0-build.out`).
- `main`'s non-test `src/` did not move, so there is one set (ticket K0).
- **Every existing door reads its pre-ticket counts.** Every deep lane that pins door counts passed unchanged: see 52, futility 53, null-move 45, PVS/LMR 29, taper 170, search 57, quiescence 116, tt 40 / 26, engine 83, pawns 44, levels 58, puzzle 18, tune 17 (`raw/out/deep/summary.txt`).

## K1 (default lane, units, no search): MET
- **(a) mirror, `Object.is`:** `G3` 184 + `TAPER_MIRROR_POSITIONS` + QE's 12 passer positions + the 44 seam fixtures: **0 mismatches** at the shipped values, and 0 with the terms live at the probed values. The seam is colour-symmetric on all 44 (the white and black parts swap on the mirror).
- **(b) value identity, `Object.is` against the pre-ticket `evaluate`** (read on the `main` copy before the build ran, `raw/scripts/genpre.ts`): `G3` 184, `TAPER_DOOR_CORPUS` 176, `ABC-270`'s 28 queen pairs, and QE's 12 + 44 with their mirrors (112): **0 differ.** Report beside it, `raw/out/xbuild.out`: every position of the 200 C2′ games on record (`qe-ABC-269` b8, `qe-ABC-279` c2), 27 696 positions, 13 082 of them with a passer: `evaluate` and `evaluateAtPhase(p, phaseOf(p))` on main against the build, **0 differ**, and the seam at the shipped values is 0 on every one.
- **(c) the seam at `ADR-0070` d1's probed values:** `passerTermsForTest` returns QE's frozen `{ kd, free, un }` **exactly, per side, on all 44 fixtures**. Each of the 19 pairs' A − B per side per part equals the frozen difference. U = 400 exactly on the frozen U rows, all at phase 0, and 0 elsewhere; `U7-both` reads 400 / 400 (not netted). At the shipped values every part is 0 on every fixture.
- **(d)** A9 reads the four E4a pairs; |Σ mg| ≤ 15 910, |Σ eg| ≤ 17 510 at 0, the int16 range holds; a 2 000 cp rank-6 half, or a U of 30 000, turns it red.
- **(e) memo:** on the 44 + 12 + `G3` 184, a cold miss and then a confirmed hit (`pawnCacheProbeForTest`) each return what a fresh `pawnStructure` returns, the two words included. On every fixture the words name exactly QE's frozen frontmost passers. `KD8` records d5 only.
- **Source row:** `whiteMinusBlack` holds only the walk's two loops and calls `passerTerms` twice with the walk's `whiteKing` / `blackKing`. `passerTerms` reads no piece type and does no 0x88 scan. The guard is `w < PHASE_SPAN && (whitePassers | blackPassers) !== 0`, with no value test. `passerTermsForTest` is called from no non-test file in `src/`.

## K2, exactly two re-pins: MET
`src/evaluate.pawns.test.ts`'s memo row (both `expect` lines and its title: 2^14 × (8+8+4+4+4+4+4), 576 × 1024) and `src/transposition.test.ts` A7's `pawnCacheByteLength()` line: 458 752 → 589 824. **No other assertion changed in any lane.** The other test-file edits are additions: the A9 bound extension and its new row, plus the new file.

## K3, G2 (Engineer pre-read; QE grades under its PREREG): 1.0343 ≤ 1.05
`raw/scripts/g2.ts`, the probe's A5 shape: two sessions in reverse order under one lock hold; B = a `main` copy, C = a second `main` copy (control), H = the build; 200 000 calls per position per round, six rounds, first round dropped.
| session | roots r (graded set) | control c | EG report set r | EG c |
|---|---:|---:|---:|---:|
| B,C,H | 1.0373 | 1.0031 | 1.1135 | 1.0041 |
| H,C,B | 1.0314 | 0.9994 | 1.1256 | 1.0029 |
- **R = 1.0343** (the probe's H: 1.0269).
- **Reported, not graded:** the EG set reads **1.114 / 1.126**, above the probe's 1.084 / 1.086 and above the ADR's "about 8.5 %" risk line. See the artifacts note's risk item.
- The host was not ALONE (load 1.1–1.5). Tctl was not read for G2.

## K4, G6 (Engineer pre-read): MET
QE's `qe-ABC-270` `g6.mjs` / `timed.mjs` / `grade-g6.mjs` unchanged. `host.mjs` was copied with **one change: the Tctl wait relaxed 60.0 → 75.0 °C** (the host idled at 63.4 °C; the se-ABC-270 precedent; `raw/scripts/g6-host.mjs.diff`). `LEVELS[5]` at 4 000 ms, 5 interleaved rounds, one fresh process per search.
- **kiwipete:** base 9 9 9 9 9, build 9 9 9 9 9, median 9 / 9, both play Bxa6.
- **position-6:** base 12 × 5, build 12 × 5, median 12 / 12, both play Nd5.
- Every run ≥ 6 (min 9); 0 WARN. Tctl over the reads: median 73.4, max 75.6.
- **S2 nps (reported, not graded, `…6ccd8243` item 2), as the G6 node medians H / B:** 0.9941 kiwipete, 1.0039 position-6.

## Reported, not graded
- **N8-LANE:** `npm test` on `main` 2 650 / 2 650 in 9.15 s (wall 9.46 s); on the build 2 672 / 2 672 in 9.04 s (wall 9.34 s). Both are inside NFR-008's 10 s, with little headroom.
- The endgame G2 set: above.

## Falsifiers
F1 does not fire (no node, score, move or `Object.is` miss; no re-pin outside K2). F2 does not fire on the graded rows, though the endgame report set is flagged. F3 does not fire (every seam row matches). F4 and F5 belong to the second pull.
