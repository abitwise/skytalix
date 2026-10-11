---
id: 20261011T231055Z-security-nfr-observation-abc152-window-method-and-limits-397a05b6
kind: observation
by: security-nfr
at: 2026-10-11T23:10:55Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - ADR-0040
  - ADR-0035
  - RISK-ABC151-FOREIGN
  - RISK-ABC147-01
  - .grugops/context/secnfr-ABC-144-window-b/probe/lane144b.mjs
  - .grugops/context/secnfr-ABC-152-window/probe/window152.sh
  - .grugops/context/secnfr-ABC-152-window/probe/step3b.sh
  - .grugops/context/secnfr-ABC-152-window/probe/puzzle152.sh
  - .grugops/context/secnfr-ABC-152-window/probe/gate.sh
  - .grugops/context/secnfr-ABC-152-window/probe/sampler.sh
  - .grugops/context/secnfr-ABC-152-window/probe/readout152.py
  - .grugops/context/secnfr-ABC-152-window/probe/harness-diff.txt
  - .grugops/context/secnfr-ABC-152-window/probe/gate.tsv
  - .grugops/context/secnfr-ABC-152-window/probe/sequences.tsv
  - .grugops/context/secnfr-ABC-152-window/probe/window-once.txt
  - .grugops/context/secnfr-ABC-152-window/probe/resolved-workers.jsonl
supersedes:
---

# `ABC-152` window: how it was run, the wait for the foreign runner, the departures, and what is NOT a reading

This note is hand-authored and unsealed.

## Trees (ruling 6)

