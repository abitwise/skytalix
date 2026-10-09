---
task: wave-2026-09-25
subtask: fold-abc084-gate-b
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md (fold an owner ruling + DoR re-score)
ticket: plans/tickets/ABC-084-tactical-puzzle-suite-strength-regression-gate.md
ref: .grugops/context/fold-abc084-gate-b/
owner_word: .grugops/context/wave-2026-09-25/notes/20261009T205550Z-orchestrator-decision-b61e0d35.md
source_refs: .grugops/context/qe-ABC-086/ (G-QE-2)  memory-bank/50-decisions/ADR-0027-*  memory-bank/50-decisions/ADR-0028-*
enqueued_by: orchestrator
enqueued_at: 2026-10-09T20:55:50Z
branch: grugops/fold-abc084-gate-b
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: fold the owner's gate ruling (option B) into `ABC-084` and re-score it

Fold, against today's merged code (`ABC-076`…`ABC-082`, `ABC-086`, `ABC-121`, `ABC-122` all Done):
1. **⚠️(10) is RULED — option B** (owner note `…b61e0d35`, quote it): QE runs the suite at review on
   any ticket touching engine code (the file list in the note); red = QE FAIL. Baseline rule: moves
   only in its own commit with a reason; raising is QE's, lowering needs the owner's word. Write
   the trigger into the page as a criterion or a scope item — your call — and name that the
   `AGENTS.md` line lands with the build (Scribe). `quality.mandatory_gates` unchanged.
2. **`A4`**: "same build and the same seed" → `ADR-0027` deterministic mode (`createEngine({ budgetMs,
   now: virtualClock(step) })`, `src/virtual-clock.ts`), fresh clock per move, and a step lower
   bound per QE `ABC-086` G-QE-2 (`0.001` costs ~14 s/move). `A5`'s 60 s must be sized in that mode.
3. **Dependencies**: `ABC-078`/`ABC-079` Done; the shared do-not-hang corpus now exists
   (`ABC-079`, and `ABC-082` re-found one pair — `ADR-0028`): extend, do not fork. Say how `A2`'s
   ≥ 19/20 reads against it today if you can measure it cheaply (probe only).
4. The baseline should be recorded AFTER `ABC-082`'s evaluator (it is merged).

Score DoR out of 10 with every ⚠️ named; set `Ready` only if it is.

## Fences
No `src/`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs, `.grugops/factory.config.json`.
Never merge; never push. Own worktree under `.claude/worktrees/`. Commit messages via a scratchpad
file + `git commit -F`. Real UTC stamps. Append trace rows at the end of the table only.

## Publish
Ticket page edits, one trace row, a `decision` note (DoR) under `ref:`. Queue pending → claimed →
done per Workflow 17. Report: DoR with each ⚠️, criteria one line each, size, branch + sha, numstat.
