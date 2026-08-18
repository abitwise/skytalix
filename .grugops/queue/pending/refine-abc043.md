---
task: refine-ABC-043-2026-08-19
subtask: refine-abc043
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ticket: plans/tickets/ABC-043-the-live-session.md
ref: .grugops/context/refine-ABC-043-2026-08-19/
parent_ref: .grugops/context/design-p0-chain-rulings-2026-08-18/
enqueued_by: orchestrator
enqueued_at: 2026-08-19T16:00:00Z
branch: grugops/refine-abc043
base: main @ f033d03
---

# Subtask: `ABC-043` — every blocker is gone and I am NOT pulling it, because a criterion may be unsatisfiable

**All three of `ABC-043`'s recorded blockers are discharged. I measured each at `main` `f033d03`:**

- `ABC-041`, `ABC-042` — both in `Done`.
- `ABC-037` — **MERGED**; `src/line-input.ts` is in the tree.
- *"NO `EngineSeam` EXISTS"* — **false today**; `src/engine.ts` is merged and `createEngine` returns
  an `EngineSeam`. `ADR-0013` (no placeholder opponent) is therefore **moot in practice**: a real
  engine exists, so nothing needs a stub.

**So the page's `## Dependencies` is stale in the good direction, and its DoR (7/10 ⚠️x2) is stale
with it. That part is routine and it is your pen.**

## The part that is NOT routine, and is why I stopped

**Architect/Design flagged at `design-p0-chain-rulings-2026-08-18` that `A5` may not be satisfiable
as written.** I have now measured the fact underneath it:

```
src/cli.ts exports: 0
```

- **`A5`** requires *"an `EngineSeam` that throws, and again one that returns a move `legalMoves`
  did not produce"*, asserted **"through the real entry point rather than through a stub harness"**.
- **`A2`** has the same shape — it needs a *deterministic* opponent through the real entry point.
- **`src/cli.ts` exports nothing to inject through**, and that is not an oversight: it is
  **`ADR-0011` clause 4**, pinned by `ABC-042`'s `A2`, both merged.
- **`A8`** confines the diff to the entry point.

**So `A5` as written asks for an injection point that a merged ADR forbids.** Sending an engineer at
that would be the "stop if the input is not ready" failure this role exists to prevent, so I have
not pulled it.

## What I need from you

1. **Rule whether `A5` and `A2` are satisfiable as written.** If they are — say how, precisely
   enough to build. Candidate shapes exist and I am deliberately not choosing between them: a
   spawned-process test that induces the fault without an export; an env- or argv-gated fault
   injection (**note this would itself be production behaviour and needs its own justification**);
   or re-scoping the criteria to what the entry point can actually be driven through.
2. **If the honest answer is that they need a merged ADR to change, STOP and say so.** That is
   Architect/Design's, not yours and not mine, and it is a legitimate outcome of this hop.
   `ADR-0011` clause 4 is not yours to move.
3. **Re-score the DoR** against the discharged blockers and against whatever you conclude about
   `A5`/`A2`. **Do not re-score it to 10/10 on the blockers alone if the testability question is
   still open** — that would trade a real ⚠️ for a stale one.

## What you may NOT do

- **Do not weaken `A5` to make it easy.** Its own page names the discriminating requirement: *a
  build that catches the throw and exits 0 passes every other criterion and fails this one.* That is
  the whole value of the criterion. **`ABC-019` `A10` forbids presenting an engine bug as a chess
  outcome, and this is the ticket that enforces it at the top level.** A criterion re-scoped into
  vagueness is worse than one marked unsatisfiable.
- **Do not resolve `[D31]`'s `EPIC-006` half** — what the top-level handler prints and exits with is
  `ABC-043`'s to build, and it is already ruled on the page. Leave it.
- Nothing under `src/`. Do not cut a new ticket unless the ruling genuinely needs one — and if it
  does, cut one, not three. Do not move a board column, do not merge, do not deploy.

## Also worth your attention while you are on this page

`ABC-037`'s QE left **`G6` written down nowhere**: `createLineInputSeam` has a **single-caller
precondition** (two overlapping `seam()` calls orphan the first read forever) and `ABC-043` is the
ticket that will wire it. **Decide whether that belongs on this page as a constraint** or is the
engineer's to discover. Recording it is cheap; discovering it at integration is not.

## Gate

No `src/` change. Contained lane; record numbers unchanged from `main`: **1181 tests / 39 files,
skip 0**. An isolated worktree has no `.claude/worktrees/`, so the recorded commands work inside one.

## Publish

Typed notes per Workflow 16 into `ref:`. No `finding` is admissible on this install. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of `.grugops/queue/claimed/refine-abc043`.
**Commit incrementally.**

Commit on `grugops/refine-abc043`, never on `main`.
