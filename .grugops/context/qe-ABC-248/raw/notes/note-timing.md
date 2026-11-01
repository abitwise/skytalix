# `ABC-248` gates and timing as run, ALONE: gates 0; `npm test` 2 362 ×3, 0 skipped; `N8-LANE` MET (H−B CPU −0.635 s); `G8` H 9.09 s / B 9.37 s, admissible, `NFR-008` MET, design target met, W1 not triggered; the deep lane prints "4 passed"

**Host.** 24 CPUs, Linux. ALONE: no other hop ran.
- **Before any run (08:01Z):** load1 0.26, Tctl 35 °C, 0 vitest, 0 cutechess-cli.
- **Foreign processes on every snapshot:** `abtop` about 6 % (15 % on one `top` sample), three idle `claude` sessions
  (1.4–2 %), and an idle `node dist/main-worker.js` (0.7 %).
- **No foreign vitest** appeared at any point, so there was nothing to wait on and nothing to kill.
- **Nothing left running:** no vitest process at the end.

## Static gates (H = `git archive 18bad5fb`; `raw/gates/`)
- `npm run lint`: rc 0 (131 files). `npm run typecheck`: rc 0. `npm run build`: rc 0. `dist/` was removed after.
- **Skip integrity:** `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` printed `No findings.`,
  rc 0.
  - The 0 is `numPendingTests + numTodoTests` from all three head `npm test` JSON reports.
  - The AGENTS.md capture line spells `npx`, which the brief fences, so this is a deviation in how the count was read. The
    value is the same.
- **Lane inventory:** `node tools/grugops/lane-inventory.js` printed "The lane collects 63 test files; git tracks 63. No
  findings.", rc 0.
  - It ran in the worktree, whose code equals `18bad5fb`.
  - A temporary `node_modules` symlink was added for the run and removed after.

## A3: names (`raw/g8/names.txt`, run 1 B against run 2 H)
- **Totals:** B 63 files, 2 366 passed. H 63 files, **2 362 passed**. 0 failed, 0 pending, 0 todo in all six runs.
- **`src/search.null-move.test.ts`:** 38 = 38. It differs only by the three ruling-5 retitles.
- **`src/uci-session.test.ts`:** 234 → 230. Only at B: the four moved rows, with their titles. Only at H: none.
- **Every other file:** sorted names equal.

