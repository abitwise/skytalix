---
subtask: scribe-waiver-quotepath
role: agents-md-scribe
tickets: []
branch: grugops/scribe-waiver-quotepath (from main @ the main tip at your start); worktree ../wt-scribe-waiver-quotepath
ref: .grugops/context/scribe-waiver-quotepath/
width: 3 (beside ticket-to-pr-ABC-192 and arch-build-ABC-193)
---

# Scribe: the owner's UAT waiver measurement gains `-c core.quotePath=false` (AR-191-QUOTEPATH's waiver half), in `AGENTS.md:150` and `memory-bank/45-standing-rulings.md:67`

## Read first
- Owner record `.grugops/context/security-nfr-QE-191-a/notes/20261021T173242Z-orchestrator-decision-717a2219.md` (item 2), Security/NFR `…7c1f3590` (QE-191-b / AR-191-QUOTEPATH: the waiver form drops `"src/q\303\251.ts"`), Orchestrator `…eb401873`.
- `AGENTS.md`, `memory-bank/45-standing-rulings.md`, `memory-bank/90-agents-md-command-log.md` (its logging rule).

## Do
- Create the worktree `../wt-scribe-waiver-quotepath` on `grugops/scribe-waiver-quotepath` from the current `main`. A `node_modules` symlink is fine.
- In both places, change only the command: `git diff --name-only <delivered>~1 <delivered> | …` → `git -c core.quotePath=false diff --name-only <delivered>~1 <delivered> | …`. Every other word of the rule is unchanged (unfiltered reference form, snapshot exception, "a waiver is not a signature", the three overrides).
- Show the new form catches what the old misses: in a scratch clone outside the repository (own `.git`, private `HOME`/`TMPDIR`), a commit adding `src/qé.ts` — old form prints nothing, new form prints `src/qé.ts`; on a test-only commit both print nothing.
- Log the change in `memory-bank/90-agents-md-command-log.md` if its rule asks. `wc -c AGENTS.md` ≤ 18,432 (report bytes; 15,797 now, +22 expected). No new backticked `npx vitest` text (ABC-173 A3 stays 17).
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1992); skip-count capture as spelled → `test-skip-integrity.js`. No timing.

## Fences
- Only those two lines (and the log row). No `src/`, `tools/`, `plans/`, git config, other worktrees. Commit on `grugops/scribe-waiver-quotepath` only. Never push, merge or `--force`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass your worktree as the context root explicitly** — never the plugin dir. Take every `at` from `date -u` (UTC). Include a `kind: decision`. Notes are append-only: never delete one; a wrong note gets a superseding note. `artifact-ref` needs a §14 gate run, so record artifacts as `observation`. Task `scribe-waiver-quotepath`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/<subtask>.md` + `.claim.md`, main's tree, uncommitted); the Orchestrator appends it.
