---
id: 20261111T044438Z-orchestrator-decision-152bb16f
kind: decision
by: orchestrator
at: 2026-11-11T04:44:38Z
verified_by: 
confidence: medium
refs:
  - ABC-317
  - README.md
  - 20261111T044345Z-qe-e2e-decision-75bd7076
  - 20261110T230239Z-qe-e2e-decision-181f12c9
  - 20261110T203458Z-orchestrator-decision-7ffdb8a5
supersedes: 
seal: sha256:2c93c61e6ce34a5b0b82d49c44db1755ecc83e762c8f324caa5ae6ae65b78e5f
---

ABC-317 B3, the projection ruling after the measured L3 and L4.

Measured: L3 1 909.1 ± 47.9 (E 1890, 0.33 s). L4 2 094.3 ± 47.9 (E 2040, 1 s). Both readings are inside the band.

**Finding.** The old time rule (+50–60 per doubling from 1 902.5 at 0.1 s) under-projects. L4 plus its 5 % blunder cost (10–14 per point) gives a no-blunder figure of 2 144–2 164 at 1 s. That implies about +73–79 per doubling from 0.1 s to 1 s.

**New method for L5–L7 (no blunders):**
- Anchor on L4's no-blunder figure at 1 s, 2 144–2 164.
- Add +50–75 per doubling beyond 1 s. This is less than the 73–79 measured below 1 s, on the usual rule that returns fall at longer times. The hedge "less at longer times" is restored by this.
- Results, rounded outward to tens, with no other padding (closes ABC-316 gap 2):
  - L5 (4 s): 2 244–2 314, so ~2 240–2 320.
  - L6 (5 s): 2 260–2 338, so ~2 260–2 340.
  - L7 (30 s): 2 390–2 532, so ~2 390–2 540.

**README table:**
- L1 1 499 ± 53, measured.
- L2 1 678 ± 49, measured.
- L3 1 909 ± 48, measured.
- L4 2 094 ± 48, measured.
- L5–L7 as above, projected.

The blunder-cost sentence goes, since no projected level blunders any more. The prose states the new method and that each level's Stockfish had the level's own time, whose effect on the scale is unmeasured. ABC-316's other gaps also close: L1 shows 1 499, no space in thousands, and a `[Unreleased]` link definition.

Confidence is medium: L5–L7 rest on one 1 s anchor (± 48) and an assumed per-doubling gain.
