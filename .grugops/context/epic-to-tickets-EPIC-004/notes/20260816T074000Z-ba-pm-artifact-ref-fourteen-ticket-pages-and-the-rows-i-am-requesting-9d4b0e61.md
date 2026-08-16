---
id: 20260816T074000Z-ba-pm-artifact-ref-fourteen-ticket-pages-and-the-rows-i-am-requesting-9d4b0e61
kind: artifact-ref
by: ba-pm
at: 2026-08-16T07:40:00Z
verified_by:
confidence: high
refs:
  - EPIC-004
  - ABC-074
  - ABC-075
  - ABC-076
  - ABC-077
  - ABC-078
  - ABC-079
  - ABC-080
  - ABC-081
  - ABC-082
  - ABC-083
  - ABC-084
  - ABC-085
  - ABC-086
  - ABC-087
  - plans/board.md
  - plans/traceability.md
supersedes:
---

# What I wrote, and the rows I am REQUESTING (I wrote neither `board.md` nor `traceability.md`)

## Written by this hop — fourteen ticket pages, `ABC-074`…`ABC-087`

```
plans/tickets/ABC-074-spike-depth-in-budget-on-non-m3-hardware.md              145
plans/tickets/ABC-075-incremental-zobrist-key-seam.md                          143
plans/tickets/ABC-076-evaluation-material-and-piece-square-tables.md           118
plans/tickets/ABC-077-negamax-alpha-beta-core.md                               139
plans/tickets/ABC-078-iterative-deepening-and-the-engine-seam.md               148
plans/tickets/ABC-079-quiescence-search-on-captures.md                         118
plans/tickets/ABC-080-move-ordering-mvv-lva-killers-hash-move.md               132
plans/tickets/ABC-081-transposition-table-and-in-tree-repetition.md            147
plans/tickets/ABC-082-evaluation-pawn-structure.md                             114
plans/tickets/ABC-083-evaluation-king-safety-and-mobility.md                   137
plans/tickets/ABC-084-tactical-puzzle-suite-strength-regression-gate.md        139
plans/tickets/ABC-085-self-play-ladder.md                                      135
plans/tickets/ABC-086-deterministic-move-selection-under-a-fixed-seed.md       147
plans/tickets/ABC-087-difficulty-levels-as-budget-plus-blunder-rate.md         156
                                                                        total 1918
```

Plus this note directory. **Nothing else was written.**

## Hard limits — how each one was honoured

| limit | how |
|---|---|
| write only `ABC-074`…`ABC-091` | **14 files, all in range.** `ABC-088`–`091` unspent |
| do not write `plans/board.md` | **not touched.** Rows requested below |
| do not write `plans/traceability.md` | **not touched.** Rows requested below |
| do not edit `plans/epics/EPIC-004-*.md` | **not touched.** Size correction requested below |
| do not edit `plans/nfr-catalog.md` | **not touched.** `G6` (no memory row) is recorded as a gap, not an edit |
| no code, test or `src/` file | **none written.** `src/` was read only |
| **do not run git** | **no git command was run at any point in this hop** — two siblings share this index |
| no merge, push, deploy, spawn | **none** |

## Board rows I am REQUESTING — one-line each, `plans/board.md`'s convention

**1. Replace the `EPIC-004` row (`plans/board.md:142`).** The size changes; **the spike clause does
NOT** — I verified it and it is correct as written:

```
- [EPIC-004] Engine and AI opponent  (owner: BA/PM, **size: XL — corrected from L, 37 points over
  fourteen tickets**, priority: P0, since: 2026-07-22, **DECOMPOSED 2026-08-16 into ABC-074…ABC-087;
  ABC-088…ABC-091 unspent. Largest ticket M, no SPLIT_REQUIRED.** **The spike clause STANDS and is
  now ABC-074** — ADR-0003 (2c) re-pointed it from nodes/sec to depth-in-budget on non-M3 hardware,
  so ABC-008 did NOT discharge it; NFR-005's depth-7 level stays PROVISIONAL. Blocked on hardware
  (G1) and on Architect/Design's Zobrist-seam ruling (G3))
```

**2. Fourteen rows into `Backlog`.** **None is DoR-met, so none goes to `Ready`** — the highest
reading is 10/10 (`ABC-076`) and every other page carries at least one ⚠️.

