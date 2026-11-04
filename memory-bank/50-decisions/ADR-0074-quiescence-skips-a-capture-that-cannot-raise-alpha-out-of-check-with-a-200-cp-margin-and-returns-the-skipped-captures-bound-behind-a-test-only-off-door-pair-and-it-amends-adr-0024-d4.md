---
kind: adr
id: ADR-0074
---
# ADR-0074: Quiescence skips a capture that cannot raise alpha, out of check, with a 200 cp margin, and returns the skipped capture's bound; it sits behind a test-only off-door pair, and it amends `ADR-0024` d4

## Status

**PROPOSED 2026-11-04. PREMISE MET ON `main`. The owner accepts it; until then `ADR-0024` d4 stands as written.** Recorded
by Architect/Design (task `arch-ABC-289`, records only, on `grugops/arch-ABC-289` from `main` `0cc9afd1`). The probe ran on
a scratch copy of `main`'s `src/`, outside the repository, under the host lock, one job at a time. Nothing was committed to
`src/`. The patch, the driver and every output are under `.grugops/context/arch-ABC-289/raw/probe/`.

- **Who accepts.** The owner. This is a new ADR, and it amends `ADR-0024`, which he accepted
  (`memory-bank/45-standing-rulings.md`, 2026-10-22). His `Q-3K-10` yes (`orch-2026-10-30a` `…7de79e90`) opened d4 **for
  design**. `ABC-289` records reading (b): the build may start on PROPOSED, and the merge waits on his acceptance.
- **The method.** The instrument, six forms, the premise reading, two gates, the choice rule, the bar rules and the verdict
  rule were sealed and committed before any measured run (decision `…174760a3`, commit `9e07dae4`).
- **The verdict, by that rule:** every form passes the pay gate. **Only D200b passes the safety gate, so D200b is chosen.**
  The other five fail on drift, and D300 also fails `G1`.
- **D200b, measured against `main`:**
  - d8 nodes **0.6362 / 0.8263** in `search()` and **0.6484 / 0.8201** in `chooseMove` (kiwipete / position-6). The gate
    was ≤ 0.95× on each of the four.
  - Reach at 47 000 nodes: **6.868 → 7.147 (+0.279 ply)**, with 54 rows deeper and 2 shallower.
  - Safety: drift 100 % / 100 % within 25 cp, max 12 / 20 cp, 0 sign changes. Mate floor 0 of 191 and 0 of 189 at the same
    depth. Zugzwang 7 / 7. `G1` 54 / 58, none newly missed.
- **The finding that decides this ADR: what a skip returns matters more than the margin.** D200 and D200b skip by the same
  test and differ only in the value the node returns. D200 reads a 192 cp drift; D200b reads 12 cp. See § Context.
- **What it amends:** `ADR-0024` d4. Delta pruning leaves its out-of-scope list, as decision 9 states. Quiet checks stay.
  No other ADR moves. Lines owed elsewhere are listed in this task's decision note, and none is edited here.
- **Intent: GAIN.** The pay is read at the 100 ms node budget, and the rule fires there (decision 13).

### The nine items `ADR-0024` § Status, the fourth block, asks for

| # | item | where |
|---|---|---|
| 1 | PREREG, sealed and committed before any measured run | above; § The instrument |
| 2 | the premise, read on `main` with Q1 in it | § The premise on `main` |
| 3 | an exact instrument check | § The instrument; decision 12 |
| 4 | the pay gate | § What the probe measured; decision 12 |
| 5 | the safety gate | § What the probe measured; decision 11 |
| 6 | the rule's terms | decisions 1–5 |
| 7 | the seam | decisions 6–8 |
| 8 | the bars and the read | decisions 11–13 |
| 9 | the d4 amendment | decision 9 |

## Context

`ADR-0056` D2 row Q2 reads "delta pruning in quiescence, +5–20, `ADR-0024` (1.5× trim measured), S, low". That 1.5× came
from a reimplementation on 2026-09-19, before futility, the taper and Q1, so `ADR-0024` § Status says it is not a premise.
The open question was plain: with `seePruning` already skipping losing captures, is anything left for delta to trim?

