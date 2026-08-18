---
task: refine-abc043-a3-name-2026-08-19
subtask: refine-abc043-a3-name
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ticket: plans/tickets/ABC-043-the-live-session.md
ref: .grugops/context/refine-abc043-a3-name-2026-08-19/
parent_ref: .grugops/context/design-rig-licence-2026-08-19/
enqueued_by: orchestrator
enqueued_at: 2026-08-19T23:58:00Z
branch: grugops/refine-abc043-a3-name
base: main @ HEAD
---

# Subtask: ONE bounded question — does your name-refusal of `./line-input.ts` extend to `A3`?

**This is deliberately the smallest brief of the session. One question. Do not expand it.**

Read `parent_ref:` (`ADR-0015` and Architect/Design's four notes) and the one note in `ref:` (my own
record of a merge consequence I caused) first.

## The question

You refused three modules by name — `./line-input.ts`, `./frame.ts`, `./command-input.ts` — when you
licensed the `registerHooks` rig for `A2`/`A5`. **`ADR-0015` has now ruled the fence is the SEAM, not
the list**, and two of your three names fall out of that rule mechanically (`./frame.ts` and
`./command-input.ts` are reached only by static import; neither is named in `src/cli.ts`).

**`./line-input.ts` does not.** Architect/Design measured it — and **I verified it myself** — as a
**seam supplier**: `input: createLineInputSeam({...})` sits at `src/cli.ts:155`, directly beside
`engine: createEngine({...})` at `:156`. **By the new fence's own test it is exactly as substitutable
as `./engine.ts`.**

So your name-refusal of it is the one that rested on **your judgement, not on structure** — and
`ADR-0015` deliberately did **not** lift it, because lifting a name to unblock a ticket is precisely
what two roles have already, correctly, declined to do.

**Your refusal was reasoned criterion-relative** — *"would test the harness instead of the product"* —
and it was written for `A2`/`A5`, **where the reader is load-bearing**. **`A3`'s subject is the entry
point's top-level handler; the reader is merely its instrument.** Does the refusal extend, or not?

## Three branches, all already dispositioned — you are choosing, not designing

1. **Name lifted for `A3`** → `A3` is rebuilt on a `line-input` double returning an `InputSeam` that
   throws. Passes `ADR-0015`'s (S) and (C), costs **one spawn** (`N8-SPAWN` pin of 17 unmoved), and
   matches `A3`'s own Given — *"an `InputSeam` that throws"* — **more literally than the rig that
   shipped**. `G-01` closes.
2. **Name extends to `A3`** → you re-scope `A3`, or move it to an opt-in lane.
3. **No answer** → the default is already set: **`A3` left unbuilt and recorded as a named uncovered
   anti-property**, the shape `G-06` already has.

**Under all three, the `parserBug` child comes out of `src/cli.test.ts`.** That removal is the
engineer's, not yours.

## The context you need and must not be surprised by

**`ABC-043`'s code is already on `main`** — the ruling branch sat on top of the QE branch which sat on
the delivery, so merging the ruling merged the delivery. **That was my error and it is recorded in
`ref:` in my own words.** It does not change your answer: the rig is a **test**, there is no product
defect, `ABC-043` is still `In Review` and still not accepted, and the repair is queued behind you.

**Do not let "it is already merged" push you toward branch 1.** If the honest answer is that your
refusal extends, say so — the engineer will take the rig out and `A3` will be re-scoped or left
unbuilt, and that is a legitimate outcome.

## Fences

- **Answer the one question. Cut no ticket. Re-score nothing else.** If you find something adjacent,
  name it in a note and I will route it.
- **Do not touch `ADR-0015`, `ADR-0011`, `ADR-0013` or `plans/nfr-catalog.md`.**
- **Do not write the test.** Branch 1 names the shape; the implementation is the engineer's.
- Nothing under `src/`. Do not move a board column, do not merge, do not deploy.
- If you lift the name, **say what the new limit is** so `ABC-044`/`ABC-045` inherit a rule rather
  than this ticket's outcome.

## Gate

No `src/` change. Contained lane; record unchanged: **1189 tests / 39 files, skip 0**. An isolated
agent worktree has no `.claude/worktrees/`; the repo root is contaminated and that has cost me three
bad measurements.

## Publish

Typed notes per Workflow 16 into `ref:`. No `finding` is admissible on this install. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/refine-abc043-a3-name`.

Commit on `grugops/refine-abc043-a3-name`, never on `main`.
