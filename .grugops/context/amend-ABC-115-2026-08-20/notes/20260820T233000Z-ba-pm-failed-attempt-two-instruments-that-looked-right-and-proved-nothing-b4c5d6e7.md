---
id: 20260820T233000Z-ba-pm-failed-attempt-two-instruments-that-looked-right-and-proved-nothing-b4c5d6e7
kind: failed-attempt
by: ba-pm
at: 2026-08-20T23:30:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A9
supersedes:
---

# TWO INSTRUMENTS I BUILT FOR `A9` AND THREW AWAY — recorded so the repair hop does not build them again

## 1. AN OPEN STDIN THAT SUPPLIES NOTHING — hangs on ALL FOUR builds, discriminates nothing

The cheapest idea for "the session ends" was: hold stdin open, send **no input**, close the reader
after 2 lines, and assert the child exits.

```
mkfifo $F; ( sleep 30 > $F & ); set -o pipefail; node <build>/cli.ts --ascii < $F | head -2
```

**Measured: BASE, V2 and V3 all ran to the 12 s kill. Not one exited.**

**Why, and it is the load-bearing fact for anyone writing this row:** the `EPIPE` needs a **write
that happens after the reader is gone**, and the session does not write again until it is given
input. The opening 24-line board and the prompt fit the pipe buffer and land before `head` is gone.
**No input, no write, no `EPIPE`, no discrimination — the unfixed build looks exactly like the fixed
one.** `A9` therefore MUST supply a line; that is not decoration.

## 2. THE SAME INSTRUMENT WITH NO SETTLE DELAY — flaky, and it was nearly shipped

```
mkfifo $F; ( { echo zz; sleep 10; } > $F & ); ... | head -2
```

**Measured on the delivered build: 2 of 3 runs crashed in 0.09 s (exit 1); 1 of 3 HUNG to the bound.**
The input races the reader's close: when `zz` arrives early enough, the answering write lands while
`head` is still reading, no `EPIPE` fires, and the session simply waits for more input.

A settle delay fixes it deterministically — **0.2 s ran 8/8 on both builds** — and `A9` requires
>= 0.5 s plus 5 consecutive identical runs before the row ships. **A guard whose Given is a race is
not a guard**, and this one would have failed intermittently in a lane where a hung child is the most
expensive failure there is.

## 3. INHERITED, NOT REPEATED: timing the pipeline instead of the child

Architect/Design recorded this dead end and I did not re-walk it — their instrument (timer on the
child, stderr to a file) was used as given and reproduced their numbers to the hundredth of a second.
**Recorded here only so a reader of THIS task's notes finds it without needing the sibling task's.**
The `A9` instrument sidesteps it entirely: the FIFO writer is detached, so `sh` waits only for the
child and no timer is needed at all.
