# se-ABC-264 artifacts (filed as observation; artifact-ref needs a gate_run): branch grugops/ABC-264, claim 5efaa6c6, code 358b5f4a

- **Branch:** `grugops/ABC-264`, worktree `.claude/worktrees/se-ABC-264`, from `main` `0b73f51d`. Nothing pushed or merged.
- **Commits:** claim `5efaa6c6`; code `358b5f4a`; then the records commit (these notes, `raw/`, the brief's Result).
- **Production files:** `src/search.ts` (switch, predicate, helper, gate, door, header); `src/engine.ts` (switch, import, gate, door, header).
- **Test files:**
  - new `src/search.reverse-futility.test.ts`;
  - re-pins in `src/search.test.ts`, `src/engine.test.ts`, `src/quiescence.test.ts` and `src/search.null-move.test.ts`;
  - re-points in `src/quiescence.test.ts`.
- **Commands:**
  - `npm ci`; `npm test`; `npm run lint`; `npm run typecheck`; `npm run build`;
  - `SEARCH_DEEP=1` / `ENGINE_DEEP=1` / `PUZZLE_DEEP=1` / `ZOBRIST_DEEP=1` / `CLI_DEEP=1` / `UCI_DEEP=1` / `LADDER_DEEP=1` with `NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run <file>`;
  - `node raw/a1.mjs <base src tree> <worktree>`;
  - every one wrapped in `flock <host lock>`.
- **Migration, docs, dependencies:** none. `AGENTS.md` gains no new deep lane: the new file's deep rows run under the existing `SEARCH_DEEP=1` single-file spelling. Owed to the scribe: one line naming `src/search.reverse-futility.test.ts` beside the null-move lane.
- **Remaining (QE / owner):**
  - owner acceptance of ADR-0059;
  - then QE: A6 (C2′ 100 games at 100 ms, the S′ smoke, the Levels deep lane), G5/G6/G11, the firing rate at 100 ms, UAT.
  - BA/PM page deltas per ADR-0059 d10.
