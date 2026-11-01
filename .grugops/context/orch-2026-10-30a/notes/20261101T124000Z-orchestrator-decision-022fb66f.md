---
id: 20261101T124000Z-orchestrator-decision-022fb66f
kind: decision
by: orchestrator
at: 2026-11-01T12:40:00Z
verified_by: 
confidence: high
refs:
  - memory-bank/50-decisions/ADR-0056
  - plans/epics/EPIC-009
  - plans/epics/EPIC-010
supersedes: 
seal: sha256:d6dec67884e38692c0f5700f4c43b141549e2edb3373a382478265b4c7d68f2c
---

# Owner word 2026-11-01: 3 000 is read at 40/15; fast benchmarks allowed; new epic after the others close; dedupe

Owner, verbatim: "3000 elo target would be 22s per move or 15 minutes per 40 moves, not with 4s per move. But let's not benchmark all the time with those values, we can becnhmark with smaller values for faster feedback loop, can be also 0,5s per move to get faster readings. Otherwise i'm happy with where we are going, let's create new Epic yes and finish other epics before that. Go over previous epics and tickets to find conflicting work, no need to do the same work twice."

Orchestrator reading:
1. **Q-3K-1 answered (time control part):** the 3 000 claim is read at the tournament setting, 40 moves in 15 minutes (~22 s/move; EPIC-009's uci-clock-mode). The scale (Stockfish UCI_Elo as proposed in ADR-0056) is not contested; "happy with where we are going" accepts ADR-0056's direction. Recorded as accepted-in-direction; specific owner calls not named below stay open.
2. **Benchmarks:** routine readings use shorter time controls for a fast loop, down to 0.5 s/move; the 40/15 reading is for the claim / milestones the Architect names.
3. **Q-3K-5 answered:** a NEW epic for the 3 000 path. **Order: finish the other open epics before it starts.**
4. **Dedupe:** go over previous epics and tickets for conflicting or duplicate work; no work done twice.
5. Still open (not answered): Q-3K-2 SPRT's place in the per-change rule, Q-3K-3 test width (cores), Q-3K-4, Q-3K-6, Q-3K-7, Q-3K-8, and Q-SP-3 (ABC-254 legality shortcut).
