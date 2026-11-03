Cause: engineer

# se-ABC-239 BLOCKED: the emitted set reddens 93 default-lane rows that B-T4's "one file plus the provenance row" assumes stay green. The candidate is frozen and was not handed to QE. STOP to Architect/Design

Software Engineer, task `se-ABC-239`. Candidate `da3f8599` on `grugops/ABC-239`, `src/evaluate-params.ts` sha256 `71610196…58e2` (B-T1/B-T2/B-T3 MET, data note). The tree below it, `03fcaaa0` (tool only, base table), is green: `npm test` 67 files, 2 589 passed.

**What ran on the candidate:** `npm test` gave **93 failed / 2 489 passed in 9 files**. Lint, typecheck and build are clean, and `TUNE_DEEP=1 vitest run tools/tune` passed 11 of 11. Each failing row, with its class: `.grugops/context/se-ABC-239/raw/out/candidate-npm-test-failures.txt`.

**The classes** (by reading each failure message, not by re-running):
1. **Value pins, 41 rows:** frozen scores, node counts or moves written at an earlier table. Files: `src/transposition.test.ts` (4), `src/search.ordering.test.ts` (2), `src/search.pvs-lmr.test.ts` (2), `src/search.futility.test.ts` (QE-268-b: 2), `src/engine.test.ts` (ABC-230 A1/A8, ABC-249: 7), `src/quiescence.test.ts` (A2's frozen value, the QE-frozen Q-SET/QP rows, the ABC-228/229 doors: 22), and `src/evaluate.taper.test.ts` B1 (c) (176 + 184 frozen `evaluateWithoutTaper` scores: 2). Earlier value tickets re-pinned this kind with a dated "RE-PINNED at ABC-…" comment (`ABC-215`, `ABC-228`).
2. **Value pin first, relation behind it, 43 rows:** taper B1 (d) ×6 and B1 (e) ×37. Each fails first on its frozen pre-ticket assertion (the untapered door's margin, `mainCentreMinusCorner`; the pair's `baseBonus` = E1's passed mg). The relation behind it (centre ≥ 20 cp; passers ≥ 1.5 × at phase ≤ 6, ≤ 1.25 × at ≥ 18) was not reached. B1 (e) "by array" fails on its relation at once: rank 2's passed mg is 0 (the fit's ≥ 0 bound), not > 0.
3. **Fixture premises, 6 rows:** E1-value-dependent set-ups. king-mobility A4's rig needs `evaluateWithoutMobility` = 0 and reads −3. B1 (a) needs "mg exactly 0 on the door" for M-negzero-a. QE-208-a needs ≥ 3 aborts inside a null subtree and reads 1. The other three are the "fixture bites" rows in ordering, futility and transposition (classed by name; see the list).
4. **A relation, 1 row (F3):** king-mobility A2, "the g-pawn on g6 instead of g2 scores strictly lower at equal material", reads +8. The fitted pawn table (g6 mg +29, g2 −31) outweighs the shelter term (10 / 0).
5. **E1's structural row, 1:** "only the king's square and the passers differ". Its own comment says a differing pair needs E2's blend first, which `ABC-274` delivered; the row was not retired there.
6. **B-T5, 1 row (F4):** `src/search.null-move.test.ts` A2 `zugzwang.001`. The shipped engine on a frozen clock to depth 9 plays **e1e5, not e1f1**. That is one of `ADR-0050` d9's 7 zugzwang rows, a graded play-safety bar.

**Why this is a stop, not a fix in this hop:**
- `ADR-0067` d6 and B-T4: "no test bar is edited by the tuner ticket", and the `src/` diff is `src/evaluate-params.ts` plus the `ABC-215` A2 replacement. Classes 1–3 and 5 (91 rows) cannot stay green under any changed value, so B-T4 as written cannot hold for any fitted set. The brief fences every other `src/` edit ("ask").
- F3 says the red relation "becomes a bound, one refit". The tool's bounds are box bounds (≥ 0) on single parameters. The relations here are linear inequalities across terms and positions: A2's g6 / g2 position pair, and B1 (e)'s eg ≥ ~1.67 × mg and eg ≤ 2 × mg by rank. Which constraint form a "bound" means is the Architect's to write before the one refit. I did not invent one. No set was re-fitted, and no configuration or λ was changed.
- `zugzwang.001` is B-T5 and falls under F4: "a defect check first. If real: NOT MET. Never a re-pin." **Defect check, tool side:** gate 0 misses on 1 476 629 keys, B-T3 byte-identical, the emission round-trip test green and A9 green. I found no tool defect. Whether e1e5 is a play-safety failure or a second sound move in that row is **`UNKNOWN - verify`** (QE/Architect). It was not re-pinned.

**Not run, on purpose (host time, and moot until ruled):** the deep lanes (taper, search, quiescence, futility, null-move, PVS/LMR, puzzle), so `G1` 54 / 58 and the mate floor are not read. B-T4's `G2` and `G3` beyond the default rows were not read. B-T5's futility audit, B-T6 `G6`, B-T7 and B-T8 were not read either. The deep lanes are forecast to show more frozen node counts (`ABC-269` B0's own counts, for example): `UNKNOWN - verify`.

**Asked of the Architect (each a ruling, none taken here):**
- (a) A re-pin policy for classes 1–3 and 5 on a tuned table: re-pin with a dated "RE-PINNED at ABC-239" line as `ABC-215` did, or route them through a frozen-table door. This amends B-T4 and d6.
- (b) What "a bound" means for class 4 and B1 (d)/(e)'s relations, so that the one F3 refit can run.
- (c) How `zugzwang.001` is read under F4.

Then one SE hop re-pins, refits once if (b) asks it, and hands to QE.
