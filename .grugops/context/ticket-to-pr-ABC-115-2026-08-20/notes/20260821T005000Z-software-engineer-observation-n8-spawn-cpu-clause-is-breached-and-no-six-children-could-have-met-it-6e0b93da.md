---
id: 20260821T005000Z-software-engineer-observation-n8-spawn-cpu-clause-is-breached-and-no-six-children-could-have-met-it-6e0b93da
kind: observation
by: software-engineer
at: 2026-08-21T00:50:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - N8-SPAWN
  - NFR-008
  - ABC-108
supersedes:
---

# `N8-SPAWN` — COUNT AND WALL HOLD, **THE CPU CLAUSE IS BREACHED**, and the arithmetic says no six children of this shape could have met it

**REPORTED, NOT ABSORBED, AND NOT GRADED.** The ticket's instruction is explicit: *"A hop that meets
the count and blows a time clause has breached this ticket and says so rather than shipping."* This
is that. **The remedy is BA/PM's pen, not an engineer's judgement at the bench** — the page already
records that dropping a criterion child to fit the ceiling was priced and REJECTED there.

## THE MEASUREMENT — 5 INTERLEAVED PAIRED RUNS, not two samples taken hours apart

`npx vitest run --dir src`, `/usr/bin/time -p`, base and delivered alternating on the same machine
within the same minute. Base = `src/cli.ts` and `src/cli.test.ts` at `HEAD` (`badf6c3`).

| | base (median) | delivered (median) | delta |
|---|---|---|---|
| children | 17 | **23** | **+6** |
| wall (`real`) | 3.08 s | 4.22 s | **+1.14 s** |
| CPU (`user`) | 14.08 s | 14.86 s | +0.78 s |
| CPU (`user+sys`) | 15.43 s | 16.45 s | **+1.02 s** |

Paired deltas, run by run — `real`: +1.01 +1.07 +1.18 +1.08 +1.26; `user+sys`: +1.34 +0.74 +1.11
+1.02 +1.19. **The sign is 5/5 on both; this is not noise.**

| clause | ceiling | measured | verdict |
|---|---|---|---|
| added children | <= 6 | **+6** | MET, exactly at the ceiling |
| added wall | <= 2.0 s | **+1.14 s** | MET |
| added CPU | <= 0.5 s | **+1.02 s** (`user+sys`), **+0.78 s** (`user` alone) | **BREACHED on either reading** |

## WHY, AND IT IS NOT SOMETHING THIS HOP CHOSE

**A node child's CPU is roughly 2.2x its wall, because node's startup is multi-threaded and
`/usr/bin/time` accumulates reaped children.** Measured directly here:

```
one ordinary product child (node src/cli.ts --ascii </dev/null):  real 0.07 s   user 0.11 s  sys 0.05 s
one A9 child (FIFO + settle + head -2):                            real 0.64 s   user 0.13 s  sys 0.03 s
```

So an ordinary child is **~0.16 s of CPU**, not the 64-72 ms figure — **that number is WALL, and the
`<= 0.5 s CPU` clause was derived from it as if it were CPU.** Six children x ~0.16 s = **~0.96 s**,
which is the measured +1.02 s to within noise. `A9`'s child is the *cheap* one in CPU despite being
~9x the wall, because most of its second is a `sleep`.

**THE CLAUSE AS WRITTEN IS UNMEETABLE BY ANY SIX CHILDREN OF THIS PRODUCT.** Even six ordinary
`node src/cli.ts` children — the cheapest shape available, with `A9` removed entirely — cost ~0.96 s
of CPU. This is not a breach caused by the harness shape chosen here; it is arithmetic on the
ticket's own derivation. **Every one of the six is named by a criterion**, so none is a finding
against the ticket in the sense the page defines.

## WHAT THIS HOP DID ABOUT IT

- **It did not drop a row.** `A3`'s five close points and `A9`'s one child are the criteria as
  written; the under-ceiling alternative is on the page as priced-and-rejected.
- **It did not restate the clause to fit.** The number stands as measured, against both readings of
  "CPU".
- **It did not move `ABC-115` to `In Review`.** See the `artifact-ref` note.
- **The three options are laid out for BA/PM and none is taken here:** (a) re-derive the CPU clause
  on the measured ~0.16 s/child and raise it to ~1.1 s, which is the arithmetic correction; (b) drop
  `A3`'s default-glyph pair, saving ~0.32 s CPU and still breaching; (c) accept the breach explicitly
  against `ABC-108`. **(b) does not reach the ceiling**, which is the fact that decides between them.

## AND THE LANE TOTAL IS REPORTED, NOT CLAIMED

Delivered lane: **40 files / 1212 tests / 0 skipped, green, 4.22 s wall, 16.45 s CPU (14.86 user).**
`NFR-008` is **13 s CPU and 3 s wall** and was **already breached on both** at the base (15.43 s CPU /
3.08 s wall) before this ticket added a line. **NO `N8-LANE` LINE IS CLAIMED** — same posture as
`ABC-110`, `ABC-113`, `ABC-114`. **This ticket's +1.14 s wall and +1.02 s CPU are handed to `ABC-108`
as a measured contribution; that budget is `ABC-108`'s to rule and nothing here rules it.**
