---
id: 20260812T081000Z-software-engineer-decision-d23-fixtures-4c81ea20
kind: decision
by: software-engineer
at: 2026-08-12T08:10:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-017-d23
  - abc017-d23-2026-08-12
  - ABC-017
  - src/history-pane.test.ts
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - 20260812T041500Z-ba-pm-observation-a1-a12-sweep-8d3e07f5
  - 20260812T070000Z-orchestrator-decision-3f81b6e4
supersedes:
---

# D23 closed by a fixture BUILDER, and `A9` split in two — plus the one thing I did not do

> **HAND-AUTHORED.** `scripts/context-io.ts` does not exist in this repo and the kit has no
> `scripts/` directory; `mcp__grugops__propose_note` is not in this session's tools. Workflow 16
> names `context-io.ts` as the sanctioned writer, it is absent, so this note is written by hand and
> says so. **Nothing here is a `finding`** — no `§14-gate#<id>` stamp exists for this hop and none
> was invented.

## What changed

`src/history-pane.test.ts`'s fixtures are now **builders**, not module-scope singletons:
`buildLengthCases()` and `buildAllCases()`. `A9` calls `buildAllCases()` **inside each of its two
tests**, so every `GameHistory` it asserts over is one nothing has passed to `renderHistory`. That
is `A9` as worded — *"a `GameHistory` object no earlier test in the file has passed to
`renderHistory`"* — rather than the weaker form the `## Test notes` permit.

`ALL_CASES` is unchanged and still composed of the shared singletons. It has exactly one consumer
left, `A10`, which asserts a property of the OUTPUT and cannot care what has already rendered.

## `A9` is TWO `it`s, and this is a judgment call I am flagging as one

BA/PM measured that `A9`'s byte-identical clause **masks its two non-mutation clauses**: on a build
that corrupts on every render, `expect(second).toEqual(first)` asserts first, so `moves.length` —
the clause the ticket calls *"the criterion"* — is never evaluated. That is named in the sweep note
as *"the same silent-precedence shape as the original `A13` placement the Engineer split"*, and the
ticket's `## Test notes` carry it as ONE RULE for this round.

It was **not** made a criterion change and the ticket does not require the split. I took it anyway,
because it is inside the criterion I was already required to rewrite and it costs nothing once the
fixtures are per-test. **Reverting it is a two-line change** if the reviewer disagrees.

## What I decided AGAINST, and why it matters to the lane

My first implementation also made `ALL_CASES = buildAllCases()`, which quietly added a **third**
heavy fixture build at module scope for no benefit. Measured, that shape cost noticeably more than
the ticket's cost argument assumes, so it was reverted to the delivered composition. The delivered
change adds **two** rebuilds, not three, and `ALL_CASES` is built exactly as it was before.

The cost figures, including a correction to the 8.2 ms this hop was handed, are in the measurement
note alongside this one. **No lane bar was re-derived** — the ticket forbids it and it was not done.

## What was NOT touched

`src/history-pane.ts` is byte-identical: D23 is a fixture defect and the fix is a fixture change and
no new assertion, exactly as ruled. `HISTORY_COLS` stays at 21. `src/frame.ts`, `src/render.ts`,
`src/history.ts`, `src/status-panel.*` and the screen model are untouched, and `plans/board.md` was
not written.
