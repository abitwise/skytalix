---
task: owner-rulings-2026-09-19
subtask: ruling-abc046-quit-arm
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (contract ruling → ADR; unblocks ABC-046, ABC-102, ABC-112)
ticket: plans/tickets/ABC-046-quit-and-new.md
ref: .grugops/context/ruling-abc046-quit-arm/
authority: .grugops/context/owner-rulings-2026-09-19/notes/20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42.md
enqueued_by: orchestrator
enqueued_at: 2026-09-19T10:05:00Z
branch: grugops/ruling-abc046-quit-arm
base: grugops/owner-rulings-2026-09-19
adr_id: ADR-0021
---

# Subtask: rule shape (b) — the turn loop gains a `quit` arm; `resign` stays its own command

Read the authority note, `ABC-046` in full (its shape table (a)/(b)/(c) and `A3`), `ABC-102`
(`undo`), `ABC-112` (`help` advertises `quit`), `ABC-045` (`resign`), `ABC-035` (in-game commands),
`src/turn-loop.ts`, `src/command-input.ts`, `src/line-input.ts`, `src/cli.ts`, and the ADR that
enumerates the loop's 8-state / 16-transition machine (grep `memory-bank/50-decisions` for it).
The owner's word: *"5. b, resign should be separate"*.

## Deliver
- `memory-bank/50-decisions/ADR-0021-<slug>.md`, `status: accepted`. Quote the owner verbatim.
  Specify the arm: the exact `PromptOutcome` / `LoopOutcome` shape (`{ kind: "quit" }` or a
  no-result `reason` — pick one and say why), the state-machine delta (new states/transitions,
  numbered against the existing 8/16), the `quit` confirmation interaction, `new`'s reset via the
  arm (the stale claim cell `ABC-046` names), and where `undo` (`ABC-102`) hangs off the same arm.
  `quit` ≠ resign: shape (c) stays rejected; `resign` (`ABC-045`) is a separate command with a
  result, `quit` ends with no result, exit 0.
- Say what re-opening `Done`, mutation-tested `turn-loop.ts` costs: which existing tests/guards
  will legitimately go red and must be updated (name them), and which must NOT change.
- Update `ABC-046`'s page: ruling landed, `A3` stands as written (it was written to pass under
  (b)), DoR re-scored. Same for `ABC-102` and `ABC-112` (`ABC-112` may now be a one-line
  dependency on `ABC-046` rather than its own fix — say which). Recommend the pull order to the
  Orchestrator (`ABC-045` first? `ABC-046` first?).

## Fences
- Zero files under `src/`. This hop rules; the tickets build.
- Do not touch `AGENTS.md`, `plans/board.md`. Do not merge, do not deploy. Own `git worktree`,
  commit on the branch above.

## Board / trace
Board moves are the Orchestrator's. Append your `plans/traceability.md` row.

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(no `finding` admissible; the ruling is a `decision`). Claim by hand per Workflow 17:
`mkdir .grugops/queue/claimed/ruling-abc046-quit-arm`, move this file in, then out to `done/`.
