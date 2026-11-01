---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T19:12:31Z
subtask: qe-ABC-261
role: qe-e2e
ref: .grugops/context/qe-ABC-261/
branch: new grugops/qe-ABC-261 from grugops/ABC-261 (head 06d6d987; code dd8b17ea; base ceb28780) — worktree .claude/worktrees/qe-ABC-261
width: TESTS SERIALIZED. Wrap EVERY test/build run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`; qe-ABC-260 and se-ABC-250 share it.
---
# QE: grade ABC-261 (lazy-legality rows, test-only)
## Ticket
plans/tickets/ABC-261*.md, A1–A9. SE notes on the branch .grugops/context/se-ABC-261/ (…96e8d155, …6d10ccab, …8912d2dc, …00c188c0). Plants: .grugops/context/qe-ABC-254/raw/ (plant.py, PL1/PL3a/PQ2).
## Do
- Re-plant PL3a, PQ2, PL1 yourself (copy .grugops/context too so qe-hop-integrity does not fail spuriously); plus one plant of your own per row (e.g. early exit lost only when not in check on a different board; a promotion to a minor piece instead of queen in check). Report survivors.
- Judge the early-exit bar: production 2 calls vs PL3a 6 — is "≤ 2" brittle to a harmless reorder of the generator (king move no longer first)? The row asserts the king move is first; say if that precondition is fragile.
- A7 (accept the 2 claim paths in dd8b17ea — Orchestrator ruled), A8 cost, A9 gates (npm test ×3 expect 2 374, skip-integrity, lane-inventory), G8 interleaved head vs base under the lock (wait cap 15 min, SHARED otherwise). UAT waiver. Merge-tree against main.
- Run time ≤ 30 min excluding waits.
## Fences
Tests and your records only; no src/ production edits, no board/plans/memory-bank. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Verdict with gap ids; sealed notes (task qe-ABC-261, contextRoot = worktree's .grugops/context, never the plugin cache); commit; ## Result + trace row; brief + claim to done/.

## Result

*qe-e2e (claude-opus-5-5), 2026-11-01T19:28:05Z. Branch `grugops/qe-ABC-261` (worktree `.claude/worktrees/qe-ABC-261`, from `06d6d987`): claim `05280714`, notes `872966f9`. Every test and build run went under `flock host-test.lock`. Nothing was pushed or merged, and nothing under `src/`, `tools/`, the board, `plans/` or `memory-bank/` was edited. UAT is waived: the waiver grep is empty on `dd8b17ea` and over `ceb28780..06d6d987`, so no production line changed.*

- **Verdict: PASS_WITH_GAPS, with no gap blocking.**
- **A1:** both rows pass at production in all three head `npm test` runs and in the merged tree.
- **A2:** both rows assert their boards in-row.
- **A3–A5, re-planted out of tree by QE.** The copies are git archives of the head with `.grugops/context` and `plans/` included, so qe-hop-integrity and the pgn rows stay green. Results:
  - **PL3a** turns the early-exit row red: `expected 6 to be ≤ 2`. QE's probe reads production 2 and PL3a 6, a gap of 4, and the bar sits between them.
  - **PQ2** turns the promotion row red on P1.
  - **PL1** turns full `npm test` red, 2 failed / 2 372: the two ABC-254 makeMove bars. The new early-exit row itself passes under PL1, as the SE disclosed.
  - QE's own plants **QN** (in check, the promotion goes to a knight; red on P2) and **QR** (generator reversed; red at the precondition) are caught.
  - **These survive the whole default lane (2 374/2 374):**
    - QX2: the early exit is lost only when the first move is not a king move. Kiwipete goes 1 → 6 attack tests.
    - QX1: one extra attack test on such boards.
    - QB: PQ2 for black only. The ENGINE_DEEP ABC-254 A1 walk catches it.
- **Early-exit bar (brief question):** "≤ 2" is **not** brittle to a generator reorder. On that board production makes 1 or 2 attack tests in any order, and the lazy list makes 6. The **precondition** `pseudo[0].piece === KING` is order-bound: QR turns the row red there with `expected 1 to be 6`. That is a loud false red, never a false green (QE-261-c).
- **A6:** no plant is in any commit.
- **A7:** under `src/` the diff is the two allowed files. The only removed lines are three widened import lines. No title or `expect(` line changed, and neither file has a header count. The two claim paths in `dd8b17ea` are accepted per the Orchestrator's ruling. An added comment cites "ABC-217 A2" (QE-261-d, INFO).
- **A8:** 0.53 / 0.47 / 0.41 ms, median **0.47 ms** (budget ≤ 30 ms).
- **A9:**
  - Lint, typecheck and build: rc 0.
  - `npm test` head ×3: **2 374**. Base ×3: 2 372, so the count is base + 2. 0 skips.
  - Skip-integrity and lane-inventory (63 = 63): "No findings."
- **G8** (b h h b b h, 19:21–19:24Z): **H 8.84 s** (8.73 / 8.93 / 8.84), **B 8.90 s** (8.90 / 8.96 / 8.86), H − B −0.06 s.
  - load1 1.42–2.15, Tctl median 57.5 °C.
  - **Admissible:** ALONE before all 6 runs, no foreign vitest, no SHARED flag.
  - NFR-008 **MET**, with 1.16 s of headroom.
- **Merge validity:** `git merge-tree --write-tree main grugops/ABC-261` is clean (tree `b60ab0ff`; main moved by ABC-260, +0 rows). `npm test` on that tree, out of tree: **2 374 passed**, rc 0.
- **Gaps (all non-blocking):**
  - **QE-261-a (LOW, BA/PM):** the early-exit row reads only a king-first board, and QX2/QX1 survive. The remedy is a second board in the row, e.g. `4k3/8/8/8/8/4K3/PPP5/8 w - - 0 1` (production 1, lazy list 9): a bar ≤ 2 catches QX2, and ≤ 1 also catches QX1.
  - **QE-261-b (LOW, BA/PM):** the promotion row is white-only, and QB survives the default lane. The remedy is colour-mirrored P1/P2.
  - **QE-261-c (LOW, carry to ABC-250's SE):** the precondition is order-bound, as above. On a reorder, re-pick the board or use an order-free precondition. Do not drop the bar.
  - **QE-261-d (INFO):** the comment cites "ABC-217 A2".
- **Run time:** about 8 min under the lock, plus about 2 min of lock and cool-down waits. `npm ci` took 3 min including its wait.
- **Notes** (task `qe-ABC-261`, contextRoot = worktree; 5 of 5 sealed, `validate` reports no findings): verdict `20261101T192723Z-qe-e2e-decision-4c6e9ee5`, plants `…-observation-f08e50a5`, G8 `…-observation-6434db56`, gates `…-observation-a6f75159`, gaps `…-observation-c385f9a2`. `qe-hop-integrity --ticket ABC-261`: covered.
- **No process left running, and no foreign process was killed.** Scratch files are in `scratchpad/qe-261/` (plant trees, base and merged trees, harness). Raw evidence is in `.grugops/context/qe-ABC-261/raw/`.

### Trace row (10 cells, header order)

| ABC-261 | The default lane turns red when `hasLegalMove` loses its early exit, and reads `legalCapturesAndQueenPromotions`' quiet queen promotions while in check (test-only, QE-254-b, QE-254-c) | EPIC-010 | ADR-0003 (as amended) | NFR-008: G8 H 8.84 s / B 8.90 s ≤ 10 s, ALONE all 6, load1 ≤ 2.15; rows median 0.47 ms ≤ 30 ms; NFR-001 call-count bar added | grugops/ABC-261 @ dd8b17ea (tip 06d6d987): src/gameend.nfr.test.ts, src/legal.test.ts | QE PASS_WITH_GAPS: npm test 2 374 pass ×3, skips 0 (base 2 372); merged tree 2 374; PL3a red (2 vs 6), PQ2 red on P1, PL1 lane red; QN/QR caught; QX1/QX2/QB survive the default lane (QB dies in ENGINE_DEEP); QE-261-a/b/c LOW, QE-261-d INFO | UAT waived (0 production lines); QE verdict signs | — | QE PASS_WITH_GAPS (branch, not merged; to the Orchestrator for merge routing; QE-261-a/b to BA/PM, QE-261-c to ABC-250) |