**Quiescence today** (`src/quiescence.ts`): out of check the node stands pat and sorts its captures and quiet queen
promotions by MVV-LVA (`ADR-0024` d2). In the loop it skips a capture `isLosingCapture` names (`ADR-0069`). In check it
searches every evasion (`ADR-0053`). The cap is 8 plies (d5). Its header lists delta pruning under "Not here".

### The premise on `main`

Read on the door (the rule off, so the tree is `main`'s): `search()` at depth 6 over the 190.

Quiescence is **86.59 %** of all nodes (4 735 926 of 5 469 355). Of 4 563 246 captures reached out of check, `seePruning`
skips 1 834 596 and 2 728 650 are searched.

| margin | delta-only (the rule would skip, `seePruning` does not) | share of captures searched | refuted | raised alpha | of those, gave check | of those, mates | largest non-mate raise | q-nodes under them (overstated) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 300 | 926 160 | **33.94 %** | **99.67 %** | 3 074 | 3 074 | 355 | 1 027 cp | 27.70 % |
| 200 | 1 193 138 | **43.73 %** | **99.52 %** | 5 764 | 5 721 | 485 | 1 128 cp | 36.38 % |
| 100 | 1 466 651 | **53.75 %** | **99.12 %** | 12 950 | 9 497 | 582 | 1 142 cp | 46.59 % |

- **SEE does not already do this.** Of the candidates at margin 200, 843 051 are ones `seePruning` skips, and 1 193 138
  are not. A capture that wins its exchange can still leave the side far below alpha.
- **What the rule gets wrong is nearly all checks.** At margin 200, 99.25 % of the captures that raised alpha gave check.
  At margin 300 it is every one. Only 5.74 % of delta-only captures give check at all. Decision 5 weighs this.
- **The trim, against `ADR-0024`'s 1.5×:** D200b reads 1.21× to 1.57× at d8 and 1.37× at depth 6. So the old figure's size
  survives Q1, though it was not a measurement of this.

### The instrument

- **The base:** `git archive 0cc9afd1 src package.json`, patched by `patch_q2.py`, with scratch knobs in `quiescence.ts`.
  The rule sits in `quiesce`'s loop behind `skipLosing`, before `isLosingCapture`. With the knob off it is `main`.
- **`main` moved during this hop.** Its tip passed `0cc9afd1` with `ABC-302` and records. `git diff --name-only` over
  `src tools package.json`, less `*.test.ts`, is empty, so every production line measured here is still `main`'s.
- **The instrument check is exact, on every count the PREREG named:**

  | | kiwipete `search()` / `chooseMove` | position-6 `search()` / `chooseMove` |
  |---|---|---|
  | knob off = `main` | 523 847 / 707 548 | 234 214 / 101 425 |
  | `searchWithoutBundle` / `chooseMoveWithoutBundle`, knob off | 605 117 / 766 275 | 406 787 / 87 475 |
  | `ABC-279`'s door pair, knob **off** | 839 514 / 1 296 788 | 1 533 901 / 404 930 |
  | `ABC-279`'s door pair, knob **on** | 839 514 / 1 296 788 | 1 533 901 / 404 930 |

  Door zugzwang is 7 / 7 and door `G1` is 54 / 58. Reach on `main` at 47 000 is 6.868.
- **The runs:** three batches, each `flock <host-test.lock> timeout 1800`, every job under `timeout 600`, one at a time.
  62 jobs, every exit 0, 7 min 14 s under the lock. Fixed depth, or `chooseMove` with `maxDepth` / `maxNodes` on a frozen
  clock; `G1` on its virtual clock. No timing was read and no game was played.
- **Three reading notes:**
  - The door's mate counts are 191 (`search()`) and 189 (`chooseMove`), against `ABC-283`'s 190 and 188. Those were read
    against `searchWithoutBundle`; the door here is `main` itself, which holds one more mate in each.
  - The reports ran for D200b alone, as the PREREG says: reports are for forms that pass both gates.
  - **The SEE-call ratio is not a clean reading.** The `fire` counter itself calls `isLosingCapture` on skipped moves, so
    its 0.9448× overstates. Removing the 759 440 such calls known to reach `see` gives an upper bound of **≤ 0.748×** at
    depth 6. The exact figure is `UNKNOWN - verify`.
- **The forms.** All test a capture that does not promote, before `isLosingCapture`, with the loop's current alpha:
  - **D300, D200, D100:** margin 300, 200, 100; the node keeps the stand pat as its floor.
  - **D200c:** D200, but a capture that gives check is never skipped.
  - **D200e:** D200, but the rule is off at a node of phase ≤ 6 (maximum 24).
  - **D200b:** D200, but a skip raises `best` to `standPat + victim + margin`.

### What the probe measured

d8 ratios are head / `main`. Reach is the mean completed depth at 47 000 nodes on the 190, with rows deeper, shallower and
moves changed. Drift is at depth 5 on the 190 against the door: share within 25 cp, then the maximum. Mate is door d5 →
head d5, violations. A cell in bold misses its gate.

| form | `search()` kiwi / pos-6 | `chooseMove` kiwi / pos-6 | reach | drift `search()` | drift `chooseMove` | mate | zugzwang | `G1` | gates |
|---|---|---|---|---|---|---|---|---|---|
| D300 | 0.6954 / 0.9375 | 0.7032 / 0.8505 | +0.211 (40, 1; 6) | 98.40 %, **192** | 100 %, 0 | 0 / 0 | 7 / 7 | **53 / 58, 1 new** | pay yes, safety **no** |
| D200 | 0.6354 / 0.8863 | 0.6443 / 0.8267 | +0.274 (50, 0; 6) | 96.79 %, **192** | 98.93 %, 132 | 0 / 0 | 7 / 7 | 54 / 58 | pay yes, safety **no** |
| D100 | 0.4516 / 0.8116 | 0.5264 / 0.7730 | +0.369 (65, 2; 13) | **87.70 %, 226** | 95.19 %, 94 | 0 / 0 | 7 / 7 | 54 / 58 | pay yes, safety **no** |
| D200c | 0.7446 / 0.9373 | 0.7404 / 0.8401 | +0.185 (36, 1; 4) | 97.86 %, **192** | 99.47 %, 58 | 0 / 0 | 7 / 7 | 54 / 58 | pay yes, safety **no** |
| D200e | 0.6354 / 0.8863 | 0.6443 / 0.8267 | +0.269 (49, 0; 6) | 97.33 %, **192** | 98.93 %, 132 | 0 / 0 | 7 / 7 | 54 / 58 | pay yes, safety **no** |
| **D200b (chosen)** | 0.6362 / 0.8263 | 0.6484 / 0.8201 | **+0.279** (54, 2; 8) | 100 %, 12 | 100 %, 20 | 0 / 0 | 7 / 7 | 54 / 58 | **both** |

- **The root is unchanged.** On all four d8 readings D200b plays `main`'s move at `main`'s score.
- **Reports, D200b (information only):**
  - Depth 6 over the 190: nodes 0.7288×, quiescence nodes 0.6840×.
  - d7: `search()` 0.6778 / 0.8602, `chooseMove` 0.6831 / 0.8345.
  - d8 on other roots, `search()` / `chooseMove`: position-4 0.5386 / 0.5067, position-5 0.7350 / 0.7784, startpos
    0.9238 / **1.0147**. Startpos in `chooseMove` is the one reading above 1.
  - Reach at 20 000: 5.784 → 6.100 (+0.316).
  - Mate d4 → d5 (`search()`): 0 of 163. `chooseMove` d6 → d6: 0 of 209.
- **The quiescence audit** (information, not a bar; `ADR-0069`'s shape). Every 50th quiescence node with a delta skip, at
  `search()` depth 6 over the 190, was re-searched fresh: head at the node's window, door at that window, door at the full
  window. 459 147 nodes fired, 9 071 were read. **Flips: 81 (0.893 %). Errors ≥ 100 cp: 0.** The largest is 99 cp. For
  scale, Q1's QS read 4.79 % and 9 errors ≥ 100 cp.

### Why the returned value decides it

The pair is a controlled comparison: D200 and D200b make the same test, so the difference between 192 cp and 12 cp comes
from the returned value and nothing else. That much is measured.

The mechanism is reasoned, not measured. A fail-soft node that fails low returns an **upper bound** on its value. If it
skipped a capture and returned the stand pat, it claims the capture was worth no more than the stand pat. The rule's own
assumption is weaker: the capture is worth no more than `standPat + victim + margin`. So the stand pat is a false bound, too
low by up to that gap, and the parent reads it, negated, as a fail high that is too good. Full-width nodes above keep that
value and store it in the table. Returning the bound keeps the claim true, and because the bound is ≤ alpha, the node's
verdict does not change.

## Decision

1. **The rule.** In `quiesce`, at a node **out of check** (one that stood pat), each capture that does not promote is tested
   in the loop, after the one sort, before it is made. It is skipped when
   `standPat + ORDER_VALUE[victim] + DELTA_MARGIN ≤ alpha`: not made, not searched, not counted.
   - `alpha` is the loop's **current** alpha, raised by the stand pat and by each searched capture.
   - **In check, nothing is skipped.** Every evasion is searched, as `ADR-0053` requires.
   - **The order does not change.** `orderCaptures` still sorts the whole list (`ADR-0024` d2). The cap of 8 (d5) is
     unchanged.
   - The loop uses `continue`, not `break`: a quiet queen promotion can sort after a skipped capture.
2. **The margin is 200 cp, a private constant.** One caller, no parameter (coding rule 7). It is part of form D200b and was
   fixed before the read, and it does not move after it. No margin was derived from this read.
3. **A skip returns the skipped capture's bound.** It sets `best = max(best, standPat + ORDER_VALUE[victim] + DELTA_MARGIN)`.
   That value is ≤ alpha, so alpha does not move and no cutoff comes of it. **This clause is load-bearing:** without it the
   same rule reads 192 cp of drift and fails decision 11. A node whose every capture is skipped by delta returns the largest
   such bound, and a node whose captures are all skipped by SEE returns its stand pat, as `ADR-0069` d1 has it.
4. **Delta tests first, then `isLosingCapture`.** With decision 3 this order changes values, not only cost: a capture both
   rules would skip contributes its bound. It is the measured order, and it spares a SEE walk on every capture delta takes.
   Reversing it is a different form and must fail row (d) of decision 10.
5. **The exclusions.**
   - **Promotions:** a capturing promotion is never tested. A quiet queen promotion has no victim and is never tested.
   - **En passant** is tested, and its victim is its pawn (`move.captured`).
   - **No check exemption.** A checking capture is skipped like any other, as `ADR-0069` d3 has it. D200c measured it as a
     stand-pat form: −0.089 ply, and it failed drift all the same. **A check-exempt form with the bound was not
     pre-registered and is not measured here.** The premise table says that is where the rule's errors are, and the mate
     rows show no cost: 0 at d5 in both recursions, 0 of 163, 0 of 209. It stays a named follow-up, with a new PREREG, if a
     read shows a tactical loss.
   - **No phase or material condition.** D200e measured the late-endgame exclusion as a stand-pat form: −0.005 ply, the
     same 192 cp. It earns no code.
   - **No mate-band guard.** With alpha at or above 20 000 every capture is skipped, a shorter mate included. 913 of
     1 193 138 delta-only captures sit there, and the mate floor holds.
6. **The switch reaches quiescence through its rules record** (`ADR-0069` d6):
   - `QuiescenceRules` gains `deltaPruning?: boolean`. Absent or false means off.
   - Each recursion gains a constant record, `RULES_DELTA_PRUNING`, which is `RULES_SEE_PRUNING` plus `deltaPruning: true`.
   - **A caller that builds its own record does not opt in.** `tools/tune/tune.ts`'s `QUIET_RULES` and `ABC-239`'s position
     filter are unchanged, so no dataset moves when this merges.
7. **One switch, `deltaPruning`, in BOTH recursions** (`src/search.ts` `Switches`, `src/engine.ts` `Heuristics`). It is on in
   `search()` and `chooseMove` only. It is never module state, an `EngineOptions` field or a parameter of `search()`
   (`ADR-0026` d2).
8. **Two TEST-ONLY doors: `searchWithoutDeltaPruning(position, depth)` and `chooseMoveWithoutDeltaPruning(position, options)`.**
   - Each is the shipped path with `deltaPruning` off and everything else on. Node for node, they are the pre-ticket
     `search()` and `chooseMove`. The engine door takes no depth (`ABC-078` `A4`).
   - **This switch is the ladder's new top rung, and every older door turns it off** (`ADR-0026` d3). That includes
     `ABC-283`'s: `searchWithoutHistory`, `searchWithoutSeeOrdering`, `searchWithoutBundle`, and the engine's
     `chooseMoveWithoutHistory`, `chooseMoveWithoutSeeOrdering`, `chooseMoveWithoutAspiration` and
     `chooseMoveWithoutBundle`. So P0, K0 and every older door row keep their counts.
   - Rows that pin a shipped count re-point to the new door by `ADR-0050` d4, `ADR-0058` d5, `ADR-0059` d6 and `ADR-0061` d6,
     by reference (`src/search.bundle.test.ts`'s `523_847` row is one). Value and behaviour rows stay on the shipped path.
     **No zugzwang row's depth is re-pinned.**
   - **Export lists:** `ABC-077` `A6` (`src/search.ts`) grows by one and `ABC-078` `A4` (`src/engine.ts`) by one, each its
     door. `src/quiescence.ts` exports nothing new.
9. **`ADR-0024` d4 is amended.** "Delta pruning" leaves the out-of-scope list, by decisions 1–5 of this ADR. Quiet checks stay
   on it. `src/quiescence.ts`'s header line "Not here … delta pruning" is corrected in the build. A dated pointer in
   `ADR-0024` § Status and a dated line at its d4 are owed **at the owner's acceptance**, as `ADR-0069` d9 wrote. Neither is
   written here.
10. **The rows it adds, within the lane budget.** No new test file of any kind: a new file costs the default lane its load,
    and `src/quiescence.test.ts` already holds both lanes. A row of 50 ms or more goes behind `SEARCH_DEEP=1`.
    - **Default lane (`DP1`), each a hand board calling `quiesce` directly, no search:**
      - (a) **the margin, both sides of the edge:** at `alpha = standPat + victim + 200` the capture is skipped; at one
        centipawn more it is searched;
      - (b) **the bound:** a node whose captures are all skipped returns `standPat + largest victim + 200`, not the stand pat;
      - (c) **the exclusions:** a capturing promotion and a quiet queen promotion are searched at an alpha that skips a plain
        capture; en passant is tested;
      - (d) **the order:** a capture both rules name contributes its bound;
      - (e) **in check:** every evasion is searched at an alpha that would skip it;
      - (f) **the seam:** a record without `deltaPruning` searches the same board in full.
    - **Source rows,** by editing the existing ones: the rules-record constants and the ternary
      (`src/quiescence.test.ts`), and the export lists.
    - **Deep lane (`SEARCH_DEEP=1`, `src/quiescence.test.ts`):** the doors' node equality (`DP0`), and the drift, mate, node
      and reach rows of decisions 11 and 12.
11. **The bounded oracle, derived by the PREREG's rules for D200b:**
    - Drift at depth 5 on the 190 in both recursions, against the doors: **≥ 98 % within 25 cp** (max(90, ⌊100⌋ − 2)), **none
      beyond 30 cp** (min(150, max(25, ⌊1.5 × 20⌋))), and 0 mate sign changes.
    - Mate floor at the **same depth**, door d5 → head d5 on the 287, **both recursions: 0** (of 191 and of 189).
    - Zugzwang **7 / 7**. `G1` **≥ 54 / 58**, with no NEWLY-MISSED line.
    - The audit is information. Its sample is fixed as in § Context, so its counts reproduce on a deterministic build.
12. **The premise bars:**
    - **(a)** d8 nodes on kiwipete and position-6, both recursions: **≤ 0.88×** on each of the four readings
      (min(0.95, ⌈100 · (0.8263 + 0.05)⌉ / 100)).
    - **(b)** reach at 47 000 on the 190: **≥ door + 0.15 ply** (max(0.10, ⌊20 · 0.7 · 0.279⌋ / 20)), so ≥ 7.018 against
      6.868.
    - **(c) `G6` / `NFR-005`**, by its rule at each build's `LEVELS[5]` (4 000 ms): "≥ base", graded by the median. This is a
      search ticket.
    - **(d) `G2`:** `src/evaluate.ts` and `src/evaluate-params.ts` stay byte-identical to base, so `G2` is not re-read. If
      either is touched, `G2` is read by its rule.
    - **The instrument check, not a bar.** On `main` `0cc9afd1` a faithful build reads `search()` d8 333 296 / 193 534,
      `chooseMove` d8 458 740 / 83 175 and reach 7.147. Its door reads 523 847 / 234 214 / 707 548 / 101 425 and 6.868, and
      `ABC-279`'s door pair reads 839 514 / 1 533 901 / 1 296 788 / 404 930. If `main`'s production code has moved by the
      build, the Engineer re-reads these on the new base and puts both sets in the PR. The bars stay; a re-derived count is a
      dated line here, never a moved bar.
13. **The read, by reference (`ADR-0056` C2′ as folded):** 100 games at 100 ms against the merge-base. **The intent is GAIN,
    ≥ 50.0 / 100.** Also S′ at E 1 810 and the Levels deep lane. A miss is NOT MET and is not re-played.
    - **The firing figure at 100 ms:** at 47 000 nodes on the 190 the rule skips **48.25 %** of the captures reached out of
      check (3 785 544 of 7 845 226), on 185 of 190 rows. **27.08 %** are captures `seePruning` would have searched.
    - **It is not depth-gated:** 65.9 % of its skips are at quiescence ply 0, so it acts at every leaf. NEUTRAL "invisible at
      100 ms" is closed.
    - R-TC: the rule reads no budget, deadline or environment.

## What would falsify this

| # | clause | what would falsify it | how to check | if it fires |
|---|---|---|---|---|
| **F1** | 11, drift | a non-mate score beyond 30 cp, < 98 % within 25 cp, or a mate sign change, in either recursion | decision 11 | a defect first: the bound of decision 3, the order of decision 4, the in-check guard. On an exact build: NOT MET |
| **F2** | 11, mates | a door mate at d5 on the 287 that the head does not score as a same-sign mate at d5, in either recursion | decision 11 | a defect |
| **F3** | 11, zugzwang | any of `ADR-0050` d9's seven rows not played at its recorded depth | decision 11 | a defect. Never a re-pin |
| **F4** | 12 (a)/(b), it pays | a d8 reading above 0.88×, or reach below door + 0.15 | decision 12 | a defect first (the switch left unwired reads 1.00× and +0). On an exact build: NOT MET |
| **F5** | 13, strength | C2′ < 50.0 / 100, or an S′ collapse | decision 13 | not merged; this ADR reads "accepted, not in force" |
| **F6** | 8, the doors | a new door not node-equal to the pre-ticket search, an older door not node-equal to itself on the `ABC-078` `A3` corpus, or `ABC-279`'s door pair off its counts | `G4` | a defect in the switch wiring |
| **F7** | regression | `G1` below 54 / 58, or a NEWLY-MISSED line | decision 11 | classed per row under `ADR-0034` |
| **F8** | 12 (c), cost | `G6` below base by the median | decision 12 | the test's per-move cost outweighs the nodes it saves on the real clock. NOT MET; no tuning after the read |
| **F9** | 3, the bound | a build that leaves `best` at the stand pat on a skip | decision 10 (b) | a defect; it is the failed form D200 |

## Alternatives

Every alternative below that was measured failed the sealed safety gate. Each reads as a stand-pat form, so its failure says
nothing about the same clause with the bound.

- **D200, the stand-pat return, as `ADR-0069` d1 returns.** The first shape item 6 names. Measured: 192 cp, which fails the
  150 cp gate. It also returns a false bound (§ Why the returned value decides it).
- **D100, a narrower margin.** The best reach of the six, +0.369, and it fails hardest: 87.70 % and 226 cp. Its d8 root moves
  change on kiwipete (e2a6, −105). The margin is not moved after the read, and no D100 with the bound is measured.
- **D300, a wider margin.** Measured: +0.211, 192 cp, and `G1` 53 / 58 with "mate in 3, seed 1632" newly missed.
- **D200c, never skip a checking capture.** Measured: +0.185, 192 cp. See decision 5.
- **D200e, off in the late endgame.** Measured: +0.269, 192 cp. See decision 5.
- **A `break` at the first skip.** Not taken: a quiet queen promotion can follow, and `break` would drop it.
- **Delta after `isLosingCapture`.** Not measured. It would spend a SEE walk on captures delta takes for free, and change
  values under decision 3.
- **A value table of the evaluator's own, in place of `ORDER_VALUE`.** Not taken. `MATERIAL` reads 325 for the minors against
  `ORDER_VALUE`'s 320 / 330, and the margin covers 5 cp. A second table would be a second thing to keep in step.
- **Park it because Q2 is small.** Not the sealed rule: the premise is met. The pay is about a third of Q1's +0.837.

## Consequences

- **NFRs:**
  - `NFR-005`: `G6` reads it (decision 12 (c)). The test is one array read, one add and one compare per capture, and each skip
    spares a SEE walk and a subtree. It is not timed here (`UNKNOWN - verify`); F8 is the read.
  - `NFR-009`: no new table and no new scratch: 0 bytes.
  - `NFR-008`: decision 10. **The lane budget is the Orchestrator's to set:** his ruling `…f30bd604` names `ABC-282`, `ABC-301`
    and bundle 1, not this ticket. This design aims at those same terms, rows added or changed ≤ 90 ms in-thread and none in
    `src/cli.test.ts`. Shipped-path rows search fewer nodes with the rule on, which may give some time back:
    `UNKNOWN - verify`, read by the build's twin.
  - No new NFR file. `plans/nfr-catalog.md` is untouched.
- **Determinism (`ADR-0027`):** the rule is a pure function of the stand pat, the move and alpha.
- **The transposition table:** unchanged. Quiescence stores nothing in it, and the table is cleared at each search's start, so
  no entry mixes switch states. The values full-width nodes store change, as with any value change.
- **Ordering:** unchanged in both trees.
- **The evaluation:** the margin was read on `main`'s table. `ABC-301`'s second pull moves the stand pat but not `MATERIAL`
  (its page: material frozen). No margin is re-derived after a fit; a fit that trips F1 is read then.
- **Q1's skip still returns the stand pat.** A SEE skip has no bound to offer, and this ADR does not touch it. Whether that
  costs anything is `UNKNOWN - verify` and out of this ticket's scope.
- **The pay is smaller than Q1's, and a 100-game read cannot size it.** The GAIN bar means "not seen worse than base". It will
  not confirm `ADR-0056`'s +5–20, which stays an estimate.
- **Merge interaction, one at a time (`ADR-0056`):** `ABC-282` (in development) edits `src/engine.ts`, and bundle 1 edits
  `src/search.ts`'s doors and `negamax`. This ticket edits `src/quiescence.ts`, both `Switches` records and every door there.
  Whichever merges second re-reads its instrument counts, and the later switch is the top rung. The slot is the Orchestrator's.
- **Migration:** none.

## Rollback

- **Now:** nothing is built. To withdraw, mark this ADR `withdrawn`, and `ADR-0024` d4 stays as written.
- **After it ships:** set `deltaPruning` to false in `search()` and `chooseMove`, two booleans. Removing the rule, the switch,
  the doors, the rules field and the re-points is then a mechanical revert of one ticket.
