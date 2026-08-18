---
id: 20260818T203500Z-software-engineer-claim-the-knight-bound-was-false-and-it-was-in-my-note-not-the-test-file-8f5aa0c7
kind: claim
by: software-engineer
at: 2026-08-18T20:35:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - EPIC-002
  - src/move-input.test.ts
  - src/frame.ts
  - 20260818T184000Z-software-engineer-claim-every-criterion-and-the-evidence-that-answers-it-c05d31ea
supersedes:
---

# The false knight bound is mine, it is corrected — and it was never in the test file

**The bound is false and I wrote it.** *"Exactly six squares attack any given square by knight
move"* is true of an edge-ish square like `d2` — which is the square every knight fixture in this
ticket uses — and false of a central one: **`d4` has eight knight attackers**. QE built the
seven-knight case, the Orchestrator reproduced it first-hand, and at seven candidates the frame's
message region appends `(+2 more)`. I generalised from the case in hand and the fixture had chosen
the square that made the generalisation hold.

## One correction to the brief's location, because it decides what a future reader can find

The brief says `src/move-input.test.ts` carries that sentence. **It does not, and never did.** I
searched the whole worktree: the sentence occurs in three places, all context notes —

- my own delivery note, `.grugops/context/ticket-to-pr-ABC-033-2026-08-18/notes/`
  `20260818T184000Z-software-engineer-claim-every-criterion-and-the-evidence-that-answers-it-c05d31ea.md`,
  line 48 — **the original**;
- QE's `G1` observation and QE's `A1`-`A7` recheck, both quoting it back at me.

Nothing under `src/` ever contained it. Correcting a comment that is not there is not possible, so
here is what I did instead, and it is the same repair aimed at the words that DO exist:

**What the test file actually carried** was the same error one step downstream — the fixture comment
claiming the five-knight and six-queen lists were *"the widest candidate list this module was able
to produce at all"*. QE produced 7 and 8. That comment is now corrected in place: it states the true
bound (six attackers for `d2`, eight for `d4`), says where the generalisation went wrong, records
that `G1` falsifies `A4`, and says the rows below assert the widest list **known to fit** and claim
nothing beyond it.

## Why this note does not carry `supersedes`

The natural move is to supersede my delivery note. I have not, and the reason is the schema's own
semantics: `supersedes` **folds the earlier note out of replay**
(`agent-factory/contracts/context-note.md`), and that note is the criterion-by-criterion evidence
record for `A1`-`A7`. Folding all of it out to correct one sentence would delete more truth than it
fixes. This note names the earlier note in `refs` and corrects the one claim explicitly instead.
**If the Orchestrator would rather have the fold, that is its call to make, not mine to take
silently.**

## `G1` itself is NOT repaired here, and that is deliberate

`src/frame.ts` is untouched. Nothing was truncated and nothing was widened — which is the side of
`A4`'s own line the delivered module was already on, and the disposition `A4` pre-assigns: a finding
for `EPIC-002`'s frame owner and a new ticket, which BA/PM is cutting in parallel. **No seven-knight
fixture was added to this file either**, because a fixture asserting the current behaviour would
either pin the overflow as correct or gate red on a branch that must gate green.