```
- [ABC-074] SPIKE — depth-in-budget on non-M3 target hardware  (EPIC-004, S, P0, DoR 7/10, BLOCKED: no non-M3 machine)
- [ABC-075] Incremental Zobrist key seam  (EPIC-004, M, P0, DoR 8/10, BLOCKED: Architect/Design owes the ep-component ruling)
- [ABC-076] Evaluation — material and piece-square tables  (EPIC-004, M, P0, DoR 10/10 — the only DoR-MET ticket in the epic)
- [ABC-077] Negamax with alpha-beta — the recursion core  (EPIC-004, M, P0, DoR 8/10, needs ABC-076)
- [ABC-078] Iterative deepening + EngineSeam — RISK-002 discharged here  (EPIC-004, M, P0, DoR 7/10, needs ABC-077)
- [ABC-079] Quiescence search on captures  (EPIC-004, S, P0, DoR 8/10, needs ABC-077)
- [ABC-080] Move ordering — MVV-LVA, killers, hash move  (EPIC-004, M, P0, DoR 8/10, needs ABC-078)
- [ABC-081] Transposition table + in-tree repetition  (EPIC-004, M, P0, DoR 7/10, needs ABC-075 + ABC-077)
- [ABC-082] Evaluation — pawn structure  (EPIC-004, S, P1, DoR 9/10, needs ABC-076)
- [ABC-083] Evaluation — king safety and mobility  (EPIC-004, S, P1, DoR 8/10, needs ABC-076/082/078)
- [ABC-084] Tactical puzzle suite — strength regression gate  (EPIC-004, M, P0, DoR 8/10, needs ABC-078)
- [ABC-085] Self-play ladder — ≥ 90% over 100 games  (EPIC-004, M, P1, DoR 7/10, needs ABC-087 + ABC-086; ~5 h opt-in run)
- [ABC-086] Deterministic move selection under a fixed seed  (EPIC-004, S, P0, DoR 8/10, needs ABC-078)
- [ABC-087] Difficulty levels — mechanism only, choosing is EPIC-006's  (EPIC-004, M, P1, DoR 7/10, needs ABC-078/086/084)
```

**3. Two rows I am asking be added to `Blocked (visible, time-tracked)`** — `ABC-074` (`G1`,
hardware, owner: the project owner) and `ABC-075` (`G3`, ep-component ruling, owner:
Architect/Design). Both are blocked from the moment they are cut, and `plans/board.md` has a
column for exactly that. **Blocked and visible beats unblocked and untrue.**

## Traceability rows I am REQUESTING — `plans/traceability.md`

One row per ticket, `Ticket | Title | Epic | Feature | NFRs | Status`, all `Epic = EPIC-004`,
`Feature = —`, `Status = Backlog`:

```
ABC-074 | SPIKE — depth-in-budget on non-M3 hardware  | NFR-004, NFR-005, RISK-002
ABC-075 | Incremental Zobrist key seam                | NFR-005, NFR-001
ABC-076 | Evaluation — material + PST                 | NFR-005
ABC-077 | Negamax with alpha-beta                     | NFR-005
ABC-078 | Iterative deepening + EngineSeam            | NFR-004, NFR-005, RISK-002
ABC-079 | Quiescence search on captures               | NFR-005
ABC-080 | Move ordering                               | NFR-005
ABC-081 | Transposition table + in-tree repetition    | NFR-005, NFR-001
ABC-082 | Evaluation — pawn structure                 | NFR-005
ABC-083 | Evaluation — king safety and mobility       | NFR-005, NFR-001
ABC-084 | Tactical puzzle suite gate                  | RISK-003, NFR-008
ABC-085 | Self-play ladder                            | RISK-003, NFR-008
ABC-086 | Deterministic move selection                | NFR-004
ABC-087 | Difficulty levels — mechanism               | NFR-004, NFR-005
```

**`NFR-008` appears on only two rows on purpose.** Every ticket inherits `N8-LANE`'s ≤ 650 ms bar by
name — that is the standing per-ticket inheritance, not a per-ticket trigger. `ABC-084` and
`ABC-085` are named because they are the two that **cannot** fit the lane and are ruled opt-in.
**See `G4`: the aggregate lane fit of all fourteen is a real and unmeasured risk, and it is not
carried by any single row.**

## Metrics

`plans/metrics.md` — **Throughput +14** (tickets created, 2026-08-16). Not written by me.
