---
id: 20261103T125734Z-software-engineer-decision-22e25cea
kind: decision
by: software-engineer
at: 2026-11-03T12:57:34Z
verified_by: 
confidence: high (diff read back; value identity proved by A1/A2 with 0 mismatches); packed cost UNKNOWN - verify (A5 is QE's); seam UNKNOWN - verify with Architect
refs:
  - se-ABC-274
  - grugops/ABC-274
  - ABC-274
  - EPIC-011
  - E2-pre
  - ADR-0067
  - ADR-0064
  - F8
  - C1
  - P5
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A7
  - A8
  - A9
  - B0
  - G2
  - G3
  - G6
  - NFR-009
  - 128e3c6c
  - 54dee3f2
  - c131ecd0
  - src/evaluate.ts
  - src/evaluate.taper.test.ts
  - src/evaluate-params.ts
  - arch-fold-1103b/e16881f5
  - se-ABC-269-cut/20261103T112851Z-software-engineer-decision-8e00e712
supersedes: 
seal: sha256:aef938a53448007285f6583483d633e992f0ec28c0e9f97cf4c1d639f7626d4d
---

# se-ABC-274 design: the packed score. Every term but mobility is one int32 per entry, eg × 2^16 + mg, summed in one accumulator and split once after the walk. Mobility, being clamped, is a separate mg / eg pair. Δ = eg − mg now covers every term. The king's Δ is still read after the walk (C1's form, P5 untouched). `src/evaluate-params.ts` is byte-unchanged. A3's offset tables reach `evaluate` through one test-only seam, `withParametersForTest`

Software Engineer, task `se-ABC-274`, worktree `.claude/worktrees/se-ABC-274`, branch `grugops/ABC-274` from `main` `128e3c6c` (src identical to `54dee3f2`). This hop took no timing reading. A5 (`G2`) and A6 (`G6`) belong to QE.

## Form chosen: packed (`ADR-0067` d8, the recommended form)
- **`PACKED_PIECE_SQUARE`** (an `Int32Array` of 7 × 64) holds material plus the square table at `pieceType × 64 + table index`, packed. The walk reads **one entry and does one add per piece**. `main` read two (`PIECE_VALUE[type]` plus `PIECE_SQUARE_TABLE[type][i]`).
- **The king's entry packs its mg half into both halves.** Its Δ is still read after the walk from `KING_EG_DELTA`, in the exact text P5 pins. The walk therefore holds no phase, no `egDelta` and no `KING_EG_DELTA`, and C1 is intact: the phase stays an argument and `phaseOf` is called only at the roots.
- **The pawn terms** (doubled, isolated, passed) and **the three king-file terms** add packed constants (`PACKED_TERMS`, `PACKED_PASSED`). The pawn memo keeps its three 4-byte parts and its 448 KiB, so no pin moved. The parts are now doubled, isolated and passed, each packed. They used to be doubled+isolated mg, passed mg and passed eg.
- **The split:** `packed = score + structure + kingSafety`; `mg = (packed << 16) >> 16`; `eg = (packed − mg) / 65536`. This is exact while each half fits in int16 (A9).
- **Mobility stays outside the packed sum** (the ticket's default). Each half is clamped to its own cap: `mobilityScore` (mg) and `mobilityEg`. Δ gains `mobilityEg − mobilityScore`.
- **The blend is unchanged:** `mg + Math.trunc(egDelta × (D − w) / D)`, with `egDelta = (eg − mg) + (mobilityEg − mobilityScore) ± KING_EG_DELTA[…]`. trunc is used, never floor, and the flip is `0 − score`.
- **Load:** `loadParameters(PARAMETERS)` runs once at module load and builds every packed array from `src/evaluate-params.ts`, so that file is unchanged (scope 3). `VALUE_TABLES_FOR_TEST` keeps its 10 names and its arrays, so `ABC-215` A2 stays green. The unused `PIECE_SQUARE_TABLE` and the scalar `*_PENALTY` constants were removed.
- **`NFR-009`:** the arrays added total 1 860 bytes: 1 792 + 32 + 20 + 16. `KING_EG_DELTA`'s 256 bytes existed before. Everything is fixed at load, and nothing grows per search.

## The A3 seam (`UNKNOWN - verify` with the Architect, as the page asks)
- `withParametersForTest(parameters, run)` refills the packed arrays from a parameter object shaped like `src/evaluate-params.ts`. It empties the pawn memo, runs `run`, then rebuilds from the shipped table and empties the memo again in a `finally`. Production never calls it. `evaluate` never writes the arrays.
- This is the `clearPawnCacheForTest` / `evaluateWithoutMobility` kind of test-only export. It is not a search door or a switch (scope 4). The scalars sit in typed arrays (`PACKED_TERMS`, `MOBILITY_TERMS`) so that the seam can refill them. That costs one typed-array read per scalar per call (hoisted to locals in `kingExposure` and `pawnStructure`). A5 reads the cost.
- **Alternative not taken:** a check outside `src/`, as the prototype's tracer did. It would test a model of the blend, not `src/evaluate.ts`.
