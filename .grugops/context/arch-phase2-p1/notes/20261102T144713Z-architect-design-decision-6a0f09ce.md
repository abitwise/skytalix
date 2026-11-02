---
id: 20261102T144713Z-architect-design-decision-6a0f09ce
kind: decision
by: architect-design
at: 2026-11-02T14:47:13Z
verified_by: 
confidence: high on the measured premise; the Elo effect is an estimate until C2' reads it
refs:
  - arch-phase2-p1
  - grugops/arch-phase2-p1
  - EPIC-011
  - P1
  - ADR-0060
  - ADR-0026
  - ADR-0056
  - ADR-0059
  - ADR-0050
  - ABC-121
  - ABC-233
  - ABC-264
  - 4d1c0616
  - NFR-005
  - NFR-008
  - NFR-009
supersedes: 
seal: sha256:cc6e22f01d64cef5379c7cc514cf4a01a2ea77d68714fb4f20a0d2c53ceafb7f
---

# P1 confirmed as the next Phase 2 item; ADR-0060 (PROPOSED): log-table LMR, PV -1, cap 2 plies, child depth >= 1, behind searchWithoutLogReductions / chooseMoveWithoutLogReductions; history term deferred to O1h; A4 bars <= 0.85x at depth 8 (both recursions) and >= +0.25 ply at 47 000 nodes; intent GAIN

## Context
Brief arch-phase2-p1: design the next EPIC-011 Phase 2 ticket on top of ABC-264 (reverse futility, grugops/ABC-264-fix 4d1c0616, in QE). Default candidate P1; confirm against P3/P5/P6 or pick better. Probe note: the observation in this task (same `at`).

## Decision
1. **Item: P1 (LMR by a log table).** Per-depth saving at depth 8 on one instrument: P1 0.68-0.80x, P3 futility 0.88-0.91x, P5 depth-grown R 0.83-0.99x. It fires at 100 ms (+0.305 ply at 47 000 nodes); P5 is depth-gated (ADR-0056 D5). ADR-0056 D2 estimates agree (P1 +40-100, P3 +15-40, P5 +10-30, P6 +5-15; P4 needs P1). It is the owner's order (P2 -> P1 -> P4 -> P3 -> P5 -> P6).
2. **Rule (ADR-0060 d1-d2):** r = max(0, min(T[d][m] - pv, 2, d - 2)), T = floor(1.0 + ln d * ln m / 2.0), m = index + 1, pv = alphaIn + 1 !== beta. Eligibility unchanged from ABC-121 (not root, d >= 3, index >= 3, not capture/promotion, not in check, not giving check). Re-search at full depth unchanged. New pure export `lateMoveReductionByTable(position, move, depth, index, atRoot, pvNode)`; T a 64x64 Uint8Array built at load (4 096 B); the flat `lateMoveReduction` unchanged for the doors.
3. **Exclusions decided by measurement:** captures, promotions, checks, in check, root: excluded (as today). PV: one ply less (dropping it: G1 53/58, 14 same-depth mate losses). Killers: no term (<= ~5 % nodes, no reach effect). Cap 2 plies: uncapped loses zugzwang.004 until d13 at 4.30x nodes. Child depth >= 1.
4. **Switch / doors (ADR-0026 d10 pattern):** switch `logReductions` (implies reductions) in Switches and Heuristics, on in search()/chooseMove only; test-only doors `searchWithoutLogReductions(position, depth)`, `chooseMoveWithoutLogReductions(position, options)`; every older door turns it off; export lists +2 (ABC-077 A6) and +1 (ABC-078 A4). Re-points per ADR-0050 d4 / ADR-0059 d6; value rows (zugzwang, mate, G1) stay on the shipped path, and no zugzwang row's depth is re-pinned.
5. **Amends ADR-0026 d6 for the shipped path only:** the new predicate takes a fourth caller fact (pvNode) and returns 0/1/2; the flat predicate's "0 or 1" contract and table test stay. Dated pointer added to ADR-0026 d6 and ADR-0056 D2 (row P1).
6. **Pre-registered bars:** A2 predicate table cells + each exclusion, a two-ply re-search row at a null-window node, a source row. A3 drift d5 on the 190 both recursions >= 95 % within 25 cp, none beyond 27 cp (floor 1.5 x 18), 0 sign changes; mate floor one ply deeper (door d4, head d5) 0 violations; seven zugzwang rows at recorded depths. **A4 (a)** depth 8 kiwipete and position-6, both recursions, nodes <= 0.85x the door (measured 0.7238 / 0.7086 / 0.6795 / 0.8020); **(b)** chooseMove on the 190 at maxNodes 47 000, mean completed depth >= door + 0.25 ply (measured +0.305); (c) G6 >= base. Instrument check: exact counts 476 991 / 723 582 / 660 887 / 239 944 and reach 6.542 / 6.237 on the 4d1c0616 base. A5 G1 >= 54/58, no NEWLY-MISSED. A6 C2' GAIN >= 50.0 of 100 + S' + Levels deep lane.
7. **Falsifiers F1-F8** (ADR-0060 table): drift, mate floor, zugzwang (never a re-pin), A4 (a)/(b)/G6, C2'/S', doors, G1, re-search/source rows. F5 -> next item P3 (P4 depends on P1), the Orchestrator's call.
8. **Intent GAIN**, named before the read: it fires at 100 ms (12.0 % of non-first moves reduced at depth 6, 41.8 % of them by 2). Expected nearer the low end of D2's +40-100 (estimate +15-45 by ADR-0055's speed rule); C2' resolves +-48.
9. **History term and cap lift:** later, measured changes. History is O1h's (ABC-233) once a history table exists; BA/PM decides whether ABC-233's page carries it. The cap is re-measured for 40/15 depths.
10. **Status:** PROPOSED; the owner's to accept ("accept ADR-0060" / "decline it"). Reading (b): the build may start once ABC-264 merges (shared src/search.ts, src/engine.ts); C2' and the merge wait on acceptance. Default without an answer: the flat LMR stays.

## Alternatives
Uncapped; textbook 0.75 / 2.25; no PV term; killer term; flat 2/1 rule; history now (needs O1h); child depth >= 0; edit the flat predicate in place (no door); P3/P5/P6 first. Each rejected in ADR-0060 § Alternatives with its measurement.

## Scope
Records only: ADR-0060 (new), dated lines in ADR-0026 d6 and ADR-0056 D2. No src/, tests, plans or board.

## Risks
- Base dependency: measured on ABC-264-fix; if ABC-264 does not merge, P1's premise is re-measured on main (bars stay, counts re-derived by a dated line).
- ADR number: ADR-0060 taken here; arch-ABC-265 runs in parallel and is briefed to amend ADR-0025, not to add a number. A collision would be resolved at merge.
- Page deltas owed by BA/PM: title (drop "history-adjusted"), A1-A6 as above. The ticket id is not cut yet.
