---
task: ticket-to-pr-ABC-035-2026-08-18
subtask: abc035-in-game-commands
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-035-in-game-commands.md
ref: .grugops/context/ticket-to-pr-ABC-035-2026-08-18/
parent_ref: .grugops/context/repair2-ABC-033-2026-08-18/
enqueued_by: orchestrator
enqueued_at: 2026-08-18T18:00:00Z
branch: grugops/abc035-in-game-commands
base: main @ 23312b3
---

# Subtask: `ABC-035` — the command table, in front of `ABC-033`'s dispatcher

**This ticket was blocked for six days on `ABC-033` and it is not blocked any more.** Both of its
recorded ⚠️ (DoR items 3 and 10) were the SAME fact — one open ordering dependency on `ABC-033` —
and it is **discharged by measurement**, taken by me at `main` `23312b3`, not asserted:

- `ABC-033` merged to `main` at `0d0f635`; `src/move-input.ts` and `src/move-input.test.ts` are in
  the tree; `resolveMoveInput(history, line, deps?)` is exported.
- The suite on `main` is **1049 tests / 36 files, skip 0**, lint/typecheck/build exit 0.

**The DoR page still reads 9/10 ⚠️x1 — I am pulling on the measured discharge, and the re-score is
BA/PM's pen, not yours and not mine.** Do not edit the DoR table.

## Read before you write

- `plans/tickets/ABC-035-in-game-commands.md` — your ticket.
- `parent_ref:` and the sibling context dirs for `ABC-033` — **eleven notes across four hops**,
  including two QE hops. `ABC-033` is the module you classify in front of; read how it actually
  behaves, not how its page says it behaves.
- **The hard-won lesson from `ABC-033`, and I want it applied here from the start:** that ticket
  shipped three guards that did not bite (a reason code no input could produce, a spy blind to a
  direct import, an "asserted" order that was not asserted) and one comment that was flatly false.
  **Every guard you write, mutate before you believe it.** Record the mutant diff, not a
  description.

## Your ticket's own shape

- **Four tokens** — `help`, `board`, `quit`, `claim` — **grammar only**. Effects belong to
  `EPIC-006` / `ABC-021`; the ticket names the effect-owner and the outcome kind per token.
- **A command line never reaches a resolver.** `ABC-033` `A4`'s spy assertion is the shape: the
  outcome is `kind: "command"` and **neither resolver was called**. Your `A2` re-asserts that from
  this side.
- **Spied counts of 0 and 1**, a table-derived help assertion, and exact non-tokens as well as
  exact tokens.
- `NFR-002`'s ≤ 100 µs per-ply bar is carried with the cost of the wrong implementation quantified
  on the page. `N8-LANE` ≤ 650 ms CPU — and note the lane is **already at or over `NFR-008`'s 13 s
  clause before you start**, so keep your file count to what the page allots.

## Fences

- **Grammar only.** No effect, no state change, no loop arm. If you find yourself implementing what
  `quit` *does*, stop.
- **Do not modify `src/move-input.ts`** — merged, gated twice, and not yours. You classify in front
  of it.
- **Derive the help text from the table**, do not hand-write a second copy. `ABC-059` exists
  because a guard pinned a spelling instead of a fact.
- Do not merge, do not deploy, do not move a board column.

## Gate

Full blocking gate on the branch tip in a **contained lane** — the repo root is contaminated by
sibling worktrees (`ABC-050`, already routed; do not chase it). Note: an isolated agent worktree
contains no `.claude/worktrees/`, so the RECORDED commands (`npm test`, `npm run lint`) work
correctly inside one — QE confirmed this. Use them and say so. Baseline on `main`: **1049 tests /
36 files, skip 0**. Report `PERFT_DEEP=1` 32/32.

## Publish

Typed notes per Workflow 16 into `ref:`. **No `finding` is admissible on this install** — use
`claim` / `observation` / `decision` / `artifact-ref`, hand-authored per
`agent-factory/contracts/context-note.md`. Claim by hand: `mkdir -p .grugops/queue/claimed`, then a
**bare** `mkdir` of `.grugops/queue/claimed/abc035-in-game-commands`. **Commit incrementally** — an
API outage cost two hops today that saved everything to the end.

Commit on `grugops/abc035-in-game-commands`, never on `main`.
