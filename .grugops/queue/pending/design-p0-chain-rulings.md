---
task: design-p0-chain-rulings-2026-08-18
subtask: design-p0-chain-rulings
role: architect-design
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: —
ref: .grugops/context/design-p0-chain-rulings-2026-08-18/
parent_ref: .grugops/context/wave-p0-chain-2026-08-18/
enqueued_by: orchestrator
enqueued_at: 2026-08-18T12:05:00Z
branch: grugops/design-p0-chain-rulings
base: main @ 16e9269
---

# Subtask: two open rulings, both named by a ticket page, neither with an owner until now

Read `parent_ref:` first — it carries the wave decision and the anchors I re-measured at HEAD
`16e9269`. **You write no production code in this subtask.** You rule, you record, and if a ruling
deserves an ADR you write one. Next free id is **`ADR-0012`** (`memory-bank/50-decisions/`, eleven
ratified, `ADR-0001`–`ADR-0011`) — and **whoever writes `ADR-0012` updates the count line in
`memory-bank/00-index.md` in the same commit**; that census has gone stale twice already.

## Ruling 1 — the `EPIC-004` / `EPIC-005` composition point. This is `ABC-078`'s open ⚠️(5)

`plans/tickets/ABC-078-iterative-deepening-and-the-engine-seam.md` § Dependencies states it and
deliberately refuses to resolve it. BA/PM assigned **no owner** and invented none. It is yours.

> `EPIC-005`'s opening book consumes the move interface. If the book wraps or precedes the engine,
> it consumes `EngineSeam` (`src/turn-loop.ts:138`, verified exact at HEAD). Does `EPIC-005` need a
> different shape — a "book first, else search" composition point, or a way to ask the engine to
> skip the book? That is a contract change on a merged type.

**What you are ruling:** whether `EngineSeam` as merged is sufficient for `EPIC-005`, or whether a
composition point is owed — and if owed, **where it lives** (a wrapper at the composition root, a
widened seam, or something else). `ABC-095` is `DoR 7/10` and hard-blocked on exactly this.

**Constraint you may not move:** `ABC-078` is in development **right now** and its `A6` pins
`src/turn-loop.ts` **byte-identical**. Whatever you rule must not require that ticket to change the
merged type. If your answer is that the type must change, **say so plainly and stop** — that is an
escalation to the owner, not a thing you route around.

## Ruling 2 — may the composition root supply a default opponent before `EPIC-004` lands?

`plans/tickets/ABC-043-the-live-session.md` § "The named decision this ticket cannot make for
itself" states it and names **Architect/Design** as the owner by name.

The conflict: the Factory Coach's ruling presumes yes (*"even if the opponent is a stub that plays
the first legal move"*). **`ADR-0009` clause 9c and `src/turn-loop.ts:45-47` say the opposite for a
module**: *"a `src/` stub module would be production code that is dead the day the real parser and
engine land"* — which is why both merged stubs live in `turn-loop.test.ts`. The conformance
question is whether **a one-line default inside a non-exporting entry point** — which dies in one
line the day `EPIC-004` lands, and which no module can import — is the same thing clause 9c forbids.

**Read this before you rule, because it changes the stakes and not the question:** `ABC-078` is in
development in this same wave and, if it merges, a **real** `EngineSeam` implementation exists and
`ABC-043` no longer needs a default opponent at all. **That does not make the question moot** —
`ADR-0009` clause 9c's scope is a standing conformance rule that will be asked again — but it does
mean **the answer must not be shaped by schedule pressure**. Rule the rule, not the convenience.
If your ruling is NO, say so; `ABC-043` then simply waits for `ABC-078`, which it was going to do
anyway.

## Fences

- **Zero production lines.** You touch `memory-bank/50-decisions/`, `memory-bank/00-index.md`, and
  the `## Dependencies` sections of `ABC-078` / `ABC-043` / `ABC-095` to record the ruling. Nothing
  under `src/`.
- **Do not re-open a merged contract in this subtask.** If a ruling implies a change to a merged
  type, that is a new ticket and an escalation, not an edit.
- **Do not rule anything you were not asked.** Coding rule 5. Two questions, two answers.
- **You may not ratify against the owner.** `memory-bank/60-progress.md` § "Standing directive —
  who decides" governs; read it before you sign an ADR.
- **`ABC-043` is not pullable regardless of your answer** — `ABC-037` is open and hard-blocked
  behind `ABC-033` + `ABC-035`. Do not move it on the board; column moves are the Orchestrator's.

## Gate

No `src/` change means the suite should be untouched. Run `npm test`, `npm run lint`,
`npm run typecheck`, `npm run build` on the branch tip anyway and record that the numbers are
**unchanged** from `main`. **Do not merge.**

## Publish

Typed notes per Workflow 16 into `ref:`. **No `finding` is admissible on this install** — see
`AGENTS.md` § "Role / workflow files". Use `decision` / `claim` / `observation` / `artifact-ref`,
hand-authored per `agent-factory/contracts/context-note.md`. Take the claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/design-p0-chain-rulings`. Then move this file into it.

Commit on `grugops/design-p0-chain-rulings`, never on `main`.
