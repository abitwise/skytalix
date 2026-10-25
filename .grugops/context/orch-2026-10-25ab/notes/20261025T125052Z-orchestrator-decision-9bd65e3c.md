---
id: 20261025T125052Z-orchestrator-decision-9bd65e3c
kind: decision
by: orchestrator
at: 2026-10-25T12:50:52Z
verified_by: 
confidence: high
refs:
  - ABC-207
  - EPIC-008
  - NFR-005
  - ADR-0028
supersedes: 
seal: sha256:246a260798548c4735557f7a59f197638ec268916878571b7e36f59776fee217
---

# ABC-207 built → In Review; qe-ABC-207 ALONE

- **ticket-to-pr-ABC-207 accepted** (…71735f56, …84f82342, …723cbf60): grugops/ABC-207 @ 5477df21, code 5050cce9.
  - Diff: src/evaluate.ts plus 5 test files, matching the brief's fence. New rows sit in evaluate.king-mobility.test.ts, inside the page's `src/evaluate*.test.ts`.
  - All 12 ruled rows moved by their routes, with values equal to the ruling's. The pvs-lmr A4 re-find under ADR-0028 d2 is position-3 after 1.Rb3 Kg5.
  - Frozen-clock 8/8 counts equal the ruling's.
  - Gates: 2097/2097, skips 0, deep lanes green, puzzles 54/58. No STOP.
- **Board:** ABC-207 In Development → In Review (1/3).
- **Next: `qe-ABC-207` runs ALONE.** This is ABC-207's own single reading (…4c3f7639 scope reading, veto open; battery allowed per …10e61802).
  - QE gate, G2, then the Test note 4 pre-check.
  - G6 under the EPIC-008 G6 reading rule (n = 5, median, any run < 6 FAILs; "≥ base" graded, QE-205-c default A).
  - D under ship rule S1: GAIN MET; NEUTRAL → the one 400-game extension, pooled, GAIN after → MET; anything else NOT MET → no merge, failed-attempt note.
  - Expected wall time: ~6 h, or ~12 h with the extension.
