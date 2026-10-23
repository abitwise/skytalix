---
id: ABC-205
title: "King safety bites while the enemy queen is on, and the king table is tapered, so a centre king in an opening position costs what it should"
status: ready
column: Ready
size: M
priority: P2
epic: EPIC-008
feature: —
adr: "ADR-0031 addendum: route the text to the owner when it lands (…7feb0553)"
---

# ABC-205: king safety that bites while queens are on, and a tapered king table

> **Cut 2026-10-23 by BA/PM** (task `bapm-cut-engine-strength`, records only, at `main` `55a8f4ef`). Proposal 1 of
> `…f1771bb3`; owner word `…7feb0553`.
>
> **ADR touch point: an `ADR-0031` addendum.** Architect/Design writes it In Design. The owner's acceptance of the
> proposal is the go-ahead (`…7feb0553` item 2). **The Orchestrator reports the addendum text to the owner when it
> lands.** It also overrides a recorded scope decision: `src/evaluate.ts:187` says "Untapered by decision", from
> `ABC-083` § Out of scope.

## Problem

- **User:** the owner, playing level 5.
- **Pain:** in game 1 the king-exposure term moved 35 cp for opening the d-file in front of an uncastled king. Stockfish
  moved about 360 cp. The term has no queen or phase dependence (`src/evaluate.ts:187`, `:189-191`, `:263-277`), and it
  is capped at 105 cp in total. The untapered king table scores e1 and d2 at 0, and scores c1 and b1 at +10 and +30 "as
  if castled" whatever the files say (`src/evaluate.ts:121-130`).
- **Evidence:** a scratch probe tripled the exposure penalty while the enemy queen was on. It turned 13.d4??, 8.e5? and
  10.Ne4? into Stockfish's moves at the real 3 s budget. Those three moves are 721 of the game's 1 428 cp of loss.
- **Value:** the largest single cause of the loss, fixed in the evaluation, and kept only if the D reading says it
  helps across many games.

## Scope

1. **Queen-dependent scale.** Each side's king-exposure penalty (shelter, half-open and open files) is larger while the
   **enemy** queen is on the board than when it is off. The factor or form is the Architect's call. The queen-present
   flag comes from the board walk that already exists.
2. **A tapered king table.** The king's piece-square value blends a middlegame table and an endgame table by game
   phase. In the middlegame half, a corner or castled square earns its bonus only while its shelter is intact. The
   phase measure and the blend are the Architect's call.
3. Relation tests for both, and the `ADR-0031` addendum.

## Out of scope

- A king-zone attacker term. The analysis offers it as a later option; it is not cut.
- Mobility (`ABC-207`), any search change, and any change to the material or other piece-square values.
- Tuning to game 1. `G11` is reported, never graded.

## Acceptance criteria

Every relation compares two positions that differ only as stated, scored from White's side, with White to move.

- **`A1` (the queen scale).** **Given** a position with White's king behind a broken shelter (for example `g2`
  missing, or a half-open file next to the king), **when** it is scored with Black's queen on and with Black's queen
  swapped for a rook, **then:**
  - the shelter-broken-minus-shelter-intact difference is **strictly larger** with the queen on;
  - this holds on **≥ 6** such pairs, in **≥ 2** king placements (castled, and uncastled on e1);
  - all of them are colour-mirrored, under `A4`.
- **`A2` (the taper).**
  - **Given** a pawn ending (kings and pawns only), **then** a king on `e4` scores **strictly higher** than the same
    king on `g1`. This is the new behaviour. Base fails it: the untapered table scores `e4` at −40 and `g1` at +30 (`src/evaluate.ts:121-130`).
  - **Given** a middlegame position with both queens on, **then** the same king on `g1` with `f2`/`g2`/`h2` scores
    **strictly higher** than on `e2`. Base holds this too; the row guards the middlegame half of the blend.
- **`A3` (no castled bonus without shelter).** **Given** a king on `b1` with its `a`, `b` and `c` pawns home, against
  the same king with the `c` and `d` files open, both with queens on, **then** the second scores **strictly lower**,
  and **by strictly more than on base**. Base charges only the file terms.
