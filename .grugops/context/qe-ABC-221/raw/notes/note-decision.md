# qe-ABC-221 verdict: PASS_WITH_GAPS at `c48a6f83` (base `d58f2d77`). A1–A12 MET. 21/21 plants as pre-registered. Oracle 78 717 / 0 FAIL. `G8` H 9.84 s ≤ 10 (tranche 2 fires on the raw median, on a slowed host). One LOW and two INFO; none blocks. This verdict signs UAT

- **ALONE**, beside a records-only Security/NFR hop.
- PREREG `6d7f2c24` was committed before any head run. Deviations after the PREREG are marked where they occur, all in
  the timing note.
- Not merged, nothing pushed.

## Acceptance (each read against the ticket's words, not the implementation)
- **A1 MET.**
  - The three-value line is byte-exact, after the byte-identical `Skill Level` line and before `uciok`. The unit row,
    `UCI_DEEP` and the probe's stdout all show it.
  - `setoption … uci-clock-mode` is silent (oracle setup; the probe shows no `info string`).
  - The `ABC-220` A10 refusals hold with the three-value text.
  - It is off by default: P1 matches base for `TimeMode` unset on 4 914 records.
  - Skill Level is not read: S1, and BLUNDERCM / LEVELCAPCM go red.
- **A2 MET.** The row is green and the budget is `min(59 500, C)` on every move (oracle O1). Figures: first 22 375,
  1 069 left, 0.99881 used, re-derived by arithmetic in `periods.mjs`. NOSHARECM, CAPSWAP, LEVELCAPCM and MODEASLEVEL
  turn it red.
- **A3 MET.** Move 7 gets 26 341 ms, 1 069 ms are left, and 0.99881 is used.
- **A4 MET.** Each period ends at 1 069 ms, and the periods use 0.99881 / 1.0 / 1.0.
- **A5 MET.**
  - `go wtime 3000 btime 3000 movestogo 1` → 1 900, leaving 1 069.
  - `wtime 800` → 1 (FLOORCM turns it red).
  - On the real engine at step 10: depth 1, `time` 20, 3 readings (census).
  - Gap: the hard stop is not discriminated in the mode (QE-221-a).
- **A6 MET on its bound.** On A6 as worded every move leaves ≥ 1 000 ms, and 17 205 ms are left after move 80. The
  "(≥ 117 s)" parenthetical describes alloc.txt's other shape (117 735 after move 40). SE-221-a is CONFIRMED, for BA/PM's
  fold.
- **A7 MET.**
  - 3600000/40 → 59 500 (C = 89 875); `movetime 90000` → 59 500; `movetime 5000` → 5 000; `go` and `go infinite` →
    22 000.
  - The real A7 row reads `time` 65 000, in [59 500, 69 500].
  - CLAMP32 turns the A7 real row red, as the brief requires.
  - The deadline is ≤ start + 60 000 on the real clock (A10's walls ≤ 59 500.8 ms).
- **A8 MET.**
  - `git diff`: `LEVELS`, `DEFAULT_LEVEL` and the Skill Level line are byte-equal. `HARD_CEILING_MS` 60 000 is
    `engine.ts`'s only code change. `levels.ts`, `search.ts`, `uci.ts` and the CLI files are byte-identical.
  - P1: `level` and `simple-tournament` equal base on 14 742 `go` records, budgets, effective clamped budgets, lines and
    draws.
  - Every level budget is under both clamps.
  - `ABC-220`'s rows are unchanged except the named re-pins.
- **A9 MET.**
  - `G8` H 9.84 s ≤ 10 s at load1 ≤ 2.42.
  - The R1 census is confirmed: 3 real-engine rows, all class P, reads ⌈b ÷ s⌉ + 2, 0 time-blind.
  - The RF-1 rows read the same at both clamps.
  - The period rows A2–A4 are stubbed.
- **A10 MET.** Walls 59 500.1 / 59 500.8 / 59 499.4 ms (≤ 60 000). Heap growth ≤ +0.12 MiB, arrayBuffers growth 0,
  arrayBuffers 4.51 MiB. Max depth 13 (tripwire not reached).
- **A11 MET.**
  - Row 1 (default lane) is green, and LEVELCAPCM turns it red.
  - Row 2: `UCI_DEEP` 4/4 in the mode, 13/13 for the lane.
  - Row 3, the A14b probe: R1 0.41 ms, R2 busy, R3 met.
- **A12 MET.** The four rows run in both modes. QM4, QM4CM and QM4ST each turn exactly the expected two or four Black
  rows red.

## Gates and checks
- lint, typecheck and build exit 0. `npm test` is 2 363 passed ×3, 0 failed, 0 skipped. skip-integrity and lane
  inventory are clean.
- The names diff is net +30 (+31 −1, 4 retitled), and nothing else moved.
- **Plants: 21/21 as pre-registered.** Every REQUIRED red held: QM4 in both modes and per mode, CAPSWAP, CLAMP32 (the A7
  real row), NOTOK59 and BLUNDERCM. Survivors: HSCM and CLOCKWINSCM, both predicted (QE-221-a).
- **`G8`:** B 9.82 s, H 9.84 s, +0.02 s.
  - Head > 9.6 s, so **`ABC-244`'s tranche 2 fires on the raw median** (report only).
  - The host ran about +0.41 s slow, because the same base code read 9.41 s at `ABC-242`'s `G8` (QE-221-c). A re-read
    on a clean host is the Orchestrator's call.

## Findings (findings note)
- **QE-221-a LOW:** two survivors in the mode, the hard stop and movetime-over-clock. The fix is two test-only rows.
- **QE-221-b INFO:** a stale comment in `src/levels.ts` (D8-fenced).
- **QE-221-c INFO:** a foreign orphan process during the ALONE window. The Orchestrator should reap it.
- SE-221-a CONFIRMED (17 205 vs 117 735 ms). SE-221-b/c/d: QE agrees.

**UAT is owed (production lines change). This QE verdict signs it.** STOP: none.
