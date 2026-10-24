---
subtask: qe-lane-ABC-212
role: qe-e2e
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/qe-lane-ABC-212/
branch: new grugops/qe-lane-ABC-212 from grugops/se-lane-ABC-212 (814b92a0), worktree ../wt-qe-lane-ABC-212
width: 1 of 3 (only hop running; no real-clock timing)
---

# QE short re-check: ABC-212 lane-cost fix (A9 + A12)

## Do
- Read SE `se-lane-ABC-212/…a6f0ce67` + `…fcbbf321` and Orchestrator `security-nfr-ABC-212/…550e067d`.
- Rule whether the 6 rows moved to A12's budget-read arm still carry A9's acceptance (SE's open question: `movetime 60000`, `wtime`, level-6 bare `go` now check only the budget handed to the engine). Re-run load-bearing plants yourself (at least P1, P2, one level-6 and one rate plant), and confirm the call-through `vi.mock` is restored and does not leak into other rows of the file.
- Confirm only `src/uci-session.test.ts` changed vs `2079e0df`, and every changed line sits in ABC-212's own A9 block (A13).
- Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips, `UCI_DEEP`. No ENGINE_DEEP, no real-clock timing; the earlier qe-ABC-212 readings stand.
- Verdict PASS / PASS_WITH_GAPS / FAIL.

## Fences
- Only your worktree and `<scratchpad>/qe212lane/`. No `src/` edits. Never push, force, amend or rebase; never merge into main; no board edits. Records: no hostnames, IPs, or personal paths.

## Publish
- Commit on your branch. Seal notes (task qe-lane-ABC-212). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**`PASS_WITH_GAPS`** (no blocking gap). Branch `grugops/qe-lane-ABC-212` in `../wt-qe-lane-ABC-212`, from `814b92a0`, own `npm ci --ignore-scripts`, Node v26.11.1. **Tip `ffb71bb1`** (notes and raw only). Not pushed, not merged. No `src/` edit. No ENGINE_DEEP and no real-clock timing; the earlier `qe-ABC-212` readings stand.

- **A9 ruling: the budget-read rows are sufficient** for `movetime 60000`, `wtime` and the level-6 bare `go`. It holds by composition:
  - the hand-off per shape is read exactly (one call, `{ budgetMs: G }`, no limits, 0 seeds, `bestmove` from the answer);
  - `chooseMove` takes only `budgetMs`, `now` and the limits, and `now` is the one session clock on every shape;
  - `movetime 60000` and `wtime` at 7 make the identical call that the kept bare `go` at 7 searches on the virtual clock;
  - the engine's deadline is linear in the budget.
  - QE also re-ran A9's base search-form rows (`2079e0df`) on this tree (production code identical): **9/9 green**.
- **Plants** (scratch `git archive` copies, whole file, control 137/137):
  - SE plants re-run: P1 5 red, P2 3, L6 (level 6) 1, L7rate (rate) 7, P3 5, the SE's counts exactly.
  - QE's own: Q1 (session clock dropped on `movetime` only) **0 red**, which is QE-212L-a. Q2 (guard removed) 1 red, Q3 (`mockClear`) 1 red.
- **Mock leak:** with the guard, 137/137 in the default order and in 5 shuffled orders (seeds 1–5). Without it, 7–14 red in shuffled orders, mostly outside the block. `mockReset` restores the call-through, and nothing leaks.
- **Scope / A13:** only `src/uci-session.test.ts` changed vs `2079e0df` (0 production files, 0 new files, 0 spawns). Every changed `expect(` line is inside the A9 block (1003–1116). Three harness hunks sit at the top of the file (imports and the module-level `vi.mock`, lines 8, 11, 22–28). They are not pins, which is QE-212L-b.
- **Gates at `814b92a0`:**
  - lint 0 (125 files), typecheck 0, build 0;
  - `npm test` 62 files 2 066/2 066, `last-run.json` `success: true`, pending 0, todo 0;
  - skips 0, `No findings.`;
  - `UCI_DEEP` 5/5.
  - Vitest's Duration 8.46 s is one gate run, not a reading.
- **Findings:**
  - QE-212L-a **LOW**: the stub does not assert `options.now`, so a shape-specific clock-wiring defect reds no row. The blind spot comes from the instrument; `ABC-167`'s `movetime` rows are blind too. The fix is test-only: the stub asserts the rig's clock. Not blocking.
  - QE-212L-b **INFO**: the file-top harness lines.
  - QE-212L-c **INFO**: in the default order the leak guard has one sentinel, the `go depth 3 at 7` row.
- **Notes** (sealed by grugops 2.1.0 `admitAndAppend`, read back 3/3 OK, index rendered): `.grugops/context/qe-lane-ABC-212/notes/` observations `20261024T131745Z-qe-e2e-observation-628c929d` (plants, probes) and `…716b9d48` (gates, scope), decision `20261024T131847Z-qe-e2e-decision-db746b16`. Raw `plants.txt`, `gates.txt`. Scratch `<scratchpad>/qe212lane/`.
- **Owed:**
  - the Orchestrator's merge with the `NFR-008` sentinel re-read (`…550e067d`);
  - QE-212L-a's one-line strengthening, if the Orchestrator routes it.

### Trace row (10 cells, header order)

| ABC-212 (qe-lane-ABC-212) | levels 6 (5 s) and 7 (30 s), rate 0, at every surface; default stays 5 — QE re-check of the AR-212-LANE fix: budget-read A9 rows rule SUFFICIENT; A9, A12, A13 MET | EPIC-004 | — | NFR-008 (sentinel re-read owed at merge); A12 § Amendment 2026-10-24 item 2; QE-212L-a LOW, -b/-c INFO | grugops/qe-lane-ABC-212 @ ffb71bb1 (on 814b92a0, test 8c1d0e6c)<br>src/uci-session.test.ts (unchanged by QE); .grugops/context/qe-lane-ABC-212/ | lint/typecheck/build 0; npm test 62/2066 success (pending 0, todo 0); skips 0 No findings.; UCI_DEEP 5/5; plants P1 5, P2 3, L6 1, L7rate 7, P3 5 red; leak probe 137/137 × 6 orders; A9 search form 9/9 on this tree | signed by QE verdict (qe-ABC-212 …e58d4635 stands; this hop PASS_WITH_GAPS …db746b16, no blocking gap) | — | In Development → merge with sentinel re-read (Orchestrator) |
