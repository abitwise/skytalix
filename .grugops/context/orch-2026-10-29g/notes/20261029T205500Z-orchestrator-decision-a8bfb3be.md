---
id: 20261029T205500Z-orchestrator-decision-a8bfb3be
kind: decision
by: orchestrator
at: 2026-10-29T20:55:00Z
verified_by: 
confidence: high
refs:
  - arch-epic008-rd/…0c5d62f4
  - arch-epic008-rd/…9d172446
  - EPIC-008
  - RISK-EPIC008-03
  - ABC-208
  - ABC-215
  - ideas-2026-10-29 item 2
supersedes: 
seal: sha256:8a574208a8486127e9150266d022b2dc382db3c79785eeb9929d64903685773d
---

# arch-epic008-rd reviewed and merged (records only); the R gauntlet goes to the owner

**Review:**
- Branch head `ed6fb2ee`: 1 commit, 15 files, all under `.grugops/context/arch-epic008-rd/`. 0 host-path hits.
- Both notes carry seals. The Architect lacked the propose_note tool and called the same sanctioned writer (`context-io` admitAndAppend) directly; this is the QE `seal.mjs` precedent. LOW, recorded.
- Merged `--no-ff` to local main as `ff459d6c`; the trace row is appended.

**Ranking:**
1. Opponent dependence (RISK-EPIC008-03, strong form): the most likely cause, but not separable from 3, time per move.
2. Chance: unlikely, p ≈ 0.001–0.002 for a split this large if R and D measured the same thing.
3. Time per move: not separable from 1, and nothing points to it.

Excluded or disfavoured: host load and heat (Stockfish nodes/s flat, −1.2 %), openings and colours, artifact and build.

**M1:** NOT MET under every explanation, because clause 1 (≥ +100) fails even on D. Nothing was re-graded.

**Proposal to the owner (not queued; heat and hours are his):** an R gauntlet, information only unless he says it counts.
- Shas: `ba74b71d` (ABC-215 only), main and `3497aad2`.
- Setup: Stockfish 1 910, 3 000 ms, 200 games each, width 2.
- Cost: about 13.5 h plus 1 h, splittable into 3 runs of about 4.5 h. Heat as R1 and R2: about 82 °C median, 84–87 °C max.
- Cheaper cut: drop the `3497aad2` re-read, about 9 h plus 1 h.
- It answers whether the drop replicates, and ABC-215's share against ABC-208's.

**Feeds item 2 of the owner's ideas:** a value-changing change should get an outside-opponent reading at the product
budget before it merges. Policy is BA/PM's and the owner's; this goes into the deferred improvements epic.
