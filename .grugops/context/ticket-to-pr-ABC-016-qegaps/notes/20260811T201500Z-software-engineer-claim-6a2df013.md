---
id: 20260811T201500Z-software-engineer-claim-6a2df013
kind: claim
by: software-engineer
at: 2026-08-11T20:15:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-016
  - A13
  - D22
supersedes:
---

# ONE judgement call in this hop, and it is a `+1` test the work list did not ask for — flagged for BA/PM

> **Hand-authored.** A `claim` rather than an `observation`, and the split is the one QE and BA/PM
> both drew on this ticket: **the measurement underneath is not in doubt** — it is in this hop's
> `observation` note and it was run — but *"this assertion should be kept"* is a judgement about a
> criterion BA/PM owns. `confidence: UNKNOWN - verify` is on the **disposition**, not on the reading.

## What I did, and why it is not on the work list

`A13`'s scan clause now reads **"measured at a ply depth of AT LEAST 2 … the spied `squareAt` count
for one render is `64` plus the number of occupied squares in `history.initialFen`, at every depth
asserted."** Implementing that literally **removes the delivered assertions at depth 0**, because at
depth 0 the two disagree: `lastMoveSan` returns before it reaches `parseFen`, so there is no replay
and the count is **exactly 64** — not `64 + occupied`. The formula is true from ply 1 on and false
at ply 0, and BA/PM's own measurement table never claims it at 0.

My first edit dropped those assertions. **I put them back, as a separate test named for the property
it protects** (`"pays no replay at all before the first move"`), commented explicitly as **not** the
ply-independent formula.

## Why — and this half was measured, not argued

Dropping them leaves a real regression invisible. A panel that pays a **pointless `parseFen` before
the first move** emits identical rows, and its counts at every depth ≥ 2 are unchanged, so nothing
sees it. Built and run out of tree:

```
mEMPTY  (a wasted parseFen on an empty history)
  src/status-panel.test.ts      29 passed  — ALL acceptance criteria and ALL snapshots GREEN
  src/status-panel.nfr.test.ts   1 failed  — only "pays no replay at all before the first move"
```

**That is `A13`'s own class** — a cost regression no output can reach, which is the entire reason
the criterion is a call count. Removing the only assertion that catches it, on the hop where this
file becomes `ABC-017`'s, `ABC-027`'s and `ABC-019`'s regression net, is the `D17` fault in the
direction nobody checks: not a criterion claiming cover it lacks, but a suite quietly losing cover
it had.

## The ambiguity I am flagging, and what I did NOT do about it

**I did not amend the ticket.** BA/PM owns these criteria and the brief's stop condition is explicit.

The ambiguity is in *"at every depth asserted"*. Two readings:

1. **It scopes the formula to the depths this clause asserts (≥ 2).** A depth-0 assertion of a
   different, correctly-derived quantity is additional coverage and violates nothing. **This is the
   reading I implemented.**
2. **It binds every `squareAt` assertion in the file.** Then my retained test contradicts the
   clause, because it asserts `64` where the formula says `64 + 3` and `64 + 32`.

Under reading 2 the criterion would forbid an assertion that catches a build nothing else catches,
which is why I think reading 1 is the intended one — the clause's stated purpose is to stop the
depth defaulting to whatever fixture is nearest, not to ban ply 0. **But a reader who takes reading
2 is not obviously wrong, and one line in `A13` would settle it.** BA/PM's call, not mine.

**I am not claiming this is a defect in the amendment.** It is under-specification at an edge BA/PM
had no reason to visit, and it is recorded here rather than resolved silently, because a silent
resolution is exactly how a suite loses an assertion nobody notices was load-bearing.

## What is NOT in doubt

Everything in the `observation` note: the twelve mutant kills, the two counterfactuals, the gate
results, and that the fifteen pre-existing snapshots are byte-identical. Those were run.
