---
task: ticket-to-pr-ABC-025
subtask: ticket-to-pr-ABC-025-dev2
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-025/
enqueued_by: orchestrator
enqueued_at: 2026-08-10T17:52:08Z
branch: grugops/ticket-to-pr-ABC-025
---

# Subtask: make `N5` met without weakening the net — or prove that it cannot be done and stop

You built this ticket's rows. The owner has now asked for `N5` fixed before the project moves on.

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Fifteen-plus notes from four roles are there. The two that matter most for this hop are BA/PM's `N5`
ruling (the re-derived bar, its protocol, and the **floor** nobody had measured) and my decision note
opening this hop (the candidate, and the coverage question that can kill it).

Claim per `agent-factory/workflows/17-task-claim.md` first.

## The goal, as a verifiable outcome rather than a procedure

**`N5` MET on the re-derived bar, with the delivered corpus intact.** That is the whole job. How you
get there is yours.

There is a named candidate in my note — `A1`'s second call form, already owned by `A5` — with an
inferred net cost of ~1.6% that has **never been measured against the bar that now exists**. It is a
lead I formed from two roles' numbers taken on two different occasions. **It is not an instruction and
it is not a conclusion.** If a better change exists, take it. If the lead does not survive
measurement, say so.

## The one thing that would make the candidate wrong, and you must actively try to prove it

Dropping `A1`'s unassisted half would lose the unassisted call form over the **184 derived positions**.
The build that makes this a coverage cut rather than a performance fix is one whose two call forms
**diverge only on derived positions** — never on `A5`'s 23, never on `ABC-013`'s 18.

**Try to build that mutant.** Not "check whether existing mutants still die" — that is the argument QE
refuted and Security/NFR upheld against you, and it is the argument BA/PM refused for their own bar
rather than accept a standard they had rejected for someone else. **If that build exists, the candidate
is refused, and you say so.**

`toSan`'s two call forms differ in exactly one respect: whether the legal list is supplied or
regenerated. Think about what could make a regenerated list differ from a supplied one — ordering,
identity, staleness, mutation of the position between calls — and whether any of it is reachable on a
derived position but not on a hand-built one.

## Measurement — under the re-derived protocol, or it does not count

The bar is `≤5%` of the default lane's **CPU (user+sys)**, **net of the fixed floor for the same number
of added test files**, median of paired per-round deltas, n ≥ 7 interleaved rounds, round 0 discarded,
order rotated, fresh process per run, every run asserting its own test count, runner invoked directly
so no package-manager startup sits in the denominator, denominator = the lane with this ticket's files
removed.

**Admissible only if a null control by identity reads ≤1% and the fixed floor is measured and
subtracted, both reported.** BA/PM's note carries the full wording — follow it, do not reconstruct it
from mine.

## Hard limits on this hop

- **`src/san.ts` stays at `cbcc3be37c21414d16e8e6b4d0c68959`. Zero production lines.** `A6` is
  unchanged and still binds.
- **Do not narrow the corpus.** BA/PM refused the 23-position variant and that refusal is not reopened.
- **Do not move the bar.** It was re-derived once, by its owner. A gate does not move a target and
  neither does an engineer.
- **Do not delete or weaken `A5`** — it is what makes the candidate defensible in the first place.
- If any acceptance criterion's text needs to change to match what you build, **stop and say so**. The
  criteria are BA/PM's; you do not edit them, and neither do I.

## The legitimate failure outcome

**"The only compliant change costs coverage"** is a real, publishable result. If you reach it, report
it with the measurement behind it and stop. I take it back to the owner. Do not force a number.

## Publish

Typed notes into `ref:notes/` per Workflow 16, honest kinds only. Update `plans/traceability.md`'s
`ABC-025` cells. Leave the board column to me. Mark the subtask done per Workflow 17.

Commit on this branch per `agent-factory/_commit-convention.md`. Never commit on `main`. Never merge.
Never deploy.
