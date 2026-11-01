---
id: ABC-254
title: "Lazy legality: the full make/test/unmake runs only for king moves, en passant, pinned pieces and positions in check (ADR-0055 O1-d = ADR-0003 menu item (c2); value-identical; waits on the owner's yes to amend ADR-0003)"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-010
---

# ABC-254: lazy legality, behind the unchanged legalMoves signature

> **Cut 2026-11-01 by BA/PM** (task `bapm-goal3000-o1-cut`, records only, at `main` `bae25131`; nothing run, built or
> timed). Source: `ADR-0055` option **O1-d** ("lazy legality (`ADR-0003` menu item (c2))", **1.15–1.40×**, medium
> confidence, "M, 1 ticket + an ADR amending `ADR-0003` (owner)"). **Waits in Backlog on the owner.** He chose O1 on
> 2026-11-01 but did not answer Q-SP-3 explicitly; the Orchestrator read O1-d as needing his yes
> (`orch-2026-10-30a` `…74216a44`, item 2). Its acceptance is written now, so the ticket is ready the day he says
> yes. `EPIC-010` milestone 1b. Value-identical: S2, **no smoke**.

## What the owner is asked (Q-SP-3, `ADR-0055` D5)

`ADR-0003` clauses 1 and 3 are **owner-ratified** (2026-07-30): clause 1 keeps make/test/unmake as the legality
strategy ("`src/legal.ts` is not changed"); clause 3 orders a menu, (c1) → (c2) → (b), "authorizes none of the three",
and names its trigger (a missed depth floor), which has not fired. This ticket needs **an ADR amending clauses 1 and 3
on his word**: yes or no to (c2) now, without the trigger, for speed. On **yes**, the Architect writes that ADR and
this ticket goes Ready. On **no**, it is closed as declined, and O1's estimate is 1.08–1.35× without it
(`ADR-0055` § O1 combined).

## Problem

- **User:** the owner at level 5 (4 000 ms a move).
- **Pain:** every pseudo-legal move is made, tested for leaving the king attacked, and unmade (`src/legal.ts`). On the
  only profile on record, make/test/unmake inside the filters is **27.7 / 29.4 / 28.4 %** of self time (kiwipete /
  position-6 / start; `arch-ABC-235` `…7fc1b90c`, from `se-ABC-227`). `ADR-0003` measured that only **8.1 %** of
  moves can be illegal at all.
- **Value:** the largest single prize of option O1: **1.15–1.40×** search nps (`ADR-0055`; 0.28 × (1 − 1/3.8) ≈ 1.26×),
  with identical answers. `ADR-0003` (c2) measured **3.2–4.4×** per `legalMoves` call in open positions and
  **0.97–1.2×** in check, differentially verified on 518 474 nodes with 0 mismatches.

## Scope

1. `ADR-0003` (c2), as that ADR describes it: compute the king square, the check status and the pinned set **once per
   node**; run the existing make/test/unmake **only** for king moves, en-passant captures, moves by a pinned piece, and
   every move while in check; accept the rest without it. The proven test stays as the fallback, so it is also the
   oracle.
2. `ADR-0003` (c3) (a board-only legality test instead of a full `makeMove`) **may** be folded in, as `ADR-0003`
   recommends ("worth folding into (c2)"), if the amending ADR allows it.
3. Applied wherever the search and perft filter moves: the full list, the captures-only list (`ABC-206`) and
   `hasLegalMove`. `legalMoves`' signature and output are unchanged.
4. If `ABC-250` has merged, the filter is written on the packed path; if not, on today's objects (§ Dependencies).

## Out of scope

- (c1) pseudo-legal search and (b) full pin-aware generation (`ADR-0003` menu; not asked).
- Any change to what is legal or to list order (that would be value-changing and a defect here).
- `ABC-009`'s malformed-castle defect (`ADR-0003` § Interaction with `ABC-009`: (c2) does not fix it; a castle is a
  king move and keeps the full test).

## Acceptance criteria

