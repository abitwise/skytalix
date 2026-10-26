---
id: ABC-208
title: "Null-move pruning in both recursions, behind an ADR-0026 test-only off door, with a zugzwang guard and a bounded oracle"
status: ready
column: Ready
size: M
priority: P2
epic: EPIC-008
feature: —
adr: "ADR-0050 (ACCEPTED by the owner 2026-10-26, …58bcd17c; in force on main at this ticket's merge) plus an ADR-0026 off-door pair"
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
   - *2026-10-26 (BA/PM, `bapm-amend-ABC-208`):* the files also include `src/apply.ts` (`makeNullMove` /
     `unmakeNullMove`, beside `makeMove`) and `src/zobrist.ts` (`zobristKeyAfterNullMove`), per `ADR-0050` decision 7.
     Neither file changes `A4`'s `G1` class B (`ADR-0050` Consequences).
2. **A zugzwang guard.** No null move:
   - while in check;
   - at the root;
   - directly after another null move;
   - when the side to move has **no non-pawn material**.
   The reduction R and any verification search are the ADR's call.
   - *2026-10-26 (BA/PM, `bapm-amend-ABC-208`):* the fourth guard reads **"fewer than three non-pawn pieces"**
     (knights, bishops, rooks and queens) for the side to move, as `ADR-0050` decision 6 rules it. That implies the
     floor above, because no non-pawn material means no null move, so `A2`'s second bullet stands as written. R is 3,
     with no verification search (`ADR-0050` decisions 6 and 7).
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
  - *2026-10-26 (BA/PM, `bapm-amend-ABC-208`):* both sentences compare two builds, head's doors against base's shipped
    search and base's own doors. No single in-tree row can hold both, so QE runs `A1` out of tree, with a base tree and
    a head tree, on the `ABC-078` `A3` corpus at that sweep's budgets. The design probe ran it this way on 222 cells
    (`…bae20026`). The bar is unchanged: every cell is equal in move, score and nodes.
- **`A2` (the zugzwang guard holds).**
  - **Given** **≥ 6** zugzwang positions where a null move would mislead (king-and-pawn endings and the classic
    mutual-zugzwang set), each with a proven best move recorded with its source, **when** the shipped engine searches
    each at a fixed depth ≥ 8, **then** it plays the recorded move in **all** of them.
  - **Given** a position in check, or one with no non-pawn material for the side to move, **then** the instrumented
    search makes **0** null moves there.
  - *2026-10-26 (BA/PM, `bapm-amend-ABC-208`):* "a fixed depth ≥ 8" is read per row. Each row has its own fixed
    depth, the one at which base solves it, from 8 to 12. The set is `ADR-0050` decision 9's seven rows:
    `zugzwang.001` Rf1 d9, `.004` Qxh4 d11 and `.005` Nxd5 d12 (CPW), plus `kpk-b6c6` Kc6, `kpk-c6d6` Kd6, `kpk-d6e6`
    Ke6 and `kpk-e6f6` Kf6, each at d8 (Lichess Syzygy). Following Test note 1, "proven … with its source" means
    sourced, not hand-labelled. The four K+P rows are tablebase-unique wins. The CPW rows carry the suite's label,
    which Stockfish 19 corroborates. `.005`'s label is the suite's best move and not a proven unique win, so even
    without it six rows meet "≥ 6". All 7 must be played. The second bullet's instrument is a call-through mock of
    `src/apply.ts` (`ADR-0050` decision 9).
