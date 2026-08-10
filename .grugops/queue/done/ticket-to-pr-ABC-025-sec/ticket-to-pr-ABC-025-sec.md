---
task: ticket-to-pr-ABC-025
subtask: ticket-to-pr-ABC-025-sec
role: security-nfr
workflow: agent-factory/workflows/15-security-audit.md
ref: .grugops/context/ticket-to-pr-ABC-025/
enqueued_by: orchestrator
enqueued_at: 2026-08-10T16:40:12Z
branch: grugops/ticket-to-pr-ABC-025
---

# Subtask: Security/NFR gate on `ABC-025` — and rule on `N5`, which is breached and has now been measured by three roles

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Ten-plus notes from four roles are there. Read the `N5` thread in particular: BA/PM set the bar at the
cut, the Engineer measured a breach against himself rather than narrowing the criterion that caused
it, I reproduced it on my own instrument, and QE reproduced it a third time with different numbers
again.

Claim per `agent-factory/workflows/17-task-claim.md` first. `scripts/claim.js` does not exist here —
verify at the source, then claim by hand with an atomic `mkdir`.

## The NFR half — this is the substance of the hop

**`N5` (the tests this ticket adds cost ≤5% of the default `npm test` wall clock) is NOT MET.** Three
independent measurements, three different numbers, none inside the bar:

- the Engineer: +12.5% wall / +19.3% file time
- me: +10.3% wall (median of 3 with, 3 without)
- QE: +6.7% wall median, +8.8% wall min, ~18% file time

**Re-measure it yourself on your own instrument and protocol.** Do not inherit any of the three.

Then rule, and the ruling has two separable parts that must not be blurred:

1. **Is the bar met?** A number, on your instrument, with your method stated.
2. **Is the bar measurable as written?** QE reports that the within-condition spread of the *unchanged*
   lane is ~330 ms against a bar worth ~85 ms — i.e. the noise may exceed the budget, and `N5` names a
   ratio with no statistic and no sample size. If that holds, a "breach" and a "pass" are both
   unsupportable at this precision, which is a different and more serious finding than a simple miss.

**You do not move the bar.** `N5`'s owner is BA/PM, and this board's standing rule — applied to
`ABC-013`'s `N4` earlier today — is that a gate does not move a target. Report the number, say plainly
whether it is met, and name who decides. If your reading is that the criterion causing the cost should
be narrowed, say so as a recommendation with its coverage cost measured — the Engineer measured that
dropping `A1`'s unassisted half changes **no** mutant verdict across 13, and QE reports that this is
weaker evidence than it looks because none of those 13 can distinguish the call forms by construction.
That disagreement is on the record and unresolved; you are the third instrument on it.

`N6` (deep lane 32/32, skip 0) is carried by `A6` and was green at the QE hop.

## The security half — measured, not pre-waived

The ticket's own trigger: the security half fires at **+900 lines** or **any file that is not a
`*.test.ts` under `src/`**. Measured by me just now: **823 added / 0 deleted, two files, both
`*.test.ts`, no production line**.

That is under the threshold — **and it is within 9% of it**, on a ticket that predicted ~+550. On
`ABC-023` the "none, structural" line was written against an expected 17-row diff that delivered +749
and had to be over-ruled. **Decide whether the half fires with that in view; do not treat 823 < 900 as
a comfortable pass, and do not treat proximity as a trigger either.** Either way, say which you did and
why.

## Also in scope

- `A6` on your own instrument: `src/san.ts` md5 `cbcc3be37c21414d16e8e6b4d0c68959`, additions only,
  no pre-existing `src/` file touched, no existing test row modified.
- The six risks QE raised, each with an owner and trigger — confirm, dispute, or add.

## Explicit non-instructions

- No file-count, row-count or line-count bar on this hop.
- Do not re-open `ABC-013`, `ADR-0004`, `EPIC-003`'s `parseSan` contract, or `ABC-013`'s `N1`–`N4`.
- Do not edit `plans/nfr-catalog.md`. A gate does not move a target.

## Publish

Typed notes into `ref:notes/` per Workflow 16, honest kinds only. Verdict PASS / PASS_WITH_RISKS /
FAIL with every risk carrying a named owner and a trigger. Update `plans/traceability.md`'s `ABC-025`
NFR cell. The `In Security/NFR` exit is yours; archive the outgoing board `_Updated:` header verbatim
to `plans/tickets/history/ABC-025-board-history.md` before replacing it.

Commit on this branch per `agent-factory/_commit-convention.md`. Never commit on `main`. Never merge.
Never deploy — `production_requires_human_confirmation` is `true` and a human holds deploy.
