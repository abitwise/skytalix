---
id: 20261105T080350Z-orchestrator-decision-0f1ab02e
kind: decision
by: orchestrator
at: 2026-11-05T08:03:50Z
verified_by: 
confidence: high
refs:
  - ADR-0056
  - ADR-0067
  - ABC-289
  - ABC-303
  - 4844df37
  - 5f5833e3
supersedes: 
seal: sha256:fb261fe459024a9c18e2aea9026d036cb6cc33d034e7e09781f6acb9f68f3bae
---

Owner's answers, 2026-11-05, verbatim: "1. yes; 2. yes; 3. yes".
Asked and answered:
1. The fault rule also covers later reads, "like delta pruning and the new terms". CF1-CF10 widen from ABC-303 to later single-read reads and bundles.
2. A term that merged inside a bundle can open the door to a third tuning attempt. This relaxes the "its own read" reading in …5f5833e3. Every other limit stands: named before the miss, at most one more attempt, a third miss on this row closes tuning, and the attempt itself stays his call.
3. CF7 is confirmed: a clean C2' stands when the Levels test then fails and the fix does not change play.
