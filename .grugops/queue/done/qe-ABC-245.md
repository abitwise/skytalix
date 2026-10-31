---
subtask: qe-ABC-245
role: qe-e2e
ticket: ABC-245
ref: .grugops/context/qe-ABC-245/
branch: new grugops/qe-ABC-245 from grugops/ABC-245 7c1721ce (worktree .claude/worktrees/qe-ABC-245); base 9c008db4, head 7e81732e
width: ALONE for timing; only a records-only BA/PM hop beside you (no vitest)
---
# QE ABC-245 (XS, P3, test-only): far-back third occurrence row; plus the clean G8 re-read
## Read
The ticket page (RE-SCORED block, A1–A3, Test notes); ADR-0046 § Ruling 2026-10-31; qe-ABC-242's plants note (…93eb0bf9: Q6/Q8 CAP8/CAP50) and se-ABC-245's notes on the branch.
## Do
- PREREG first.
- Re-run Q6 (cap 8) and Q8 (cap 50) against the whole default lane on scratch copies: the new row must go red, and nothing else may change verdict versus qe-ABC-242's runs. Cap 100 green; base levels.ts red on the new row.
- Check the fixture: legal game, no captures or pawn moves, offsets [−98, −94], child clock 98 < 100, keys ≤ 101.
- Gates: lint, typecheck, build, `npm test` ×3 with 0 skips and skip-integrity. The diff is src/levels.test.ts only; check the names diff is +1.
- **G8, ALONE, order b h h b b h, wait-clear by `kill -0`; record load1 and Tctl.** This is also the clean re-read the Orchestrator owes for ABC-221's inadmissible 9.84 s. Report the medians.
  - Head > 9.6 s fires ABC-244 tranche 2 (report only). Head > 10 s: STOP.
- Verdict PASS / PASS_WITH_GAPS / FAIL (UAT waived: 0 production lines).
## Fences
- No edits to src/, tools/, data/ or the board. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec.
- Waiting: poll an output file or `kill -0 <pid>`; never `while pgrep -f …`. Never put vitest on the same command line as a wait.
- Thermal stop: Tctl median > 85 °C. Scratch `qe-245/`, kept small and removed at the end. Leave no process running.
## Publish
Sealed notes (task `qe-ABC-245`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-10-31, QE/E2E. QE verdict: PASS** at `7e81732e` (base `9c008db4`; A3/QB base `levels.ts` = `4387d4e8`). Branch `grugops/qe-ABC-245` from the SE's tip `7c1721ce`. PREREG `d16c7505` was committed before any run. Notes `84e91d5d`. ALONE, with no edit to `src/`, `tools/`, `data/` or the board. Not merged, nothing pushed. UAT waived (0 production lines); this verdict is the QE sign-off.

- Notes (task `qe-ABC-245`): decision `…b2ebc183`; plants `…5cff79dc`; fixture + census `…074d8f7a`; gates + `G8` `…af467c7b`; findings `…cf53b0ed`; artifacts `…803f288b`.
- **Plants, whole default lane** (2 364 rows + qe-ABC-242's X1–X4):
  - none (cap 100): 0 red.
  - **Q6 (cap 8)** and **Q8 (cap 50)**: the ABC-245 row red **only** (`d7e8:-1005` ≠ `d7e8:0`), plus X2. That row is the only change of verdict against qe-ABC-242's runs.
  - **QB** (`4387d4e8` `levels.ts`): the row red (−1005), plus qe-ABC-242's six QB rows and X2.
  - Q97 red, Q98 survives (informative, SE-245-a).
  - All as pre-registered. **QE-242-b closed.**
- **Fixture:** 17 checks, 0 FAIL, by QE's own K+Q v K generator, cross-checked with the project at every ply.
  - The game is legal, with no capture and no pawn move, and no earlier end.
  - Offsets **[−98, −94]**, child clock **98 < 100**, **98 keys ≤ 101**.
  - The project reads the child as a claimable threefold.
  - The census equals the SE's R1 line (7 children for 8 legal, the same budgets, depth 1, 290 virtual ms).
- **Gates:** lint, typecheck and build exit 0. `npm test` ×3 **2 364 passed, 0 failed, 0 skipped**, 63 files. Skip-integrity `No findings.` The diff is `src/levels.test.ts` only (the header plus a pure insertion). Names **+1 / −0**, hashes equal. Header 46 = run 46.
- **`G8`** (b h h b b h, wait-clear by `kill -0`, admissible):
  - **H 9.82 s** (9.44 / 10.19 / 9.82), **B 9.44 s** (9.08 / 9.44 / 9.58), delta +0.38 s.
  - load1 1.30–2.39. Tctl median 57.4 °C, max 75.6.
  - `NFR-008` MET. **`ABC-244` tranche 2 FIRES on the raw head median** (report only).
  - The delta is noise in byte-identical files; the row's file is +18 ms.
  - B is the clean re-read of `ABC-221`'s tree (src = `c48a6f83`): **9.44 s**.
- **Findings:** QE-245-b LOW (the tranche-2 reading on a noise-dominated n = 3 median; 0.18 s headroom). QE-245-a INFO (census "reads" = intervals; 30 `now()` calls). QE-245-c INFO (the header count goes stale with the next row). QE-245-d INFO (harness: `node_modules` symlinked across devices; post-PREREG `names.mjs` regex fix).
- STOP: none (H ≤ 10 s; Tctl ≪ 85 °C). Scratch removed; no process left running.

### Trace row (10 cells, header order)

| ABC-245 | A blunder row reads a third occurrence whose two earlier occurrences lie 98 and 94 plies back, so a lowered prior-keys cap turns the lane red; levels.test.ts header count corrected (test-only) | EPIC-010 | ADR-0054 § Proposed amendment (accepted); ADR-0046 § Addendum R1–R4, § Ruling 2026-10-31 | NFR-008: G8 H 9.82 s / B 9.44 s ≤ 10 s (tranche 2 fires on the raw head median, noise); 0 real-clock rows; R1 10 intervals per level call at step 10 | grugops/ABC-245 @ 7e81732e: src/levels.test.ts | QE PASS: npm test 2 364 pass ×3, skips 0; whole-lane plants Q6/Q8 red on the row only, QB red, cap 100 green; fixture 0 FAIL | UAT waived (0 production lines); QE verdict signs | — | QE PASS (branch, not merged; to the Orchestrator for merge routing) |
