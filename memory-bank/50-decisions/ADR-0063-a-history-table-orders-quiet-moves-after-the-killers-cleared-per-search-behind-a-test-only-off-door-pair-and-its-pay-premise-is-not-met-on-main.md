---
kind: adr
id: ADR-0063
---
# ADR-0063: A history table orders the quiet moves after the killers. It is side × from × to, raised by d² on a quiet cutoff with a d² malus, bounded by gravity, cleared per search, in both recursions behind a test-only off-door pair. Its pay premise is not met on `main`

## Status

**PROPOSED 2026-11-02. PREMISE NOT MET ON `main`; THE BUILD DOES NOT START.** Recorded by Architect/Design (task
`arch-ABC-233`, records only, on `grugops/arch-ABC-233` from `main` `60b76b52`). The probe ran on a scratch copy of
`main`'s `src/` (tree `58fa3eb4`, `e72487e1`'s, futility in force), outside the repository, under the host lock. The
copy is deleted. Nothing was committed to `src/`. The patch, the driver and every output are under
`.grugops/context/arch-ABC-233/raw/probe/`.

- **The method.** The instrument, five forms, two gates, the choice rule, the bar rules and the verdict rule were
  sealed and committed before any measured run (decision `…4d5a0fe3`, commit `ec2ed472`).
- **The verdict, by that rule.** Every form passes the safety gate. **Every form misses the pay gate**: at depth 8,
  kiwipete reads 0.99–1.00× in `search()` and 0.97–1.00× in `chooseMove`, against ≤ 0.95× on all four readings. So
  this ADR records the design and its measurement, and **no form is tuned after the read.**
- **The intent, by the rule:** **NEUTRAL**. The reach gain is +0.089 ply for the design of record, below the +0.10
  that GAIN needs. NEUTRAL's deep bar is `A4` (a), and that is the bar it misses. So no C2′ read is owed.
- **"Accept ADR-0063" is not put to the owner.** It fails its own premise, as `ADR-0060` did.
- **`ABC-233` stays in Backlog at DoR 9/10.** Item 10 now reads "`ADR-0063`: premise not met on `main`", no longer
  "ADR". That edit is BA/PM's.
- **What re-opens it** is a new named premise with a new pre-registered probe:
  1. a P1 or P4 design that takes history as its input, measured jointly (decision 11);
  2. an ordering change that leaves more quiet cutoffs to history, such as O2c countermove or V3 staged generation;
  3. or an instrument that reads depth-gated pay (the 40/15 lane). The depth-10 diagnostic below does not support
     this one.
- **What it amends:** no ADR. It follows `ADR-0026` decision 10's pattern for the day it is built.

## Context

`ADR-0056` D2 row O1h: "history heuristic (+ malus), +20–50, M, low risk", Phase 3, first (D6). The Orchestrator
pulled it next (`orch-2026-10-30a` `…8ce2fd23`), because it is the named premise for re-opening P1 (`ADR-0060`
decision 11) and P4 (`ADR-0061` § Context). `ABC-233` asks for a from-to (or piece-to) table, raised on a quiet
cutoff by a depth-scaled amount, read after the killers, cleared every search, behind an off-door pair.

**The search it would order today** (`src/search.ts` `orderKey`, `src/engine.ts` `negamax`):
- the hash move first;
- then captures and promotions by MVV-LVA;
- then this ply's two killers (`KillerTable`: one per `search()`, and one per `chooseMove` call kept across its
  iterations);
- then every other quiet move in generation order.

Flat LMR reduces quiet moves at index ≥ 3 by one ply (`ABC-121`). Futility skips quiet moves at index ≥ 1 at
null-window nodes of depth 1–3 (`ADR-0061`). So the order of the quiet moves decides which ones are reduced and which
are skipped.

### The instrument

- **The base:** `main`'s `src/`. First `arch-post-268`'s `patch_post268.py`, unchanged, so the P1 diagnostic shares
  the tree. Then `patch_233.py`, which adds the history knobs in BOTH recursions. With `hh: 0`, the result is `main`,
  node for node.
- **The instrument check is exact.** The door reads `search()` d8 888 786 / 1 262 046 and `chooseMove` d8 1 306 981 /
  391 451 (kiwipete / position-6), with reach 5.837 at 47 000. Those are `ADR-0061` d9's counts. The door's
  zugzwang counts (905 900 at `.004`, 1 310 019 at `.005`) and its `G1` (54 / 58) equal them too.
