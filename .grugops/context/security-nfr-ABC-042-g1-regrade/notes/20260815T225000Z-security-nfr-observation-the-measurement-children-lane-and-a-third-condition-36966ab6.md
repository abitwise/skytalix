---
id: 20260815T225000Z-security-nfr-observation-the-measurement-children-lane-and-a-third-condition-36966ab6
kind: observation
by: security-nfr
at: 2026-08-15T22:50:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - G1
  - N8-LANE
  - N8-SPAWN
  - NFR-008
  - plans/nfr-catalog.md
  - src/cli.test.ts
supersedes: 
---

# The measurement — ten children re-timed, the lane re-read with its null control, and a THIRD condition nobody asked for that decides the case

**Nothing here is inherited.** My own harnesses, my own trees, my own numbers, on the tree that
merges. Where a figure differs from my gate reading the difference is stated and its cause named.

**Machine: Apple M3, 8 logical cores, Darwin 25.5.0 arm64, Node v24.12.0, npm 11.7.0, vitest 3.2.7,
`pool: "threads"` per `vitest.config.ts`. `UNKNOWN - verify` on any other machine.** Session load
average at start **2.67** — a QUIET session, where my gate reading ran at 9.33–14.64.

## 1. The instrument, and an honest correction to my own gate figures

My gate reading used `/usr/bin/time -p`, whose `-p` format carries **two decimal places of a second —
10 ms of resolution**. That is why every child in my gate table reads as a round 90 / 100 / 220 ms.
This hop uses bash's `time` keyword with `TIMEFORMAT='%R %U %S'`, which reports **milliseconds**. Both
were cross-checked against each other on one child, five runs each:

```
bash time     117 108 112 108 113 ms
/usr/bin/time 110 100 110 110 100 ms      <- quantised down to 10 ms
sh -c wrapper overhead                      0 ms (5/5)
```

**So my gate's 1070 ms was measured on a coarser instrument that rounds toward zero, and it was an
under-reading. That is my error to own, not the account's.** Every figure below is on the finer one.

## 2. The ten children, own measured CPU, median of 9 direct timings each

The account's protocol is *"the child's own measured CPU — median of ≥ 5 direct timings on the
reference machine, listed child by child beside the criterion that forces it"*. I ran **9**, not 5,
**interleaved round-robin over the children** with a discarded warm-up round, so session drift lands
on every child equally. Argv is transcribed verbatim from `src/cli.test.ts`'s `CHILDREN` — including
the raw `ESC` byte in child 10, verified with `od -c` rather than trusted.

```
                                              median   min   max   n
CTRL  node -e ''            [not a child]         20    20    21   9
 1  npm run chess                        [A1]    236   230   243   9
 2  --colour white --unicode  [A4 white, A7]     113   111   125   9
 3  --colour black             [A4 black]        112   110   115   9
 4  --colour random            [A4 random]       112   111   116   9
 5  --ascii --unicode                 [A5]       111   108   114   9
 6  --difficulty 3               [A6(iii)]       110   107   115   9
 7  -x                           [A6(iii)]       110   104   121   9
 8  --colour purple              [A6(iii)]       111   106   127   9
 9  foo                          [A6(iii)]       111   109   115   9
10  --colour <ESC>[2Jpurple       [bar 3]        110   108   118   9
                                                -----
                            SUM OF THE MEDIANS   1236 ms CPU
```

**The `node -e ''` control reads 20 ms, so ~90 ms of every rejection child is still loading and
type-stripping the entry point's module graph** — paid in full by the six children that reject an
argument and compose nothing. That reproduces my gate finding on a better instrument.

## 3. `N8-LANE`, the catalog's protocol clause by clause — harness 1, the ADMISSIBLE reading

