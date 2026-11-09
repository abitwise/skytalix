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
| Time per move | 0.1 s | 0.2 s | 0.3 s | 1 s | 4 s | 5 s | 30 s |
| Projected strength | ~1 000–1 300 | ~1 300–1 550 | ~1 550–1 750 | ~1 800–1 950 | ~2 150–2 250 | ~2 170–2 270 | ~2 300–2 450 |

The strength figures are projections, not measurements. They are drawn from the one
measured figure in § Strength (1902.5 ± 49.1 at 100 ms a move, with no blunders) and two
assumptions: about +50 to +60 for each doubling of time, less at longer times, and a penalty
for the levels that blunder, which was not measured. They are on the § Strength scale only,
and are not FIDE or online ratings.

## Strength

One measured figure, on one scale: X = 1902.5 ± 49.1. skytalix at level 5 played 200 games,
one at a time, from 100 openings with both colours, against Stockfish 19 with
`UCI_LimitStrength` on and `UCI_Elo` 1810. Each side had 100 ms a move. skytalix scored
63.0 %, which is +92.5 ± 49.1 Elo against 1810, so X = 1810 + 92.5. The figure holds on that
scale only. It is not a 40/15 rating and not a rating-list figure. Level 5 normally has 4 s
a move, not 100 ms. Its strength at 4 s was not measured; § Levels gives a projection only.

## Saved games

A game that ends in mate, a draw or a resignation is saved as a PGN file under `games/` in
the clone. Nothing is saved when you `quit` or when input ends.

## Use with a chess GUI

skytalix speaks UCI. The engine is `dist/uci.js`, a script that `node` runs. Arena and
BanksiaGUI are set to run `node` with the full path to `dist/uci.js` as its argument. Cute Chess
takes no argument, so it is set to run the script itself, or on Windows a `skytalix.cmd` file
that runs it. Below, `<clone>` stands for the full path of your clone.

The engine has three UCI options:

| Option | Type | Values | Default |
|---|---|---|---|
| `Skill Level` | spin | `1` to `7` | `5` |
| `OwnBook` | check | `true` or `false`: use the built-in opening book | `true` |
| `TimeMode` | combo | `level`, `simple-tournament` or `uci-clock-mode` | `level` |

- `level` plays at most the `Skill Level`'s time per move.
- `simple-tournament` searches a fixed 22 s a move and aims to stay within the clock it is
  given.
- `uci-clock-mode` spends the clock the GUI gives it, at most 59.5 s a move.

In every `TimeMode` a move can run a few milliseconds over its time, so give the engine a small
time margin in the GUI.

`Skill Level` is read only while `TimeMode` is `level`.

### Arena

These steps are written for Arena 3.5.1 on Windows. **They have not been tried in Arena.**
Arena's menu names are not given here, because they have not been checked against Arena itself.

1. In a terminal, in the clone, run `npm install` and then `npm run build`. This writes
   `dist\uci.js`.
2. Open Arena's engine manager and add a new UCI engine. Set its program to the full path of
   `node.exe`, which `where node` prints in a Command Prompt (use the first line it prints),
   and its command-line parameter to `<clone>\dist\uci.js`. Name the engine `skytalix`. If
   there is no field for a parameter, save a file named `skytalix.cmd` in the clone with the
   one line `@node "%~dp0dist\uci.js"`, and set the program to `<clone>\skytalix.cmd` instead.
3. Make skytalix the active engine and open its UCI options to set `Skill Level`, `OwnBook`
   and `TimeMode`. The table above lists their values.
4. Start a new game with skytalix as the opponent, and make your move.

### Cute Chess

These steps follow Cute Chess 1.5.1 on Linux. Step 2's route, a script run through its first
line, is for Linux and macOS; it was tested on Linux. Step 2 ends with a route for Windows.

1. In the clone, run `npm install`, `npm run build` and then `chmod +x dist/uci.js`. The
   build writes `dist/uci.js`. On Windows, skip `chmod`.
2. Choose **Tools > Settings** (on macOS, **Settings** is in the application menu instead),
   open the **Engines** tab and click **Add**. Cute Chess's **Command** field takes a program
   and no separate argument, so `node <clone>/dist/uci.js` there does not start. Set
   **Command** to `<clone>/dist/uci.js` instead: its first line, `#!/usr/bin/env node`, runs it
   with `node`. This needs `node` on the `PATH` Cute Chess sees, so start Cute Chess from a
   shell where `node --version` works. Set **Name** to `skytalix` and **Protocol** to `uci`.

   **On Windows** that first line does not run the script. Instead, save a file named
   `skytalix.cmd` in the clone with this one line, and set **Command** to
   `<clone>\skytalix.cmd`:

   ```bat
   @node "%~dp0dist\uci.js"
   ```

   This needs `node --version` to work in a new Command Prompt. **This Windows route is
   untested.**
3. On the **Advanced** tab, click **Detect**. `Skill Level`, `OwnBook` and `TimeMode` appear
   there and can be set. The table above lists their values. Click **OK**.
4. Choose **Game > New...**. Set one side to **Human** and the other to **CPU** with
   `skytalix`, pick a **Time Control**, and click **OK**.

### BanksiaGUI

These steps are written for BanksiaGUI 0.58 on Windows. **They have not been tried in
BanksiaGUI.** BanksiaGUI's menu names are not given here, because they have not been checked
against BanksiaGUI itself.

1. In a terminal, in the clone, run `npm install` and then `npm run build`. This writes
   `dist\uci.js`.
2. Open BanksiaGUI's engine manager and add a new engine. Set its program to the full path of
   `node.exe`, which `where node` prints in a Command Prompt (use the first line it prints),
   and its argument to `<clone>\dist\uci.js`. Set the protocol to UCI and name the engine
   `skytalix`. If there is no field for an argument, save a file named `skytalix.cmd` in the
   clone with the one line `@node "%~dp0dist\uci.js"`, and set the program to
   `<clone>\skytalix.cmd` instead.
3. Open skytalix's engine options to set `Skill Level`, `OwnBook` and `TimeMode`. The table
   above lists their values.
4. Start a new game with skytalix as the opponent, and make your move.

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
