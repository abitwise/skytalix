---
subtask: ticket-to-pr-ABC-203
role: software-engineer
ticket: plans/tickets/ABC-203-at-game-end-npm-run-chess-writes-the-game-as-a-standard-pgn-file-under-games.md
ref: .grugops/context/ticket-to-pr-ABC-203/
inputs: BA/PM …0c2867c1; Architect …e6de1e00 (## Design ruling); ADR-0047 (owner-accepted …7feb0553)
width: 2 (beside bapm-cut-engine-strength, records only)
---

# Build ABC-203: write the finished game as a PGN file under games/

## Do
- Create worktree `../wt-ABC-203` on `grugops/ABC-203` from `main`, with its own `npm ci --ignore-scripts`. Never run npm in main's checkout.
- Build exactly to the page and its `## Design ruling` / ADR-0047: `src/pgn.ts` (pure), `src/pgn-file.ts` (sole `node:fs` holder), wiring in `src/cli.ts`, the headline export from `src/result-screen.ts`, `.gitignore` gains `games/`, tests as ruled (temp-cwd children, the writer's one spawned child, the guard rows). Red-first on the page's plants where it names them. A14's widened class only as the ruling allows; any other existing test that fails is a STOP back to Architect.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json`; skip capture → `test-skip-integrity.js`; `CLI_DEEP` (cli.test.ts) and `INPUT_DEEP` if line-input is touched. Heap 128 multi-file, 400 one-file. After the lane, `git status` in your worktree must show no `games/` (tree-clean guard).
- **No timing claims** beyond what the page asks the SE for; the ≤ 50 ms write reading is QE's.

## Fences
- Only the files the page/ruling name (+ `.gitignore`). No `package*.json`, `tools/`, `AGENTS.md`, ADRs, `plans/board.md`, `plans/traceability.md`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se203/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `ticket-to-pr-ABC-203`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
