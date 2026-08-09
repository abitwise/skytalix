---
id: 20260809T232359Z-security-nfr-observation-ab3f7611
kind: observation
by: security-nfr
at: 2026-08-09T23:23:59Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - NFR-001
  - plans/nfr-catalog.md
  - src/moves.ts
  - src/perft.test.ts
  - src/perft-bench.ts
  - src/gameend.ts
supersedes: 
---

# `NFR-001` / `A10` re-derived on this gate's own instruments — MET on every clause, with two figures no prior hop had, and the null control again forbidding a cost claim

The ticket's amended method says the **count is primary** and the clock is a floor. Both were taken
here. Apple M3 / Node v24.12.0 / darwin-arm64; **`UNKNOWN - verify` on any other hardware.**

## PRIMARY — the count. A fourth independent derivation, exact

Roots and `fast` depths **parsed out of `src/perft.test.ts`** by the harness (it exits non-zero
unless it finds exactly six), every FEN printed and re-parsed, and the walk driven by **`legalMoves`
alone** so nothing else calls `generateMoves` — the recorded trap that inflated an earlier hop's
denominator ~14x. The counting walk was kept in its own run.

```
startpos   d4 206604    kiwipete   d3  99950    position-3 d4 46256
position-4 d3   9738    position-5 d3  63910    position-6 d3 92016

TOTAL nodes VISITED (root + internal + leaves)              : 518474
non-leaf nodes (the nodes that call legalMoves)             :  18357
conditions EVALUATED, shipped placement (AFTER the ep test) :    331
conditions EVALUATED, rejected alternative (BEFORE it)      : 216269   (653.4x)
times the two conditions REJECTED anything                  :      0
```

**All six per-root counts, both totals and all three counter figures reproduce identically** to
BA/PM's, the Engineer's and QE's — a **fourth** independent derivation on a harness that copied none
of theirs. Zero rejections is expected by construction: 0 of 518,474 reachable nodes carry an
occupied en-passant target.

Worth naming so it is not mistaken for a discrepancy: this harness also reports **331 ep moves
offered**, not the `4,389` earlier hops report. They are the same quantity over **two different call
populations** — 4,389 counts offers when `generateMoves` is called at all 518,474 visited nodes (an
`A7`-style probing walk), 331 counts them at the 18,357 non-leaf nodes a plain `legalMoves`-driven
walk actually reaches. With 0 rejections the two figures coincide by construction here: every
evaluation of the guard yields an offer, so `331 evaluations == 331 offers`.

## Two figures this gate adds that no prior hop had

**1. The count over the CLOCK's OWN population.** The 331 figure's denominator is the 518,474-node
fast-lane walk. `npm run perft` sweeps a **different** population — 11,377,922 leaf nodes at deeper
depths — so pricing a clock reading with the other population's count would be an
apples-to-oranges error. Re-counted over the bench workload itself:

```
ep code point REACHED (the BEFORE placement's evaluations) : 3,417,014
conditions EVALUATED, shipped placement (AFTER)            :     4,177
times the two conditions REJECTED anything                 :         0
```

**2. The PER-CALL bound, measured rather than argued.** Over all **18,357** `generateMoves` calls of
the standing walk the added conditions execute **at most 1 time in any single call** (mean
**0.018**). The cost this change can add to one generator call is bounded by one comparison pair —
which is what makes every downstream consumer's budget safe without measuring each one.

## The arithmetic — LABELLED ARITHMETIC, NOT A MEASUREMENT

Over the clock's own population (4,177 evaluations on a 1.822 s sweep):

```
at  1 ns/evaluation   0.0042 ms   0.00023%   true ratio ~ 0.999998
at  5 ns/evaluation   0.0209 ms   0.00115%   true ratio ~ 0.999989
at 10 ns/evaluation   0.0418 ms   0.00229%   true ratio ~ 0.999977
```

Three orders of magnitude below what the instrument can resolve. That is why the clock cannot see
this change and did not.

**The ordering decision is what keeps it unmeasurable, and this prices it on the clock's own
population for the first time.** The same arithmetic on the rejected "reject early" placement
(3,417,014 evaluations, **818x**):

```
at  1 ns   3.42 ms   0.1875%   ~ 0.99812
at 10 ns  34.17 ms   1.8754%   ~ 0.98125
```

