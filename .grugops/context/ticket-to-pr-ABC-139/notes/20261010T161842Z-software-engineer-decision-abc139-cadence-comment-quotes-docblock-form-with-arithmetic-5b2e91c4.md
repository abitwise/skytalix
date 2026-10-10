---
id: 20261010T161842Z-software-engineer-decision-abc139-cadence-comment-quotes-docblock-form-with-arithmetic-5b2e91c4
kind: decision
by: software-engineer
at: 2026-10-10T16:18:42Z
verified_by:
confidence: high
refs:
  - ABC-139
  - ABC-035
  - QE-129-a
  - src/command-input.test.ts
  - src/turn-loop.ts
supersedes:
---

# `ABC-139` spelling: the `A3` comment quotes the docblock's formula verbatim, gives this input's arithmetic (1 + 0 + 0 + 3 = 4), and says `eof` re-emits nothing

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). It covers only how the comment is spelled. The ticket decided what it must say.

1. **The formula is quoted byte-for-byte** from the base's "The render cadence" paragraph (`src/turn-loop.ts:279` at
   `e7641dea`, unchanged since `b98fb419`): `` `1 + plies + take-backs + RE-EMITTING non-mutating outcomes` ``. The
   cite is kept as it was: `src/turn-loop.ts`, `runTurnLoop`'s docblock, "The render cadence".
2. **The arithmetic is spelled term by term, including both zeros:** "1 initial frame + 0 plies + 0 take-backs + 3
   re-emitting `board` outcomes = 4". The reader can then map each docblock term to this input without
   re-deriving it.
3. **`eof` is named explicitly** ("re-emits nothing: it goes to `exiting`, not to `rendering`"). It uses the
   docblock's own state names, because miscounting `eof` is exactly the 5-vs-4 trap that `QE-129-a` records.
4. **The trailing sentence was reworded,** inside the same comment block, from "would add a fourth, a fifth and a sixth" to
   "would add one more frame per `board`, three in all". Next to the new "= 4", the old ordinals read as frame
   numbers 4–6, while the extra frames would actually take the total to 7. The new wording states the delta and
   claims no total. The meaning is unchanged.
5. **Not touched:** the assertion `toBe(4)`, every executable line, `:533`'s "four non-advancing outcomes",
   `src/line-input.ts` and `src/turn-loop.ts` (all fenced out by the ticket).
