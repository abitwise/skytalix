---
id: 20260812T212500Z-qe-e2e-observation-n8-lane-is-a-floor-not-a-number-and-i-report-the-floor-2ea55d8b
kind: observation
by: qe-e2e
at: 2026-08-12T21:25:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A4
  - ABC-028-A5
  - N8-LANE
  - NFR-008
  - ADR-0008
  - ABC-026
  - ABC-029
supersedes:
---

# `N8-LANE`: `A5`'s delta falls due here, and what the ratified instrument returns is a FLOOR — so the floor is what I report

> **Hand-authored, no stamp.** Measured on the tip, out of tree, on trees whose `src/` was asserted
> before timing: WITH = `752 passed / 26 files`, WITHOUT = `750 passed / 26 files`, null control =
> two copies verified `/usr/bin/diff -r` IDENTICAL.

**The delta was `UNKNOWN - verify` and owed at this gate. It is discharged here as a floor, not as a
number** — and the brief's instruction that two prior hops hit this same wall is the reason it is
written this way rather than rounded into something quotable.

## The floor account is ZERO by construction, not by rounding

`ADR-0008` decision 4 scopes the per-ticket bar to *every file the branch adds under `src/`*. **This
branch adds none** — 42 `src/*.ts` and 26 `*.test.ts` at `09d4515` (before `ABC-028`) and the same at
the tip. The ~160 ms-per-file floor term is **zero**, so the whole delta is CONTENT. `package.json`
and `package-lock.json` are byte-untouched across the entire span.

## `ADR-0008` decision 4's protocol, run exactly as ratified

CPU (user + sys), median of PAIRED per-round deltas, n = 8 INTERLEAVED rounds with the order
alternating each round, one fresh process per run, identity null control mandatory. `A5` = both
halves; the comment half executes nothing, so WITHOUT is the tip with `A5`'s block removed.

```
round   delta (s CPU)   null (s CPU)
1       -0.140          -0.180
2       +0.190          +0.030
3       -0.270          -0.240
4       -0.110          -0.060
5       -0.120          -0.070
6       +0.280          -0.170
7       +0.030          +0.180
8       -0.460          +0.010

n                 8
median delta      -0.115 s CPU     signs 3+ / 5-
median null       -0.065 s CPU     signs 3+ / 5-
null spread       -0.240 .. +0.180 s CPU      <- on two BYTE-IDENTICAL trees
delta spread      -0.460 .. +0.280 s CPU
```

**The median delta is NEGATIVE, which is physically impossible for added work; the sign is at chance
in both columns; and the delta's median sits BELOW the identity null control's own median.** The
honest reading is not *"`A5` is free"*. It is: **the ratified paired-CPU instrument cannot resolve
`A5` at n = 8 on this machine, and its floor here is its own null control's spread — about ±0.2 s
CPU**, against a 650 ms content allowance and a ~75 ms remaining margin. **A 4 ms signal is two orders
of magnitude under the floor.** That is the same wall the `A5` build hop and the `A4` instrument hop
reported, and I am not turning it into a number the instrument cannot support.

**The one thing the measurement CAN say, and it is worth saying:** because the delta's median is below
the null's, **nothing at or above the instrument's resolution is present** — a cost of 200 ms or more
is excluded at n = 8. Below that it is silent, and I make no claim there.

**The corroborating upper bound, on a DIFFERENT instrument and labelled as such:** vitest's own
per-test timer, median of 7 runs, both `A5` rows combined — **3.18 ms** (range 2.59–37.86, the outlier
kept). That is **wall time per test body**, not `user + sys`; it is an honest upper bound on `A5`'s
content and it is **not** the instrument the bar is written in. Both are reported; neither is dressed
up as the other. Against the 650 ms content allowance that is ~0.5%.

## `ADR-0008`'s two ratified clauses — and the measurement condition that decides them

**Clause `≤ 3 s wall`: HOLDS, and the only clean reading I have is the first one of this hop.**
`npm test` on the tip, machine quiet, before any of this hop's load: **752/752 on 26 files, vitest's
own `Duration` 1.76 s** — 59% of the clause, and within a hundredth of a second of `ADR-0008`'s own
recorded baseline of **1.765 s**. That is the instrument whose value matches the ADR's number.

**Everything after it in this session is LOAD-CONTAMINATED, and I caused the load.** This hop ran
roughly seventy full suites. The same tree, same instrument, later in the session reads `Duration`
**3.25–3.54 s**; process wall through `npm test` reads 3.02–5.15 s. `ADR-0008`'s own consequence
section predicts exactly this — *"the same tree read 6.68 s CPU / 1.61 s wall early and 8.14 s /
1.96 s after ~15 min of sustained load. Ratios replicate; absolutes do not."* **My "cooled" re-run is
NOT usable either and I am discarding it rather than quoting it: it overlapped with my own foreground
mutant lanes, so it measured contention, not recovery.** A clean re-verification of the wall clause on
a quiet machine is `UNKNOWN - verify` at this hop beyond that first reading.

**Clause `≤ 13 s CPU`: HOLDS in every reading I took, including the worst.** Under seventy-suites-deep
load with concurrent lanes the tip read **10.80–12.05 s CPU** — under the bar in the most adversarial
condition I could produce. Against `ADR-0008`'s 7.640 s baseline that is a large gap, and I will not
adjudicate whether it is thermal drift or lane growth: **the with/without-`A5` comparison above shows
it is not `ABC-028`'s**, and `ABC-026` owns the total. Recorded, routed, not settled.

## What I did NOT do

- **I did not re-derive the lane TOTAL.** It is `ABC-026`'s and is under dispute. `plans/nfr-catalog.md`
  was not opened and no bar was moved.
- **I did not apply the *"whichever of `ABC-028` / `ABC-029` lands second re-measures the TOTAL"*
  rule.** It binds at the merge, it is unchanged, and the figures above are a gate's inputs to it —
  taken on a machine this hop had already loaded, which is exactly the condition that rule should not
  be discharged in. **It is still owed.**
- **My own hop's delta is zero** — it adds no test, no file and no line to the repository.
