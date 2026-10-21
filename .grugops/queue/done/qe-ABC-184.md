---
subtask: qe-ABC-184
role: qe-e2e
ticket: plans/tickets/ABC-184-a7-asserts-the-booked-child-spawned-from-neutral.md
ref: .grugops/context/qe-ABC-184/
branch: grugops/ABC-184 (tip c6f80c81; code 442d1e57; base 5277babd); SE worktree ../wt-ABC-184 (read only)
width: 2 (beside bapm-rescope-ABC-165, records only)
---

# QE gate for ABC-184 (test-only; the AR-183-CWDARG close row)

## Do
- Verify A1–A5 against the page. **A3 is yours to re-plant independently** — its TCWD + P6f row is the close condition for `AR-183-CWDARG`:
  - Build TCWD (drop `booked`'s `neutral` cwd argument), P6f (`src/book-file.ts`, body as in your `ABC-162` note `…567002e7`) and TMO (as in `ABC-183`) yourself, in scratch copies outside the repo, private `TMPDIR` per run. Record each plant's sha256.
  - Run every row of the page's table (none, P6f, TCWD + P6f, TCWD alone, TMO + P6f) against the base test and the head test under `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400`. The close row: base 11/11 green, head red `A7` at the new `booked.cwd` assertion, `AR-183-CWDARG` in the failure output.
- **Grade what the new assertion actually pins.** `RealChild.cwd` is the argument handed to `spawnSync`, not read from the child. Find what still survives (e.g. `spawnNode` recording `cwd` but spawning with another value; a plant that edits the record line). Record survivors with their severity; say whether any undercuts the close.
- **A4:** re-read `ABC-183` A1's `grep -B1` (still how QE-183-b is covered).
- **A5 fences:** exact file list; every grep count the page names, base and head; `CLI_DEEP` 11 tests, 6 children (the SE counted children with `--silent=false --reporter=default`, because the default run printed no `[CLI_DEEP]` lines in its environment; say what you see); no line moves above the page's stated line.
- **Independence.** Do your own plants and readings before opening the SE's (`.grugops/context/ticket-to-pr-ABC-184/` on the branch).
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987); skip-integrity `--skip-count 0`; `CLI_DEEP` and `PERFT_DEEP`.
- **Heap rule:** 400 for one-file runs, 128 for whole-suite or multi-file runs, one at a time. Take no timing.
- **UAT waiver:** measure it in AGENTS.md's form. Do not filter out `.snap`.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-184` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-184 page there.
- No production files, `AGENTS.md`, `plans/board.md`, or other ticket pages. Plants only in scratch copies.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-184`). **Pass your worktree as the context root explicitly**; the writer's default root is the plugin's own directory. Take every `at` from `date -u`.
- Write `.grugops/queue/done/qe-ABC-184.md` (brief + `## Result` + trace row as one `| ABC-184 | … |` line) and `.claim.md`, uncommitted on main.

## Result (qe-e2e, 2026-10-21 12:07Z): **PASS_WITH_GAPS**. Commit `2c65403b` on `grugops/qe-ABC-184` (from tip `c6f80c81`, code `442d1e57`, base `5277babd`; worktree `../wt-qe-ABC-184`)

- One commit: 5 sealed notes and a `## QE` section on the ABC-184 page.
- No production file, `plans/board.md`, `AGENTS.md` or other ticket page was touched.
- No push, merge, force, amend or rebase. No timing was taken.

### `AR-183-CWDARG` close condition: **MET** (QE re-planted independently, before opening the SE's notes)
- **P6f:** sha256 `afeab577c9566c5b…f71e`. The body is `…567002e7`'s (try the cwd read, catch → module URL).
- **TCWD:** `, neutral` removed from the one `booked = spawnReal(` line. Base `008c4e79` (byte-identical to QE-183's and Security/NFR's), head `be86a15f`.
- **TMO:** the decoy's `mkdirSync` and `writeFileSync` moved to directly after that line. Base `c9ff8261`, head `379a451f`.
- **Tests:** base `8a84dfa3`, head `a4dbb308`.

