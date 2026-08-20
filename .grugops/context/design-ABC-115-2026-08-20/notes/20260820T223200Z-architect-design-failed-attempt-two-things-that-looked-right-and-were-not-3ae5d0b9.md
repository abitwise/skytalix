---
id: 20260820T223200Z-architect-design-failed-attempt-two-things-that-looked-right-and-were-not-3ae5d0b9
kind: failed-attempt
by: architect-design
at: 2026-08-20T22:32:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - ADR-0016
supersedes:
---

# TWO DEAD ENDS FROM THIS HOP — recorded so the repair hop does not walk into either

## 1. The bare-swallow arm — GREEN ON THE TICKET'S OWN CRITERIA AND STILL WRONG

`sink.on("error", e => { if (e.code !== "EPIPE") throw e; })` and nothing else.

Measured: `node src/cli.ts --ascii </dev/null | head -2` → exit **0**, stderr **0 bytes**. It
satisfies `A1` and `A2` completely. **With a live stdin it lets the session run on into a dead pipe:
8.02 s against 3.07 s for the ruled shape**, with the human typing into nothing. Discarded.

**The lesson, and it is the reason the seam hop existed:** `A1` and `A2` assert the *status* and the
*silence*; nothing on the page asserts that the session *ends*. A fix can be fully green and still
leave a zombie game running.

## 2. Timing the PIPELINE instead of the CHILD — a measurement that made all four builds look identical

First attempt at separating the candidates:

```
/usr/bin/time -p sh -c '{ echo e4; sleep 8; echo quit; } | node src/cli.ts --ascii | head -2'
```

**All four builds — including the unfixed BASE that crashes — read `real 8.0 s`**, because the
pipeline's left-hand side sleeps 8 s and the shell waits for it regardless of what the child does. On
that instrument the bare swallow and the ruled shape are indistinguishable, and I nearly recorded them
as equivalent.

**The instrument that works** puts the timer on the child and its stderr in a file:

```
{ echo e4; sleep 8; echo quit; } | { /usr/bin/time -p node src/cli.ts --ascii; echo "NODE_EXIT=$?" >&2; } 2>/tmp/t.txt | head -2 >/dev/null
```

which reads 3.07 / 3.08 / 8.02 / 3.08 for V1 / V2 / V3 / BASE. **Any row the repair hop writes about
"the session ends" must time the child, never the pipeline.**
