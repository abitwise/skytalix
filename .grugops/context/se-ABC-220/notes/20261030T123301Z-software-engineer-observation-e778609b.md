---
id: 20261030T123301Z-software-engineer-observation-e778609b
kind: observation
by: software-engineer
at: 2026-10-30T12:33:01Z
verified_by: 
confidence: high: commit and files as made
refs:
  - se-ABC-220
  - ABC-220
  - EPIC-009
  - ADR-0052
  - grugops/ABC-220
  - 68ba364c
  - 8e1cdda5
  - src/uci-session.ts
  - src/uci-session.test.ts
  - src/uci.real-engine.test.ts
supersedes: 
seal: sha256:95a643c5cb6383738c736be46b05a53f0f930ff581771bfe3b7bc7a36369c13a
---

# Software Engineer observation, se-ABC-220: branch, commit, files (the artifact record)

Recorded as an `observation`: an `artifact-ref` needs a §14 gate's `sha`, `gate_run` and `content_hash`, and no gate has run on this branch (the `se-ABC-230` precedent).

- **Branch:** `grugops/ABC-220`, from `main` `8e1cdda5`. Not pushed, not merged.
- **Code commit:** `68ba364c`. A `docs(se-ABC-220)` commit follows with the notes, `raw/id.mjs` and the done brief.
- **Production:** `src/uci-session.ts` only (+71/−6 lines). Not touched: `src/engine.ts`, `src/levels.ts`, `src/cli-options.ts`, `src/cli.ts`, `src/startup-questions.ts`, `src/pgn.ts`, `src/search.ts`, `src/uci.ts`. No new file.
- **Tests:**
  - `src/uci-session.test.ts`: +52 default-lane rows, 2 re-pins, and the A11 `ENGINE_DEEP` lane (6 rows, unrun).
  - `src/uci.real-engine.test.ts`: the A14 `UCI_DEEP` lane (4 rows, unrun), one assertion added to its default-lane row, and `runDialogue(script)`.
- **Commands run:** `npm ci --ignore-scripts`; `npm run lint`, `lint:fix`, `typecheck`, `build`, `npm test`; single-file runs through `./node_modules/.bin/vitest run` (never a bare `npx`); the out-of-tree harness via `node`.
