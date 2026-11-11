# qe-ABC-318 checks on tip fb6edbc8 (grugops/qe-ABC-318): C1–C5 read, every gate and both L6 deep reads green, each alone under the host lock, one worker

QE/E2E, task `qe-ABC-318`. Base `main` `902680b7`. Every run was `flock <scratch>/host-test.lock <cmd>`, one at a time, after the tree was clean at `fb6edbc8`. Load at start 0.30.

## Gates
| Gate | Command | Result |
|---|---|---|
| lint | `npm run lint` | exit 0, 150 files, no fixes |
| typecheck | `npm run typecheck` | exit 0 |
| unit | `VITEST_MAX_WORKERS=1 npm test` | exit 0, 72 files, 2740 / 2740 passed, 16.8 s |
| build | `npm run build` | exit 0, `dist/uci.js` written |
| harness | `node --test --test-concurrency=1 tools/rating/pair-check.ts` | exit 0, 52 / 52, 0 skipped, 0 todo |
| skip count | `VITEST_MAX_WORKERS=1 NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | 0 |
| integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| levels deep lane, WHOLE | `VITEST_MAX_WORKERS=1 ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose` | exit 0, 58 / 58, 726.9 s; load 1.05 at start, 1.14 at end |
| UCI session deep, A8′ only | `VITEST_MAX_WORKERS=1 ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts --reporter=verbose -t "the seam built for each level moves exactly as"` | exit 0, 1 passed, 269 skipped by the filter |

## Deep rows that read level 6
- `ABC-212 A4` level 6, REAL clock: 30 / 30 moves at 10000–10002 ms (≥ 10 000, ≤ `CEILING_MS[6]` 12 000), max depth 15, row wall 300 012 ms. The old 300 000 guard would have timed it out, so the raise to 420 000 (`SEC-318-a`) was needed. `SEC-318-a` is resolved.
- `A2` deep, virtual step budget ÷ 50: level 6 `engine, 10200 / 10000` (±20 %, ≤ 12 000). The SE's note `…ca282d42` said no other row of the lane reads L6. That was wrong: this one does, and so does `A8′` in the UCI session lane. Both were run and both pass.
- `A8′` (UCI session deep): the CLI seam for each of levels 1–7 moves as `createLevel` does, on a virtual clock of one budget. Pass.
- The rest of the levels lane passed on the same run. `A5`: level 5 at 30 / 30, max 4002 ms. Level 7: 10 / 10, 30000–30001 ms, max depth 14. The other rows also passed: `ABC-174 A3`, A9, A7, the two A4 rows for the easiest level, A2 on the blunder path, and A3 (puzzles).

## Production diff (`main..fb6edbc8`)
- `git diff --name-only main HEAD | grep -v '\.test\.ts$' | grep '^src/'` lists `src/engine.ts`, `src/levels.ts` and `src/uci-session.ts`. One code line, `LEVELS[6]` 5_000 -> 10_000; every other changed `src/` line is a comment. No `.snap` changed.
- `tools/rating/rating.ts`: header comment only. The rpair argv is pinned by pair-check, 52 / 52.
- The line-43 edit (`fb6edbc8`, "`NFR-005`'s reading on `chooseMove` at 3 s" -> "4 s") is correct. The catalog's `ABC-228` section (`plans/nfr-catalog.md` ~2632, ~2647) moves `NFR-005`'s referent to 4 s, and `NFR-004` clause A reads ≤ 4 s at level 5. It agrees with line 42.

## Test-weakening comparison (main vs tip)
- `src/levels.test.ts`: `expect(` 172 = 172; `it(` 57 = 57; no `.skip`/`.todo`/`.only`.
- `src/uci-session.test.ts`: 524 = 524; 172 = 172; none.
- Changed assertion lines, 7 in all, each exact and each moved to the new value:
  - `CEILING_MS[6]` 7_000 -> 12_000, so the margin stays 2 000 (clause B unchanged);
  - the A1 table row 6;
  - `LEVELS[6]` `toEqual`;
  - A9 bare go `toEqual({ budgetMs: 10_000 })`;
  - the ABC-220 A8 row;
  - the TimeMode-back-to-level `[T_MS, 10_000]`;
  - A4's L6 vitest timeout 300_000 -> 420_000 (a guard, not an assertion).
- No bound was loosened relative to the requirement. The A4 lower bound rose 5 000 -> 10 000.

## C1–C4 records
- **ADRs:** `git diff -U0 main HEAD -- memory-bank/50-decisions/` has 0 deleted lines (ADR-0044 +11, ADR-0045 +109, ADR-0052 +13). ADR-0045 carries the resolution line under "Level 6 plays almost like level 5" and § AMENDMENT 2026-11-11. Its numbers match the code: 10 000 / 0, ceiling 12 s, margin 2 000, max level ceiling 32 000 ≤ 60 000.
- **Catalog:** one deleted line, the `NFR-004` row. A character diff of the row shows insertions only: `~~` around "7", " s~~ 12", one dated amendment, one dated `Verified by` line. "7 s" is struck and kept.
- **`SEC-212-a`:** line 2620 says "about 7 s at level 6". It sits under the dated 2026-10-24 `ABC-212` section (~2552), as the "7 s" at ~2652, ~2777 and ~3032 do. The file's convention keeps a dated section as history. The `ABC-318` section (~3150) records level 6's exposure at about 10 s, bounded at 12 s, rating unchanged. The `uci-session.ts` header and ADR-0044 D5's fold say 12 s at 6. **The dated note suffices; not a gap.**
- **README:**
  - The Levels table reads 10 s, `~2310–2410, projected` (L6) and `~2380–2540, projected` (L7).
  - The blunder cost is stated: 10–14 per point, 50–70 at 5 %; 2094.3 + 50..70 = 2144.3..2164.3.
  - The comparison reads +73 to +79 from 1902.5 at 0.1 s: (2144 − 1902.5) / log2 10 = 72.7, and (2164 − 1902.5) / log2 10 = 78.7.
  - L6 over L5 is 66.1–99.1 (cut note: +65–100).
  - The UCI section states no L6 time.
  - The art cmp exits 0. README outside `## Levels` vs main: cmp exit 0 (199 lines).
- **Method check:** 2144 + 50·log2 10 = 2310.1 and 2164 + 75·log2 10 = 2413.1. L5 (2244/2314 -> 2240–2320) and L7 (2389.3/2532.0 -> 2380–2540) are rounded outward to tens. L6's top edge 2413.1 is written 2410, not 2420 (see the verdict, gap 1).
- **CHANGELOG** Unreleased / Changed: "Level 6 thinks 10 s a move (was 5 s)." and the README line updated. **AGENTS.md:** "levels 6 and 7 think 10 s and 30 s a move".

## Not run (UNKNOWN - verify)
The rest of the UCI session deep lane: 269 rows, including A11's 22 s walls and A10's 59.5 s rows, well over 15 min. None of them reads level 6. Its deep blocks name only `Skill Level` 1 and 7, the default level, and modes that do not read `Skill Level`. The CLI and UCI real-engine lanes play level 1 or the default only.
