---
id: 20261012T123400Z-ba-pm-observation-rescore-product-readings-4f1a9c27
kind: observation
by: ba-pm
task: bapm-rescore-backlog-product
at: 2026-10-12T12:34:00Z
verified_by:
confidence: high
refs:
  - ABC-146
  - ABC-095
  - ABC-096
  - ABC-101
  - ABC-024
  - ABC-083
  - ABC-087
  - ABC-093
  - ABC-094
  - ABC-145
  - ABC-152
  - ADR-0038
  - ADR-0041
  - ADR-0037
  - .grugops/context/bapm-rescore-backlog-product/probe/
supersedes:
---

# Product-half Backlog re-score: what I read, and the commands

This is a hand-authored note with no stamp (`AGENTS.md`: no `finding` is admissible here). **No timing was
read.** Every wall figure is cited. I worked in worktree `../wt-bapm-rescore-backlog-product` at `1eb2edbc`
(= `11c4bfe3` + board and queue docs only: `git diff --stat 11c4bfe3 1eb2edbc -- src tools data` is empty).
`node --version` → v26.11.0.

## Merges and ancestry (`git merge-base --is-ancestor <c> 1eb2edbc` → 0 for each)
- `ABC-083` `f00038ef` (2026-10-11 19:11 +0300)
- `ABC-093` `ac83c3fd`
- `ABC-094` `02dfa044`
- `ABC-087` `b696d8e8`
- `ABC-152` `7a920ca5`
- `ABC-085` `1031911b`

## ABC-146
- **ADR:** `ADR-0038` § Status line 12 reads "Addendum 2026-10-11: ACCEPTED". The addendum's own heading at line 196
  still reads "(PROPOSED; owner acceptance owed)". That is stale text in the ADR, and it is Architect's to fix.
- **Harness:**
  - `git diff --stat 1031911b HEAD -- src/ladder.test.ts src/levels.ts src/virtual-clock.ts` is empty.
  - `md5 -q src/ladder.test.ts` → `bba67b75565b4f4a2e8d231e8bcd6b2e`.
  - `src/evaluate.ts` changed by +142 (`ABC-083`).
  - `grep -n` shows `SHORT_STEP = 120` and `VERDICT_STEP = 4` at `:48-50`, `stepForMode("verdict")` at `:70`, and
    game counts at `:53-56` (verdict 100 + 20/pair; short 10 + 4/pair). `ladderPlan` at `:249-261` gives
    **180** verdict games and 26 short games.
- **Runner-off evidence (cited, not read):**
  - `ADR-0041` names the module runner as the cause of the ~5x factor.
  - `vitest.config.ts` has `experimental: { viteModuleRunner: false }` (`ABC-152`).
  - Security/NFR `…bceca0ca`: `PUZZLE_DEEP=1` printed wall H 3.96 s against B 19.95 s (paired, n = 4).
  - SE `…ac190931`: `LADDER_DEEP=1` over the whole suite, 191 s at the runner-off tip (unpaired, loaded, reported
    only). Against it, `AGENTS.md`'s file-only 848 s with the runner on.
  - **No paired factor reading on `chooseMove` exists after `ABC-152`.** It is `UNKNOWN - verify`.

## ABC-095 / ABC-096 (the book)
- **Artifact:**
  - `ls -la data/opening-book/book.json` → 356,526 B.
  - `shasum -a 256` → `3802f52f3ced9d6911875c778c42246854893afbc4bcdae18b5b01454d4bb41d`.
  - `md5 -q` → `3b42ff79bba0bc9b9db9d7fb9d802642`.
  - `git log -- data/opening-book/book.json` → `5332f501` only.
- **Contents** (node one-liner over `JSON.parse`): keys `format, source, attribution, maxPly, positions`; 5,390
  entries; 3,626 with a non-empty `m`; entry fields `m`, `n`.
- **Names:**
  - 2,853 entries carry `n`, with 2,456 distinct.
  - 0 hold a C0, DEL or C1 byte, and 0 hold an ESC byte. 189 hold a code point above `U+007F`.
  - Lengths in code points: min 9, median 41, p90 63, max 99. 169 are ≤ 21, 1,491 are ≤ 42.
  - Families (the text before the first `":"`): 149, of which 118 are ≤ 21. The longest is 42. 5 are non-ASCII.
