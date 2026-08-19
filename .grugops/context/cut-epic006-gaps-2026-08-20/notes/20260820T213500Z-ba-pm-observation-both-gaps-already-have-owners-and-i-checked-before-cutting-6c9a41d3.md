---
id: 20260820T213500Z-ba-pm-observation-both-gaps-already-have-owners-and-i-checked-before-cutting-6c9a41d3
kind: observation
by: ba-pm
at: 2026-08-20T21:35:00Z
verified_by: 
confidence: high
refs:
  - EPIC-006
  - ABC-044
  - ABC-046
  - ABC-043
  - ABC-021
  - plans/tickets/ABC-044-the-result-screen.md
  - plans/tickets/ABC-046-quit-and-new.md
supersedes: 
---

# The brief's premise checked against `plans/tickets/` — and it does not hold for either gap as stated

**Hand-authored `observation`, unstamped.** The subtask brief says of both gaps: *"Neither is anybody's
ticket right now, which is why they are being cut before they are forgotten."* The board row that fed
it says the same of `quit`: *"that gap is currently NOBODY'S TICKET."*

**I checked `plans/tickets/` before writing a page, which is the first thing a cut should do, and
both gaps have an owner cut on 2026-08-13 at `EPIC-006`'s own decomposition.** Recording it here
because the premise is load-bearing for how many tickets this hop was asked to produce.

## Gap 2 IS `ABC-044`, in the same words

`plans/tickets/ABC-044-the-result-screen.md`, `S` / `P1`, `Backlog`, cut 2026-08-13.

- Its `## Problem` is the gap verbatim: *"the loop's exit test returns a `LoopOutcome` and nothing
  renders it… `ABC-019` computes `{ result, reason, exitCode }` and stops (`src/turn-loop.ts:285-287`);
  a player sees the final frame… and then the process ends. Nothing says* you were checkmated."
- **`A1`** asserts all **eight** terminal reasons as a **set of size 8** — checkmate, stalemate,
  insufficient material, fivefold, seventy-five-move, threefold, fifty-move, resignation.
- **`A2`** asserts claimed-vs-automatic is distinguishable — **exactly `ABC-021`'s draw conditions**,
  which the brief asked a new ticket to cover.
- **`A3`** forbids presenting `engine-failure` / `engine-threw` as a chess outcome; **`A4`** gives
  end-of-input zero rows; **`A6`** drives *"a scripted game… to checkmate through the entry point"*
  and asserts the screen lands after the final frame with the exit code verbatim.

**Everything the brief asked a second new ticket to carry is already on this page**, and it also
carries the full move list and the eight-reason count that `EPIC-006`'s 2026-07-31 amendment
instructed be settled at decomposition. **A new ticket for this gap would be a duplicate of a `P1`
ticket sitting in the same column.**

**Its only ⚠️ has cleared in substance.** The page reads *"`ABC-043` must land first — OPEN, and it is
blocked in turn"*. `ABC-043` is now in `In Review` **with its code merged to `main`** (`6091212`, the
`abc043-repair` merge) — which is why there was an entry point to drive to mate at this hop at all.
**Whether `In Review`-with-code-merged counts as "landed" for the purposes of pulling is the
Orchestrator's call at the pull, not BA/PM's at a cut. I did not re-score the page and I did not move
the column.**

## Gap 1's EFFECT is `ABC-046`, and its three open questions were ruled seven days ago

`plans/tickets/ABC-046-quit-and-new.md`, `S` / `P2`, `Backlog`, cut 2026-08-13, blocked by an
Architect/Design ruling.

The brief asks the new ticket to *"consider — and rule on the page — whether `quit` should confirm,
whether it should differ from EOF, and what exit code it carries."* **All three are already ruled on
`ABC-046`:**

- **Confirmation** — `A1`: two-state, no second stdin read; one `quit` asks, a second consecutive
  `quit` ends it, and an intervening command clears it.
- **Differ from EOF** — `A3`: *"the last line written names quitting and is **not**
  `INPUT_ENDED_NOTICE`"*, written so that the cheap shape **(a)** fails it deliberately.
- **Exit code** — `A2`: no result screen, exit **0**, on BA/PM's 2026-08-13 ruling that *quitting
  records no result* (shape (c), `quit` ≡ resignation, was rejected outright there).

**So the effect half of gap 1 is owned, ruled, and blocked** — the blocker being the (a)/(b)/(c)
contract shape, which is Architect/Design's and is the same ruling `ABC-102` waits on.

## What is genuinely unowned — and it is narrower than the brief's gap 1

**The PROMISE.** `ABC-046` assumes a world where `quit` works. Nothing owns the fact that the product
**ships today** printing a command it ignores, and `ABC-046` cannot close it soon: it is `P2`,
explicitly the drop-first tier, and blocked by a ruling nobody has scheduled. **That residue is
independent of the ruling, unblocked, and one filter wide.** It is what `ABC-112` cuts.
