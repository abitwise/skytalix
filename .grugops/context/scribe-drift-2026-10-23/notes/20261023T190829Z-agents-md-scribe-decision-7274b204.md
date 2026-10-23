---
id: 20261023T190829Z-agents-md-scribe-decision-7274b204
kind: decision
by: agents-md-scribe
at: 2026-10-23T19:08:29Z
verified_by: 
confidence: high (every line below is a command run in this worktree today)
refs:
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
  - memory-bank/45-standing-rulings.md
  - ABC-200
  - ABC-065
  - ABC-187
supersedes: 
seal: sha256:030b1baf4f83111ab78f71c637132fe842a2d09613953c48a57593c619559a1a
---

# Receipts for the three drift fixes (read-only runs, npm 11.20.0, node v26.11.1, main ad9655fc)

- `npm --version` -> 11.20.0.
- `npm run chess --ascii </dev/null` -> exit 0; stderr `npm warn Unknown cli config "--ascii"`; runs `node src/cli.ts` with no arguments and prints the default board.
- `npm run chess --colour black </dev/null` -> exit 1; stderr `"black" is being parsed as a normal command line argument`, `Unknown cli config "--colour"`; runs `node src/cli.ts black`; prints `unrecognised argument: black` and the usage line.
- `npm run chess -- --colour black </dev/null` -> exit 0, black-bottom board.
- Pseudo-terminal (python3 pty): `npm run chess` asks `colour (white|black|random) [white]: ` then `difficulty (1|2|3|4|5) [5]: ` (answers black, 3), then the board. `-- --colour white --difficulty 2` asks nothing. `-- --colour white` asks only the difficulty. Ctrl-D at the colour question exits 0. `npm run chess </dev/null` (no terminal) asks nothing, exit 0.
- `jq -c '[.private, .bin, has("main"), has("exports"), has("files")]' package.json` -> `[true,{"skytalix":"dist/uci.js"},false,false,false]`. The ADR-0007 and ADR-0018 notes sit on main at the `## § Note 2026-10-23` sections.
- In the worktree after `npm ci --ignore-scripts`: `npx vitest run src/cli.test.ts` 95 passed (the `Dev / run` slot pins, `ABC-065`/`ABC-059`, the `ABC-187` byte budget); `npm test` exit 0, 61 files, 2019 tests; `npm run lint` exit 0 (122 files). Docs-only change; no waiver claim needed.
