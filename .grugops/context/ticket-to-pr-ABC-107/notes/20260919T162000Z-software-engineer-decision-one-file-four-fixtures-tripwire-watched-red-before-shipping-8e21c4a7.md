---
id: 20260919T162000Z-software-engineer-decision-one-file-four-fixtures-tripwire-watched-red-before-shipping-8e21c4a7
kind: decision
by: software-engineer
at: 2026-09-19T16:20:00Z
verified_by:
confidence: high
refs:
  - ABC-107
  - ADR-0022
  - EPIC-002
  - src/frame.overflow-bound.test.ts
  - src/frame.ts
  - plans/tickets/ABC-107-the-message-region-cannot-show-a-seven-candidate-ambiguity.md
supersedes:
---

# `ABC-107` — one new file, four fixtures, no width asserted, and the tripwire was watched RED

**NOT A STAMP.** `context.human_admission` is `off`; hand-authored per the contract.

1. **File name: `src/frame.overflow-bound.test.ts`.** Named for the module whose packing sets the
   bound (`src/frame.ts`), not for `move-input`, because the ticket's fences say the dispatcher is
   untouched and its test file is `ABC-034`'s neighbour — a sibling hop is live on
   `src/move-input.ts`/`src/san.ts`, so the new rows go NEXT TO the frame, not into `ABC-033`'s file.
   The ticket's `A4` phrase "`ABC-033`'s delivered test file is unchanged except for added rows" is
   satisfied by adding zero rows there, which is the stricter reading and the one that cannot collide.
2. **Four fixtures, not three.** The ticket names the 6/7/8-knight FENs (test note 1, verbatim);
   `ADR-0022` clause 2 says "four fixtures" and its observation note supplies the 8-queen FEN. The
   fourth costs one `describe` and pins the other piece type that reaches the cap of 8; it was
   measured hidden 3 at the ruling hop and reads hidden 3 here. No fixture was constructed.
3. **No width is asserted** (ticket test note 2). Every number is read back from the emitted
   frame: hidden through the `(+N more)` marker exactly as `src/move-input.test.ts` reads it, row
   count through `frame.length`, reachability through `resolveMoveInput(...).kind === "move"` with
   `from`/`to` compared by value (the ruling hop's own recorded trap: comparing `Move` objects by
   reference across two `legalMoves` calls reads 0/8).
4. **The tripwire was watched go red before it shipped.** With `MESSAGE_ROWS` temporarily set to 3
   in `src/frame.ts`, the file reds 7 of 25 rows (the 7- and 8-knight hidden/marker/shown rows);
   the 6-knight and reachability rows stay green, as they should — six fits at three rows too.
   `src/frame.ts` was reverted with `git checkout --` and `git status` shows it clean. This is the
   `AGENTS.md` rule from `ABC-037`: never ship a guard you have not watched fail.
5. **Zero production lines, by measurement.** `git diff --name-only a5a9178~1 a5a9178 | grep -v
   '\.test\.ts$' | grep '^src/'` is EMPTY. No docblock in `src/frame.ts` or `src/move-input.ts`
   was touched: `A2`–`A5` did not require one, and the subtask says "otherwise none".
6. **Not done here, named so nobody reads it in:** `ABC-033` `A4`'s "NOT met" stays as it is on
   its own page (`ADR-0022` says so); the marker's wording is `ABC-034`'s; no `plans/board.md`,
   `AGENTS.md` or `plans/nfr-catalog.md` byte moved.
