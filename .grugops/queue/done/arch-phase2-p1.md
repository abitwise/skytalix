---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T14:05:34Z
subtask: arch-phase2-p1
role: architect-design
ref: .grugops/context/arch-phase2-p1/
branch: new grugops/arch-phase2-p1 from main (0d7b9d2f) — worktree .claude/worktrees/arch-phase2-p1. Probes may build on grugops/ABC-264-fix (4d1c0616, reverse futility, QE part 2 running) in a scratch checkout.
width: records; any probe ≤ 5 min and wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`; deterministic node counts only, no timing (a game read holds the host).
---
# Design the next Phase 2 ticket: P1 (LMR by a log table, history-adjusted)
## Read
EPIC-011 Phase 2 rows (P1, P3–P6), ADR-0056 D2/D5/C2′, ADR-0026, ABC-121 (flat 1-ply LMR), ADR-0050, ADR-0059 (accepted; ABC-264 in QE), src/search.ts on grugops/ABC-264-fix.
## Do
- Confirm P1 is the next best Elo-per-cost Phase 2 item (vs P5/P3/P6) on top of ABC-264; if not, design the one that is and say why.
- Write its ADR (PROPOSED; amending ABC-121's LMR / ADR-0026 doors as needed): formula, depth/move-index ranges, exclusions (checks, captures, killers, PV), off-door pair, pre-registered A4 node bar and falsifier, expected GAIN vs NEUTRAL intent (C2′: page names it before the read).
- Note: code waits until ABC-264 merges (shared src/search.ts).
## Fences
memory-bank/50-decisions and your records only; no src/tests/plans/board. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task arch-phase2-p1, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result
- **By:** Architect/Design (claude-opus-5-5), branch `grugops/arch-phase2-p1` from `main` `0d7b9d2f`. Records only.
  The probe ran on a scratch `git archive` of `grugops/ABC-264-fix` `4d1c0616`'s `src/`, outside the repository. Every
  run was under the host lock, each batch ≤ 5 min, with deterministic counts only and no timing. The scratch is
  deleted; the patch, driver and outputs are kept under `.grugops/context/arch-phase2-p1/raw/probe/`.
- **Instrument check:** the door (the flat `ABC-121` rule on `4d1c0616`) reproduces `ADR-0059`'s head counts to the
  node (658 971 / 1 021 190 `search()`, 972 596 / 299 183 `chooseMove`, depth 8).
- **Item: P1 confirmed** (decision `…6a0f09ce`). On the same instrument at depth 8: P1 0.68–0.80×, P3 futility
  0.88–0.91×, P5 depth-grown R 0.83–0.99×. P1 fires at 100 ms (+0.305 ply at 47 000 nodes); P5 is depth-gated. The
  `ADR-0056` D2 estimates and the owner's order agree.
- **ADR-0060 (PROPOSED), the rule:**
  - Formula: `r = max(0, min(⌊1.0 + ln d × ln m / 2.0⌋ − pv, 2, d − 2))`, where m = index + 1 and pv is
    `alphaIn + 1 !== beta`.
  - Eligibility is `ABC-121`'s, unchanged. Captures, promotions, checks, in check and the root are excluded. PV nodes
    get one ply less. Killers get no term (measured: no effect). Cap 2 plies (measured: uncapped loses
    `zugzwang.004` until depth 13 at 4.30× nodes). The child keeps at least one ply. Re-search at full depth is
    unchanged.
  - New export `lateMoveReductionByTable(position, move, depth, index, atRoot, pvNode)`; the table is a 4 KiB
    constant built at load. Switch `logReductions`. Doors `searchWithoutLogReductions` /
    `chooseMoveWithoutLogReductions`; every older door is off. Export lists +2 / +1.
  - It amends `ADR-0026` d6 for the shipped path only (a fourth caller fact, `pvNode`; returns 0/1/2). The flat
    predicate stays for the doors.
- **Measured premise** (observation `…35bd3967`):
  - Depth 8, head / door: `search()` 0.7238 / 0.7086 (kiwipete / position-6), `chooseMove` 0.6795 / 0.8020.
  - Reach on the 190 at 47 000 nodes: 6.237 → 6.542 (+0.305).
  - Drift d5: 100 % within 25 cp, max 16 / 18 cp. Mate floor one ply deeper: 0/163. Zugzwang 7/7. `G1` 54/58.
  - Firing at depth 6: 12.0 % of non-first moves reduced, 41.8 % of them by 2.
- **Pre-registered bars:**
  - `A3`: ≥ 95 % within 25 cp, none beyond 27 cp, 0 sign changes; mate floor one ply deeper; the seven zugzwang rows
    at their recorded depths (never re-pinned deeper).
  - **`A4` (a): ≤ 0.85× the door at depth 8 on kiwipete and position-6, in both recursions.**
  - **`A4` (b): mean completed depth on the 190 at `maxNodes` 47 000 ≥ the door's + 0.25 ply.**
  - `A4` (c): `G6` ≥ base.
  - Instrument check: exact counts 476 991 / 723 582 / 660 887 / 239 944.
  - `A5`: `G1` ≥ 54/58. `A6`: C2′ **GAIN** (≥ 50.0 of 100), named before the read, + S′ + the Levels deep lane.
  - Falsifiers F1–F8 are in the ADR's table.
- **Deferred:** the history term goes to O1h (`ABC-233`), since no history table exists; lifting the cap is a later,
  measured change.
- **Dated lines:** `ADR-0026` d6 (pointer: ADR-0060 would amend it for the shipped path); `ADR-0056` D2 (row P1:
  ADR-0060, history deferred, P1 stays next).
- **Open, for others:**
  - Owner: "accept / decline ADR-0060". Reading (b): the build may start once `ABC-264` merges; C2′ and the merge
    wait on his acceptance.
  - BA/PM: cut the P1 page (title without "history-adjusted"; `A1`–`A6` as above), and decide whether `ABC-233`'s
    page carries the history term in LMR.
  - If `ABC-264` does not merge, P1's counts are re-measured on `main`.
- **Commits:** claim `2a0bb46e`; ADRs + notes + raw `b869f39e`. This Result, the trace row and the move to done/ are
  in the closing commit. Not pushed, not merged.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at` 2026-11-02T14:47:13Z
  from the seal-time UTC clock; 3 of 3 read back, index rendered):
  - observation `20261102T144713Z-architect-design-observation-35bd3967` (the probe);
  - decision `20261102T144713Z-architect-design-decision-6a0f09ce` (item, rule, bars, falsifiers, status);
  - observation `20261102T144713Z-architect-design-observation-eb9078fc` (artifacts, page deltas).

