---
id: 20260815T192000Z-qe-e2e-observation-perft-deep-and-the-lane-reading-i-am-not-ruling-24f3e683
kind: observation
by: qe-e2e
at: 2026-08-15T19:20:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - PERFT_DEEP
  - G1
  - N8-LANE
  - B1
  - src/perft.test.ts
  - src/cli.test.ts
  - plans/nfr-catalog.md
supersedes: 
---

# `PERFT_DEEP` ruled and run, and an `N8-LANE` reading offered as EVIDENCE — never as a verdict

## `PERFT_DEEP` — IN SCOPE by reachability, RUN, GREEN

**The question is whether either delivered production module reaches `moves` / `legal` / `apply` /
`position` at runtime.** I recomputed the import closure from source on the *integrated* tree, splitting
runtime (value) edges from `import type` edges, because a type-only edge is erased and executes nothing:

```
src/cli.ts          runtime closure = 17 modules, and it reaches all four:
  cli.ts -> history.ts -> apply.ts                      (apply)
  cli.ts -> history.ts -> apply.ts -> moves.ts          (moves)
  cli.ts -> history.ts -> gameend.ts -> legal.ts        (legal)
  cli.ts -> history.ts -> apply.ts -> moves.ts -> position.ts   (position)

src/cli-options.ts  runtime closure = 1 module (itself). Both of its imports are `import type`.
                    Reaches none of the four.
```

**Ruling: `PERFT_DEEP` is IN SCOPE for this diff and I ran it rather than arguing it away.**

```
PERFT_DEEP=1 npx vitest run src/perft.test.ts
  32/32 passed, 37.7 s
  startpos   perft(5) = 4865609     kiwipete   perft(4) = 4085603
  position-3 perft(5) = 674624      position-3 perft(6) = 11030083
  position-4 perft(4) = 422333      position-4 perft(5) = 15833292
  position-5 perft(4) = 2103487     position-6 perft(4) = 3894594
```

All eight deep counts exact. **GREEN.**

**And the qualification, stated rather than left implied.** This run was confirmation, not discovery,
and could not have been anything else: I verified by **git blob SHA** that `src/moves.ts`, `src/legal.ts`,
`src/apply.ts` and `src/position.ts` are byte-identical between `main` and my HEAD. Unchanged code cannot
produce changed node counts. I ran it because *"reaches"* was the question asked, and 38 s once is
cheaper than an argument.

**Recommendation, not a rule I am imposing** (unchanged from my last gate, repeated because it now has a
second data point): for a future diff that adds modules *reaching* the engine while changing **zero
bytes** in the four, the blob comparison is cheaper and strictly stronger, and `PERFT_DEEP` may be
recorded not-indicated with that comparison as the evidence. Where any of the four changes, the byte
check fails and the deep suite is mandatory. **Owner of any standing rule: Architect/Design.**

## `N8-LANE` — a measurement, and explicitly NOT a verdict

**`G1` is escalated to the project owner. It is not mine to rule and I am not ruling it.** The formal
figure of record remains Security/NFR's `NOT MET at 2.00×`. What follows is one question that is
genuinely this hop's: **did `B1`'s instrument change move the lane?**

### Reading 1 — full lane, interleaved, and I am reporting it as the WEAKER of my two

7 rounds, condition order randomised inside each round, CPU = user + sys of the whole `npm test` child:

| condition | median CPU |
|---|---|
| **A** = the integrated tip | **10 610 ms** |
| **B** = the pre-`B1` instrument (`59ea767`'s `cli.test.ts`) in the same tree | **10 530 ms** |
| signal `A − B` | **+160 ms** (1.51% of A), sign **6/7** positive |
| identity null `A − A'` | **+40 ms** (0.38% of A), sign **6/7** positive |

**The null's sign is 6/7, not at chance.** That is the same ordering artefact that made me withdraw an
over-strong claim at the last gate, and by the catalog's own clause this reading is **corroborating, not
admissible**. I am not presenting +160 ms as a cost.

### Reading 2 — file-scoped, which actually isolates the treatment, and it disagrees

`B1`'s change lives entirely inside `src/cli.test.ts`. Measured there, 9 alternating rounds:

```
deltas (A − B), ms:  +20  −30  +10  −50  −50  −40  −50  −20  +110
median = −20 ms      sign 3/9 positive — AT CHANCE
```

**No measurable cost, sign at chance.** And the direct cost of the thing that grew — the near-miss
family itself — measured as pure resolver calls:

```
138-case family : 0.0062 ms per full pass   (138 calls)
old 18-case set : 0.0003 ms per full pass   ( 18 calls)
```

**6.2 microseconds against a 650 ms bar — 0.001% of it, five orders of magnitude down.**

### Reconciling my own two readings, because leaving both would invite a fourth re-measurement

The file-scoped reading is the one to believe: it measures where the change is, its null is at chance,
and it agrees with a direct micro-measurement of the added work. The full-lane +160 ms is an ordering
artefact of a 10.6 s measurement on a shared machine, not a cost of 138 pure function calls.

> **`B1` did not measurably move `N8-LANE`. It adds ZERO spawns — the count is pinned at ten and I
> proved the pin is now tamper-evident (`MS1`/`MS2`). `G1` is neither improved nor worsened by the
> integration, and the ticket stays HELD at the merge on it regardless of my result.**

The `B1` hop reported "+20 ms treatment, +20 ms null". My file-scoped reading is −20 ms with the sign at
chance; my full-lane reading is +160 ms against a +40 ms null. **All three agree on the conclusion and
differ inside the noise band.** I record the spread rather than picking the flattering number.

**`plans/nfr-catalog.md` and `ADR-0008` were not opened for writing. No target, bar, level or ratified
figure moved. I supply a number; the reading of the bar is Security/NFR's and the decision is the
owner's.**
