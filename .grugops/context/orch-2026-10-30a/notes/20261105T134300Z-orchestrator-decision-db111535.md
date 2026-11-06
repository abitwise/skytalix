---
id: 20261105T134300Z-orchestrator-decision-db111535
kind: decision
by: orchestrator
at: 2026-11-05T13:43:00Z
verified_by: 
confidence: medium
refs:
  - ABC-307
  - ABC-154
  - AR-154-TWO-POINT-CONTROL
  - ABC-291
  - ADR-0046
supersedes: 
seal: sha256:2f125e78e6fefc24243692747c850d7f9d17de1ee016156f957e0a331235402f
---

Rulings on arch-ABC-307-reads (…727e0d0c):
1. C1 (d): the Architect's option (a) with a condition. This sits close to my own "no waiver on a close figure" (…f40ce634 ruling 1), so the reason is stated. It is not a close figure. The sealed clause asked whether the move cost a kill. The same row alone at base also passes MC1, because MC1's kill depends on how many sessions ran first, so no tree could meet (d) on that mutant. That base read came after the seal, which is why it does not stand alone: MC1 is ruled lane-only, C1 (d) reads on M6, and QE at A7 adds one order-independent form of MC1 and reads it at base and tip, in the hop it already runs. A miss there is a STOP. Row 10 closes on this line.
2. AR-154-TWO-POINT-CONTROL: I do not take the recommendation. The acceptance's own reason was that riding along with the next edit costs nothing, and this is that edit. Moving the trio without its recorded carry would waive a sealed trigger. F1 to F4 ride on ABC-307, F1 in the deep lane, so qe-hop deep reads 36 and A5 holds.
3. A6 replaced by the 11 ms reading; any K but B1 comes to me. The margin (592 against 581 at the sealed scale; 569 on an unsealed scale) is thinner than the noise. A9's −0.215 s stays a target, not a bar. If the lane reads ≥ 9.6 s after all budgets, the standing rule applies: row move first, owner if the next graded read is still ≥ 9.6 s.

Next: bapm-ABC-307-lines, then Ready and se-ABC-307. The lock is free until the build, so arch-ABC-291-probe goes now.
