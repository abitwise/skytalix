---
task: ticket-to-pr-ABC-025
subtask: ticket-to-pr-ABC-025-bapm2
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/ticket-to-pr-ABC-025/
enqueued_by: orchestrator
enqueued_at: 2026-08-10T17:05:33Z
branch: grugops/ticket-to-pr-ABC-025
---

# Subtask: rule on `N5` — you own the bar, and four instruments now say it is both breached and unmeasurable

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
You wrote `N5` at the cutting hop. Since then the Engineer, the Orchestrator, QE and Security/NFR have
each measured it independently. Read all four before you rule — especially Security/NFR's **null
control by identity**, which is the measurement that changes the question.

Claim per `agent-factory/workflows/17-task-claim.md` first.

## Why this is yours and not the gate's

Security/NFR delivered the number and the verdict and then stopped, correctly: *a gate does not move a
target*. This board applied that rule to `ABC-013`'s `N4` earlier today and it is not being bent here.
`N5`'s statistic, sample size, numerator, denominator and the `5%` itself are the bar author's — and
that is you.

I am not pre-deciding it. Both of the obvious outcomes are legitimate and I will record either.

## The decision, stated as the smallest thing that closes it

One of:

1. **Re-derive `N5`** with the degrees of freedom named — the statistic, the sample size, the isolation
   clause (Security/NFR measured 253 ms isolated against 647 ms in-lane, a factor of 2.6), and a
   threshold that a null control by identity cannot trip. Then say whether the delivered tree meets it.
2. **Accept the breach** as an owned risk with a named owner and a trigger, and say what the ticket's
   NFR cell should read instead.
3. **Require a change.** If you take this one, note that Security/NFR built the narrowed variant and
   measured it at **+5.3% wall / +7.4% CPU — still over the bar** — so narrowing `A1` costs coverage
   and does not even buy compliance. If you want a change, it has to be a different change.

**Do not weaken `A1` to make a number fit.** That trade is the failure this whole ticket exists to
prevent, and if it is ever right it is a human's call, not a role's.

## Also yours to answer, briefly

Security/NFR raised risks with your name on them and one dispute you should settle:

- **Risk #7** — the ticket's security trigger clause 2, read literally, fires on every ticket this
  board has ever run. Same species of defect as `N5`: an unnamed denominator.
- **Risk #9** — there is no cumulative budget on the default lane, only per-ticket ratios, and this
  ticket's 20 tests are now the second most expensive file in the repository. A per-ticket ratio
  cannot see an accumulating total. This is the one with the longest reach.
- **Risk #6 re-assignment** — Security/NFR moved it from itself to you at the `EPIC-003` cut, on the
  grounds that a warning owned by a gate that runs after the work arrives too late. Confirm or dispute.

## Scope limit — this hop is a ruling, not a rewrite

The delivered rows are green and all six acceptance criteria pass. **Do not re-open `A1`–`A6`, the
delivered files, `ABC-013`, `ADR-0004`, or `EPIC-003`'s `parseSan` contract.** Do not edit
`plans/nfr-catalog.md`. If your ruling needs a follow-up ticket, cut it or name it — do not grow this
one.

## Publish

Typed notes into `ref:notes/` per Workflow 16, honest kinds only. Update the ticket's `## Security /
NFR triggers` section and `plans/traceability.md`'s NFR cell to match your ruling. The ticket sits in
`Ready for UAT` and this hop does not move it — leave the column to me.

Commit on this branch per `agent-factory/_commit-convention.md`. Never commit on `main`. Never merge.
