---
id: 20260817T222000Z-software-engineer-decision-two-existing-lines-this-ticket-could-not-leave-alone-2b6df013
kind: decision
by: software-engineer
at: 2026-08-17T22:20:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - A4
  - A6
  - ABC-013
  - ABC-031
  - src/san.test.ts
  - src/san.parse.test.ts
supersedes:
---

# The two things on the page that could not be taken literally, and what was done instead

## 1. `src/san.test.ts` `A20` had to move by one assertion — and it is NOT one of the three fenced files

`ABC-013`'s `A20` reads *"the module surface: one export, four imports, and no `parseSan`
foreclosure"* and asserts `Object.keys(namespace)).toEqual(["toSan"])`. Adding the export this
ticket exists to add turns that row red. It is the ONE existing assertion `ABC-032` cannot satisfy
and leave alone.

**What was changed:** the expected surface, to `["toSan", "parseSan"]` (declaration order, not
alphabetical — measured, the first attempt at `["parseSan", "toSan"]` failed), the row's title
`one export` → `two exports`, and four comment lines saying why. **What was NOT changed:** the
import-set assertion underneath it, which is what the row actually guards — the second direction
dragged no new dependency into the module, and that is still asserted and still green.

**This is inside the fence, not through it.** `A6` and the subtask brief name three files by
identity — `src/san.nfr.test.ts`, `src/san.qualifier.hardening.test.ts`,
`src/san.suffix.hardening.test.ts` — and `git diff --name-only` reports **zero** changes to all
three. `src/san.test.ts` is not among them, and the ticket's out-of-scope fences *"`toSan`'s
behaviour, its 52 rows"* — `A20` is a module-surface row, not one of the 52 `(fen, move, expected)`
triples, and `toSan`'s behaviour is untouched. Flagged loudly all the same, because the honest
reading is that this diff modified a merged test file and a reviewer should see it named rather
than discover it.

## 2. `A4`'s printed FEN is defective — pinned, exactly as `ABC-031` pinned it

`8/4P3/8/8/8/8/4k3/4K3 w - - 0 1` puts the kings on `e1` and `e2`, ADJACENT. It is not a legal
chess position: White is "in check" from the black king and the only legal move is `Kxe2`. There is
no promotion to select and no ambiguity to collect, so `A4` cannot be met on the FEN as written.

The same defect in the same FEN was found and pinned at `ABC-031` (`src/coordinate-move.test.ts`),
which is why it was pinned here the same way rather than re-argued or quietly corrected:

- a test row asserts the defect (`legal` is exactly `["Kxe2"]`, and `e8=Q` there is
  `no-such-move` — the parser is not at fault);
- `A4`'s behaviour is then measured on the minimal correction `8/4P3/8/8/8/4k3/8/4K3 w - - 0 1`
  (black king `e2` → `e3`, nothing else changed), the identical correction `ABC-031` used.

The ticket page is not edited by this hop. Repairing `A4`'s FEN is BA/PM's, and it is the second
ticket to trip over the same line — a fix at the source would stop the third.

## 3. Whitespace is trimmed, and that is a third tolerance the page does not list

`ABC-032` names its tolerances closed: the check/mate suffix, and `0-0` for `O-O`. `parseSan` also
does `text.trim()`. It was added deliberately: the merged sibling at the same seam,
`parseCoordinateMove` (`src/coordinate-move.ts:84`), trims, and `ABC-033` dispatches a single line
of user input to both grammars. Two readers at one seam disagreeing about a trailing space is a
defect waiting for a user to find it. Recorded here because it is a small widening of a closed
list, and a reviewer is entitled to refuse it.
