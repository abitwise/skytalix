---
id: 20261102T151839Z-architect-design-observation-e4680ed2
kind: observation
by: architect-design
at: 2026-11-02T15:18:39Z
verified_by: 
confidence: high (files in this branch)
refs:
  - arch-phase2-rebase
  - grugops/arch-phase2-rebase
  - EPIC-011
  - P1
  - P2
  - ABC-264
  - ADR-0059
  - ADR-0060
  - ADR-0056
  - ADR-0050
  - ADR-0026
  - QE-264-e
  - QE-264-p2-a
  - QE-264-p2-b
  - QE-264-p2-c
  - QE-264-a
  - QE-264-b
  - ABC-121
  - ABC-233
  - 4d1c0616
  - 0b73f51d
  - 5ffbae25
  - qe-ABC-264-p2/20261102T142816Z-qe-e2e-decision-4a487d20
  - qe-ABC-264-p2/20261102T142816Z-qe-e2e-observation-3af11ebd
  - qe-ABC-264/20261102T015326Z-qe-e2e-observation-3a95d391
  - arch-phase2-p1/20261102T144713Z-architect-design-observation-35bd3967
  - arch-phase2-p1/20261102T144713Z-architect-design-decision-6a0f09ce
  - NFR-005
  - NFR-008
supersedes: 
seal: sha256:1273eed328c19251ccd8ef554349d0c0e759516abc7ab80a307d5ce21fb8c2a7
---

# Artifacts of arch-phase2-rebase: ADR-0059 "accepted, not in force" + DROP ruling; ADR-0060 re-based on main and re-opened; ADR-0056 D2 dated line; raw probe; and what BA/PM needs for the P1 page

## Files (branch grugops/arch-phase2-rebase, from main 5ffbae25)
- `memory-bank/50-decisions/ADR-0059-…md`: § Status, a dated block: ACCEPTED, NOT IN FORCE; QE-264-e; retry ruling DROP with reasons; re-cut premises and bars.
- `memory-bank/50-decisions/ADR-0060-…md`: § Status, a dated block: PROPOSED, RE-OPENED; the figure table on main against 4d1c0616 and the bars; the variant table on main; the PV -2 diagnostic; text owed on re-open; the owner question not put. Dated bullets in decision 9 (instrument check) and § Consequences (the order with ABC-264).
- `memory-bank/50-decisions/ADR-0056-…md`: D2, a dated line for rows P2 (dropped) and P1 (re-opened) and the order.
- `.grugops/context/arch-phase2-rebase/raw/`: probe/ (README, patch_main.py, rf.ts, runs.sh, vsweep.sh, outputs m1-m6, r1, d1), notes/ (these sources), seal.mjs, spec.json.

## What BA/PM needs to cut the P1 page
- **It cannot reach Ready on today's ADR-0060 text.** F1 re-opened it on main. BA/PM may cut the stub now. It holds a ticket id; EPIC-011 Phase 2 row P1; the title without "history-adjusted"; size S-M; priority; intent GAIN (it fires at 100 ms: 11.0 % of non-first moves reduced at depth 6 on main); and Dependencies: the ADR-0060 re-open (Architect), then the owner's acceptance, which gates C2′ and the merge (reading (b)).
- **Bar numbers that carry over, unchanged:**
  - A3: >= 95 % within 25 cp, none beyond 27 cp, 0 sign changes, both recursions at d5 on the 190; the mate floor one ply deeper (door d4, head d5) at 0 violations; the seven zugzwang rows at their recorded depths, never re-pinned deeper.
  - A4: (a) <= 0.85x at d8 on kiwipete and position-6 in both recursions; (b) mean completed depth at maxNodes 47 000 on the 190 >= door + 0.25 ply; (c) G6 >= base.
  - A5: G1 >= 54/58, no NEWLY line. A6: C2′ GAIN >= 50.0 of 100, S′ and the Levels deep lane.
  - A1: export lists +2 (ABC-077 A6) and +1 (ABC-078 A4). A2: the table cells, each exclusion, the two-ply re-search row and the source row.
- **Base facts for the page:**
  - The base is main, with no reverse futility.
  - Main's door counts: 1 116 785 / 1 602 457 (search() d8), 1 575 537 / 476 244 (chooseMove to 8).
  - The instrument-check head counts come from the re-opened rule, not from 4d1c0616.
  - No ABC-264 rows exist to re-point; the door list is main's.
- **Still BA/PM's:** whether ABC-233's page carries a history term in LMR (ADR-0060 d11).
- **For the ABC-264 page:**
  - Close it as dropped: the Architect's ruling DROP, with ADR-0059 accepted, not in force.
  - QE-264-e is named in ADR-0059.
  - QE-264-a is moot while the code is not merged.
  - QE-264-p2-b (the harness label NEUTRAL at >= 43.0) stays open for tools: it can mislead the next GAIN read.
  - The S′ 7.0 / 10 stays unpooled.
- **For the EPIC-011 Phase 2 list:** P2 is dropped, and the order is P1 (re-opened) -> P4 -> P3 -> P5 -> P6 (ADR-0056 D2 dated line). Whether P3 goes before the re-opened P1 is the Orchestrator's call.

## Open questions
- Owner: the 27 cp cap was 1.5x one base's maximum and proved base-fragile. Re-deriving it on main (ADR-0050 d8's method) would raise it, which is a loosening and so his word. Without that word, the re-open may find no form that meets every bar.
- Orchestrator: dispatch the ADR-0060 re-open, or take P3 first.
