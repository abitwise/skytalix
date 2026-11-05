---
id: 20261105T102159Z-orchestrator-decision-ba886714
kind: decision
by: orchestrator
at: 2026-11-05T10:21:59Z
verified_by: 
confidence: high
refs:
  - ABC-291
  - ABC-289
  - ABC-303
  - EPIC-011
  - ADR-0056
  - ADR-0067
supersedes: 
seal: sha256:77a1797fb0926ac06ff0e70da4b08bf622032d524368b12eb53840ee98a47da4
---

Owner asked at about 10:20Z what else can be taken while A4 plays. A4 is still running (cutechess live, about 2.4 h in; the agent's "completed" notice is its wait on background work, no report yet). Lock stays closed.

Taken now, records only, no test, build or engine:
1. arch-ABC-291: ABC-291 Backlog to In Design. ADR-0075 PROPOSED: definitions, stated rule, hand values, memo placement and size, G2 ratio, and the probe written but not run (the ticket runs it on the host after A4). Carries the four owed items: TUNE_DEEP against a hand-valued term, how ABC-306 reaches a fit, E5 without per-piece mobility at the third-pull door, no second set of values after a miss.
2. bapm-pointers-1105: ABC-289 DP4's CF line, the in-flight pointers on ABC-290 to ABC-293, ABC-303 and EPIC-011, and one pointer at EPIC-011 § The per-change rule. This changes the board line of arch-owner-answers-1105b: these pointers no longer ride with ABC-282's close hop, because none depends on A4. ABC-282's own close lines stay with the close hop.

Not taken: ABC-292 to ABC-293 ADRs wait for ABC-291's ADR, which sets the shared pattern for a hand-valued term. ABC-305, the row census and the ABC-303 main-merge hop need the lock or A4's outcome. ABC-289's build waits on ABC-303.
