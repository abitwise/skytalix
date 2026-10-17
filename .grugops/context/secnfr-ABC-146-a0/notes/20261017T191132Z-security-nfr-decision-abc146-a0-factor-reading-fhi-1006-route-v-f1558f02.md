---
id: 20261017T191132Z-security-nfr-decision-abc146-a0-factor-reading-fhi-1006-route-v-f1558f02
kind: decision
by: security-nfr
at: 2026-10-17T19:11:32Z
verified_by:
confidence: high
refs:
  - ABC-146
  - ABC-085
  - ABC-152
  - ADR-0038
  - ADR-0041
  - ADR-0042
  - .grugops/context/secnfr-ABC-146-a0/notes/20261017T184318Z-security-nfr-decision-abc146-a0-preregistration-workload-n5-route-rule-107ff1bf.md
  - .grugops/context/secnfr-ABC-146-a0/probe/raw/a0.jsonl.txt
  - .grugops/context/secnfr-ABC-146-a0/probe/raw/a0.summary.json
supersedes:
---

# `ABC-146` `A0`: 10 of 10 node counts equal (29 717). Median `F` **0.954**, `F_hi` **1.006** ≤ 1.30. **Route V (vitest).**

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). The reading is graded
exactly as pre-registered in `…107ff1bf` (commit `1e2cae9f`). Nothing in the probe changed after that commit.

## The window

- **Attempt 1 was graded. Voided windows: 0.**
- Another project's vitest run (`/Users/olgeroeselg/Projects/public/grugops`, not started by this hop and not touched
  by it) was running from before 18:39Z. The driver held until it had been gone for 180 s.
- The set ran from **2026-10-17T19:11:07Z to 19:11:15.8Z**. No foreign process was seen before, during (polled every
  500 ms) or after any of the 10 runs. A post-run `ps aux` check also showed none.
- **Host:** Apple M3, Mac15,13 (MacBook Air, fanless), Darwin 25.5.0. **On battery for every run**
  ("Now drawing from 'Battery Power'"). Earlier readings were taken on AC (`…bceca0ca`).
- **Versions:** node **v26.11.1**; vitest **4.1.11** (`vitest/4.1.11 darwin-arm64 node-v26.11.1`). `package.json` pins
  `~4.1.11`.

## The readings (graded wall = the one `chooseMove` call, in-process)

| pair | order | node nodes | vitest nodes | node ms | vitest ms | ratio v ÷ n | load1 (n / v) | thermal before→after (n / v) |
|---|---|---:|---:|---:|---:|---:|---|---|
| 1 | node first | 29 717 | 29 717 | 206.3 | 189.9 | **0.920** | 4.92 / 4.92 | 0→0 / 0→0 |
| 2 | vitest first | 29 717 | 29 717 | 197.2 | 186.6 | **0.946** | 4.92 / 4.92 | 0→0 / 0→0 |
| 3 | node first | 29 717 | 29 717 | 189.0 | 190.1 | **1.006** | 5.01 / 5.01 | 0→0 / 0→0 |
| 4 | vitest first | 29 717 | 29 717 | 195.4 | 196.2 | **1.004** | 5.01 / 5.01 | 0→0 / 0→0 |
| 5 | node first | 29 717 | 29 717 | 200.4 | 191.1 | **0.954** | 5.01 / 5.01 | 0→0 / 0→0 |

- **Equal work:** all 10 runs returned 29 717 nodes, depth 5, score 55, move from 6 to 37 and virtual elapsed 4 200 ms.
  The result digest was `398995d95a12e6e6` on all 10.
- **Median `F` = 0.954. `F_hi` = 1.006** (pair 3).
- **load1** was 4.92–5.01 on every run. macOS refreshes load1 about every 5 s, so neighbouring runs repeat a value.
  The host was not idle: processes outside the void pattern were running. Load1 was recorded, not gated, as
  pre-registered.
- **Thermal pressure level was 0** before and after all 10 runs.
- **Supplementary, never used by the rule:** the child process wall, spawn to exit, was 275–324 ms for node and
  454–719 ms for vitest. That is vitest's start-up cost, paid once per process. A ~10 h verdict pays it once.

## The route

- **Rule (pre-registered, the page as amended 2026-10-17, the owner's "the worst of five decides"):** V iff
  `F_hi` ≤ 1.30.
- **`F_hi` = 1.006 ≤ 1.30 → route V.** The in-vitest projection is 10 h × 1.006 ≈ **10.1 h**, inside the accepted
  7–13 h band. This is a projection, not a reading.
- **What this says about `ABC-146`'s premise.** The ~4.35x per-node cost recorded in `…70684a78` is **not present**
  with `ABC-152`'s runner off: three of the five pairs read below 1.0. That matches `ADR-0041`/`ADR-0042`'s mechanism.
  It is a reading of this workload only.

## Limits

- **The call is short, ~190–206 ms.** At 2026-10-11 the same workload read 145 765 nodes; it now reads 29 717,
  because the engine has changed (`ABC-121`, `ABC-083`). The pair spread (0.920–1.006) is mostly noise at this
  size. The rule's 0.29 margin is far wider than that spread.
- **On battery, with load1 ~5.** Both arms were equally exposed, interleaved and with alternating order. There is
  no claim about AC or an idle host.

## Staleness inputs at the branch point (`main` `eb216351`)

- `vitest.config.ts`: md5 `2d2b6379dca047103493ab0bd9b10480`. It holds `pool: "threads"`, `maxWorkers: 2` and
  `experimental: { viteModuleRunner: false }`. It is unchanged since `1671f24f`, where `A0` was cut.
- Versions: node v26.11.1, vitest 4.1.11. These match the page's `1671f24f` re-read. `package.json` and
  `package-lock.json` are unchanged since `1671f24f`.
- **`PUZZLE_DEEP` engine trigger list:** `src/engine.ts`, `src/search*.ts`, `src/evaluate*.ts`, `src/quiescence.ts`
  and `src/transposition.ts` (move ordering is in `src/search.ts`). **None changed** in `1671f24f..eb216351`.
  `src/levels.ts` and `src/virtual-clock.ts` did not change either.
  The `src/` files that did change are `book.ts`, `cli.ts`, `render-seam.ts` and tests. None is on the list.
- `src/ladder.test.ts` md5 is `bba67b75565b4f4a2e8d231e8bcd6b2e`, byte-identical to `1031911b`.
- **`A0` goes stale** if a merge changes any of the above before the verdict starts (the page's staleness rule).

## Not done here, by the brief

- **The verdict run was not started.** The Orchestrator schedules it, at width 1. On route V, `A5`'s command is
  `LADDER_DEEP=verdict npx vitest run src/ladder.test.ts`, run directly and never through `npm test`.
- `A7` (the ADR headings, and a second addendum on route V) is Architect/Design's. It is owed before any verdict
  number is quoted.
- Nothing under `src/` or `tools/` changed. The check is `git diff --name-only eb216351 -- src/ tools/
  vitest.config.ts package.json`, which is empty.
- `plans/traceability.md` and `plans/board.md` were not touched.
