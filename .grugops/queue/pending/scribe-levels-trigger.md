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
