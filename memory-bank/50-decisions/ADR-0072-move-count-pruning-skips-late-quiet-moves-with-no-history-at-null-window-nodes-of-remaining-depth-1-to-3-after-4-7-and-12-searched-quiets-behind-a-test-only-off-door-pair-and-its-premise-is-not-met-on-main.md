---
kind: adr
id: ADR-0072
---
# ADR-0072: P4, move-count pruning. At null-window nodes of remaining depth 1 to 3, once 4, 7 or 12 quiet moves have been searched, a later quiet move with a zero ordering key is skipped, with three non-pawn pieces on the board for the side to move, in both recursions behind a test-only off-door pair. Its premise is not met on `main`

## Status

**ACCEPTED 2026-11-04 BY THE OWNER'S WORD, OVER A MISSED PREMISE. THE PREMISE IS NOT MET AND F1 STAYS FIRED. Part of bundle
1; not in force until the bundle merges on its read.** Recorded by Architect/Design (task `arch-owner-answers-1104b`, records
only, on `grugops/arch-owner-answers-1104b` from `main` `65e28f95`). Nothing was run.
- **His word, verbatim** (`orch-2026-10-30a` `…3e73f9f9`): *"1. Bundle 1: (a)"*, answering OQ-0072-1 and OQ-0073-1 as one.
  Option (a) overrides both missed premises and builds `ABC-286` in form M3 and `ABC-288` in form C1, with one read. He had
  both warnings first.
- **This is an override, not a pass.** L2 was missed, and it stays missed: drift 93.58 % / 94.12 % within 25 cp (bar ≥ 95 %),
  80 / 79 cp (bar ≤ 75); audit 15.27 % (bar ≤ 0.5 %), 29 errors ≥ 200 cp (bar 0). No bar was re-read, moved or re-derived.
  § Context, the F1 row and the verdict below stand as written. The title and file name keep "its premise is not met",
  because that is still true and sealed notes cite the path.
- **It goes past a safety guard, not only a pay gate.** In `ABC-283` the owner's word set aside pay gates. Here P4 enters past
  `ADR-0061`'s audit and the drift rows, the rows it failed alone.
- **R-BUNDLE-1, and what this override adds to it.** R-BUNDLE-1 (`…ce2883d8`) accepts that a bundle's single read may hide a
  part with a small negative share. It was written about a part nobody could see. This override adds two risks the owner
  takes knowingly:
  1. **P4 enters past the audit and drift rows.** The bundle carries a part already read as outside those guards, with
     piece-sized errors, not a part of unknown sign.
  2. **The countermove has no measured pay** (`ADR-0073`, CH3 missed on all four). A pass cannot show that it earns its place.

  C2′ cannot answer either: credit is to the bundle (B5), and 100 games cannot tell +10 from −10. R-BUNDLE-1's mitigations
  stand and neither risk is mitigated further. Removing a part later is a value change with its own read.
- **What acceptance does here.** It opens the build, and it fixes form M3. Option (a) as put (`…37b7fb23`) reads "On a pass
  both ADRs are accepted as a bundle; on a miss both return to held", so:
  - **In force** only when the bundle merges on its read.
  - **On NOT MET,** B6 applies: this ADR returns to PROPOSED, premise not met, and `ABC-286` to held.
  - **B5's line** naming the bundle ticket and the read is owed when QE's verdict lands. The ticket is not cut yet (B7).
- **What the read holds:** `ADR-0056` D5's dated block of this task, tables 1–3. L2's drift share, cap and audit are
  reported. L2's 0 mate sign changes, L3 and L4 stay bars. C2′ is 100 games, GAIN ≥ 50.0.
- **The order:** bundle 1 reads before `ABC-289`, which reads alone (the same block).

