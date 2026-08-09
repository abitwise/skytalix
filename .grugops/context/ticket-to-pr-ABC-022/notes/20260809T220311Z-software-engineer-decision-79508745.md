---
id: 20260809T220311Z-software-engineer-decision-79508745
kind: decision
by: software-engineer
at: 2026-08-09T22:03:11Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - src/moves.enpassant.test.ts
  - src/moves.ts
  - src/apply.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# How site 7 is worded: the description KEPT and past-tensed, one paragraph added so the correction cannot be read as retiring the tests

`A11` site 7 is a **wording** job with a trap on each side of it — delete too much and the file loses
the rationale its tables are shaped by; correct too gently and it still lies; correct too hard and it
implies 58 tests are now decoration. This note records the wording decisions, because the wording is
the deliverable.

## The tense, and why it is the project's own standard rather than mine

`src/moves.ts` **183-195** was written in the past tense at the first engineer hop, by this role, in
the same change that made the present tense false: *"the last two used to be stated by this comment
and enforced by nothing"*, *"so the generator offered a capture onto the mover's own piece"*, *"an
absent captured pawn was still written into `move.captured`"*. Site 7 is held to exactly that
standard, so the file pair now reads consistently:

- **4-9** *"an occupant of the MOVER'S OWN colour **falls** through and the generator **offers** a
  capture onto the mover's own piece"* → **fell** / **offered**.
- **10-13**, half (b), which `A11`'s citation does not name but which is the same sentence's other
  half: *"The move **is** emitted with `captured: PAWN | …` regardless … the "restore" **CREATES**
  one"* → **was emitted** / **CREATED**. Past-tensing (a) and leaving (b) in the present would have
  produced an incoherent paragraph describing one defect in two tenses.
- **27-28** *"the call **reads** CLEAN on a board the generator **provably corrupts**"* → *"read
  CLEAN on a board the generator **was provably corrupting**"*.
- **4-5** also lost *"the comment **three lines** above it"*. That geometry is stale — the
  `src/moves.ts` comment is now 13 lines and the `if` sits at 196, not three below — so the phrase
  went rather than being preserved as decoration. Nothing true was deleted with it.

## What was ADDED, and it is the half of the job that stops the mirror-image error

Six lines after the (a)/(b) block:

> `src/moves.ts` CHECKS both now, so every row below reads 0 where it read 1 — which is these
> tables' job and not a reason to retire them. Delete the emptiness condition from the shipped fix
> and 8 of the 58 tests here go red; delete the captured-pawn condition and 23 do, the purity rows
> among them: `undoSpecial` is untouched by ABC-022 and still restores `move.captured`
> unconditionally, so the generator declining to emit the move is the whole of half (b)'s guard.

Three things are doing work there. The reader can tell the behaviour is **guarded now** — the brief's
first requirement. The mutant counts make "these tests still bite" a **measurement rather than a
reassurance**. And the `undoSpecial` clause is the strongest anti-complacency statement available:
that mechanism is **unchanged** (`src/apply.ts` 106-111 still writes `move.captured` back on any
`FLAG_EN_PASSANT` move), so nothing downstream of the generator would catch the move if it ever came
back — which is precisely why the A4 purity rows exist and why 11 of them go red on the
captured-pawn mutant.

The purity paragraph gets the same treatment in one clause: *"The pair-level oracle is the one that
saw it, and it stays for the same reason the tables do."*

## The sentences I refused to write

- **"The generator is correct now."** Not established by anything, and not the file's business. The
  paragraph says `src/moves.ts` checks these two preconditions — which is what the tests below
  assert — and stops there.
- **"These rows are historical."** The mutant counts say the opposite, and this board's recorded
  failure shape is a green signal read as protection.
- **Anything about `A11`, the sweep, or which hop found what.** A source comment is not a changelog.
  The ticket carries that; the file carries the behaviour.

## What was NOT rewritten in this file, deliberately

- **118 (was 109), `A5`'s *"Already 0 today"*** — measured `gen_ep=0` on the four ENEMY rows on
  **both** trees. Still true; this is the local instance of the 104-105 trap and it survived.
- **The capture-branch sentence at 89-90** — *"the falling-through test at the capture branch reads
  only the occupant's COLOUR"*. Still true: `isBlack(target) !== black` is untouched, an own-colour
  occupant still falls through **that** test, and the new emptiness condition rejects it below.
- **`undoSpecial` in the present tense at 12-13** — still true, verified in `src/apply.ts`.
- **The white-only-mutant counterfactual at 23-26** — a statement about a hypothetical fix, not about
  the shipped generator, and its own next clause tells the reader these tables catch it.
- **The row labels at 100-105 and 121-124** (`// nothing on a2 — phantom BLACK pawn a2` and friends)
  — noun-phrase labels naming what each row witnesses, not tensed assertions about current
  behaviour. Editing them would be churn with no criterion behind it.
