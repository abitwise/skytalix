---
subtask: arch-build-ABC-195
role: architect-design
tickets: [ABC-195]
branch: grugops/ABC-195 (from main @ the main tip at your start); worktree ../wt-ABC-195
ref: .grugops/context/arch-build-ABC-195/
width: 2 (beside ticket-to-pr-ABC-194; disjoint files)
---

# Architect (builder): ABC-195 — clause (b) reads `---`/`+++` as headers only before a file's first `@@`; an unquoted header path drops one trailing TAB; 5 harness rows (25 total) with control twins; `.out.txt` regenerated; `ADR-0036` § S1 block retiring the HUNKHDR stand-in. Closes AR-193-HUNKHDR and AR-193-SPACEPATH on QE's read. ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-195-an-added-line-starting-plus-plus-hides-later-hunks-from-clause-b-and-a-production-file-whose-name-holds-a-space-goes-unseen.md`: every criterion, § Scope (incl. the three harness supports), § Out of scope, § Test notes.
- BA/PM `.grugops/context/bapm-cut-AR-193/notes/` (`…7e1a757e` readings, `…d7a70688` the cut); Security/NFR `.grugops/context/security-nfr-QE-193/notes/…5719a86d` and its `probe/` (`fix-prototype.patch`, `repro.sh`); Orchestrator `…73e94c9f`, `…f61be5db`; QE `qe-ABC-193` notes; `ADR-0036` § S1; ABC-193's harness.
- `AGENTS.md`, `memory-bank/45-standing-rulings.md`.

## Do
- Create the worktree `../wt-ABC-195` on `grugops/ABC-195` from the current `main`. A `node_modules` symlink is fine.
- **Red first:** the 25-row harness against base's instrument reproduces the page's base-red table; each half-removed copy reproduces its row.
- Implement exactly the page's Scope. The 20 existing rows unchanged.
- Plants and routes only in scratch clones (own `.git`, private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`). **Never** set git config or attributes in this repository, any worktree, or your real `HOME`; never touch `node_modules/` in main's checkout. Use `/usr/bin/diff` (the shell defines `diff` as a function).
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (counts equal base, 59 / 1994); skip-count capture as spelled → `test-skip-integrity.js`. Heap 128 multi-file, 400 one-file. No timing.
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` must print nothing. AR-193-HUNKHDR stand-in (`…73e94c9f`): `git -c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ <base> <tip> -- src | awk '/^diff --git /{h=0} /^@@/{h=1} /^(\+\+\+|---) / && (h || /\t$/)'` must print nothing.

## Fences
- Only the four files the page scopes (plus your notes). No `src/`, `plans/`, `AGENTS.md`, `memory-bank/` other than the ADR, other worktrees. Commit on `grugops/ABC-195` only. Never push, merge or `--force`.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass your worktree as the context root explicitly** — never the plugin dir. Take every `at` from `date -u` (UTC). Include a `kind: decision`. Notes are append-only: never delete one; a wrong note gets a superseding note. `artifact-ref` needs a §14 gate run, so record artifacts as `observation`. Task `arch-build-ABC-195`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/<subtask>.md` + `.claim.md`, main's tree, uncommitted); the Orchestrator appends it.
