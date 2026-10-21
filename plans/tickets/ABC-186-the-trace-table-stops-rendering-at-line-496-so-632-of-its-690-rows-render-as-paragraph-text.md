---
id: ABC-186
title: "The trace table stops rendering at `plans/traceability.md:496`, so 632 of its 690 rows render as paragraph text, and the table's note still carries a counting rule that disagrees with its own command"
status: in-development
column: In Development
size: XS
priority: P3
epic: —
feature: —
---

# ABC-186: join the trace table back into a rendered table (one repeated header, two blank lines removed) and leave the note one counting rule. No word moved; ZERO `src/` lines

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-rule-QE-165`, at `main` `3d36999b`; the trace is byte-equal at
> `89fd4e83`). Source: QE on `ABC-165` (`qe-ABC-165`). **QE-165-a** (MEDIUM, `…482f15f6`, verdict `…892cc883`):
> the rendered table ends at the blank line `:496`. **QE-165-b** (LOW): the note's old counting rule disagrees with
> the new one. The readings and the ruling are in `.grugops/context/bapm-rule-QE-165/notes/`.

## Problem

*User:* anyone who opens `plans/traceability.md` in a GFM renderer (GitHub, an editor preview) to read the
requirement → code → test trail by column. That includes QE, who read `ABC-165`'s rows "against the headers".

*Pain.* At `3d36999b` the file has 690 table rows below one header (`:436`) and one delimiter row (`:437`). Only
the first 58 (`:438–495`) render as table rows.
- `:496` is a blank line, and `:497–627` is an HTML comment. Either one ends a GFM table.
- No header or delimiter row follows, so the 632 rows at `:629–739`, `:741` and `:743–1262` render as three
  paragraphs of raw `|` text. The blank lines `:740` and `:742` came in with two appends (`28cd099f`, `1f348e54`).
- `marked` 15.0.12 (GFM on) gives 1 `<table>` and 59 `<tr>` (the header and 58 rows) at `3d36999b`, where 691 are expected.
- Re-celling rows (`ABC-165` did 11; `ABC-185` holds 86) changes nothing a reader sees until those rows render
  as a table.

*Second pain (QE-165-b).* The note above the table (`<!-- COLUMN INVARIANT`, `:349–396`) gives two counting rules
that disagree:
- `:371–376` says a well-formed row has ELEVEN `|` and that `line.strip().strip('|').split('|')` must give 10. By
  that rule 21 well-formed rows count as malformed, including `ABC-065`, `ABC-066` and `ABC-109 (UAT)`.
- The escape-aware split at `:355` and the `A1-cells` command at `:382` give the GFM count.
- Two more lines are stale:
  - `:364` says "every row gives 10" (86 do not today).
  - `:369–370` says no renderer has been tried. QE read the file with `marked` (`…482f15f6`).

*Value:* all 690 rows render as table rows under the ten headers, 632 more than today. 546 of those 632 are
well-formed and read by column at once. The 86 short ones show every word, under the wrong headers until `ABC-185`.
The note keeps one rule, the one its command runs.

## Scope

1. **Re-head the second fragment.** Insert byte-equal copies of `:436` (header) and `:437` (delimiter) directly
   above `:629` (`| ABC-057 |`, the first row after the HTML comment), below the blank line `:628`.
2. **Remove the two stray blank lines** `:740` and `:742`, so `:629` to the end is one run of `|` lines.
3. **Settle the note (QE-165-b)**, inside `:349–396` only:
   - Delete `:371–376`: the ELEVEN-`|` / plain-split rule and its 2026-08-12 story.
   - Open the `:364` paragraph with `HISTORY, superseded by ROW SHAPE AND COUNT below:`.
   - Replace the sentence at `:369–370` that says no renderer exists with the reading: `marked` 15.0.12 (GFM on)
     splits as this note says (`qe-ABC-165` `…482f15f6`; `cmark-gfm` not tried).
   - Keep "Do not append to a row you believe malformed; report it." as it is.
4. **One forward sentence and one check** in the FORWARD ROW RULE paragraph:
   - The sentence: append directly below the table's last row. A blank line, or an HTML comment, ends a GFM table,
     and every row after it renders as paragraph text.
   - The check: the `A1-fragments` command (below). The appender's check becomes "`A1-cells` and `A1-fragments`
     each print the same before and after the append".

**Shape chosen: re-head, not re-join into one table.** Moving the 131-line comment `:497–627` above the table also
gives 0 stray rows (measured: 1 table, 692 `|` lines, 0 outside), but it moves 132 lines that no renderer shows.
It also takes the comment away from the `EPIC-001` and ADR rows it explains. Re-heading changes 4 lines outside the
note and moves none. Removing the blank lines alone does not work: the comment still ends the table (measured).

## Out of scope

- **Any word of any trace row.** No row is added, removed, re-celled or re-ordered. The 86 short rows are `ABC-185`.
- The HTML comment `:497–627` (stays where it is, byte for byte), the blank lines `:496` and `:628`.
- The note's other lines: `:349–363`, `:365–368`, and `:377–396` apart from Scope 4's sentence and command.
- `QE-165-c` (INFO: `A1-cells` reads `\\|` as escaped and drops a trailing empty cell; 0 such rows today). It is not
  cut. If a row ever needs it, it is a new ticket.
- Every other `plans/` file, `src/`, `AGENTS.md`, the board.

## Acceptance (Given/When/Then)

"Base" is `main` at pull time. Line numbers are at `3d36999b`. `A1-cells` is the command in `ABC-165`
§ Acceptance (also at `plans/traceability.md:382`).

`A1-fragments`, run from the repository root, prints the number of runs of consecutive `|` lines, then how many of
those runs do not open with the header followed by a delimiter row:

```
python3 -c "import itertools as I;L=open('plans/traceability.md').read().split('\n');H=next(l for l in L if l.startswith('| Ticket | Title |'));R=[list(g) for k,g in I.groupby(L,lambda l:l.startswith('|')) if k];print(len(R),sum(1 for r in R if r[0]!=H or not r[1].startswith('|--')))"
```

`A5-note` prints six counts taken inside the note (`<!-- COLUMN INVARIANT` up to its `-->`):

```
python3 -c "s=open('plans/traceability.md').read();i=s.index('<!-- COLUMN INVARIANT');n=s[i:s.index('-->',i)];print(*(n.count(t) for t in ('ELEVEN',\"strip('|').split('|')\",'no renderer in node_modules','482f15f6','HISTORY, superseded by ROW SHAPE AND COUNT','groupby')))"
```

- **`A1` (every `|` run opens with the header).** **Given** the branch head merged with the latest `main`, **when**
  `A1-fragments` runs, **then** it prints `2 0`. At `3d36999b` it prints `4 3`.
- **`A2` (rendered).** **Given** the same tip, **when** `marked` 15.0.12 renders the file to a file (`-o`; its
  piped output is truncated), **then** the output holds 2 `<table` and as many `<tr` as there are `|` lines minus
  delimiter rows (`grep -c '^|'` − `grep -c '^|-'`). At `3d36999b`: 1 and 59, where 691 are expected. Shape
  measured on a scratch copy: 2 and 692 of 692.
- **`A3` (no row word moved).** In `git diff -U0` base → head, outside `:349–396`:
  - the removed lines are exactly 2, both empty (base `:740`, `:742`);
  - the added lines are exactly 2, byte-equal to base `:436` and `:437`, placed between base `:628` and base `:629`.
- **`A4` (row count unchanged).** `A1-cells` prints the same list at base and head (86 names at `3d36999b`). The
  inserted header splits into 10 and is not printed.
- **`A5` (one counting rule, QE-165-b).** `A5-note` prints `0 0 0 1 1 1`; at `3d36999b` it prints `1 1 1 0 0 0`.
  The escape-aware line (`:355`), the `A1-cells` command line (`:382`) and the sentence "Do not append to a row you
  believe malformed; report it." are byte-unchanged.
- **`A6` (forward guard).** The `A1-fragments` command appears in the note byte-equal to the one on this page. The
  FORWARD ROW RULE paragraph names a blank line and an HTML comment as things that end the table.
- **`A7` (fences).** `git diff --name-only main...HEAD`, excluding `.grugops/`, lists exactly
  `plans/traceability.md`. The diff touches only `:349–396`, the 2 inserted lines and the 2 removed lines, plus the
  hop's own appended row if it is told to append one.

## Dependencies

- **None blocking.** `ABC-165` has merged (`17f64ea4`). `ABC-185` waits on this ticket, not the reverse.
- **How this hop avoids racing with the Orchestrator's appends.** It edits `:349–396` and `:628–742`, far above the
  tail where the Orchestrator appends, so a text conflict is unlikely. A blank line in front of an appended row
  would still undo `A1`. So, as `ABC-185`'s rule does:
  1. Branch from the latest `main`.
  2. Merge the latest `main` into the branch before the QE hop and again before merge. Keep `main`'s appended rows
     verbatim, then re-run `A1`–`A7` at the merged tip.
  3. **Short freeze:** the Orchestrator appends no trace row between that final run and the merge commit. A row
     due in that window waits in its done record and is appended after the merge, under the check in Scope 4.

## Security / NFR triggers

- **Not triggered.** Records only: 0 test files, 0 tests, 0 production lines.

## Test notes

1. Run `A1`, `A3`, `A4`, `A5` and `A7` as scripts, not by eye. `A2` needs `marked` 15.0.12. It is not in
   `node_modules`. QE used the npx cache copy (`~/.npm/_npx/d07ada7b4a99c96e`). If neither that copy nor `npx`
   can reach it, `A2` is `UNKNOWN - verify` and `A1` stands in, since it checks the same GFM rule without a
   renderer.
2. **Do not write `-->` anywhere inside the note:** it ends the HTML comment, and the rest of the note would then
   render as text.
3. **Gates:** lint, typecheck, build, `npm test`. A QE hop is owed. The UAT waiver is expected (0 production
   lines).

## Size and priority

**`XS`:** one file and no judgement calls. The edits are 4 lines outside the note and about 10 inside it, every
one named by line here, and all criteria but `A6`'s wording are script-checked. **Not `S`:** `ABC-165` was `S`
because it mapped 11 rows' cells by judgement; nothing here is mapped.

**`P3`:** this project is local-only and renders nothing itself. Unlike `ABC-185`, though, this ticket is what
makes the trace readable as a table at all, for 632 rows, at the lowest cost. Pull it before `ABC-185`.

## Definition of Ready

BA/PM, 2026-10-21 at `3d36999b`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** 632 of 690 rows render as paragraph text, measured (`marked` 59 `<tr>`); the note's two rules disagree on 21 rows |
| 2 | scope and out-of-scope clear | **✅** 2 lines inserted, 2 blank lines removed, note lines named; no row word, the comment and `ABC-185`'s rows excluded |
| 3 | INVEST-shaped | **✅** independent (no blocker); valuable alone; `XS` |
| 4 | acceptance testable and measurable | **✅** `2 0`; 2 tables and `<tr>` = rows; a diff of exactly 2 + 2 lines outside the note; the same 86 names; `0 0 0 1 1 1` |
| 5 | dependencies known | **✅** none blocking; racing rule with the merge of `main` and a short freeze |
| 6 | security/NFR triggers with a measurable target | **✅** not triggered |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3` |
| 10 | no major unresolved blocker | **✅** none |

Column moves are the Orchestrator's. Owner: **the Orchestrator** (routes the build to the Software Engineer), then
QE.