- `src/book.ts`: `parseBook` keeps only `m` (`entries.set(key, lines)`). `BookProbe` exposes `inBook` and
  `bookMove`. `createBookProbe` is at `:105`.
- `tools/opening-book/compile.ts:106` refuses a control byte in a name.
- **Keys** (`probe/book-probe.mjs`, `zobristKey(parseFen(fen))`):
  - start `99116e4984517620`, 20 moves;
  - after `1. e4` (with `e3`) 19 replies, `n` "King's Pawn Game";
  - Ruy Lopez `75a8cd2e62c99edd`, `n` "Ruy Lopez".
- **Seams:**
  - `src/cli.ts:176` `engine: createEngine({ budgetMs: DEFAULT_BUDGET_MS })`, and `:170` `runTurnLoop({`;
  - `src/engine.ts:518` `createEngine` (5 lines);
  - `src/turn-loop.ts:150` `EngineSeam`.
- **Frame** (`probe/frame-w.mjs`, `makeRenderSeam` on the start position):
  - 23 rows, `W` 21, in ascii and unicode, idle and thinking;
  - `renderBoard` 9 rows × 18 (`probe/board-w.mjs`);
  - `HISTORY_COLS` = 21.
  - `src/frame.ts` `packRegion` drops an item wider than `W` whole.
  - `beginFrameSession` in-place writes `CURSOR_HOME` before every frame (`:236-240`).

## ABC-101
- `src/levels.ts:42-52`: `LEVELS` 1–5 = (100, 0.4), (500, 0.2), (3000, 0), (4000, 0), (4500, 0), and
  `DEFAULT_LEVEL` 3. `createLevel` at `:110` returns `(position) => LevelChoice | null`.
- `src/engine.ts:122` `DEFAULT_BUDGET_MS = 3_000`, and `:129` `HARD_CEILING_MS = 5_000`.
- `src/cli-options.ts:46-53`: 6 tokens. The default branch is at `:136-138`.
- `src/cli.ts:88` `USAGE`.
- `src/cli.test.ts`:
  - `--difficulty 3` child at `:703`, rejection case at `:1212`;
  - TABLE equality at `:1236-1241`;
  - every-argument-spawned at `:2087-2090`;
  - `devRunSlot` at `:2110-2141`.
- Owner Q5 (book against level), answered KEEP in `…owner-word-six-answers-b7c41e09` item 4.

## ABC-024 (`probe/mutants.mjs`, `probe/witness.mjs`, `probe/mutants.out.tsv`)
- `md5 -q src/moves.ts` → `6335b452fc21ffe2d0f902ecab930840`. The last commit is `52c7b006`. The `empty` arrays
  are at `:295-313`.
- **Witnesses:** all 10 FENs parse, and give `gen[e8g8]` 25, 30, 39; `gen[e8c8]` 26; `gen[e8g8]` 22; `gen[]` 24 × 4;
  `gen[e1g1 e1c1]` 26. That is identical to 2026-08-10.
- **Default lane, `PERFT_DEEP` unset, base 1775/1775 on 57 files:**
  - `BK` g8, `BQ` b8, `BQ` c8, `R-half` and `R-ep` **survive** (1775/1775).
  - `BQ` d8 is killed 1774/1775, by `tools/opening-book/book.test.ts` only.
  - `R-full` is killed 1774/1775, by `src/search.ordering.test.ts` "262 nodes" only.
  - Both controls are killed.
- `PERFT_DEEP=1 vitest run src/perft.test.ts`: 32/32, exit 0.
- `grep` over the hardening file: 113 of 118 FEN literals end `0 1`. 5 carry other scalars. `NO_RIGHT_HELD` is
  at `:602`.

## Failed attempt (recorded)
- In `probe/book-e4.mjs` I passed `makeMove`'s return value straight into `zobristKey`, and it threw. I used the
  FEN with `e3` instead. Not re-run.
