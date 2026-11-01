---
id: 20261101T201645Z-orchestrator-decision-d2571be5
kind: decision
by: orchestrator
at: 2026-11-01T20:16:45Z
verified_by: 
confidence: medium
refs:
  - ABC-250
  - ABC-251
  - ABC-252
  - memory-bank/50-decisions/ADR-0055
  - qe-ABC-250
  - QE-250-a
supersedes: 
seal: sha256:de947267a5822570b231a0198c87067e4b962287d4b77adf0c2ed1ed40798871
---

ABC-250 routing decision (delivery, under owner delegation 2026-10-22): **ABC-250 is CLOSED NOT MERGED (dropped by routing), NOT a graded miss.**

Facts: qe-ABC-250 (verdict …4fe9c469) is UNRESOLVED on A4 (kiwipete and start VOID on spread/agreement; position-6 valid 1.111 < 1.25). Everything else green (A1, A2, A3/G4, A5 search guard ~1.00, G1, G5–G9). GO needs two of three boards ≥ 1.25; position-6 is validly below 1.25 and no kiwipete pair in either schedule reached 1.25 (max 1.217), so GO would need a board whose pairs never reached the bar. HOLD and NO-GO end identically on the page (not merged, dropped). A further ALONE read needs an Architect cool-down rule beyond D3-V2 (QE-250-a) plus ~40 min host time, for an outcome whose only reachable branches are UNRESOLVED or drop. The search gains nothing from ABC-250 alone (A5 ~1.00×); the SE profile shows allocation was ~4 % of perft time after ABC-254.

Decision: stop spending reads; apply the page's miss consequences as a routing choice — ABC-250 not merged, branch grugops/ABC-250 kept (reversible); ABC-251 narrows to O1-c alone; ABC-252 dropped. The record must say "not graded — closed by routing", never "missed the bar". Reversal path: a future ticket may revive the branch with an Architect-ruled read method. Not escalated: the fallback was pre-agreed on the ABC-250 page and ADR-0055; no NFR, scope or requirement moves.
