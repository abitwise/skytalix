---
subtask: ticket-to-pr-ABC-180
role: software-engineer
tickets: [ABC-180]
branch: grugops/ABC-180 (from main @ c940da40 or the main tip at your start); worktree ../wt-ABC-180
ref: .grugops/context/ticket-to-pr-ABC-180/
width: 3 (beside two other ticket-to-pr hops in their own worktrees)
---

# SE: ABC-180: put a non-book decoy at `data/opening-book/book.json` in `A7`'s neutral cwd, and label `A7`'s stderr assertion. Closes `AR-162-FALLBACK`. ZERO production lines

## Read first
- The ticket page `plans/tickets/ABC-180-a-decoy-book-in-a7s-neutral-cwd-reds-a-cwd-first-read-with-a-module-fallback.md`: every criterion and its § Scope.
- The notes it cites.
- `AGENTS.md`: lanes, the heap-flag rule, the 12 coding rules, and where the sealed-note writer lives.

## Do
- Create the worktree `../wt-ABC-180` on `grugops/ABC-180` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Implement exactly the page's scope, test-first where the page asks for a kill: show the named wrong build is green at base and red at head, planted in scratch copies outside the repo.
- Prove each criterion you own, then run all gates green on the tip:
  - lint, typecheck, build;
  - `npm test` + `last-run.json` success;
  - skip-integrity `--skip-count 0`;
  - `CLI_DEEP` and `PERFT_DEEP`.
- Heap rule (AGENTS.md):
  - `NODE_OPTIONS=--max-old-space-size=400` for one-file vitest runs only.
  - Whole-suite or multi-file runs use 128, as `npm test` does.
  - Run them one at a time.
- Take no timing.
- Measure the UAT waiver in AGENTS.md's form: `git diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'`. Do not filter out `__snapshots__`; list any `.snap` change separately.

## Fences
- Only the files the page scopes.
- Never touch `plans/board.md`, `plans/traceability.md`, `AGENTS.md`, other tickets' files, or other worktrees.
- Commit on `grugops/ABC-180` only. Never push or merge.
- Touch no process you did not start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: the `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`, then `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-180`.
- Write the notes **inside your worktree** so they land on your branch. Include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-180.md` (brief + `## Result`: tip, per-criterion results, gates, waiver measurement, trace row) and `.claim.md`, uncommitted on main.
