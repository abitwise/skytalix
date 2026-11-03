---
kind: adr
id: ADR-0066
---
# ADR-0066: Aspiration windows at the root of `chooseMove` from iteration 5. The window is the previous score ± 100 cp; on a fail only the failed side widens, doubling to the full window past 400 cp; mate scores keep the full window; it sits behind a test-only off-door. Its pay premise is not met on `main`

## Status

**PROPOSED 2026-11-03. PREMISE NOT MET ON `main`; THE BUILD DOES NOT START.** Recorded by Architect/Design (task
`arch-ABC-236`, records only, on `grugops/arch-ABC-236` from `main` `70db0e7f`). The probe ran on a scratch copy of
`main`'s `src/` (tree `58fa3eb4`, the tree `ADR-0063` and `ADR-0065` measured, futility in force), outside the
repository, under the host lock, one job at a time. Nothing was committed to `src/`. The patch, the driver and every
output are under `.grugops/context/arch-ABC-236/raw/probe/`.

- **The method.** The instrument, four forms, two gates, the choice rule, the bar rules, the intent rule and the
  verdict rule were sealed and committed before any measured run (decision `…69cfcb4a`, commit `d5d360e1`).
- **The verdict, by that rule.** Every form passes the safety gate: zugzwang 7 / 7, `G1` 54 / 58, mate floor 0 of
  188 / 210 (every mate score exact), drift within its bars, and `A2` exact on the one row that qualified. **Every form
  misses the pay gate** of ≤ 0.95× `chooseMove` nodes at depth 8 on kiwipete and position-6. The closest form by the
  choice rule, A100, reads **0.9836** / **0.9913**. No form is tuned after the read.
- **Why it does not pay: the root is already PVS.** Every root move after the first is searched with a null window
  today, so a window can narrow only the first move's subtree and the root's re-searches. Even with almost no
  re-search (A100 re-searches 2.1 % of windowed iterations, with 0.9 % of nodes wasted), the saving is about 2 % at
  depth 7 over the 190 (0.9779). That ceiling comes from the structure, not from δ. A narrower δ (25, 50) gives back
  what it saves in re-searches.
- **It fires at 100 ms; it is not depth-gated.** At 47 000 nodes (the median 100 ms search) **70.4 % of all nodes**
  are spent inside aspiration passes, on 186 of 190 rows (51.3 % at 20 000). `ADR-0056` C2′ lists S1 among the
  depth-gated mechanisms that "barely fire" at 100 ms, and the "C yes" line names S1 as an example of a NEUTRAL
  candidate. Both are contradicted by this measurement. A re-open's intent is **GAIN**, and NEUTRAL
  "invisible at 100 ms" is closed to it. The `ADR-0056` lines are owed, not edited here.
- **"Accept ADR-0066" is not put to the owner.** It fails its own premise, as `ADR-0060`, `ADR-0063` and `ADR-0065`
  did.
- **`ABC-236` stays in Backlog.** DoR item 10 now reads "`ADR-0066`: premise not met on `main`" in place of "ADR".
  That edit is BA/PM's.
- **What re-opens it** is a new named premise with a new pre-registered probe:
  1. **T1 lands** (bound-aware table cutoffs; the combined attempt `ABC-257`). `ADR-0056` D2 made S1 depend on T1,
     and that dependency is the one mechanism here that could raise the ceiling. With the table cutting on bounds, a
     narrower root window turns into more cutoffs from stored bounds. Today the table cuts only at exact depth
     (`src/transposition.ts` `tableCutoff`). The ticket's instability clause returns with it. **Named, not expected.**
  2. **A deeper shipped search.** At depth 9 (a report) A50 reads 0.9448 on kiwipete but 0.9798 on position-6, and
     A100 reads 0.9546 / 0.9962. The gain grows a little with depth on one root and not on the other. A control that
     completes depth 10 or more could be re-read, but no such control is planned, and a read over 1 h is the owner's.
