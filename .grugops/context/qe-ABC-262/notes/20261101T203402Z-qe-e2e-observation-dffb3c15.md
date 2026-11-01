---
id: 20261101T203402Z-qe-e2e-observation-dffb3c15
kind: observation
by: qe-e2e
at: 2026-11-01T20:34:02Z
verified_by: 
confidence: high: gates and G8 window run under the lock; outputs in raw/gates and raw/g8
refs:
  - qe-ABC-262
  - ABC-262
  - ABC-261
  - ABC-254
  - ABC-252
  - EPIC-011
  - QE-261-a
  - QE-261-b
  - QE-262-a
  - QE-262-b
  - QE-262-c
  - NFR-008
  - src/gameend.nfr.test.ts
  - src/legal.test.ts
supersedes: 
seal: sha256:b156740df57c5c872f4eeb4697702a9325d9ef6f8cb99225c6e37b0af5eec366
---

# qe-ABC-262 gates: npm test 2 376 ×3 (base 2 374 ×3), 0 skips; lint, typecheck, build rc 0; rows 0.29 ms; G8 H 8.94 s / B 8.94 s, ALONE ×6; merged tree 2 376

One window ran under `flock host-test.lock`, 20:30:42–20:33:18Z (`raw/qe-scripts/window.sh`, output in `raw/window.out`). The head was the QE worktree at `46a0c69a`. Its `src`, `tools`, `vitest.config.ts` and `package*.json` equal `39a6237e`.

- **Lint / typecheck / build:** rc 0 / 0 / 0. `biome` checked 131 files. `git status --porcelain` is empty after the build.
- **Lane inventory:** "The lane collects 63 test files; git tracks 63. No findings." rc 0.
- **G8 (NFR-008):**
  - **Method:** `npm test` wall time, interleaved b h h b b h, with a wait-clear before every run (`raw/harness/g8.mjs` and `host.mjs`, copied verbatim from qe-ABC-261: 0 foreign vitest, 0 cutechess, load1 ≤ 2.0, Tctl ≤ 60 °C, 15-min shared cap). Base was a detached worktree at `767a2e3e`; head was the QE worktree.
  - **H 8.94 s** (9.15 / 8.94 / 8.85) and **B 8.94 s** (8.90 / 9.01 / 8.94), so H − B = −0.00 s. The vitest-reported head durations were 8.81 / 8.61 / 8.50 s.
  - CPU median: H 29.11 s, B 29.23 s.
  - load1 ranged 1.25–2.34. Tctl median was 63.4 °C (max 76.5), so no thermal stop.
  - **Admissible: true.** The host was ALONE before all 6 runs: no foreign vitest before or after any run, and every wait was 15 s for cool-down only. There is no SHARED flag. The busiest other process was `abtop` at 7.9 %.
  - **NFR-008 MET** (≤ 10 s), with 1.06 s of headroom. `g8.log`, `g8-perfile.txt` and the JSONs are in `raw/g8/`.
- **A8 counts:** every head run is **2 376 passed**, 0 failed, 0 pending, 0 todo. Every base run is 2 374, so the count is **base + 2**.
- **Skip-integrity:** `--skip-count 0`, taken from the G8 run-2 head JSON. Result: "No findings.", rc 0.
- **A7 cost:** from the three head JSONs (`raw/g8/a7-rows.txt`):
  - early-exit row: 0.15 / 0.15 / 0.14 ms;
  - black row: 0.15 / 0.14 / 0.14 ms;
  - **summed median 0.29 ms** (0.30 / 0.29 / 0.28), against a bar of ≤ 20 ms. **MET.** (The SE read 0.41 ms.)
- **Merge validity:** `git merge-tree --write-tree main grugops/ABC-262` is clean and gives tree `0988f004`. `main` at `d9bbd0c2` moved docs-only since `767a2e3e`; there is no `src` change. `npm test` on that tree (a detached worktree at a dangling commit `b0ae51b6` carrying the tree, never referenced): **63 files, 2 376 passed**, rc 0.
- **Host note (QE-262-c):** the first window attempt (20:29Z) failed before any test ran. The `/tmp/claude-1000` scratch volume hit EDQUOT while extracting `git archive` copies. Base and merged trees were moved to detached worktrees on the home volume, and the window was re-run whole.
