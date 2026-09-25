---
task: wave-2026-09-24
subtask: secnfr-ABC-079
role: security-nfr
workflow: agent-factory/workflows/15-security-audit.md (In Security/NFR gate)
ticket: plans/tickets/ABC-079-quiescence-search-on-captures.md
ref: .grugops/context/secnfr-ABC-079/
build_ref: .grugops/context/ticket-to-pr-ABC-079/
qe_ref: .grugops/context/qe-ABC-079/
ruling_refs: .grugops/context/ruling-abc079-multiplier/ .grugops/context/ruling-abc079-oracle/ .grugops/context/ruling-abc079-g1g2/
enqueued_by: orchestrator
enqueued_at: 2026-09-25T09:30:00Z
branch: grugops/secnfr-ABC-079
base: grugops/int-ABC-079 @ cb5540d
worktree: .claude/worktrees/secnfr-ABC-079
diff_under_review: 4f0ef01..cb5540d -- src   (the whole ticket, all hops)
---

# Subtask: Security/NFR gate for `ABC-079` (quiescence search)

Trigger: performance-sensitive flow (the engine's move search). QE PASSED on delta
(`qe_ref:`, 20260925T090000Z `decision`). QE reported, and did not rule, `NFR-004`,
`NFR-005` and `NFR-008`. Ruling them is this gate's job.

## Rule
1. **NFR-004** (3 s move wall): holds? Measure at the default budget on the six perft roots
   plus a capture-dense middlegame; report p95 against `nfr.perf_p95_ms` where it applies.
2. **NFR-005** (depth in budget, `ADR-0003` amendment 2c, `ADR-0024`): report the reached
   depth. The multiplier ruling says depth 6 is likely unreachable by rate alone. That
   re-level is the OWNER's call. Name it for the owner; do not re-level it yourself.
3. **NFR-008** (lane CPU budget, `ADR-0019`, 60 ms headroom): measure this ticket's charge
   at the delivery base and rule it conforming or not. Record the load average.
4. **Security** (ASVS L1, block on high): unbounded recursion or stack depth in `quiesce`
   (the cap of 8 plies), abort/timeout reachability, and any input path from the CLI into
   search. Name anything at high or above.

## Fences
Zero lines under `src/`. No `AGENTS.md`, `plans/board.md`, NFR catalogue bars. Never merge;
never push. Commit messages via a scratchpad file and `git commit -F`; probes as node scripts.

## Publish
`decision` (result: PASS / PASS-WITH-ACCEPTED-RISK / FAIL, with required fixes and accepted
risks) plus `observation` notes under `ref:`, a trace row, and a ticket § Security/NFR section.
Queue pending → claimed → done per Workflow 17. Report: the result in one line, each NFR
reading, each risk with its severity, anything the owner must decide, sha, numstat.
