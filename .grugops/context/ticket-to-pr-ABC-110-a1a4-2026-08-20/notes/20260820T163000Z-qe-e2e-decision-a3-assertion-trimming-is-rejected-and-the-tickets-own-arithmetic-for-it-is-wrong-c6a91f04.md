---
id: 20260820T163000Z-qe-e2e-decision-a3-assertion-trimming-is-rejected-and-the-tickets-own-arithmetic-for-it-is-wrong-c6a91f04
kind: decision
by: qe-e2e
task: ticket-to-pr-ABC-110-a1a4-2026-08-20
at: 2026-08-20T16:30:00Z
verified_by:
confidence: high
refs:
  - ABC-110
  - ABC-110/A3
  - NFR-008
  - ADR-0008
  - ADR-0014
supersedes:
---

# `A3` — **trimming assertions in a retained file is REJECTED**, and it is rejected on a measurement rather than on the ticket's stated arithmetic, **because the ticket's stated arithmetic does not compute**

**This is not a stamp.** Hand-authored `decision`; no `finding` is admissible on this install.
**No retained file lost an assertion at this hop, and no file lost one at all — `src/` is
byte-identical across my whole diff.**

## The correction first, because repeating a wrong number is worse than the number

`ABC-110` `A3` instructs the rejection be written "with the arithmetic", and supplies it:

> *"the whole per-file in-worker sum is ~4.2 s of a 14.5 s total, so the entire 30% is smaller than
> twice the deficit and only a whole-file move removes a floor."*

**The clause "the entire 30% is smaller than twice the deficit" is FALSE, on the page's own
numbers.** Twice the deficit is `2 x 1.480 = 2.960 s`. The page's own in-worker sum is **4.2 s**,
which is **larger** than 2.960 s, by 1.24 s. **My own measurement makes it worse, not better:**

```
in-worker sum at 54cbb23, three independent runs   4522 / 4552 / 4796 ms   median 4.552 s
against the ruled CPU total                        4.552 / 14.480  =  31.4%
the per-file FLOOR is therefore                                        68.6%
twice the deficit                                  2 x 1.480 s     =   2.960 s
4.552 s > 2.960 s                                  the clause is WRONG by 1.6 s
```

The **percentage** on the page is right (~30%, I measure 31.4%) and the **conclusion** is right. The
**comparison sentence joining them is not**, and it is the sentence a reader would quote. **It is
corrected here rather than repeated, and this note supersedes nothing because the ticket page is not
a note — whoever writes `A6`–`A9` should not carry that sentence forward.**

## The rejection, on the ground that actually holds — and it is MEASURED

`A3`'s real claim is that **only a whole-file move removes a floor**. That is not a claim about
percentages; it is a claim about what a trim can and cannot reach. **It is now measured directly.**

```
src/turn-loop.nfr.test.ts     total in-worker time            200 ms
                              MEASURED saving from removal    395 ms   (paired median, n=8, 7/8)
                              ratio                           1.98x
```

**Deleting every assertion in that file while keeping the file could not save more than 200 ms — its
entire execution time. Moving the file saves 395 ms.** The 195 ms difference is the per-file floor,
and no assertion edit reaches it. The same holds for **7 of the 8 candidates**: the measured saving
exceeds the file's entire in-worker time for `engine` (+270 ms), `history-pane` (+441 ms),
`san.qualifier.hardening` (+125 ms), `search` (+252 ms), `san` (+335 ms), `search.qe` (+110 ms) and
`turn-loop.nfr` (+195 ms). **For those seven files, deleting one hundred percent of their assertions
and keeping the file saves strictly less than moving the file intact.** That is the arithmetic `A3`
wanted, and it is stronger than the one it asked for.

## What it would actually take to close 1.480 s by trimming, stated so nobody proposes it again

```
in-worker sum across all 39 default-lane files                  4.552 s
deficit to close                                                1.480 s
share of ALL test execution in the lane that must be deleted    32.5%
files whose floor survives that deletion                        39 of 39
CPU those 39 floors still cost                                  9.93 s of the 14.48 s
```

**You would delete roughly one third of every assertion this project has, keep every floor, and land
at 13.00 s with zero margin — having removed the coverage AND the headroom.** Moving two files
removes 2.550 s and touches 48 tests. **The trim is worse on both axes at once**, and it is
`ABC-110`'s `## Out of scope` besides: *"Deleting, thinning or consolidating any test."*

## The two proposals I am rejecting by name, in advance

**1. "Thin `perft.test.ts`'s deep rows in place."** `perft.test.ts` is the ONE file where in-worker
time (1392 ms) EXCEEDS the measured saving (1055 ms) — the only over-predicting cell in the whole
table. **A trim sized off that 1392 ms would be sized off a number that over-states the available
saving by 32%.** Rejected: it is an inferred saving, `A1` rules those inadmissible, and this one is
measurably wrong.

**2. "Consolidate the four `*.nfr.test.ts` guards into one file to remove three floors."** This is
the shape that will look clever at the next hop, so it is refused here: `ADR-0008`'s
`vitest.config.ts` note records that **per-FILE module-registry isolation is exactly what
`zobrist.nfr.test.ts`, `gameend.nfr.test.ts` and `san.nfr.test.ts` depend on** — a `vi.mock` factory
is hoisted to file scope and the registry is per file. **Merging them re-creates, by hand, the same
shared-registry failure `isolate: false` causes, and would disarm the same three guards.** It is the
forbidden lever wearing a different name. **Rejected, and it is also test consolidation, which is
`## Out of scope`.**

## What this decision does NOT decide

**It rejects a METHOD. It chooses no file, no set and no lane.** That is `A5`, that is the owner's,
and this hop stops in front of it. Nothing was deleted, thinned, consolidated or moved; **`src/` is
byte-identical and `plans/nfr-catalog.md` is byte-identical to `main`, both verified rather than
promised** (see the `A2` note).
