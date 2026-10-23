---
id: 20261023T180345Z-uat-planner-observation-92f1df87
kind: observation
by: uat-planner
at: 2026-10-23T18:03:45Z
verified_by: 
confidence: high (source reads + CLI runs on main 8f619b80; one item UNKNOWN - verify)
refs:
  - EPIC-006
  - uat-EPIC-006-playtest
  - plans/uat/EPIC-006-play-test-guide.md
  - d78b0833
  - 8f619b80
  - src/cli-options.ts
  - src/startup-questions.ts
  - src/command-input.ts
  - src/levels.ts
  - ABC-200
  - ABC-201
supersedes: 
seal: sha256:27c2565f99d073a26b67f08e4c570abce457facc4220a549d89268cb50c274c3
---

# UAT Planner: every command in the play-test guide confirmed against `main` `8f619b80`

Source reads and CLI runs were done in the worktree, read-only, on Node v26.11.1 and npm 11.20.0, with no `node_modules` installed.

- **Flags:** `src/cli-options.ts` `ACCEPTED_ARGUMENTS` = `--ascii --unicode --colour white|black|random --difficulty 1..5`. The default difficulty is 5 (`DEFAULT_DIFFICULTY`).
  - `npm run chess -- --help` printed `unrecognised argument: --help` and the usage line, exit 1. So **there is no `--help`**, and the guide says so.
  - `--difficulty 7` and `--ascii --unicode` were each rejected with the usage line, exit 1.
- **Startup questions** (`src/startup-questions.ts`), run under a pty with `script -q`:
  - The prompts were `colour (white|black|random) [white]:` then `difficulty (1|2|3|4|5) [5]:`.
  - A wrong answer (`purple`) gave `"purple" is not one of white|black|random`, then the question again.
  - `black` and then `2` started the game, and `resign` printed `White wins by resignation.` and the move list.
  - With input piped (not a terminal), no questions are asked.
- **In-game commands** (`src/command-input.ts` `COMMAND_TABLE`): `help board quit claim resign new undo moves`. Piped runs showed:
  - `help` lists the eight words.
  - `undo` at ply 0 gives `nothing to undo`. With 2 or more plies it takes back 2.
  - `new` resets to move 1.
  - The first `quit` gives `quit again to end`; the second ends the run with no result screen.
  - `resign` gives `Black wins by resignation.` plus the full move list, exit 0.
  - End of input, and Ctrl-D on a pty, gives `input ended`, exit 0.
  - `moves` gives `legal moves: N …`.
  - `claim` was accepted. It was refused at move 1, as expected.
- **Move formats:** SAN (`src/san.ts`, castling `O-O`/`O-O-O`) and coordinates (`src/coordinate-move.ts` regex `^([a-h][1-8])-?([a-h][1-8])([qrbn])?$`). The piped `e2e4 g1f3 f1c4 O-O` gave `4. O-O d5`.
- **Level budgets:** `src/levels.ts` gives 100 / 180 / 330 / 1000 / 3000 ms. The guide's "about 3 seconds a move at level 5" comes from this.
- **Glyphs:** `src/glyph-mode.ts` picks unicode when the locale is UTF-8, and ascii otherwise.
- **Setup:** `package.json` has the `chess` script (`node src/cli.ts`) and engines `node >=22`. ABC-201's reading (EPIC-006 page) covers `git clone` + `npm install` + `npm run chess`.
- **Not confirmed:** `UNKNOWN - verify` whether Node 22.x releases older than 22.18 run `src/cli.ts`, because type stripping is not on by default there. It was run only on 26.11.1. The guide says "Node 22 or newer, checked on Node 26".
