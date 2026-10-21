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
