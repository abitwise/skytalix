---
subtask: arch-ABC-166-a5
role: architect-design
ticket: ABC-166
branch: grugops/ABC-146-ladder-verdict @ e68a4327
worktree: ../wt-ABC-146
ref: .grugops/context/abc146-verdict/
---

# ABC-166 A5: one records-only decision in ADR-0038 addendum 2

ABC-166 run 2 is complete and has been read. See `.grugops/context/abc146-verdict/notes/…4c1d8e27` and ABC-146 § "A5 reading, 2026-10-19". Run 1 used the command from ADR-0038 addendum 2, item 1. It passed, but it printed no score lines, because vitest's default reporter drops `console.log`. Run 2 added `--reporter=verbose`.

## The decision
Rule whether addendum 2's item 1 command needs `--reporter=verbose` noted. BA/PM recommends yes, as a dated line. Without it, a re-take under the staleness rule would repeat run 1.
- If yes, add one dated line to `memory-bank/50-decisions/ADR-0038-*.md` on this branch. Do not change any decision.
- Optionally, add one dated pointer to run 2's reading, as evidence that the addendum route was executed.

## Fences
- **Records only.** Do not run vitest or any test, and take no timing readings: a Security/NFR hop may be reading N8-LANE in a quiet window.
- Do not touch `src/`, `tools/`, `vitest.config.ts`, `package.json`, `package-lock.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`.
- Do not touch the `raw/` files.
- Commit only on `grugops/ABC-146-ladder-verdict`, in `../wt-ABC-146`.
- Never push. Never merge.

## Publish
- Write one hand-authored, unsealed `decision` note under `ref:notes/` on the branch.
- Write `.grugops/queue/done/arch-ABC-166-a5.md` and `.claim.md` in main's working tree, uncommitted. Include the commit, the ruling and a trace row.
