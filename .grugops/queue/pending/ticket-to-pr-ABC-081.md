---
task: wave-2026-09-24
subtask: ticket-to-pr-ABC-081
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-081-transposition-table-and-in-tree-repetition.md
ref: .grugops/context/ticket-to-pr-ABC-081/
ruling_ref: .grugops/context/ruling-abc080-081/   (R2, R3, R4 decisions + probe/)
adr_refs: memory-bank/50-decisions/ADR-0025-the-transposition-table-is-its-own-fixed-structure-cleared-per-search.md  memory-bank/50-decisions/ADR-0006-castling-rights-stay-rights-in-the-hash.md  (ADR-0020 for the per-ply key array)
nfr_ref: plans/nfr-catalog.md NFR-009
qe_080_ref: .grugops/context/qe-ABC-080/   (G1 — the engine.ts killer-on-cutoff mutant survives; close it here)
enqueued_by: orchestrator
enqueued_at: 2026-09-25T17:30:00Z
branch: grugops/ABC-081-transposition-table
base: grugops/wave-2026-09-24 (tip after this enqueue; ABC-080's ordering and dormant hash-move slot are on it)
---

# Subtask: build `ABC-081` — transposition table + in-tree repetition

DoR 10/10. The ticket page is the contract: its acceptance criteria, its Scope, its test notes,
its `N8-LANE` line and its Security/NFR triggers. `ADR-0025` (accepted) is the table's shape:
fixed-size typed arrays, full 64-bit key verified, cleared at each `chooseMove`/`search()`
entry, full-width nodes only, test-only door `searchWithoutTable`, and a capacity guard on the
key array that is not a depth budget. `ADR-0006`'s rights key is required (falsifier `G6`).
Wake `ABC-080`'s dormant hash-move slot in both recursions.

Also close QE `ABC-080` G1: a row that reds when `src/engine.ts` records a killer on every move
instead of only on a cutoff.

## Stop conditions (hand up, do not trim or widen)
- A score change against `searchWithoutTable` at fixed depth where the ticket requires identity,
  other than the equally-scored-move case the ticket already licenses for the `ABC-078` identity row.
- `NFR-009` over 16 MiB (a 2^20 table is a re-level: the owner licensed up to 128 MiB, but only
  on a MEASURED need. Measure it and hand it up. Do not raise it yourself.)
- A needed change outside the ticket's Scope.
- `N8-LANE` over its line: measure and report, do not trim tests to fit.

## Report the depth reading
Depth completed in 3 s (`chooseMove`, default budget) on kiwipete and position-6, this build vs
the base, same process, ≥ 3 rounds, in plain node AND under vitest, with the load average.
`NFR-005`'s floor is 6. The owner has not yet said which runner it binds. Report both runners.

## Fences
Never merge; never push. Do not touch `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, or
ADRs. Own `git worktree` under `.claude/worktrees/` (symlink `node_modules` from the main
checkout). Commit messages via a scratchpad file and `git commit -F`; probes as node scripts.

## Publish
`decision` + `observation` + `claim` notes under `ref:`, a trace row, a ticket § Delivery. Queue
pending → claimed → done per Workflow 17. Report: gates (lint / typecheck / build / files /
passed / skipped / skip-integrity), each criterion MET or not with its reading, the depth table,
`NFR-009` readings, mutants run and which rows red them (G1 included), `N8-LANE` charge with
load average, sha, numstat.
