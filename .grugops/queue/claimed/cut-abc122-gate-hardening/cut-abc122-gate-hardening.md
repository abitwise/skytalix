---
task: wave-2026-09-25
subtask: cut-abc122-gate-hardening
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md (cut one ticket + DoR score)
ref: .grugops/context/cut-abc122-gate-hardening/
source_refs:
  - .grugops/context/qe-ABC-081/notes/20260925T110500Z-qe-e2e-decision-abc081-verdict-pass-with-findings-d4e6a1b7.md   (gap 1: K3/K4)
  - .grugops/context/secnfr-ABC-081/notes/20260925T124400Z-security-nfr-observation-abc081-table-bounded-key-verified-moves-legal-capacity-guard-unreached-k4-low-80a49b24.md
  - .grugops/context/wave-2026-09-24/notes/20260925T190000Z-orchestrator-decision-aa98a05d.md   (owner adopted 3c)
enqueued_by: orchestrator
enqueued_at: 2026-09-25T19:30:00Z
branch: grugops/cut-abc122
base: grugops/wave-2026-09-25 (tip after this enqueue; = main 0541844 + this file)
---

# Subtask: cut `ABC-122` — the gate fails red in bounded time; the key-array capacity guard is tested

Owner's word, verbatim: *"go, cut the hardening ticket and run it through"* — the Orchestrator's
recommendation: one small (S) hardening ticket bundling two `ABC-081` findings, to land BEFORE
`ABC-121` (PVS + LMR) rewrites the recursion where the hang class lives.

## The two halves (cut into one ticket, size S, EPIC-004 or the gate's epic — your call)
1. **K4 — bounded gate.** A synchronous CPU-bound hang in a test worker cannot be interrupted by
   vitest's `testTimeout`, and `npm test` has no process-level timeout; stock macOS has no
   `timeout(1)`. Direction the owner adopted: a Node-based wrapper that spawns `vitest run`, kills
   the child tree after a fixed limit, and exits non-zero with a clear message; `npm test` points
   at it. Make the limit and exit code measurable criteria. Include a criterion proving the wrapper
   actually reds on a synthetic hang (without adding a hanging test to the default lane) and that a
   green run's exit code and output pass through unchanged.
2. **K3 — capacity guard.** `KEY_ARRAY_CAPACITY` in `src/search.ts` / `src/engine.ts` is untested;
   the root `!(depth >= 1)` guard makes it unreachable in play. A test that exercises the guard
   directly (e.g. a test-only lowered capacity) and asserts leaf-scoring and return — and a mutant
   (guard removed) that reds it.

## Your calls
Scope and non-scope (`AGENTS.md` is Scribe's — the Test-command line changes in a follow-up Scribe
pass, name that dependency); N8-LANE charge line; Security/NFR triggers (it touches the gate);
DoR score out of 10 with every ⚠️ named. Check the existing tickets for overlap first (`ABC-050`,
`ABC-105`, `ABC-108`, `ABC-110`, `ABC-118` touch the lane/gate).

## Fences
No `src/`, no `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs. Never merge; never
push. Own `git worktree` under `.claude/worktrees/`; commit messages via a scratchpad file and
`git commit -F`.

## Publish
The ticket page `plans/tickets/ABC-122-*.md`, a trace row, a `decision` note (DoR score) under
`ref:`. Queue pending → claimed → done per Workflow 17. Report: ticket path, DoR score and each
⚠️, size, sha, numstat.
