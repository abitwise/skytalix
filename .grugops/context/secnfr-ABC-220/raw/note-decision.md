# Security/NFR decision, secnfr-ABC-220: gate PASS_WITH_RISKS. No required fix; AR-NFR004-A re-accepted at 22 s; AR-UCI-BUSY accepted (owner Architect/Design); NFR-004's 22 s text placed

Records only, on branch `grugops/secnfr-ABC-220` (made from `main` `01c37946`, fast-forwarded to the claim commit `3e4e1ca2`). The candidate is `grugops/qe-ABC-220` `cc32a470`, whose code is `fbab54ff` (`68ba364c` with `main` `a649fbc4` merged in at `9ac8b365`). The catalog commit is `9c676157`. Nothing was run, built or timed. The full text is in the last section of `plans/nfr-catalog.md`.

## Result: PASS_WITH_RISKS (ASVS L1, `block_on: high`)
- **Required fixes: none.** No finding is high.
- **V2.2.1 MET.**
  - The value is selected by `TIME_MODES.find((mode) => mode === value)`, an exact match against `Object.freeze(["level", "simple-tournament"])`.
  - No object key is read, so an inherited name selects nothing (QE: 8 hostile values refused, including `__proto__` and `constructor`).
  - The name matches case-insensitively. A refused value keeps the old one.
- **V2.1.1 MET.** The `combo` line and the refusal text are both spelled from the same tuple.
- **No echo injection.** The refused value goes out only through `info` → `printableOf` (C0 and U+007F dropped; QE-A10e), so it cannot start a new UCI line.
- **No new input class.** The `go` numbers go through the old `milliseconds` and `positiveInteger`.
  - In the mode, every branch is `min(·, T)`, so nothing hands more than 22 000.
  - +Infinity goes to T. −Infinity and NaN go to the engine's depth-1 rule (QE-220-d, plus 3 000 random lines).
- **V1.3.2, V1.2.5 and V15.** No import, `eval`, file-system, environment or child-process line was added to production code, and `package*.json` is untouched.
  - `runDialogue` is still the lane's only `spawnSync`.
  - The probe's asynchronous spawn is a record (`execPath`, no shell, `NODE_OPTIONS` removed), not a delivery file.
- **`ADR-0036` clause (b): not run** (it needs `node`; records only). It is `UNKNOWN - verify`, and the diff reading stands in its place.

## Accepted risks
- **`AR-NFR004-A` at 22 s: STANDS, re-accepted with its number. Owner: Security/NFR.**
  - In `simple-tournament` the budget equals the ceiling. So the risk covers the overshoot past the 22 s ceiling itself, as it covers clause A at level 5.
  - `A11` read 5 / 5 at 21 999.4–22 001.0 ms: max **+1.0 ms**, which is 0.005 %. That is not materially worse than the accepted 1.03 %.
  - The sample is thin: 5 calls. A GC or scheduler stall at the last check could read over 31 ms. By the risk's scope rule that is a new question, still well inside < 22 500 ms.
  - The next reading is `ABC-222`'s games. The scope stays the M3 reference, and the reading is from the Linux host (`SEC-228-a`).
- **`AR-UCI-BUSY` (new; placed after § "`NFR-011` PLACED"). Owner: Architect/Design, as holder of `ADR-0044` D5's worker triggers.**
  - The text is the Architect's, verbatim (`…ca075632`): *"busy `isready`/`stop`: answered ≤ one budget + `AR-NFR004-A` late; ≤ 22 s in `simple-tournament` (read to the whole second: < 22 500 ms), ≤ 60 s in `uci-clock-mode`; one `readyok` per `isready`, in order"*.
  - The bound's worst case is ≈ 22 131 ms. **The worst case read is ≈ 22 001.4 ms**, which adds two separate readings: `A11`'s +1.0 ms and `A14b` R1's 0.38 ms drain at `movetime 2000`.
  - Order and count: `A13`, `A14a` (9 / 9) and `A14b` R3.
  - The `uci-clock-mode` clause binds from `ABC-221`, and `ABC-221` re-reads it.
  - Re-open if: a real busy reading at 22 s comes in at ≥ 22 500 ms; the owner declines the whole-second reading; or a GUI he uses times out mid-search.

## Catalog, before → after
- **`NFR-004` Target.** "… (a level above 5 gets its budget + 2 s)." becomes "…; 22 s in UCI `TimeMode` `simple-tournament` (budget 22 s)." This is `ADR-0052` § Consequences verbatim, a pure insertion. It carries a dated line with the owner's words (`…3dd61448`) and a dated mechanism line: T = ceiling = 22 000, 0 ms margin, clamp 32 000. It binds from `ABC-220`'s merge.
- **`NFR-004` Verified by.** A dated line: MET exactly on the budget (`A6`, QE-A6a); MET to the whole second on the real clock (`A11`, max 22 001.0 ms); NOT MET in the letter at ≤ 22 000 ms by ≤ 1.0 ms, covered by `AR-NFR004-A`.
- **`AR-UCI-BUSY`:** new, beside `NFR-011`. The `NFR-011` row is byte-identical.
- **`NFR-008`:** a watch line (see the observation). The row is not edited.
- **Unchanged:** `NFR-001`–`NFR-003` and `NFR-005`–`NFR-012` are byte-identical, and so are `NFR-004`'s ID, Category and Applies to cells (sha256, before and after).

## Owner
- **No new owner item.**
- The whole-second reading (≤ 22 s means < 22 500 ms) is already an open confirmation in the ticket's FOLDED note, and it blocks nothing. If he declines it, only `AR-UCI-BUSY`'s text and `A11`'s bound move.
- `SEC-228-a` stays his, and it does not gate anything.

## Next
- The Orchestrator: `ABC-220` → Ready for UAT. The QE verdict `…7a09c5e1` signs UAT under test note 3.
- The merge is a human's. The merge folds (BA/PM `ADR-0044`, Scribe `AGENTS.md`) are as the ticket's test note 4 lists them.
