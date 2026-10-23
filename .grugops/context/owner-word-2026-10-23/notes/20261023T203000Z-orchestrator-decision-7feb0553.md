---
id: 20261023T203000Z-orchestrator-decision-7feb0553
kind: decision
by: orchestrator
at: 2026-10-23T20:30:00Z
verified_by: 
confidence: high
refs:
  - ADR-0047
  - ABC-203
  - memory-bank/analysis/2026-10-23-game-1.md
  - plans/uat/EPIC-006-play-test-log.md
supersedes: 
seal: sha256:2e8720b65bb8c3952960b2d88a055299a077e86de93f7be47005d0f63f7ed7fb
---

# The owner's in-session word, 2026-10-23 evening. A transcription, not a stamp

Verbatim: *"1. accept ; 2. accept all improvements ; 3. I set Apple chess difficulty to "Computer thinks 2 seconds per move", it often felt that it thought for 5-6 seconds. ; What ratings other chess programs have if we would want to enter a competition?"*

1. **ADR-0047 accepted by the owner** (PGN file under `games/`, exclusive create, single fs holder; held per `…3898cd9a`). Status rewritten to owner-accepted on `grugops/arch-design-ABC-203`, then merged. ABC-203 → Ready for Dev → In Development (SE).
2. **All eight improvement proposals of `…f1771bb3` accepted** (king safety with queens on + tapered king table; rating harness vs Stockfish UCI_LimitStrength; faster search with identical answers; per-piece mobility + development/early-queen term; null-move pruning; TT kept across moves; check extension / checks in quiescence; deeper English book). Routed to BA/PM to cut an epic and ordered tickets. Where a proposal needs a new or changed ADR (null move: new ADR + ADR-0026 door; TT across moves: ADR-0025 D4; checks in quiescence: reverses the recorded `src/quiescence.ts:21-24` decision; king safety: ADR-0031 addendum), the owner's acceptance of the proposal is the go-ahead for that ADR work; each ADR text is still reported to the owner when it lands, and moving an NFR bound (NFR-008 etc.) remains his.
3. **Apple Chess setting for game 1**: "Computer thinks 2 seconds per move"; owner's impression: it often took 5–6 s. Recorded in the play-test log.
4. Question on competition ratings: answered in session; entering a rated list or competition means distributing the engine to third parties, which touches ADR-0007 / ADR-0018 / ADR-0044 D8 (local only, nothing published) — the owner's call if pursued.
