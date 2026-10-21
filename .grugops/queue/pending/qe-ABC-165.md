---
subtask: qe-ABC-165
role: qe-e2e
ticket: plans/tickets/ABC-165-ten-traceability-rows-do-not-render-as-ten-columns-and-a-metrics-header-runs-into-the-next.md
ref: .grugops/context/qe-ABC-165/
branch: grugops/ABC-165 (tip 893e9fd1; code 49fce033; base 9af98210); SE worktree ../wt-ABC-165 (read only)
width: 2 (beside qe-ABC-184)
---

# QE gate for ABC-165 (records only: `plans/traceability.md`, `plans/metrics.md`)

## Do
- Verify A1–A7 against the re-cut page, with your own scripts, not by eye and not the SE's:
  - `A1` at base and at the code commit: the 11 named rows leave the output; what remains is exactly the short rows that are `ABC-185`'s.
  - `A2`: every changed row equals its base row once `|`, `\`, `—` and whitespace are stripped; count the changed rows yourself. Then go beyond the strip: check each repaired row maps its cells to the **right columns** (a cell boundary moved to the wrong place still passes the strip). Grade the mapping row by row.
  - `A3`: row count equal at base and head.
  - The rewritten note: states the GFM rule, a runnable count, the forward row rule with the template (BA/PM `…d2b9bf09`), and names no row by its Ticket cell as malformed. Run the count it gives and confirm it agrees with `A1`.
  - The blank line above the header, and `plans/metrics.md:2-3`, with no other `metrics.md` line changed.
  - If you have a GFM renderer available offline, render the table region and the metrics header; if not, say so and grade by the rule.
- **The racing rule:** `main` has gained appended trace rows since `9af98210`. Merge the current `main` into your QE branch (not the SE's), keep `main`'s appended rows as they are, and re-run `A1`–`A3` at that merge. Report any conflict.
- **A7:** the SE notes that at the tip the file list also shows its 3 sealed notes; the code commit lists exactly the 2 files. Rule on it.
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987); skip-integrity `--skip-count 0`. Take no timing. UAT waiver in AGENTS.md's form.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-165` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-165 page there.
- No edits to `plans/traceability.md` or `plans/metrics.md` beyond the merge of `main`; no `src/`, `AGENTS.md`, `plans/board.md` or other ticket pages.
- Never push, `--force`, `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-165`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/qe-ABC-165.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order** (forward row rule `…d2b9bf09`); check it with `A1`'s splitter:
  `| ABC-165 (QE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
  `—` for an empty cell; a literal `|` is `\|`, inside code spans too; join facts with `<br>` or `; `.
