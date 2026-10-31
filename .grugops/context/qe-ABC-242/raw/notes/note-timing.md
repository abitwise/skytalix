# `ABC-242` gates, deep lanes and `G8` at head `6884d61a` (base `4387d4e8`): A7 MET. `G8` H 9.41 s (B 9.21 s, +0.21 s), so `NFR-008` is MET and ABC-244's tranche-2 trigger (> 9.6 s) does NOT fire

## `G8` (ALONE; `qe-scripts/g8.mjs`, qe-ABC-243's harness with only its header line edited)
- `npm test` as spelled, in the order b h h b b h, on trees B and H.
- Wait-clear before every run: 0 foreign vitest (found by bracketed pgrep, then waited on by PID with `kill -0`),
  0 cutechess-cli, load1 ≤ 2.0, Tctl ≤ 60.0 °C.
- Runs 2–6 each waited one 15 s poll for Tctl, which read 71.5–74.6 °C right after the previous run. They started at
  39.3–39.6 °C, so the thermal stop (85 °C) was never near.

| run | tree | rc | wall | CPU | vitest Duration | load1 before / after | tests |
|---|---|---|---|---|---|---|---|
| 1 | B | 0 | 9.21 s | 29.83 s | 8.88 s | 1.24 / 1.43 | 2 323 passed |
| 2 | H | 0 | 9.36 s | 30.07 s | 9.01 s | 1.12 / 1.25 | 2 333 passed |
| 3 | H | 0 | 9.41 s | 30.70 s | 9.08 s | 0.97 / 1.13 | 2 333 passed |
| 4 | B | 0 | 9.34 s | 30.47 s | 8.99 s | 0.96 / 1.52 | 2 323 passed |
| 5 | B | 0 | 9.18 s | 29.84 s | 8.86 s | 1.18 / 1.60 | 2 323 passed |
| 6 | H | 0 | 9.49 s | 30.61 s | 9.16 s | 1.25 / 1.36 | 2 333 passed |

- **Medians of 3: B 9.21 s, H 9.41 s, H − B +0.21 s.** CPU medians: B 29.84 s, H 30.61 s.
- **Admissible:** all 6 runs rc 0, load1 ≤ 1.60.
- **`NFR-008` MET** (9.41 ≤ 10 s). **Tranche 2 NOT fired** (9.41 ≤ 9.6 s, margin 0.19 s). No STOP.
- **Against the ticket's estimate** of +0.05 to +0.15 s, the read is +0.21 s, a little above it.
  - The per-file vitest medians grow +30 ms for `levels.test.ts`, +22 ms for `uci-session.test.ts` and +18 ms for
    `cli.test.ts`, about 70 ms in-thread in all, or about 0.035 s of wall at 2 slots.
  - The rest is inside the run-to-run spread: B reads 9.18–9.34 s and H reads 9.36–9.49 s (`g8/g8-perfile.txt`).
  - Head is now 0.19 s under the tranche-2 line. That is the Orchestrator's watch line, not a gate.

## A6 / A4 names (`qe-scripts/names.mjs` on the G8 runs' `last-run.json`, 3 B/H pairs)
- Totals: B 2 323, H 2 333, failed 0 and skipped 0 in every run.
- Per-file counts: `cli.test.ts` 108 → 109, `levels.test.ts` 37 → 45, `uci-session.test.ts` 201 → 202.
- Exactly the 10 `ABC-242` rows are added and none is removed. The sorted names' sha256/12 equals between B and "H minus
  the added rows" (`591600527f07`) in all 3 pairs, so the `ABC-078` A3 corpus and the `ABC-230` / `ABC-241` rows run
  unedited (`g8/a6-names.txt`).

## A7 gates at H (`raw/gates/`)
- `npm run lint` exit 0 ("Checked 131 files … No fixes applied."), `npm run typecheck` exit 0, `npm run build` exit 0. The
  `dist/` output was deleted afterwards, and H was re-compared with `git archive 6884d61a`: clean.
- `npm test` green ×3 at H (G8 runs 2, 3 and 6), 2 333 passed, skips 0.
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings."
- **`G9` MET** (`qe-scripts/g9.mjs`): these are byte-equal between B and H:
  - the `LEVELS` block, `EASIEST_LEVEL`, `DEFAULT_LEVEL` and `HARDEST_LEVEL`;
  - the sum clamp `Math.min(level.budgetMs, HARD_CEILING_MS)` and `HARD_CEILING_MS`;
  - whole-file `engine.ts`, `search.ts`, `level-seam.ts`, `uci-session.ts`, `cli.ts`, `history.ts`, `gameend.ts`,
    `zobrist.ts`, `quiescence.ts` and `transposition.ts`;
  - `levels.ts`'s export and import lists.
- **`G4`:** the engine files are byte-identical and `engine.test.ts` / `search*.test.ts` are green in the lane.
  **`G10`:** no level reddened. **`G5`:** the level layer's clamp is unchanged, and the deep lane's level-5 A5 reads a
  max of 4 002 ms over 30 moves (≤ 5 s).
- **`ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 node_modules/.bin/vitest run src/levels.test.ts --reporter=verbose`**,
  once, ALONE (clear at load1 1.01, Tctl 38.3 °C): **53/53 passed**, wall 577.45 s, exit 0.
  - Level 5 A5: max 4 002 ms over 30 moves. A3: easiest 32/58, default 54/58.
  - The 8 `ABC-242` rows are green in that lane too.
- **`LADDER_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 node_modules/.bin/vitest run src/ladder.test.ts`**, once, ALONE
  (clear at load1 0.78): **18/18 passed**, wall 25.5 s, exit 0. The pair lines were not printed by the default reporter
  (QE-242-c).
- Spelling: `node_modules/.bin/vitest`, not bare npx (the brief's fence), as at qe-ABC-243.
- **A7 MET.**
