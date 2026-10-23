---
subtask: qe-ABC-197
role: qe-e2e
ticket: plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
ref: .grugops/context/qe-ABC-197/
branch: grugops/ABC-197 (tip 20e397c8; base 051d557a); worktree ../wt-ABC-197 (read only)
inputs: BA/PM re-rule …4df5ef95 (A5 is now 3 probes: QP0, QP6, QP6-2800); SE …3c9e5d2b, …eeec2b5f (open them only after your verdict)
width: 1
---

# QE gate for ABC-197, non-timing part: A1–A5 and A8. A6/A7 go to a later quiet-host timing hop

## Do
- Create your own worktree `../wt-qe-ABC-197` on `grugops/qe-ABC-197` from the tip. Merge the current `main` in first (a merge, not a rebase). Run your own `npm ci --ignore-scripts`.
- Re-read A1–A4 on your own runs, including the node census against 26 000. Then run A5 **as re-ruled**: `gp.mjs` plus the QP6-2800 variant, on the file and on the lane, at base and at tip. Also check the clock rule `time = (⌈G/step⌉ + 1) · step` from the code.
- A8 gates at your merge: lint, typecheck, build; `npm test` + `last-run.json` (61 / 2 019); skip capture → `test-skip-integrity.js`; `UCI_DEEP`. Heap 128 multi-file, 400 one-file. The UAT waiver form must print nothing.
- **No timing claims.**
- Verdict: PASS, PASS_WITH_GAPS or FAIL for A1–A5 and A8, with a gap register (`QE-197-x`). Name A6/A7 as owed.

## Fences
- Work only in `../wt-qe-ABC-197` and `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe197/`. Commit notes plus a `## QE` section on the ABC-197 page in your worktree. No `src/` edits on the tip; no `package*.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `qe-ABC-197`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
