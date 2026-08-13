---
id: 20260813T122000Z-qe-e2e-observation-the-no-second-derive-deduction-survives-the-bar-that-guarded-it-did-not-7e2b91af
kind: observation
by: qe-e2e
at: 2026-08-13T12:20:00Z
verified_by:
confidence: high
refs:
  - ABC-021
  - ABC-019
  - ABC-035
  - NFR-002
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - src/turn-loop.nfr.test.ts
  - src/history.ts
supersedes:
---

# The no-second-derive deduction SURVIVES. The bar that was guarding it did not — and this ticket is the first code through the gap

> **Hand-authored.** Not a `finding`. This is the answer to *"does that blind spot also exist in what
> was just built?"*, and it is **yes**, measured twice.

## The deduction, as delivered

`ABC-021` adds **zero** derives on any advancing ply. Measured, not conceded: `gameStatus` at
`plies + 1`, `gameStatusOf` at `plies + 1`, `repetitionCounts` at **0**, `turn-loop.nfr.test.ts`
unedited and green at 40 / 120 / 300 plies. **A build that reads availability from a second
`gameStatusOf` (M12) is red in 11 tests, including all four `nfr` rows.** The claim path itself is
free: an ALLOWED claim is answered from `status`, the ply's own evaluation, and derives nothing at
all. **That half of the deduction is sound and I could not break it.**

## But the bar guarding it had a door, and `ABC-021` is the first production code to walk through it

`gameStatusOf` → `repetitionCounts` → `keyHistory` are three names for one `O(plies)` replay
(`history.ts:116-153`). The suite's two standing bars watch **two** of the three:

- `gameStatus` — spied through `vi.mock("./gameend.ts")`, and it is genuinely **process-wide**,
  because `history.ts`'s own `import { gameStatus } from "./gameend.ts"` resolves to the mock too;
- `repetitionCounts` — spied at the `history.ts` module boundary, so it sees only calls made from
  **outside** that module (the honest limit both test files already document);
- **`keyHistory` — spied by nothing.**

**`ABC-021` opened the first production import edge from `src/turn-loop.ts` to `keyHistory`**
(`turn-loop.ts:52`, new in this diff) and used it in `claimShortfall`. The hole pre-existed; this is
the first code through it.

### M2 — the measurement, and it is unambiguous

Add **one line** to the loop's advancing tail:

```ts
    keyHistory(history);           // a second O(plies) replay, EVERY ply
    status = gameStatusOf(history);
```

**Result on the delivered suite: `tsc` 0, `814 passed / 814`, GREEN.** `repetitionCounts` still reads
**0**. `gameStatus` still reads **`plies + 1`**. Both bars read their exact correct-build values while
the build pays the second 46-50 µs-at-120-plies replay per ply that `NFR-002` prices and forbids.
**A count that nothing counts is not a bar.**

### M16 — the same hole from the boundary side, and it is the falsifier my brief sent me to hunt

The brief named the target: *"a build that routes through `game-over` and passes everything."* There
are two of them and they do not have the same verdict.

- **M1 — the seam derives `gameStatusOf` and returns `{kind: "game-over", result: "draw", reason}`;
  the loop's claim arm is deleted. → CAUGHT**, by exactly one assertion in one test: `A3`'s
  `expect(derivesMade()).toBe(1)`, which reads 2.
- **M16 — the same build, but the seam adjudicates from `keyHistory` + `position.halfmoveClock` and
  never touches `gameStatus`. → SURVIVED. `tsc` 0, `814 passed / 814`, GREEN**, with the loop's
  entire claim adjudication replaced by `throw new Error(...)`.

