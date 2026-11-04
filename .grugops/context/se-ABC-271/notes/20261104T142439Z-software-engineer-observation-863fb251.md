---
id: 20261104T142439Z-software-engineer-observation-863fb251
kind: observation
by: software-engineer
at: 2026-11-04T14:24:39Z
verified_by: 
confidence: high (every count is from a run whose output is in raw/out; one process slip disclosed)
refs:
  - se-ABC-271
  - grugops/ABC-271
  - ABC-271
  - EPIC-011
  - E4a
  - ADR-0070
  - orch-2026-10-30a/…730399e5
  - orch-2026-10-30a/…6ccd8243
  - qe-ABC-271-freeze/20261104T133856Z-qe-e2e-decision-67b5eeac
  - qe-ABC-271-freeze/20261104T133902Z-qe-e2e-observation-a8173b00
  - sha256:bf3c205bf4106209e3151717d93542180d90d344cecfdfbb6f2a30c9d5db887a
  - 10f29a82
  - src/08e56302
  - main/3a08d244
  - src/evaluate.ts
  - src/evaluate-params.ts
  - src/evaluate.passer.test.ts
  - src/evaluate.passer-fixtures.json
  - src/evaluate.taper.test.ts
  - src/evaluate.pawns.test.ts
  - src/transposition.test.ts
  - K0
  - K1
  - K2
  - K3
  - K4
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
supersedes: 
seal: sha256:d3d51385544405b99e3c7f65184095a46f9ac5c1d2592e05178302d013e42ceb
---

# se-ABC-271 tests and commands: 21 new default-lane rows + 7 K0 deep rows in src/evaluate.passer.test.ts, one new A9 row; default lane 2 672 / 2 672 in 9.04 s; 15 deep lanes green; lint, typecheck, build exit 0; skip count 0; four planted mutants each red. One process slip: those four mutation runs went outside the host lock

Software Engineer, task `se-ABC-271`, build `10f29a82`.

## Tests added or changed
- **New `src/evaluate.passer.test.ts`** (default lane, 21 rows): the data rows (four exports at 0, every mg half 0, the prior comments); QE's file sha256 and counts; K1 (c) four rows (exact per-side seam, U, pair differences, all 0 at the shipped values); K1 (e) two rows; K1 (a) three rows; K1 (b) four rows; three source rows. **Deep (`SEARCH_DEEP=1`):** K0's seven counts. It defines nothing behind a skip: the deep rows are not defined unless the flag is set (the `engine.test.ts` form), so the skip count stays 0.
- **New `src/evaluate.passer-fixtures.json`:** QE's `fixtures.json`, byte copy, sha256 `bf3c205bf4106209e3151717d93542180d90d344cecfdfbb6f2a30c9d5db887a`.
- **`src/evaluate.taper.test.ts`:** A9's `bound` counts the E4a pairs, plus one new row (`ABC-271 K1 (d)`). No existing expectation changed.
- **K2's two re-pins:** `src/evaluate.pawns.test.ts` (the memo-size row) and `src/transposition.test.ts` (A7).

## Commands run (all under `flock <scratch>/host-test.lock` except where stated)
- `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/evaluate.passer.test.ts`: 21 / 21.
- `npm test`: 70 files, 2 672 / 2 672, 9.04 s (wall 9.34 s). The first run in the fresh worktree had one environment red (`cli.test.ts` A2 reads `node_modules/vitest/package.json`; the worktree had no `node_modules`). A `node_modules` symlink to the main checkout's, the `.gitignore` precedent (QE-274-d), cleared it. It is untracked.
- `npm run lint` exit 0 (two `noDynamicNamespaceImportAccess` warnings in my first A9 row were fixed before the commit); `npm run typecheck` exit 0; `npm run build` exit 0.
- Skip count `NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'` = **0**; `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
- **Deep lanes** (`raw/scripts/deep.sh`, each lane under its own lock hold, `raw/out/deep/summary.txt`), every one exit 0: K0 (`evaluate.passer`) 28; search 57; PVS/LMR 29; null-move 45; futility 53; SEE 52; taper 170; quiescence 116; transposition `SEARCH_DEEP` 40 and `ENGINE_DEEP` 26; engine 83; pawns `ENGINE_DEEP` 44; tune `TUNE_DEEP` 17 (the tracer's identity gate holds at 0, so the ticket's `UNKNOWN - verify` on it reads green); puzzle 18; levels `ENGINE_DEEP` 58 (577 s).
- **Not run:** ladder (it plays games; the brief says no games); CLI / UCI real-engine and the UCI session lane (wall-clock product runs; they read no count or value this build could move); perft, input and zobrist deep lanes (they do not read the evaluation). Each is `UNKNOWN - verify` on this build, and none is expected to move.
- **The four `-t` lines of `R-281-a`** are QE's hop (test note 5) and were not run here as such. Their files (engine, levels, null-move) passed in full above.
- Scratch reads: `seamcheck.ts` (44 / 44 before the tests existed); `genpre.ts` (the pre-ticket values, on the `main` copy); `xbuild.ts`; `k0x.ts` ×2; `g2.ts` ×2; G6 (QE's scripts).

## Mutants (`raw/out/mutants.txt`): four planted, each red, file restored byte-identical
side to move ignored: 3 red; the walk stops before Q: 2 red; a memo hit drops the white word: 1 red; U's distance capped at 5: 3 red.

## Process slip (LOW), disclosed
The mutation script ran its four `npx vitest run src/evaluate.passer.test.ts` calls (about 1 s each) **without the `flock` wrapper** the brief requires for every vitest run. Nothing else ran unlocked. No other agent's run was killed or touched. Every later run went under the lock.
