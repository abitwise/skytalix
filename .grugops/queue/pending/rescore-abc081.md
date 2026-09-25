---
task: wave-2026-09-24
subtask: rescore-abc081
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md (DoR re-score)
ticket: plans/tickets/ABC-081-transposition-table-and-in-tree-repetition.md
ref: .grugops/context/rescore-abc081/
nfr_ref: .grugops/context/place-nfr009/
qe_080_ref: .grugops/context/qe-ABC-080/
secnfr_080_ref: .grugops/context/secnfr-ABC-080/
enqueued_by: orchestrator
enqueued_at: 2026-09-25T17:00:00Z
branch: grugops/rescore-abc081
base: grugops/wave-2026-09-24 (tip after this enqueue)
---

# Subtask: re-score `ABC-081` now that `NFR-009` is placed and `ABC-080`'s code is on the wave

Open at the last score (8/10): ⚠️(3) `A3` passes only with `ABC-080`'s hash move live; ⚠️(10) no
memory NFR row. `NFR-009` is now in `plans/nfr-catalog.md` (`nfr_ref:`). `ABC-080` passed QE and
Security/NFR and its code is on the wave, where `ABC-081` builds (`Ready for UAT`, owner's word pending).

## Do
1. Re-score against `agent-factory/checklists/definition-of-ready.md` on the current wave tree.
   Say whether ⚠️(3) is discharged by `ABC-080`'s code being on the build base.
2. Fold into the criteria/scope: `NFR-009` (16 MiB total; a 2^19 table fits and 2^20 is a
   re-level); QE `ABC-080` G1 (the `src/engine.ts` killer-on-cutoff mutant survives, so the
   Engineer closes it here, since this ticket touches `engine.ts`); the killers-across-iterations
   wording QE asked BA/PM to firm up on `ABC-080`'s page (fix it there too).
3. Name, but do not decide, the owner's open question: which runner `NFR-005` binds (plain node
   vs vitest). Security/NFR recommends plain node.

## Fences
No files under `src/`. Do not touch `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, or
ADRs. Never merge; never push. Own `git worktree`; commit messages via a scratchpad file and
`git commit -F`.

## Publish
A `decision` note, a trace row, a § DoR re-score section. Queue pending → claimed → done per
Workflow 17. Report: the score out of 10, each open item with its owner, pullable today or not,
sha, numstat.
