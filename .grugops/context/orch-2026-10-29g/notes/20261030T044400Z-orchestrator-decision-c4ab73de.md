---
id: 20261030T044400Z-orchestrator-decision-c4ab73de
kind: decision
by: orchestrator
at: 2026-10-30T04:44:00Z
verified_by: 
confidence: high
refs:
  - OQ-228-1
  - ADR-0053
  - ADR-0045
  - ADR-0020
  - ABC-228
  - ABC-230
  - EPIC-010
  - arch-ABC-230-reading/20261029T213529Z-architect-design-decision-90a3aa31
supersedes: 
seal: sha256:5d0f99fb402cb7a42de91d685f8d5dd42b334f4d93a953581e564470912e841e
---

The owner's answers of 2026-10-30, in session, verbatim: "QQ-228-1: ii ; Q3: c".

Asked against these choices, as the Orchestrator put them in session:
- "(i) only the depth test gets 4 s ... (ii) level 5 itself gets 4 s per move";
- Q3: "(a) keep, (b) ep-legal key, (c) normalise only when comparing against the game's earlier positions".

**OQ-228-1 → (ii).** It is conditional and applies only if ABC-228's re-forecast (ADR-0053 decision 9, A8) still misses G6 on main with ABC-235/240. If it does, level 5's per-move time goes from 3 000 to 4 000 ms. That changes the owner-accepted ADR-0045, so G9 (`src/levels.ts` unchanged) no longer holds for that ticket. The R reference frame (frozen 3 000 ms) and every level-5 comparison move with it. The owner has already given his word for this case; the ADR and ticket records must spell out the consequences before any such build. If the forecast meets G6, nothing changes.

**Q3 → (c).** The ep file is removed from the oldest key of the reversible window when that position has no ep capture. This is used by the prior-key builder and by history.ts's game-end count, so both halves go together (arch-ABC-230-reading …90a3aa31 § 3). The hash is unchanged. It amends ADR-0020 d2's consequence on the owner's word, it is value-changing (smoke pair), and its size is S.

Delivery (mine):
- (c) is a new ticket built after ABC-230 merges, with its own smoke. ABC-230 stays as folded and is not re-scoped mid-build.
- Routing:
  - `se-ABC-230` now;
  - `arch-q3c-oq228ii`: records only. The Q3 (c) design goes in as an ADR-0020 amendment, accepted on this note, and (ii) with its consequences is recorded in ADR-0053;
  - then BA/PM cuts the Q3 (c) ticket and folds (ii) into ABC-228.