### Trace row (10 cells, header order)

| arch-phase2-p1 | Next Phase 2 item: P1 confirmed (d8 0.68–0.80× vs P3 0.88–0.91×, P5 0.83–0.99×); ADR-0060 log-table LMR ⌊1.0 + ln d·ln m / 2.0⌋, PV −1, cap 2, child ≥ 1, ABC-121 eligibility; switch logReductions, doors searchWithoutLogReductions / chooseMoveWithoutLogReductions; premise measured on scratch 4d1c0616 (d8 0.724/0.709 search(), 0.680/0.802 chooseMove; +0.305 ply at 47k nodes; drift 100 %, max 18; mate +1 0/163; zugzwang 7/7; G1 54/58); A4 ≤ 0.85× + ≥ +0.25 ply + G6; intent GAIN; history term deferred to O1h | EPIC-011 | ADR-0060 (PROPOSED; owner's); ADR-0026 d6 and ADR-0056 D2 dated lines; cites ADR-0050, ADR-0059, ADR-0055 | NFR-005 (A4, G6), NFR-008 (deep rows), NFR-009 (4 KiB constant, level unchanged), NFR-004 (unchanged); no NFR file | `grugops/arch-phase2-p1` (records only; claim `2a0bb46e`, ADRs + notes `b869f39e`) | scratch measurements only (deleted; raw kept); door counts reproduce ADR-0059's head counts to the node | — (records) | — | Records done (Architect); awaits the owner (ADR-0060), ABC-264's merge, BA/PM's P1 page |
