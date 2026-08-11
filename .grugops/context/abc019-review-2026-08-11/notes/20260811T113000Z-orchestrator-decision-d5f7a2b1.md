---
id: 20260811T113000Z-orchestrator-decision-d5f7a2b1
kind: decision
by: orchestrator
at: 2026-08-11T11:30:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-019
  - ADR-0009
supersedes:
---

# `ABC-019` → `In Review`; the seam signature ruled a TICKET defect, not an ADR re-opening

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. Precedent for saying so:
> `.grugops/queue/done/refinement-ABC-019/claim.md`. **Nothing here is a `finding`.**

## Verified, not accepted

| claim | how I checked it | result |
|---|---|---|
| gates green | re-ran all four **in the worktree** | lint/typecheck/build **0**, **715/715 on 24 files**, skip **0** |
| seam signature is short | read `A5` at `plans/tickets/ABC-019-turn-loop-skeleton.md:432` | **CONFIRMED** |
| `ADR-0009` states 3 args | read cl. 9b at `ADR-0009:394-399` | confirmed — **and it defers to the ticket** |
| file boundary held | `git diff --name-only` over the branch | no `src/status-panel.*`, no `src/frame.test.ts`, no `plans/board.md` |
| stubs not in `src/` | read the delivered test file | both shapes local; no `src/panel-stubs.ts` — cl. 9c honoured |

## The ruling I made, and the one I refused to make

`A5` requires the ambiguity candidate list to reach **the frame's message region**, and `## Scope`
states there is no second output channel. A three-argument seam cannot satisfy it. The contradiction
is real and it is between the ticket's own `## Scope` and its own `A5`.

**I routed this to BA/PM and explicitly did NOT re-open `ADR-0009`.** The reason is in the ADR's own
text: cl. 9b says *"this is not a new seam: it is the seam that ticket already specifies"* — it
**quotes** the signature from the ticket rather than deciding it — and clause 9's actual ruling is
that the **row count** must not cross the seam. A `messages` argument does not carry a row count, so
the ruling is untouched. The signature's home is the ticket; the ticket is BA/PM's.

**What I did not decide:** whether the ADR's *quotation* is now stale enough to owe an
Architect/Design follow-up. That is a judgment about an Architect artifact and I asked BA/PM to state
it either way rather than deciding it myself or letting it go unowned.

## Why QE is still held on both tickets

`ABC-016` has one unsatisfiable criterion; `ABC-019` has three defective ones. QE's value here is its
mutant net, and a net built against criteria that are about to move is discarded work. This board has
already recorded the general form of the mistake — a warning owned only by a gate that runs after the
work arrives too late. Both tickets also have exactly one worktree each, so QE and BA/PM cannot run
on the same ticket concurrently without reproducing `2cd84cd`.

## The concurrency experiment, measured

Two engineers, two worktrees, two branches, one shared board. Outcome:

- **Zero file collisions.** Neither branch touched the other's module, `src/frame.test.ts`, or
  `plans/board.md`. The boundary I set at the scheduling hop held without either agent negotiating.
- **Zero index sweeps.** Both used explicit `git commit -- <paths>`; no commit picked up a stray file.
- **Both delivered green.** 707/707 and 715/715 against a 676/676 baseline.
- **Cost:** both branches now owe a rebase because board moves advance `main`. That is the price of
  keeping `plans/board.md` on `main`, and it is cheaper than a `board.md` conflict between branches.

I am recording this because the concurrency was an owner directive and the next person deciding
whether to run 2-of-3 again should have the measured result rather than my impression of it.

## Board

`ABC-019`: `In Development` → `In Review`. **In Development 0/3 — empty. In Review 2/3.**
Ready for Dev 1/6 (`ABC-017`, untouched and still owing the cl. 5 fit-check).

## Not done

- Nothing merged, nothing deployed, nothing pushed.
- No `src/` byte written by me.
- No criterion amended by me, and `ADR-0009` not edited.
- **Nothing relayed between the two engineers**, and nothing relayed to either BA/PM hop beyond what
  is on disk. Both engineers independently noted items the other's ticket is owed; both went into
  notes as flags, not into messages.
