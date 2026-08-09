---
id: 20260809T131200Z-security-nfr-observation-8d8cf32e
kind: observation
by: security-nfr
at: 2026-08-09T13:12:00Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - A10
  - NFR-001
  - NFR-005
  - plans/nfr-catalog.md
  - src/moves.ts
  - src/legal.ts
supersedes: 
---

# `NFR-001` re-derived on this gate's own instruments — both clauses MET, and the null controls are worse than reported

**Nothing is inherited.** The Engineer's figures were read only so this gate can say where it agrees
and where it does not; QE explicitly declined to re-derive and that is treated as what QE labelled
it, not as a measurement. Every figure below is this gate's own, on **Apple M3 (Mac15,13) /
Node v24.12.0 / Darwin 25.5.0 arm64**, and **`UNKNOWN - verify` on any other hardware**.

## Clause 1 — the floor. MET.

`npm run perft` on the delivered tree, three runs by this role:

```
6,030,518 nodes/sec   (11,377,922 nodes in 1.887 s)
6,136,238 nodes/sec   (11,377,922 nodes in 1.854 s)
6,117,496 nodes/sec   (11,377,922 nodes in 1.860 s)
```

**6.03M–6.14M nodes/sec against the ≥ 1,000,000 bar — about 6.1x, MET.**

**One honest difference from the Engineer, stated rather than smoothed:** this gate's lowest run,
**6,030,518**, sits **0.16% BELOW** the bottom of the catalog's standing **6.04M–6.21M** band, where
the Engineer's three runs (6.079M–6.152M) sat inside it. One run 0.16% under a five-run band is
scatter, not an indictment, and **no baseline is moved on it** — but it is recorded rather than
rounded up into the band. The ratio form makes the question moot, which is why the bar carries it.

## Clause 2 — the ratio, in one process. MET on two independent samples.

**Protocol, this gate's own and deliberately not the Engineer's.** Three trees imported into a
**single** process: the **pre-fix** tree (`main`'s `src/`, `moves.ts` at
`fb4fa40934e768dffeaeed0b43548842`), the **delivered** tree (`0e247853ab2c05887c76105ff83d8621`),
and a **byte-identical TWIN of the delivered tree as a NULL CONTROL BY IDENTITY**. The twin was
verified equal to the delivered tree by `cmp` on **all thirteen** non-test files, and `pre` was
verified to differ from `post` in **`moves.ts` and nothing else** — twelve files byte-identical, so
the harness cannot be measuring an unrelated difference. **12 rounds, round 0 discarded as warm-up**
(the Engineer used 7), **tree order AND cell order rotated every round**, **`parseFen` hoisted OUT of
every timed region** (`npm run perft` leaves it inside; it is ~1 parse against 1.9 s and immaterial
either way, but the clock is clean here), medians of per-round rates, node counts **checksummed at
409,605,192 per sample**, harness held **outside the repository**, and **two fully independent
samples** in their own processes, quoted separately and never averaged.

```
                        SAMPLE 1                        SAMPLE 2
cell         rights   post/pre   twin/post      post/pre   twin/post
startpos     KQkq      0.9932     1.0072         1.0034     1.0024
kiwipete     KQkq      1.0228     1.0049         1.0052     1.0047
position-3   -         0.9959     1.0070         1.0063     1.0038   <- structurally zero
position-4   kq        1.0048     1.0005         1.0037     0.9963
position-5   KQ        0.9863     1.0202         0.9936     1.0056
position-6   -         0.9926     1.0182         0.9966     1.0078   <- structurally zero

AGGREGATE              1.0062     1.0096         0.9967     1.0087
```

**Aggregate post/pre 1.0062 and 0.9967 against the ≥ 0.98 bar — MET on both samples.** Worst single
cell across both, **0.9863** (position-5, sample 1), is also above the bar. Aggregate rates: pre-fix
6,235,381 and 6,316,628/sec; delivered 6,274,113 and 6,295,733/sec.

