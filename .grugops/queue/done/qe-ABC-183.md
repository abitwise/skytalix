---
subtask: qe-ABC-183
role: qe-e2e
ticket: plans/tickets/ABC-183-a7-pins-that-the-decoy-is-written-before-the-booked-spawn.md
ref: .grugops/context/qe-ABC-183/
branch: grugops/ABC-183 (tip c4c6d36e; code 7bd2b54f; base 19abbdb1); SE worktree ../wt-ABC-183 (read only)
width: 3 (beside qe-ABC-181 and ticket-to-pr-ABC-182)
---

# QE gate for ABC-183 (test-only; the AR-180-VALIDATED close row)

## Do
- Verify A1–A5 against the page. **A4 is yours to re-plant independently** — it is the close condition for `AR-180-VALIDATED` part (ii):
  - Build TMO (test-file plant: the decoy's `mkdirSync` + `writeFileSync` move to directly after the `booked = spawnReal(` line; on the head test the capture line stays put) and P6f (`src/book-file.ts`, body as in your own `ABC-162` note `…567002e7`) yourself, in scratch copies outside the repo, private `TMPDIR` per run.
  - Run all four rows (none, P6f, TMO + P6f, TMO) against the base test and the head test under `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400`. The close row is TMO + P6f: base 11/11 green, head 10/11 red `A7` at the new assertion, `AR-162-FALLBACK` in the failure output.
  - The SE's P6f has the same body as yours but different bytes (sha `afeab577…` vs `e4947664…`); record the sha of the plant you use. Byte identity with the SE is not required; the body is.
- **A2/A3:** read the new `expect` (`.toBe(true)`, message naming `AR-162-FALLBACK`) and the order comment above the decoy write yourself.
- **A5 fences:** exact file list; every `grep -c` count the page names, base and head; no line added or removed above `:440`; `CLI_DEEP` 11 tests, 6 children.
- **Independence.** Do your own plants and readings before opening the SE's (`.grugops/context/ticket-to-pr-ABC-183/` on the branch).
- **Gates** on the code tip:
  - lint, typecheck, build;
  - `npm test` + `last-run.json` success (1987);
  - skip-integrity `--skip-count 0`;
  - `CLI_DEEP` and `PERFT_DEEP`.
- **Heap rule:** 400 for one-file runs, 128 for whole-suite or multi-file runs, one at a time. Take no timing.
- **UAT waiver:** measure it in AGENTS.md's form. Do not filter out `.snap`.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-183` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-183 page there.
- No production files, `plans/board.md`, `AGENTS.md`, or other ticket pages. Plants only in scratch copies.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-183`).
- Write `.grugops/queue/done/qe-ABC-183.md` (brief + `## Result` + trace row as one `| ABC-183 | … |` line) and `.claim.md`, uncommitted on main.

## Result (qe-e2e, 2026-10-21 10:11Z): **PASS_WITH_GAPS**. Commit `3ab055f4` on `grugops/qe-ABC-183` (from tip `c4c6d36e`, code `7bd2b54f`, base `19abbdb1`; worktree `../wt-qe-ABC-183`)

- One commit: 5 sealed notes and a `## QE` section on the ABC-183 page.
- No production file, `plans/board.md`, `AGENTS.md` or other ticket page was touched.
- No push, merge, force, amend or rebase. No timing was taken.

### `AR-180-VALIDATED` part (ii): **MET** (QE re-planted independently, before opening the SE's notes)
- **P6f:** sha256 `0b016daf4bc9d6c3…1c60`. The body is `…567002e7`'s (try the cwd read, catch → module URL), and the bytes are identical to `ABC-180`'s QE P6f.
- **TMO:** a script moves the decoy's `mkdirSync` and `writeFileSync` to directly after `booked = spawnReal(`; at head the capture stays put. Test shas: base `5e590b23`, head `8a84dfa3`, base-TMO `49dd6aa6`, head-TMO `c9ff8261`.

| plant | base test (`59fc9215`) | head test (`c4c6d36e`) |
|---|---|---|
| none | 11/11 green | 11/11 green |
| P6f | 10/11, red A7 `:534` (stderr detector) | 10/11, red A7 `:545` (stderr detector) |
| **TMO + P6f** | **11/11 green** | **10/11, red A7 `:503`: `AR-162-FALLBACK: the decoy must exist before the booked child spawns, or the detector is disarmed: expected false to be true`** |
| TMO | 11/11 green | 10/11, red A7 `:503` (same message) |

- Every cell ran in a fresh `git archive` copy outside the repo with a private `TMPDIR`, under `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400`, one at a time.
- 0 lane-made leftovers. The SE's matrix `…90cab7c4` agrees cell for cell.
- The Orchestrator records the close.

### Grades
| criterion | grade | reading |
|---|---|---|
| `A1` | MET | `grep -B1 -F 'booked = spawnReal('` first line is `decoyBeforeBooked = existsSync(join(neutral, BOOK_PATH));` (`:468`); base: `bookless = spawnReal(copy, QUIT_TWICE);` |
| `A2` | MET | one `expect(decoyBeforeBooked, "AR-162-FALLBACK: …").toBe(true)` in A7's `it` (`:500-503`); `grep -c 'AR-162-FALLBACK'` 4 → 6 |
| `A3` | MET | `:464` `// \`ABC-183\`: this write MUST come before the \`booked\` spawn, …` is 2 lines above the `writeFileSync` (`:466`) |
| `A4` | MET | the table above, all eight cells |
| `A5` | MET | diff names only `src/cli.real-engine.test.ts`; `spawnReal(` 5/5, `mkdtempSync(` 2/2, `removeCopy(` 3/3, `rmSync(` 1/1, `writeFileSync(` 1/1, `existsSync(` 5→6, `it(` 11/11; `head -439` byte-identical; `CLI_DEEP` 11 tests, 6 children at base and head; `npm test` 59/1987 = base, 0 skips |

### Gates (QE worktree at `c4c6d36e`; one at a time; heap 400 for one-file runs, 128 for `npm test`)
| gate | result |
|---|---|
| lint / typecheck / build | rc 0 / 0 / 0 (biome 116 files, no fixes) |
| `npm test` | rc 0, 59 files / 1987 tests |
| `last-run.json` | `success: true`, 436 suites, 1987 passed, 0 failed, 0 pending, 0 todo |
| skip-integrity `--skip-count 0` | `No findings.`, rc 0 |
| `CLI_DEEP` | 11/11 |
| `PERFT_DEEP` (`src/perft.test.ts`) | 32/32 |

### UAT waiver (AGENTS.md's form, no `.snap` filter)
- `git diff --name-only 7bd2b54f~1 7bd2b54f | grep -v '\.test\.ts$' | grep '^src/'` is **empty**.
- The same holds for `c4c6d36e~1 c4c6d36e` and for `19abbdb1..c4c6d36e`.
- No `.snap` file changed, so the waiver holds.

### Gap register
- **`QE-183-a` (LOW; pre-existing since `ABC-162`; outside this ticket's scope). TCWD survives.**
  - Removing the `neutral` (fourth) argument from the `booked` spawn (test sha `008c4e79`) gives **11/11 green under P6f** at head. The child runs from the tree root and reads the real book.
  - A7's `not.toBe(REPOSITORY)` compares the `neutral` variable, not the child's cwd. `RealChild` carries no cwd.
  - **Route:** Security/NFR, to rule whether it joins `AR-180-VALIDATED` or gets an XS rider (`spawnReal` returns its cwd, and A7 asserts it is `neutral`; 0 new spawns).
- **`QE-183-b` (INFO). TMOC survives.**
  - Moving the decoy write **and** the capture line together after the `booked` spawn (sha `a7dd6d51`) gives 11/11 green under P6f.
  - Only A1's static `grep -B1` catches it. This is the shape Security/NFR specified. Recorded; no action.

### Notes (task `qe-ABC-183`, sealed by `context-io.js` `admitAndAppend` in the QE worktree, all 5 read back by `readContext`)
- `20261021T101000Z-qe-e2e-observation-5e544b3e`: the A4 plant matrix.
- `20261021T101010Z-qe-e2e-observation-a1cbb8a6`: A1, A2, A3 and A5, and the gates.
- `20261021T101020Z-qe-e2e-observation-cbd50a13`: the survivors TCWD and TMOC.
- `20261021T101030Z-qe-e2e-observation-0b0c7f61`: the artifacts. Admission refused it as an `artifact-ref`, because there is no `sha`/gate-run provenance, so it was recorded as an observation.
- `20261021T101040Z-qe-e2e-decision-be7c2c82`: the verdict and the gap register.

### Process remarks
- The brief file was still in `pending/` beside an empty `claimed/qe-ABC-183/`. QE moved it pending → claimed with `claim.js` `transition` at 10:10:44Z, and claimed → done at the end. The empty claim directory was removed.
- `node_modules` is a symlink in `../wt-qe-ABC-183`, git-ignored through `.git/info/exclude`.

### Board
`ABC-183` leaves `In Review` QE-green and goes toward `In Security/NFR`, where `QE-183-a` is to be ruled. The Orchestrator records the `AR-180-VALIDATED` close. UAT is waived. The Orchestrator makes the move.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)
| ABC-183 (QE) | A7 captures the decoy's existence on the line before the booked spawn and asserts it (labelled AR-162-FALLBACK); TMO + P6f base 11/11 green → head 10/11 red at the new assertion; qe-ABC-183 …be7c2c82 | AR-180-VALIDATED (ii) (G-2 of ABC-180) | grugops/ABC-183 @ c4c6d36e (code 7bd2b54f; base 19abbdb1); QE grugops/qe-ABC-183 @ 3ab055f4 | src/cli.real-engine.test.ts (test-only; 0 production lines) | lint/typecheck/build rc 0; npm test 59/1987 = base, 0 skips; skip-integrity 0; CLI_DEEP 11/11 (6 children); PERFT_DEEP 32/32; UAT waiver: non-test src list empty, no .snap | QE PASS_WITH_GAPS: A1–A5 MET; AR-180-VALIDATED part (ii) met; QE-183-a TCWD (LOW, Security/NFR), QE-183-b TMOC (INFO) |
