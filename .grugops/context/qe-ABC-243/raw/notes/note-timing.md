# `ABC-243` A5 gates, the `ENGINE_DEEP` row and `G8` at head `8772cf36` (base `4bd9ac6a`): `NFR-008` MET, H 9.28 s; ABC-244's tranche-2 trigger (> 9.6 s) NOT fired

## `G8` (ALONE; `qe-scripts/g8.mjs`, qe-ABC-244's harness unchanged but its header line)
`npm test` as spelled, order b h h b b h, trees B and H. Wait-clear before every run (0 foreign vitest by bracketed pgrep then
`kill -0` by PID, 0 cutechess-cli, load1 ≤ 2.0, Tctl ≤ 60.0 C). Runs 2–6 each waited one 15 s poll for Tctl (68.6–71.9 C
right after the previous run) and started at 34.5–37.3 C. No foreign vitest during the set.

| run | tree | rc | wall | CPU | vitest Duration | load1 before / after | tests |
|---|---|---|---|---|---|---|---|
| 1 | B | 0 | 9.23 s | 29.87 s | 8.91 s | 0.14 / 0.43 | 2 322 passed |
| 2 | H | 0 | 9.22 s | 29.87 s | 8.88 s | 0.33 / 0.91 | 2 323 passed |
| 3 | H | 0 | 9.28 s | 29.91 s | 8.93 s | 0.71 / 1.07 | 2 323 passed |
| 4 | B | 0 | 9.17 s | 29.89 s | 8.84 s | 0.90 / 1.07 | 2 322 passed |
| 5 | B | 0 | 9.26 s | 30.20 s | 8.93 s | 0.83 / 1.17 | 2 322 passed |
| 6 | H | 0 | 9.33 s | 30.06 s | 9.01 s | 0.98 / 0.98 | 2 323 passed |

- **Medians (of 3): B 9.23 s, H 9.28 s, H − B +0.05 s**; CPU B 29.89 s, H 29.91 s. Admissible: all 6 rc 0, load1 ≤ 1.17.
- **`NFR-008` MET** (H 9.28 s ≤ 10 s). **ABC-244's tranche-2 trigger does NOT fire** (9.28 ≤ 9.6 s; margin 0.32 s). No STOP.
- The ticket's estimate was about +0.03 s; read +0.05 s wall (CPU +0.02 s). Inside run-to-run spread (B 9.17–9.26, H 9.22–9.33);
  the per-file vitest times put `src/uci-session.test.ts` at +30 ms (1 711 → 1 741 ms median), the only file that grew
  apart from noise (`g8/g8-perfile.txt`).
- For reference only (a different tree and window): `qe-ABC-244` read its head 9.25 s at 2026-10-30T23:03Z on this host.

## A4 counts and names (from the G8 runs' `last-run.json`)
- Totals B 2 322, H 2 323 in every run; failed 0, skipped 0. Only per-file count change: `src/uci-session.test.ts` 200 → 201
  (`src/transposition.test.ts` 25 = 25: the renamed row is `ENGINE_DEEP`-only and not defined in the default lane).
- Sorted full names: exactly one only at H (the A6 row), none only at B; sha256/12 of B's names = H's minus the added row
  (`0729b47e8a08`), in all three B/H pairs (`qe-scripts/names.mjs`, `g8/a4-names.txt`). **A4 MET.**

## A5 gates at H
- `npm run lint` exit 0 ("Checked 131 files … No fixes applied."), `npm run typecheck` exit 0, `npm run build` exit 0
  (build output deleted before `G8`; `diff -r B H` re-checked = the two test files).
- `npm test` green ×3 at H, skips 0; `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings."
- **`ENGINE_DEEP` row, once, ALONE:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 node_modules/.bin/vitest run
  src/transposition.test.ts -t DEFAULT_BUDGET_MS`: the renamed row ran and **passed** (5 095 ms; 1 passed, 25 filtered by
  `-t`, which vitest prints as skipped: a filter, not a default-lane skip). Reading: 1 s (depth 7) heapUsed 9.09 MiB,
  arrayBuffers 4.51 MiB; `DEFAULT_BUDGET_MS` (depth 8) heapUsed 9.11 MiB, arrayBuffers 4.51 MiB → growth 0.02 / 0.00 MiB,
  under the 1 MiB bar. load1 0.08 at the run. Its wait-clear ended on the 60-min cap, not a clear reading (QE-243-a).
- **A5 MET.** No real-clock row added (`NFR-008`); the A1 row stays on the virtual clock, step 100, 40 reads (SE census).
