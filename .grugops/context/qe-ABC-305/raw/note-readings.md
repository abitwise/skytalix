# qe-ABC-305 readings: A1 to A4 and A6 to A8 hold on QE's own runs, A5 holds on its raw files, and the 23rd line reads 1 passed

QE/E2E, task `qe-ABC-305`, branch `grugops/qe-ABC-305` from `379a1be7`. `main` is `fd0773af`. Every test, build and lane ran under the host lock, one job at a time, 13:15:20Z to 13:22:25Z, at `83ca69f2`, which is `379a1be7` plus my claim. Every output file was non-empty when read. Raw: `raw/out/`, scripts in `raw/scripts/`.

## A1, the shape: holds. Proved here (`raw/out/a1-a3.txt`)
- `git merge-base --is-ancestor` at `379a1be7` and at `83ca69f2`: `b297ab89` exit 0, `e763119c` exit 0, `dd88560f` exit 1. `d5041c54` and `e9cbeb40` exit 1 too.
- `git rev-list --ancestry-path dd88560f..379a1be7` lists 0 commits. `dd88560f`'s parent is `b297ab89`, so it is one step off the line and is not on it.
- `git rev-list --parents` over everything reachable from the tip finds one commit with `b297ab89` as a parent: `158bb992`, a two-parent merge. `b297ab89` is not on `main` (exit 1).
- **Owed:** the page's read of the `dd88560f` line on `main` after the merge. That is the Orchestrator's.

## A2, contents: holds
- `git diff --name-only main...379a1be7` lists exactly the six paths outside the record paths. The two-dot form lists the same six.
- `git diff b297ab89 379a1be7 -- tools/tune src/evaluate.king-mobility.test.ts`: 0 bytes.
- `src/evaluate.passer.test.ts`: `…WithoutBundle` reads 5 lines at the tip and 5 on `main`, and no line the branch removes names a door.

## A3, zero production lines: holds. Proved here
- `git diff --name-only main 379a1be7 -- src` prints the two test files and nothing else. Non-test files among them: 0.
- `src/evaluate-params.ts` has one blob, `cfe8f32a77d1`, on `main`, at the tip and at my head.
- The `git ls-tree` of `src` and `data` without `*.test.ts` hashes equal on `main` and the tip.
- `package.json`, `package-lock.json`, `vitest.config.ts`, `tsconfig.json`, `tsconfig.build.json`, `biome.json`, `AGENTS.md`, `data`, `spike` and `tools/grugops` do not differ.
- `tsconfig.build.json` builds from `src/uci.ts` alone, and no non-test `src/` file imports from `tools/`.
- Non-record paths changed: `a8594b50` to `main` 0, `35a694ee` to the tip 0, the tip to my head 0.

## A4, the default lane: holds
- **`main` `fd0773af`** (`git archive`, read today): 71 files, 2 709 passed, 0 failed, 0 skipped, exit 0. This is N, at the pre-ticket head, the same day.
- **Tip:** 71 files, 2 710 passed, 0 failed, 0 skipped, exit 0. N + 1.
- **Row by row:** 3 names in, 2 out. The new row is P1. The other two are the seams row and the FEN source row, each renamed. The file sets are equal, so no new test file.
- Skip capture: 0 at the tip, 0 on `main`. `test-skip-integrity`: `No findings.`, exit 0.
- `npm run lint`, `typecheck` and `build`: exit 0. `dist/`: 24 files, 0 from `tools/`.

