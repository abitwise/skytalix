---
id: 20260820T161500Z-qe-e2e-claim-a2-two-files-close-the-1480-ms-deficit-and-no-single-file-does-8d2e5b17
kind: claim
by: qe-e2e
task: ticket-to-pr-ABC-110-a1a4-2026-08-20
at: 2026-08-20T16:15:00Z
verified_by:
confidence: high
refs:
  - ABC-110
  - ABC-110/A2
  - ABC-110/A7
  - NFR-008
  - ADR-0014
supersedes:
---

# `A2` — **an admissible set DOES close the 1.480 s deficit, and the minimum is TWO files.** No single file closes it; the largest falls 80 ms short. Savings were measured jointly, not assumed additive

**This is not a stamp.** Hand-authored `claim`; no `finding` is admissible on this install. Every
number here is the paired median CPU delta from the sibling `A1` `observation` note, and the
admissibility precondition it records (null control **-0.34%**, sign **6/8**, recorded first) is what
licenses this note to exist at all.

## The headline, stated as numbers before it is discussed

```
DEFICIT (ruled, ADR-0014, cooled n=6)     14.480 s - 13 s  =  1.480 s
DEFICIT (protocol n=8 sample)             14.760 s - 13 s  =  1.760 s

MEASURED JOINT SAVING, engine + perft                        2.550 s   sign 8/8, n=8
  RESIDUAL against 1.480 s                                  -1.070 s   CLOSED, 1.070 s to spare
  RESIDUAL against 1.760 s                                  -0.790 s   CLOSED, 0.790 s to spare
  resulting median CPU   14.480 - 2.550                     11.930 s = 91.8% of the clause
  resulting median CPU   14.760 - 2.550                     12.210 s = 93.9% of the clause

LARGEST SINGLE FILE, engine.test.ts                          1.400 s   sign 8/8, n=8
  RESIDUAL against 1.480 s                                  +0.080 s   NOT CLOSED, 80 ms SHORT
```

**One file is not enough and two are, and the margin on "one file is not enough" is 80 ms — which is
1.6x the null control's own 50 ms.** I am flagging that thinness rather than rounding it away: it is
the one number in this note I would want re-measured before anyone leaned on it, and nothing in the
recommendation depends on it, because every set I put forward has at least two files.

## Additivity was MEASURED, not assumed — this is the part a summed table would have got wrong

Summing eight independently measured paired deltas and calling the total a joint saving is exactly
the kind of inference `A1` rules inadmissible for in-worker times, so I did not do it. **Three joint
sets were measured as their own conditions, at n = 8, rotated, in the same phase as their own `A`
baseline.**

```
set                                          measured joint   arithmetic sum   difference   sign
J2  engine + perft                              2.550 s          2.455 s         +3.9%      8/8
J3  engine + search + search.qe                 2.500 s          2.390 s         +4.6%      8/8
J4  engine + perft + history-pane + search      3.860 s          3.815 s         +1.2%      8/8
```

**Savings are additive on this lane to within +5%, and the deviation is SUPER-additive in all three
sets.** Removing files makes the remaining removals slightly cheaper, not dearer — consistent with
`plans/nfr-catalog.md`'s own floor measurement recording that marginal per-file cost RISES with file
count. **The operational consequence: an arithmetic sum of the per-file table is a CONSERVATIVE
estimator of the joint saving, so any set whose sum clears 1.480 s clears it in practice.** Sets I
did not measure jointly are marked as arithmetic below and carry that conservatism.

Absolute medians in phase 3, at a load median of 11.60, for whoever wants the un-paired view:

```
condition                                    files/tests    median CPU   median WALL
A   the lane at 54cbb23                      39 / 1181       15.090 s      2.945 s
J2  engine + perft removed                   37 / 1133       12.535 s      2.560 s
J3  engine + search + search.qe removed      36 / 1123       12.620 s      2.600 s
J4  four files removed                       35 / 1079       11.310 s      2.435 s
```

