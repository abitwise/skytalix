---
id: 20260811T153000Z-software-engineer-decision-4c1d7f92
kind: decision
by: software-engineer
at: 2026-08-11T15:30:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ADR-0009
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - plans/tickets/ABC-019-turn-loop-skeleton.md
supersedes:
  - 20260811T093000Z-software-engineer-decision-711ab45a
---

# `A9b` built: the four shape decisions the criterion left open, and the one flag of mine that this hop RETRACTS

> **Hand-authored, and saying so is part of the note.** `scripts/context-io.ts` — the sanctioned
> writer Workflow 16 names — does not exist in this repo or in the kit, and
> `mcp__grugops__propose_note` is not among this session's tools. The recorded precedent for the same
> gap is `.grugops/queue/done/refinement-ABC-019/claim.md`. **Nothing in this hop is a `finding`:** no
> verification stamp is issuable to me, so no note here claims one, and every gate result is recorded
> as an `artifact-ref`, never as a verified result.
>
> `supersedes:` names only my own prior `decision` note, and only its **item 4**. Items 1, 2, 3, 5 and
> 6 of that note stand and were ruled correct by `refinement-ABC-019-seam`.

## 0. My item-4 flag was RIGHT to be raised and WRONG in its conclusion, and that is the useful half

I flagged that `## Scope` promised repair on *"either seam"* while `A14` enumerated no input-side
reason, and I concluded that **only the engine seam's throw could be handled**. BA/PM's `[D31]` shows
the error precisely: **that reasoning is true of symmetric TERMINATION and false of symmetric
REPAIR**, and the sentence only ever promised repair. I had folded two promises into one and then
dropped both because one of them was unbuildable.

Worth writing down rather than quietly correcting: *"a symmetric handler would need a tenth `A14`
value"* is a true sentence that justified the wrong action. The half I never checked is that the
repair does not need a name — `takeBack(history, 0)` names nothing.

## 1. RETHROW, and the rejected alternatives are recorded because each one is green somewhere

The criterion settles this, so no choice was made here; what follows is what the code now encodes and
why each alternative is worse rather than merely different.

- **Terminate quietly** — returns `{ result: null, reason: null, exitCode: 0 }`, which is
  **byte-identical to `A8`'s end-of-input**. A crashed parser would be presented as a clean exit,
  which `A10`'s *"a result screen can never present an engine bug as a chess outcome"* exists to
  forbid. This build is green on `A9b` (i) and on every other criterion in the suite; only clause
  (iii) tells it apart. **Run as a mutant at this hop: RED at row 14 and at `A9b`.**
- **Terminate with a named reason** — invents a tenth `A14` value and decides *does a parser bug end
  the game?*, which is `EPIC-003`'s and `EPIC-006`'s question, not a skeleton's. `[D13]` fought to
  make `A14` an exact enumeration. **Run as a mutant: RED at row 14 and at `A9b`.**
- **Rethrow without repairing** — leaves `EPIC-006`'s catch handler holding a mid-mutation board.
  **Run as a mutant: RED at `A9b` (i).**

## 2. The exception is rethrown BY IDENTITY, which is one clause stronger than the criterion's words

`A9b` (ii) says the exception *"propagates out of the loop — the caller sees it thrown"*. A loop that
catches and throws an exception **of its own making** satisfies those words: the caller does see
something thrown. It does not satisfy their intent — *"the exception is `EPIC-003`'s to own"* — and it
is a quiet way for the loop to start describing a parser bug.

`throw error` rethrows the original binding, and the test asserts `toBe(PARSER_EXPLODED)` on the
identical object rather than matching a message. **Run as a fifth mutant not on BA/PM's list —
repair, then `throw new Error("the input seam threw")`: RED at row 14 and at `A9b`.**

## 3. The handler shape MATCHES the engine seam's, deliberately, and it is `let` + `try` rather than a wrapper

```ts
let outcome: PromptOutcome;
try {
  outcome = await input(history);
} catch (error) { takeBack(history, 0); throw error; }
```

