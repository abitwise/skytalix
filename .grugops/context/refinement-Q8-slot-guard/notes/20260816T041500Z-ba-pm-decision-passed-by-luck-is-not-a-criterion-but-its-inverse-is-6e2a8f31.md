---
id: 20260816T041500Z-ba-pm-decision-passed-by-luck-is-not-a-criterion-but-its-inverse-is-6e2a8f31
kind: decision
by: ba-pm
at: 2026-08-16T04:15:00Z
verified_by: 
confidence: high
refs:
  - ABC-067
  - ABC-065
  - Q8
  - src/cli.test.ts
supersedes: 
---

# Ruling asked for by name: can *"it passed by luck"* be a criterion, or is it only narrative?

**Ruling: "it passed by luck" is NARRATIVE and must not be written as a criterion. Its inverse is a
criterion, it is testable, and `ABC-067` asserts the inverse in three places.**

## Why the sentence itself cannot be asserted

"The suite stayed green by luck" is a statement about **the current prose of `AGENTS.md`** — that no
`--`-prefixed token happens to sit in the 7 lines below the slot. Three things follow, and each one
is fatal on its own:

1. **It is not about the artifact under change.** `ABC-067` changes `src/cli.test.ts`. A criterion
   that can be falsified by someone adding an honest bullet to `### Development` is not scoring this
   ticket's work.
2. **Any test of it pins prose.** To assert "nothing below the slot carries a `--` token" you must
   read and constrain the text below the slot — which is `ABC-065`'s own test note 3 ("do not assert
   the example's prose") and `Q9`'s convention-coupling, committed twice over.
3. **It has no failing state a build can reach.** Luck is a property of a coincidence that already
   held. There is no input on which "was it lucky?" returns false today, so the criterion would be
   vacuous the moment it was written — the exact defect class `ABC-065` exists to catch, one level up.

## What IS assertable, and what I wrote instead

The honest content of "by luck" is: **the scored region is decided by text the guard does not know it
is reading.** That inverts into a bounded-window property, which is about the code, has a failing
input today, and cannot decay with prose. Three measurable forms, all in the ticket:

| ticket criterion | the observable | measured today |
|---|---|---|
| **`A1`** — the one-closer mutant must FAIL | fail vs pass | **passes, 32/32 GREEN** — a real failing input exists, so the criterion is not vacuous |
| **`A2`** — the captured slot contains no further top-level `"\n- "` bullet | an integer | **0** unmutated, **4** mutated — the invariant already holds and is simply unasserted |
| **`A4`** — under the two-closer mutant the recorded failure reason is the unterminated slot, **not** `--coverage` | which row fires, and on what message | today it fires on `--coverage` — reproducible, second-order |

`A2` is the one I want on the record as the substitution for "luck". **It replaces a claim about
what happens to be below the slot with a claim about what the slot is** — and it is scored on the
captured region, not on the file, so an engineer may bound the window by any technique (require the
`-->` before the next `"\n- "`, or match the comment's own `<!--`…`-->` pair) and still be scored on
the same observable. **I deliberately did not specify the technique**: that is the engineer's, and
writing it into acceptance would be BA/PM designing the fix.

## The reachability claim specifically — CAN a test pin it? **Yes, and I made it a criterion.**

My subtask flagged QE's *"had the window reached `npx vitest run --coverage`, the guard would have
redded on `--coverage`"* as a **reachability** claim and asked whether a test can pin it. **It can.**
I reproduced it in memory: removing the slot's closer **and** the next one extends the window to 25
lines and the collector picks up `--coverage`, redding `A3`'s set equality (figures in this task's
observation note). That is a deterministic input, not a hypothetical — so it is `ABC-067`'s `A4`.

**And it earns its place rather than decorating the ticket.** Without `A4` an engineer can satisfy
`A1` and still leave the block in a state where the *first* symptom a future hop sees is a confusing
red about a coverage flag. `A4` requires the failure to name its own cause. **This is the difference
between fixing the defect and fixing the test that noticed it.**

## What I did NOT rule, and who owns it

- **I did not rule on the technique of the bound.** Engineer's, at build.
- **I did not rule on `Q7`'s uniqueness clause** (the second `Dev / run` slot). It is the same root
  cause — an unanchored locator — but it is a **wording change to `ABC-065`'s merged `A1`**, which is
  a merged ticket's prose and a different id than the single one I was given. **Named in
  `ABC-067` § Out of scope and § Dependencies, handed to the Orchestrator, not folded in.** Widening
  a ticket onto a merged criterion on my own authority is exactly the move my hard limits forbid.
- **I did not touch `Q10`/`G8`** (`ABC-065`'s `A2` line-range fence), which is genuinely BA/PM's pen
  and genuinely still open. It is outside `ABC-067`'s subject and outside my id range.
- **I did not rule the sequencing** of `ABC-067` against `ABC-065`'s pending UAT. That is the
  Orchestrator's; it is `ABC-067`'s single DoR ⚠️ and is stated as an open question, not resolved.
