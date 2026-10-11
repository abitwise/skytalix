---
id: 20261011T093952Z-software-engineer-observation-abc085-vitest-runner-4x-slower-verdict-cost-estimate-x4-70684a78
kind: observation
by: software-engineer
at: 2026-10-11T09:39:52Z
verified_by:
confidence: medium
refs:
  - ABC-085
  - ABC-144
  - ADR-0038
  - .grugops/context/ticket-to-pr-ABC-085/probe/RUN.txt
  - .grugops/context/design-ABC-085/notes/20261010T182536Z-architect-design-observation-abc085-step-readings-equivalence-floor-same-game-both-chairs-d60bfcc9.md
supersedes:
---

# RISK for the verdict run's schedule: inside vitest the engine runs ~4.3x slower per node than under plain node, so `ADR-0038`'s ~10 h verdict estimate is likely ~40–50 h in the `LADDER_DEEP` lane

Hand-authored and unsealed. This is a cost reading on a loaded machine. It is not graded, and it is not a bar.

- **Same games, different wall.** The Architect's probe (plain `node`) and this harness's 3v4 row (vitest)
  played the same four step-120 games back to back at load1 ~2.8. The probe took 11.7–12.2 s a game and the
  harness 57.3–62.0 s.
- **Isolated:** `chooseMove(start, 4 000 ms, virtualClock(120))` ×5 gives 145 765 nodes every time.
  - Plain node took 782 / 791 ms.
  - vitest took 3 379–3 490 ms under both `threads` and `forks`.
  - So it is the runner, not the pool and not the load. `UNKNOWN - verify` why. The likely cause is the vitest
    module transform's import indirection in the hot path, but that is not shown.
- **Effect.** `ADR-0038`'s cost formula uses 3.5–6.5 ms per reading, which is plain-node probe data. Scaling
  this run's step-120 walls by 30x (an estimate; plies at step 4 are `UNKNOWN - verify`):
  - 3v4 ~9.8 h, 4v5 ~10.3 h, 2v3 ~4.2 h, 1v2 ~0.6 h (20 games each);
  - `A1` 1v5 ~18.8 h (100 games);
  - **about 44 h for the full verdict run**, against ~10 h estimated. The test-note-5 pairs (3v4 + 4v5) alone
    are ~20 h.
- **Not acted on; routing.** The lane's home and cost are `ADR-0038`'s (Architect/Design), and the schedule is the
  Orchestrator's.
  - Options seen: (a) accept the longer run; (b) run pairs as separate `-t` processes in parallel, which
    collides with `ABC-144`'s CPU goal; (c) an Architect ruling on running the same harness outside the vitest
    runner. That would be a change to `ADR-0038` decision 5, so it was not done here.
  - `A5` is unaffected: the counts are deterministic and the runner changes only wall time.
