---
id: 20261019T222100Z-security-nfr-decision-abc174-a0-retake-preregistration-workload-n5-route-rule-5d2e7a41
kind: decision
by: security-nfr
at: 2026-10-19T22:21:00Z
verified_by:
confidence: high
refs:
  - ABC-175
  - ABC-174
  - ABC-173
  - ABC-146
  - ADR-0038
  - ADR-0045
  - ADR-0008
  - .grugops/context/secnfr-ABC-146-a0/notes/20261017T184318Z-security-nfr-decision-abc146-a0-preregistration-workload-n5-route-rule-107ff1bf.md
  - .grugops/context/secnfr-ABC-146-a0/notes/20261017T191132Z-security-nfr-decision-abc146-a0-factor-reading-fhi-1006-route-v-f1558f02.md
  - .grugops/context/secnfr-ABC-174-a0/probe/workload.mjs
  - .grugops/context/secnfr-ABC-174-a0/probe/node-run.mjs
  - .grugops/context/secnfr-ABC-174-a0/probe/a0.probe.test.mjs
  - .grugops/context/secnfr-ABC-174-a0/probe/pairs.mjs
supersedes:
---

# `ABC-174` `A0` re-take pre-registration, on the `ABC-175` run tree `f6b63c1c`: the same workload, n = 5 interleaved pairs, the same void rules and route rule (**V iff F_hi ≤ 1.30**). Committed before the first graded run

This note is hand-authored and unsealed. No sanctioned writer (`scripts/context-io.*`) exists on this install, and no
`finding` is admissible here (`AGENTS.md`). It is committed on the scratch branch `grugops/secnfr-ABC-174-a0` together
with the probe code, **before** the first graded run. Nothing below may change after this commit. A change would be a
new pre-registration and a new re-take.

## Why a re-take

