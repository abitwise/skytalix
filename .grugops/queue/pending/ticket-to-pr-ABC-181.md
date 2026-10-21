---
subtask: ticket-to-pr-ABC-181
role: software-engineer
tickets: [ABC-181]
branch: grugops/ABC-181 (from main @ the main tip at your start); worktree ../wt-ABC-181
ref: .grugops/context/ticket-to-pr-ABC-181/
width: 3 (beside two other ticket-to-pr hops in their own worktrees; disjoint files)
---

# SE: ABC-181: `status-panel.nfr.test.ts`'s header stops crediting the catalog with `gameend.nfr.test.ts`'s `vi.mock` lesson. One comment sentence, one file

## Read first
- The ticket page `plans/tickets/ABC-181-status-panel-header-credits-the-catalog-with-a-lesson-it-does-not-hold.md`: every criterion, its § Scope and § Out of scope.
- The notes it cites.
- `AGENTS.md`: lanes, the heap-flag rule, the 12 coding rules, and where the sealed-note writer lives.

## Do
- Create the worktree `../wt-ABC-181` on `grugops/ABC-181` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Implement exactly the page's scope. Where the page asks for a kill or a red, show it first: base green / head red (or the harness red on the named wrong copy), planted in scratch copies outside the repo with a private `TMPDIR`.
- Run `A1`'s command at base first (it prints one sentence), then at head (nothing). Every changed line must sit inside the header `/** */` block. Do not touch the "A count and not a clock" sentence.
- Prove each criterion you own, then run all gates green on the tip:
  - lint, typecheck, build;
  - `npm test` + `.test-results/last-run.json` success (1987 tests at base);
  - skip-integrity `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
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
- Commit on `grugops/ABC-181` only. Never push or merge.
- Touch no process you did not start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: the `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`, then `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-181`.
- Write the notes **inside your worktree** so they land on your branch. Include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-181.md` (brief + `## Result`: tip, per-criterion results, gates, waiver measurement, trace row as one `| ABC-181 | … |` line) and `.claim.md`, uncommitted on main.
