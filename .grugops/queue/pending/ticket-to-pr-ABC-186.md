---
subtask: ticket-to-pr-ABC-186
role: software-engineer
tickets: [ABC-186]
branch: grugops/ABC-186 (from main @ the main tip at your start); worktree ../wt-ABC-186
ref: .grugops/context/ticket-to-pr-ABC-186/
width: 2 (beside bapm-fold-A-ABC-164; disjoint files)
---

# SE: ABC-186: re-head the trace table after the note at `:497–627`, drop the two stray blank lines, and leave one counting rule in the note (QE-165-a, QE-165-b). Records only; ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-186-the-trace-table-stops-rendering-at-line-496-so-632-of-its-690-rows-render-as-paragraph-text.md`: every criterion (`A1`–`A7`, the `A1-fragments`, `A1-cells` and `A5-note` commands), § Scope, § Out of scope, § Dependencies (racing rule).
- BA/PM's notes `…411b3032` (readings) and `…1636e62c` (ruling); ABC-165's QE notes.

## Do
- Create the worktree `../wt-ABC-186` on `grugops/ABC-186` from the current `main`. A `node_modules` symlink is fine (gates, and `marked` via the npx cache); remove it before you finish if it isn't ignored.
- Run `A1-fragments`, `A2` (render with `marked` 15.0.12 to a file, `-o`), `A4` and `A5-note` at base first.
- Implement exactly the page's scope. Line numbers on the page are at `3d36999b`; find the lines by content at your base.
- **The Orchestrator keeps appending 10-cell rows to the end of the trace while you work.** Before you finish, merge the current `main` into your branch (a merge, not a rebase), keep `main`'s appended rows as they are, and re-run every criterion at that merge. Report the merge sha.
- Gates on the tip: lint, typecheck, build; `npm test` + `.test-results/last-run.json` success (59 / 1987, equal to base); skip-integrity `--skip-count 0`. `npm test` sets heap 128 itself; one run at a time. Take no timing.
- Measure the UAT waiver in AGENTS.md's form (must print nothing).

## Fences
- Only `plans/traceability.md`, inside the lines the page allows. No word of any trace row changes.
- Never touch `plans/board.md`, `AGENTS.md`, `src/`, other tickets' files, or other worktrees.
- Commit on `grugops/ABC-186` only. Never push or merge into `main`.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: the `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`, then `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-186`. **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`.
- Write the notes **inside your worktree** so they land on your branch. Include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-186.md` (brief + `## Result`: tip, merge-of-main sha, per-criterion results, gates, waiver) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order** (rule `…d2b9bf09`); do NOT append it to the trace yourself:
  `| ABC-186 (SE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
