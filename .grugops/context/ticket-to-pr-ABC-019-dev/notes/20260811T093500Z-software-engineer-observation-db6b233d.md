---
id: 20260811T093500Z-software-engineer-observation-db6b233d
kind: observation
by: software-engineer
at: 2026-08-11T09:35:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ADR-0009
  - ABC-016
  - ABC-017
  - src/turn-loop.test.ts
supersedes:
---

# What the build measured that the ticket did not, and the limits I am not papering over

## 1. One fixture in `## Test notes` row 3 cannot be built as the row implies, and it is worth recording

Row 3 is *"insufficient-material line"*. The obvious fixture — White captures the last black piece,
leaving K vs K — **cannot exercise the ply at all**, because the position BEFORE the capture is
already `insufficient-material`: `isInsufficientMaterial` (`src/gameend.ts:98-119`) returns true at
`minors <= 1`, and K+N vs K is one minor. Built and run: the loop stopped on the **initial**
evaluation with the right reason and the right result, rendered **one** frame, and never played a
ply. It passed a reason assertion while testing nothing.

The delivered fixture gives Black **two** knights (`1k6/8/8/8/8/8/1K6/2n4n w - - 0 1`) so the
pre-capture position is genuinely in progress, and the capture is what makes it a dead position. The
frame count (2, not 1) is the clause that catches the difference — which is the ticket's own argument
for asserting frame counts rather than only final frames.

**This is not a defect in the ticket; it is a trap under it.** Recorded so the next person to write
that fixture does not lose the ply.

## 2. `A17`'s timing half is NOT asserted in the default lane, and that is deliberate

`A17` names its instrument: an out-of-tree harness, its own process, a discarded warm-up round,
rounds x iterations, rotated cell order, medians of per-round means, recorded with its machine.
**A number produced inside `vitest` would be a different measurement wearing that one's name.** Merged
`src/gameend.nfr.test.ts:16-17` states the same rule for its own bars — *"wall-clock cost is not
asserted anywhere in this suite"* — and `src/turn-loop.nfr.test.ts` follows it.

What IS in the lane is the clause the ticket says BINDS: `A3b`'s spied derive count, at all three of
`A17`'s ply counts. What is out of tree is in the `artifact-ref` note, with its machine and its
method. **`MET`/`MISS` is Security/NFR's at the gate; I measured and did not adjudicate.**

## 3. Two readings of "loop overhead per ply at N plies", and they differ by ~2x

Measured both, because the phrase admits both and the difference is not noise:

- **averaged over a whole game of N plies** — 16.09 / 30.99 / 58.49 µs at 40 / 120 / 300;
- **marginal, the cost of one ply when the history is already N plies deep** — 27.23 / 58.79 /
  112.86 µs.

Both are under `≤ 45 / ≤ 100 / ≤ 200`. The **marginal** reading is the one that compares to the
ticket's own recorded figures (20.71 / 48.34 / 96.88 for one derive per ply), and my numbers sit
above those by roughly 6.5 / 10.5 / 16 µs. **The gap has a named cause: `A10`'s engine legality check.**
The ticket's derivation is *"one `repetitionCounts` + one `gameStatus` + one `playMove`"* and does not
count the `legalMoves(history.position)` call `A10` forces on every engine ply. That call is real loop
overhead, it is roughly half a ply's worth amortised, and **no bar is threatened by it** — but the
derivation in `## Security / NFR triggers` is one term short of the loop the ticket specifies.
**Flagged for BA/PM / Security-NFR; no bar moved and none is proposed.**

## 4. The `repetitionCounts` spy reads 0, and that is a measurement limit, not a green light

`gameStatusOf` calls `repetitionCounts` **inside `history.ts`** (`:152-154`), and a `vi.mock` module
boundary cannot see an intra-module call. So the `repetitionCounts` spy counts only derives the LOOP
makes on its own. Asserting it at **0** is a real assertion — it is the proof that every evaluation
went through `gameStatusOf` rather than through a hand-rolled `gameStatus(position, counts)` pair —
but it is **not** the per-ply derive count, and reading it as one would be wrong.

The derive `A3b` actually bars is counted by the `gameStatus` spy, which `history.ts:152` calls
exactly once per `gameStatusOf`. Both files say this in their headers rather than leaving a later
reader to discover it.

## 5. `A19` clause (c) needed the harness to copy the frame, or it would have been a tautology

The loop hands the writer the **same array object** the seam returned, so a deep-equality assertion
against that same object passes no matter what the loop did to it. The harness therefore records a
**copy** of what the seam returned (`frames.push([...frame])`) and compares that against what the
writer received. Without the copy, a loop that mutated a frame in place would be invisible to (c) —
and (c) is the clause the ticket says stops (d) from becoming a tautology.

## 6. `A12` is met by the runs and by the enumeration, and the distinction is stated rather than blurred

Each of the five automatic values has its own fixture and each one RUNS and stops with that reason and
that reason only (rows 1-5). The separate `A12` assertion checks that the **table has a row for each
of the five** — the `[D25]` requirement that a table whose rows are not enumerated can be one row
short and still green. That assertion reads the table's declarations, not a sixth run, and it is
worded that way in the test. **It is honest to call `A12` met; it is not honest to call that one
assertion a run.**

## 7. Concurrency: nothing was read from, written to, or inferred about `ABC-016`'s work

`.grugops/queue/pending/ticket-to-pr-ABC-016-dev.md` was left untouched in `pending/`. No file under
`src/status-panel.*` exists in this worktree and none was created. `src/frame.test.ts` was read (for
`ADR-0009` clause 9c's precedent) and **not edited** — `git status` confirms. There is **no import
edge** from `src/turn-loop.*` to either panel in production or in test, so the project-wide blocking
typecheck gate carries no merge-order dependency for this ticket.
