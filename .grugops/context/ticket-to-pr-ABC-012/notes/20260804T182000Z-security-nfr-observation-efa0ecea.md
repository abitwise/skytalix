---
id: 20260804T182000Z-security-nfr-observation-efa0ecea
kind: observation
by: security-nfr
at: 2026-08-04T18:20:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-012
  - ABC-012
  - NFR-002
  - NFR-003
  - ADR-0002
  - EPIC-002
  - EPIC-004
  - EPIC-006
  - src/history.ts
  - plans/nfr-catalog.md
  - 20260804T140500Z-software-engineer-observation-f82d9b50
  - 20260804T161500Z-qe-e2e-claim-d49bd286
supersedes: 
---

# The five bars, RE-MEASURED at this gate — six MET, both fences tested rather than repeated, and one instrument discarded before it could produce a false MISS

Every number below was produced by this role on this machine during this subtask. **Nothing is
transcribed from the Engineer's harness.** Where a figure reproduces one of its figures, that is
stated as a reproduction and not as a citation; where it does not, this gate's figure is the record
and the difference is named rather than smoothed.

## 1. Machine and protocol

**Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64. `UNKNOWN - verify` on any other
hardware** — the standing convention in `plans/nfr-catalog.md`, and the same machine class the
ticket's bars are written against.

Protocol, following the caution `plans/nfr-catalog.md` has now recorded six times: the harness lives
**outside the repository** and writes nothing into it; it runs in **its own process doing nothing
else**; a **discarded warm-up round**; **11 rounds** with the **cell order rotated every round**;
per-round means, **median** of the rounds; **two full independent samples in separate processes**.
**No wall-clock assertion was added to the suite** — this project's standing rule, because such a
test passes or fails on the machine that runs it. The nanoseconds live in the catalog and in this
note, never in an assertion.

