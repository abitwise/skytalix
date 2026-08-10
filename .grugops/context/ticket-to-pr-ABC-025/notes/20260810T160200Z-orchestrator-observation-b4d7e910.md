---
id: 20260810T160200Z-orchestrator-observation-b4d7e910
kind: observation
by: orchestrator
at: 2026-08-10T16:02:00Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - N5
  - src/san.qualifier.hardening.test.ts
  - src/san.ts
supersedes: 
---

# `N5` is BREACHED, and I reproduced it on an instrument the Engineer never touched — ~10.3%, not 0.4–1.2%

The Engineer reported a breach of his ticket's own NFR bar rather than narrowing the criterion that
caused it. That is the report most likely to be wrong in the reporter's favour if it were going to be
wrong at all — it is not; it is wrong in the direction that costs him. I measured it myself.

## The A/B, mine, run after the delivery

Whole-suite wall clock, three runs each, the only difference being whether
`src/san.qualifier.hardening.test.ts` is present in `src/`:

```
WITH the new file      1948  1977  1947 ms      median 1948
WITHOUT it             1766  1623  1793 ms      median 1766
delta                                           +182 ms
ratio against the without-baseline                10.3%
bar (N5)                                        <= 5%
```

The file was moved out and moved back in a single command; `src/san.ts` re-hashed
`cbcc3be37c21414d16e8e6b4d0c68959` afterwards and `git status` came back clean.

Isolated: `npx vitest run src/san.qualifier.hardening.test.ts` reads **516 ms total, 264 ms tests**
for 20 tests.

My delta (+182 ms) and the Engineer's (+171 ms) agree to within 6% on different runs of a noisy
instrument. **The verdict is not marginal: the bar is ≤5% and the measurement is ~10%, twice over.**

## What I verified of the rest of his report — all of it holds

```
md5 src/san.ts                 cbcc3be37c21414d16e8e6b4d0c68959   (unchanged)
git diff --numstat main -- src/  655  0  src/san.qualifier.hardening.test.ts
deletion lines under src/      0
package.json / package-lock    untouched
npm test                       672 passed / 672 on 21 files
```

`A6`'s mechanical half is therefore satisfied on my own reading, not his: one new test file,
additions only, no production line, no existing row touched.

## Why the prediction was 10–15x out, and why that is not a small error

`N5` was set at the cut against a measured **6.3–16.8 ms**. The Engineer's diagnosis is that the
number was arithmetically a **single-call-form** figure taken in **plain node**, while `A1`'s own
`when` clause requires **both** call forms and the bar is stated against a **vitest** lane roughly 5x
slower. Two compounding factors, each about 2–5x.

**This matters beyond one number.** `N5` is a self-imposed bar on a hardening ticket, and the only
ways to meet it as written are to delete coverage `A1` requires or to move the bar. The Engineer took
neither and said so — the right call, and the reason this is a decision to be made in the open rather
than a problem that quietly disappeared into a narrowed criterion.

**The bar is not mine to move and it is not his.** `N5`'s owner is BA/PM, who wrote it. A gate does
not move a target — this board's standing rule, applied to `ABC-013`'s `N4` five hours ago.

## My own error, recorded

The Engineer caught that the `enqueued_at` I hand-wrote on his subtask (`15:35:00Z`) ran ~11 minutes
ahead of this machine's `date -u`. He recorded his claim at the real reading rather than smoothing it
to match mine. I had also hand-written `15:30:00Z` on the note before it. Both were invented rather
than read. Every stamp I write from here is `date -u` output, and the two wrong ones stay wrong on the
record rather than being edited into agreement.
