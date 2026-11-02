---
id: 20261102T000240Z-architect-design-observation-5ea73b5c
kind: observation
by: architect-design
at: 2026-11-02T00:02:40Z
verified_by: 
confidence: high on the store fraction and the 2^14 readings; the 40/15 store counts are arithmetic from qe-tc-depth-probe ...1889e3b0 R1 and EPIC-011's node figures
refs:
  - arch-phase1-replan
  - EPIC-011
  - ABC-238
  - ABC-237
  - ABC-257
  - ABC-258
  - ADR-0058
  - ADR-0025
  - ADR-0056
  - se-ABC-238/20261101T233711Z-software-engineer-failed-attempt-db17e44b
  - se-ABC-238/20261101T233711Z-software-engineer-observation-3beb1ada
  - grugops/arch-phase1-replan
  - 772153a7
  - NFR-009
  - ABC-209
  - qe-tc-depth-probe
supersedes: 
seal: sha256:25ebd0d8eae8bdb040472c50b76a0905c5fd3f0ba31ee5f6fac110f07e19604b
---

# Table pressure is about 20x lower than ADR-0025's T2 arithmetic; T2 pays only on a loaded table (0.77x at 2^14); kept entries do cut under exact depth (17-23 % of exact cuts)

## Store fraction
- Stores are 3-5 % of nodes:
  - search() depth 8: kiwipete 42 209 / 1 116 785 = 3.8 %; position-6 80 258 / 1 602 457 = 5.0 %;
  - chooseMove to 8, kiwipete: 3.2 %;
  - the 190 at depth 6: 4.6 % in both recursions.
- Quiescence nodes are counted in nodes but never store (ADR-0025 decision 5).
- **Arithmetic** (ADR-0025 T2 amendment's formula, 262 144 slots):
  - 100 ms (47 131 nodes): about 2 k stores, so no pressure;
  - 4 s (2.8 M nodes): about 0.08-0.14 M stores, 14-22 % of stores land on an occupied slot. The amendment wrote "<= 91 %";
  - 40/15 (14-20 M nodes): about 0.4-1.0 M stores a search, so 1.6-3.8 stores a slot.
  - A table kept across moves accumulates: kiwipete game (c), 186 308 of 429 031 stores met another key.

## T2 under pressure (TT_BITS = 14, about 3 stores a slot a search; the game set at depth 8, pooled / geometric mean)
- (d) T2 alone: **0.7712 / 0.8158**;
- (b) T1+T2: **0.7408 / 0.7698**;
- (a) T1: 0.9872 / 0.9747.
- The door at 2^14 costs 1.37x / 1.66x / 1.09x the 2^18 door's nodes (kiwipete / position-6 / startpos). T2 recovers most of that.
- **So T2's premise is real, but it is a remedy for table pressure.** It shares a question with ABC-258 (size) and ABC-257 (kept table), and the 100 ms read cannot see it.

## Kept entries cut under exact depth
- ADR-0056 D2 row T3 and EPIC-011 row T3 say that under exact-depth cutoffs "a kept entry almost never cuts". Measured with T3 alone, exact-depth cuts from earlier moves' entries were:
  - kiwipete game: 38 081 of 227 253 (17 %);
  - position-6 game: 35 051 of 151 274 (23 %).
- T3 alone still reads only 0.975x pooled at depth 8 (0.944x geometric mean at depth 6). ABC-209's NEUTRAL (+8.7 +/- 18.3) is not explained by "never cuts".

## Scope
Measurements only.

## Risks
- 2^14 stands in for pressure. It is not the 40/15 shape (fewer, longer searches), so the size of T2's gain at 2^18 / 40/15 is UNKNOWN - verify.
- Owed corrections: ADR-0056 D2's T3 rationale. ADR-0056 is not in this hop's fence; the next Architect hop on ADR-0056 owes it.
