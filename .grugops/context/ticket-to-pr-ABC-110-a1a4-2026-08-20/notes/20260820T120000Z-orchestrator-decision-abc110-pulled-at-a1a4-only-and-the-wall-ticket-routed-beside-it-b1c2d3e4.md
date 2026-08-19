---
kind: decision
role: orchestrator
task: ticket-to-pr-ABC-110-a1a4-2026-08-20
at: 2026-08-20T12:00:00Z
id: b1c2d3e4
---

# `ABC-110` is pulled at `A1`–`A4` ONLY, and the wall-clause ticket is routed beside it, not after it

## What I pulled and what I did not

`ABC-110` scores **DoR 8/10 ⚠️x2** and BA/PM wrote **"NOT READY TO PULL AS A WHOLE"** on the page.
I did not override that and I did not pull it whole. **I pulled the part BA/PM certified pullable —
`A1`–`A4` — and left `A5`–`A9` unqueued**, because both ⚠️ (items 3 and 10) are about what comes
after `A4` and neither touches the measurement work.

**Item 10's blocker is a HUMAN DECISION, not a missing input**, so no amount of agent work discharges
it. `A1`–`A4` produce exactly the artefact the owner needs to take it. That is the whole shape of
this pull: **run to the fence, stop at the fence, hand him a sized choice.**

## Why the wall ticket goes in the SAME wave, not first

BA/PM recommended the wall-clause ticket "FIRST OR IN PARALLEL". I chose **parallel**, and the reason
is that the dependency is narrow: the warm/cold protocol is an input to **`A6`**, which is not in
this pull. `A1`–`A4` measure **CPU deltas**, and no CPU figure waits on a wall protocol. Serialising
them would have bought nothing and cost a hop.

## Width and WIP

Two agents, against `queue.wip_limit` 3. `In Development` was 0/3 and `Ready for Dev` 0/6 — no limit
is near. `In Review` holds `ABC-043` at 1/3 and stays there; **`Ready for UAT` is 4/4 at its limit**,
which is the standing reason `ABC-043` cannot advance. That is unchanged by this wave.

## The board move I am deliberately NOT making yet

`ABC-110` stays in `Backlog` for now. The `Backlog → In Development` move is mine to make, but
**BA/PM is writing a new Backlog row into `plans/board.md` on its own branch in this same wave** —
writing my column move into `main` concurrently would manufacture a conflict in the single source of
WIP truth for no gain. **I move it when the wall-clause branch lands, and the row will say it was
pulled at `A1`–`A4` under this note.** Recorded rather than silently deferred.

## What I told both agents to refuse

Repeated to both because this backlog has caught it before: **no agent moves `NFR-008`'s 3 s or 13 s
level** — that is the owner's outright — and **`isolate: false` is unavailable** per `ADR-0008`,
written into the QE brief for the fifth time so it is not rediscovered a sixth. Both were told the
eight `NFR-001`–`NFR-008` rows must hash `sha256 63f66795…ca31` unchanged across their diffs, and to
**verify it rather than promise it**.

I relayed no data between them. Each was given `ref:` and `parent_ref:` and reads the shared context
itself.
