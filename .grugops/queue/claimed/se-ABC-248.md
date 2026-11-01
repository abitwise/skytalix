---
subtask: se-ABC-248
role: software-engineer
ticket: ABC-248
ref: .grugops/context/se-ABC-248/
branch: new grugops/ABC-248 from main (worktree .claude/worktrees/se-ABC-248)
width: ALONE (no other hop runs). Record load1 and foreign processes with any timing. Leave no process running.
---
# SE ABC-248 (S, P1, test-only): ADR-0046 tranche 2 — T2c + T2a (narrow) + T2d; the default lane sheds ~0.3 s, no coverage lost
## Read
- The ticket page plans/tickets/ABC-248-*.md in full: Scope table, Out of scope, BA/PM ruling conditions 1–5, acceptance, Test notes. Line numbers there are as read at 209f4c5f; re-read them at main.
- ADR-0046 § Addendum 2026-10-31 (T2-R) and § BA/PM ruling 2026-10-31; ABC-244's page (conditions 1–3, step rule); ABC-177 A6 (M01–M11).
- Carried to this ticket: QE-244-a (the R4 re-run of the CLI ABC-241 A4/A7 mutant check, if any step, LEVELS[5].budgetMs or NODES_PER_CLOCK_CHECK moves; this ticket fences those rows out, so confirm none moves) and QE-245-b (see the ABC-245 page CLOSED block).
## Do
- Freeze the mutant list (incl. WRONGSIDE) in a committed PREREG before any head run.
- Each lever with its own evidence, separately revertible: T2c-a, T2c-b (non-vacuity and plant parity), T2a narrow (default-lane kill parity; a sole killer stays), T2d (step by kill-set parity; census of at most two more rows).
- Gates via `npm run …`; npm test green, 0 skips; skip-integrity and lane inventory clean; ENGINE_DEEP=1 run of the moved describes passes. One informal G8 read (head vs main) with load1; QE owns the gate (W1).
- A lever that fails its condition stays as it is: record it, do not force it. A STOP if the page's conditions cannot be met as written.
## Fences
- Only src/search.null-move.test.ts and src/uci-session.test.ts. Shared helpers byte-identical. No production line, no vitest.config.ts, package.json, AGENTS.md, tools/, data/. No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec.
- Waiting: `kill -0 <pid>` or poll a file; never `while pgrep -f`; never vitest on the same command line as a wait. Thermal stop: Tctl median > 85 °C.
- Scratch `se-248/`.
## Publish
Sealed notes (task `se-ABC-248`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
