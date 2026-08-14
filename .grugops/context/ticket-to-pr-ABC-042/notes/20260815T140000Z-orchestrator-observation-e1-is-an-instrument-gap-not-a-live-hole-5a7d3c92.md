---
id: 20260815T140000Z-orchestrator-observation-e1-is-an-instrument-gap-not-a-live-hole-5a7d3c92
kind: observation
by: orchestrator
at: 2026-08-15T14:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - E1
  - Q1
  - A6
supersedes: 
---

# `E1` is an INSTRUMENT gap, not a live hole — measured against the delivered build, because the hand-back's wording could be read either way

## Why I ran anything at all

The fix hop reported `E1` like this:

> *"`token.endsWith(COLOUR)` and `token.trim()` ship 856/856 green against the armed row, and `node
> src/cli.ts "x--colour" black` prints a 23-row board, exit 0, stderr empty — ASVS `V2.2.1 [L1]`,
> this ticket's original HIGH."*

**Read one way that sentence says a mutant accepts `x--colour`. Read the other way it says the
DELIVERED resolver does.** The first is an instrument gap. The second is a shipping ASVS L1 HIGH in
the one surface this entire ticket was blocked on once already. **Those two readings have different
severities, different owners and different consequences for the merge, and the difference is not
something to resolve by choosing the comfortable one.**

## What I measured

At the fix hop's tip `73d3b36`, delivered build, no mutant applied:

| argv | exit | stdout rows | stderr |
|---|---|---|---|
| `x--colour black` | **1** | **0** | `unrecognised argument: x--colour` + usage |
| `--colourx black` | **1** | **0** | `unrecognised argument: --colourx` + usage |
| `--COLOUR black` | **1** | **0** | `unrecognised argument: --COLOUR` + usage |
| `--colour black` | 0 | 23 | empty |

**The delivered resolver rejects all three near-misses correctly, names the offending token, writes
zero frame rows, and exits non-zero.** Only the legal form prints a board.

## The ruling

**`E1` is an instrument gap.** The armed `A6`(i) row does not kill an `endsWith` or `trim` weakening,
so a *future* regression of that shape would ship green. **Nothing is wrong with what this ticket
delivers**, and no live `V2.2.1` exposure exists at `73d3b36`.

Severity **HIGH stands** — the fix hop was right to hold the line rather than grade it down because
fixing it is someone else's, and an unarmed row on the surface that produced this ticket's original
HIGH is exactly what `Q1` was blocked for. **But it is high as a gap in coverage, not as a defect in
the product, and the record now says which.**

## The reporting rule this establishes
**A mutant's behaviour and the delivered build's behaviour must never share a sentence without
saying which is which.** The fix hop's table does distinguish them properly — the prose summary did
not, and the prose is what travels. I nearly relayed a live ASVS L1 hole that does not exist.

## What this does NOT change
- **`E1` still blocks**, and it is still **BA/PM's**: the criterion enumerates exactly three near-miss
  derivations (upper-case, `+"x"`, one-character truncation — the 6×3=18), and adding a fourth changes
  which builds `A6` reds. The fix hop was right that this is a criterion decision wearing a test's
  clothes, and right to stop.
- **`G1` is untouched** and remains the owner's.
- **The merge stays held.**