*Before acceptance:* **PROPOSED 2026-11-04. PREMISE NOT MET ON `main`: F1 FIRED ON THE DRIFT AND AUDIT ROWS; THE BUILD DOES NOT START ON
ITS OWN.** Recorded by Architect/Design (task `arch-bundle-1`, on `grugops/arch-bundle-1` from `main` `0cc9afd1`). The
probe ran on scratch copies of `src/`, under the host lock. Nothing was committed to `src/` or `tools/`. No game was
played.
- **The bundle.** Part of bundle 1, named by the owner (`orch-2026-10-30a` `…3b15b361`): `ABC-286` (this ADR) +
  `ABC-288` (`ADR-0073`), under `ADR-0056` § the bundle read.
- **The method.** PREREG `…aa5c4dc1` (commit `59a98278`) sealed the forms, bars and rules before any run. The readings
  are observation `…ed82b408`, the design decision `…37b7fb23`; the raw files are in `.grugops/context/arch-bundle-1/raw/`.
- **The verdict, by that rule.** No form of five meets every bar. M3 is carried by Rule B, as the only form meeting
  Safety and Pay. On its own door in the bundle it meets Safety and Pay and misses drift and the audit (§ Context).
  **No form is tuned after the read.**
- **The audit miss is not close.** Every form reads 13.9–17.6 % against ≤ 0.5 %. Doubling the counts (M5) moves it by
  two points. A count has no margin, so the bar `ADR-0061` calibrated on a margin rule may be out of reach for any form
  of this rule. That is a reading of five forms, not a proof.
- **Acceptance is the owner's** (`OQ-0072-1`). A new ADR is his, and this one enters the build only by his word
  (`ADR-0056` B2 (d), B6, the fourth guard). **The recommendation is stated in the decision note and it is a
  recommendation over a miss.**
- **Default without an answer:** no move-count pruning on `main`; `ABC-286` stays held at DoR 9/10.
- **What it amends:** no ADR. It follows `ADR-0026` decision 10's pattern. It re-opens `ADR-0061` § Alternatives' P4
  row on the premise that row named.

## Decision log

| date (UTC) | by | what | record |
|---|---|---|---|
| 2026-11-04 | Architect/Design | PREREG sealed before any run | `arch-bundle-1` `…aa5c4dc1`, `59a98278` |
| 2026-11-04 | Architect/Design | PROPOSED. M3 carried. L3 and L4 met; L2 missed; F1 fired | `arch-bundle-1` `…ed82b408` (readings), `…37b7fb23` (decision) |
| 2026-11-04 | Owner | (a): override both missed premises and build both; OQ-0072-1 answered | `orch-2026-10-30a` `…3e73f9f9` |
| 2026-11-04 | Architect/Design | **ACCEPTED over a missed premise, not in force.** F1 stays fired. The rows the read holds are ruled in `ADR-0056` | `arch-owner-answers-1104b` |

## Context

`ADR-0056` D2 row P4 estimates +20–40 Elo (an estimate). Alone on an older `main`, in generation order, it read
87.7–89.3 % within 25 cp and 11.5–11.9 % audit flips (`ADR-0061`). `ADR-0063` d11 named the re-open: a joint probe over
the history table. `ABC-283` put that table on `main` (`58e90d07`).

**What the probe measured, door `main`.** Ratios at depth 8: `search()` kiwipete, `chooseMove` kiwipete, `search()`
position-6, `chooseMove` position-6. Reach is the gain in mean completed depth at 47 000 nodes on the 190, from 6.868.
Drift is at depth 5 on the 190. Bold marks a miss.

