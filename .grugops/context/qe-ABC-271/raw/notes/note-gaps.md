# qe-ABC-271 gaps: none blocking. QE-271-f MEDIUM (the graded G2 set never runs the E4a loop; the endgame set reads 1.12 × per call, above ADR-0070 d3's 1.085), QE-271-h MEDIUM (a symmetric hot-path fault survives the build's own rows), QE-271-g LOW (the second test-only export has no caller guard), and four INFO lines; one QE process slip LOW, disclosed

QE/E2E, task `qe-ABC-271`, on the build `10f29a82` (`src/` `08e56302`). The verdict note grades these gaps. Each one names its owner. None is a defect in the build, and none fires a falsifier.

- **`QE-271-f` (MEDIUM, non-blocking; Architect, and the second pull's PREREG): the endgame cost is measured by no graded row.**
  - K3's six roots never enter the loop: five are at phase 24 (skipped by d2) and the sixth has no passer. So R = 1.0187 reads the memo's two reads and one compare, as did the probe's 1.0269 and the Engineer's 1.0343.
  - On the endgame set, where every position has a passer, `evaluateAtPhase` costs **1.1246 / 1.1169 ×** per call on a host gated at 60 °C. That reproduces the Engineer's ungated 1.114 / 1.126 and sits above `ADR-0070` d3's "about 1.085 ×" (the probe's 1.084 / 1.086).
  - In search on the same six at depth 9, ns per node is **1.021 / 1.037 ×**, with nodes, scores and moves identical. K4's two boards are full-material middlegames and do not read it either.
  - At value 0 this is a cost with no benefit, which d3 accepts on purpose: no fast path, so the second pull pays a cost that is already measured.
  - **Asked:** that d3's number be restated on a dated line (≈ 1.12 × per call on the endgame set). Also that the second pull's PREREG either grades an endgame `G2` or per-node row, or names why it does not, before fitted values make the loop matter. F2's named cut (the 128 × 128 table and the bit-scan) is the instrument if that row misses. No bar of this ticket moves.
- **`QE-271-h` (MEDIUM, non-blocking; the Engineer at the next touch of `src/evaluate.ts`, at latest the second pull): no default-lane row checks the hot path's E4a sum at live values.**
  - The build's rows read the E4a part through `passerTermsForTest` only. That seam does its own king scan and reads `phaseOf`, not the walk's kings or the phase argument. Its other rows run at value 0, where the loop adds 0, or check the live mirror, which only catches an asymmetric fault.
  - Mutant **E16** (the hot path reads the side to move inverted) passes all 21 rows. E14 (both sides' kings swapped) and E15 (U never fires in the hot path) are caught only by a source-text pin.
  - The build itself is right: QE's 1 610 232 hot-path rows read `evaluateAtPhase` = mg + trunc((D0 + e_k) × (24 − k) / 24) exactly, at two live value sets and six phases.
  - **The closing row, test-only:** on the 44 frozen fixtures at the probed values, the white-POV `evaluateAtPhase(p, 0)` minus the same at the shipped values equals the seam's white (kd + free + un) minus its black. That is exact, because w = 0 at phase 0. It kills E14–E16.
- **`QE-271-g` (LOW, non-blocking; Architect): `pawnStructureForTest` is a second test-only export that `ADR-0070` d4 does not name.**
  - It is test-only and reached from `src/evaluate.passer.test.ts` alone (four calls; `git grep`). No non-test file, no `tools/` file and no script calls it. Its side effects are the ones a production memo miss has.
  - It has no "called from test files only" source row, while `passerTermsForTest` has one. One more filter line in that row would cover it.
  - Whether the ADR wants the export is the Engineer's flagged reading 4, `UNKNOWN - verify` until the Architect reads it.
- **`QE-271-i` (INFO, carried; the second pull):** `tools/tune`'s emitter writes 13 exports and not the four new ones (`…6ccd8243` item 3). The `TUNE_DEEP` lane is green at 0 (the tracer's identity gate holds). What an emitted table without the four exports would do (fail typecheck, or load as undefined) was not tried: `UNKNOWN - verify` until the second pull's tools change.
- **`QE-271-j` (INFO; Security/NFR):** `npm test` runs in 9.34 / 9.41 s on the build against 9.17 s on `main`, under `NFR-008`'s 10 s, with 0.6 s headroom. The build adds 22 rows and about 0.2 s.
- **`QE-271-k` (INFO): lanes not run.**
  - `CLI_DEEP` drives a CLI game session against the real engine, and `LADDER_DEEP` plays games. The brief says no games, so both are `UNKNOWN - verify` on this build.
  - Neither is expected to move, because the build is node-identical (K0, the 112 frozen positions, the six endgames).
  - Coverage was not run (lean mode, no threshold enforced): `UNKNOWN - verify`.
- **`QE-271-l` (INFO): the R-281-a lines report "skipped".** The `-t` runs report the file's other rows as skipped (237, 44, 82, 57): vitest's `-t` filter, not a skip. The skip-count gate runs without `-t` and reads 0.
- **Process slip (LOW, QE's own, disclosed):** QE's first mutant pass ran its vitest half without `tools/`, and the re-pass QE started for it raced that pass on the same scratch file. Both passes are discarded. The graded pass ran alone on its own copy, with the file hash checked around every run. Nothing outside the scratch area was touched, and no process was killed.
- **Closed here:** `QE-271-a` (per side, U not netted: read per side, `U7-both` 400 / 400), `QE-271-b` (U's d uncapped: `U2-out` reads 400 and mutant E2 is red), `QE-271-c` (not graded; the seam computes at every phase, `evaluate` skips at 24, and QE's hot rows confirm it at k = 24), `QE-271-d` (frontmost passer only: `KD8` reads 13 / 6 and mutant E5 is red), `QE-271-e` (K1 (c) graded on the seam).
