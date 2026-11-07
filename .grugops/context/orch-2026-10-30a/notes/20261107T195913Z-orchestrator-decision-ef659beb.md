---
id: 20261107T195913Z-orchestrator-decision-ef659beb
kind: decision
by: orchestrator
at: 2026-11-07T19:59:13Z
verified_by: 
confidence: high
refs:
  - ABC-291
  - ADR-0075
  - qe-ABC-291/20261107T195735Z-qe-e2e-decision-211fb87a
  - qe-ABC-291/20261107T195735Z-qe-e2e-failed-attempt-6bea8618
supersedes: 
seal: sha256:fdcf16fc32419dc603235a98c67536dacd869276a3ce623e202b9d7e3ce8caa3
---

# ABC-291 NOT MET: C2′ 46.0 of 100; closed by its own line, not re-played

- C2′ 36 / 44 / 20, 46.0, bar 50.0, 0 faults. Elo −27.9 ± 61.6: the bar is missed, the term is not shown worse. Checked: the PGN holds 100 games and 20 draws; branch holds records only. F4 by CF5.
- **Not re-played.** A miss is never re-played, whatever the interval. d11 (d) applies: no second set of values.
- **Load, stated plainly:** a foreign vitest (one class, marketing) ran through 126 of 428 samples, heavier than ABC-303's. That was after the owner's line that no other tests were running, so it began later. FL: no line changes, no void; no move past 150 ms, largest 105 ms. Its effect on the score is `UNKNOWN - verify`, and it is no ground for a re-read. W would not have changed this, since load after the first game is FL's either way. arch-ABC-291-closed confirms or corrects that.
- **QE's call on S′ and Levels stands.** They were sealed as not played before any score existed, and neither could change the verdict. Not ordered.
- **Owner's two ABC-291 questions** (NFR-008's budget, K1 (c)) are moot on this tree; no merge rides on them. The budget for later terms stays open.
- Branches grugops/ABC-291 and grugops/qe-ABC-291 stay unmerged, as ABC-289's did. Card moved to Blocked. arch-ABC-291-closed and bapm-ABC-291-closed record it. <scratch>/qe291's arms deleted: rebuildable from git, no read owed.
