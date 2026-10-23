---
subtask: ticket-to-pr-ABC-204
role: software-engineer
ticket: plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
ref: .grugops/context/ticket-to-pr-ABC-204/
inputs: Architect …13faedbc (## Design ruling); Orchestrator nods: biome.json line under A3, E-step rule under A4
width: 3 of 3
---

# Build ABC-204: the rating harness under tools/rating/

## Do
- Worktree `../wt-ABC-204` on `grugops/ABC-204` from `main`, own `npm ci --ignore-scripts`. Never run npm in main's checkout.
- Build exactly to the page and its `## Design ruling`: the TypeScript harness under `tools/rating/` (R and D runners, the pinned cutechess flags, `openings.ts` reproducing `tools/rating/openings.epd` byte-for-byte at the pinned sha256, result parsing of cutechess's own Elo line, the states GAIN/LOSS/NEUTRAL/UNRESOLVED, the Stockfish depth guard), the `tsconfig.json` + `biome.json` lines. No `src/` change; 0 new files in the test lane.
- Prove it with **short smoke runs only** (a few games each for R and D, plus the openings sha check). The baseline R, the A/A D and the A5 wall timing are QE's long readings, not yours.
- Gates: lint, typecheck, build; `npm test` + `last-run.json` unchanged in file/test count; skip capture → `test-skip-integrity.js`.

## Fences
- Only `tools/rating/**`, `tsconfig.json`, `biome.json` (and the ticket's named docs). No `src/`, `package*.json` unless the page says so, no board/trace/ADRs. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se204/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`; do not touch the git remote.

## Publish
- Seal notes via the plugin writer (task `ticket-to-pr-ABC-204`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
