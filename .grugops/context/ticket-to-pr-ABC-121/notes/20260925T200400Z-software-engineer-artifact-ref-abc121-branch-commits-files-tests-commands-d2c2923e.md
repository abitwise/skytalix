---
id: 20260925T200400Z-software-engineer-artifact-ref-abc121-branch-commits-files-tests-commands-d2c2923e
kind: artifact-ref
by: software-engineer
at: 2026-09-25T20:04:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ADR-0026
  - grugops/ABC-121-pvs-lmr
  - 8e54b13
  - 9823c27
supersedes:
---

# ABC-121 build: branch, commits, files, tests, commands

Hand-authored, no `seal`. **Not a gate stamp**: no `§14-gate#<id>` exists on this install
(`AGENTS.md`), so `sha` / `gate_run` / `content_hash` are not claimed. NOT merged, NOT pushed.

- **Branch** `grugops/ABC-121-pvs-lmr`, off `15c6eb0` (`grugops/wave-2026-09-25`), in worktree
  `.claude/worktrees/ABC-121-pvs-lmr`.
- **Commits:**
  - `db98da5` — queue claim;
  - `8e54b13` — commit 1, PVS + the four doors + every work-row re-point + the PVS identity link;
  - `9823c27` — commit 2, the predicate + LMR + `A1`–`A5` rows + `src/search.mate-corpus.ts` +
    the engine-door bite row;
  - the docs commit that carries these notes follows.
- **Numstat, `15c6eb0..9823c27`, `src/`:**
  - `search.ts` +214/−16;
  - `engine.ts` +108/−5;
  - `search.mate-corpus.ts` +321 (new, data);
  - `search.pvs-lmr.test.ts` +673 (new);
  - `search.test.ts` +36/−7;
  - `transposition.test.ts` +52/−10;
  - `engine.test.ts` +34/−7;
  - `search.ordering.test.ts` +15/−5;
  - `quiescence.test.ts` +14/−6.
- **Production lines > 0**, so the zero-production-lines UAT waiver does NOT apply.
- **Commands run at `9823c27`:**
  - `npm run lint`, `npm run typecheck`, `npm run build`: 0;
  - `npm test`: 48 files / 1 467 passed / 0 skipped;
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`:
    `No findings.`;
  - `ENGINE_DEEP=1 npx vitest run src/engine.test.ts src/transposition.test.ts`: 59 / 59 (at
    `39ce7a2`, `src/*.ts` identical to `9823c27`);
  - `SEARCH_DEEP=1 npx vitest run` over the five search files at `39ce7a2`: 199 / 200. The red
    row, the rook ending, was split per decision 7, and the file then re-ran 40 / 40.
- **Probes** (node scripts, reference only, not product): `.grugops/context/ticket-to-pr-ABC-121/probe/`.
