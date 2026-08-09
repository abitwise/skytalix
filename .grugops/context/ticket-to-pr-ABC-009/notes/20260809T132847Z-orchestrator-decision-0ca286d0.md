---
id: 20260809T132847Z-orchestrator-decision-0ca286d0
kind: decision
by: orchestrator
at: 2026-08-09T13:28:47Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - NFR-001
  - NFR-005
  - plans/nfr-catalog.md
  - plans/board.md
  - src/moves.ts
  - agent-factory/workflows/04-ticket-to-pr.md
supersedes: 
---

# Security/NFR pass accepted. One routed item still open — BA/PM's criteria text — before this closes.

`PASS WITH RISKS`, `In Security/NFR` → `Ready for UAT`, ten accepted risks, none high, no required fix
outstanding. Accepted, on checks I ran.

## Verified at the source

`main` still `aad6d48`. `git diff --stat 15cf580 -- src/` **empty** — the gate changed no code and no
test, as its role requires. `## Acceptance` **byte-identical** (`f1365acff747ef1482672aea4f4be06d`
before and after), so the criteria text was routed to BA/PM and not self-edited — the same seam QE
honoured, honoured again. `plans/nfr-catalog.md` changed **2 insertions / 2 deletions of 545 lines**, no
target moved. Board `In Security/NFR` 1/2 → 0/2, `Ready for UAT` 0/4 → 1/4.

**Full mandatory gate re-run by me on the branch tip**, not read off the hand-back:
`lint 0 · typecheck 0 · npm test 356/356 on 16 files · build 0 · skip count 0`.

## The gate did something better than it was asked to

It was asked whether the engineer's ±1% instrument-floor reasoning holds. It answered yes, measured the
floor **wider** than the engineer had (±2.0% per cell, not ±1%), characterised an **aggregate** floor
nobody had, and then **refused to leave the question on the clock at all** — it moved it onto a
**count**, which is the move `plans/nfr-catalog.md` already made for `NFR-005`'s sub-bar:

```
the two added lines execute 198,175 times each (396,350 total) over 11,377,922 nodes
they reject NOTHING in any cell — 0 rejects, empirically confirming over 11.4M nodes
  that makeMove only ever CLEARS castling rights
isolated per-call cost +1.30 / +1.73 ns against a ±0.22 ns null floor
arithmetic (labelled as arithmetic): 0.0070%-0.0091% → true ratio ≈ 0.9999
kiwipete's true ratio ≈ 0.9998 — so the 0.9930 clock reading is ~35x the true deviation
robust to a 10x multiplier error
```

The engineer's conclusion is now **positively established rather than merely unrefuted**. That is the
difference between "the instrument cannot see a regression" and "there is no regression to see," and
only the second one is worth carrying into `EPIC-004`.

It also **corrected the engineer in the right direction**: *"0.9930 is NOT a regression"* is stronger
than a noise floor licenses — a floor licenses only *"cannot resolve whether it is."* The count
argument is what earns the stronger claim, and the gate got there in that order.

Two honest disclosures I want preserved because both cut against the gate's own result: its lowest
`npm run perft` run sits **0.16% under** the catalog's standing 6.04M–6.21M band (recorded as scatter,
no baseline moved, not rounded in), and the **+0.9% systematic** it found in three of four aggregate
twin readings across two gates is one it says plainly it **cannot attribute**.

## Guard ordering: discharged, and reshaped rather than answered

QE routed this as gate-unverifiable. The gate discharged the behaviour half by **restating QE's
mechanism as a conjunction of side-effect-free predicates over an unmutated position** — verified
(`isSquareAttackedBy` / `raySliderAttacks` perform no writes; `board` is a `readonly Uint8Array(128)`
with frozen in-bounds table indices, so no guard depends on an earlier one for safety) — hence
**permutation-invariant**, measured over 99 comparisons on 33 FENs with zero divergence and all six
perft counts exact per variant. **So no later reorder can silently break the equivalence QE relied
on.** That converts a standing hazard into a property, which is strictly better than accepting it as a
risk.

On cost it **disagreed with the engineer** and was right to: on the population `NFR-001` measures the
added guards are **0.0% selective** (0 rejects of 198,175 each) against 17.6% / 14.1% for `empty` and
the through-check, making the delivered order the second-most-expensive of four — and it asked for **no
change**, because it is ~0.003%. Correct proportionality: name the sharper reason, do not spend a
change on it.

Security classification re-asked with grep evidence and unchanged: **reliability, not security**. The
one security-adjacent property — DoS-shaped cost on malformed input — comes out **in the change's
favour** (18x cheaper on the invalid class). ASVS L1 checked: V16/V17 carry zero L1 rows. No trigger
manufactured, which is what the ticket asked for.

## Why this does NOT go to Done yet

**BA/PM's criteria-text hop is still open, and two independent roles routed it there.** QE routed
`G-1` / `G-2` / `A7`; Security/NFR carried them forward as accepted risks explicitly *not* discharged
and left `## Acceptance` untouched on purpose. The tests cover `G-1` and `G-2`; the **criteria do
not**, and `A7` is measured inert across 62 mutants. Closing now would ship a ticket whose acceptance
text does not describe what its own suite verifies — on the ticket whose entire subject is a documented
invariant that was not an invariant. That is the one shape this ticket may not end in.

Enqueued: `ticket-to-pr-ABC-009-bapm2` → BA/PM. Still **serial at width 1** for the reason recorded
earlier: the same `plans/traceability.md` row. Nothing else is in flight; `pending/` and `claimed/`
were empty at this decision, no stale-claim sweep owed.

**After it: the UAT question, then merge and close — and neither is taken here.** `ABC-011`'s row
defers UAT to `EPIC-006` for rules-core work with no user surface, which is likely the right reading
here too, but it is a reading I have not yet made at the source. The merge authority is the owner's
standing directive in `memory-bank/60-progress.md` and I have not yet re-read it; its three limits
(deploy excluded, gate binds, gates run and recorded on both branch tip and `main`) apply whatever it
says. **Nothing merged, nothing deployed.**

## What this note does NOT establish

- **That I re-derived the gate's counts.** I did not instrument `addCastlingMoves`, did not run
  `npm run perft`, and did not run the deep lane. The floor, the ratio, the 198,175 figure, the ns
  costs and 32/32 are all the gate's — a third independent 32/32 after the engineer's and QE's.
- **That ten accepted risks is the right number.** I checked that none is high-severity and that each
  carries an owner. I did not re-adjudicate them individually.
- **The UAT ruling.** Not made here, on purpose.
