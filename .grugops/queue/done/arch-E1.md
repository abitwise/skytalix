---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T21:36:26Z
subtask: arch-E1
role: architect-design
ref: .grugops/context/arch-E1/
branch: new grugops/arch-E1 from main (at dispatch) — worktree .claude/worktrees/arch-E1
width: records; probes ≤ 5 min each wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`; node counts + the arch-next-pull eval instrument; no timing.
---
# Design E1: full tapered evaluation, folding ABC-231 (king by phase) and ABC-232 (passed pawns by phase)
Read arch-next-pull notes (…4de572aa, …d0f1a5fc, …7e3ace66 — ranking, eval instrument), ADR-0056 (E1/E2, Q-3K-4 open), ABC-231/232 pages, ABC-205 history (died on G6 cost), src/evaluate.ts.
- Write E1's ADR (PROPOSED): phase computation, which terms taper (PST mg/eg pairs, king table, passed pawns by rank+phase, others as you judge), per-node cost budget, off-door pair, pre-registered bars (drift vs E1 is expected — use play-relevant bars: mate floor, zugzwang, G1, the eval instrument as INFORMATION only, a node-cost bar for G6), intent GAIN, falsifiers.
- Design for BOTH Q-3K-4 outcomes: default "G6 ≥ base binds" (so cost per node must be near zero — say how, e.g. incremental phase/PST); and the alternative (judged on play with NFR-005's depth-6 floor). State the cost you measure.
- Pre-wire for E2 (ABC-239 tuning): parameters in one table.
- Fix owed LOW: ADR-0056 D2 P1 row "parked after P3" (if not already present).
- Name what BA/PM needs to cut the E1 ticket (ABC-231/232 folded).
Fences: memory-bank/50-decisions and your records only; no src/tests/plans/board. No push, force, amend, rebase, merge into main. Delete scratch; leave nothing running.
Publish: sealed notes (task arch-E1, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result
- **By:** Architect/Design (claude-opus-5-5), branch `grugops/arch-E1` from `main` `a2b593d5` (`src/` tree `58fa3eb4`). Records only.
  - The probes ran on a scratch `git archive` outside the repository, in five batches, each `flock <host-test.lock> timeout 300`. Walls: 9 s, 18 s, 11 s, 30 s, and 1 s + 19 s (the heap guard refused the first lane attempt; no test ran).
  - Only node counts were read; no timing.
  - The scratch copy is deleted, and nothing is left running. Raw: `.grugops/context/arch-E1/raw/probe/`.
- **The ADR: `ADR-0064` (PROPOSED).**
  - **The design:**
    - one linear phase (N 1, B 1, R 2, Q 4, out of 24), gathered in the existing walk;
    - the blend is mg + trunc(Δ × (D − w) / D), with Δ over the differing terms only; bit-exact with the full blend and mirror-exact;
    - every term is a middlegame / endgame pair in one data-only table, `src/evaluate-params.ts` (E2's seam; about 800 numbers);
    - at E1, only the king (endgame half 40 − 15 m, `ABC-231`) and the passers (2 × by rank, `ABC-232`) get endgame halves;
    - the pawn memo stores the passed endgame part (384 → 448 KiB);
    - one switch, `taper`, with three test-only doors (`evaluateWithoutTaper`, `searchWithoutTaper`, `chooseMoveWithoutTaper`); every older door turns it off.
  - **Intent GAIN.**
- **The form choice was pre-registered (PREREG `…01c2d6a5`, committed `b11b802f` before any run).**
  - Both forms pass every play check: mirror 0 / 184, mate floor 0 / 163 and 0 / 189, zugzwang 7 / 7, `G1` 54 (L) and 55 (P) of 58.
  - **The `G6` shape picks L:** S = 1.034, against the plateau P's 1.129 (kiwipete +11–19 %).
  - The evaluation instrument (information only) reads L level with `main` (49 errors against 48) and P better (39). P's limits are two table parameters, so E2's tuner owns them.
- **Cost, measured:**
  - E1 is identical to `main` at phase 24 (7 / 7 positions);
  - `chooseMove` trees on the `G6` boards: kiwipete d8 / d9 0.992 / 0.962, position-6 d8 / d9 / d10 1.034 / 1.012 / 1.005;
  - about 30 operations per evaluate call (0.87–0.90 calls per node, about 26 pieces and 62 mobility squares per call), estimated at 1–2 % of node time (`UNKNOWN - verify`; `G2` reads it).
- **The bars:**
  - B0, node identity with the probe's counts;
  - B1, relations: mirror, phase-24 identity, door identity, king centre ≥ corner + 20 cp, passers ≥ 1.5 × at phase ≤ 6;
  - B2, mate floor 0;
  - B3, zugzwang 7 / 7, hard;
  - B4, `G1` ≥ 54 / 58;
  - B5, `ADR-0061`'s futility audit on the build;
  - B6, `G2` ≤ 1.05 ×;
  - B7, `G6` by `Q-3K-4`: the default is the median ≥ base at 4 000 ms; the alternative is `NFR-005`'s floor only;
  - B8, C2′ GAIN, S′, the Levels lane.
  - **Falsifiers F1–F6.** F3 allows one value-identical cost cut, then STOP and `Q-3K-4` to the owner.
- **Reports** (decide nothing):
  - drift at d5: 98.40 %, max 61 cp;
  - reach: +0.042;
  - `ADR-0061`'s drift and mate rows on E1's scale are clean (100 %, max 0; 0 / 190);
  - the lane with everything tapered: 40 reds in 7 files, all pinned values or fixtures (an upper bound); `src/evaluate*.test.ts` stays green.
- **Owed LOW, fixed:** `ADR-0056` D2 has the "P1 parked after P3" dated line.
  - **Also dated:** `ADR-0056` D2 row E1 → `ADR-0064`; `ADR-0031` addendum status (the taper half is carried by `ADR-0064`; the queen scale and gate are E3's input); `ADR-0061` § Consequences (E1's scale re-read).
- **BA/PM inputs:** decision note `…d8150777` § 4 has page, scope, acceptance B0–B8, row changes from `ABC-231` / `ABC-232`, QE's frozen fixtures, the migration list, dependencies, NFR triggers and UAT.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at` from the UTC clock; 3 of 3 read back):
  - decision `20261102T214348Z-architect-design-decision-01c2d6a5` (PREREG);
  - observation `20261102T215541Z-architect-design-observation-c524a01d` (results);
  - decision `20261102T215541Z-architect-design-decision-d8150777` (decisions, both `Q-3K-4` outcomes, BA/PM inputs, questions).
