---
id: 20260810T155236Z-software-engineer-observation-3c1e3794
kind: observation
by: software-engineer
at: 2026-08-10T15:52:36Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - N5
  - plans/tickets/ABC-025-san-qualifier-minimality-net.md
  - plans/nfr-catalog.md
  - src/san.qualifier.hardening.test.ts
supersedes: 
---

# `N5` is BREACHED at 12.5–19.3% against a ≤ 5% bar, and the prediction it was set against is arithmetically a single-call-form number

This is the one thing in `ABC-025` I found wrong, and it is measured rather than asserted. It is
recorded as an `observation` and **not** as a `finding`: there is no §14 gate verdict on this hop to
issue a `§14-gate#<id>` stamp and `context.human_admission` is `off`, so no stamp exists. The ruling
on `N5` belongs to the Security/NFR gate and to BA/PM who set the bar; this note supplies the
numbers, not the verdict.

## The measurement

Six runs each, same session, Apple M3 / Node v24.12.0 / darwin arm64, vitest 3.2.7.

```
default lane WITHOUT this ticket's file   1.41 1.37 1.35 1.37 1.29 1.38 s   mean 1.362 s
default lane WITH it (`npm test`)         1.45 1.41 1.65 1.54 1.63 1.52 s   mean 1.533 s
                                          → wall-clock delta +171 ms = 12.5% of the baseline

the new file's own reported test time     268 / 260 / 261 ms                → 19.3% of the baseline
```

Both readings are given because "the tests this ticket adds cost X% of the default lane" has two
honest meanings under a parallel runner: the file's own serial cost (19.3%) and the wall-clock delta
after vitest overlaps it with the other 20 files (12.5%). **`N5`'s bar is ≤ 5% and its recorded
prediction was 0.4–1.2%.** Both readings breach it; the smaller reading breaches it by 2.5x.

## The cause, isolated

`A1` requires the string in **both call forms**. The unassisted form makes `toSan` regenerate the
legal move list once per move — 5,524 times over the corpus. Measured, in a fresh process each time:

```
4,861 bare legalMoves() calls, plain node script          28 ms   (~6 µs each)
the same 4,861 calls inside a vitest test file           138 ms   (~28 µs each)   ~5x
A1 with both call forms   (delivered)                    187 ms of the file's 263
A1 assisted-only (variant, measured out of tree)          89 ms total for the whole file  ≈ 6.5%
```

So ~174 ms of the delivered 263 ms is the unassisted half of `A1`, and vitest's module runner makes
the underlying `legalMoves` about **five times** more expensive than the same code in a plain node
process.

## Why the ticket's prediction cannot be the delivered lane's cost

`A1`'s own parenthetical reads *"green on the delivered build over **7,314 renders** in 6.3–16.8 ms"*,
and `N5`'s row carries the same three figures as the whole added-test cost.

**7,314 is the number of legal moves in the corpus — one render per legal move, i.e. ONE call form.**
Rendering both forms for the qualifiable subset is 5,524 additional unassisted renders, and those
cost **≥ 27 ms in plain node** before any test framework is involved, which is already above the
maximum reported 16.8 ms. The prediction is therefore arithmetically a single-call-form measurement,
taken in a plain-node harness that is ~5x faster than the vitest lane `N5` is a ratio of.

`N5` was written as a ratio precisely so it would survive a hardware change (`ABC-013`'s `N1`
lesson). It does — but a ratio does not survive a change of **instrument**, and that is what happened
here: numerator measured in one harness, denominator in another.

## What was NOT done about it

`A1` is delivered **as written**, in both call forms, over all 207 corpus positions. The clause was
not quietly narrowed to make a bar green. `plans/nfr-catalog.md` is not edited and no target moved —
a role that breaches a bar does not also move it.

## The one measured fact the ruling will want

Across **all 13 mutants**, the assisted-only mismatch count and the unassisted-only mismatch count
are **identical on every row** (412/412, 24/24, 110/110, 536/536, 30/30, 116/116, 412/412, and 0/0
for the rest). **Dropping `A1`'s unassisted half changes no verdict in this mutant set** and costs
89 ms instead of 263 — but that is evidence about *this* set, and the ticket's own honest prior is
that the set is not complete. Note also that call-form equivalence is separately asserted over 41
positions (this ticket's `A5` over 23, `ABC-013`'s `A19` over 18), so the clause is not the only
guard on that seam.

**Even with the unassisted half removed, the file measures ~6.5% of the lane.** `N5` is not reachable
at this corpus size on this instrument by any arrangement of `A1`–`A5` I could find, which is the
part of this that is a ticket defect rather than an implementation choice.
