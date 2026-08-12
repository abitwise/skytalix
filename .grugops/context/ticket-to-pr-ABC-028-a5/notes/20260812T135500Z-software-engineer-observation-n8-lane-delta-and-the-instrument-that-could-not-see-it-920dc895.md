---
id: 20260812T135500Z-software-engineer-observation-n8-lane-delta-and-the-instrument-that-could-not-see-it-920dc895
kind: observation
by: software-engineer
at: 2026-08-12T13:55:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A5
  - N8-LANE
  - NFR-008
  - ADR-0008
  - ABC-026
supersedes:
---

# `N8-LANE`: `A5`'s delta is 4.34 ms of content — and the protocol's own instrument cannot see it

The delta was `UNKNOWN - verify` and **owed at this hop**. It is discharged here, with the tree it was
measured on: branch `grugops/ABC-028-a5` at `f14f3a6` plus this hop's `+125` test-only lines,
`src/history-pane.ts` `c4653c4c…`, 26 test files before and after.

## The floor account is untouched, by construction

`ADR-0008` decision 4 scopes the per-ticket bar to *every file the branch adds under `src/`*. **This
branch adds none** — file count is **26 → 26**. So the ~160 ms-per-file floor term is **zero**, not
small, and the whole delta is CONTENT. The expensive move the brief warned about was not made.

## The protocol instrument, run exactly as `ADR-0008` decision 4 specifies

CPU (user + sys), paired per-round deltas, interleaved rounds with the order alternating each round,
**one fresh process per run**, **identity null control mandatory**. The null control is two
byte-identical copies of the same tree, verified identical with `diff -r` before the run.

```
lane                          n    median delta (s CPU)   median null (s CPU)   signs
full suite, 26 files          8    -0.150                 -0.010                3+ / 5-
single-file lane (the owner)  11    0.000                 +0.010                5+ / 4-
```

**Both instruments return a delta that is at or below their own null control, and the full-suite
median is NEGATIVE — which is physically impossible for added work.** The sign is at chance in both.
The honest reading is not *"`A5` is free"*; it is **"the paired-CPU instrument cannot resolve `A5` at
this n on this machine."** `/usr/bin/time -p` reports to 10 ms and the null control's own round-to-
round spread is ±0.26 s on the full lane. **A 4 ms signal is two orders of magnitude under that.**

**I am reporting that rather than rounding it into a number the instrument cannot support** — which
is `## Test notes` 4's rule applied to my own measurement, and the same failure mode `ADR-0008`
decision 3 already names when it says the wall clock *"cannot see two added files at all"*.

## The content cost itself, from the runner's own per-test timer

```
A5, both rows combined, median of 9 runs :  4.34 ms   (4.17, 4.20, 4.21, 4.28, 4.34,
                                                       4.44, 4.59, 4.71, and one 25.44 outlier)
N8-LANE bar: 5% of NFR-008's 13 s CPU total          :  650 ms
A5 as a fraction of the bar                          :  0.67%
A5 as a fraction of the 13 s total                   :  0.033%
```

**Stated limit, because it changes what the number means:** vitest's `duration` is **wall time per
test body**, not `user + sys`. For two synchronous single-threaded bodies it is a close proxy and an
honest upper bound on their content, but it is **not the same instrument** the bar is written in. The
number that is directly comparable to the bar is the paired-CPU one, and that one is *below its own
floor*. Both are reported; neither is dressed up as the other.

## What is NOT settled here

**The lane TOTAL is disputed and routed to `ABC-026`.** It was not re-derived, `plans/nfr-catalog.md`
was **not opened**, no bar was moved, and the *"whichever of `ABC-028` / `ABC-029` lands second
re-measures the TOTAL"* rule is untouched and still binds. This note discharges one ticket's delta and
nothing else.
