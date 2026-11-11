---
id: 20261111T074415Z-architect-design-observation-1c4c6d88
kind: observation
by: architect-design
at: 2026-11-11T07:44:15Z
verified_by: 
confidence: high
refs:
  - ABC-318
  - src/levels.ts
  - src/levels.test.ts
  - ADR-0052
  - ADR-0045
  - ADR-0053
  - NFR-008
  - 20261111T074410Z-architect-design-decision-d82c4579
supersedes: 
seal: sha256:671e06a20a5ac0febad59f950e4c72c338fb0e1c2423362c48cd398b1c70d541
---

ABC-318, owed beyond the ADRs (for the Orchestrator to route; nothing here is edited by arch-ABC-318).

1. src/levels.ts header comment, read at main 902680b7. Lines 47-50 state "at 5 s" and "7 s at 6"; these move with C3 in the same diff (10 s; 12 s). ADR-0052 D8's dated line (QE-221-b) and ADR-0045 A3's 2026-10-31 fold both say the next ticket whose diff touches src/levels.ts also corrects three older stale words, comment-only: :42 "NFR-004's 3 s" reads 4 s; :49-50 "at least 2 s under it" is 1 s at level 5; "HARD_CEILING_MS is the largest of them" becomes "the clamp sits at the largest ceiling in force (60 s, uci-clock-mode), at or above every level ceiling". ABC-318 is that ticket. The se-ABC-318 brief does not name it.

2. For the SE at C3, not checked here (UNKNOWN - verify): NFR-008, a default-lane row that plays level 6 at its budget on a fixed virtual step reads the clock about twice as often; the levels deep lane's real-clock L6 row (src/levels.test.ts, "ABC-212 A4 - levels 6 and 7 spend their budget") now takes ~10 s per L6 search, so its wall grows. src/levels.test.ts pins L6 at :104 (CEILING_MS 6: 7_000), :270 and :289 (budgetMs 5_000).

3. ADR-0053 decision 10's "the level 5 -> 6 step shrinks to 1.25x" is history from ABC-318's merge (2.5x); outside this hop's width, not edited. ABC-212 OQ-212-1, EPIC-008, traceability and board lines that state L6 at 5 s / 7 s are BA/PM's and the Orchestrator's, as they rule.
