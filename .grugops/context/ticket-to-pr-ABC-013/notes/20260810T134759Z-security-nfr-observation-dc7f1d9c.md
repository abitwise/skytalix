---
id: 20260810T134759Z-security-nfr-observation-dc7f1d9c
kind: observation
by: security-nfr
at: 2026-08-10T13:47:59Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - plans/traceability.md
  - plans/board.md
supersedes: 
---

# `plans/traceability.md`'s `ABC-013` row was STRUCTURALLY BROKEN — its Tests text sat in the UAT column, its Status text sat outside the table, and the row's own guard could not see it. Repaired here, content byte-preserved.

Found while doing this gate's own mandated write. It is reported rather than quietly fixed because
the guard that missed it is the interesting part, and because it is the same failure mode the
previous hop recorded against itself in a different file one commit later.

## What the row looked like

The table has **ten columns** (`Ticket | Title | Epic | Feature | NFRs | Code | Tests | UAT | Release
| Status`), so a well-formed row is 11 pipes with a **trailing** pipe — 12 fields, the last empty.
Measured across all 33 table lines: **every row in the file ends with a pipe except `ABC-013`.**

```
field  0  ''                      (leading pipe)
       1  ABC-013                 Ticket
       …
       7  the Engineer's tests    Tests
       8  QE's 2,384-char TESTS text        ← this is the UAT column
       9  ' '                                Release
      10  the Engineer's status   Status
      11  QE's 1,059-char STATUS text       ← this is OUTSIDE the table
```

Three consequences, none of them cosmetic:

1. QE's Tests evidence — the external oracle, the 40 mutants, the five survivors — **renders in the
   UAT column**.
2. QE's Status text sits past what used to be the closing pipe. A markdown renderer drops cells beyond
   the header count, so **the whole 1,059-character `QE/E2E PASS` verdict was invisible in the
   rendered table.**
3. The row's real **Status cell still read `In Review`** while `plans/board.md` had the ticket in
   `In Security/NFR`. The board↔trace contract had silently drifted, and the drift was two commits old.

## Which commit, and why the check passed anyway

Traced, not guessed — the row was extracted from each commit that touched the file:

```
3fd8b2f  (Engineer)  11 pipes, trailing pipe present   WELL-FORMED
df4b0da  (QE)        11 pipes, trailing pipe ABSENT    BROKEN
```

QE's own note asserts *"the row at exactly 11 unescaped pipes before and after"* and *"both added
strings asserted pipe-free and newline-free before writing"*. **Both assertions are true.** They are
also both blind to what happened: the write consumed the trailing pipe as a separator and introduced
one elsewhere, so the COUNT was conserved while the row shifted by one cell.

**A pipe count cannot see a pipe move.** That is the same shape as the fault QE published about
`plans/board.md` in `…-qe-e2e-observation-4eb17e9a` — *"a containment test cannot tell a live heading
from an example of one"* — and its own generalisation applies here unchanged: assert on the PARSED
structure, never on a scalar summary of it. For this file the parsed structure is "field `i` of the
row lines up with field `i` of the header, and the row ends where the header ends".

## The repair, and its limits

Both of QE's strings were moved into the cells their author named — `Tests` and `Status` — **byte for
byte**. Nothing was rewritten, reflowed, shortened or dropped, and no other row was touched. Asserted
by machine before the file was written:

```
33 table lines before and after
every other table line BYTE-IDENTICAL              (33 rows compared, 1 changed)
the changed row: 11 pipes, 12 fields, trailing pipe restored
concatenated cell content == old content + exactly this gate's two additions, in cell order
both added strings pipe-free and newline-free
one _Updated: line added (30 → 31, this file's accumulate convention)
old row md5 37ca4c18c8bf3c30b80ef916d94bf49f → new 0422346150be7b799ca5d066f8c15a65
```

**This is another role's write and it was repaired rather than flagged.** The reason is narrow: this
gate is required to append its own result to this row's `Status` cell, and there was no honest way to
do that on a row whose `Status` cell was displaced — appending would have compounded the defect and
left the trace saying `In Review` about a ticket in `Ready for UAT`. The repair is confined to cell
PLACEMENT; not one character of anyone's content was authored, edited or removed by this hop.

**What was NOT repaired:** every other row in the file was left exactly as found, including three
rows (`ABC-009` at 13 pipes, `ABC-011` and `ABC-015` at 12) whose pipe counts differ from the
ten-column shape. Those were **checked and are not the same defect** — they all end with a trailing
pipe and their extra pipes are inside cell prose. They are noted here so nobody reads this repair as
a licence to normalise the file.
