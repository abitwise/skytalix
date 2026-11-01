---
id: 20261101T201630Z-orchestrator-decision-1f5e3b27
kind: decision
by: orchestrator
at: 2026-11-01T20:16:30Z
verified_by: 
confidence: high
refs:
  - memory-bank/50-decisions/ADR-0056
  - EPIC-010
  - EPIC-011
  - qe-ABC-255
supersedes: 
seal: sha256:9a7868c5fc08008f9a910aeda8340c0a5f1ea80df2f61ad14b01edc99d8ae1e4
---

OWNER word 2026-11-01 (verbatim): "ok set to 1650 and if you see in the future we can raise it then let's raise."

Ruling recorded: the 10-game smoke vs Stockfish at 0.5 s keeps UCI_Elo 1650 (ADR-0056 owner-answers fold, S′). Standing instruction: raise E when pooled smoke evidence shows it is too easy — operationalised by the existing re-pin rule (pooled smoke score leaves 60–85 % over ≥ 30 games → re-pin E upward). First reading: qe-ABC-255 A5 9/10 (0.90). No owner ask needed for an upward re-pin under that rule.