## A5, read from its raw files: holds. The sealed rule was followed
I re-derived the figures from `a8.tsv` and `foreign.tsv` with my own code (`raw/out/a5-read.txt`), not with the grader.
- **Flags:** 83 samples, all `none`. Every `vitest_*` field in 27 runs is 0. `foreign_cpu_s` median 3.12 s, max 4.10, against a flag line of 8.12. A9's read had 2.895 s. So 0 of 8 scored rounds are flagged. `flags.out`'s mtime is 13:10:01Z and `grade.out`'s is 13:10:08Z, so the flags were read first, as sealed.
- **Grade:** n = 8, k = 2. H 9.085 s [9.06, 9.25], max 9.27. B 9.24 s [9.03, 9.31]. H2 9.235 s. Paired H − B wall −0.110 s [−0.250, +0.150]. Paired CPU −0.025 s. Twin CPU +0.320 s, 1.024 % of H, limit 0.4685 s, sign 6 of 8. All match `grade.out`. `grade.out` prints H2 at 9.23 from 9.235.
- **Bar:** −0.110 s ≤ +0.10 s, H 9.085 s ≤ 10 s, twin admissible. **Met.**
- **The sealed rule, clause by clause (`raw/out/a5-sealed-rule.txt`):**
  - PREREG `…987ae6ca` was committed at `3f676dbd`, 2026-11-05 22:05:19Z, 15 hours before the launch.
  - Arms: `git archive` of `a8594b50` and of `35a694ee` each differ from B and H in 0 entries. H and H2 differ in 0 entries.
  - All seven scripts are `cmp`-equal, and their sha256 prefixes are the PREREG's.
  - The lane-input diff is empty both ways, read again by me.
  - Launch 13:05:33Z, clear 13:05:48Z, inside the 900 s clock.
  - Rotation is as sealed, round 0 is unscored, 27 runs all exit 0 at the expected counts, 0 waits on the load gate.
  - 81 run files, 0 empty. No `n8-r3`. All six `se-ABC-305` notes pass the seal on read.
  - `rowdiff.py` is outside the PREREG's scripts, and the note says so. Its figures match my own code.
- **The owner's word** on a quiet host is in the brief `se-ABC-305-read`. I did not hear it myself.

### Weighed, as briefed, not re-ruled
**H − B's interval tops at +0.150 s against +0.10 s, on a median rule.**
- The PREREG fixed the median as the bar and the interval as a figure beside it, so the outcome stands.
- 3 of 8 rounds are over +0.10 s: rounds 1, 2 and 3, at +0.24, +0.15 and +0.12. Rounds 4 to 8 read −0.21, −0.01, −0.24, −0.27, −0.25.
- Rounds 1 and 4 ran in the same order and read +0.24 and −0.21. So the swing follows the clock through the hold, not the order.
- The same tree says the same thing. H2 − B reads median +0.035 s [−0.29, +0.26], and H2 − H has 3 of 8 rounds beyond ±0.10 s. Taken in H's place, H2 would still sit under the bar, by 0.065 s. That is a check, not a grade.
- A second instrument agrees on the size. The lane's in-thread sum reads H − B −17.0 ms and H2 − H −34.5 ms, and the rows net +5.0 ms.
- **My reading:** +0.150 s is the width of the session's noise, not a cost of this ticket. The read does not resolve 0.10 s in either direction, as `…9c9e2a35` says. What supports the bar is the median plus the size of the change: milliseconds, on an unchanged production tree.

**The row aim, read at 6.52 ms.**
- The figure is right: 1.445 + 2.181 + 2.899 = 6.525 ms from the 16 JSON reports (`raw/out/a5-rows.txt`), against the 90 ms aim.
- The list is complete. I read the diff of all three files, and only those three default-lane rows change by body. Every other row in the `tools/tune/tune.test.ts` diff is under `TUNE_DEEP`.
- The Engineer's own reading of the `zeroed` helper holds. Its two `phase-24 twin bites` rows add 0.423 ms, 6.947 ms with them.
- The aim counts in-thread time only, so it does not see import or transform. The file slots moved +0.9, +5.6 and +2.0 ms, and `tools/tune/tune.test.ts` still imports no tool at the file's head: `node:fs` and `vitest` only.
- In my own tip report the three rows read 1.83, 2.19 and 5.40 ms. That run was not a timed hold and is ungraded.
- **≥ 50 ms:** no added or changed row, by median or by any single run (max 5.38 ms). None of the three files has a row ≥ 50 ms by median or in my tip report. `king-mobility` A6, whose body did not change, touched 57.2 ms in one H2 run, median 34.8 ms. The PREREG's statistic is the median. The lane holds 23 rows ≥ 50 ms by median on H and H2 and 20 on B, none new by name.

## A6 and the arriving lanes, by count from each JSON report: hold
Each exit 0, 0 failed, 0 skipped, statuses all `passed` (`raw/out/report-read.txt`).

