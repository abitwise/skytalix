# qe-ABC-269-freeze artifacts and commands. The fixture is `src/evaluate.taper-corpus.ts` (sha256 05ed9e81…6339, commit `d6a57653`). The build and verify scripts are in `raw/scripts/`. Gates: typecheck 0, lint 0, npm test 2 429 / 2 429. Every run was under the host lock, and nothing is left running

QE/E2E, task `qe-ABC-269-freeze`, on `grugops/ABC-269`.

## Files
- **`src/evaluate.taper-corpus.ts`:** test-only data, 997 lines, no imports, no logic beyond one row helper (`kp`). It exports:
  - `TAPER_FROZEN_AT`;
  - `TAPER_MIRROR_POSITIONS` (30);
  - `TAPER_KP_ENDINGS` (6);
  - `TAPER_KP_SHELTER_STRESS` (3);
  - `TAPER_PASSER_PAIRS` (36);
  - `TAPER_PASSER_PHASES`;
  - `TAPER_DOOR_CORPUS` (176);
  - `G3_CORPUS_MAIN_EVALUATE` (184).
- **`.grugops/context/qe-ABC-269-freeze/raw/`:**
  - `scripts/gen.ts`: builds every set from its rule and writes `data.json`.
  - `scripts/write.ts`: writes the TS fixture.
  - `scripts/verify.ts`: reads the committed fixture and checks every stated property on `main`.
  - `scripts/lib.ts`: phase, mg, the analytic Δ and the forecast.
  - The design probes: `survey.ts`, `ladders.ts`, `kp.ts`, `pass.ts`, `trap.ts`, `trap2.ts`, `ep.ts`.
  - `scripts/seal.mjs`: copied from `qe-ABC-268`.
  - `data.json` and `notes/`.

## Commands (each `flock <scratchpad>/host-test.lock timeout …`)
- **The design and build scripts** (`node survey.ts`, `ladders.ts`, `kp.ts`, `pass.ts`, `trap.ts`, `trap2.ts`, `ep.ts`, `gen.ts`, `write.ts`): exit 0.
  - One failed `gen.ts` attempt: flipping L1's phase-22 rung to black to move is illegal, because white is in check.
  - The rule then became "flip where legal". The phase-22 row keeps white to move, and the row's `source` says so.
- **`npx biome format --write src/evaluate.taper-corpus.ts`** and **`npx biome check`**: clean.
- **`node verify.ts`:** 0 failures (mirror 30, endings 6 + 3, pairs 36, door 176, `G3` 184).
- **`npm run typecheck`:** exit 0. **`npm run lint`:** exit 0, 134 files.
- **`npm test`:**
  - Run 1: 2 428 / 2 429. The one red was `evaluate.pawns.test.ts` "no non-test module under src/ imports …", because the fixture's docblock named that module. The docblock was reworded.
  - Run 2: **2 429 / 2 429**, 65 files, 0 skipped, 9.37 s.

## Host
- No process was killed and nothing is left running.
- `node_modules` was copied into the worktree from the main checkout (git-ignored).
- Scratch under the session scratchpad.