- **A1 (the differential, `ADR-0003`'s verification).** **Given** every node of the 285 074-position walk
  (`ENGINE_DEEP=1`) and a perft walk of the six standard positions of at least 518 474 nodes (`ADR-0003`'s count),
  **when** the lazy filter runs beside today's make/test/unmake filter, **then** the legal lists are equal **in order**
  at every node (0 mismatches), the captures-only lists are equal in order, `hasLegalMove` agrees at every node, and
  the position is unchanged after each call (`toFen` and Zobrist key; 0 mutations).
- **A2 (the fallback classes, targeted rows).** At least one lane row each, read against the full test: a pinned piece
  moving off its pin line is rejected and along it accepted; an en-passant capture that exposes the king along the rank
  is rejected; a king move into an attacked square (including one x-rayed through the king's own square) is rejected;
  in check, only evasions are accepted (single check, double check, a check by a knight and by a slider); a castle
  through an attacked square is rejected.
- **A3 (perft and identity).** `src/perft.test.ts` exact with `PERFT_DEEP=1` (6/6 positions); `G4`: the `ABC-078` `A3`
  corpus and `ABC-121`'s 190 at fixed depth 5, every door, `chooseMove` at budgets 3 and 5 on `tickingClock(1)`: move,
  score, depth, nodes and clock reads byte-equal to base, out of tree.
- **A4 (speed).** **Given** `kiwipete`, `position-6` and the start position, 5 interleaved fresh-process runs per board
  per build at 4 000 ms, ALONE, with `ADR-0055` D3's validity rule, **then** head's median nodes per second is **≥ 1.10×
  base's on at least two boards and ≥ 1.00× on the third** (below `ADR-0055`'s 1.15 low estimate, as `ABC-235`'s 1.10
  bar sat below its estimate). **In-check guard:** `position-4` (in check) is read the same way and must be **≥ 0.97×**
  base's (`ADR-0003`'s worst measured per-call ratio in check). QE's reading on a sealed pre-registration decides.
- **A5 (gates).** `npm run lint`, `typecheck`, `test`, `build` green at every commit. `G1` 54/58 with rows equal
  (`PUZZLE_DEEP=1`). `G4` (A3). `G5`. `G6` "≥ base" (floor 6; the depth-7 WARN read too). `G7`: the per-node pin set
  is fixed-size, growth 0. `G8` ≤ 10 s, new lane rows ≤ 0.1 s. `G9`. `G2`/`G3` not owed.
- **A6 (the grade).** **S2**: A1–A5, **no smoke**.

## What happens on a miss

- **A1, A2 or A3 red:** a defect, and the highest-risk kind in option O1 (`ADR-0055`: "the largest correctness risk
  inside O1"). Back to the Software Engineer; the Architect reviews the fix against the amending ADR.
- **A4 missed on the bar (A1–A3 green):** NOT MET, **not merged**; QE records a `failed-attempt` note; BA/PM closes
  it as dropped. **In-check guard missed:** back to the Architect (the in-check path costs more than the full test).

## NFR triggers

- **`NFR-005`:** `G6` "≥ base", floor 6; expected to rise. **`NFR-001`:** perft rate re-read as INFO.
- **`NFR-004`:** `G5`; clock reads equal (A3). **`NFR-009`:** `G7` growth 0. **`NFR-008`:** walks under
  `ENGINE_DEEP=1`; ≤ 0.1 s lane.
- **Security:** none. No input path. (`ABC-009`'s malformed-position defect is unchanged, as above.)

## Test notes

1. The full make/test/unmake filter stays in `src/` as the fallback; A1 uses it as the oracle for as long as it exists.
2. A1's walks run out of the default lane (`ENGINE_DEEP=1`); A2's rows are lane rows at depth ≤ 1.
3. About 1 h of ALONE host time for A4 and `G6` (estimate).
4. UAT is owed (production lines). The QE verdict signs it.

## Size and priority

- **Size: M** (`ADR-0055`: "M, 1 ticket + an ADR").
- **Priority: P2.** The largest single prize in O1 (`ADR-0055` D4 puts it first when it is allowed).

## Dependencies

- **The owner's yes on Q-SP-3, then an ADR amending `ADR-0003` clauses 1 and 3** (Architect), accepted on his word.
- **Pull order:** if both arrive before `ABC-250` enters development, this ticket goes **first** in milestone 1b
  (`ADR-0055` D4), and `ABC-250` packs the lazy filter. Otherwise it follows `ABC-252` (or wherever the O1-b chain
  stops), because `ABC-250` and `ABC-252` rewrite `src/legal.ts`. The Orchestrator orders it.
- **Files:** `src/legal.ts`, possibly `src/moves.ts` (attack and pin helpers), `src/perft.ts` untouched in behaviour.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ the 28 % share; `ADR-0003` (c2)'s measurement |
| 2 | scope and out-of-scope | ✅ (c2), (c3) optional; (c1) and (b) out |
| 3 | INVEST | ✅ M; independent of O1-b's reading |
| 4 | testable, measurable acceptance | ✅ A1–A6; the differential is `ADR-0003`'s own |
| 5 | dependencies known | ✅ owner yes, amending ADR, pull order |
| 6 | NFR triggers with targets | ✅ ≥ 1.10×; in-check ≥ 0.97×; `G7` growth 0 |
| 7 | test notes | ✅ 4 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ the owner's yes (Q-SP-3) and the ADR amending `ADR-0003` |

**DoR 9/10. Backlog, waiting on the owner.** On his yes and the accepted ADR: 10/10, Ready.
