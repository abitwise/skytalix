---
id: 20261023T224721Z-software-engineer-observation-3ff2f272
kind: observation
by: software-engineer
at: 2026-10-23T22:47:21Z
verified_by: 
confidence: high: every reading as it ran, deterministic
refs:
  - ABC-213
  - EPIC-006
  - ABC-203
  - AR-203-UNLINK
  - AR-203-LANEGAP
  - QE-203-b
  - QE-203-c
  - ADR-0047
  - ADR-0015
  - ADR-0036
  - NFR-008
  - N8-SPAWN
  - N8-LANE
  - grugops/ABC-213
  - 5a10b4b6
  - dfaa4cdc
  - src/pgn-file.ts
  - src/pgn.test.ts
  - arch-design-ABC-213/20261023T223723Z-architect-design-decision-d7ce173f
  - arch-design-ABC-213/20261023T223723Z-architect-design-observation-ecac899f
supersedes: 
seal: sha256:a1e42b8f55245ee79d8afb826a84ea1406f0831d919beb76026251a0e58b51a0
---

# ABC-213 build readings: red-first A1 ×2 at base; head 21/21 in pgn.test.ts; plants X1/X3/X4/X5 each red their row; lane 2044/2044, skips 0, lint/typecheck/build green, CLI_DEEP 11/11; writer child byte-identical, one spawnSync site

Software Engineer, task `ticket-to-pr-ABC-213`, `grugops/ABC-213` @ `5a10b4b6`. Node 26.11.1, vitest 4.1.12. Every reading below is as it ran.

## Red-first (the new rows, base holder)
`npx vitest run src/pgn.test.ts` gave 2 failed and 19 passed. `A1` (write) and `A1` (close) were red with `Error: EACCES` escaping, which is X3. The canary, `A2` ×2, `A3` and the 15 existing rows were green.

## Head
`src/pgn.test.ts` 21/21.

## Plants (each applied to the head holder, then restored by `cmp`)
| plant | red rows |
|---|---|
| X1 drop the unlink | `A2` ×2 (the named row); also `A1` ×2 (cleanup-attempted count 0) and `A3` |
| X3 unguarded unlink (base) | `A1` ×2 |
| X4 guard reports U | `A1` ×2 |
| X5 `catch {}` | `A3` |
| XC (extra) `vi.mock` call removed | canary and all 5 armed rows (the armed rows refused by `arm()`); 15 existing green; no `games/` in the worktree |

## Gates (worktree, head)
- `npm run lint`: 125 files, no fixes. The first run flagged formatting in `pgn.test.ts`; `biome format --write` fixed it.
- `npm run typecheck`: exit 0. `npm run build`: exit 0.
- `npm test`: 62 files, 2044 passed, 0 failed, exit 0. `.test-results/last-run.json`: success true, 2044/2044, pending 0, todo 0.
- Skip count (the AGENTS.md jq line): 0. `test-skip-integrity.js --skip-count 0`: `No findings.`, exit 0.
- `CLI_DEEP=1 … src/cli.real-engine.test.ts`: 11/11, exit 0.
- No timing was run (per the brief).

## A6/A7 structure
- `git diff main -- src/cli.ts src/pgn.ts` is empty.
- `pgn-file.ts` has 1 `node:fs` import with the same five bindings, and 1 export. The only `process.` and `stdout`/`stderr` hits are the unchanged header comment lines 6–7, the same as at base.
- `pgn.test.ts` has 1 `spawnSync(` site. The writer `SCRIPT` and the `spawnSync` call are byte-identical to `main`.
- No `games/` exists in the worktree after any run.
