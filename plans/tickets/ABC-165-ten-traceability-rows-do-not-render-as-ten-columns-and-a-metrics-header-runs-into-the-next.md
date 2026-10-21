---
id: ABC-165
title: "Eleven `plans/traceability.md` rows do not split into ten columns (seven of them hide text), the malformation paragraph names a different set and states no row rule, the table header follows a blockquote line, and a `plans/metrics.md` header runs into the next"
status: in-development
column: In Development
size: S
priority: P3
epic: —
feature: —
---

# ABC-165 — repair the eleven named trace rows, the trace's note, and two line breaks. Words kept byte for byte; ZERO `src/` lines

> **Re-cut 2026-10-21 by BA/PM** (subtask `bapm-rescope-ABC-165`, at `main` `5277babd`). The Orchestrator did not
> pull the 2026-10-17 cut. Its own `A1` printed **96** rows, not 10. The 86 new rows date from after the cut and
> the defect was still growing. This re-cut:
> - keeps the original ten rows here and adds `ABC-157 (QE)`, the one new row that also hides text (11 cells);
> - moves the other **85** new rows (5, 6, 7 or 9 cells; every word visible, but under the wrong header) to
>   **`ABC-185`**;
> - adds the **forward row rule** to the trace's own note, so the defect stops growing;
> - adds one blank line above the table header (Scope 3).
>
> Notes in `.grugops/context/bapm-rescope-ABC-165/notes/`: the rule is decided in `…d2b9bf09`, the split in
> `…e9a6c68a`, and the readings are in `…50929881`.
>
> **Cut 2026-10-17 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cut-followups`) from **`QE-040-c`** (INFO;
> stale malformation paragraph) and **`QE-156-a`** (LOW; two `plans/metrics.md` header lines render as one
> paragraph). One hop with one owner costs less than two.

## Problem

*User:* anyone who reads the trace or the metrics in a Markdown renderer, and any role or Orchestrator about to
append a trace row.

*Pain (rows that hide text).* The table at `plans/traceability.md:425` has ten columns. In GitHub-flavoured
Markdown (GFM), an unescaped `|` separates cells and `\|` does not. A cell inside a code span counts too. The GFM
spec's tables extension also says what happens when a row has the wrong number of cells. A row with **more** cells
than the header loses the extra cells, so that text is not shown. A row with **fewer** cells is padded with empty
ones. At `5277babd`, these **11 rows** do not split into 10:

| line at `5277babd` | Ticket cell | cells | shape |
|---|---|---:|---|
| 626 | `ABC-065` | 11 | unescaped `\|` inside the text (text hidden) |
| 627 | `ABC-066` | 13 | unescaped `\|` inside a code span, `[--colour white\|black…]` (text hidden) |
| 735 | `ABC-109 (UAT)` | 11 | unescaped `\|` inside a command (text hidden) |
| 951 | `Scribe book-regen (AGENTS.md)` | 9 | one cell short |
| 982 | `ABC-094 (accepted)` | 6 | four cells short |
| 1001 | `Scribe lines (AGENTS.md)` | 9 | one cell short |
| 1006 | `ABC-150 (design)` | 2 | almost all text in one cell |
| 1099 | `ABC-030 (QE)` | 11 | one cell too many (text hidden) |
| 1101 | `ABC-024 (QE)` | 11 | the same |
| 1103 | `ABC-156 (QE)` | 11 | the same |
| 1121 | `ABC-157 (QE)` | 11 | the same (appended after the 2026-10-17 cut) |

These 11 are **all 7** rows of the file that hide text, plus the 4 short rows of the original cut. The other 85
short rows are `ABC-185`.

*Pain (the note).* The paragraph at `:377-378` says the known malformations are `ABC-009` (12 cells) and `ABC-011`,
`ABC-015`, `ABC-019` (11 each). Under the GFM rule all four split into 10. Its own `strip('|').split('|')` rule
counts escaped pipes as separators. It also says nothing about the shape a new row must have. That gap is why 86
rows with 5 to 11 cells were appended after 2026-10-17.

*Pain (header).* `:424` is a blockquote line (`> …`) and `:425` is the header row, with no blank line between them.
In CommonMark a line right after a blockquote paragraph can be read as part of that paragraph ("lazy
continuation"). Whether a GFM renderer then builds the table, or keeps the header inside the quote and turns the
rows into one paragraph, is **UNKNOWN - verify**. No renderer is installed here. One blank line makes the question
moot in every renderer.

*Pain (metrics).* `plans/metrics.md:2` (the 2026-10-17 `_Updated:` line) is followed directly by `:3` (the
2026-08-20 line), with no blank line and no trailing `\`. CommonMark renders the two as one paragraph.

*Value:* no trace text is hidden by the renderer. The note that guards the table counts by the renderer's rule and
states the row shape every appender follows, so the defect stops growing.

## Scope

1. **Repair the 11 rows** above so that each splits into exactly 10 cells under the GFM rule. Escape a `|` with `\`,
   add `—` for a missing cell, or move a cell boundary. The Engineer maps each cell to its column.
2. **Rewrite the malformation paragraph** (`:377-378`). The new paragraph:
   - states the GFM rule (an unescaped `|` separates cells, `\|` does not, and code spans are no exception);
   - gives a runnable count (`A1`'s command or an equivalent);
   - states the **forward row rule** as decided in `bapm-rescope-ABC-165` (`…d2b9bf09`), including the template line below inside
     a code span:

     `| {ticket} ({hop}) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

     That is 10 cells in header order. Write `—` for a cell with nothing to say; never leave a cell out. Write a
     literal `|` as `\|`, inside code spans too. Join two facts in one cell with `<br>` or `; `, never with `|`.
     The appender's check is that `A1`'s output is the same before and after the append;
   - **names no row by its Ticket cell as malformed.** It points at the command and at `ABC-185` for the rows the
     command still prints. A hand list goes stale; this one did.

   The rest of the note at `:370-376` and the 2026-10-17 reconciliation sentence stay.
