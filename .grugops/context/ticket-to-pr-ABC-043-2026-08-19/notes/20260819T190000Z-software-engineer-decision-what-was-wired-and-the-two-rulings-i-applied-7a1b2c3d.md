---
id: 20260819T190000Z-software-engineer-decision-what-was-wired-and-the-two-rulings-i-applied-7a1b2c3d
kind: decision
by: software-engineer
at: 2026-08-19T19:00:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-019
  - ABC-037
  - ABC-042
  - ABC-078
  - ADR-0011
  - ADR-0013
  - src/cli.ts
supersedes:
---

# What `ABC-043` wired, and the three implementation decisions that were mine to take

## The wiring, in one paragraph

`src/cli.ts` stops printing a board and runs a game. After the resolver returns, the entry point
reads `process.stdout` **once** into `sink`, then calls `runTurnLoop` **once** with the six merged
options: `newGame(START_FEN)`, the resolved `colour` as `humanColour`,
`makeRenderSeam(mode, orientation)`, `createLineInputSeam({ source: process.stdin, output: sink })`,
`createEngine({ budgetMs: DEFAULT_BUDGET_MS })`, and `sink`. No cast, no adapter — `tsc --noEmit` is
the instrument and it is clean. The whole session sits inside the product's one `try`/`catch`.

`beginFrameSession` is **gone from the entry point**: the loop owns the session, so `A6`'s "exactly
once" is a property of merged, mutation-tested code rather than of a second call site here. The
`frame.ts` import went with it, and so did `gameStatusOf` — the loop computes the status.

## Decision 1 — the internal-error line does NOT echo the thrown value

`A3`(ii) requires the crash line to carry none of the ten `TerminalReason` values and none of `win`,
`draw`, `resign`, `checkmate`, `stalemate`. **A build that echoes the error's own message makes that
a property of the message rather than of this build**: one `throw new Error("checkmate detection
failed")` anywhere below and the delivered product prints a chess word on its crash path. So the
line is fixed text — `internal error: a bug ended this session, and it is not a chess outcome` — and
the thrown value is not printed at all.

**The cost is named rather than hidden: a crash gives the human an exit code and one sentence, and
no diagnostic detail.** The ticket's own ruling asks for exactly that (*"print an internal-error line
that names no chess result, and exit non-zero"*), and no criterion asks for the stack. If a later
ticket wants detail, the shape that keeps `A3` true is a detail line the product itself composes,
never a passthrough of a message written by the code that broke.

## Decision 2 — the crash exits **70**, not 2

`sysexits.h`'s `EX_SOFTWARE`. The criterion says only "non-zero", and the usage error already
occupies `1`. One code for both would mean a shell could not tell *"you typed the command wrong"*
from *"the product broke"* — and `A4`'s "distinguishable by message **and** exit code" would then
rest on the message alone. Recorded on the ticket's exit-code rule, which now reads: `0` when the
session ran (including `engine-threw` and `engine-failure`, carried **verbatim** from
`LoopOutcome.exitCode`), `1` for a refused command line, `70` for an exception that never became a
`LoopOutcome`.

## Decision 3 — `A3` substitutes the PARSER, and this is an EXTENSION of BA/PM's ruling

**Flagged, not smoothed.** BA/PM licensed the substitution rig *"for the ENGINE seam under `A2`/`A5`
only"* and named three modules that must never be substituted: `./line-input.ts`, `./frame.ts`,
`./turn-loop.ts`. `A3` asks for **an `InputSeam` that throws**, and the delivered `InputSeam` is
total by construction — there is no input that makes it throw.

The three ways to reach `A3` and what happened to each:

1. **Substitute `./command-input.ts` — ADOPTED.** `resolvePromptLine` is what `src/line-input.ts`
   calls, and `ABC-037` ruled that the reader **catches nothing**, so a parser bug crosses the real
   seam, the real loop repairs the borrowed board and rethrows, and the real entry point handles it.
   This is `[D31]`'s scenario played straight: *a parser bug*. None of BA/PM's three named modules is
   touched, and no production line, export, flag or env var was added — the first limit of the
   ruling, which is the one that decides whether the ruling still applies, is untouched.
2. **Substitute `./line-input.ts`** — refused by BA/PM's second limit, by name.
3. **An env- or argv-gated fault path in `src/cli.ts`** — refused by the ticket, by `ADR-0013`
   clause 3, and by me. It was never considered as a fallback.

**Why this is an extension and not an application:** the licence says "the engine seam", and
`command-input.ts` is not the engine seam. **QE and Architect/Design should read it as such.** The
alternative was to leave `A3` — the criterion the ticket says decides the ticket — unbuilt.

## What I refused

- **No default or placeholder opponent** (`ADR-0013`). The merged engine ships; nothing needed one.
- **No new module**, no second `spawnSync` call site, no new test file.
- **No edit to `src/turn-loop.ts`**, `src/frame.ts`, `src/render-seam.ts`, `src/line-input.ts`,
  `src/engine.ts`, `src/move-input.ts` or `src/command-input.ts` — all seven byte-identical.
- **No merge, no deploy, no board column moved, no DoR table edited.** The `In Development` →
  `In Review` move this role normally owns is left to the Orchestrator, because the brief forbids it.
- **No claim that `N8-LANE` is met.** The cost is reported as a measurement.
