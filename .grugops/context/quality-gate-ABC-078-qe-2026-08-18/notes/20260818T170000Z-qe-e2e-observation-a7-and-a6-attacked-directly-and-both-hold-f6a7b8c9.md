---
id: 20260818T170000Z-qe-e2e-observation-a7-and-a6-attacked-directly-and-both-hold-f6a7b8c9
kind: observation
by: qe-e2e
at: 2026-08-18T17:00:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - src/engine.ts
  - src/turn-loop.ts
supersedes:
---

# `A7` and `A6` attacked directly. **Both hold**, and the only way to break `A7` is to break the clock's contract instead

## `A6` — byte-identity, re-verified by blob hash rather than by eye, and against three references

```
git hash-object src/turn-loop.ts          -> 9334daf1d2c2242e2071830c491e3b7f86a16a79
git rev-parse 3054ee0:src/turn-loop.ts    -> 9334daf1d2c2242e2071830c491e3b7f86a16a79   (branch base)
git rev-parse main:src/turn-loop.ts       -> 9334daf1d2c2242e2071830c491e3b7f86a16a79
git rev-parse 16e9269:src/turn-loop.ts    -> 9334daf1d2c2242e2071830c491e3b7f86a16a79   (the brief's base)
```

**Four identical hashes.** The engineer's note records the base deviation (`3054ee0` rather than
`16e9269`) honestly; the hash is the same at both, so the deviation cannot have hidden a change to
this file.

The whole delivered `src/` diff, independently: `git diff --stat 3054ee0 4d4f818 -- src/` is
**exactly two added files** — `src/engine.ts` (278) and `src/engine.test.ts` (558), **0 deletions,
0 modifications**. `plans/board.md` is not in the diff, which is correct on this project.

`A6`'s behavioural half also holds under attack: M5 (the illegal-move mutant) is caught by
`runTurnLoop`'s own `wasGenerated` membership test in the scripted-game test, not only by the
static assignability check. **`A6` MET.**

## `A7` — attacked with a corpus twice the delivered one, and it does not break

The delivered `A7` uses 209 positions. I built **409**, adding the shapes the standing corpus
never reaches: white and black promotion ranks, en passant for both colours, full castling rights,
near-stalemate, near-mate, the **218-legal-move** maximum-mobility construction, a bare-kings-plus
endgame and a position at the fifty-move edge (`halfmoveClock 99`). Budgets: **1, 0, −1, 0.5 and
`Number.EPSILON`.**

**With a well-behaved clock, across 2 164 calls:**

| clock | budgets | calls | null | threw | **illegal** | position mutated |
|---|---|---|---|---|---|---|
| real `Date.now` | 1, 0, −1, 0.5, ε | **2 045** | **0** | **0** | **0** | **0** |
| already-spent (`0` once, then `1e9`) | 1, 0, −1, 0.5, ε | 85 | 0 | 0 | 0 | 0 |
| always `0` (deadline never reached is impossible at ≤ 0 budgets) | 0, −1 | 34 | 0 | 0 | 0 | 0 |

**Not one null, not one throw, not one illegal move, not one mutated position.** The `finally`-wrapped
`unmakeMove` does its job: every one of the 2 045 real-clock positions was byte-identical after an
aborted search. **`A7` MET, and it survived a corpus and a budget set the delivered suite does not
use.** I could not break it.

`createEngine`'s documented throw is also exactly as documented — on a mated position (0 legal
moves) it throws `engine: asked to move in a position with no legal move`, which is the caller-bug
path `turn-loop.ts` names `engine-threw`, not a chess outcome.

## The ONLY way I could make `chooseMove` misbehave: give it a clock that does not progress

Three injected clocks make `chooseMove` **never return**. Every failure below is a non-termination
watchdog firing at 40 clock reads — **never a null, a throw or an illegal move from the engine
itself**:

| clock | terminates? |
|---|---|
| constant `1e9` (with `budgetMs > 0`, so the deadline is `1e9 + budget`) | **NO** |
| strictly decreasing (goes backwards) | **NO** |
| random jitter below the deadline | **NO** (6/17 and 2/17 of sampled positions) |
| `Date.now`, already-spent, constant-`0`-at-a-spent-budget | yes, always |

**The rule is one sentence: `chooseMove` terminates only if the injected clock eventually reaches
`start + budgetMs`.** The deepening loop has no other exit — no iteration cap (correctly, that is
`A4`), no node cap, no wall-clock fallback.

**This is the same defect as the `Infinity` budget** in the `A1` note § 6, seen from the other
input: `deadline = start + budgetMs` becomes unreachable either because `budgetMs` is `Infinity` or
because the clock never gets there. **The module's termination depends on two unstated
preconditions and neither is documented or tested.** `Clock` is typed `() => number` and its
docstring is *"A source of milliseconds. `Date.now` satisfies it; a test supplies virtual time
instead."* — no monotonicity requirement, no progress requirement.

**Severity LOW, and deliberately so.** `Date.now` satisfies both preconditions, `DEFAULT_BUDGET_MS`
is finite, the only injector today is the test suite, and coding rule 8 says not to write handling
for scenarios that cannot occur. **I am not asking for a guard.** I am asking for one sentence on
`Clock` and on `EngineOptions.budgetMs` recording what the module requires of them — because the
seam exists precisely so that something OTHER than `Date.now` can be passed in later, and the next
person to pass one in has nothing telling them what it must satisfy. It costs two comment lines and
no production logic.
