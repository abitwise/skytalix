---
id: 20260819T221500Z-qe-e2e-observation-the-instant-opponent-substitution-is-sound-f4a5b6c7
kind: observation
by: qe-e2e
at: 2026-08-19T22:15:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-042
  - ABC-064
  - NFR-008
  - src/cli.test.ts
supersedes:
---

# `ABC-042`'s `black` and `random` children on the instant opponent: **SOUND. It did not hollow them out** — and the reason is not the one the diff suggests

The engineer had to absorb this and reported it as an unanticipated consequence. I was asked whether
the substitution is sound or whether it emptied two merged rows. **It is sound**, and the argument is
short enough to state completely.

## What those two children are actually asserted over — read off the suite, not off the ticket

Five rows consume `CHILDREN.black` and `CHILDREN.random`:

| row | what it reads |
|---|---|
| `ABC-042 A4` (`:645`) | the board is drawn from the human's side |
| `ABC-064 A1` (`:1665`) | every frame carries the reference row count; one newline after the last row |
| `ABC-064 A2` (`:1692`) | zero CSI introducers on stdout |
| `ABC-064 A3` (`:1699`) | the **first frame's** status rows equal the merged panel's, `thinking` included |
| `ABC-064 A4` (`:1758`) | the word `random` occurs **zero** times on the whole stdout |

**Every one of them is a property of the FIRST frame, which is rendered before anything acts** — and
`A3`'s row says so in its own comment: *"rendered before anything acts"*. `A1` and `A2` widen to every
frame, but the property they widen is the height and the absence of cursor control, neither of which
any opponent can influence. **The opponent's identity is not an input to a single one of these
assertions.** Substituting it changes nothing they read.

## Why "it lost coverage" is the wrong frame, and this is the part worth writing down

The instinct is that these children used to run the real engine and now do not. **They never did.**
Before `ABC-043` the entry point printed a board and returned; `src/turn-loop.ts` had **0 production
importers**, measured on the ticket. No `ABC-042` child has ever reached an engine ply.

So the substitution does not remove coverage that existed. It declines coverage the ticket would have
picked up **by accident** — and accidental coverage of an unasserted property is not a test. Had those
two children been left on the real search, no row would have asserted anything about the move it
chose; the only measurable change would have been **+3.09 s of wall, deterministically, and another
+3.09 s at the flip of `--colour random`'s coin.**

**That last clause is the strongest argument FOR the substitution and it is not in the engineer's
account.** `random` on the real engine makes the default lane's DURATION depend on a coin. A lane whose
runtime varies by three seconds between identical invocations is a lane nobody can measure — and
`ABC-108`'s `OQ-1` is an open question about exactly that number. **The substitution removes a
flakiness source; it does not add one.** `## Test notes` 8 forbids the alternative in as many words.

## What it costs, stated so nobody has to discover it

**No child anywhere runs the delivered composition's real engine.** `A2`, `A5`, `A7` and now
`ABC-042`'s two all carry doubles, and the doubles export `DEFAULT_BUDGET_MS = 0`. The real value
(3 s) reaches the entry point in **no** child. `A1` pins `engine: createEngine({ budgetMs:
DEFAULT_BUDGET_MS })` as a SOURCE regex, so the wiring is asserted textually and never executed with
its real budget.

**This is not new and it is not concealed** — BA/PM named it at the ruling, the engineer named it
twice, and the ticket carries it under `## Test notes` 8. What is new is that it is now **total**:
before this hop, two children at least loaded the real `./engine.ts`. My contribution is to say what
therefore holds the claim up.

**The only evidence that `npm run chess` plays real chess is a human running it.** The Orchestrator
ran it. I ran it, in a separate tree, and got the same reply (`e2e4` → `Nc6`, exit 0). **That is the
whole of the end-to-end evidence for this ticket, and it lives in two context notes rather than in
the suite.** A real-engine row belongs in an opt-in lane by `ENGINE_DEEP`'s precedent; **no ticket is
cut for it, and cutting one is not mine.** Recorded as `G-06` in the gap register.

## One reading to refuse in advance

*"The children are hooked, so `ABC-042`'s criteria are no longer tested."* No. `ABC-064 A3` gained an
assertion at this hop rather than losing one: the `black` child's first frame now carries the loop's
`thinking` flag, and the row asserts it against `renderStatusPanel(start, status, true)` composed from
the merged module — with the default child anchoring the not-thinking form so neither expectation is
free-standing. **That is a stronger row than the one `ABC-042` shipped**, and it is stronger because
the composition changed, not in spite of it.