| plant | base test (`5277babd`) | head test (`442d1e57`) |
|---|---|---|
| none | 11/11 green | 11/11 green |
| P6f | 10/11, red A7 `:545` (stderr detector) | 10/11, red A7 `:552` (stderr detector) |
| **TCWD + P6f** | **11/11 green** | **10/11, red A7 `:504`: `AR-183-CWDARG: the booked child must spawn from neutral, or the detector runs from the tree root and is disarmed`** (3 matching lines in the output) |
| TCWD | 11/11 green | 10/11, red A7 `:504` (same message) |
| TMO + P6f | 10/11, red A7 `:503` (`AR-162-FALLBACK`) | 10/11, red A7 `:510` (`AR-162-FALLBACK`) |

- Every cell ran in a fresh `git archive` copy outside the repo with a private `TMPDIR`, under `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400`, one at a time.
- 0 lane-made leftovers. The SE's matrix `…48b1a153` agrees cell for cell.
- The Orchestrator records the close.

### What the new assertion pins
- `RealChild.cwd` is `spawnNode`'s `cwd` parameter, the same identifier as the `spawnSync` option. So any edit upstream of `spawnNode` is caught, and TCWD is one of these.
- **Survivors under P6f:**
  - **TSPWN** (`01d60c77`): the option line alone is aimed at the neutral child, `cwd: cwd.includes("abc162-neutral-cwd-") ? REPOSITORY : cwd,`. Result 11/11.
  - **TFORGE** (`b54249a6`): TCWD plus `{ ...spawnReal(…), cwd: neutral }`. Result 11/11.
- **Killed, but not by the new assertion:**
  - **TSPWG** (`68743f77`): `cwd: REPOSITORY` for every child. Result 7/11, red at `ABC-119` A1 and A3(iv), `ABC-095` A5 and `ABC-101` A10.
- **Closed by construction:** `CHILD_ENV` is `{}`, so there is no `PWD`/`INIT_CWD` route.
- **Neither survivor undercuts the close.**

