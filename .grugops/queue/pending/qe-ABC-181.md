---
subtask: qe-ABC-181
role: qe-e2e
ticket: plans/tickets/ABC-181-status-panel-header-credits-the-catalog-with-a-lesson-it-does-not-hold.md
ref: .grugops/context/qe-ABC-181/
branch: grugops/ABC-181 (tip 18b3c993; code 8f8c88b3; base 19abbdb1); SE worktree ../wt-ABC-181 (read only)
width: 3 (beside ticket-to-pr-ABC-182 and -183)
---

# QE gate for ABC-181 (one header comment sentence)

## Do
- Verify A1–A3 against the page. Two reads are yours:
  - **A1 (the class, not just the command):** read every header sentence in `src/status-panel.nfr.test.ts` that mentions the catalog. Each must pass `ABC-179`'s `A2` read: any quoted span is found by `grep -F` in `plans/nfr-catalog.md`, and what it credits to the catalog is said there in substance at a line you name. The page's command is a floor.
  - **A2:** if the rewritten sentence names a source for the lesson, confirm `src/gameend.nfr.test.ts`'s header holds it (`:11-13`, "hoisted to file scope"), and that "that file's own header" is literally true.
- **Independence.** Read the catalog and the rewritten header yourself before opening the SE's readings (`.grugops/context/ticket-to-pr-ABC-181/` on the branch). Use QE-159-a's lens: no new claim the source doesn't support.
- **A3.** The diff is exactly `src/status-panel.nfr.test.ts` (plus the SE's notes); every changed line is inside the header `/** */` block; compare the code with comments stripped, base vs head. The file passes 6 tests.
- **Gates** on the code tip:
  - lint, typecheck, build;
  - `npm test` + `last-run.json` success (1987);
  - skip-integrity `--skip-count 0`;
  - `CLI_DEEP` and `PERFT_DEEP`.
- **Heap rule:** 400 for one-file runs, 128 for whole-suite or multi-file runs, one at a time. Take no timing.
- **UAT waiver:** measure it in AGENTS.md's form. Do not filter out `.snap`.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-181` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-181 page there.
- No production files, `plans/board.md`, `AGENTS.md`, or other ticket pages.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-181`).
- Write `.grugops/queue/done/qe-ABC-181.md` (brief + `## Result` + trace row as one `| ABC-181 | … |` line) and `.claim.md`, uncommitted on main.
