---
id: 20260810T202912Z-architect-design-observation-28788b30
kind: observation
by: architect-design
at: 2026-08-10T20:29:12Z
verified_by: 
confidence: high
refs:
  - ABC-026
  - ABC-025
  - ABC-024
  - N5
  - NFR-008
  - plans/nfr-catalog.md
  - plans/tickets/ABC-026-default-lane-cumulative-budget.md
supersedes: 
---

# The measurements: **a test FILE costs 368–504x a test**, the per-file floor is a curve with `R² 0.9999`, and the 30% saving that lever offers is green in **4 of 21 runs**

This is an `observation` and **not** a `finding`: there is no §14 gate verdict on this hop,
`context.human_admission` is `off`, so no verification stamp exists and none was invented. The
rulings are in the `decision` note beside this one; this note carries numbers and the instrument.

## The instrument

Own harness outside the repository. **19 out-of-tree working copies**, `src/` copied to a scratchpad
with `node_modules` **symlinked** to the repository's, `package.json` / `tsconfig.json` /
`biome.json` copied. **Every copy of a repository file was `cmp`-verified byte-identical per file
before any condition was applied** — 37 files × 7 full-lane trees, 35 × 5 reduced trees — and **the
repository's own `src/` was never written**, re-verified at the end: 37 md5s identical before and
after, `git status --short -- src/` empty.

`/usr/bin/time -p`, **one fresh OS process per run**, wall (`real`) and CPU (`user + sys`) recorded
separately and **never blended**. Interleaved, **condition order rotated every round**, round 0
discarded as warm-up, **n = 8 usable rounds** per condition per sample. **Every run asserts its own
test-file count AND its own test count** — a run whose tree state is not what its label claims is a
harness error and never a datum. **0 harness errors across 11 measurement suites / 612 recorded
runs**, plus 9 deliberately-failing `--no-isolate` runs (data of a different kind) and 33 standalone
determinism runs. The statistic is the **median of paired per-round deltas** with the **sign test**
beside it.

**Machine: Apple M3 (Mac15,13), 8 logical cores (`availableParallelism()` = 8, vitest's default
worker count `n − 1` = 7), Darwin 25.5.0 arm64, Node v24.12.0, npm 11.7.0, vitest 3.2.7, no
`vitest.config.*` in the repository.** `UNKNOWN - verify` on any other hardware.

## 1 — today's lane, in the units an engineer types

```
npm test, 22 files / 676 tests      WALL median            CPU median
  quietest sample (n=8)          1.565 s (1.500-1.720)   7.205 s (7.170-7.230)  <- CPU spread 0.8%
  mid-session sample (n=8)       1.765 s (1.61 -2.50 )   7.640 s (7.29 -8.10 )
  runner invoked directly        1.630-1.665 s           7.475-7.670 s
BA/PM, a few hours earlier, 20 files / 652 tests (the same lane one ticket smaller)
                                 1.380-1.435 s           6.310-6.365 s
```

**`npm` itself costs +150 ms wall / +110 ms CPU over the direct runner** (sign 7/8, 6/8).

## 2 — THE FENCE ON EVERY ABSOLUTE FIGURE IN THIS NOTE

**The same tree read 6.68 s CPU / 1.61 s wall early and 8.14 s / 1.96 s after ~15 minutes of
sustained 8-core load — `+22%` on ONE machine inside ONE hour.** Thermal state, not code.

**Ratios replicate across my two samples; absolutes do not.** Any bar stated as an absolute needs a
margin that swamps 20%, and any bar stated as a small ratio must be *paired* within a round. This
single observation determines the shape of both bars in the `decision` note.

## 3 — the per-file floor, as a CURVE (`ABC-026` asked for this; the prior reading was n = 2 at one point)

Empty trees, `K` trivial one-assertion test files importing nothing from the repository, `K` = 0…128.
Two fully independent samples, quoted separately and never averaged:

