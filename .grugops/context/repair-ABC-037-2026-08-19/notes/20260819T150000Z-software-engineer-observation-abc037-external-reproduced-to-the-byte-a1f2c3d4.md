---
id: 20260819T150000Z-software-engineer-observation-abc037-external-reproduced-to-the-byte-a1f2c3d4
kind: observation
by: software-engineer
at: 2026-08-19T15:00:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - G1
  - src/line-input.ts
  - src/line-input.test.ts
supersedes:
---

# `G1` — I reproduced QE's `external` measurement myself, to the byte, before adopting it

The brief told me to be as sceptical of QE's number as QE was of mine. I was. **It reproduces
exactly, on this tree, and I would not have shipped the guard if it had not.**

## First, the mechanism claim, checked on its own and without the seam

QE's charge was that my recorded mechanism — *"`heapUsed` does not account a V8 cons-string's
referents"* — is not what is happening. I tested it standalone (`node --expose-gc`, no repo import,
16 × 1 MiB with distinct content per chunk so nothing can be shared or interned):

```
                                          heapUsed delta   external delta
cons  (16 MiB rope, left unflattened)          0.02 MiB         0.00 MiB
flat  (the SAME 16 MiB, flattened)            16.00 MiB         0.00 MiB
bytes (16 x 1 MiB Uint8Array)                  0.00 MiB        16.00 MiB
```

**`heapUsed` accounts a flattened 16 MiB string at 16.00 MiB on the nose.** QE's figure, to two
decimal places, from an independent script. So "cons-string referents" is not the general rule I
stated it as, and my sentence was wrong as written.

**One honest refinement, and it is not a defence of what I wrote.** The first row does show an
unflattened rope reading 0.02 MiB, so the cons half of my sentence was not invented out of nothing —
it is a real V8 behaviour. It is simply **not the mechanism operating in this seam**, which is the
part that mattered, because it is what sent me looking at the wrong instrument and made me conclude
no instrument existed. A partially-true mechanism that points at the wrong field is worse than no
mechanism, because it terminates the search. That is the lesson I am recording, not the rope.

## Second, the seam itself — the measurement I actually rely on

Built as a temporary probe (`src/zz-probe.test.ts`), run inside vitest at the configured `threads`
pool, then **deleted**; it is in no commit. Four builds, same flood, same seam, `NODE_OPTIONS=--expose-gc`:

| build | `external` retained | `heapUsed` retained | QE's figure | mine |
|---|---|---|---|---|
| **delivered** | **40 B** (0.00 MiB) | 0.07 MiB | 0.00 MiB | **matches** |
| `M6b` (drop the early return) | 40 B (0.00 MiB) | 0.07 MiB | 0.00 MiB | **matches** |
| `M6` (drop the `pending` free) | **2,097,192 B** (2.00 MiB) | 0.07 MiB | 2.00 MiB | **matches** |
| **`M6c`** (drop both) | **33,554,472 B** (32.00 MiB) | 0.07 MiB | 33,554,472 B | **matches to the byte** |

`33,554,472` is not a round number and I got the same one. That is the thing that persuaded me: a
figure that agrees to the byte across two trees and two authors is not two people making the same
mistake.

`src/line-input.ts` was md5 `2428f654f694b87a8e22ec199c01dcde` before this and again after it, so
every number above was taken against a tree that was restored.

## Third, the two conditions — both confirmed load-bearing

- **The forced collection is not optional.** QE said so; the delivered build's own `heapUsed` column
  above (0.07 MiB on every build, leaking or not) is the same point from the other side — the
  instrument that separates is `external` and only after `gc()`.
- **`--expose-gc` is what supplies it.** So the guard is defined only when `globalThis.gc` is a
  function. It is NOT DEFINED without it — it does not skip (skip count stays 0) and, critically, it
  does not silently measure nothing and pass. That silent-green failure is the exact thing this row
  exists to correct, and it would have been unforgivable to reintroduce it in the fix for it.

## What I now think about my own original call

**The conclusion was right and I would delete that row again.** A `heapUsed` guard here could never
fire, and shipping it green would have been a lie in the suite. What was wrong was stopping there:
I wrote the mechanism down with more confidence than I had measured, and then treated my own
sentence as a proof that no instrument existed. **A bound I could not measure with the first
instrument I reached for is not a bound that cannot be measured**, and I recorded it as though it
were. That is the transferable error, and it is worth more than the guard.
