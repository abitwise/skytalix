---
task: wave-2026-09-24
subtask: qe-ABC-046
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-046-quit-and-new.md
ref: .grugops/context/qe-ABC-046/
build_ref: .grugops/context/ticket-to-pr-ABC-046/
enqueued_by: orchestrator
enqueued_at: 2026-09-24T09:00:00Z
branch: grugops/qe-ABC-046
base: grugops/wave-2026-09-24 (build 6cdde15 / c8f005f merged at 8b5114c)
---

# Subtask: QE `ABC-046` — break `quit` and `new`

The build is on the base. `quit` is a per-session flag in a wrapper around the pure resolver, and
`new` is a take-back of `moves.length`. The Engineer named three readings. Read the Engineer's
five notes in `build_ref:` (the `decision` with the three readings first, then the mutant
`observation`, where M9 is caught only by the entry-point child), then the ticket's criteria,
its § Ruling (2026-09-19, `ADR-0021`) and § Delivery, then the code.

## Rule
1. For each of the three readings the Engineer named: does it match the ticket and `ADR-0021`?
   If not, name the row that FAILS.
2. M9 (a reader that bypasses the wrapper) is caught only by the entry-point child. Is that
   enough, or is it a gap that needs an in-file row?

## Then break it
- Re-run the four gates; expect 42 / 1361 / 0 or report the difference. Confirm the
  `cli.test.ts` spawn pin.
- Reproduce the nine mutants, then add at least: `quit` and `new` on ply 0; `new` straight after
  `new`; `quit` or `new` after the game is over; trailing text (`quit now`, `new game`); mixed
  case; `new` while it is the engine's turn, if the prompt can be reached then. Each: rows RED or
  NONE, and what the product does where no row exists. Revert and confirm the tree is clean.
- `help` lists both commands, through the real frame.
- Check for false sentences in the amended docblocks (`ABC-114` standard).
- `test-skip-integrity` must print `No findings.`, with 0 skips.

## Do not
- Do not fix the build. Do not touch `src/search.*`, `src/quiescence.*`, `src/engine.*`
  (`ABC-079` is live). Do not open `plans/board.md`, `AGENTS.md`, or `plans/nfr-catalog.md`.
  Do not rule NFR-008.
- Do not merge or deploy. Work in your own `git worktree`. Write commit messages to a
  uniquely named scratchpad file and use `git commit -F`.

## Publish
PASS or FAIL as a `decision` note, mutants as `observation` notes with raw output, a trace row,
and a ticket § QE section. Claim by hand per Workflow 17: `mkdir .grugops/queue/claimed/qe-ABC-046`,
move this file in, then out to `done/`. Report: the verdict, the two rulings, the mutant table,
the gate numbers, the sha and the numstat.
