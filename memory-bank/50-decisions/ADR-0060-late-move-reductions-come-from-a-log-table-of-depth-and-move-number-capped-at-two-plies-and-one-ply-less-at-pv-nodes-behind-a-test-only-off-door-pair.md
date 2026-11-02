---
kind: adr
id: ADR-0060
---
# ADR-0060: Late-move reductions come from a log table of remaining depth and move number, one ply less at PV nodes and capped at two plies, in both recursions behind a test-only off-door pair. The history term waits for a history table

## Status

**PROPOSED, RE-OPENED 2026-11-02: re-measured on `main`, the rule misses two of its own bars there, and the build
does not start.** Recorded by Architect/Design (task `arch-phase2-rebase`, records only, on
`grugops/arch-phase2-rebase` from `main` `5ffbae25`).
- **Why re-measure.** `ABC-264` did not merge (`ADR-0059` F5: 44.0 / 100). So this ADR's door is now `main`'s own
  search: the flat `ABC-121` rule with no reverse futility. `main`'s `src/` equals `0b73f51d`, `ABC-264`'s
  merge-base. § Consequences said it: "the premise is re-measured on `main` … The bars stay."
- **The instrument.** The same driver (`raw/probe/probe.ts` of `arch-phase2-p1`) ran on a scratch `git archive` of
  `main`'s `src/`, outside the repository. The patch was adapted to `main`: the P1 predicate is unchanged; the P3/P5
  ranking knobs are dropped, because they gated on reverse futility. Every batch ran under the host lock, took
  ≤ 5 min and read deterministic counts only, with no timing. The scratch copy is deleted. The patch, the driver
  and the outputs are kept under `.grugops/context/arch-phase2-rebase/raw/`.
- **Instrument check: exact.** The door reproduces `main`'s pre-`ABC-264` counts to the node: 1 116 785 /
  1 602 457 (`search()` depth 8, kiwipete / position-6) and 1 575 537 / 476 244 (`chooseMove` to 8). These are
  `ADR-0059`'s door counts, which QE confirmed.

**Every A3 / A4 / G1 figure, on `main` against the `4d1c0616` base it was first measured on:**

