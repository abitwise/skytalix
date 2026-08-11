---
id: 20260812T124500Z-security-nfr-observation-a12-and-replay-6b21d4f7
kind: observation
by: security-nfr
at: 2026-08-12T12:45:00Z
verified_by:
confidence: high
refs:
  - security-nfr-ABC-017
  - ABC-017
  - NFR-002
  - plans/nfr-catalog.md
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - src/history-pane.ts
supersedes:
---

# `A12`'s three parts on DELIVERED code — all MET. And the replay coefficient, where two instrument families DISAGREE.

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp. **Apple M3 (Mac15,13), 8 logical cores, Node v24.12.0, Darwin 25.5.0 arm64;
> `UNKNOWN - verify` on any other hardware.**

## Part 1 — pane compute ≤ 150 µs at 40 / 120 / 300 plies. **MET.**

Re-derived on this gate's own harness, two fully independent samples. Builder is `ABC-012`'s
deterministic pseudo-random game, exactly as `## Test notes` mandates.

| plies | sample 1 | sample 2 | of the 150 µs bar | verdict |
|---|---|---|---|---|
| 40 | 38.97 µs | 39.33 µs | **0.260x / 0.262x** | MET |
| 120 | 67.12 µs | 67.56 µs | **0.447x / 0.450x** | MET |
| 300 | 72.93 µs | 74.05 µs | **0.486x / 0.494x** | MET |
| 378 (the builder's true end) | 74.12 µs | 74.90 µs | 0.494x / 0.499x | MET |
| 2,000 (knight shuffle) | 61.92 µs | 62.73 µs | 0.413x / 0.418x | MET |

**The Engineer's `0.257x / 0.448x / 0.480x` is REPRODUCED, not inherited** — this gate's two
samples bracket or sit within ~1.3% of all three. The two samples agree with each other to 1.5%.

Worth one line, because the ticket's part 2 turns on it: **the 2,000-ply shuffle is CHEAPER than the
300-ply deterministic game** (62 µs against 73 µs). Cost tracks the cost of `legalMoves` in the
positions the window happens to contain, not game length — which is the ticket's own measured
reason for moving the bar from 2x to 3x, independently confirmed here.

## Part 2 — the three within 3x. **MET.**

**1.871x (sample 1) / 1.883x (sample 2)** against the 3x bar. The ticket's 1.845x reproduces to
within 2%. `ABC-016` carries 3x for the identically shaped bar; the two panes of one frame agree.

## Part 3 — `A11`'s spied call counts. **MET, on this gate's OWN instrument.**

Not a re-run of the delivered test. A `node:module` load hook rewrote delivered `fen.ts` / `san.ts`
/ `apply.ts` in memory to wrap the real functions with counters. Arming control: one 40-ply render
moves all three counters (`parseFen` 1, `toSan` 16, `makeMove` 309).

| case | `parseFen` | `toSan` | rendered plies | rows | verdict |
|---|---|---|---|---|---|
| 0 plies | 1 | 0 | 0 | 8 | ok |
| 1 ply | 1 | 1 | 1 | 8 | ok |
| 3 plies | 1 | 3 | 3 | 8 | ok |
| 19 plies | 1 | 15 | 15 | 8 | ok |
| 40 / 120 / 300 / 2,000 | 1 | 16 | 16 | 8 | ok |

`parseFen` **≤ 1 at every length including 0 plies**; `toSan` **exactly once per rendered ply and
never above `2 × HISTORY_ROWS` = 16**; **`toSan` arity is exactly 2 on every call**, so no legal
list is passed (`src/san.ts:19-22`'s contract). Rows are 8 everywhere.

**The six zero-count clauses are proven STRUCTURALLY rather than by spy** — see the importer note:
`gameStatusOf`, `repetitionCounts`, `keyHistory`, `takeBack` and `playMove` all live in
`src/history.ts`, and `gameStatus` in `src/gameend.ts`; **neither module is in the pane's runtime
closure at all**, so none of them can be called. A module that is never loaded cannot be invoked —
that is a stronger guarantee than a count of zero.

**An instrument error of my own, corrected before reporting.** My first counter also asserted
`makeMove === history.moves.length` and reported a FALSE MISS on 7 of 8 cases. `A11` makes no such
claim, and the identity is simply false: `legalMoves` calls `makeMove` internally to test legality
and `toSan` calls `legalMoves`, so at 2,000 plies `makeMove` reads 2,352. The clause was mine, not
the ticket's; it is withdrawn and `makeMove` is reported as a diagnostic only.

## The replay coefficient — the figure the ticket says the reader is owed

The ticket is right that `O(window)` is an approximation and that the replay term is `O(plies)`.
**Measured on delivered code, and the two instrument families do not agree.** I report the band
rather than smoothing it into one number.

| instrument family | intercept | **slope** | R² |
|---|---|---|---|
| **A — total-render regression**, window content held constant (knight shuffle), 40…4,000 plies | 43.95 / 43.96 µs | **4.86 / 4.92 ns/ply** | 0.99960 / 0.99933 |
| **B — replay-loop isolation** (`parseFen` + N `makeMove`, differenced), same fixture | 1.93 / 1.83 µs | **6.93 / 6.98 ns/ply** | 0.99961 / 0.99963 |

**Each family's INTERCEPT reproduces across roles; the SLOPES do not.** BA/PM recorded
`1.56 µs + 7.42 ns/ply` — an intercept of family B's shape, and its slope is **6.6% above** my
family-B figure. The Engineer recorded `46.45 µs + 6.58 ns/ply` — an intercept of family A's shape,
and its slope is **26% above** my family-A figure. So the recorded 7.42 is reproducible in kind,
and the disagreement is between the two ways of asking the question, not between roles.

**I cannot attribute the 4.9-vs-6.9 gap and I do not claim a point estimate.** Family B's own
`parseFen`-alone baseline reads 2.105 µs against a 4,000-ply shuffle fixture and 1.577 µs against
the deterministic one — a 33% swing on parsing the *identical* string — so differencing against
that baseline is the weaker of the two. Family A measures the delivered pane's actual marginal cost
per ply of history, which is the quantity the reader is owed, so **if one figure is quoted it should
be family A's 4.86–4.92 ns/ply**, with the band named.

**The band, and what it means, hold on every figure in it:**

- At 300 plies the replay term is **1.5–2.1 µs — about 2–3% of the pane's ~73 µs.** The SAN term
  dominates completely, which is why labelling the pane `O(window)` is a good approximation and why
  the ticket's ruling is unaffected.
- The replay term **alone** would not reach the 150 µs bar until **~21,600–30,900 plies**. No legal
  game reaches that; `ABC-020`'s automatic draws bound it far below.
- Replay is **linear, not flat** — R² ≥ 0.999 in both families, confirming the ticket's correction
  to the word "flat" independently.

**`plans/nfr-catalog.md` is NOT edited by this gate.** The ticket says the coefficient is owed *at
this gate* and that the catalog is not owed anything before delivered-code measurement; the
measurement now exists and the row's update is a separate, deliberate act with its own owner. I
record it here with its machine and its instrument disagreement so whoever writes that row writes a
band and not a false point estimate.

## What did NOT move

No target, bar, level or `UNKNOWN - verify` marker was touched anywhere. `NFR-002`'s `< 16 ms`
target is untouched; the 150 µs pane bar is untouched; the 3x is untouched. `N8-LANE` was not
re-derived — the ticket forbids it and this gate added zero test files.
