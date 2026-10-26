---
id: 20261026T125648Z-architect-design-observation-b7d4b710
kind: observation
by: architect-design
at: 2026-10-26T12:56:48Z
verified_by: 
confidence: high: deterministic counts on scratch clones of d0b1fff8; base reproduces ABC-208 head counts exactly; no real-clock reading
refs:
  - ABC-209
  - EPIC-008
  - ADR-0025
  - ADR-0026
  - ADR-0006
  - ADR-0002
  - ADR-0027
  - ADR-0032
  - ADR-0038
  - ADR-0050
  - NFR-009
  - NFR-005
  - A1
  - A2
  - A3
  - A4
  - A6
  - G1
  - G6
  - S1
  - T1
  - T5
  - QE-087-a
  - plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md
  - memory-bank/50-decisions/ADR-0025-the-transposition-table-is-its-own-fixed-structure-cleared-per-search.md
  - orch-2026-10-26t/20261026T123731Z-orchestrator-decision-e496fc70
  - bapm-ready-ABC-209/20261026T123609Z-ba-pm-decision-955d0031
  - bapm-ready-ABC-209/20261026T123609Z-ba-pm-observation-0d64cbc5
  - arch-design-ABC-208/20261026T023232Z-architect-design-decision-012b1053
  - orch-2026-10-26c/20261026T010824Z-orchestrator-decision-d25ab770
  - owner-delegation-2026-10-22/20261022T140148Z-orchestrator-decision-5aaf7cec
  - owner-word-2026-10-23/20261023T203000Z-orchestrator-decision-7feb0553
  - grugops/arch-design-ABC-209
  - d0b1fff8
supersedes: 
seal: sha256:a36372868974ad66519ae7af2b8c36e799fac661704db9febfabd089de154854
---

# Architect/Design: ABC-209 design probes. A game-token prototype against main's lanes; frozen-clock d7/d8; A1/A2 on the UCI and CLI paths; second-move savings; 40-search heap growth. On scratch clones; no real-clock timing

Task `arch-design-ABC-209`, records only. The trees are `git clone`s of `main` `d0b1fff8` in `<scratchpad>/arch209/trees/`:
`base`, and `hd`, the design hardcoded by `probe/patch2.mjs`, which never wrote into a worktree. Plain node v26.11.1.
The scripts are not committed: `probe/p.mts`, `uci-one.mts`, `deep.sh`. Every search ran on `now: () => 0` with
`maxDepth`, or on a `virtualClock`.

## Lanes (main's tests)
- **Default** (`vitest run`, heap 128): base 2 128 / 2 128; `hd` 2 128 / 2 128.
- **Deep**, one file per run, heap 400. Rows whose names say `real clock`, `REAL clock`, `wall clock`, `real-clock`,
  `NFR-005` or `1 s and a 3 s` are filtered out.
  - The files: `PUZZLE_DEEP` puzzle-suite; `SEARCH_DEEP` search, ordering, quiescence, transposition, pvs-lmr,
    null-move; `ENGINE_DEEP` engine, levels, transposition, pvs-lmr, gameend, legal.
  - Base and `hd` are identical, file by file: 0 failed, with the same 12 filtered rows.
- **A first prototype (v1, one token per level instance)** read default 2 127: 1 red, `levels.test.ts` `QE-087-a`
  (its options keys). It also could not see the CLI's `new`. The ruled shape (v2) fixes both.

## Frozen-clock d7/d8 (`chooseMove`, `now: () => 0`, `maxDepth: k`, a fresh process per count)
- kiwipete: d7 590 489, d8 1 259 463. position-6: d7 180 941, d8 355 565.
- Base = `hd` = `hd` with a first token: 8 of 8. They equal `ABC-208`'s head row.

## A1 / A2 (node counts)
- **UCI** (`createUciSession`, `virtualClock(1)`, OwnBook off, `go depth 5`; game A = 20 plies of self-play by
  `position startpos moves …` + `go`):
  - `ucinewgame` + `position startpos`: base 2 535, `hd` 2 535, fresh 2 535.
  - A non-continuing `position startpos moves e2e4`: 4 417 in all three.
  - The last searched position re-sent (equal list): `hd` 30 155 = a fresh process at `hd`'s own line, 30 155. The
    kept search at that position read 25 731.
  - Game A itself differs from base under `hd` (the kept table changes the choices). Comparisons therefore use each
    tree's own line.
- **CLI** (the patched seam's logic: one tracker plus `createLevel(LEVELS[5], { seed: 7, now: virtualClock(40) })`):
  - one token throughout game A's 20 plies;
  - `takeBack(history, all)` (`new`) gives a new token;
  - the first search then reads 70 676, which equals a fresh instance in a fresh process (70 676, in base and `hd`
    alike).

## Second-move savings (record only)
- **One side searches with a token, at d7 frozen. The other side replies with the stored hash move (or its first legal
  move) and never touches the table.** 8 engine moves.
  - kiwipete: kept 590 489, 140 835, 330 810, 78 910, 71 402, 25 362, 6 019, 23 624; fresh 590 489, 147 585, 354 683,
    84 541, 72 955, 27 633, 6 969, 26 944. Move 2: 0.954×. Moves 2–8: 0.939×. Root hits 7/7.
  - position-6: move 2 0.996×; moves 2–8 0.964×; root hits 5/7.
  - start: move 2 1.477×; moves 2–8 0.968×; root hits 7/7.
- **Self-play with one token, 10 plies, d7:** plies 2–10 cost 0.789× (kiwipete), 0.851× (position-6), 0.743×
  (start). Root hits are 9/9 on each board.

## NFR-009 growth (`node --expose-gc`; 40 searches, self-play, d6 frozen; reads after `gc()` at search 1 and 40)
- `hd` with a token: `heapUsed` Δ 41 024 B, `arrayBuffers` Δ 0 B, `tableByteLength()` 4 194 304.
- `hd` without a token: 47 056 B / 0 B.
- Base: 49 208 B and 49 352 B / 0 B.

## Re-cited at `d0b1fff8`
- `src/engine.ts:550` `clearTable();`; `src/search.ts:605` `if (switches.table) clearTable();`.
- Comments: `src/transposition.ts:17-20`, `:22-26`, `:74-77`; `src/engine.ts:57-62`, `:420`; `src/search.ts:24-26`,
  `:149` (killers), `:594-597`.
- Paths: `src/cli.ts:200`, `src/command-input.ts:123` (`new`), `src/level-seam.ts:16`, `src/levels.ts:127`, `:154`,
  `src/uci-session.ts:313`, `:370`, `:374`.
- The ladder (`src/ladder.test.ts`) drives two `createLevel` instances in one process.

## Not run
- Any real-clock search, `G2`, `G5`, `G6`, `G8`, `G9`, D, `LADDER_DEEP` (by construction it is unchanged: no token),
  `CLI_DEEP` and `UCI_DEEP` (real engine processes), and the filtered real-clock rows.
