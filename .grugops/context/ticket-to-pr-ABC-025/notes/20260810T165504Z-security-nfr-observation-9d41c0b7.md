---
id: 20260810T165504Z-security-nfr-observation-9d41c0b7
kind: observation
by: security-nfr
at: 2026-08-10T16:55:04Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - N5
  - src/san.qualifier.hardening.test.ts
  - src/san.suffix.hardening.test.ts
  - plans/nfr-catalog.md
  - plans/tickets/ABC-025-san-qualifier-minimality-net.md
supersedes: 
---

# `N5` on a FOURTH instrument: NOT MET at +12.1% CPU / +16.5% file-time — and a NULL CONTROL BY IDENTITY shows the wall-clock instrument the bar NAMES reports a "breach" for a change that is literally nothing

Three roles have measured `N5` and reported three different numbers (Engineer +12.5% wall / +19.3%
file, Orchestrator +10.3% wall, QE +6.7% wall median / +8.8% wall min / ~18% file). **Nothing below
is inherited from any of them.** Own tree, own protocol, own aggregators, and one instrument none of
the three ran: a **null control by identity** — the same comparison procedure applied to a
byte-identical tree, so the number it reports for a KNOWN-ZERO change is the instrument's floor.
That is this file's own house move (`plans/nfr-catalog.md` has made it on `NFR-001` and `NFR-005`),
and it is the move that settles whether a 5% bar can be adjudicated at all.

This note carries numbers. The ruling is in the `decision` note beside it. It is an `observation`
and **not** a `finding`: there is no §14 gate verdict on this hop, `context.human_admission` is
`off`, so no stamp exists and none was invented.

## The instrument

**Out-of-tree working copy.** `src/` copied to a scratchpad directory with `node_modules`
**symlinked**, `package.json` / `tsconfig.json` / `biome.json` copied; the copy asserted
**byte-identical to the repository's `src/` per-file (37 files, md5 each)** before the first run.
**The repository's own `src/` was never written by this harness** — every condition switch happened
in the copy. Machine Apple M3 / Node v24.12.0 / darwin arm64, vitest 3.2.7; `UNKNOWN - verify` on
any other hardware.

**Four conditions, INTERLEAVED, order ROTATED every round, one fresh OS process per run:**

```
A    neither hardening file                              652 tests / 20 files
A'   IDENTITY NULL CONTROL — the same tree as A          652 tests / 20 files
B    the delivered file only                             672 tests / 21 files
C    both hardening files = the whole ABC-025 delta      676 tests / 22 files
```

Every run **asserts its own test count** (652 / 672 / 676); a run whose tree state is not what its
label claims is a harness error and never a datum — none occurred. Round 0 discarded as warm-up;
n = 10 usable rounds. Both **wall** (what the bar names) and **CPU = user + sys** (the
better-resolved instrument) recorded, and reported separately rather than blended.

## 1 — the numbers, on every aggregator, with the null control beside them

Two independent harness runs an hour apart (the second is the `A1`-variant harness below, n = 8),
so each figure has a replicate.

```
WALL — delivered file B against the 652 lane      run 1 (n=10)   run 2 (n=8)
  by MIN of condition                                +4.9%          +0.0%
  by MEDIAN of condition                             +4.6%          +8.6%
  by MEAN of condition                               +6.7%            —
  median of PAIRED per-round deltas                  +7.5%          +8.3%
  95% bootstrap CI on the paired median         [+4.6%, +9.8%]        —

WALL — NULL CONTROL A' (a BYTE-IDENTICAL tree)     run 1          run 2
  by MIN                                             +2.1%          +3.5%
  by MEDIAN                                          +3.9%          +2.3%
  by MEAN                                            +6.0%            —
  median of PAIRED per-round deltas                  +3.6%          +0.7%
  95% bootstrap CI on the paired median         [-2.0%, +14.3%]       —
```

**Read those two blocks together.** On the instrument `N5` names, the delivered file reads anywhere
from **+0.0% to +8.6%** depending on which defensible aggregator is chosen — the bar is 5% and the
readings sit on both sides of it. And the same aggregators applied to a change that **does not
exist** read **+0.7% to +6.0%**, with a 95% confidence interval reaching **+14.3%**. A procedure
that reports a 6% "cost" for a no-op cannot adjudicate a 5% bar. **That is not a claim about noise
in the abstract; it is the bar's own comparison, run on nothing, reporting a breach.**

```
CPU (user+sys) — the resolved instrument           run 1 (n=10)   run 2 (n=8)
  A' null control, paired median                      +0.5%          +0.4%
  A' null control, by MIN / by MEDIAN            +0.0% / +2.0%  +0.2% / +0.3%
  B  delivered file, paired median                   +12.1%         +11.8%
  B  by MIN / by MEDIAN                          +9.9% / +12.2% +10.3% / +11.1%
  B  95% CI on the paired median                [+9.9%, +12.8%]       —
  B  sign test                                    10/10 positive  8/8 positive
  C  both files, paired median                       +13.6%           —
  C  95% CI                                     [+12.4%, +15.1%]      —

5% of the lane:   wall  ~76 ms        CPU  ~332 ms
measured delta:   wall  ~70-125 ms    CPU  ~800-950 ms
```

**On the instrument that can resolve a delta of this size the answer is not close: 12% and 13.6%,
against a floor of 0.4-0.5%, with the sign positive in 18 of 18 rounds.**

## 2 — the file's own test time, and a 2.6x gap inside the reading QE proposed as the stable one