**`A10` is therefore MET on both clauses on this gate's own instruments.**

## The null controls, read FIRST per the catalog's standing caution — and they are WORSE than the record says

The caution says to carry a byte-identical twin, give the run its own process, and check a cell whose
delta is structurally zero **before** believing the cell you care about. Done, and the result is the
substance of this note.

**Structurally zero, and now confirmed by COUNT rather than by argument** (companion note): position-3
and position-6 hold no castling rights, `makeMove` can only clear a right and never create one
(`src/apply.ts:142`, `position.castling &= ~(...)`), so the two added lines execute **exactly zero
times** in those two subtrees. Their true ratio is **1.0000** by construction. They measured
**0.9959, 0.9926, 1.0063, 0.9966** — worst deviation **0.74%**.

**The identity twin** — the same bytes as the tree it is compared against, so its true ratio is
**1.0000** on every cell — measured **1.0096 and 1.0087 aggregate** and, per cell, up to **1.0202**
(position-5, sample 1).

**So this instrument's floor is about ±2% per cell and about ±1% in AGGREGATE.** Two things follow
that the record does not currently say:

- **The Engineer's "~±1% per cell" is an UNDERESTIMATE.** This gate reads up to **±2.0%** per cell on
  the same class of null control. The direction of their conclusion is right and the size is not.
- **The AGGREGATE also has a floor, and nobody had characterised it.** The twin reads **+0.96% and
  +0.87%** aggregate here, and the Engineer's own twin read **+0.87%** in one sample. Three of those
  four aggregate readings sit near **+0.9%** on trees that are byte-identical, which looks like a
  **systematic** favouring whichever tree is loaded last, not merely random scatter — this gate
  **cannot attribute it** and claims no cause. It matters because the bar's whole margin is 2
  percentage points: *"the margin is larger than the resolution"* is true, but the true factor is
  about **2x**, not the comfortable ratio the phrase suggests.

**The per-cell instability is demonstrated the hard way, by disagreement between two gates.** For
kiwipete the Engineer read **0.9930 and 0.9967**; this gate reads **1.0228 and 1.0052**. Four
readings of one cell spanning **0.993 to 1.023** — a 3-point spread on a quantity whose true value is
computable at **0.9998** (companion note). Two gates disagreeing by 3% on a cell is stronger evidence
that per-cell figures are noise than either gate's null control alone.

## `NFR-005` — NOT measured, and deliberately not measured

The exclusion is **structural** and was re-read at the source here rather than inherited:
`zobristKey` → `hasLegalEnPassant` (`src/legal.ts:85-134`) **synthesises its own probe move** and
calls `makeMove` / `unmakeMove` / `isSquareAttackedBy` / `kingSquareOf` — **never `generateMoves` and
never `legalMoves`**. So nothing this fix does to the castling route can touch the per-node key cost.
The ticket says explicitly not to re-run the key benchmark to "confirm" it, and **the key benchmark
was not run.**

## The denominator fence, re-derived rather than quoted

The catalog fences this figure at **97.3% free leaves**. Measured independently here by counting
generating nodes: **321,193 of 11,377,922 counted nodes generate**, so **97.18% are free leaves** —
the catalog's figure reproduced to within 0.1 points on this gate's own instrument. This is a
**generation-with-free-leaves** figure and is **never** evidence for `NFR-005`.

## What this note does NOT establish

- **That the 6.04M–6.21M standing baseline still holds as a five-run figure.** Three runs on one
  afternoon, one of them 0.16% under the band, do not re-establish it and this gate did not try.
- **Any figure for non-M3 hardware.** `UNKNOWN - verify`.
- **A cause for the twin's ~+0.9% aggregate systematic.** Observed in four readings across two gates,
  **not attributed**, and no number is claimed from the attribution.
- **Anything about allocation.** Not measured, none claimed.
