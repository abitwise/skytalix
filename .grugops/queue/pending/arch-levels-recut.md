---
subtask: arch-levels-recut
role: architect-design
tickets: [ABC-087, ABC-085]
branch: grugops/arch-levels-recut (from main, current tip)
worktree: ../wt-arch-levels-recut
ref: .grugops/context/arch-levels-recut/
---

# Re-cut the difficulty levels so neighbours separate (owner word `…b2e6d4a9`, ADR-0038 menu (b))

**The finding**, from ABC-146's verdict (`.grugops/context/abc146-verdict/notes/…4c1d8e27`), step 4, seeds 1..10:
- **3v4:** 6.5/20 (RED).
- **4v5:** 10/20 (RED), with 22 claimed threefold draws between the two pairs.
- 2v3 and 1v2 are MET, and 1v5 is 100/100.

**The cause** was predicted in ABC-085 § Dependencies, "Named risk to A2":
- `LEVELS` 3/4/5 are 3000/4000/4500 ms, all at blunder rate 0.
- NFR-004's 5 s ceiling allows at most 1.67x.
- One ply costs about 3x.

## Design a new `LEVELS` table
Write it as an ADR, either new or superseding, PROPOSED and for the owner to accept. Each adjacent pair must have a credible path to > 50 % at step 4.

Constraints:
- NFR-004's 5 s hard ceiling.
- `DEFAULT_LEVEL` 3 is `DEFAULT_BUDGET_MS` today, so say whether it moves.
- UCI `Skill Level` 1–5 (ADR-0044 D11, ABC-171, delivered on the branch, not merged) maps onto the same table.
- ABC-087's mechanism stays as it is: a budget plus a blunder rate, with seeded draws.
- Levels are data.

Consider at least these levers:
- spreading budgets downward (fewer plies at the low end);
- small blunder rates at levels 3 and 4;
- a depth cap via `maxDepth` (ABC-170, now on main);
- node caps.

Give each option's predicted effect and evidence. Cheap virtual-clock probes on scratch copies are fine, for example depth reached per level on the A0 positions. Pick one, and state what it costs the default player's experience.

## The re-measure plan
- Which pairs re-run, which seeds, and the expected wall time.
- Whether the full 180-game verdict is needed or only the changed pairs.
- How it stays within ABC-146's staleness rule.

## Fences
- **Records only.** Do not touch `src/` (scratch copies only), `plans/board.md` or `plans/traceability.md`.
- **No timing readings:** virtual clock only, and no wall-clock lane runs.
- Never push, never merge.
- Commit on `grugops/arch-levels-recut`: `git worktree add ../wt-arch-levels-recut -b grugops/arch-levels-recut main`.

## Handoff
Write `.grugops/queue/done/arch-levels-recut.md` and `.claim.md` in main's working tree, uncommitted. Include:
- the commit;
- the ADR id;
- the proposed table;
- the options weighed;
- the re-measure plan;
- the owner questions;
- the ticket shape BA/PM should cut, to become ABC-173;
- a trace row.
