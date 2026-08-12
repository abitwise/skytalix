---
id: 20260813T013000Z-security-nfr-observation-n8-lane-this-one-is-a-number-not-a-floor-and-here-is-my-floor-0a7b6786
kind: observation
by: security-nfr
at: 2026-08-13T01:30:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-026
  - ABC-029
  - NFR-008
  - ADR-0008
  - plans/nfr-catalog.md
  - src/turn-loop.test.ts
  - src/turn-loop.nfr.test.ts
supersedes:
---

# `N8-LANE` — this one is a NUMBER, not a floor. And here is my floor, measured beside it

Five consecutive hops have reported a floor rather than a number. **This one resolves**, and it
resolves against the conservative floor as well as against mine — which is the only reason I am
willing to write a number at all.

## Method — the catalog's own wording, on my own harness

`plans/nfr-catalog.md` § *The standing per-ticket lane bar* prescribes it and I followed it clause by
clause rather than inventing a per-ticket protocol:

- **Instrument: CPU (user + sys) of the default lane, NOT wall.** `/usr/bin/time -p` around
  `node_modules/.bin/vitest run` invoked **directly**, `PERFT_DEEP` unset. (Stated either way, as the
  bar requires: invoked directly, not through `npm test`.)
- **Statistic: median of PAIRED per-round deltas**, **9 rounds, round 0 discarded → 8 usable**,
  condition order **rotated every round**, one fresh OS process per run, **sign test reported beside
  it**.
- **Three conditions, interleaved in the same harness**: `WITH` (the branch tip's `src/`), `WITHOUT`
  (the same tree minus the three files this branch **adds** — the denominator), and `NULL` (an
  identity control).
- **Identity control verified byte-identical** by `diff -r` over the whole tree: **0 differences**.
- **Machine: `darwin-arm64` / Node v24.12.0.** `UNKNOWN - verify` on any other machine.

**Scope, measured not assumed:** `git diff main --diff-filter=A --name-only -- src/` returns exactly
`turn-loop.ts`, `turn-loop.test.ts`, `turn-loop.nfr.test.ts`. **This ticket adds TWO test files.** The
three modified `history-pane` files are `ABC-028`/`ABC-029`'s and are in **both** arms, so they cancel.

## THE NULL CONTROL — my floor, reported as a floor

```
paired deltas (ms):  +130,  0, +110, -130, -10, -10, -140, -60
median               -10 ms          = -0.10% of the denominator
sign test             3/8 positive   (chance)
range                -140 .. +130 ms  (spread 270 ms)
```

**The bar admits a null control at ≤ 1.5% with its sign at chance. Mine reads −0.10% at 3/8 — this
run is admissible on the bar's own terms.**

**And the negative median is NOT a saving.** A byte-identical tree cannot be 10 ms cheaper than
itself. `−10 ms` is the instrument's noise, and it is written here as noise, in the same words the
brief asked for.

**My floor disagrees with the record one hop back, and I report mine as measured.** `N-1` records
**±390 ms** on the same machine and method, against this project's earlier **±130 ms**. My absolute
excursion is **±140 ms** — close to the older record, far quieter than the ±390 ms hop. **That is a
session difference, not a protocol correction**, and it is exactly `N-1`'s point: *a floor quoted
without its session is a number wearing a floor's clothes.* I do not claim my session generalises.

## THE TICKET EFFECT — and it clears BOTH floors

```
paired deltas (ms):  +870, +620, +640, +830, +780, +670, +1040, +890
median               +805 ms         = +9.03% of the denominator
sign test             8/8 positive
range                +620 .. +1040 ms
```

**8/8 positive, and the MINIMUM observed delta (+620 ms) exceeds even the ±390 ms conservative
floor.** The effect's existence is not a floor artifact under any of the three floors on record. This
is why this hop can report a number where five could not: **the effect here is 4x to 6x its own noise,
because the ticket adds two large test files rather than a handful of assertions.**

## The verdict against the bar

| quantity | value |
|---|---|
| gross median effect | **+805 ms CPU** |
| net of the per-file floor (160 ms × **2** test files = 320 ms) | **+485 ms CPU** |
| `N8-LANE` allowance | **≤ 650 ms CPU** |
| **ratio** | **0.75x — MET** |

**Under the conservative ±390 ms floor the net band is +95 to +875 ms = 0.15x to 1.35x, and the upper
tail is not resolvable.** Under my own measured ±140 ms floor the band is +345 to +625 ms =
**0.53x to 0.96x — MET throughout**. **The bar's own statistic is the median of paired deltas, and by
that statistic the answer is 0.75x MET.** I state both bands so the verdict can be disagreed with on
the floor rather than on the arithmetic.

## Lane totals, read but NOT adjudicated

Median with the ticket: **9.75 s CPU / 1.72 s wall**. Without: **8.92 s CPU / 1.65 s wall**. Against
`ADR-0008`'s **13 s CPU / 3 s wall** that is 0.75x and 0.57x. **The lane TOTAL is disputed and routed
to `ABC-026`; it is not mine and I do not rule on it.** The reading is recorded because it costs
nothing and the next hop should not have to re-take it.

## One number in the record that is a DIFFERENT quantity, so nobody reads it as a contradiction

The ticket's seventh-hop block records *"the paired delta **+100 ms = +1.00%** against `N8-LANE`'s
650 ms"*. **That is that hop's own incremental delta — a hop which added ZERO test files** — and it is
not the ticket's whole test surface. **Mine is the whole surface: both files, against a lane without
them, which is what the bar's denominator clause specifies.** `+805 ms` and `+100 ms` measure
different things and neither refutes the other.

## What I did not move

**A gate does not move this bar** — that rule is unchanged and I held it. `plans/nfr-catalog.md` was
**not opened for edit**: the brief made it mine only if a bar genuinely moves, and **no bar moves.**
`N8-LANE` is MET at its existing allowance and `NFR-002` at its existing targets.
