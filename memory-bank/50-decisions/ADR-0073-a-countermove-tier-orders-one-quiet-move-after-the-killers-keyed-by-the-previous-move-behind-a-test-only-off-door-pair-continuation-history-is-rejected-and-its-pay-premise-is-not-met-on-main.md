---
kind: adr
id: ADR-0073
---
# ADR-0073: O2c, the countermove. The last quiet move that cut after a given previous move sorts as one tier after the killers, from a 3 072-byte table cleared with the history table, in both recursions behind a test-only off-door pair. Continuation history is rejected on the mate floor and on pay. The pay premise is not met on `main`

## Status

**PROPOSED 2026-11-04. PREMISE NOT MET ON `main`: F1 FIRED ON CH3; THE BUILD DOES NOT START ON ITS OWN.** Recorded by
Architect/Design (task `arch-bundle-1`, on `grugops/arch-bundle-1` from `main` `0cc9afd1`). The probe ran on scratch
copies of `src/`, under the host lock. Nothing was committed to `src/` or `tools/`. No game was played.
- **The bundle.** Part of bundle 1, named by the owner (`orch-2026-10-30a` `…3b15b361`): `ABC-286` (`ADR-0072`) +
  `ABC-288` (this ADR), under `ADR-0056` § the bundle read.
- **The method.** PREREG `…aa5c4dc1` (commit `59a98278`), sealed before any run. The readings are observation
  `…ed82b408`, the design decision `…37b7fb23`.
- **The verdict, by that rule.** Rule A picks C1, the countermove alone, as the only form meeting Safety. On its own
  door in the bundle it reads 1.0031 / 0.9999 / 1.0935 / 0.9989 against ≤ 0.95 on each: **all four miss.** No form is
  tuned after the read.
- **The form narrows `ABC-288`'s scope.** Its title and scope name countermove and continuation history. The ADR
  governs each line, but dropping one is a scope change, so it is put to the owner with the acceptance.
- **Acceptance is the owner's** (`OQ-0073-1`). This ADR enters the build only by his word (`ADR-0056` B2 (d), B6, the
  fourth guard). The recommendation is in the decision note, and it is a recommendation over a miss.
- **Default without an answer:** no countermove on `main`; `ABC-288` stays held at DoR 9/10.
- **What it amends, on acceptance:** `ADR-0063` d4's tiers gain one tier, and d2's update call gains the table's write.

### Why a new ADR and not an `ADR-0063` amendment

- **`ADR-0063` is accepted on another read.** Its Status names `ABC-283`'s 66.0 / 100 as the bundle's. `ADR-0056` B5
  says each part's ADR names its bundle ticket and read, so one ADR would carry two reads and two bundles.
- **This is a new table with its own door pair, falsifiers and pay gate.** `ADR-0063`'s own door must stay what it is.
- **`ADR-0056` B5 needs a part to be removable by its door.** A change folded into `ADR-0063` has no record of its own
  to withdraw on a miss. On a B6 miss `ADR-0063` would have to be un-amended.
- **What does amend it is small:** two lines, by reference. A dated pointer goes into `ADR-0063` at acceptance.

## Decision log

| date (UTC) | by | what | record |
|---|---|---|---|
| 2026-11-04 | Architect/Design | PREREG sealed before any run | `arch-bundle-1` `…aa5c4dc1`, `59a98278` |
| 2026-11-04 | Architect/Design | PROPOSED. C1 picked; CH1 and CH2 rejected; safety met; CH3 missed; F1 fired | `arch-bundle-1` `…ed82b408` (readings), `…37b7fb23` (decision) |

## Context

`ADR-0056` D2 row O2c estimates +10–30 Elo ([J], the lowest confidence). `ABC-283` put the history table on `main`.
`ADR-0063` § Why the pay is small said what to expect: the killers already hold about 90 % of quiet cutoffs.

**What the probe measured, each form alone, door `main`.** Ratio order as in `ADR-0072`. Reach is from 6.868. Floor is
violations on B1 / B2 / R1, of 191 / 189 / 209. Bold marks a miss.

