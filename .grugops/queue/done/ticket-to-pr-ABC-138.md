---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-138
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-138-spawn-pin-holes-are-watched-by-hand-move-the-checks-into-the-pin.md
ref: .grugops/context/ticket-to-pr-ABC-138/
source_refs: .grugops/context/bapm-cuts-r5c-f1331-2026-10-10/ (notes …3b2a76f6, probe/f1331-*), .grugops/context/secnfr-ABC-133/ (…0f608f0c, probe/loader-scan.mjs), .grugops/context/qe-ABC-133/
enqueued_by: orchestrator
enqueued_at: 2026-10-10T15:50:20Z
branch: grugops/ABC-138-spawn-pin-in-suite
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-138` — move the AR-133-LOADER / AR-133-WRAP checks into the spawn pin

S, P3, DoR 10/10. The ticket page is the contract (F-133-1 (a)+(b); the C14 control split). Test-only,
`src/cli.test.ts`. Re-verify the premise at the current tip first (the 12 gaps green, controls green); if
stale, STOP and report.

## Stop conditions
- Any path other than `src/cli.test.ts` — STOP. No production file.
- ABC-042's A1 row, ABC-065's describe, ABC-059's describe must hash identically before/after; `N8_SPAWN`
  stays 27; ABC-133's A4 in-file cost bound (250 ms) must still hold — re-time it (load1 logged).
- AR-058-STRIP's trigger (a literal with `//` or `/*`, or a second `child_process` import form) — report.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into
YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: gates, per-criterion evidence
(plants red before/after), cost, `src/` numstat, branch + sha.
