---
id: 20260809T203338Z-software-engineer-failed-attempt-6bf40cda
kind: failed-attempt
by: software-engineer
at: 2026-08-09T20:33:38Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - NFR-001
  - src/perft.test.ts
supersedes: 
---

# Counting the `NFR-001` denominator on a walk that also probes each node inflates it ~14x — recorded so nobody repeats it

## What was tried

One harness was written to do two jobs in a single 518,474-node walk: `A7`'s "is an ep move ever
offered onto an occupied square" probe **and** the `NFR-001` evaluation counters. The probe needs its
own `generateMoves` call at every visited node; the recursion is driven by `legalMoves`, which calls
`generateMoves` internally.

## What it produced, and why it is wrong

```
conditions evaluated, shipped placement  :     4,720     (ticket: 331)
conditions evaluated, before-placement   : 6,334,977     (ticket: 216,269)
```

Both numbers are real counts of real executions — and both are **useless as the ticket's
denominator**, because they are taken over a different call population. The recursion reaches
`legalMoves` only at the **18,357 non-leaf** nodes, while the diagnostic probe calls `generateMoves`
at **all 518,474**. The counters therefore measured ~536,831 generator invocations where the ticket's
figure measures 18,357.

## How it was caught rather than published

The residual gave it away: `4,720 − 4,389 = 331`, where 4,389 is the harness's own count of ep moves
offered during **its** pass. That is exactly the ticket's figure, so the extra 4,389 had to be the
diagnostic's own contribution. Re-running the counters on a **plain perft-style walk** — `legalMoves`
driving the recursion and nothing else calling `generateMoves` — produced `331 / 216,269 / 0`
directly, matching BA/PM independently.

## The lesson worth carrying

**An instrument that shares a traversal with a diagnostic no longer measures the thing it names.**
The published figure had a cross-check available (the ticket's own 331) and it was used; had this
been a number nobody had measured before, the 14x inflation would have shipped as a fact. Keep the
counting walk and the probing walk in **separate runs**, the same way this board already keeps one
OS process per tree state.

Neither number is a defect in the code, and the fix was never in question at any point of this.