**Population, stated:** one deterministic LCG game from the start position, driven by the **same
LCG `src/history.test.ts:81-89` plays** (`seed = 0x2f6e2b1`, `seed = (seed * 1103515245 + 12345) &
0x7fffffff`, over the generator's own ordering), so a ply count means the same thing in the harness
and in the suite. A second population anchored at `kiwipete` exists for the fence test in §3.

## 2. The six bars — ALL MET, on this gate's own figures

| Cell (120 plies unless noted) | Sample 1 | Sample 2 | Bar | Ratio | Verdict |
|---|---:|---:|---:|---:|:--|
| `takeBack(h, 2)` — **upper bound**, restore INSIDE the clock | 2.46 µs | 2.45 µs | ≤ 5 µs | 0.49x | **MET** |
| `takeBack(h, 2)` — restore OUTSIDE the clock (fence test, §4) | 2.93 µs | 2.92 µs | ≤ 5 µs | 0.59x | **MET** |
| `keyHistory(h)` | 40.16 µs | 40.20 µs | ≤ 60 µs | 0.67x | **MET** |
| `repetitionCounts(h)` | 44.35 µs | 44.45 µs | ≤ 75 µs | 0.59x | **MET** |
| `gameStatusOf(h)` | 47.75 µs | 47.59 µs | ≤ 75 µs | 0.64x | **MET** |
| `gameStatusOf(h)` — **kiwipete-anchored** (fence test, §3) | 41.89 µs | 42.25 µs | ≤ 75 µs | 0.56x | **MET** |
| `playMove(h, move)` | 8.6 ns | 8.2 ns | ≤ 100 ns | 0.09x | **MET** |
| `repetitionCounts(h)` @ **300 plies** | 91.93 µs | 92.15 µs | ≤ 150 µs | 0.61x | **MET** |
| `repetitionCounts(h)` @ **40 plies** (shape only, no bar) | 17.57 µs | 17.48 µs | — | — | — |
| `repetitionCounts(h)` @120 kiwipete-anchored (control) | 37.34 µs | 37.76 µs | — | — | — |
| `legalMoves` at the startpos-line position (control) | 2.74 µs | 2.74 µs | — | — | — |
| `legalMoves` at the kiwipete-line position (control) | 3.89 µs | 3.96 µs | — | — | — |

Per-round spread (min..max of the eleven round means, sample 1): `takeBack` 2.44–2.87 µs,
`keyHistory` 39.91–40.75 µs, `repetitionCounts` 44.02–45.97 µs, `gameStatusOf` 47.00–49.04 µs,
`playMove` 8.0–18.9 ns, `@300` 91.45–98.51 µs. The two samples agree to within about 1% on every
derive.

**Growth is linear with a constant offset — 17.5 / 44.4 / 92.0 µs at 40 / 120 / 300 plies**, which
reproduces the Engineer's shape. At 300 plies it is still **~10x under** `ADR-0002`'s own stated
threshold (~1 ms of replay) for re-opening clause 2, so **SEAM 2's no-memoization decision is not
under pressure from anything measured here.**

## 3. FENCE 1 — `gameStatusOf`'s margin is position-dependent. Tested and BOUNDED, not restated.

QE handed this column the fence rather than a number, which was right. It is discharged here with
the fence's own measurement instead of being passed on again.

| quantity | startpos-anchored line | kiwipete-anchored line |
|---|---:|---:|
| `gameStatusOf` − `repetitionCounts` | **3.40 / 3.14 µs** | **4.55 / 4.49 µs** |
| bare `legalMoves` at that position | 2.74 / 2.74 µs | 3.89 / 3.96 µs |

**The margin IS the one `legalMoves` call inside `gameStatus`, plus about 0.6 µs of that function's
other work — and it swings 1.4x on position alone**, exactly as `plans/nfr-catalog.md` records for
`NFR-001` (`legalMoves` 2.1 µs at startpos, 3.2 µs in a middlegame). The fence is real.

**The bar survives it.** The kiwipete-anchored `gameStatusOf` reads **41.89 / 42.25 µs — CHEAPER
than the startpos-anchored 47.75 / 47.59 µs**, because that line's replay is cheaper by more than
its `legalMoves` call is dearer. That is a result worth stating plainly rather than assuming the
expensive anchor is the worst case: **on this module the derive dominates, and the derive is the
part the position makes cheaper, not dearer.**

**The worst case is bounded by arithmetic, and is labelled as arithmetic rather than measured:**
worst derive observed (44.45 µs) + worst `legalMoves` observed (3.96 µs) + ~0.6 µs of `gameStatus`
overhead ≈ **49.0 µs = 0.65x of the 75 µs bar**. No position measured here comes near the bar, and
no arithmetic combination of the observed extremes does either.

## 4. FENCE 2 — the `takeBack` upper bound. Tested, and the honest result is not the expected one.

The ticket's bar is written against a timed region that INCLUDES the two restoring `playMove` calls,
so the figure can only be too high. This gate measured the same take-back with the restore moved
**outside** the clock, to see how tight that bound is.

**It reads HIGHER, not lower: 2.93 / 2.92 µs against 2.46 / 2.45 µs.** The reason is that the clean
variant builds a fresh 120-ply history per iteration, so every timed call pays cold-object cost that
the warm loop does not. It is a different shape, not a tighter reading of the same one.

**So the honest statement is:** the restore's arithmetic contribution is two `playMove` calls at
8.2–8.6 ns each ≈ **0.017 µs of 2.46 µs**, which is **below what this instrument can resolve**; the
bound is therefore tight to within less than the instrument's resolution, and **the bar is MET on
either framing, at 0.49x and 0.59x.** No claim is made that either framing resolves the other.

## 5. An instrument was built, measured, and DISCARDED before it produced a false MISS

**The first version of the `takeBack` cell called `legalMoves` twice INSIDE the timed region** to
choose the restoring moves. It read **10.38 µs against the 5 µs bar — 2.08x, a MISS.** That number
is an artifact: two generator calls at 2.7 µs each account for ~5.4 µs of it. The moves are fixed
across iterations (the state cycles S118 → S120 → S118), so they are now computed **once, outside
any timed region**, and the cell reads 2.46 µs.

**No number is claimed from the discarded instrument and it is recorded rather than buried**, because
a gate that reports a MISS it caused itself is worse than one that reports nothing. This is the
**seventh** instrument-limit correction this project has had to record, and it was caught for the
reason `plans/nfr-catalog.md` already gives: *check the reading on a cell whose answer you can
predict structurally before believing the cell you care about.*

## 6. Where this gate's figures differ from the Engineer's, stated rather than smoothed

| Cell | Engineer | This gate | Both MET? |
|---|---:|---:|:--|
| `takeBack(h,2)` | 2.45 µs | 2.46 / 2.45 µs | yes — agrees to 0.4% |
| `keyHistory` | 40.66 / 40.51 µs | 40.16 / 40.20 µs | yes — ~1% lower |
| `repetitionCounts` @120 | 45.72 / 45.78 µs | 44.35 / 44.45 µs | yes — ~3% lower |
| `gameStatusOf` @120 | 49.33 / 48.99 µs | 47.75 / 47.59 µs | yes — ~3% lower |
| `repetitionCounts` @300 | 99.62 / 99.07 µs | 91.93 / 92.15 µs | yes — **~8% lower** |
| `playMove` | 12.4 / 12.7 ns | 8.6 / 8.2 ns | yes — **~1.5x apart** |

**The `playMove` gap is the one this gate cannot attribute**, and it is named rather than explained
away: this harness times bounded batches of 2000 appends and rewinds outside the clock, and the
Engineer's shape is not recorded in enough detail to reproduce. It does not matter to the verdict —
both figures are **more than 7x under** the 100 ns bar — but "we do not know why these differ" is
the honest sentence and it is written here.

**Every bar is MET on two independently written harnesses.** That is the check the ticket's
`UNKNOWN - verify` convention exists to make possible, and it is the reason this column re-measures
rather than inherits.

## 7. What this measurement does NOT establish

- **One machine, one Node version.** `UNKNOWN - verify` on any other hardware. The margins are
  1.5x–11x under the bars, so a 3x slower machine would still clear every one of them — but that is
  **arithmetic, not a measurement**, and no non-M3 machine has run this harness.
- **No search-node denominator.** `EPIC-004` consumes `keyHistory` once per search, not per node
  (`ADR-0002` clause 3). Nothing here prices a search.
- **No frame measurement.** `NFR-002`'s write half is still `UNKNOWN - verify`; see the catalog.
