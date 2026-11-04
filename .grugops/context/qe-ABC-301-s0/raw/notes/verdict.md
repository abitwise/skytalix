# qe-ABC-301-s0 VERDICT: scope 0 GREEN. P1's own-phase form is CONFIRMED as a correct specification of the same bar, not a bar moved after a red. The tracer deviation is ACCEPTED. P2 and P3 hold. No gap blocks the fit; QE-301-b is owed before the emission is trusted

QE/E2E, task `qe-ABC-301-s0`, on `grugops/qe-ABC-301-s0` from `grugops/ABC-301` `704e331f`. No `src/` or `tools/` edit, no game, no fit. Every run was under the host lock. The fit may be taken.

**1. P1: CONFIRMED. The written row was wrong, the build is right, and the fault in the row is QE's own.**
- **Where U fires.** `ADR-0070` d2 says "the phase stays the recursion's argument (cut C1), and the unstoppable rule reads phase = 0". So `passerTerms` fires U on the argument, and the seam passes `phaseOf`. `evaluateAtPhase`'s contract is that the argument IS `phaseOf(position)`.
- **So the written form compares two things that differ by design.** Forcing 0 on a position of phase 1–5 fires U on the hot side and not on the seam side. Those calls are outside the contract and no production caller makes them: `search.ts` (two sites) and `quiescence.ts` pass the carried phase, and `ABC-269` C1 P2's oracle walk holds it to `phaseOf` in the default lane.
- **Derived independently.** A separate parser of the FEN text and `ADR-0070` d1's words, with no call to `passerTerms`, predicted the forced form's misses: exactly the 13 ids, each ± 400, 0 disagreements over 44. The forced form reads 31 / 44 at the tip, as the Engineer reported.
- **The slip is in `…d0f7af61`.** QE's own `k1.ts` identity reads e_k with "U only when k = 0", that is, U at the argument. QE's gap note rewrote e_k as the seam's parts, which read `phaseOf`, and gave "w = 0" as the reason it was exact. That reason covers the blend and not U. The Architect and BA/PM copied the sentence faithfully.
- **Same bar.** Same 44 fixtures, same probed values, same seam, inside `withParametersForTest`, exact, no tolerance, `!==`. At k = 0 the row reduces to the ticket's equation. Nothing leaves the denominator.
- **Stronger, not weaker.** See the table in the results note. Every mutant the forced form sees, the own-phase row sees. It also kills H1, H3 and H4, which the forced form cannot see at all: a forced call always passes 0, and at w = 0 the blend has weight 1.
- **Rejected alternatives.** 14 / 14 on the phase-0 fixtures alone would move the denominator, and it misses H1, H3 and H4 too. Holding U at 0 on the phase > 0 fixtures keeps a forced call and so is blind to the same three (by reading, not run).
- **E14, E15, E16 and H1 die on the row** (`src/evaluate.passer.test.ts`, the file run per mutant): 34, 6, 6 and 13 fixtures red. E16 dies on this row alone.

**What the row would miss** (each read, none a defect):
- A hot-path fault at phases 6–23: no fixture is above phase 5 (`QE-301-a`). The gate on the emitted file sees it.
- A fault inside `passerTerms`: hot path and seam share it, so it cancels. K1 (c)'s frozen rows own that.
- A 1 cp fault above phase 0: on 6 of the 30 fixtures with k > 0, a step of + 1 or − 1 truncates away. The forced form would read those at full weight. It is the one thing the form gives up, and `ADR-0070` d1 names that resolution limit.
- A stale phase carried by the search: the C1 P2 oracle walk owns that.

**The owed line, for `bapm-lines-1104b` and the Architect's dated line under `ADR-0070` d4:** white's view, each fixture at k = `phaseOf(p)`, `evaluateAtPhase(p, k)` at the probed values equals mg + trunc((D + e) × (24 − k) / 24), where mg = `evaluateAtPhase(p, 24)` and D = `evaluateAtPhase(p, 0)` − mg at the shipped values, and e is the seam's white minus black at the probed values minus the same at the shipped values. Exact on 44 / 44. The bar's level does not move.

**2. P2: MET.** 0 callers, by the row and by a `git grep` of the whole tree outside the records (the two names appear in `src/evaluate.ts`, its test file and the fixture file's text only). 8 of 8 plants inside the row's reach went red, the planted file named. 8 more plants outside its reach stayed green: `QE-301-c`.

**3. P3: MET.** 17 value exports equal `main`'s, by QE's own comparator, U at 0. Typecheck 0 at the tip and with the emission in place. `TUNE_DEEP` 22 passed. **B-T1, re-run by QE: 0 misses over 1 494 610 keys, worst 0.9583 cp.** Scope 0's one hole here is that "value for value" reads the four new columns only at 0: `QE-301-b`.

**4. The tracer deviation: ACCEPTED.** It should have its dated line under `ADR-0067` d5.
- **d5's literal row cannot live in `tools/`.** `ABC-274` S3 bars every tools/ file from naming `withParametersForTest`, and P2 bars them from naming the seams. Moving the row to `src/` would pull the tool into the default lane, against the ticket's `NFR-008` line.
- **Nothing is unchecked on the fixtures.** The frozen record equals the live seam by K1 (c), default lane, at the probed values, and the fixture file is sha256-pinned by its own row. The two forms differ only when one of those is red.
- **QE ran d5's row as written**, from scratch, outside `tools/`: 0 misses on the 44 fixtures, and 0 misses on 132 762 positions (265 524 side rows at each of three value sets, U firing on 18 188 at the two sets with a U). The identity gate at those non-zero values: 0 misses, worst 0.9583 cp. This is the read B-T1 cannot give at 0.
- **Six further tracer mutants of QE's own (T8–T12, T14) are all red** on the frozen rows.
- **Condition:** the tracer row lives in `TUNE_DEEP` only, so that lane must read green at the fit commit. d5's second check, the gate on the emitted file, stands.

**5. Default lane: about +2.5 ms** (the P1 row 1.16 ms, the guard row + 1.30 ms, in-thread medians of seven alternating runs. 2 684 → 2 685 rows, 71 files, no new file, none in `src/cli.test.ts`, no row of ≥ 50 ms. The `NFR-008` budget itself is the gate's read: `QE-301-e`).

**Gates at the tip:** `npm test` 2 685 / 2 685 (at one worker, ungraded), lint clean, typecheck 0, build 0, skip count 0, `test-skip-integrity` No findings.
