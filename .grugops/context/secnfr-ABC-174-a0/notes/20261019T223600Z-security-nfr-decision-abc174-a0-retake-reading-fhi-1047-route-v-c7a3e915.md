---
id: 20261019T223600Z-security-nfr-decision-abc174-a0-retake-reading-fhi-1047-route-v-c7a3e915
kind: decision
by: security-nfr
at: 2026-10-19T22:36:00Z
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
  - .grugops/context/secnfr-ABC-174-a0/notes/20261019T222100Z-security-nfr-decision-abc174-a0-retake-preregistration-workload-n5-route-rule-5d2e7a41.md
  - .grugops/context/secnfr-ABC-174-a0/notes/20261019T223300Z-security-nfr-decision-abc174-a0-retake-preregistration-r2-iterm-helper-not-foreign-9b41c6e3.md
  - .grugops/context/secnfr-ABC-174-a0/probe/raw/a0.jsonl.txt
  - .grugops/context/secnfr-ABC-174-a0/probe/raw/a0.summary.json
supersedes: 20261017T191132Z-security-nfr-decision-abc146-a0-factor-reading-fhi-1006-route-v-f1558f02
---

# `ABC-174` `A0` re-take on the run tree `f6b63c1c`, under `ABC-173`'s heap cap: 10 of 10 node counts equal (29 717). Median `F` **0.978**, `F_hi` **1.047** ≤ 1.30. **Route V (vitest)**

This note is hand-authored and unsealed. No sanctioned writer exists on this install, and no `finding` is admissible
here. The reading was graded exactly as pre-registered:

- `…5d2e7a41`, commit `44bf7066`;
- as re-registered by `…9b41c6e3`, commit `1393ddda`, before any graded set. That note's `at` (22:33:00Z) was written
  ahead of the commit, and the commit time, 22:31Z, is authoritative.

Nothing in the probe changed after `1393ddda`. This reading **supersedes `…f1558f02` as the `A0` in force** for
`ABC-175` `A1`.

## The window

- **Invocation 1** (22:21:28Z–22:30:29Z) was **OWED**. No 180 s window opened, because iTerm's `pidinfo --git-state`
  helper kept matching C3. **No set started.** It is logged as `owed` in `raw/a0.jsonl.txt`.
- **Invocation 2, attempt 1, was graded. Voided sets: 0.**
  - The quiet gate held from 22:31:39.9Z, with nothing foreign at any poll.
  - The set ran from **2026-10-19T22:34:42.2Z to 22:34:49.9Z**, 182 s after the window opened.
  - No foreign process was seen before, during (polled every 500 ms) or after any of the 10 runs, or at set end.
  - Foreground checks were clean before (22:31:32Z) and after (22:35:13Z): no vitest process, no
    `oeselg-labs/platform` process and nothing else naming this repo.
- **Host.** Apple M3, Mac15,13 (MacBook Air, fanless), Darwin 25.5.0.
  - **On AC power for every run** (`Now drawing from 'AC Power'`). `ABC-146`'s `A0` was on battery.
  - Thermal pressure level **0** before and after all 10 runs, and at set start and end.
  - **load1** was 1.80 (pairs 1–3) and 1.74 (pairs 4–5). It was 1.48 at the post-check.
  - `ps -u <uid>` read **444** lines at set start and **448** at set end (per-user limit 2666).
