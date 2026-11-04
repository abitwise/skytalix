---
id: 20261104T014043Z-software-engineer-decision-3a752adc
kind: decision
by: software-engineer
at: 2026-11-04T01:40:43Z
verified_by: 
confidence: high (code read back; TUNE_DEEP lane 17/17; B-T3 byte-identical over the bounded refit); the bounded-step method is an engineer's choice inside ruling (b), recorded for the Architect
refs:
  - se-ABC-239b
  - grugops/ABC-239b
  - ABC-239
  - ABC-270
  - ABC-279
  - EPIC-011
  - E2
  - ADR-0067
  - ADR-0068
  - ADR-0069
  - ADR-0048
  - ADR-0028
  - B-T0
  - B-T1
  - B-T2
  - B-T3
  - B-T4
  - B-T5
  - F3
  - F4
  - QE-270-e
  - NFR-008
  - a8fbade5
  - 625b75fe
  - 5ce4f870
  - def26997
  - 954d44fb
  - 8c03b713
  - 26d06118
  - arch-ABC-239-rulings/20261103T223637Z-architect-design-decision-2b428ce8
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
  - orch-2026-10-30a/20261103T223750Z-orchestrator-decision-912ba57d
  - orch-2026-10-30a/20261104T010343Z-orchestrator-decision-d7605102
  - se-ABC-239/20261103T220702Z-software-engineer-failed-attempt-f39f6eb5
  - tools/tune/tune.ts
  - tools/tune/tracer.ts
  - tools/tune/bounds.ts
  - tools/tune/tune.test.ts
  - src/evaluate-params.ts
  - src/evaluate.test.ts
  - src/evaluate.taper.test.ts
  - src/evaluate.king-mobility.test.ts
  - src/evaluate.pawns.test.ts
  - src/search.null-move.test.ts
supersedes: 
seal: sha256:dd2875139baa9bc803cafe6c00cda590158a14b53e18209eeba090c8a84b9368
---

# se-ABC-239b decisions: the tool on a `main` with `ABC-270` and Q1, per `ADR-0067` steps 0–2 and ruling (b)

Software Engineer, task `se-ABC-239b`, on `grugops/ABC-239b` from `main` `a8fbade5` (`ABC-270` merged `a81a6c7d`, Q1 `ABC-279` merged `7b70e268`). The tool commits `9eeb0314` and `03fcaaa0` were cherry-picked clean (`625b75fe`, `5ce4f870`); `da3f8599` was dropped. Every run named below ran under the host lock.

1. **Step 0 holds.** `ABC-270` and Q1 are on `main`. The quiet filter's record is still the one it names: its own literal `{ evasions: true, quietPromotions: true, taper: true }`, which is `RULES_TAPERED` (now `chooseMoveWithoutSeePruning`'s record). It has no `seePruning` field, and `quiesce` reads `rules.seePruning === true`, so Q1's switch is off in the filter (`ADR-0069` d6). A default-lane source row pins the literal (test note 5).
2. **The tracer traces `ABC-270`'s three queen-on features** (`def26997`): per king, each exposure count × the enemy-queen flag, white minus black, as terms 400–402 (`KING_SHELTER_MISSING_QUEEN`, `KING_FILE_HALF_OPEN_QUEEN`, `KING_FILE_OPEN_QUEEN`). `kingCounts` returns each king's base and queen-on counts; the K1 (c) row reads it on QE's 16 frozen positions against their frozen counts (d5's dated line 1).
3. **Free set** (d6's dated line): queen-on mg free and ≥ 0 (three new parameters, sign-bounded like the other penalties); queen-on eg has no parameter, so it stays at the base value 0. The rest of d6 is unchanged.
4. **`OWN_PLAYERS` is the six names** (ruling (d)): `skytalix`, `base`, `skytalix-a`, `skytalix-b`, `sky-a`, `sky-b`. The header lists them.
5. **F3's bound (ruling (b)).** `tools/tune/bounds.ts` holds the bound set as constants: test file, row name, Σ coef · `evaluate(fen)` (side to move) ≤ right side, strict or not. For each bound and configuration the tool fixes the margin before the fit:
   - ½ × Σ |sensitivity| over the quantities that rounding moves. A free scalar, a mobility weight and a C-F cell (its tied pair summed) are one quantity each. A C-S scale rounds per cell, so in C-S each cell is its own quantity. Mobility is taken unclamped, which is an upper bound;
   - plus |coef| for each position with 0 < w < 24 (the blend's trunc);
   - plus 1 if strict.
   The fit enforces aᵀz + c ≤ right side − margin. a and c come from the same `Linear` row form the loss uses, so the mobility clamp's active set is d4's.
6. **The solve.** Inside d4's projected Newton, a step with no bound row active is the box-only step, unchanged. So a row the fit never reaches leaves the result byte-identical (tool row (2)). A step that would cross a row, or a start that breaks one, solves the step's quadratic model under the rows and the box exactly, by Goldfarb and Idnani's dual active-set method (1983). It starts from the unconstrained Newton step, adds the most violated constraint (row or box), and drops an active constraint when its multiplier would turn negative ("a row whose μ < 0 leaves"). So the active rows hold as equalities, with no penalty term and no freeze. **Deviation from the first build of this step, recorded:** I first wrote a greedy pin-on-bind rule. On a fixture it pinned every parameter the row reads before it could release one, and the Schur system went singular. I replaced it with Goldfarb and Idnani's method, which terminates and handles an infeasible start. The ruling's KKT form (v, U, μ, Δ) is the same algebra.
7. **The bounds enter every fit of the stage:** the four inner fits, the full fit and the reported own-only fit. The fit stage stays one procedure with the bound set as an input. The inner rule (C-S / C-F, λ) is re-run under the bounds, never chosen on play. On this data the choice stayed C-F at λ 1e-8 (see the data note).
8. **Emission:** the three queen-on pairs are written in the file's present shape, after the king-file terms, with "eg held at 0". The values sha256 covers thirteen exports (the provenance row in `src/evaluate.test.ts` reads the same thirteen). The header lists the six players and each bound row: file, row, right side, margin, μ and a's nonzero terms.
9. **Tests outside the default lane** (`TUNE_DEEP=1`, 17 rows): the K1 (c) count row; `evaluateAt` equal to `evaluate` over G3's 184 and QE's queen pairs (an exact integer emulation of the blend, used to read a bound on a rounded set without `src/`); tool rows (1) and (3), where a fixture row that the box-only fit breaks is held on the rounded set, μ > 0, and two bounded runs give one file; tool row (2), where a row the box-only fit holds leaves the emitted values byte-identical. Default lane: the FEN source row (each bound FEN and row name literally in its test file) and the filter row.
10. **A pre-existing fixture row was corrected, not loosened.** "extract gates every kept row" asserted gate.checked = rows. It failed on this `main` with the untouched tool as well (checked on a scratch tree at `5ce4f870`). Q1 changed the depth-1 fixture games, and some validation keys now also occur in training. The true identity is gate.checked = rows + validation keys seen in training + Lichess leakage + cap, because each key is gated when first kept and some leave the rows afterwards. The row now asserts that equality.
11. **QE-270-e** (test-only, `954d44fb`, before the relation step): the two K1 (e) bite rows zero the base pair and its queen-on pair together.
