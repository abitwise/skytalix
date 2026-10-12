---
subtask: ticket-to-pr-ABC-095
role: software-engineer
result: partial-stopped
branch: grugops/ABC-095-book-before-engine
tip: 1f205b00
code_commit: 521a8513
finished_at: 2026-10-12T13:04:16Z
---

The decorator is delivered: `src/book-engine.ts` and `src/book-engine.test.ts`. `A1`, `A3`, `A4`, `A5`'s game half and
`A6` are met.

The `src/cli.ts` wiring is stopped. It reds:
- `ABC-042` bar 4 (security: no `node:fs` in `cli.ts`);
- `ABC-043` `A5`/`A7`, `ABC-044` `A3` and `ABC-119` `A1`. The book answers the engine's first ply.

`A7` and `A5`'s stream half are not delivered. `A2` and the miss cost are NOT READ, because the host was never quiet.
Notes: `.grugops/context/ticket-to-pr-ABC-095/notes/` on the branch.
