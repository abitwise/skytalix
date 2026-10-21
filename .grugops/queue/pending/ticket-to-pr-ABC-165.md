---
subtask: ticket-to-pr-ABC-165
role: software-engineer
tickets: [ABC-165]
branch: grugops/ABC-165 (from main @ the main tip at your start); worktree ../wt-ABC-165
ref: .grugops/context/ticket-to-pr-ABC-165/
width: 2 (beside qe-ABC-184; disjoint files)
---

# SE: ABC-165 (re-cut): repair the 11 trace rows that hide text, rewrite the trace's malformation note with the forward row rule, one blank line above the table header, and the `plans/metrics.md:2-3` join. Words kept byte for byte; ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-165-ten-traceability-rows-do-not-render-as-ten-columns-and-a-metrics-header-runs-into-the-next.md` as re-cut in `bapm-rescope-ABC-165`: every criterion, § Scope, § Out of scope, § Dependencies (its racing rule).
- BA/PM's notes `…50929881` (readings), `…d2b9bf09` (the forward row rule), `…e9a6c68a` (the split), and the Orchestrator's adoption `…34da66ba`.
- `AGENTS.md`: the 12 coding rules, and where the sealed-note writer lives.

## Do
- Create the worktree `../wt-ABC-165` on `grugops/ABC-165` from the current `main`. A `node_modules` symlink is fine (needed for the gates); remove it before you finish if it isn't ignored.
- Read `A1` and `A2` with scripts, not by eye (rows run to 16 KB). Show `A1` at base first.
- Implement exactly the page's scope. Touch no row below the 11 the page names; the 86 short rows are `ABC-185`.
- **The Orchestrator keeps appending 10-cell rows to the end of the trace while you work.** Before you finish, merge the current `main` into your branch (a merge, not a rebase), keep `main`'s appended rows exactly as they are, and re-run every criterion at the tip.
- Gates on the tip: lint, typecheck, build; `npm test` + `.test-results/last-run.json` success (59 / 1987, must equal base); skip-integrity `--skip-count 0`. `CLI_DEEP`/`PERFT_DEEP` are not needed (no `src/` change) unless the page asks.
- Heap rule: `npm test` sets 128 itself; one run at a time. Take no timing.
- Measure the UAT waiver in AGENTS.md's form (must print nothing).

## Fences
- Only `plans/traceability.md` and `plans/metrics.md`. No word of any trace cell changes; no row is added, removed, merged or re-ordered.
- Never touch `plans/board.md`, `AGENTS.md`, `src/`, other tickets' files, or other worktrees.
- Commit on `grugops/ABC-165` only. Never push or merge into `main`.
- Touch no process you did not start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: the `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`, then `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-165`. **Pass your worktree as the context root explicitly** (the writer's default root is the plugin's own directory). Take every `at` from `date -u` (UTC).
- Write the notes **inside your worktree** so they land on your branch. Include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-165.md` (brief + `## Result`: tip, per-criterion results, gates, waiver measurement) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order** (forward row rule, `…d2b9bf09`). Check it with `A1`'s splitter before you write it:
  `| ABC-165 (SE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
  `—` for an empty cell, never a missing one; a literal `|` is `\|`, inside code spans too; join two facts in one cell with `<br>` or `; `.