Still inside the `>= 0.98` bar, but at the top of that range it sits **within the bar's own 2-point
margin**. On the 518,474-node walk the ordering looked like tidiness; on the population the clock
actually measures it is the difference between unmeasurable and arguable. **No change is asked for**
(rules 5, 9, 10) — the shipped order is already the cheap one; the sharper reason is recorded.

## FLOOR — clock

`npm run perft` on the branch tip: **11,377,922 nodes in 1.843 s = 6,172,810 nodes/sec** against the
`>= 1,000,000` bar — **~6.17x clear**, with the harness printing its own `AT OR ABOVE target` line.
The **lowest single reading across all 12 scored readings below is 6,030,890/sec**, still ~6.03x.

## AGGREGATE RATIO — MET, and the null control decides how to read it

Three trees, **one OS process per reading**, tree order **rotated every round**, a discarded warm-up
round (round 0), node count checksummed **identical at 11,377,922 on every tree and every round** —
15 readings, 12 scored:

```
                mean          min          max      peak-to-peak
t-pristine   6,234,066    6,201,748    6,272,713       1.14%
t-fix        6,231,604    6,198,879    6,271,073       1.16%
t-twin       6,174,643    6,030,890    6,272,065       3.91%   <- IDENTICAL CODE to t-fix

AGGREGATE   fix / pristine  = 0.9996   against the >= 0.98 bar  ->  MET
NULL CTRL   twin / fix      = 0.9909   byte-identical code (cmp, 31 of 31 files in src/)
NULL CTRL   twin / pristine = 0.9905
```

**The null control's deviation from the tree it is byte-identical to (0.914%) is 23.1x the fix's
apparent aggregate cost (0.039%).** The bar is met and **no per-cell and no per-run cost claim is
admissible from this data** — the catalog's standing caution held for a **fifth** ticket running.
The lowest reading in the entire sample belongs to the **twin**, i.e. to code identical to the
delivered fix: scatter, not cost. Anyone quoting a per-run figure from these numbers would be
quoting noise, and that includes anyone quoting mine.

**A CANDIDATE ELEVENTH INSTRUMENT-LIMIT CORRECTION, NAMED AND ROUTED RATHER THAN APPLIED** — this
subtask forbids editing `plans/nfr-catalog.md`, and it was not edited. The catalog's 2026-08-09
header records a per-cell floor of ±2.0% and an **aggregate** floor of ~±1%. Here the byte-identical
twin's own **aggregate** readings span **3.91% peak-to-peak** on identical code, i.e. roughly ±2%
about its mean. On this evidence the aggregate floor is **at least as wide as the per-cell floor**,
and the `>= 0.98` bar's 2-point margin does **not** comfortably exceed resolution. Stated with its
limits: **four rounds, one machine** — a smaller sample than the figure it questions, and one low
reading drives it. Routed to Security/NFR at the next gate that measures `NFR-001`, and to
Architect/Design as the catalog's seed owner.

## The STRUCTURALLY-ZERO CELL, read BEFORE the cell this gate cares about

The catalog's standing method requires a cell whose delta is structurally zero to be read first. It
matters here rather than being ceremony, because **`NFR-001`'s second consumer is `gameStatus`**,
which is genuinely downstream of this change:

```
generateMoves(startpos)                            reached=14  evaluated=0  rejected=0  offered=0
legalMoves(startpos)                               reached=14  evaluated=0  rejected=0  offered=0
gameStatus(startpos, emptyMap)   <- the NFR-001 bar  reached=14  evaluated=0  rejected=0  offered=0
generateMoves(a live-ep position)                  reached=14  evaluated=1  rejected=0  offered=1
```

`NO_SQUARE` is **-1** and `to` is always an on-board 0x88 index, so `to === position.epSquare` is
false at every iteration whenever no en-passant square is set. **`NFR-001`'s `gameStatus` half has a
structurally zero delta from this change, measured rather than argued.** Its call-count sub-bars
(`legalMoves` exactly 1 per `gameStatus`, `zobristKey` at most 1) are untouched by construction —
this change adds no call to anything.

`plans/nfr-catalog.md` was **not edited** and **no NFR target moved**.
