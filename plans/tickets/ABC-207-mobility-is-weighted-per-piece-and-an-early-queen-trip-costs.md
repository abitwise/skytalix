---
id: ABC-207
title: "Mobility is weighted per piece, with the queen lowest per square, and an early queen trip before the minor pieces are out costs a little"
status: ready
column: Ready
size: S
priority: P3
epic: EPIC-008
feature: —
adr: "none if ADR-0031 D2's attack-map form stays; a different form is an ADR-0031 change, routed to the owner"
---

# ABC-207: per-piece mobility weights and a small early-queen term

> **Cut 2026-10-23 by BA/PM** (task `bapm-cut-engine-strength`, records only, at `main` `55a8f4ef`). Proposal 4 of
> `…f1771bb3`; owner word `…7feb0553`.
>
> **ADR touch point: conditional.** Weights and a new small term keep `ADR-0031` decision 2's attack-map form, so no ADR
> is expected. If the design changes the form, it is an `ADR-0031` change. The Orchestrator then reports the text to
> the owner when it lands.

## Problem

- **User:** the owner at level 5.
- **Pain:**
  - 4.Qa4?! (72 cp): nothing in the evaluation penalises an early queen move or rewards development. Mobility pays
    every queen square the same 4 cp as a minor piece's square (`src/evaluate.ts:199`, `:355-356`).
    *Re-read 2026-10-25 at `main` `bb9fd7ef`:* these lines are now `:201` and `:357-358`, because `ABC-214` added
    two header lines. The text is unchanged.
  - Before 8.e5, mobility was 88 cp of a 148 cp static score, close to its 100 cp cap. A mobility-heavy score rewards
    space grabs.
- **Evidence:** a probe with queen mobility at ¼ weight plus a centre-king term turned 4.Qa4 into 4.e4, which is
  Stockfish's move.
- **Value:** fewer early queen trips and space grabs. It ships only if D says so.

## Scope

1. A mobility weight per piece type, with the queen's per-square weight **strictly lowest** of the four non-pawn types.
   The values are the Architect's or Engineer's. The `±100 cp` clamp stays.
2. One small term: while a side's queen has left its home square and **≥ 2** of that side's minor pieces are still on
   their home squares, that side is charged. The size and phase cut-off are the design's. The term is 0 in an endgame.

## Out of scope

- A new mobility form (that would be `ADR-0031`), king safety (`ABC-205`), search changes, and a general development
  table.

## Acceptance criteria

- **`A1` (per-piece weight).** **Given** two positions equal but for one extra reachable square, **then** the extra
  square is worth **strictly less** to a queen than to a knight, bishop or rook, **with the mobility clamp not engaged
  in either position**.
- **`A2` (the early-queen term).**
  - **Given** a position with White's queen on `a4`, both White knights and both bishops home, and Black's queen home,
    **then** it scores **strictly lower** for White than the same position with White's queen on `d1`.
  - **Given** the same pair with all four White minors developed, **then** the term contributes **0** to the
    difference.
  - **Given** an endgame with no minor pieces, **then** the term contributes **0**.
- **`A3` (existing evaluation gates).** `G3`, which includes `ABC-083` `A4`'s ±100 cp mobility bound, and the mirror on
  **≥ 10 new positions** that exercise both terms. `G2` ≤ 1 100 ns, with the base in the same session. Above that bar:
  STOP to Architect/Design (`ADR-0031`).
- **`A4` (search and NFR gates).** `G1`, `G5`, `G6` (depth ≥ 6 and ≥ base), `G8`, `G9`, and `G10` for any red.
- **`A5` (the reading).** **Given** `ABC-204` is Done, **then** D meets ship rule **S1**. **Reported:** X ± Y, and
  `G11`. The 4.Qa4 and 8.e5 choices are of interest.

## NFR triggers

- `G2` ≤ 1 100 ns. `NFR-005`, read by `G6`. `NFR-004` and `NFR-008` are re-read.
- Bounds moved: none planned.
- Security: no limb, no hop.

## Test notes

