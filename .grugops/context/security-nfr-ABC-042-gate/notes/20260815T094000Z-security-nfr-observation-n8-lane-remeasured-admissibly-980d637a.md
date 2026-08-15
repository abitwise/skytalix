---
id: 20260815T094000Z-security-nfr-observation-n8-lane-remeasured-admissibly-980d637a
kind: observation
by: security-nfr
at: 2026-08-15T09:40:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - N8-LANE
  - NFR-008
  - ADR-0008
  - plans/nfr-catalog.md
  - src/cli.test.ts
supersedes: 
---

# `N8-LANE` re-measured at the gate, WITH the identity null control — **NOT MET at 2.00x**

The build hop declared its own reading *"not a fully admissible `N8-LANE` measurement"* because it
carried no identity null control, and handed the formal reading here. **This is that reading.** It is
independent: my own harness, my own trees, my own numbers. I did not inherit a figure.

## Protocol — the catalog's, clause by clause, not a per-ticket invention

| catalog clause | what I did |
|---|---|
| instrument: CPU (user+sys) of the default lane, not wall | `/usr/bin/time -p`, `user + sys`, on the whole `vitest run` process tree |
| statistic: median of paired per-round deltas, n ≥ 7 | **n = 7** usable rounds |
| n ≥ 7 **interleaved**, condition order **rotated every round** | 8 rounds x 3 conditions = **24 runs**, order rotated `A B N` / `B N A` / `N A B` |
| one fresh OS process per run | yes |
| round 0 discarded as warm-up | discarded |
| **sign test reported beside the median** | reported |
| **admissible only with an identity null control** — a `cmp`-verified byte-identical second tree run as its own condition **in the same interleaved harness**, reading **≤ 1.5% CPU with its sign at chance** | condition **N**: a byte-identical copy of A, `cmp`-verified **1532 files / 0 mismatches**, run in the same rounds |
| net of the per-file floor: subtract 160 ms per added test file | **1 file** added -> subtract 160 ms |
| scope: every file the branch adds under `src/`; denominator: the lane without those files | A = the delivered tree; B = A minus `src/cli.test.ts` |
| runner invoked directly or via `npm test`, **stated either way** | **invoked directly**: `./node_modules/.bin/vitest run`, `PERFT_DEEP` unset |
| every figure carries its machine | below |
| every run asserts its own file AND test count | **A 30/856, B 29/827, N 30/856 on every run — 0 harness errors in 24** |

