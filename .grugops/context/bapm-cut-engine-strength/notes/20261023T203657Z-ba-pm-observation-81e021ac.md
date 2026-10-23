---
id: 20261023T203657Z-ba-pm-observation-81e021ac
kind: observation
by: ba-pm
at: 2026-10-23T20:36:57Z
verified_by: 
confidence: high (each item read live at main 55a8f4ef; host tools re-hashed; one book probe in the scratchpad)
refs:
  - EPIC-008
  - ABC-204
  - ABC-205
  - ABC-206
  - ABC-207
  - ABC-208
  - ABC-209
  - ABC-210
  - ABC-211
  - owner-word-2026-10-23/…7feb0553
  - arch-analyse-game-1/…f1771bb3
  - memory-bank/analysis/2026-10-23-game-1.md
  - ABC-202
  - ABC-083
  - ADR-0023
  - ADR-0026
  - ADR-0028
  - ADR-0031
  - ADR-0034
  - NFR-001
  - src/puzzle-suite.baseline.json
  - data/opening-book/book.json
supersedes: 
seal: sha256:d1f7ce02a67c737666f659bae64be433c2e23e24bbd93929507d40240906885f
---

# What BA/PM read and probed before cutting EPIC-008 (records only, at `main` `55a8f4ef`)

1. **Owner word.** `…7feb0553` item 2 accepts all 8 proposals of `…f1771bb3`. The owner's acceptance is the go-ahead for the ADR work each needs. Each ADR text is still reported to him, and NFR bound moves stay his. Item 4: competition entry touches ADR-0007, ADR-0018 and ADR-0044 D8 and is his call.
2. **Source.** `memory-bank/analysis/2026-10-23-game-1.md` § 6 ranks the proposals: 1 king safety, 2 harness, 3 speed-up, 4 mobility, 5 null move, 6 TT, 7 checks, 8 book. ±70 Elo at 100 games and ±50 at 200 (§ 4).
3. **Host tools, re-read live.**
   - `cutechess-cli` is at `/Users/olgeroeselg/Projects/others/cutechess/cutechess/build/cutechess-cli`, sha256 `fb4fc2aa…6e1c`, equal to the `ABC-202` pin. `--version` prints 1.5.1.
   - `/opt/homebrew/bin/stockfish` → Stockfish 19, sha256 `dc2f18c3…251f`. It offers `UCI_LimitStrength`, and `UCI_Elo` from 1320 to 3190.
   - The analysis's "cutechess-cli absent" is stale: `…7ea41eea` and ABC-202 used it.
4. **cutechess Elo semantics** (source at `5e84232b`). `elo.cpp:44-49`: `errorMargin` is half of diff(mu at phiInv 0.975) − diff(mu at phiInv 0.025), i.e. the half-width of the 95 % interval. `tournament.cpp:971` prints `Elo difference: %1 +/- %2, LOS, DrawRatio`. `-sprt` exists (man 162-175). So the harness needs no Elo maths in repo code.
5. **The lane.** `vitest.config.ts` has no `include`, so any `*.test.ts` outside its exclude list joins `npm test`, `tools/` included. `tsconfig.build.json` emits only `src/uci.ts`. `tsconfig.json` `include` names `tools/` paths one by one.
6. **UCI time.** `src/uci-session.ts:213-214`: `movetime` sets the budget directly, so cutechess `st=3` reaches level 5's 3 000 ms. `LEVELS[5]` is 3 000 ms with blunder rate 0 (`src/levels.ts:49`).
7. **Gates named by the analysis, located.**
   - `PUZZLE_DEEP=1` baseline is 54/58 (`src/puzzle-suite.baseline.json`; lowering it is the owner's).
   - The A5 bar ≤ 1 100 ns is `ABC-083` `A5`, with ADR-0031's near-bar rule.
   - The identity sweep is "`ABC-078`'s `A3`" (`src/engine.ts:445`).
   - The ADR-0026 doors and bounded oracle are decisions 3 and 9.
   - NFR-004, -005, -006, -008 and -009 rows were read. NFR-001's leaf clause (legalMoves exactly 1 per gameStatus) bears on proposal 3.
   - ADR-0028 (red level: fixture, then headroom, then owner) and ADR-0034 (puzzle red classed per row) bear on every value change.
8. **King table** (`src/evaluate.ts:121-130`, rank 8 first): g1 +30, b1 +30, c1 +10, e2 0, e4 −40.
9. **Book probe** (scratch `bapm-eng/probe.ts`, `src/` read-only). Game 1 was walked through `book.json` by Zobrist key:
   - every position through 3.Nf3 is in book;
   - at the position after 3.Nf3 the book offers only `b8c6`, `d7d5` and `e7e5`;
   - 3...b6 and the position after it are absent.
   The source (lichess chess-openings `a6189a30`, CC0, `maxPly` 12) therefore cannot reach game 1's position. A deeper English book needs a new source, which is an `ADR-0023` touch point the brief did not list.
10. **Next free ids.** `EPIC-008`; `ABC-204` (the ABC-203 card says "Next free ABC-204"). No `ABC-204` page or row exists.
