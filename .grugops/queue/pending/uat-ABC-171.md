---
task: uat-ABC-171
subtask: uat-ABC-171
role: qe-e2e
workflow: agent-factory/workflows/06-uat-pack.md
ticket: plans/tickets/ABC-171-the-uci-session-offers-ownbook-and-skill-level.md
ref: .grugops/context/uat-ABC-171/
branch: grugops/uat-ABC-171
base: grugops/ABC-171 @ 5dee231c
---

# Subtask: QE goes over ABC-171's UAT items (OwnBook + Skill Level over UCI)

The owner chose QE to run this UAT (`…2b7f4c88`). Follow the `uat-ABC-167` precedent (`.grugops/context/uat-ABC-167/`), including its harness shape, a GUI in the seat of `createUciSession` / `handleLine`.
- **Do not run** the UAT Planner or BA/PM hops.
- **The waiver does not apply.** `src/uci-session.ts` is +97/−15 against main.
- **The owner's word signs.** Your result does not.

## Read first
- `AGENTS.md` § Test and UAT authority.
- The ticket page, A1–A13d.
- ADR-0044 D10 and D11.
- The notes from `qe-ABC-171`, `qe2-ABC-171` and `secnfr-ABC-171`.
- ADR-0045. It is accepted, but **not built here**. Its re-cut levels arrive with ABC-174, so today's `LEVELS` still apply: 1 = 100 ms / 0.4, 2 = 500 / 0.2, 3 = 3000 / 0, 4 = 4000 / 0, 5 = 4500 / 0. Default is 3.

## Scenarios: what a GUI user gets
1. `uci` shows the `OwnBook` and `Skill Level` option lines.
2. `setoption` with valid and invalid values. Both options are case-insensitive by name, and each value rule holds.
3. Book on: start-position games answer from the book, the book is read once, and the game continues out of the book with legal moves.
4. Book off: the engine searches and never reads the book.
5. A bad or throwing book gives one warning, and the game is still played legally.
6. Skill Level 1–5. Each level's budget, read from the `info` line on a virtual clock. A blunder level gives a deterministic sequence per seed. Levels 1 and 2 ignore `depth`, `nodes` and `mate`, and say so in one line.
7. `go infinite` on a book hit holds until `stop`.
8. `ucinewgame` draws no seeds.
9. A full game at level 1, and one at level 3, against a scripted opponent, with legal moves throughout.
10. ABC-167's behaviour is unchanged. Re-run its 13 UAT scenarios as a regression check.

## Not observable until ABC-168
- The real `skytalix` binary and stdio.
- A real GUI.
- Real time.
- The `warn` → `info string` binding (QE-171-e).

## Not observable until ABC-174
- The re-cut level table, and default 5.

## Clock and timing
- Use the virtual clock only.
- Take **no** timing readings.
- N8-LANE stays OWED (R-171-1 is accepted).

## Also
- Run the gates at the tip.
- Run `merge-tree` against main.

## Fences
- Work in `git worktree add ../wt-uat-ABC-171 -b grugops/uat-ABC-171 5dee231c`.
- Do not touch:
  - `../wt-ABC-171`
  - `../wt-ABC-173`
  - `src/`
  - `plans/board.md`
  - `plans/traceability.md`
  - `AGENTS.md`
  - `package.json`
  - `vitest.config.ts`
  - any process you did not start
- Do not fix defects.
- Never merge, push or self-sign.
- Do not commit `uat/*.uat.spec.ts`.

## Publish
- Commit on the branch:
  - notes, including a `kind: decision` note by `qe-e2e`;
  - the UAT pack: scenarios, test data, pass/fail criteria, limitations, and a one-word signoff checklist for the owner.
- Write `.grugops/queue/done/uat-ABC-171.md` and `.claim.md` in main's working tree, uncommitted. Include the result, commit, gates, checklist and a trace row.
