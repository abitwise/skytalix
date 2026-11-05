# qe-ABC-307 A9, read 1: VOID on foreign load. Three of the 8 scored rounds are flagged, so no figure from it stands. One re-read follows, in a new output directory

QE/E2E, task `qe-ABC-307`, under PREREG `…e4ce81fb`. One hold, 15:17:00Z to 15:21:12Z, 252 s. The slot opened after 14 minutes of polling. Raw: `raw/n8-r1/`.

**What the flags show (`flags.py`):**
- 84 samples, 30 sample rows naming a foreign vitest, all from one project by working directory.
- `foreign_cpu_s` on scored runs: median 3.35 s, min 2.59 s, max 20.53 s.
- **Flagged rounds 2, 3 and 4.** Round 2: B and H, busy `ps`, sampled and CPU. Round 3: B and H, the same. Round 4: B, on CPU alone (20.53 s foreign, no vitest named in that window).
- 8 complete scored rounds, 5 unflagged.

**Reading.** The PREREG voids a read on any flagged scored round, and three also pass `…b9038a14`'s "more than 2 of 8". This is a void, not a miss. The grade script was not run on this read, so it has no MET line, H − B or twin to cite. All 27 runs exited 0 at 71 files and 2 709 passed.

The clear check passed at the start of the hold, and foreign vitest arrived about a minute in. That check cannot guard the rest of a hold, as `…9e878ba6` said.

**Next:** the one re-read, same harness, same arms, `<scratch>/qe307/out/n8-r2`. A second void stops the hop.
