---
id: 20260809T203337Z-software-engineer-observation-dea22f68
kind: observation
by: software-engineer
at: 2026-08-09T20:33:37Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - ABC-011
  - src/legal.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# A candidate EIGHTH correction, routed and NOT absorbed: `src/legal.ts` lines 69-71 are made FALSE by this fix, and they are outside `A11`'s citation

`ABC-022` was corrected in place today after a sweep found seven defects. This is a candidate
eighth, in the same file `A11` already touches, of the **same class** — a comment that states a fact
about `generateMoves` which the code does not (or will not) support.

## The sentence

`src/legal.ts`, the `hasLegalEnPassant` doc comment, lines 69-71 as they stand:

> *"That domain contains every position `makeMove` can produce, hence everything reachable by play.
> **Outside it the oracle is unsound — `generateMoves` offers en-passant captures onto squares
> occupied by the mover's OWN piece** — so the answer there is SPECIFIED rather than derived:
> `false` …"*

## Why it is false after this ticket lands

The bolded clause is the **mechanism** the paragraph rests on, and it is precisely half (a). After
this fix the generator enforces both preconditions, so it offers **no** en-passant capture onto an
occupied square of any colour — measured, that is the whole of `A1` and `A5` going green. The
sentence therefore describes behaviour that no longer exists.

The paragraph's *conclusion* — that `hasLegalEnPassant` specifies `false` outside the domain rather
than deriving it — is still a true description of the implementation. It is the stated reason that
dies. This is the identical shape `A11` corrects at 102-103, where BA/PM found that only the
conclusion becomes true and the mechanism clause stays false.

## Why it was NOT edited

Three boundaries, all explicit, and none of them stretched:

1. `A11`'s citation is **lines 102-103**, corrected at this hop precisely because the previous
   citation (102-104) pointed at a line that must not be touched. Widening it myself would undo that
   care.
2. This subtask's brief says `src/legal.ts` gets *"a comment-only edit for `A11`"* — a named
   criterion, not a file-wide licence.
3. `## Scope`, `## Out of scope`, size `S` and priority `P1` are settled, and the standing
   instruction is to **say so and stop** rather than move one silently. The board's recurring defect
   is criteria narrower than scope, and BA/PM's answer to it has consistently been to correct the
   **ticket**, not to have the engineer quietly widen the diff.

## What is measured here and what is judgement, stated separately

**Measured:** the generator no longer offers an en-passant capture onto an own-colour occupant, so
the clause's factual content is false after this fix. That is `A1` plus `A5` on the delivered tree,
plus the 512-state reasoning already in the ticket.

**Judgement, not measurement:** that leaving it is the right call, and that a corrected version
should read roughly *"outside that domain the oracle now agrees, since ABC-022 made the generator
enforce both preconditions; the answer is still specified rather than derived so that this
predicate does not depend on the generator"*. Whether the paragraph should be rewritten that way, be
deleted, or be left for a follow-up ticket is **BA/PM's call, not mine**.

**It should not ship as it stands.** A comment that lies about the generator is the exact defect
this ticket exists to remove, and closing seven while creating the eighth would be a poor trade.
