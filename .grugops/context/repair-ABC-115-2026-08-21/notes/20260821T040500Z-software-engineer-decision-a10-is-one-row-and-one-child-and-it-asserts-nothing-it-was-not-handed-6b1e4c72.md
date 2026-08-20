---
id: 20260821T040500Z-software-engineer-decision-a10-is-one-row-and-one-child-and-it-asserts-nothing-it-was-not-handed-6b1e4c72
kind: decision
by: software-engineer
at: 2026-08-21T04:05:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A10
  - G-QE115-1
  - ADR-0016
  - N8-SPAWN
  - src/cli.test.ts
supersedes:
---

# `A10` IS WRITTEN AS THE RULING HANDED IT — ONE ROW, ONE CHILD, ZERO PRODUCTION LINES, AND NOTHING CHOSEN AT THE BENCH

The instrument was **measured and handed over** by BA/PM at `rule-ABC-115-residuals-2026-08-21`, not
suggested. I re-ran it to confirm it reproduces here and then used it verbatim. **Nothing about the
shape was re-derived**, which is the point of a ruling that arrives with its own readings.

## What landed in `src/cli.test.ts`

1. **`unwritableStdout()`** — a builder beside `closedReader` and `heldOpenReaderClosed`:

   ```
   childOf("/bin/sh", ["-c", `${PRODUCT} --ascii 1</dev/null; echo "NODE_EXIT=$?"`])
   ```

   **ZERO new `spawnSync` call sites.** It goes through the existing `childOf`, so the
   one-call-site / one-import pin stays green — re-run and green at this hop.
2. **`CHILDREN.unwritableStdout`** — the seventh of `ABC-115`'s children, and the twenty-fourth of
   the file's.
3. **The `A10` row** in the existing `ABC-115` describe, asserting **exactly two things**.

## The two assertions, and everything deliberately NOT asserted

```
expect(status).not.toBe(0);           // non-zero
expect(child.stderr).not.toBe("");    // non-empty
```

**No status literal, no errno name, no byte count, no stack shape.** The delivered status on this
path is `1` = `USAGE_EXIT_CODE`, the collision this ticket neither fixes nor endorses and which the
`## Residual ruling` accepts knowingly with a named cut trigger. A row pinning `1` would pin that
defect and go red for the wrong reason the day a later ticket routes non-`EPIPE` to `70`. **This row
stays green through that change** — which is the ruling's own stated design goal for it.

## The trap, obeyed and re-measured rather than taken on trust

**The wrapper exits `0` on every build.** The `1</dev/null` redirection binds `node` alone, so the
wrapper's status is the trailing `echo`'s. Measured here on the delivered build, 3/3:
`wrapper_exit=0`, `stdout=NODE_EXIT=1`, stderr **1562 bytes** (BA/PM read 1507 — the difference is
path length, and the byte count is a reading, never an assertion, exactly as `A1`'s is). **The row
reads the status through the file's existing `productStatusOf`, never from `child.status`.**

## Non-vacuity, structural rather than a witness

`productStatusOf` **throws** when the marker is absent, so reaching the assertions is already proof
the product ran and exited. The same shape `A1` uses, and it is why the row cannot pass by the child
having failed to start.

## What I refused to write into the row

- **A byte-count or stack assertion.** Recorded as readings in the comment, asserted nowhere.
- **A widened production arm.** `src/cli.ts` is byte-unchanged; the arm already discriminates and
  `A10` only asserts that it does. `git diff --numstat 92ccec5 HEAD` → `128 34 src/cli.test.ts` and
  nothing else.
- **A second `spawnSync` call site**, or an async `spawn` shape. Both would red the pin.
