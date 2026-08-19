---
id: 20260821T001000Z-uat-planner-failed-attempt-three-harness-dead-ends-so-the-next-hop-does-not-repeat-them-4e20d543
kind: failed-attempt
by: uat-planner
role: uat-planner
task: uat-ABC-044-2026-08-20
at: 2026-08-21T00:10:00Z
verified_by:
confidence: high
refs:
  - ABC-044
  - ABC-044/A6
supersedes:
---

# Three dead ends in building a terminal harness, recorded so the next hop does not pay for them again

## 1. A pty with no window size looks like a TTY and behaves like a pipe

`script -q /dev/null node …` gives `isTTY: true` but **`rows: 0`, `columns: 0`**, because there is no
controlling terminal to inherit a size from. `beginFrameSession`'s condition is
`isTTY && (rows ?? 0) >= height`, so **`rows: 0` takes the append branch** — the same branch a pipe
takes. A run like that reports "conducted on a TTY" and measures nothing new.

**Fix:** `bash -c 'stty rows 24 cols 80; exec node src/cli.ts'` inside the pty. Verified by probe:
`{"out":true,"rows":24,"cols":80,"in":true}`.

## 2. Feeding a pty from a file loses the input

`script -q /dev/null … < moves.txt` delivered all four moves before the child read any of them, the
line discipline echoed them, and then the pty closed — the child saw **EOF with an empty queue** and
printed `input ended` with the game never started. A terminal is not a file.

**Fix:** pace the feeder with sleeps (`( sleep 3; echo f3; sleep 6; … )`), which is also what a person
does.

## 3. A scripted player cannot reliably drive a LONG game to a terminal outcome

Three attempts, each ~3–9 minutes of real engine time:

- **Knight shuffle** (`Nf3 Nc3 Ng1 Nb1` ×20): dead at move 12 — White is in check, every shuffle move
  is illegal, the remaining input drains as rejections and the session ends with `input ended`.
- **A 70-move candidate pool**: 34 plies, then the same stall in check.
- **A 182-line pool including all 64 `K<square>` and 64 `Kx<square>` forms**: **44 plies**, reached
  move 23 with White in check on h1 and **no legal move in the pool** (`Kg1` is covered by a rook on
  c1); the stream ran out and the session ended with `input ended`. **Reproduced identically on a
  second run** — the engine is deterministic on this machine for this input.

**What this cost and what it bought.** It did not buy a long game *ending in a result screen*, which is
what would have joined the two halves of the scroll observation. It did buy a real 44-ply game on a
real terminal, which is where the "22 move-list rows" figure comes from. **The gap is recorded as
`UNKNOWN - verify` in the pack rather than papered over with the 4-row proxy.**

**What would close it, for whoever picks this up:** the pool needs generic capture forms
(`<piece>x<square>`, `<file>x<square>`) so a check can be answered by taking the checker, not only by
running. That is a bigger stream and a longer run, and it was out of budget here.

## Standing

Unstamped `failed-attempt`, hand-authored. Recorded so it is not retried blind.