```
san.qualifier.hardening.test.ts, ISOLATED (5 runs)   249 / 249 / 253 / 255 / 288 ms   median 253
san.suffix.hardening.test.ts,    ISOLATED (5 runs)     6 /   6 /   6 /   6 /   5 ms   median   6
```

**253 ms reproduces all three prior roles** (Engineer 260-268, Orchestrator 264, QE 236-242) — four
instruments now agree on this reading to within ~10%, which is the one thing about `N5` that is
stable. Against the 652-lane wall median of 1,535 ms that is **16.5%** for the delivered file and
**16.9%** for both — **3.3x the bar**.

**But the same file measured from INSIDE the full lane reads 540-741 ms, median 647 ms** (per-test
durations summed per file, 5 runs, vitest's JSON reporter). Same file, same tree, same machine:
**253 ms isolated against 647 ms in-lane, a factor of 2.6**, because in-lane the file's tests run
while four other worker processes compete for the CPU. So *"use the file's own reported test time"*
— QE's proposed repair — is **also** under-specified unless it names isolated-or-in-lane. Recorded
because it is a correction to the fix, not to the finding.

## 3 — where this ticket's cost actually sits, which is the most legible statement of it

From the delivered 676-test lane (`--reporter=json`, per-test durations summed per file):

```
perft.test.ts                       24 tests    952 ms   40.1% of the suite's test time
san.qualifier.hardening.test.ts     20 tests    476 ms   20.1%   <-- this ticket
san.test.ts                         22 tests    276 ms   11.6%
zobrist.test.ts                     23 tests    159 ms    6.7%
frame.test.ts                       27 tests    109 ms    4.6%
moves.castling.hardening.test.ts   110 tests    103 ms    4.4%
moves.enpassant.hardening.test.ts  120 tests     76 ms    3.2%
                                   ---------------------------
TOTAL                              676 tests  2,375 ms
```

**This ticket's 20 tests are the second most expensive file in the repository and cost 2.1x the 275
tests of the castling-hardening, en-passant-hardening and gameend files combined.** That is the
`N5` breach stated without a ratio, a statistic or a denominator, and it is the reading I would put
in front of a human.

## 4 — does narrowing `A1` fix it? MEASURED: no. Wall +5.3%, CPU +7.4% — still over.

The Engineer records that the assisted-only variant costs ~89 ms ≈ 6.5%. Re-derived here rather
than inherited, with a **one-line** cost variant built out of tree (`const unassisted =
toSan(position, move)` → `const unassisted = assisted`), the rest of the file byte-identical, run in
the same interleaved harness as its own condition:

```
                       WALL paired median      CPU paired median
A' null control              +0.7%                   +0.4%
Bn  A1 assisted-only         +5.3%                   +7.4%      <-- the narrowed variant
B   delivered                +8.3%                  +11.8%
5% of the lane               76 ms                   339 ms
```

**The narrowed variant breaches the bar too**, on both instruments (1.06x on wall, 1.48x on CPU).
The Engineer's conclusion — *"`N5` is not reachable at this corpus size on this instrument by any
arrangement of `A1`-`A5` I could find"* — is **confirmed on a fourth instrument**. Cutting `A1`'s
unassisted half trades 207 positions of call-form coverage for 41 and **still does not meet the
bar**. That single measurement is what makes the coverage question moot rather than difficult.

## 5 — the degrees of freedom `N5` leaves unnamed, each one worth more than the bar

`N5` reads: *"the tests this ticket adds cost ≤ 5% of the default `npm test` wall clock."* Five
choices are left to the reader, and four of them move the answer by more than the 5% the bar is
about:

1. **Statistic and sample size** — none named (QE's finding, confirmed). Min / median / mean /
   paired-median of the same 40 runs give +0.0% / +8.6% / +6.7% / +8.3%.
2. **Numerator** — the whole-lane delta (+7.5% wall) or the file's own test time (16.5%). A factor
   of ~2.2 between two honest readings of the same words, under a parallel runner.
3. **Isolated or in-lane** for that second reading — 253 ms against 647 ms, a factor of 2.6.
4. **Denominator** — the lane WITHOUT the tests (the convention every hop used) or WITH them
   (+90 ms / 1,620 ms = 5.6% instead of 5.9%); and `npm test` literally includes npm's own startup,
   which is a fixed addend that shrinks every ratio without changing any cost.
5. **Which tests are "the tests this ticket adds"** — the delivered file (B, +12.1% CPU) or both
   hardening files, since the QE hop's rows are also this ticket's (C, +13.6% CPU). Nobody has said
   which; I measured both.

**`N5` was written as a ratio so it would survive a hardware change (`ABC-013`'s `N1` lesson). It
does. What it does not survive is a change of instrument, of aggregator, or of denominator — and it
names none of the three.**

## What this does NOT establish

**Not that the wall-clock breach is refuted.** The wall instrument cannot resolve it either way;
"unresolvable" is not "met", and every reading that *is* resolved (CPU, file time) is 2.4x-3.4x the
bar in the same direction.
**Not a figure for any other machine.** One machine, one session; `UNKNOWN - verify` elsewhere.
**Not that CPU time is what `N5` should be measured in.** It is the instrument that resolves the
question; the bar names wall clock, and this gate does not get to re-write the bar to one it can
measure. That choice belongs to the bar's owner.
**Not a re-measurement of `NFR-001`-`NFR-007`.** `plans/nfr-catalog.md` is not edited and no
catalog target moved. `N5`/`N6` are ticket-level bars and are not rows in that file.
