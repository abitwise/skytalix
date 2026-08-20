---
id: 20260821T020500Z-qe-e2e-observation-i-mutated-the-delivered-arm-eight-ways-and-a9-has-teeth-3f21c0a7
kind: observation
by: qe-e2e
at: 2026-08-21T02:05:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A9
  - A4
  - ADR-0016
supersedes:
---

# I BUILT MY OWN MUTANTS RATHER THAN RE-RUNNING THEIRS — EIGHT ARMS, AND `A9` IS AS LOAD-BEARING AS THE PAGE SAYS

The suite under review was written by the hop that wrote the fix, so a green run of it proves
little. **The instrument here is mutation of the DELIVERED production line, with the delivered
suite left byte-unchanged.** Each mutant replaces exactly the four-line `sink.on("error", ...)` arm
at `src/cli.ts:158-161` and nothing else; `npx vitest run src/cli.test.ts` is the reading. The tree
was restored between every run (`git status --porcelain` empty at the end, checked).

| # | mutant arm | lane | killed by |
|---|---|---|---|
| M1 | **bare swallow** — `if (code !== "EPIPE") throw error;` and nothing else | **RED** | `A9`'s child — `heldOpen` never returns, `spawnSync /bin/sh ETIMEDOUT` at the 4 s bound, the file does not load |
| M2 | **code check DROPPED** — `sink.on("error", () => process.stdin.destroy())` | **GREEN, 60/60** | **NOTHING — see the `claim` note on the re-thrown branch** |
| M3 | ends the session, but at `setTimeout(..., 3500)` | **RED** | `A9`'s child, at the bound — **the bound discriminates a LATE ending, not only a missing one** |
| M4 | **inverted** — re-throws `EPIPE`, ends the session on every other code | **RED, 4 rows** | `A1`, `A2`, `A3`, `A9` |
| M5 | the delivered arm **plus** `process.exitCode = 0` | **RED** | `ABC-042` `A9`'s `process`-occurrence pin (9 → 10) |
| M6 | `process.exit(0)` instead of `process.stdin.destroy()` — **`ADR-0016`'s own sanctioned FALLBACK** | **RED** | the same `process`-occurrence pin |
| M7 | arm deleted (the unfixed shape, reverted in place) | **RED, 5 rows** | `A1`, `A2`, `A3`, `A9`, and the `process` pin |
| M8 | destroys stdin **and keeps writing** (`setInterval(() => sink.write(...), 100)`) | **RED** | `asciiClosedAt2` at the **30 s** default bound, **not** `A9` |

## What this settles, and it is the brief's first danger

**`A9` is not decoration and it is not fragile.** It is the only row that kills M1, it kills M3 as
well — so "the session ends" is asserted as a BOUND with real teeth rather than as an eventual
truth — and M4 proves the non-`EPIPE`-ends-the-session shape reds on four separate rows. The
engineer's claim that `A9` is the guard is reproduced by an independent instrument.

## Two things worth a later hop's attention, neither a defect

- **M8 reds through the wrong door and it is EXPENSIVE.** A build that ends stdin but keeps writing
  hangs `asciiClosedAt2`, whose bound is `childOf`'s 30 s default, so that red costs 30 s of lane
  before it arrives. `A9`'s own child is bounded at 4 s. Not wrong — a red is a red — but a hop
  that meets it should know where the 30 s went.
- **`ADR-0016`'s sanctioned fallback cannot be adopted without editing a pin.** M6 is the shape the
  ADR names as the authorised fallback (`process.exit(0)` "only if the primary is measured to
  fail"), and it reds `ABC-042` `A9`'s `process`-occurrence count. If the primary ever does fail,
  the fallback costs that pin's derivation as well. Recorded here so that red is read as arithmetic
  and not as the fallback being broken.
