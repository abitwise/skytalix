---
id: 20260810T132932Z-qe-e2e-observation-4eb17e9a
kind: observation
by: qe-e2e
at: 2026-08-10T13:29:32Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - plans/board.md
supersedes: 
---

# A board-write fault of my own, found after the commit and fixed in the next one — my assertion matched the example inside the HTML comment, not the live heading

Recorded rather than quietly amended, because this hop spent its day on the difference between an
instrument that answers a question and an instrument that answers the wrong one.

## What went wrong

`plans/board.md` contains a FORMAT comment that shows the heading convention by example:

```
    ## In Review (WIP 1/3)
    - [ABC-012] Portfolio FX conversion  (PR: #41, QE: running)
```

My state-writer did `board.replace("## In Review (WIP 1/3)", "## In Review (WIP 0/3)")`. A string
pattern replaces the **first** occurrence, and the first occurrence is the **example inside the
comment at line 43**, not the live heading at line 115. So the commit `df4b0da` left the board with:

- the live `## In Review` heading still reading **1/3** after the ticket had left the column, and
- the comment's illustrative example silently edited to 0/3.

**My own check passed anyway**, and that is the part worth writing down: I asserted
`board.includes("## In Review (WIP 0/3)")`, which the corrupted comment satisfied. The assertion was
true of the wrong line. A containment test cannot tell a live heading from an example of one.

## Blast radius

Two lines in one file. **No ticket row moved incorrectly** — the `ABC-013` row was placed under
`## In Security/NFR` correctly (that heading has no example in the comment, so its replace hit the
live line), and the position assertion for the row was index-based rather than containment-based, so
it was sound. The `In Security/NFR` count 0/2 → 1/2 was right. No other file was affected; the
traceability, ticket and history writes used different mechanisms and were verified by length and
field-count arithmetic rather than by containment.

## The fix, and the check that would have caught it

Fixed in the follow-up commit: the comment example restored **byte-identical to `main`** (verified by
`diff` against `git show main:plans/board.md`), and the live heading set to `0/3`.

Verified afterwards by machine, on properties a containment test cannot fake:

```
every "^## .*(WIP" heading listed and read:   In Review 0/3, In Security/NFR 1/2
comment example at line 43 vs main:           IDENTICAL
ABC-013 row line number:                      120  (between 118 In Security/NFR and 123 Ready for UAT)
"^_Updated:" lines:                           1
"^- \[ABC-013\]" lines:                       1
```

The lesson generalises past this file: **anchor board edits to line-start (`^## `) and assert on the
parsed heading, never on a substring of the whole document** — this file deliberately contains
examples of its own syntax, so substring matching is unsafe here by construction.

Nothing in the QE verdict, the mutation results, the oracle comparisons or the gate figures depends
on this; `src/` was not touched and `src/san.ts` md5 is unchanged.
