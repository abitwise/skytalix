---
id: 20261026T023232Z-architect-design-decision-012b1053
kind: decision
by: architect-design
at: 2026-10-26T02:32:32Z
verified_by: 
confidence: high for the rule, the doors, the moved set and the counts (deterministic, probed at 93d79b2d); ADR-0050 is PROPOSED and the owner's to accept; G6 is UNKNOWN - verify until QE reads it
refs:
  - ABC-208
  - EPIC-008
  - ADR-0050
  - ADR-0026
  - ADR-0028
  - ADR-0034
  - ADR-0024
  - ADR-0020
  - NFR-005
  - NFR-004
  - NFR-008
  - NFR-009
  - G1
  - G6
  - A1
  - A2
  - A3
  - OD-205-2
  - plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
  - memory-bank/50-decisions/ADR-0050-null-move-pruning-arrives-at-null-window-nodes-with-r-3-behind-a-test-only-off-door-pair-guarded-below-three-non-pawn-pieces.md
  - bapm-ready-ABC-208/20261026T010656Z-ba-pm-decision-75bf6402
  - bapm-ready-ABC-208/20261026T010715Z-ba-pm-observation-a77866c6
  - orch-2026-10-26c/20261026T010824Z-orchestrator-decision-d25ab770
  - arch-design-ABC-207/20261025T123306Z-architect-design-observation-439d6f8c
  - qe-ABC-215/20261025T121200Z-qe-e2e-observation-a34270bf
  - grugops/arch-design-ABC-208
  - 93d79b2d
supersedes: 
seal: sha256:dffdcc1b6eb96dd58497b462b9281294cf443700742e41bd826443d738381cb4
---

# Architect/Design: ABC-208 designed. ADR-0050 PROPOSED (owner's to accept): null move at null-window nodes, R = 3, no verification, guarded below three non-pawn pieces; doors searchWithoutNullMove / chooseMoveWithoutNullMove; ADR-0026 d9 re-pointed (118 cp stays LMR's, no bound move); oracle d5 ≥ 95 % within 25 cp, max 37 cp, same-depth mate floor; 2 pins move (export lists) + 12 re-points; G6 predicted MET; M, no split

Task `arch-design-ABC-208`, records plus probes, at `main` `93d79b2d`, branch `grugops/arch-design-ABC-208`. Full text:
`memory-bank/50-decisions/ADR-0050-…md` (PROPOSED) and `plans/tickets/ABC-208-…md` § Design ruling. Probes: this task's
observation note. Inputs: the page, BA/PM `…75bf6402` / `…a77866c6`, Orchestrator `…d25ab770` (reading b), `ADR-0026`
(d1–d10, the 2026-10-24 amendment), `ADR-0028` (d2, d4), `ADR-0034` (d2), `EPIC-008` (G1, G6, S1),
`arch-design-ABC-207` `…439d6f8c` (the probe method and base counts), `qe-ABC-215` `…a34270bf` (3 s node medians).

## The ruling (the In Design items BA/PM listed)
1. **R and verification.** R = 3 plies from remaining depth 2; the null child is searched to `depth − 1 − 3` with
   `(−beta, −beta + 1)`. A cut returns beta, never the null score, and stores nothing. **No verification search**:
   neither form tried recovered `zugzwang.004` or `.005`. Null move only at null-window nodes (`alpha + 1 === beta`),
   so `nullMove` implies `pvs`.
