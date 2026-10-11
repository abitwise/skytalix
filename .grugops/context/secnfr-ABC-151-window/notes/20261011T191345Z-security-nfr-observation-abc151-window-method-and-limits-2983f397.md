---
id: 20261011T191345Z-security-nfr-observation-abc151-window-method-and-limits-2983f397
kind: observation
by: security-nfr
at: 2026-10-11T19:13:45Z
verified_by:
confidence: high
refs:
  - ABC-151
  - ADR-0040
  - ADR-0035
  - .grugops/context/secnfr-ABC-144-window-b/probe/lane144b.mjs
  - .grugops/context/secnfr-ABC-151-window/probe/harness-diff.txt
  - .grugops/context/secnfr-ABC-151-window/probe/window151.sh
  - .grugops/context/secnfr-ABC-151-window/probe/steps45.sh
  - .grugops/context/secnfr-ABC-151-window/probe/lanes151.sh
  - .grugops/context/secnfr-ABC-151-window/probe/gate.sh
  - .grugops/context/secnfr-ABC-151-window/probe/sampler.sh
  - .grugops/context/secnfr-ABC-151-window/probe/readout151.py
  - .grugops/context/secnfr-ABC-151-window/probe/window-once.txt
  - .grugops/context/secnfr-ABC-151-window/probe/resolved-workers.jsonl
  - .grugops/context/secnfr-ABC-151-window/probe/foreign-cpu.tsv
supersedes:
---

# `ABC-151` window: how it was run, the settle wait, where it departs, and what is NOT a reading

This note is hand-authored and unsealed.

## As run (2026-10-11, width 1 for this factory)

**Trees** were git worktrees in the session scratchpad, each with `node_modules` symlinked to the main checkout:
- B and T at `f439c8fd`;
- H detached at `612b7b6d`;
- a separate worktree on `grugops/ABC-151-two-test-workers` for this commit only. No run used it.

`/usr/bin/diff -rq -x node_modules -x .git B T` was clean. `package.json` and `package-lock.json` hash equal across B, H and the main checkout. vitest is 3.2.7.

**Resolved workers before any timed run** (`resolved-workers.mjs`): B 3, T 3, H **2**. `isolate` is `true` in all three, and no `VITEST_*` variable was set.

**Base is `f439c8fd`, not the moved wave tip.** The task names it, and `head = base + ABC-151` holds exactly against it.
- The wave tip has since moved to `13672ee3`.
- Its only non-state delta since `f439c8fd` is 35 comment-only lines in `tools/grugops/result-file-reporter.js` (`ABC-149`). No line outside comments changed.
- So the base is behaviourally the wave tip at k = 3. `ADR-0040` d5 (straddle) is not engaged.

**Steps, in addendum 2's fixed order:**

| step | what | UTC |
|---|---|---|
| 0 | settle (see below) | 16:56:09–17:18:36 |
| 1 | warm paired: B, H, T rotated, ROUNDS 9, GAP 0 (27 runs) | 17:18:36–17:22:25 |
| 2 | gate, then `A5` k = 2: H × 27, GAP 0 | gate 17:22:25–17:23:56; runs to 17:28:47 |
| 3 | gate, then `A5` k = 3: **B** × 27, GAP 0. This is the base tree; head was never run with `VITEST_MAX_THREADS=3` | gate 17:28:47–17:31:33; runs to 17:35:41 |
| 4 | owed, because warm + R = 9.265 s > 9.0 s. Gate, then cooled: B, H, T rotated, ROUNDS 9, GAP 90 | gate 17:36:38–17:38:09; runs 17:39:39–18:22:27 |
| 5 | lanes: each `*_DEEP` at H, then `ENGINE_DEEP` at B | 18:22:27–19:12:14 |

**135 harness runs with 0 harness errors.** 9 lane runs, all exit 0.

## The settle wait before the first graded run (asked for by the Orchestrator)

- **Dispatched with load1 falling from about 11.** At 16:51 local load was `4.41 8.92 11.54`, and at 16:54:10Z it was `3.37 6.93 10.35`.
- **Step 0 is a pre-condition this window added; the ticket does not set it.** It required 4 consecutive 15 s samples with all of:
  - level 0;
  - load1 ≤ 4.0 (Window B started at 3.56);
  - no `[v]itest` process.
