---
id: 20261026T041121Z-software-engineer-observation-ce9cdb99
kind: observation
by: software-engineer
at: 2026-10-26T04:11:21Z
verified_by: 
confidence: high: plants on a scratch copy restored and cmp-verified; gates as run; durations are not readings
refs:
  - ABC-208
  - EPIC-008
  - ADR-0050
  - NFR-008
  - QE-208-a
  - QE-208-b
  - QE-208-c
  - plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
  - qe-gate-ABC-208/20261026T035949Z-qe-e2e-decision-8c4f3e57
  - qe-gate-ABC-208/20261026T035949Z-qe-e2e-observation-98174381
  - orch-2026-10-26h/20261026T040103Z-orchestrator-decision-42479486
  - grugops/ABC-208
  - 80345eb9
  - 2d3db645
supersedes: 
seal: sha256:c2be813fc1a0b2cfe244dd68c5306faed1754a0694da5ed3a15ee9515cafe45d
---

# se-fix-ABC-208 evidence: the six QE plants survive head's old tests (0 of 2 123 each) and each goes red on exactly one new row; head green; gates green (npm test 2 128/2 128, Duration 8.02 s)

At `2d3db645` on `grugops/ABC-208`. Plants ran on a scratch copy under `<scratchpad>/se208fix/`, never in the worktree's `src/`. One at a time, against the **whole default lane**, with `search.ts` and `engine.ts` restored and `cmp`-verified after each.

## Plants: old tests then new tests (failed / total)
| plant | head's old tests | with the new rows | red row |
|---|---|---|---|
| engine null unmake outside a `finally` | 0 / 2 123 | 1 / 2 128 | QE-208-a: 6 roots mutated, first at reading 15 (side to move flipped) |
| search: null child key not written | 0 / 2 123 | 1 / 2 128 | QE-208-b `search()` d6: stale probes (list capped at 5) |
| engine: null child key not written | 0 / 2 123 | 1 / 2 128 | QE-208-b `chooseMove` to 6: stale probes (capped at 5) |
| `searchWithoutPvsOrReductions` wired on | 0 / 2 123 | 1 / 2 128 | QE-208-c `./search.ts` |
| `searchWithoutTable` wired on | 0 / 2 123 | 1 / 2 128 | QE-208-c `./search.ts` |
| `chooseMoveWithoutPvsOrReductions` wired on | 0 / 2 123 | 1 / 2 128 | QE-208-c `./engine.ts` |
The old-tests column reproduces QE's survivors exactly.

## Gates at `2d3db645` (worktree, own node_modules; width 1 of 2, shared host; durations are not readings)
- `npm run lint` 0 (129 files, no fixes); `npm run typecheck` 0; `npm run build` 0.
- `npm test` 0: 63 files, **2 128 / 2 128** (2 123 + 5). `.test-results/last-run.json`: `success: true`, `runState: exited`, 0 failed, 0 pending, 0 todo, 475 suites. **Duration 8.02 s** (80345eb9 recorded 7.71 s). NFR-008 W = 10 s: about 1.98 s of headroom, not a reading. Load1 was about 3.9 just after.
- Skip count (the spelled `--reporter=json` command) **0**; `test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0 (read and run only).
- `lane-inventory.js`: 63 = 63, `No findings.`
- `SEARCH_DEEP=1` null-move lane: **44 / 44** (39 + 5). A3 reads unchanged: `search()` d5 100.00 % within 25 cp of 187, max 25; `chooseMove` 100.00 %, max 8; mate flips 0; mate floor 0 of 189.
- New-row cost in the file run: QE-208-a 0.46 s, b 0.21 s + 0.10 s, c < 0.01 s.

## Remaining
- QE re-runs the three plants (orch-2026-10-26h). The `AGENTS.md` lane line for this file is still owed (Scribe, carried). The ticket stays `In Review`; board not touched.