**M16 falsifies the ARGUMENT in the Engineer's decision note, while leaving the DECISION standing.**
The note says: *"For a seam to decide whether a claim is available it must derive the status itself —
`gameStatusOf(history)` — which is the second derive `NFR-002` prices."* **It must not.** A seam can
adjudicate for one `keyHistory` replay — precisely what `claimShortfall` itself pays — so the cost
argument is **symmetric, not asymmetric**, and it does not by itself forbid the alternative. The
decision is still right for the *other* two reasons the note gives, and those are the ones that
should carry it: the loop is the only actor holding the ply's status **for free** on the ALLOWED
path (the seam's replay is a real extra cost the loop does not pay), and *"it also puts the ruling in
the wrong ticket."* **The ranking of the reasons is wrong, not the conclusion.**

## What I built, and it costs zero test files

I added `keyHistory: vi.fn(actual.keyHistory)` to the existing `vi.mock("./history.ts")` factory in
`src/turn-loop.test.ts` — a call-through spy, no behaviour change — and one row, **`A8`**, that
ledgers the derive instead of counting it:

| clause | run | asserts |
|---|---|---|
| (i) | 8 advancing plies, no claim | `keyHistory` **0**, `repetitionCounts` **0**, `gameStatus` **9** |
| (ii) | one REFUSED claim | `keyHistory` **1** — `claimShortfall`'s, the one the module declares |
| (iii) | two refusals | `keyHistory` **2** — the price is per refusal and is never cached |
| (iv) | 8 plies then an ALLOWED claim | `keyHistory` **0** — the loop answers from `status`, so the seam cannot have adjudicated |

**Re-measured against the same mutants:**

```
M2  (keyHistory every ply)     SURVIVED (814/814)  ->  CAUGHT: A8 (i)  "expected keyHistory 0, got 8"
M16 (the seam adjudicates)     SURVIVED (814/814)  ->  CAUGHT: A8 (iv) "expected keyHistory 0, got 1"
M14 (claimable.by overwritten) SURVIVED            ->  SURVIVED, correctly — see the criteria note
```

**Clause (iv) is the one that matters most and I want it named:** it is the only assertion in the
tree that pins the ticket's central boundary — *the LOOP adjudicates transition 16, the seam asks* —
and it pins it by cost rather than by structure, which is the only way a test can see it.

## The `ABC-035` hazard is REAL as a risk and FALSE as stated — measured

The Engineer flagged that `ABC-035`'s parser, asking availability *"through `gameStatusOf(history)`"*
(`ABC-035` `## Out of scope`, verified at source), makes a second derive on every advancing human
ply, and wrote that it arrives *"through a door the loop's own call-count spy cannot see, because the
derive happens inside the seam rather than in `runTurnLoop`."*

**The risk is real. The invisibility is not.** M17 builds exactly that parser — `void
gameStatusOf(history)` at the top of the stub input seam, every prompt — and it turns **seven tests
RED, four of them `ABC-019`'s own** (`A3`, `A3b`, `A5`, `A6`, the real-panel wiring row, plus
`ABC-021`'s `A3` and `A6`). `derivesMade()` counts `gameStatus` process-wide, wherever it is called
from.

**That matters to BA/PM's ruling and it should not be inherited wrong:** if `ABC-035` is built the
way its own `## Out of scope` describes, the suite goes red the day it lands — a loud failure, not a
silent 46-50 µs. The parser shape that is genuinely invisible is one that adjudicates from
`keyHistory`, and after `A8` that one is caught too.

## What is NOT closed, and I am not the owner of it

`turn-loop.nfr.test.ts` — which I was forbidden to touch, and did not — still says in its own header
that *"`repetitionCounts` at 0 proves the loop derives nothing on its own."* **After this ticket that
sentence is false**: the loop derives on the refused-claim path, and the spy that would show it is in
the other file. The Engineer saw this and said so honestly (*"now means 'on every advancing ply'"*),
and he was right not to edit a file his subtask fenced. **Owner: whoever holds `ABC-030`'s rewrite of
the four `*.nfr.test.ts` files.** The one-line remedy is the same spy I added: put
`keyHistory: vi.fn(actual.keyHistory)` in that file's `vi.mock("./history.ts")` factory and assert it
at **0** beside the existing `repetitionCounts` at 0. That closes the per-ply bar's own hole at the
place the bar lives, and my `A8` (i) is only a proxy for it.
