---
id: 20260810T134757Z-security-nfr-observation-4a1c26c2
kind: observation
by: security-nfr
at: 2026-08-10T13:47:57Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - src/san.ts
  - plans/tickets/ABC-013-san-rendering.md
supersedes: 
---

# The `N4` attribution TESTED: the Engineer's CONCLUSION is upheld and now positively established — his MECHANISM is refuted, and the real one is that the reference's "worst 9.34 µs" is a MEAN OVER THREE MOVES

The Engineer wrote, of his `N4` worst (10.24 / 10.37 µs) exceeding the reference build's (9.34 / 9.25):

> **This is an instrument difference, not a slower build.** I time one move in a tight loop; BA/PM
> timed the worst member of a 42-move sweep, where the surrounding moves keep caches and branch
> predictors warm. […] the two numbers were produced by different aggregations and are not comparable.

He was asked to be believed on the direction and he is right about it. He is wrong about why, and the
subtask asked for this to be tested rather than accepted. Three experiments, one instrument.

## Experiment 1 — is the delivered build slower than a build that allocates? **NO.**

A reference `toSan` was written here to the shape BA/PM described its own ("it allocates a rivals
array per call"): rivals materialised with `filter`, then weighed with two `some` passes. Both builds
emit **identical strings on all 42 moves in both call forms** — verified before either was timed.
Then both were measured on ONE instrument, one process, same order.

| quantity, unassisted | delivered | reference | delivered is |
|---|---:|---:|---|
| mean over 42, protocol A | 4.235 / 4.243 | 4.284 / 4.315 | **1.2 / 1.7% FASTER** |
| mean over 42, protocol B | 4.265 / 4.637 | 4.343 / 4.361 | faster / (noise) |
| **per-move WORST, protocol A** | **10.307 / 10.350** | **10.485 / 10.549** | **1.7 / 1.9% FASTER** |
| per-move worst, protocol B | 10.392 / 10.629 | 10.603 / 10.596 | faster / equal |

**The delivered build is not slower than an allocating reference build; it is marginally faster on
every aggregate, and its per-move worst is lower on both protocols in both samples.** The Engineer's
conclusion is upheld — and it is now *positively established* rather than merely unrefuted, which is
a different and stronger statement than the one his note could make.

## Experiment 2 — does a sweep instrument read LOWER than a tight loop? **NO — it reads the same or HIGHER.**

The claimed mechanism is that a 42-move sweep keeps caches and predictors warm, so the sweep's worst
member reads lower than the same move timed alone. Measured on the same build, same process:

```
delivered, worst move g5g7, unassisted
  protocol A  tight loop      10.307 / 10.350 µs
  protocol B  inside a sweep  10.392 / 10.629 µs      ← HIGHER, in both samples
```

The sweep instrument is **never** the cheaper one. A warm-cache effect cannot explain a figure 9%
LOWER, because the direction is wrong. **The stated mechanism is refuted.**

## Experiment 3 — what IS 9.34, then? **It is the mean over the three checking PIECE moves.**

Two independent pieces of evidence, and they agree:

1. **It is byte-identical to a different row in BA/PM's own note.** That note's bench table lists
   `toSan(position, move)` — **checking PIECE moves only (3)** at `9.341 / 9.248 µs`. The ticket's
   `N4` row and BA/PM's decision note both carry `worst 9.34 / 9.25`. Same digits, and the ticket
   reports no other worst-case figure anywhere.
2. **This gate's reference build reproduces that GROUP MEAN, and its true per-move worst is nowhere
   near it.** Reference build, protocol A: mean over the three checking piece moves **9.353 / 9.383
   µs** against BA/PM's 9.341 / 9.248 — agreement to 0.1–1.5%. The same build's actual per-move
   maximum is **10.485 / 10.549 µs**. Under protocol B the group mean is 9.519 / 9.515 and the
   maximum 10.603 / 10.596. **No instrument here puts a reference build's per-move worst at 9.3.**

The arithmetic is checkable on this gate's own per-move figures: the three checking moves at `P60`
are `g5g7`, `e6c5`, `e6f8`, and on the delivered build they read 10.307 / 8.917 / 8.462 µs —
mean **9.229**, maximum **10.307**. One population, two aggregations, 1.12x apart.

## What that means, stated plainly

- **`N4`'s "measured" cell in the ticket is mislabelled.** `N4` says *"no single legal move at `P60`
  exceeds 14 µs"* and its measured cell says *"worst 9.34 / 9.25 µs"*. That number is a **mean over
  three moves**, not a worst. The bar itself is unaffected and is MET at 0.74x.
- **The 14 µs bar is TIGHTER than its own derivation says.** It was set at ~1.5x of 9.34. Against the
  reference build's true per-move worst (10.485–10.603 µs on this machine class) the same 14 µs is
  **~1.32x**, not 1.5x. Real headroom remains — the delivered build sits at 10.31 µs, 1.36x under —
  but it is a quarter smaller than the derivation implies.
- **Nobody's build regressed and nobody's measurement was dishonest.** BA/PM never claimed to publish
  a per-move maximum in its bench note; the figure was promoted into a row labelled "worst" when the
  bars were written. The Engineer noticed the mismatch, drew the right conclusion, and reached for the
  wrong reason because he had only his own instrument to reason with.

**No target was moved and `plans/nfr-catalog.md` was not edited.** `N1`–`N4` live in the ticket's
`## Security / NFR triggers`, which this gate does not edit — the mislabelling is reported to a human
in the verdict note, with an owner.
