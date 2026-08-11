---
task: abc019-review-2026-08-11
subtask: refinement-ABC-019-seam
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-ABC-019-seam/
parent_ref: .grugops/context/abc019-review-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T11:30:00Z
branch: grugops/ABC-019-turn-loop-skeleton
worktree: ../cli-chess-ABC-019
---

# Subtask: rule on three `ABC-019` ticket-text defects the build exposed

`ABC-019` is delivered, gated green (**715/715 on 24 files**, lint/typecheck/build 0, skip 0) and
sits in `In Review`. **QE is deliberately NOT running yet and will not start until you have ruled** —
what you write is what QE builds its mutant net against.

Read `parent_ref:` first, then `plans/tickets/ABC-019-turn-loop-skeleton.md`, then the engineer's
notes in `.grugops/context/ticket-to-pr-ABC-019-dev/notes/`, then `ADR-0009` clause 9.

**A separate BA/PM hop is running concurrently on `ABC-016` in a different worktree.** You never
communicate with it. The on-disk shared context is the only channel.

## The three, in the order they matter

### 1. The render seam's stated signature cannot satisfy `A5` — the load-bearing one

`## Scope` (line ~230) and `ADR-0009` cl. 9b both state the seam as
`(GameHistory, GameStatus, thinking) => readonly string[]`. But **`A5` (line 432) requires that on
`ambiguous` "the candidate list reaches the frame's message region"**, and `## Scope` states there is
no second output channel. The Orchestrator verified both at source. Three arguments cannot carry a
message; the criterion and the signature contradict each other.

The engineer built a **fourth `messages: readonly string[]` argument**, resting on the ADR's own
sentence: *"the loop supplies the render seam everything it draws, and the render seam derives
nothing."* It flagged rather than amended.

**`ADR-0009` is NOT re-opened and you should not treat this as needing it.** Clause 9b defers the
signature to this ticket in its own words — *"this is not a new seam: it is the seam that ticket
already specifies"* — and clause 9's actual ruling, that the **row count** must not cross the seam,
is untouched by a `messages` argument. The signature's home is this ticket, which is yours.

**One thing to decide explicitly and state either way:** whether `ADR-0009`'s cl. 9b *quotation* of
the three-argument form becomes stale enough to owe an Architect/Design follow-up. If yes, say so and
the Orchestrator routes it; do not edit `memory-bank/50-decisions/` yourself.

### 2. `A3b`'s "exactly once per ply" is off by one

Transition 2 mandates one evaluation before the first act, so the honest count is `plies + 1`. The
engineer reports the intent is met exactly and only the arithmetic is wrong. **Verify that before you
accept it** — an off-by-one in a spy count is also exactly how a real double-derive would hide.

### 3. `## Scope` says "either seam" for throw recovery; `A14` enumerates no input-side reason

Only the engine seam's throw is handled (`A9`'s shape). A symmetric handler would need a tenth
`A14` value that does not exist. Decide which is wrong — the Scope sentence or `A14`'s enumeration.

## Also on the table

- The engineer recorded that test-note row 3's obvious fixture is a **trap**: K+N vs K is *already* a
  dead position, so the loop correctly stops on the initial evaluation and the ply is never played.
  Judge whether the test note should say so.
- `A12` and `A17` are reported met **in part**. `A17`'s timing half was deliberately kept out of the
  suite because the criterion names an out-of-tree instrument. Rule on whether the criterion should
  say that, given `src/gameend.nfr.test.ts:16-17` states the same rule.
- **`ABC-021` and `ABC-016` are still owed flags this board has carried for several hops.** Check
  them off or restate them; do not let them decay further.

## Scope limits

- Do NOT re-open `ADR-0009`. Do NOT edit `memory-bank/50-decisions/`.
- Re-derive size (`L`) and priority (`P0`); say if either moves. `XL` is `SPLIT_REQUIRED` and routes
  back to you, not forward.
- If a ruling changes what the CODE must do, say so — that returns the ticket to `In Development`,
  a legitimate outcome (this board did it once on `ABC-009` and was right to).
- Check the OTHER criteria while you are in there. This board's record: DoR blocks reading all-✅ have
  hidden 16, 18 and 25 defects. Three known defects is not evidence the other sixteen are sound.

## Working rules

- Work in `../cli-chess-ABC-019` on branch `grugops/ABC-019-turn-loop-skeleton`, rebased onto current
  `main` and re-gated green by the Orchestrator — verify that yourself before starting.
- Do NOT write `plans/board.md` — the Orchestrator's alone. Request board moves in your notes.
- Do NOT edit `src/`. If code must change, say so; the Engineer changes it.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist in this repo and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`**: no
verification stamp is issuable to you. Claim per Workflow 17 (atomic `mkdir` of
`.grugops/queue/claimed/refinement-ABC-019-seam/`, by hand).
