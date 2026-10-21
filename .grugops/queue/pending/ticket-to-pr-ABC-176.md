---
subtask: ticket-to-pr-ABC-176
role: software-engineer
tickets: [ABC-176]
branch: grugops/ABC-176 (from main @ the main tip at your start); worktree ../wt-ABC-176
ref: .grugops/context/ticket-to-pr-ABC-176/
width: 3 (beside arch-build-ABC-191 and bapm-epic007-confirm; disjoint files)
---

# SE: ABC-176 — a heap-guard-refused run never reads as a clean skip count or a quiet result file. `tools/grugops/` + test rows in `src/cli.test.ts`; ZERO production lines

## Read first
- The ticket page `plans/tickets/ABC-176-a-refused-run-never-reads-as-a-clean-skip-count-or-a-quiet-result-file.md`: every criterion A1–A5, § Scope, § Pins that move, § Test notes, the A2 fallback.
- Sources it cites: `SEC-173-1` (`.grugops/context/secnfr-ABC-173/notes/…f3757b98`, `probe/skipzero.out`), `QE-173-d` (`.grugops/context/qe-ABC-173/notes/…e81b5c27`), BA/PM `.grugops/context/bapm-cut-ABC-176/`.
- `AGENTS.md`, `memory-bank/45-standing-rulings.md`, `memory-bank/90-agents-md-command-log.md`.

## The page is from 2026-10-19 (DoR 10/10 then). Facts that moved since — re-read them at base before any code
- `AGENTS.md` was split by ABC-164: the skip-count line is now `:105` (page says 144), the `Test (all)` line `:72` (page says 84). Lane comments moved to `memory-bank/90-…`.
- **A5's byte budget is now the guard `AGENTS_MD_BUDGET_BYTES = 18_432`** in `src/cli.test.ts` (ABC-187), not 24,576. `AGENTS.md` is 15,606 B on main. Read A5 against 18,432.
- `ABC-173` `A3` needs ≥ 17 `AGENTS.md` vitest commands; do not add any new backticked `npx vitest` text to `AGENTS.md`.
- **Stop before code and report** if A1–A4's base readings no longer hold as the page states (precedent: ABC-161), or if A2 proves infeasible (the page's fallback: back to BA/PM; never dropped silently).

## AGENTS.md lines (Orchestrator ruling)
- You do **not** edit `AGENTS.md`. Write the exact proposed `AGENTS.md` text (the `Test (all)` comment fix and the skip-count history-pointer clause, plus the skip-count command if it must change) into a `decision` note with before/after strings and byte delta. After your commit the Orchestrator sends the Scribe onto **your branch** to apply it; A5 is read after that.

## Do
- Create the worktree `../wt-ABC-176` on `grugops/ABC-176` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Red first: show A1 and A3's wrong builds at base (today's line prints `0`, exit 0; today's reporter records no error).
- Implement within the page's Scope. Re-run the six `ABC-149` reporter rows plus the new seventh in a scratch copy **outside the repository** with a private `TMPDIR`.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (counts = base + your new rows); skip-integrity `--skip-count 0`. One-file vitest runs use `NODE_OPTIONS=--max-old-space-size=400`; whole-suite 128 (as `npm test` sets). No timing.
- UAT waiver in AGENTS.md's form (must print nothing) and `git diff --numstat <base> <tip> -- src | awk '$1=="-"'` (must print nothing).

## Fences
- Only `tools/grugops/` files the page scopes and `src/cli.test.ts` (test rows). Never `package.json`, `vitest.config.ts`, `test-skip-integrity.js`, any production `src/` file, `AGENTS.md`, `plans/`, `memory-bank/`, `.grugops/test-skips.md` (human-owned), other worktrees, or the `grugops/ABC-168` branch.
- Never rewrite an existing `.grugops/` note (the page's option b). Commit on `grugops/ABC-176` only. Never push or merge. No `--force` on any git command.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass your worktree (or, for records-only hops, this repo root) as the context root explicitly** — never the plugin dir. Take every `at` from `date -u` (UTC, never local time). Include a `kind: decision`. `artifact-ref` needs a §14 gate run, so record artifacts as `observation`. Task `ticket-to-pr-ABC-176`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, `—` for empty, `\|` for a literal pipe. Put it in your done record; the Orchestrator appends it.
