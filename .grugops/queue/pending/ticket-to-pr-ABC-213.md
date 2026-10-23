---
subtask: ticket-to-pr-ABC-213
role: software-engineer
ticket: plans/tickets/ABC-213-a-failed-pgn-save-reports-its-first-error-code-even-when-the-cleanup-also-fails-and-leaves-no-partial-file.md
ref: .grugops/context/ticket-to-pr-ABC-213/
width: 2 of 3 (beside arch-rule-ABC-205-stop)
---

# Build ABC-213: guard the PGN cleanup unlink; pin no-partial-file and the double fault

## Do
- Worktree `../wt-ABC-213` on `grugops/ABC-213` from `main`, own `npm ci --ignore-scripts`.
- Build exactly to the page's `## Design ruling`: guard in `src/pgn-file.ts` (first code reported, non-errno rethrown), rig (b′) — one hoisted pass-through `vi.mock("node:fs")` in the existing `src/pgn.test.ts` with the canary row, the armed/unarmed rules, rows A1–A3; red-first on base; plants X1/X3/X4/X5. `cli.ts`/`pgn.ts` byte-identical; writer child byte-identical; 0 spawns.
- Gates: lint, typecheck, build; `npm test` + `last-run.json`; skips; `CLI_DEEP`. No timing. Any other red → STOP to Architect.

## Fences
- Only `src/pgn-file.ts` and `src/pgn.test.ts`. No ADRs, board/trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se213/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `ticket-to-pr-ABC-213`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
