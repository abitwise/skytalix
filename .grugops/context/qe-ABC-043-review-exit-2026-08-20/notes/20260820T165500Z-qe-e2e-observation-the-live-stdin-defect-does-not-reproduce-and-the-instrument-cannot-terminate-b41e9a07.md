---
id: 20260820T165500Z-qe-e2e-observation-the-live-stdin-defect-does-not-reproduce-and-the-instrument-cannot-terminate-b41e9a07
kind: observation
by: qe-e2e
role: qe-e2e
task: qe-ABC-043-review-exit-2026-08-20
at: 2026-08-20T16:55:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - src/cli.ts
  - src/cli.test.ts
  - src/line-input.ts
supersedes:
---

# The live-stdin defect: **it is NOT a defect of the delivered product, and on my measurements it is not reliably a defect of the mutant either.** The FIFO harness cannot observe the thing both prior hops read off it

## What I was asked to settle

*Does the eaten move fail a criterion, or is it an open defect that does not block the exit?*
**Neither. There is no product defect on this path at all.** The delivered build plays the human's
move, every time I ran it, at every timing I ran it at.

## The delivered build on a live stdin — `main` @ `d127ae3`, Node v24.12.0

A FIFO carrying `e2e4`, held open — a human at a keyboard — `--colour white --ascii`, the move written
at **t = 0 s, t = 1 s and t = 2 s** (three separate sessions, so the outcome cannot be one lucky race):

| run | boards rendered | prompts | bytes | the move |
|---|---|---|---|---|
| move at t=0 | **3** | 2 | 1481 | **played** — `White to move 1.` → `Black to move 1...` → `White to move 2.` |
| move at t=1 | **3** | 2 | 1481 | **played** |
| move at t=2 | **3** | 2 | 1481 | **played** |

The third board is the engine's real reply, ~3 s after the move. **The product plays the move,
renders the position after it, answers it, and sits at the next prompt.** That is the product working.

## The `G-03` orphaned build on the same harness — and this is where I part from the repair note

Same FIFO, same three timings, the mutant built exactly as the engineer's diff writes it:

| run | boards | prompts | bytes | the move |
|---|---|---|---|---|
| move at t=0 | **3** | 3 | 1483 | **played** |
| move at t=1 | **3** | 3 | 1483 | **played** |
| move at t=2 | **3** | 3 | 1483 | **played** |

**I could not reproduce *"renders ONE board … and NEVER PLAYS THE MOVE"* in six attempts.** An
`od -c` diff of the two streams shows the entire difference is **one extra `> ` written before the
first board** — the orphaned pre-read's prompt — which shifts every subsequent byte by two. That is
the whole of the 1481 → 1483 delta.

**The repair note's own numbers say the same thing, and this is the part that is decisive rather than
my run count:** it reports the delivered build at **1481 bytes with 2 boards** and the orphaned build
at **1483 bytes with 1 board**. A build that rendered one board instead of two cannot be **two bytes
longer** than the build that rendered both — a frame in this product is ~470 bytes. **The board count
in that table is arithmetically inconsistent with the byte count beside it**, and my measurement
resolves it in the direction the bytes already pointed.

## Why the outcome is a RACE, and why nobody should build on it either way

`createLineInputSeam`'s `waiting` is a **single slot** and the second `readLine()` **overwrites** it
(`src/line-input.ts:232`), orphaning the first promise. So on the orphaned build the line goes to
whichever read holds the slot when the `data` event fires:

- data arrives **after** the loop's read has overwritten the slot → the **loop** gets it, the move is
  played, one stray prompt is the only trace (what I measured, 6/6);
- data arrives **in the window between** the pre-read and the loop's read → the **orphan** gets it and
  the move is **eaten** (what the engineer measured).

Both are reachable. **The mutant's user-visible symptom is not stable**, and the delivered build has
no such race because there is only one caller.

## THE INSTRUMENT CANNOT TERMINATE, AND THAT IS THE FINDING UNDER THE FINDING

Both prior hops read *"STILL RUNNING after 10 s → HUNG"* off this harness. **A FIFO stdin cannot
produce an end-of-input in Node on this platform at all, for any program.** Measured with the product
out of the picture:

```js
// raw.mjs — no product code
process.stdin.on("data", d => console.log("data", …));
process.stdin.on("end", () => console.log("END"));
process.stdin.resume();
```

FIFO writer opens, writes one line, closes: **`data` fires, `END` never does**, process alive at 10 s.
The delivered product on the identical FIFO with **no move at all**, writer opening and closing after
2 s: **no `input ended`, alive at 15 s.** The same product on an **anonymous pipe**: `input ended`
once, **exit 0, 3.08 s**. The same product on `/dev/null`: one board, notice, exit 0, 0.07 s.

**So "it hung" was never evidence about a build. Every build hangs on this harness, including a
four-line script that is not this product.** The prior QE hop drew a severity from it; the engineer
corrected the comparison but kept the harness; neither could have terminated. **A guard built on it
would have been a guard that reds on the delivered product — which the engineer said, for a reason
that turns out to be sounder than the one he gave.**

## A THIRD FALSE SENTENCE IS SHIPPING, and this one is `ABC-043`'s own

`src/cli.test.ts:2122-2124`, in the `G6` clause the repair added:

> *"Measured at this hop on a LIVE stdin (a FIFO carrying one move and held open, which is a human at
> a keyboard): that build renders ONE board, writes THREE prompts and NEVER PLAYS THE MOVE, where the
> delivered build plays it and renders TWO."*

**Board counts unreproducible (I get 3 and 3), the "never plays the move" claim unreproducible (6/6
played), and the "2 vs 1" contradicted by the note's own byte counts.** The **assertion** beneath it
is sound and I watched it kill both hoisted builds — **only the narration is wrong**, so this fails no
criterion and blocks nothing.

**I did not author the correction.** `ABC-113` exists because a QE hop authored an instrument and then
adjudicated it; I will not spend that principle on my own hop. It joins the two sentences `ABC-113`'s
QE hop named — `src/cli.test.ts` *"with both of those rows still green"* and `src/result-screen.test.ts`
*"unconstructible"*, both still on `main` — as **three comment corrections for one follow-up**, the
Orchestrator's to route.
