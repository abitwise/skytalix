# bapm-nfr008-rows observation: what ABC-281's three rows hold that no other default-lane row does (read from source at main 3e87ceaf; nothing run)

BA/PM, task `bapm-nfr008-rows`. Every line below was read with `grep` / `sed`. No test, build or mutant was run, so each "only" is reasoned from source. ABC-281's A6 measures it.

- **R1, `QE-208-a`** (`src/search.null-move.test.ts:495` describe, `:535` it). It is the default lane's only row that aborts inside an open null move.
  - Security/NFR's "what stays" list names two rows. `src/engine.test.ts:848`, "leaves every searched position byte-identical, aborted iteration or not", is `ABC-078` A7. Its clock is spent after the entry reading (`spentBudget`, `:819`), so iteration 1 runs unabortable and the abort comes before any null move opens. That agrees with `ADR-0046`'s census line ("ABC-078 A7 aborts in iteration 2, which tries no null move").
  - The second, `src/search.null-move.test.ts:219` "unmakeNullMove leaves every position byte-identical", is a unit row with no abort.
  - Neither row kills `ADR-0050`'s "null move not unmade on abort" plant, as far as the source shows.
- **R2, `ABC-230` A4** (`src/engine.test.ts:1689`). `grep -rn "priorKeys: \[\]" src/*.test.ts` finds one hit, at `:1700`, inside this row. Its sibling, "the three test-only doors ignore prior keys", reads doors with a non-empty list, not `[]` against absent on `chooseMove`.
- **R3, levels A9** (`src/levels.test.ts:899`). The only "≥ 2 distinct sequences over 5 seeds" row. `grep -n "QE-087-d"` finds the one-draw-per-move assertion (`ADR-0032` d2) at `:906` only. "A7 — seeded" (`:919`) asserts that a fixed seed repeats, and catches neither a seed that is ignored nor an extra draw.
- **Each file's deep pattern:**
  - null-move: `RUN_DEEP` = `SEARCH_DEEP` (`:63`), block at `:723`; the suffix " [deep, SEARCH_DEEP=1]" sits on both the describe and the it titles (`:766`, `:772`).
  - engine: `RUN_DEEP` = `ENGINE_DEEP` (`:78`), block at `:1017`; the describe titles end " [deep, ENGINE_DEEP=1]".
  - levels: `RUN_DEEP` = `ENGINE_DEEP` (`:87`), block at `:1048`; the describe titles end " [deep]".
- **`AGENTS.md`:** 18 429 B (`wc -c`). The budget is 18 432 B (`src/cli.test.ts:2539`, `ABC-109` A5). Only `:98` (null-move, "44 rows") carries a count. `:87` (engine) and `:88` (levels) carry none. No test or tool reads "44 rows" (`grep` over `src` and `tools`).
- **No `src/`, `tools/` or config drift since the review's tree.** `git diff --stat 08843504 3e87ceaf -- src tools vitest.config.ts package.json package-lock.json` is empty. `AGENTS.md` changed (the `scribe-see-lane` merge).
- **Collisions:** of the open tickets naming these files, `ABC-270` and `ABC-279` are merged (per `se-ABC-239b`'s brief). `ABC-239`'s redo may re-pin value rows. None names the three rows.
