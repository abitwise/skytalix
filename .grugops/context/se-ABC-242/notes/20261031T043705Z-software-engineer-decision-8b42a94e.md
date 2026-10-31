---
id: 20261031T043705Z-software-engineer-decision-8b42a94e
kind: decision
by: software-engineer
at: 2026-10-31T04:37:05Z
verified_by: 
confidence: high: built to the ADR's words, rows run green, parity run on a frozen mutant list
refs:
  - se-ABC-242
  - ABC-242
  - EPIC-010
  - ADR-0054
  - ADR-0032
  - ADR-0046
  - NFR-004
  - NFR-008
  - NFR-009
  - QE-230-a
  - QE-244-a
  - ABC-230
  - ABC-241
  - ABC-243
  - ABC-244
  - grugops/ABC-242
  - 6884d61a
  - 4387d4e8
  - src/levels.ts
  - src/levels.test.ts
  - src/cli.test.ts
  - src/uci-session.test.ts
supersedes: 
seal: sha256:48e7c166fc62dafc526eebbd5d3defdcd41ef31e82e9e46973887f9e264a8476
---

# `ABC-242` built as `ADR-0054` § Proposed amendment 2026-10-30 (accepted) words it: the check in `src/levels.ts` `blunder`

**Branch `grugops/ABC-242`, from `main` `4387d4e8`; code commit `6884d61a`.** Four files, as the brief names them. `src/engine.ts` and
`src/search.ts` are byte-identical to base (`git diff --quiet 4387d4e8 -- src/engine.ts src/search.ts`).

## Production (`src/levels.ts`, +38 lines, 0 removed)
- **`standsTwiceBefore(child, keys)`**, private: the engine's pre-root walk at ply 0 (A2). `oldest =
  -min(child.halfmoveClock, |K|, PRIOR_KEYS_WINDOW)`; returns false with no key computed when `oldest > -4`;
  otherwise `k = repetitionKey(child, zobristKey(child))` and counts `K[|K| + e] === k` for `e = -4, -6, … ≥ oldest`;
  true at the second match. Same bounds as `src/engine.ts` `repeatsBeforeRoot` at `ply = 0`.
- **`PRIOR_KEYS_WINDOW = 100`**, private, its doc pointing at the ADR's A2 and saying it must equal the engine's.
- **In `blunder`**, after `makeMove` and before the deadline and the child search: `if (priorKeys !== undefined &&
  standsTwiceBefore(position, priorKeys)) { scored.push({ move, score: 0 }); return; }`. The `return` sits in the
  `try`, so the `finally` unmakes the move. No clock read, no search; the skipped slice passes to the next child
  through the one deadline (A3). `depth` and `nodes` count the children that ran (A4).
- Header bullet and `blunder`'s doc lines added. **No new import, no new export** (the § A8 import pin and the
  `ABC-078` A4 export pin stay green unedited). `LEVELS`, `DEFAULT_LEVEL`, `HARD_CEILING_MS` untouched (`G9`).

## Tests (10 rows added, 0 edited; `npm test` 2 323 → 2 333)
- `src/levels.test.ts` § "ABC-242 — …" (8 rows): A1 (all 5 fixtures), A1 probe (`scored[0]` = `{d8e8, 0}`, 4 child
  searches of 5), A1 last-in-order (the whole list is base's but its exact 0), A2, A3, A5, A6 (no keys / empty list:
  list, depth, nodes, elapsedMs equal base's), A6 (a non-blunder level-1 draw node-equal to `chooseMove`).
- **Base, in the same run (test note 2):** a test-local oracle, `base()`, that is `main`'s `blunder` loop line for
  line (same clock pattern, same child list, every child searched). It is checked against the real level in the same
  run wherever the check cannot fire (A2, A3, A6: whole list, depth, nodes, and elapsedMs in A6), so it cannot drift.
  Child searches are counted through the file's existing pass-through `chooseMove` spy (`engineCalls`).
- **Fixtures** (5, each with 5 legal moves at the root): QE's probe (Black, losing); `last` (Black losing, `e8d7`
  last in `legalMoves` order: the exact pin); White losing (`d1e1`); White winning and Black winning (KR+P v K+P: the
  rook hemmed in by its own king and a blocked pawn pair, so each root has 5 moves). On the winning ones the loser shuttles to two different squares. **Why:** on a
  plain 2-cycle the loser's reply at the child is itself a third occurrence, so base already scores the winner's
  repeat 0 (read: `KQ v K` with White repeating, base `a2a1:0` at steps 1–1 000). Those fixtures could not show
  "base scores it otherwise", so they were replaced before any row was written.
- `src/cli.test.ts` § "ABC-242 A4 — …" (1 row): the CLI seam `createLevelSeam(1, {seed 7, step 10},
  repetitionKeyHistory)` plays a direct `createLevel(LEVELS[1], …)` call's move; that call is `kind: blunder` and
  its list carries the 0; `seededRandom(7)()` = 0.0117 < 0.4 is asserted.
- `src/uci-session.test.ts` § "ABC-242 A4 — …" (1 row): the three callers on one seed, budget, step, position and
  trimmed list. The session's `random` returns `7 / 2^32`, so `floor(random() × 2^32)` = 7 exactly. Same move from
  all three; UCI's `info` `depth` and `nodes` equal the direct call's; the direct call's list carries the 0.

## Lane form (R1–R4): step 10 on every row, one value on A4's three callers
- Budget: level 1's own 100 ms on every row (rate 1 built in the test, or seed 7 at `LEVELS[1]`). Never the probe's
  2 000 ms on `virtualClock(1)` (R4).
- Parity run (frozen list M1–M8 written before any run): every row's kill set is identical at steps 1, 10, 100 and
  1 000. Condition 2 then decides: at step 1 a blunder call reads 100 times (20 per child); at 10, 10 (2 per child);
  at 100, once. Step 100 turns a multi-check search into a one-check search, so **10 is the coarsest admissible
  step**. Census and kill table: observation (census).
- One row was edited after the first parity run and before the second: A5 first asserted `kind === "blunder"`,
  which killed M1/M6 at step 1 only (M1 makes the `last` fixture a no-candidate at step 1). A5 now asserts that the
  list carries the 0 and then the unchanged pick (`assertPerMove`). The second run (the recorded one) shows parity on
  every row. Both runs are kept in `raw/probe/`.
