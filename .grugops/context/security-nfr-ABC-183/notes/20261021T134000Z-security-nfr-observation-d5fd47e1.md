---
id: 20261021T134000Z-security-nfr-observation-d5fd47e1
kind: observation
by: security-nfr
at: 2026-10-21T13:40:00Z
verified_by: 
confidence: high
refs:
  - ABC-183
  - AR-180-VALIDATED
  - AR-183-CWDARG
  - AR-162-FALLBACK
  - AR-095-CWD
  - QE-183-a
  - QE-183-b
  - V5.3.2
  - NFR-008
  - ADR-0036
  - ABC-162
  - ABC-168
  - grugops/ABC-183
  - 7bd2b54f
  - c4c6d36e
  - grugops/qe-ABC-183
  - 3ab055f4
  - 19abbdb1
  - src/cli.real-engine.test.ts
  - src/book-file.ts
  - plans/tickets/ABC-183-a7-pins-that-the-decoy-is-written-before-the-booked-spawn.md
  - 20261021T101000Z-qe-e2e-observation-5e544b3e
  - 20261021T101020Z-qe-e2e-observation-cbd50a13
  - 20261021T101040Z-qe-e2e-decision-be7c2c82
  - 20261021T092600Z-security-nfr-decision-1b032e3f
  - 20261021T093500Z-orchestrator-decision-73eb06c5
  - 20261021T094500Z-orchestrator-decision-8d0de2f4
supersedes: 
seal: sha256:2a51f04ca0bac2ace914bd8f9d9322c58a70f431492a951aed8422bce9d4b398
---

# Security/NFR `ABC-183` readings: test-only confirmed; QE-183-a (TCWD) reproduced under P6f, and the named fix shape measured to red it

**Read, not restated:** QE `…5e544b3e` (A4 matrix), `…a1cbb8a6` (A1–A3, A5, gates), `…cbd50a13` (TCWD, TMOC), `…be7c2c82` (verdict); SE `…c7e6106e`, `…90cab7c4`; my `ABC-180` ruling `…1b032e3f`; owner records `…73eb06c5`, `…8d0de2f4`. No timing was taken.

## Surface
- `git diff --name-only 19abbdb1 3ab055f4`, context notes excluded: `src/cli.real-engine.test.ts` and the `ABC-183` page. Nothing else.
- The waiver form (`… | grep -v '\.test\.ts$' | grep '^src/'`) is empty. `src/book-file.ts` is unchanged, so Ruling 2 does not fire.
- `main` since the base `19abbdb1` touches only `src/status-panel.nfr.test.ts` under `src/` and `data/` (`ABC-181`). That does not overlap.
- The code diff is +11/−0: one `let`, one comment, one `existsSync` on a path under the `mkdtemp` directory, and one `expect`. There are no writes, spawns, imports, environment reads or logging changes.

## QE-183-a, read in the code at `3ab055f4`
- `spawnReal(root, script, args, cwd = root)` defaults the child's working directory to the tree root. The real book is at that root.
- `RealChild` (`:223-230`) has no `cwd` field. Only the unasserted `[CLI_DEEP] (cwd …)` log line records it.
- A7's `expect(join(neutral, "/"), "A7's working directory").not.toBe(join(REPOSITORY, "/"))` compares two test variables, not the child's working directory.
- The new `decoyBeforeBooked` capture still reads `true` under TCWD, because the decoy is still written into `neutral`.

## Scratch cells
Method:
- `git archive 3ab055f4` plus a `node_modules` symlink, outside the repository, in this session's scratchpad `sn183/cells/<cell>`;
- a private `TMPDIR` per cell, run one cell at a time;
- `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts`.

Plants:
- **P6f:** the cwd-first `try`/`catch` body from `…567002e7`. sha `f251939a…` differs in bytes from QE's `0b016daf…` but has the same body.
- **TCWD:** `booked`'s `neutral` argument dropped. sha `008c4e79…`, **byte-identical to QE's**.
- **FIX:** `RealChild` gains `readonly cwd: string`, `spawnNode` returns its `cwd`, and A7 asserts `expect(booked.cwd, "AR-183-CWDARG: booked must run from neutral").toBe(neutral)`. sha `cc52029e…`.

| cell | result |
|---|---|
| TCWD + P6f (head test) | **11/11 green: survives** (reproduces QE) |
| FIX (delivered `book-file.ts`) | 11/11 green |
| FIX + P6f | 10/11, red A7 at the existing labelled stderr detector (the kill holds) |
| FIX + TCWD + P6f | **10/11, red A7 at the new `booked.cwd` assertion** |

- Leftovers: only Node's `node-compile-cache` in each private `TMPDIR`.
- The main checkout's `git status --porcelain` was empty after the runs.
- **Not read:** typecheck of the FIX shape (vitest strips types). The SE's gates on the fix ticket cover it. `UNKNOWN - verify`.
