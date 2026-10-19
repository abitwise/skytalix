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

---

## Result (architect-design, 2026-10-19)

- **Commit:** `1524297a` on `grugops/ABC-146-ladder-verdict` (parent `e68a4327`), in `../wt-ABC-146`. Not pushed or merged.
- **Ruling: yes.** ADR-0038 addendum 2, Decision 5 item 1 now has a dated line (2026-10-19). It reads: run it with `--reporter=verbose`, as `LADDER_DEEP=verdict npx vitest run src/ladder.test.ts --reporter=verbose`, because the default reporter drops a passing test's `console.log` (run 1 `d73c4d6c`, `…75f37904`). The line says a re-take under the staleness rule uses this form. **No decision changes.** It is an output flag only, and route V stands.
- **Pointer, optional, taken:** a second dated line says run 2 used this form and is the route's reading (`…4c1d8e27`, `e68a4327`). Evidence for the form: main's `plans/board.md` records run 2 with `--reporter=verbose`, and `raw/verdict-run2.out.txt` has 180 `LADDER GAME` lines. The meta file does not record the command.
- **Note:** `.grugops/context/abc146-verdict/notes/20261019T084831Z-architect-design-decision-adr0038-add2-reporter-verbose-b7e2c915.md` (decision, hand-authored, `sealed: false`).
- **Fences held:** 2 files changed, +27 lines (the ADR and the note). No test, vitest or timing ran. `src/`, `tools/`, config, `package*`, `AGENTS.md`, board, traceability and `raw/` are untouched.
- **Trace row (for the Orchestrator to apply; not hand-edited here):**
  `| ABC-166 A5 | ADR-0038 addendum 2 item 1: dated line notes `--reporter=verbose` (no decision changes) + pointer to run 2's reading `…4c1d8e27`; Architect/Design `arch-ABC-166-a5` | EPIC-004 | ADR-0038 | NFR-008 / N8-LANE unchanged | records only; `1524297a` on `grugops/ABC-146-ladder-verdict`; 0 lines in src/, tools/, vitest.config.ts, package*.json, AGENTS.md | none run | waiver (0 production lines) | — | decision note `…b7e2c915` |`
