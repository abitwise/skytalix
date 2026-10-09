---
task: wave-2026-09-25
subtask: scribe-abc084-lane
role: agents-md-scribe
workflow: AGENTS.md maintenance (ABC-084 A8)
ticket: plans/tickets/ABC-084-tactical-puzzle-suite-strength-regression-gate.md
ref: .grugops/context/scribe-abc084-lane/
source_refs: .grugops/context/ticket-to-pr-ABC-084/ (claim …a9bf6ab2 — the drafted line)  .grugops/context/wave-2026-09-25/notes/*-b61e0d35.md (owner's option B, verbatim)  .grugops/context/ticket-to-pr-ABC-086/ + .grugops/context/qe-ABC-086/ (ENGINE_DEEP readings)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T21:40:19Z
branch: grugops/scribe-abc084-lane
base: grugops/ABC-084-puzzle-suite @ e426e91
---

# Subtask: land `ABC-084` `A8`'s `AGENTS.md` line, and refresh two stale lane lines

1. Add the puzzle-suite line per `A8` (the Engineer's draft is in claim `…a9bf6ab2`): command,
   the owner's engine file list VERBATIM from note `…b61e0d35`, "red = QE FAIL", the baseline rule.
2. Refresh the stale lines: `npm test` (the build branch reads 50 files / 1539) and `ENGINE_DEEP`
   (`src/engine.test.ts`: 45 passed (32 default) — re-run it yourself on this base and record
   the wall; add "run after any `src/virtual-clock.ts` change").
3. `AGENTS.md` stays ≤ 24 576 B (`ABC-109`'s cap) — report the byte count, and that the runnability
   guard tests stay green (`npm test`).

## Fences
`AGENTS.md` only (plus your note + one trace row). Never merge; never push. Own worktree; link
`node_modules` into YOUR worktree only. **Commit-message files in a PRIVATE scratchpad
subdirectory.** Real UTC stamps.

## Publish
A note under `ref:`, trace row. Queue pending → claimed → done per Workflow 17. Report: byte count,
the lines as landed, `npm test` result, sha.
