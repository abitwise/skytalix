---
subtask: arch-build-ABC-191
role: architect-design
tickets: [ABC-191]
branch: grugops/ABC-191 (from main @ the main tip at your start); worktree ../wt-ABC-191
ref: .grugops/context/arch-build-ABC-191/
width: 3 (beside ticket-to-pr-ABC-176 and bapm-epic007-confirm; disjoint files)
---

# Architect (builder): ABC-191 — clause (b)'s one diff call reads `--text --no-textconv`; `r2-mutants.sh` gains `BIN-NUL` and `BIN-ATTR`; `.out.txt` regenerated; `ADR-0036` § S1 dated block retiring the `--numstat` stand-in. Closes `AR-188-BINARY` on QE's read. ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-191-a-production-file-git-treats-as-binary-hides-every-changed-line-from-clause-b.md`: every criterion, § Scope (four files), § Out of scope, § Test notes.
- BA/PM notes in `.grugops/context/bapm-cut-AR-188-BINARY/notes/` (`…d4004b45` scratch readings, `…2edce8cb` the cut); Security/NFR `…f5843a71`; owner record `…9f5ca4b4`; `ADR-0036` § S1 (incl. the ABC-188 block); ABC-188's harness and its done records.
- `AGENTS.md`, and `memory-bank/45-standing-rulings.md` for the gate rules.

## Do
- Create the worktree `../wt-ABC-191` on `grugops/ABC-191` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- **Red first:** run the 12-row harness against base's instrument; it must fail on exactly `BIN-NUL` and `BIN-ATTR` (page). Show each flag alone falls short, as the page states.
- Implement exactly the page's Scope. The 10 `ABC-188` rows unchanged; limbs 2/3 compared as the page's table says.
- Note the `.gitattributes` plant: build it only in scratch/plant checkouts; never commit a `.gitattributes` to `grugops/ABC-191` and never leave `.git/info/attributes` edited in any shared git dir (worktrees share `.git/info`). Report if you touched it at all.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (counts equal base, 59 / 1987 at last merge); skip-integrity `--skip-count 0`. Heap 128 multi-file (as `npm test` sets), 400 for one-file runs. No timing.
- UAT waiver in AGENTS.md's form (must print nothing), and the AR-188-BINARY stand-in `git diff --numstat <base> <tip> -- src | awk '$1=="-"'` (must print nothing).

## Fences
- Only the four files the page scopes (plus your own notes and done record). No `src/`, `biome.json`, `plans/`, `AGENTS.md`, other worktrees. Commit on `grugops/ABC-191` only. Never push or merge. No `--force` on any git command.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass your worktree (or, for records-only hops, this repo root) as the context root explicitly** — never the plugin dir. Take every `at` from `date -u` (UTC, never local time). Include a `kind: decision`. `artifact-ref` needs a §14 gate run, so record artifacts as `observation`. Task `arch-build-ABC-191`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, `—` for empty, `\|` for a literal pipe. Put it in your done record; the Orchestrator appends it.
