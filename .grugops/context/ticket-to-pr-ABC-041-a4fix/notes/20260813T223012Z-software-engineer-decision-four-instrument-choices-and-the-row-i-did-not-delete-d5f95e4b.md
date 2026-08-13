---
id: 20260813T223012Z-software-engineer-decision-four-instrument-choices-and-the-row-i-did-not-delete-d5f95e4b
kind: decision
by: software-engineer
at: 2026-08-13T22:30:12Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - ABC-054
  - plans/tickets/ABC-041-render-seam-closure.md
  - src/render-seam.test.ts
  - 20260813T221658Z-ba-pm-decision-a4-repaired-and-the-strictly-stronger-contradiction-ruled-for-qe-7aa32d39
supersedes: 
---

# Four instrument choices against the repaired criteria — including one row I did NOT delete.

`A4` and `A11` were repaired on the ticket page by BA/PM. This hop moved the instruments to match
them and nothing else. **No production line was written, in any file.**

## 1. `A4`'s width is derived from the three panels

The repaired criterion says the width is *"the widest row of `renderBoard` / `renderStatusPanel` /
`renderHistory` … computed from those three and **never read off the frame or off the board
region**"*. So the row computes exactly that:

```ts
const width = Math.max(
  ...[...board, ...renderStatusPanel(history, status, false), ...renderHistory(history)].map(
    (row) => row.length,
  ),
);
```

It mirrors `assembleFrame`'s own reduce over `[...board, ...status, ...history]`
(`src/frame.ts:195-201`) rather than re-stating a number, so the message region still cannot widen
the frame and neither can the assertion. It runs for **both** orientations, which the repaired `A4`
requires and the pre-existing single-orientation row did not.

## 2. QE's `A4 (purpose)` row is renamed to `A11`, not rewritten

BA/PM **deleted** `A4`'s false purpose clause and cut the property as its own criterion `A11`, so the
row's title pointed at a clause that no longer exists on the page. Its assertions were already exactly
`A11` — the merged four, each called exactly once, over one seam call — so the answer to the subtask's
"check whether the suite already asserts `A11`" is **yes, it does**, and **no row was added**: the
lane allotment of 1 test file stays spent at one, and the file count is unchanged at 29. The title and
its comment now name `A11`, and the comment carries `A11`'s honest reach — it forbids **this seam**
from rendering a region itself, and the repository-wide property is `ABC-054`'s.

## 3. QE's `A4 (width)` row is KEPT, though `A4` now subsumes it

Once `A4` derives the width for both orientations, the gate's standalone `A4 (width)` row is a
single-orientation restatement of the same clause. **I did not fold it in or delete it**, for three
reasons: it is the gate's own row and removing it on the hop that answers that gate is precisely the
move that looks like softening; `AGENTS.md` rule 12 says flag rather than delete; and when it reds it
names the width property alone, where a red in `A4` could be the width, the whole-frame equality or
the orientation. **The overlap is real and is flagged here rather than resolved** — disposing of it is
QE's at the re-gate, not mine. Cost of keeping it: one duplicated assertion, inside a file that runs
in 14 ms.

## 4. The file's docblock is corrected, because it carried the refuted claim

The header asserted *"THE REPAIR IS STRICTLY STRONGER"*, *"the width read off the frame itself"*, and
that the assertion *"fails on a second board implementation"*. All three are refuted. A future reader
opening the instrument would have inherited them as settled fact — that is the exact harm QE named —
so the paragraph now records what was measured instead: the premise stands, "strictly stronger" is
backwards, the old width was circular (`X2`), and byte-equality cannot see a byte-identical copy
(`X3b`). The two stale comments inside the rows are corrected for the same reason. **Comment text
only; not one assertion was weakened or removed.**

## What I did not do

- **`src/render-seam.ts` is byte-untouched.** I did not find any reason it should change, so there
  was nothing to stop and escalate.
- **The ticket page was not opened for edit.** It is BA/PM's and it is at its 300-line budget.
- **`src/history-pane.nfr.test.ts` was not touched** — `A10` budgets it at one line and that line is
  already spent.
- **The board was not moved.** `ABC-041` stays `In Review`; the `In Review` exit is QE's.
