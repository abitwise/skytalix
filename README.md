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

[Node.js](https://nodejs.org/) 22.18 or later. npm comes with it.

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

`npm run chess -- --version` prints the version, for example `skytalix 1.0.0`, and so does
`bin/skytalix-uci --version`.

Type moves in SAN (`e4`, `Nf3`) or as coordinates (`e2e4`). Type `help` during a game to list
the commands, among them `moves`, `undo`, `resign` and `quit`.

## Levels

Level 1 is the weakest, 7 the strongest, and 5 is the default. Each level has a time per move,
a blunder rate and a projected strength:

| Level | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| Time per move | 0.1 s | 0.2 s | 0.3 s | 1 s | 4 s | 5 s | 30 s |
| Blunder rate | 40 % | 20 % | 10 % | 5 % | 0 | 0 | 0 |
| Projected strength | ~1 000–1 300 | ~1 300–1 550 | ~1 550–1 750 | ~1 800–1 950 | ~2 150–2 250 | ~2 170–2 270 | ~2 300–2 450 |

The times are approximate. At the blunder rate's share of its moves, the engine scores every
move and deliberately picks a weaker one.

The strength figures are projections, not measurements. They are drawn from the one measured
figure in the Strength section below (1902.5 ± 49.1 at 100 ms a move, with no blunders) and two
assumptions: about +50 to +60 Elo for each doubling of time, less at longer times, and, for the
levels that blunder, a penalty which was not measured. They are on the Strength section's scale
only, and are not FIDE or online ratings.

## Strength

One measured figure, on one scale: X = 1902.5 ± 49.1. skytalix at level 5 played 200 games,
one at a time, from 100 openings with both colours, against Stockfish 19 with
`UCI_LimitStrength` on and `UCI_Elo` 1810. Each side had 100 ms a move. skytalix scored
63.0 %, which is +92.5 ± 49.1 Elo against 1810, so X = 1810 + 92.5. The figure holds on that
scale only. It is not a 40/15 rating and not a rating-list figure. Level 5 normally has 4 s
a move, not 100 ms. Its strength at 4 s was not measured; the Levels section gives a projection
only.

## Saved games

A game that ends in mate, a draw or a resignation is saved as a PGN file under `games/` in
the clone. Nothing is saved when you `quit` or when input ends.

## Use with a chess GUI

Find your GUI and your OS here. The platforms are the ones each GUI publishes.

| GUI | macOS | Linux | Windows | Run with skytalix | Link |
|---|---|---|---|---|---|
| Arena | no | yes | yes | Not tried | [playwitharena.de](http://www.playwitharena.de/) |
| Cute Chess | yes, built from source | yes | yes | `dist/uci.js` run directly, on Linux. The launcher has not been tried | [github.com/cutechess/cutechess](https://github.com/cutechess/cutechess) |
| BanksiaGUI | yes | yes | yes | Not tried | [banksiagui.com](https://banksiagui.com/) |
| En Croissant | yes | yes | yes | On macOS, the owner played one game through `bin/skytalix-uci` (2026-11-10). Not tried on Linux or Windows | [encroissant.org](https://encroissant.org/) |

skytalix speaks UCI. A GUI runs it through a launcher in the clone: `bin/skytalix-uci` on
macOS and Linux, or `bin\skytalix-uci.cmd` on Windows. The launcher runs `dist/uci.js` with
`node`, and on macOS and Linux it finds `node` even when the GUI starts it with a short `PATH`.
It has been run on Linux and macOS.
**The Windows launcher is untested.** Below, `<clone>` stands for the full path of your clone.

The launcher to give the GUI, per OS:

- **macOS:** `<clone>/bin/skytalix-uci`. Run on macOS, in En Croissant.
- **Linux:** `<clone>/bin/skytalix-uci`. Run on Linux.
- **Windows:** `<clone>\bin\skytalix-uci.cmd`. **Untested.**

First build the engine: in the clone, run `npm install` and then `npm run build`. This writes
`dist/uci.js`. If it is missing, the launcher says to run `npm run build`.

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

### Arena — Linux, Windows

Site: [Arena](http://www.playwitharena.de/)

These steps are written for Arena 3.5.1 on Windows. **They have not been tried in Arena.**
Arena for Linux is a separate download, 3.10beta.
Arena's menu names are not given here, because they have not been checked against Arena itself.

1. Build the engine, as above.
2. Open Arena's engine manager and add a new UCI engine. Name the engine `skytalix`. Set its
   program to the launcher:
   - Linux: `<clone>/bin/skytalix-uci`
   - Windows: `<clone>\bin\skytalix-uci.cmd`
3. Make skytalix the active engine and open its UCI options to set `Skill Level`, `OwnBook`
   and `TimeMode`. The table above lists their values.
4. Start a new game with skytalix as the opponent, and make your move.

### Cute Chess — macOS, Linux, Windows

Site: [Cute Chess](https://github.com/cutechess/cutechess)

These steps follow Cute Chess 1.5.1 on Linux. Running `dist/uci.js` directly was tested there;
the launcher has not been tried in Cute Chess. The Windows route is untested.

1. Build the engine, as above.
2. Choose **Tools > Settings** (on macOS, **Settings** is in the application menu instead),
   open the **Engines** tab and click **Add**. Set **Name** to `skytalix` and **Protocol** to
   `uci`. Set **Command** to the launcher:
   - macOS and Linux: `<clone>/bin/skytalix-uci`
   - Windows: `<clone>\bin\skytalix-uci.cmd`
3. On the **Advanced** tab, click **Detect**. `Skill Level`, `OwnBook` and `TimeMode` appear
   there and can be set. The table above lists their values. Click **OK**.
4. Choose **Game > New...**. Set one side to **Human** and the other to **CPU** with
   `skytalix`, pick a **Time Control**, and click **OK**.

### BanksiaGUI — macOS, Linux, Windows

Site: [BanksiaGUI](https://banksiagui.com/)

These steps are written for BanksiaGUI 0.58 on Windows. **They have not been tried in
BanksiaGUI.** BanksiaGUI's menu names are not given here, because they have not been checked
against BanksiaGUI itself.

1. Build the engine, as above.
2. Open BanksiaGUI's engine manager and add a new engine. Set the protocol to UCI and name the
   engine `skytalix`. Set its program to the launcher:
   - macOS and Linux: `<clone>/bin/skytalix-uci`
   - Windows: `<clone>\bin\skytalix-uci.cmd`
3. Open skytalix's engine options to set `Skill Level`, `OwnBook` and `TimeMode`. The table
   above lists their values.
4. Start a new game with skytalix as the opponent, and make your move.

### En Croissant — macOS, Linux, Windows

Site: [En Croissant](https://encroissant.org/)

On 2026-11-10 the owner followed these steps on macOS with `bin/skytalix-uci` and played one game. **They have not been tried in En Croissant on Linux or Windows.** The Windows launcher is untested.

1. Build the engine, as above.
2. On the **Engines** page, add a local engine and select the launcher:
   - macOS and Linux: `<clone>/bin/skytalix-uci`
   - Windows: `<clone>\bin\skytalix-uci.cmd`

## Development

```sh
npm test
npm run lint
npm run typecheck
```

The full command list is in [AGENTS.md](AGENTS.md).

Versions follow the rules in [VERSIONING.md](VERSIONING.md). [CHANGELOG.md](CHANGELOG.md) lists
what each version changed.

## Licence

skytalix is licensed under Apache-2.0; see [LICENSE](LICENSE). Some parts are under other
terms, and [NOTICE](NOTICE) lists them: four grugops kit files (MIT).
