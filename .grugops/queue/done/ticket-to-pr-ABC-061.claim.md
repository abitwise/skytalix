---
task: ticket-to-pr-ABC-061-2026-08-17
subtask: ticket-to-pr-ABC-061
role: software-engineer
claimed_at: 2026-08-17T11:00:00Z
branch: grugops/abc061-resolver-value-assertions
base: main @ a1f3643
ticket: plans/tickets/ABC-061-resolver-accepting-path-asserts-only-ok.md
---

# Claim — `ticket-to-pr-ABC-061`

Claimed by hand per `AGENTS.md` § "Role / workflow files": `mkdir -p .grugops/queue/claimed`
followed by a bare `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-061` (the atomic act; it
succeeded, so no other agent holds this task).

Scope: new `it` blocks in `src/cli.test.ts` pinning what each of the six accepted argvs
RESOLVES TO. Zero production lines. The merged `A6(i)` accepting block stays byte-identical.
Do not merge — the Orchestrator re-runs the gate and holds the merge.

Note: the queue item's `base:` header says `main @ 86594fb`; the Orchestrator's activation
message and the current `main` tip say `a1f3643` (two board/context commits later, no
`src/` change between them). Branching off `a1f3643` per the activation message.
