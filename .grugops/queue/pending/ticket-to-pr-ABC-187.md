---
subtask: ticket-to-pr-ABC-187
role: software-engineer
tickets: [ABC-187]
branch: grugops/ABC-187 (from main @ the main tip at your start); worktree ../wt-ABC-187
ref: .grugops/context/ticket-to-pr-ABC-187/
width: 2 (beside ticket-to-pr-ABC-185; disjoint files)
---

# SE: ABC-187: lower `AGENTS_MD_BUDGET_BYTES` in `src/cli.test.ts` from 24,576 to 18,432, rewrite its one-line JSDoc, and fix the stale closer count at `:2242` (QE-164-h). Test file only; ZERO production lines

## Read first
- The ticket page `plans/tickets/ABC-187-the-agents-md-byte-guard-still-allows-24576-b-so-abc-164s-cut-can-grow-back-unflagged.md`: every criterion, § Scope (three lines), § Out of scope.
- BA/PM notes `…669853d9` (readings), `…d74b218a` (the cut), `…52428ef9` (the owed `AGENTS.md:7` line); owner decision `…cba9c8eb`.

## Orchestrator ruling on the owed `AGENTS.md:7` line
- Folded in: after your commit, the Orchestrator sends the Scribe onto **your branch** to change `AGENTS.md:7` (`24,576` → `18,432`, byte-neutral). **You do not touch `AGENTS.md`.** `A6` is then read with its "only if folded in" clause.

## Do
- Create the worktree `../wt-ABC-187` on `grugops/ABC-187` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Show the guard's teeth first, in a scratch copy outside the repo with a private `TMPDIR`: an `AGENTS.md` of 18,433 B passes the base guard and fails the head guard; 18,432 B passes head; the real `AGENTS.md` passes head.
- Implement exactly the three Scope lines. 0 lines added or removed net.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987, equal to base); skip-integrity `--skip-count 0`. One-file vitest runs use `NODE_OPTIONS=--max-old-space-size=400`; whole-suite runs 128 (as `npm test` sets). No timing.
- Measure the UAT waiver in AGENTS.md's form (must print nothing).

## Fences
- Only `src/cli.test.ts`, only the three lines. Never touch `AGENTS.md`, `plans/`, `memory-bank/`, other worktrees.
- Commit on `grugops/ABC-187` only. Never push or merge.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-187`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`. Write notes inside your worktree; include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-187.md` (brief + `## Result`: tip, per-criterion results, the scratch guard readings, gates, waiver) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| ABC-187 (SE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
