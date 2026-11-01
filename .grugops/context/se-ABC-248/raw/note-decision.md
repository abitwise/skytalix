# `ABC-248` built: T2c-a kept (even readings 4–24), T2c-b kept (startpos), T2a moved 4 of 6 (white wtime and black btime stay on WS-WHITE / WS-BLACK), T2d A4-a2 step 1 000; census joins 0

Every decision below follows a rule fixed in the PREREG (`raw/PREREG.txt`, committed `7e9ab524` before any head run;
`frozen-uci.json` sha256 `013a860f…`, 137 mutants apply; `frozen-plants.json` `23811b19…`, 26 plants apply). Base is
`main` `46365ed0`. Each lever was run as its own arm (base + that lever only) and then all together, so each one reverts
alone (`raw/probe/parity-*.out`). No lever failed its rule, so none was left as it was.

## T2c-a (`QE-208-a`, ruling 4): kept, S = {4, 6, 8, …, 24}
- **S:** the even readings 4 to 24, 11 readings, **Σ S = 154 < 322**. This was PREREG candidate 1.
- **The `it` title (ruling 5)** names the readings exactly: "position-6, the even readings 4 to 24: 0 mutated roots,
  and aborts landing inside a null subtree". The `describe` title is unchanged.
- **The code change:** the local `sweep` takes `readings: readonly number[]` instead of `last`, and loops `for (const at
  of readings)`. No `expect(` line changed.
- **Non-vacuity at the tip:** `insideNull` = **4** (readings 8, 10, 18, 22), ≥ 3. Base read 5. `mutated` = [] at the tip.
- **Plant parity:** `engine-no-finally` reds this row at the tip as at base. Its whole kill set is equal: base and tip
  are both {engine-no-finally, min-depth-3, null-no-fullmove}. That holds in arm Ca and in the combined arm C.

## T2c-b (`QE-208-b`, ruling 4): kept, both rows re-rooted on `startpos` (a `fenOf` name), depth 6 unchanged
- **Why startpos:** it was PREREG candidate 1 and the cheapest root with ≥ 3 non-pawn pieces each side (7 / 7).
  - `search()` at depth 6 reads 154 466 → 26 703 nodes.
  - `chooseMove` to depth 6 reads 73 867 → 23 798 nodes.
- **The titles (ruling 5):** "search() on startpos at depth 6" and "chooseMove on startpos deepened to 6". The
  `describe` title is unchanged. The only body change is `fenOf("position-6")` → `fenOf("startpos")`, and no `expect(`
  line changed.
- **Non-vacuity at the tip:** `underNull` = **19** in both rows (base 44 / 44), and `stale` = [] in both.
- **Plant parity:** `search-stale-null-key` reds the `search()` row and `engine-stale-null-key` reds the `chooseMove`
  row, at the tip as at base. The full per-row kill sets are equal:
  - search: {search-stale-null-key, R-5, key-without-ep, null-no-ep-clear};
  - chooseMove: {engine-stale-null-key, R-5, key-without-ep, null-no-ep-clear}.
  - This holds in arm Cb and in arm C.
- **Whole file, all three T2c arms:** 26 / 26 plants are killed at base and at the tip, with none lost.

## T2a (`ABC-167` A5, ruling 3): 4 rows moved, 2 stayed
The rows were taken in the PREREG order. Each one is judged from the base kill sets with the rows already moved taken
out. The tip run then confirms the file.

| row | base kills (ids) | sole default-lane killer of | outcome |
|---|---|---|---|
| "a bare go" | M46, S28, M45b, 174-M10/M11/M17, M07r, S19r, L5-3000, L5-4500 | — | **moved** |
| "G = 3 500, under the default level 5's 4 000" | M01, M03, M04, M46, S28, M45b, 174-M10/M11/M17, S19r, S17r, L5-3000 | — | **moved** |
| "movetime 100" | M46, S28, M45b, 174-M10/M11/M17, S19r, S17r, MOVETIME-OFF | — | **moved** |
| "A5-b3" | M05, M46, S28, M45b, 174-M10/M11/M17, S19r, S17r, MOVESTOGO-1 | — | **moved** |
| "white reads wtime" | M01, M08, M46, S28, M45b, 174-M10/M11/M17, S19r, S17r, WRONGSIDE, **WS-WHITE** | **WS-WHITE** | **stays** |
| "black reads btime" | M01, M08, M46, S01, S04, S28, M45b, 174-M10/M11/M17, S19r, S17r, WRONGSIDE, **WS-BLACK** | **WS-BLACK** | **stays** |

- **`WRONGSIDE` itself** is killed only by "white reads wtime" and "black reads btime" in the default lane. Both stay, so
  it stays killed.
- **Tip confirmation (T2a-only arm, and the combined arm):** 120 of 137 mutants are killed at base and 120 at the tip,
  with none lost. The 17 survivors are the same 17 at base. Every A5 row that stays kills exactly its base ids.
- **The form:** the moved rows sit in `if (RUN_ENGINE_DEEP) { describe("ABC-167 A5 — the D4 time rule, read from the
  info line's time [deep, ENGINE_DEEP=1]", …) }`, the file's pattern at `:2169`.
  - It is placed after `ABC-221 A10` and before `A11`, so `A11`'s M4 sweep still reads their lines in the deep lane.
    (The const `RUN_ENGINE_DEEP` is declared at `:2169`, so a block near A5 would read it in its TDZ.)
  - The `it` titles and bodies are byte-identical, apart from the +2-space indent that the `if` block forces. The
    ABC-228 comment moves with the G = 3 500 row.
  - With `ENGINE_DEEP` unset the block is NOT DEFINED: 230 rows are collected, 0 of them pending.

## T2d (`ABC-167` A4-a2, ruling 2): step 100 → 1 000
- **Parity:** A4-a2's own kill set at 1 000 equals its base set exactly: {M24, M29, M46, S28, M45b, 174-M10, 174-M11,
  174-M17}. File level: 120 → 120, none lost (arm D, and the combined arm).
- **Condition 2:** 4 000 ms is 40 intervals at 100 and 4 at 1 000, as the ruling reads it.
- **Condition 3:** the list was frozen first (the PREREG).
- **The diff:** 1 000 is the coarsest step in the set, and only the step literal changed.
- **Census:** 0 more rows join (see the census note).

## Carried checks
- **QE-244-a:** no step, `LEVELS[5].budgetMs` or `NODES_PER_CLOCK_CHECK` moves. No production file changed, and
  `src/cli.test.ts` is untouched, so the CLI `ABC-241` A4/A7 re-run is not triggered.
- **QE-245-b:** this ticket is its carrier. The remedy is delivered, and the gate's `G8` is QE's (W1).
