# scribe-ABC-282-close readings: what the four lines stand on, and what stays UNKNOWN

- `AGENTS.md` was 18 429 B before; the cap is 32 KiB.
- **Verified by reading `main` `3e648e72`:** `ITERATION_GROWTH = 2.3` and `softMs = budget / ITERATION_GROWTH` in `parseGo`'s `uci-clock-mode` branch, reached only when `movetime` is absent and the mover's clock is present; `EngineChoice.partial` and the `info string partial depth` line; the A10 test's three `go movetime 90000` searches and its fourth clock-line search with `time` ≥ `CLOCK_MODE_CAP / 2.3`; the passer file's K0 rows on the `…WithoutBundle` doors, `SEARCH_DEEP`; its 28 tests and 7.51 s from `se-ABC-304`'s `raw/passer-deep.txt`.
- **UNKNOWN - verify:** the A10 row's present wall total. No run was made here. ~3.5 min is the sum of the pieces the page and the test comments give. QE-282-f's residual stands: no record names which branch stopped A4's moves at 59 500.
- **Not checked, and not claimed:** that the merge re-read rule has been applied since `…681c6363`. `…16e0ec2c` records one application, at `ABC-282`'s merge.
