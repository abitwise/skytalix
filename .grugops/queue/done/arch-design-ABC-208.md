---
subtask: arch-design-ABC-208
role: architect-design
ticket: plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
ref: .grugops/context/arch-design-ABC-208/
branch: new grugops/arch-design-ABC-208 from main, worktree ../wt-arch-design-ABC-208
width: 2 of 3 (beside arch-source-ABC-211; no real-clock timing, no G6, no games)
---

# Design ABC-208: null-move pruning (PROPOSED ADR) + ADR-0026 door pair

## Do
- Per BA/PM `bapm-ready-ABC-208/…75bf6402` and Orchestrator `orch-2026-10-26c/…d25ab770`, rule the design on `main` and write the **new ADR as PROPOSED**. The owner accepts it; do not mark it accepted. Rule on:
  - R and any verification search, and the zugzwang guard.
  - The ADR-0026 off-door pair: names, one per recursion.
  - ADR-0026 d9's drift rows, re-pointed so that 118 cp keeps measuring LMR alone. If that needs a bound move, write it as an owner question; do not move it.
  - The A2 zugzwang positions, choosing ones that keep non-pawn material.
- Moved-pin probe on a scratch clone: list every row that moves, with its route. An ADR-0026 level or NFR bound move → STOP.
- Frozen-clock d7/d8 counts (kiwipete, position-6; base and head) with a G6 prediction, for the record.
- Size check (M; split if it grows).
- Write the ruling into the page's `## Design ruling`.

## Fences
- Only your worktree, scratch clones and `<scratchpad>/arch208/`. No product code is committed. Default and deterministic deep lanes only; no real-clock rows. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task arch-design-ABC-208). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

Architect/Design, 2026-10-26, branch `grugops/arch-design-ABC-208` @ `503a1baf` (= `main` `93d79b2d` + records; not
pushed, not merged). `main` has since moved to `35c49eb5` (the ABC-211 records): no `src/`, `data/` or shared file, so the
branch merges clean and the probes hold. Probes on scratch clones in `<scratchpad>/arch208/` (`base`; `h`, the design with
probe-only switches; `hd`, the design hardcoded). No `src/` edit committed, no real-clock timing (real-clock deep rows
filtered by name), no `G6`, no games, no D.

