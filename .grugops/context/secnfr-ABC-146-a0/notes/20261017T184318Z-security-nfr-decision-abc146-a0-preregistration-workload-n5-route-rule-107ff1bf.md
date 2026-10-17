---
id: 20261017T184318Z-security-nfr-decision-abc146-a0-preregistration-workload-n5-route-rule-107ff1bf
kind: decision
by: security-nfr
at: 2026-10-17T18:43:18Z
verified_by:
confidence: high
refs:
  - ABC-146
  - ABC-085
  - ADR-0038
  - .grugops/context/ticket-to-pr-ABC-085/notes/20261011T093952Z-software-engineer-observation-abc085-vitest-runner-4x-slower-verdict-cost-estimate-x4-70684a78.md
  - .grugops/context/secnfr-ABC-146-a0/probe/workload.mjs
  - .grugops/context/secnfr-ABC-146-a0/probe/node-run.mjs
  - .grugops/context/secnfr-ABC-146-a0/probe/a0.probe.test.mjs
  - .grugops/context/secnfr-ABC-146-a0/probe/pairs.mjs
supersedes:
---

# `ABC-146` `A0` pre-registration: the workload, n = 5 interleaved pairs, the void rules and the route rule (**V iff F_hi ≤ 1.30**), committed before the first graded run

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). It is committed on
`grugops/ABC-146-ladder-verdict` together with the probe code, **before** the first graded run. Nothing below may be
changed after this commit; a change would be a new pre-registration and a re-take.

## Branch point

- Branched from `main` **`eb216351`**. The brief named `13897307`. `eb216351` is one commit later and changes
  `plans/board.md` only (`git diff --stat 13897307 eb216351`: 1 file, +1).
- `f00038ef` (`ABC-083`) and `7a920ca5` (`ABC-152`) are ancestors (`git merge-base --is-ancestor`, exit 0 for each).

## The workload (the page's `A0`, as in `…70684a78`)

- `chooseMove(parseFen(start FEN), { budgetMs: 4000, now: virtualClock(120) })`, imported from `src/` by both arms
  (`probe/workload.mjs`).
- **One call per process, no warm-up call.** The graded wall is `performance.now()` around that one call.
- The child process's own wall, spawn to exit, is logged as **supplementary only**. It is never used by the rule.

## The two arms

- **node:** `node probe/node-run.mjs`.
- **vitest:** `node node_modules/vitest/vitest.mjs run --config <worktree>/vitest.config.ts --root <probe dir>`.
  The repository's own `vitest.config.ts` is loaded **unedited**: `pool: "threads"`, `maxWorkers: 2`,
  `experimental.viteModuleRunner: false`. The probe directory is the root because the config's `exclude` names
  `.grugops/**` relative to the root. It is the only way that config can collect a file here without being edited.
  `vitest` is spawned directly, not through `npx` or `npm test`.
- Both children inherit the environment with every `VITEST*` variable and `NODE_OPTIONS` removed.

## n, order, window

- **n = 5 pairs**, interleaved. Odd pairs run node first, even pairs run vitest first. That makes 10 fresh processes.
- **Quiet gate:** a set starts only after **180 s** with no foreign process. The check polls every 5 s.
- **Foreign** means a `ps aux` line that matches `/vitest|oeselg-labs\/platform/` and whose PID is not the driver,
  one of its ancestors or one of its descendants. It is checked before and after every run, and every 500 ms
  during one.
- **Void rules.** Each of these voids the **whole set** in progress:
  - a foreign process seen at any point;
  - any child that exits non-zero;
  - **10 node counts (and result digests) that are not all equal**.
  A voided set is logged and never graded. A partial set is never graded. The driver waits for a new quiet window
  and re-takes the set from pair 1, up to 8 attempts.
- **Logged per run:** `load1` (`os.loadavg()[0]`) before the run, `com.apple.system.thermalpressurelevel` before
  and after it, and the power source before it.
  No threshold is set on any of them. They are recorded, not gated.

## The numbers and the rule

- Each pair's ratio is vitest call wall ÷ node call wall. `F` is the median of the 5. `F_hi` is the largest of the 5.
- **Route V (vitest) iff `F_hi` ≤ 1.30.** Otherwise **route N (plain `node`)**. This is the page's rule as amended
  2026-10-17: 10 h × `F_hi` ≤ 13 h. The owner's word of 2026-10-17, relayed by the Orchestrator's brief, is that
  the worst of the five decides.
- Versions are read with `node --version` and `npx vitest --version`.

## Facts recorded before the first graded run (setup, ungraded)

- **One ungraded smoke run per arm** checked that the harness works. Both exited 0.
  - Both read **29 717 nodes**, depth 5, digest `398995d95a12e6e6`.
  - Call walls were ~197 ms (node) and ~221 ms (vitest).
  - A foreign `vitest` process belonging to another project was running at the time. **These two runs are not part
    of A0 and are not graded.**
- **The node count is not `…70684a78`'s 145 765.** The engine has changed since then (`ABC-121`, `ABC-083`). The page's
  bar is that the 10 counts are equal, not that figure. The call is therefore ~5x shorter than the 2026-10-11 reading's
  ~780 ms, so a fixed per-call cost weighs more in each ratio. **This is a limit of the workload as the page fixes it.
  It is stated here, and the workload is not rescaled.**
- **Host:** Apple M3 (fanless Air), Darwin 25.5.0, **on battery** at pre-registration (`pmset -g batt`). The power
  source is logged per run.
