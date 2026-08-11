---
task: abc016-d19b-2026-08-11
subtask: design-frame-width-clearing
role: architect-design
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/design-frame-width-clearing/
parent_ref: .grugops/context/abc016-d19b-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T12:30:00Z
branch: grugops/design-frame-width-clearing
worktree: ../cli-chess-design-width
---

# Subtask: decide who owns frame WIDTH stability, and whether a narrowing frame leaves stale columns

Raised by BA/PM at `refinement-ABC-016-a13` and routed here by the Orchestrator because BA/PM
explicitly declined to write a criterion for it: **the two candidate fixes are a design decision, not
a wording one.** That judgment is the reason this hop exists — do not treat the question as settled.

Read `parent_ref:` first, then BA/PM's `claim` note in
`.grugops/context/refinement-ABC-016-a13/notes/`, then `ADR-0009`
(`memory-bank/50-decisions/ADR-0009-frame-row-constant-ownership.md`) — which settled the exactly
analogous question for **row counts** and whose reasoning is the obvious starting point for **width**.

## The question

`ABC-016`'s status panel emits a widest row of **17** columns when quiet and **67** when both draw
claims are named — a **50-column swing**. `src/frame.ts:179` takes the frame's `W` as the widest
panel row, and `\x1b[0J` cannot clear to the right of a row. So a frame that NARROWS between renders
can leave stale columns on screen from the wider frame before it.

`ABC-017` already carries a constant-width criterion, but for a **3**-column swing — an order of
magnitude smaller, and it is a `P2` that describes itself as the first thing to drop.

Two candidate fixes were named and neither was chosen:
1. **The panel reserves its width** (the producer pads).
2. **`ABC-018`'s frame writer clears per row** (the consumer clears).

There may be others; you are not limited to these two.

## What you own and what you must not do

- **Decide it, and write the ADR.** `ADR-0009` is the template in both form and rigour: it measured
  six mutants against four assertion forms rather than arguing from taste, and it recorded a
  correction to its own table when it turned out wrong. Match that standard — **measure against
  merged `src/` and against the delivered `ABC-016` panel, do not reason from the ticket text.**
- **Say explicitly which tickets are owed what**, including whether `ABC-019` is owed anything.
  BA/PM flagged that if the decision goes the second way, `ABC-019` may be. **Do NOT edit any
  ticket** — name what each is owed and the Orchestrator routes it.
- **Do NOT re-open `ADR-0009`'s row-count ruling.** You may cite it, extend it, or distinguish
  width from rows — you may not overturn it here.
- **Do NOT edit `src/`.** This is a decision hop. If code must change, say which module and why.
- **Do NOT write `plans/board.md`** — the Orchestrator's.
- You MAY write `memory-bank/50-decisions/` (a new ADR) and `plans/nfr-catalog.md` if the decision
  seeds an NFR row. Both are yours.

## Timing, so you can size the work honestly

The decision is **owed before `ABC-019` merges**, and merge order is `ABC-016` → `ABC-017` →
`ABC-019`. `ABC-017` is unbuilt and sits in `Ready for Dev`, so a ruling that changes its
constant-width criterion is cheap **now** and expensive later. Nothing is blocked on you today.

## Concurrency

Two other agents are live in different worktrees: a Software Engineer on `ABC-016` and a BA/PM on
`ABC-019`. **You never communicate with them.** The on-disk shared context is the only channel. Both
of those tickets' files are being written by those agents — **read them, do not write them.**

## Working rules

- Work in `../cli-chess-design-width` on branch `grugops/design-frame-width-clearing`, created from
  current `main`. Use absolute paths. `node_modules` is symlinked so npm scripts work.
- Gates blocking: lint/typecheck/build 0, skip 0, baseline **676/676 on 22 files** on `main`.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist in this repo and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`**: no
verification stamp is issuable to you. Claim per Workflow 17 (atomic `mkdir` of
`.grugops/queue/claimed/design-frame-width-clearing/`, by hand).
