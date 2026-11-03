---
id: 20261103T104753Z-software-engineer-decision-7445784f
kind: decision
by: software-engineer
at: 2026-11-03T10:47:53Z
verified_by: 
confidence: high on what was built (diff read back; B0 exact, cross-build 0 of 8 360); medium on the G2 miss magnitude (a single-host micro-benchmark on a shared box, two sessions 1.0711 / 1.0672, every variant 1.065-1.086); the F3 disposition is the Architect's
refs:
  - se-ABC-269
  - grugops/ABC-269
  - ABC-269
  - EPIC-011
  - E1
  - E3
  - ADR-0064
  - ADR-0061
  - ADR-0028
  - ADR-0056
  - ABC-231
  - ABC-232
  - ABC-215
  - ABC-268
  - ABC-228
  - ABC-229
  - ABC-230
  - ABC-249
  - ABC-170
  - ABC-208
  - B0
  - B1
  - B2
  - B3
  - B4
  - B6
  - F3
  - G1
  - G2
  - G3
  - G4
  - NFR-009
  - NFR-008
  - QE-269-a
  - QE-269-b
  - 58fa3eb4
  - b7a8fc3a
  - 8470d3f0
  - src/evaluate-params.ts
  - src/evaluate.ts
  - src/search.ts
  - src/engine.ts
  - src/quiescence.ts
  - src/evaluate.taper.test.ts
  - src/evaluate.taper-corpus.ts
  - arch-ABC-269-rule/20261103T093305Z-architect-design-decision-8ccb561f
  - qe-ABC-269-freeze/20261102T222017Z-qe-e2e-decision-1b856350
  - qe-ABC-269-freeze/20261102T222129Z-qe-e2e-observation-aea4ceba
  - arch-E1/20261102T215541Z-architect-design-decision-d8150777
supersedes: 
seal: sha256:b8695a467e31950665839f83efeab7d3b388c5a07cfe8110d2103cc7393af674
---

# se-ABC-269 design decisions: ADR-0064 d1–d7 built as written, delta form only. Every term is an mg/eg pair in the new data-only `src/evaluate-params.ts`; only the king square's eg half (40 − 15 m) and the passer eg half (2 ×) differ. Phase is gathered in the walk's non-pawn branch, the king Δ where the king square is found. `taper` is one switch in `Switches` / `Heuristics`, on in `search()` / `chooseMove` only. Three test-only doors. Two implementation choices are recorded below, plus one F3 STOP (G2)

Software Engineer, task `se-ABC-269`, branch `grugops/ABC-269` (worktree `.claude/worktrees/se-ABC-269`). The base `src/` is still tree `58fa3eb4` plus QE's fixture, so B0's counts apply as written and nothing is re-derived.

## Built (ADR-0064 decisions, by reference)
- **d4, the parameter table.** `src/evaluate-params.ts` is data only: no imports, no function, no call (a default-lane row checks this). It holds `PHASE_WEIGHT` [0,0,1,1,2,4,0], `PHASE_MG` 24, `PHASE_EG` 0, `MATERIAL`, `PST` (six pieces, 64 × 2 each), `PASSED`, `DOUBLED`, `ISOLATED`, the three king-safety pairs, `MOBILITY_WEIGHT` and `MOBILITY_CAP`. Every half is written out (≈ 800 numbers), each table keeps its rule in its comment. `src/evaluate.ts` derives its flat arrays from the table once, at load. It reads the mg half of every term whose halves are equal (d6). A row keeps all other pairs equal (`PASSED` and `PST.king` are the only ones that differ), so an E2 edit that makes another half differ reddens before it silently does nothing.
- **d1/d2, the blend.** `whiteMinusBlack(position, weight, pawnCache, taper)`. In the existing non-pawn branch, `phase += PHASE_WEIGHT[type]`. In the existing king branch, `egDelta ±= KING_EG_DELTA[tableIndex]`. At the end, `egDelta += passedEgPart − passedPart`, w = clamp(min(phase, 24) − PHASE_EG, 0, D), and the result is **`mg + Math.trunc(egDelta × (D − w) / D)`**. Only the delta form is built (QE-269-b). With `taper` false the result is mg exactly.
- **d3:** `KING_EG` = 40 − 15 m, and `PASSED.eg` = 2 × `PASSED.mg`.
- **d5:** `pawnCachePassedEg` is a third `Int32Array`. The memo is still keyed by the two masks, and `pawnCacheByteLength()` = 448 KiB.
- **d7, the switch and doors.**
  - `taper` is a field of `Switches` (`src/search.ts`) and `Heuristics` (`src/engine.ts`) only.
  - It is true in `search()` and `chooseMove`. It is false in every older door: 12 in search, 6 in engine.
  - `evaluateWithoutTaper(position)` is test-only, and it is also the evaluation every door reads.
  - `searchWithoutTaper` and `chooseMoveWithoutTaper` are the shipped literal with `taper: false`.
  - Headers: `src/evaluate.ts`'s "No tapering" and "Untapered by decision" now point to ADR-0064. `search.ts` and `engine.ts` name the switch.
