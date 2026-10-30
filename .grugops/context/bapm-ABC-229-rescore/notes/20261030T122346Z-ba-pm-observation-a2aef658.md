---
id: 20261030T122346Z-ba-pm-observation-a2aef658
kind: observation
by: ba-pm
at: 2026-10-30T12:23:46Z
verified_by: 
confidence: high on files named (ticket scopes, ABC-241 branch diff --stat, main's src greps); ABC-229's own file set is UNKNOWN - verify until the SE greps
refs:
  - bapm-ABC-229-rescore
  - ABC-229
  - ABC-241
  - ABC-220
  - ABC-243
  - EPIC-010
  - grugops/ABC-241
  - ADR-0044
  - ADR-0045
  - G8
  - NFR-008
supersedes: 
seal: sha256:fce14994130e830cd1c4b647da6d2b71f6dd7ae754ed9751545f77841b723742
---

# bapm-ABC-229-rescore: ordering with ABC-241 / ABC-220 / ABC-243, and what was seen but not acted on

- **Predicted ABC-229 files** (ABC-228's analogue; UNKNOWN - verify): src/legal.ts, src/quiescence.ts, src/search.ts, src/engine.ts, plus the tests that carry the QuiescenceRules record or the door lists. On main those are engine.test.ts, gameend.nfr.test.ts, quiescence.test.ts, engine.capacity.test.ts, search.ordering.test.ts, search.capacity.test.ts, search.null-move.test.ts and search.test.ts.
- **ABC-241** (In Review, value-changing): no production file is shared, because its Out of scope fences legal/search/quiescence/transposition. Its branch edits src/engine.test.ts (about :907, the clock-seam pin); ABC-229's door list sits at about :500. A different describe, so whichever merges second rebases. Its merge moves the base, so ABC-229's smokes must be read on a main that carries ABC-241, or read again (EPIC-010 stale rule).
- **ABC-220** (In Development): src/uci-session.ts and its test only, so no shared file. TimeMode is off by default. Whether its merge stales a level-5 smoke is the Orchestrator's ruling; none is recorded here.
- **ABC-243** (Backlog, test-only: uci-session.test.ts, transposition.test.ts): no shared file predicted. It is shared only if an ABC-229 shipped-path value pin in transposition.test.ts moves (ADR-0053 d7 route; UNKNOWN - verify).
- **Host:** ABC-229's QE reads (G6, G11, smokes) are ALONE, so they queue behind qe-ABC-241, which is held behind se-ABC-220.
- **G8 headroom:** 9.61 s against 10 s at ABC-228's gate (0.39 s). ABC-229's new rows should stay fixed-depth and few.
- **Seen, not acted on (outside the brief):** ADR-0044 D11's 2026-10-19 fold still says level 5 is "the shipped engine at 3 s". The ADR-0045 fold block records D11 at 4 000 ms, but D11's own text carries no dated mark. plans/board.md's ABC-229 line still reads "waits owner accepts ADR-0053; after ABC-228" (the Orchestrator's).
