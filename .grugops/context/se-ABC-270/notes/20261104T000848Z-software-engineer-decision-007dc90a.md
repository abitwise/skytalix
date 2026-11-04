---
id: 20261104T000848Z-software-engineer-decision-007dc90a
kind: decision
by: software-engineer
at: 2026-11-04T00:08:48Z
verified_by: 
confidence: high (diff read back; value and node identity proved by K0/K1 (b) with 0 mismatches); the test-only per-king export's form UNKNOWN - verify with the Architect
refs:
  - se-ABC-270
  - grugops/ABC-270
  - ABC-270
  - EPIC-011
  - E3a
  - ADR-0068
  - ADR-0067
  - ADR-0064
  - ADR-0028
  - ABC-083
  - ABC-274
  - K0
  - K1
  - K2
  - K3
  - K4
  - G2
  - G6
  - NFR-005
  - NFR-008
  - NFR-009
  - QE-270-a
  - 4cb84035
  - 8f086ee8
  - 795a6b61
  - 0f393c18
  - src/evaluate.ts
  - src/evaluate-params.ts
  - src/evaluate.queen-on.test.ts
  - src/evaluate.taper.test.ts
  - src/evaluate.king-mobility.test.ts
  - qe-ABC-270-freeze/20261103T222633Z-qe-e2e-decision-fa82b3f3
  - qe-ABC-270-freeze/20261103T222638Z-qe-e2e-observation-543b10d8
  - sha256:68769ea9712097ff1a366b6ad952a71376579fba94d6625c032062dd5e19c681
supersedes: 
seal: sha256:67b833a61e8da7602de2d0cc319e716689e32e27420734a7a76171357307e735
---

# se-ABC-270 design: ADR-0068 d1–d3 built as written. Three queen-on pairs at { 0, 0 } in `src/evaluate-params.ts`; the walk's `type === KING` test became `type >= QUEEN` and gathers the two queen flags; `kingExposure` adds the packed queen-on terms once per king, before its file loop. Value- and node-identical at 0. One deviation from the probe patch: the queen-on pairs live in `PACKED_TERMS` (indexes 5–7), loaded by `loadParameters` like every other term, so the tuner seam and `withParametersForTest` cover them

Software Engineer, task `se-ABC-270`, branch `grugops/ABC-270` from `main` `8f086ee8` (`src/` tree `4cb84035`, ADR-0068's probe tree and K0's base; `main`'s `src/` has not moved, so K0 is read once, against these counts).

## What was built (`ADR-0068` decisions 1–3)
- **Data (d1):** `KING_SHELTER_MISSING_QUEEN`, `KING_FILE_HALF_OPEN_QUEEN`, `KING_FILE_OPEN_QUEEN`, each `{ mg: 0, eg: 0 }`, below the three base pairs. Their comment carries the ADR's rule line verbatim: "start (prior): 0. The `ADR-0031` A1 rule, 2 × the base pair (× 3 in all), was probed and not shipped (`ADR-0068`)". The three base pairs keep E1's values.
- **Form (d2):** additive pairs, not a factor. While the enemy has at least one queen (a flag, never a count), each file term costs base + queen-on. Each pair is one linear feature: the king's file count × the enemy-queen flag.
- **Walk (d3):** the non-pawn branch's single compare `type === KING` became `type >= QUEEN` (QUEEN 5, KING 6 are the two highest types), with `type === KING` / else inside it. Knights, bishops and rooks pay the same one compare as before. No new per-piece operation; no extra board walk.
- **`kingExposure` (d3):** takes `enemyQueen: boolean`. Before the file loop it reads the three packed base terms and, if the flag is set, adds the three packed queen-on terms to them. The loop is byte-unchanged. Black's king gets `whiteQueen`, white's gets `blackQueen`.
- **Cut C1 intact:** the phase stays an argument; no phase add in the walk; `P5` untouched and green.
- **Packed:** the queen-on pairs are packed like the other scalar terms (eg × 2^16 + mg) and sit in `PACKED_TERMS` at 5–7, filled by `loadParameters`. So `ABC-274`'s seam `withParametersForTest` and the tuner's file shape (`EvaluationParameters = typeof evaluate-params`) cover them with no new mechanism. The probe kept them in a separate array set by a probe-only setter; that was scratch, and is not merged (ticket test note 3).

## The per-king read (`QE-270-a`)
- `kingExposureForTest(position)` → `{ white: { mg, eg }, black: { mg, eg } }`: each king's exposure, unpacked, by the same `kingExposure` and the same enemy-queen flags `evaluate` uses. It reads the packed arrays in force, so inside `withParametersForTest` it reads the test's table.
- TEST-ONLY, `ABC-274`'s seam style: exported from `src/evaluate.ts`, no production caller, does not call `loadParameters` (so `ABC-274` S3's exact `loadParameters(` call list still holds), and is not named by any `tools/` file. It finds the kings and queens by its own 0x88 scan (not the hot path). `UNKNOWN - verify` with the Architect whether this export is the form they want; QE asked only for "a test-only per-king read, in the house's `…ForTest` pattern".

## Scope 5, the re-find (`ADR-0068` d5)
- `ABC-083` A2 (b) and A3 (b) re-found at phase 24 in `src/evaluate.king-mobility.test.ts`: the same pawn shapes, equal material, plus a symmetric full set (each side R N B Q R on the back rank with the king on g1 / g8, a second N and B on d2 / e2 and d7 / e7). Chosen by a scratch search over the extra minor pair's squares, for the natural `rnbq1rk1/3nbppp` set-up that is green with a strict margin and red with a negative margin when zeroed.
- Readings (white's view, both on `main` and on the build, identical): A2 sheltered 0, g6 −3; with `KING_SHELTER_MISSING` zeroed g6 +12. A3 f5 +13, e5 +11; with `KING_FILE_HALF_OPEN` zeroed e5 +21. So each is green and red with its term zeroed (F5 does not fire).
- The two pawn-ending rows (phase 0) were replaced by their twins, as d5 says ("the pawn-ending rows go once their phase-24 twins are green on `main`"). Their FENs stay in `KING_POSITIONS` (A1's mirror corpus); the four twin FENs were added there too. No other expectation moved.
- Note for the record: on today's `main` the old A3 (b) pawn-ending row was no longer red with its term zeroed (the row's comment predates `ABC-215`'s tables: e5 reads −4 against f5 without the term). The twin fixes that.

## Deviations
- None from the ADR's decisions. Form detail: the flag add sits in an `if (enemyQueen)` block before the loop rather than the probe's three ternaries; same reads, same arithmetic.
