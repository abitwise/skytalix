---
task: abc016-d19b-2026-08-11
subtask: ticket-to-pr-ABC-016-d19b
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-016-d19b/
parent_ref: .grugops/context/abc016-d19b-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T12:30:00Z
branch: grugops/ABC-016-status-panel
worktree: ../cli-chess-ABC-016
---

# Subtask: write `ABC-016`'s `D19b` capture case — test-only, zero production lines

This is a **second dev hop on a ticket you already built**. It moved `In Review` → `In Development`
**backward** on a defect BA/PM found after your first pass. That is the system working, not a
reprimand — your `A13` flag was correct and has been ruled in your favour.

Read `parent_ref:` first, then the BA/PM ruling in
`.grugops/context/refinement-ABC-016-a13/notes/`, then `plans/tickets/ABC-016-status-panel.md`
(both `A13` and `A2` changed), then your own prior notes in
`.grugops/context/ticket-to-pr-ABC-016-dev/notes/`.

## What changed under you

**`A13` is ruled and you do not need to touch it.** BA/PM replaced the unsatisfiable `isInCheck`
clause with a two-part assertion — directly on an empty history, and by difference on a history of at
least one move. **Both halves are already asserted in your delivered `src/status-panel.nfr.test.ts`
(`:130-132`, `:140-149`)**, so `A13` is now MET with no change. It also closed an ambiguity in your
subtraction test that you should read: `withSan - sanAlone === 1` is also satisfied by `1 - 0`, and
BA/PM measured the real numbers to rule that out.

## The one thing to do

**`A2` gained a case and it is the only capture on the ticket:** `1.e4 e5 2.Qh5 g6 3.Qxe5+`.

Why it exists, because it should change how you write it: **not one of the 14 delivered cases
contains a capture** — every in-check case has an empty move list and every played case is quiet.
Independently verified: a capture-grep over your delivered test file returns **0**, and the only
`last:` expectation in the suite is `"last: Nf3"`. So a build reading the check indicator or the
material balance from item 4's **replay position** — the natural shortcut for anyone already holding
a `Position` — passes every criterion as they stood. This new case's replay position is
White-to-move and **not** in check, which is what kills that build.

Expected: **one `CASES` entry, roughly 12 lines, plus a regenerated snapshot. ZERO production
lines.** BA/PM measured that the delivered panel already renders this correctly, so if you find
yourself editing `src/status-panel.ts`, stop and say why — that would contradict the measurement and
is worth a flag, not a quiet fix.

Read the exact expected cells from the ticket's repaired `A2`, not from this brief.

## Working rules

- Work in `../cli-chess-ABC-016` on branch `grugops/ABC-016-status-panel`, rebased onto current
  `main` and re-gated green by the Orchestrator (707/707 on 24 files) — verify that yourself.
- **Do not write `plans/board.md`** — the Orchestrator's. Request the move in your notes.
- Do not touch `src/turn-loop.*` or `src/frame.test.ts`. `ABC-019` is in `In Review` with its own
  BA/PM hop live in a different worktree; you never communicate with it.
- Gates blocking: lint/typecheck/build 0, skip 0. Your baseline is **707/707 on 24 files**.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## A live design question that is NOT yours

BA/PM raised, and the Orchestrator has routed to Architect/Design, that the panel's widest row swings
**17 → 67 columns** and `src/frame.ts:179` makes that the frame's `W`. **Do not act on it, do not
reserve width, do not change any string.** If your case interacts with it, flag it.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist in this repo and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`.** Claim per
Workflow 17 (atomic `mkdir` of `.grugops/queue/claimed/ticket-to-pr-ABC-016-d19b/`, by hand).

Then state plainly whether every criterion is now met, and request your board move.