1. Relation rows go in `src/evaluate*.test.ts` (default lane). Report `N8-LANE`.
2. `A1`'s pair must keep the clamp out of play, or the relation reads the clamp and not the weight.
3. UAT is owed (production lines). The QE verdict signs it.
4. **Frozen-clock pre-check (a process step, no bound).** *Added 2026-10-25 by BA/PM (`bapm-close-ABC-205`), from
   Architect/Design `…912bcb0d`.*
   - **When:** before this ticket's real-clock `G6` reading.
   - **What QE reports:** the nodes each build needs to complete depths 7 and 8 on `kiwipete` and `position-6`
     (`chooseMove`, `now: () => 0`, `maxDepth: k`), for base and head. That is 8 counts.
   - **What a high count means.** Base "straddles" a depth when a build value-identical to base reached it in some,
     but not all, of its last recorded 3 s `G6` runs. On `main` today that is `position-6` depth 8 (3 of 5 runs in
     `qe-ABC-205`). If head needs more nodes than base at such a depth, a `G6` miss is predicted. QE then stops to
     Architect/Design before the run, and the bar is not re-levelled.
   - If no value-identical base reading exists, QE reports the counts and makes no prediction (`UNKNOWN - verify`).
   - The pre-check grades nothing and moves no bound. `G6` is still read as written.

## Dependencies

