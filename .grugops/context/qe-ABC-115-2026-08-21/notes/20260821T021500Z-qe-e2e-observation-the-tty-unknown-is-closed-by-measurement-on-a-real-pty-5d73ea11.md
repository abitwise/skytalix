---
id: 20260821T021500Z-qe-e2e-observation-the-tty-unknown-is-closed-by-measurement-on-a-real-pty-5d73ea11
kind: observation
by: qe-e2e
at: 2026-08-21T02:15:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A9
  - ADR-0016
supersedes:
---

# THE `UNKNOWN - verify` FLAGGED AT THE DESIGN HOP IS CLOSED: `process.stdin.destroy()` ENDS THE SESSION ON A REAL TERMINAL STDIN

Every measurement on this ticket so far used `</dev/null`, a FIFO or a pipe. The design hop flagged
a **TTY** stdin `UNKNOWN - verify` and, as far as the notes show, nobody checked it. **It is checked
here, on a real pty, and the answer is clean.**

## The instrument

macOS `script(1)` allocates a pty. Running the pipeline **inside** the pty session gives the child
exactly the configuration nobody had tried — **stdin a TTY, stdout a pipe to a reader that closes**:

```
{ sleep 0.6; echo zz; sleep 10; } | script -q /dev/null /bin/sh -c \
  '{ /usr/bin/time -p node <ENTRY> --ascii; echo "NODE_EXIT=$?" >&2; } 2>/tmp/tty.txt | head -2 >/dev/null'
```

Confirmed the pty is real before trusting it: `process.stdin.isTTY` is `true` inside it.

## The measurement — 3 consecutive runs per build, no variance

| build | child `real` | `NODE_EXIT` |
|---|---|---|
| **delivered** | **0.61 / 0.60 / 0.61 s** | **0 / 0 / 0** |
| bare swallow (M1) | **10.62 / 10.62 / 10.62 s** — the writer's whole lifetime; it never ends on its own | 0 (end of input) |
| unfixed (M7) | 0.60 / 0.59 / 0.60 s | **1 / 1 / 1** |

The delivered build ends at ~0.6 s — the instant the settled `zz` forces the write that finds the
dead reader — with status `0`. **`process.stdin.destroy()` on a TTY handle drives the same
end-of-input transition it drives on a FIFO.** The primary shape `ADR-0016` clause 3 ruled needs no
fallback on a terminal either.

## Said plainly, because a silence here would have been the dishonest option

This closes an `UNKNOWN` rather than passing over it. What it does **not** cover: no human typed
into the terminal, the pty is `script`'s and not an interactive shell's, and raw-mode input was not
exercised (this product does not use it). A hop that changes the input seam re-measures.
