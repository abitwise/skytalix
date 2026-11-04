# qe-ABC-283 NFR-008, graded with twin arms, ALONE: **H median 9.60 s [9.52, 9.71], max 9.76 ≤ 10 s, MET, graded** (twin admissible: |CPU Δ| 0.26 % of H's CPU, sign 5 / 8). Against R-N8H-1's 9.5 s trigger: **≥ 9.5 s, so it fires**, and R-N8H-1 returns to MEDIUM by `…c7609f51` 3. Q-N8H-1's ≥ 9.6 s trigger fires at 9.60 exactly. NFR-005 / G6: no run below depth 9 on either build, so it is MET (reported)

QE/E2E, task `qe-ABC-283`. Records: `raw/out/n8/` (`a8.tsv`, `grade.out`) and `raw/out/g6/`. Harnesses as sealed in PREREG `…f774e6d9`.

## NFR-008 (≤ 10 s, the default lane): graded
- **Arms (out of tree):** B = `09694a4e` (main's merge-base; `main` has the same `src/` tree). H = `ab0a37b6`. H2 = `cp -a` of H (`diff -r` clean). Each borrows `node_modules` by symlink.
- **Session:** ONE `flock` hold; the rounds ran on 2026-11-04 from 16:01:17Z (first run) to 16:05:37Z. It was `qe-ABC-281`'s A8 form (`n8.sh`) with only the per-arm expected counts changed.
  - 9 rounds; round 0 was discarded, so **n = 8 complete scored rounds** and k = 2.
  - Every run exited 0, with B at 69 files / 2 650 and H and H2 at 70 files / 2 665, and 0 skipped or failed.
  - load1 ranged 2.45–3.72 (the limit is 8), with no wait.
- **Readout (`n8-grade.py`):**
  - **H: wall median 9.60 s, interval [9.52, 9.71], max 9.76 s;** CPU median 32.27 s.
  - H2: wall median 9.60 s [9.54, 9.69]. B: wall median 9.45 s [9.39, 9.54], CPU 31.80 s.
  - H − B: wall +0.140 s [+0.010, +0.340], positive 7 / 8; CPU +0.840 s.
  - Twin H2 − H: CPU median +0.085 s = 0.26 % of H's CPU (limit 0.484 s), sign 5 / 8, which is at chance. Wall R = 0.050 s. **ADMISSIBLE.**
- **State: NFR-008 MET, graded.** H's median of 9.60 s is ≤ 10 s, with 0.40 s of headroom.
- **R-N8H-1 (re-MEDIUM at a median ≥ 9.5 s): FIRES.** By `…c7609f51` 3, R-N8H-1 returns to MEDIUM and a Security/NFR hop follows the merge. `ABC-271` adds about 0.1 s more.
- **Q-N8H-1 (≥ 9.6 s): fires at 9.60.**
- **The Engineer's ungraded 9.81 s did not reproduce.** The graded head is 0.21 s lower and the base is the same (9.43 vs 9.45). The Engineer timed `npm test` wall around an `npm` process; this read uses `/usr/bin/time` around the same command.
- **Host note:** `vitest_run_foreign` = 1 in every row. That process was `qe-ABC-271`'s `flock … npx vitest run src/levels.test.ts` waiting on the lock at 0 % CPU (seen with `ps`). `vitest_busy_foreign` = 0 in every row, so nothing foreign ran.

## NFR-005 / G6 (the depth-6 floor at `LEVELS[5]`): reported (`…3851bf43` 3)
- `qe-ABC-268`'s `g6.mjs`, `timed.mjs` and `host.mjs`, unchanged, in `g6` mode. ONE hold, 16:05:39Z–16:12:32Z. Wait-clear came before every read (load1 ≤ 2.0, Tctl ≤ 60), and load1 was at most 2.0 before any read.
- **5 interleaved rounds per board per build, 4 000 ms (`LEVELS[5]`):**

| board | base depths | head depths | median base / head | head nodes / base (median) | move |
|---|---|---|---|---|---|
| kiwipete | 9 9 9 9 9 | 9 9 9 9 9 | 9 / 9 | 2 743 576 / 2 810 136 = 0.976 | Bxa6 both |
| position-6 | 12 12 12 12 12 | 12 12 12 12 12 | 12 / 12 | 2 500 681 / 2 625 609 = 0.952 | Nd5 both |

- **No run is below depth 6 (NFR-005's limit), and none is below 9.** 0 WARN. The head is ≥ base by the median on both boards. **MET.** The longest read took 4 001.7 ms.
