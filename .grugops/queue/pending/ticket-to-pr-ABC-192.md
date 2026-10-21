---
subtask: ticket-to-pr-ABC-192
role: software-engineer
tickets: [ABC-192]
branch: grugops/ABC-192 (from main @ the main tip at your start); worktree ../wt-ABC-192
ref: .grugops/context/ticket-to-pr-ABC-192/
width: 3 (beside arch-build-ABC-193 and scribe-waiver-quotepath; disjoint files)
---

# SE: ABC-192 — a parser-read row pins that `setup` hands the guard `process.stdout` (QE-176-a), and a row pins the installed vitest at 4.1.11 with the re-run list as its message (QE-176-b). `src/cli.test.ts` only; ZERO production lines

## Read first
- The ticket page `plans/tickets/ABC-192-nothing-pins-the-stream-setup-hands-the-guard-and-a-vitest-bump-re-runs-no-capture-arm.md`: every criterion, § Scope, § Out of scope, § Test notes.
- BA/PM notes in `.grugops/context/bapm-rule-QE-176/notes/` (`…73efba41` rulings, `…af4186af` readings, `…ef39afc9` the failed in-process route — do not retry it); QE `qe-ABC-176` notes (`…fbdf5a60` mutants, `…c9b3023e` ordering); `tools/grugops/heap-guard.js`.
- `AGENTS.md`, `memory-bank/45-standing-rulings.md`.

## Do
- Create the worktree `../wt-ABC-192` on `grugops/ABC-192` from the current `main`. A `node_modules` symlink is fine.
- Red first, on scratch copies outside the repository: the page's mutants (M4 `process.stderr`, M4b `{ write() {} }`, a version bump) turn the new rows red; base passes.
- Implement exactly the page's Scope. No new spawned child (`N8_SPAWN` stays 28).
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 files, 1992 + your new rows); skip-count capture as spelled in `AGENTS.md` → its integer into `test-skip-integrity.js --skip-count`. One-file vitest runs `NODE_OPTIONS=--max-old-space-size=400`; whole-suite 128. No timing.
- UAT waiver in the owner's new form (`…717a2219`): `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` must print nothing. AR-191-GITENV stand-in, in your shell and worktree: `git config --get-regexp '^(color\.(ui|diff)|diff\.(external|srcprefix|dstprefix)|diff\..+\.command)$' | grep -v -E '^color\.(ui|diff) (auto|true|false|never)$'; printenv GIT_EXTERNAL_DIFF` must print nothing.

## Fences
- Only `src/cli.test.ts`. Never `tools/`, `package*.json`, `AGENTS.md`, `plans/`, `memory-bank/`, git config, other worktrees. Commit on `grugops/ABC-192` only. Never push, merge or `--force`.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass your worktree as the context root explicitly** — never the plugin dir. Take every `at` from `date -u` (UTC). Include a `kind: decision`. Notes are append-only: never delete one; a wrong note gets a superseding note. `artifact-ref` needs a §14 gate run, so record artifacts as `observation`. Task `ticket-to-pr-ABC-192`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/<subtask>.md` + `.claim.md`, main's tree, uncommitted); the Orchestrator appends it.
