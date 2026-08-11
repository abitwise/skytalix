---
task: abc017-review-2026-08-12
subtask: refinement-ABC-017-a3
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-ABC-017-a3/
parent_ref: .grugops/context/abc017-review-2026-08-12/
enqueued_by: orchestrator
enqueued_at: 2026-08-12T03:15:00Z
branch: grugops/ABC-017-history-pane
worktree: ../cli-chess-ABC-017
---

# Subtask: rule `ABC-017`'s vacuous `A3` clause, and check its siblings for the same shape

`ABC-017` is built and green — `A1`–`A12` met, `A13` met in part, **17 wrong builds and zero
survivors**. It sits in `In Review`. QE is deliberately **not** running until you rule, on this
round's established pattern: a mutant net built against a criterion about to move is discarded work.

Read `parent_ref:` first, then the Engineer's six notes in
`.grugops/context/ticket-to-pr-ABC-017-dev/notes/`, then `A3` (around line 322) in
`plans/tickets/ABC-017-bounded-move-history-pane.md`, then `ADR-0009` and `ADR-0010` — **both
accepted, neither to be re-opened.**

## The defect

`A3`'s last clause reads: *"the pane contains **neither** `e4 e5` **nor** `Nf3 Nc6`"*.

**Measured on the delivered pane at 3 plies — which DOES contain both moves — the literal test
returns `false`.** Padded cells are never separated by a single space, so **no layout satisfying `A2`
and `A3` can ever contain those literals. The clause cannot fail.** The row list and the ordered move
numbers are what actually bind.

The Engineer suggested wording it in terms of move numbers, like `A5`, and **did not amend it**.
Judge that suggestion; do not simply adopt it.

## The shape to hunt, because it has appeared four times this round

A check that **cannot fail** because something else fails first, or because it tests a string the
format can never produce:

- `ABC-016`'s `A13` demanded a count no correct build could reach.
- `ABC-016`'s `A7` width clause could not fail on the build it was written for.
- `ABC-016`'s `A9` could not fail on an inferring panel.
- `ABC-017`'s own `A13` had two assertions in one `it`, so the tripwire asserted first and the
  requirement was **never evaluated** — the Engineer caught that with a mutant and split it.

**Check `A1`–`A12` for the same shape.** This ticket's criteria have not yet had a QE pass, and every
QE pass this round has found gaps the previous hops missed.

## Also in scope

- **`A13`'s remainder is a re-gate obligation**, not a gap: importing `STATUS_ROWS` today is `TS2307`
  and would red the project-wide blocking typecheck gate — the exact cost `ADR-0009` refused. Two
  edits are owed at the rebase and are named in a docblock at the constant's site. **Confirm that
  disposition is right and that the obligation is recorded where a rebase hop will find it.**
- **`src/history.ts` now has two *test* runtime importers**, not one (`A7` requires `takeBack` by
  name). The production claim of zero is unchanged and now asserted in-suite. Decide whether the
  ticket's dependency text should say so.
- Re-derive size (`S`) and priority (`P2`); say if either moves.

## Scope limits

- Say explicitly whether your ruling needs the Engineer. Wording only → `ABC-017` stays in
  `In Review` and goes to QE. A test change → back to `In Development`, which is legitimate.
- Do NOT edit `src/`. Do NOT edit `ABC-016`, `ABC-019` or `ABC-027` — agents are live on two.
- Do NOT write `plans/board.md` — the Orchestrator's.
- Do NOT re-open `ADR-0009` or `ADR-0010`; do NOT add a constant-frame-width criterion.
- **Do NOT propose widening `HISTORY_COLS` to 24.** The Engineer held it at 21 deliberately: 24
  **masks** the status panel's width swing (0/20 stale frames at 24 vs 8/20 at 21), and that defect
  belongs to `ABC-027`.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## Working rules

Work in `../cli-chess-ABC-017` on branch `grugops/ABC-017-history-pane`, rebased onto current `main`
and re-gated green by the Orchestrator (**697/697 on 24 files**) — verify yourself.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist here and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`.** Claim per
Workflow 17 (atomic `mkdir`; **the `claimed/` parent has been absent four times — create it first**).

Report: the exact replacement wording for `A3`, any sibling criteria with the same shape, your
disposition of `A13`'s re-gate obligation and the importer count, size/priority, and your board move.
