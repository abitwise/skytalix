---
subtask: ticket-to-pr-ABC-194
role: software-engineer
tickets: [ABC-194]
branch: grugops/ABC-194 (from main @ the main tip at your start); worktree ../wt-ABC-194
ref: .grugops/context/ticket-to-pr-ABC-194/
width: 2 (beside arch-build-ABC-195; disjoint files)
---

# SE: ABC-194 — ABC-192's `guardStreamFaultOf` also requires the `guard(…)` call to be a direct statement of `setup`'s body and `setup` to hold no `return`; plant table 5 → 9. `src/cli.test.ts` only; ZERO production lines; no new test row

## Read first
- The ticket page `plans/tickets/ABC-194-a-try-catch-or-an-off-switch-around-setups-guard-call-lets-an-uncapped-run-through.md`: every criterion, § Scope, § Out of scope, § Test notes.
- BA/PM notes `.grugops/context/bapm-rule-QE-192/notes/` (`…09a201ba` rulings, `…027683e7` readings incl. the 18-build prototype); QE `qe-ABC-192` notes (`…21079de0`, `…5eac2736` mutants); SE `ticket-to-pr-ABC-192` `…8fd17c58`; `tools/grugops/heap-guard.js`.
- `AGENTS.md`, `memory-bank/45-standing-rulings.md`.

## Do
- Create the worktree `../wt-ABC-194` on `grugops/ABC-194` from the current `main`. A `node_modules` symlink is fine.
- Red first, on scratch copies outside the repository (copy `node_modules` in full — a symlinked layout gives two vitest instances and false snapshot failures): the page's builds (try/catch, `if (false)`, uncalled arrow, early `return;`, deferred `.then`, labelled `break`, the two `HEAP_GUARD_OFF` off-switches) turn the row red; base, M4, M4b behave as the page says.
- Implement exactly the page's Scope. No new spawned child (`N8_SPAWN` stays 28); suite count stays 1994.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1994); skip-count capture as spelled in `AGENTS.md` → `test-skip-integrity.js`. One-file runs `NODE_OPTIONS=--max-old-space-size=400`; whole-suite 128. No timing.
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` must print nothing. AR-193-HUNKHDR stand-in (`…73e94c9f`): `git -c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ <base> <tip> -- src | awk '/^diff --git /{h=0} /^@@/{h=1} /^(\+\+\+|---) / && (h || /\t$/)'` must print nothing.

## Fences
- Only `src/cli.test.ts`. Never `tools/`, `package*.json`, `AGENTS.md`, `plans/`, `memory-bank/`, git config, `node_modules/`, other worktrees. Commit on `grugops/ABC-194` only. Never push, merge or `--force`.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass your worktree as the context root explicitly** — never the plugin dir. Take every `at` from `date -u` (UTC). Include a `kind: decision`. Notes are append-only: never delete one; a wrong note gets a superseding note. `artifact-ref` needs a §14 gate run, so record artifacts as `observation`. Task `ticket-to-pr-ABC-194`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/<subtask>.md` + `.claim.md`, main's tree, uncommitted); the Orchestrator appends it.
