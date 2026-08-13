---
id: 20260813T212621Z-software-engineer-observation-a4-cannot-be-satisfied-as-worded-and-three-more-flags-1d067874
kind: observation
by: software-engineer
at: 2026-08-13T21:26:21Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - plans/tickets/ABC-041-render-seam-closure.md
  - src/frame.ts
  - src/render-seam.test.ts
  - src/history-pane.nfr.test.ts
supersedes: 
---

# `A4` cannot be satisfied as worded by ANY build. Two more wording gaps, and two things flagged not fixed.

Recorded because the `In Development`-entry review found two gaps and these are the ones that only
show up once the code is written. **None of them changed what the right build is, and no criterion
was waived.** They belong to QE and to BA/PM's next cut, not to this branch.

## GAP 3 — `A4`'s "byte-identical" is unsatisfiable, and the reason is a merged module `A10` forbids touching

`A4`: *"the frame's board region is **byte-identical** to `renderBoard(position, mode,
orientation)`"*. Measured on this tree at the start position, both glyph modes:

```
renderBoard rows      9 rows, all 18 columns
renderStatusPanel     3 rows, 17 and 11 columns
renderHistory         8 rows, all 21 columns
frame board region    9 rows, all 21 columns   <- 18 + 3 trailing blanks
```

`assembleFrame` pads **every** panel row to the frame's width (`src/frame.ts:205`,
`rows.map((row) => row.padEnd(width))`), and the width is the widest panel — the history pane's 21,
never the board's 18. So the board region is `renderBoard`'s rows **plus trailing blanks, always**.
No implementation can make those two byte-equal, because the padding is `assembleFrame`'s and
`assembleFrame` is merged, out of scope (`## Out of scope`) and required to stay byte-identical
(`A10`). The frame width is also **content-dependent** — it reads 24 on the fool's-mate final
position, where the status panel is the widest panel — so no fixed number could be written down
either.

**What was built instead, and it is strictly stronger.** The criterion states its own purpose twice
(`A4`'s parenthetical and `## Test notes` row 2): byte-equality is there to forbid a second board
implementation. The delivered assertion is byte-equality against the merged renderer **through the
merged assembler**, with the width read off the frame and never named:

```ts
expect(boardRegionOf(frame, board.length)).toEqual(board.map((row) => row.padEnd(width)));
```

plus a whole-frame equality against `assembleFrame` called directly on the four merged producers,
plus `A4`'s own arming half (the two orientations differ). The mutant that hardcodes an orientation
is caught. A second board implementation is caught. **The criterion's intent is met exactly; its
letter is unmeetable.** BA/PM owns the re-wording; the honest form is "byte-identical to
`renderBoard(...)` padded to the frame's width".

## GAP 4 — the security firing threshold, read literally, contradicts `A3` and `A6`

`## Security / NFR triggers` says security fires if the delivered diff *"imports any Node builtin"*.
`A3` and `A6` require assertions made **textually over the delivered module** ("asserted textually
over the diff", "asserted over the diff, not by inspection"), and a text assertion cannot be made
without reading the file — `src/render-seam.test.ts` imports `node:fs` to do it, exactly as the
merged probe does (`src/history-pane.nfr.test.ts:23-24` imports `node:child_process` and `node:fs`).

Read against its own stated rationale — *"This module reads no input from outside the process, spawns
nothing, opens nothing and writes nothing"* — the clause is plainly about the **production module**,
and on that reading it does **not** fire. Recorded so nobody resolves it the other way and deletes a
criterion's own instrument to keep a threshold quiet.

**Security did not fire, on the reading above, and the three checkable parts were checked:**
`package.json` still has **no `dependencies` key** (`jq 'has("dependencies")'` → `false`), the
delivered module imports **zero** Node builtins, and the only files touched under `src/` are the
module, its test file and the one probe-root line.

## FLAGGED, NOT FIXED (1) — the probe's docblock now says "five entries" above a six-entry list

`src/history-pane.nfr.test.ts:176` reads *"The five entries are the producers of the frame …"*, and
`A9`'s line makes the list six. Correcting the word would be a **second** line in that file, which
`A10` budgets at exactly one, and rule 9 says do not improve adjacent comments. So it is left, and
named here instead. It is a one-word fix for whoever next opens that file with a budget for it.

## FLAGGED, NOT FIXED (2) — `ADR-0011` clause 2's declared list has reached its own dated expiry

The same docblock (`:181-186`) carries an owner and a trigger: *"Owner: Architect/Design, at the next
hop that adds a frame producer. Dated expiry: `EPIC-006`, where the entry point assembles a frame,
**composition becomes an import**, and this declaration is replaced by `closure(<assembly module>)`
and DELETED."*

**This hop is that trigger, and half of that condition is now true.** `src/render-seam.ts` is the
first module in the repository to import all four frame producers, so `closure("render-seam.ts")`
today yields `frame, history-pane, render, status-panel` — four of the five declared roots — and the
fifth, `glyph-mode.ts`, is reachable from no frame producer at all and would need its own answer.
Replacing a declared list with a derived closure is a change to the guard's own rule; it is
Architect/Design's by the comment's own words, it is not `ABC-041`'s, and it would blow `A10`. **The
list was extended, not replaced.** `ABC-042` builds the entry point and is where this should be
decided.
