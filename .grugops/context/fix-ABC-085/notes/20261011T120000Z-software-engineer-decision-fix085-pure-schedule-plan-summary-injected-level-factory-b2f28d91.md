---
id: 20261011T120000Z-software-engineer-decision-fix085-pure-schedule-plan-summary-injected-level-factory-b2f28d91
kind: decision
by: software-engineer
at: 2026-10-11T12:00:00Z
verified_by:
confidence: high
refs:
  - ABC-085
  - ADR-0038
  - QE-085-a
  - QE-085-b
  - QE-085-c
  - src/ladder.test.ts
supersedes:
---

# fix-ABC-085 shape: pure schedule, plan and pair summary; level factory injected; four default rows on synthetic records

Hand-authored and unsealed. This is the shape QE suggested (the SE's call), and it stays inside the fence of the test file only.

1. **`colourSchedule(weaker, stronger, games)`** returns `{seed, white, black}[]`. `playPair` maps it onto `playLadderGame`, so the deep
   lane plays exactly what the default row pins. It now refuses a game count that is odd or not positive (RangeError).
2. **`ladderPlan(verdict)`** is the five pairs in order with their counts and criterion. The deep lane uses it unchanged.
3. **`summarizePair(played, stronger, criterion)`** returns score, W/D/L, claimed, pct, `met` and reasons. The deep row prints it. `pct` is
   divided by `played.length`, and the deep row now also asserts `played` has `games` entries.
4. **`makeSide(..., make = createLevel)`**: a default row hands in a spy, and asserts `LEVELS[level]` is passed **by identity** (so it was not
   copied or scaled), along with the seed and the side's own clock.
5. **The rows** (all in the default lane, with 0 ladder games, on synthetic `LadderGame` records):
   - constants + plan: the counts 100/20/10/4, `PLY_CAP` 600, and both plans written out in full;
   - budgets verbatim;
   - colour schedule;
   - pair arithmetic: 9/10 is exactly 90 % MET for A1, 8/10 is RED, 2/4 is RED for A2, 2.5/4 is MET, and automatic draws are not claimed.
6. **Not pinned:** the `PLY_CAP` argument at the `runGame` call in `playLadderGame`. Pinning it in-process needs a 600-ply game that never
   ends, so QE's M13 (the constant) is what this pins.
