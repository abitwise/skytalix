---
id: 20260810T214235Z-orchestrator-decision-ea14a979
kind: decision
by: orchestrator
at: 2026-08-10T21:42:35Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-018
  - ABC-019
  - ADR-0009
  - src/frame.test.ts
supersedes: 20260810T212538Z-orchestrator-decision-e94c3970
---

# CONSOLIDATED merge-order decision — the order stands, one of its two reasons does not

Supersedes `20260810T212538Z-orchestrator-decision-e94c3970`. This note is the single live statement of
the merge order, the branch shape, the build order and the owner directive. It exists for three reasons:
to accept a correction from Architect/Design, to record a material change to `ABC-016`'s readiness, and
to repair a note-hygiene error of the Orchestrator's own making (below).

## Note-hygiene error, repaired here

The Orchestrator's supersede chain was wrong. `ac72dd8d` (the original merge-order decision, carrying
the order's full rationale AND the three-branches-not-one pushback) was superseded by `f3bdfe02`, which
was superseded by `e94c3970` — but `f3bdfe02`/`e94c3970` were scoped to the **owner directive** and did
not carry the merge-order rationale forward. Because replay folds out every superseded note, the chain
silently deleted the rationale and the pushback from the live context while the Orchestrator believed it
had preserved them ("supersedes … on the build-order clause ONLY" is prose; the `supersedes:` field is
not clause-scoped and folds the whole note). **A superseding note must carry forward everything it means
to keep.** This note does. Same error shape as the one this project has recorded five times against the
Orchestrator on `ABC-009`: trusting a mechanism without checking what it actually does.

## CORRECTION ACCEPTED — the order is a preference, not a forced constraint

Architect/Design corrected the Orchestrator at `design-frame-contract`. The Orchestrator had recorded
`ABC-016 → ABC-017` as *"Forced by build edges … Not a preference."* Under `ADR-0009` that becomes false,
and the correction is accepted in full.

`ADR-0009` strikes the `frameHeight(...) is 23` clause from `ABC-017`'s `A1` **and** from `ABC-016`'s
`A11`. **That clause was the entire import edge.** With it gone, `A1` keeps only its own row-count clause,
`A11` keeps only its own, neither names the other's constant, and both go green alone.

**One nuance the Orchestrator is adding, not disputing:** the strike has **not been applied yet** — it is
flagged for BA/PM and the ticket text still reads as written. So the edge is real *today* and becomes a
preference *after* BA/PM applies `ADR-0009`. The order stands either way, and the Architect's substantive
point is the one that matters: **stop recording it as a permanent constraint, because a false constraint
is what a later hop plans around.** Recorded as a preference from here.

**What the preference now rests on**, both real: `P1` before `P2`, and it gives the composition fit-check
a definite home — `ADR-0009` puts that check on whichever panel ticket merges **second**.

## Verified independently before accepting

The Orchestrator re-ran the Architect's load-bearing claim rather than transcribing it. `src/frame.test.ts`
asserts the composition identity at `:632` from three **local literals** declared at `:37-43`
(`BOARD_ROWS = 9`, `STATUS_ROWS = 3`, `HISTORY_ROWS = 8`). It is arithmetic on literals and never reads
what the panels ship, so it cannot fail on a panel that changes its row count — the Architect's
"tautology" characterisation is correct as measured. Also confirmed: commit `b1fd0e6` present,
`ADR-0009` `accepted`, `src/` clean with zero untracked files and no leftover `_wb019*` harness.

## MATERIAL CHANGE — `ABC-016` is NOT dev-ready either

The Architect's mutant table found a defect in a **promoted** criterion: `ABC-016`'s `A11` **passes M3
(history ships 10) and M5 (board 10 + history 9)** — the only two of six mutants that push the frame past
24 rows and make epic `4b` unreachable. `A11` was added by `D8` specifically to protect `4b`, and it
cannot fail on the two cases that break it, because it hardcodes `history`. `ABC-017`'s `A1` is blind to
M4 (`board: 9` literal).

This reverses the Orchestrator's earlier characterisation of `ABC-016` as the clean one. It can still go
green alone — that was never the issue — but **it carries a broken acceptance criterion and cannot pass
the `Ready for Dev` gate until BA/PM repairs it.** Both panel tickets now need ticket-text repair, not one.

## The live decision

**Merge order (unchanged, three slots):**

```
ABC-018  ── ALREADY MERGED 2026-08-09 (substrate, not a slot)
   ▼
ABC-016  (M/3, P1)  status panel   ── 1st · preference, not a forced edge
   ▼
ABC-017  (S/2, P2)  history pane   ── 2nd · owes the fit-check per ADR-0009
   ▼
ABC-019  (L/5, P0)  turn loop      ── last · composes the real panels
```

**Branch shape:** two branches for the panels, per `ADR-0009` — NOT one shared branch. The carve-out the
Orchestrator had reserved for a shared branch is closed: it was conditional on the constants having to
land as one contract, and the ruling is that they do not. `ABC-019` on its own branch. **Three branches
total.**

**Why not one branch for all three** (carried forward from the folded-out `ac72dd8d`, still the reasoning
of record): the edges are a chain and never a mutual deadlock; `3 + 2 + 5 = 10` points against an `XL`
ceiling of 8, so a combined branch manufactures the oversized unit `SPLIT_REQUIRED` exists to prevent;
`AGENTS.md` § Branching model requires merging "as soon as it is green," which a shared branch defeats by
holding the fastest ticket hostage to the slowest; and blending three tickets destroys the per-ticket
`src/` byte-identity check that this project uses to prove no gate repaired what it measured.

**Owner directive, Olger Oeselg, 2026-08-11 in session:** *"build ABC-019 in parallel against stubs, merge
it last."* Build order and merge order are deliberately different lines. `ABC-016` and `ABC-019` may build
concurrently once both pass `Ready for Dev`; `In Development` WIP is 3 and two concurrent tickets is 2/3.

**`ABC-019` must be rebased onto merged `ABC-016`+`ABC-017` and RE-GATED before it merges.** Its criteria
that compose the real panels — one render per ply, constant frame row count, and the two requiring a frame
re-emit without re-evaluating `gameStatus` — are close to vacuous against stubs: a stub that derives
nothing trivially satisfies the property `ABC-016` had to delete a `gameStatusOf` call to earn. Green on
stubs is not evidence about the assembled frame.

## Still owed, and it is the Orchestrator's to carry

**The stub-seam question is unanswered.** The Architect's ruling was scoped to two tickets; the owner's
parallel-build directive makes `ABC-019`'s stub panels a third site for both row constants. The
Orchestrator attempted to widen the ruling mid-hop and **`SendMessage` is not enabled in this session**, so
the agent could not be reached (the earlier false claim that it had been told is retracted in
`e94c3970`, and that retraction stands). `ADR-0009`'s "producer owns its count" rule plus the
delivered-code fit-check plausibly covers a stub seam, but **plausibly is not ruled** — it goes to a
wave-2 Architect follow-up rather than being assumed.

## Hard limits held

Nothing merged, nothing deployed, no protected branch touched, no board move taken. Merge and deploy
remain the owner's.
