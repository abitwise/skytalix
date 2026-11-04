---
id: 20261104T142541Z-orchestrator-decision-6c6fb0be
kind: decision
by: orchestrator
at: 2026-11-04T14:25:41Z
verified_by: 
confidence: high
refs:
  - ABC-283
  - ADR-0063
  - arch-ABC-283-mate/…05ef9fc9
  - R-283-LMR
supersedes: 
seal: sha256:1fea6d9e4083181d550954059d7835447b0a9c6712b0d02fd346beca69e0265a
---

arch-ABC-283-mate (ruling …05ef9fc9) finds the mechanism: history's negative cells, built from mate-band cutoffs, push the mating quiet move late, LMR reduces it, and there is no re-search. LMR's dependence on move order predates history.
The fix: K3, a quiet non-killer move's key is max(0, h).
- It holds the mate floor: 0/190, 0/188, and every older floor row.
- P0 is 6/6 byte-identical.
- Zugzwang 7/7; G1 54/58, none newly missed.
- Drift is 28 cp, inside ADR-0063's 42 cp limit. Without the fix the bundle drifted 44 cp, also a hidden F1 breach.
Ruling: K3 is ACCEPTED as the structural fix. It is not a tune: no history value moved.
- se-ABC-283-k3 merges grugops/arch-ABC-283-mate into grugops/ABC-283, a topic-branch merge with no rewrite, then applies build lines 1–5.
- The one test re-pin (the bundle order row) is listed old → new in the PR. It is a pin of the new ordering, not a bar.
- Then ABC-283 → In Review → qe-ABC-283: PREREG, then the single 100-game read at 100 ms, GAIN ≥ 50.0, plus the rulings in …3851bf43.
Residual risk R-283-LMR: the floor depends on quiet-move order through LMR; d6 still reads 2/209. If the d5 floor goes red again, the lever is LMR, not history. The risk is carried and not graded.
