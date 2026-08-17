---
id: 20260817T090000Z-orchestrator-decision-owner-waives-uat-for-abc068-3f0d55b7
kind: decision
by: orchestrator
at: 2026-08-17T09:00:00Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-068-shared-test-helpers-have-no-written-contracts.md
  - AGENTS.md
  - memory-bank/60-progress.md
supersedes: 
---

# The owner waived UAT for `ABC-068`. That is a WAIVER, NOT A SIGNATURE — and still not a standing rule

## What was asked and what was answered

He was asked the question the previous hop's board header instructed be asked: the `ABC-067` /
`ABC-071` waiver was recorded as *"a waiver, not a signature, and not a standing rule"*, deliberately
NOT filed under `memory-bank/60-progress.md` § Standing directives, and it said **the next
zero-production-line ticket asks him again**. `ABC-068` is that ticket. He was told the work was
built, green, and unmerged, that `A1`–`A7` were all MET on numbers I verified myself, and that the
only thing outstanding was this question.

**Project owner Olger Oeselg, 2026-08-17, in session, verbatim: *"yes, waive UAT for ABC-068"*.**

## What it is

**A waiver of the step.** The `In UAT` column is skipped for this ticket. No business scenario was
executed against a build, because a comments-only change has nothing user-facing to exercise — that
is the same ground the previous waiver stood on.

## What it is NOT — and each of these is a misreading somebody will attempt

- **It is NOT an acceptance signature.** Nobody signed anything. `agent-factory/workflows/06-uat-pack.md`
  makes the `In UAT` → `Ready to Release` exit a named human's signoff; **that exit was not taken,
  it was skipped.** Do not later read "the owner waived UAT" as "the owner accepted the work".
- **It is NOT a `finding` and carries no stamp.** `context.human_admission` is still `off`, no
  `mcp__grugops__propose_note` exists on this install, and the owner did not flip the flag. This note
  is **an agent's transcription of his words into git** — that is the honest fidelity level, and it is
  recorded here rather than implied.
- **It is NOT a standing rule, and it is deliberately NOT being filed as one.** He waived one ticket
  when asked about one ticket. It goes in this task's notes, exactly like the last one, and NOT into
  `memory-bank/60-progress.md` § Standing directives. **The next zero-production-line ticket ASKS HIM
  AGAIN.**

## The pattern, reported rather than converted into a rule

**This is the SECOND consecutive waiver on identical grounds** (`ABC-067`/`ABC-071`, then `ABC-068`).
Two identical answers is the exact point at which a hop is tempted to save the owner the question and
declare a convention — which is how the previous header's instruction would quietly die.

**I am not doing that, and the reason is on the record: he has been asked twice and has never been
asked whether he wants a rule.** Those are different questions. If a standing waiver for
zero-production-line tickets is wanted, it is his to state and BA/PM's or the Scribe's to file under
§ Standing directives — never an inference drawn from a count of prior yeses. **Reporting the pattern
is honest; acting on it would be manufacturing consent.**

## What follows

`ABC-068` is cleared to merge on the gate that was already green and re-run by me. The merge itself
rests on the owner's standing per-ticket merge authority (`AGENTS.md` § Branching model,
`memory-bank/60-progress.md`), which is a **separate** grant and is not touched by this waiver. The
gate still binds: `quality.gate_enforcement` is `blocking`, and it is re-run on `main` after the
merge, not assumed.
