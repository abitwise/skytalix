---
id: 20261010T182536Z-architect-design-observation-abc085-step-readings-equivalence-floor-same-game-both-chairs-d60bfcc9
kind: observation
by: architect-design
at: 2026-10-10T18:25:36Z
verified_by:
confidence: high
refs:
  - ABC-085
  - ABC-086
  - ABC-087
  - ADR-0027
  - ADR-0038
  - src/engine.ts
  - src/levels.ts
  - src/virtual-clock.ts
  - .grugops/context/design-ABC-085/probe/RUN.txt
  - .grugops/context/rescore-p1-backlog-2026-10-10/probe/levels-345-depth.mjs
  - 20261010T172705Z-ba-pm-decision-p1-backlog-two-in-design-two-backlog-0e4da324
supersedes:
---

# Readings behind ADR-0038: the premise reproduces, the step and the budget are one dial, a coarse step floors level 1, and a rate-0 pair plays the same game from both chairs

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). Tree
`489c549e`. The engine path is byte-identical to BA/PM's `aaa88263` (`RUN.txt` gives the diff command).
Every count is deterministic. The wall figures were taken at load1 2–65 and are diagnostic only. Raw output:
`../probe/*.out.txt`.

1. **The premise re-verified.** BA/PM's script ran unmodified:
   - Step 120: moves differ on 9/50 (3v4) and 2/50 (4v5), depth on 23/50 and 12/50.
   - Step 30: moves differ on 2/50 and 0/50, depth on 8/50 and 4/50.
   - Both match `levels-345-depth.out.txt` exactly.
   - Real ms per reading: 3.53 (step 120) and 6.47 (step 30, run alongside the other probes).
   - Steps 10 and 4 were not re-run, because of the 10-minute fence.
2. **Equivalence.** `chooseMove` at (3000, step 120), (750, 30) and (300, 12): identical move, depth AND
   nodes on **50/50** positions. Only `budget ÷ step` matters below `HARD_CEILING_MS`.
3. **Floor** (depth 1 is unabortable):
   - Level 1 (100 ms) median depth is 1 / 2 / 3 / 5 at steps 120 / 30 / 10 / 4. The count at depth 1 is
     **50 / 6 / 0 / 0** of 50.
   - Level 2 (500 ms) is 3 / 4 / 5 / 6, with 3 / 0 / 0 / 0 at depth 1.
4. **Games, step 120, 2 seeded openings × both chairs per pair.**

| pair | plies | wall per game | higher level's score | ended by |
|---|---|---|---|---|
| 5v1 | 34–45 | 3.1–4.1 s | 3.5 / 4 | 3 mates, 1 threefold |
| 4v3 | 115–123 | 12.8–13.3 s | 2.5 / 4 | 1 mate, 2 threefold, 1 insufficient material |
| 5v4 | 67–113 | 10.5–16.5 s | 2.5 / 4 | 1 mate, 3 threefold |

   - No pair played the same game from both chairs at step 120.
5. **Games, step 30, 5v4 only.**
   - Seed 1: **the same 90-ply game from both chairs**, a threefold draw each time.
   - Seed 2: the two games differ, and white wins both.
   - Score **2/4 = 50 % exactly**, at 57–82 s a game (~4.6 ms per reading).
6. **History-blindness.** 6 of the 12 step-120 games and both seed-1 step-30 games ended by threefold.
   - `createLevel` takes a position, so the engine cannot steer out of a repetition. That is the shipped
     engine's behaviour (`createEngine` passes `history.position` only), and the ladder measures it.
   - **The probe ended each game at the first claimable draw. That was a probe policy, not a ruling.**

**What this does not show:** any `A1` or `A2` verdict. Each sample is 4 games, at steps that `ADR-0038`
decision 3 does not admit as verdict steps.