| lane | passed | default-lane rows of that file |
|---|---:|---:|
| `TUNE_DEEP` `tools/tune` | **25 of 25** | 3 |
| `SEARCH_DEEP` `src/evaluate.passer.test.ts` | **29 of 29** | 22 |
| `ENGINE_DEEP` `src/uci-session.test.ts` | **270 of 270** | 245 |
| `ENGINE_DEEP` `src/book.test.ts` | **36 of 36** | 35 |
| `ENGINE_DEEP` `tools/grugops/qe-hop-integrity.test.ts` | **36 of 36** | 32 |
| `CLI_DEEP` `src/cli.real-engine.test.ts` | **11 of 11** | 1 |

The lane count is above the default count in every row, so each flag took effect.

**`src/cli.test.ts` has no deep lane, and I read three things for it.** Its 9 lines naming `_DEEP` or `[deep` are comments and a test of the `AGENTS.md` lane lines, and it reads no `*_DEEP` variable. The file run with `ENGINE_DEEP=1` and without it gives 109 of 109 both ways, and the two row sets are identical. Both equal the file's 109 rows in the default lane. So 109 is a read of the file's default rows, not of a deep lane, and I count it as nothing more.

**`src/evaluate.king-mobility.test.ts`:** 0 lines name a deep flag, so no deep lane, and 11 of 11 with the flag equals its default rows.

## The 23rd line of `ADR-0046`'s run rule: **1 passed**
Run by name for the first time, spelled as `main`'s `ADR-0046` spells it, at 13:17:02Z: `Tests  1 passed | 35 skipped (36)`, exit 0. The JSON report names the row: `AR-154-TWO-POINT-CONTROL F1 — the whole-tree read drops no note [deep, ENGINE_DEEP=1] allNotes() holds one note per *.md`, passed. The 35 are `-t`'s filter. The Architect's "1 passed" is confirmed.
- With the flag off, the same line exits 0 with `32 skipped (32)`, 0 passed. So exit 0 says nothing here, and the rule is right to read the count.
- The test file and `tools/grugops/qe-hop-integrity.js` do not differ between the tip and `main`.
- **The trigger did not fire on this ticket.** The six paths hold no lane input and no file the set names, so the rule's other 22 lines are not owed here, and I did not run them.

## A7, the gaps close: holds. Rows named, each green at the tip
- **P1 (`QE-271-h`):** `ABC-301 P1 — the hot path's E4a sum at the probed values … evaluateAtPhase at each fixture's own phase is exact against the seam, on 44 of 44`, default lane. Its body asserts `toHaveLength(44)` and `misses` empty.
- **P2 (`QE-271-g`):** `… the seams passerTermsForTest and pawnStructureForTest are called from test files only: no other file under src/, no tools/ file, no script (QE-271-g)`, default lane.
- **P3 (`QE-271-i`):** the six rows of `ABC-301 QE-271-i: E4a traced and emitted … [deep, TUNE_DEEP=1]`, all passed. The emission row asserts `toHaveLength(17)`.
- **`QE-270-e`:** the helper line is in `src/evaluate.king-mobility.test.ts`. `KING_SHELTER_MISSING_QUEEN` and `KING_FILE_HALF_OPEN_QUEEN` are `{ mg: 0, eg: 0 }` on the table, so it changes nothing there, and both twin rows pass.
- **Whether these rows can go red** was read at `qe-ABC-301-s0`, on mutants and plants of the same content. I ran none here: the width is reads only.

## A8, records: holds
`node tools/grugops/records-path-check.js --base main` exit 0 at `83ca69f2`. It runs again before my last commit.

## Foreign load
- `ps` at the start of each step from 13:15:20Z to 13:17:04Z: no foreign vitest.
- At 13:22:25Z another project's vitest (`marketing`) was live, two processes at about 7 % CPU. It started about 13:22:06Z, inside the last 20 s of the `uci-session` lane, which I did not sample during its run.
- No timing read was in progress, and the lane passed 270 of 270. Nothing was touched.

## Not run
No timed read, no mutants, no coverage run (`mode` is lean), the rule's other 22 lines, no full deep lane outside the list above.
