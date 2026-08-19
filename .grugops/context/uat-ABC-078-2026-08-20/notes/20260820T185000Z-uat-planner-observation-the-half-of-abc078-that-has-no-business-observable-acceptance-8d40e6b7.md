---
id: 20260820T185000Z-uat-planner-observation-the-half-of-abc078-that-has-no-business-observable-acceptance-8d40e6b7
kind: observation
by: uat-planner
at: 2026-08-20T18:50:00Z
verified_by: 
confidence: high
refs:
  - ABC-078
  - RISK-002
  - NFR-004
  - NFR-005
  - ADR-0013
  - src/cli.ts
  - AGENTS.md
supersedes: 
---

# Half of `ABC-078` cannot be accepted by a human looking at the product, and no scenario was
invented to hide that

**Not a stamp; a hand-authored `observation`.** This note exists because the honest answer is more
useful than an invented scenario, and because the invented scenario is the failure mode this ticket
was routed with a warning about.

## The structural reason, in one measured sentence

**The product exposes no engine control of any kind.** `src/cli.ts:156` builds the engine at
`DEFAULT_BUDGET_MS` and the accepted option set is exactly `--colour white|black|random`, `--ascii`,
`--unicode` — **no budget flag, no `--difficulty` (`ADR-0013`: no placeholder difficulty), no FEN
entry, no depth display.** A player therefore has **no act available** that varies the time budget,
reaches a chosen position directly, or reveals how deep the search got.

## What that puts out of reach of any UAT, criterion by criterion

| criterion | why it is not gradeable by a person |
|---|---|
| `A2` — legal move at a 50 ms budget | No player can produce a 50 ms budget. |
| `A3` — a partial iteration is discarded | The player sees a move, never which iteration produced it. Only an instrumented run can see it, and that is a test. |
| `A4` — no depth constant drives a per-move decision | A property of the source text. **No observation of the running product differs** between a build with a depth cap and one without — which is exactly QE's `G2` mutant. |
| `A5` — deeper when given longer | Needs two budgets. The product has one. |
| `RF-1` / `HARD_CEILING_MS` — the 5 s clamp | Unreachable: it engages above 5 000 ms and nothing can pass more than 3 000. |
| `A7`'s tail (down to 1 ms) | Same reason as `A2`. The default-budget half of `A7` — always legal, never null, never a throw — *was* observed, 21 times. |
| `NFR-005` — depth in budget | Depth is not displayed, and the row is a waypoint due at the close of `ABC-079`/`080`/`081`, not a verdict now. |
| `A6` — `EngineSeam` conformance, `turn-loop.ts` byte-identical | Code property, blob-hashed at the gate. Its **consequence** is observable and was observed: complete games run end to end through the merged loop. |

## The load-bearing consequence, stated as bluntly as it deserves

**`RISK-002` — the epic's non-negotiable inherited constraint, and the reason this ticket exists —
has no business-observable acceptance.** A fixed-depth build costing about three seconds would pass
every scenario in this pack. So the mechanism `ABC-078` is named after is **not** signed off by
anything a human can see; it is guarded by the repaired `A4` test that runs a search and requires
depth 4→6, and by nothing else.

**What business observation CAN carry, and it is not nothing:** that the machine answers, that it
answers in a time a player tolerates, that it takes free material, that it declines a trap that costs
it a piece, and that it finds and plays a mate in one. Those five statements are graded, and they are
the whole of the human-acceptable surface of this ticket.

## Two fences this note keeps

- **QE is not UAT** (`AGENTS.md` § *QE validation authority*). Nothing here re-runs, re-grades or
  substitutes for `ABC-078`'s QE hop, which happened, found 7 gaps (2 HIGH) and was repaired. The
  temptation on a ticket like this is to reach for QE's instruments and call the result a UAT; that
  was declined.
- **A scenario that only checks a legal reply passes on a random-move engine.** `S1`/`S2` alone would
  have been exactly that scenario. `S3`–`S5` were added for that reason, and the pack states in a
  table what each of them would do against a random mover and against a greedy one-ply mover —
  including the admission that `S4` is weak against random and `S3`/`S5` are the ones that rule it
  out.
