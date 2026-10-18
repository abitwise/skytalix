---
id: 20261018T132000Z-qe-e2e-observation-abc170-criteria-and-gates-8bd2de27
kind: observation
by: qe-e2e
task: qe-ABC-170
at: 2026-10-18T13:20:00Z
verified_by:
confidence: high
refs:
  - ABC-170
  - plans/tickets/ABC-170-the-engine-takes-two-optional-limits-maxdepth-and-maxnodes.md
  - ADR-0044
  - EPIC-007
  - NFR-005
  - 20261018T122615Z-software-engineer-observation-readings-7c1e4a90
  - 20261018T122617Z-software-engineer-artifact-ref-delivery-e8f04d26
supersedes:
---

# ABC-170: independent re-check of A1-A5 and A7, and the gates, at tip `64b07741` (code `e29f7951`, base `358810ac`)

These notes are hand-authored and unsealed. `AGENTS.md` says no `finding` is admissible on this install. I read everything from
the scratch worktree `../wt-qe-ABC-170` (detached at `64b07741`), which has since been removed. **No timing was read.**
A6 (`NFR-005`) stays OPEN.

## Scope / Risks (cited from the ticket page, authoritative)
- Scope: `src/engine.ts` gains two optional `EngineOptions` fields and two conditions. `src/engine.test.ts` gets the A4
  amendment plus the A1/A2/A3/A5 rows.
- Risk: "absent = today" can break silently (test note 1). A2's identity check is the proof that the aborted iteration
  is discarded (test note 2).

## Criteria
- **A1 MET.** On `kp-vs-k` at 10 ms with `tickingClock(1)`, the unlimited engine reaches depth 7. `maxDepth: 3` gives d3, 147
  nodes, `e1f2` 151, which equals `search(p, 3)`. `maxDepth: 1` gives d1, `e2e3` 153, a legal move.
- **A2 MET.** Kiwipete at `maxNodes: 20000` gives d3 and 20 058 nodes (≤ 21 024), `e2a6` 70, which equals `search(p, 3)`.
  `maxNodes: 1` gives d1, 602 nodes, a legal move. This fixture's abort lands **inside quiescence** (instrumented copy:
  qAbort 1).
- **A3 MET**, and checked well beyond the six roots. See `…bca451d6`: the tip with the fields absent equals the **base**
  engine in all five fields over 6 768 comparisons, with 0 mismatches.
- **A4 MET.** The `git diff -U0` hunks in `src/engine.test.ts` are `-517 +517,13`, `-520,4 +532,13` and `-1200,0 +1222,149`,
  so the only edits sit inside `:478-556` and the rest is appended rows. The export, arity, `budgetMs` and behavioural rows
  are outside the hunks and green.
- **A5 MET.** The `RF-1` rows are unedited and green. The two new rows are green.
- **A6 OPEN.** It is owed in a quiet window and is the Orchestrator's reading. I did not run it or estimate it.
- **A7 MET.** `git diff --name-only 358810ac 64b07741 -- src` gives `src/engine.test.ts` and `src/engine.ts`. A wide limb
  grep over the engine.ts `+` lines finds nothing. The grep covered `process`, `from "`, `require`, `import`, `spawn`,
  `exec`, `fork`, `fetch`, `eval`, `Function`, `Worker`, `globalThis`, `child_process`, `fs` and `net`.

## Gates at `64b07741` (scratch worktree, `node_modules` cloned from main, lockfile identical)
- lint 0, typecheck 0, build 0.
- `npm test`: exit 0 on the **first run** (the 60 s bound was not hit, so there was no re-run). 58 files, 1839/1839.
  `last-run.json` reads success true, pending 0, todo 0.
- `test-skip-integrity.js --skip-count 0` printed `No findings.` and exited 0.
- `git merge-tree --write-tree main 64b07741` exited 0, with main at `b4645a82`.
  - While this hop ran, main moved to `7174997d`, which merges ABC-169 (`src/evaluate.ts` and `src/cli.test.ts`; no engine file).
    `git merge-tree --write-tree 7174997d 64b07741` still exits 0. **The lane was not re-run on that merge result**,
    which is owed at the merge gate.
- Coverage (v8, default lane, `src/engine.ts` only): 98.24 % statements, 95.65 % branches, 100 % functions,
  99.02 % lines. The one uncovered line is `:517` `throw error;`, the non-ABORTED rethrow. It was already there at base `:491`.
  Lean mode, so this is informational against `coverage_threshold` 0.8.
- UAT-waiver reading: `git diff --name-only a0c6db6c...64b07741 | grep -v '\.test\.ts$' | grep '^src/'` gives
  `src/engine.ts`, so **the waiver does not apply**.
