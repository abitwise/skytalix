---
id: 20261018T124900Z-qe-e2e-observation-abc169-hand-tuned-vs-credit-910d778e
kind: observation
by: qe-e2e
task: qe-ABC-169
at: 2026-10-18T12:49:00Z
verified_by:
confidence: high
refs:
  - ABC-169
  - QE-169-b
  - QE-169-d
  - ADR-0044
  - plans/tickets/ABC-169-declare-the-engine-private.md
supersedes:
---

# QE-169-b (LOW, doc coherence): comments that say "hand-tuned" now contradict the credit

Hand-authored and unsealed. No timing was read.

At `344a4128`, the header credit says `PIECE_VALUE` and the six tables are Michniewski's values, "unchanged".
The same file still says the reverse in three places:
- `src/evaluate.ts:12`: *"Every number below is HAND-TUNED and expected to move"*. The ticket's Out of scope fences
  this line by name (coding rule 9).
- `src/evaluate.ts:58`: *"Deliberately small and hand-written, as the ticket asks."*
- `src/evaluate.ts:145`: *"Hand-tuned like everything above."*

Two test comments say it too: `src/evaluate.pawns.test.ts:4` and `src/evaluate.king-mobility.test.ts:4`. In
effect, A3 and A5 fence these lines as well, because only header lines may change. A reader now meets two claims
that contradict each other. If BA/PM wants this fixed, it needs its own comment-only ticket. It does not block.

**QE-169-d (INFO, `UNKNOWN - verify`).** `PIECE_VALUE` (100/320/330/500/900, with king 0 and not 20000) and all six
tables, including the middle-game king table, match the Simplified Evaluation Function values as this QE recalls
them. I did not fetch the primary page, so "the values are unchanged" is not verified against the source by
this hop.
