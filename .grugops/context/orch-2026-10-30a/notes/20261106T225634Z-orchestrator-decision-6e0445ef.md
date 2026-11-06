---
id: 20261106T225634Z-orchestrator-decision-6e0445ef
kind: decision
by: orchestrator
at: 2026-11-06T22:56:34Z
verified_by: 
confidence: medium
refs:
  - ABC-291
  - NFR-008
  - ADR-0075
  - arch-ABC-291-n8/20261106T224309Z-architect-design-decision-61a939d3
  - qe-ABC-291/20261106T225544Z-qe-e2e-observation-2f762abf
supersedes: 20261106T223014Z-orchestrator-decision-a9e7118e
seal: sha256:8931dd48ab791a66623c40c06bd40eff69bfbef6cb6b6561bb49c885a4722889
---

# NFR-008 route on ABC-291 goes to the owner; "row move first" withdrawn

Supersedes …a9e7118e on the route only. Its monitor ruling, its host release and its "W is asked again" stand.

- **Withdrawn:** my row-move route. Rows merged to main first sit in both arms and buy nothing, so that form is ruled out. Rows riding the merge reach only the edge (−0.08 to −0.11 s, 53 to 82 %), and they are the last rows of 20 ms or more. The standing rule is for a lane at or above 9.6 s; H is 9.30 s.
- **QE's split:** the wall is mostly gaps before each file's first row. Fixed cost +0.02 to +0.03 s, high confidence. Production-tied +0.01 to +0.06 s, low confidence. At least +0.05 s is unresolved, in files with no changed line. A later term's cost is not readable from this one. Mean +0.133 s, se 0.056; firm on CPU, at the edge of 95 % on wall.
- **H3 not changed by me.** Going games first would change an order I ruled, after seeing this result. It moves no bar, but that is the owner's word, not mine.
- **Asked of the owner:** (a) games first, budget decided after; (b) ABC-291's leg moved to ≤ +0.20 s, this ticket only, a figure named after the read, stated so; (c) rows ride, with a held probe first. **Recommendation: (a), then (b) if C2′ is met.** A miss then closes the question with no rows spent and no bar moved. His silence decides nothing.
- Item 4's carry key is ruled only if rows ride. The extra diagnostic run is not ordered: it would not change the recommendation.
