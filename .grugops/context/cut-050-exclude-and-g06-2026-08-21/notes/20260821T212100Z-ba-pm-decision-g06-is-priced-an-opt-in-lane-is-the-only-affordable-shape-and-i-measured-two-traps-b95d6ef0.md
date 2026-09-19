---
id: 20260821T212100Z-ba-pm-decision-g06-is-priced-an-opt-in-lane-is-the-only-affordable-shape-and-i-measured-two-traps-b95d6ef0
kind: decision
by: ba-pm
role: ba-pm
task: cut-050-exclude-and-g06-2026-08-21
ticket: ABC-119
at: 2026-08-21T21:21:00Z
verified_by: ""
confidence: high
refs:
  - ABC-119
  - ABC-043
  - ABC-108
  - ABC-115
  - ADR-0014
  - NFR-004
  - NFR-008
supersedes: ""
tree: main @ 565c623 (paired runs on scratch copies outside the repository, `node_modules` symlinked)
---

# `G-06` is PRICED, and the price is what rules the shape: an **opt-in lane**, paid OUT of the default lane rather than into it

**Hand-authored `decision`. `context.human_admission` is `off`; no `finding` is admissible and this
carries no stamp.** Every number is my own run on 2026-08-21.

## The gap, re-derived rather than inherited

- **Four** `DEFAULT_BUDGET_MS = 0` substitutions in `src/cli.test.ts`; every child that would reach
  an engine turn carries one.
- The wiring is asserted **textually** at `src/cli.test.ts:2447` against the entry point's SOURCE.
  That proves the line is written, not that it runs.
- `src/cli.test.ts:655-671` states the exclusion in the tree itself, with QE's 3.09 s figure in it.
- **`ENGINE_DEEP` does not close it.** `src/engine.test.ts:69` gates in-process unit cases on
  `chooseMove`/`createEngine`. It never spawns the CLI. **Seam covered, composition not.**

## The real-engine child: CONFIRMED, not stale

`node src/cli.ts --colour black --ascii </dev/null`, three consecutive runs:
**real 3.09 / 3.07 / 3.07 s, user 3.19 s each.** This matches `ABC-043`'s recorded 3.085 s / 3.192 s.
**Of the numbers I was told to distrust, this one survived.**

## The arithmetic that EXCLUDES a default-lane row — this is the pricing the cut turned on

`src/cli.test.ts`'s `N8-SPAWN` clause **in force** (the 2026-08-21 budget ruling) is **≤ 7 added
children AND ≤ 2.0 s added wall AND ≤ 0.30 s added CPU per added child**, and the count stands at
**`17 + 7 = 24`, at its ceiling**.

| clause | one real-engine child | |
|---|---|---|
| ≤ 7 added children | 7 of 7 already spent | **no room** |
| ≤ 2.0 s added wall (whole) | 3.07 s from ONE child | **breached 1.5x** |
| ≤ 0.30 s added CPU per child | 3.19 s | **breached ~10.6x** |

And the lane it would join is already over `NFR-008` (≤ 3 s wall AND ≤ 13 s CPU): **~4.1–4.3 s wall,
~16.5–17.3 s CPU**, read here; `ADR-0014` has it BREACHED and `ABC-108`'s `OQ-1` open.

**So the default-lane row is not a judgement I declined — it is arithmetically excluded, three ways.**

## What the opt-in lane costs the default lane: MEASURED, and it is noise

Base vs mutant, one extra always-collected file whose deep cases are undefined when the variable is
unset, **5 interleaved paired rounds after a discarded warm-up**, both trees outside the repository:

- wall deltas +0.09 / +0.32 / +0.09 / 0.00 / +0.02 → **median +0.09 s**, sign non-negative 5/5
- CPU deltas +0.06 / +0.57 / +0.21 / +0.02 / −0.11 → **median +0.06 s**, sign positive 4/5
- **skip count 0** both ways

**That is the answer to "how did you price it against a breached budget": the 3.07 s per child is
charged to the opt-in lane, and the default lane — the one that is breached — pays +0.09 s wall and
+0.06 s CPU.** `NFR-008` bounds *"`npm test` with `PERFT_DEEP` unset"*; the opt-in lane is outside
that clause by construction, which is why all four existing deep lanes are shaped this way.

## TWO CONSTRUCTION TRAPS I MEASURED, because both defeat the obvious build

**1. `describe.runIf(RUN_DEEP)` REPORTS A SKIP.** Built and run: `41` files, **`1 skipped`**. That
moves the gate's test-integrity count off **0**, and `.grugops/test-skips.md` is **human-owned** — an
agent may not write a justification to clear its own gate. Re-run with `if (RUN_DEEP) { describe(…) }`:
**skip count 0**. `src/engine.test.ts:64-69` states this reason in the tree; I confirmed it costs a
skip rather than trusting the comment.

**2. A new file that registers NOTHING when the variable is unset FAILS the default lane.**
`Error: No test suite found in file …`, `Test Files 1 failed`. **This is why all four existing deep
lanes live inside files that also carry default-lane tests** — a fact the four-lane "precedent" is
usually cited for without anyone saying it out loud. `ABC-119` `A2` makes it a watched green.

## The determinism ruling

The real search's choices are hardware- and time-dependent. **`ABC-119` `A3` bars any assertion
naming a move, score, depth or node count** and requires four properties the search cannot legally
violate: legality checked by the project's own generator, arrival inside `NFR-004`'s 3 s as a BOUND
(explicitly not a re-measurement of that NFR), the session advancing, and a clean exit with no stack.
**A criterion that flips on a different machine is not a criterion.**

## What I refused

- **To promote any hand-run transcript to a criterion.** QE said of its own: *"That is not a
  criterion and I am not recording it as one."* I ran the product myself and hold my own run to the
  same rule.
- **To raise the `N8-SPAWN` ceiling pre-emptively.** The ceiling has been raised twice, both by BA/PM
  on a page with the derivation written. Whether a raise is needed depends on a placement decision
  that is the delivering hop's, so `ABC-119` carries a **named stop** — the hop halts and asks — and
  that is the single ⚠️ on its DoR (item 5).
- **To edit `plans/nfr-catalog.md` or `AGENTS.md`.** Both are named owed. `NFR-008`'s
  *"`PERFT_DEEP` unset"* wording is **ALREADY under-inclusive by three today** — `SEARCH_DEEP`,
  `ENGINE_DEEP` and `INPUT_DEEP` all exist and none is named — so that debt **pre-exists this ticket**
  and is Architect/Design's; `ABC-119` would make it fourth, not create it.

## The fence, verified rather than promised

`sed -n '28,35p' plans/nfr-catalog.md | shasum -a 256` =
**`63f667958eeabcaa884d45b18b513c7bbe9855266c4959dfd16f87b0802eca31`** on **8** rows — the brief's
`63f66795…ca31`, **confirmed by hashing**, and unchanged at the end of this hop.
