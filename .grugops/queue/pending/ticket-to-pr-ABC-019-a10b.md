---
task: abc019-a10b-2026-08-11
subtask: ticket-to-pr-ABC-019-a10b
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-019-a10b/
parent_ref: .grugops/context/abc019-a10b-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T21:15:00Z
branch: grugops/ABC-019-turn-loop-skeleton
worktree: ../cli-chess-ABC-019
---

# Subtask: build `ABC-019`'s `A10b` guard, and the six test-only closes riding with it

Third dev hop on this ticket. BA/PM made **eleven rulings** across QE's eight gaps and `ADR-0010`'s
two owed items. Criteria went **23 → 27**, none renumbered or deleted. **Exactly one changes
production code.**

Read `parent_ref:` first, then BA/PM's three notes in
`.grugops/context/refinement-ABC-019-qe-gaps/notes/`, then QE's three in
`.grugops/context/quality-gate-ABC-019-qe/notes/`, then the amended
`plans/tickets/ABC-019-turn-loop-skeleton.md`. **Take exact wording from the ticket.**

## The one production change — `A10b`

`A10` guarded the **engine** seam only, so the delivered loop **plays a foreign move from the input
seam and corrupts the board**. `A10b`: guard the input seam's move too, and **throw**.

Three cheaper options were declined and you should not re-open them:
- **No tenth `A14` reason value.**
- **`engine-failure` not reused.**
- **`rejected` rejected** — a `{kind:"move"}` that is not legal is a **parser bug, not a typo**.

Expected cost, per BA/PM who measured it: **one membership check** over the comparison already at
`src/turn-loop.ts:264-272`, plus a throw, plus one test row (row 17). **No new file** — `N8-LANE`
must not move. The decisive input was the owner's 2026-07-31 standing directive, *rules-correctness
beats features*.

## The six test-only items that ride the same hop

`G-7`'s `A11` assertion (BA/PM left `A11` unchanged — it forbids the thinking indicator on a terminal
frame in its own words), `A5b`, `A6`'s new message clause, `A9b`(iv), `A8b` + row 15, and row 16.

## `A20` is deferred, and it is RED by design — do NOT try to make it green

`ADR-0010`'s narrowing criterion says **in its own words that it cannot be satisfied until `ABC-027`
merges**, because clause 1's production change lives in `src/frame.ts`, which **this ticket does not
open**. It rides at the rebase with `ADR-0009` cl. 9f's re-gate.

**If `A20` is red at your gate, that is correct.** Report it as expected-red, not as a failure, and
do not reach into `src/frame.ts` to green it — an Engineer's work on `ABC-027` is in `In Review` and
that module is its.

**Do NOT add a constant-frame-width criterion or assertion.** The prohibition is now written into the
ticket with its measured reasons: `W` is a per-frame max that varies **by design**, so such a check
fails the **correct** build.

## Ruled and needing nothing from you

`G-6` (settled by a type — `EndReason` is exactly five values, so a terminal frame for
`engine-threw`/`resignation` is not constructible without editing `src/gameend.ts`, which `A14`
forbids), `G-9` (declaration confirmed), the prohibition, and the dependency/merge-order edits.

## Working rules

- Work in `../cli-chess-ABC-019` on branch `grugops/ABC-019-turn-loop-skeleton`, rebased onto current
  `main` and re-gated by the Orchestrator. Baseline **717/717 on 24 files** — verify yourself.
- Do NOT write `plans/board.md` — the Orchestrator's. Request your move in your notes.
- Do NOT touch `src/status-panel.*` or `src/frame.*`. An Engineer is live on `ABC-016` and QE on
  `ABC-027`. You never communicate with them.
- Gates blocking: lint/typecheck/build 0, skip 0.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## A sizing tripwire that applies to you

`L`/`P0` have been re-derived four times and never moved. BA/PM recorded, and the Orchestrator
adopted, that **a fifth hop adding production scope beyond one guard must re-derive against
`SPLIT_REQUIRED` rather than by precedent.** If `A10b` turns out to need more than one membership
check and a throw, **stop and say so** — that is a stop condition, not something to absorb.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist here and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`.** Claim per
Workflow 17 (atomic `mkdir` of `.grugops/queue/claimed/ticket-to-pr-ABC-019-a10b/`, by hand; create
the `claimed/` parent if missing).

State plainly which criteria are met, which are expected-red (`A20`), and request your board move.
