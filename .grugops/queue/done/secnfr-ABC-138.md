---
task: wave-2026-09-25
subtask: secnfr-ABC-138
role: security-nfr
workflow: agent-factory/workflows/05-pr-quality-gate.md (Security/NFR gate)
ticket: plans/tickets/ABC-138-spawn-pin-holes-are-watched-by-hand-move-the-checks-into-the-pin.md
ref: .grugops/context/secnfr-ABC-138/
source_refs: .grugops/context/secnfr-ABC-133/ (your AR-133-LOADER / AR-133-WRAP ruling …0f608f0c; probe/loader-scan.mjs), and on the ticket branch: .grugops/context/ticket-to-pr-ABC-138/, .grugops/context/qe-ABC-138/ (gap register …d5a380ba), .grugops/context/fix-ABC-138/
enqueued_by: orchestrator
enqueued_at: 2026-10-10T16:49:28Z
branch: grugops/ABC-138-spawn-pin-in-suite (tip a4802fc0)
---

# Subtask: Security/NFR gate on `ABC-138` — the spawn pin now holds the loader/wrap checks itself

Rule:
1. **The C14 split:** confirm (or not) the page's stated false red (`C14` / `C14-ARG`: a call whose first
   argument is the `child_process` literal) as acceptable, and the guidance it gives.
2. **AR-133-WRAP:** discharge, or keep with a narrowed trigger? (QE-138-a/-d are now closed by `fix-ABC-138`.)
3. **AR-133-LOADER:** discharge or narrow; QE-138-b (literal module name in a non-first argument) and
   QE-138-c (the `const` advice is itself invisible to count (i)) are its named residuals — give each a
   severity and trigger, or a ticket.
4. Whether `loader-scan.mjs`'s by-hand check can now be retired from the per-diff routine.
V1.2.5 status, N8_SPAWN, A5 cost (re-time if you rely on it; load1 logged).

Verdict: PASS / PASS_WITH_RISKS / FAIL. Test-only fixes on the branch only if small and inside the page.

## Fences
No production `src/`. `plans/nfr-catalog.md` only if a catalog line must change (cite committed notes).
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR
worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. If committed probe scripts are refused, say so and
use your own harness.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Security/NFR. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, rulings 1–4, accepted risks
with triggers, follow-ups with owners, gates, branch + sha.