- **`VALUE_TABLES_FOR_TEST`** gains `KING_TABLE_EG`, `PASSED_PAWN_BONUS` and `PASSED_PAWN_BONUS_EG`.

## Two implementation choices (deviations from nothing in the ADR; recorded per the role)
1. **The stand pat's switch is an optional `taper?: boolean` on `QuiescenceRules`.**
   - Absent or false reads `evaluateWithoutTaper`.
   - One new constant record, `RULES_TAPERED` (`{ evasions: true, quietPromotions: true, taper: true }`), sits in each recursion. It is picked first when `taper` is on (`const rules = X.taper ? RULES_TAPERED : …existing ternary…`).
   - **Why optional:** the four existing records and every test literal that calls `quiesce` directly stay byte-identical, so each is an older door by construction (the ladder rule).
   - **Cost:** `taper` on is assumed to come with both quiescence switches on. That holds on the only two entries that set it, and the switch-literal source row in `src/evaluate.taper.test.ts` pins it.
2. **`futilityNode` takes a sixth, required argument, `taper`.**
   - The recursions pass `switches.taper` / `budget.taper`. Direct test calls pass `true`.
   - **Why:** `searchWithoutTaper` keeps futility on, so the node test must read the untapered evaluation there to be node-equal to pre-ticket `search()`. Module state is forbidden (d7).
   - **Cost:** `ABC-268`'s source pins re-pin: `futilityNode.length` 5 → 6, and the call-site string gains `, X.taper`.

## F3 STOP (G2, B6): the cost premise misses on my reading. Routed to Architect/Design; no cost cut built
- **B6 bar:** the complete evaluation ≤ 1.05 × base per call, same session, `ABC-076`'s method.
- **My readings:** build against `main`'s `src/` (58fa3eb4) in one process, the six perft roots, 6 rounds alternating. **1.0711 and 1.0672** (two sessions), node v26.12.1, load1 ≈ 1.8–1.9.
- **Where the cost sits:**
  - A scratch variant without the walk's phase / king adds reads 1.003 ×, so the memo's third part and the blend are cheap.
  - The per-piece phase add is the cost.
  - Six value-identical micro-variants (Int32Array weights, phase by piece code, the king Δ after the walk, phase packed into the mobility sum, `| 0` for trunc) read 1.065–1.086. None meets 1.05 (`raw/out/g2-variants.txt`).
- **Node time (a report):** chooseMove d8, ns per node.
  - The build against `main`: +3–4 % in one session, +6–7 % in another. The host is shared.
  - `chooseMoveWithoutTaper` against `main` on the identical tree: +3.0 % / +3.4 %.
  - The design estimated 1–2 %.
- **Disposition (ADR-0064 F3):** STOP to Architect/Design.
  - F3 allows one value-identical cost cut (O1-e incremental phase, or a packed score). It is node-equal by B0, then one new reading of the bar that missed.
  - I did not build it. It is the Architect's to order, and it touches `Position` / make-unmake (O1-e) or the score representation.
  - QE may re-read B6 by its own method first. My reading is a single-host micro-benchmark.
- **Everything else in the build stands.** B0 is exact, and B1–B4 are met (the acceptance note).