- **`A3` (bounded drift).** The ADR's bounded oracle is green: on the identity corpus at fixed depth, the shipped
  search's score stays within the ADR's stated bound of the door's score. Mate scores are found as **mate**, with
  distance ≤ the door's distance.
  - *2026-10-26 (BA/PM, `bapm-amend-ABC-208`):* the mate clause is read at the same depth as the centipawn clause,
    5, on both sides, with no extra ply. In the shape of `ADR-0026` decision 9 (Scope 4), it is the mate floor on the
    287 mate-rich corpus: for every position the door scores as a mate at d5, `search()` at d5 scores a mate of the
    same sign, no longer (`ADR-0050` decision 8). Mate-status flips on the 190, which holds 3 mates, are printed as a
    report, as in `ADR-0026` decision 9. The centipawn bound is `ADR-0050` decision 8's. The bar is unchanged.
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
- *2026-10-26 (BA/PM, `bapm-amend-ABC-208`):* **`ADR-0050` is PROPOSED, and accepting it is the owner's call.** The
  build may proceed. The real-clock reading (`G6` and `A5`'s D, ALONE) and the merge wait on his acceptance
  (`…d25ab770`, reading b; `…749ff988`). `A6`'s "the new ADR exists" is met by the file. Its status is the owner's.
- *2026-10-26 (BA/PM, `bapm-close-ABC-211`):* **the owner accepted `ADR-0050`** (`…58bcd17c` item 1). It is in force on
  `main` at this ticket's merge. The gate on the ALONE reading is met, and that reading (`qe-ABC-208`) is running. The QE
  verdict still decides the merge. No criterion changes.

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

**Re-scored 2026-10-26 by BA/PM** (task `bapm-amend-ABC-208`, at `main` `5a7866f0`, after the design ruling).
**Result: 10 of 10. In Design → Ready for Dev.** No criterion's bar changed. Only these rows changed:

| # | item | verdict |
|---|---|---|
| 2 | scope and out-of-scope clear | ✅ the guard is now three non-pawn pieces, and Scope 1 adds `src/apply.ts` and `src/zobrist.ts`. R = 3 at null-window nodes, with no verification (`ADR-0050`) |
| 3 | INVEST-shaped | ✅ the probe found no split: one `M` build, and a split would ship a door with nothing behind it and need a second D |
| 4 | acceptance testable and measurable | ✅ `A1` runs out of tree, across builds. `A2` has seven named rows at per-row depths 8–12. `A3` is read at d5 with `ADR-0050` d8's bounds. `G7` is not owed, because nothing is held between nodes |
| 8 | size assigned | ✅ `M`, confirmed by the probe (about 150–200 production lines in four files) |
| 10 | no major unresolved blocker | ✅ the design is ruled (`…012b1053`), and the status at merge is routed: reading (b) (`…d25ab770`). `ADR-0050` is PROPOSED. The build may proceed. The real-clock reading and the merge wait on the owner (§ Dependencies). `QE-205-c` and `QE-207-g` stay open and do not block |

## Design ruling

> **Architect/Design, 2026-10-26** (task `arch-design-ABC-208`, records plus probes, at `main` `93d79b2d`). The ADR is
> **`ADR-0050`, PROPOSED**: acceptance is the owner's, and the merge waits on it (`…d25ab770`). Notes:
> `.grugops/context/arch-design-ABC-208/notes/`. The probes ran on scratch clones in `<scratchpad>/arch208/` (`base`;
> `h`, the design with probe-only switches for variants; `hd`, the design with no switches), never on `src/`. Plain node
> v26.11.1. **No real-clock search was run and no timing is quoted.** Real-clock deep rows were filtered out by name.
> No `G6`, no game, no D. Every count below is deterministic.

**Result.** Null move at null-window nodes, **R = 3**, no verification search. The guard is the page's four, with the
material condition ruled stricter: **no null move when the side to move has fewer than three non-pawn pieces**. The doors
are **`searchWithoutNullMove`** and **`chooseMoveWithoutNullMove`**. **2 rows go red, both export lists. No value pin, no
level, no NFR bound and no `ADR-0026` level moves.** `G1` 54/58 (= baseline). `A2` 7/7. Frozen-clock position-6 d8 is
**−73.8 %**; `G6` is predicted MET. **Size `M` holds; no split.**

### The ruling, point by point (text and evidence: `ADR-0050`)

| point | ruling | why, in one line |
|---|---|---|
| R | **3 plies**, from remaining depth 2 up. The null child is searched to `depth − 1 − 3` | fewest nodes of R = 2, 3 and adaptive; same `G1` and `A2`; drift similar |
| verification | **none** | neither form tried recovered `zugzwang.004` or `.005`; both cost nodes |
| where | **null-window nodes only** (`alpha + 1 === beta`), so `nullMove` implies `pvs` | PVS's frame, as LMR; a PV node never passes |
| guard | not at the root; not after a null move; not in check; **not with fewer than three non-pawn pieces** for the side to move | floor guard: `G1` 50/58; two pieces: 53/58; three: 54/58, at no cost on the `G6` boards |
| the cut | null score ≥ beta → return **beta**, no table store; the null move resets the halfmove clock | a mate after a pass is no mate; repetition never reaches across a pass |
| rule | one pure exported predicate, `nullMoveReduction(position, depth, ply, afterNull)` → 3 or 0, which both recursions call | `ADR-0026` decision 6's contract |
| doors | `searchWithoutNullMove(position, depth)`, `chooseMoveWithoutNullMove(position, options)`: the pre-ticket shipped path, node for node. Every older door turns null move off | `A1`; cross-build probe 222/222 cells node-equal (6 roots, 7 search doors at d1–4, 3 engine doors at d3/5/6) |
| `ADR-0026` d9 | its LMR drift pair and mate floor re-point their shipped side to the new doors | they then read their pre-ticket values exactly: 118 cp measures LMR alone. **No bound move, no owner question** |
| `A3` oracle | d5 on the 190, both recursions: ≥ 95 % within 25 cp, **none beyond 37 cp**; a **same-depth** mate floor at d5 on the 287 | measured 100 % / 25 cp, 100 % / 8 cp; mate floor 0 of 189 |
| `A2` rows | 7 rows, each at its own fixed depth (8–12): `zugzwang.001`, `.004`, `.005` (CPW; keep non-pawn material) and four K+P v K opposition rows (tablebase-unique wins). Table in `ADR-0050` d9 | the no-guard variant scores 0/7, the floor guard 4/7, the two-piece guard 5/7 |
| files | `src/search.ts`, `src/engine.ts`, plus `makeNullMove` / `unmakeNullMove` in `src/apply.ts` and `zobristKeyAfterNullMove` in `src/zobrist.ts` | mutation lives beside `makeMove`; the key is an O(1) delta (`ADR-0020` d3) |

- **Not policed by the oracle, so pinned by rows:** R = 3, 4 and 5 give identical scores on the 190 at d5 and d6. Null
  in check, a double null and a missing halfmove reset pass it too. The predicate's table, a source row and the
  null-move unit rows catch them (`ADR-0050` Consequences). Returning the null score is a named blind spot (≤ 19 cp).
- **`G7` is not owed:** nothing is held between nodes. **`NFR-004`:** the null subtree counts nodes and checks the clock
  as anywhere else.

### Moved-pin probe (`hd` against `main`'s tests)

- **Base:** default lane 2 090 / 2 090. Deep lanes green (`PUZZLE_DEEP`; `SEARCH_DEEP` search, ordering,
  transposition, quiescence, pvs-lmr; `ENGINE_DEEP` engine, levels, transposition; 10 real-clock rows filtered).
- **`hd`:** default 2 088 / 2 090. Deep: the same two rows, nothing else.

| # | row | change | route |
|---|---|---|---|
| 1 | `search.test.ts` `ABC-077` `A6` export list | + `searchWithoutNullMove`, `nullMoveReduction` | export-list growth (`ADR-0026` d2 precedent; `ADR-0050` d2) |
| 2 | `engine.test.ts` `ABC-078` `A4` export list | + `chooseMoveWithoutNullMove` | the same |
| 3–14 | `search.pvs-lmr.test.ts`, 12 rows whose shipped side is `search()` / `chooseMove`: the engine door bite; `A4` ×2; `A5` (the default guard and two deep rows); the mate floor ×2 (seeds, all 287); the d5 drift ×2; the `A2` companion ×2 | green on `hd` either way; the shipped side re-points to the new door, and every value stays | re-point (`ADR-0050` d4) |

- **0 relations, 0 levels, 0 NFR bounds.** The multiplier cells, the `ABC-121` d5 drift (still 63 cp, unchanged) and
  `G1` read as base.
- **On `main` the drift rows' literal is 75 cp,** and their titles read 75. `ADR-0026` d9 reads 118 since `OD-205-2`:
  the literal change rode `ABC-205`'s unmerged branch. The rows are stricter than the ADR, which is safe. Not
  touched here; flagged for the Orchestrator.

### Frozen-clock pre-check (Test note 4; a count, not a reading)

`chooseMove`, `now: () => 0`, `maxDepth: k`; nodes to complete depth k.

| board | base d7 | head d7 | base d8 | head d8 | head d9 |
|---|---:|---:|---:|---:|---:|
| kiwipete | 609 900 | 590 489 (−3.2 %) | 1 735 339 | 1 259 463 (**−27.4 %**) | 2 907 475 |
| position-6 | 586 333 | 180 941 (−69.1 %) | 1 355 149 | 355 565 (**−73.8 %**) | 940 109 |

- Base's counts equal `arch-design-ABC-207`'s base row (`…439d6f8c`). Head needs fewer nodes than base at both depths
  on both boards, so **the pre-check does not stop the run.**
- **`G6` prediction (for the record, `UNKNOWN - verify`):** on today's `src/` (value-identical to `qe-ABC-215`'s head,
  `…a34270bf`), 3 s bought a median of 1 301 357 nodes on kiwipete (depth 7 ×5) and 1 466 978 on position-6 (depth 8
  ×5). **Predicted MET on both boards:** head needs fewer nodes than base at every depth base completes.
  - Position-6 should reach **9** while head's cost per node rises less than about 55 %.
  - Kiwipete reaches 8 only if that cost rises less than about 3 % (1 259 463 against 1 301 357). Otherwise it stays
    at 7, which equals base.

  The null bookkeeping is a few compares, a board scan of at most 64 squares and two XORs at each null-window node. QE
  reads it.

### Size

**`M` holds; no split.** About 150–200 production lines in four files: the predicate and guard, a null block and a door
per recursion, the null move, and the key delta. The test work is the predicate table, the null-move unit rows, two door
bites, 7 `A2` rows plus the instrument, 3 oracle rows, 12 re-points and 2 export lists. A split would ship a door with
nothing behind it, and it would need a second D.

### Owed by others

- **Owner:** accept or decline `ADR-0050` (the Orchestrator reports it). Nothing else is his: no bound moves.
- **BA/PM, page lines (no criterion changes):**
  - Scope 2's fourth guard reads "fewer than three non-pawn pieces"; the page's floor is implied;
  - `A2` "a fixed depth ≥ 8" reads per row (8–12), with the rows above;
  - `A3`'s mate clause reads at the same depth, 5;
  - `A1`'s "equal base's shipped search" is a cross-build comparison: QE runs it out of tree on the `ABC-078` `A3`
    corpus at that sweep's budgets, as this probe did on 222 cells;
  - Scope 1's files add `src/apply.ts` and `src/zobrist.ts`.
- **Engineer:** the engine header's "null-move pruning … (none requested)" line (`src/engine.ts:73-74`) and
  `src/search.ts`'s header (Scope 5).
