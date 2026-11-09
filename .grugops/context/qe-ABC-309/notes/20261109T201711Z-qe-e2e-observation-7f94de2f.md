---
id: 20261109T201711Z-qe-e2e-observation-7f94de2f
kind: observation
by: qe-e2e
at: 2026-11-09T20:17:11Z
verified_by: 
confidence: high: every command run on this host under the lock or read from source and vendor docs as stated; GUI windows not opened, Windows routes UNKNOWN - verify
refs:
  - qe-ABC-309
  - grugops/qe-ABC-309
  - grugops/ABC-309
  - ABC-309
  - ABC-216
  - ABC-295
  - 1064eb4e
  - efd2230b
  - README.md
  - src/uci-session.ts
  - src/levels.ts
  - ADR-0049
  - ADR-0052
  - AR-NFR004-A
  - orch-2026-10-30a/20261109T200516Z-orchestrator-decision-4b413e8c
  - se-ABC-309/20261109T200349Z-software-engineer-decision-7b77184b
  - se-ABC-309/20261109T200358Z-software-engineer-observation-79165f24
  - se-ABC-309/20261109T200413Z-software-engineer-observation-79117168
  - se-ABC-309-fix/20261109T200804Z-software-engineer-observation-5432062f
  - qe-ABC-295/20261109T160639Z-qe-e2e-decision-e11c410e
supersedes: 
seal: sha256:0fab86f124fceef43b35b5c574e9f6b0f580b1d2307df74d41fe0bdd5aebb650
---

# qe-ABC-309: what QE ran and read, at `grugops/ABC-309` `1064eb4e` (base `main` `efd2230b`)

QE/E2E, task `qe-ABC-309`, branch `grugops/qe-ABC-309` from `1064eb4e`. Every host command ran under `flock <scratch>/<home>/<repo>/host-test.lock`, one at a time. Run files are under `<scratch>/<home>/<repo>/qe309/` (not committed). No file under `src/`, `README.md`, an ADR, a ticket, an EPIC or the board was edited.

## Fresh clone (A5's "runs as written on a fresh clone", A7)
`git clone --branch grugops/qe-ABC-309` of this worktree into scratch, at `1064eb4e`. Then each README command as written:

| command | exit | stderr bytes | note |
|---|---|---|---|
| `npm install` | 0 | 300 | an `esbuild` install-scripts warning; stdout reports 3 audit vulnerabilities (1 moderate, 2 high) |
| `npm run build` | 0 | 0 | writes `dist/uci.js`, mode 0664, first line `#!/usr/bin/env node` |
| `chmod +x dist/uci.js` | 0 | 0 | |
| `node --version` | 0 | 0 | v26.12.1 |
| `npm run lint` | 0 | 0 | "Checked 148 files ... No fixes applied." |

## Live `uci` reply (A5)
`printf 'uci\nquit\n' | node <clone>/dist/uci.js`: exit 0, stderr 0 bytes. Its three `option name` lines:
- `option name OwnBook type check default true`
- `option name Skill Level type spin default 5 min 1 max 7`
- `option name TimeMode type combo default level var level var simple-tournament var uci-clock-mode`

The same through the shebang (`<clone>/dist/uci.js` run as the program, after `chmod`): exit 0, the same three lines, then `readyok`, `info string book` and `bestmove e7e5`.

## Cute Chess route, under `cutechess-cli` 1.5.1 (the GUI's own `EngineBuilder`)
- `cmd=node <clone>/dist/uci.js`: stderr "Cannot execute command: node ...". This confirms the README's "does not start".
- `cmd=<clone>/dist/uci.js` with `option.Skill Level=2`, `option.OwnBook=false`, `option.TimeMode=level`, against a second instance on `option.TimeMode=simple-tournament`; `st=0.2`, 2 games, `-maxmoves 8`, `-debug all`: exit 0, stderr 0 bytes. The log shows the 4 `setoption` lines sent, both games started and played, 15 `bestmove` lines. With `OwnBook` on, the book is read from the temp-directory working directory (4 `info string book` lines); with it off, there are 0.
- Both games ended "loses on time" for the `simple-tournament` side. On `go movetime 200` it answered at 200 ms, then 202 ms; `cutechess-cli`'s time margin was its default of 0. This is the accepted overshoot `AR-NFR004-A` (`ADR-0052`), not a ticket finding.

