---
id: 20261010T192804Z-qe-e2e-observation-abc142-console-consumers-e8b64469
kind: observation
by: qe-e2e
at: 2026-10-10T19:28:04Z
verified_by:
confidence: high
refs:
  - ABC-142
  - AGENTS.md
  - tools/grugops/lane-inventory.js
  - tools/grugops/test-skip-integrity.js
  - tools/grugops/run-bounded.js
  - 20261010T191923Z-software-engineer-decision-abc142-mechanism-b41d7e02
supersedes:
---

# QE `ABC-142`: every consumer of `npm test`'s console, checked against the added line. None breaks

This note is hand-authored and unsealed. This is ruling input for the Orchestrator, not the ruling.

**The added line.** After the summary, vitest prints a blank line and then
`JSON report written to <absolute path>`. QE ran it green on the base and green on the tip. The base
output ends with `Duration` and then a blank line; the tip output then adds the path line.

| consumer | reads `npm test` console? | result |
|---|---|---|
| AGENTS.md skip-count capture | no. It runs `npx vitest run --reporter=json` directly, and `vitest.config.ts` is unchanged | returned the integer `0` on the tip |
| `tools/grugops/test-skip-integrity.js` | no. It takes `--skip-count` as an argument | `No findings.`, exit 0 |
| `tools/grugops/lane-inventory.js` | no. It runs `vitest list --filesOnly` | 53 / 53, `No findings.`, exit 0, with `.test-results/` on disk |
| `tools/grugops/run-bounded.js` + `run-bounded.proof.js` | passes stdio through (`inherit`). It does not parse | proof "all rows held", exit 0. Code byte-unchanged (only line 10 changed) |
| tests that spawn `npm test` | none. `git grep` finds only `npm run chess` (`src/cli.test.ts:654`) | n/a |
| committed probes under `.grugops/context/*/probe/` that use `tail -N` | all four read **direct** `vitest` output, and three locate the counts with `grep -E '^ +Tests '` | unaffected |
| `npm test \| tail -N` in committed notes and plans | `git grep` finds 0 | n/a |
| hop habits (uncommitted `\| tail -N` captures) | yes | **every window shows one line fewer.** `tail -3` used to show `Start at`/`Duration`/blank and now shows `Duration`/blank/path, with no count either way. `tail -4` loses `Tests`. `tail -5` loses `Test Files`. `tail -6` and up still show both counts. A reader looking for counts should use `grep -E '^ +(Test Files\|Tests) '` or the file |

**Other questions in the queue file.**
- **Path leak.** The line carries the checkout's absolute path, including the home directory. That is
  not a new class of exposure: 276 tracked files already carry `/Users/olgeroeselg`. The file's
  `testResults[].name` fields are absolute too, but the file is git-ignored (`check-ignore` confirmed),
  so they never reach a commit. A note that pastes the console tail carries the path. Normal note
  practice already does.
- **Overwritten, not appended.** A 2,000,000-byte seed became a 676,015-byte file that parses.
- **`*_DEEP` lanes untouched.** They run `npx vitest run` directly, and `vitest.config.ts` is unchanged.
  `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts` exited 0 with 7 passed. It printed no
  `JSON report` line and left the file's mtime unchanged. A direct `npx vitest run src/cli.test.ts` on a
  copy wrote no `.test-results/`.