- **Commits:** claim `78691287`; PREREG `b11b802f`; ADRs + notes + raw `3d20d917`. This Result, the trace row and the move to done/ are in the closing commit. Not pushed, not merged.
- **Open:**
  - **Owner:** `Q-3K-4` (ask now; the Architect recommends judging on play with the depth-6 floor), and *"accept ADR-0064"* (the default is no taper).
  - **Orchestrator:** merge this branch; dispatch BA/PM to cut E1 from `…d8150777` § 4; put `Q-3K-4` and `ADR-0064` to the owner together.

### Trace row (10 cells, header order)

| arch-E1 | E1 design (full taper, ABC-231/232 folded): ADR-0064 PROPOSED, linear phase 1/1/2/4 of 24, delta-only blend in the existing walk, one data-only params table (E2 seam), king eg 40-15m + passers eg 2x only, taper switch + 3 test-only doors; prereg sealed + committed first: forms L/P both pass mirror/mate/zugzwang 7/7/G1, G6-shape S picks L (1.034 vs 1.129); identical to main at phase 24; ~30 ops/eval call (est. 1-2 % node time); bars B0-B8 with G6 graded per Q-3K-4 (default median >= base at 4 s, alt NFR-005 floor); eval instrument L level with main, P better (information, E2 owns phase limits); ADR-0056 D2 P1-parked-after-P3 line added | EPIC-011 | ADR-0064 (new, PROPOSED); ADR-0056 (D2 dated lines: P1 parked after P3, E1 -> ADR-0064); ADR-0031 (addendum dated line: taper half carried by ADR-0064); ADR-0061 (Consequences dated line: E1 scale re-read clean, audit owed) | NFR-005 (B7 per Q-3K-4), NFR-009 (pawn memo 384 -> 448 KiB); no NFR file | `grugops/arch-E1` (records only; claim `78691287`, prereg `b11b802f`, ADR + notes `3d20d917`) | scratch measurements only (deleted; raw kept); BASE reproduces main's door and arch-next-pull's 145 plays to the node | - (records) | - | Records done (Architect); BA/PM: cut E1 from decision d8150777 section 4 (close ABC-231/232 as merged); Owner: Q-3K-4 (now), accept ADR-0064 |
