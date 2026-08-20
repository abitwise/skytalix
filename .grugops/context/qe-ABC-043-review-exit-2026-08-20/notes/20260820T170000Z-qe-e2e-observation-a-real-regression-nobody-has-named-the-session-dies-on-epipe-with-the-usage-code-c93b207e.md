---
id: 20260820T170000Z-qe-e2e-observation-a-real-regression-nobody-has-named-the-session-dies-on-epipe-with-the-usage-code-c93b207e
kind: observation
by: qe-e2e
role: qe-e2e
task: qe-ABC-043-review-exit-2026-08-20
at: 2026-08-20T17:00:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-042
  - ABC-019
  - src/cli.ts
supersedes:
---

# A REAL PRODUCT REGRESSION, introduced by `ABC-043`, that no criterion on the page reaches: **`npm run chess -- --ascii | head` dies with a raw Node stack trace and exits `1`**

I found this by accident — a mistyped `cat -A` closed the pipe on me — and then measured it
deliberately, because it is the shape `[D31]` was ruled about and it is on the wrong side of the
product's own exit-code rule.

## The measurement

`main` @ `d127ae3`, Node v24.12.0, macOS:

```
node src/cli.ts --ascii </dev/null | head -2      →  child exit 1
```

stderr carries:

```
node:events:486
      throw er; // Unhandled 'error' event
      ^
Error: write EPIPE
    at … src/frame.ts:244:10
    at runTurnLoop (… src/turn-loop.ts:281:5)
    at main (… src/cli.ts:156:27)
```

- **No `internal error:` line.** `grep -c 'internal error'` on stderr → **0**.
- **No result screen**, and the stack names three merged modules and a line number.
- **Exit `1`** — the code `src/cli.ts:90` reserves for **a refused command line**, and the code the
  module's own docblock says is chosen so *"a shell can tell a refused command line from a crashed
  session at all"*. On this path a shell **cannot** tell them apart.
- `| head -30` (the whole first frame consumed before the pipe closes) → **exit 0**, no trace. The
  trigger is a reader that closes **before the session's last write**: `| head`, `| less` and quitting
  with `q`, `| grep -q`.

## It is a REGRESSION, and I pinned which commit introduced it

Three isolated trees, same command, same Node:

| tree | result |
|---|---|
| `54cbb23` — `ABC-042`'s tip, the board-printer | **exit 0**, no stack trace |
| `46457b8` — `ABC-043`'s delivery | **exit 1**, unhandled `write EPIPE` |
| `d127ae3` — `main` today | **exit 1**, unhandled `write EPIPE` |

**`ABC-042` was safe by accident:** it wrote one frame and returned, so the write had completed before
the reader could go away. **`ABC-043` is the ticket that made the entry point hold a session open
across many writes**, and that is what put a write after the reader's exit. Nothing in `src/cli.ts`'s
diff is *wrong*; the hazard is a consequence of the feature.

## Why this fails NO criterion, stated so nobody reads it as softer than it is

- **`A3`'s Given is *"an `InputSeam` that throws"*.** This build is not that Given. `A3` passes as
  written and I proved it bites with two decoys.
- **The exit-code ruling on the page is scoped to *"an exception that never became a `LoopOutcome`"*
  and its adopted option is *"catch it at the top"*.** An unhandled `'error'` event on
  `process.stdout` is emitted **asynchronously, outside the promise chain** — the one `try`/`catch`
  around the session cannot see it, by construction, and no `await` returns. So the ruling's *letter*
  does not reach this path either.
- **Its SPIRIT is breached, observably.** *"Exit 0 means the process did what it was asked; non-zero
  means it could not"* holds — but *"non-zero is reserved for exactly two things"* now has a third,
  wearing the first one's number.

**My call: OPEN DEFECT, NOT BLOCKING the `In Review` exit.** Closing it needs a **production line** in
`src/cli.ts` (a `process.stdout.on("error", …)` arm, or an `EPIPE` filter), a criterion of its own and
a guard — that is a cut ticket with the owner's sizing, not a repair-round patch, and `ABC-043` is not
licensed to add production behaviour nobody asked for (coding rule 5, and `ADR-0013`'s discriminator:
code a human can exercise by running the delivered product is a feature, not a fixture).

**RECOMMENDED — the Orchestrator's call: cut it.** `P2`, `S`. Suggested criterion, in the shape this
project's pages use: *given a stdout consumer that closes before the session ends, the process writes
no stack trace, writes the internal-error line or nothing at all, and exits with a code that is not
`USAGE_EXIT_CODE`.* **I did not author the fix and I did not author the test.**
