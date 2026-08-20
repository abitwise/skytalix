---
id: 20260821T004000Z-software-engineer-failed-attempt-the-orphan-held-the-capture-pipe-and-the-row-proved-nothing-9d3c1b57
kind: failed-attempt
by: software-engineer
at: 2026-08-21T00:40:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A9
  - A3
supersedes:
---

# A THIRD `A9` INSTRUMENT THAT PROVED NOTHING — NEW AT THIS HOP, and it only appears inside `spawnSync`

Two dead ends were already recorded (timing the pipeline; an open stdin that supplies nothing / no
settle delay). **Neither was re-run.** This is a third, and it is invisible at the shell — it exists
only because the row runs under `spawnSync` with piped capture, which is what the ticket flagged as
never having been tried.

## THE TRAP

The `A9` instrument holds stdin open with a **detached** FIFO writer. Written the obvious way —

```
( { sleep 0.5; echo zz; sleep 10; } > $F & )
```

— the detached group **inherits `sh`'s stdout and stderr**, which under `spawnSync` are the parent's
capture pipes. `spawnSync` does not return when `sh` exits; it returns when those pipes close. The
orphan holds them for its whole `sleep`.

**Measured: the very first in-vitest run of `A9` sat for the full bound on the UNFIXED build**, which
exits in 0.65 s at the shell. The row would have read "did not exit within the bound" on every build
— delivered, unfixed and bare-swallow alike — and discriminated nothing. It is the same *species* as
the recorded pipeline-timing dead end (an instrument whose reading is dominated by the sleep rather
than by the child) with a different mechanism, and the earlier note's fix does not cover it: the
FIFO writer being detached is exactly what makes it an orphan holding an inherited fd.

## THE FIX, AND WHY IT IS ONE LINE

```
( { sleep 0.6; echo zz; sleep 10; } >"$F" 2>/dev/null & )
```

The orphan gets the FIFO and `/dev/null` and no capture pipe. Re-measured after it, 5 runs each:

| build | returns | `NODE_EXIT` | stderr |
|---|---|---|---|
| delivered | 0.64-0.68 s | `0` | 0 bytes |
| unfixed `main` | 0.65-0.66 s | `1` | 1266 bytes |
| bare swallow | **never — killed at the 4 s bound, 5/5** | — | — |

**The general rule, because it is not `A9`-specific:** any `spawnSync` child that detaches a
background process must redirect that process's stdout and stderr, or the capture outlives the
child and every timing property of the row is the orphan's rather than the product's.

## A SECOND, SMALLER ONE — `A3`'s cross-check counted 23 where `wc -l` counts 24

The boundary cross-check first read the delivered stream as
`stdout.split("\n").filter((line) => line !== "")`. **The frame's own message region is BLANK ROWS**,
so that dropped a real line and the derivation disagreed with `wc -l` by one. Watched red, fixed to
drop only the trailing empty element. Recorded because the wrong form looks more careful than the
right one.
