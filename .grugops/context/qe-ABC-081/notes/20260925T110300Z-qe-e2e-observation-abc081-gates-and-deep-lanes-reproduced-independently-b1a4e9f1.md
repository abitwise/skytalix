---
id: 20260925T110300Z-qe-e2e-observation-abc081-gates-and-deep-lanes-reproduced-independently-b1a4e9f1
kind: observation
by: qe-e2e
at: 2026-09-25T11:03:00Z
verified_by:
confidence: high
refs:
  - ABC-081
  - ABC-080
  - ABC-078
  - NFR-005
  - NFR-009
  - src/transposition.ts
  - src/search.ts
  - src/engine.ts
supersedes:
---

# ABC-081 QE: every gate and every deep lane the build claimed, reproduced independently, at `504f046`

Hand-authored per `agent-factory/contracts/context-note.md`. No `seal` — the degraded posture
`AGENTS.md` records (`scripts/context-io.ts` / `mcp__grugops__propose_note` absent from this
install); not re-derived here. Run at the QE worktree, branch `grugops/qe-ABC-081` @ `46dd936`,
base `grugops/ABC-081-transposition-table` @ `504f046`. `git status --porcelain -- src` empty
before, during (asserted after every mutant, see the sibling mutant note) and after this hop.

**Mandatory gates:**
- `npm run lint` — 81 files clean.
- `npm run typecheck` (= `npm run build`, same `tsc --noEmit`) — exit 0.
- `npm test` — **45 files / 1 444 passed / 0 skipped.** Matches the build's own reading exactly.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` — `No findings.`

**Deep lanes, re-run in full, not sampled:**
- `SEARCH_DEEP=1 npx vitest run src/transposition.test.ts` — **40/40, 46.9 s.** Every figure in
  the build's `A1`–`A5` table reproduced to the number: `A2` kiwipete 15.95% / position-6 15.38%
  (fixed depth 5), `A3` kiwipete 63.94% / position-6 49.90%, `A4`'s engine-level `chooseMove(160
  ticks)` depth-10 case, `A5`'s two repetition fixtures. `A1`'s `G6` (`ADR-0006` `knight-g1`
  pair, `w K` 830 / `w -` 820, keys differ) is in the DEFAULT lane and reproduced there too
  (`npx vitest run src/transposition.test.ts -t "G6"`, 3/3).
- `ENGINE_DEEP=1 npx vitest run src/transposition.test.ts src/engine.test.ts` — **26/26 + 33/33.**
  `A7`/`NFR-009`: kiwipete 1 s (depth 5) heapUsed 7.91 MiB / arrayBuffers 4.01 MiB → 3 s (depth 6)
  7.92 MiB / 4.01 MiB — both well inside `NFR-009`'s ≤ 1 MiB growth and ≤ 16 MiB total. `engine.
  test.ts`'s own `NFR-005` case: kiwipete depth 5, 131 850 nodes, 3 010 ms; position-6 depth 5,
  149 790 nodes, 3 015 ms — matches the build's reading (126 730 / 3 007 ms and 142 622 / 3 027 ms
  at `318c11a`, close enough given load and the vitest-runner shape is unchanged).

**`NFR-005` under plain node, independently measured** (own script, not the build's; `now:
Date.now`, `budgetMs: 3000`, kiwipete and `position-6` FENs from `search.test.ts`): **depth 6 / 6,
892 682 / 853 278 nodes, 3 001 / 3 006 ms wall.** Confirms the build's plain-node reading is
reproducible on this machine, right now, independent of the build's own harness. Reported here,
not ruled — the plain-node-vs-vitest question stays the owner's, per this subtask's fence.

**`A6`:** `grep -n "^import" src/search.ts src/engine.ts src/transposition.ts src/quiescence.ts |
grep -i history` — no hits. `git diff --name-only 6033d05..504f046 -- src/history.ts src/legal.ts
src/turn-loop.ts` — empty (`A8`, byte-identical, confirmed independently).

**Game-level smoke test (`npm run chess`, not in the build's own notes):** `printf 'e4\nd4\n
resign\n' | npx tsx src/cli.ts --colour white` — exit 0, two human plies and two engine plies
played (`1. e4 Nc6 2. d4 d5`), clean resignation ending, no crash, no hang. The table does not
break the CLI's game loop. A scripted SESSION-level fivefold-repetition game was **not**
additionally constructed — out of this ticket's own scope (test note 4: "do not test the
session's threefold rule here") and `A8` already shows `src/gameend.ts`/`src/history.ts`/
`src/turn-loop.ts` untouched, so that consumer is unaffected by this diff by construction, not
merely by inspection.
