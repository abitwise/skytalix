---
subtask: ticket-to-pr-ABC-185
role: software-engineer
tickets: [ABC-185]
branch: grugops/ABC-185 (from main @ the main tip at your start); worktree ../wt-ABC-185
ref: .grugops/context/ticket-to-pr-ABC-185/
width: 3 (beside bapm-cut-guard-18432 and scribe-amend-90; disjoint files)
---

# SE: ABC-185: re-cell the short trace rows into the table's ten columns. Words kept byte for byte; ZERO `src/` lines (owner go, `…cba9c8eb`)

## Read first
- The ticket page `plans/tickets/ABC-185-eighty-five-hop-rows-in-the-trace-carry-5-to-9-cells-and-render-under-the-wrong-headers.md`: every criterion `A1`–`A6`, § Scope (the 9 layouts), § Dependencies (the racing rule).
- BA/PM notes `…50929881`, `…d2b9bf09` (forward row rule and template), `…e9a6c68a` (the split), `…1636e62c`; ABC-165's and ABC-186's QE notes.

## Do
- Create the worktree `../wt-ABC-185` on `grugops/ABC-185` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Run `A1-cells` at base first; the rows to repair are the names it prints (line numbers on the page are stale since ABC-186 added two lines). Do it with a script; rows run to KB each.
- Map each short row's cells to the 10 headers per the page (`A4` (b): any `@ <sha>` or `main (merge of` cell goes in `Code (PR/files)`). Fill missing cells with `—`; join with `<br>` or `; `; escape a literal `|` as `\|`. No word moves (`A2`).
- Produce the per-row map (`A4` (c)) in the done record.
- **Racing:** the Orchestrator keeps appending 10-cell rows at the tail. Before you finish, merge the current `main` into your branch (a merge, not a rebase); if the tail conflicts, keep `main`'s appended rows verbatim below the repaired rows; re-run `A1`–`A6` at the merge. Report the merge sha.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987, equal to base); skip-integrity `--skip-count 0`. No timing. UAT waiver in AGENTS.md's form (must print nothing).

## Fences
- Only `plans/traceability.md`, only the rows the page scopes. No row added, removed or re-ordered.
- Never touch `plans/board.md`, `AGENTS.md`, `memory-bank/`, `src/`, other tickets' files, or other worktrees.
- Commit on `grugops/ABC-185` only. Never push or merge into `main`.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-185`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`. Write notes inside your worktree; include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-185.md` (brief + `## Result`: tip, merge-of-main sha, per-criterion results, per-row map, gates, waiver) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| {ticket} ({hop}) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
