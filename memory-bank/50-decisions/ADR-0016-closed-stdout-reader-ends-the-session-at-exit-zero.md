# ADR-0016: a closed stdout reader ENDS the session at exit `0`, and the entry point — not the write site — owns the stdout error arm

## Status

accepted

Written 2026-08-20 by Architect/Design at task `design-ABC-115-2026-08-20`, closing `ABC-115`'s DoR
item 10 (the ⚠️: *"the exit-code ruling is BA/PM's and Architect/Design may overrule it at
`In Design`"*). **BA/PM's ruling is CONFIRMED, not overruled** — `ABC-115` `A2`(i)'s literal `0`
stands and the ticket is not re-cut.

**This ADR amends no contract.** The product keeps exactly three exit codes (`0` / `1` / `70`), so
`AGENTS.md` `## Development` and `src/cli.ts`'s exit-code docblock stay true **verbatim** and no edit
is owed to either (see clause 2). `ADR-0009`, `ADR-0011`, `ADR-0013`, `ADR-0014` and `ADR-0015` are
byte-unchanged and no clause of any of them is narrowed or widened. `ABC-043` is not re-opened.

## Context

**Every number in this section was measured at this hop**, in a throwaway worktree off
`grugops/cut-epipe-regression` @ `c9e7e11`, Node **v24.12.0**, macOS. BA/PM's cut notes at
`.grugops/context/cut-epipe-regression-2026-08-20/notes/` are **unstamped** (`human_admission` is
`off`, no `finding` is admissible on this install), so they were treated as claims and re-derived.

`node src/cli.ts --ascii </dev/null | head -2` exits **1** with an unhandled `write EPIPE` and a
Node stack on stderr. Three facts decide this ADR:

1. **The failure is asynchronous by construction.** The `'error'` event on `process.stdout` is
   emitted outside the promise chain, so `main()`'s single `try`/`catch` (`src/cli.ts:167-183`)
   cannot observe it and no `await` returns. Node then exits with its **default** uncaught-exception
   status, which happens to be `1` — the collision with `USAGE_EXIT_CODE` is an accident of Node's
   default, not a decision anyone took. Re-measured here: `node src/cli.ts --nonsense` also exits
   **1**.
2. **There are five write sites and exactly ONE handle.** `src/frame.ts:238`, `src/frame.ts:244`,
   `src/turn-loop.ts:313`, `src/cli.ts:172` and `src/line-input.ts:239` all write to the same
   `process.stdout`, acquired **once** at `src/cli.ts:148` and passed onward as a `FrameSink` and as
   a `PromptOutput` (`ABC-043` `A9` pins that acquisition). A policy for "the reader went away" is a
   property of the **handle**, not of any of the five callers.
3. **`ABC-042` was safe by accident.** It wrote one frame and returned; the write had completed
   before the reader could go away. `ABC-043` made the entry point hold a session open across many
   writes, so for the first time a write can land after the reader is gone. Nothing in `ABC-043`'s
   diff is wrong.

The product's own written position is already on the page that would be violated by the cheap fix:
*"the stack belongs to whoever debugs the bug"* (`src/cli.ts:100-105`), and `70` was chosen over a
bare `2` *"so that a shell can tell a refused command line from a crashed session at all"*
(`src/cli.ts:109-115`).

## Decision

1. **A stdout consumer that stops consuming is not a failure of this product.** The session **ends**,
   its stderr stays **silent**, and the exit status is **`0`** — *"0 when the session ran"*
   (`AGENTS.md` `## Development`). The delivered precedent is end-of-input: `input ended`, exit `0`.
2. **The exit contract stays at exactly three codes — `0`, `1`, `70`.** No fourth code is added, so
   **no edit is owed to `AGENTS.md` and none to `src/cli.ts`'s exit-code docblock**: both describe
   the delivered behaviour verbatim after the fix, which is `ABC-115` `A8`'s first branch. (Had this
   ADR taken `141`, both documents would have needed amending — `AGENTS.md` while `ABC-109` is live
   against it under a byte cap.)
3. **The stdout HANDLE, not the write site, is the unit of ownership.** Whoever **acquires** a stream
   installs that stream's error policy; a module that **receives** a sink or an output as a parameter
   never installs an error listener and never inspects stream errors. Today the acquirer is
   `src/cli.ts:148`, so `src/cli.ts` is the one module that may own this and `src/frame.ts`,
   `src/turn-loop.ts` and `src/line-input.ts` stay untouched. This clause is a **general seam rule**,
   not an `ABC-115` special case: it is the same reasoning as `ABC-043` `A9`'s "acquired once, in the
   entry point", extended from acquisition to failure.
4. **The permitted shape, stated positively** (prohibitions alone leave the engineer choosing
   architecture inside a fix):
   - **one** `sink.on("error", …)` listener, installed at the acquisition site **before** the handle
     is handed to `runTurnLoop` or `createLineInputSeam`;
   - it **discriminates on the error code** — `(error as NodeJS.ErrnoException).code === "EPIPE"`;
   - on `EPIPE` it ends the session quietly (clause 6) and writes **nothing** to stderr;
   - on **any other code it does not swallow** — it re-throws, so a stdout failure nobody has
     measured (`ENOSPC`, `EIO`, a closed terminal) behaves **exactly as it does today** rather than
     being silently absorbed by a listener installed for a different purpose.
