---
id: 20260819T090000Z-orchestrator-observation-abc037-anchors-and-blockers-cleared-d1e2f3a4
kind: observation
by: orchestrator
at: 2026-08-19T09:00:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - ABC-033
  - ABC-035
  - ABC-078
  - src/turn-loop.ts
supersedes:
---

# `ABC-037`'s blockers are gone, and every anchor on its page re-measured at `main` `4c28f89`

## The two ordering dependencies are DISCHARGED BY MEASUREMENT

`ABC-037`'s DoR carried ⚠️ on items 3 and 10, and both were the same fact: `ABC-033` and `ABC-035`
were open. Measured at HEAD, not asserted:

- **`ABC-033` merged** (`0d0f635`) — `resolveMoveInput` exported at `src/move-input.ts:149`.
- **`ABC-035` merged** (`3f8a047`) — `classifyCommand` at `src/command-input.ts:104`,
  `helpMessages` at `:93`.
- Suite on `main`: **1152 tests / 38 files, skip 0**; lint/typecheck/build exit 0.

**The page still reads 9/10 ⚠️x2. Re-scoring it is BA/PM's pen and has not happened.** I am pulling
on the measured fact and recording that here rather than smoothing it — the same posture I took on
`ABC-035`, which BA/PM subsequently re-scored to 10/10.

## Anchors on the `ABC-037` page, re-measured

| the page cites | measured at `4c28f89` | verdict |
|---|---|---|
| `InputSeam` @ `src/turn-loop.ts:127` | **`:135`** | **DRIFTED by 8 — use `:135`** |
| `PromptOutcome` @ `:125` | `:125` | exact |
| `INPUT_ENDED_NOTICE` @ `:168` | **`:176`** | **DRIFTED by 8** |
| the `eof` arm @ `:123` | inside the `PromptOutcome` union at `:125` | **re-read it, do not cite `:123`** |
| `PROMPT_ROWS` @ `src/frame.ts:53` | `:53` | exact |
| the frame sanitizer @ `src/frame.ts:202` | **`:123`** | **STALE by 79 — same drift `ABC-033` carried** |

The `src/turn-loop.ts` anchors drift by a consistent **+8**, which is what a header edit above them
looks like. `A6`'s and `A8`'s requirement that `src/turn-loop.ts` stay byte-identical is unaffected
and unchanged.

## What is NOT discharged, and is the reason this ticket is still interesting

`ABC-037` is **the first production module in this repository that reads input from outside the
process**, and its page says in its own words that the security trigger is therefore **NOT waived**.
Three bars with a falsifiable firing threshold. Nothing about `ABC-033` or `ABC-035` merging changes
that, and it must not be read as pre-cleared because two ordering blockers went away.

## One inherited hazard the engineer must know about before it writes a guard

**`ABC-035`'s QE found four stream channels that escape a `vi.spyOn` stream guard** — `console.log`,
`console.error`, a `process.stdout.write` reference **bound at module load**, `fs.writeSync`, and a
`globalThis` flag. Mechanism measured: Vitest intercepts `console.*` before it reaches
`process.stdout.write`, and `vi.spyOn` replaces a property that a load-time binding has already
escaped.

`ABC-037` `A6` asserts **zero CSI bytes and zero writes to the loop's `FrameSink`**. That is the
same shape of guard, on the one module in this project that legitimately *does* write a prompt to a
stream. **The detector weakness is therefore live here in a way it was not in `ABC-035`**, where
nothing wrote at all. This is a known gap being handed forward deliberately, not a surprise.