**`A` reads 15.090 s here against the ruled 14.480 s because this phase ran loaded** — which is why
the paired delta and not this column is the statistic. **The wall column is recorded as data and is
NOT a wall-clause verdict**; `NFR-008`'s wall clause is unruled, is routed to its own ticket in this
wave, and I did not settle warm/cold. Do not read `J2`'s 2.560 s as the wall clause passing.

## Every set that closes it, and every set that does not

Arithmetic sums of the measured per-file deltas, flagged as arithmetic and known conservative:

```
CLOSES 1.480 s
  engine + perft                       2.455 s  (MEASURED JOINTLY at 2.550 s)
  engine + search + search.qe          2.390 s  (MEASURED JOINTLY at 2.500 s)
  engine + history-pane                2.175 s
  engine + san.qualifier.hardening     1.990 s
  engine + search                      1.985 s
  engine + san                         1.910 s
  engine + search.qe                   1.805 s
  engine + turn-loop.nfr               1.795 s   <- smallest set containing engine
  perft  + history-pane                1.830 s   <- smallest set WITHOUT engine
  perft  + san.qualifier.hardening     1.645 s
  perft  + search                      1.640 s
  perft  + san                         1.565 s

DOES NOT CLOSE 1.480 s
  engine.test.ts alone                 1.400 s   short by 0.080 s
  perft  + search.qe                   1.460 s   short by 0.020 s
  perft  + turn-loop.nfr               1.450 s   short by 0.030 s
  ANY two files drawn from the other six: max is
  history-pane + san.qualifier.hardening 1.365 s short by 0.115 s  -> three files needed
```

**The structural answer, which is what the owner actually needs:** the deficit is **two of the two
heaviest files, or three of anything else.** `ABC-110`'s page estimated "~4 average files, or fewer
heavy ones" from the 371 ms all-in average. **That estimate was right in shape and pessimistic in
size: the measured answer is 2, because the two heaviest files carry 2.5x the average file's cost.**

## `A7` — verified rather than promised, and the one thing I could NOT verify is named

**`plans/nfr-catalog.md` is BYTE-IDENTICAL to `main` across this branch's entire diff.**
`git diff main -- plans/nfr-catalog.md` returns **empty**; the file was never opened for writing.
Whole-file `sha256 f9b0cfbd72f7da85ad1ad63a3f803bc6f5649e5f6351596ce18101afb06e67d5`.

**The limitation, stated rather than papered over: I could not reproduce `A7`'s own
`sha256 63f66795…ca31`, because no page I could find defines the exact byte range "the eight table
rows `NFR-001`–`NFR-008`" hashes over** — the rows span thousands of bytes each, with embedded
newlines and continuation prose, and any range I chose would be a range I invented. **So I verified
the strictly STRONGER property instead: the whole file, of which those eight rows are a subset, did
not change by a single byte.** That satisfies `A7`'s substance and does not fabricate a matching
hash. **Whoever executes `A6`–`A9` needs that byte range written down somewhere, and today it is
not.** Recorded as a gap in the input, not as a defect of this hop.

The rest of my diff is `.grugops/context/…` notes and the queue claim. No `src/` file, no
`package.json`, no `vitest.config.ts`, no `AGENTS.md`, no board column, no DoR table.

## What this claim does NOT say

- **It does not name a set.** It prices every set. **Choosing is `A5` and `A5` is the owner's** — see
  the sibling `decision` note, which states the choice and takes none of it.
- **It does not say the clause is fixed.** Nothing moved. `NFR-008`'s CPU clause is **still
  BREACHED** at `54cbb23` and at `main`, and stays breached until the owner rules and `A6` measures.
- **It does not rule the wall clause**, does not re-derive `N8-LANE`'s 5%, does not touch `isolate`,
  and does not move the 13 s or 3 s level.
- **It does not price the lane at `main` HEAD.** `main` has grown since `54cbb23`; the deficit there
  is larger and unmeasured, and every saving above is a floor.
