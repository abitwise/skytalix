---
id: 20261108T181529Z-orchestrator-decision-a28aa29f
kind: decision
by: orchestrator
at: 2026-11-08T18:15:29Z
verified_by: 
confidence: medium
refs:
  - ABC-298
  - ABC-257
  - …5a155b2c
  - …0b4bc6ba
  - …569849c4
supersedes: 
seal: sha256:e48cc5105bf9c556730efb33e280bc7fe6c244d683cf72a034ba551370dde94f
---

## arch-search-rank merged; V3 written up for the owner

Merged `grugops/arch-search-rank` (tip `500b3e93`) at `efae70be`, path check clean. Pick: V3 (`ABC-298`) in its narrowest, node-identical form (hash move tried before generation), or none. T3 (`ABC-257`) second. X1 and X2 below 1 in 10 and 1 in 5; P5 unseen at 100 ms; P6 and T4 not live.

**My call (delivery, records only):** dispatch `arch-ABC-298` now to write the ADR, PROPOSED, so the owner decides on a concrete design and not a sketch. The owner chose step-by-step gains at 100 ms (…4d1e0382), and V3 is the one pick whose safety is an exact count. Acceptance stays his; no freeze, build or host time before it. d6's `kingExposure` cut may share V3's held timing window: the ADR says whether, as a separate arm, not bundled into V3's identity.