```
                                     sample 1                 sample 2
vitest with ZERO test files       0.250 s CPU / 0.175 s    0.250 s / 0.180 s
CPU  = a + b x K               0.852 s + 159.3 ms x K   0.790 s + 178.7 ms x K   R^2 .99993 / .99981
WALL = a + b x K               0.358 s +  29.9 ms x K   0.286 s +  40.1 ms x K   R^2 .99954 / .99555

marginal CPU ms/file at K = 2 / 4 / 8 / 16 / 32 / 64 / 128
   sample 1:  130 / 173 / 164 / 145 / 160 / 158 / 162
```

**Linear over two orders of magnitude in file count.**

In the **real** lane the marginal cost is higher at large `K` and lower at small `K`, because a small
addition partly fills idle worker slots:

```
on the 22-file lane   +2 files 100 | +4 124 | +8 151 | +16 163 | +32 168   ms CPU per file
                                   wall:  -15 | -10 |  +11 |  +21 |  +27   ms per file
on the 20-file ABC-025 baseline, two samples
                      +2  127/225 | +4  155/214 | +8  175/229              ms CPU per file
```

**Band 100–229 ms CPU per file. Use 160 ms.** Wall: **−15 to +46 ms per file.**

## 4 — the structural finding: **a test FILE costs 368–504x a test**

```
128 trivial assertions in ONE file        1.105 / 1.125 s CPU
the same 128 in 128 FILES                21.295 / 23.780 s CPU     ->  19.3x / 21.1x
per trivial `it`                           0.43 / 0.35 ms
per test FILE                             159.3 / 178.7 ms
8 files x 16 its vs 8 files x 1 it       +0 ms / +65 ms for 120 extra assertions
```

**Lane decomposition — 49–58% of the default lane's CPU is per-file runner overhead, not test
content**, by two independent routes that agree within 8 points: the linear floor model (`0.85 s +
159 ms × 22 files = 4.36 s of a 7.58–7.67 s lane = 57%`) and **vitest's own accounting** (`transform
466 + collect 1,195 + prepare 1,019 = 2,680 ms` against `tests 2,760 ms` = 49%).

## 5 — wall time grows in a SAWTOOTH, not a line

Default worker count is 7. Single-file wall steps measured around the boundary:

```
K  6->7  +15 ms      7->8  +70 ms      8->9  +5 ms     9->10 +20 ms
K 14->15 +75 ms     15->16 +15 ms
```

**One added test file costs 5–20 ms of wall inside a wave and ~70–75 ms at each multiple of 7** — the
same file is nearly free or ~5x more expensive depending only on how many files already exist.

## 6 — where the per-file cost goes, and the lever that is NOT available

18-file tree (the lane with its four `*.nfr.test.ts` files removed), two independent samples:

```
                         CPU              WALL             sign (both samples)
forks --no-isolate    -30.7% / -36.5%   -14.1% / -24.0%    0/8, 0/8
threads (isolated)     -7.9% /  -9.1%   -12.4% / -16.2%    0/8, 1/8
threads --no-isolate  -34.7% / -42.3%   -23.2% / -31.8%    0/8, 0/8
```

`--no-isolate` saves **2.03–2.99 s CPU over 18 files = 113–166 ms per file**, i.e. **~70–90% of the
entire per-file floor is per-file process isolation.**

**AND IT IS NOT AVAILABLE. THE FIRST OBSERVED RUN WAS GREEN.**

```
full 22-file lane, --no-isolate           GREEN in  4 of 21 observed runs
   the first observed run                 GREEN     <- a single-run adoption was available
   the only files that EVER fail          src/zobrist.nfr.test.ts   NFR-005's call-count sub-bar
                                          src/gameend.nfr.test.ts   NFR-001's three gameStatus bars
                                          src/san.nfr.test.ts       ABC-025's five N1 spied rows
   never observed failing                 any of the other 18 files
