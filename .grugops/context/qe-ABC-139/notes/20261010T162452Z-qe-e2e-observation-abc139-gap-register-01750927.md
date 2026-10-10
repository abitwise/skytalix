---
id: 20261010T162452Z-qe-e2e-observation-abc139-gap-register-01750927
kind: observation
by: qe-e2e
at: 2026-10-10T16:24:52Z
verified_by:
confidence: high
refs:
  - ABC-139
  - QE-129-b
  - QE-139-a
  - QE-139-b
  - QE-139-c
  - src/turn-loop.ts
  - src/command-input.test.ts
  - 20261010T162452Z-qe-e2e-decision-abc139-verdict-pass-a1b2e159
supersedes:
---

# QE `ABC-139` gap register: 3 INFO, none blocking, none a defect of this diff

This note is hand-authored and unsealed.

## `QE-139-a` (INFO): the docblock's "carry a message" gloss is looser than the code it describes

- **Where:** `src/turn-loop.ts:281–282`, "the non-advancing outcomes that carry a message re-emit a frame, because that
  is where the message goes".
- **What:** the code re-emits by outcome KIND, not by whether a message is present. `board` is a `command` with
  `messages: []` (`src/command-input.ts:269`), and it still re-emits. The re-emit happens at `:392–395`, `continue`
  for every non-`move` outcome that reaches the `else` arm. If "carry a message" is read as "has a non-empty message",
  the sentence predicts 1 for `ABC-035` `A3`, not 4. If it is read as "has a message channel", it is right.
  `PromptOutcome`'s own docblock (`:105–106`, "FIVE of the seven emit a frame") counts by kind, and so does the new
  comment ("3 re-emitting `board` outcomes").
- **Effect:** none on behaviour or on this ticket. The new comment is right against the code. `ABC-139` fences
  `src/turn-loop.ts` out ("The docblock is right"), and that is true of the formula itself.
- **Owner:** BA/PM, to cut a one-word follow-up or decline it.

## `QE-139-b` (INFO): an in-block sentence beyond the ticket's "may" list was reworded, and it is correct

- **What:** the trailing sentence went from "a fourth, a fifth and a sixth" to "one more frame per `board`, three in
  all". `## Scope` names the block, and lists the docblock form and this input's arithmetic as its content. It does not
  name this sentence.
- **Judgement:** it is inside the ticket's block, so it is not hidden scope. The SE states it in `…5b2e91c4` §4, and it
  corrects a reading that the new "= 4" would make wrong: the extra frames are 5–7, not 4–6. Mutant M2 measures +3,
  for a total of 7. QE accepts it, and no action is needed.

## `QE-139-c` (INFO): each Q4 measure has a blind spot on THIS file's controls too (extends `QE-129-b`)

- **Measure (a) alone accepts a commenting-out.** A `/*` line and a `*/` line around `:417`: every changed line is
  wholly comment, but the assertion is gone. Only (b) or (c) sees it.
- **Measure (b) alone accepts code-line edits whose only change is a comment.** For example, a trailing `// QE` on
  `:417`: the stripped print is identical, but the changed line is not a comment line. Only (a) refuses it.
- **Effect:** none here. The real diff passes both measures. This confirms the owner's conjunction from both sides.
- **Owner:** the Orchestrator, if it codifies Q4. Keep the AND.