| form | d8 | geomean | reach | floor | drift `search()` / `chooseMove` |
|---|---|---|---|---|---|
| **C1 countermove** | 0.9848 / 0.9922 / 0.9298 / **1.1190** | 1.0041 | +0.032 | 0 / 0 / 0 | 100 %, 0 / 100 %, 12 |
| C2 CH1 | 0.9989 / 0.9998 / 1.0068 / 0.9996 | 1.0013 | 0.000 | **1** / 0 / 0 | 100 %, 0 / 100 %, 0 |
| C3 CM + CH1 | 0.9830 / 0.9921 / 0.9260 / **1.1207** | 1.0030 | +0.027 | **1 / 1** / 0 | 100 %, 0 / 100 %, 12 |
| C4 CM + CH1 + CH2 | 0.9831 / 0.9924 / 0.9302 / **1.1207** | 1.0042 | 0.000 | **1 / 1 / 1** | 100 %, 0 / 100 %, 12 |

All four read zugzwang 7 / 7 and `G1` 54 / 58.

**The graded row:** C1 on its own door (`C1+M3` over `M3`), d8 **1.0031 / 0.9999 / 1.0935 / 0.9989**. Drift 100 %, 9 cp /
100 %, 4 cp. The floor reads 0 on every row, all on and per part.

- **Why the pay is small.** At 47 000 nodes 94.6 % of cutoffs fall on the first move and the killers hold 88.5 % of
  quiet cutoffs. The countermove takes 3.4–4.6 % of quiet cutoffs, and the mean index moves from 0.420 to 0.401.
- **What it does buy.** Reach alone +0.032. With P4, 7.016 against P4's 6.979. That is small, and it is not a bar.
- **O2c barely moves P4's rows.** The audit reads 15.27 % over C1 and 16.43 % without it; drift is unchanged to within
  a point. `ADR-0056`'s candidate-bundle reason, that O2c changes the order P4 prunes by, is true and small.
- **Continuation history buys no node at all.** CH1 alone moves each reading by under 1 %, and it costs 576 KiB a
  table. It also loses KQK mates at d5 and d6. With LMR off those rows return the mate (exploratory, `R-283-LMR`'s
  class).

## Decision

The design of record is C1. It is the form a yes builds. It is not cleared to build without the owner's word.

1. **The table.** One module-scope `Int32Array(768)` in `src/search.ts`: **3 072 bytes**, keyed by the previous move's
   coloured piece (12) × to-square (64). A cell holds the last quiet cutter there as from × 128 + to + 1; 0 is empty.
   Data only, never a switch (`ADR-0026` decision 2). Both recursions share it.
2. **The update,** inside `recordHistoryCutoff`, so at the same point as history (`ADR-0063` d2): a main-tree beta
   cutoff by a quiet move, in both recursions, overwrites the cell of the node's previous move. No write in quiescence,
   at the root, or on a null-move cutoff.
3. **The previous move reaches a node as an argument,** like `afterNull` and `phase`: never state. `negamax` and
   `searchMove` carry it, written by the parent. It is "none" at the root and at a null move's child. No bytes.
4. **The lifetime:** cleared with the history table (`ADR-0063` d3), at every `search()` entry and every `chooseMove`
   call; kept across `chooseMove`'s iterations.
5. **The order against history, killers and K3.** `orderKey`'s tiers become:
   - the hash move, 3 000 000;
   - captures and promotions, 1 000 000 + MVV-LVA;
   - killers, 500 000 + rank;
   - **the countermove, 400 000;**
   - losing captures, 100 000 + MVV-LVA;
   - every other quiet move, max(0, h).

   A move that is already the hash move or a killer keeps its higher tier. A countermove that is not in the list adds
   nothing. **K3 is untouched:** h keeps its key, and the countermove is a promotion only, so it demotes no move. A
   promoted countermove carries a non-zero key, so `ADR-0072` cannot skip it.
6. **One switch, `countermove`, in both recursions,** on in `search()` and `chooseMove` only. Off, nothing is read or
   written. `orderMoves` takes the node's countermove as a sixth argument, default none, so a five-argument call is
   today's comparator.
7. **The doors.**
   - `searchWithoutCountermove(position, depth)` and `chooseMoveWithoutCountermove(position, options)`: this part off,
     everything else on.
   - **The all-off door:** `searchWithoutQuietBundle` / `chooseMoveWithoutQuietBundle`, `ADR-0072` d6.
   - Every older door turns it off.
   - `ABC-077` A6's growth counts this door, `countermoveByteLength()` for `NFR-009` (a), and `countermoveAt(move)`, a
     read-only probe for the update row.