`A0` (`…f1558f02`, read at `c639a220` on `eb216351`'s inputs) is **stale on the run tree**.
`git diff --name-only eb216351 f6b63c1c -- <ABC-175 A1 list> src/levels.ts src/virtual-clock.ts` prints
`package.json`, `src/engine.ts`, `src/evaluate.ts`, `src/levels.ts` and `vitest.config.ts`. `src/levels.ts` is not on
`A1`'s list (`ADR-0045` D6.5). The other four are on it. The owner's word of 2026-10-20 is "start A0 re-run".

## The tree

- Scratch worktree `../wt-a0-ABC-174`, on scratch branch `grugops/secnfr-ABC-174-a0`, created at **`f6b63c1c`**
  (`grugops/ABC-174`'s tip). `f6b63c1c` adds `AGENTS.md` only over `be6a5599`, the QE-passed `src/`.
  `grugops/ABC-174` is not moved. `node_modules` is a symlink to the main checkout's. `package-lock.json` is equal
  between `main` and `f6b63c1c`.
- The probe lives at `.grugops/context/secnfr-ABC-174-a0/probe/`, the same depth as `ABC-146`'s, so
  `../../../../src/` is the tree's `src/`.

## Unchanged from `…107ff1bf`

- **The workload.** `chooseMove(parseFen(start FEN), { budgetMs: 4000, now: virtualClock(120) })`, imported from
  `src/` by both arms. One call per fresh process, with no warm-up call. The graded wall is `performance.now()`
  around that one call. The child's wall from spawn to exit is supplementary only.
- **The arms.** node is `node probe/node-run.mjs`. vitest is
  `node node_modules/vitest/vitest.mjs run --config <tree>/vitest.config.ts --root <probe dir>`. The tree's
  `vitest.config.ts` is used **unedited** (md5 `326bc5ca578a29c48102e0192b4bfe5a`): `pool: "threads"`,
  `maxWorkers: 2`, `experimental.viteModuleRunner: false`, and now `globalSetup: ["./tools/grugops/heap-guard.js"]`
  (`ABC-173`). vitest is spawned directly, never through `npx` or `npm test`. Every `VITEST*` variable is
  stripped from both children.
- **n = 5 pairs, interleaved.** Odd pairs run node first, and even pairs run vitest first. That is 10 fresh processes.
- **The quiet gate.** 180 s with no foreign process, polled every 5 s. Foreign processes are checked before and after
  every run, every 500 ms during one, and at the end of the set.
- **The void rules.** Each of these voids the whole set: a foreign sighting at any point, a non-zero child exit, or
  10 node counts or digests that are not all equal. A voided or partial set is never graded. The driver re-takes from
  pair 1, up to 8 attempts.
- **The numbers and the rule.** Each ratio is vitest call wall ÷ node call wall. `F` is the median of the 5, and
  `F_hi` is the largest. **Route V iff `F_hi` ≤ 1.30, otherwise route N.** The worst of the five decides (the owner's
  word of 2026-10-17).
- **Logged, not gated.** These are logged for each run: `load1` before it, thermal pressure level before and after,
  and the power source before it.

## Changes, each forced by the tree or asked for by the brief

- **C1, the heap cap on the vitest arm.** The vitest child gets `NODE_OPTIONS=--max-old-space-size=400`. That is
  `FLAGS_MIB.oneFile` from the tree's `heap-guard.js`, which the driver asserts at start. It is the ONE-FILE flag
  that `ADR-0008` addendum 2026-10-19 puts on every one-file vitest command. **Without it the guard refuses the run.**
  Smoke-read: unprefixed exits 1 with `heap-guard: refused … 4192 MiB, above the ONE-FILE row of 496 MiB`, and no
  test runs. The node arm is unchanged, with `NODE_OPTIONS` stripped: route N is plain `node`, which the cap does not
  cover. So **the arms now differ in heap ceiling** (496 MiB against 4192 MiB). That difference is what the route-V
  verdict will actually run under, and it is what this re-take measures. Every record carries `heapLimitMiB`, read
  after the graded call.
- **C2, the guard's path under `--root`.** vitest resolves `globalSetup` against `root`
  (`vitest/dist/chunks/coverage.DM_a_rWm.js:341`: `resolvePath(file, resolved.root)`). So with the probe directory
  as root, the config's `./tools/grugops/heap-guard.js` would miss. `probe/tools/grugops/heap-guard.js` is a
  **symlink** to the tree's `tools/grugops/heap-guard.js`. The config stays unedited and the real guard runs: the
  refusal stack frame reads `../../../../tools/grugops/heap-guard.js`. One file is symlinked, not the directory, so
  `tools/grugops/qe-hop-integrity.test.ts` is not collected. The guard reads 1 file, which is the ONE-FILE row.
- **C3, a wider definition of foreign** (the brief: "nothing else of ours"). The pattern is
  `/vitest|oeselg-labs\/platform|cli-chess-example|wt-ABC-|wt-a0-ABC-/`. The driver, its ancestors and its
  descendants are still excluded.
- **C4, a window deadline.** If no 180 s quiet window opens within 540 s of the driver's start, the driver logs
  `owed` and exits 4. **A0 is then OWED. Nothing is estimated.** A later invocation appends to the same raw log. The
  reading is the first set that grades.
- **C5, a window record.** `ps -u <uid>` line count at set start and set end, plus load1, thermal state and power at
  both ends.
- **Workload record.** `workload.mjs` reads `heapLimitMiB` after `t1`. The graded section is byte-identical to
  `ABC-146`'s.

## Facts recorded before the first graded run (setup, ungraded)

- **Pre-step (owed before merge).** `npm test` on `f6b63c1c` in `../wt-ABC-174` exited 0: 59 files, 1987/1987.
  `.test-results/last-run.json` has `success: true` and 59 `testResults`. The guard rows passed: `ABC-065` 4/4,
  `ABC-109` 1/1, `ABC-059` 1/1 (`src/cli.test.ts`).
- **One ungraded smoke run per arm.** Both exited 0. Each read **29 717 nodes**, depth 5, score 55, digest
  `398995d95a12e6e6`. That matches `…f1558f02`, so `ABC-170`'s optional `maxDepth`/`maxNodes` do not change this
  call. Call walls were 190.1 ms (node, heap 4192 MiB) and 187.0 ms (vitest, heap 496 MiB). **These runs are not
  graded and are not part of `A0`.**
- **Inputs at `f6b63c1c`.**
  - `vitest.config.ts` md5 `326bc5ca578a29c48102e0192b4bfe5a`
  - `src/ladder.test.ts` md5 `bba67b75565b4f4a2e8d231e8bcd6b2e` (unchanged from `eb216351`)
  - `package.json` md5 `9e31cec4a1681ff1361333546e8158ed`
  - `package-lock.json` md5 `ed7a5b0c455a3cc59fd76a686192c7b8`
  - node `v26.11.1`, and `vitest/4.1.11 darwin-arm64 node-v26.11.1`
- **Host at pre-registration.** Apple M3 Mac15,13, **on battery**, thermal pressure level 0, load1 2.54,
  `ps -u` 400 lines (limit 2666). No foreign process was running.
