---
task: owner-rulings-2026-09-19
subtask: ruling-abc107-overflow
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (design ruling → ADR; ABC-107 becomes estimable)
ticket: plans/tickets/ABC-107-the-message-region-cannot-show-a-seven-candidate-ambiguity.md
ref: .grugops/context/ruling-abc107-overflow/
authority: .grugops/context/owner-rulings-2026-09-19/notes/20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42.md
enqueued_by: orchestrator
enqueued_at: 2026-09-19T10:05:00Z
branch: grugops/ruling-abc107-overflow
base: grugops/owner-rulings-2026-09-19
adr_id: ADR-0022
---

# Subtask: pick the shape for a 7+ candidate ambiguity that does not fit the message region, and rule it

Read the authority note, `ABC-107` in full (four options; two shapes ruled out; `A1`–`A5`),
`ABC-033` `A4`, `EPIC-002` `4a`, `ADR-0009` (row identity), `src/frame.ts`, `src/render.ts`,
`src/move-input.ts`, `src/san.ts` (the disambiguator). The owner's word: *"6. implement best guess
for now"* — he delegated the choice to you and wants it built, not debated.

## Deliver
- `memory-bank/50-decisions/ADR-0022-<slug>.md`, `status: accepted`. Quote the owner verbatim.
  Choose ONE of options 1–4 (paged region / second prompt / narrower rendering / accepted risk),
  price the other three, and name the falsifier that would flip it. Silent truncation and widening
  the frame stay ruled out. The Orchestrator's prior: **option 3 (SAN disambiguator rendering)**
  is cheapest and pure, and if it still cannot fit 8 knights, combine with option 4 for the
  remainder — but measure first: with the current `MESSAGE_ROWS` and width, how many candidates
  fit under option 3? Under the current rendering? Put the numbers in the ADR.
- Update `ABC-107`'s page against the ruling: size (`XS` under 4, `S` under 3, `M` under 1/2),
  `A1` replaced if option 4 applies, DoR items 3 and 10 re-scored. State whether it is pullable.
- Recommend to the Orchestrator: pull now, or park behind `ABC-034` (rejection wording).

## Fences
- Zero files under `src/` — "implement" means the ticket is built next, gated, by Software
  Engineer; this hop makes it buildable. If you find the ruling is a one-line change you are
  tempted to make: do not; write it down.
- `MESSAGE_ROWS` and the frame's row count are not moved (`EPIC-002` `4a`, `ADR-0009`).
- Do not touch `AGENTS.md`, `plans/board.md`. Do not merge, do not deploy. Own `git worktree`,
  commit on the branch above.

## Board / trace
Board moves are the Orchestrator's. Append your `plans/traceability.md` row.

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(no `finding` admissible; the ruling is a `decision`, fit measurements an `observation`). Claim by
hand per Workflow 17: `mkdir .grugops/queue/claimed/ruling-abc107-overflow`, move this file in,
then out to `done/`.