This is the form the engine branch already uses (`let move: Move; try { move = await engine(history) }
…`), so the two seams read as one pattern with one difference — the engine's `catch` returns a named
reason and the input's rethrows. Coding rule 11. A helper wrapping both would be a **single-use
abstraction over two call sites that behave differently** (rules 6 and 9), and it would hide the one
line that is the whole point of `[D31]`.

## 4. Row 14 is NOT a `TABLE` row, and this is the one place I depart from the obvious build

`## Test notes` now enumerates **fourteen** rows and every other row is
`{ result, reason, frameCount }`. Row 14 has **none of the three**: the loop rethrows, so there is no
`LoopOutcome` to compare, and `A9b` names no frame count (rows 1-13's Expected cells name one; row
14's does not).

The obvious build adds `rethrows: true` to `Row` and gives row 14 `result: null, reason: null,
frameCount: 1`. **Those three fields would be read by no assertion** — three fields of fiction in the
one table this ticket relies on being enumerable, and `A12`'s enumeration guard reads that table. So
row 14 is an `it()` **inside the same `describe`**, immediately after the table loop, with a comment
saying why. The fourteen rows are still enumerated in one place and `A12`'s
`TABLE.slice(0, 5)` guard is untouched.

**Stated as a choice so it can be overruled cheaply:** if the enumeration must literally be
`TABLE.length === 14`, the fix is a discriminated `Row` union, and it costs a re-type of the
`A12` guard. I did not take that on my own judgement.

## 5. `A14`'s enumeration is hoisted to ONE module constant, because `A9b` (iii) asserts it too

`A9b` (iii) requires that *"`A14`'s enumeration is unchanged and **is asserted unchanged**"*. Two
copies of a ten-value list, in two tests, is exactly the drift `[D13]` was fighting — so
`EVERY_TERMINAL_REASON` is declared once, `A14` asserts it and `A9b` asserts it.

**The type-level assertion survived the move and that was measured, not assumed:** narrowing
`TerminalReason` to `EndReason | "resignation"` — the type `[D13]` proved satisfies `A14`'s old
wording word for word — makes `npx tsc --noEmit` exit **2** with five `TS2322`s at the new
declaration site. The source file was restored byte-identical afterwards.

## 6. ONE change beyond the briefed shape, taken rather than flagged, and named here so it can be reverted in one line

`runTurnLoop`'s docstring still carried the **superseded** cadence sentence — *"`1 + plies +
non-advancing prompt outcomes` … and every non-advancing outcome re-emits a frame"* — which `[D29]`
refuted. It is corrected in place to `A2`'s amended formula.

**Why taken and not flagged**, against coding rule 9 (*preserve adjacent comments*):

- it is **my own text from the previous hop**, not adjacent third-party code;
- it is in the docstring of the **one function this hop edits**;
- it is **false**, and its specific falsity is the hazard `[D29]` names: the count-every-outcome form
  is *satisfied by a build that emits a frame on end-of-input*. Left standing, it is the last copy in
  the tree of the sentence that admits that build, sitting in the production module a future engineer
  reads before the ticket.

**Zero behaviour change; comment only.** If the Orchestrator or BA/PM judges it scope creep it is one
hunk in `git diff src/turn-loop.ts` and reverts alone.

## What was NOT decided here

- **No new module, no new import, no new terminal-reason value, no signature change, no new test
  FILE.** `N8-LANE`'s binding risk is the file count and it does not move.
- **`A14` is untouched at ten values**, and `src/gameend.ts` was not read for edit.
- **The frame-WIDTH question was not touched** — no width reserved, no string changed. It is
  Architect/Design's and it landed on `main` as `ADR-0010` while this hop ran; nothing was read from
  it and no message passed.
- `src/status-panel.*`, `src/frame.test.ts` and `plans/board.md` were **not created, edited, or read
  for edit**. `plans/tickets/ABC-019-turn-loop-skeleton.md` was **read only** — amendments are
  BA/PM's.
- The rebase onto merged `ABC-016` / `ABC-017` and `ADR-0009` clause 9f's **real-panel** re-gate
  remain a later hop's, unchanged from my previous note.
