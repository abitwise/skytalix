---
id: 20260818T213000Z-software-engineer-decision-rf-1-implemented-exactly-as-specified-and-what-i-refused-to-add-a1c2e3f4
kind: decision
by: software-engineer
at: 2026-08-18T21:30:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - NFR-004
  - RF-1
  - AR-NFR004-A
  - EPIC-006
  - src/engine.ts
  - src/engine.test.ts
supersedes:
---

# `RF-1` implemented **exactly as Security/NFR specified it**, and the one thing that was
deliberately NOT added

**This is not a stamp.** No `finding` is admissible on this install; this is a hand-authored
`decision`. It carries no `§14-gate#<id>`.

## The clamp, as it went in

Four items were specified. All four landed, in `src/engine.ts` and nowhere else.

**1. The constant, beside `DEFAULT_BUDGET_MS`:**

```ts
/**
 * `NFR-004`'s hard ceiling, in milliseconds. A bound on the MECHANISM, not a difficulty:
 * `NFR-004` says the ceiling holds AT ANY DIFFICULTY, so it is honoured here whatever a caller
 * passes. `EPIC-006` chooses a budget; it does not choose the ceiling.
 */
export const HARD_CEILING_MS = 5_000;
```

**2. The one line in `chooseMove`'s `budget` initialiser:**

```ts
    // `Math.min` and NOT an `if`: it preserves every degenerate budget already measured safe
    // (`NaN` stays `NaN` — both comparisons false, depth 1; `0` / `-1` / `-1e9` unchanged) and
    // turns `Infinity` into the ceiling, which is the module's only non-terminating budget.
    deadline: start + Math.min(options.budgetMs, HARD_CEILING_MS),
```

**3. The two comment lines.** `budgetMs`'s valid range is now on the field itself
(`0 < budgetMs <= HARD_CEILING_MS`, larger values capped rather than honoured, degenerate values
still returning depth 1), and the `Clock` contract is on the type: **real-time and
non-decreasing** — a frozen or backwards clock does not terminate, and nothing defends against
that. That is QE's `G6` documentation half.

**4. One assertion, on the INJECTED clock.** Four of them in the end, and every one runs on
virtual time — no wall-clock assertion entered the suite. They cost 11 ms of the default lane.

## `Math.min` was the right shape and I verified the claim rather than trusting it

The specification's reasoning was that `Math.min` preserves every degenerate input already
measured safe. Measured at the repair tip, injected clock, `startpos`:

| `budgetMs` | `deadline` | completed depth | before the clamp |
|---|---|---|---|
| `NaN` | `NaN` | 1 | 1 — unchanged |
| `0` | `start` | 1 | 1 — unchanged |
| `-1` | `start − 1` | 1 | 1 — unchanged |
| `-1e9` | `start − 1e9` | 1 | 1 — unchanged |
| `3 000` | `start + 3 000` | unchanged | unchanged |
| `Infinity` | **`start + 5 000`** | 3 | **never returned** |

The degenerate row is asserted in the suite, not just measured, precisely because it is the
reason the fix is a `Math.min` and not a conditional: an `if (budgetMs > HARD_CEILING_MS)` would
be equally correct here today and would silently stop preserving `NaN` the moment somebody
"tidied" it into a clamp helper.

## What I did NOT add, and why that is a decision rather than an omission

**No safety margin.** The ~1.03% overshoot on clause A is `AR-NFR004-A`, an accepted risk with a
named owner; the residual after this clamp — a 10 s budget still returning ~5 003 ms on a real
clock — is the same risk by the same mechanism. Security/NFR refused to require a margin, QE
recorded the original refusal as correct, and I hold it: a margin makes the sentence true by
making `budgetMs` a lie, in the one module whose entire subject is that the budget is honest.

**The residual is written into the module header rather than left for someone to rediscover:**
the clamp bounds the DEADLINE, not the abort granularity. The suite says so too — the `RF-1`
tests deliberately do **not** assert that a 10 s budget returns within 5 000 ms exactly, and the
comment says why.

**No validation, no throw, no rejection.** Not required, and adding any of them would be an
unrequested behaviour change on an input the module already handles (coding rules 5, 7 and 8).

## One thing I added that was not specified, and the reason

`RF-1`'s infinite-budget case, written the obvious way, does not fail on an unclamped build — it
**hangs**. `deadline` is `Infinity`, the deepening loop has no other exit, and a synchronous CPU
loop is not interruptible by a test timeout, so the whole FILE stops reporting and every other
criterion in it goes silent. I confirmed that by running it: the clamp-removed mutant ran for
**ten minutes** without the suite completing.

So the `RF-1` clock carries a **fuse** — it throws once it has been consulted more than 64 times.
The clamped build uses four of the sixty-four, so the fuse is invisible in green; on an unclamped
build it converts a hang into three named failures in under 1.3 s. A guard that cannot report is
not a guard, and this is the second time on this ticket that a criterion looked present and was
not.
