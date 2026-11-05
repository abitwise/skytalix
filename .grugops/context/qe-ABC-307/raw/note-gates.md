# qe-ABC-307 A1 to A5 and A8: the diff is the four test files, the counts are the page's, the 22 lines read as ruled, and the gates are green

QE/E2E, task `qe-ABC-307`, under PREREG `…e4ce81fb`. Runs were under the host lock on core 0, 14:49Z to 15:02Z. Raw: `raw/a1-a2.txt`, `raw/a2-comments.txt`, `raw/a3.txt`, `raw/a8/a8.tsv`.

- **A1.** Outside the records the diff lists the four named test files. No file added or removed. The waiver `grep` is **empty**, over base to tip and in the standing rule's `<delivered>~1` form on `47556083`.
- **A2.** All nine bodies equal base's with the indent removed (`se-ABC-307`'s `a2check.py`, re-run by QE). Of 29 added comment lines, every one citing another id sits in a moved body; the new ones cite only `ABC-307`, `secnfr-census-1105`, `arch-ABC-307`, `ADR-0046` and, on `F1`, `AR-154-TWO-POINT-CONTROL`.
- **A3.** `npm test` at base and tip: 2 709 / 2 709 in 71 files, 0 failed, 0 skipped. File sets equal. 9 names out, 9 in, by file 1, 3, 2 and 3. No " [deep" title. Per file 35, 109, 245, 32, unchanged.
- **A4.** All nine lines "1 passed", 0 failed. Whole deep lanes, passed, base → tip: `uci-session` 265 → **270**, `qe-hop` 32 → **36**, `book` 35 → **36**, each 0 failed, exit 0. `uci-session` took 325 s on each side.
- **A5.** All three of the trio moved. Sentinel and `F4` are read in the A7 note.
- **A8.** `npm run typecheck`, `npm run lint` (148 files), `npm run build`: exit 0. Skip count 0. `test-skip-integrity` and `lane-inventory`: No findings.
- **The 22 lines, each by its count:** `ABC-167` A5 **4 passed**; the other 21 **1 passed**. Each took 2 s or less. `F1` is on none of the 22; A4's whole `qe-hop` lane reads it here (the 23rd line is the Architect's, `…ad217a34` 3).

**One small loss, not a bar.** The comment on `STEP_MS` (`ABC-244`: why 100 is kept) left `src/cli.test.ts` with the constant and was not carried to the deep describe. A2 names the constant's leaving, so this is inside the exception. INFO for whoever next reads that step.

**Foreign load:** the same project's vitest, in 222 of 249 samples. The 17 sample rows naming `qe-ABC-307` are this hop's own gates, run in the worktree. Recorded, not touched.
