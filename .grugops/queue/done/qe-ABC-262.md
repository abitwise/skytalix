---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T20:24:07Z
subtask: qe-ABC-262
role: qe-e2e
ref: .grugops/context/qe-ABC-262/
branch: new grugops/qe-ABC-262 from grugops/ABC-262 (head bb399321; code 39a6237e; base 767a2e3e) — worktree .claude/worktrees/qe-ABC-262
width: TESTS SERIALIZED. Wrap EVERY test/build run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. Two records hops run beside you (no CPU).
---
# QE: grade ABC-262 (extra boards, test-only)
## Ticket
plans/tickets/ABC-262*.md. SE notes on the branch .grugops/context/se-ABC-262/ (…2f045ef5, …70b46340, …e1a2c12e, failed-attempt …2aee4de1).
## Orchestrator ruling on A4
A4 is WAIVED: QB survives the black-to-move row because, in check, legalCapturesAndQueenPromotions leaves epoch at 0 and an unstamped pinStamp square reads 0. Production is correct (src/legal.ts:429 `inCheck ||` short-circuits). No setup call on module-private state. Confirm QB is caught by the ENGINE_DEEP ABC-254 A1 walk, and confirm the production reasoning (line 429) by reading the code.
## Do
- Re-plant QX1, PL3a, QX2 (A3) and QB (expect green on the row, red on the deep walk). One plant of your own for the black rows.
- A6 diff fence, A7 cost, A8 gates (npm test ×3 expect 2 376, skip-integrity, lane-inventory), G8 interleaved under the lock (wait cap 15 min; SHARED otherwise). UAT waiver. Merge-tree against main.
- Run time ≤ 30 min excluding waits.
## Fences
Tests and your records only; no src/ production edits, no board/plans/memory-bank. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Verdict with gap ids; sealed notes (task qe-ABC-262, contextRoot = worktree's .grugops/context, never the plugin cache); commit; ## Result + trace row; brief + claim to done/.

## Result

*qe-e2e (claude-opus-5-5), 2026-11-01T20:34:45Z. Branch `grugops/qe-ABC-262` (worktree `.claude/worktrees/qe-ABC-262`, from `bb399321`): claim `46a0c69a`, notes `af650be3`. Every test and build run went under `flock host-test.lock`. Nothing was pushed or merged, and nothing under `src/`, `tools/`, the board, `plans/` or `memory-bank/` was edited. UAT is waived: the waiver grep is empty on `39a6237e` and over `767a2e3e..bb399321`.*

- **Verdict: PASS_WITH_GAPS.** A4 is waived by the Orchestrator, and no gap is blocking.
- **A1, A2:** both rows are green at production in 3 head runs and in the merged tree, and every board precondition is asserted in-row.
- **A3:** on B2, production makes **1** attack test, QX1 **2**, PL3a **9** and QX2 **10**. The early-exit row is red on all three plants.
- **A4 (waived):** QB stays green on the black row and on the whole `npm test` (2 376/2 376). It is **red on the ENGINE_DEEP ABC-254 A1 walk**: `kiwipete 20-65 39-22 65-99` gets an extra black g2–g1=Q. The C0 control is green on the walk.
- **Line 429:** I read `src/legal.ts:429` and it is `(inCheck || pinStamp[from] === epoch) &&`.
  - In check, `||` short-circuits, so every quiet promotion is tested.
  - Out of check, `markPins` returns an epoch ≥ 1 (with `fill(0)` on wrap), so only pins stamped on this call match.
  - Production is correct. QB survives only because, in check, `epoch` stays 0 (lines 406 and 417) and a never-stamped square also reads 0.
- **QE's own plants on the black rows:**
  - **QBe** (QB without the alias) turns the row red on P1′.
  - **QKb** (black in check drops every quiet queen promotion) turns it red on P2′. In `npm test` it fails 1 of 2 376, and only this row; the ABC-261 white row stays green.
- **A5:** no plant is in any commit (0 markers in `src` history).
- **A6:** `39a6237e` touches only the two test files, with one widened import. No title or `expect(` line was removed, and there are no header counts. Comments cite only ABC-262, ABC-261, QE-261-a and QE-261-b.
- **A7:** the two rows' summed duration has a median of **0.29 ms** (≤ 20 ms).
- **A8:**
  - Lint, typecheck and build: rc 0.
  - Head ×3: **2 376**. Base ×3: 2 374, so the count is base + 2. 0 skips.
  - Skip-integrity and lane-inventory (63 = 63): no findings.
- **G8** (b h h b b h, 20:30:45–20:33:09Z): **H 8.94 s** (9.15 / 8.94 / 8.85), **B 8.94 s** (8.90 / 9.01 / 8.94).
  - load1 1.25–2.34, Tctl median 63.4 °C.
  - **Admissible:** ALONE before all 6 runs, no foreign vitest, no SHARED flag.
  - NFR-008 **MET**.
- **Merge:** `git merge-tree --write-tree main grugops/ABC-262` is clean (tree `0988f004`, `main` at `d9bbd0c2`). `npm test` on that tree gives **2 376 passed**.
- **Gaps:**
  - **QE-262-a (LOW, carry to ABC-252):** the epoch-0 alias hides QB-shaped regressions from the black row. Re-plant QB, QBe and QKb on any guard or pin-set rewrite.
  - **QE-262-b (INFO, BA/PM):** mark A4 waived on the ticket page at close.
  - **QE-262-c (INFO, Orchestrator):** the `/tmp/claude-1000` scratch volume hit EDQUOT. About 8 GB of earlier hops' scratch trees needs clearing with owner consent. The base and merged trees went to detached worktrees on the home volume, which were removed after use.
- **Notes** (task `qe-ABC-262`, contextRoot = worktree `.grugops/context`; 5 of 5 sealed, `validate` reports no findings):
  - verdict `20261101T203402Z-qe-e2e-decision-ed4d02a5`;
  - plants `…-observation-064f5f07`;
  - line 429 `…-observation-918ca02e`;
  - gates/G8 `…-observation-dffb3c15`;
  - gaps `…-observation-16924bec`.
  - `qe-hop-integrity --ticket ABC-262`: covered.
- **Run time:** about 10 min under the lock. The window included a 15 s cool-down before each run. One window attempt was lost to EDQUOT before any test ran.
- **No process left running, and no foreign process was killed.** Raw evidence is in `.grugops/context/qe-ABC-262/raw/`.

### Trace row (10 cells, header order)

| ABC-262 | Default-lane rows: hasLegalMove early exit on pawn-first B2 (spied isSquareAttackedBy <= 1) and legalCapturesAndQueenPromotions in check, black to move (lazy = full on P1′/P2′) | EPIC-011 | ADR-0003 (as amended) | NFR-008: G8 H 8.94 s / B 8.94 s ≤ 10 s, ALONE all 6, load1 ≤ 2.34; rows median 0.29 ms ≤ 20 ms; NFR-001 / ABC-206 call-count bar +1 | grugops/ABC-262 @ 39a6237e (tip bb399321): src/gameend.nfr.test.ts, src/legal.test.ts (test-only) | QE PASS_WITH_GAPS: npm test 2 376 ×3, skips 0 (base 2 374); merged tree 2 376; QX1 (2) / PL3a (9) / QX2 (10) red vs production 1; QB green on the lane, red on ENGINE_DEEP A1 (A4 waived); QE's QBe red on P1′, QKb red on P2′; QE-262-a LOW, QE-262-b/c INFO | UAT waived (0 production lines); QE verdict signs | — | QE PASS_WITH_GAPS (branch, not merged; to the Orchestrator for merge routing; QE-262-a to ABC-252, QE-262-b to BA/PM) |
