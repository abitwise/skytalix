---
id: 20261101T204914Z-software-engineer-observation-ba045718
kind: observation
by: software-engineer
at: 2026-11-01T20:49:14Z
verified_by: 
confidence: high for the shares and identity rows; speed figures informal (not an ALONE read)
refs:
  - ABC-253
  - se-ABC-253
  - EPIC-010
  - ADR-0055
  - grugops/ABC-253
  - d46ed7ec
  - src/zobrist.ts
  - src/transposition.ts
  - src/engine.ts
  - src/search.ts
  - .grugops/context/se-ABC-253/raw/
supersedes: 
seal: sha256:f38b1658845f902a925d59ab6a62dc6611ff2f11ac1291d87dc0e03ecdff94f1
---

# ABC-253 profile and informal probe evidence at base main d46ed7ec

All runs held the host lock. The only foreign process was a vitest from another repo (/app, platform-tooling-testing), left alone. load1 was 0.69-0.76 for the profile and 1.04-1.52 for the A/B. Tctl was 36.6 C before and 74-77 C during the A/B, under the 85 C stop. cutechess 0. Node v26.12.1.

- **Base profile** (raw/analysis-base.txt). chooseMove 4 s, 200 us sampling, samples inside the call window.
  - kiwipete: nps 866-879 k. zobristKeyAfterMove 0.81/0.87 %, probeTable 0.93/0.88 %, storeEntry 0.14/0.07 %, repeatsInPath 0.02/0.02 %, repeatsBeforeRoot 0.07/0.02 %, GC 1.05/1.04 %.
  - position-6: nps 887-888 k. zobristKeyAfterMove 0.81/0.79 %, probeTable 1.30/1.16 %, storeEntry 0.14/0.16 %, repeatsInPath 0.01/0.03 %, repeatsBeforeRoot 0.08/0.07 %, GC 1.15/1.14 %.
  - The top of the profile is evaluation and move generation: whiteMinusBlack ~16 %, isSquareAttackedBy ~14 %.
- **Prototype** (raw/patch.py, applied to a scratch copy of non-test src/). zobristHalvesAfterMove and zobristHalvesAfterNullMove write slot ply+1 of a Uint32Array of 2x(cap+1). The TT keys are a Uint32Array of 2x2^18: same 2 MiB, slot = lo & (2^18-1), the same slot as key & mask. probeHalves and storeHalves. repeatsInPath and repeatsBeforeRoot compare halves. priorKeys is converted to halves once per chooseMove.
- **Identity** (raw/ident.mts, raw/ident.txt). Informal and not A2: 6 perft roots x chooseMove budgets 3/5/400/3000 on a tick clock x priorKeys absent or 6 keys. Move, score, depth, nodes, elapsed and clock reads were 48/48 equal.
- **Prototype profile** (raw/analysis-probe.txt). kiwipete: zobristHalvesAfterMove 0.26 %, probeHalves 0.79 %, storeHalves 0.11 %, repeatsInPathH 0.04 %, GC 1.02 %. position-6: 0.28 / 0.95 / 0.11 / 0.03 %, GC 0.98 %.
- **Informal A/B** (raw/ab.sh, raw/ab-runs.txt, raw/ab-summary.txt). 5 interleaved rounds x 3 boards x {base, probe}, fresh processes, 4 s.
  - kiwipete: base median 871 611 (spread 5.5 %), probe 875 195 (3.4 %), 1.004x.
  - position-6: 877 035 (1.8 %) vs 870 125 (4.1 %), 0.992x.
  - start: 667 397 (2.0 %) vs 677 637 (5.9 %), 1.015x.
