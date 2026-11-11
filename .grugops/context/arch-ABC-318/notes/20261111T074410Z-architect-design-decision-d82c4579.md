---
id: 20261111T074410Z-architect-design-decision-d82c4579
kind: decision
by: architect-design
at: 2026-11-11T07:44:10Z
verified_by: 
confidence: high
refs:
  - ABC-318
  - ADR-0045
  - ADR-0044
  - ADR-0052
  - NFR-004
  - OQ-212-1
  - 20261111T073837Z-orchestrator-decision-f1dce7dd
  - 20261111T044438Z-orchestrator-decision-152bb16f
supersedes: 
seal: sha256:920df6ed5ab834c4d8faeb2179cfc3f3eba36609e77be194a8bcaa3f74066a72
---

ABC-318 C1, recorded. Level 6 thinks 10 000 ms (was 5 000), rate 0 unchanged; its NFR-004 ceiling is 12 s (was 7 s), by the owner's accepted rule "a level above 5 gets its budget + 2 s". Owner's word, verbatim: "go with 10 s for level 6" (Orchestrator …f1dce7dd). It answers OQ-212-1's revisit. In force at ABC-318's merge; until then main stays 5 000 ms / 7 s. HARD_CEILING_MS (60 000), DEFAULT_LEVEL (5), HARDEST_LEVEL (7) and levels 1-5 and 7 do not move.

Reason: the ABC-316/317 readings (L1 1499.5 ± 53.4, L2 1678.1 ± 48.5, L3 1909.1 ± 47.9, L4 2094.3 ± 47.9) and the projection …152bb16f put L6 at 5 s +16-24 Elo over L5 (0.32 doublings), inside one reading's ± 48. At 10 s it is projected at ~2310-2410, about +65-100 over L5 (1.32 doublings); 4 -> 10 -> 30 s is 1.32 and 1.58 doublings. All projected, UNKNOWN - verify.

Records (dated lines only, additions only, no old text changed):
- ADR-0045: § Status blockquote; A1 dated line under the table and a resolution line under "Level 6 plays almost like level 5"; A3 margin; A4 D5-fold bullet and cutechess line; § AMENDMENT 2026-10-24 § Consequences (NFR-004 text, AR-NFR004-A); new § AMENDMENT 2026-11-11 at the end.
- ADR-0044: § Status blockquote; D4.4 fold; D5 fold.
- ADR-0052: § Status bullet; D6 level-ceiling line; A1 row (dated line under the table); § Consequences NFR-004 quoted text.

Checked at main 902680b7, still hold: the ordering row over 1..7 (4 000 <= 10 000 <= 30 000, rates 0,0,0, each step improves the budget); A1 time-alone note for 5v6 and 6v7; A2 (default 5, hardest 7, LEVELS[5] = {4000, 0}, NFR-005 referent); A3 (mechanism, no third field, margin 2 000 at 6 and 7 and 1 000 at 5, every budget <= 30 000, largest level ceiling 32 000 at L7 <= clamp 60 000, so levels.test.ts clause B's pins hold); A4 (spin 1-7, rate-0 path for 5-7, bare go at 6 = 10 000, busy latency ~12 s < cutechess IdleTimeout 15 000 so the no-worker ruling holds); A5 (levels 6-7 outside the ladder, no 5v6 verdict owed, ABC-087 test note 4 not engaged); D3 / ADR-0038 d1; ABC-101 A7; NFR-009 (30 s reading covers 10 s); ADR-0052 modes do not read Skill Level, A1's "22 s between 6 and 7" holds. ADR-0044 D4.1, D4.2 and D11 rules unchanged.
