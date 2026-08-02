---
id: 20260802T214000Z-orchestrator-decision-0e6f8692
kind: decision
by: orchestrator
at: 2026-08-02T21:40:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-012
  - ABC-014
  - ABC-009
  - ABC-013
  - EPIC-001
  - EPIC-002
  - plans/board.md
  - plans/tickets/ABC-011-zobrist-en-passant-hashing.md
  - plans/tickets/ABC-012-game-history-module.md
  - memory-bank/60-progress.md
  - memory-bank/50-decisions/ADR-0002-game-history-ownership.md
  - src/zobrist.ts
supersedes: 
---

# PULL: ABC-011 next, and it enters In Design — not In Development

## The decision in one line

`ABC-011` (Zobrist hashes en passant when no capture is available) is the next ticket pulled, and
it goes `Ready → In Design` first, because the ticket assigns an open design question to
Architect/Design in writing and forbids deciding it in dev.

## Why ABC-011 and not ABC-012 or ABC-014

Five tickets sit in `Ready`: ABC-009, ABC-011 (rules-core defects, S/P1), ABC-012, ABC-014
(EPIC-002 P0s, M) and ABC-013 (M/P1). The board's re-sequencing comment of 2026-07-31 suggested
ABC-012 and ABC-014 next, on the argument that the product does not exist without them. **That
suggestion is overridden here, and the reason is not priority — it is a sequencing constraint the
two tickets state about each other.**

- `ABC-011`'s escalation trigger: it must be settled *before* the first consumer of the key list
  lands, "otherwise that consumer's own tests are written against a key that under-detects and the
  defect stops being a bug and becomes an encoded assumption."
- `ABC-012`'s Dependencies section, independently: "The two must not be built in the order that
  bakes the defect into this module's tests."
- `ABC-012` **is** that consumer — its `gameStatusOf` is `ADR-0002` clause 4's single supplier of
  `positionCounts`, and every repetition verdict it derives runs through `zobristKey`.

Concretely: build `ABC-012` first and its Test notes *require* the threefold test to use an
ep-free knight cycle to dodge this defect. That test is then permanently blind to the thing
`ABC-011` fixes, and nothing later comes back to widen it. Build `ABC-011` first and `ABC-012`'s
repetition test can contain a double push and be honest. The order is one-way.

The owner's standing directive of 2026-07-31 (rules-correctness before features) points the same
way and is the tiebreak, not the argument: threefold repetition under-detecting is a FIDE rule the
product fails to apply.

## Why the design hop, and why the Orchestrator did not skip it

`ABC-011` carries `### Open design question — hand to Architect/Design at the design hop, do not
decide in dev`: "an en-passant capture is available" has a board-only (pseudo-legal) reading and a
strict-FIDE (legal) reading, and they disagree on real positions — the ticket names
`7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1`, which has 1 pseudo-legal and 0 legal ep captures. The choice
decides whether `src/zobrist.ts` — today a level-1 leaf importing only `src/position.ts` — gains a
dependency edge to `moves.ts`/`legal.ts`, inside a function `EPIC-004`'s transposition table calls
per node. That is a structural call, and an engineer who guesses it writes code against a contract
that can be rejected. Same posture ABC-020 was given on 2026-07-31, for the same stated reason.

The ticket also names a re-size condition at that hop: if the strict reading is chosen, re-size to
at most `M`, never split.

## What was deliberately NOT pulled, each with its reason

- **ABC-012** (M, P0) — next after ABC-011, for the reason above. Not pulled in parallel: parallel
  is the same order problem wearing a different hat, since its engineer would still be writing
  tests against today's key.
- **ABC-014** (M, P0) — genuinely independent of both (renderer, no rules), so it *could* run
  concurrently within `queue.wip_limit: 3`. Held for one reason worth a human's attention rather
  than mine: `ABC-015` states a sequencing constraint from `RISK-005` that it "merges **with or
  before** `ABC-014` reaches `Done`, never after", while the board holds `ABC-015` in `Backlog`
  with `blocked-until: ABC-014`. Those two read as a cycle. It is BA/PM's to untie before ABC-014
  is pulled, and pulling ABC-014 now would walk into it.
- **ABC-009** (S, P1) — the other rules-core defect, independent of ABC-011 by both tickets' own
  text. Genuinely eligible; held only to keep width at 1 for a single-ticket request.
- **ABC-013** (M, P1) — renderer work below every P0 and below both rules-core defects.

## WIP and width

`In Development` 0/3, `In Design` 0/2, `Ready` 5/8 → 4/8 on this pull. Width scheduled: **1**
against `queue.wip_limit: 3`. **No limit approached, no override taken, no written reason owed.**

## Substrate degradation, recorded not glossed

This install has no `scripts/claim.js` and no `scripts/context-io.ts` / `mcp__grugops__propose_note`
(already recorded in `memory-bank/60-progress.md`). Workflow 17 step 2's atomic claim cannot be
executed and Workflow 16's sanctioned writer does not exist. Consequence, unchanged from every
prior task here: queue files move by hand, notes are hand-written into `notes/` in the schema's
exact shape, and **`finding` is not admissible on this task** — there is no §14 gate to issue a
stamp. Use `decision` / `observation` / `claim` / `artifact-ref`. Never self-stamp.

Scheduling tier for this session: **Reduced** — the `Agent` spawn tool is available, so the queue
is drained in parallel, but this is a default main thread and the role allowlist is not
runtime-enforced. It is honored by instruction. Stated rather than claimed as enforcement.

## Uncommitted state on `main` at pull time

`memory-bank/60-progress.md`, `plans/board.md` and `plans/traceability.md` carry uncommitted edits
from task `refinement-fide-9-6-1`, plus untracked `.grugops/context/refinement-fide-9-6-1/` and
`.grugops/queue/`. They are that task's completed close-out, left uncommitted when the session
cleared. Nothing was committed to `main` here — no one asked. They ride the `ABC-011` branch, which
is the posture every prior task in this repo has used (docs lived on a branch until a human merged
it). Flagged for the owner, not silently absorbed.

## Next action

Architect/Design settles the availability reading on `ABC-011`, moves it `Ready → In Design →
Ready for Dev`, and re-sizes if the strict reading wins. The `Ready for Dev → In Development` pull
after that is the Orchestrator's, deliberately not delegated.
