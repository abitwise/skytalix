---
id: 20260810T203213Z-architect-design-claim-1406114f
kind: claim
by: architect-design
at: 2026-08-10T20:32:13Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-026
  - NFR-008
  - ADR-0008
  - EPIC-003
  - EPIC-004
  - EPIC-005
  - EPIC-006
  - plans/board.md
supersedes: 
---

# CLAIM, not a finding: **the currently-planned work lands the lane at ~3.5 s wall / ~20 s CPU, so `NFR-008` will be breached by the plan as it stands**

**This is the weakest link in the whole hop and it is published separately so it can be attacked
separately.** It is **arithmetic over measured marginals multiplied by an ESTIMATED ticket count**,
and it is labelled arithmetic. `confidence: UNKNOWN - verify`. **Nothing in `NFR-008`, `N8-LANE`,
`ADR-0008` or the per-file floor depends on it being right** — those rest on measurements in the
`observation` note beside this one. What depends on it is the claim that **the budget binds**, which
is the argument for the hop having been worth taking.

## The arithmetic, so it can be re-run rather than believed

**Measured inputs (from the `observation` note, this machine, this session):**

```
per test file            ~160 ms CPU   /  ~30 ms wall  (band 100-229 ms CPU, -15 to +46 ms wall)
content per file today    3.3 s CPU over 22 files      =  ~150 ms CPU per file, averaged
today's lane              1.565-1.765 s wall  /  7.205-7.640 s CPU
```

**ESTIMATED input, and this is the soft one:** the number of test-adding tickets the plan still
contains. `Backlog` + `Ready` hold **7 named tickets** (`ABC-010`, `ABC-016`, `ABC-017`, `ABC-019`,
`ABC-021`, `ABC-024`, `ABC-026`) and **4 undecomposed epics** (`EPIC-003` M, `EPIC-004` L,
`EPIC-005` S, `EPIC-006` M). The only epic this board has decomposed, `EPIC-002` (XL), produced
**nine** tickets. Estimating M→4, L→6, S→2, M→3 gives **≈22 tickets**, at ~2 test files each ≈ **40
more test files**.

```
floor      40 files x 160 ms CPU  =  +6.4 s CPU   |  40 x 30 ms  =  +1.2 s wall
content    40 files x ~150 ms CPU =  +6.0 s CPU   |  parallelised, ~+0.7 s wall
-------------------------------------------------------------------------------
projection   7.6 + 6.4 + 6.0  =  ~20 s CPU        |  1.8 + 1.2 + 0.7  =  ~3.6 s wall
NFR-008                          <= 13 s CPU                            <= 3 s wall
```

**So the plan as it stands overshoots both clauses by ~1.2x**, and the two available levers
(`pool: "threads"` at −11% CPU / −14% wall, measured; per-file isolation at −31% CPU, measured but
**not available**) are between them roughly the size of the overshoot.

## Every way this could be wrong, named

1. **The ticket count is a guess.** 22 could be 12 or 35. It is the largest single source of error
   and it is a *plan* estimate, not a measurement. `EPIC-004` (engine search) in particular could add
   one very expensive file or eight cheap ones.
2. **"~2 test files per ticket" is a guess.** `ABC-025` added 2; `ABC-013` added more; several
   tickets on this board added 1.
3. **"~150 ms CPU of content per file" is an AVERAGE over today's 22 files and the distribution is
   violently skewed** — `perft.test.ts` alone is 39.5% of suite test time. A single future ticket of
   `perft.test.ts`'s shape moves this projection more than five ordinary ones.
4. **Wall is not additive.** It grows in a sawtooth with a ~70–75 ms step at each multiple of the 7
   default workers; treating it as `40 × 30 ms` is a smoothing that is right on average and wrong at
   every individual point.
5. **The absolute base drifts ±22% with thermal state** on this machine alone.
6. **One machine.** `UNKNOWN - verify` on any other hardware or core count.

## What would turn this into a finding

**Nothing available today, and that is the honest answer.** It cannot be measured until the tickets
exist. What can be done instead, and what `N8-LANE` is for: **measure each ticket's actual draw
against the budget at its own gate and keep the running total.** After five tickets the projection
becomes an extrapolation from five real points instead of from an estimate, and this claim can be
retired rather than argued about.

**Owner: BA/PM** (who holds the plan and the per-ticket bar). **Trigger: the fifth ticket gated
under `N8-LANE`, or any decomposition of `EPIC-003` or `EPIC-004` — whichever comes first.**
