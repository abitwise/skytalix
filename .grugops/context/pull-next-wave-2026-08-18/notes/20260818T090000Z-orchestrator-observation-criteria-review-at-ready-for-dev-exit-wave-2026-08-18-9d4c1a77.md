---
id: 20260818T090000Z-orchestrator-observation-criteria-review-at-ready-for-dev-exit-wave-2026-08-18-9d4c1a77
kind: observation
by: orchestrator
at: 2026-08-18T09:00:00Z
refs:
  - ABC-103
  - ABC-106
  - ABC-104
  - src/cli.test.ts
  - src/san.parse.test.ts
  - src/coordinate-move.ts
confidence: high
verified_by:
supersedes:
---

# Criteria re-read at the `Ready for Dev` exit, wave of 2026-08-18

`AGENTS.md` § Process rules 1. Every line below was read from the tree at `main` `7ea9e1b`, not from
the ticket page.

## `ABC-103` — the page's numbers are BOTH stale, and the staleness is the ticket's own thesis

| the page says | the tree at `7ea9e1b` |
|---|---|
| defect at `src/cli.test.ts:733` | **line 738** |
| the row asserts `toHaveLength(20)` | the row asserts **`toHaveLength(23)`** |
| the row reds on every new module | **currently GREEN** — `ls src/*.ts \| grep -v '\.test\.ts$' \| wc -l` = **23** |
| "already cost two hops in one day" | **at least FIVE now** — 20 → 23 is three further hand-bumps since the cut |

**This does NOT weaken the ticket; it is three fresh confirmations of it.** The literal moved three
more times by hand in four days, which is precisely the recurring self-inflicted red the ticket
exists to remove. **The correct reading is "the evidence grew", not "the defect went away."**

**The engineer was told to locate the row by SHAPE — `expect(productionModules()).toHaveLength(<N>)`
— never by line number**, and told not to repair the ticket page silently. Line-number fences are
what cost `ABC-061` its whole re-read; this project has that on record.

## `ABC-106` — holds, with a one-line drift

Cites `src/san.parse.test.ts:382-389`; the `CHARACTERIZATION, not a demanded tolerance` docblock
measures at roughly **381-388**, immediately above
`describe("undisclosed input widenings, pinned so a ruling has something to rule on", …)`. **Text
found, region off by one — located by text in the dispatch, so it costs nothing.** The block's own
sentence *"whoever rules on them — BA/PM owns the page — is ruling on behaviour that is written
down"* is now FALSE by its own terms: the ruling landed at
`refinement-abc032-tolerances-2026-08-18`. **The ticket is a page catching up with a ruling, which
is the cheapest kind of correct.**

## `ABC-104` — holds exactly, and is NOT in this wave

`src/coordinate-move.ts:30` reads *"It is a TOTAL function and does not throw"* — **line number and
wording both exact, the only page of the three whose citation did not drift.** Not pulled: `P3`, and
`queue.wip_limit` is **3**. Deferred deliberately, recorded so it is not mistaken for dropped.

## What this wave is, and what it is NOT

Two `P2` engineer hops (`ABC-103`, `ABC-106`) and one BA/PM re-score of the `P0` chain
(`ABC-033`, `ABC-034`, `ABC-078`, `ABC-079`). **The `P0` chain is NOT being built this wave, and
that is the honest reason: all four carry DoR ⚠️ whose stated cause was ordering on tickets that
have since merged, and the Orchestrator does not re-score another role's DoR** — this board records
that rule on its own `ABC-036` row. **Pulling a `P0` at 7/10 because it is a `P0` is how a DoR
becomes decoration.**

`ABC-078` ⚠️(10) will likely SURVIVE the re-score whatever BA/PM finds: `NFR-004`'s verification is
machine-dependent and gated on `ABC-074`, which sits in `Blocked` on hardware that does not exist
here. **That is a verification blocker, not a build blocker, and BA/PM was asked to say which —
because collapsing the two is how `UNKNOWN - verify` turns into a false pass.**

## Not actioned here

Four stale git worktrees remain checked out under `/private/tmp/.../scratchpad/` on **fully merged**
`ABC-065`/`ABC-066` branches. No work is at risk. **They leak a nested `biome.json` that reddened
`npm run lint` on 2026-08-17**; all three agents were warned it is an environment artifact, told to
scope-check with `npx biome check src/`, and told NOT to patch `biome.json`. **Not pruned: they are
the owner's checkouts and removing them was offered, not assumed.**
