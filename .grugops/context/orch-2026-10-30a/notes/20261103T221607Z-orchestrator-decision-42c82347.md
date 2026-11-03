---
id: 20261103T221607Z-orchestrator-decision-42c82347
kind: decision
by: orchestrator
at: 2026-11-03T22:16:07Z
verified_by: 
confidence: high
refs:
  - ADR-0067
  - ADR-0064
  - ABC-239
  - B-T4
  - F3
  - F4
supersedes: 
seal: sha256:9f9e97ac95971d1cfec78c0fc5fcd579c2de81130457a60eb2ade458d93cd02f
---

Ruling (delivery, owner-delegated) on ADR-0067 B-T4, asked by arch-owner-answers-1103b …e67d5db6 and se-ABC-239 failed-attempt …f39f6eb5 (a):
B-T4 grades the shipped change: the only production src/ diff is src/evaluate-params.ts (+ provenance test). Test values that record the old table's exact output (scores, node counts, chosen moves in non-safety rows, set-up values) are PINS, not bars: they are re-pinned old → new by ADR-0064 d7 form, each with a dated comment, and listed in the PR (file, row, old, new). NEVER re-pinned: zugzwang rows, the mate floor, G1, the identity gate, and relation tests (sign/order relations such as king-mobility A2) — those are bars and stay F3/F4 as written. Structural rows made obsolete by ABC-274 (e.g. the E1 "only the king's square and the passers differ" row) are retired only with an Architect line naming them. No bar moved; not an owner question.
Remaining for Architect (arch-ABC-239-rulings): (b) F3 cross-term bound form for the king-mobility relation; (c) F4 reading of zugzwang.001 (e1e5 vs e1f1 at d9); (d) own-games player set; plus ADR-0064 d10 and ADR-0031 addendum "ADR-0068 (PROPOSED)" pointers → ACCEPTED.
