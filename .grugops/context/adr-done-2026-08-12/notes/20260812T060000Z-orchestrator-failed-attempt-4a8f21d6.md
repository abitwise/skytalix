---
id: 20260812T060000Z-orchestrator-failed-attempt-4a8f21d6
kind: failed-attempt
by: orchestrator
at: 2026-08-12T06:00:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-027
  - ADR-0009
  - ADR-0010
supersedes:
---

# Two more unmeasured numbers in my brief — and the pattern is now the finding, not the instances

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **This is not a `finding`.**

## What I got wrong, again

The Architect/Design brief I wrote carried two numbers I had transcribed rather than measured:

| my brief said | measured | source of my error |
|---|---|---|
| "five sites across four tests" | **four assertion sites across three tests, plus the screen model** — and **five tests throw** without the model change | **two source notes disagreed with each other and I copied one** |
| `:376` goes to `2 + (H − 1)` = 24 | **25** | 24 is the count for the emission form **the gate REJECTED**; column-0 gives `\x1b` = 25 at `+69` = `H × 3` |

The Architect's sentence is the one that should stand: **"writing an unmeasured count into a
correction about unmeasured counts would have reproduced the defect."**

The second error is worse than the first. **I supplied the count for the shape Security/NFR had
already failed** — I carried the rejected emission's arithmetic forward into the brief that was
supposed to correct it, one hop after reading the FAIL.

## The pattern, which is now the actual finding

This is the **second consecutive hop** in which my brief carried a wrong number, and both were caught
by the role I briefed:

1. `refinement-ABC-027-a1` — my three-number `A1` substitution would have **weakened** the criterion,
   because `H`/`H+2`/`H×3` cannot distinguish the safe form from QE's margin mutant.
2. this hop — the site count and `:376`'s value.

**Both errors are the same shape and it is not arithmetic sloppiness: I was transcribing numbers out
of other roles' notes and passing them on with the authority of a brief.** A brief is the most
authority-laden artifact in this factory — it is read as the specification of the hop — and I have
been filling it with second-hand figures while instructing every agent in it to measure rather than
inherit.

**Standing correction, adopted now: a number in an Orchestrator brief must be either (a) measured by
me, (b) attributed to the role and note that measured it, or (c) marked as unverified for the
receiving role to check.** Anything else is relay dressed as specification — which is the thing the
coordinator rule forbids me to do in the first place.

## What the Architect did with its own miss

Its first `artifact-ref` note **repeated the count-only `A1` prescription one hop after it was
recorded as wrong.** It caught that itself, re-measured independently (column-0 form and QE's `M2`
both give EL=23, ESC=25, delta=69 — identical), and **recorded the miss in a new note beside the
original rather than editing it.** The ADR block now carries the trap explicitly, so its arithmetic
cannot later be lifted as a criterion.

That is the correct handling of a stale claim: leave the wrong thing visible, put the correction next
to it.

## What landed

`ADR-0009` **+39/−0, additions only, no clause edited** — 9b's quoted signature is dated as *the
ticket as it then read*, the fourth argument recorded as **forced**, the `[D27]` attribution kept
split (verified at `ABC-019`'s line 242), and evidence (vii) recorded as **standing and not re-run**,
with the measured reason: every figure is a height, heights are invariant under the message region.

`ADR-0010` `## Consequences` only — the false "first narrowing fixture" claim struck, the undercount
corrected, and **the Security/NFR FAIL folded in explicitly as a DEFENCE of clause 1**: clause 1 never
said *where in the row* the erase fires, so it is not wrong and was not re-opened.

Merged by fast-forward `505216c` → `a817096`, no merge commit, **zero `src/` bytes**, 711/711 on
`main`, lint and typecheck 0.

## Owed, and routed

- **`ABC-019`** — one BA/PM text repair: `[D27]`'s *"the seam is not new and its arguments do not
  change"* is **falsified by its own fourth argument**. Routed this hop.
- **`ADR-0010`'s `## Rollback`** carries the same stale narrowing-fixture premise. **Flagged by the
  Architect and deliberately not taken — outside its named scope.** Queued, not dispatched.
- **`ABC-027`** — nothing from the ADR hop; `A6` **confirmed correct**.
