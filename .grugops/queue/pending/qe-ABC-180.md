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
