---
id: 20261012T061500Z-qe-e2e-observation-abc116-qe-own-readings-a1-a2-69982a4f
kind: observation
by: qe-e2e
task: qe-ABC-116
at: 2026-10-12T06:15:00Z
verified_by:
confidence: high
refs:
  - ABC-116
  - A1
  - A2
  - AR-N8SPAWN-DRIFT
  - ADR-0017
  - ADR-0035
  - QE-116-a
  - QE-116-b
  - src/cli.test.ts
  - .grugops/context/qe-ABC-116/probe/qe-a2-runs.tsv
supersedes:
---

# QE `ABC-116`: A1 and A2, read at QE's own hand before the Engineer's notes and TSV were read

Hand-authored and unsealed. No `finding` is admissible on this install. The tip is `d39618d1`, read in
my own worktree on `grugops/qe-ABC-116`. The host is a Mac15,13 (8 cores, Darwin 25.5.0) on Node v26.11.0.

## A1: the JSDoc on `interface ChildOptions` (`src/cli.test.ts:310-346`, interface at `:347`)

`grep -n T2` hits `:322`, `:324`, `:330` and `:336`, all inside that block. All four required parts are present:
(i) argv, stdin script, substitution hook and settle; (ii) the per-child CPU re-measure "whether or not the count moves",
on the narrow set, with the median, R, the three states and `F` named without its number; (iii) the count
pin cannot see it; and (iv) `ADR-0017` decision 2 and the catalog's `G-QE115-3` section. The block also
names `AR-N8SPAWN-DRIFT` and carries a dated cost. **A1 MET as written.**

I then checked each claim in the block against the code.

| claim in the block | code | true? |
|---|---|---|
| argv = `childOf`'s `args` / `productArgv` | `childOf(command, args, productArgv, options)` `:364-369`. `args` is what `spawnSync` runs (`:373`). `productArgv` is a record of the product's argv, used by the `ABC-066` derivation (`:2034`). It is not executed. | true. `productArgv` over-includes, in the safe direction |
| stdin script = `input` | `ChildOptions.input` `:348` → `spawnSync({ input })` `:377` | true |
| substitution hook = `hook` | `ChildOptions.hook` `:349` → `--import <hook>` `:373` | true |
| **settle = `timeout`** | `ChildOptions.timeout` `:359` → `spawnSync({ timeout })` `:387`. This is the HANG BOUND (`A9_BOUND_MS` 4 s; default 30 s), and its own comment says it "is not a performance assertion". **This file's settle is `A9_SETTLE_SECONDS = 0.6` (`:484`): a `sleep` inside A9's `/bin/sh -c` argv (`:495`).** `:466` calls it `SETTLE`, and `:1813` calls it "a settle `sleep`". `ADR-0017` Alternatives 2 uses "settle budgets" in the same sense. | **FALSE: QE-116-a** |
| count pin = `N8_SPAWN`, `spawned`, `Object.keys(CHILDREN)` | `:1867-1869` | true |
| "on the surface such a hop has to edit" | The block's own measured mutant edits `CHILDREN.black` at `:695`, 350 lines below. It edits a `ChildOptions` VALUE, not the interface or `childOf`. Changing the hook's body (`FIRST_LEGAL_ENGINE`, `:645`), the settle (`:484`) or a shell argv string does not pass the block either. | **overclaims: QE-116-b** |
| `ADR-0017` d1 refuses a guard; `## Rollback` names the falsifier | ADR-0017 `:46-48`, `:163-169` | true |
| `ADR-0017` = whole lane, vitest 3.2.7, another worker count | ADR-0017 `:27` (Node v24.12.0, the lane, 40 files). The lockfile at `281807f4` has vitest 3.2.7, and `vitest.config.ts` there sets no `maxWorkers`. | true |
| +0.40 s wall / +0.52 s CPU more | 3.08 − 2.68 and 3.12 − 2.60 | true |

QE-116-a and QE-116-b are both inherited from the ticket's own `C2` paragraph. That paragraph says "`timeout`
(the settle)" and "a hop **must** edit one of them". The Engineer carried them faithfully.

## A2: the independent spot re-measure

- **Trees.** Two `git archive d39618d1` trees in the session scratchpad, outside the repository, with
  `node_modules` symlinked to the main checkout's. The mutant is the same one-line hook deletion: `:695`
  `{ hook: substituting("engine.ts", FIRST_LEGAL_ENGINE) }` → `{}`. `/usr/bin/diff -rq` shows that
  file as the only difference, and `/usr/bin/diff` on it shows the one line (`probe/qe-mutant.diff`).
- **Command.** `/usr/bin/time -l -o … npx vitest run src/cli.test.ts`. CPU = user + sys.
- **Window.** 60 s idle first and ≥ 20 s before every later run. Round 0 is a discarded warm-up. Then 5
  pairs, alternating B-M / M-B.
- **Logging.** Before and after every run I logged load1, `notifyutil -g
  com.apple.system.thermalpressurelevel`, the `pmset` power source and foreign runner processes. During
  each run I polled for them every 1 s. A process counted as foreign if it matched the runner name
  and was not a descendant of the run's root pid, decided from one `ps` snapshot.
- **Discards.** Any run with a foreign runner seen at any point was discarded and re-taken. Once a
  foreign runner was seen before launch, the second window waited it out instead of launching.

| round | order | base wall | mutant wall | Δ wall | base CPU | mutant CPU | Δ CPU | load1 pre (B, M) |
|---|---|---|---|---|---|---|---|---|
| 1 | B-M | 4.00 | 7.21 | +3.21 | 5.64 | 8.85 | +3.21 | 3.11, 3.00 |
| 2 | M-B | 4.00 | 7.11 | +3.11 | 5.58 | 8.78 | +3.20 | 3.48, 2.51 |
| 3 | B-M | 3.95 | 7.10 | +3.15 | 5.59 | 8.72 | +3.13 | 3.28, 3.20 |
| 4 | M-B | 3.88 | 6.97 | +3.09 | 5.46 | 8.67 | +3.21 | 4.12, 3.66 |
| 5 | B-M | 3.90 | 7.36 | +3.46 | 5.49 | 9.07 | +3.58 | 3.61, 3.52 |

- **Paired medians: +3.15 s wall and +3.21 s CPU.** Sign + on 5/5 for both. At n = 5, `ADR-0035`'s rule gives
  k = 1, so the interval is the full range: wall +3.09..+3.46 and CPU +3.13..+3.58.
- **Every kept run:** exit 0, `Tests 69 passed (69)`, thermal 0 before and after, AC power. load1 ran 2.51–4.58,
  logged and not gated.
- **Grade against the Engineer's +3.08 s wall / +3.12 s CPU:** the differences are +0.07 s wall and +0.09 s CPU,
  inside ±0.5 s, and the sign held in every pair. **A2 spot check PASSES.**
- **What this is not.** It has no identity twin, so it reports no R and no MET / NOT MET / UNRESOLVED state.
  It grades agreement only. It is not an `ADR-0035` reading and not a `T2` re-measure.
- **Discards.** In the first window (`probe/aborted-start-1/`), r1's mutant run was discarded 6 of 6 times. A
  foreign runner stayed present but idle (0.0 % CPU) from 05:57:30Z to about 06:02Z, and the harness gave
  up by design. In the second window, two r0 warm-up attempts were discarded. In both windows every
  foreign process was `pnpm exec vitest` (vitest 5.0.3) under
  `<private-repo>`, run from another Claude Code
  session's shell. **This repo was at width 1, but the host was not exclusive.**
- **Residual limit.** A foreign runner that lives less than about 1 s inside a run can be missed.
