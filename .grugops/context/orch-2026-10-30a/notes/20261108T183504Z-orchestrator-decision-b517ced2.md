---
id: 20261108T183504Z-orchestrator-decision-b517ced2
kind: decision
by: orchestrator
at: 2026-11-08T18:35:04Z
verified_by: 
confidence: medium
refs:
  - ABC-298
  - ADR-0077
  - …cc298539
  - …fbca95f8
  - …a28aa29f
supersedes: 
seal: sha256:48b27aec073feda3a981470c360bb96cd45fd5a271bacf00aab9f2629436067c
---

## ADR-0077 merged PROPOSED; to the owner

Merged `grugops/arch-ABC-298` (tip `8f2e1190`) at `e2b43ae3`, path check clean. The Architect found my dispatched form (…5a155b2c's) not node-identical beyond remaining depth 2: the sort reads history and countermove cells the hash move's subtree can write from depth 3. He narrowed to depth 1–2 instead of stopping, and says so (…cc298539). I accept the narrowing as design, not a moved bar: identity is the bar, and the gate is how it is kept.

Order: owner answers; BA/PM page lines; an untimed count probe (STOP if C ÷ G < 0.048 on two of three boards, no held host); QE's freeze only on GO; my ancestor check; build; QE with S2 on a held host (≥ 1.03 on two boards, ≥ 1.00 on the third); no games. `kingExposure` stays out.

**To the owner, recommended:** 1 accept ADR-0077, yes — the count probe can stop it for a few minutes of lock and no held host, so the downside is small; 2 a stop or miss ends V3, no wider form, yes. Odds of the speed bar below even, by the Architect's judgement.