| form | d8 | reach | drift `search()` / `chooseMove` | mate floor | `G1` | audit flips; errors ≥ 200 cp |
|---|---|---|---|---|---|---|
| M1 T = 4 / 7 / 12 | 0.59 / 0.81 / 0.70 / 0.94 | +0.116 | **90.91 %, 123 / 93.58 %, 79** | **1 / 189** | **53, 1 new** | **16.43 %; 24** |
| M2 M1, key 0 only | 0.59 / 0.81 / 0.64 / 0.94 | +0.127 | **90.91 %, 123 / 93.58 %, 79** | **1 / 189** | **53, 1 new** | **15.98 %; 29** |
| **M3 M2, three pieces** | 0.59 / 0.81 / 0.64 / 0.94 | +0.111 | **93.05 %, 80 / 94.12 %, 79** | 0 | 54 | **16.43 %; 28** |
| M4 M2, d ≤ 2 | 0.74 / 0.84 / **1.00** / 0.90 | +0.132 | **91.44 %, 123 / 94.12 %, 79** | **1 / 189** | **53, 1 new** | **17.59 %; 25** |
| M5 M2, T doubled | 0.69 / 0.88 / **1.01** / 0.82 | **+0.095** | **93.05 %, 80** / 96.26 %, **79** | 0 | 54 | **13.85 %; 11** |

Every form reads zugzwang 7 / 7 and 0 mate sign changes.

**The graded rows: M3 on its own door in the bundle** (`C1+M3` over `C1`).

| row | bar | read | |
|---|---|---|---|
| L3 mate floor | 0 | 0 on every row, all on and per part | met |
| L3 zugzwang, `G1` | 7 / 7; ≥ 54 / 58, none new | 7 / 7; 54 / 58, none new | met |
| L4 d8 | ≤ 0.95 ×, four readings | 0.6039 / 0.8170 / 0.7509 / 0.8363 | met |
| L4 reach | ≥ +0.10 | +0.116 (6.900 → 7.016; 33 deeper, 13 shallower) | met |
| L2 drift share | ≥ 95 % within 25 cp | 93.58 % / 94.12 % | **missed** |
| L2 drift cap | ≤ 75 cp | 80 / 79 | **missed** |
| L2 audit flips | ≤ 0.5 % | 288 of 1 886, 15.27 % | **missed** |
| L2 audit errors | 0 ≥ 200 cp | 29 (9 ≥ 300, 0 ≥ 500) | **missed** |

- **What history bought P4.** The floor and `G1` are green on M3 and the pay is real. Drift in `search()` rises from
  87.7 % (the same count in generation order, `ADR-0061`) to 90.91 % for M1 and 93.58 % for M3. The audit does not
  improve.
- **Reach is well below `ADR-0061`'s +0.34 to +0.50.** Futility is now in force and takes much of the same work.
- **The flips are one-sided.** 285 of 288 are the head failing low where the door fails high, and d1 carries most
  (22.97 %). At d1 a node that futility left alone stands near alpha, so one of the skipped quiet moves often reaches it.
  That this explains the rise over `ADR-0061`'s figure is `UNKNOWN - verify`.
- **The root move moves.** At d8 kiwipete plays e2a6 for d5e6 in both recursions; 20 of the 190 change at 47 000 nodes.

**The mate floor is order-sensitive (`R-283-LMR`), and the three-piece clause is what holds it.** M1, M2 and M4 lose the
KRK row `6k1/R7/5K2/8/8/8/8/8 w` in `chooseMove` at d5. With LMR off and P4 still on, M1 and M4 return the mate
(exploratory). So the loss runs through LMR, not through P4's own skip. M3 stops P4 acting in that ending.

## Decision

The design of record is M3. It is the form a yes builds. It is not cleared to build without the owner's word.

