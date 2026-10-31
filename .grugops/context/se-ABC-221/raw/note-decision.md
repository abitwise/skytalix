# `ABC-221` built as `ADR-0052` D1, D2, D4, D6–D8 word it: `uci-clock-mode` in `src/uci-session.ts`, `HARD_CEILING_MS` 60 000 in `src/engine.ts`

**Branch `grugops/ABC-221`, from `main` `d58f2d77`; code commit `c48a6f83`.** Production is two files, as D8 names them.
`src/levels.ts`, `src/search.ts`, `src/uci.ts` and the CLI files are byte-identical to base.

## Production
- **`src/uci-session.ts`** (+26/−9 lines, code and comments):
  - `TIME_MODES` gains `"uci-clock-mode"` (D1). The `combo` line and the refusal text are spelled from the tuple, so
    both gained the value with no other edit, as `ABC-220` built them to.
  - Two module-private constants (D4, D8): `CLOCK_MODE_CEILING_MS = 60_000` and `CLOCK_MODE_MAX_BUDGET_MS =
    CLOCK_MODE_CEILING_MS - 500` (59 500). No export was added.
  - **D4's rule in `parseGo`.** The `simple-tournament` branch became `timeMode !== "level"`, with one `cap`: T in
    `simple-tournament`, 59 500 in `uci-clock-mode`. No time token gives T in both. `movetime x` gives `min(x, cap)`,
    and a clock gives `min(cap, C)` through the unchanged `safeClockShare`. In `simple-tournament` the two `min`s read
    exactly as before (`cap` = the old `budget` = T). The `level` branch is untouched.
  - `go` needed no edit: the `leveled` flag already skips the level cap and the blunder path in any mode (D1).
  - **Comments.** The header gains the mode's paragraph and its ≤ 60 s busy-latency line (D7). The `TIME_MODES` doc
    no longer says the value is not offered.
  - **`SEC-220-b` (test note 5): the comment only.** `milliseconds` now says what it returns: `Number` of a plain
    decimal, `undefined` for other text, and `Infinity`/`-Infinity` for a figure with more than 308 integer digits.
    The rule is unchanged.
- **`src/engine.ts`: `HARD_CEILING_MS` 32 000 → 60 000** (D6, the owner's Q5; the one clamp move). The module header's
  RF-1 paragraph and the constant's doc now give 60 000 / 60 s, "the largest ceiling in force", with each level held by
  its budget and each mode by its cap. No other line changed.

## Tests
- **`src/uci-session.test.ts`**, a new `describe("ABC-221 …")` after `ABC-220`'s ENGINE_DEEP block, reusing
  `session220`, `replayClock`, `periodGo` and `oracleShare`. A test-local `oracleClockMode` re-derives `min(59 500, C)`.
  - A1 (4 rows): the three-value line, byte-exact and placed; off by default (`movetime 30000` → 4 000, then 30 000
    after a silent `setoption`); a refused value keeps the mode with the three-value line, and the mode survives
    `ucinewgame`; Skill Level 1 and 7 are not read (`movetime 45000` → 45 000 both, 0 draws).
  - A2, A3, A4: the period rows, **on the stubbed `chooseMove`**. Every budget equals the oracle, row by row.
  - A5 (3 rows): 1 900 and 1 069 left; `wtime 800` → 1 (stub); one real-engine row at step 10 (a legal depth-1 move,
    `time` 20).
  - A6 (2 rows): as worded (80 moves, no added time; 17 205 ms after move 80) and alloc.txt's shape (+900 000 after
    move 40; closest 117 735). See the findings note, SE-221-a.
  - A7 (7 rows): the five shapes, the 1-hour C, and one real-engine row at step 5 000 (`movetime 90000` → time in
    [59 500, 69 500]). That row is the behaviour check that the clamp moved: at 32 000 it reads about 35 000.
  - A8 (3 rows, stubbed): every level budget is under both clamps; `TimeMode` unset and `level`: a bare `go` at 1–7
    is each level's budget, and `movetime 60000` at 7 is 30 000. A8's period identity is `ABC-220` A8's 14 rows, which
    run unchanged and green at head (their oracle is base's D4.1/D4.2 rule).
  - A11 row 1 (default lane): `ABC-220` A13's driver in the mode, with `go movetime 30000`, a value only this mode
    hands whole. Step 5 000.
  - A12 (4 rows): the same four inputs in the mode.
  - A10 (`ENGINE_DEEP`, NOT DEFINED unset): one `spawnSync` child with `--expose-gc` (the `ABC-081` A7 / `NFR-009`
    instrument in `src/transposition.test.ts`, as `ABC-212` read it). The child drives the session in the mode on
    `Date.now`: a 1 s warm search and a read, then 3 positions at `go wtime 3600000 btime 3600000 movestogo 40`
    (59 500), each followed by a read. The engine's `time` ≥ 59 500 and wall ≤ 60 000, heap and arrayBuffers growth ≤ 1 MiB,
    arrayBuffers ≤ 16 MiB. The max depth is printed against the tripwire.
- **`ABC-220` A7 block:** A12's four rows (`A12 (ABC-221): …`) through a shared `SIDE_INCREMENT_ROWS` table.
- **Re-pins at this build:**
  - the `uci` reply in `ABC-167` A1 and `ABC-171` A1, and `ABC-220` A1's placed line, now carry the three-value line;
  - `ABC-220` A10's refusal text names the three values, and its refused value `uci-clock-mode` becomes
    `Uci-Clock-Mode` (a case variant of the value now offered);
  - `ABC-220` A8's constants row pins `HARD_CEILING_MS` 60 000 (its title changed);
  - `src/engine.test.ts` RF-1 "names the ceiling" pins 60 000, and two comments give the new numbers;
  - `src/levels.test.ts` clause B pins 60 000 and the largest level ceiling 32 000 ≤ the clamp (its title changed).
    It used to assert the two were equal, which `ADR-0045` A3 required and D6 retires.
- **Removed (1):** `ABC-220` A1 "uci-clock-mode is not offered at this build (ABC-221)". At this build that statement
  is false by design, and `ABC-221` A1 now pins the line.
- **`src/uci.real-engine.test.ts`:** A11 row 2 (A14a in the mode). The A14 block loops over two lanes, `ABC-220 A14`
  (`simple-tournament`, title unchanged) and `ABC-221 A11` (`uci-clock-mode`). Each has its own script from one
  builder and the same four rows, and both read the three-value line. The block is still inside `if (RUN_DEEP)`, and
  `runDialogue` is still the file's only spawn site.

## Choices the ADR left to the SE
- **One `cap` for both modes** instead of a second branch. This keeps D3 and D4 side by side, and it cannot drift
  `simple-tournament`. The `ABC-220` rows pass unchanged.
- **The real-engine rows read time** (class P), so R2 sets no step for them. I picked coarse steps that keep each
  assertion discriminating: 5 000 at 59 500 (12 reads), 5 000 at 30 000 (6 reads), and 10 at a budget of 1 (1 read).
- **A10's memory read goes through a child**, because a vitest worker has no `gc()`. The instrument is the one
  `ABC-212` used, so this follows its precedent rather than inventing a method.
