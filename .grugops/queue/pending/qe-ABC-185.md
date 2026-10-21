---
subtask: qe-ABC-185
role: qe-e2e
ticket: plans/tickets/ABC-185-eighty-five-hop-rows-in-the-trace-carry-5-to-9-cells-and-render-under-the-wrong-headers.md
ref: .grugops/context/qe-ABC-185/
branch: grugops/ABC-185 (tip 3d166e01; merge of main 80de5949 at 528c9ef0; code 745c6225; base bf6fc623); SE worktree ../wt-ABC-185 (read only)
width: 2 (beside ticket-to-pr-ABC-187)
---

# QE gate for ABC-185 (re-cell 86 short trace rows; records only)

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase). `main` has moved past `80de5949` (trace rows appended). If the tail conflicts, keep `main`'s appended rows verbatim below the repaired rows. Run every criterion at that merge; report the merge sha and any conflict.
- Verify `A1`–`A6` with your own scripts, not the SE's readings:
  - `A1-cells` prints `[]` at your merge.
  - `A2`: pair each repaired row with its base row (by Ticket cell and order); strip `|`, `\`, `—`, `<br>`, whitespace; N of N equal (SE: N = 86, joins `<br>` only).
  - `A3`: `|` line count equal base vs head (apart from rows appended on `main`).
  - `A4` (a)–(c), and **`A4` (d) is yours:** render with `marked` 15.0.12 to a file (`-o`) and read at least one row of each of the 9 layouts plus 5 at random (≥ 14) against the headers. 0 cells under a header their content does not match. Rule on the SE's 3 named exceptions (`:1239`, `:1244`, `:1250`: a second `grugops/qe-… @ sha` cell after the verdict, left in Status) and on the other word-order placements the done record lists.
  - `A5` fences; `A6`: `A1-fragments` prints `2 0` at your merge.
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987); skip-integrity `--skip-count 0`. No timing. UAT waiver in AGENTS.md's form.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-185` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-185 page there.
- No edits to `plans/traceability.md` beyond the merge of `main`; no `src/`, `AGENTS.md`, `plans/board.md` or other ticket pages.
- Never push, `--force`, `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-185`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/qe-ABC-185.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| ABC-185 (QE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
