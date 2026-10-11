---
id: 20261011T124750Z-security-nfr-observation-abc144-window-b-method-and-limits-866dc5af
kind: observation
by: security-nfr
at: 2026-10-11T12:47:50Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ADR-0040
  - ADR-0035
  - .grugops/context/design-ABC-144/notes/20261011T085525Z-architect-design-decision-abc144-quiet-window-measurement-plan-ff54a750.md
  - .grugops/context/design-ABC-144/probe/lane144.mjs
  - .grugops/context/secnfr-ABC-144-window-b/probe/lane144b.mjs
  - .grugops/context/secnfr-ABC-144-window-b/probe/lane144b.diff.txt
  - .grugops/context/secnfr-ABC-144-window-b/probe/window.sh
  - .grugops/context/secnfr-ABC-144-window-b/probe/window-once.txt
  - .grugops/context/secnfr-ABC-144-window-b/probe/resolved-workers.jsonl
supersedes:
---

# `ABC-144` Window B: how it was run, where it departs from the plan, and what is NOT a reading

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).

## As run

- **Width 1.** The Orchestrator held every other hop. The window ran 11:57:18Z–12:46:21Z on 2026-10-11.
  `foreign_vitest` was 0 **before and after** every one of the 81 runs. The sampler's runner-process count
  is non-zero only while the window's own runs were active.
- **Stack** (`probe/window-once.txt`): Mac15,13 Apple M3, 4 P + 4 E cores, Darwin 25.5.0, Node v26.11.0,
  vitest 3.2.7, `lowpowermode 0`, AC power on every run. The battery read 98 % "charging" at the start and
  100 % "charged" by 12:29Z.
- **Trees.** Base `B` = `5ed308a835ef4f115f2b09c60e0c842cab9c6f4e`. Twin `T` = the same commit, a separate
  tree. Head `H` = `5ddf150ee3df3dd4e5a1009f50a3d794073e752c`, the branch tip (code `d4468fd3`; the commits
  after it are docs only). Each tree had `node_modules` symlinked to the main checkout.
  `diff -rq -x node_modules -x .git B T` was clean. `B`→`H` differs in `vitest.config.ts`, `src/cli.test.ts`,
  the ticket page, `plans/traceability.md` and two QE/SE context folders.
- **Resolved workers before any timed run** (`probe/resolved-workers.jsonl`): B 7, T 7, H **3**. `isolate`
  is `true` in all three, and `VITEST_MAX_THREADS` is unset.
- **Steps, as `…ff54a750` Window B pre-registers them,** each with `CONDS=B,H,T BASE=B TWIN=T ROUNDS=9`,
  rotated order, and round 0 discarded, so n = 8:
  - B1 `GAP=0 TAG=abc144-warm`: 27 runs of `npm test`, 11:57:18Z–12:00:24Z.
  - B2 `GAP=90 TAG=abc144-cooled`: 27 runs, each after 90 s idle, 12:02:02Z–12:44:06Z.
  - B3 `GAP=0 NARROW=src/cli.test.ts TAG=abc144-cli-narrow`: 27 runs, 12:44:13Z–12:46:04Z.
- **0 harness errors in 81 runs.** Every run exited 0 with a fresh result file, 0 failed and 0 skipped.
  - Full lane: B and T read 55 files / 1728 tests; H read 55 / **1729** (base + 1, the `A7` pin, as
    `ADR-0040` d3 declares).
  - Narrow set: B and T read 1 file / 67 tests; H read 1 / 68.
- After the window, still at width 1: each `*_DEEP` lane once at B and once at H, timed
  (`probe/deep-walls.sh`). `LADDER_DEEP=1` was stopped part-way and not timed; `LADDER_DEEP=verdict` was not run
  (the readings note `…bfdcf3b3` says why). This is not part of the plan's window. `A6` asks for the walls, and QE recorded none.

## Where this departs from the plan, and why

1. **The harness is a copy with additive columns.** `ABC-144`'s page and the `ADR-0040` addendum require
   `thermalpressurelevel` before and after every run. `lane144.mjs` does not read it. `probe/lane144b.mjs`
   appends four columns after `status` (`thermal_before`, `thermal_after`, `foreign_after`,
   `power_after`) and prints the level on the console. Nothing else changed: the command, rotation, count
   assertions, CPU and wall parsing and the summary code are byte-identical (`probe/lane144b.diff.txt`).
2. **Git worktrees, not `git archive` trees.** These are the Orchestrator's mechanics for this subtask.
   Each tree carries a `.git` file, which no default-lane test reads. `src/ladder.test.ts` calls `git` only in
   its `LADDER_DEEP` path. The twin check excludes `.git`.
3. **The `src/cli.test.ts` pair straddles the config by design.** `ADR-0040` d5 says a pair whose sides
   differ in `vitest.config.ts` is not a reading of a ticket. Plan step B3 pre-registers this exact pair for
   `AR-N8SPAWN-DRIFT` and asks for the note beside it, so the note is in the decision note.

## Not a reading, or not delivered

- **`CPU_Speed_Limit`**: absent on this machine and `none` on all 81 runs. It is never a reading.
- **The full-lane `F` "under the cap"** (`ADR-0040` d4) is **not delivered by this window**. Both twins
  (warm and cooled) are copies of the **base**, at 7 workers. Their R is this window's full-lane R
  (warm 0.280 s CPU / 0.180 s wall; cooled 0.870 s / 0.220 s), but it is not an R taken under the cap. A twin
  of H would be needed. The owner of `F` is Architect/Design. The first three readings after the merge
  replace it, by d4's rule.
- **R-1's load1 ≤ 8 clause, warm state.** B had load1 > 8 before **4 of 8** scored runs, H 3 of 8 and T 3
  of 8. The clause labels an arm "not a reading" only when **more than half** of its runs are over 8, so all
  three count, and **B is exactly at the edge**. All of the load was the window's own; foreign was 0. In the
  cooled and narrow states, load1 before a run never passed 4.38. Load1 after a run reached at most 6.31.
- **One cooled head run stalled.** Round 7, H: wall **12.04 s** at a normal CPU of 22.15 s (CPU/wall
  1.84 against ~3.15 for the other runs). Load1 was 3.15 before and 3.27 after, thermal 0, foreign 0. The
  other 7 cooled H runs read 6.95–7.15 s. Because CPU did not rise, this was ~5 s of waiting, not work. **Its
  cause is `UNKNOWN - verify`.** No such run appeared in 24 other cooled runs, 24 warm runs or 24 narrow
  runs. It does not move a median. It is the only run in the window over 10 s.
- **The narrow set's base is this window's `B`.** "Its most recent admissible base reading" is read as this
  window's same-session base. The older base readings (`ABC-058` sets 1 and 2: 7.99 / 6.95 s CPU) are on
  other runtimes and under other load, and are cited for context only.
- **A neighbour-order effect is not excluded.** The rotation is a fixed cycle (Window A `…41ff7c05` § 4).
  Window A's one-sided twin wall offset (8/8) did **not** recur here: the twin wall sign was 4/8 warm and 3/8
  cooled.
- **The `bc` CPU column in `abc144-deep-walls.tsv`** prints values under 1 s without a leading zero (`.94`).
  That is cosmetic.

## Untouched

`src/`, `vitest.config.ts`, `plans/board.md`, `memory-bank/`, `plans/nfr-catalog.md`. Nothing was merged
or pushed.
