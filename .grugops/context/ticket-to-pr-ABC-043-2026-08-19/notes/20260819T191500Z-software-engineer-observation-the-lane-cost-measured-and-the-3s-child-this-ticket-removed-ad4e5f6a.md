---
id: 20260819T191500Z-software-engineer-observation-the-lane-cost-measured-and-the-3s-child-this-ticket-removed-ad4e5f6a
kind: observation
by: software-engineer
at: 2026-08-19T19:15:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-108
  - ABC-042
  - NFR-008
  - N8-LANE
supersedes:
---

# The lane cost, MEASURED — and the 3-second child this ticket had to take OUT of the default lane

**`N8-LANE`'s 650 ms is not claimed met and no percentage of it is quoted.** `ABC-108`'s `OQ-1` has
the lane's own total under open question, and a fraction of a number that is itself unresolved is
not a measurement. What follows is what I measured, at my own hand.

## Method

Contained agent worktree (the repo root is contaminated and the brief says so). `/usr/bin/time -p`,
n=3 per configuration, base = `54cbb23` with `src/cli.ts` and `src/cli.test.ts` restored from it,
branch = `39deb99`. Same machine, same session, alternating nothing else.

## The default lane

| configuration | user (CPU) | wall | tests |
|---|---|---|---|
| base `54cbb23` | 13.01 / 13.04 / 12.97 s — **median 13.01 s** | 2.77 / 2.83 / 2.77 — **median 2.77 s** | 1181 / 39 files |
| branch `39deb99` | 13.84 / 13.87 / 13.92 s — **median 13.87 s** | 3.45 / 3.02 / 3.14 — **median 3.14 s** | 1189 / 39 files |
| **this ticket's cost** | **+0.86 s CPU** | **+0.37 s wall** | +8 rows |

## `src/cli.test.ts` alone — the file `N8-LANE` is scoped to

| configuration | user (CPU) | wall | rows |
|---|---|---|---|
| base | 2.12 / 2.12 / 2.13 s — **median 2.12 s** | 1.60 / 1.33 / 1.34 — **median 1.34 s** | 42 |
| branch | 3.09 / 3.07 / 3.11 s — **median 3.09 s** | 1.78 / 1.77 / 1.84 — **median 1.78 s** | 50 |
| **cost** | **+0.97 s CPU** | **+0.44 s wall** | +8 |

**BA/PM's derivation is confirmed to the tenth of a second**: 7 children, measured individually at
**64-72 ms** of wall each in a standalone probe, ≈ **0.44 s** — and +0.44 s is exactly what the file
took. The children are the whole of the added wall.

## The cost this ticket REMOVED, which is bigger than the one it added

**`--colour black` reaches an engine ply through the delivered composition.** That is not a test
decision — it is what the product now does, and `ABC-042`'s `black` and `random` children run that
command line. On the real search:

```
node src/cli.ts --colour black < /dev/null    real 3.085 s   user 3.192 s   exit 0   (2 boards)
node src/cli.ts               < /dev/null    real 0.077 s   user 0.118 s   exit 0   (1 board)
```

So leaving those two children on the real engine would have put **+3.09 s of wall deterministically
and another +3.09 s at the flip of `--colour random`'s coin** into a lane whose wall clause is 3 s
for the whole of it — and it would have made the lane's DURATION non-deterministic, which is worse
than its being slow. `## Test notes` 8 forbids a default-lane row to run the real engine in so many
words, so both children now carry the instant opponent through the same substitution rig, and their
subject — the first frame's orientation and status rows, rendered before anything acts — is
untouched.

**This is a consequence of the ticket that its `N8-SPAWN` account did not anticipate**, and it is
recorded here rather than folded into the +0.86 s above: the account was derived over `ABC-043`'s
NEW children and could not see that two of `ABC-042`'s OLD ones change cost by a factor of forty.

## Where the lane stands, said plainly

The default lane medians **13.87 s CPU against `NFR-008`'s 13 s clause**. It was over the clause
before this ticket (13.01 s at `54cbb23`, consistent with `ABC-108`'s 13.400 s reading from another
tree) and it is over it after. **This ticket does not cause the breach and it does not fix it**, and
its 0.86 s is a visible, legitimate target if `OQ-1` rules that the lane must shrink — which is
precisely the forward rework the Orchestrator's pull waiver accepted.

**One honest note on `N8-LANE`'s own scope:** the bar names a shared file and `src/cli.test.ts` now
medians **3.09 s CPU** against a 650 ms bar. That number is over by a factor of ~4.75 with or
without this ticket's share, since the base file already read 2.12 s. **I am not grading it** — the
bar is arithmetic over a total `OQ-1` has open — but a reader who wants the file's figure should have
it rather than have to re-measure it.

## The opt-in lane question, NOT answered here

`AGENTS.md` records four opt-in deep lanes (`PERFT_DEEP`, `SEARCH_DEEP`, `ENGINE_DEEP`,
`INPUT_DEEP`). A real-engine end-to-end row belongs in one of them by `ENGINE_DEEP`'s precedent.
**`ABC-043` cuts no ticket for it and adds no lane** — BA/PM named that gap deliberately and it is
not mine to close.
