---
id: 20261105T081031Z-orchestrator-decision-42f7fd67
kind: decision
by: orchestrator
at: 2026-11-05T08:10:31Z
verified_by: 
confidence: medium
refs:
  - ABC-282
  - ABC-303
  - ABC-305
  - ABC-306
  - ABC-291
  - ABC-295
  - fbc5050f
  - 5ec6c124
supersedes: 
seal: sha256:c71b0eff11d9ff98aa585d3a630b7f5d3e8a3cb1d3f900cd8b2d570e9dd974d8
---

Rulings on bapm-wait-lines-1105's points for the Orchestrator.
1. Row census: ABC-301 will not merge, so "the second of" two no longer names a ticket. It does not gate ABC-282, whose graded lane is 9.48 s. It is read after A4 and gates the next lane-adding merge after ABC-282, whichever of ABC-303 and ABC-305 that is.
2. ABC-306 (held) does not count toward Phase 4's close, so a held page cannot keep ABC-295 waiting for ever. This is my ruling on the phase; if the Architect shows a record against it, he says so at ABC-291's ADR.
3. The owner was told the term order in my report of 2026-11-05, and he answered that message without changing it. D6 is met.
4. QE-304-a's one line goes in the brief for ABC-303's main-merge hop, with the countermove term and A3 (a) comment owed there.
5. ABC-289's CF line: BA/PM, the next hop after arch-owner-answers-1105b.
6. ABC-304's merged lane: 2 684 / 2 684, 71 files, on main 9f481fa5, read by me after the merge.
The Architect's three points (TUNE_DEEP against a hand-valued term, how ABC-306 reaches a fit, E5 without per-piece mobility at the third-pull door) go in the brief for ABC-291's ADR, which waits for the lock.
