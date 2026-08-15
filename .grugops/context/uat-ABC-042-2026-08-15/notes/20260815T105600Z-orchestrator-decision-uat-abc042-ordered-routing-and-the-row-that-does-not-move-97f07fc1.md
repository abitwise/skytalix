---
id: 20260815T105600Z-orchestrator-decision-uat-abc042-ordered-routing-and-the-row-that-does-not-move-97f07fc1
kind: decision
by: orchestrator
at: 2026-08-15T10:56:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - plans/board.md
  - agent-factory/workflows/06-uat-pack.md
  - memory-bank/60-progress.md
supersedes: 
---

# Orchestrator Decision — the owner ordered the UAT for `ABC-042`; the routing, and the row that does NOT move

## The request

Project owner, in session: *"run the UAT for ABC-042"*. Classified `uat` → Workflow 06
(`agent-factory/workflows/06-uat-pack.md`).

**This is the owner exercising a call the board explicitly reserved to him.** `plans/board.md`'s
current header, written at task `g1-answered-2026-08-15`, ends: *"UAT WAS NEVER RUN ON THIS TICKET
AND FOR THE FIRST TIME IN THIS REPOSITORY IT COULD BE … it is the owner's call and is NOT folded
in."* It is now made. Nothing here is inferred from the standing directive being read wider than it
was written.

## The authority, and its stated bound

`memory-bank/60-progress.md` § "Standing directive — deploy is ALLOWED and NOT NEEDED; merge, test
and UAT are the agent's, per ticket" (2026-08-15), grant 3, is the authority. **It is carried, not
re-derived, and its own recorded bound is carried with it:**

- **An agent-run UAT is the execution of the business scenarios and the reporting of the result** —
  scenarios, test data, pass/fail criteria, and an actual run against an actual build.
- **It is NOT a named human's acceptance signature.** `context.human_admission` is `off`; no
  `finding` is admissible on this install; the result is recorded as `decision` / `observation` and
  **cannot be stamped**. No agent on this hop signs off, and Workflow 06's stop condition — *never
  self-sign or fake a pass* — binds every subtask.

**28 `Done` tickets each read *UAT deferred → `EPIC-006`, explicitly NOT passed*.** That reason
expired when `ABC-042` merged and `npm run chess` printed a board. **This hop discharges the
deferral for `ABC-042` ONLY.** The other 27 are not folded in — they are a separate decision with
separate scope, and are named here so the omission is deliberate rather than forgotten.

## The board row does NOT move, and why

**`ABC-042` sits in `Done`, merged to `main` @ `dbaf972`. It stays there for the duration of this
hop.** Workflow 06's board move is `Ready for UAT → In UAT`; **that move's precondition does not
hold**, so it is inapplicable here, not skipped.

- **The deliverable is merged and unchanged.** Nothing is being re-worked. Moving `Done → In UAT`
  would post a backward move against a ticket that is not in rework, inflating the very signal
  `AGENTS.md` § Process rules control 1 reads as rework (*"backward moves below 0.5 per ticket"*).
- **Either outcome returns it to `Done` anyway.** A pass leaves it merged; a fail cannot un-merge it
  and produces defect tickets of their own. The round trip would carry no information.
- **The kit is silent on a post-`Done` UAT** — Workflow 06 assumes acceptance precedes `Done`. The
  kit is read-only and cannot carry a project override, so the reading is recorded here.

**The Orchestrator owns the `Done` row and therefore owns this call.** The UAT Planner is instructed
NOT to move any board row. Board header, the `ABC-042` row's UAT cell, `plans/traceability.md` and
`plans/metrics.md` (Lead time) are updated by the Orchestrator at close, after all three subtasks'
notes land — single writer, no concurrent edits to those files.

## Routing (decompose → enqueue → schedule)

Workflow 06 names three roles. Three subtasks, enqueued as thin `pending/` files carrying only a
`ref:`; **no data is relayed agent-to-agent — the shared context is the only channel.**

| subtask | role | phase |
|---|---|---|
| `uat-ABC-042-pack` | UAT Planner | 1 — alone; the pack must exist before it can be validated |
| `uat-ABC-042-bapm` | BA/PM | 2 — parallel |
| `uat-ABC-042-qe` | QE/E2E | 2 — parallel |

**Width 2 at its widest, inside `queue.wip_limit` 3.** Phase 2's two agents work in private
`git worktree`s over disjoint file sets (each writes only its own `notes/` folder), the pattern this
repo already uses, so the shared worktree's `HEAD` is never moved under a running agent.

## Inputs judged present (Workflow 06)

- **Acceptance criteria** — `A1`–`A12`, Given/When/Then, repaired three times (`RF-1`…`RF-10`, then
  `E1`/`Q4`/`G2`/`G5`/`G7`/`G8`). Not missing, not ambiguous: Workflow 06's stop condition does not
  fire.
- **Known limitations, pre-written by BA/PM** — the ticket's § *"What this ticket does NOT make
  runnable"* and § *"Out of scope"*. **It prints a board; it does not play a game.** The pack carries
  this forward verbatim in business language; a UAT that lets a reader conclude "the chess game
  works" has failed regardless of its scenario results.
- **The gated build** — gates green on the branch tip before the merge and on `main` after
  (lint 0, typecheck 0, build 0, 856/856 on 30 files, skip 0, integrity clean).

## Stop conditions carried into every subtask

1. **No self-signoff.** No agent records a human acceptance signature. No `finding` kind; no stamp.
2. **A scenario that cannot be run is recorded as not run** — never as a pass, never quietly dropped.
3. **A failed scenario stops the hop and returns here.** No subtask cuts a defect ticket or edits
   `ABC-042`'s page on its own; the Orchestrator routes it.
4. **No board row, no trace row, no metrics row is written by a subtask.**
