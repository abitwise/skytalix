---
id: 20261102T144006Z-architect-design-observation-080ee7d4
kind: observation
by: architect-design
at: 2026-11-02T14:40:06Z
verified_by: 
confidence: documented (sources read 2026-11-02) or arithmetic, as tagged in ADR-0057 D8
refs:
  - arch-accel-review
  - grugops/arch-accel-review
  - 2ef3aadc
  - EPIC-011
  - ADR-0057
  - ADR-0056
  - ADR-0055
  - ADR-0025
  - ADR-0026
  - ADR-0044
  - ABC-263
  - ABC-265
  - ABC-266
  - ABC-267
  - ABC-236
  - memory-bank/analysis/using-npu-or-gpu-for-search-algorithm.md
  - f0a1b494
  - OQ-5
  - OQ-6
  - OQ-7
  - OQ-8
supersedes: 
seal: sha256:4bd4ffb1b23bb900314a1967794b1d6919445d3eb81b4913835d45f69e029907
---

# Claim ledger summary for the Gemini analysis, open items, and owner questions (ADR-0057 D8.2-D8.9)

## Checked and settled this hop
- verified: alpha-beta best case ~b^(d/2); redundant sibling work without a bound; physically shared DRAM; 890M LDS 128 KiB (ROCm table, granularity unstated); XDNA 2 50 INT8 TOPS; NPU static-graph limit on the reachable ORT path; 1/40 us = 25 000 per s (ours worse: 15 000-22 000).
- contradicted: 1-cycle __shfl_sync as written (CUDA; WGSL subgroups behind enable, wave 32 or 64); zero-copy 80-120 ns CPU<->device from Node.js; 128-bit atomics in WebGPU; NNUE fits on-chip (890M); 10-15M NPS CPU; 85 % as a constant; TT injection into our table; C's 2-ply formula; starting advice on this host.
- UNKNOWN - verify (with settle in D8.9): 890M memory latencies, subgroups exposure on webgpu 0.6.2/RADV, persistent-kernel progress and amdgpu job timeout, MaxPool placement on Vitis AI EP, XDNA tile programmability, all Elo/NPS figures (no source), lazy-evaluation worth.

## Owner questions (D8.8)
- OQ-7 re-asks OQ-5 (render group): recommended no.
- OQ-8 re-asks OQ-6 (neural net): recommended later.
- Unanswered means OQ-5 no and OQ-6 later stand.

## Scope
Records only. ABC-264 (44.0/100, not merged) not relied on.

## Risks
None blocking; no ticket waits on OQ-7/OQ-8.
