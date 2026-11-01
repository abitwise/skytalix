---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T15:51:11Z
subtask: scribe-levels-trigger
role: agents-md-scribe
ref: .grugops/context/scribe-levels-trigger/
branch: new grugops/scribe-levels-trigger from main (worktree .claude/worktrees/scribe-levels-trigger)
width: records only.
---
# Scribe: widen the levels deep lane's trigger list (ADR-0056 gap G-2)
## Inputs
ADR-0056 owner-answers fold (G-2; Architect note .grugops/context/arch-adr0056-owner-answers/notes/…c8c38f1e); BA/PM note .grugops/context/bapm-reconcile-adr0056/notes/…6029fd68: trigger list lives in memory-bank/90-agents-md-command-log.md, On-demand commands table (~line 52); AGENTS.md has no trigger for this lane.
## Do
- Add src/search.ts, src/evaluate.ts, src/quiescence.ts, src/transposition.ts and move ordering (orderMoves in search.ts) to the levels deep lane (`ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts`) trigger; note "owed per strength ticket (ADR-0056 owner-answers, R-TC)". Decide whether AGENTS.md should carry a one-line pointer (keep it within your role's AGENTS.md rules; skip if the command log is the right home).
## Fences
memory-bank/90-agents-md-command-log.md, AGENTS.md (only if justified), your notes. Run nothing. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task scribe-levels-trigger, contextRoot = worktree; never the plugin cache), commit, ## Result + trace row, brief + claim to done/.

## Result

- Branch `grugops/scribe-levels-trigger` (worktree `.claude/worktrees/scribe-levels-trigger`), from main `8f2fc9b5`.
- Edit `5d74b73e`, `memory-bank/90-agents-md-command-log.md` only (+3 -1):
  - Line 52, On-demand commands table, Levels deep lane row, column 2: `Run after any src/levels.ts, src/engine.ts, src/virtual-clock.ts, src/search.ts (move ordering, \`orderMoves\`, included), src/evaluate.ts, src/quiescence.ts or src/transposition.ts change. Owed per strength ticket (ADR-0056 owner-answers, R-TC).`
  - After line ~322 (the lane's moved comment, word for word, still the old list): one italic line saying the table row is the live list, so the file holds no second, disagreeing trigger.
- AGENTS.md: unchanged. Line 71 already routes every lane trigger to the command log; a pointer would spend bytes under the cap and restate it.
- Notes (`.grugops/context/scribe-levels-trigger/notes/`, commit `f7672ec2`): decision `20261101T155232Z-agents-md-scribe-decision-44d12c72`, observation `20261101T155233Z-agents-md-scribe-observation-5b98b7ed`.
- Records only; nothing run.

### Trace row (10 cells, header order; for the Orchestrator to append)

| scribe-levels-trigger | Levels deep lane trigger widened to search.ts (orderMoves), evaluate.ts, quiescence.ts, transposition.ts; owed per strength ticket (ADR-0056 G-2, R-TC); AGENTS.md needs no pointer | EPIC-010 | — | ADR-0056, R-TC, G-2 | `grugops/scribe-levels-trigger` @ `5d74b73e` (edit), `f7672ec2` (notes)<br>memory-bank/90-agents-md-command-log.md | records only; nothing run | — (docs) | — | DONE; merge is the Orchestrator's |