3. **One blank line** between `:424` (the blockquote line) and the `| Ticket | Title | …` header row.
4. **`plans/metrics.md`:** a trailing `\` on `:2`, or a blank line between `:2` and `:3`.

## Out of scope

- **Any word of any trace cell.** No row is added, removed, merged or re-ordered.
- **The 85 short rows** `A1` also prints (5, 6, 7 or 9 cells). They are `ABC-185`.
- Every other `plans/` file, `src/`, `AGENTS.md`, the board. The board's own consecutive `_Updated:` lines run
  together the same way as `metrics.md:2-3`. That is noted, not cut here.
- Briefs and done records. The Orchestrator applies the forward rule there from 2026-10-21. The `AGENTS.md`
  pointer is a Scribe decision for the Orchestrator.

## Acceptance (Given/When/Then)

`A1-cells` is this command, run from the repository root. It prints the Ticket cell of every table row that does
not split into 10:

```
python3 -c "import re;S=lambda l:re.split(r'(?<!\\\\)\|',l.strip().strip('|'));L=open('plans/traceability.md').read().split('\n');print(sorted(S(l)[0].strip() for l in L if l.startswith('|') and not re.match(r'^\|\s*-',l) and len(S(l))!=10))"
```

At `5277babd` it prints 96 names (79 distinct). The 11 above are among them.

- **`A1` (the eleven split into ten).** **Given** the head of the branch, merged with the latest `main`, **when**
  `A1-cells` runs, **then** its output contains none of these 11 Ticket cells: `ABC-065`, `ABC-066`,
  `ABC-109 (UAT)`, `Scribe book-regen (AGENTS.md)`, `ABC-094 (accepted)`, `Scribe lines (AGENTS.md)`,
  `ABC-150 (design)`, `ABC-030 (QE)`, `ABC-024 (QE)`, `ABC-156 (QE)`, `ABC-157 (QE)`. It also contains no
  Ticket cell of a row this hop appends.
- **`A2` (no word moved).** For each of the 11 rows, compare the base row with the head row after removing every
  `|`, `\`, `—` and whitespace character from both. They are equal. The delivery note lists the 11 comparisons,
  11 of 11 equal.
- **`A3` (no row added or removed).** The number of lines starting with `|` is equal at base and head, apart from
  any row the delivering hop is told to append for itself.
- **`A4` (the paragraph).** The rewritten paragraph:
  - (a) contains `A1`'s command or an equivalent count;
  - (b) contains the template line of Scope 2, and that line, read as a table row, splits into 10;
  - (c) names no row as malformed by its Ticket cell;
  - (d) `grep -c 'ABC-009 (12 cells)' plans/traceability.md` prints `0`.
- **`A5` (header).** The line directly above the line that starts `| Ticket | Title |` is empty.
- **`A6` (metrics).** `sed -n 2p plans/metrics.md` ends with `\`, or `sed -n 3p plans/metrics.md` is empty. No other
  line of `plans/metrics.md` changes.
- **`A7` (fences).** `git diff --name-only <base>` lists exactly `plans/traceability.md` and `plans/metrics.md`.

## Dependencies

- **None blocking.** `ABC-185` repairs disjoint lines (`:1132` and later) of the same file. The two may run in
  either order or side by side; git merges non-adjacent hunks.
- **How this hop avoids racing with the Orchestrator's appends.** Every line it touches is at or above `:1121`. The
  Orchestrator appends at the end of the table (`:1241` and later), so there is **no freeze**. Branch from the
  latest `main`. Merge the latest `main` into the branch before the QE hop and again before merge, and re-run
  `A1`–`A7` at that merged tip.
- `ABC-040` and `ABC-156` — `Done`.

## Security / NFR triggers

- **Not triggered.** Records only. 0 test files, 0 tests, 0 production lines.

## Test notes

1. **Read `A1`, `A2` and `A4 (b)` with scripts, not by eye.** Rows run to 16,051 bytes (`ABC-066`; `ABC-065` is 11,970). The
   2026-10-17 page said 1,644, which is the longest of the other nine.
2. **Gates:** lint, typecheck, build, `npm test`. A QE hop is owed. The UAT waiver is expected (0 production lines).

## Size and priority

**`S`:** 11 rows in five shapes, each needing its cells mapped to columns, plus a paragraph and two one-line edits.
That is one row and one blank line more than the 2026-10-17 cut, which was also `S`. **Not `XS`:** the mapping is
judgement on rows up to 16,051 bytes long. **Not `M`:** two files, no code, and the 85-row bulk is split out. In
the two longest rows the work is finding 1 and 3 stray separators (11 and 13 cells), not re-mapping every cell.

**`P3`:** a rendering defect. Every word is still in the raw file and greppable, and this project renders nothing
(local only). **Not `P2`:** no gate or test reads the trace's columns. Pull it before `ABC-185`: its rows hide text
and its note stops the growth. `ABC-185`'s rows only misplace text.

## Definition of Ready

BA/PM, re-scored 2026-10-21 at `5277babd` (the 2026-10-17 score of 10 of 10 is withdrawn: items 1, 4 and 8 failed
against the file). **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** 11 rows named by line and Ticket cell at `5277babd`; 7 hide text; the paragraph names 4 rows that split correctly and states no row shape |
| 2 | scope and out-of-scope clear | **✅** 11 rows, the paragraph, one blank line, one metrics line; the 85 short rows are `ABC-185` |
| 3 | INVEST-shaped | **✅** independent of `ABC-185` (disjoint lines; `A1` names its own 11) |
| 4 | acceptance testable and measurable | **✅** `A1` names 11 cells that must be absent from a printed list; 11 of 11 equal; equal row count; a grep that prints `0`; one empty line; one line ending; two file names |
| 5 | dependencies known | **✅** none; merge the latest `main` at the tip; no freeze needed |
| 6 | security/NFR triggers with a measurable target | **✅** not triggered |
| 7 | test notes present | **✅** two |
| 8 | size assigned | **✅** `S`, re-measured |
| 9 | priority assigned | **✅** `P3` |
| 10 | no major unresolved blocker | **✅** none |

Column moves are the Orchestrator's. Owner: **the Orchestrator** (routes the build to the Software Engineer), then
QE.
