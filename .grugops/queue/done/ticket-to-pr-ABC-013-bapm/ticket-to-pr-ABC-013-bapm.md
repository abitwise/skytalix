---
task: ticket-to-pr-ABC-013
subtask: ticket-to-pr-ABC-013-bapm
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/ticket-to-pr-ABC-013/
enqueued_by: orchestrator
enqueued_at: 2026-08-10T11:38:14Z
branch: grugops/ticket-to-pr-ABC-013
---

# Subtask: repair `ABC-013`'s acceptance table, re-derive its NFR bars, and decide the `Ready → Ready for Dev` exit

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here** —
the Orchestrator's decision note carries the re-measured `main` baseline, the dependency checks it
did run, four named defects with the reasoning behind each, a fifth it names but does not assert, and
an explicit list of what it did **not** check. Do not re-derive the baseline; do re-derive everything
it disclaims.

## The board move IS yours

`ABC-013` sits in `Ready` (1/8). `plans/board.md` § Columns makes BA/PM the exit owner of `Ready`, so
**you take `Ready → Ready for Dev`** — but only if the corrected ticket earns it. `Ready for Dev` is
0/6, so there is room. The Orchestrator then owns `Ready for Dev → In Development` and enqueues the
engineer. **Do not take that exit and do not enqueue the engineer.**

If the ticket does **not** earn `Ready for Dev` — say so and leave it in `Ready`. A ticket parked with
a named reason is a good outcome. A ticket promoted to keep a hop moving is how this board got its
worst defect.

## The one thing that makes this ticket different from the last four

The four defects named at `ref:` are **not** blocking in the `ABC-023` sense. Nothing in `ABC-013` is
unsatisfiable; no hash is pinned dead. The ticket is *buildable* today — it is not *runnable as
acceptance*, because four of its thirteen criteria are prose rather than FENs and its two performance
bars were set against a tree that two merges have since changed.

So your job is repair, not rescue, and the standard is concrete: **when you are done, every criterion
must be executable by an engineer who has only the ticket** — a FEN, a move, and an exact expected
string, obtained per the ticket's own Test notes (`legalMoves(position)`, never a hand-built `Move`
literal). The ticket's own opening promise, *"Every criterion is a hand-built FEN with an exact
expected string"*, is the bar it currently fails; hold it to that.

## Two traps this ticket sets specifically

- **`(e.g. Qh4e1)` is a hedge, not an expected value.** Build the three-queen position, confirm it is
  legal, and pin the actual string. If the position cannot be built legally, the criterion changes —
  do not keep a criterion whose position may not exist.
- **The ticket forbids the shortcut that would make this easy.** *"Do not test against a generated
  expectation."* Every expected string is typed by hand from the FEN. You may run code to confirm a
  position is legal and to obtain `Move` objects; you may not let an implementation tell you what the
  right SAN is, because there is no implementation and the whole point is that the table is the oracle.

## Do not

- Do not write `src/san.ts` or any test for it. This subtask changes the ticket, not the code.
- Do not re-open `ADR-0004`. It is ratified; the ticket implements the seam and does not re-decide it.
- Do not touch `EPIC-003`'s `parseSan` contract beyond keeping the door open for it.
- Do not edit `plans/board.md`'s `_Updated:` header without first appending the outgoing line verbatim
  to `plans/tickets/history/ABC-013-board-history.md`. The board's own rule says so, and it was
  violated twice on 2026-08-09.

## Publish

Typed notes per Workflow 16 into `ref:` — `decision` for each acceptance repair with its reasoning,
`observation` for what you measured, `claim` (with `confidence`) for anything you could not verify.
Note the honest deviation recorded at `ref:`: this repo has no `scripts/context-io.ts`, so notes are
hand-authored markdown into the same layout. Mark this subtask done per Workflow 17.