- **`ABC-205` merged.** It is the same file, and its merge is this ticket's D base.
- `ABC-204` Done.
- **Ready trigger:** `ABC-205` reaches Done, or BA/PM closes it under S1.
- *2026-10-25 (BA/PM, `bapm-close-ABC-205`):* **the Ready trigger is met.**
  - `ABC-205` was closed unmerged under S1 (`…154f2ced`; that page's § Close). Its code is not on `main`.
  - `ABC-204` is Done (merged `7f94e4cc`).
  - "`ABC-205` merged" above therefore reads as "closed". This ticket's D base is its own merge-base on `main`
    (`EPIC-008` § D).
  - `ABC-215` also edits `src/evaluate.ts`. Only one of the two is built and read at a time, and the Orchestrator
    picks the order (`ABC-215` § Dependencies: by default, `ABC-215` goes first).

## Size and priority

- **`S`:** weights, one small term, relation rows, one D reading.
- **`P3`:** low to medium gain (analysis § 6 item 4).

## Definition of Ready

BA/PM, 2026-10-23, at `main` `55a8f4ef`. **Result: 9 of 10. `Backlog`** until the Ready trigger above.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ 4.Qa4 and the 88 cp of mobility, cited |
| 2 | scope and out-of-scope clear | ✅ two terms; the form, king safety and search fenced |
| 3 | INVEST-shaped | ✅ valuable alone; `S`; testable. Independent once `ABC-205` lands |
| 4 | acceptance testable and measurable | ✅ strict relations; the term is 0 where stated; ≤ 1 100 ns; ±100 cp; S1 |
| 5 | dependencies known | ✅ `ABC-205`, `ABC-204` |
| 6 | security/NFR triggers with a measurable target | ✅ `G2`, `G5`, `G6`, `G8` |
| 7 | test notes present | ✅ three |
| 8 | size assigned | ✅ `S` |
| 9 | priority assigned | ✅ `P3` |
| 10 | no major unresolved blocker | ⏳ held by sequence: `ABC-205` edits the same file, and its merge is the D base |

**Re-scored 2026-10-25 by BA/PM** (task `bapm-close-ABC-205`, at `main` `bb9fd7ef`). **Result: 10 of 10. `Ready`.**
Only these rows changed:

| # | item | verdict |
|---|---|---|
| 3 | INVEST-shaped | ✅ now independent: `ABC-205` is closed, and its code is not on `main` |
| 5 | dependencies known | ✅ `ABC-204` Done. `ABC-205` closed. The D base is the ticket's own merge-base. `ABC-215` goes one at a time with this ticket |
| 7 | test notes present | ✅ four (the frozen-clock pre-check added) |
| 10 | no major unresolved blocker | ✅ the sequence hold is gone. The owner's forward question on `G6` "≥ base" (`QE-205-c`) is open. Without an answer, the default keeps `G6` graded as written, so it does not block |

- **Risk, recorded and not a blocker.** Architect/Design expects this ticket's evaluation cost to be higher than
  `ABC-205`'s (`…912bcb0d`; `UNKNOWN - verify` until `G2` is read). With base on its `position-6` depth-8 edge, that
  makes a "≥ base" miss likely. Test note 4 is meant to catch it before the reading is spent.

## Design ruling

> **Architect/Design, 2026-10-25** (task `arch-design-ABC-207`, records plus probes, at `main` `0e2358ce`, whose
> `src/` is byte-identical to `5c91e2e4`, `ABC-215`'s merge). Notes: `.grugops/context/arch-design-ABC-207/notes/`.
> The probes ran on scratch clones in `<scratchpad>/arch207/` (`trees/base`, `trees/h` = head as designed, `trees/w` =
> the weights alone, `trees/q` = the queen term alone), never on `src/`. Plain node v26.11.1. **No real-clock search
> was run and no timing is quoted.** The real-clock rows of the deep lanes were filtered out by name. No `G6`, no
> game, no D. Every count below is deterministic. The base tree reproduces `qe-ABC-215` `…a34270bf`'s head counts
> exactly.

**Result.** Per-piece weights by one stated rule, and one early-queen term of ¼ pawn. **Both stay inside `ADR-0031`
decision 2's attack-map form and the ±100 cp clamp: no ADR change, no STOP.** Every relation row is green, unedited.
**12 pinned rows move in 4 files**, all by rules that already exist. No level, no NFR bound and no `ADR-0026` level
moves. `G1` 54/58 (= baseline). The frozen-clock pre-check predicts **`G6` MET**: position-6 needs **18.0 % fewer**
nodes than base to complete depth 8. **Size `S` holds. Do not split.** No owner word is needed.

### Scope 1: the weights (one rule)

| piece | cp per reached square | was |
|---|---:|---:|
| knight | 4 | 4 |
| bishop | 4 | 4 |
| rook | **2** | 4 |
| queen | **1** | 4 |
| king | 4 (unchanged; out of scope) | 4 |

- **Rule:** the minor pieces keep 4. A rook's square is worth half that, and a queen's a quarter. The more squares a
  piece type can reach on an open board (N 8, B 13, R 14, Q 27), the less one more square is worth to it. The
  quarter is the ticket's own probe (§ Problem, Evidence). The rule was fixed before any count was read.
- **`A1` by construction:** Q 1 < R 2 < N = B 4. A lone queen on d4 now earns 27 cp of mobility, against 100 (the clamp)
  at base. So `A1`'s pairs keep the clamp out of play with room to spare.
- **Form:** a `readonly number[]` indexed by `pieceType`, like `PIECE_VALUE`. The multiply moves from the clamp line
  onto each piece's reach: `mobility += ±squaresReached(…) × MOBILITY_WEIGHT[type]`, then the same ±100 clamp.
  `squaresReached` is unchanged. This is the attack-map count of `ADR-0031` decision 2 with a weight per type. It is
  not a subset of pieces, and it has no cache, no `Move` objects and no state. **No form change, so no `ADR-0031`
  change.**
- `evaluateWithoutMobility` passes an all-zero weight array instead of `0`. So `evaluate − evaluateWithoutMobility` is
  still exactly the clamped mobility term (`ABC-083` `A4`).

### Scope 2: the early-queen term

- **Condition, per side:** that side has a queen on a square other than its home square (d1 / d8), **and** at least 2
  of its four minor pieces stand on their home squares (knights b1/g1, bishops c1/f1; b8/g8, c8/f8 for Black).
- **Size: 25 cp, ¼ pawn** (`PIECE_VALUE[PAWN] / 4`). A side that meets the condition is charged 25. It is the same
  for both sides, so the mirror stays exact.
  - It must exceed the mobility an early queen trip earns at weight 1. On `A2`'s pair below, that is 18 cp (the queen's
    reach plus the king's freed d1). At 20 cp the pair reads only −2, too thin to rule on, so 25 is the ruled size.
    It stays well below a pawn.
- **Phase cut-off: the condition is the cut-off.** No phase counter is added. The term needs a queen of its own and
  ≥ 2 undeveloped minors, which no endgame position in practice has. `A2`'s endgame row ("no minor pieces") reads 0 by
  construction. *Rejected:* a material-phase counter. It costs work in the hot walk and changes nothing that `A2`
  reads (`ABC-205`'s phase is not on `main`).
- **Placement:** outside the mobility term and outside the clamp. The queen flag is set in the existing board walk
  (one compare per non-pawn piece). The four home squares are read only when that side's queen is off home. One
  private helper, no new export, no new walk, no state.
- A captured queen is not "left home": there is no queen, so there is no charge.

### How the tests read it (no new door)

- **`A1`:** pairs that differ by one reachable square for the piece under test. Read `evaluate − evaluateWithoutMobility`
  on each side of the pair. That difference is exactly the clamped mobility, so the queen's step is 1, the rook's 2
  and the minors' 4.
- **`A2` reads the term with `evaluateWithoutMobility`.** On a Qa4/Qd1 pair it is the term plus the `QUEEN_TABLE`
  difference (a4 and d1 are both −5, so 0). Probed on head:
  - minors home (`rnbqkbnr/pppp1ppp/8/4p3/Q7/2P5/PP1PPPPP/RNB1KBNR w KQkq - 0 3` against the same with Qd1):
    `evaluate` −7 (strictly lower), term −25;
  - all four white minors developed: term 0;
  - endgame with no minors (`5k2/4q3/8/8/Q7/8/4P3/4K3 w - - 0 1` against the same with Qd1): term 0.

  The Engineer picks the final pairs. These show the premises hold.
- **`A3` mirror:** 12 of 12 probe positions, which exercise both terms, mirror exactly on head.
- Relation rows go in `src/evaluate.king-mobility.test.ts` (`ABC-083`'s mobility file) or `src/evaluate.test.ts`. No
  new file (`NFR-008`).

### `G2` by construction (≤ 1 100 ns) — `UNKNOWN - verify`

- Base `G2` is 642.6 / 641.2 ns (`qe-ABC-215`, value-identical `src/`). Per call, head adds:
  - one array read and multiply per non-pawn piece (≤ 16);
  - one compare per non-pawn piece;
  - at most two four-square reads.

  That is expected at tens of ns, well under 990 ns, so no second session is expected. It is a construction argument,
  not a reading. QE reads it.

### Rows head moves (probed on `h`; base clean)

- **Base clone:** default lane 2 090 / 2 090. Deep lanes green, with real-clock rows excluded.
- **`h`, default lane:** 9 reds in 3 files, 2 081 / 2 090. **`w` gives the same 9 with the same values. `q` gives 0.**
- **`h`, deep (`SEARCH_DEEP`, `ENGINE_DEEP` without real-clock rows, `PUZZLE_DEEP`):** the same rows, plus 3 in
  `quiescence.test.ts`. `engine` and `levels` (deterministic rows) are green.

| # | row | before → after | kind | route |
|---|---|---|---|---|
| 1 | `search.ordering.test.ts` `A4` position-6 d2 (none / MVV-LVA / + killers) | 10 371 / 3 266 / 3 177 → 11 220 / 1 317 / 1 317 | pinned values | re-pin. Killers now earn 0 at depth 2 here; the delete rule (depth 5, `SEARCH_DEEP`) is green. The stale "12%" line (`QE-215-d`) sits in the docblock this re-pin edits |
| 2 | `search.ordering.test.ts` `G1` position-3, 3 ticks | 342 → 364 | pinned value | re-pin |
| 3 | `search.pvs-lmr.test.ts` `A4` `search()` | the premise is lost: shipped 10 against unreduced 2 on `A4_SEARCH_FEN` | a fixture premise is lost | re-find under `ADR-0028` d2 (re-found at `ABC-083`, `ABC-205` and `ABC-215`) |
| 4 | `search.pvs-lmr.test.ts` `A4` `chooseMove()` | the property holds (re-search > 0, equal to unreduced); the pin −7 / b3f3 → −12 / b3h3 | pinned value | re-pin |
| 5 | `transposition.test.ts` `A1` knight-g1 (2 rows) | 939 → 911 | pinned values | re-pin |
| 6 | `transposition.test.ts` `A1` position-3 | 1 377 → 1 355 with the table (re-read the table-off count too) | pinned value | re-pin |
| 7 | `transposition.test.ts` `A5` nodes; the depth-3 score | 7 295 → 7 629; −485 → −498 (still a rook down: the fixture bites) | pinned values | re-pin |
| 8 | `quiescence.test.ts` `A4` position-6 d3 bare-leaf nodes `[deep]` | 2 398 → 2 358 | pinned value | re-pin |
| 9 | `quiescence.test.ts` `A5` `ORACLE_AT_DEPTH_3`, kiwipete and position-6 `[deep]` | kiwipete 8 → **20** / e2a6; position-6 85 → **78** / c3d5. The oracle re-run on `h` (`searchWithoutPruning(p, 3)`: 70 389 552 and 14 332 220 nodes) equals `searchWithoutPvsOrReductions` and `search()` on score and move, on both boards. The moves are unchanged | pinned values | re-pin **only by the oracle rule** |

- **12 rows in 4 files: 0 relations, 0 levels.** Every row is a re-pin, the oracle rule or the one re-find. Each route
  has a precedent at `ABC-083`, `ABC-205` or `ABC-215`.
- **Levels and gates on `h`, read by the probe:**
  - The six `ABC-079` `A5` multiplier cells, base → `h` (level). Kiwipete: d1 17.92 → 13.27x (180), d2 20.48 →
    19.32x (50), d3 3.51 → 2.98x (70). Position-6: **d1 8.96 → 4.19x (10)**, d2 23.36 → 9.68x (42), d3 5.20 → 1.93x (13).
    All are under level. The tightest cell gains headroom.
  - `ABC-121` `A1` d5 drift on the 190, both recursions: 98.93 % within 25 cp (base 97.86 %). The maximum is 45 cp
    (base 63; the row on `main` asserts ≤ 75). There are 0 mate flips, and the mate floor is 0 of 180.
  - `G1` puzzle suite (virtual clock): **54/58, baseline 54/58.**
  - Relation margins, base → `h`: `ABC-076` `A3` 309 → 311 and `A4` 70 → 70. `ABC-083` `A2` g6 3 → 3 (thin, but
    unmoved) and g2 141 → 141. `A3` 121 → 121 and e5/f5 14 → 14. `A4`: without mobility 0 → 0, with mobility 60 → 32.
    `QE-G2` −556 → −528. `QE-G3` 858 → 786 (d2 and d3).
- **Not run here:** the real-clock rows, `G2`, `G5`, `G6`, `G8`, `G9`, `G11`, D and `N8-LANE`. Those are the build's and
  QE's.

### Frozen-clock pre-check (Test note 4; a count, not a reading)

`chooseMove`, `now: () => 0`, `maxDepth: k`. Nodes to complete depth k:

| tree | kiwipete d7 | kiwipete d8 | position-6 d7 | position-6 d8 |
|---|---|---|---|---|
| base (`5c91e2e4` `src/`) | 609 900 | 1 735 339 | 586 333 | 1 355 149 |
| **`h` (head as designed)** | 602 091 (−1.28 %) | 1 700 946 (−1.98 %) | 469 639 (−19.90 %) | **1 111 000 (−18.02 %)** |
| `w` (weights alone) | 602 038 | 1 700 917 | 469 637 | 1 110 997 |
| `q` (queen term alone) | 609 876 | 1 735 311 | 586 330 | 1 355 148 |

- **Base straddles no depth now.** Its value-identical reading (`qe-ABC-215` `…a34270bf`, the head there):
  - position-6 reached depth 8 in 5 of 5 runs, searching 1.464–1.470 M nodes;
  - kiwipete reached 7 in 5 of 5, at a median of 1.30 M.

  So Test note 4's "straddled depth" rule flags nothing.
- **Prediction for the record: `G6` MET.**
  - Position-6: head's depth-8 need (1.111 M) is 24 % below base's lowest run. Head reaches depth 8 in every run
    unless its throughput cost exceeds about 24 %.
  - Kiwipete: head's depth-7 need (602 k) is half a run. Its depth-8 need (1.70 M) stays out of reach. So 7 = 7.
  - This is a prediction, not a grade. The throughput cost is `UNKNOWN - verify` until QE's reading.
- **The DoR risk line above is answered by the count.** It expected this ticket to be the costlier one, with base on
  its d8 edge. Base is off the edge now (`ABC-215`), and head's tree is smaller. The risk was a cost risk, and `G2`
  still reads it.

### Size: `S`. No split

- The production diff is about 25 lines in `src/evaluate.ts`: one weight array, one line moved, one flag, one helper and
  one term. Add the relation rows and the 12 moved rows. All 12 move by an existing route, and only one is a re-find.
  That is `S` at its upper edge. If BA/PM prefers, it can be relabelled `M`. It does not need splitting.
- **A split buys nothing.** The weights alone (`w`) carry every moved row and all of the node change. The queen term
  alone (`q`) moves no row and no count. Splitting would add a second D reading (6–12 h) for a half that moves nothing.

### Accepted and open

- **ADR: none.** The attack-map form and the clamp are unchanged (`ADR-0031` decision 2). The early-queen term is a new
  evaluation term inside the evaluation contract (pure, stateless, mirror-exact).
- **Owner word: none.** No level moves. `QE-205-c` stays open and does not block.
- **Flag, not changed:** the king's squares stay at 4, more than a queen's. King mobility is `ABC-205`'s ground (out of
  scope).
- **D:** strength is not predicted. `A5` reads it under `S1`.

### For the Engineer

- Take the weights `[0, 0, 4, 4, 2, 1, 4]` (by `pieceType`), the term's condition and its 25 cp from this section. Do
  not re-tune them.
- A relation red, or any row outside the 12 above, is a STOP to Architect/Design. A red on a level is also a STOP
  (`ADR-0028` decision 4).
- Re-pin with `before → after` and the ticket name in each row's comment, as `ABC-215` did.

### Next move

- **Orchestrator:** merge these records. Then In Design → Ready for Dev → In Development (Software Engineer), at width 1.
  Nothing else edits `src/evaluate.ts` in the meantime.
