---
subtask: ticket-to-pr-ABC-189
role: software-engineer
tickets: [ABC-189]
branch: grugops/ABC-189 (from main @ the main tip at your start); worktree ../wt-ABC-189
ref: .grugops/context/ticket-to-pr-ABC-189/
width: 3 (beside the other two hops of this wave; disjoint files)
---

# SE: ABC-189. One assertion pins `package.json` `bin` to `{ skytalix: "dist/uci.js" }` inside `ABC-042` A10 (closes AR-168-BINPIN on QE's red read). `src/cli.test.ts` only; ZERO production lines

## Read first
- The ticket page `plans/tickets/ABC-189-nothing-pins-the-value-of-package-json-bin-so-bin-pointing-at-src-uci-ts-passes-every-test.md`: every criterion, § Scope, § Out of scope, § Test notes, and every source note it cites.
- `AGENTS.md`, `memory-bank/45-standing-rulings.md`, the owner delegation `.grugops/context/owner-delegation-2026-10-22/notes/20261022T140148Z-orchestrator-decision-5aaf7cec.md`.

## Do
- Create the worktree `../wt-ABC-189` on `grugops/ABC-189` from the current `main` (`ABC-168` is merged at `513c0211`; main is at or after `14b840cc`). A `node_modules` symlink is fine for gates.
- **Red first:** on a scratch copy (full `node_modules`), `bin` → `src/uci.ts` passes every test at base and goes red at the tip on the new assertion only. Measure the other wrong values the page names.
- Implement exactly the page's Scope (one assertion, at most one comment line). Re-run ABC-187 A5's closer count; it must stay 9.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (base count at your start, 60 / 1995, plus any rows the page adds); skip-count capture as spelled → `test-skip-integrity.js`. Heap 128 multi-file, 400 one-file. No timing claims.
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` must print nothing.

## Fences
- Only the files the page scopes, plus your notes in `../wt-ABC-189/.grugops/context/ticket-to-pr-ABC-189/` (the context root to pass). No other file, no `plans/`, `AGENTS.md`, `memory-bank/`, git config, `node_modules/` in main's checkout, other worktrees. Commit on `grugops/ABC-189` only. Never push, merge or `--force`.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). Pass the context root named under Fences explicitly, never the plugin dir. Every `at` from `date -u` (UTC). Include a `kind: decision`. Append-only; artifacts as `observation`.
- Trace row (10 cells, plain table line: `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |`) in your done record `.grugops/queue/done/<subtask>.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave the pending file and the claim directory alone.
