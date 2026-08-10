---
id: 20260810T120835Z-ba-pm-observation-1d3f74c4
kind: observation
by: ba-pm
at: 2026-08-10T12:08:35Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - ADR-0003
  - ADR-0004
  - NFR-002
  - NFR-003
  - plans/nfr-catalog.md
supersedes: 
---

# The NFR bench, twice: a CORRECT build fails both of `ABC-013`'s bars, and the reason is in the bars

## Method — wave 1's, as closely as it can be reproduced

Deterministic random-legal game from `startpos` (mulberry32, seed `20260810`), measured at the
ply-60 position, read-only against merged `src/`, outside the repository. Warm-up then 7 timed
repetitions per figure, median reported, min/max printed. A null floor (empty loop body) is measured
in the same harness and runs at **0.0009–0.0010 µs**, i.e. **0.18–0.20%** of the smallest figure
below — the instrument is not measuring itself. Two full runs, separate OS processes.

**Apple M3, Node v24.12.0, darwin/arm64** — the same machine class the ticket's bars name.
`UNKNOWN - verify` on any other hardware.

```
P60 = 1rb4r/3k4/p1ppNn2/1p1np1Q1/1q1P1B1P/PRP2p2/3KP1BR/6N1 w - - 2 31
      42 legal moves, 3 of which give check
```

## Measured

| figure | run 1 | run 2 |
|---|---:|---:|
| `legalMoves(position)` | 4.585 µs | 4.575 µs |
| `toSan(position, move, legal)` — mean over all 42 | 0.491 µs | 0.490 µs |
| `toSan(position, move, legal)` — **non-checking moves only** | 0.179 µs | 0.179 µs |
| `toSan(position, move, legal)` — **checking moves only** | 4.529 µs | 4.593 µs |
| `toSan(position, move)` — mean over all 42 | 4.232 µs | 4.241 µs |
| `toSan(position, move)` — **pawn moves only (8)** | 0.133 µs | 0.133 µs |
| `toSan(position, move)` — **piece moves only (34)** | 5.162 µs | 5.175 µs |
| `toSan(position, move)` — **checking PIECE moves only (3)** | 9.341 µs | 9.248 µs |
| full history render (replay + `toSan`/ply), 40 plies | 180 µs | 182 µs |
| … 120 plies | 395 µs | 392 µs — **2.5% of a 16 ms frame** |

## What that says about the two bars — they are not stale, they are the wrong shape

The ticket demanded `toSan(position, move, legal) ≤ 0.20 µs` and `toSan(position, move) ≤ 6.5 µs`
with **no stated aggregation and no stated move population**. Under the natural per-call reading a
**correct reference build misses both**:

- a checking piece move costs **9.34 / 9.25 µs** unassisted — **1.42x** over the 6.5 µs bar;
- the same move costs **4.50 / 4.49 µs** with the list supplied — **22.5x** over the 0.20 µs bar.

Neither is an implementation defect. Deciding `+` versus `#` requires `legalMoves` on the position
*after* the move, which is `ADR-0004`'s own definition of the mate suffix ("mate is additionally
`legalMoves(after).length === 0`"). A checking move therefore pays a second full move generation,
and **a checking move costs 25x a quiet one** with the list supplied. The 0.10–0.11 µs figure the
bar was built on is only reachable on a population with no checking moves in it.

The mean is likewise a property of the position, not the build: it moves with the check density
(3 of 42 here) and with the pawn/piece mix, because **a pawn move never needs the legal list at
all** — 0.133 µs against 5.16 µs for a piece move. That is also why the mean unassisted figure
(4.23 µs) is *lower* than a standalone `legalMoves` call (4.58 µs), which looks impossible until the
population is named.

## What it does NOT say — no regression is claimed or refuted

`legalMoves` measures **4.58 µs** here against wave 1's published **3.18 µs**. That is **not**
evidence that `ABC-009`'s or `ABC-022`'s guards cost anything. Wave 1 recorded a *method* — "a
deterministic random-legal game from `startpos`, ply-60" — and never recorded the seed or the
position, so its position cannot be reconstructed and no like-for-like comparison exists. 4.58 µs
sits inside `ADR-0003`'s published 1.8–5.4 µs range for `legalMoves`, so position variance alone
covers the gap. **The guard cost is below this instrument's ability to attribute and was not
measured here.** The repair is to pin the position as a literal FEN so the next hop is not in the
same position.

## Two limits on these numbers

- They come from a **reference `toSan` written for this hop**, not from the engineer's build. It
  allocates a rivals array per call, so every figure is an **upper bound** for a tuned
  implementation and the derived bars are ceilings a correct build should clear comfortably.
- `NFR-002`'s frame headroom is **confirmed, not merely asserted**: 2.5% of a 16 ms frame at 120
  plies against `ADR-0004`'s published 3.3%. `NFR-003`'s parenthetical in the ticket was wrong by
  ~5x — 41 moves cost ~20 µs, ~5,000x under the 100 ms budget, not ~4 µs and ~25,000x.
  `plans/nfr-catalog.md` was **not** edited and no catalog target moved.
