---
id: 20261012T062100Z-software-engineer-decision-abc116-settle-and-surface-wording-16a8ee37
kind: decision
by: software-engineer
task: fix-ABC-116
at: 2026-10-12T06:21:00Z
verified_by:
confidence: high
refs:
  - ABC-116
  - QE-116-a
  - QE-116-b
  - ADR-0017
  - G-QE115-3
  - src/cli.test.ts
  - 20261012T061500Z-qe-e2e-decision-abc116-verdict-17cab375
supersedes:
---

# SE `fix-ABC-116`: how the `T2` carrier now names the settle and where it sits

Commit `be6882b8`, `grugops/ABC-116-t2-carrier`. Comment lines only.

## QE-116-a: the settle is not `timeout`

I checked both facts in `src/cli.test.ts` before rewording.
- `timeout` is the `spawnSync` hang bound. `childOf` passes `timeout: options.timeout ?? 30_000`, and
  the field's own JSDoc calls it "the bound".
- The settle is `A9_SETTLE_SECONDS` (`const A9_SETTLE_SECONDS = 0.6`). It is a `sleep` inside A9's
  `/bin/sh -c` argv (`{ sleep ${A9_SETTLE_SECONDS}; echo zz; … }`). A9's `timeout` is a different
  constant, `A9_BOUND_MS`.

**Decision.** Point (i) now reads "its settle (a `sleep` in a child's shell argv, e.g.
`A9_SETTLE_SECONDS`) fires `T2`; `timeout` is the hang bound, not the settle".

**Whether a change to the hang bound also fires `T2` is NOT ruled here.** `ADR-0017` decision 2 and
`plans/nfr-catalog.md` § `G-QE115-3` list four things: argv, stdin script, substitution hook and settle.
Neither mentions the bound. QE's suggested wording, "or its bound (`timeout`)", would add a fifth
trigger that no ruling makes, so I did not use it. The comment states only that `timeout` is not the
settle, which is a fact of the code. **Open question for BA/PM, and for Architect/Design as the owner
of `ADR-0017`:** does changing a child's `timeout` fire `T2`? A bound sits two orders of magnitude
above the child's cost, so it should not change what a passing child costs. But a lowered bound can
turn a slow child into a red row, and the ruling does not say.

## QE-116-b: "the surface such a hop has to edit" overclaimed

**Decision.** The sentence now says that the block is written "on the options type of `childOf`,
which every child spawns through". It adds that the edit itself lands elsewhere: "in a `CHILDREN`
entry below (e.g. `black`'s hook) or in a constant a child's argv reads (e.g. `A9_SETTLE_SECONDS`),
not in this block".
- I checked that every child spawns through `childOf`: `spawnSync(` appears once, inside `childOf`.
  `run`, `play`, A9's builder and the `CHILDREN` entries all call it.
- I did not add one-line pointers at `CHILDREN` and `A9_SETTLE_SECONDS`. That choice belongs to the
  Orchestrator or BA/PM (QE said so), and it would add carriers the ticket did not scope.

## `C2` is not edited

The ticket does not say the Engineer may edit `C2`, so I left it alone. Two of its sentences are named
for BA/PM:
- "`timeout` (the settle)" is the source of QE-116-a.
- "the reader and the trigger-er are the same agent by construction" is weaker than written
  (QE-116-b). That bears on the size/priority argument.
