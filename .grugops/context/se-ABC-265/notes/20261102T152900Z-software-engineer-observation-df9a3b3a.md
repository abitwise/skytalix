---
id: 20261102T152900Z-software-engineer-observation-df9a3b3a
kind: observation
by: software-engineer
at: 2026-11-02T15:29:00Z
verified_by: 
confidence: high: deterministic cross-build and unit readings under the lock; G6/profile are SE readings, graded G6 is QE's; per-call figures are estimates
refs:
  - se-ABC-265
  - ABC-265
  - EPIC-011
  - ADR-0025
  - ADR-0057
  - ADR-0026
  - ADR-0059
  - ABC-081
  - ABC-122
  - ABC-208
  - ABC-266
  - NFR-005
  - NFR-009
  - NFR-008
  - grugops/ABC-265
  - e5694864
  - 94be445f
  - src/transposition.ts
  - src/transposition.shared.test.ts
  - arch-ABC-265/20261102T143310Z-architect-design-decision-e396e5ab
supersedes: 
seal: sha256:47ca58cfd2900b3b0a6264d1765a76e844b3d69bb6003f3ec85754a8d63a2940
---

# se-ABC-265 acceptance: A1, A2 (incl. T10 x2), A3, A4, A5 all met as read; ABC-081/122/208 rows ran unedited

Head `e5694864` against base `main` `94be445f`. Every run held `flock host-test.lock`. Raw evidence in `raw/`.

- **A1 (layout): MET.** `src/transposition.shared.test.ts` rows: buffer is a `SharedArrayBuffer` of **4 194 304 B** and `tableByteLength()` 4 194 304, same buffer across clears; source rows (comments stripped): no `BigUint64Array`/`BigInt64Array`, no `Atomics`; `storeEntry` body writes `[2, 3, 0, 1]`; `bigint` signatures for `probeTable`/`storeEntry`; word layout read through the handle (`w0^w2 = keyLo`, `w1^w3 = keyHi`, `w3|0 = score`), clear zeroes the slot. Typecheck 0.
- **A2 (XOR check): MET.** Rows: K hits returning move, bound (lower bound cuts at beta only), depth (only at 4) and score; K′ (same slot, other keyHi) misses; K″ (keyLo differs above the mask) misses; torn slot both mixes (A0,A1,B2,B3 and B0,B1,A2,A3) misses for A and B, and each hits again when restored whole; keyLo and keyHi both bit 31 set hits. **T10:** K stored exact at d=5, s_K=123, probed; K′'s four words (from a real store, written through the handle in order 2,3,0,1) overwrite the slot; `tableCutoff(slot, 5, …)` returns **123** in both cases — K′ exact at d with −456, and K′ at d+1 (non-vacuity: the slot verifiably holds K′ before the cutoff).
- **Planted defects (each red, source restored after; `raw/plants.txt`):** P1 live score read in `tableCutoff` → red the T10 score row only; P2 live depth read → red the T10 depth row only; P3 no XOR (raw key halves stored and compared) → red the layout row, the torn-slot row and the T10 score row; P4 keyHi equation dropped → red the K′/K″ row; P5 signed compare (no `>>> 0`) → red the bit-31 row; P6 store order 0,1,2,3 → red the store-order source row.
- **A3 (identity, G4, T8): MET.** Out of tree, plain node, base tree `94be445f` vs head (`raw/scripts/a3.mjs`, `raw/a3.txt`). ABC-078 A3 corpus = 276 positions (12 roots + in-progress children, se-ABC-264's build). **0 differ** on every set, nodes/score/move(/depth):
  - `search()` d1–4: 1 104 rows (sha `98c55487…`, equal to se-ABC-264's base sha); `chooseMove` fixed to 1–4: 1 104 rows;
  - perft roots: `search()` d5–7 18 rows, `chooseMove` fixed to 5–8 24 rows;
  - every door, self vs self: 11 `searchWithout*` (d1–3; the two pruning-free doors d1–2) and 5 `chooseMoveWithout*` (to 4); door sets identical in both builds;
  - **12 186 fixed-depth rows, 149 872 031 head nodes, all equal**; plus 48 tick-clock `chooseMove` rows (6 roots × 3/5/400/3000 ticks × prior none/6), 0 differ.
  - A first run was stopped by me at the pruning-free doors at d3 (full-width, too slow); its completed lines (`raw/a3-run1-partial.txt`) equal the rerun.
- **ABC-081 / ABC-122 / ABC-208 rows: unedited, green.** No test file other than the new one was touched. Default lane: 10 files holding those ids, 469/469. Deep: `transposition` SEARCH_DEEP 40/40, ENGINE_DEEP 26/26 (incl. ABC-081 A7 memory row); `search.null-move` SEARCH_DEEP 44/44; `search.pvs-lmr` SEARCH_DEEP 29/29; `search` SEARCH_DEEP 57/57; `engine` ENGINE_DEEP 78/78 (178 s). No stop for an Architect ruling was needed.
- **A4 (cost, G6, T9): MET (SE reading; graded G6 is QE's).** 5 interleaved rounds, fresh process, `chooseMove` 4 000 ms real clock, wait-clear before each read (QE's g6.mjs/host.mjs/timed.mjs/grade56.mjs, unchanged), 15:16–15:23Z: kiwipete base 9 9 8 9 8 / head 8 9 9 9 9, median **9 / 9**; position-6 base 10×5 / head 10×5, median **10 / 10**; min 8, 0 below 7. Median nodes base/head: kiwipete 3 495 661 / 3 516 141; position-6 3 486 491 / 3 541 787. F2 does not fire.
- **A4 profile (reported, not graded; settles D2.3's cost UNKNOWN):** se-ABC-253's `profile.sh`/`run.mts`/`analyse.mts` ran unchanged on this layout. Base then head, 2 runs a board, 4 s. Self-time share base → head: kiwipete `probeTable` 0.87/0.89 % → 0.98/0.84 %, `storeEntry` 0.11/0.09 % → 0.20/0.20 %; position-6 `probeTable` 1.18/0.99 % → 1.23/1.08 %, `storeEntry` 0.11/0.11 % → 0.31/0.29 %. Per call (share × elapsed ÷ calls, calls from a counted fixed-depth run: kiwipete 0.0636 probes and 0.0367 stores a node, position-6 0.0859 / 0.0504 — an estimate): `probeTable` ~161 → ~164 ns (kiwipete), ~145 → ~154 ns (position-6); `storeEntry` ~32 → ~63 ns, ~25 → ~68 ns. So the store about doubles, the probe is flat within noise, and the pair moves from ≈1.0–1.3 % to ≈1.0–1.5 % of samples. Host: load1 0.64–0.83; a foreign `/app` node service whose path contains "vitest" counted 1 by profile.sh's loose pattern throughout (not a test run; G6's bracketed pattern does not match it).
- **A5 (memory, G7): MET as read.** `byteLength` 4 194 304; ABC-081 A7 row (ENGINE_DEEP; heapUsed and arrayBuffers growth ≤ 1 MiB between 1 s and 4 s) green unedited. The graded G7 reading is QE's.
- **A7:** none owed (Orchestrator's ruling, no S2).
