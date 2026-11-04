# qe-ABC-271 K3 (`G2`, ≤ 1.05 ×) under PREREG `…c55891e0`: **MET, R = 1.0187** (r₁ 1.0042, r₂ 1.0332; controls 0.9832 / 1.0058, both in band; within one session spread of the bar). Reported, not graded: the endgame set reads **1.1246 / 1.1169 ×**, which reproduces the Engineer's 1.114 / 1.126 and sits above the probe's 1.084 / 1.086. In search on those endgames the per-node cost is 1.021 / 1.037 ×, with nodes, scores and moves identical to `main`

QE/E2E, task `qe-ABC-271`. Two sessions, each one `flock <scratch>/host-test.lock` hold, run in the order the PREREG fixes (s1 14:34:50Z–14:35:17Z, s2 14:35:42Z–14:36:10Z). Raw: `raw/out/g2-s1.out`, `g2-s2.out`, `timing.log`. Scripts: `raw/scripts/g2.ts`, `session.sh`, `nps.ts`, `npseg.ts`, `timing.sh`, at the sha256 the PREREG lists.

## Host gate (Tctl ≤ 60.0 °C, not relaxed)
- s1: the first poll read Tctl 67.1, load1 1.94. The second poll cleared at 48.8 °C, load1 1.74.
- s2: the first poll read 69.6. The second poll cleared at 48.4 °C, load1 1.71.
- Tctl rose to 79.1 / 78.4 during `G2`, which the gate does not read once a session starts. Node v26.12.1. The only foreign CPU users were `abtop` and three `claude` processes, recorded and not touched.

## Graded: the six perft roots (phases 24, 24, 4, 24, 24, 24)
| session | order | mean B / C / H (ns per call) | r_s = H / B | c_s = C / B | per-round min–max B / C / H |
|---|---|---|---:|---:|---|
| s1 | B, C, H | 308.42 / 303.22 / 309.70 | **1.0042** | 0.9832 | 300.8–320.4 / 302.2–305.3 / 308.7–310.8 |
| s2 | H, C, B | 301.56 / 303.31 / 311.57 | **1.0332** | 1.0058 | 299.9–302.9 / 301.5–306.2 / 310.5–312.8 |
- **R = (1.0042 + 1.0332) / 2 = 1.0187 ≤ 1.0500: MET.** |r₁ − r₂| = 0.029, under the 0.037 reference spread. |R − 1.0500| = 0.031 ≤ 0.037, so this verdict is "within one session spread". MET stays MET.
- Both controls are inside [0.970, 1.030], so neither session is void. s1's B arm had one slow round (320.4), which pulls r₁ down and c₁ toward the band's edge. It stays a reading: nothing drops a round.
- **What the graded figure measures (`QE-271-f`):** the E4a loop runs on none of the six roots (five are at phase 24, and the phase-4 root has no passer). This figure is the memo's two extra reads and the guard's compare. The Engineer's 1.0343 and the probe's 1.0269 measure the same thing.

## Reported, not graded
- **The endgame set** (the probe's six `egFens`, phases 6, 8, 8, 8, 3, 7, each with a passer):
  - eg_r 1.1246 (s1), 1.1169 (s2), mean 1.1207; eg_c 1.0090 / 1.0014.
  - This reproduces the Engineer's 1.1135 / 1.1256 on a gated host, so it is not an artefact of his ungated session. It is above the probe's 1.0842 / 1.086 and above `ADR-0070` d3's "about 1.085 ×".
  - Per call, H is about 25.5 ns slower than B (238.3 against 211.9 ns). That is the loop at value 0, which d3 says is paid in full.
- **The same endgames in search** (`npseg.ts`, `chooseMove` depth 9 on a frozen clock, about 960 000 nodes an arm a round):
  - ns per node H / B: **1.0214** (s1) and **1.0373** (s2).
  - **Every FEN's nodes, score and move are identical H against B** in both sessions (for example 328 717 / −249 and 119 556 / 550), so no F1 fires there.
  - The search pays a fraction of the per-call ratio, because evaluation is part of a node's cost and the memo absorbs repeated pawn shapes.
- **S2 nps** (`nps.ts`, `chooseMove` d8 on a frozen clock):
  - kiwipete H / B 1.0093 (s1), 1.0304 (s2); position-6 1.0088, 1.0161.
  - Node counts are **766 275 and 87 475 on both arms in every round**, equal to K0's d8.
- **Where this leaves F2:** F2 fires on the graded set only, and does not fire. The endgame cost is the open question for the Architect and the second pull, carried as `QE-271-f` in the gaps note. `ADR-0070` d3's named cut (the 128 × 128 distance table and the bit-scan) is the instrument for it.
