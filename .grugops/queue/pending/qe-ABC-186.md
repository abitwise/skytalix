---
subtask: qe-ABC-186
role: qe-e2e
ticket: plans/tickets/ABC-186-the-trace-table-stops-rendering-at-line-496-so-632-of-its-690-rows-render-as-paragraph-text.md
ref: .grugops/context/qe-ABC-186/
branch: grugops/ABC-186 (tip 9943e5f4; code 50d54d53; base a3e6f2a7); SE worktree ../wt-ABC-186 (read only)
width: 2 (beside bapm-fold-A-ABC-164)
---

# QE gate for ABC-186 (records only: `plans/traceability.md`)

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase; `main` has gained trace rows since `a3e6f2a7`), keep `main`'s appended rows as they are, and run every criterion at that merge. Report the merge sha and any conflict.
- Verify `A1`–`A7` with your own runs of the page's commands, not the SE's readings:
  - `A1-fragments`: `4 3` at base → `2 0` at the merge.
  - `A2`: render with `marked` 15.0.12 to a file (`-o`). Count `<table` and `<tr`, and check every `<tr` sits inside a table. The SE read base `<tr` as 60, not the page's 59, and attributes the extra one to a literal `<tr>` in the `ABC-186 (BA/PM)` row rendering as raw HTML while it was paragraph text. Confirm or refute.
  - `A3`: in `git diff -U0` base → head outside the note, exactly 2 empty lines removed and exactly 2 lines added, byte-equal to the header and delimiter rows, between the comment's end and the first row after it.
  - `A4`: `A1-cells` names equal at base and head.
  - `A5-note` `0 0 0 1 1 1`; the three byte-unchanged lines.
  - `A6`, `A7` as written.
- **Read the rewritten note** as a reader would: one counting rule, the forward row rule with the blank-line / HTML-comment sentence, no row named as malformed.
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987); skip-integrity `--skip-count 0`. No timing. UAT waiver in AGENTS.md's form.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-186` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-186 page there.
- No edits to `plans/traceability.md` beyond the merge of `main`; no `src/`, `AGENTS.md`, `plans/board.md` or other ticket pages.
- Never push, `--force`, `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-186`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/qe-ABC-186.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order** (rule `…d2b9bf09`); do NOT append it yourself:
  `| ABC-186 (QE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
