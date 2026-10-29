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
