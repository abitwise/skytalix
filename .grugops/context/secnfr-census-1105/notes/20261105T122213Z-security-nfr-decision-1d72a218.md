---
id: 20261105T122213Z-security-nfr-decision-1d72a218
kind: decision
by: security-nfr
at: 2026-11-05T12:22:13Z
verified_by: 
confidence: high: a probe plan fixed before the probe runs; row costs are the re-read's census medians; the remnants are proposals
refs:
  - secnfr-census-1105
  - NFR-008
  - NFR-002
  - ADR-0046
  - ADR-0029
  - ADR-0035
  - ABC-105
  - ABC-171
  - ABC-212
  - ABC-094
  - ABC-101
  - ABC-241
  - QE-105-p
  - QE-244-a
  - src/uci-session.test.ts
  - src/book.test.ts
  - src/cli.test.ts
  - tools/grugops/qe-hop-integrity.test.ts
  - secnfr-census-1105/20261105T115526Z-security-nfr-decision-b9038a14
  - secnfr-census-1105/20261105T120600Z-security-nfr-observation-6315faad
  - secnfr-ABC-302-a9/20261104T203737Z-security-nfr-observation-25105dda
  - arch-ABC-302/20261104T181301Z-architect-design-decision-bcadd41d
  - 572edf13
supersedes: 
seal: sha256:fb697ef051cb7e86d7afd215c3713b08a437ca0ec05e1f095fca4c8c5b9e425e
---

# secnfr-census-1105 probe plan, sealed after the graded read's census and before the probe runs. Nine rows, 750 ms in-thread, and one stated change to the PREREG's arms

The grade is in this task's readings note, which is sealed with the results. This note fixes the list and the arms before any probe run. Row costs are the median in-thread ms over the 16 scored H and H2 runs of the re-read (`raw/out/census-H.txt`).

## The PREREG's rule applied
Every default-lane row of ≥ 50 ms is one of these.

**Excluded, with the rule that excludes it:**
- bar rows: `zugzwang.001` (120), the door row "searchWithoutQuiescenceEvasions makes null moves" (57), bundle (h) (53);
- fine-step time rows: `uci-session` ABC-167 A5 (106, 79), A6-d1 (69), A7 (71, 70, 70, 68, 60), ABC-171 A2 (69), A6 (61), ABC-174 A5 (71), ABC-220 A13 (83);
- default slices: `legal` ABC-206 A2 (86), `search.test` A4 (78);
- remnants: `engine.capacity` ABC-122 A8 (50);
- lane-shape pins: `cli` N8-LANE twenty-eight children (146), `cli` ABC-173 A6 (static) (71), which pins how children are built;
- **a named guard: `history-pane.nfr` A11 "NOWHERE ON THE FRAME PATH" (93).** It is `ADR-0029`'s frame-path guard for `NFR-002`, a measured probe in one child. No cheaper form of it exists, and no other row holds it. So `…25105dda`'s lead on this row is withdrawn, which removes its −0.03 s.

**Named (nine rows):**

