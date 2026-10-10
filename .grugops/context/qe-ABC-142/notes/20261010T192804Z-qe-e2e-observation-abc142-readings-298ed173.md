---
id: 20261010T192804Z-qe-e2e-observation-abc142-readings-298ed173
kind: observation
by: qe-e2e
at: 2026-10-10T19:28:04Z
verified_by:
confidence: high
refs:
  - ABC-142
  - ABC-042
  - NFR-008
supersedes:
---

# QE `ABC-142`: readings for `A1`–`A6` and the gates (code `41abc389`, tip `ab8d0088`, base `086185d9`)

This note is hand-authored and unsealed. Every reading was RUN by QE on 2026-10-10, on macOS with
Node v26.11.0 and vitest 3.2.7. The SE ran Node 24. load1 ran 6.98–14.16 across the hop, with two other
agents running `npm test` in parallel (`ABC-083` build, `ABC-094` QE).

Scratch copies came from `git archive` of `086185d9` and `ab8d0088`, placed in the session scratchpad
outside the repository, each with `node_modules` linked. No plant touched the worktree.

## Acceptance

- **`A1` MET.** In `src/fen.test.ts:54` ("FEN field parsing > parses the side to move"), `toBe(false)`
  was changed to `toBe(true)`. `npm test` exited 1. The console read `Tests  1 failed | 1679 passed (1680)`.
  The file was read with `node -e`: `success` false, failed 1, passed 1679, total 1680. The one failed entry
  was `.../src/fen.test.ts | FEN field parsing parses the side to move`, with ancestors
  `["FEN field parsing"]`. The worktree's `git status --porcelain` is empty.
- **`A2` MET.** The file was deleted, then the same red run was piped through `| tail -3`. Exit 1
  (`PIPESTATUS`). Only the Duration line, a blank line and the `JSON report written` line were
  visible. The ticket's own `jq` query read `1` and the same file and title.
- **`A3` MET.** On the worktree tip, green `npm test` exited 0, with `Test Files 53 passed (53)` and
  `Tests 1680 passed (1680)`. The file read `success` true, failed 0, passed 1680, total 1680, with 53
  `testResults`. Pending and todo were both 0.
- **`A4` MET.** After `A3`, `git status --porcelain` was empty. `git check-ignore -v` returned
  `.gitignore:21:.test-results/`. On the base copy, `npm test` read 53 / 1680, with no `.test-results/`
  written, so the counts equal the base's. `lane-inventory.js` read "collects 53; git tracks 53", with
  `.test-results/` present.
- **`A5` MET.**
  - `git diff --name-only 086185d9 41abc389` lists exactly `.gitignore`, `package.json`,
    `src/cli.test.ts` and `tools/grugops/run-bounded.js`.
  - The production-`src/` filter reads empty. `--numstat -- src/` gives `1 1 src/cli.test.ts`.
  - `run-bounded.js` has one hunk, `@@ -10 +10 @@`. With line 10 removed, `diff` against the base
    is empty, so the code and the exit contract are byte-unchanged.
  - `vitest.config.ts` and `AGENTS.md` are unchanged.
  - The AGENTS.md skip-count capture returned the integer `0`.
- **`A6` MET.**
  - `src/cli.test.ts:1667` contains the JSON-quoted `package.json` `scripts.test` byte for byte (`node -e` `includes` check: `true`).
  - The assertion at `:1685` is still `toBe(command)`, and `added` is `toEqual(["chess"])`.
  - Unmodified copy: `npx vitest run src/cli.test.ts` gave 67 passed.
  - With `Z` appended to the script: exit 1, `1 failed | 66 passed (67)`, and the failure was
    `ABC-042 — the shape of what was delivered > A10 — package.json gains exactly one scripts key and
    nothing else`.

## Beyond the criteria (QE's breaking runs, same red copy)

- **Overwrite, not append.** QE seeded `last-run.json` with 2,000,000 bytes of `x`, then ran green
  `npm test`. The file was 676,015 bytes afterwards, it parsed, and it read `success` true / failed 0.
- **Suite-level red.** QE put a `throw` in a `describe` body in `src/san.test.ts`. Exit 1, with
  `Test Files 1 failed` and `Tests 1658 passed`. The file read `numFailedTests` 0 and
  `numFailedTestSuites` 1, and `testResults[].status=="failed"` carried the file and the message
  `QE-PLANT boom`. **The ticket's `jq` read query printed nothing** (`QE-142-b`).
- **Unhandled-error red.** QE added a test that throws from a `setTimeout`. Exit 1, the console showed
  `Errors 1 error` with all 1681 tests passed. **The file read `success` true, failed 0, and did not
  contain the error text** (`grep -c` 0) (`QE-142-a`).
- **Bound crossed.** QE added a `while (true) {}` test. Exit 124, and the console's last line was the
  `run-bounded: timed out` line. The file's `startTime` was unchanged, so the stale previous run still
  read `success` true. No orphan was left (`pgrep` empty) (`QE-142-c`). This confirms the SE's named
  limit.

## Gates (tip `ab8d0088`, worktree)

- `npm run lint` exited 0 (102 files). `typecheck` exited 0, and again with `.test-results/` present.
  `build` exited 0.
- `npm test` exited 0, 53 / 1680.
- Skip-count `0`. `test-skip-integrity.js --skip-count 0` printed `No findings.` and exited 0.
- `lane-inventory.js` printed `No findings.` and exited 0. `run-bounded.proof.js` printed "all rows held"
  and exited 0.
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts` exited 0 with 7 passed.
- uat-spec-integrity is not applicable (0 `*.uat.spec.ts` files). E2E and `check-uat-oracles.js` are
  `UNKNOWN - verify` (no command; script absent).
- `host-protection.js` exited 2: `UNKNOWN - verify` (gh returned no readable HTTP status).
- No engine file was touched, so the puzzle-suite trigger did not fire.
