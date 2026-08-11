---
id: 20260811T191500Z-orchestrator-decision-5f2a8c71
kind: decision
by: orchestrator
at: 2026-08-11T19:15:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-019
  - ABC-027
  - ADR-0010
supersedes:
---

# `ABC-016` back to `In Development` for the seven gap closes

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing here is a `finding`.**
> **This note was written BEFORE the subtask that references it was enqueued** — the standing
> correction from `.grugops/context/abc016-qe-gaps-2026-08-11/notes/…failed-attempt…`.

## Verified, not accepted

| claim | how | result |
|---|---|---|
| BA/PM wrote no `src/` | `git diff --name-only` over its commit | 8 files, none under `src/` |
| the 4th stale-comment site is real | read `src/status-panel.test.ts:263-265` | **confirmed** — still asserts the panel's widest row IS the frame's `W` and "makes the whole frame breathe", which `ADR-0010` refuted, **on the criterion this amendment rewrites** |
| my `parent_ref`s were dangling | `ls` the three paths | **confirmed — my defect**, see the `failed-attempt` note |

## Why I took BA/PM's replacements over QE's own closes

QE is the role that found the gaps, so overriding its proposed *closes* needs a reason better than
seniority. The reason is measurement: **QE's `G1` close kills 1 of 5, not the 3 it claimed**, because
the three `CASES`-iterating criteria assert purity, row count and ASCII and **none asserts content**.
`m06` — the sharpest build in QE's own report, 378/400 games diverging — walks straight through it.

BA/PM's replacement is cheaper *and* stronger: no new `CASES` entry, 5 of 5 killed, subsumes `G2`.
And it is better in a way that matters for the next three tickets: **it names no row index and no
frame-level term**, so it satisfies `ADR-0010` cl. 5 without pinning a layout the ticket deliberately
leaves to the engineer. QE's row-3 form would have pinned it. I have told the Engineer not to add a
row index back.

## The board move

`In Review` → `In Development`. In Review 2/3 → 1/3, In Development 1/3 → **2/3**. **Backward, and
the second time for this ticket.** It is correct for the same reason as the first: the closes are
unwritten fixtures, so `A2`, `A5`, `A7`, `A9` and `A13` are not yet satisfied by anything that runs.
Unlike the QE-gap hop — where all written criteria were met and the criteria were merely *incomplete*
— these criteria now exist and are unmet.

`ABC-016` merges **first of four**, which is why this is being paid down now rather than carried.

## My own defect this hop

I enqueued three subtasks whose `parent_ref:` pointed at folders I never created, while instructing
every agent that the on-disk context is the only channel. **An empty `parent_ref` pushes a role
toward reconstructing intent from its prompt — the relay I forbid.** Full account in the
`failed-attempt`. Fixed, and no `decision` was backfilled into the two other folders: dating one
after the fact to look like the input the agent should have had would be a fabricated trail.

## Scheduling

Width **3 of 3**: Engineer on `ABC-016`'s closes, Engineer on `ABC-027`, BA/PM on `ABC-019`'s eight
gaps. One worktree each.

**`ABC-016` and `ABC-027` are both live and both are told to stay off the other's files** —
`ABC-027` owns `src/frame.ts` and `src/frame.test.ts`; `ABC-016` owns `src/status-panel.*`. That
boundary has held through four concurrent hops so far and is checked at every merge.

The two Architect/Design items (`ADR-0009` cl. 9b + evidence (vii); `ADR-0010`'s `## Consequences`,
now with a third correction from BA/PM) remain **queued and undispatched** — documentation accuracy
on accepted ADRs whose rulings are unaffected, and no free slot that would not displace work.
