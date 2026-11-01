---
id: 20261101T152518Z-orchestrator-decision-43098cef
kind: decision
by: orchestrator
at: 2026-11-01T15:25:18Z
verified_by: 
confidence: high
refs:
  - memory-bank/50-decisions/ADR-0056
  - ABC-255
  - ABC-256
  - EPIC-010
  - EPIC-011
  - arch-adr0056-100ms-fold
supersedes: 
seal: sha256:7bbfe50dc911103c6d1bb554073a07ab3a1788a2bfdc67744dc91502ddf3d584
---

OWNER word 2026-11-01 (verbatim): "1. b ; 2. ok ; 3. quick check can be with 0.5s difficulty. Make sure engine is not changed internally and it works on different difficulty settings."

Context: answers to the three calls raised after arch-adr0056-100ms-fold (merged 94f1504c).
1. **b** — per-epic read is 400 games HEAD-TO-HEAD (epic's closing build vs its starting build) at 100 ms, ~±24 Elo. Overrides ADR-0056 D5's 200+200 vs Stockfish shape. Outside-opponent check stays only as the occasional smoke (item 3) and the 40/15 claim reading.
2. **ok** — the GAIN (≥ 50.0/100) and NEUTRAL (≥ 43.0/100) bars of ADR-0056 D5 stand, with their stated blind spot.
3. The quick smoke vs Stockfish (10 games) is kept but runs at **0.5 s per move**, not 4 s. Orchestrator reading of "make sure engine is not changed internally and it works on different difficulty settings": the shorter control is harness/config only — no engine code path special-cased for the smoke or for 100 ms reads; and the validation must show the engine still plays correctly across its difficulty settings (skill levels / time controls), not only at the test control.

Folds owed: Architect (ADR-0056 D5/C3 per items 1 and 3), BA/PM (EPIC-010/011, ABC-255/256 per items 1 and 3), queued after bapm-100-400-rule hands back.