| # | row | file | ms | class | lane | proposed form and remnant (the Architect confirms) |
|---|---|---|---:|---|---|---|
| C1 | ABC-171 A7 "two sessions on the same seededRandom(k) write the same bestmove sequence" | `src/uci-session.test.ts` | 54 | 1 | ENGINE_DEEP, own file | S: the same two `levelOneMoves(2)` and their equality; the unasserted `levelOneMoves(3)` goes deep. The precondition row stays |
| C2 | ABC-212 A9 "setoption name Skill Level value 7 sets 7: a bare go searches 30 000 ms" | `src/uci-session.test.ts` | 51 | 1 | ENGINE_DEEP, own file | S: `budgetAt(["setoption name Skill Level value 7"], "go")` hands `{ budgetMs: 30_000 }`, the form of the bare-go-at-6 row. `go depth 3` at 7 still reads the real rate-0 path |
| Q1 | ABC-105 A9 "--sweep lists ABC-073 as a finding" | `tools/grugops/qe-hop-integrity.test.ts` | 180 | 2 | option (ii), own file | S: the same asserts on injected notes, a named-folder subset (below) |
| Q2 | ABC-105 A3 "coverage() over EVERY real note …" | same | 90 | 2 | option (ii), own file | S: the same five reads on that subset, which must keep `quality-gate-ABC-066-qe`, the trap `QE-105-p` guards |
| Q3 | ABC-105 A4 "prints each count line and every finding by id …" | same | 65 | 2 | option (ii), own file | S: the same partition on that subset and the real board |
| B1 | ABC-094 A3 "ten seeds, one pick each, at least 3 distinct replies" | `src/book.test.ts` | 50 | 2 | option (ii), own file | S: the first seeds that already give three distinct replies, same assert |
| L1 | ABC-101 A8′ "the seam built for each level moves exactly as `createLevel` does …" | `src/cli.test.ts` | 121 | 2 | `CLI_DEEP` by option (ii), or `uci-session`'s ENGINE_DEEP | S: levels 1 and the default, three calls each, with the non-vacuity asserts. The other five levels go deep |
| L2 | ABC-241 A4 "with a legal ep capture available the same line is not a draw" | `src/cli.test.ts` | 77 | 2 | `uci-session`'s ENGINE_DEEP, beside R8 | S: the same two asserts on a 500 ms virtual step, R8's remnant form |
| L3 | ABC-241 A7 "the move the search scores 0 is the move after which gameStatusOf reports the claim" | `src/cli.test.ts` | 62 | 2 | `uci-session`'s ENGINE_DEEP, beside R8 | S: every assert unchanged, on a 500 ms virtual step. A7 is a named holder of `QE-244-a`'s five at `arch-ABC-302`, so it needs its own mutant read |

**Q1–Q3 move together or not at all.** `allNotes()` and `plainSweep()` are lazy and shared, so one row's cost is really the first reader's: moving A9 alone would hand its 180 ms to A4. The subset is the folders the five reads name, read through `readNotes`' filter, and the whole-tree read goes deep with them.

## The one change to the PREREG
- The PREREG set P1 = class 1 and P2 = P1 + class 2. **Here P1 = the six rows outside `src/cli.test.ts` (490 ms), and P2 = P1 + the three `cli` rows (750 ms).**
- Why: class 1 is two rows, 105 ms, about −0.05 s, under what the instrument can read. The split that answers a question is the `cli` one (`…25105dda`'s `UNKNOWN - verify`).
- The supply bar reads P2, the whole list, as the PREREG's "named list" says. Nothing else changes.

## What the timeline predicts, stated before the read
`cli.test.ts`'s collect children end near 3.46 s and its slot at 4.16 s, in a 9.24 s run. That worker then takes 33 more files from the shared queue. So the file's worker should not be a critical path today: the queue balances both workers, and every row should return about half its time. **Prediction: the `cli` rows return about 0.5, not the 1.0 the 2026-11-04 probe read.** P2 − P1 is the reading: about −0.13 s if 0.5, about −0.26 s if 1.0. The difference is near the noise and may not separate.

## Arms and expected counts
- H the same arm: 71 / 2 709 / 0 / 0. P1: 71 / 2 703 / 6 / 0. P2: 71 / 2 700 / 9 / 0. P2's counts were confirmed by one smoke run under the lock, which is not a reading. The diffs are `raw/out/probe-P1.diff` and `raw/out/probe-P2-over-P1.diff`, and each changed line is one `it(` → `it.skip(`.
- Rotated H P1 P2 / P1 P2 H / P2 H P1, round 0 discarded, until 8 complete scored rounds or 12 rounds, one hold, the same host gate, and the same clear-host start as the re-read.
- Estimate before the read: 750 ms × 0.45 is about −0.34 s, against the −0.31 s bar, so this could fall on either side.
