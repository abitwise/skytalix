---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T20:17:00Z
subtask: se-ABC-262
role: software-engineer
ticket: ABC-262
ref: .grugops/context/se-ABC-262/
branch: new grugops/ABC-262 from main (worktree .claude/worktrees/se-ABC-262)
width: parallel coding allowed (owner 2026-11-01); test/build/engine runs serialized — see Host rule. QE hops may hold the lock for timing windows.
---
# SE ABC-262
## Read
- plans/tickets/ABC-262-the-early-exit-row-reads-a-pawns-first-board-and-the-in-check-promotion-row-reads-black-to-move-test-only.md in full (acceptance, scope, fences). ADR-0056 (D5 fixed-count rule, C3″, smoke, rule R-TC). EPIC-010 top blocks.
## Host rule (binding)
- **Wrap every vitest / npm test / npm run build|lint|typecheck / engine / cutechess run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <command>`** — no two hops run tests at once; never hold the lock while idle. Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400. Worktree needs npm ci.
- Any timing or real game run you record: under the lock, with load1 and foreign processes logged. A foreign vitest from another repo recurs; never kill it.
- Any single run estimated over 60 min: STOP and report (owner rule).
- ABC-261 rows on main (src/gameend.nfr.test.ts, src/legal.test.ts); QE plants: .grugops/context/qe-ABC-261/raw/ and qe-ABC-254/raw/.
## Do
- Implement the ticket to its acceptance; gates green, 0 skips; skip-integrity and lane inventory clean. A STOP if the page cannot be met as written.
## Fences
- Only the files the ticket's scope names (test files only; no production src/ edits). No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. Never `while pgrep -f`. Thermal stop: Tctl median > 85 °C. Leave no process running. Scratch `/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-262/`.
## Publish
Sealed notes (task `se-ABC-262`, contextRoot = worktree; never the plugin cache), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-11-01, Software Engineer. Done with one STOP (A4). Branch `grugops/ABC-262`, worktree `.claude/worktrees/se-ABC-262`, from main `767a2e3e`. Claim `3ea272c0`, code `39a6237e`, notes and raw evidence `14912a02`. Nothing pushed or merged. Test-only: the UAT waiver grep is empty, so QE's verdict is the gate.**

- **Rows.** `src/gameend.nfr.test.ts`: on B2, `hasLegalMove` makes 1 spied attack test or fewer (bar `0 < calls <= 1`). `src/legal.test.ts`: lazy equals full on P1′ (a1=Q absent) and P2′ (b1=Q present), with black to move and in check.
- **A1:** both rows pass at the tip.
- **A2:** every precondition is asserted in the row and holds. Production reads exactly **1** on B2, so neither stop-rule condition fired.
- **A3:** QX1 reads **2**, PL3a **9** and QX2 **10**, and the early-exit row is red on each. These match QE's probe.
- **A4: NOT MET, so STOP.** The promotion row stays green under QB, both in the file run and run alone.
  - Cause: in check, `epoch` stays 0, and `pinStamp` squares that were never stamped also read 0. So QB's remaining `pinStamp[from] === epoch` operand still forces the test on a2.
  - Scratch-only remedy: one priming `legalCaptures` on `k7/8/8/8/8/8/r7/R6K b - - 0 1` turns QB red with the control green. It was not landed; that is BA/PM's call.
- **A5:** plants exist only in scratch copies; no plant is in any commit.
- **A6:** `39a6237e` touches only the two test files. One import was widened, and no title or `expect(` line changed. The files have no header counts. The full `main..tip` diff also lists `.grugops/` queue and context paths.
- **A7:** the two rows' summed duration has a median of **0.41 ms** (0.39 / 0.41 / 0.43).
- **A8:**
  - Lint, typecheck and build exit 0.
  - `npm test` gives **2 376 = base 2 374 + 2**, with 0 skips.
  - Skip-integrity: No findings. Lane inventory: 63 = 63.
  - G8 head median is **8.95 s** (wall 9.27 s). A foreign vitest ran during run 1 only.
- **Notes (sealed, 5 of 5 read back):** design `…2f045ef5`, plants `…70b46340`, gates `…e1a2c12e`, artifacts `…89aff8be`, failed-attempt (A4) `…2aee4de1`.
- **STOP:** A4, as above. The ticket goes back to BA/PM: either take the priming precondition or drop A4, leaving QB to the ENGINE_DEEP A1 walk.

### Trace row (10 cells, header order)

| ABC-262 | Default-lane rows: hasLegalMove early exit on pawn-first B2 (spied isSquareAttackedBy <= 1) and legalCapturesAndQueenPromotions in check, black to move (lazy = full on P1′/P2′) | EPIC-011 | — | NFR-008 (rows 0.41 ms median sum; G8 head 8.95 s); NFR-001 / ABC-206 call-count bar +1 | grugops/ABC-262 @ 39a6237e (notes 14912a02): src/gameend.nfr.test.ts, src/legal.test.ts (test-only) | npm test 63 files / 2 376 pass (base 2 374 + 2), skips 0; QX1 red (2), PL3a red (9), QX2 red (10) vs production 1; QB NOT red (A4 STOP) | waived (test-only; QE verdict is the gate) | — | In Review with STOP on A4 (branch, not merged; BA/PM decision on A4, QE re-read owed) |
