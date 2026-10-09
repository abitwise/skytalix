---
id: 20261009T202646Z-qe-e2e-observation-abc086-cross-process-and-slice-floor-is-a-ceiling-1e512aa1
kind: observation
by: qe-e2e
at: 2026-10-09T20:26:46Z
verified_by:
confidence: high
refs:
  - ABC-086
  - ADR-0027
  - src/virtual-clock.ts
  - src/engine.ts
  - src/engine.test.ts
  - .grugops/context/ticket-to-pr-ABC-086/notes/20261009T200941Z-software-engineer-claim-abc086-rehop-owed-and-unverified-ae1c2c15.md
supersedes:
---

# `ABC-086` focus 1 and 3: determinism holds across separate processes; the default slice's depth floor is also its ceiling, with a wide margin

Hand-authored, no seal. Probes in `../probe/` (`corpus.mts`, `xproc-worker.mts`, `xproc.sh`,
`floor.mts`), raw output beside them. The corpus is `src/engine.test.ts`'s shared 30, rebuilt in the
probe from the same FENs and the same expansion.

## Focus 1 — separate `node` processes (`probe/xproc.out.txt`, 20:20–20:21Z)

Five configurations × the 30 positions × **three fresh processes**:

- P1 searches forward;
- P2 searches in reverse order, so any cross-call state would land on different positions;
- P3 searches forward after six warm-up searches at other budgets and steps on other clocks
  (`chooseMove` and `createEngine`), to dirty every module-level table first.

Each process uses a fresh shipped `virtualClock` per search. The comparison is the whole row:
move, score, depth, nodes and `elapsedMs`.

| budget / step | rows differing P1 vs P2 | P1 vs P3 | depth histogram |
|---|---|---|---|
| 2 / 1 | 0 / 30 | 0 / 30 | d1 ×10, d2 ×20 |
| 24 / 1 | 0 / 30 | 0 / 30 | d3 ×6, d4 ×9, d5 ×10, d6 ×1, d7 ×4 (**24/30 at ≥ 4**) |
| 24 / 0.5 | 0 / 30 | 0 / 30 | d4–d8 |
| 8 / 0.25 | 0 / 30 | 0 / 30 | d3–d8 |
| 60 / 1 | 0 / 30 | 0 / 30 | d4–d8 |

**450 rows, 0 differ.** That covers fractional steps (exact binary 0.5 and 0.25) and depths up to
8, where LMR acts. Node counts are identical too, which is stronger than move identity.

## Focus 3 — is the slice's `depth ≥ 2` floor a guard or a tautology? (`probe/floor.out.jsonl`)

**The brief's premise needs one correction: the slice does not sit at its floor. It sits at its
ceiling.** At budget 2 and step 1 the clock reads 0 at entry (deadline 2), then 1 at the loop
check, then 2. That third reading is either the first node check, which aborts iteration 2
(depth 1), or the next loop check, which stops the loop after iteration 2 (depth 2). So **depth
is 1 or 2 by construction, never 3.** Measured: no position of the 30 reads above 2 at budget 2.
At budget 3, 10 of the 15 reach depth 3.

- **Depth 2 ⇔ iteration 2 costs ≤ 1 023 nodes** (`NODES_PER_CLOCK_CHECK` − 1).
- **Margin, measured:** iteration 2 costs 38–388 nodes on the 15, so the margin to 1 023 is
  **635–985 nodes, median 940**. The tightest is `position-5` (388 nodes): iteration 2 would have
  to grow **2.6×** before the floor reds.
- The Engineer's claim `…ae1c2c15` ("a change that costs a few hundred nodes could take one to
  depth 1") overstates the fragility. It takes more than 600 extra nodes in iteration 2 on the
  tightest position.

**It is a guard, not a tautology.** Planted as mutant `R1`: a clock that jumps the whole budget in
one read (`virtualClock(budgetMs)` in the slice). The identity half stays green, 30/30 at depth 1.
**The floor goes red, and it is the only row in the slice that does.** It also reds any engine
change that pushes iteration 2 past one clock interval. 10 of the full 30 are already past that
interval (they are the dropped families).

**What it does not guard:** the slice never searches past depth 2. So the default lane's
determinism check never reaches the depths where LMR and the hash-move feedback act. That
coverage lives only in the deep 300/300 (24/30 at depth ≥ 4). This is the re-cut's deliberate
trade, and QE records it so that nobody reads the slice as an LMR guard. Mutant `M7` (a clock
that jumps after its third read) shows the consequence. It is **green in the whole default lane
and red only in the deep depth-4 floor**.