- **`A4` (existing evaluation gates).**
  - `G3`: `ABC-083` `A1` mirror exact equality over its corpus, **plus ≥ 15 new positions** with queens on and off;
    `A2`, `A3`, `A4` and `A6` stay green.
  - `G2`: the complete evaluation is ≤ 1 100 ns, with the base read in the same session.
  - **Above 1 100 ns: STOP to Architect/Design.** The `ADR-0031` route applies, and nothing is re-derived.
- **`A5` (search and NFR gates).**
  - `G1`: puzzles ≥ 54 of 58.
  - `G6`: `NFR-005` depth ≥ 6 and ≥ base.
  - `G5`: `NFR-004`.
  - `G8`: `NFR-008`.
  - `G9`: levels byte-identical.
  - `G10` applies to any red level.
  - `G4`'s identity sweep stays green. Both sides call the same `evaluate`, so a red sweep would be a defect.
- **`A6` (the gate this ticket exists for).** **Given** `ABC-204` is Done, **when** D plays this branch against its
  merge-base, **then** ship rule **S1** is met: GAIN, or GAIN after one extension.
  - **Reported, not graded:** X ± Y, the draw ratio, and `G11`'s five game-1 choices against base.
- **`A7` (the ADR).** **Then** the `ADR-0031` addendum exists, states the queen-scale and taper forms, and records that
  the Orchestrator has reported it to the owner.

## NFR triggers

- **`NFR-005`:** one flag and one blend per evaluation. Read by `G6`, with a target of ≥ depth 6 and ≥ base.
- **The `G2` cost bar:** ≤ 1 100 ns.
- **`NFR-004`, `NFR-008`:** unchanged bounds, re-read.
- **Bounds moved:** none. A miss on `G2` or `G6` is a STOP, not a re-level.
- **Security:** no `ADR-0036` limb in `src/evaluate.ts`. No Security/NFR hop is owed.

## Test notes

1. The relations are unit rows in `src/evaluate*.test.ts`, in the default lane. Report `N8-LANE`.
2. The cost and depth readings run in plain `node`, base and branch interleaved, in one session (`NFR-005` runner
   rule).
3. D runs alone at width 1 (`EPIC-008` § Host). If a value-changing merge lands on `main` before this one merges, D is
   re-read.
4. UAT: production lines change, so UAT is owed. The QE verdict signs it (`…5aaf7cec`).

## Dependencies

- `ABC-204` Done, for `A6` only. Design and build can start now.
- No other open ticket touches `src/evaluate.ts`. `ABC-207` waits for this one.
- **Builders:** Architect/Design (In Design: the forms and the addendum), the Software Engineer, QE (verdict and the D
  reading).

## Size and priority

- **`M`:** two terms (scale and taper), relation rows, the addendum, and the readings. The analysis said S-M; the taper
  pushes it to M.
- **`P2`:** this is the largest measured cause of the loss in game 1.

## Definition of Ready

BA/PM, 2026-10-23, at `main` `55a8f4ef`. **Result: 10 of 10. `Ready`** (In Design first, for the addendum).

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ a 35 cp term where Stockfish charges about 360; the probe; the cited lines |
| 2 | scope and out-of-scope clear | ✅ two terms; the attacker term, mobility, search and game-1 tuning fenced |
| 3 | INVEST-shaped | ✅ independent (disjoint files; D waits on `ABC-204`); valuable alone; `M`; testable |
| 4 | acceptance testable and measurable | ✅ strict relations with counts; mirror exact; ≤ 1 100 ns; depth ≥ 6 and ≥ base; ≥ 54/58; S1 |
| 5 | dependencies known | ✅ `ABC-204` for `A6`; builders named |
| 6 | security/NFR triggers with a measurable target | ✅ `G2`, `G5`, `G6`, `G8` with numbers; no bound moves; no limb |
| 7 | test notes present | ✅ four |
| 8 | size assigned | ✅ `M` |
| 9 | priority assigned | ✅ `P2` |
| 10 | no major unresolved blocker | ✅ the ADR addendum is go-ahead by the owner's word; it is reported, not awaited |