### Grades
| criterion | grade | reading |
|---|---|---|
| `A1` | MET | `grep -cE '^\s*readonly cwd: string;'` 0 → 1 at `:231` in `RealChild`; `spawnNode` returns `cwd` (`:268`), the same identifier as the `spawnSync` option (`:247`) |
| `A2` | MET | one `expect(booked.cwd, "AR-183-CWDARG: …").toBe(neutral)` in A7's `it` (`:501-504`), above the stderr detector (`:549-552`); `AR-183-CWDARG` 0 → 1; `booked.cwd` 0 → 1 |
| `A3` | MET | the table above, all ten cells |
| `A4` | MET | `grep -B1 -F 'booked = spawnReal('` first line is `decoyBeforeBooked = existsSync(join(neutral, BOOK_PATH));` at base and at head |
| `A5` | MET | diff names only `src/cli.real-engine.test.ts` (+7/−0); `spawnReal(` 5/5, `spawnNode(` 2/2, `mkdtempSync(` 2/2, `removeCopy(` 3/3, `rmSync(` 1/1, `writeFileSync(` 1/1, `existsSync(` 6/6, `it(` 11/11, `expect(` 75 → 76; `head -222` byte-identical, first hunk `@@ -229,0 +230,2 @@`; `CLI_DEEP` 11 tests, 6 children at base and head; `npm test` 59/1987 = base (QE's own base reading), 0 skips |

### Gates (QE worktree at `c6f80c81`; one at a time; heap 400 for one-file runs, 128 for `npm test` and the skip count)
| gate | result |
|---|---|
| lint / typecheck / build | rc 0 / 0 / 0 (biome 116 files, no fixes); typecheck negative control (record removed, scratch) rc 2 `TS2741` |
| `npm test` | rc 0, 59 files / 1987 tests (base, scratch `git archive 5277babd`: the same) |
| `last-run.json` | `success: true`, 436 suites, 1987 passed, 0 failed, 0 pending, 0 todo |
| skip-integrity `--skip-count 0` | `No findings.`, rc 0 (skip count measured 0) |
| `CLI_DEEP` | 11/11, 6 children |
| `PERFT_DEEP` (`src/perft.test.ts`) | 32/32 |

### Child count, as the brief asked
- **Default reporter:** 0 `[CLI_DEEP]` lines in this agent session, at base and at head. It is still 0 with only `CLAUDECODE` unset.
- **With every `CLAUDE*` variable and `AI_AGENT` unset:** 6 lines, 11/11.
- **`--reporter=verbose`:** 6 lines.
- The cause is vitest 4.1.11's `std-env` `isAgent`, not `CLAUDECODE` alone.

### UAT waiver (AGENTS.md's form, no `.snap` filter)
- `git diff --name-only 442d1e57~1 442d1e57 | grep -v '\.test\.ts$' | grep '^src/'` is **empty**.
- The same holds for `c6f80c81~1 c6f80c81` and for `5277babd..c6f80c81`.
- No `.snap` file changed, so the waiver holds.

### Gap register
- **`QE-184-a` (INFO). TSPWN survives.**
  - It is this page's named residual, but it costs **one line**, not a "two-place helper edit" as the page's Out of scope says.
  - It must aim at the neutral child; the untargeted form is killed by four other rows.
  - Recorded; no action. BA/PM may correct the page's wording if it is ever re-cut.
- **`QE-184-b` (INFO). TFORGE survives.** It is a forged-input edit on the `booked` line. Recorded; no action.
- **`QE-184-c` (INFO).** `[CLI_DEEP]` child counts need `--reporter=verbose` or `--silent=false` in an agent session, because several agent variables trip vitest's `isAgent`. Recorded.

### Notes (task `qe-ABC-184`, sealed by `context-io.js` `admitAndAppend` with the QE worktree's `.grugops/context` passed as the root; all 5 read back by `readContext`)
- `20261021T120644Z-qe-e2e-observation-86f4cd19`: the A3 plant matrix.
- `20261021T120644Z-qe-e2e-observation-ccffd570`: what `booked.cwd` pins, and the survivors.
- `20261021T120645Z-qe-e2e-observation-83a92ac8`: A1, A2, A4 and A5, the gates, and the child count.
- `20261021T120645Z-qe-e2e-observation-d00d3329`: the artifacts, recorded as an observation (no §14 run id for an artifact-ref).
- `20261021T120645Z-qe-e2e-decision-7b9ef6a7`: the verdict and the gap register.

### Process remarks
- The brief was in `pending/` beside an empty `claimed/qe-ABC-184/`. QE moved it pending → claimed → done with `claim.js` `transition` at 12:07:20Z and removed the empty claim directory.
- `node_modules` is a symlink in `../wt-qe-ABC-184`, git-ignored through `.git/info/exclude`.
- At close, `pending/` held `qe-ABC-165.md`, which is not this hop's and was left untouched.

### Board
`ABC-184` leaves `In Review` QE-green. The Orchestrator records the `AR-183-CWDARG` close and moves the ticket. UAT is waived.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)
| ABC-184 (QE) | RealChild records the cwd handed to spawnSync; A7 asserts booked.cwd is neutral (labelled AR-183-CWDARG); TCWD + P6f base 11/11 green → head 10/11 red at the new assertion; qe-ABC-184 …7b9ef6a7 | AR-183-CWDARG (QE-183-a of ABC-183) | grugops/ABC-184 @ c6f80c81 (code 442d1e57; base 5277babd); QE grugops/qe-ABC-184 @ 2c65403b | src/cli.real-engine.test.ts (test-only; 0 production lines) | lint/typecheck/build rc 0; npm test 59/1987 = base, 0 skips; skip-integrity 0; CLI_DEEP 11/11 (6 children); PERFT_DEEP 32/32; UAT waiver: non-test src list empty, no .snap | QE PASS_WITH_GAPS: A1–A5 MET; AR-183-CWDARG close condition met; QE-184-a TSPWN, QE-184-b TFORGE, QE-184-c reporter child count (all INFO) |
