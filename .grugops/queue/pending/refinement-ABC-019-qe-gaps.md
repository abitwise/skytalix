---
task: abc019-qe-gaps-2026-08-11
subtask: refinement-ABC-019-qe-gaps
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-ABC-019-qe-gaps/
parent_ref: .grugops/context/abc019-qe-gaps-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T18:30:00Z
branch: grugops/ABC-019-turn-loop-skeleton
worktree: ../cli-chess-ABC-019
---

# Subtask: rule `ABC-019`'s eight QE criterion gaps **and** `ADR-0010`'s owed criterion, in ONE hop

QE returned **PASS_WITH_RISKS: all 23 criteria hold as written, zero code defects, nine survivors** —
eight criterion gaps (yours) and one test gap (`G-7`, the Engineer's, which follows your ruling).
The ticket is **held in `In Review`**; QE did not request a backward move because nothing here
changes code.

Read `parent_ref:` first, then QE's three notes in
`.grugops/context/quality-gate-ABC-019-qe/notes/`, then
`plans/tickets/ABC-019-turn-loop-skeleton.md`, then
`memory-bank/50-decisions/ADR-0010-frame-width-stability-ownership.md` (accepted; do not re-open).

## Why this is ONE hop and not two

`ADR-0010` owes this ticket a criterion **and a prohibition**, and I am deliberately merging that
into this hop rather than running it separately. `G-6` and the narrowing criterion **both touch
`## Scope`'s transitions**, and splitting them invites a second contradiction of exactly `G-5`'s
shape — which is a contradiction *inside a single amendment*. Rule them together.

## The eight, as QE reported them — verify before accepting any

- **`G-2` — the sharpest, and confirmed by three independent instruments.** The prompt-driven
  `game-over` branch has **no criterion and no fixture**. Mutants `Q5`/`Q5b` plus a v8 coverage run
  whose **only** uncovered lines in the whole module are `src/turn-loop.ts:240-241`. `Q5b` reports
  that branch as end-of-input — **byte-identical to `A8`, the exact failure `A9b`(iii) forbids on the
  throw path**, reappearing on a path nobody covered.
- **`G-4`** — `A10` guards the **engine** seam only, so the delivered loop **plays a foreign move
  from the input seam and corrupts the board**. Classed a criterion gap, not a code defect, because
  no criterion asks the loop to guard that seam. **Decide whether it should.**
- **`G-5`** — `[D32]` and `[D35]` contradict each other **inside the same amendment**: no row starts
  terminal, so **`A3b`'s `+1` has no witness**. That is the clause you re-derived two hops ago.
- **`G-6`** — `## Scope` transition 15 requires what `A2` + rows 12/13 forbid. **QE says this must be
  ruled before anything inherits it.** Treat it as the ordering constraint on your own hop.
- **`G-1`** — a rejection line persists to the end of the game when `messages = []` is deleted; `A5`
  asserts only that it *arrives*.
- **`G-3`** — `A9b` bounds the **caller**, not the **player**: rendering the mid-mutation board and a
  false `input ended` notice both survive.
- **`G-8`** — the `board` command's message items reach no assertion.
- **`G-9`** — `A19`(c) cannot fire against either `A18` shape. Already declared in the ticket;
  confirm the declaration is still the right disposition.

## From `ADR-0010`, owed and now due

1. **One new criterion**: over a game containing a narrowing, the screen after every redraw equals
   the frame. **It depends on `ABC-027`**, which is now cut, gated and **in development** — so write
   it, and state plainly that it cannot be *satisfied* until `ABC-027` merges. Merge order is
   `ABC-016` → `ABC-027` → `ABC-017` → `ABC-019`, so `ABC-027` lands well before this ticket.
2. **One PROHIBITION**: no constant-frame-width criterion. `W` varies **by design**, so such a
   criterion would fail the **correct** build. Write the prohibition into the ticket so the next
   reader cannot re-invent it.

## Scope

- Re-derive size (`L`) and priority (`P0`); say if either moves. `XL` is `SPLIT_REQUIRED`.
- Say explicitly which rulings need the Engineer. `G-7` already does (test-only). If any of the
  eight require production code, that returns the ticket to `In Development` — legitimate.
- Do NOT edit `src/`. Do NOT edit `ABC-016`, `ABC-017` or `ABC-027` — agents are live on two of them.
- Do NOT write `plans/board.md` — the Orchestrator's. **Its stale `blocked-until`/`merge-order` text
  was fixed this hop**, so you need not re-flag it.
- Do NOT re-open `ADR-0009` or `ADR-0010`.

## Working rules

- Work in `../cli-chess-ABC-019` on branch `grugops/ABC-019-turn-loop-skeleton`, rebased onto current
  `main` and re-gated green by the Orchestrator (**717/717 on 24 files**, `src/turn-loop.ts` md5
  `c92a1776…`) — verify that yourself.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist here and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`.** Claim per
Workflow 17 (atomic `mkdir` of `.grugops/queue/claimed/refinement-ABC-019-qe-gaps/`, by hand).
