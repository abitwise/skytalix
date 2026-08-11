---
id: 20260811T220000Z-orchestrator-decision-a91f3c68
kind: decision
by: orchestrator
at: 2026-08-11T22:00:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-019
  - ABC-027
supersedes:
---

# `ABC-016`'s seven closes land; one criterion ambiguity found INSIDE last hop's ruling

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing here is a `finding`.**
> Written BEFORE the subtask that references it.

## Verified, not accepted

| claim | how | result |
|---|---|---|
| zero production lines | filtered the `src/status-panel.ts` diff for non-comment lines | **empty — every changed line is a comment** |
| no behaviour moved | `git diff --numstat` on the snapshot file | **+12 / −0** — additions only, fifteen pre-existing snapshots untouched |
| gates | engineer's figures, to be re-run after rebase | **711/711 on 24 files**, skip 0, lint/typecheck/build 0 |

The snapshot numstat is the harder evidence and I am recording why: a panel whose *rendering* changed
would perturb at least one of fifteen committed snapshots. None moved.

## What the Engineer did that matters

**It refused to trust its own transcription of BA/PM's ruling** and ran 11 mutants with **positive
and negative controls**, out of tree, deleted after. Then it ran two **counterfactuals** to prove the
*change* is what kills rather than the mutant being weak:

- `m23` against the **pre-hop** `A7` fails **0 acceptance criteria and 12 snapshots** — QE's number,
  reproduced exactly by a third party.
- `m49`/`m50` are **green on the pre-hop 0-and-1-ply fixtures and red on the new ones.**

That is the difference between "my tests pass" and "my tests would have failed before and pass now".

## The finding: a defect inside BA/PM's own ruling, handled correctly

**`A13`'s "at every depth asserted" is under-specified at ply 0.** The ply-independent formula BA/PM
wrote — `64 + occupied squares of initialFen` — is **false at ply 0**, where there is no replay and
the count is 64. Implementing the criterion literally **silently deletes delivered coverage.**

The Engineer measured the cost rather than arguing it: a build paying a pointless `parseFen` before
the first move **passes all 29 acceptance and snapshot tests** and is caught only by the assertion
the literal reading would have removed — which is `A13`'s own class of defect.

**It retained the assertion as a separate named test and flagged the ambiguity without amending the
ticket.** That is exactly the boundary: preserve coverage, do not silently reinterpret a criterion,
and hand the wording back to its owner. Routed to BA/PM.

## Board

`ABC-016`: `In Development` → `In Review`. In Development 2/3 → **1/3** (`ABC-019`), In Review 1/3 →
**2/3** (`ABC-027`, `ABC-016`). Forward: the closes are written and they run.

## Where `ABC-016` stands relative to merge

It merges **first of four**, so everything waits on it. Remaining before it can merge:

1. **This `A13` ply-0 ruling** — routed now, the last known open item on its criteria.
2. **A Security/NFR gate** — its `A14` performance bar is a live trigger, and every ticket in this
   project's history has taken that gate.
3. The merge itself, which is the owner's standing authorization plus a green gate on both sides.

I am **not** re-running a full QE pass on the closes. QE's 51-mutant pass already ran; the Engineer
then reproduced QE's own counterfactual number independently and controlled its mutants both ways.
A third full net over the same surface would be ceremony, and I would rather spend the slot on the
criterion ambiguity that is actually open.

## Scheduling

Width **3 of 3**: QE on `ABC-027`, Engineer on `ABC-019`'s `A10b`, BA/PM on this `A13` ruling.
The two Architect/Design documentation items remain queued and undispatched.
