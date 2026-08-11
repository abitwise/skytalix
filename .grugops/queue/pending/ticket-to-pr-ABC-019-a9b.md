---
task: abc019-a9b-2026-08-11
subtask: ticket-to-pr-ABC-019-a9b
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-019-a9b/
parent_ref: .grugops/context/abc019-a9b-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T14:00:00Z
branch: grugops/ABC-019-turn-loop-skeleton
worktree: ../cli-chess-ABC-019
---

# Subtask: build `ABC-019`'s `A9b` — repair the borrowed position, then RETHROW

Second dev hop on a ticket you already built. It moved `In Review` → `In Development` **backward**.
BA/PM ruled nine defects — three the Orchestrator routed, six it found on its own. **Eight are
text-only. `A9b` is the only one that changes code**, and your build was right on the other eight.

Read `parent_ref:` first, then BA/PM's notes in
`.grugops/context/refinement-ABC-019-seam/notes/`, then the amended
`plans/tickets/ABC-019-turn-loop-skeleton.md`, then your own notes in
`.grugops/context/ticket-to-pr-ABC-019-dev/notes/`.

## What was ruled in your favour, so you do not redo it

- **Your fourth `messages` argument is RIGHT, and ruled FORCED rather than merely allowed.** The
  3-arg form cannot satisfy `A5`. `## Scope` now states the 4-arg signature. **No code change.**
- **`A3b` was wrong about BOTH counts, not one.** Read that ruling — the half nobody had named is
  that `repetitionCounts` reads 0 because `gameStatusOf` calls it inside `src/history.ts:152`, and
  the only build that makes it read once per ply is one `A3` forbids. **No code change.**
- **`A12` and `A17` are met in FULL** — the criteria were under-specified, not your build. Your
  refusal to put `A17`'s timing half in the lane was correct and is now the criterion's own wording.

## The one thing to build

**`A9b`: the input seam's throw must be REPAIRED and then RETHROWN.**

Verified at source by the Orchestrator: **`src/turn-loop.ts:209`'s `await input(history)` has no
`try`/`catch` at all**, and the file's only one is the engine seam at `:227`.

Why repair is owed and not just termination: the input seam calls `legalMoves`, which runs
`makeMove`/`unmakeMove` on the **live borrowed object** (`src/legal.ts:47-51`; your own stub at
`src/turn-loop.test.ts:136`). So a throw mid-`legalMoves` can leave the position corrupted.

Why **rethrow** and not quiet termination — BA/PM's reasoning, which you should read in full: quiet
termination is byte-identical to `A8`'s EOF path, so it would present a **crashed parser as a clean
exit**. Termination with a named reason stays the engine seam's; there is **no tenth `A14` reason
value** and `A14` is untouched.

Expected shape: one `try`/`catch` over the existing `await`, plus one test-table row. **No new file**
— `N8-LANE` does not move. Read the exact wording from `A9b` in the ticket, not from this brief.

## Also landed in the ticket text, no code owed

`[D29]` `A2`'s cadence formula (five of thirteen rows had disagreed with it), `[D30]` glyph mode,
`[D36]` the `NFR-002` derivation term, `[D35]` row 3's fixture trap, `[D37]` the `ABC-016` dependency
now cited by content. Re-read `A2` — its cadence expectations changed.

## Working rules

- Work in `../cli-chess-ABC-019` on branch `grugops/ABC-019-turn-loop-skeleton`, rebased onto current
  `main` and re-gated by the Orchestrator — verify that yourself. Baseline **715/715 on 24 files**.
- Do NOT write `plans/board.md` — the Orchestrator's. Request your move in your notes.
- Do NOT touch `src/status-panel.*` or `src/frame.test.ts`. A QE hop is live on `ABC-016` in a
  different worktree; you never communicate with it.
- The frame-WIDTH question is live with Architect/Design and is NOT yours. Do not reserve width.
- Gates blocking: lint/typecheck/build 0, skip 0.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist here and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`.** Claim per
Workflow 17 (atomic `mkdir` of `.grugops/queue/claimed/ticket-to-pr-ABC-019-a9b/`, by hand).

State plainly whether EVERY criterion is now met, and request your board move.
