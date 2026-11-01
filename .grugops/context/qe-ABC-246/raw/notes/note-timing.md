# `ABC-246` A4/A5 gates and `G8` at `3c5e05fd` (base `832ff246`): gates 0, `npm test` 2 366 / 0 skipped ×3, names +2/−0, comment-only `engine.test.ts` diff with true figures; `G8` H 9.51 s / B 9.38 s (load1 1.08–1.79, no foreign vitest), admissible, `NFR-008` MET, W1 not triggered

The runs used plain `node` and `npm run` on H = `git archive a1942ea0`, with `node_modules` symlinked to the main checkout's
(the lock files are equal at base, head and `main`). Raw output is in `raw/gates/`, `raw/a4/` and `raw/g8/`.
- **Static gates:**
  - `npm run lint` exit 0 (131 files), `npm run typecheck` exit 0, `npm run build` exit 0 (`dist/` removed after).
  - `test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
  - `lane-inventory.js`: "The lane collects 63 test files; git tracks 63. No findings.", exit 0. It needs a git repo, so it
    ran in the worktree, whose tracked `src/` `tools/` `data/` equal `a1942ea0`, with a temporary `node_modules` symlink
    that was removed after.
- **DIFF** (`raw/gates/diff.txt`):
  - `832ff246..3c5e05fd` touches `src/engine.test.ts` and `src/uci-session.test.ts` only.
  - `uci-session.test.ts` is +18/−0: one `describe` nested last in `ABC-221`'s.
  - `3c5e05fd..a1942ea0` touches no code.
  - The zero-production-lines measurement is empty.
- **A4** (`raw/a4/`):
  - `a4.mjs`: 5 changed lines (−1 +4), 0 outside the comment. The comment-stripped code is equal at base and head.
  - `a4-readings.ts` runs the block's own call (kiwipete, `HARD_CEILING_MS` 60 000, 1 ms ticking clock, `maxNodes`
    6 000): **9 readings**, 6 893 nodes, depth 2, `elapsedMs` 8, the same at H and B. "About 10" is true. "About 60 000"
    readings to the deadline is 60 000 ÷ 1. The old comment's "about 5 000 consultations" is gone.
- **NAMES** (`raw/g8/names.txt`, run-1 base vs run-2 head):
  - Base 2 364, head 2 366, 0 failed and 0 skipped on both.
  - Only at head: the 2 `ABC-246` rows. Only at base: none.
  - Sorted name hash `becc76253ba9` on both, with the added rows removed at head. **Net +2.**
  - `raw/g8/counts.txt`: 55 `ABC-220*` and 29 `ABC-221*` rows at head (base 55 and 27), 0 not passed in each head run.
  - The new rows take 0.10–2.44 ms in-thread (medians 0.11 ms for A1 and 0.14 ms for A2).
- **`G8`** (`qe-scripts/g8.mjs`, which is `qe-ABC-245`'s with an optional order argument; `npm test` as spelled; order
  b h h b b h; wait-clear before each run: 0 foreign vitest, 0 cutechess-cli, load1 ≤ 2.0, Tctl ≤ 60 °C):

| run | tree | wall s | cpu s | load1 before/after | Tctl before/after °C | rows |
|---|---|---|---|---|---|---|
| 1 | base | 9.44 | 30.57 | 1.28 / 1.79 | 39.8 / 74.9 | 2 364 |
| 2 | head | 9.51 | 31.00 | 1.46 / 1.71 | 40.3 / 72.3 | 2 366 |
| 3 | head | 9.58 | 30.50 | 1.47 / 1.55 | 39.9 / 70.8 | 2 366 |
| 4 | base | 9.35 | 30.25 | 1.21 / 1.40 | 39.4 / 74.1 | 2 364 |
| 5 | base | 9.38 | 30.40 | 1.09 / 1.31 | 39.3 / 73.9 | 2 364 |
| 6 | head | 9.43 | 30.08 | 1.08 / 1.14 | 39.1 / 74.8 | 2 366 |

  - **Medians:** H **9.51 s**, B **9.38 s**, delta **+0.13 s**. CPU H 30.50 s, B 30.40 s.
  - **Admissible:** all rc 0, and load1 ≤ 8 before and after every run.
  - **Pre-G8 precondition** (`raw/g8/pre-g8-top.txt`, top second sample, 07:10:39Z): no process at ≥ 50 % CPU. The busiest
    was `abtop` at 9.5 %. 0 foreign vitest, 0 cutechess-cli. Tctl 41.0 °C.
  - **Foreign processes:**
    - Runs 2–6 saw only `abtop` (6 %) and three idle `claude` sessions (1.4–2 %).
    - Run 1 (base) saw a transient `git` and `node`, both at 00:00 elapsed. Those were the records-only BA/PM hop's commits
      at 07:10:51Z and 07:10:56Z, inside run 1's window (07:10:47–07:10:56Z; the second commit is at its edge). That hop is permitted beside.
    - No foreign vitest appeared at any point.
    - Graded admissible (QE-246-a). The head runs had no git activity in their windows.
  - **Thermal:** Tctl median 55.5 °C over 12 readings, max 74.9. No thermal stop.
  - **`NFR-008`** (≤ 10 s): **MET**.
  - **Delta:** +0.13 s against the +0.01 s estimate. The rows cost ≈ 0.25 ms in-thread, and the per-file medians spread
    −20..+33 ms across files the ticket did not touch (`uci-session.test.ts` +33 ms, `cli.test.ts` +18 ms,
    `engine.test.ts` −7 ms; `raw/g8/g8-perfile.txt`). So the delta is noise at n = 3.
  - **W1:** H 9.51 s ≤ 9.7 s, so no second window. If one had been owed it would have used the same tree.
  - **For `ABC-248`'s base:** head median **9.51 s** at load1 1.08–1.71 on its runs.