1. **The rule.** At a node in either recursion where every condition holds:
   - it is not the root (`ply > 0`);
   - it was entered with a null window (`alphaIn + 1 === beta`);
   - the remaining depth d is 1, 2 or 3;
   - alpha and beta are both strictly inside (−`MATE_FLOOR`, `MATE_FLOOR`);
   - the side to move is not in check;
   - the side to move has at least three non-pawn pieces (`NULL_MOVE_MIN_PIECES`, the null move's guard).

   Then, once **T[d] quiet moves have been searched** at the node, every later move in the ordered list whose ordering
   key is 0 and that neither captures nor promotes nor gives check is skipped: not made, not searched, not counted as
   a node.
   - A skipped quiet move does not count as searched, and neither does a futility skip.
   - A quiet move that gives check is searched and counts.
   - **The index still advances past a skipped move,** as futility's does, so LMR's index of later moves is unchanged.
   - The node returns the best score among the moves searched and stores it as today (`boundOf(best, alphaIn, beta)`).
2. **The values, by a stated rule.** T[d] = 3 + d²: **T = 4 / 7 / 12** for d = 1 / 2 / 3. It is the textbook's slower
   count, and the form on record in `ADR-0061`. The textbook's halved count needs an "improving" term, and this search
   keeps no static-evaluation stack, so there is none. The depth bound is `ADR-0061`'s futility bound. One module
   constant, `MOVE_COUNT_LIMIT = [0, 4, 7, 12]`.
3. **The order against history, killers and K3.**
   - P4 reads the order and changes no key. The hash move, the captures, the killers, the countermove (`ADR-0073`) and
     the losing captures sit above every zero key, so none of them can be skipped by this rule.
   - **"Key 0" is K3's zero tier** (`ADR-0063` d4): a quiet move with no positive evidence. A quiet move with a positive
     key is never skipped. So the skipped moves are a tail of the list, and the tail is read once, straight after the
     sort.
   - **The malus** (`recordHistoryCutoff`, `ADR-0063` d2): a skipped move was never searched, so it gets none. The node
     passes the first skipped index, and a late checking cutter skips the same moves in the malus loop as the search
     did.
4. **Two new exported pure functions in `src/search.ts`.**
   - `moveCountNode(position, depth, ply, alphaIn, beta): number` returns T[d], or 0 for no pruning. Decision 1's node
     test, with check and material derived from the position (`ADR-0026` decision 6).
   - `moveCountFrom(count): number` returns the first index with key 0, read from `ORDER_KEYS` before any recursion.
   - The move test is `futileMove` as it stands.
5. **One switch, `moveCount`, in both recursions** (`Switches`, `Heuristics`), on in `search()` and `chooseMove` only.
6. **The doors.**
   - `searchWithoutMoveCountPruning(position, depth)` and `chooseMoveWithoutMoveCountPruning(position, options)`: this
     part off, everything else on.
   - **The all-off door:** `searchWithoutQuietBundle` and `chooseMoveWithoutQuietBundle` turn off this part and
     `ADR-0073`'s. Node for node they are `main` (P0): 523 847 / 234 214 for `search()` and 707 548 / 101 425 for
     `chooseMove`, d8, kiwipete / position-6.
   - **Every older door turns both parts off** (`ADR-0026` decision 3), `searchWithoutHistory` and
     `searchWithoutBundle` included. Rows re-point by `ADR-0050` d4, `ADR-0058` d5, `ADR-0059` d6, `ADR-0061` d6. No
     zugzwang row's depth is re-pinned.
   - **Export lists:** this ADR and `ADR-0073` together grow `ABC-077` A6 by seven and `ABC-078` A4 by three.
7. **The rows, and the lane budget** (`…112cd856` item 2's terms: ≤ +0.1 s of lane, no new default-lane file, any row
   ≥ 50 ms goes deep).
   - **Default lane, in the existing `src/search.bundle.test.ts`:** `moveCountNode` called directly at each clause, one
     row each; `moveCountFrom`; the malus row; the source row for both `negamax` bodies. Constructed positions and
     direct calls, no search above depth 2.
   - **Deep, the same file, `SEARCH_DEEP=1`:** P0, the head's counts, the same-depth floors in both recursions.
   - Zugzwang and `G1` stay on the shipped path where they stand.
   - The rows that pin shipped-path counts re-point to the all-off door, old and new figures in the PR.
     *Dated 2026-11-04 (`arch-ABC-303-open`, records only at `main` `c118a5cf`; `se-ABC-303` `…75e4058e` item 4): **`ABC-279`
     A3 (a) re-points under d6, not under this bullet.** This bullet names count rows, and that row is `ADR-0069` F1's drift
     bar. Decision 6 is the sentence that governs it: "Rows re-point by `ADR-0050` d4, `ADR-0058` d5, `ADR-0059` d6, `ADR-0061`
     d6", and those name the d5 drift rows. So the re-point at `de15cfb2` is allowed, its bars stand, and the 90.91 % read on
     the shipped path is no red, no STOP and no owner question. The override is not what allows it: his word reaches
     L2 and CH3 and nothing else. The row's final door is `ADR-0069` d11's dated line of this date. The PR lists the row
     and prints 90.91 %, 96 cp, 0 changes beside it (`ADR-0058` d5).*
8. **What this part still shows alone** (`ADR-0056` B2).
   - (a) Its door pair and its rule rows. (c) The form above, fixed.
   - (d) **Its measured bar: L2 and L4, on its own door.** L4 is met. L2 is missed, so (d) passes only by the owner's
     lift. Under a lift, drift and the audit are reported, each reproduced to the count on the build; a count that
     differs is explained before anything else is read.
     *2026-11-04 (`arch-owner-answers-1104b`): the lift is given (`…3e73f9f9`). L2's drift share, cap and audit are reported;
     L2's 0 mate sign changes and L4 stay bars. "Reproduced to the count" is ruled in `ADR-0056` D5's dated block of this
     date: exact on an unmoved base, both sets in the PR on a moved one, no ceiling.*
   - (e) `G2`, `G6`, `NFR-008` with all parts on.
9. **The bars the build carries, by the PREREG's rules.**
   - **L3:** the floors at 0, every row of Step C; zugzwang 7 / 7; `G1` ≥ 54 / 58, none new.
   - **L4 (a):** d8 on its own door ≤ **0.89 ×** on each of the four, ⌈100 · (0.8363 + 0.05)⌉ / 100.
   - **L4 (b):** reach ≥ door + **0.10**, max(0.10, ⌊20 · 0.7 · 0.116⌋ / 20).
   - **Instrument counts, on `0cc9afd1`:** the bundle's d8 is 311 546 / 163 523 for `search()` and 573 518 / 94 911 for
     `chooseMove`, with reach 7.016. If `main` moves first, the door's counts are re-read and a re-derived count is a
     dated line here, never a moved bar.
   - *2026-11-04 (`arch-owner-answers-1104b`):* "every row of Step C" reads as PREREG rows B1, B2 and every B3 row. `chooseMove`
     d6 and `krk` stay reports, as the PREREG calls them. `ADR-0056` D5's dated block of this date is the list the briefs copy.
10. **The read, the bundle's alone** (`ADR-0056` B4). One C2′, 100 games at 100 ms, all parts on against the merge-base,
    **GAIN ≥ 50.0**, S′ at E 1 810, the Levels deep lane, the PREREG sealed first, never re-played, no subset read
    instead. Credit is to the bundle (B5). On NOT MET both parts go back to held (B6).
    - **The intent, by the rule:** GAIN. It fires at 100 ms: 5.91 nodes per 1 000 visited, 7.47 % of eligible nodes, an
      average of 24 moves skipped at each.
    - **R-TC:** the rule reads no budget, deadline or environment.
11. **The merge interactions.**
    - **`ABC-282` (W1, `ADR-0071`).** Both edit `src/engine.ts`, and the same `runIteration`: this bundle changes its
      `searchMove` call (`ADR-0073` d3), W1 adds the partial register. The doors take no `softMs`.
      - **b = 2.3 depends on the tree's growth,** and P4 changes it. Whichever lands second re-reads b by P1's method
        (`ADR-0071` D12 item 3) and A0's counts.
      - If W1 lands first, the bundle's merge moves a frozen constant. The re-read is reported to the Orchestrator, and
        any change to b is its own ticket with its own read, because W1's A6 will have been read on the old one.
      - W1 acts in `uci-clock-mode` only, so it moves no node of C2′'s games. Its merge is still a value-changing merge,
        so C2′'s stale rule applies by its letter.
    - **`ABC-298` (V3).** One at a time on `orderMoves`.
      - `moveCountFrom` assumes one sorted list whose keys stand in `ORDER_KEYS`. Staged generation sorts by stage, so
        the tail is read at stage 3.
      - `recordHistoryCutoff` reads the searched prefix of `list`, and that prefix must survive staging.
      - Whichever lands second re-reads the other's identity rows: P0 here, SG1 there.
    - **`ABC-302` lands first,** as the Orchestrator ruled for `ABC-282` and `ABC-301`: the lane has no headroom before it.

## What would falsify this

| # | clause | what would falsify it | how to check | if it fires |
|---|---|---|---|---|
| **F1** | the premise (L2, L3, L4) | a graded row missed on the joint probe | PREREG `…aa5c4dc1`, Step C | **fired 2026-11-04 on L2**: drift and audit. Held; no form tuned; the owner's word or nothing |
| **F2** | 5, 6 — the doors | the all-off door not node-equal to `main`, or an older door not node-equal to itself | P0, `G4` | a defect in the wiring |
| **F3** | 1, 3 — safety | a floor row, zugzwang or `G1` red on the build | decision 9 | `ADR-0056` B3: read per part, name the cause, a structural dated line, every safety row read again. If no single door clears it, a STOP to Architect/Design. Never a re-pin, a deeper depth or a tune. **`R-283-LMR`: the next lever is LMR (`ADR-0060`), not history or T** |
| **F4** | 10 — the read | C2′ below 50.0, or an S′ collapse | decision 10 | NOT MET; B6 |
| **F5** | 3 — the malus | a skipped move's cell changed by the node's cutoff | the malus row | a defect |

## Alternatives

- **M1, the bare count, and M2.** They lose a KRK mate at d5 and a `G1` line. Rejected.
- **M4, d ≤ 2.** It loses the same rows and costs nodes on position-6 `search()`. Rejected.
- **M5, T doubled.** Safety met. It misses the d8 bar (1.0056), reach (+0.095) and the audit. It is the kindest form on
  the audit, and it still reads 13.85 %. A form with no pay and the same miss has no case.
- **An "improving" term.** Not on `main`; it needs a static-evaluation stack. Not measured, and not added after a read.
- **Skip by the list index, not the searched-quiet count.** Not taken. The count is the form on record, and an index
  rule would spend the limit on captures.
- **Withdraw P4.** It is the default without an answer. Not written as the decision, because the safety rows and the
  pay are met and the owner may judge the audit's bar for a count rule.

## Consequences

- **NFRs.**
  - `NFR-009`: one 4-entry constant, no table.
  - `NFR-005`: `G6` "≥ base" binds; P4 should raise depth.
  - `NFR-008`: decision 7; ≤ +0.1 s.
  - **`G2`, a report:** the probe reads door / head 0.9873 on kiwipete and 1.0508 on position-6 for P4 alone, and
    0.9921 / 1.0537, mean 1.0229, with both parts on. The build reads it.
  - No new NFR file. `plans/nfr-catalog.md` is untouched.
- **Cost per node:** one `isInCheck` and one piece scan where the earlier clauses pass, and `givesCheck` per skipped
  move. 709 943 of 8 973 453 nodes pass the whole node test at 100 ms.
- **The host:** C2′ ≈ 0.4 h, S′ ≈ 10 min, the Levels deep lane ≈ 10 min, for the bundle, once.
- **Determinism (`ADR-0027`):** a function of the search path only.
- **P1 (`ABC-284`):** it reads the same index. It stays apart, and these rows add to `R-283-LMR`.
- **Migration:** none.

## Rollback

- **Now:** nothing was built. To withdraw, mark this ADR `withdrawn`.
- **After it ships:** set `moveCount` to false in `search()` and `chooseMove`, two booleans. Removing one part of a
  merged bundle is a value change with its own read (`ADR-0056` B5). The rest is a mechanical revert.
