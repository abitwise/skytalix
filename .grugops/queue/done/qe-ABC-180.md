---
subtask: qe-ABC-180
role: qe-e2e
ticket: plans/tickets/ABC-180-a-decoy-book-in-a7s-neutral-cwd-reds-a-cwd-first-read-with-a-module-fallback.md
ref: .grugops/context/qe-ABC-180/
branch: grugops/ABC-180 (tip d9c3cca3; code acb52edf; base ccccc6bb); SE worktree ../wt-ABC-180 (read only)
width: 3 (beside qe-ABC-179 and qe-ABC-163)
---

# QE gate for ABC-180. Its close also closes AR-162-FALLBACK.

## Do
- **Re-plant and read A1–A6.** Re-plant P6f, P6b, P6c, P6e and PD yourself, in scratch copies **outside** the repo. Run each on the base test and the head test, one at a time, each with its own `TMPDIR`. Then read A1–A6 against the page.
  - **The close condition for AR-162-FALLBACK** (Security/NFR `…06c147db`, Orchestrator `…6d15cdc3`): P6f is green at base and red at head, at the labelled stderr check.
  - Don't copy the SE's readings (`.grugops/context/ticket-to-pr-ABC-180/` on the branch) until yours are taken.
- **Decoy.** Confirm it is not a valid book, and that a valid-book decoy (PD) fails at the parse check, not silently.
- **A4 placement.** Check where `AR-162-FALLBACK` appears: in the assertion message and in the comment directly above it.
- **New surviving builds.** Try at least one wrong build that might still pass the head test. Example: a fallback that reads only when the cwd file parses.
- **Gates** on the code tip:
  - lint, typecheck, build;
  - `npm test` + `last-run.json` success;
  - skip-integrity `--skip-count 0`;
  - `CLI_DEEP` and `PERFT_DEEP`.
  - Heap rule: 400 for one-file runs, 128 for multi-file runs. One at a time. No timing.
- **UAT waiver.** Measure it in AGENTS.md's form, with no `.snap` filter.
- **Verdict.** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-180`, branched from the tip. Commit there: your notes (written inside the worktree) and a `## QE` section on the ABC-180 page.
- Don't touch production files, `plans/board.md`, `AGENTS.md`, or other ticket pages.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal notes with the plugin writer (task `qe-ABC-180`).
- Write `.grugops/queue/done/qe-ABC-180.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.

## Result (qe-e2e, 2026-10-21 09:19Z): **PASS_WITH_GAPS**. Commit `c0a7225f` on `grugops/qe-ABC-180` (from tip `d9c3cca3`, code `acb52edf`; worktree `../wt-qe-ABC-180`)

- One commit: 4 sealed notes and a `## QE` section on the ABC-180 page.
- No production file, `plans/board.md`, `AGENTS.md` or other ticket page was touched.
- No push, merge, force, amend or rebase. No timing was taken.

### `AR-162-FALLBACK` close condition: **MET**
- **P6f:** base test **11/11 green**, head test **10/11, red `A7`**, at the labelled stderr check (`src/cli.real-engine.test.ts:534`). Received stderr: `opening book is not valid UTF-8 JSON; playing on without it`. The failure output names `AR-162-FALLBACK`.
- **P6b, P6c, P6e:** base 10/11, red `A7` at `:510`; head 10/11, red `A7` at `:534`.
- **PD:** 10/11, red `A7` at `:497` (the does-not-parse check).
- **The decoy** (`ABC-180 decoy: not an opening book\n`) is valid UTF-8 and not JSON. `parseBook` refuses it.
- The Orchestrator records the close.

