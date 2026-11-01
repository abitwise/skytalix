---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T15:27:36Z
subtask: qe-ABC-249
role: qe-e2e
ref: .grugops/context/qe-ABC-249/
branch: new grugops/qe-ABC-249 from grugops/ABC-249 (head dd66bfee; code 25371747; base 09d1f675) — worktree .claude/worktrees/qe-ABC-249
width: TESTS ARE SERIALIZED. Wrap EVERY test/build run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>` (qe-ABC-254 holds it for its timing window; wait). Records hops run beside you.
---
# QE: grade ABC-249 (test-only row: pre-root repetition at ply 4; QE-248-c)
## Ticket
plans/tickets/ABC-249*.md. SE notes on the branch: .grugops/context/se-ABC-249/ (…bcb0e207 fixture, …67c090b7 runs, …3bbfaabc artifacts). SE scratch: /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-249/ (qply4-red.txt, mutant tree).
## Do
- Re-apply QPLY4 out of tree yourself: row red; production green; non-vacuity asserts hold.
- G8 (npm test wall) head vs base, under the lock; foreign vitest recurs — log admissibility, wait-for-clear cap 20 min. New row ≤ 0.1 s.
- Gates: lint/typecheck/build, npm test, skip-integrity, lane-inventory. UAT waiver (test-only) confirm.
- Comment on brittleness: the row pins move+score (404/497); say whether pinning score is right for ADR-0054 decision 3 or a weaker assertion (e.g. score sign/draw vs not-draw) proves the same thing more durably. Do not change it unless it's a gap.
- Run time ≤ 30 min excluding waits. Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400; worktree needs npm ci.
## Fences
Tests and your records only. No src/ production edits, no board/plans/memory-bank. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Verdict PASS / PASS_WITH_GAPS / FAIL with gap ids; sealed notes (task qe-ABC-249, contextRoot = worktree, never the plugin cache); commit; ## Result + trace row; brief + claim to done/.

## Result

**2026-11-01, QE/E2E. PASS_WITH_GAPS, with no gap blocking.** Branch `grugops/qe-ABC-249` (worktree `.claude/worktrees/qe-ABC-249`, from `dd66bfee`): claim `5db757d5`, notes `17413cb0`. Every test and build run went under `flock host-test.lock`. Nothing was pushed or merged, and nothing under `src/`, `tools/`, `data/`, the board, `plans/` or `memory-bank/` was edited. UAT is waived: the waiver grep is empty and no production line changed. This verdict closes the gate.

- **A3 QPLY4, re-applied out of tree by QE:**
  - The row is **red** at the with-keys pin (expected {f1e1, 404}, received {f1g1, 497}), and its non-vacuity asserts passed.
  - At production the row is **green**.
  - **The whole default lane under QPLY4: 1 failed / 2 362 passed.** This row is the sole killer, so QE-248-c's survivor is now killed.
  - The control QPLY5 (`ply >= 5`) keeps the row green: the repeat sits at exactly ply 4.
- **A1 / A2:** the row's asserts hold. QE's probe agrees on every point:
  - X sits at prior indices 0 and 4 of 8.
  - The 4 path keys are distinct, and X appears 0 times among them.
  - Depth 4 reads f1e1 +404 with the keys and f1g1 +497 withheld, and the root FEN is unchanged.
  - With X once only, the figure equals the withheld one, so "one does not" holds.
- **A4:** `src/engine.test.ts` only, +45 / −0. The comment ids are ABC-249, ADR-0054 and QE-248-c only.
- **A5:** the row reads 3.98 / 6.81 / 3.75 ms, median **3.98 ms** (budget 100 ms). Nodes are 1 642 + 767.
- **A6 gates:**
  - Lint, typecheck and build: rc 0.
  - `npm test` (head ×3): 2 363 / 2 363, **0 skipped**. Base ×3: 2 362, so the count is base + 1.
  - Skip-integrity and lane-inventory (63 = 63): "No findings."
- **G8** (b h h b b h, 15:32–15:53Z): **H 9.15 s** (9.15 / 9.15 / 9.40), **B 9.45 s** (9.33 / 9.92 / 9.45), H − B −0.30 s.
  - load1 1.54–2.26, Tctl median 73.8 °C. All runs rc 0.
  - **Admissibility:** NFR-008's line (load1 ≤ 8, rc 0) holds for all 6 runs.
  - The ALONE precondition held before runs 1–4 only. The 20-minute wait budget ran out at 15:53:18Z against a foreign vitest from `/home/olger/projects/public/grugops`, which recurred about every 30–60 s and had one long run, pid 1826643.
  - The ALONE-only head runs read 9.15 / 9.15.
  - NFR-008 **MET**, W1 **not triggered**, design target 9.4 s MET. The headroom is 0.85 s.
- **Brittleness** (the brief's question): the move pin carries the signal, and the score pin is AC-compliant but adds churn.
  - 404 is the value of the Ke1 line, which holds no repetition. QDRAW25 (a pre-root draw scored 25) leaves the row green; only the ABC-230 rows catch it.
  - A sign or draw-vs-not-draw assert would be **vacuous** here: the root score is positive in both runs and also under QPLY4.
  - The durable proof is relational: with-keys move ≠ withheld move.
  - Not changed: the row is not a defect.
- **Gaps:**
  - **QE-249-a (LOW, carrier BA/PM):** at depth 6 both runs read f1e1 +494, so the difference rides on the depth-4/5 horizon. A future VALUE change that is re-pinned to equal figures would leave the row green under QPLY4. The remedy is one relational `expect`, or a comment. Route it as a test note on ABC-233, ABC-236, ABC-237 and ABC-238.
  - **QE-249-b (INFO):** decision 3's "exactly 0" below ply 1 is held by no default-lane row. A draw-value mutant that acts only at ply ≥ 4 is likely to survive. Not run: UNKNOWN - verify.
  - **QE-249-c (INFO):** the G8 window was partly not ALONE. The harness `pgrep -f "[/]vitest"` also matches other hops' flock waiter lines, so tighten it in the next harness.
- **Merge validity:** the lane inputs are unchanged from `09d1f675` to `main` `98c6ade3`.
- **Notes** (task `qe-ABC-249`, contextRoot = worktree; 5/5 sealed and read back): verdict `20261101T161512Z-qe-e2e-decision-17ce7d7c`, mutants and probe `…-observation-07762f7e`, G8 `…-observation-4b04d7d2`, gates `…-observation-abc0c345`, gaps `…-observation-66371344`.
- **No process left running.** The scratch files are in `qe-249/`: mutant trees, B/H trees and the harness.

### Trace row (10 cells, header order)

| ABC-249 | A position that stood twice before the root, met four plies into the search, scores 0, so QPLY4 turns the default lane red (test-only, QE-248-c) | EPIC-010 | ADR-0054 decision 3 | NFR-008: G8 H 9.15 s / B 9.45 s ≤ 10 s, load1 ≤ 2.26 (ALONE runs 1–4; runs 5–6 foreign vitest, budget spent); W1 not triggered; row median 3.98 ms | grugops/ABC-249 @ 25371747 (tip dd66bfee): src/engine.test.ts | QE PASS_WITH_GAPS: npm test 2 363 pass ×3, skips 0 (base 2 362); QPLY4 red (row, and whole lane 1 failed, sole killer), production green, QPLY5 green; QE-249-a LOW (relational assert), QE-249-b/c INFO | UAT waived (0 production lines); QE verdict signs | — | QE PASS_WITH_GAPS (branch, not merged; to the Orchestrator for merge routing; QE-249-a to BA/PM) |
