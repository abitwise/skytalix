---
id: ABC-208
title: "Null-move pruning in both recursions, behind an ADR-0026 test-only off door, with a zugzwang guard and a bounded oracle"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-008
feature: —
adr: "NEW ADR (null-move pruning) plus an ADR-0026 off door; route the text to the owner when it lands (…7feb0553)"
---

# ABC-208: null-move pruning

> **Cut 2026-10-23 by BA/PM** (task `bapm-cut-engine-strength`, records only, at `main` `55a8f4ef`). Proposal 5 of
> `…f1771bb3`; owner word `…7feb0553`.
>
> **ADR touch point: a new ADR, plus an `ADR-0026` door.** The engine header lists null-move pruning as "none
> requested" (`src/engine.ts:69-71`). It changes values, so under `ADR-0026` it arrives behind a test-only off door,
> with a bounded oracle and not identity. Architect/Design writes the new ADR In Design. The owner's acceptance of the
> proposal is the go-ahead (`…7feb0553` item 2). **The Orchestrator reports the ADR text to the owner when it lands.**

## Problem

- **User:** the owner at level 5.
- **Pain:** the search reaches depth 6–10 in 3 s. 8.e5? and 10.Ne4? needed one and two plies more.
- **Value:** typically +1 to 2 plies at the same budget (the analysis's general figure). This game's own evidence is
  the two depth-limited errors (`UNKNOWN - verify`).

## Scope

1. Null-move pruning in **both** recursions (`src/engine.ts`, `src/search.ts`), so the identity oracle still runs one
   algorithm (`ADR-0025` decision 6 precedent).
2. **A zugzwang guard.** No null move:
   - while in check;
   - at the root;
   - directly after another null move;
   - when the side to move has **no non-pawn material**.
   The reduction R and any verification search are the ADR's call.
3. **An `ADR-0026` door.** Every test-only door that exists before this ticket turns null move off, so each one
   reproduces its pre-ticket search node for node (`ADR-0026` decision 3 pattern). One new door turns null move off
   on the shipped path.
4. **A bounded oracle** for the drift, in the shape of `ADR-0026` decision 9.
5. The new ADR, and the engine header's "none requested" line updated.

## Out of scope

- Other pruning (futility, razoring, LMP), aspiration windows, and any evaluation change.

## Acceptance criteria

- **`A1` (the door reproduces the pre-ticket engine).** **Given** the new off door, **then** on the `ABC-078` `A3`
  corpus at every depth that sweep reads, the move, the score and the nodes equal base's shipped search. Every
  pre-existing door is node-equal to its pre-ticket self.
- **`A2` (the zugzwang guard holds).**
  - **Given** **≥ 6** zugzwang positions where a null move would mislead (king-and-pawn endings and the classic
    mutual-zugzwang set), each with a proven best move recorded with its source, **when** the shipped engine searches
    each at a fixed depth ≥ 8, **then** it plays the recorded move in **all** of them.
  - **Given** a position in check, or one with no non-pawn material for the side to move, **then** the instrumented
    search makes **0** null moves there.
- **`A3` (bounded drift).** The ADR's bounded oracle is green: on the identity corpus at fixed depth, the shipped
  search's score stays within the ADR's stated bound of the door's score. Mate scores are found as **mate**, with
  distance ≤ the door's distance.
- **`A4` (existing gates).**
  - `G1`: ≥ 54/58. The mate-in-2 and mate-in-3 rows are where null move bites; a red is classed per row under
    `ADR-0034`.
  - `G4` (via `A1`), `G5`, `G8`, `G9`, and `G10` for any red level.
  - `G6`: depth ≥ 6 and **≥ base**. The gain is reported.
  - `G7`: re-read only if the design adds a structure held between nodes.
- **`A5` (the reading).** **Given** `ABC-204` is Done, **then** D meets ship rule **S1**. **Reported:** X ± Y, the
  depth gain at 3 s, and `G11`.
- **`A6` (the ADR).** **Then** the new ADR exists. It states R, the guard and the bound, and records that the
  Orchestrator reported it to the owner.

## NFR triggers

- **`NFR-005`:** expected to improve, read by `G6`.
- **`NFR-004`:** the abort granularity is unchanged. The clock is checked inside the null-move subtree as anywhere
  else.
- **`NFR-008`:** report `N8-LANE`. Deep oracle rows go behind an opt-in variable if they are slow.
- **Bounds moved:** none planned.
- **Security:** no limb, no hop.

## Test notes

1. The zugzwang positions carry their source, as `ABC-084`'s mates do. Test rows are not hand-labelled guesses.
2. Deterministic mode (`ADR-0027`) still holds: same input and same virtual clock give the same move.
3. UAT is owed (production lines). The QE verdict signs it.

## Dependencies

- **`ABC-206` merged.** They share files, and its merge is the D base.
- `ABC-204` Done.
- **Ready trigger:** `ABC-206` reaches Done.
- **Builders:** Architect/Design (the ADR, In Design), the Software Engineer, QE.

## Size and priority

- **`M`:** two recursions, a guard, a door, an oracle, an ADR.
- **`P2`:** medium to high general gain.

## Definition of Ready

BA/PM, 2026-10-23, at `main` `55a8f4ef`. **Result: 9 of 10. `Backlog`** until the Ready trigger above.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ depth-limited errors; "none requested" cited |
| 2 | scope and out-of-scope clear | ✅ both recursions, guard, door, oracle; other pruning fenced |
| 3 | INVEST-shaped | ✅ valuable alone; `M`; testable. Independent once `ABC-206` lands |
| 4 | acceptance testable and measurable | ✅ node-equal door; 6 of 6 zugzwang moves; 0 null moves in check; bounded drift; S1 |
| 5 | dependencies known | ✅ `ABC-206`, `ABC-204`; ADR routing named |
| 6 | security/NFR triggers with a measurable target | ✅ `G5`, `G6`, `G8` with numbers |
| 7 | test notes present | ✅ three |
| 8 | size assigned | ✅ `M` |
| 9 | priority assigned | ✅ `P2` |
| 10 | no major unresolved blocker | ⏳ held by sequence: `ABC-206` |
