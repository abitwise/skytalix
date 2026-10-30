---
id: 20261030T121603Z-software-engineer-observation-44d5b061
kind: observation
by: software-engineer
at: 2026-10-30T12:16:03Z
verified_by: 
confidence: high: read off git at 33540592
refs:
  - se-ABC-241
  - ABC-241
  - EPIC-010
  - ADR-0020
  - ADR-0054
  - ADR-0044
  - ADR-0002
  - ABC-230
  - grugops/ABC-241
  - 33540592
  - e42b637b
  - src/gameend.ts
  - src/zobrist.ts
  - src/history.ts
  - src/turn-loop.ts
  - src/cli.ts
  - src/uci-session.ts
  - src/levels.ts
supersedes: 
seal: sha256:9071565e62052f46774132b5fcd0b6638fea7310d058d6479de3ea3d555c1218
---

# Software Engineer artifact record, se-ABC-241

- **Branch:** `grugops/ABC-241`, from `main` `e42b637b`. Code commit `33540592`. Not pushed, not merged.
- **Production files (7):** `src/gameend.ts` (`repetitionKey`, the lookup), `src/zobrist.ts` (`epFileKey`), `src/history.ts` (`repetitionKeyHistory`, `repetitionCounts`), `src/turn-loop.ts` (`claimShortfall`), `src/cli.ts` (the injection), `src/uci-session.ts` (the replay, `gameend.ts` import), `src/levels.ts` (the blunder root key).
- **Test files (8):** `src/gameend.test.ts`, `src/history.test.ts`, `src/turn-loop.test.ts`, `src/turn-loop.nfr.test.ts`, `src/cli.test.ts`, `src/engine.test.ts` (one pin), `src/uci-session.test.ts`, `src/levels.test.ts`. No new test files.
- **Diff:** 15 files, +611 / −36.
- **Not touched (the ADR's fence):** `src/apply.ts`, `src/legal.ts`, `src/search.ts`, `src/transposition.ts`, `src/quiescence.ts`, `src/book*.ts`, `data/`. `book.json` was not rebuilt.
- **Commands:** `npm ci --ignore-scripts`; `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`; `./node_modules/.bin/biome format --write <file>`; single-file lanes via `NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run <file>` (no bare `npx`); the scratch fixture probe via plain `node`.
- **Owed to QE (A10):** the smoke pair of `EPIC-010` § The merge rule, ALONE, on this head rebased on `main`. 10 D and 10 R games (R at level 5 = 4 000 ms against the 4 000 ms reference, `ADR-0053` d10). S-1 to S-4, each smoke's W/L/D and score, the ledger's pooled R since the last batch, and **the count of smoke games that end by repetition, candidate against base** (as `ABC-230` `A7`). UAT is owed on both surfaces, and the QE verdict signs it.