- **What it amends:** no ADR. It follows `ADR-0026` decision 10's pattern for the day it is built. The lines owed to
  `ADR-0056` (row S1, C2′'s depth-gated list and the "C yes" examples), `EPIC-011` and the `ABC-236` page are listed in
  the decisions note of `arch-ABC-236`, not edited here.

## Context

`ADR-0056` D2 row S1: "aspiration windows, +10–30, [J], M, low risk, depends on T1", Phase 3, last. The 2026-11-02
dated line (`arch-next-pull`) ranks it with P5 and O3s, "each estimated 0–15 Elo here". The owner asked for design one
ticket at a time: `ABC-234` (parked, `ADR-0065`), then `ABC-236`, then `ABC-239` (brief, 2026-11-03). `ABC-236` asks
for a root window of the previous score ± δ from depth 5, a stated widening rule ending in the full window, mate
scores and early iterations on the full window, and an `ADR-0026` d10 off-door. It is paid by ≤ 0.95× total nodes over
iterations 1–8 on kiwipete and position-6 (`A3`). T1's dependency was lifted on 2026-11-02 while T1 is not in force
(`bapm-phase1-pause`).

**The root today** (`src/engine.ts` `runIteration`): alpha = −∞, beta = +∞ every iteration. The first root move (the
previous iteration's best, from the table) gets the full window. Every later root move gets the null window at alpha,
LMR-reduced when eligible, and a full re-search with (alpha, +∞) only if it lands inside. The search is fail-soft
(`boundOf`), the table cuts only at exact depth, and it is always-replace. `search()` is one fixed-depth pass with no
previous score, so aspiration has nothing to act on there.

### The instrument

- **The base:** `main`'s `src/`, patched by `patch_236.py` in `src/engine.ts` only:
  - `runIteration(…, alpha0, beta0)` reports a fail. Once best ≥ beta0 the root loop stops, stores `BOUND_LOWER` with
    that move and reports a fail high. A best ≤ alpha0 after every move is a fail low, and nothing is stored, so the
    previous iteration's root entry and its hash move stay.
  - `aspirate` applies from iteration 5. A previous score at or beyond ±`MATE_FLOOR` (20 000) takes the full window.
    Otherwise the window is prev ± δ. On a fail, δ doubles and only the failed side moves, to the fail-soft score ∓ δ.
    A side becomes infinite once δ passes the cap (400) or the bound reaches ±`MATE_FLOOR`. The one-step variant sends
    the failed side straight to ±∞.
  - With the switch off it is `main`, node for node.
- **The instrument check is exact.** The door reads `chooseMove` d8 1 306 981 / 391 451 (kiwipete / position-6) and
  reach 5.837 at 47 000. Its zugzwang counts are 905 900 (`.004`) and 1 310 019 (`.005`), with 7 / 7, and its `G1` is
  54 / 58. All equal `ADR-0061` d9's and `ADR-0065`'s. The head's iterations 1–4 equal the door's on every row.
- **The runs:** three batches, each `flock <host-test.lock> timeout 3000`, with every job under `timeout 600`, **one
  job at a time**. There were 51 jobs, and every one exited 0. Each run used `chooseMove` with `maxDepth` or `maxNodes`
  on a frozen clock, and `G1` used its virtual clock. No timing was read.
- **The forms** (all from iteration 5, all with the mate guard):
  - **A25:** δ0 = 25, doubling, cap 400.
  - **A50:** δ0 = 50, doubling, cap 400.
  - **A100:** δ0 = 100, doubling, cap 400.
  - **A50F:** δ0 = 50, one step.

### The premise on `main`, by form

The pay gate is `chooseMove` at maxDepth 8, head / door. Rates are at maxDepth 7 over the 190, per windowed iteration
(561 windowed, 9 mate-guarded). Reach is the gain in mean completed depth at 47 000 nodes on the 190.

| form | d8 kiwi / pos-6 | d8 six roots pooled | d7 over the 190 | fail low / high per windowed iter | iters re-searched | nodes wasted in failed passes | reach at 47 000 |
|---|---|---|---|---|---|---|---|
| A25 | **0.9985** / **0.9619** | 1.0130 | 1.0201 | 9.6 % / 33.3 % | 37.6 % | 14.5 % | −0.016 (6 deeper, 9 shallower) |
| A50 | **0.9950** / **0.9632** | 0.9867 | 0.9887 | 2.1 % / 12.1 % | 14.1 % | 5.7 % | +0.016 (4, 1) |
| **A100 (design of record)** | **0.9836** / **0.9913** | 0.9884 | 0.9779 | 0.2 % / 2.0 % | 2.1 % | 0.9 % | +0.005 (1, 0) |
| A50F | **0.9976** / **0.9632** | 0.9882 | 1.0018 | 2.0 % / 12.1 % | 14.1 % | 5.6 % | +0.016 (4, 1) |

Bold marks a reading above the 0.95× pay gate. The root move and score at depth 8 are unchanged on all six roots for
every form.

- **Other roots at d8** (A100): startpos 0.9978, position-3 0.9991, position-4 0.9995, position-5 0.9995. A50 reads
  0.9627 on startpos and 0.9642 on position-3, and A25 reads 1.2306 on startpos and 1.1682 on position-5, where it
  fails and re-searches.
- **No fail high was ever followed by a fail low** on the same iteration (flips 0 in every run). Most re-searches are
  fail highs (the side to move finds more than it expected). The most passes any iteration took was five (A25,
  `zugzwang.004` at d11); A100 never took more than two.
- **The score swings that set δ** (door, |s_d − s_{d−1}|, non-mate, over the 190):

  | iteration | p50 | p75 | p90 | p95 | > 50 cp | > 100 cp |
  |---|---|---|---|---|---|---|
  | 5 | 16 | 40 | 63 | 82 | 36 of 187 | 5 |
  | 6 | 19 | 42 | 67 | 92 | 30 | 7 |
  | 7 | 8 | 26 | 42 | 50 | 9 | 0 |

  So δ = 100 sits above p95 at iterations 5 and 6 and rarely fails, and δ = 25 sits near p60 and fails often.
- **The value and the move survive a re-search.** Per iteration ≥ 5 over the 190 at d7, A50's head equals the door
  on 559 of 570 scores and 567 of 570 moves. On its 79 re-searched iterations it equals the door on 77 scores and all
  79 moves. The largest difference is 54 cp (position-5/d1d2 at d6, 187 → 241), seen in A25, A50 and A50F after a
  fail high: a re-search through table bounds left by the failed pass. A100 differs from the door on one score of 570,
  by 5 cp. Mate iterations equal the door on 9 of 9.
- **Reports:** at depth 7, A100 reads 0.9904 / 0.9837; at depth 9 it reads 0.9546 / 0.9962, and A50 reads 0.9448 /
  0.9798. Reach at 20 000 is 4.842 → 4.842 (A100), 4.826 (A50), 4.784 (A25).

### Why the pay is small: PVS at the root already does most of aspiration's work

- Aspiration saves work only where a node's window matters. Under PVS, every non-PV node already gets a null window,
  and every root move after the first is searched with one. What is left for a root window is the leftmost path and
  the PV nodes (searched with −∞ today), plus the root's full-window re-searches. That is a small share of the tree.
- The no-fail ceiling shows it. Position-4 never fails under any form and reads 0.998 to 0.9995. Position-6 under A100 never
  fails and reads 0.991. Over the 190 at d7, A100 wastes 0.9 % and still saves only 2.2 %.
- A narrower δ cannot lift the ceiling; it only adds re-searches. A25's fail highs (on a third of windowed iterations) cost more than they save
  (1.02× at d7, 1.23× on startpos at d8).
- It is the same lesson as `ADR-0063` and `ADR-0065`. On this search the table, PVS and the killers already order and
  bound most of the tree, and a third-tier refinement has little left to win.

## Decision

The design of record is the one a re-open builds. It is not cleared to build on today's `main` (§ Status). A100 is the
design of record by the pre-registered choice rule applied as a ranking. Its reach is within 0.02 ply of the best form
(+0.005 against +0.016), and the larger of its two d8 ratios is the lowest (0.9913, against A50's 0.9950). A re-open
re-measures it under its own PREREG.

1. **The window.** From iteration 5, the root window is (prev − 100, prev + 100), where prev is the previous completed
   iteration's score. Iterations 1–4 keep the full window (the ticket's scope 2).
2. **The mate guard.** If |prev| ≥ `MATE_FLOOR` (20 000), the iteration takes the full window. A widened bound at or
   beyond ±`MATE_FLOOR` becomes ±∞. Measured: mate scores at d5 and d6 equal the door's exactly on every mate in the 287
   (188 and 210).
3. **The widening rule.** On a fail, δ doubles, and only the failed side moves, to the fail-soft score ∓ δ. A side
   whose δ passes 400 becomes infinite, so δ runs 100 → 200 → 400 → ∞. A fail on the other side after a fail (the
   ticket's fail-high-then-fail-low case) takes the same rule. Termination: δ doubles on every fail, so at most four
   fails are possible before both sides are infinite, and a full window cannot fail. Measured flips: 0.
4. **The root on a fail.**
   - A fail high stops the root loop at once and stores `BOUND_LOWER` with the move that failed high, so the re-search
     tries it first.
   - A fail low stores nothing at the root, so the previous iteration's entry and its hash move stay.
   - Only an exact result stores `BOUND_EXACT`, as today.
5. **The clock.** No new clock read. The abort stays at the node (`countNode`), so an abort inside any pass aborts the
   iteration, and `best` and `reached` stay the previous completed iteration's (`ABC-078` `A3` unchanged). A re-search
   near the deadline obeys the existing check (`NFR-004`; `G5` reads it).
6. **One switch, `aspiration`, in `chooseMove`'s `Heuristics` only.** It is on in `chooseMove` and off in every older
   door (`ADR-0026` decision 3's ladder). `search()` has no previous score, so it gets no switch and no door. The
   ticket's "off-door pair" is therefore one door.
7. **One TEST-ONLY door: `chooseMoveWithoutAspiration(position, options)`.** It is the pre-ticket `chooseMove`, node
   for node.
   - Rows re-point by `ADR-0050` decision 4, `ADR-0058` decision 5, `ADR-0059` decision 6 and `ADR-0061` decision 6.
     Value and behaviour rows stay on the shipped path. No zugzwang row's depth is re-pinned.
   - **Export lists:** `ABC-078` `A4` grows by one. `ABC-077` `A6` is unchanged (`search.ts` is untouched).
8. **The file list.** `src/engine.ts` (`runIteration` takes a window and reports a fail; `aspirate`; the switch; the
   door; the header line at `:105`, "aspiration windows … none requested"). Test rows go in `src/engine.test.ts` or a
   new `src/engine.aspiration.test.ts`. No other `src/` file changes.
9. **The rows it adds.**
   - The door (`A1`): node-equal, cross-build, on the `ABC-078` `A3` corpus (`G4`).
   - A unit row on the widening rule: a stubbed sequence of fails gives the windows (p ± 100) → (s − 200, p + 100) →
     (s' − 400, …) → −∞, and terminates in at most five passes.
   - A mate row: a forced mate found first at iteration 5 or later keeps its exact score against the door.
   - A source row: the window is read only when the switch is on and the iteration is 5 or later.
   - **`A2`, re-worded:** only 1 of 535 positions in the corpus, `G1` and the mate corpus moves ≥ 200 cp from depth 5
     to depth 6. So the ticket's six-position fixture cannot be drawn from the committed corpora. A build takes them
     from self-play positions (`tools/rating`), or relaxes the jump to more than 100 cp (7 rows at d6 over the 190). That is
     BA/PM's to choose. The bar stays exact equality, as measured on the one row.
10. **The bounded oracle, derived by the PREREG's rules for A100.**
    - Drift at maxDepth 5 and 6 on the 190 in `chooseMove`, against the door: ≥ 95 % within 25 cp, **none beyond
      25 cp** (max(25, ⌊1.5 × 0⌋); A100 read 0 cp at both depths), and 0 mate sign changes.
    - Mate floor at the same depth, d5 and d6 on the 287: 0 violations.
    - Zugzwang 7 / 7. `G1` ≥ 54 / 58, with no NEWLY-MISSED line.
11. **`A3`, the premise.** `chooseMove` d8 nodes, kiwipete and position-6: **≤ 0.95×** on both (min(0.95, ⌈100 ·
    (0.9913 + 0.05)⌉ / 100) = 0.95; the ticket's bar, unchanged).
    - **Measured: missed on both** (0.9836 / 0.9913). That is F4, and it is why the build does not start.
    - `G6` "≥ base" (`NFR-005`) is a build's gate.
12. **The read, by reference:** C2′, S′ at **E 1 810** (`--elo 1810`), and the Levels deep lane. **The intent is
    GAIN** (≥ 50.0 of 100). It fires at 100 ms (70.4 % of nodes inside aspiration passes at 47 000, against the
    pre-registered 10 % line), so "NEUTRAL (invisible at 100 ms)" is closed to it. Its reach gain (+0.005) is below
    +0.10, so reach is a report, not a bar. R-TC: the rule reads no budget, deadline or environment.

## What would falsify this

| # | clause | what would falsify it | how to check | if it fires |
|---|---|---|---|---|
| **F1** | 10 — drift | a non-mate score beyond 25 cp, < 95 % within 25 cp, or a mate sign change, at maxDepth 5 or 6 | decision 10 | a defect first (the window or the root store). On an exact build: NOT MET |
| **F2** | 2 — mates | a door mate at d5 or d6 on the 287 not the same mate for the head | decision 10 | a defect in the mate guard |
| **F3** | 10 — zugzwang | any of `ADR-0050` d9's seven rows not played at its recorded depth | decision 10 | a defect. Never a re-pin |
| **F4** | the premise, it pays | `A3` above 0.95× on kiwipete or position-6 | decision 11 | **fired on 2026-11-03, on `main` `70db0e7f`** (src `58fa3eb4`) (A100: 0.9836, 0.9913; every form misses). The build does not start |
| **F5** | the premise, strength | C2′ < 50.0 of 100, or an S′ collapse | decision 12 | not merged; this ADR reads "accepted, not in force" |
| **F6** | 3 — termination | an iteration taking more than five passes, or a fail on an infinite side | the widening row | a defect in the widening rule |
| **F7** | 6, 7 — the door | the door not node-equal to the pre-ticket `chooseMove`, or an older door not node-equal to itself, on the `ABC-078` `A3` corpus | `A1` (`G4`) | a defect in the switch wiring |
| **F8** | 2, 3 — re-search | an `A2` row whose head score differs from the door's | `A2` | a defect, or table instability through bounds the failed pass left. The Architect rules before any re-pin |
| **F9** | regression | `G1` below 54 / 58, or a NEWLY-MISSED line | decision 10 | classed per row under `ADR-0034` |

## Alternatives

- **A25 or A50, a narrower window.** Measured: δ = 25 re-searches 37.6 % of windowed iterations and costs 1.02× at d7
  (1.23× on startpos). δ = 50 re-searches 14.1 % and reads 0.9950 / 0.9632. Neither reaches the gate. Rejected as the design
  of record by the choice rule.
- **A50F, the one-step rule (a fail goes straight to the full window).** Measured: the same fail rate as A50 and
  slightly more nodes (0.9976 on kiwipete). Rejected. A doubling step keeps the re-search bounded.
- **A window that tracks the score swing** (δ from a running average of |s_d − s_{d−1}|, as some engines do). Not
  measured. The no-fail ceiling (about 2 % at d7) bounds every δ rule, so tuning δ cannot reach 0.95×.
- **Aspiration below the root, or PVS changes.** Out of the ticket's scope (`ADR-0026` holds).
- **Start from iteration 3.** Not measured, and not the ticket's. Iterations 3 and 4 hold under 10 % of the nodes at
  depth 8 (door: 1 262 086 of 1 306 981 kiwipete nodes are in iterations 5–8), so starting earlier cannot move the d8
  gate.
- **Ship it anyway on C2′ alone.** Rejected. It would ship a value change that misses its own pay bar, and C2′ cannot
  see a 1–2 % node saving.

## Consequences

- **NFRs.**
  - `NFR-004`: no new clock read (decision 5). `G5` reads it at build.
  - `NFR-005`: `G6` reads it. The per-node cost is zero; the per-iteration cost is the re-searches.
  - `NFR-009`: no allocation; a few numbers on the stack per iteration.
  - `NFR-008`: the widening and mate rows are default-lane units. Drift, mate, zugzwang and `A3` go behind the deep
    lanes.
  - No new NFR file. `plans/nfr-catalog.md` is untouched.
- **Determinism (`ADR-0027`):** the window is a pure function of the previous completed iteration's score. The same
  input and virtual clock give the same move.
- **E1 (`ABC-269`, in flight)** changes `evaluate.ts` and `evaluate-params.ts` only. This ADR touches neither and does
  not depend on it.
  - **Can E1's taper change the window width?** Yes, in principle. δ is set by the iteration-to-iteration score swings
    (p90 63–67 cp at iterations 5–6 on `main`). E1 gives the king square and passed pawns endgame halves, so it can
    widen the swings in endgames. The kpk zugzwang rows already re-search 3 or 4 times per search under A25.
  - **It cannot change the verdict.** The ceiling comes from PVS at the root, not from the evaluation: with almost no
    re-search, A100 saves about 2 %. A re-open after E1 re-reads the swing quantiles on that `main` and re-derives δ;
    E1 alone is not a re-open condition.
- **`ABC-230` shares `src/engine.ts`.** If both are ever built, they go one at a time.
- **T1 (`ABC-238` / `ABC-257`)** is the named re-open. If it lands, this ADR's instability clause (decision 3) is
  re-read under bound-aware cutoffs.
- **Migration:** none.

## Rollback

- **Now:** nothing was built. To withdraw, mark this ADR `withdrawn`.
- **After it ships (if re-opened):** set `aspiration` to false in `chooseMove`, one boolean. Removing the window, the
  switch, the door and the re-points is then a mechanical revert of one ticket.