| figure | on `4d1c0616` | **on `main`** | bar | on `main` |
|---|---|---|---|---|
| `A4` (a) `search()` d8 kiwipete | 0.7238 | **0.7605** (849 358 / 1 116 785) | ≤ 0.85 | met |
| `A4` (a) `search()` d8 position-6 | 0.7086 | **0.7385** (1 183 439 / 1 602 457) | ≤ 0.85 | met |
| `A4` (a) `chooseMove` d8 kiwipete | 0.6795 | **0.7334** (1 155 460 / 1 575 537) | ≤ 0.85 | met |
| `A4` (a) `chooseMove` d8 position-6 | 0.8020 | **0.8699** (414 286 / 476 244) | ≤ 0.85 | **MISSED** |
| `A4` (b) reach at 47 000 nodes, 190 | 6.237 → 6.542 (+0.305) | **5.558 → 5.811 (+0.2526)**; 44 deeper, 2 shallower, 15 moves differ | ≥ +0.25 | met by 0.0026 (48 position-plies against 47.5 needed) |
| `A3` drift d5 `search()` | 100 %, max 16 cp | **99.47 %, max 63 cp** (position-6/g5h6, 319 → 382); 0 sign, 0 mate-status flips | ≥ 95 %, ≤ 27 cp | **MISSED** (the 27 cp cap) |
| `A3` drift d5 `chooseMove` | 100 %, max 18 cp | **100 %, max 18 cp** (startpos/g2g4); 0 / 0 | ≥ 95 %, ≤ 27 cp | met |
| `A3` mate floor, door d4 vs head d5 | 0 / 163 | **0 / 163** | 0 | met |
| same-depth mate report (d5) | 2 / 189 | 2 / 189 | report | — |
| `A3` zugzwang, seven rows | 7 / 7 | **7 / 7** (node counts as before; `zugzwang.004` 627 208 at d11) | 7 / 7 | met |
| `A5` `G1` | 54 / 58 | **54 / 58**, no NEWLY line (door 54 / 58) | ≥ 54, no NEWLY | met |
| `A4` (c) `G6` | not read | not read (timing; a build's gate) | ≥ base | — |

- Reports on `main`. At depth 8, the other roots read (`search()` / `chooseMove`): position-4 0.814 / 0.712,
  position-5 0.660 / 0.796, startpos 0.627 / 0.748. At depth 6: kiwipete 0.580 / 0.661, position-6 0.817 / 0.835.
  Root moves at depth 8 are unchanged on kiwipete and position-6 in both recursions. Firing at depth 6 on the 190
  (`search()`): 242 201 of 2 206 433 non-first moves reduced (11.0 %), 40.9 % of them by two plies (door 9.9 %,
  all by one); nodes 0.843×. Reach at 20 000 nodes: 4.426 → 4.642 (+0.216).
- **The new instrument-check counts on `main`** (they replace decision 9's `4d1c0616` counts): 849 358 / 1 183 439
  (`search()`), 1 155 460 / 414 286 (`chooseMove`), and reach 5.558 / 5.811 (sums 1 056 / 1 104 over 190).
- **The door counts on `main`:** 1 116 785 / 1 602 457 (`search()`), 1 575 537 / 476 244 (`chooseMove`).

**What it means, said plainly.**
- **Two bars miss on `main`:**
  - `A3`'s 27 cp cap: 63 cp in `search()` at position-6/g5h6.
  - `A4` (a) on `chooseMove` position-6: 0.8699 against 0.85.
  - `A4` (b) holds by less than one position-ply.
- **No bar moves.** The 27 cp, 0.85×, +0.25 ply, 95 % / 25 cp, 0 sign flips, the mate floor, 7 / 7 and 54 / 58 all
  stand as pre-registered. None is loosened here.
- **The F-rules apply as written:**
  - **F1** (drift red on a predicate that matches decision 1 exactly): **NOT MET, and this ADR is re-opened with a
    new probe.** No fallback is pre-chosen.
  - **F4** (`A4` (a) above 0.85× on any reading): the ticket would not merge.
- **So the build does not start from `main` on this text.** Decision 9 says a faithful build reproduces the probe's
  counts to the node. These readings are deterministic, so a build of decision 1 on `main` would read exactly these
  figures and fail `A3` and `A4` before any game is played.
- **The variants, re-read on `main`, do not rescue it.** On the same instrument, no rule in § What the probe
  measured meets both missed bars on `main`:

  | variant | `search()` kiwi / pos-6 | `chooseMove` kiwi / pos-6 | drift d5 `search()` / `chooseMove` (max cp) |
  |---|---|---|---|
  | chosen (cap 2, PV −1) | 0.761 / 0.739 | 0.733 / **0.870** | **63** / 18 |
  | uncapped | 0.685 / 0.693 | 0.599 / 0.769 | **63** / 18 |
  | uncapped, killer −1 | 0.694 / 0.726 | 0.612 / 0.826 | **63** / 21 |
  | textbook 0.75 / 2.25, PV −1, killer −1 | 0.770 / 0.746 | 0.695 / **0.975** | **28** / 26 |
  | 0.75 / 2.25, no PV or killer term | 0.715 / 0.686 | 0.638 / 0.686 | **63** / 23 |
  | 1.0 / 1.75, PV −1, killer −1 | 0.653 / 0.599 | 0.578 / 0.770 | **63** / 11 |
  | flat 2 / 1, cap 2 | 0.799 / **0.908** | 0.738 / **0.867** | **30** / 21 |
  | textbook, never below 1 | 0.753 / 0.791 | 0.672 / **0.895** | **30** / 21 |

  Every variant keeps ≥ 98.93 % within 25 cp and 0 sign flips. The same position, position-6/g5h6 (319 → 382), is
  the maximum in five of the eight. The three without it (textbook, flat 2 / 1, never below 1) reduce less at PV
  nodes.
  - **One diagnostic run, not a candidate:** decision 1 with two plies less at PV nodes (PV −2). The 63 cp row
    goes, so it comes from two-ply reductions at PV nodes.
  - But the drift maximum is still 28 / 26 cp, 1 cp over the cap in `search()`.
  - And position-6 saves nothing: 1.037× in `search()` and 0.930× in `chooseMove` (kiwipete 0.842 / 0.772).
  - So moving the PV term trades one missed bar for another. Uncapped and the textbook
  forms also lose `zugzwang.004`; that was measured on `4d1c0616` and is not re-read here.
- **Why `main` differs from `4d1c0616`** (a judgement, not measured). That probe's door included reverse futility,
  which cuts at remaining depth 1–3. Those cuts removed shallow subtrees before a reduction could matter. On `main`
  those subtrees are searched, so the same table acts on a different tree. Measured: the saving on `chooseMove`
  position-6 moves from 0.80× to 0.87×, and one line moves 63 cp.
- **What changes in the text when the rule is re-opened** (decision 4's "reverse futility included", decision 5's
  door list, and decision 6's `ABC-264` re-point example):
  - On `main` the doors carry no reverse futility. Decision 5's list is the doors `main` has.
  - No `ABC-264` row exists to re-point.
  - Nothing else in decisions 2–8 depends on the base.
- **The re-open is a new design hop, not this one.** It is a new probe on `main`, and it chooses its rule on its
  merits: reach, zugzwang, `G1`, the mate floor. It must not tune the rule to pass the bars on the same two boards
  that define them: a rule fitted to its own bar measures nothing. Every bar number above carries over.
  - **Open, the owner's:** the 27 cp cap was ⌊1.5 × 18⌋, from one base's maximum. On `main` one position of 187
    moves 63 cp, so the cap has proved base-fragile. Re-deriving it on `main` by `ADR-0050` d8's method would raise
    the number. That is a loosening, so it is his word, not the Architect's.
- **Status for the owner.** The question "accept ADR-0060" is **not put** on this text, since it fails on `main`. It is
  put again after the re-open. The default without an answer is unchanged: the flat 1-ply LMR stays on `main`.

*Earlier status, kept:* **PROPOSED** 2026-11-02 by Architect/Design (task `arch-phase2-p1`, records only, on `grugops/arch-phase2-p1` from
`main` `0d7b9d2f`). The probe ran on a scratch copy of `grugops/ABC-264-fix` `4d1c0616`'s `src/`, outside the
repository, under the host lock. The copy is deleted. Nothing was committed to `src/`.

- **This is `EPIC-011` Phase 2 row P1** (`ADR-0056` D2, D6). It is the next Phase 2 item after P2 (`ABC-264`,
  `ADR-0059`). The choice is confirmed by measurement; see § Why P1 next.
- **Acceptance is the owner's.** It is a new ADR (`memory-bank/45-standing-rulings.md`, 2026-10-22). `ADR-0056` lists P1
  and the owner's "P yes" set the order P2 → P1 → P4 → P3 → P5 → P6. That covers the direction, not this text. The
  Orchestrator reports it to him.
- **The answer that settles it:** *"accept ADR-0060"* or *"decline it"*.
- **Reading (b)**, the `ABC-208` / `ABC-264` precedent. The build may start while this ADR is PROPOSED, **but not
  before `ABC-264` merges**, because both edit `src/search.ts` and `src/engine.ts`. The 100-game read (C2′) and the
  merge wait on his acceptance.
- **Default without an answer:** the flat 1-ply LMR of `ABC-121` stays on `main`.
- **If the P1 ticket does not merge** (F4, F5 or F8 fires), a dated line here records "accepted, not in force on
  `main`", as `ADR-0026` decision 9 does.
- **What it amends:** `ADR-0026` decision 6, for the shipped path only (decision 2 below says how). Every other
  `ADR-0026` decision is cited, not changed. It follows `ADR-0026` decision 10's pattern: a switch, a pair of doors,
  off in every older door, a bounded oracle. **It does not amend `ADR-0059` or `ADR-0050`.**

## Context

- **The gap.** Today's LMR is `ABC-121`'s: **one ply, flat**. A quiet move at index ≥ 3, at remaining depth ≥ 3, not
  at the root, neither capturing nor promoting, not in check and not giving check, is searched one ply shallower on
  the null window. A reduced fail-high is searched again at full depth (`ADR-0026` decision 6, `src/search.ts`
  `lateMoveReduction`). Engines at this engine's target strength reduce more, the later the move and the deeper the
  node: a reduction read from a table of ln(depth) × ln(move number).
- **The expected value.** `ADR-0056` D2 row P1: +40–100 Elo, basis [B] 7.1 (bundled with futility and SEE) and 7.3,
  and [t]. That is an estimate for the full form, history-adjusted. It is not a reading.
- **The history term cannot be built now.** The stub says "history-adjusted". The search has **no history table**:
  `ADR-0056` § Inventory, "History / countermove / continuation history | **no**". The history heuristic is O1h,
  `ABC-233`, in Phase 3 (size M). Building a history table inside P1 would pull O1h's whole scope ahead of the owner's
  order. So this ADR decides the log table without it and names the history term as O1h's (decision 9).
- **The inputs read:** `EPIC-011` Phase 2 rows (P1, P3–P6) and § The per-change rule; `ADR-0056` D2, D5 (C2′, S′,
  R-TC, the depth-gated rule), D6 and its dated lines; `ADR-0026` decisions 1–10; `ADR-0050`; `ADR-0059`; `ABC-121`
  (the page, `A1`–`A4`); `ruling-abc121-lmr-oracle` (`noResearch` passes depth-4 drift, depth 5 reds it); and on
  `4d1c0616`: `src/search.ts` (`lateMoveReduction`, `negamax`, `searchMove`, `searchRoot`, the doors) and
  `src/engine.ts` (`negamax`, `searchMove`, `runIteration`, the doors).

### What the probe measured

The probe patched a scratch copy of `4d1c0616` with one switchable reduction predicate in both recursions (and, for
the ranking only, a futility switch and a depth-grown null-move R). Every run is deterministic: fixed depth, or
`chooseMove` with `maxDepth` or `maxNodes` on a frozen clock. **The door reproduces `ADR-0059`'s head counts to the
node** (kiwipete 658 971, position-6 1 021 190 in `search()` at depth 8; 972 596 / 299 183 in `chooseMove`). Full
figures: `.grugops/context/arch-phase2-p1/` observation `…35bd3967` (the probe note; scripts and outputs under
`raw/probe/`); the ruling is decision `…6a0f09ce`.

**The chosen rule** (decision 1: 1.0 + ln d × ln m / 2.0, one ply less at a PV node, cap 2 plies, child depth ≥ 1):

| reading | kiwipete | position-6 |
|---|---|---|
| `search()` depth 8, head / door | **0.7238** (476 991 / 658 971) | **0.7086** (723 582 / 1 021 190) |
| `chooseMove` to depth 8, head / door | **0.6795** (660 887 / 972 596) | **0.8020** (239 944 / 299 183) |
| `search()` / `chooseMove` depth 6 | 0.596 / 0.741 | 0.935 / 0.829 |

- Root moves are unchanged on both positions in both recursions. Scores: kiwipete `chooseMove` −59 → −68; the other
  three equal.
- Also at depth 8 (`search()` / `chooseMove`): position-4 0.799 / 0.702, position-5 0.768 / 0.762, startpos
  0.563 / 0.565.
- **Depth reached at a fixed node budget** (`chooseMove`, `maxNodes`, the 190 of `ABC-121`, frozen clock). This is
  what LMR buys, and it is what 100 ms sees. At **47 000 nodes** (the 100 ms median, `ADR-0056` D5): mean completed
  depth **6.237 → 6.542 (+0.305 ply)**; 53 positions deeper, 3 shallower, 13 root moves differ. At 20 000 nodes:
  5.132 → 5.374 (+0.242).
- **Firing at depth 6 on the 190** (`search()`): 239 565 of 1 992 931 non-first moves reduced (12.0 %), and 41.8 %
  of those by two plies. The door reduces 10.9 %, all by one. Nodes 0.882× the door.
- **Drift at depth 5 on the 190, against the door, both recursions:** 100 % of 187 non-mate scores within 25 cp;
  largest 16 cp (`search()`) and 18 cp (`chooseMove`); 0 mate-status flips, 0 sign flips.
- **Mate floor on the 287** (`src/search.mate-corpus.ts`): one ply deeper (door at 4, head at 5), **0 of 163**
  violations. At the same depth 5, 2 of 189 door mates are not yet mates: the horizon cost `ADR-0026` decision 9
  names and accepts.
- **`ADR-0050` d9's seven zugzwang rows** (`chooseMove`, recorded depths 9, 11, 12, 8, 8, 8, 8): **7/7**.
  `zugzwang.004` is found at depth 11 with 627 208 nodes (the door: 587 282; the door already finds it at 10).
- **`G1`** (the puzzle runner's rule on the scratch copy): **54/58**, baseline 54/58, no NEWLY line.

**The variants** (depth 8 node ratios; reach = mean depth gain at 47 000 nodes on the 190):

| variant | `search()` kiwi / pos-6 | `chooseMove` kiwi / pos-6 | reach | same-depth mate loss | zugzwang | `G1` |
|---|---|---|---|---|---|---|
| **chosen: 1.0 + lnd·lnm/2.0, PV −1, cap 2** | **0.724 / 0.709** | **0.680 / 0.802** | **+0.305** | 2/189 | **7/7** | **54/58** |
| the same, uncapped | 0.575 / 0.681 | 0.538 / 0.723 | +0.337 | 2/189 | 6/7 | 54/58 |
| the same, uncapped, killer −1 | 0.580 / 0.683 | 0.542 / 0.761 | +0.331 | 2/189 | 6/7 | 54/58 |
| textbook 0.75 + lnd·lnm/2.25, PV −1, killer −1 | 0.672 / 0.711 | 0.624 / 0.934 | +0.126 | 0/189 | 6/7 | — |
| 0.75 + lnd·lnm/2.25, no PV or killer term | 0.618 / 0.666 | 0.565 / 0.637 | +0.352 | **14/189** | 6/7 | **53/58** |
| 1.0 + lnd·lnm/1.75, PV −1, killer −1 | 0.543 / 0.654 | 0.508 / 0.714 | +0.374 | 5/189 | 6/7 | — |
| flat: 2 plies at non-PV, 1 at PV, cap 2 | 0.772 / 0.787 | 0.695 / 0.862 | +0.174 | 0/189 | 6/7 | 54/58 |
| textbook with "never below the flat 1" | 0.660 / 0.752 | 0.593 / 0.910 | — | — | — | — |

- Every lost zugzwang row is `zugzwang.004` (plays g7f6, not h3h4). Uncapped, the rule finds h3h4 only at depth 13
  with 2 526 967 nodes, **4.30× the door's depth-11 count**. That is a blind spot, not a re-pin. The cap of two plies
  is what keeps the row (decision 1).
- Drift at depth 5 was ≥ 99.47 % within 25 cp and ≤ 30 cp for every variant measured: **the drift bar does not tell
  these variants apart.** The reach reading, the zugzwang rows and `G1` do.
- Index ≥ 2 instead of ≥ 3 changes almost nothing (reach +0.347 against +0.331 for the same uncapped rule with the
  killer term). A killer term changes at most about 5 % of nodes and nothing else.
- Letting the reduced child drop into quiescence (child depth ≥ 0) is not taken: mixed node effects (0.52–0.95), and
  child depth ≥ 1 is the common, boring form.

### Why P1 next (the brief's question)

- **The per-depth saving ranks it first.** Same instrument, same base, each change alone over the door:
  - **P1 (chosen):** 0.68–0.80× at depth 8.
  - **P3 futility** (100 or 150 cp a ply, depth ≤ 2, null-window, quiet non-checking moves after the first):
    0.88–0.91×.
  - **P5 null move R = 3 + depth/4 or 3 + depth/6:** 0.83–0.99×.
  - P1 saves two to four times what either saves.
- **100 ms sees it.** It acts at remaining depth ≥ 3 and the 100 ms median depth is 6. It buys +0.3 ply at the 100 ms
  node budget, so C2′ can read a GAIN. P5 acts mostly deeper: `ADR-0056` D5 lists it as depth-gated, near-invisible
  at 100 ms.
- **The estimates agree.** `ADR-0056` D2: P1 +40–100 against P3 +15–40, P5 +10–30, P6 +5–15. P4 (+20–40) depends on
  P1. Cost: P1 is S–M on an existing frame (`ABC-121`'s predicate, re-search and doors). P3 and P6 would share
  `ADR-0059`'s static evaluation and are smaller.
- **It is the owner's order.** P2 → P1 → P4 → P3 → P5 → P6 (`ADR-0056` D6, dated 2026-11-02, "P yes").
- **What would have changed the pick:** P1's premise failing (no reach gain, or drift, mate or zugzwang rows lost with
  no fix). It did not fail; the cap fixed the one lost row.

## Decision

1. **The rule.** For a move that the flat rule's eligibility admits (decision 2's first list), the reduction in plies
   is

   `r = max(0, min(T[d][m] − (pvNode ? 1 : 0), 2, d − 2))`,  with  `T[d][m] = ⌊1.0 + ln(d) × ln(m) / 2.0⌋`

   - **d** is the remaining depth (at least 3); **m** is the 1-based move number in the ordered list (`index + 1`,
     at least 4).
   - **One ply less at a PV node.** A PV node is one entered with a window wider than null: `alphaIn + 1 !== beta`,
     read from the node's entry window, never from the moving `alpha`. Measured: dropping it loses `G1` 53/58 and
     14 same-depth mates.
   - **Capped at two plies.** Measured: uncapped, `zugzwang.004` is lost until depth 13 at 4.30× the door's nodes.
     Two plies keeps all seven rows.
   - **The child keeps at least one ply** (`r ≤ d − 2`). A reduced move is never sent straight into quiescence.
   - **Its cells, as they read with the cap.** Depth 3: 1 ply (0 at a PV node, from move 7: 1). Depth 4: 1 at move 4,
     2 from move 5 (PV: 0 at move 4, 1 from move 5). Depth ≥ 5: 2 at every eligible move (PV: 1, growing to 2 from
     ln d × ln m ≥ 4, for example from move 7 at depth 8). So the table's grading acts mostly at PV nodes and at
     depth 4. Measured against a flat "2 at non-PV, 1 at PV" rule, the table saves more (0.68–0.80 against
     0.70–0.86), reaches deeper (+0.305 against +0.174) and keeps `zugzwang.004`, which the flat rule loses.
   - **Everything else is `ABC-121`'s, unchanged.** A reduced null-window search that fails high is searched again
     with the same null window at **full depth** before anything else is believed, whatever `r` was. Then PVS's own
     full-window re-search follows (`ADR-0026` decisions 1 and 6, `ABC-121` `A4`).
2. **The predicate is ONE new exported pure function in `src/search.ts`:
   `lateMoveReductionByTable(position, move, depth, index, atRoot, pvNode)`, returning plies (0, 1 or 2).** Both
   recursions call it when decision 3's switch is on, and subtract exactly what it returns.
   - **Eligibility is the flat rule's, unchanged.** It returns 0 at the root, at remaining depth < 3, at index < 3,
     for a capture or promotion, when the side to move is in check, and for a move that gives check. It derives these
     facts from the position and the move, as `ADR-0026` decision 6 requires. The Engineer may move the shared
     eligibility into one helper both predicates call; the flat predicate's answers do not change.
   - **The one new caller-supplied fact is `pvNode`.** It is a fact about the node's window, which no position
     carries, so the caller passes it. This is the amendment to `ADR-0026` decision 6's contract ("the caller passes
     only three facts"): for this predicate the caller passes four. The tactical facts stay derived inside it.
   - **The table `T` is a module constant**, a `Uint8Array` of 64 × 64 cells (4 096 bytes), built once at module load
     from the formula, never written after. Indices are capped at 63, and cells below d = 3 or m = 4 hold 0. Not a
     hand-typed literal. The nearest cell to an integer boundary is 0.0003 away (d 7, m 61), so the floor is stable.
   - **The flat `lateMoveReduction` stays exported and unchanged.** The doors use it, and its table test ("exactly
     1") keeps pinning it. `ADR-0026` decision 6's "0 or 1" contract now reads as that predicate's contract. The
     shipped path's contract is this decision's "0, 1 or 2".
3. **One switch, `logReductions`, in BOTH recursions:** `src/search.ts`'s `Switches` and `src/engine.ts`'s
   `Heuristics`. It is on in `search()` and `chooseMove` only. It implies `reductions` (and so `pvs`). With it off and
   `reductions` on, the recursion calls the flat predicate exactly as today. It reaches the recursion as a switch,
   never as module state, an `EngineOptions` field or a parameter of `search()` (`ADR-0026` decision 2).
4. **Two TEST-ONLY doors: `searchWithoutLogReductions(position, depth)` and
   `chooseMoveWithoutLogReductions(position, options)`.** Each is the shipped path with `logReductions` off and
   everything else on, reverse futility included. Node for node, they are the pre-ticket `search()` and `chooseMove`
   (the `ABC-264` merge). The engine door takes no depth (`ABC-078` `A4`).
   - **Export lists:** `ABC-077` `A6` (`src/search.ts`) grows by **two**, the door and the predicate. `ABC-078` `A4`
     (`src/engine.ts`) grows by **one**, its door. Three names in all, `ADR-0059` decision 4's precedent.
5. **Every door that exists before the ticket turns `logReductions` off** (`ADR-0026` decision 3's ladder rule). Log
   reductions are the top rung, above reverse futility. The doors that carry `reductions` today
   (`searchWithoutReverseFutility`, `…WithoutQuietPromotions`, `…WithoutQuiescenceEvasions`, `…WithoutNullMove` and
   their engine twins) keep the flat rule. They and every older door read exactly as today.
6. **Rows: `ADR-0050` decision 4, `ADR-0058` decision 5 and `ADR-0059` decision 6, by reference.**
   - **Re-point.** A row whose shipped side is `search()` or `chooseMove`, and whose other side is an older door,
     re-points its shipped side to the new door of the same recursion. Example: `ABC-264`'s drift, mate-floor and
     `A4` rows, which then read `searchWithoutLogReductions` against `searchWithoutReverseFutility` and keep their
     figures (0.5901 / 0.6373 …). No bound moves.
   - **Value and behaviour rows on the shipped path stay there.** That includes the seven zugzwang rows, the mate
     rows and `G1`. A row that moves is re-pinned, old and new figures in the PR. **No zugzwang row's depth is
     re-pinned**: a row that needs a deeper search is F3, not a re-pin.
   - **The PR lists every re-pointed and every re-pinned row.**
7. **The rows this ticket adds (the instrument for `A2`).**
   - **The predicate's table, called directly:**
     - cells (non-PV / PV): (3, 4) → 1 / 0; (4, 4) → 1 / 0; (4, 5) → 2 / 1; (5, 10) → 2 / 1; (8, 20) → 2 / 2;
       (3, 30) → 1 / 1, which is the child-depth clamp;
     - 0 for each eligibility clause, each on a move where every other clause would reduce.
   - **The re-search row at two plies**, `ABC-121` `A4`'s shape: a constructed null-window node where a move reduced
     by 2 fails high and is searched again at full depth. Seen through a call-through module mock, the `ADR-0050`
     decision 9 pattern; no production counter or hook. This is the row that catches a dropped re-search: the drift
     and mate rows pass that bug (`ruling-abc121-lmr-oracle`).
   - **A source row** reads both `negamax` bodies: with `logReductions` on, each calls `lateMoveReductionByTable`,
     passes `alphaIn + 1 !== beta` as `pvNode`, and subtracts exactly the returned value.
8. **The bounded oracle (`A3`).**
   - **Drift at depth 5 on the 190, in BOTH recursions.** `search()` is read against `searchWithoutLogReductions` at
     fixed depth 5, and `chooseMove` against `chooseMoveWithoutLogReductions`, each deepened to 5. Bars: **at least
     95 % of non-mate scores within 25 cp, none beyond 27 cp, and 0 mate scores change sign.** 27 is ⌊1.5 × 18⌋, the
     measured maximum with `ADR-0050` decision 8's headroom. Mate-status flips are reported.
   - **Mate floor on the 287, one ply deeper** (`ADR-0026` decision 9's form). For every position the door scores as
     a mate at depth 4, `search()` at depth 5 scores a mate of the same sign. Measured: 0 of 163. The same-depth count
     is a report (measured 2 of 189).
   - **Zugzwang:** `ADR-0050` d9's seven rows, `chooseMove` at their recorded depths, each plays its recorded move.
     These rows fix the cap at two plies.
   - **Scope, said plainly: this oracle is a regression net, not a proof.** The drift bar did not separate any two
     variants measured. The rule's correctness rests on decision 7's table and re-search rows; its payoff rests on
     decision 9.
9. **`A4`, its premise and its bars.** Pre-registered here; not loosened after Ready.
   - **(a) Nodes at fixed depth 8 on kiwipete and position-6, in BOTH recursions** (`search()` at depth 8;
     `chooseMove` deepened to 8 on a frozen clock): **≤ 0.85× the door's** on each of the four readings.
     - Measured: 0.7238 / 0.7086 (`search()`), 0.6795 / 0.8020 (`chooseMove`).
     - It reds the switch left unwired (1.00×), the textbook constants (0.934×), "never below the flat 1" (0.910×)
       and the flat 2/1 rule (0.862×).
   - **(b) Depth reached at 47 000 nodes on the 190** (`chooseMove` with `maxNodes: 47_000` on a frozen clock,
     `ABC-170`'s abort): **mean completed depth ≥ the door's + 0.25 ply.** Deeper and shallower counts are reported.
     - Measured: +0.305 (6.542 / 6.237).
     - This is the bar that reads what LMR is for. It reds the textbook constants (+0.126) and the flat 2/1 rule
       (+0.174).
   - **(c) `G6` "≥ base"** by its rule (floor 6).
   - **The instrument check, not a bar.** On the `4d1c0616` base a faithful build reproduces the probe's head counts
     to the node: 476 991 / 723 582 (`search()`) and 660 887 / 239 944 (`chooseMove`), plus the 6.542 / 6.237
     reach. If `ABC-264` merges at a different tree, the Engineer first re-reads the door's counts on `main`. A count
     that differs is explained in the PR before `A4` is read.
     - *Dated 2026-11-02 (`arch-phase2-rebase`).* `ABC-264` did not merge. On `main` the door reads 1 116 785 /
       1 602 457 / 1 575 537 / 476 244, and decision 1's head reads 849 358 / 1 183 439 / 1 155 460 / 414 286, with
       reach 5.558 / 5.811. `chooseMove` position-6 reads **0.8699, above (a)'s 0.85**. See § Status: F4 and F1
       apply, and the build does not start on this text.
   - **`G1` (`A5`):** ≥ 54/58 with no NEWLY-MISSED line (measured 54/58).
10. **The read and the reports (`A6`, `ADR-0056` D5 as folded):** C2′ 100 games at 100 ms against the merge-base, S′
    10 games at 0.5 s against Stockfish 19 at E 1 650, and the Levels deep lane on the candidate head, all by
    reference.
    - **The intent is GAIN (≥ 50.0 of 100).** The page names it before the read (C2′'s 2026-11-02 line). It is
      never re-classed after a score is seen.
    - **Why GAIN and not NEUTRAL:** the mechanism fires at 100 ms. At depth 6 it reduces 12.0 % of non-first moves
      (41.8 % of them by two plies), and at the 100 ms node budget it reaches +0.305 ply deeper. The owner's NEUTRAL
      bar is for changes invisible at 100 ms; this one is not.
    - **What 100 ms can resolve, said before the read.** The node saving is 0.68–0.80× at depth 8. By `ADR-0055`'s
      50–100 Elo a speed doubling, that suggests roughly +15–45 Elo (estimate, [D]/[J]), the low end of D2's +40–100,
      which assumed the history term. C2′ resolves about ± 48 at 95 %, so GAIN means "point estimate ≥ 0", not a
      proven gain. The owner accepted that.
    - **The firing rate at 100 ms** is reported from a test-side or scratch instrument, never a production counter.
    - **R-TC part 1, item 2, read at review:** the diff reads no budget, deadline, `movetime` or environment. The rule
      is keyed on depth, move number, the window and the position only.
11. **The history term and the cap are later, measured changes, not this ticket's.**
    - **History (O1h, `ABC-233`):** once a history table exists, its ADR may add a history term to this predicate
      (for example one ply less for a high-history move, one more for a low one), with its own reach and zugzwang
      readings. BA/PM decides whether `ABC-233`'s page carries it or a follow-up does.
    - **The cap:** the 40/15 claim searches to about depth 14, where a larger cap may pay. Lifting it is a dated
      amendment with a re-measured `zugzwang.004` and reach. A history term is the usual reason a deeper reduction
      becomes safe.
    - **Page deltas this ADR owes BA/PM** (not this hop's fence): the stub's title loses "history-adjusted" (decision
      11); `A1`'s export counts (decision 4); `A2` (decision 7); `A3` (decision 8: 27 cp cap, one-ply-deeper mate
      floor, zugzwang rows); `A4` (a), (b), (c) (decision 9); `A5` `G1`; `A6` GAIN.

## What would falsify this

| # | clause | what would falsify it | how to check | if it fires |
|---|---|---|---|---|
| **F1** | 1 — the formula and the cap | the drift bar red in either recursion (< 95 % within 25 cp, any score beyond 27 cp, or a mate sign change) | decision 8, `A3` | a defect, back to the Engineer. Red on a predicate that matches decision 1 exactly: NOT MET, and this ADR is re-opened with a new probe. No fallback is pre-chosen: the measured maximum (18 cp) sits well inside the cap |
| **F2** | 1 — horizon cost | a door-mate at depth 4 not a same-sign mate in `search()` at depth 5 on the 287 | decision 8 | a defect |
| **F3** | 1 — the cap | any of `ADR-0050` d9's seven rows not played at its recorded depth | decision 8 | a defect: first check the cap and the PV term (uncapped loses `zugzwang.004`, measured). Never a re-pin to a deeper depth |
| **F4** | the premise, it pays | `A4` (a) above 0.85× on any of the four readings, (b) under +0.25 ply, or `G6` below base | decision 9 | the ticket is not merged; this ADR "accepted, not in force" |
| **F5** | the premise, strength | C2′ NOT MET (< 50.0 of 100), or an S′ collapse | decision 10 | the same as F4. The next Phase 2 item is then P3 (P4 depends on P1), the Orchestrator's call |
| **F6** | 4, 5 — the doors | a new door not node-equal to the pre-ticket shipped search, or an older door not node-equal to its pre-ticket self, on the `ABC-078` `A3` corpus | `A1` (`G4`) | a defect in the door or the switch wiring |
| **F7** | regression | `G1` below 54/58, or a NEWLY-MISSED line | `A5` | classed per row under `ADR-0034`; an unexplained loss is a defect (the no-PV-term variant read 53/58) |
| **F8** | 1 — the re-search | the two-ply re-search row red, or the source row finding a recursion that subtracts anything but the returned value | decision 7 | a defect |

## Alternatives

- **Uncapped (the formula alone).** It saves more (0.54–0.72×) and reaches a little deeper (+0.337). Rejected by
  measurement: `zugzwang.004` is lost until depth 13, at 4.30× the door's nodes.
- **The textbook constants** (0.75 + ln d × ln m / 2.25, PV and killer terms). Rejected: they pay too little at
  100 ms (+0.126 ply), and `chooseMove` on position-6 reads 0.934×. They also lose `zugzwang.004`.
- **No PV term.** Rejected: `G1` 53/58 (seed 5180 newly missed) and 14 same-depth mate losses, against 2.
- **A killer term (one ply less for a killer).** No measurable effect (about 5 % of nodes at most, reach +0.331
  against +0.337),
  and it would hand the predicate the killer list. Not taken. History is the better-informed signal (decision 11).
- **A flat 2-ply rule at non-PV nodes, 1 at PV.** The boring rival to the table. Rejected by measurement: less saving
  (0.70–0.86×), half the reach (+0.174), and `zugzwang.004` lost.
- **A history-adjusted table now.** Not buildable without O1h's table. Pulling `ABC-233` ahead of Phase 2 changes the
  owner's order and an M ticket's scope. Not taken (decision 11).
- **Allow the reduced child to drop into quiescence.** Mixed effects, unmotivated. Child depth ≥ 1 is kept.
- **Change the flat predicate in place** (one predicate, no switch). Rejected: it would leave no pre-ticket door, and
  every older door and the `ABC-121` rows would change meaning. `ADR-0026` decision 10's pattern exists to stop
  exactly that.
- **P3, P5 or P6 first.** Rejected in § Why P1 next: each saves less per depth (P3 0.88–0.91×, P5 0.83–0.99×), and
  P5 is depth-gated at 100 ms.

## Consequences

- **NFRs.**
  - `NFR-005`: expected to improve (fewer nodes per depth); read by `G6`, floor 6 unchanged.
  - `NFR-004`: abort granularity unchanged; no new throw site.
  - `NFR-008`: the predicate's table, the re-search row and the source row are default-lane units. Drift, mate floor,
    zugzwang and the reach reading go behind `SEARCH_DEEP=1` / `ENGINE_DEEP=1`. The reach reading costs about 18 M
    nodes (two sides × 190 × 47 000), estimated 30 s.
  - `NFR-009`: a 4 096-byte constant, allocated once at load. Nothing grows per search and its level does not move.
    The PR states the bytes; no `G7` row is owed.
  - No new NFR file. `plans/nfr-catalog.md` is untouched.
- **Determinism (`ADR-0027`):** the table is built from `Math.log` once per process. The predicate is pure. The same
  input and virtual clock give the same move.
- **The order with `ABC-264`.** The code waits for `ABC-264`'s merge (the same two files). The probe measured on its
  head, so the door is the post-`ABC-264` search. If `ABC-264` does not merge, the premise is re-measured on `main`
  and decision 9's counts are re-derived by a dated line here. The bars stay.
  - *Dated 2026-11-02 (`arch-phase2-rebase`):* re-measured on `main`. Two bars miss (`A3`'s 27 cp cap,
    `A4` (a) on `chooseMove` position-6), so the ADR is re-opened (F1). See § Status.
- **Threads (`ABC-265`–`ABC-267`):** no interaction. This ticket edits no `src/transposition.ts` line. The rule is
  per node, so every worker applies it alike.
- **P4 coupling (named, not decided).** Move-count pruning reads the same move number and depth. Its ADR decides
  whether it shares this table's indices.
- **No eval-scale coupling.** The rule reads no evaluation, so E1 and E2 do not re-scale it.
- **Module headers** in `src/search.ts` and `src/engine.ts` name the new switch, as they name `ABC-264`'s.
- **Migration:** none. No data, format, option or dependency changes.

## Rollback

- **Before acceptance:** mark this ADR `withdrawn`, and strike the dated pointers in `ADR-0026` decision 6 and
  `ADR-0056` D2. Nothing else was edited.
- **After it ships:** set `logReductions` to false in `search()` and `chooseMove`, two booleans. The shipped path is
  then node for node the door, `ABC-121`'s flat rule. Deleting the switch, the predicate, the table, the two doors
  and the re-points afterwards is a mechanical revert of one ticket.
