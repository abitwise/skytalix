---
id: 20261023T190206Z-architect-design-observation-7b42b3f4
kind: observation
by: architect-design
at: 2026-10-23T19:02:06Z
verified_by: 
confidence: high
refs:
  - arch-runbook-operate
  - memory-bank/70-runbook.md
  - 4ddae2c8
  - b4f2d26d
  - ABC-042
  - ABC-168
  - ABC-200
  - ADR-0018
  - ADR-0044
  - ADR-0045
  - e82a3798
  - 20261023T185614Z-architect-design-decision-5ffd0ca7
supersedes: 
seal: sha256:0f4a05221ed4b15b715995e8ab54334dd3b5c2b079acbb495476bf845332d622
---

# Architect/Design: what `main` `4ddae2c8` runs today, measured for `70-runbook.md` § Operate

All readings were taken on `main` `4ddae2c8` (Node v26.11.1, npm 11.20.0). They were read-only, or they wrote only to the scratchpad.

**`package.json`.** The scripts are `chess` = `node src/cli.ts`, `uci` = `node src/uci.ts`, `build` = `tsc -p tsconfig.build.json`, plus `test`, `typecheck`, `lint`, `perft`. `bin` is `{"skytalix":"dist/uci.js"}`, `"private": true`, and `engines.node` is `>=22`. There is no `start` script. `tsconfig.build.json` compiles `src/uci.ts` into `dist/`. `dist/` is git-ignored, and 0 of its files are tracked.

**The game, `npm run chess`:**
- `-- --bogus` exits 1 with `unrecognised argument: --bogus` and the usage line on stderr, and writes 0 bytes to stdout.
- With stdin `</dev/null` (not a terminal), it exits 0. It draws the board, prints 0 startup questions, and input ends.
- Under a pseudo-terminal (`script -q`), it asks `colour (white|black|random) [white]: `. The answer `purple` gets `"purple" is not one of white|black|random`, and the question is asked again. `black` is accepted. Then it asks `difficulty (1|2|3|4|5) [5]: `, and Enter keeps 5. White moves first. `quit` asks for confirmation. The exit is 0.
- The source matches: `src/startup-questions.ts` (`ABC-200`, merged `c0585331`) and `src/cli-options.ts` (the flag set, `DEFAULT_DIFFICULTY = 5`). `src/cli.ts` sets exit codes 0, 1 (usage) and 70 (internal).

**The UCI engine, `npm run uci`:**
- `uci`, `isready`, `quit` gives `id name skytalix`, `id author Olger Oeselg`, `option name OwnBook …`, `option name Skill Level type spin default 5 min 1 max 5`, `uciok`, `readyok`, and exit 0.
- `-- x` exits 1 with `usage: skytalix (it takes no arguments; it speaks UCI on stdin and stdout)` on stderr and 0 bytes on stdout.

**The build.** `npx tsc -p tsconfig.build.json --outDir <scratchpad>` exits 0 and emits `uci.js` with the `#!/usr/bin/env node` shebang. `node <scratchpad>/uci.js` answers `uciok` and exits 0. The tree was unchanged afterwards (`git status` showed only the queue claim).

**The `--` separator (INFO, outside this brief).** `AGENTS.md` "Dev / run" says that without `--` npm "silently drops the flag and runs with defaults". Measured on npm 11.20.0:
- That is true for a flag with no value: `npm run -s chess --ascii` exits 0.
- It is not true for a flag that takes a value. npm consumes the flag name, so the value reaches the CLI on its own and is refused. `npm run -s chess --colour black` exits 1 with `unrecognised argument: black`. `--difficulty 3` exits 1 with `unrecognised argument: 3`.

**Sweep of the rest of the runbook.**
- § Deploy facts still hold:
  - 0 YAML files;
  - 0 deploy artifacts (the 12 pattern hits are all the word "composer");
  - `.github/` holds `copilot-instructions.md` only;
  - 0 git remotes;
  - `plans/releases/` holds `.gitkeep` only;
  - config `default_stack.deploy` = `none-local-only`, `environments` = `["local"]`, `production_requires_human_confirmation` = `true`, `blocked_escalation_days` = `2`.
- § Roll back points at "`AGENTS.md` § Branching model". That heading was removed from `AGENTS.md` in `e82a3798` (`ABC-164`, 2026-10-21) and added to `memory-bank/45-standing-rulings.md` in the same commit.
- § Deploy (line 61) says "a human holds deploy". § On-call says "The project owner (Olger Oeselg) holds deploy". Both are older than the owner's 2026-08-15 directive "deploy is ALLOWED and NOT NEEDED" (`memory-bank/60-progress.md`). `memory-bank/45-standing-rulings.md` § Deployment posture reads that directive as "Who holds the deploy key changed 2026-08-15". `production_requires_human_confirmation` stays `true`.
- `memory-bank/45-standing-rulings.md` § Deployment posture still says "no `bin`/`main`/`exports`/`files`". That has been out of date since `ABC-168`. The file is outside this brief.
- The startup questions are recorded in neither `AGENTS.md` "Dev / run" nor `memory-bank/90-agents-md-command-log.md` § "Dev / run".