- **ADR: `ADR-0050`, PROPOSED** (the owner's to accept; the merge and the ALONE reading wait on it, `…d25ab770`).
- **Ruling:**
  - **R = 3** from remaining depth 2. The null child is searched to `depth − 1 − 3` with `(−beta, −beta + 1)`. A cut
    returns beta and stores nothing. **No verification search:** neither form tried recovered `zugzwang.004` or `.005`.
    Null move only at null-window nodes, so `nullMove` implies `pvs`.
  - **Guard:** the page's four, with the material one ruled stricter: **fewer than three non-pawn pieces → no null
    move.** `G1`: floor guard 50/58; two pieces 53/58; three pieces 54/58 (= base). The `G6` boards' counts are
    identical across guards 1–4. One pure predicate, `nullMoveReduction(position, depth, ply, afterNull)` → 3 or 0.
  - **Doors:** `searchWithoutNullMove` and `chooseMoveWithoutNullMove`, the pre-ticket shipped path node for node
    (222/222 probe cells). Every older door turns null move off. `makeNullMove` / `unmakeNullMove` go in
    `src/apply.ts` (halfmove clock reset), and `zobristKeyAfterNullMove` in `src/zobrist.ts`.
  - **`ADR-0026` d9:** its drift pair and mate floor, and every other `ABC-121` row whose shipped side is
    `search()`/`chooseMove` (12 rows in `search.pvs-lmr.test.ts`), re-point to the new doors. **118 cp keeps measuring
    LMR alone. No bound move, no owner question on it.**
  - **`A3` oracle:** d5 on the 190, both recursions, ≥ 95 % within 25 cp, none beyond **37 cp**. The mate floor is at
    the same depth (d5) on the 287. Measured: 100 %/25, 100 %/8, 0 of 189. It is a regression net: R 3–5, null in
    check, double null and no halfmove reset pass it, and the predicate table, a source row and unit rows catch them.
  - **`A2`:** 7 rows at their own depths (8–12). CPW `zugzwang.001` Rf1 d9, `.004` Qxh4 d11 and `.005` Nxd5 d12 keep
    non-pawn material (Stockfish 19 searchmoves corroborates each). Four K+P v K opposition rows, each a
    tablebase-unique win at d8. No guard: 0/7; floor guard: 4/7; two pieces: 5/7.
- **Moved-pin set: 2 red rows (export lists: `ABC-077` `A6`, `ABC-078` `A4`; route: export-list growth) + 12 re-points
  (green either way). 0 value pins, 0 relations, 0 levels, 0 NFR bounds, no `ADR-0026` level. No STOP.** Base: default
  2 090/2 090, deep all green. `hd`: default 2 088, deep the same 2.
- **Frozen-clock, base → head:**
  - kiwipete d7 609 900 → 590 489; d8 1 735 339 → 1 259 463 (−27.4 %);
  - position-6 d7 586 333 → 180 941; d8 1 355 149 → **355 565 (−73.8 %)**;
  - head d9: kiwipete 2 907 475, position-6 940 109.
- **Predicted `G6` MET** (`UNKNOWN - verify`). Position-6 reaches 9 while head's cost per node rises less than about
  55 %. Kiwipete reaches 8 only if it rises less than about 3 %; otherwise it stays 7, which equals base. The pre-check
  does not stop the run.
- **Size: `M` holds; no split.** About 150–200 production lines in four files.
- **Owner:** accept or decline `ADR-0050`. Nothing else.
- **BA/PM page lines (no criterion change):** Scope 2's fourth guard; `A2`'s per-row depths and rows; `A3`'s same-depth
  mate clause; `A1` as a cross-build check QE runs out of tree; Scope 1 adds `src/apply.ts` and `src/zobrist.ts`.
- **Flag (Orchestrator):** on `main` the `ABC-121` d5 drift rows assert ≤ 75 cp while `ADR-0026` d9 reads 118 cp
  (`OD-205-2`; the literal rode `ABC-205`'s unmerged branch). Stricter, so safe. Not touched.
- **Notes** (`.grugops/context/arch-design-ABC-208/notes/`): decision `…012b1053`, observation `…bae20026`.

**Trace row** (for the Orchestrator):

| ABC-208 (arch-design-ABC-208) | design ruled: null move at null-window nodes, R = 3, no verification, guard below 3 non-pawn pieces; doors searchWithoutNullMove / chooseMoveWithoutNullMove; ADR-0026 d9 rows re-pointed (118 cp stays LMR's); oracle d5 ≥ 95 % ≤ 25 cp, max 37 cp, same-depth mate floor; 2 pins move (export lists) + 12 re-points; M, no split | EPIC-008 | +1 ply expected at 3 s (position-6); the depth-limited 8.e5 / 10.Ne4 errors | NFR-005 G6: frozen-clock position-6 d8 −73.8 %, kiwipete d8 −27.4 % (predicted MET); G1 54/58; A2 7/7; null drift d5 25/8 cp; NFR-004 unchanged; G7 not owed | grugops/arch-design-ABC-208 @ 503a1baf (93d79b2d + records)<br>ADR-0050 (PROPOSED)<br>.grugops/context/arch-design-ABC-208/notes/ (2) | default + deterministic deep lanes on scratch clones; 12 planted mutants; frozen-clock d6–d9; tablebase + Stockfish corroboration; no timing | UAT owed at build (QE verdict signs) | owner accepts/declines ADR-0050; BA/PM page lines; Orchestrator merges records, then In Design → Ready for Dev | In Design → Ready for Dev (build may start; merge and reading wait on ADR-0050) |