- **It waited 22 min 27 s** (16:56:09Z → 17:18:36Z, 90 samples). The level was 0 throughout.
- **What held it was mostly a foreign runner, not load.** 86 of 90 samples saw another project's `vitest` process.
  From 16:58Z, load1 was ≤ 4.0 on 73 of 82 samples. The other 9 fell in one bump, 17:13:03Z–17:15:04Z, which peaked at 5.87.
- The gate passed at load1 2.28, level 0, battery 98 % and discharging. The first graded run started the same second.

## The foreign workload (`RISK-ABC151-FOREIGN`)

- **What it was:** `npm exec vitest run --exclude **/scripts/e2e/**` in `/Users/olgeroeselg/Projects/public/grugops`, started by a separate Claude session (parent pid 89838). **It is not a hop of this factory.** This hop did not and could not stop it.
- **When it ran:**
  - one run before 17:17:50Z;
  - another during `A5` k = 2 runs 1–20;
  - one started at 17:28:42Z, which covered all 27 `A5` k = 3 runs and most of the cooled step;
  - it was present during the lanes.
- **Its CPU:**
  - Live process CPU, logged every 30 s from 17:36:46Z (`probe/foreign-cpu.tsv`): mean **11.7 %** of one core in the cooled step and **22.1 %** in the lanes, with bursts to **214 %** and **241 %**.
  - A burst at 17:44:3xZ took load1 to **58.9** during cooled H round 1 (wall 10.46 s). Load1 decayed to 15.7 by T round 1.
  - **Its CPU during `A5` was not measured.** The harness's `foreign_vitest` column records only its presence.
  - Exited worker processes are not in the sum, so every foreign figure is a lower bound.
- **What it moves:** no grade flips on it. `A3` and `A4` hold in both states, and `A5`'s direction would favour k = 2 if anything, because the foreign runner touched more k = 3 runs. It does blur `A5`, and it widens the cooled CPU interval.

## Where this departs from the precedent, and the diffs

1. **The harness is `secnfr-ABC-144-window-b/probe/lane144b.mjs`, used in place, with no diff.** `/usr/bin/cmp` shows it identical to main's copy (sha256 `652b7793…`, `probe/harness-diff.txt`).
   - The `A5` sequences used it with a single condition (`CONDS=H` or `CONDS=B`, ROUNDS 27).
   - `A5` counts **all 27 runs** from the `.tsv`, including round 0, which is a run of the sequence. The harness's own summary discards round 0, and it is not used for `A5`.
2. **`sampler.sh` is a copy of Window B's with two changes:** a 300-minute cap instead of 120, and the output name `w151.thermal.tsv`. The full diff is in `probe/harness-diff.txt`.
   - Its comment line was corrected after the run to say "two changes" rather than "one". The logic is as run.
3. **New scripts:**
   - `gate.sh`: the 4 × 15 s level-0 gate, plus step 0's optional conditions;
   - `window151.sh`: steps 0–3;
   - `steps45.sh`: steps 4–5, launched once `A3` showed the cooled state was owed;
   - `lanes151.sh`: shaped on Window B's `deep-walls.sh`, with whole-tree lanes, a tree parameter and a files column;
   - `readout151.py`: reads only.
4. **The lanes run over the whole tree**, as QE's `collect.mjs` compared them, not over Window B's explicit file sets. So "equal to base" is checked against QE's base counts.
   - The lanes ran at head only, plus `ENGINE_DEEP` at base for addendum 2's projection.
   - `A6` asks for head's exits. Base exits were not re-run.
5. **Power:** the machine ran on **battery** for the whole window (98 % → 78 % by the lanes). Window B ran on AC. `lowpowermode` was 0.

## Not a reading, or not delivered

- **`CPU_Speed_Limit`**: absent, and `none` on every run and every sample.
- **A k = 2 full-lane twin R**: not delivered. Both twins are base copies at k = 3 (`RISK-ABC144-FCAP` stays open, as addendum 2 d4 expects).
- **`*.nfr` per-file status** is not logged by `lane144b.mjs`. QE's 20-run screen is `A6`'s evidence.
- **The direction of residual heat between the `A5` sequences** is not measured. The gate reads the level, not the chassis temperature.

## Untouched

`src/`, `vitest.config.ts`, `plans/board.md`, `plans/nfr-catalog.md`, `memory-bank/` and `AGENTS.md` were not touched. Nothing was merged or pushed.
