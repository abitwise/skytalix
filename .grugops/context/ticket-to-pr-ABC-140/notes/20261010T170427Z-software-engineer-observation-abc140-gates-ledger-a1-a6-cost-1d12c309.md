---
id: 20261010T170427Z-software-engineer-observation-abc140-gates-ledger-a1-a6-cost-1d12c309
kind: observation
by: software-engineer
at: 2026-10-10T17:04:27Z
verified_by:
confidence: high
refs:
  - ABC-140
  - ADR-0011
  - R5d
  - QE-137-a
  - QE-137-d
  - ADR-0035
  - N8-LANE
  - src/history-pane.nfr.test.ts
  - 20261010T170427Z-software-engineer-decision-abc140-two-whole-statement-pins-in-the-drift-tripwire-seven-span-reach-three-instrument-docblock-f8b6efb4
supersedes:
---

# `ABC-140` readings: the gate is green and the five composer survivors go from green 12/12 to red on the drift tripwire. The rest of the ledger is unchanged, and cost is admissible with `N8-LANE` MET

This note is hand-authored and unsealed.
- Branch `grugops/ABC-140-composer-tripwire-pins`, from `6dde3261`.
- Code commit `795adca4` (`src/history-pane.nfr.test.ts` +32/−13).
- Not merged, not pushed. Apple M3, Node v26.11.0.
- The raw files and timestamps are in `../probe/RUN.txt`.

**Harness.** The Architect's `plant.mjs` (sha256 `b6b5e458…57bd`) was copied unchanged and run inside the SE's
own loop (`probe/ledger140.sh`). The permission layer refused nothing. The Architect's `ledger.sh` was not used.
At `6dde3261` the loop reproduces BA/PM's `75dcc0f5` base rows on every shared build.

**Premise re-verified at `6dde3261` before editing.**
- The file blob is `ed2cd2b0`, the same as at `75dcc0f5`.
- All five survivors `+FMT+WSC` exit 0 with 12/12. The premise holds.

| build (file scope) | base `6dde3261` | delivered `795adca4` |
|---|---|---|
| CONTROL, FMT | exit 0, 12/12 | exit 0, 12/12 |
| WSC | exit 1, composer tripwire | exit 1, composer tripwire |
| WPS | exit 1, licence guard | exit 1, licence guard |
| N591-HEAD / -TAIL / -WRAP +FMT+WSC | exit 0, 12/12 each | **exit 1**, drift tripwire: "the composer tripwire scans EVERY production module" |
| C-CONTAIN / C-OPERAND +FMT+WSC | exit 0, 12/12 each | **exit 1**, drift tripwire: "the composer tripwire compares with an EQUALITY" |
| the same five, without FMT (extra) | — | exit 1, same assertions |
| N653-NARROW+FMT, H-SHADOW+FMT+WPS, H-FSMOCK+FMT+WPS (recorded, accepted) | exit 0, 12/12 | exit 0, 12/12 |
| whole suite: CONTROL / N591-TAIL+FMT+WSC / C-OPERAND+FMT+WSC | — | 52 files: 1608/1608, 1607/1608, 1607/1608 |

Every row in that table ran with tsc 0. Every `+FMT` row ran with lint 0. No build printed `PLANT-FAILED`.

- **`A1` MET**, per the table.
- **`A2` MET.**
  - `CONTROL` and `+FMT` run 12 tests.
  - `WSC` and `WPS` fail the same tests by name.
  - The accepted greens are recorded.
  - Every `plant.mjs` anchor occurs once.
  - The five existing pin statements have the same hashes at base and head (expression, `R5`, both `R5b`, `R5c`).
- **`A3` MET**, measured on collapsed text:
  - "it pins five spans by TEXT" goes 1 → 0.
  - "it pins seven spans by TEXT" goes 0 → 1.
  - `R5d` goes 0 → 2.
  - "The sixth and seventh are the composer tripwire's own (`R5d`)" names both new spans as that guard's own.
- **`A4` MET**, measured on collapsed text:
  - "Both guards at the bottom of this file" goes 1 → 0.
  - "THE TWO GUARDS HOLD DIFFERENT PROPERTIES" goes 1 → 0.
  - The docblock names the frame-path probe, the composer tripwire and the licence guard, and both
    `COMPOSITION_ROOT` and `LICENSED_DRIVERS`. It contains "share `COMPOSITION_ROOT`".
  - No other `src/` file reads the old text (grep, 0 hits).
- **`A5` MET.**
  - The name-only diff under `src` is `src/history-pane.nfr.test.ts` alone. It adds 0 files and 0 production lines.
  - The helper is sha256 `88ad40ed…` at base `:163–164` and at head `:166–167`.
  - The composer tripwire's statements are sha256 `757313d7…` at base `:591–598` and at head `:610–617`.
  - `biome-ignore` goes 1 → 2. `it(` stays 12 → 12.
- **`A6` MET**, in the worktree at `795adca4`:
  - lint exit 0 (100 files);
  - typecheck 0;
  - build 0;
  - `npm test` exit 0, 52 files / 1608 passed, 6.92 s, load1 13.94 → 16.59;
  - skip count 0; integrity prints `No findings.`;
  - `lane-inventory.js` prints "52 test files; git tracks 52. No findings."

**Cost, `ADR-0035` (proposed).**
- Method: narrow set `src/history-pane.nfr.test.ts`, base/head/twin. The twin is `diff -r -x node_modules`
  identical to base. 9 rounds, round 0 dropped. CPU = user+sys.
- Set 1 (load1 median 13.31): twin +0.006 s (+0.47 %), sign 4/8, R 0.038 s. Head − base median +0.022 s,
  interval −0.060..+0.063.
- Set 2 (load1 median 12.37): twin +0.004 s (+0.32 %), sign 4/8, R 0.109 s. Head − base median −0.017 s,
  interval −0.097..+0.041.
- **Both sets are ADMISSIBLE**: twin ≤ 1.5 % and sign at chance.
- **`N8-LANE` (≤ 650 ms CPU net) is MET.** Both sets resolve it, and each head − base interval lies within
  ±0.1 s.
- No sub-floor charge is claimed. The change adds two `toContain` calls on a string the test already reads.