## A10: the deep lane (`raw/deep/`; `node_modules/.bin/vitest`, because npx is fenced)
- **Escaped form:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 node_modules/.bin/vitest run src/uci-session.test.ts -t
  "ABC-167 A5 — the D4 time rule, read from the info line's time \[deep, ENGINE_DEEP=1\]"`. It printed **"Tests 4 passed |
  237 skipped (241)"**, rc 0. The four `it` titles are byte-equal to base's.
- **Ruling 6's literal form** (brackets unescaped): "Test Files 1 skipped", **"Tests 241 skipped (241)", rc 0**. That is
  0 tests, a vacuous green (QE-248-a).
- **`ENGINE_DEEP` unset:** 230 collected and 230 passed, 0 pending, 0 rows under the deep title. The block is not defined.

## A8: `N8-LANE`, the two-file set `src/search.null-move.test.ts` + `src/uci-session.test.ts` (`qe-scripts/lane.mjs`, `raw/n8/`)
- **Method:** `qe-ABC-244`'s `lane.mjs`, with only the file set changed.
  - Arms: B; T = `cp -R B`, with a clean `diff -r`; H.
  - Command: `node_modules/.bin/vitest run <set>`, heap 128, under `/usr/bin/time -p`.
  - 9 rounds with the order rotated; round 0 is discarded, so n = 8 and k = 2. All 27 runs ok: 272 tests per run in B and
    T, 268 in H.
- **Conditions:** one wait-clear first (08:26:28Z, load1 0.81, Tctl 37.8 °C). Then load1 0.81–1.64 and 0 foreign vitest.
  - **Tctl median 80.8 °C over 54 readings (max 82.5).** That is under the 85 °C stop. D2 logs Tctl and does not gate on
    it. The runs go back to back with no cool-down, as at `qe-ABC-244`.

| arm | CPU median | wall median |
|---|---:|---:|
| B | 4.930 s | 2.160 s |
| T | 4.945 s | 2.175 s |
| H | 4.295 s | 1.945 s |

- **Twin:** T−B CPU +0.020 s, sign +4/−3 (p 1.000), R 0.080 s. Admissible, and it resolves 0.650 s.
- **H−B CPU: −0.635 s, interval [−0.720, −0.420], sign 0/−8. STATE at 650 ms CPU: MET.**
- **H−B wall:** −0.215 s, interval [−0.270, −0.180]. This is the narrow-set saving.
- **F:** provisional 16 % of B CPU = 0.789 s (`UNKNOWN - verify`). This is the set's first reading, so twin R 0.080 s is the
  candidate `F`. Security/NFR records it.

## A9: `G8`, `npm test` as spelled, b h h b b h (`qe-scripts/g8.mjs`, `qe-ABC-246`'s, unchanged; `raw/g8/`)
Wait-clear before every run: 0 foreign vitest, 0 cutechess-cli, load1 ≤ 2.0, Tctl ≤ 60 °C. Window 08:23:27–08:25:40Z.

| run | tree | wall s | cpu s | vitest Duration s | load1 before/after | Tctl before/after °C | rows |
|---|---|---:|---:|---:|---|---|---|
| 1 | base | 9.32 | 30.60 | 8.99 | 0.55 / 0.85 | 37.1 / 73.4 | 2 366 |
| 2 | head | 9.11 | 29.84 | 8.76 | 0.75 / 1.09 | 38.0 / 74.1 | 2 362 |
| 3 | head | 9.09 | 29.83 | 8.77 | 0.84 / 1.72 | 38.6 / 73.3 | 2 362 |
| 4 | base | 9.46 | 30.54 | 9.12 | 1.34 / 1.47 | 39.0 / 72.0 | 2 366 |
| 5 | base | 9.37 | 30.57 | 9.02 | 1.14 / 1.28 | 39.9 / 74.0 | 2 366 |
| 6 | head | 9.01 | 29.68 | 8.68 | 0.99 / 1.15 | 39.6 / 73.0 | 2 362 |

- **Medians:** **H 9.09 s, B 9.37 s, H − B −0.28 s.** CPU: H 29.83 s, B 30.57 s.
- **Admissible:** all rc 0, and load1 ≤ 8 before and after every run (max 1.72).
- **Thermal:** Tctl median 55.9 °C over 12 readings, max 74.1. No thermal stop.
- **Foreign processes at each run's start** (`ps` top 4): `abtop` 6.2 % and the three idle `claude` sessions.
  - Run 1 (base) also listed a `node-MainThread` at 40 % with 00:00 elapsed. It started seconds after this hop launched
    `g8.mjs`, so it was most likely this hop's own file poller (a `node -e` that sleeps in `Atomics.wait`). It was not a
    vitest.
  - The run is graded admissible, and the base arm is the one it would bias. The head runs show nothing extra.
- **`NFR-008` (≤ 10 s): MET. Design target ≤ 9.4 s: MET** (by 0.31 s). **W1: not triggered** (H ≤ 9.7 s), so no second
  window is owed. The > 10 s owner route does not fire.
- **Per-file test-time medians, H−B** (`raw/g8/g8-perfile.txt`):
  - `search.null-move.test.ts` −374 ms (1 477 → 1 103).
  - `uci-session.test.ts` −196 ms (1 772 → 1 576).
  - Every other file is within −54..+11 ms.
- **Against the forecast:** the SE estimated −0.15..−0.45 s (central −0.3 s), and the lane wall moved −0.28 s. The SE's
  informal n = 2 read was −0.33 s.
- **For the next gate's base:** H 9.09 s at load1 0.75–1.72.
