# Changelog

All notable changes to skytalix are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the version numbers follow
[VERSIONING.md](VERSIONING.md).

## [1.0.0] - 2026-11-10

The first versioned release: command-line chess against a club-strength engine, which also runs
as a UCI engine in a chess GUI. It needs Node.js 22.18 or later.

Strength: one measured figure, on one scale: X = 1902.5 ± 49.1. skytalix at level 5 played 200
games, one at a time, from 100 openings with both colours, against Stockfish 19 with
`UCI_LimitStrength` on and `UCI_Elo` 1810. Each side had 100 ms a move. skytalix scored 63.0 %,
which is +92.5 ± 49.1 Elo against 1810, so X = 1810 + 92.5. The figure holds on that scale only.
It is not a 40/15 rating and not a rating-list figure. Level 5 normally has 4 s a move, not
100 ms; its strength at 4 s was not measured.

### Added

- Play in the terminal with `npm run chess`. Options: `--colour` (`white`, `black` or `random`),
  `--difficulty` (`1` to `7`), `--ascii` and `--unicode`. On a terminal, a missing `--colour` or
  `--difficulty` is asked for. Moves are typed in SAN (`e4`, `Nf3`) or as coordinates (`e2e4`),
  and `help` lists the commands, among them `moves`, `undo`, `resign` and `quit`.
- Seven levels, 1 the weakest and 7 the strongest; 5 is the default. Each has an approximate time
  per move and a blunder rate:

  | Level | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
  |---|---|---|---|---|---|---|---|
  | Time per move | 0.1 s | 0.2 s | 0.3 s | 1 s | 4 s | 5 s | 30 s |
  | Blunder rate | 40 % | 20 % | 10 % | 5 % | 0 | 0 | 0 |

- A UCI engine for chess GUIs, with three options: `Skill Level` (`1` to `7`), `OwnBook` (use the
  built-in opening book) and `TimeMode` (`level`, `simple-tournament` or `uci-clock-mode`).
- A built-in opening book.
- Saved games: a game that ends in mate, a draw or a resignation is saved as a PGN file under
  `games/` in the clone.
- Launchers for chess GUIs: `bin/skytalix-uci` for macOS and Linux, run on both, and
  `bin\skytalix-uci.cmd` for Windows, which is untested.
- `--version` on `npm run chess` and on `bin/skytalix-uci` prints the version, for example
  `skytalix 1.0.0`.

[1.0.0]: https://github.com/abitwise/skytalix/releases/tag/v1.0.0