Trees are out-of-tree copies; `node_modules` symlinked from the worktree (**the same disclosed
deviation the catalog's own `NFR-008` reading records**). `A/src` was `cmp`-verified against the
worktree's `src/` — **52 files, 0 mismatches** — so condition A is the delivered artifact and not a
paraphrase of it. **The repository's `src/` was never written.**

## The readings

```
round   A(with)   B(without)   N(null)      A-B      A-N
  1      10590      9000        10580      +1590      +10
  2      10370      9080        10470      +1290     -100
  3      10410      9190        10730      +1220     -320
  4      10630      9170        10580      +1460      +50
  5      10560      9100        10580      +1460      -20
  6      10920      9230        10910      +1690      +10
  7      10900      9460        11200      +1440     -300
                                          (round 0 discarded: A 10680 / B 9170 / N 10500)

SIGNAL   median +1460 ms CPU      sign 7/7
NULL     median   -20 ms CPU  =  -0.19% of A's median      sign 3/7
```

> **ADMISSIBLE. The null reads −0.19% against the clause's ≤ 1.5%, with the sign at chance (3/7).**
> This is the clause the build hop's reading could not satisfy, and it is satisfied.

```
gross delta                                   1460 ms CPU
NET of the per-file floor (1 file x 160 ms)   1300 ms CPU
N8-LANE bar                                    650 ms CPU
                                              ------------
                                              2.00x  ->  NOT MET
band at the catalog's own floor band 154-180 ms: 1.97x - 2.01x
```

**Wall, for completeness and not as the bar:** signal +620 ms (sign 7/7), null −40 ms / −1.86% (sign
3/7). The wall does see this file — because ten serialised child processes are wall, not just CPU —
which is unusual for this lane and worth one line, but `N8-LANE` is a CPU bar and I am measuring it
against the wording, not against the more flattering instrument.

**Machine: Apple M3, 8 logical cores, Darwin 25.5.0 arm64, Node v24.12.0, vitest 3.2.7, `pool:
"threads"` as adopted in `vitest.config.ts`. `UNKNOWN - verify` on any other machine.** Load average
during the 24 runs: min 9.33, median 9.88, max 14.64 — **a loaded session** (a QE hop is running the
same lane concurrently off the same tip). Load inflates the absolutes; the pairing and the null absorb
it, and the null proves it did.

## Agreement with the build hop, and the one place I read higher

| | build hop | this hop |
|---|---|---|
| gross median delta | 1400 ms | **1460 ms** |
| sign | 7/7 | **7/7** |
| net | 1240 ms (1.9x) | **1300 ms (2.00x)** |
| identity null control | **absent — declared inadmissible** | **−0.19%, sign 3/7 — admissible** |

The two readings agree to within 4%, which is far inside the ±22% session fence this catalog records.
**The build hop's number was honest and its verdict was right.** Mine is the admissible one and it is
marginally worse, not better.

## Where the cost is — measured child by child, not attributed

Every one of the ten children timed directly on this machine, median of 5:

```
baseline  node -e ''                                          10 ms
 1  npm run chess                        [A1, A7 ascii, A8]  220 ms
 2  cli.ts --colour white --unicode      [A4, A7 unicode]    100 ms
 3  cli.ts --colour black                [A4]                100 ms
 4  cli.ts --colour random               [A4]                100 ms
 5  cli.ts --ascii --unicode             [A5]                 90 ms
 6  cli.ts --difficulty 3                [A6(iii)]            90 ms
 7  cli.ts -x                            [A6(iii)]            90 ms
 8  cli.ts --colour purple               [A6(iii)]            90 ms
 9  cli.ts foo                           [A6(iii)]           100 ms
10  cli.ts --colour <ESC>[2Jpurple       [bar 3]              90 ms
                                                            ------
                                                            1070 ms
```

**1070 of the 1300 ms net is the ten children — 82%.** The residual ~230 ms is the file's own
transform, collect, two 1000-case sweeps and source reads. The build hop's *"~1000 ms is child
processes"* reproduces independently.

`node -e ''` costs 10 ms here, so **~80–90 ms of every child is loading and type-stripping the entry
point's module graph** — paid in full by the six children that reject an argument and compose nothing.

## The floor: what the CHEAPEST conforming build costs

The ten children are countable off the criteria — `A1` 1, `A4` 3, `A5` 1, `A6`(iii) 4, bar 3 1 — and I
verified the count against the criterion text rather than against the build. Pricing the theoretical
minimum:

```
npm run chess          220 ms   irreducible: A1 names `npm run <name>` and nothing else proves it
3 success children     300 ms   irreducible: each must compose a real frame
6 rejection children    60 ms   at the BARE `node -e ''` floor of 10 ms — physically impossible,
                              since a rejection child must at least load the resolver
file's own content     230 ms   measured as the residual above
                     --------
net floor              810 ms   =  1.25x the bar
```

> **There is no build satisfying `A1`, `A4`, `A5`, `A6`(iii) and bar 3 that meets `N8-LANE` on this
> machine — not the delivered one, and not any other. The floor is ~810 ms net, and that is with a
> rejection path that costs nothing at all.**

That is stronger than "this build is expensive". It is measured, and it is the fact `G1` turns on.

## The deferred-import lever: REBUILT, not taken on report

The build hop measured a deferred-import variant, put the saving at **~75 ms per rejection child
(~450 ms, landing ~790 ms net)** and declined it. **I rebuilt it** — top-level `await`, the four heavy
imports moved behind `await import()` on the success path only — verified it actually prints a board
and still rejects `foo` with exit 1, and timed it:

```
                       delivered    deferred
rejection child           90 ms       40 ms      -> saving 50 ms each, 6 children = ~300 ms
success child            100 ms      100 ms      -> unchanged, as expected
npm run chess            220 ms      220 ms      -> unchanged

deferred net = (220 + 300 + 6x40) + 230 = ~990 ms  =  1.52x  ->  STILL NOT MET
```

**The saving is smaller than the build hop estimated — 50 ms per child, not 75 — so the deferred build
lands at 1.52x rather than the ~1.2x it expected.** The direction of its conclusion is confirmed and
its magnitude was optimistic. Either way the lever does not reach the bar. My verdict on the trade is
in the ruling note.

## `NFR-008` itself

```
A (delivered lane, 30 files)   10.590 s CPU  =  81.5% of the 13 s clause   -> MET
B (merged lane,    29 files)    9.170 s CPU
headroom before this ticket    13.000 - 9.170 = 3.830 s
headroom after                 13.000 - 10.590 = 2.410 s
```

**The total holds. One ticket consumed 1.46 s gross of the 3.830 s that remained — 38%.** At the
catalog's own planning arithmetic that leaves ~3.7 tickets at `N8-LANE`'s full content, or ~6.8 files
at today's all-in per-file cost. `EPIC-003` alone was decomposed into eight tickets implying 7–8 new
test files. **That is the number the owner needs, and it is why `G1` is not ceremony.**
