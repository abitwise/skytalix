---
task: abc016-review3-2026-08-11
subtask: refinement-ABC-016-a13-ply0
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-ABC-016-a13-ply0/
parent_ref: .grugops/context/abc016-review3-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T22:15:00Z
branch: grugops/ABC-016-status-panel
worktree: ../cli-chess-ABC-016
---

# Subtask: rule `A13`'s ply-0 ambiguity — a defect inside your own last ruling

**This is the last known open item on `ABC-016`'s criteria, and `ABC-016` merges FIRST of four.**
After this: a Security/NFR gate, then merge.

Read `parent_ref:` first, then the Engineer's `claim` note in
`.grugops/context/ticket-to-pr-ABC-016-qegaps/notes/` — **it carries the full account and a
counter-reading you should engage with, not just accept** — then `A13` in
`plans/tickets/ABC-016-status-panel.md`, then your own prior ruling notes in
`.grugops/context/refinement-ABC-016-qe-gaps/notes/`.

## The ambiguity

You ruled `A13`'s scan clause **ply-independent**: `64 + occupied squares of initialFen`. The
Engineer found it is **false at ply 0**, where there is no replay and the count is 64 — not
`64 + occupied`.

**Implementing the criterion literally silently deletes delivered coverage.** The Engineer measured
the cost rather than asserting it: a build paying a pointless `parseFen` before the first move
**passes all 29 acceptance and snapshot tests** and is caught **only** by the assertion the literal
reading would have removed. That is `A13`'s own class of defect — the class this criterion exists
to catch.

It **retained the assertion as a separate named test and flagged without amending**, which is the
correct boundary and why this hop exists.

## What to decide

1. The exact wording that makes the clause true at **every** depth including 0 — or, if a
   depth-dependent form is the honest answer, say so and write it.
2. Whether the retained separate test stays as-is, folds into `A13`, or becomes its own criterion.
3. Whether anything you ruled last hop shares the same shape and should be re-checked. **You have now
   twice ruled something on this ticket that a later hop had to correct** (`A13`'s original
   unsatisfiable clause, and this). That is not a reprimand — both corrections came from your own
   instruction to test rather than inherit — but it is a reason to look once more.

## Scope

- Re-derive size (`M`) and priority (`P1`); say if either moves.
- **Say explicitly whether this needs the Engineer.** If it is wording only, `ABC-016` stays in
  `In Review` and goes to Security/NFR next. If it needs a test change, it returns to
  `In Development` — legitimate.
- Do NOT edit `src/`. Do NOT edit `ABC-017`, `ABC-019` or `ABC-027` — agents are live on two.
- Do NOT write `plans/board.md` — the Orchestrator's.
- Do NOT re-open `ADR-0009` or `ADR-0010`, and do NOT add a constant-frame-width criterion.

## Working rules

- Work in `../cli-chess-ABC-016` on branch `grugops/ABC-016-status-panel`, rebased onto current `main`
  and re-gated by the Orchestrator (**711/711 on 24 files**) — verify yourself.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist here and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`.** Claim per
Workflow 17 (atomic `mkdir`; create the `claimed/` parent if missing).