## Cute Chess 1.5.1 source (the checkout on this host, `v1.5.1-5-g5e84232b`)
- `mainwindow.cpp`: the menu `T&ools` holds `&Settings`; `&Game` holds `&New...`. Line 191: `m_showSettingsAct->setMenuRole(QAction::PreferencesRole)`, so on macOS Qt moves Settings into the application menu.
- `settingsdlg.ui`: tab "Engines". `enginemanagementwidget.ui`: button "Add".
- `engineconfigdlg.ui`: Basic tab: Name, Command (no argument field), Working Directory, Protocol. Advanced tab: button "Detect".
- `newgamedlg.ui`: Human and CPU per side; `gamesettingswidget.ui`: "Time Control:".
- `enginebuilder.cpp:86`: `process->start(cmd, m_config.arguments())`.

## Arena 3.5.1, its own manual
- The vendor's site lists "Arena 3.5.1 for Windows", "available since 2015-12-20".
- From `arena_3.5.1.zip`, only `Readme/english.chm`, `Languages/English.lng` and `engines.ini` were unpacked, into an empty scratch folder. Nothing in the archive was run.
- `engines_engine_management.htm`, tab Details: "You create a new engine by clicking 'New' ... select the exe (most common), jar ..., cmd or bat file". Sub-tab General: "Command Line: The executable file (exe, cmd, bat or jar) ...", and "Command Line Parameters: Options the engine may need".
- `engines_installing_engines.htm`: "If Arena does not know the type (UCI or Winboard), you will be asked."

## BanksiaGUI, the vendor's site
- The download page lists "Version 0.58 (RC1 version) (18 Jan 2023)", Windows 64-bit, macOS and Linux.
- The online help documents **0.59** ("What's New in Banksia GUI 0.59"), not 0.58. Its Engines page: "Open Engines → Manage Engines… / Click Add / Browse to the engine's executable / ... Click OK", with options under "Select an engine and click Configure".
- The help names no argument field. Its Getting Started page: "From the Game menu, choose New Game ... White player: human or one of your configured engines".

## Static checks at `1064eb4e`
- `git diff --name-only efd2230b HEAD` lists 8 files: `README.md`, the ticket page, and 6 under `.grugops/context/se-ABC-309*/`. 0 under `src/`; `assets/readme-art.txt` is not in the diff (it is tracked at the base).
- `test -s assets/readme-art.txt`: 404 bytes, final byte `0a`, 0 lines exactly ` ``` `. Line 1 of `README.md` is ` ```text `. `sed -n '2,/^```$/p' README.md | sed '$d' | cmp - assets/readme-art.txt` exits 0. 0 lines of the old title block remain.
- `grep -c 'FIGlet' README.md` = 0; `grep -c 'two options' README.md` = 0.
- § Licence diff against `efd2230b`: only the blank line and "The title's letters use FIGlet's standard font." are removed.
- `ABC-216` A8 scans: personal paths 0, IPv4 0, e-mail 0. A plant (a made-up Windows user path appended to a scratch copy) turned the path count to 1. The only absolute URL is `https://github.com/abitwise/skytalix.git`, unchanged from the base. `ABC-216` A6's npm-publish scan is 0.
- Relative links: `AGENTS.md`, `LICENSE`, `NOTICE`; `git ls-files --error-unmatch` exits 0 for all three. There are no reference-style links.
- GUI names in the file: Arena, Cute Chess and BanksiaGUI only. Stockfish is named once, as R2's opponent engine.
- `readContext` on `se-ABC-309` (3 notes) and `se-ABC-309-fix` (1 note) admits every note, and refuses none.
- The rulings note `orch-2026-10-30a` `…4b413e8c` is read from the main checkout's working tree. `git log --all` finds no commit holding it.
