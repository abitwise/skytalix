---
subtask: qe-ABC-179
role: qe-e2e
ticket: plans/tickets/ABC-179-three-test-comments-say-what-their-source-does-not.md
ref: .grugops/context/qe-ABC-179/
branch: grugops/ABC-179 (tip a7d64e07; code dd131b71; base ccccc6bb); SE worktree ../wt-ABC-179 (read only)
width: 3 (beside ticket-to-pr-ABC-180 and -163)
---

# QE gate for ABC-179 (comment lines only)

## Do
- Verify A1–A4 against the page. Two reads are yours:
  - **A2:** none of the three sentences that name the catalog contains a quoted span, and each is true to `plans/nfr-catalog.md` (`:25`, `:49`, `:555-556`).
  - **A3:** the `A12` comment's new pointer `expect(runtimeImporters).toEqual(` lands on the right equality.
- **Independence.** Read the four rewritten comments yourself before opening the SE's readings (`.grugops/context/ticket-to-pr-ABC-179/` on the branch). Check that no new claim got in. Use QE-159-a's lens: no universal the source doesn't support.
- **A4.** Confirm the diff is exactly four files and that every changed line is inside a comment. No executable line may change: compare the code with comments stripped, base vs head.
- **Gates** on the code tip:
  - lint, typecheck, build;
  - `npm test` + `last-run.json` success;
  - skip-integrity `--skip-count 0`;
  - `CLI_DEEP` and `PERFT_DEEP`.
- **Heap rule:** 400 for one-file runs, 128 for whole-suite or multi-file runs, one at a time. Take no timing.
- **UAT waiver:** measure it in AGENTS.md's form. Do not filter out `.snap`.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-179` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-179 page there.
- No production files, `plans/board.md`, `AGENTS.md`, or other ticket pages.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-179`).
- Write `.grugops/queue/done/qe-ABC-179.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.
