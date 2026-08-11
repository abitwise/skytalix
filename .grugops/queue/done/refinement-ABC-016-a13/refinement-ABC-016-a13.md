---
task: abc016-review-a13-2026-08-11
subtask: refinement-ABC-016-a13
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-ABC-016-a13/
parent_ref: .grugops/context/abc016-review-a13-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T10:15:00Z
branch: grugops/ABC-016-status-panel
worktree: ../cli-chess-ABC-016
---

# Subtask: rule on `ABC-016`'s `A13`, which no correct build can satisfy

`ABC-016` is delivered, gated green (**707/707 on 24 files**, lint/typecheck/build 0, skip 0) and
sits in `In Review`. **QE is deliberately NOT running yet and will not start until you have ruled** —
building a mutant net against a criterion that is about to move is waste this board has already
recorded.

Read `parent_ref:` first, then `plans/tickets/ABC-016-status-panel.md`, then the engineer's notes in
`.grugops/context/ticket-to-pr-ABC-016-dev/notes/`.

## The one thing you are here to decide

`A13` (`plans/tickets/ABC-016-status-panel.md:455-458`) requires, on any panel render with the calls
spied: `isInCheck` **exactly 1** time *and* `toSan` **exactly 1** time.

`toSan`'s `suffix()` calls `isInCheck` itself — **`src/san.ts:104`**, merged code `ABC-016` does not
own. So a correct panel that does item 2 (`isInCheck` for the check indicator) and item 4 (`toSan`
for the last move) sees `isInCheck` **1 on an empty history, 2 from the first move onward**.

The Orchestrator verified this at source rather than accepting the engineer's report, and the
engineer flagged it rather than amending the ticket — both are recorded. **What was NOT done is the
part that is yours: deciding what the criterion should say.**

Every other clause of `A13` holds as written (`gameStatusOf` / `repetitionCounts` / `keyHistory` /
`gameStatus` all **0**, `toSan` 1 and 0 on an empty history, the 64-square scan once). `A13` exists to
fail if anyone puts the repetition derive back into the panel; whatever you write must keep that.

The engineer's delivered test asserts the panel's **own** `isInCheck` call by subtracting a measured
bare-`toSan` baseline, and says plainly that this is not the criterion as written. **Judge that
approach; do not inherit it.** The engineer offered three candidate amendments in its notes — read
them as input, not as a menu you must pick from.

## Scope limits

- **Do not re-open `ADR-0009`.** It is accepted.
- Re-derive size (`M`) and priority (`P1`); say so if either moves.
- If the ruling changes what the code must do, say so explicitly — that sends the ticket back to
  `In Development`, and that is a legitimate outcome, not a failure. This board has recorded a
  backward move before (`ABC-009`, `Ready for UAT` → `In Review`) and was right to.
- **Test the ticket's other criteria while you are in there.** This board's record is that DoR blocks
  reading all ✅ have hidden 16, 18 and 25 defects. `A13` is the one that is *known*; it is not
  evidence the rest are sound.

## Working rules

- Work in `../cli-chess-ABC-016` on branch `grugops/ABC-016-status-panel`. It has been rebased onto
  current `main` and re-gated green — verify that for yourself before you start.
- **Do not write `plans/board.md`** — the Orchestrator's alone. Request board moves in your notes.
- Do not edit `src/`. If the code must change, say so; the Engineer changes it.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
  Check `git status` before every commit; prefer `git commit -- <paths>`.
- Never merge, never deploy, never push.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist in this repo and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`**: no
verification stamp is issuable to you. Claim per Workflow 17 (atomic `mkdir` of
`.grugops/queue/claimed/refinement-ABC-016-a13/`, by hand).