- **Three detached git worktrees in the session scratchpad.** Each was built by its own `npm ci` from its own lockfile
  (`probe/v12/npmci.txt`). **None symlinks `node_modules`.** The main checkout's `node_modules` and branch were not
  touched.
  - **B** and **T**: `91024242` (`main` at k = 2, the build's merge-base).
  - **H**: `3c55b965` (the branch tip).
- **B and T are byte-identical**, `node_modules` included (`/usr/bin/diff -rq -x .git`, exit 0).
- **Logged before the first run** (`probe/resolved-workers.jsonl`, each tree running its **own in-tree copy** of the
  probe):
  - `npm ls vitest @vitest/coverage-v8 vite` exits 0 in each tree: B and T run vitest 3.2.7, H runs 4.1.11, and
    vite is 7.3.6 in all three;
  - resolved workers: B 2, T 2, H 2, `isolate: true` in all three;
  - **H: `viteModuleRunner: false`**, `projects` null, `poolOptions` absent;
  - no `VITEST_*` variable was set.
  - The probes import `vitest/node`, which Node resolves **from the script's own location**. A copy run from the main
    checkout would have read the main checkout's 3.2.7 for every tree. So each tree ran its own copy.
- **Smoke runs before the window** (untimed, not readings): B and T at 56 / 1740 and H at 56 / 1741, each exit 0.
- A fourth worktree on `grugops/ABC-152-vitest-4-1-runner-off` was used only to commit these notes. No run used it.

## Steps, as run (`probe/sequences.tsv`, `probe/window-once.txt`)

| step | what | UTC |
|---|---|---|
| 0 | settle gate: 4 consecutive 15 s samples at level 0, load1 ≤ 4.0, no `[v]itest` process | 22:40:16–22:55:24 |
| 1 | warm paired: B, H, T rotated, ROUNDS 9, GAP 0 (27 runs) | 22:55:24–22:59:04 |
| 2 | cooled: **not owed** (H warm 6.115 + T wall R 0.190 = 6.305 s ≤ 9.0 s), decided by `readout152.py --owed` | 22:59:10 |
| 3 | the same gate (passed 23:00:41), then `PUZZLE_DEEP=1`, B and H, 5 rounds: **first pass, superseded by 3b** (see below) | 22:59:10–23:04:05 |
| 3b | the same gate (passed 23:06:29), then the re-run with `--reporter=verbose` | 23:04:57–23:09:28 |

**37 graded process runs** (27 warm and 10 puzzle) plus 10 first-pass puzzle runs. **0 harness errors**, and every
run exited 0.

## The wait before the first graded run (the task asked for it)

- **The gate held for 15 min 8 s** (22:40:16Z → 22:55:24Z, 61 samples; `probe/gate.tsv`).
- **Another project's test runner was present on 54 of the 61 samples:** `npm exec vitest run --exclude
  **/scripts/e2e/**` in `/Users/olgeroeselg/Projects/public/grugops`, under parent pid 89838.
  - It is a separate Claude session, not a hop of this factory.
  - **This hop did not touch it**, as the task required.
  - It had been alive for about 9 minutes when this hop was dispatched. Its worker pid kept cycling, so it was
    running, not hung.
  - **That run exited at about 22:52:15Z.** The gate's streak reached 3 of 4 (22:52:22Z–22:52:52Z).
  - **Then the same session started short runs, from about 22:53:05Z to 22:54:25Z.** They were seen on 6 gate
    samples, and they reset the streak.
  - The gate passed on the 4th clean sample after them, at 22:55:24Z.
- **What else held the gate:**
  - thermal level 1 on 4 samples (22:41:16Z–22:42:02Z);
  - load1 > 4.0 on 4 samples (22:41:16Z, 22:41:31Z, 22:47:04Z and 22:49:36Z; peak 4.35).
  - Level 1 came early, after this hop's three `npm ci` and smoke runs. On every one of those 8 samples the foreign
    runner was present as well.
- **The foreign runner's live CPU during the wait:** mean 11.9 %, max 112.8 % of one core (`w152.thermal.tsv`,
  `foreign_cpu_pct`). Exited workers are not in the sum, so this is a lower bound.
- **The gate passed at load1 2.44, level 0, on AC power (80 %, "AC attached; not charging").** The first graded run
  started in the same second.
- **The later gates** waited 1 min 31 s (step 3) and 1 min 32 s (step 3b).

## The foreign runner during the graded runs (`RISK-ABC151-FOREIGN`)

- **Warm step:** present before **0 of 27** runs and after **0 of 27** (`lane144b.mjs`'s `foreign_vitest` and
  `foreign_after` columns).
- **Step 3b:** present before **0 of 10** runs (`puzzle152.sh`'s `foreign_before`).
- **First puzzle pass:** present before **7 of 10** runs. The same session started
  `vitest run … install/install.test.ts` at about 23:01:24Z. That pass grades nothing.
- **A limit of this instrument:** presence is read at run boundaries only. A foreign run that began and ended inside
  one 6–9 s run would not be seen. The sampler cannot settle that (next item).

## Where this departs from the precedent, and the diffs (`probe/harness-diff.txt`)

1. **`lane144b.mjs` was used in place, with no diff.** Its sha256 is `652b7793…` on `main` and on the branch.
2. **`gate.sh` is a byte copy** of `secnfr-ABC-151-window/probe/gate.sh` (`/usr/bin/cmp`, exit 0). Every gate here ran
   with the full step-0 conditions (level 0, load1 ≤ 4.0, no runner), including the step 3 / 3b gates, where `ABC-151`
   used the level alone.
3. **`sampler.sh`** is `ABC-151`'s with three changes: the file name, a 360-minute cap, and a `foreign_cpu_pct` column.
   - **That column is wrong while this window's own runs execute.** It filters on the arms path, but a run's command
     lines carry relative paths, so this window's own runner was summed in. During steps 1, 3 and 3b it reads 67–105 %
     mean. **It is valid only while no run of this window is live,** which covers every gate wait.
   - `sampler.sh.append` is the same script, appending rather than truncating, for step 3b.
4. **New scripts:**
   - `window152.sh`: steps 0–3;
   - `step3b.sh`: the 3b re-run;
   - `puzzle152.sh`: the puzzle reading. It is not `lane144b.mjs`, because the graded number is the suite's **printed**
     wall, and the harness discards the child's stdout;
   - `readout152.py`: reads only. Its order statistics are `readout151.py`'s.
5. **`puzzle152.sh` was amended after its first pass, before 3b, and the amendment is disclosed here.**
   - The first pass ran without `--reporter=verbose`. On vitest 4.1 a passing test's stdout prints only under the
     verbose reporter (as QE recorded, `qe2-ABC-152` artifact-ref), so H printed no `PUZZLES … wall`.
   - The amendment adds `--reporter=verbose` to **both** arms and changes nothing else. `puzzle152.first-pass.sh` is
     the script as first run.
   - It was named after the reading. It is a reading, not a gate, so no grade depends on it.
6. **Power: AC for the whole window.** That matches Window B. `ABC-151` ran on battery.
7. **n = 8** (ROUNDS 9), the minimum the ticket allows. This matches `ABC-151`.

## Not a reading, or not delivered

- **The cooled state:** not owed and not read. `V10`'s warm + R is 6.305 s, against the 9.0 s trigger.
- **A cooled twin R at k = 2:** not read, for the same reason. The `FCAP` reading is warm only.
- **The opt-in lanes:** QE read them for `V8`. This window was not asked for them, apart from `PUZZLE_DEEP=1`.
- **`*.nfr` per-file status:** `lane144b.mjs` does not log it. QE's 20-run `V7` screen is the evidence.
- **Chassis temperature:** the gate reads the pressure level, not the temperature.
- **No reading was profiled** (`RISK-ABC147-01`).

## Untouched

`src/`, `vitest.config.ts`, `plans/board.md`, `plans/nfr-catalog.md`, `memory-bank/` and `AGENTS.md` were not
touched. **Nothing was merged or pushed.** The foreign session's processes were not signalled.
