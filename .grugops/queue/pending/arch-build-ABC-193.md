---
subtask: arch-build-ABC-193
role: architect-design
tickets: [ABC-193]
branch: grugops/ABC-193 (from main @ the main tip at your start); worktree ../wt-ABC-193
ref: .grugops/context/arch-build-ABC-193/
width: 3 (beside ticket-to-pr-ABC-192 and scribe-waiver-quotepath; disjoint files)
---

# Architect (builder): ABC-193 — clause (b)'s diff call gains `--no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/`; every instrument git call runs with `-c core.quotePath=false`; a still-quoted path fires as a dispute; 8 harness rows (20 total); `.out.txt` regenerated; `ADR-0036` § S1 block retiring the GITENV stand-in. Closes AR-191-GITENV (and AR-191-QUOTEPATH's instrument half) on QE's read. ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-193-git-config-or-environment-can-blind-clause-bs-one-diff-call-and-a-non-ascii-production-file-goes-unseen.md`: every criterion (incl. the by-hand A6), § Scope, § Out of scope, § Test notes.
- BA/PM `.grugops/context/bapm-cut-AR-191/notes/` (`…a7367f5d` readings, `…7db22c5f` the cut); Security/NFR `.grugops/context/security-nfr-QE-191-a/notes/…7c1f3590` and its `probe/`; Orchestrator `…eb401873`, `…717a2219`; `ADR-0036` § S1; ABC-191's harness and done records.
- `AGENTS.md`, `memory-bank/45-standing-rulings.md`.

## Do
- Create the worktree `../wt-ABC-193` on `grugops/ABC-193` from the current `main`. A `node_modules` symlink is fine.
- **Red first:** the 20-row harness against base's instrument fails on exactly the page's 7 rows; show each part's red set as the page's table states.
- Implement exactly the page's Scope. The 12 existing rows unchanged.
- **Git routes are set only inside the harness's own scratch clones** (own `.git`, private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`) or a run's environment. **Never** set git config, `.git/info/attributes` or a global attributes file in this repository, any worktree (they share one `.git/config`), or your real `HOME`. Run the stand-in line below before you finish and report its output.
- Note: this host's shell defines `diff` as a function; use `/usr/bin/diff` for plain diffs.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (counts equal base); skip-count capture as spelled → `test-skip-integrity.js`. Heap 128 multi-file, 400 one-file. No timing.
- UAT waiver in the owner's new form (`…717a2219`): `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` must print nothing. AR-191-GITENV stand-in, in your shell and worktree: `git config --get-regexp '^(color\.(ui|diff)|diff\.(external|srcprefix|dstprefix)|diff\..+\.command)$' | grep -v -E '^color\.(ui|diff) (auto|true|false|never)$'; printenv GIT_EXTERNAL_DIFF` must print nothing.

## Fences
- Only the four files the page scopes (plus your notes). No `src/`, `plans/`, `AGENTS.md`, `memory-bank/` other than the ADR, other worktrees. Commit on `grugops/ABC-193` only. Never push, merge or `--force`.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass your worktree as the context root explicitly** — never the plugin dir. Take every `at` from `date -u` (UTC). Include a `kind: decision`. Notes are append-only: never delete one; a wrong note gets a superseding note. `artifact-ref` needs a §14 gate run, so record artifacts as `observation`. Task `arch-build-ABC-193`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/<subtask>.md` + `.claim.md`, main's tree, uncommitted); the Orchestrator appends it.
