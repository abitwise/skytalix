---
id: 20261104T130054Z-orchestrator-decision-4c4cb03d
kind: decision
by: orchestrator
at: 2026-11-04T13:00:54Z
verified_by: 
confidence: high
refs:
  - ABC-282
  - ABC-283
  - ABC-233
  - ABC-234
  - ABC-236
  - ADR-0063
  - ADR-0065
  - ADR-0066
  - EPIC-011
supersedes: 
seal: sha256:4c09e7cd457ca5eba598ff9d1ab3480b2c5499aa37f8324a1fccd4b10b769f26
---

Owner 2026-11-04: "yes, cut W1; merge ABC-233, ABC-234 and ABC-236 into one branch and do one test run; after cutting W1, start cutting EPIC-011 areas."
Rulings:
1. W1 (time use under a clock) is cut as ABC-282 by BA/PM; ADR owed by the Architect after the cut.
2. The bundle O1h + O3s + S1 (ADR-0063 history, ADR-0065 SEE ordering on src/see.ts from ABC-279, ADR-0066 aspiration) is re-opened by the owner's word, overriding the three not-met premises (requirement-level, owner's). New ticket ABC-283; ABC-233/234/236 stay as the design pages. SE builds all three on one branch grugops/ABC-283, each behind its own ADR door plus one all-off door.
   - Bars: P0, all-off node counts equal main exactly; the ADR-0064 d7 safety rows (mate floor, zugzwang 7/7, G1 none newly missed); NFR-008 default lane ≤ 10 s (new rows in deep lanes).
   - Then ONE read: 100 games at 100 ms, bundle vs main, GAIN ≥ 50.0, PREREG sealed first, never re-played.
   - Pass: merge, ADR-0063/0065/0066 accepted as a bundle. Miss: not merged; the three stay parked.
3. Then BA/PM cuts the EPIC-011 uncut areas, as ABC-284 onward.
4. BA/PM also fixes the stale frontmatter on ABC-270/278/279/280/281 (Ready → Done; the board already says Done).
