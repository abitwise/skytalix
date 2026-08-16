---
id: 20260816T040000Z-orchestrator-decision-the-refinement-pass-scheduled-and-why-the-agents-may-not-touch-git-4b1e9a72
kind: decision
by: orchestrator
at: 2026-08-16T04:00:00Z
verified_by: 
confidence: high
refs:
  - .grugops/context/pull-abc065-066-2026-08-16/notes/
  - .grugops/queue/pending/
  - plans/board.md
supersedes: 
---

# The refinement pass, scheduled three-wide — and the one shared resource I took away from the agents

## Tier, said rather than claimed

**Reduced.** The `Agent` spawn tool is available, but this is a default main thread, so the role
allowlist is honoured **by instruction and is NOT runtime-enforced**. Width held at
`queue.wip_limit` = 3; `claim_cap` = 2 and each agent holds 1.

## Classification

`refinement` → `agent-factory/workflows/07-backlog-refinement.md` → BA/PM ×3. The previous hop's own
closing line asked for exactly this and declined to write it; the ten items were routed to BA/PM
across four hops and had accumulated with no pass scheduled.

## The schedule, and the thing that decided it

The last hop's hard-won lesson was that its parallel schedule was **right about FILES and wrong
about the GIT INDEX** — one working tree, one index, two hops hitting it independently. Refinement
is worse than that lesson allows for, because it has a second shared resource the file-level
argument does not see: **the ticket ID counter.** Three BA/PM agents cutting tickets concurrently
would each reach for "the next free `ABC-`" and collide on the number, not the file.

So I removed both shared resources from the agents rather than asking them to be careful with them:

1. **Pre-allocated, disjoint ID ranges**, written into each subtask file and repeated in each
   spawn prompt: `ABC-067`; `ABC-068`–`ABC-071`; `ABC-072`–`ABC-074`. Next free id measured as
   `ABC-067` (`plans/tickets/` tops out at `ABC-066`).
2. **No git at all for the agents** — no `add`, `commit`, `branch`, `worktree` or `checkout`. The
   index is untouchable by them, so it cannot race. I commit once, at the end, on
   `grugops/refinement-2026-08-16`.
3. **`plans/board.md` and `plans/traceability.md` are mine.** All three would otherwise append rows
   to the same two files. They report the row they want; I append it.

That leaves each agent writing only its own ticket pages and its own `notes/` folder — genuinely
disjoint paths, which is the condition the last hop's schedule assumed and did not have.

## Base staleness — the error I made last hop and did not repeat

Last hop `base:` was stale in both subtask files because my board-move commit landed after I wrote
them, and both agents hand-corrected it. This time the branch was cut FIRST and the subtask files
name `branch: grugops/refinement-2026-08-16`, `base: main @ 5cf86d3` — the branch's actual base,
still true after my own queue commit `35442de` because that commit is ON the branch, not under it.

## What I instructed and what I refuse to pre-judge

Each subtask says **dedupe against the live Backlog before cutting anything**, and says in plain
words that **fewer tickets than items is a good outcome** — for the `ABC-066` lane, that **zero new
tickets is acceptable and honest** if all four fold into `ABC-058`, which already carries `S1`/`Q5`.
Ranges are ceilings, never quotas. An agent that manufactures a ticket to fill its range has failed
the pass, and I said so rather than leaving it to be inferred.

I did NOT pre-decide any of the ten. `Q10`/`G8`'s repair — re-word `A2` in place on a merged ticket,
or cut a new one — is explicitly left to BA/PM, with the honesty condition attached: if a merged
criterion is re-worded after the fact, the ticket must SAY so, so nobody later reads a retrofitted
criterion as one the build hop actually met.

## The one live consequence I flagged rather than buried

`S1` is not an ordinary wording item. Its state-vs-delta reading of `ABC-041` clause (b) is what I
used three hours ago to justify **skipping Security/NFR on `ABC-065`**. If refinement finds that
reading wrong, a gate was skipped on a false premise. The subtask says this in those words, and its
stop condition sends `S1` back to Security/NFR rather than letting BA/PM overturn a risk verdict.

## Board

No column moved. Refinement produces Backlog rows (unlimited) and `Ready for UAT` stays 2/4 —
`ABC-065` and `ABC-066` still await UAT and this hop does not touch them.
