---
id: 20260820T223000Z-architect-design-decision-the-entry-point-owns-the-stdout-error-arm-and-here-is-the-permitted-shape-c6b71f45
kind: decision
by: architect-design
at: 2026-08-20T22:30:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - ADR-0016
  - src/cli.ts
  - src/frame.ts
  - src/turn-loop.ts
  - src/line-input.ts
  - ABC-043
supersedes:
---

# THE SEAM: the stdout HANDLE is the unit of ownership, so `src/cli.ts` owns the arm — and the PERMITTED shape, not just the prohibitions

Full reasoning, alternatives and falsification triggers are in
`memory-bank/50-decisions/ADR-0016-closed-stdout-reader-ends-the-session-at-exit-zero.md`. This note
is the hand-off summary; the ADR is the authority.

## The seam rule (ADR-0016 clause 3)

**Whoever ACQUIRES a stream owns that stream's error policy. A module that RECEIVES a sink or an
output as a parameter never installs an error listener and never inspects stream errors.**

There are **five write sites and exactly one handle**: `src/frame.ts:238`, `src/frame.ts:244`,
`src/turn-loop.ts:313`, `src/cli.ts:172`, `src/line-input.ts:239` all write to the `process.stdout`
acquired once at `src/cli.ts:148` (`ABC-043` `A9` pins that acquisition). "The reader went away" is a
property of the handle, not of any caller — so `src/cli.ts` is the one module that may own it, and
`frame.ts`, `turn-loop.ts` and `line-input.ts` stay byte-unchanged. This is `ABC-043` `A9`'s "acquired
once, in the entry point" extended from acquisition to failure; it is a general rule, not an
`ABC-115` carve-out.

## The permitted shape (ADR-0016 clause 4) — stated positively, as the brief required

- **One** `sink.on("error", …)` listener, installed at `src/cli.ts:148` **before** the handle is
  handed to `runTurnLoop` or `createLineInputSeam`.
- It **discriminates on the code**: `(error as NodeJS.ErrnoException).code === "EPIPE"`.
- On `EPIPE`: end the session quietly, write **nothing** to stderr.
- On **any other code: do NOT swallow — re-throw**, so an unmeasured stdout failure (`ENOSPC`, `EIO`,
  a closed terminal) behaves exactly as it does today. **A listener installed for `EPIPE` must not
  silently absorb everything else** — that is the quiet half of the same defect `A4` guards.

## How the session ends — PRIMARY and FALLBACK, so the engineer is not choosing architecture in a fix

- **PRIMARY: `process.stdin.destroy()` in the arm.** It drives the delivered end-of-input transition
  (`src/turn-loop.ts:311-314`); the notice goes into the dead pipe and is discarded; the loop returns
  `LoopOutcome.exitCode === 0`, so the status still flows through the single existing assignment
  `process.exitCode = outcome.exitCode` and **no second exit-status site is created**. Measured at
  this hop: exit `0`, empty stderr, child ends at **3.08 s** on a live stdin instead of running on.
- **FALLBACK: `process.exit(0)` in the arm.** Also measured green (exit `0`, 3.07 s). Permitted
  **only if the primary is measured to fail**, and then with the measurement written beside the line.
  It is admissible here — and only here — because `src/cli.ts`'s two "NOT `process.exit()`" comments
  exist to stop a message the human must read being truncated, and on this path there is neither a
  message nor a reader. **Do not generalise that exception.**

## FORBIDDEN, and the fourth one is the one that looks green

1. Global `process.on("uncaughtException")` — destroys the crash path `ABC-043` `A3` and `[D31]`
   guarantee; `A4` fails it. (`A4` forbids this; the ADR agrees and adds the rest.)
2. Blanket `process.exitCode = 0`, or muting stderr — same defect, better disguise.
3. A `try`/`catch` at any write site, or an arm inside `frame.ts` / `turn-loop.ts` / `line-input.ts` —
   one policy duplicated across five callers, a receiver made responsible for a lifetime it does not
   own, and `A6`'s one-file fence broken.
4. **A BARE SWALLOW** — a listener that silences `EPIPE` and does nothing else. **Measured: it passes
   `A1` and `A2` on the ticket's own Givens (finite stdin → exit `0`, empty stderr) and with a LIVE
   stdin the session runs on invisibly into a dead pipe for as long as the human keeps typing —
   8.02 s against 3.07 s.** No criterion on the page catches it. **The repair hop must assert the
   ENDING, not only the status.**

## Consequences for the ticket, so the engineer can size his own hop

- Edit is **≤ 5 production lines plus a comment**, `src/cli.ts` only — inside `A6`'s ≤ 15-line fence
  with room to spare.
- **`ABC-115`'s pre-registered `XS` re-size trigger does NOT fire.** The guard does not collapse to
  one child: `A3` still needs both close points on both glyph modes plus the 24-line control, and the
  "session ends" property above deserves a row of its own.
- **A suggested addition to `A3`, offered and NOT imposed** (criteria are BA/PM's pen): a child whose
  stdin stays open after the reader closes, asserting the child **exits** rather than lingering. It
  is the only row that kills forbidden shape 4. If BA/PM declines it, the repair hop should at least
  record the measurement.
- `N8-SPAWN` unchanged at the ticket's +5 ceiling if that row is not added; **+6 if it is**, which is
  above the ceiling BA/PM derived — so **that row needs BA/PM's word, not an engineer's judgement at
  the bench**.
