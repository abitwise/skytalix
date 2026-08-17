---
id: 20260817T141500Z-orchestrator-decision-owner-waives-uat-for-abc062-fourth-on-identical-grounds-3f8a20c1
kind: decision
by: orchestrator
at: 2026-08-17T14:15:00Z
verified_by:
confidence: high
refs:
  - plans/tickets/ABC-062-refusal-usage-line-and-two-uncovered-argvs.md
  - plans/board.md
  - AGENTS.md
supersedes:
---

# The owner waived UAT for `ABC-062`. A WAIVER, NOT A SIGNATURE — and the fourth on identical grounds

## His words, verbatim and complete

> skip UAT for ABC-062

That is the whole instruction. **It is quoted here in full so no later reader has to trust a
paraphrase**, and so nobody can find a wider grant in it than the five words contain.

## What it IS

Authority to move `ABC-062` from `Ready for UAT` to `Done` **without conducting UAT**. The owner is
the named human the kit's `In UAT` exit requires (`agent-factory/workflows/06-uat-pack.md`,
`agent-factory/roles/uat-planner.md`), and on 2026-08-16 he ruled that his word in session is this
project's `In UAT` exit signature. He is entitled to waive the step he is entitled to sign.

## What it is NOT, and this is the part that gets misread

**It is NOT an acceptance signature.** Nobody executed a business scenario against a build, and
nobody signed anything. `context.human_admission` is `off`, no `finding` is admissible on this
install, and no `human:<name>` stamp exists. This note is an **agent's transcription** of five words
typed in a session — that is the honest fidelity level and it must not be written up as more.

**It is NOT a standing rule.** It names one ticket. The board's `Done` row for `ABC-062` must never
be read as "UAT passed".

**It is NOT retroactive cover for anything else.** Unlike `ABC-061`, this instruction has no second
clause and no blanket sentence to bound. It names one ticket and reaches exactly that far. **No
measurement was needed to fence it, because there is nothing to fence.**

## The standing-rule question: ASKED A FOURTH TIME, ANSWERED ZERO TIMES

`ABC-061`'s close recorded three consecutive waivers on identical grounds — zero production lines,
test-only change — and recorded that the standing-rule question had been **asked directly and not
answered**. I asked it again at this ticket's `Ready for UAT` hold, in writing:

> Should zero-production-line tickets skip UAT as a rule?

**He answered the ticket and not the rule.** That is now **four waivers, four unanswered askings.**

**This is STILL not filed as a standing rule, and the reason is unchanged: an unanswered question is
the weakest possible ground for a permanent change to how this factory gates work.** Answering the
instance while declining the rule is a legitimate thing for an owner to do — it may be deliberate,
and he is entitled to keep the decision per-ticket. **What it is NOT is consent to the rule.**

**A caution for whoever holds the next one.** Four identical waivers is exactly the pattern that
starts to feel like a rule that "obviously" exists. It does not exist. The next zero-production-line
ticket asks him again, individually, and stops at `Ready for UAT` until he answers. **Do not
short-circuit it because the answer feels predictable — a predicted answer is not an answer.**

## What was actually delivered, since `Done` will imply it was verified

Verification here is the **gate**, not UAT, and the gate was real: 864/864 on 30 files, skip 0,
`No findings.`, lint/typecheck/build exit 0, run on the branch tip before the merge and on `main`
after. The `A1` witness was reproduced by me in three conditions, including the unmutated control
that shows the new guard raises no false positive. Detail in the sibling `observation` note.

## Close

`ABC-062` → `Done`. **The `UAT` column in `plans/traceability.md` stays `—`**, deliberately: there is
no UAT result to record, and an empty cell is the truthful entry. Writing anything else there would
manufacture evidence of a step that did not happen.
