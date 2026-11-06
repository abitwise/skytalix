# qe-ABC-305 verdict on ABC-305: PASS. Every row holds, UAT is waived by A3, and three gaps carry, none blocking

QE/E2E, task `qe-ABC-305`, at the tip `379a1be7`, from the readings in `…ab07f1f1`.

**Verdict: PASS.** No miss, so § What happens on a miss does not apply.

| row | state | count or figure |
|---|---|---|
| A1 | holds, proved here | `b297ab89` and `e763119c` exit 0, `dd88560f` exit 1; one commit with `b297ab89` as a parent, `158bb992` |
| A2 | holds | six paths; 0-byte diff against `b297ab89`; 5 of 5 `…WithoutBundle` lines |
| A3 | holds, proved here | two test files under `src`, 0 non-test; `src/evaluate-params.ts` one blob; **zero production lines** |
| A4 | holds | N 2 709 at `main` `fd0773af`, tip 2 710, 71 files, 0 failed, 0 skipped; skips 0 and 0; `No findings.`; lint, typecheck, build exit 0; `dist/` 24 files, 0 from `tools/` |
| A5 | holds on its raw files; sealed rule followed | 0 of 8 flagged; H − B −0.110 s against +0.10 s; H 9.085 s against 10 s; twin admissible; rows 6.525 ms, none ≥ 50 ms |
| A6 | holds | tune 25 of 25, passer 29 of 29; arriving lanes `uci-session` 270, `book` 36, `qe-hop` 36; `CLI_DEEP` real-engine 11; `src/cli.test.ts` 109, its default rows, no deep lane |
| A7 | holds | P1, P2, P3's six rows and `QE-270-e`, each named and green |
| A8 | holds | `records-path-check` exit 0 |
| A9 | this note | |

**The 23rd line of `ADR-0046`'s run rule:** 1 passed, 35 filtered, 0 failed, run by name for the first time. The Architect's "1 passed" is confirmed. The rule's trigger did not fire on this diff, so the other 22 lines were not owed and were not run.

**UAT:** waived by A3, as the page says: zero production lines, on `git`'s own reads. This verdict and the waiver go in the Done note.

## Gaps, none blocking this verdict
- **`QE-305-a` LOW (Security/NFR's to read; no action on this ticket): A5 meets its bar and does not resolve it.** The bar is the median, sealed before the read, and it is met. The interval's top, +0.150 s, is over +0.10 s, and 3 of 8 rounds are, all in the hold's first three rounds. The identical tree reads the same spread: H2 − B +0.035 s [−0.29, +0.26], twin wall R 0.220 s. I read this as noise, because the rows net +5.0 ms and the production tree does not change. The read alone could not show that.
- **`QE-305-b` INFO (the next read's PREREG): the row figures are not re-derivable from the repository.** The 24 JSON reports stay in scratch, and `raw/out/n8-r2/census-H.txt` holds 275 of the file's 2 783 lines. `rows.txt` carries one decimal. I re-derived 6.525 ms from scratch while it exists. No figure is affected.
- **`QE-305-c` INFO (the Orchestrator, at the landing):**
  - The page's `dd88560f` read on `main` after the merge is owed.
  - `git merge-tree` of this branch against `main` reads one conflict, `plans/traceability.md`, both sides appending.
  - The branch does not yet hold `ADR-0046`'s `arch-ABC-307-records` block. The block arrives with `main`, and the test file it names is the same on both sides.
  - The landing stays the humans'.

**Carried, not re-read:** `QE-301-i` INFO, and `qe-ABC-301-s0`'s recorded plants that the P2 row does not reach. Those plants are the row's stated reach, and this ticket lands the row unchanged.

**Not read here:** `R-N8H-1`'s state and any `NFR-008` line, which are Security/NFR's. The board move out of In Review is the Orchestrator's, and this hop's fences leave the board alone.
