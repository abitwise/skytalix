---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T17:24:16Z
subtask: bapm-P3-page
role: ba-pm
ref: .grugops/context/bapm-P3-page/
branch: new grugops/bapm-P3-page from main (at dispatch) — worktree .claude/worktrees/bapm-P3-page
width: records only.
---
# Cut the P3 (futility pruning) ticket page from ADR-0061
## Read
ADR-0061 (PROPOSED), arch-phase2-p3 notes (…55f7725e, …004b35ed, …e8bec702 — A1–A6 inputs), ADR-0056 D2 dated order (P3 → P1 if green → P5 → P4 after O1h → P6 after E1/E2), EPIC-011 Phase 2 rows.
## Do (plans/ only)
- Cut P3 with the next free ABC id: intent GAIN named on the page, size S, rows A1–A6 from ADR-0061 incl. the cut audit A3(d) and exact reproduction counts, falsifiers, the 100-game read + S′ + Levels. DoR on reading (b): build may start; read and merge wait the owner's acceptance of ADR-0061. Note it shares src/search.ts/src/engine.ts with parked P1 (second to merge re-reads its base).
- Update EPIC-011 Phase 2 order per ADR-0056 D2's dated line; record the owner question (accept ADR-0061). Fix the LOW: ABC-265 page still cites ABC-267 at l.74/106/157 → point to ABC-266 A8.
- Record the D12 MISS on ABC-266 (development blocked pending the Architect's re-proposal; RISK-EPIC011-09 realised).
## Fences
plans/ and your records only. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task bapm-P3-page, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result

**Done, records only** (BA/PM, `grugops/bapm-P3-page` from `main` `6413f91f`; nothing run, built or timed).

- **`ABC-268` (P3, futility pruning) cut** from `ADR-0061` (PROPOSED). Next free id read across `plans/`,
  `memory-bank/`, `.grugops/` and every local branch. Size S, P2, **intent GAIN** named on the page before any read.
  - Rows A1–A6 from `ADR-0061` d4–d10: A1 `G4` node-equal + export lists +3 / +1; A2 `futilityNode` boundary
    (alpha = eval + M[d] true, − 1 false) and seven guard clauses, `futileMove` cells, purity, constant, source row;
    A3 drift (every non-mate ≤ 25 cp, 0 sign changes, both recursions), mate 0 / 189, zugzwang 7 / 7 at 9, 11, 12, 8,
    8, 8, 8, and **the cut audit A3 (d)** (search() d6 over the 190 + 6 named endgames, every 10th skipping node; bars
    ≤ 0.5 % flips and 0 ≥ 200 cp) with **exact counts on `src/` `f2388e40`: 30 272 firing, 2 943 sampled (1 918 / 966 /
    59), 0 flips, door noise 0**; A4 ≤ 0.88× on each of four readings, ≥ +0.20 ply, `G6`, with exact head / door
    counts (888 786 / 1 262 046 / 1 306 981 / 391 451; 1 116 785 / 1 602 457 / 1 575 537 / 476 244; reach 5.558 /
    5.837); A5 `G1` ≥ 54 / 58; A6 C2′ GAIN ≥ 50.0 of 100 at `Threads 1`, S′ at E 1 650, the Levels deep lane, firing
    figure named before the read. F1–F8 mapped to rows.
  - **DoR 10/10 on reading (b):** the build may start; A6 and the merge wait on the owner's acceptance of `ADR-0061`.
    Backlog, Ready recommended (the board move is the Orchestrator's).
  - Shares `src/search.ts` / `src/engine.ts` with the parked P1 (the second to merge re-reads its door counts) and
    with `ABC-266` (blocked). `ABC-265` moving `main`'s tree means A4's instrument check re-reads the door first.
- **`EPIC-011`:** new top block; Phase 2 rows re-ordered P2 (dropped), **P3 (`ABC-268`) → P1 if green → P5 → P4
  after O1h → P6 after E1 / E2**, with dated marks (P4's "after P1" struck); TH-2 phase row and tickets row 18 marked
  D12 MISS; tickets row 20 added; ids line; P1-parked marks; dependencies mark; RISK-08 mark; **RISK-EPIC011-09 marked
  REALISED**; **owner question added: "accept ADR-0061" / "decline it"** (default not accepted; blocks `ABC-268` A6
  and merge only).
- **`ABC-265`:** the three `ABC-267` pointers (l.74, l.106, l.157 at dispatch) now read `ABC-266` A8, struck and
  replaced with dated marks. No row or bar changes.
- **`ABC-266`:** top block records the D12 MISS (median depth 7 at `Threads 1`, 4 and 12 at 100 ms, not loaded;
  lockstep 19 / 20; 0.69× per worker at T12). Development blocked pending `arch-ABC-266-repropose` and a re-cut; DoR
  9/10 with row 10 blocked twice. Marks on the value line, out of scope, dependencies and DoR. No row, bar or scope
  change before the re-cut.
- **Commits:** claim `d4547643`; records `cad4f954`; notes `860821eb`. This Result, the trace row and the move to
  done/ are in the closing commit.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at`
  2026-11-02T17:32:05Z from `date -u`; 2 of 2 read back, index rendered):
  - decision `20261102T173205Z-ba-pm-decision-9018d111`;
  - observation `20261102T173205Z-ba-pm-observation-db3c17c1`.
- **Not touched:** `src/`, tests, `tools/`, `memory-bank/`, `plans/board.md`. No push, force, amend, rebase or merge.

### Trace row (10 cells, header order; also appended to `plans/traceability.md`)

| bapm-P3-page | P3 cut as ABC-268 from ADR-0061 (arch-phase2-p3 004b35ed / 55f7725e / e8bec702): futility pruning, null-window nodes of remaining depth 1–3, not root, not in check, alpha/beta outside the mate band, evaluate + 150/350/550 ≤ alpha → quiet non-checking moves at index ≥ 1 skipped, both recursions; switch futility; doors searchWithoutFutility / chooseMoveWithoutFutility; predicates futilityNode / futileMove; size S, P2, intent GAIN; A1 G4 + export lists +3/+1; A2 d7 boundary and seven guard rows, purity, constant, source row; A3 drift every non-mate ≤ 25 cp both recursions, mate 0/189, zugzwang 7/7, cut audit ≤ 0.5 % and 0 ≥ 200 cp with exact counts on src f2388e40 (30 272 firing, 2 943 sampled: 1 918 / 966 / 59, 0 flips); A4 ≤ 0.88× ×4 (0.7958/0.7876/0.8295/0.8220), ≥ +0.20 ply (5.558 → 5.837), G6, exact head/door counts; A5 G1 ≥ 54/58; A6 C2′ GAIN ≥ 50.0/100 + S′ + Levels; F1–F8; DoR 10/10 reading (b); EPIC-011 Phase 2 order P3 → P1 if green → P5 → P4 after O1h → P6 after E1/E2, owner question accept ADR-0061, tickets row 20; ABC-266 D12 MISS recorded (7/7/7 at 100 ms, not loaded), Development blocked pending arch-ABC-266-repropose, RISK-EPIC011-09 realised; ABC-265 ABC-267 pointers → ABC-266 A8 | EPIC-011 | ADR-0061 (PROPOSED; owner acceptance gates ABC-268 A6 and merge); ADR-0056 D2 dated line; ADR-0062 D12 (MISS) | NFR-005 (G6 floor 6), NFR-004 (no new throw site), NFR-008 (unit rows no search; deep rows behind SEARCH_DEEP/ENGINE_DEEP, reach ~25 s), NFR-009 (four-entry constant) | `grugops/bapm-P3-page` (claim `d4547643`, records `cad4f954`, notes `860821eb`) | records only; nothing run | — (records; UAT owed at ABC-268 by QE verdict) | — | Records done (BA/PM); Orchestrator: ABC-268 Backlog → Ready recommended (DoR 10/10, reading (b)), build may start; owner: accept ADR-0061 / decline (gates A6 + merge); ABC-266 stays blocked for Development until the re-proposal and re-cut |
