# se-ABC-298 STOP to Architect/Design: three existing source-shape rows read red at the head and cannot be kept green by a fix inside d1–d3. No figure moved

Software Engineer, task `se-ABC-298`, on `grugops/ABC-298` from `main` `6f943726` (freeze `b9b8eee9` an ancestor; `src/` tree `bba42fb7`). Brief item 3: an identity row reddens and I cannot restore it inside d1–d3, so this is a STOP. Nothing was re-pinned, no row was edited, and the gate was not moved.

## The three red rows (default lane, and the same rows in their deep lanes)

1. `src/search.bundle.test.ts` › "ABC-283 (h) — the history table (ADR-0063 decisions 1-5) › source: each negamax updates once, at its beta cutoff, behind the switch; …". It counts `recordHistoryCutoff(` in the source text: `search.ts` 2 (declaration and negamax), `engine.ts` 1. The head reads 3 and 2.
2. `src/search.null-move.test.ts` › "both recursions try the null move through the predicate, at null-window nodes, and return beta › ./search.ts: calls nullMoveReduction once, …".
3. The same row for `./engine.ts`.
   Rows 2 and 3 slice the source from the null-move gate (`if (switches.nullMove &&` / `if (budget.nullMove &&`) to the first `legalMoves(position);` and require no `storeEntry(` in it. The head stores there.

## Why no fix inside d1–d3 keeps them green

- **d1 step 5 and d3 item 10 require exactly what the rows forbid.** The hash move is searched after the null move and before `legalMoves`. On a cutoff it makes index 0's writes and stores, then returns: nothing is generated. So in each recursion there is a second history-update site and a `storeEntry` between the null-move gate and `legalMoves(position);`. The ADR's own words, "`recordHistoryCutoff` takes a list today, so the Engineer feeds it the cutter without allocating a list per cutoff", describe a second call.
- **Routes I tried, and why each fails:**
  - A private helper in `search.ts` keeps its count at 2. But `engine.ts` can reach the history table only through `search.ts` exports, and `src/search.test.ts` A6 pins that export set exactly. A new export turns A6 red, which I saw in the default lane.
  - Calling `recordHistoryCutoff` from the engine turns row 1 red.
  - The store cannot sit after `legalMoves` in the source: the cutoff returns before the list exists.
- **What would turn them green without a d1–d3 change is code shaped to hide text from the rows.** Examples: an alias of `recordHistoryCutoff`, a call through `.call`, or a helper that wraps `storeEntry`. That evades what the rows read rather than meeting it, so I did not do it.

## What is NOT red: every value row (all from runs on this branch; the readings note has the detail)

- **SG1 (a):** all seven rows equal the freeze, nodes, root move, score and, for `chooseMove`, depth and clock reads. That is `QE`'s `sg1a.mjs` on the head, `cmp`-equal to `sg1a.jsonl`, and the seven new `SEARCH_DEEP` rows, 7 / 7.
- **SG0:** `src/perft.test.ts` blob `8fe75ef0` is unchanged. `PERFT_DEEP=1` reads 32 / 32.
- **SG2 (a) and (c):** 39 + 8 new rows green. SG2 (b) is in the readings note.
- **SG1 (c):** every other existing row is green. `git diff b9b8eee9..HEAD -- 'src/*.test.ts'` has 0 removed lines.
- **Pin lanes:** see the readings note.

## The question for the Architect

Are these three rows identity rows under F2 and d12, which by the owner's question 2 would end V3? Or are they records of the pre-V3 code shape, which `ADR-0077` d1 and d3 item 10 change?

- **My reading:** the second. The rows assert the code's shape, not a value, and no figure moved.
- **Two routes I see, neither mine to take:**
  - (a) A dated Architect ruling that re-points the three rows in place: counts 3 / 2, and the null-move slice ending at the null-move block. That is what `ABC-303` did for its "re-pointed" rows. SG1 (c)'s "changes none" forbids it to the Engineer.
  - (b) Rule that V3 stops (d12).
- **Not recommended:** text-dodging code.
- **Owed after the ruling:** G4 (SG1 (b), about 36 min of lock), `NFR-008`, the build gate and the rest of the deep lanes.
