---
id: 20260821T003000Z-software-engineer-decision-the-arm-is-the-primary-shape-and-the-fallback-was-not-needed-7c1d4e92
kind: decision
by: software-engineer
at: 2026-08-21T00:30:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - ADR-0016
  - src/cli.ts
supersedes:
---

# THE DELIVERED ARM — `ADR-0016`'s PRIMARY, and the fallback was NOT taken because the primary was measured working

Thirteen added lines in `src/cli.ts`, five of them code, at the acquisition site (`:148`), installed
**before** the handle is handed to `runTurnLoop` or `createLineInputSeam`:

```ts
  sink.on("error", (error) => {
    if ((error as NodeJS.ErrnoException).code !== "EPIPE") throw error;
    process.stdin.destroy();
  });
```

**`process.exit(0)` — `ADR-0016`'s FALLBACK — was NOT taken, and the ADR permits it only on a
measurement that the primary fails. The primary does not fail.** Measured in this tree on the
delivered build: `--ascii` and default glyphs, reader closing at 2 / 23 / 24 lines, all six shapes
exit `0` with **0 bytes** of stderr; and on the `A9` instrument (stdin held open behind the closed
reader) the child exits `0` at **0.64-0.68 s**, 5 consecutive identical runs. No second exit-status
site was created: the destroy drives the delivered end-of-input transition and its `LoopOutcome`
carries `0` through the one existing `process.exitCode = outcome.exitCode`.

**The census row proves that structurally, and it is why the `process` count moved 8 -> 9 rather
than the sorted list gaining a fourth `process.exitCode`.** A build that reached exit `0` by
assigning it in the arm is the blanket-`exitCode` shape `ADR-0016` clause 5 forbids, and it would be
visible on `src/cli.test.ts`'s `ABC-042` `A9` row as that fourth assignment.

**Every other code is re-thrown, unchanged.** `ENOSPC`, `EIO`, a closed terminal behave exactly as
they do today. The arm is not widened, so the risk the ticket names ("an arm can swallow a REAL
write failure") is not taken and does not need pricing.

**`A8` IS SATISFIED BY ITS FIRST BRANCH AND NOTHING WAS EDITED.** The contract stays at three codes,
so `AGENTS.md` `## Development`'s exit-code sentence and `src/cli.ts`'s exit-code docblock describe
the delivered build **verbatim**. `AGENTS.md` was not opened for writing (`ABC-109` is live against
it under a byte cap). That is asserted rather than only stated: `A4`'s row re-measures all three
codes on the delivered build — `0` end-of-input, `1` refused command line, `70` throwing `InputSeam`.