- **The runs:** four batches, each `flock <host-test.lock> timeout 300`, with every job under `timeout 300`. They
  took 33 s, 21 s, 127 s and 58 s. Each run used a fixed depth, or `chooseMove` with `maxDepth` or `maxNodes` on a
  frozen clock. `G1` uses its virtual clock. No timing was read.
- **The forms.** Every form is cleared per search, keeps the killers above it, adds a d² bonus, and uses gravity at
  16 384.
  - **H1:** side × from × to, bonus + malus. The textbook form, listed first.
  - **H0:** from × to without side (the ticket's 64 × 64), bonus + malus.
  - **H2:** side × from × to, bonus only.
  - **H3:** piece × to, bonus + malus.
  - **H1nr:** H1 with the root unordered by history. A report.

### What the probe measured

Ratios are head / door at depth 8. Reach is the gain in mean completed depth at 47 000 nodes on the 190. Drift is at
depth 5 on the 190 (share within 25 cp; max). Mate is door d4 → head d5 / same depth d5, violations. The audit gives
flips, the largest error, and the count of errors of 100 cp or more.

| form | `search()` kiwi / pos-6 | `chooseMove` kiwi / pos-6 | reach | drift `search()` / `chooseMove` | mate | zugzwang | `G1` | audit |
|---|---|---|---|---|---|---|---|---|
| **H1 (design of record)** | **1.0011** / 0.7970 | **0.9751** / **0.9832** | +0.089 (21 deeper, 4 shallower, 18 moves differ) | 100 %, 25 / 99.47 %, 28 | 0 / 163; 0 / 189 | 7 / 7 | 56 / 58 (2 newly solved) | 84 of 42 364 (0.20 %); 40 cp; 0 |
| H0 | **1.0011** / 0.7970 | **0.9751** / **0.9832** | +0.089 | 100 %, 25 / 99.47 %, 28 | 0 / 163; 0 / 189 | 7 / 7 | 56 / 58 | 81 of 44 615 (0.18 %); 40 cp; 0 |
| H2 | **0.9901** / 0.8178 | **1.0047** / **0.9759** | +0.105 (19, 0, 17) | 100 %, 25 / 100 %, 25 | 0 / 163; 2 / 189 | 7 / 7 | 54 / 58 | 79 of 35 009 (0.23 %); 40 cp; 0 |
| H3 | **0.9988** / 0.7784 | **0.9746** / **0.9734** | +0.079 (19, 4, 14) | 100 %, 25 / 99.47 %, 28 | 0 / 163; 1 / 189 | 7 / 7 | 55 / 58 (1 newly solved) | 87 of 43 120 (0.20 %); 41 cp; 0 |
| H1nr | 1.0011 / 0.7970 | 0.9762 / 0.9670 | +0.089 (19, 3, 15) | — | — | — | — | — |

Bold marks a reading above the 0.95× pay gate. The root move and score at depth 8 are unchanged on all four
readings for H1.

- **Reports (H1).**
  - Depth 7 (the ticket's `A3` depth): `search()` 0.9497 / 0.8367, `chooseMove` 0.9769 / 0.9373.
  - Depth 8 on other roots (`search()` / `chooseMove`): position-4 0.971 / 0.999, position-5 0.805 / **1.051**,
    startpos 0.328 / 0.680.
  - Reach at 20 000 nodes: 4.842 → 4.868 (+0.026).
- **Firing at depth 6 on the 190 (`search()`, H1 / door).**
  - Nodes 0.945×.
  - History changes the move order at 82 % of full-width nodes.
  - 82.3 % / 81.9 % of cutoffs fall on the first move.
  - Quiet cutoffs: 112 689 / 124 674, with mean index 1.21 / 1.52. The killers hold 89.9 % / 89.7 % of them.
  - LMR reduces 219 958 / 226 739 of 1 399 466 / 1 538 525 non-first moves.
- **The table (A2's shape, H1).** After `search()` at depth 5, 17–91 cells are non-zero on each of the six roots.
  The next search starts at zero.
- **The cut audit** (information). The sample is every 10th null-window node at depth 6 where history changed the
  order. Each is re-searched fresh with the table snapshot taken at the mark, against the door at the same window and
  the door's full-window value. All flips are at depth 3–5 and are tens of centipawns. None is of 100 cp or more. For
  scale, `ADR-0061`'s bars are ≤ 0.5 % flips and 0 errors of 200 cp or more.

### Why the pay is small: the killers already did the work

- In the door, quiet moves cause 26 % of cutoffs (124 674 of 485 151), and the killers already hold 90 % of those.
  The hash move and MVV-LVA hold most of the rest at index 0.
- History only re-orders the remaining ~2.6 % of cutoffs and the order of non-cutting quiet moves. That still moves
  the mean quiet-cutoff index from 1.52 to 1.21. It also changes which moves LMR reduces and futility skips. So the
  table works, but on this search there is little left for it to win.
- The row's +20–50 comes from engines where history is the main quiet-move order. Here it is a third tier.
- Side indexing buys nothing measurable: H0 equals H1 to 35 nodes in 1 005 878.
- Bonus-only (H2) reaches furthest (+0.105), but it costs nodes: `chooseMove` kiwipete 1.005, position-4 `search()`
  1.128.
- Ordering the root by history (H1nr) changes nothing in `search()` and little in `chooseMove`.

### Diagnostics (added after the pay-gate miss; not pre-registered; they cannot change the verdict)

- **Depth 10:** H1 reads `search()` 0.9664 / 0.8206 and `chooseMove` 0.9680 / 0.9656; H2 reads 0.9698 / 0.7051 and
  1.0193 / 0.9569.
  - Three of four readings stay above 0.95. The trend from depth 8 to 10 is slight.
  - So a NEUTRAL re-cut with a deeper node bar is not supported.
- **`ADR-0060` decision 1 (R0, unchanged) over H1 as its door** (P1's premise from decision 11):

  | `ADR-0060` bar | on `main` (`arch-post-268`) | **over H1** |
  |---|---|---|
  | `A4` (a) d8 ≤ 0.85, four readings | 0.754 / 0.772 / 0.720 / **0.853** | 0.7505 / 0.7952 / 0.7166 / 0.7749: met |
  | `A4` (b) reach ≥ +0.25 | +0.384 | +0.348 (5.926 → 6.274; 64 deeper, 0 shallower): met |
  | `A3` drift `search()` ≤ 27 cp | **63** | 25 (100 % within 25): met; `chooseMove` max 11 |
  | mate floor d4 → d5 | 0 / 163 | 0 / 163: met |
  | zugzwang 7 / 7 | **6 / 7** (`.004`) | **5 / 7**: `zugzwang.001` plays e1e6 at d9, and `.004` plays g7f6 at d11 |

  - Against `main` as door, decision 1 plus H1 together read 0.7513 / 0.6338 / 0.6988 / 0.7619.
  - **What this says:** history removes two of P1's three misses, including the 63 cp line, and it makes the
    zugzwang miss worse. P1 stays parked (`ADR-0060` F3 is never a re-pin).
  - The textbook lever is decision 11's history term: less reduction for high-history moves. It is the next thing a
    P1 probe would try. That it restores the zugzwang rows is `UNKNOWN - verify`.

## Decision

The design of record is the one a re-open builds. It is not cleared to build on today's `main` (§ Status).

1. **The table.** One module-scope `Int32Array(2 × 64 × 64)` in `src/search.ts`, indexed by the moving piece's colour
   × from × to on 0–63 squares (`(sq & 7) | ((sq >> 4) << 3)` from 0x88). That is **32 768 bytes**. Both recursions
   share it, as they share `ORDER_KEYS` and the table. It holds data only, never a switch (`ADR-0026` decision 2).
2. **The update** happens at a beta cutoff in the main tree of both recursions, by a QUIET move: one that neither
   captures nor promotes.
   - Let b = d², with d the node's remaining depth.
   - The cutting move gets +b. Each quiet move searched before it at that node gets −b (the malus).
   - Each change is applied by gravity, h ← h + b − trunc(h · |b| / 16 384), which keeps |h| below 16 384 with no
     overflow and no clamp.
   - Nothing is updated in quiescence, at the root (the root never cuts), or on a null-move cutoff. A move that
     futility skipped was never searched, so it gets no malus.
3. **The lifetime: cleared per search** (`ABC-080` `A6`, the ticket's scope 2).
   - The table is zeroed at every `search()` entry and every `chooseMove` call, beside `clearTable()`.
   - It is kept across `chooseMove`'s iterations, which is the killers' lifetime.
   - There is no aging between iterations: gravity bounds it.
4. **The order, after the killers.** `orderKey`'s tiers become:
   - the hash move, 3 000 000;
   - captures and promotions, 1 000 000 + MVV-LVA;
   - killers, **500 000** + rank;
   - every other quiet move, its history value, which may be negative.
   - The insertion sort is stable, so equal values keep generation order. With history off the quiet key is 0, and
     the order is today's exactly (the killer offset moves no relative order).
   - The root is ordered by the same comparator. H1nr shows no reason to special-case it.
5. **One switch, `history`, in BOTH recursions** (`Switches`, `Heuristics`), on in `search()` and `chooseMove` only.
   With it off, nothing is read or written, and the search is the pre-ticket search, node for node.
6. **Two TEST-ONLY doors: `searchWithoutHistory(position, depth)` and `chooseMoveWithoutHistory(position, options)`.**
   - Every older door turns `history` off (`ADR-0026` decision 3's ladder). History is the top rung.
   - Rows re-point by `ADR-0050` decision 4, `ADR-0058` decision 5, `ADR-0059` decision 6 and `ADR-0061`
     decision 6. Value and behaviour rows stay on the shipped path. No zugzwang row's depth is re-pinned.
   - **Export lists:** `ABC-077` `A6` grows by **three**: the door, `historyByteLength()` (for `NFR-009` (a)'s byte
     sum) and `historyScore(move)` (a read-only probe for `A2`). `ABC-078` `A4` grows by **one**.
7. **The rows it adds (`A2`).**
   - After `search()` on 6 fixed roots, at least one cell is non-zero. On a second search the table starts at zero.
   - An update row: a constructed quiet cutoff gives +d² to the cutter and −d² to each earlier quiet move, with
     gravity at the bound.
   - An order row: a higher-history quiet move sorts before a lower one, and below both killers.
   - A source row: both `negamax` bodies update only on a quiet cutoff, and never for a skipped move.
8. **The bounded oracle (`A3`), derived by the PREREG's rules for H1.**
   - Drift at depth 5 on the 190 in both recursions, against the doors: ≥ 95 % within 25 cp, none beyond
     **42 cp** (⌊1.5 × 28⌋), and 0 mate sign changes.
   - Mate floor at the **same depth**, d5 → d5 on the 287: 0 of 189.
   - Zugzwang 7 / 7. `G1` ≥ 54 / 58, with no NEWLY-MISSED line.
   - The cut audit is information.
9. **`A4`, the premise.**
   - (a) d8 nodes, kiwipete and position-6, both recursions: **≤ 0.95×** on each of the four readings, which is
     min(0.95, ⌈max + 0.05⌉). (b) Reach is a report under NEUTRAL. (c) `G6` "≥ base".
   - **Measured: (a) is missed on three of four readings.** That is F4, and it is why the build does not start.
   - The instrument-check counts for a re-open on this `main`: head 889 792 / 1 005 878 / 1 274 487 / 384 890, and
     reach 5.837 → 5.926.
10. **The read (`A6`), by reference:** C2′, S′ at **E 1 810** (`--elo 1810`, `ADR-0056` amendment of this date), and
    the Levels deep lane.
    - The intent is **NEUTRAL** (≥ 43.0 of 100), named now. GAIN is closed to it: +0.089 ply at 47 000 is below
      +0.10.
    - A NEUTRAL change needs its own measured bar (C2′'s "C yes"). That bar is (a), so no read is owed while (a) is
      missed.
    - R-TC: the rule reads no budget, deadline or environment.
11. **This ticket only orders. LMR and futility change through the index, not by rule.**
    - Reordering changes which quiet moves land at index ≥ 3 (reduced) and index ≥ 1 (skipped by futility). That is
      measured above as drift and audit.
    - **A later P1 re-measure would add** `ADR-0060` decision 11's history term to the reduction predicate. For
      example: one ply less when h is above a threshold, one more when h < 0, with its own reach, drift and zugzwang
      readings. It would be measured with this table as its door or bundled into the same probe.
    - P4 (move-count pruning) would count moves in history order. Its ADR measures that over this table.
    - Neither is in `ABC-233`'s scope.

## What would falsify this

| # | clause | what would falsify it | how to check | if it fires |
|---|---|---|---|---|
| **F1** | 2, 4 — drift | a non-mate score beyond 42 cp, < 95 % within 25 cp, or a mate sign change, in either recursion | decision 8 | a defect first (the update or the key tiers). On an exact build: NOT MET |
| **F2** | 2, 4 — mates | a door mate at d5 on the 287 not a same-sign mate for the head at d5 | decision 8 | a defect |
| **F3** | 4 — zugzwang | any of `ADR-0050` d9's seven rows not played at its recorded depth | decision 8 | a defect. Never a re-pin |
| **F4** | the premise, it pays | `A4` (a) above 0.95× on any of the four readings | decision 9 | **fired on 2026-11-02, on `main` `e72487e1`** (H1: 1.0011, 0.9751, 0.9832). The build does not start |
| **F5** | the premise, strength | C2′ < 43.0 of 100, or an S′ collapse | decision 10 | not merged; this ADR reads "accepted, not in force" |
| **F6** | 3 — the lifetime | the table non-zero at a search's entry, or changed by a door | `A2`, `A1` | a defect (`ABC-080` `A6`) |
| **F7** | 5, 6 — the doors | a new door not node-equal to the pre-ticket search, or an older door not node-equal to itself, on the `ABC-078` `A3` corpus | `A1` (`G4`) | a defect in the switch wiring |
| **F8** | regression | `G1` below 54 / 58, or a NEWLY-MISSED line | `A5` | classed per row under `ADR-0034` |

## Alternatives

- **From × to without side (H0, the ticket's 16 KiB).** It measures equal to H1. Not taken, because side × from ×
  to is the standard index: a white move and a black move between the same squares are different moves. 16 KiB more
  is noise beside `NFR-009`'s 16 MiB table. A re-open may take H0 without a new ADR.
- **Bonus only (H2).** It reaches furthest, but it costs nodes on kiwipete `chooseMove` and on position-4. Without a
  malus, a move that never cuts keeps its rank. Rejected.
- **Piece × to (H3).** It is the smallest (3 KiB), and close to H1. Not taken: it is not better on any gate.
- **Aging between iterations (halve the table each iteration).** Not taken. Gravity bounds the values, and the
  ticket clears per search. It is a knob with no measured need.
- **History above the killers, or replacing them.** Rejected by the brief ("after killers") and by measurement: the
  killers hold 90 % of quiet cutoffs.
- **Carrying history across searches.** Rejected by `ABC-080` `A6`: nothing learned in one search is offered in the
  next.
- **Ship it anyway as an enabler, read by C2′ alone.** Rejected. It would ship an order change that misses its own
  pay bar, to serve a P1 or P4 design that is not written yet. A joint probe is the honest form (§ Status, re-open
  1).

## Consequences

- **NFRs.**
  - `NFR-009`: 32 768 bytes, fixed, summed by `historyByteLength()`. The ticket's "16 KiB" changes to 32 KiB (BA/PM).
  - `NFR-005`: `G6` reads it.
  - `NFR-008`: the table, update and order rows are default-lane units. Drift, mate, zugzwang and reach go behind the
    deep lanes.
  - No new NFR file. `plans/nfr-catalog.md` is untouched.
- **Determinism (`ADR-0027`):** the table is a function of the search path only. The same input and virtual clock
  give the same move.
- **Threads (`ADR-0062`, parked):** module state is per `worker_threads` isolate, so each worker would hold its own
  table. No interaction while threads are parked.
- **P1 / P4 coupling:** decision 11. **`ABC-234` (SEE) shares `orderMoves`:** one at a time (the ticket's own
  dependency).
- **Migration:** none.

## Rollback

- **Now:** nothing was built. To withdraw, mark this ADR `withdrawn` and strike the dated lines in `ADR-0056` D2.
- **After it ships (if re-opened):** set `history` to false in `search()` and `chooseMove`, two booleans. Removing
  the table, the switch, the doors and the re-points is then a mechanical revert of one ticket.