`A` = the delivered tree; `B` = `A` minus `src/cli.test.ts`; `N` = a byte-identical copy of `A`, run
as its own condition in the same rounds. Out-of-tree copies, `node_modules` symlinked (**the same
disclosed deviation the catalog's own `NFR-008` reading records**). `A/src` verified `diff -rq`
identical to the worktree's `src/`; `N` verified `cmp` file-by-file against `A` — **57 files, 0
mismatches**. `PERFT_DEEP` unset. Runner **invoked directly** (`./node_modules/.bin/vitest run`),
stated as the clause requires. 9 rounds, round 0 discarded, order rotated `A B N` / `B N A` / `N A B`.
**Every run asserted its own file AND test count: A 30/856, B 29/827, N 30/856 on all 27 runs, 0
harness errors.**

```
round     A        B        N          A-B      A-N
  1     10510     8913    10739       +1597     -229
  2     10667     9290    10700       +1377      -33
  3     10979     9421    10921       +1558      +58
  4     10838     9299    11005       +1539     -167
  5     11123     9647    10967       +1476     +156
  6     11092     9655    11375       +1437     -283
  7     11334     9651    11145       +1683     +189
  8     11270     9576    11354       +1694      -84
        (round 0 discarded: A 10519 / B 8875 / N 10676)

SIGNAL  median +1548.5 ms CPU    sign 8/8
NULL    median   -58.5 ms CPU  =  -0.53% of A's median    sign 3/8
```

> **ADMISSIBLE. The null reads −0.53% against the clause's ≤ 1.5%, sign at chance (3/8).**

Wall, alongside, because `NFR-008`'s other clause is on the wall: signal **+637 ms (sign 8/8)**, null
**+8.5 ms / +0.36% (sign 4/8)**.

## 4. The third condition — the one nobody asked for, and the one that settles it

The account charges the children at their **standalone** CPU and subtracts that from a delta measured
**in the lane**. Those are two different instruments on two different quantities, and the whole
verdict turns on the subtraction. **So I measured the thing directly instead of trusting the
subtraction.**

`C` = the delivered tree with `src/cli.test.ts` replaced by a file whose only work is **the ten
delivered children, same argv, spawned once each at module scope**, and one trivial assertion. No
assertion of the delivered suite is reproduced. `C` therefore isolates the children's **in-lane** cost.
Harness 2, same protocol, 9 rounds, order rotated, A 30/856 B 29/827 C 30/828 asserted every run:

```
                        median CPU    sign      median WALL   sign
A - B   (the ticket)      +1565.5      8/8         +745.5      8/8
C - B   (children only)   +1590.0      8/8         +791.0      8/8
A - C   (CONTENT only)      +22.0      5/8          -29.0      3/8
```

> **`A − C` = 22 ms at sign 5/8.** The delivered file's ENTIRE in-process content — the 138-case
> near-miss family, both 1000-case sweeps, `A5`'s spy, every structural row, transform, collect and
> source reads, 28 tests' worth — is **indistinguishable from zero against a 650 ms bar.**

And the number the account could not see:

```
children IN-LANE   = (C-B) - the 160 ms floor = 1430 ms
children STANDALONE (the account's protocol)  = 1236 ms
                                                -----
the account's instrument UNDER-credits by       194 ms  (16%)
```

**A child costs 16% MORE inside the lane than it does alone** — seven workers contending for eight
cores is not free. The account's direct-timing protocol therefore charges the ticket for ~194 ms that
is actually the children's. **That is the conservative direction and it is the reason this verdict is
robust rather than marginal**: the ruling holds on the instrument that disfavours the ticket. It is
also the reason the account's own cumulative wire is instrument-dependent, which is in my
unasked-for-findings note and is not folded away here.

## 5. `NFR-008` itself, both clauses, re-read on this tree

```
                     harness 1        harness 2        clause     verdict
lane CPU  median     11.036 s         11.347 s         13.000 s   MET   84.9% / 87.3%
lane WALL median      2.381 s          2.655 s          3.000 s   MET   79.3% / 88.5%
CPU headroom          1.964 s          1.653 s
WALL headroom         0.620 s          0.346 s
```

**Two things to say honestly.** First, harness 2 ran hotter than harness 1 across ~20 minutes of
continuous lane running — the absolutes drift up within a session while the paired deltas do not,
which is exactly what the pairing and the null exist for. Second, **both readings are above the
10.590 s I recorded at the gate**, on a tree whose `src/` is byte-identical. **The lane's absolute did
not grow; my instrument got finer and my session got different.** The paired delta is the quantity the
bar is written on, and it reproduces: 1548.5 and 1565.5 ms this hop against 1460 ms at the gate — a
6% spread, far inside the ±22% session fence this catalog records.
