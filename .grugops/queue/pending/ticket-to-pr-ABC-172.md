---
subtask: ticket-to-pr-ABC-172
role: software-engineer
tickets: [ABC-172]
branch: grugops/ABC-172 (from main @ the main tip at your start); worktree ../wt-ABC-172
ref: .grugops/context/ticket-to-pr-ABC-172/
width: 3 (beside ticket-to-pr-ABC-168 and qe-ABC-187)
---

# SE: ABC-172: rename the package and every in-repo name to `skytalix`; the directory and the remote are owner steps. Owner go (pull next, 2026-10-21)

## Read first
- The ticket page `plans/tickets/ABC-172-rename-the-package-and-every-in-repo-name-to-skytalix.md`: every criterion, § Scope, § Out of scope, § Dependencies (Q14: `npm run chess` keeps its name).
- `AGENTS.md` and the ABC-164 layout (`memory-bank/45-standing-rulings.md`, `memory-bank/90-agents-md-command-log.md`).

## The page was cut on 2026-10-18. Re-read it against today's `main` first
- `AGENTS.md` was split (ABC-164) and its guard is 18,432 B (ABC-187). Any name in `AGENTS.md` may now live in `memory-bank/45` or `90` instead; find every occurrence by content. If the page's file list misses a file the rename must touch, or names one that no longer holds the name, **stop and report** rather than widen scope.
- `package.json` is shared with ABC-168 (in development: adds `bin`, `build`, `uci`). Different keys; whichever merges later merges `main` and keeps both.
- Edits to `AGENTS.md` are the Scribe's unless the page assigns them to you; if the page assigns them to you, keep the byte count ≤ 18,432.

## Do
- **ABC-187 (in QE now) edits `AGENTS.md:7` and `src/cli.test.ts` (`:2242`, `:2483-2484`) and may merge during your hop.** Before you finish, merge the current `main` into your branch (a merge, not a rebase), resolve by keeping both changes, and re-run every criterion and gate at that merge. Report the merge sha.
- Create the worktree `../wt-ABC-172` on `grugops/ABC-172` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Read every criterion at base first. Implement exactly the page's scope.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (counts equal base); skip-integrity `--skip-count 0`; `CLI_DEEP` (6 children with `--reporter=verbose`) and `PERFT_DEEP`. Heap 400 one-file, 128 multi-file. No timing.
- Measure the UAT waiver in AGENTS.md's form.

## Fences
- Only the files the page scopes. Never touch `plans/`, other worktrees. Commit on `grugops/ABC-172` only. Never push or merge; never rename the directory or the remote.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-172`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`. Write notes inside your worktree; include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-172.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| {ticket} ({hop}) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
