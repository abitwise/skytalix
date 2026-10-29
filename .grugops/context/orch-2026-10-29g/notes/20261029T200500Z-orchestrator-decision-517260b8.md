---
id: 20261029T200500Z-orchestrator-decision-517260b8
kind: decision
by: orchestrator
at: 2026-10-29T20:05:00Z
verified_by: 
confidence: high
refs:
  - arch-epic008-rd
  - EPIC-008
  - RISK-EPIC008-03
  - orch-2026-10-29g/…ef6ab697
  - qe-epic008-q4c/…172ff9be
  - qe-epic008-close/…f361ab33
supersedes: 
seal: sha256:6921e30dd181e91670f94f0d8af0448a7d2a05393f3742c6b3cd8680a0fc9dec
---

# Owner word: the Architect investigates the R/D disagreement

**Owner (Olger Oeselg), 2026-10-29, in session:** "yes, have the architect investigate the R/D disagreement"

**Offered and accepted:** an investigation from the existing records only, with no new games.

**Routed:** `arch-epic008-rd` (Architect/Design), width 1/3.

**The question:** why do R and the 100-game D look disagree?
- R, against Stockfish 19 at 1 910, 3 000 ms: main is −82.9 ± 73.8 from `3497aad2`.
- D, self-play at 1 500 ms: main is +52.5 ± 46.8 from `3497aad2`.

**Output:**
- the candidate explanations, ranked, each with the evidence for and against it from the raw files;
- what each one would mean for M1 and the measuring method;
- one recommended next step. A step that needs new games or a long CPU run goes to the owner as a proposal, with its time and heat cost.

**Fences:**
- No harness runs and no games.
- Short single-process engine probes only: under 10 min of CPU in total, and none while another heavy run is going.
- No `src/`, `data/` or `tools/` edits.
- No re-grading of M1; that stays with BA/PM on the owner's word.
