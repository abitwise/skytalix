---
task: ticket-to-pr-ABC-023
subtask: ticket-to-pr-ABC-023-bapm2
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/ticket-to-pr-ABC-023/
enqueued_by: orchestrator
enqueued_at: 2026-08-10T08:24:08Z
branch: grugops/ticket-to-pr-ABC-023
---

# Subtask: cut `ABC-024` for QE's two measured leftovers, so they stop living only in a context note

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here** —
QE's notes carry the two survivors, the exact mutants, the lanes they die in, and the counts. Re-derive
what you rely on; QE's harness was independent but it is still one instrument.

`ABC-023` is in `In Security/NFR` and a parallel Security/NFR subtask owns its gate. **You take NO
board move on `ABC-023`** — your move is a new row in `Backlog`.

## What happened, and why it is a ticket rather than a note

QE ran 67 mutants across three tree states, found 14 that passed **every** criterion and the **whole**
suite, and closed all 14 with 44 added rows and **no criterion amended**. That is the hop working.

It also measured **two survivors it correctly did NOT fix**: the castling **right** test and `BQ`'s
`empty` corridor each survive the default `npm test` at 625/625 and die **only** in the
`PERFT_DEEP=1` lane (31/32). Both sit inside `ABC-009`'s dimensions, and `ABC-023`'s `## Out of scope`
forbids reopening `ABC-009` — so QE reported them and stopped, which is right.

**This is exactly how `ABC-023` itself was born.** It was cut from `ABC-009` *"so that three measured
items stop living only in context notes."* Apply that precedent to this ticket's own output. The
alternative is that a measured hole is rediscovered in six months from a failing criterion, which is
the loop this board keeps paying to escape.

## The question the new ticket must actually answer

Not "add two rows". The interesting property is the one QE surfaced: **a guard that survives the
default lane and dies only in the deep lane is protected by a lane nobody runs by default.**
`PERFT_DEEP=1` is opt-in (`AGENTS.md` records it as the slow suite). So the real question is whether
these two guards are owed **default-lane** rows, and that is a judgement about where this project
wants its net — which is yours, not QE's and not the Orchestrator's.

Answer it in the ticket rather than assuming it. **If the honest answer is "the deep lane is
sufficient protection for these two", write that and cut a smaller ticket, or none at all with the
reason recorded.** A ticket cut reflexively is as bad as a finding lost.

## Boundaries

- **Do not touch `src/`.** `src/moves.ts` must still hash `6335b452fc21ffe2d0f902ecab930840` and
  `A4` forbids modifying any existing test row. Write no test row and no production line. Measure on
  a copy outside the repository, one OS process per tree state, restore and re-hash after each mutant.
- **Do not edit `ABC-023`.** Its criteria are green and a gate is running against them right now.
  Editing acceptance under a live gate is how a verdict becomes meaningless.
- **Do not reopen `ABC-009`.** If your measurement suggests one of its verdicts was wrong, **say so
  and stop** — that is a defect ticket of its own, not an edit.
- **`Backlog` only.** Do not promote the new ticket to `Ready`; nothing is blocked on it and it should
  compete for `Ready` at a refinement pass, exactly as `ABC-023` was made to.
- **`plans/board.md` is being edited in parallel** by the Security/NFR subtask. **Re-read the file
  immediately before you write it**, and if you replace the `_Updated:` header, archive the outgoing
  line verbatim to the right ticket's `history/` file first. If you can add your `Backlog` row without
  touching the header, prefer that — it removes the conflict entirely.

## The standard the new ticket is held to

`ABC-023` is the template and it is a high bar: every figure measured by the role that wrote it, each
criterion naming **the mutant that must die**, each parenthetical naming **the suite size it was
measured against** (the omission of that suite size is what let `ABC-023` go stale between `ABC-022`'s
merge and this morning), a size with the condition that would grow it named, and a priority with a
stated and explicitly-unfired escalation trigger. Assess it against
`agent-factory/checklists/definition-of-ready.md` and record the result honestly — including any ⚠️.

Next free id is **`ABC-024`** — verify that at the source (`plans/tickets/`, `plans/board.md`) rather
than trusting this line.

Publish typed notes per Workflow 16 in the exact shape of `agent-factory/contracts/context-note.md`.
**`finding` is NOT admissible on this task** — no §14 gate exists here and `context.human_admission`
is `off`. Record results as `observation` / `decision` / `claim`. Nothing self-stamped.

Claim by hand: **`scripts/claim.js` does not exist in this install.** The claim is the atomic `mkdir`
of `.grugops/queue/claimed/<subtask>/` with a `claim.md` inside it, then `mv` the subtask file in, and
`mv` the whole directory to `done/` when finished.

Take your own `at` from `date -u`; **this machine is UTC+3**. Update `plans/traceability.md` for the
new ticket. Commit on the branch named in the frontmatter; **never commit directly on `main`**. Never
merge, never deploy.
