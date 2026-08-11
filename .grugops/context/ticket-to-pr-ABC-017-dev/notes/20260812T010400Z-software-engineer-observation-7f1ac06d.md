---
id: 20260812T010400Z-software-engineer-observation-7f1ac06d
kind: observation
by: software-engineer
at: 2026-08-12T01:04:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-017-dev
  - ABC-017
  - ABC-012
  - NFR-002
  - NFR-008
  - N8-LANE
  - plans/nfr-catalog.md
  - src/history-pane.ts
supersedes: 
---

# `A12` measured on delivered code, the replay coefficient, and the `N8-LANE` cost

> Hand-authored; `scripts/context-io.ts` is absent. **Not a `finding`** — these are the engineer's
> measurements and **Security/NFR owns the verdict.** No wall-clock assertion was put in the suite;
> that is this project's standing rule and it is honoured.
>
> **All figures: Apple Mac15,13 (M3), Node v24.12.0, darwin/arm64. `UNKNOWN - verify` on any other
> hardware.** Measured out of tree against the delivered pane, 2,000 warm iterations then 20,000
> timed, `ABC-012`'s deterministic game as the builder the `## Test notes` mandate.

## `A12` part 1 — pane compute ≤ 150 µs at 40 / 120 / 300 plies. **HOLDS.**

| plies | measured | against the 150 µs bar |
|---|---|---|
| 40 | **38.52 µs** | 0.257x |
| 120 | **67.16 µs** | 0.448x |
| 300 | **71.95 µs** | 0.480x |
| 378 (the game's full length) | **73.08 µs** | 0.487x |

BA/PM's target measurement was *"worst 75.95 µs at 378 plies, 0.51x"*. Delivered: 73.08 µs, 0.487x —
**4% under the target**, which is a re-measurement agreeing rather than a claim inherited.

## `A12` part 2 — the three figures within 3x. **HOLDS at 1.868x.**

Against BA/PM's 1.845x on the same builder. The fixture dependence the ticket records reproduces
exactly: the same delivered build on a fixed-content knight shuffle measures 46.80 / 48.00 /
48.50 µs, a ratio of **1.036x** (BA/PM measured 1.060x). **A bar a correct build clears by 7% on one
legal fixture and by 65% on another is measuring the fixture, and the `2x → 3x` correction on this
ticket is confirmed by delivered code.**

## `A12` part 3 — `A11`'s spied call counts. **HOLDS, and it is asserted in the suite.**

Seven tests in `src/history-pane.nfr.test.ts`. Four wrong builds are killed by these and by nothing
else — see the wrong-builds note.

## The replay coefficient — the item flagged for Security/NFR at this gate

The ticket flags: *"when the bounded pane is measured on delivered code, record the replay
coefficient alongside the absolute."* Measured on the delivered pane with the window's content held
constant (knight shuffle, 40 → 4,000 plies):

> **`46.45 µs + 6.58 ns/ply`, R² 0.99963.**

| plies | 40 | 400 | 1,000 | 2,000 | 4,000 |
|---|---|---|---|---|---|
| µs | 46.78 | 49.00 | 53.25 | 59.31 | 72.88 |

Two notes on reading it. The **intercept is the SAN term** — ~46 µs of `toSan` for 16 visible plies —
and the **slope is the replay term**. BA/PM's harness measured `1.56 µs + 7.42 ns/ply`; the
intercept differs because that harness isolated the replay and this measures the whole pane, and the
**slope agrees to 11%** on a coefficient neither run looked up before measuring. At 4,000 plies the
pane is **72.88 µs, 0.486x of the bar** — the practical consequence of `O(plies)` is nil inside any
legal game, exactly as the ticket says. `plans/nfr-catalog.md` is **NOT edited here**.

## `NFR-002`'s structural fact, re-verified on delivered code

*"`src/history.ts` has ZERO importers, so nothing pulled the repetition derive into a frame."*
Re-verified by `grep` on the delivered tree, not by reading the ticket:

- **Production modules: zero runtime importers.** `src/history-pane.ts` imports `GameHistory` as
  `import type`, which `verbatimModuleSyntax` erases entirely. This is asserted **in the suite**
  against delivered source, so it cannot rot.
- **Test files: two, and that is a change.** `src/history.test.ts` was the only one; this ticket adds
  `src/history-pane.test.ts`, which imports `newGame` / `playMove` / `takeBack` at runtime to build
  fixtures — `A7` requires `takeBack` by name. **Stated plainly so the gate's `grep` is not
  surprised by a second hit.** It is not what the `O(window)` claim is about, and the in-suite
  assertion is scoped to production modules for exactly that reason.

## `N8-LANE` — the two test files this ticket declares

Measured as the protocol names it: the **median of paired per-round deltas over 7 interleaved
rounds**, user + sys CPU of `npx vitest run`, with the two files moved out of `src/` and back
between arms.

| | median paired delta |
|---|---|
| with vs without the two files | **730 ms CPU** |
| **identity null control** (both arms identical, 7 rounds) | **90 ms CPU** |

Against the declaration the ticket makes: floor **~320 ms** for two files, content allowance
**650 ms**. Net of the floor the content cost is **~410 ms**, inside the allowance. **No bar was
re-derived and no clause of `N8-LANE` was touched** — the ticket forbids re-deriving one and it was
not. The null control is reported because the run showed a monotonic thermal drift across rounds
(7.18 s → 7.55 s on the unchanged arm); the paired design absorbs it and the control quantifies what
is left.

`A13` added **no** test file, as the ticket states. It added one `it` to `src/frame.test.ts`, which
is already in the lane.
