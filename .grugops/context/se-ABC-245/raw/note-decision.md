# `ABC-245` built as the page asks: one far-repeat row in `src/levels.test.ts` (matches at −98 and −94), step 10 per level call, header count 19 → 46

Branch `grugops/ABC-245` from `main` `9c008db4`. Code commit `7e81732e`. One file: `src/levels.test.ts` (+60 −1).

## Decision
- **The fixture is a legal reversible game, not a synthetic key list** (Test note 1 preferred form). From the probe's
  FEN `4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1`: a 4-ply cycle back to the start (`b1b2 e8d8 b2b1 d8e8`), then 93 plies on
  which no position repeats (white moves only the queen), ending at a root with black to move and the black king on
  d7. The loser's `d7e8` re-makes the start position: the third occurrence.
  - Child at ply 0; its two earlier occurrences stand at offsets **−98 and −94** of the handed list. Nothing between
    −4 and −92 matches, so any cap below 98 leaves at most one match.
  - Child clock 98, root clock 97: under the fifty-move claim at 100, so `src/gameend.ts`'s 50-move question (Test
    note 1, `UNKNOWN - verify`) does not arise. The caller hands 97 trimmed keys (`trimPriorKeys`) plus the root key:
    98 ≤ 101.
  - Generated in scratch by a seeded DFS (`raw/fixture-gen.ts`, seed 7), then committed as a literal move list.
- **The loser's repeat**, as the page's A3 note suggests: base's child search from the start (white to move, a queen
  up) reads −1005 for black, never 0, so A3 holds without re-choosing.
- **Placement:** a nested `describe("ABC-245 — …")` at the end of the `ABC-242` block, so it reuses that block's
  `gameOf`, `priorOf`, `head`, `base` and `listOf` and its lane form (level 1's 100 ms, rate 1, seed 1, `STEP_MS` 10).
  No `ABC-242` row is edited; the describe's helpers are unchanged.
- **The row asserts:** handed ≤ 101 keys; offsets of the child's key are exactly `[−98, −94]`; each < −50 and within
  `min(child clock, list length)`; child clock 98; the head scores `d7e8` exactly 0; child searches = legal − 1 (7 of
  8); the position is byte-identical on return; base (test-local, same step) labels the same move and reads it ≠ 0;
  head's entries before it equal base's.
- **Step 10, not the fallback.** `ADR-0046` § Ruling 2026-10-31: condition 2 reads a blunder per level call; level 1's
  100 ms is 10 intervals at step 10. A1, A3 and the {cap 8, cap 50} kill set all hold at step 10. The ruling's limit
  does not fire: no child depth is asserted, and the only in-child value (base's score at the repeat, and the prefix
  entries) is compared with a reference run (`base()`) at the same step.
- **Header (SE-242-f):** "DEFAULT (`npm test`, 19 tests)" → **46 tests**, the count the run reports for this file
  without `ENGINE_DEEP` (45 before this row).
