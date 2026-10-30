---
subtask: qe-ABC-235
role: qe-e2e
ticket: ABC-235
ref: .grugops/context/qe-ABC-235/
branch: grugops/ABC-235 @ 6327a3b4 (worktree ../wt-ABC-235; add QE commits on a qe branch from it, grugops/qe-ABC-235)
width: ALONE for the timing reads (no other CPU-heavy work; qe-ABC-225 is held behind this)
---

# QE ABC-235: verify value-identity and read the timing gates

## Read
- ABC-235 (A1–A5, the gates); the Architect's design `arch-ABC-235/…7fc1b90c`, `…eebca902`; SE notes `se-ABC-235/…e64c9f42`,
  `…ebba6a59`, `…67655916`, `…cf540c21` and its `raw/` harness; Orchestrator review `orch-2026-10-29g/…(22:07Z decision)`;
  EPIC-010 § The merge rule (S2: value-identical, no smoke); the G-gate table and the G6 rule in EPIC-008/010.

## Do
- PREREG first (sealed): which G2 read binds (the Architect recommends warm cache, with cold as INFO), the A3 boards
  and the bar, G6's 5 interleaved runs, and the A1 re-run.
- Re-run A1 at the tip with the SE's harness, independently (base = merge-base `a37f1d87`). Rule on the unpruned doors
  being read at depth 2 instead of 5: is that acceptable, or is a narrower depth-5 sample owed?
- A3: interleaved nps, base vs tip, on the three boards. G2 binding read. G6: 5 interleaved runs per board, median
  ≥ base, any run below depth 6 fails. Load1 recorded per run, only when `pgrep -x cutechess-cli` is empty.
- Re-run the gates (lint, typecheck, `npm test`, build, deep lanes, perft). Test integrity: skips 0.
- Verdict: PASS / PASS_WITH_GAPS / FAIL. If PASS, say "mergeable as value-identical (S2)".

## Fences
- Work in the ABC-235 worktree or your qe branch from it, plus your scratchpad. No `src/` edits: a defect means STOP
  and report. Never push, force, amend or rebase. Never merge into main. No board edits. No host paths.
- **Linters and tests only via `npm run …` or `./node_modules/.bin/<tool>`; never a bare `npx <name>`.** No games.

## Publish
- Seal notes (task `qe-ABC-235`) with `at` from `date -u`: PREREG, the readings, the verdict. Commit on your qe branch.
  Write `## Result` plus a 10-cell trace row into this brief, then move it and its claim.md to done/.

## Result

**2026-10-30, QE/E2E. Verdict PASS: mergeable as value-identical (S2). Under Test note 2, this verdict signs UAT.**
- **Branch.** `grugops/qe-ABC-235` @ `1cf9ee98`, from `grugops/ABC-235` `6327a3b4`; worktree `../wt-qe-ABC-235`.
  Not merged, nothing pushed, no `src` edit, no game.
- **One run** (`…4c3f7639`), pre-registered in `…078c1c09`, sealed in `c9958194` before any timed run.
- **Notes.** Decision `…078c1c09` (PREREG); observations `…685401a0` (timing), `…fc0f28a0` (A1 and the ruling) and
  `…25a52812` (gates); decision `…c575d703` (verdict).

**A1 MET.** 6 021 rows, base `a37f1d87` = tip byte for byte, 0 impure.
- The rows are the SE's own: laid out as 8 shards, they hash to `812f86ae…bd000`, in full.
- The tip's pawn memo had a different history per process in this run, and the rows did not change.

**Ruling on the unpruned doors: depth 2 is ACCEPTABLE, and no narrower depth-5 sample is owed.**
- The doors' code is unchanged (the diff of `search.ts`, `engine.ts` and `quiescence.ts` is empty).
- The eight other search functions are node-equal at depth 5.
- QE ran a depth-5 sample anyway: 132 endgame and `position-3` positions, 264 rows, byte-equal.

**The timing session** ran 22:13–22:21Z, one process at a time. load1 was 1.1–3.6, with 0 `cutechess-cli` and 0
foreign vitest at every check.
- **G2 MET.** Tip 310.4 / 311.3 ns against base 455.7 / 451.0 ns, read warm, the instrument as it stands. Cold INFO:
  622.0 against 626.4 ns.
- **G6 MET.** kiwipete 8 = 8, position-6 10 = 10, minimum 8, no WARN.
- **A3 MET.** nps tip/base: kiwipete 1.262, position-6 1.284, start 1.200.
- **Per cut**, against the commit before, every cut is ≥ 1.06 on every board. No cut is dropped.

**Gates.**
- lint, typecheck and build exit 0. `npm test` 2 139/2 139, skips 0, `No findings.`
- 17 deep lanes, 621 tests, all green.
- Perft counts are equal to base, and `PERFT_DEEP` is 32/32.
- G1 54/58, with every row equal to base. G5 ≤ 3 002.5 ms. G7 green. G8 8.71 s. G9 is an empty diff.

**LOW observations, none a gap.**
- QE-235-a: the SE's note does not name the shard count.
- QE-235-b: host load1 2–3.6, from other sessions.
- QE-235-c: the CLI, UCI, LADDER, INPUT and ZOBRIST deep lanes were not run.
- QE-235-d: a first deep-lane pass without the heap flag was refused at setup, and no test ran.
- `OD-235-1` stays the Orchestrator's owner INFO. Cut 1 cleared its bar.

**Publishing.** `propose_note` is not exposed in this session. Notes went through the plugin's own `handleProposeNote`
→ `context-io` `admitAndAppend`, the sanctioned writer, with the root set to the QE worktree. 5/5 were admitted, and
`readContext` reads back 5.

**STOP:** none.

### Trace row (10 cells, header order)

| ABC-235 (qe-ABC-235) | QE PASS at 6327a3b4: A1–A5 MET; A1 6 021 rows base = tip (rows = SE's 812f86ae…); unpruned doors depth 2 ACCEPTABLE + depth-5 sample 264 rows equal; A3 nps 1.262 / 1.284 / 1.200; per cut ≥ 1.06 on every board | EPIC-010 | value-identical cost per node (cuts 1, 3, 5) | NFR-005 G6 MET (8 = 8, 10 = 10, min 8); G2 310.4/311.3 v 455.7/451.0 ns (cold INFO 622.0 v 626.4); NFR-001 perft counts equal, 10.30 M/s; NFR-004 G5 ≤ 3 002.5 ms; NFR-008 G8 8.71 s; NFR-009 G7 green (+384 KiB) | grugops/qe-ABC-235 @ 1cf9ee98 (on grugops/ABC-235 6327a3b4; code f9576af3) | npm test 63 files 2 139/2 139, skips 0; deep lanes 17 files 621/621; PERFT_DEEP 32/32; G1 54/58 rows equal; .grugops/context/qe-ABC-235/notes/ | signed (QE verdict, S2) | — | In Review → ready for the Orchestrator's merge (S2) |
