---
id: ABC-208
title: "Null-move pruning in both recursions, behind an ADR-0026 test-only off door, with a zugzwang guard and a bounded oracle"
status: ready
column: Ready
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
>
> *Re-read 2026-10-26 at `main` `1df54ba6` (BA/PM, `bapm-ready-ABC-208`):* the cite is now `src/engine.ts:73-74`, and
> the text is unchanged. `ADR-0026` decision 10 already names null move: "a switch, a pair of doors", off in every
> older door, judged by a bounded oracle.

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
   - *2026-10-26 (BA/PM, `bapm-ready-ABC-208`):* "one new door" reads as one per recursion, the pair that `ADR-0026`
     decision 10 names. The door names and how decision 9's existing drift rows re-point are the ADR's call.
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
    - *2026-10-26 (BA/PM, `bapm-ready-ABC-208`):* this diff touches `src/engine.ts` and `src/search.ts`, so under
      `ADR-0034` decision 2 it has no drift class, and every missed row is class B. A not-a-defect argument goes
      through the `ADR-0026` oracle.
  - `G4` (via `A1`), `G5`, `G8`, `G9`, and `G10` for any red level.
  - `G6`: depth ≥ 6 and **≥ base**. The gain is reported.
    - *2026-10-26 (BA/PM, `bapm-ready-ABC-208`):* read by `EPIC-008`'s `G6` rule (2026-10-25, `…8e51ba1e`): 5
      interleaved runs per board per build, "≥ base" graded by the median, any run below depth 6 FAILs. `QE-205-c`
      is still open, and until the owner answers, "≥ base" is graded.
  - `G7`: re-read only if the design adds a structure held between nodes.
- **`A5` (the reading).** **Given** `ABC-204` is Done, **then** D meets ship rule **S1**. **Reported:** X ± Y, the
  depth gain at 3 s, and `G11`.
  - *2026-10-26 (BA/PM, `bapm-ready-ABC-208`):* one reading, final (`…4c3f7639`). The D budget is `ABC-204`'s frozen
    1 500 ms. Not GAIN after the one extension means not merged, as with `ABC-205` (`G6`) and `ABC-207` (D LOSS), both
    closed under S1. A re-tune reading needs the owner's word.
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
4. **Frozen-clock pre-check (a process step, no bound).** *Added 2026-10-26 by BA/PM (`bapm-ready-ABC-208`), the same
   step as `ABC-207` test note 4 (`…84a05b3a`).* Before the real-clock `G6` reading, QE reports the nodes each build
   needs to complete depths 7 and 8 on `kiwipete` and `position-6` (`chooseMove`, `now: () => 0`, `maxDepth: k`),
   base and head: 8 counts. Null move should lower head's counts (`UNKNOWN - verify`). If head needs more than base
   at a depth base straddles at 3 s, QE stops to Architect/Design before the run. It grades nothing.
5. **The reading runs ALONE** (width 1, AC, quiet host). `QE-207-g` is open: an ALONE claim can outlive
   `queue.stale_ttl_minutes` (30). That is the Orchestrator's kit or config matter, and it does not block this ticket.

## Dependencies

- **`ABC-206` merged.** They share files, and its merge is the D base.
- `ABC-204` Done.
- **Ready trigger:** `ABC-206` reaches Done.
- **Builders:** Architect/Design (the ADR, In Design), the Software Engineer, QE.
- *2026-10-26 (BA/PM, `bapm-ready-ABC-208`):* **the Ready trigger is met.** `ABC-206` merged as `0a9390e5`
  (2026-10-24), and `ABC-204` is Done.
  - **D base:** "its merge is the D base" now reads as this ticket's own merge-base on `main` (`EPIC-008` § D). Since
    `0a9390e5`, `ABC-215` (`5c91e2e4`) changed values in `src/`, so the base carries its tables. `ABC-217` is
    test-only.
  - `ABC-209` and `ABC-210` wait on this ticket. `ABC-211` shares no file, but its reading cannot overlap this one.

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

**Re-scored 2026-10-26 by BA/PM** (task `bapm-ready-ABC-208`, at `main` `1df54ba6`). **Result: 10 of 10. `Ready`.** In
Design comes first. Only these rows changed:

| # | item | verdict |
|---|---|---|
| 3 | INVEST-shaped | ✅ now independent: `ABC-206` is merged (`0a9390e5`) |
| 4 | acceptance testable and measurable | ✅ unchanged criteria, with dated reading lines: `G1` class B (`ADR-0034` d2), the `EPIC-008` `G6` rule, A5 one reading |
| 5 | dependencies known | ✅ `ABC-206` and `ABC-204` Done. The D base is its own merge-base on `main` (it carries `ABC-215`) |
| 7 | test notes present | ✅ five (the frozen-clock pre-check, and ALONE with `QE-207-g`) |
| 10 | no major unresolved blocker | ✅ the sequence hold is gone. `QE-205-c` (owner) and `QE-207-g` (kit) are open, and neither blocks |

- **In Design carries** (the ADR's calls; not blockers): R and any verification search; the door pair's names;
  how `ADR-0026` decision 9's drift rows re-point so that its 118 cp bar still measures LMR alone (moving 118 cp is
  the owner's); which `A2` positions keep non-pawn material, since the guard alone decides pawn-only ones.
- **The ADR's status at merge has two readings.** (a) `…7feb0553` item 2's go-ahead plus the report is enough. (b) A
  new ADR is the owner's (`…5aaf7cec` item 3), so the merge waits on his acceptance, as the `ADR-0031` addendum did
  for `ABC-205`. The Orchestrator routes this when the text lands.
