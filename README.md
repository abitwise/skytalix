```text
      _   _   _     ____  __ __ __  __ ______ ___    __    ____ _  __
     / \_/ \_/ \   / ___// //_/\ \/ //_  __//   |  / /   /  _/| |/ /
     \  _____  /   \__ \/ ,<    \  /  / /  / /| | / /    / /  |   / 
     / /     \ \  ___/ / /| |   / /  / /  / ___ |/ /____/ /  /   |  
    /___________\/____/_/ |_|  /_/  /_/  /_/  |_/_____/___/ /_/|_|  
    '-----------'  >>------> [ BITWISE TACTICAL HORIZON ]
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

## Strength

One measured figure, on one scale: X = 1902.5 ± 49.1. skytalix at level 5 played 200 games,
one at a time, from 100 openings with both colours, against Stockfish 19 with
`UCI_LimitStrength` on and `UCI_Elo` 1810. Each side had 100 ms a move. skytalix scored
63.0 %, which is +92.5 ± 49.1 Elo against 1810, so X = 1810 + 92.5. The figure holds on that
scale only. It is not a 40/15 rating and not a rating-list figure.

## Saved games

A game that ends in mate, a draw or a resignation is saved as a PGN file under `games/` in
the clone. Nothing is saved when you `quit` or when input ends.

## Use with a chess GUI

skytalix speaks UCI. The engine is `dist/uci.js`, a script that `node` runs, so a GUI runs
the command `node` with the full path to `dist/uci.js` as its argument. Below, `<clone>`
stands for the full path of your clone.

The engine has three UCI options:

| Option | Type | Values | Default |
|---|---|---|---|
| `Skill Level` | spin | `1` to `7` | `5` |
| `OwnBook` | check | `true` or `false`: use the built-in opening book | `true` |
| `TimeMode` | combo | `level`, `simple-tournament` or `uci-clock-mode` | `level` |

- `level` plays at the `Skill Level`'s time per move.
- `simple-tournament` searches a fixed 22 s a move, never past the clock it is given.
- `uci-clock-mode` spends the clock the GUI gives it, at most 59.5 s a move.

`Skill Level` is read only while `TimeMode` is `level`.

### Arena

These steps follow Arena 3.5.1 on Windows.

1. In a terminal, in the clone, run `npm install` and then `npm run build`. This writes
   `dist\uci.js`.
2. Choose **Engines > Install New Engine...** and select `node.exe` from your Node.js
   folder. If Arena asks for the engine type, choose UCI. Arena takes the program here and its
   argument in a separate field: choose **Engines > Manage...**, select the new engine, and on
   the **Details** tab set **Command Line Parameters** to `<clone>\dist\uci.js`. Name the
   engine `skytalix`.
3. Load skytalix with **Engines > Load Engine...**, then choose **Engines > Configure** to set
   `Skill Level`, `OwnBook` and `TimeMode`. The table above lists their values.
4. Start a game with **File > New** and make your move. skytalix plays the other side.

### Cute Chess

These steps follow Cute Chess 1.5.1 on Linux.

1. In the clone, run `npm install`, `npm run build` and then `chmod +x dist/uci.js`. The
   build writes `dist/uci.js`.
2. Choose **Tools > Settings**, open the **Engines** tab and click **Add**. Cute Chess's
   **Command** field takes a program and no separate argument, so `node <clone>/dist/uci.js`
   there does not start. Set **Command** to `<clone>/dist/uci.js` instead: its first line,
   `#!/usr/bin/env node`, runs it with `node`. This needs `node` on the `PATH` Cute Chess
   sees, so start Cute Chess from a shell where `node --version` works. Set **Name** to
   `skytalix` and **Protocol** to `uci`.
3. On the **Advanced** tab, click **Detect**. `Skill Level`, `OwnBook` and `TimeMode` appear
   there and can be set. The table above lists their values. Click **OK**.
4. Choose **Game > New...**. Set one side to **Human** and the other to **CPU** with
   `skytalix`, pick a **Time Control**, and click **OK**.

### BanksiaGUI

These steps follow BanksiaGUI 0.58 on Windows.

1. In a terminal, in the clone, run `npm install` and then `npm run build`. This writes
   `dist\uci.js`.
2. Open the engine list with **Engines > Engine Manager** and click **Add**. Set the
   command to `node.exe` from your Node.js folder and the **Arguments** field to
   `<clone>\dist\uci.js`. Set the protocol to UCI and name the engine `skytalix`.
3. In the same window, select skytalix and open its options to set `Skill Level`, `OwnBook`
   and `TimeMode`. The table above lists their values.
4. Start a new game with **File > New Game**, choose skytalix as the opponent, and make your
   move.

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
