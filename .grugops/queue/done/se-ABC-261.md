---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T19:04:33Z
subtask: se-ABC-261
role: software-engineer
ticket: ABC-261
ref: .grugops/context/se-ABC-261/
branch: new grugops/ABC-261 from main (worktree .claude/worktrees/se-ABC-261)
width: parallel coding allowed (owner 2026-11-01); test/build/engine runs serialized — see Host rule. QE hops may hold the lock for timing windows.
---
# SE ABC-261
## Read
- plans/tickets/ABC-261-the-default-lane-sees-haslegalmove-lose-its-early-exit-and-reads-quiet-queen-promotions-while-in-check-test-only.md in full (acceptance, scope, fences). ADR-0056 (D5 fixed-count rule, C3″, smoke, rule R-TC). EPIC-010 top blocks.
## Host rule (binding)
- **Wrap every vitest / npm test / npm run build|lint|typecheck / engine / cutechess run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <command>`** — no two hops run tests at once; never hold the lock while idle. Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400. Worktree needs npm ci.
- Any timing or real game run you record: under the lock, with load1 and foreign processes logged. A foreign vitest from another repo recurs; never kill it.
- Any single run estimated over 60 min: STOP and report (owner rule).
- QE-254-b/c plants (PL3a, PQ2) for reuse: .grugops/context/qe-ABC-254/raw/ on main.
## Do
- Implement the ticket to its acceptance; gates green, 0 skips; skip-integrity and lane inventory clean. A STOP if the page cannot be met as written.
## Fences
- Only the files the ticket's scope names (test files only; no production src/ edits). No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. Never `while pgrep -f`. Thermal stop: Tctl median > 85 °C. Leave no process running. Scratch `/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-261/`.
## Publish
Sealed notes (task `se-ABC-261`, contextRoot = worktree; never the plugin cache), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-11-01, Software Engineer. Done. Branch `grugops/ABC-261`, in worktree `.claude/worktrees/se-ABC-261`, from main `ceb28780`. Code is `dd8b17ea` and the notes are `eae8d5f4`; `75547d02` holds the raw evidence. Nothing is merged or pushed. The change is test-only, so the UAT waiver holds and QE's verdict is the gate.**

- **Rows.**
  - `src/gameend.nfr.test.ts` gets an `isSquareAttackedBy` spy in the `./moves.ts` mock and one early-exit row. The board is `4k3/8/8/8/8/8/PPP5/4K3 w - - 0 1`: out of check, the first generated move is a legal king move, and the king has 5 moves. The bar is `0 < calls <= 2`.
  - `src/legal.test.ts` gets one in-check promotion row comparing lazy with full on two boards. P1 is `4r2k/P7/8/8/8/8/8/4K3 w - - 0 1`, where a8=Q is absent. P2 is `r3K3/1P6/8/8/8/8/8/7k w - - 0 1`, where b8=Q blocks and is present.
- **A1:** both rows pass at the tip.
- **A2:** each board's preconditions are asserted inside its row.
- **A3, PL3a:** the early-exit row fails, `expected 6 to be less than or equal to 2`. Production makes **2** calls and PL3a **6**, a gap of 4.
- **A4, PQ2:** the promotion row fails on P1. The untested a7-a8=Q is present.
- **A5, PL1:** the full `npm test` is red on the two `makeMove` bars, as at qe-ABC-254. The scratch-copy runs also hit qe-hop-integrity and missing-fixture artifacts, disclosed in note `…6d10ccab`. PL1 itself passes the new early-exit row, because `fullHasLegalMove` makes 1 call there.
- **A6:** every plant was made with QE's `plant.py` in scratch copies. No plant is in any commit.
- **A7:** with `-- src`, the diff lists only the two test files. The only removed lines are two widened imports. Neither file has a header test count of its own. **Deviation:** `dd8b17ea` also carries the claim move (2 `.grugops/queue/` paths), which was staged first. The fence bars amend and rebase, so it is left as is.
- **A8:** the median of the two rows' summed duration is **0.42 ms** (0.40 / 0.42 / 0.43).
- **A9:**
  - `npm test` at head: **2 374 = base 2 372 + 2**, 63 files, 0 failed, 0 skipped.
  - G8 head median **8.77 s** (8.78 / 8.77 / 8.76), load1 2.3–3.1, no foreign vitest.
  - Lint, typecheck and build exit 0.
  - Skip-integrity: No findings. Lane inventory: 63 = 63.
- **Notes (sealed, read back 4/4):** design `…96e8d155`, plants `…6d10ccab`, gates `…8912d2dc`, artifacts `…00c188c0`.
  - The first seal went to the wrong contextRoot: the worktree root instead of `.grugops/context`. Those files were never committed and were moved to scratch. `75547d02`'s message names their stale ids, and `eae8d5f4` corrects them.
- **STOP:** none.

### Trace row (10 cells, header order)

| ABC-261 | Default-lane rows: hasLegalMove's early exit (spied isSquareAttackedBy <= 2) and legalCapturesAndQueenPromotions' quiet queen promotions in check (lazy = full on P1/P2) | EPIC-010 | — | NFR-008 (rows 0.42 ms median sum; G8 head 8.77 s); NFR-001 / ABC-206 call-count bar +1 | grugops/ABC-261 @ dd8b17ea (notes eae8d5f4): src/gameend.nfr.test.ts, src/legal.test.ts (test-only) | npm test 63 files / 2 374 pass (base 2 372 + 2), skips 0; PL3a red (2 vs 6 calls), PQ2 red on P1, PL1 lane red | waived (test-only; QE verdict is the gate) | — | In Review (branch, not merged; QE re-read of A3–A5, A9 owed) |
