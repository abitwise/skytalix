---
task: ticket-to-pr-ABC-077-2026-08-17
subtask: ticket-to-pr-ABC-077
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-077-2026-08-17/
parent_ref: .grugops/context/ticket-to-pr-ABC-077-2026-08-17/
ticket: plans/tickets/ABC-077-negamax-alpha-beta-core.md
enqueued_by: orchestrator
enqueued_at: 2026-08-17T21:35:00Z
branch: grugops/abc077-negamax-alpha-beta
base: main @ bf371d7
---

# Subtask: negamax + alpha-beta, the recursion core — `ABC-077`

Read the ticket. Read `ref:` — it holds ONE Orchestrator note, the criteria re-read at the
`Ready for Dev` exit, carrying **four gaps**. **`G1`: the page's § Dependencies still says
`ABC-076` is OPEN. It merged 2026-08-17 and `src/evaluate.ts` exists — the page is stale, the
ticket is unblocked, and you do NOT edit the page to fix it.** **`G2` is the one that will bite a
careless hop: `A1` is a DIFFERENTIAL oracle and both of its sides call the same `evaluate()`, so a
green `A1` is NOT evidence the evaluation is correct.** Nothing from that note is restated here.

## Hard limits on this subtask

- **`RISK-002` is ratified and non-negotiable: the per-move budget must be TIME-based.** This ticket
  takes a `depth` argument and that is legitimate **only** because `A6` guards it: the delivered
  module exports **no function that selects a move without a caller-supplied depth**, and **no
  default value for `depth` exists anywhere in it.** A default depth is a fixed-depth per-move budget
  wearing a parameter's name. `ABC-078` owns the clock and the public entry point — **not you.**
- **`A6` must name the module you actually deliver.** The page names no path; you choose it, and the
  shape assertion reads that file by name. An unnamed subject is how a shape assertion ends up
  reading nothing.
- **Out of scope, each already owned:** quiescence (`ABC-079`), move ordering (`ABC-080`), the
  transposition table and in-tree repetition (`ABC-081`), the wall clock and the entry point
  (`ABC-078`). **Parallelism is `UNKNOWN - verify` and is Architect/Design's** — ship
  single-threaded, say so, decide nothing.
- **The pruning-disabled mode is a TEST-ONLY switch, never a shipped option** (coding rule 7).
- **Do not re-test move generation.** `PERFT_DEEP` proves it 32/32 exact; `A4` checks the search's
  choice, not the generator.
- **`N8-LANE` ≤ 650 ms: DECIDE IT WITH A MEASUREMENT.** If the depth-3 sweep does not fit, put it
  behind an opt-in env flag (`PERFT_DEEP` precedent) and leave a small subset in the default lane.
  **Do not silently drop the depth-3 sweep to make the lane fit** — that trades `A1`'s only
  window-bug detector for a stopwatch.

## Definition of done for this subtask

`A1`–`A7` each answered with the number the criterion asks for, **measured, not asserted**: `A1`
identical scores pruned vs unpruned across the corpus at depth 3, `A2` **< 40%** of unpruned nodes
on `kiwipete`, `A3` mate-in-2 preferred over mate-in-4, `A4` **200/200** legal, `A5` stalemate
**exactly 0**, `A6` the signature guard, `A7` the position **byte-identical** after every search.
**Write `A5` first** — stalemate-scored-as-mate passes `A1`–`A4` and is the classic negamax bug.
Report `NFR-005` depth figures as **diagnostics with node definition, position and machine**; take
**no depth verdict** — `ABC-078` owns the budget. Gates (`lint`, `typecheck`, `build`, `npm test`,
test-integrity) run on your branch tip and transcribed. Notes published per Workflow 16 under
`ref:`, hand-authored per `agent-factory/contracts/context-note.md` — **no `kind: finding`, no
invented stamp** (`AGENTS.md`). Queue claim taken by hand.
**Do not merge — the Orchestrator re-runs the gate itself and holds the merge.**
