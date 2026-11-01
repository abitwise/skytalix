---
id: 20261101T203909Z-software-engineer-observation-687c4af7
kind: observation
by: software-engineer
at: 2026-11-01T20:39:09Z
verified_by: 
confidence: high for the trace and shares; speed figures informal (not an ALONE read)
refs:
  - ABC-251
  - se-ABC-251
  - EPIC-010
  - ADR-0055
  - grugops/ABC-251
  - 51b803c0
  - arch-abc250-close/20261101T202347Z-architect-design-decision-a07418ac
  - src/position.ts
  - src/engine.ts
  - src/evaluate.ts
  - src/moves.ts
  - src/quiescence.ts
  - se-ABC-227
supersedes: 
seal: sha256:559a5bedd7d2e2d499fd27f0bf246f80ad1b201103b70526de4503631f4a5ce1
---

# ABC-251 profile evidence: self-time shares and TurboFan inlining at base main 51b803c0 (informal)

**Profile** (raw/analysis.txt, raw/callers.txt). chooseMove at 4 000 ms, `node --cpu-prof --cpu-prof-interval=200`, node v26.12.1, under the host lock, 20:30:24-20:30:41Z. Samples are counted only inside the chooseMove window. load1 was 1.42-1.50. cutechess-cli: 0. No vitest run: the one pgrep "vitest" hit is a foreign long-lived fake-oidc process whose path contains the word, and it was left alone.
- kiwipete runs 1/2: nps 867 515 / 863 419, depth 9. Self time: isBlack 2.16 / 2.46 %, pieceType 0.22 / 0.19 %, deepen 0.01 / 0.01 %, countNode 0.23 / 0.22 %.
- position-6 runs 1/2: nps 868 807 / 875 463, depth 10. Self time: isBlack 2.25 / 2.32 %, pieceType 0.34 / 0.24 %, deepen 0.01 / 0.03 %, countNode 0.11 / 0.13 %.
- Top frames are unchanged in kind from se-ABC-227: whiteMinusBlack 15.5-16.6 %, isSquareAttackedBy 14.0-15.4 %, squaresReached 8.7-9.9 %, raySliderAttacks, generateCaptures, generateMoves, kingExposure, kingSquareOf.
- Callers of the isBlack/pieceType samples (pooled share of all samples): squaresReached 0.54-0.57 %, whiteMinusBlack 0.58-0.67 % (with pieceType), raySliderAttacks 0.44-0.55 %, generateCaptures 0.32-0.45 %, addRayMoves 0.13-0.20 %, generateMoves 0.14-0.15 %, mvvLvaKey 0.05-0.07 % (pieceType). search.ts and apply.ts are at most 0.02 %.

**Inlining** (raw/inlining.txt). `--trace-turbo-inlining` on one 4 s kiwipete run: 68 considered, 68 inlined, 0 refused, 0 deopt or bailout lines. Every hot caller above is among the inlining targets.

**Attribution check** (raw/m.mjs, raw/m2.mjs). An inlined arithmetic helper is reported as its own frame (2 665 samples), and a non-inlined one too (1 602). A bare `(p & 8) !== 0` predicate fused into a branch draws 0 samples. So a frame's presence does not show a call. Here the 68/68 trace decides it.

**Informal speed probe** (raw/ab-runs.txt, raw/ab-summary.txt; informal, not A3). Hand-inlined scratch copy against base, interleaved, fresh processes, 4 s. 7 rounds on kiwipete and position-6, 4 on start. Tctl 72.6-78.1 C (42 C at each batch's first run). load1 1.04-1.40. cutechess 0.
- kiwipete: 869 819 vs 884 155, 1.016× (1.009 without the cold first pair).
- position-6: 881 607 vs 878 279, 0.996×.
- start: 680 880 vs 689 839, 1.013×.
- All are inside the run-to-run spread (2.2-4.9 %).

**Budget** (raw/budget.mjs). A replica of the deepen literal: the spread is fast, has the same map across doors, and differs in map from the written-out form. The profile's deepen self time is 0.01-0.03 %.