2. **The guard.** The page's four, with the material one ruled stricter: no null move when the side to move has
   **fewer than three non-pawn pieces**. Measured: floor guard `G1` 50/58; two pieces 53/58 (seed 5464); three pieces
   54/58 (= base's four misses), with identical kiwipete/position-6 counts. The page's floor is implied, so `A2`'s
   second bullet holds. One exported pure predicate `nullMoveReduction(position, depth, ply, afterNull)` → 3 or 0;
   both recursions call it and subtract what it returns.
3. **The door pair.** `searchWithoutNullMove(position, depth)` and `chooseMoveWithoutNullMove(position, options)`: the
   pre-ticket shipped path, node for node (222/222 probe cells). Every older door turns null move off. The null move:
   `makeNullMove` / `unmakeNullMove` in `src/apply.ts` (side flips, ep clears, halfmove clock 0) and
   `zobristKeyAfterNullMove` in `src/zobrist.ts`.
4. **`ADR-0026` d9's drift rows.** Its LMR drift pair and mate floor re-point their shipped side to the new doors, and
   so does every other `ABC-121` row whose shipped side is `search()`/`chooseMove`: 12 rows in
   `search.pvs-lmr.test.ts`. They read their pre-ticket values exactly, so **118 cp keeps measuring LMR alone. No
   bound moves; no owner question on it.**
5. **The `A3` oracle.** d5 on the 190, both recursions: ≥ 95 % within 25 cp, none beyond **37 cp** (⌊1.5 × 25⌋). The
   mate floor is at the same depth (d5) on the 287. Measured 100 %/25, 100 %/8, 0 of 189. The cut-without-search and
   sign-error mutants read 42.78 %/790 and 41.71 %/644. **It is a regression net, not a proof:** R 3–5, null in check,
   double null, no halfmove reset and returning the null score pass it. The predicate table, a source row and the
   null-move unit rows catch them; returning the null score is a named blind spot (≤ 19 cp at d6).
6. **`A2` positions.** 7 rows, each at its own fixed depth (8–12): CPW `zugzwang.001` Rf1 d9, `.004` Qxh4 d11, `.005`
   Nxd5 d12 (keep non-pawn material; corroborated by Stockfish 19 searchmoves at depth 26), and four K+P v K opposition
   rows that are tablebase-unique wins at d8 (b6c6, c6d6, d6e6, e6f6). The no-guard variant scores 0/7, the floor guard
   4/7 and the two-piece guard 5/7. Not taken: `.002` (bites nothing), `.003` (base cannot solve it by d12). Under the
   three-piece guard every row is decided by the guard; R is judged by `A3` and `G1`. Instrument for the second bullet:
   a call-through `vi.mock` of `src/apply.ts` recording check and piece count at each `makeNullMove`.

## Moved pins (`hd` against main's tests; default + deterministic deep lanes)
- **Red: 2 rows, both export lists.** `search.test.ts` `ABC-077` `A6` (+ `searchWithoutNullMove`,
  `nullMoveReduction`) and `engine.test.ts` `ABC-078` `A4` (+ `chooseMoveWithoutNullMove`). Route: export-list growth
  (`ADR-0026` d2 precedent).
- **Re-pointed, green either way: 12 rows** (decision 4).
- **0 value pins, 0 relations, 0 levels, 0 NFR bounds, no `ADR-0026` level.** No STOP.

## Frozen-clock d7/d8, base → head (a count, not a reading)
- kiwipete d7 609 900 → 590 489; d8 1 735 339 → 1 259 463 (−27.4 %).
- position-6 d7 586 333 → 180 941; d8 1 355 149 → **355 565 (−73.8 %)**. Head d9: kiwipete 2 907 475, position-6
  940 109.
- **`G6` predicted MET** (`UNKNOWN - verify`): position-6 reaches 9 while head's cost per node rises less than about
  55 %. Kiwipete reaches 8 only if it rises less than about 3 % (1 259 463 against base's median of 1 301 357 nodes in
  3 s); otherwise it stays at 7, which equals base. The pre-check does not stop the run.

## Size
**`M` holds; no split.** About 150–200 production lines in four files. A split ships a door with nothing behind it and
needs a second D.

## Owed by others
- **Owner:** accept or decline `ADR-0050` (the Orchestrator reports it; `…d25ab770`: the merge and the ALONE reading
  wait on it).
- **BA/PM page lines (no criterion change):** Scope 2's fourth guard; `A2`'s per-row depth and the rows; `A3`'s
  same-depth mate clause; `A1` is a cross-build comparison that QE runs out of tree; Scope 1's files add `src/apply.ts`
  and `src/zobrist.ts`.
- **Orchestrator (flag):** on `main` the `ABC-121` d5 drift rows assert ≤ 75 cp while `ADR-0026` d9 reads 118 cp
  (`OD-205-2`; the literal rode `ABC-205`'s unmerged branch). Stricter than the ADR, so safe. Not touched here.
- `plans/board.md`, `plans/traceability.md`, `EPIC-008`, `src/`: not touched.
