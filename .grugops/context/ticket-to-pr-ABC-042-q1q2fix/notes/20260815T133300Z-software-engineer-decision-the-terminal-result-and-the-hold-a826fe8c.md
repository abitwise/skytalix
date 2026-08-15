---
id: 20260815T133300Z-software-engineer-decision-the-terminal-result-and-the-hold-a826fe8c
kind: decision
by: software-engineer
at: 2026-08-15T13:33:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - E1
  - G1
  - Q1
  - Q2
  - N8-LANE
supersedes: 
---

# The terminal result — and why it is NOT a recommendation to merge

## The result

> ## `READY_FOR_HUMAN_REVIEW`
>
> **for this subtask's gate.** Every mandatory gate is green on the branch tip, the two blocking
> items I was sent to close are closed and watched closing, and `self_fix_attempts` (2) was not
> consumed because nothing failed.

Workflow 05 step 5: *"All checks pass → `READY_FOR_HUMAN_REVIEW`."* lint PASS, typecheck PASS, build
PASS, unit 856/856 on 30 files, skip **0**, test-integrity `No findings.` exit **0**, deep perft
32/32. No check failed at any point.

**No `§14-gate#<id>` verdict note accompanies this result, and that is not an omission.** Workflow 05
emits one via `emitVerdict` in `scripts/context-io.ts`; that script is absent from this repository and
from the kit, and `context.human_admission` is `off`. **No stamp is emittable on this install and I
did not invent one.** Every note from this hop is `observation` / `decision` / `artifact-ref`. There
is no `kind: finding` in the set.

## And separately: the ticket should NOT merge on this hop's green

These are two different questions and the last hop's notes show what happens when they blur.

1. **`G1` / `N8-LANE` is breached at 2.00x and is with the project owner.** Independent of my work,
   and the Orchestrator holds it. Nothing here touches it; my own lane delta is **0 ms**.
2. **`E1` is new, and it is `Q1`'s class again.** `token.endsWith(COLOUR)` ships the whole suite
   green and makes `node src/cli.ts "x--colour" black` print a **23-row board and exit 0** — on the
   **armed** instrument. The ASVS `V2.2.1 [L1]` surface that was this ticket's original HIGH is
   therefore still defeatable, one mutant class over from where QE found it.

**I am applying the same rule to `E1` that this ticket already accepted for `Q1`.** When QE ruled
that a defeatable instrument on an L1 criterion is a block rather than a gap-with-an-owner, the
Orchestrator took that block. `E1` is the same criterion, the same ASVS clause and the same
demonstrated behaviour. **It would be self-serving to grade it lower merely because it is BA/PM's to
fix and not mine** — that is precisely the reasoning that lets a hole travel between roles, and this
ticket has watched it travel twice already.

**So: my subtask is complete and green; the ticket is not ready to ship.** The distinction matters
because the owner's standing merge authority is real and the gate on my tip is genuinely green — a
reader who saw only the green could reasonably merge. `E1` is the reason not to, and `G1` is the
reason it cannot anyway.

## The reading I did not take, stated so it can be overruled on its merits

**A defensible alternative is to record `E1` as a `HIGH` gap with an owner and let the ticket proceed
on the Orchestrator's judgement.** The argument: `security.block_on` is `high` and the *criterion* is
MET on the delivered build — `A6` genuinely rejects every unrecognised argument today, and `E1` is
about what a **future** edit could do undetected, not about a live defect. On that reading every one
of my numbers stands and only the recommendation changes.

**I did not take it** because the same argument was available for `Q1` and was rejected, and a rule
that applies to the gap another role found but not to the one I found is not a rule. **But the
difference between the two readings is a judgement about blocking policy, not about any fact in these
notes, and it is the Orchestrator's or a human's to make. Nothing needs re-measuring if it goes the
other way.**

## Not `SPLIT_REQUIRED`

Nothing about size is in question: **one file, +24 lines, −0**, no new tests, no new spawns, zero
production bytes.

## Stop conditions honoured

- **A production change was never needed and never made.** `src/cli.ts` and `src/cli-options.ts` are
  byte-identical by md5 **and** git blob SHA. The build was correct and remains untouched.
- **No criterion was edited**, and where closing a gap *would* have required editing one (`E1`) **I
  stopped and reported it** rather than absorbing the decision.
- **No armed row needed a spawn to red its mutant.** Every one of the seven kills is a textual or
  in-process assertion; the spawn count is unchanged at ten and is now pinned at its source.
- **Not merged, not pushed, not deployed. `main` was never checked out and never merged into this
  branch** — it is not an ancestor of my base and it still is not.