- **Versions:** node **v26.11.1**; vitest **4.1.11** (`vitest/4.1.11 darwin-arm64 node-v26.11.1`).
- **Heap ceilings, read in each child after the graded call:** node arm **4192 MiB** on all 5 runs (Node's default).
  vitest arm **496 MiB** on all 5 runs (`ABC-173`'s ONE-FILE row, flag 400). The real `heap-guard.js` admitted every
  vitest run, and every one exited 0.

## The readings (graded wall = the one `chooseMove` call, in-process)

| pair | order | node nodes | vitest nodes | node ms | vitest ms | ratio v ÷ n | load1 (n / v) | thermal before→after (n / v) |
|---|---|---:|---:|---:|---:|---:|---|---|
| 1 | node first | 29 717 | 29 717 | 186.1 | 194.8 | **1.047** | 1.80 / 1.80 | 0→0 / 0→0 |
| 2 | vitest first | 29 717 | 29 717 | 193.5 | 185.1 | **0.957** | 1.80 / 1.80 | 0→0 / 0→0 |
| 3 | node first | 29 717 | 29 717 | 192.3 | 188.0 | **0.978** | 1.80 / 1.80 | 0→0 / 0→0 |
| 4 | vitest first | 29 717 | 29 717 | 189.0 | 186.7 | **0.988** | 1.74 / 1.74 | 0→0 / 0→0 |
| 5 | node first | 29 717 | 29 717 | 190.2 | 185.5 | **0.975** | 1.74 / 1.74 | 0→0 / 0→0 |

- **Equal work.** All 10 runs returned 29 717 nodes, depth 5, score 55, the move from 6 to 37 and 4 200 ms of virtual
  time elapsed. The digest was `398995d95a12e6e6` on all 10. That is the same digest as `…f1558f02`, so `ABC-170`'s
  `src/engine.ts` change and `ABC-169`'s `src/evaluate.ts` comment leave this call's search unchanged.
- **Median `F` = 0.978. `F_hi` = 1.047** (pair 1).
- **Supplementary, never used by the rule.** The child process wall, from spawn to exit, was 273–282 ms for node and
  436–684 ms for vitest. That is vitest's start-up cost, paid once per process.

## The route

- **The rule** (pre-registered, unchanged from `ABC-146`): **V iff `F_hi` ≤ 1.30.**
- **`F_hi` = 1.047 ≤ 1.30, so the route is V.** It is the same route as `ADR-0038` addendum 2, so no ADR change follows.
  The rule's 0.25 margin is far wider than this set's spread (0.957–1.047).
- **The cap is in the reading.** The vitest arm ran at 496 MiB, against node's 4192 MiB, and was no slower. On this
  workload, `ABC-173`'s heap ceiling costs nothing measurable. This is a reading of this workload only. It says
  nothing about the verdict's memory need over 180 games (see Limits).

## Limits

- **The call is short, about 185–195 ms**, the same workload as `…f1558f02`. The pair spread is mostly noise at this
  size.
- **This is one host state: on AC, load1 about 1.8.** Both arms were equally exposed, interleaved and in alternating
  order. There is no claim about battery power or an idle host.
- **Memory over a whole verdict is not read here.** `A0` reads the factor of one call. Whether 180 verdict games stay
  under 496 MiB is `UNKNOWN - verify`. `ABC-175` `A1`'s `-t "3v4"` probe and the run itself are the first readings
  at step 4.

## Staleness inputs at the run tree `f6b63c1c`

- `vitest.config.ts` md5 **`326bc5ca578a29c48102e0192b4bfe5a`**. It holds `pool: "threads"`, `maxWorkers: 2`,
  `experimental.viteModuleRunner: false` and `globalSetup: ["./tools/grugops/heap-guard.js"]` (`ABC-173`, commit
  `affee860`).
- `src/ladder.test.ts` md5 **`bba67b75565b4f4a2e8d231e8bcd6b2e`**. It is unchanged since `eb216351`, so the verdict
  row count stays 17.
- `package.json` md5 `9e31cec4a1681ff1361333546e8158ed`, and `package-lock.json` md5
  `ed7a5b0c455a3cc59fd76a686192c7b8`.
- `node --version` **v26.11.1**. `npx vitest --version` **`vitest/4.1.11 darwin-arm64 node-v26.11.1`**.
- `tools/grugops/heap-guard.js` `FLAGS_MIB.oneFile` is **400** (the C1 flag). It is not on `A1`'s list, but
  `ABC-175` `A6` fences `tools/` anyway.
- **The `A0` commit for `ABC-175` `A1`** is this note's commit on `grugops/secnfr-ABC-174-a0`, named in the done
  file. Its tree differs from `f6b63c1c` under `.grugops/context/secnfr-ABC-174-a0/` only, so `f6b63c1c` gives the same
  empty diff on every path `A1` lists.
- **`A0` goes stale** if any of the above changes before the verdict starts (`ADR-0038` addendum 2).

## Not done here, by the brief

- **The verdict run was not started.** It belongs to the Orchestrator, overnight, at width 1.
- `plans/board.md`, `plans/traceability.md` and `plans/nfr-catalog.md` were not touched. The trace row is in the
  done file.
- `grugops/ABC-174` was not moved.
- The check is `git diff --name-only f6b63c1c <A0 commit> -- src/ tools/ AGENTS.md vitest.config.ts package.json package-lock.json`.
  It prints nothing: 0 lines under `src/` or `tools/`, and 0 lines of `AGENTS.md`.
