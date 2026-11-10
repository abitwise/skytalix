---
id: 20261110T181122Z-orchestrator-decision-bce17f44
kind: decision
by: orchestrator
at: 2026-11-10T18:11:22Z
verified_by: 
confidence: medium
refs:
  - ABC-316
  - README.md
  - 20261110T172339Z-qe-e2e-decision-f44a427d
  - 20261110T153717Z-orchestrator-decision-20c41f8c
supersedes: 
seal: sha256:ac50407651d9be433997fffb2d22710524b23a6ce8e46987c2accac05f885f8e
---

Owner, 2026-11-10, while the L2 step runs: "meanwhile update readme with new projections." This widens ABC-316's A4: L3 and L4 get new projections from the measured blunder cost, not only the L1 and L2 cells.

Method (projection, not measurement):
- **Base without blunders at time t:** B(t) = 1902.5 + 50–60 × log2(t / 0.1 s). This is the README's existing assumption.
- **Blunder cost per point of blunder rate,** from the two readings:
  - L1: 1499.5 measured against B(0.1) 1902.5, so about 400 for 40 %, or 10.1 per point.
  - L2: 1716 against B(0.18) ≈ 1945–1953. This is provisional, because L2 is outside the band at E 1450; it gives about 11.5 per point.
  - Used: 10–12 per point, assumed linear in the rate.
- **L3** (0.33 s, 10 %): about 1868–1905 before anchor error. README: ~1850–1925.
- **L4** (1 s, 5 %): about 2008–2051. README: ~2000–2075.
- **L5–L7:** unchanged (no blunders, so the time rule alone), ~2150–2250, ~2170–2270 and ~2300–2450.
- **Cells:** L1 is measured, 1499.5 ± 53.4. L2 takes the E′ 1720 step's figure when it lands, labelled as measured. Until then it is provisional, not shipped as measured.

Confidence is medium: there are two blunder points, the linearity is assumed, and the anchor errors are about ±50 to ±65.