5. **Forbidden shapes**, each with the reason it is forbidden:
   - a global `process.on("uncaughtException")` — swallows the crash path `ABC-043` `A3` and `[D31]`
     exist to guarantee (`ABC-115` `A4` fails it);
   - a blanket `process.exitCode = 0`, or muting stderr — same defect, greener disguise;
   - a `try`/`catch` around any of the five write sites, or an error arm inside `frame.ts`,
     `turn-loop.ts` or `line-input.ts` — duplicates one policy across five callers, makes a receiver
     responsible for a lifetime it does not own (clause 3), and breaks `ABC-115` `A6`'s one-file
     fence;
   - a **bare swallow** — a listener that silences `EPIPE` and does nothing else. **Measured at this
     hop, and this is the one that looks green:** with a finite stdin it produces exit `0` and an
     empty stderr, and with a live stdin the session **runs on for as long as the human keeps typing,
     invisibly, into a dead pipe** (measured 8.02 s against 3.07 s for the ruled shape). It satisfies
     `A1` and `A2` and still leaves the product wrong.
6. **How the session ends. Primary: destroy stdin and let the delivered end-of-input transition carry
   it.** `process.stdin.destroy()` in the arm drives the existing `outcome.kind === "eof"` transition
   (`src/turn-loop.ts:311-314`), whose notice is written into the dead pipe and discarded, and whose
   `LoopOutcome.exitCode` is `0` — so the status still flows through the single assignment
   `process.exitCode = outcome.exitCode` and no second exit-status site is created. **Fallback,
   permitted only if the primary is measured to fail: `process.exit(0)` in the arm** — admissible
   here (and only here) because `src/cli.ts`'s two "NOT `process.exit()`" comments exist to stop a
   message the human must read being truncated, and on this path there is no such message and no
   reader. A hop taking the fallback **writes the measurement that forced it** beside the line.
7. **The divergence from the `128 + SIGPIPE` shell convention is deliberate**, ruled here so nobody
   re-argues it as an oversight. See `## Alternatives` 1.

## Alternatives

1. **`141` (`128 + SIGPIPE`) — the shell-idiomatic answer. REJECTED, and not only on authority.**
   (a) It is a **fourth** code, against clause 2 and against coding rule 5. (b) Node **ignores
   `SIGPIPE`** for stdout — that is why an `EPIPE` error object exists at all — so a *truthful* 141
   requires restoring the default disposition and re-raising the signal, which kills the process by
   signal; `ABC-115` `A2` requires `signal === null`. (c) The remaining route is a hand-set
   `process.exitCode = 141`, i.e. **a status that claims a signal death that did not happen** — the
   `ABC-114` species of defect, a true-sounding statement that is not true. (d) It changes the
   observable result of the ordinary `set -o pipefail; chess | head` for every script on this
   project, in exchange for a distinction no consumer has been measured wanting.
2. **`70` (`INTERNAL_ERROR`). REJECTED:** the line it prints — *"a bug ended this session"* — would be
   false. Nothing crashed; a consumer stopped consuming.
3. **`1` (status quo). REJECTED on measurement:** `1` is `USAGE_EXIT_CODE` and a refused command line
   was measured exiting `1` at this same hop. Two unrelated outcomes on one code is the defect.
4. **An error arm per write site, or inside the frame/loop/input modules. REJECTED:** clause 5.
5. **A `Result`-typed write seam** (every `sink.write` returning success/failure, threaded back
   through the loop). **REJECTED as gold-plating:** it re-types three modules and the loop's control
   flow to express one boolean the entry point can observe directly, for a build that has one
   consumer of the answer.

## Consequences

- The engineer's edit is **≤ 5 production lines plus a comment**, in `src/cli.ts` only —
  comfortably inside `ABC-115` `A6`'s ≤ 15-line fence, and the fence stays meaningful rather than
  becoming the target.
- `ABC-115`'s pre-registered **`XS` re-size trigger is NOT fired.** The guard does **not** collapse to
  one child: `A3` still needs both close points on both glyph modes plus the control, because clause
  6's primary shape is the thing being asserted and it is observable only through a real child.
- **A stdout error that is not `EPIPE` still crashes with a stack and exit `1`.** Clause 4 leaves it
  exactly as it is today. **This ADR does not fix that and does not claim to** — it is named here as
  open rather than quietly absorbed, and it is a ticket for whoever first measures one, not a
  speculative arm added now.
- A script running `set -o pipefail; npm run chess | head -2` now observes **`0`** where it observed
  `1`. That is the point, and it is the one behaviour change a consumer can see.
- The absolute path of the checkout stops being disclosed on this path (`ABC-115` `A1`), which is the
  ticket's one real security line. ASVS L1: informational.
- **No NFR row is seeded.** This design adds no latency, composes no frame (`NFR-002` untriggered)
  and creates no lane cost beyond the children `ABC-115` already priced under `N8-SPAWN` (ceiling
  +5). A catalog row for a design with no measurable bar would be a row nobody can fail.

## Rollback

Reverting is one commit: remove the listener and the product is back to today's measured behaviour
(exit `1` with a stack). Nothing else depends on this ADR.

**How this ADR is falsified — the triggers are pre-registered so a later hop reverses it on
evidence, not on taste:**

- **A consumer is measured needing to tell "the reader went away" from "the session ended
  cleanly".** Clause 1 is then wrong and `141` (or a fourth code) is re-opened, with `AGENTS.md` and
  the `src/cli.ts` docblock amended in the same change. This is also `ABC-115`'s pre-registered `P0`
  trigger.
- **A real non-`EPIPE` stdout write failure is measured in the wild.** Clause 4's re-throw is then
  the wrong default and routing it to `70` becomes a ticket.
- **The same unhandled-`error` shape is found on a second stream** (stderr, stdin). Clause 3 should
  then be applied there too — by the acquirer of that handle — rather than this ADR being widened by
  reading.
- **A future entry point acquires stdout somewhere other than `src/cli.ts`.** Clause 3 travels with
  the acquisition; the ADR does not name `src/cli.ts` as a privileged file.

Superseding this ADR is done by writing `ADR-0017`, not by editing this file.
