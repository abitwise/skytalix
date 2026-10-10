---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-10T14:12:47Z
sealed: false
---

# Owner word, 2026-10-10: ABC-126, ABC-087, ABC-104 accepted; comment-only diffs = zero production lines

Verbatim: "accept ABC-126, ABC-087, ABC-104 ; Q4: yes"

1. **ABC-126** (corpus repairs, `grugops/ABC-126-corpus-repairs` @ b22f6e16): UAT ACCEPTED.
2. **ABC-087** (difficulty levels, `grugops/ABC-087-difficulty-levels` @ 8330651d): UAT ACCEPTED.
3. **ABC-104** (`coordinate-move.ts` header, `grugops/ABC-104-coordinate-move-docblock` @ 328e77e8): UAT ACCEPTED.
4. **Q4 = yes:** a production diff whose changed lines are all comments counts as **zero production
   lines**, so the standing UAT waiver (2026-08-17) applies to it — still labelled "WAIVED (waived is not
   accepted)".
   - **Measurement (Orchestrator's application; the owner said "yes" without naming one):** the
     recommendation put to the owner — the ABC-104 check: every changed `src/` line is a comment line
     AND the comment-stripped compile output (`transpileModule`, removeComments) of each changed
     production file is byte-identical at base and tip. Either failing → not waived, owner word owed.
     The owner may name a different measurement; this note is then superseded.
   - Tickets this moves: ABC-129 and ABC-132 (exit becomes waived on that measurement).