### Grades (QE's own readings, taken before the SE's notes were opened; they agree cell for cell)
| criterion | grade | reading |
|---|---|---|
| `A1` | MET | head lane 11/11; A7's cwd is `$TMPDIR/abc162-neutral-cwd-…`, not the tree root; decoy present, not JSON, differs; A7 green (stderr `""`, exit 0); PD red at `:497` |
| `A2` | MET | the five-row table reproduces exactly (above) |
| `A3` | MET | 0 lane-made entries left under the private `TMPDIR` after all 19 runs (only Node's `node-compile-cache`) |
| `A4` | MET | `grep -c` is 4 at tip and 0 at `e68962d6` (exit 1). `:533` is the message argument of `expect(booked.stderr, …)`; `:530` is the `//` line directly above `expect(` (`:531`). Both name `AR-095-CWD` |
| `A5` | MET | exit 1 at tip; `:48`, `:443`, `:476` at `e68962d6` |
| `A6` | MET | diff is only `src/cli.real-engine.test.ts`; waiver form empty; `npm test` 59/1987 at base and tip, 0 skips; `CLI_DEEP` 11 and 6 children at both; `mkdtempSync(` 2, `removeCopy(` 3, `rmSync(` 1, `spawnReal(` 5, each equal to base |

### Gates (in the QE worktree at `d9c3cca3`, whose tree outside `.grugops/` is identical to `acb52edf`; one at a time; heap 400 for one-file runs, 128 for multi-file)
| gate | result |
|---|---|
| lint / typecheck / build | rc 0 / 0 / 0 |
| `npm test` | rc 0, 59 files / 1987 tests (base scratch archive `ccccc6bb`: 59 / 1987) |
| `last-run.json` | `success: true`, 0 failed, 0 pending, 0 todo |
| skip count, then skip-integrity `--skip-count 0` | 0, then `No findings.` |
| `CLI_DEEP` | 11/11 |
| `PERFT_DEEP` | 32/32 |

### UAT waiver (AGENTS.md's form, no `.snap` filter)
- `git diff --name-only acb52edf~1 acb52edf | grep -v '\.test\.ts$' | grep '^src/'` is **empty** (exit 1).
- The same holds for `ccccc6bb..d9c3cca3`.
- No `.snap` file changed.
- So 0 production lines, and the waiver holds.

### Gap register
- **G-1 (LOW). P6g survives** (11/11 green at base and at head).
  - P6g uses the cwd `data/opening-book/book.json` only if it parses as UTF-8 JSON, and otherwise falls back to the module URL silently. Its exploit is `AR-162-FALLBACK`'s, with any valid book.
  - **Measured in scratch (VD):** a valid format-1 decoy whose only entry after 1. e4 is `b7b5` kills P6b, P6f and P6g at A7's membership check (`:523`); the clean build stays 11/11. `b7b5` is the one legal reply missing from the delivered book, which holds 19 of 20.
  - **Cost:** VD loses the fixed stderr signal and the PD guard, and any decoy can be skipped by an override that validates more deeply.
  - **Route:** Security/NFR, to carry it as a narrower residual or ask for a BA/PM cut. It does not block the close as written.
- **G-2 (LOW). The decoy-write order is not pinned.** With the decoy write moved after the `booked` spawn (TMO), P6f stays 11/11 green. Route: Security/NFR, with G-1.
- **G-3 (INFO). P6i survives:** a cwd override at another relative path (`opening-book.json`), green at head. The fixed-path contract and Ruling 2 cover it. No action.

### Notes (task `qe-ABC-180`, sealed by `context-io.js` `admitAndAppend` in the QE worktree, all 4 read back by `readContext`)
- `20261021T091812Z-qe-e2e-observation-9caa5ead`: criteria `A1`–`A6`.
- `20261021T091813Z-qe-e2e-observation-91bdbc2a`: the plant matrix, PD, TMO and VD.
- `20261021T091814Z-qe-e2e-observation-b571ef5f`: the gates and the waiver.
- `20261021T091815Z-qe-e2e-decision-f88e0845`: the verdict, the close condition and the gap register.

### Process remarks
- **Seen early:** QE saw the SE's summary in `done/ticket-to-pr-ABC-180.md` while it was orienting on the previous QE record, before any run. Every reading above comes from QE's own runs.
- **Scratch:** everything is under the session scratchpad `…/qe180/`. The SE's `…/abc180/` was not opened.
- **A first base `npm test`** on a partial archive failed (a missing `.grugops/qe-cutover-2026-08-17.txt`). That was QE's setup error, and it was redone on the full archive (59/1987 green).
- **`node_modules` symlink:** left in `../wt-qe-ABC-180`; it is git-ignored through `.git/info/exclude:9`.

### Board
`ABC-180` leaves `In Review` QE-green. The next steps are the Orchestrator's `AR-162-FALLBACK` close and Security/NFR's ruling on G-1/G-2. UAT is waived. The Orchestrator makes the move.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)
| ABC-180 (QE) | A7's neutral cwd holds a non-JSON decoy book; P6f base green → head red at the labelled stderr check; P6b/c/e reds hold; PD red at the parse check; qe-ABC-180 …f88e0845 | AR-162-FALLBACK (G-1, G-2 of ABC-162) | grugops/ABC-180 @ acb52edf (notes d9c3cca3; base ccccc6bb); QE grugops/qe-ABC-180 @ c0a7225f | src/cli.real-engine.test.ts (test-only; 0 production lines) | lint/typecheck/build rc 0; npm test 59/1987 = base, 0 skips; skip-integrity 0; CLI_DEEP 11/11; PERFT_DEEP 32/32; UAT waiver: non-test src list empty, no .snap | QE PASS_WITH_GAPS: A1–A6 MET; AR-162-FALLBACK close condition met; G-1 P6g validated-override survives (Security/NFR), G-2 decoy order unpinned, G-3 info |