8. **The rows and the lane budget:** `ADR-0072` d7's terms. Default lane, in the existing `src/search.bundle.test.ts`: the
   update, the read, the clear and the byte size, one row each; the tier row; the source row. All direct calls.
9. **What this part still shows alone** (`ADR-0056` B2).
   - (a) Its door pair and rows. (c) The form above, fixed.
   - (d) **Its measured bar, CH3:** missed on all four, so it passes only by the owner's lift. Under a lift the four
     ratios are reported per part, as `ABC-283`'s were, on its own door and alone over `main`.
   - (e) `G2`, `G6`, `NFR-008` with all parts on.
10. **The bars the build carries, by the PREREG's rules.**
    - **CH2:** the floors at 0, zugzwang 7 / 7, `G1` ≥ 54 / 58 none new. Drift ≥ 95 % within 25 cp, none beyond **25 cp**
      (max(25, min(75, ⌊1.5 × 9⌋))), 0 sign changes.
    - **CH3:** ≤ **0.95 ×** on the four, or reported under a lift.
11. **The read:** the bundle's, `ADR-0072` d10. GAIN ≥ 50.0, never re-played. **The intent:** GAIN. It fires at 100 ms:
    it changes the order at 8.74 % of full-width nodes, and a countermove is in the list at 33.55 %.
12. **The merge interactions:** `ADR-0072` d11, with two lines of its own.
    - **`ABC-282`:** decision 3 adds an argument to `searchMove`, whose root call sits in `runIteration`, W1's function.
    - **`ABC-298`:** the countermove joins stage 3 after the killers, and V3's SG1 counts are frozen on whichever `main`
      carries this tier.

## What would falsify this

| # | clause | what would falsify it | how to check | if it fires |
|---|---|---|---|---|
| **F1** | the premise (CH3) | a d8 reading above 0.95 × on its own door | PREREG `…aa5c4dc1`, Step C | **fired 2026-11-04, on all four.** Held; no form tuned; the owner's word or nothing |
| **F2** | 6, 7 — the doors | a door not node-equal to its pre-ticket search | P0, `G4` | a defect in the wiring |
| **F3** | 5 — safety | a floor row, zugzwang or `G1` red on the build | decision 10 | `ADR-0056` B3. **`R-283-LMR`: the next lever is LMR (`ADR-0060`), not another history form** |
| **F4** | 11 — the read | C2′ below 50.0, or an S′ collapse | decision 11 | NOT MET; B6 |
| **F5** | 4 — the lifetime | the table non-zero at a search's entry, or changed by a door | the clear row | a defect (`ABC-080` A6) |
| **F6** | 1 — `NFR-009` | the table's bytes differ from 3 072 | the byte row | a defect |

## Alternatives

- **Continuation history (C2, C3, C4), the ticket's other half.** Rejected by Rule A: it loses a mate on the floor rows
  and buys no node. A form with a separate floor per term was not in the PREREG and is not added after a read.
- **The countermove inside the quiet key, not a tier.** Not measured. A tier is the textbook form, and it keeps the
  move out of `ADR-0072`'s zero tier.
- **The countermove below the losing captures.** Not measured. `ADR-0065` d3 puts those last among the moves worth
  trying early, and a quiet refutation is the better guess.
- **An `ADR-0063` amendment.** § Status says why not.
- **Drop O2c from the bundle.** The owner's call (`OQ-0073-1`). It leaves a single-part read of `ABC-286`.

## Consequences

- **NFRs.**
  - `NFR-009`: +3 072 bytes, fixed, allocated once, no growth with search time. In all about 4.6 MiB of 16 MiB.
  - `NFR-005`: `G6` reads it.
  - `NFR-008`: `clearHistory` ran at least 2 636 times in one default lane; the clear reads 0.2 µs, so under 1 ms.
  - No new NFR file. `plans/nfr-catalog.md` is untouched.
- **Cost per node:** one compare per quiet move in `orderKey`, and one cell write per quiet cutoff. The probe reads door
  / head 1.0042 / 1.0093 for this part alone (a report).
- **Determinism (`ADR-0027`), threads (`ADR-0062`):** as `ADR-0063`.
- **Migration:** none.

## Rollback

- **Now:** nothing was built. To withdraw, mark this ADR `withdrawn`.
- **After it ships:** set `countermove` to false in `search()` and `chooseMove`, two booleans. Removing a merged part
  is a value change with its own read (`ADR-0056` B5).
