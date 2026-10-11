---
id: 20261011T093952Z-software-engineer-decision-abc085-harness-shape-one-test-file-named-steps-claim-at-first-offer-098699a1
kind: decision
by: software-engineer
at: 2026-10-11T09:39:52Z
verified_by:
confidence: high
refs:
  - ABC-085
  - ABC-087
  - ABC-086
  - ABC-083
  - ADR-0038
  - ADR-0027
  - ADR-0012
  - ADR-0035
  - src/ladder.test.ts
  - plans/tickets/ABC-085-self-play-ladder.md
  - .grugops/context/design-ABC-085/notes/20261010T182536Z-architect-design-decision-abc085-d4-step-4-verdict-step-120-short-ladder-deep-after-abc083-8d778218.md
supersedes:
---

# `ABC-085` build decisions: one test file, two named steps, claim at first offer, A1/A2 printed not asserted

Hand-authored and unsealed (no `finding` is admissible on this install). The page and `ADR-0038` are the
authority; this records only the choices they left to the Engineer.

1. **The file is `src/ladder.test.ts`.** 0 production lines. Nothing is exported. It imports merged
   `history`, `legal`, `levels`, `virtual-clock`, `position` and a type from `engine`, read-only.
2. **Constants:** `SHORT_STEP = 120` and `VERDICT_STEP = 4`. `LADDER_DEEP` picks one: `"1"` or `"verdict"`.
   Any other value throws at load. The default rows refuse `""`, `"0"`, `"true"`, `"4"`, `"120"` and `"VERDICT"`.
3. **One step per run, checked before any move.** `makeSide(level, seed, step)` builds the side's own
   `virtualClock(step)` and records that step. `checkOneStep` throws when the run's step is not one of the two
   literals ("derived from a timing" is refused this way: 30, 10, 119.99999 and 4.000001 are all tested), or
   when either side's recorded step differs from the run's. `LEVELS[n]` is passed to `createLevel` verbatim.
4. **Games:** verdict mode plays `A1` 100 and `A2` 20 per adjacent pair. Short mode plays `A1`'s pair 10 and
   each `A2` pair 4. Seeds are `1..games/2`, and each seed's opening is played twice with the stronger level
   white, then black. The opening is 4 plies picked by `seededRandom(seed)` uniformly over `legalMoves`, the
   same rule as the Architect's probe, so the games reproduce it. A level's draw seed is `10·seed + level`.
5. **Order:** 3v4, 4v5, 2v3, 1v2, then 1v5 (`A1`), with one `it` per pair (test note 5).
   `-t "3v4"` re-runs one pair.
6. **Claim policy (`A3`):** `adjudicate` returns `gameStatusOf`'s ending, or `<draws[0]> (claimed)` when
   `claimable` is present. The loop calls it after every ply, so a claim is always taken at the first offer.
   The `A4` replay re-checks this: no ending before the last ply.
7. **Ply cap 600** (the probe's, never hit). A capped game is `result: "error"`. `scoreFor` throws on it, and
   the pair row fails `A3`.
8. **`A1`/`A2` are printed as MET/RED in verdict mode, never asserted.** The page says a RED is `ABC-087`'s
   finding, not a delivery defect. In short mode the line says "not graded (short mode)" and names the
   criterion as "never A1/A2". `A3` and `A4` ARE asserted.
9. **No wall timeout on the deep rows** (vitest `0`). A synchronous game cannot be pre-empted, so a timeout
   only fails a slow pair that finished. That happened at the first run (4v5, 248.9 s against 240 s). The ply
   cap is the hang guard.
10. **The default lane plays 0 ladder games.** A counter in `playLadderGame` is read by the last row, which is
    defined only when `LADDER_DEEP` is unset.
    - The claim rows drive `runGame` with scripted moves and no engine: a knight shuffle reaching threefold at
      ply 8, and a rook move at halfmove 99.
    - Read those two as rule fixtures, not ladder games. Scripted moves were chosen over an engine game for
      that reason.
