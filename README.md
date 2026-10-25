```text
 _   _   _
| |_| |_| |           _              _             _   _
 \       /      ___  | | __  _   _  | |_    __ _  | | (_) __  __
  |     |      / __| | |/ / | | | | | __|  / _` | | | | | \ \/ /
  |     |      \__ \ |   <  | |_| | | |_  | (_| | | | | |  >  <
 /_______\     |___/ |_|\_\  \__, |  \__|  \__,_| |_| |_| /_/\_\
(_________)                  |___/
```

**skytalix**: command-line chess against a club-strength engine.

## Requirements

Node.js 22.18 or later. npm comes with it.

## Quick start

```sh
git clone https://github.com/abitwise/skytalix.git skytalix
cd skytalix
npm install
npm run chess
```

## Play

Pass options after `--`:

```sh
npm run chess -- --colour black --difficulty 3
npm run chess -- --ascii
```

| Option | Values |
|---|---|
| `--colour` | `white` (default), `black` or `random` |
| `--difficulty` | `1` to `7` (default `5`) |
| `--ascii` | draw the pieces as letters |
| `--unicode` | draw the pieces as chess symbols |

On a terminal, a missing `--colour` or `--difficulty` is asked for; Enter keeps the default.

Type moves in SAN (`e4`, `Nf3`) or as coordinates (`e2e4`). Type `help` during a game to list
the commands, among them `moves`, `undo`, `resign` and `quit`.

## Levels

Level 1 is the weakest, 7 the strongest, and 5 is the default. The times are approximate:

| Level | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| Time per move | 0.1 s | 0.2 s | 0.3 s | 1 s | 3 s | 5 s | 30 s |

## Saved games

A game that ends in mate, a draw or a resignation is saved as a PGN file under `games/` in
the clone. Nothing is saved when you `quit` or when input ends.

## Use with a chess GUI

skytalix speaks UCI. Build the engine once:

```sh
npm run build
```

This writes `dist/uci.js`. In your GUI, add a UCI engine whose command is `node` and whose
argument is the full path to `dist/uci.js`. It offers two options: `Skill Level` (1 to 7,
default 5) and `OwnBook` (use the built-in opening book, on by default).

## Development

```sh
npm test
npm run lint
npm run typecheck
```

The full command list is in [AGENTS.md](AGENTS.md).

## Licence

skytalix is licensed under Apache-2.0; see [LICENSE](LICENSE). Some parts are under other
terms, and [NOTICE](NOTICE) lists them: four grugops kit files (MIT).

The title's letters use FIGlet's standard font.
