---
task: wave-2026-09-25
subtask: secnfr-ABC-082
role: security-nfr
workflow: agent-factory/workflows/05-pr-quality-gate.md (Security/NFR step — performance-sensitive flow)
ticket: plans/tickets/ABC-082-evaluation-pawn-structure.md
ref: .grugops/context/secnfr-ABC-082/
build_ref: .grugops/context/ticket-to-pr-ABC-082/   (note …a00b6aaa: NFR-005 WARN, A6 cost, N8-LANE)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T16:59:33Z
branch: grugops/secnfr-ABC-082
base: grugops/ABC-082-pawn-structure @ 873911d
---

# Subtask: Security/NFR gate for `ABC-082`

Trigger: performance-sensitive flow (engine search). Rule on readings you take yourself:
1. **`NFR-005`** — kiwipete reached depth 7 in 1/3 rounds (base 3/3); position-6 3/3; never < 6;
   +14.6% nodes to depth 7, node rate unchanged. Measure under the catalog's protocol (quiet
   machine if attainable; state the load). Verdict on the clause as written in
   `plans/nfr-catalog.md`, and what the owner must decide if it is not met.
2. **`A6`** evaluator cost (≤ 1,100 ns; build read 385–394 ns vs base 136–146 ns).
3. **`N8-LANE`** (≤ 650 ms; build read ~+130 ms) and the `NFR-008` second-order delta (+0.6 s CPU).
4. Any security surface: none expected (pure function, no I/O) — confirm or name one.

Required fixes vs accepted risks (with owner) per your role. You do not move a catalog level.

## Fences
Zero lines under `src/`, `tools/`, `package.json`, `plans/nfr-catalog.md`. No `plans/board.md`,
`AGENTS.md`, ADRs. Never merge; never push. Own worktree under `.claude/worktrees/`. QE runs deep
lanes on this machine in parallel — record load with every timing. Real UTC stamps.

## Publish
`decision` (PASS / PASS_WITH_RISKS / FAIL) + `observation` notes under `ref:`, trace row, ticket
§ Security/NFR. Queue pending → claimed → done per Workflow 17. Report: verdict, each reading with
load, required fixes, accepted risks + owner, owner words owed, sha.