same tree with those 4 files removed      GREEN 6 of 6
--pool=threads --no-isolate               GREEN in  1 of 3; same files
--pool=threads WITH isolation             GREEN in 24 of 24
```

One captured failure, verbatim: `AssertionError: ep set, no capture at all: expected
"hasLegalEnPassant" to be called 1 times, but got 0 times` — a spy applied after another file in the
same worker had already imported the module.

## 7 — the CPU/wall trade, which decides which bar goes on which clock

```
--no-file-parallelism   CPU -30.09% (sign 0/8)   WALL +140.54% (sign 8/8)
CPU/wall ratio          4.15-5.07x parallel      1.32x serial
```

**A CPU-only budget is met by making the engineer wait 2.4x longer.**

## 8 — the lever that IS available, priced as it would be adopted

A two-line `vitest.config.ts` with `pool: "threads"`, measured through `npm test`:

```
npm test today                        1.765 s wall     7.640 s CPU
npm test with pool: "threads"         1.500 s wall     6.830 s CPU
                                     -13.97% (-260 ms) -10.78% (-825 ms)   sign 0/8, 0/8
                                      676/676 green in 24 of 24 observed runs
```

## 9 — replication of the prior hop, stated where it agrees and where it does not

```
                            this hop (2 samples)          prior hop
identity null control     -0.43% (3/8) / -1.26% (3/8)   +0.1% / +0.0% / -0.1% (4/8)  BA/PM
Z: two TRIVIAL files      +3.88% (8/8) / +5.59% (7/8)   +5.4% / +6.1%        (8/8)  BA/PM
C: ABC-025's two files   +13.75% (8/8) / +18.05% (7/8)  +12.8 / +13.9 / +14.1%      BA/PM
                                                        +12.1 / +13.6%      Security/NFR
```

- **`ABC-025`'s cost REPLICATES.** My quiet sample `+13.75%` sits inside both other roles' bands.
- **The two-empty-files floor replicates in SIGN and ORDER but READS LOWER.** My band is `+3.9%` to
  `+5.6%` against their `+5.4%` to `+6.1%`; **the `≈5.8%` used in `ABC-025`'s ruling is at or above
  the top of my range.** I cannot attribute the difference — different session, and their denominator
  lane was cheaper. **This is why the floor is restated as an ABSOLUTE (160 ms CPU per file) that
  does not depend on which lane it is a percentage of.** *Nothing here re-opens `ABC-025`: its `N5`
  verdict was NOT MET on the gross reading on every instrument, and it is still NOT MET on mine.*
- **My identity null control is WORSE than theirs** (−0.43%/−0.52%/−1.26% at sign 3/8 against ±0.1%
  at 4/8). Reported, not smoothed. It is still ~10x below the effects it is used to admit.

## What these figures do NOT establish

**Not a figure for any other machine, core count or Node version** — one machine, `UNKNOWN - verify`
elsewhere, and the wall figures are explicitly a function of the 8 logical cores. **Not a stable
absolute** — see §2. **Not that `pool: "threads"` is safe** — 24 green runs is exactly the evidence
`--no-isolate` had before it was caught. **Not a re-measurement of `NFR-001`–`NFR-007`** — none was
touched, no target moved. **Not a judgement on any test, file or coverage decision** — no test was
read for deletion and none is proposed.

## The substrate gap, re-verified rather than inherited

`scripts/` does not exist in the repository; there is no `context-io.*` and no `claim.*` anywhere in
the repository or in the kit at `/Users/olgeroeselg/.grugops/agent-factory`; `mcp__grugops__*` is not
in this session's tool set. Workflow 16's stop condition is live on every hop of this install. **These
notes were hand-written into `notes/` in the `agent-factory/contracts/context-note.md` format**, and
the claim was taken by hand with an atomic `mkdir .grugops/queue/claimed/refinement-ABC-026-design`
per Workflow 17 step 2. Nothing mechanically validated any of it; `index.md` / `index.jsonl` do not
exist for this task. Owner **Orchestrator**; this is the **fifth consecutive hop** to record it.
