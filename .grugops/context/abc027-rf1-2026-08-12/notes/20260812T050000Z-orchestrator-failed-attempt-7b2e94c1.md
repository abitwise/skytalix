---
id: 20260812T050000Z-orchestrator-failed-attempt-7b2e94c1
kind: failed-attempt
by: orchestrator
at: 2026-08-12T05:00:00Z
verified_by:
confidence: high
refs:
  - ABC-027
supersedes:
---

# The repair I prescribed would have silently WEAKENED `A1` — caught by BA/PM, confirmed by arithmetic

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **This is not a `finding`.**

## What I got wrong

My subtask brief for `refinement-ABC-027-a1` spelled out the repair as a three-number substitution:

| | old (unsafe) | new (I prescribed) |
|---|---|---|
| `\x1b[K` count | `H − 1` | **`H`** |
| `\x1b` count | `H + 1` | **`H + 2`** |
| length delta | `(H − 1) × 3` | **`H × 3`** |

I also told BA/PM, emphatically, **not to relax `A1`** because QE measured it as where 9 of 14 mutants
die. I believed those three numbers preserved its strength. **They do not.**

## The measurement

QE's mutant **`M2`** — `rows.map(r => r + "\x1b[K").join("\n")`, every erase **at the margin**, which
is the unsafe shape this whole FAIL exists to eliminate — produces:

```
RF-1  (safe,   erase at column 0) : EL=23  ESC=25  delta=69
M2    (unsafe, erase at margin)   : EL=23  ESC=25  delta=69
```

**Identical. The counts cannot tell them apart.** BA/PM measured it on nine writers; I re-derived it
by arithmetic and got the same answer. Under the *old* `H − 1` counts, the count alone killed `M2`.
**So my prescribed substitution would have produced an `A1` measurably weaker against the exact
failure mode the repair exists to prevent — while reading as a faithful repair.**

BA/PM's fix is a **column-0 clause**: the text must *begin* `\x1b[H\x1b[K`, and **no `\x1b[K` may be
immediately followed by a newline.** That fails on the delivered emission, so it earns its place by
the only test that matters.

## Why I am recording this as a `failed-attempt` rather than folding it into a decision note

**I was the carrier of the exact pattern BA/PM itself named two hops earlier:** *a repair arrives
with the authority of having just fixed something and gets read as a solution rather than as a new
claim.* My brief was a repair — of a criterion, in response to a FAIL — and it arrived with the
authority of the gate behind it. Had BA/PM treated my three numbers as the specification instead of
as a claim to test, the weakening would have shipped inside the fix for the regression.

The instruction that saved it was in the same brief: *"treat your own new wording as an untested
claim; the counts are cheap to verify against both emissions before you write them down."* **I gave
that instruction and then failed to apply it to my own numbers.**

## Two more corrections from the same hop, both recorded rather than smoothed

- **BA/PM's own prediction that `A6` would redden was WRONG**, measured and recorded as wrong: three
  other tests redden and `A6` stays green, because it asserts only about the narrower second frame.
  **Consequence: `A6` could not have caught this regression either. `A1` is the only criterion that
  could** — which is why weakening it mattered so much.
- **`AR-1` assigned to the Engineer without a criterion has ZERO enforcement.** Measured: the suite is
  **682/682 either way, repair applied or reverted — except `A7`, which fails alone.** So the screen
  model's margin repair became criterion `A7` rather than a note. And it is not cosmetic: repaired
  model + delivered writer turns **three existing `ABC-018` tests red** with the lost h-file in the
  failure text.

## Board

**No column change, and that is BA/PM's request which I accept.** `ABC-027` stays `In Development` —
this hop was the BA/PM half of a column I had already moved it back to, and moving it out and back
would be churn recording nothing. WIP unchanged at 2/3.

What is released is the Engineer's `RF-1` hop: the contradiction is gone.
