---
id: 20260925T141121Z-architect-design-decision-r2-lmr-on-is-judged-by-bounded-drift-mate-floor-and-depth-5e92b7a0
kind: decision
by: architect-design
at: 2026-09-25T14:11:21Z
verified_by:
confidence: medium
refs:
  - ABC-121
  - ABC-084
  - ABC-079
  - NFR-005
  - N8-LANE
  - ADR-0024
  - ADR-0026
  - 20260925T140921Z-architect-design-observation-lmr-drift-order-dependence-and-depth7-nodes-8d25f0c6
  - 20260925T140821Z-architect-design-observation-pvs-is-value-identical-but-breaks-two-ratio-bars-3b7e1a52
supersedes:
---

# Ruling 2: what replaces identity when LMR is on. Measurable, from this hop's readings

Hand-authored, no `seal` (degraded posture per `AGENTS.md`). **The criteria's wording is BA/PM's.**
This note gives the reference, the measured baseline and the bar shape. Where a bar is proposed, it
follows `ADR-0024` decision 3's headroom rule (1.5x the measured reading). **Confidence is
medium:** the readings come from a faithful probe, not from the build. The build re-measures them
at its own gate, and a bar that fails there is reported with the number, not re-levelled
silently.

## The reference

Every LMR-on row compares the shipped `search()` with **`searchWithoutReductions`** at the same
fixed depth. That door has the pre-`ABC-121` search's value (0/190 at depths 3–4), so any drift is
LMR's alone. **LMR does not fire below root depth 4**, so every row sits at depth >= 4.

## `A1`: bounded drift plus a hard mate floor (replaces the generic 50 cp / 95%)

The corpus is the 190 positions this hop used: `search.test.ts`'s broad corpus (six roots plus
every in-progress position one move away) plus `engine.test.ts`'s six endgames. That is ≥ 100, as
the ticket asks.

| clause | proposed bar | measured d4 | measured d5 |
|---|---|---|---|
| mate-status flips (presence or sign) | **0, hard** | 0 | 0 |
| non-mate positions within 25 cp | **≥ 95%** | 98.40% | 99.47% |
| largest single drift | **≤ 75 cp** | 50 | 45 |
| report, not bar: identical share, p95/p99, root-move changes | — | 93.05%, 10/35, 5 | 95.72%, 0/20, 3 |

- **Why not keep the ticket's ≤ 50 cp in ≥ 95%.** It measures 100%, so it cannot catch a
  regression until one is gross. It also has no ceiling, while the depth-4 maximum sits exactly
  at 50.
- **Why the two clauses.** The 25 cp share catches a broad drift. The 75 cp ceiling catches one
  wild position.
- **The mate floor's coverage is thin.** Only 3 of the 190 positions carry a mate score at these
  depths. The shipped-path mate rows (Ruling 1, point 3) carry the rest: `search.test.ts`
  `A3`'s depth-5 and depth-7 deep rows and the depth-10 rook ending. All of them hold under LMR.
  **They stay on `search()`/`chooseMove` and bind `ABC-121` as written.**
- **Lane.** The full corpus at depths 4–5 is DEEP-lane work. The probe's depth-4 pass ran 4
  searches per position in 35 s, loaded. The default lane carries a subset that BA/PM sizes
  against `N8-LANE`'s 650 ms. Its cost is `UNKNOWN - verify` until the build measures it.

## `ABC-084`: not available, and not needed as a blocker

`ABC-084` is a `Backlog` ticket with no fixtures in `src/`. `A1` above is the oracle today.
- If `ABC-084` lands first, its suite runs on the shipped engine and becomes an added strength
  check automatically. It needs no door.
- The only tactical fixture in the tree, `quiescence.test.ts`'s 20-position `HANGING_CORPUS`
  (≥ 19/20), stays on the shipped search.

## `A2`: depth in budget (the target)

- **Keep the ticket's wall-clock reading.** It is `NFR-005`, on plain node, measured by
  Security/NFR, with the pre-`C1` and post-`C1` builds in the same process.
- **Add a clock-free companion.** Report cumulative deepening nodes to depth 7 for
  `chooseMove` and `chooseMoveWithoutPvsOrReductions`. This reading is load-independent.
  - Probe: **532 363 / 467 461** (kiwipete / position-6) vs **1 922 235 / 1 923 320**.
  - The shipped engine's 3 s capacity is 892 682 / 853 278 nodes (QE at `ABC-081`), a margin
    of 1.68x / 1.83x.
  - At load 5.5–6.2 the probe completed depth 7 by 2 076 / 1 562 ms. At load 12.4 it did not.
    **Load moves this reading by a whole ply.** Security/NFR's plain-node reading must record
    the load.

## `A3`: the reduction fires only where the rule allows

This is answered **without a production counter or hook**. The rule is one exported pure
predicate (Ruling 3):
- A table-driven test: a capture, a promotion, a checking move, a node in check, index < 3,
  remaining depth < 3, and the root each yield no reduction; the one allowed case yields one ply.
- A source assertion that both recursions route every reduction through it. This is the same
  technique as `ABC-077` `A6` / `ABC-078` `A4`.
- **"Quiet" means non-capturing AND non-promoting.** `orderMoves` already ranks a promotion as
  tactical, and the probe reduced neither.

## `A4`: the fail-high re-search, through BOTH recursions

The constructed position runs through `search()` AND `chooseMove`. The re-search wiring is copied
code in each recursion, and a drift in it is invisible to every identity row, because those rows
now run with LMR off.

## `A5`: nodes fall, on NAMED positions only

Fixed depth 4, `search()` vs `searchWithoutPvsOrReductions`:
- kiwipete **17 911 vs 22 323 (80.2%)**;
- position-6 **20 402 vs 28 829 (70.8%)**.

**Do not widen this to "every position".** Position-4 reads 9 581 with PVS+LMR against 9 054
without, and 12 227 with PVS alone.

## `A6`

`A6` (memory) is unchanged. PVS and LMR allocate nothing.
