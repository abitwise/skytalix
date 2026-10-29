---
id: 20261029T073203Z-orchestrator-decision-d9513dc1
kind: decision
by: orchestrator
at: 2026-10-29T07:32:03Z
verified_by: 
confidence: high
refs:
  - EPIC-008
  - EPIC-008 Q4
  - bapm-close-EPIC-008/…e53131ba
  - qe-epic008-q4c
  - tools/rating/rating.ts
supersedes: 
seal: sha256:904c2aaa25a52f904e91c7ec540677ea7ded21604b3228e666e96c55e103e6bd
---

# Owner word: EPIC-008 Q4 → option (c); notify him before the run

**Owner (Olger Oeselg), 2026-10-29, in session:** "Q4 option c: before you run D of main vs 3497aad2 on this host then notify me, this last time heated the CPU so the fan was at max for many hours."

**Recorded:**
- Q4 = **(c)**: one D reading of main (src/data = b5c67ab7) against `3497aad2` on this host. 400 games at the frozen B = 1 500 ms, ALONE, about 6 h plus about 1 h for QE.
- **Hold:** `qe-epic008-q4c` does not spawn until the owner's explicit go. That go comes after he is notified of the heat profile and the open choices.
- **Not yet given by the owner:** (1) does the result count (re-grade M1), or is it information only? The epic page's default lean is information only. (2) Should the frozen `-concurrency 3` of D mode stay as it is? A lower width runs cooler but longer. It also needs an SE hop, because the width is hard-coded at `tools/rating/rating.ts:399`.

**Facts at 07:32Z:** host idle (load1 0.23), Tctl 31.8 °C, governor `powersave`. The R readings ran at `-concurrency 2` and peaked at 87 °C (QE `…f361ab33`). D at `-concurrency 3` puts 6 engine processes on the CPU. In D both builds share every game, so heat falls on both sides alike, unlike R's fixed order.
