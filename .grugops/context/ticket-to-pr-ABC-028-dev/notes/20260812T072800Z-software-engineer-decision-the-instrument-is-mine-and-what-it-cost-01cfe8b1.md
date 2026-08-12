---
id: 20260812T072800Z-software-engineer-decision-the-instrument-is-mine-and-what-it-cost-01cfe8b1
kind: decision
by: software-engineer
at: 2026-08-12T07:28:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A3
  - ABC-028-A4
  - RISK-ABC028-01
  - ABC-017-A9
  - ABC-017-A14
  - NFR-002
  - src/history-pane.test.ts
  - src/history-pane.ts
supersedes:
---

# The implementation decisions, and the one that was NOT taken because a criterion outranks a budget

> **Hand-authored, no stamp** — see the sibling `observation` note for why. Nothing here is a
> `finding`.

## 1. The mechanism is a `Proxy` recording view — CONVERGENT with QE's reference, not copied

I rebuilt the instrument from `A4`'s four clauses before comparing. **It converged on QE's shape,
and I report that as corroboration rather than dressing it up as independence.** The convergence is
forced rather than chosen: clause 1 wants every write reported *at the instant it happens* and
clause 2 wants the board re-compared *at every access*, and only a live interposition on every node
can do both. The alternatives were considered and are worse:

- **accessor properties installed on the caller's real objects** — mutates the shared `LENGTH_CASES`
  permanently and cannot see `board[i] = x` at all;
- **a deep copy handed to the pane** — then no write *reaches the supplied graph*, so clause 1
  becomes vacuous;
- **before/after snapshots** — `D26` already ruled these out; they cannot express the property.

**Three things in my build differ from the reference, all deliberate and all measured:**

1. **The board is sampled on WRITE traps too**, not only on reads. Clause 2 says *every access*, and
   a write is an access. Cost on a clean render: **zero** — the arming counter is identical at all
   ten lengths (`5/40/135/763/832/982/1485/1896/3484/18677`), because a clean render performs no
   writes.
2. **A `getOwnPropertyDescriptor` trap** is added as a sampling point. Also free on a clean render.
3. **It is CHEAPER**: ten watched renders measured **10.81 ms** median-of-7 in-process against the
   reference's recorded 14.6 ms, with the 2,000-ply case at 6.52 ms against 6.6 ms.

`board.buffer` is handed back **RAW on purpose**. Returning a copy would close `RISK-ABC028-01` by
**reporting GREEN on the wrong build**, and this ticket ranks a false negative strictly worse than a
stated limit.

## 2. `RISK-ABC028-01` re-run on MY instrument — the standing obligation, discharged

The ticket carries *"any future change to `A4`'s instrument re-runs `WBOARDBLIND`"*. The instrument
changed, so it was re-run. **`WBOARDBLIND` still survives: `clean` at all ten lengths and `750 passed
(750)` on the lane.** The record stands unchanged.

**One thing to ADD to that record, found by stressing the instrument beyond the ticket's eight
slots: `RISK-ABC028-01` is broader than its current wording.** The ticket describes it as an
`ArrayBuffer` alias; I reproduced the same silence with a **`DataView`** over `board.buffer`,
mutated and restored with no intervening graph access. Same class, different mechanism. **The honest
statement of the hole is *any buffer-level write reverted before the next sampling point*, not *a
`Uint8Array` alias*.** Reported to BA/PM; the ticket text is not mine and I did not edit it.

**Nineteen further hostile shapes were run beyond the ticket's eight and every one was REPORTED:**
`position.castling` / `epSquare` / `halfmoveClock` (the "at no extra cost" coverage the ticket
CLAIMS — now measured rather than inherited), a `Move`'s `to` and `promotion`, `Object.assign` onto a
`Move`, `delete position.epSquare`, **the `position` SLOT swapped** (named nowhere in the ticket),
`moves.push` / `length = 0` / `reverse` / `sort` / `splice`+`unshift`, `board.copyWithin` / `sort` /
`reverse`, `Reflect.set`, `Object.defineProperty`. Two pure-read controls stayed silent.

## 3. One `it` per criterion where the clauses cannot mask, and that is MEASURED each time

- **`A1` is ONE `it`.** Its three `moves.length` clauses read 21 on the delivered pane and on
  `WCACHE-LEN` **alike** — they are the caller's state, not the pane's — so they cannot mask. The
  clauses that report are `not.toEqual` and the last-row cell, and `WCACHE-LEN` fails on the first
  of them with `the third pane must not repeat the second`.
- **`A3` is ONE `it`, with the discriminator FIRST.** Measured on `WLEAD-ODD`: it renders eight rows,
  the same numbers `30..37`, and the same full last row `37. Nb1 Nc6`. **Only row 1's white cell
  differs**, and the observed failure is `expected '' to be 'Nc3'` — the clause the ticket demanded
  be the one that reports. The other clauses are labelled context in the test's own comment.
- **`A4` is FOUR `it`s** — per-slot arming, positive control, the ten lengths, the tripwire — because
  a failing assertion ends the test and an unarmed instrument must not be able to hide behind a
  clean verdict.

## 4. `LENGTH_CASES` shared for `A4`, FRESH fixtures for the arming controls

The ticket's `## Test notes` 9 rule, adopted unchanged: four of the eight controls do not restore
what they break, so each gets its own `lineTo(20)`. `A4`'s ten-length clause uses the **shared**
`LENGTH_CASES`, which `D23` cannot reach because `A4` asserts a property of its OWN render.
`A1` and `A3` build **separate** objects from `blackAnchorTo` (`## Test notes` 3).

**`A9`'s freeze and `A4`'s view never meet** (`## Test notes` 8): `A9` freezes objects from
`buildAllCases()`, which rebuilds everything fresh, so `LENGTH_CASES` is never frozen. Verified by
reading, and the 21-violation collision the note predicts was reproduced deliberately out of tree
(`Object.freeze(view.moves)` -> 21 write-trap violations) to confirm the hazard is real and avoided.

## 5. THE DECISION I DID NOT TAKE: I did not shrink `A4` to fit the lane

`A4`'s ten-length clause is **10.81 ms of this ticket's 13.2 ms in-process cost, and 6.52 ms of that
is the 2,000-ply case alone** — 18,677 sampling points x 128 bytes. Dropping the 2,000-ply length,
or sampling the board less often than *every access*, would roughly halve this ticket's lane delta.

**Both are refused.** Clause 2 says *every access* and the `Given` says *every one of the ten
lengths*; narrowing either to meet a budget is the criterion-smoothing defect this board has caught
four times, and `ABC-025`'s `N5` is the precedent for reporting a lane breach rather than trimming
the criterion that caused it. **The cost is the criterion's, not the implementation's** — my build is
already cheaper than the reference it was measured against.

## 6. Zero production lines, and the fence was tested rather than assumed

`src/history-pane.ts` md5 is `54fd4346dcc1a0060c4e66ae0149265d` at the end, re-hashed after every
mutant run. **No criterion here needed a production line and none was written.** The pane is correct
on all twelve builds constructed against it. `git diff --numstat` over `src/` is two TEST files.
