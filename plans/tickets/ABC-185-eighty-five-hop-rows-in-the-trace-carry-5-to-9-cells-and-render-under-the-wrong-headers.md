---
id: ABC-185
title: "85 hop and merge rows appended to `plans/traceability.md` since 2026-10-17 carry 5, 6, 7 or 9 cells, so their text renders under the wrong headers"
status: in-review
column: In Review
size: M
priority: P3
epic: —
feature: —
---

# ABC-185 — re-cell the 85 short trace rows into the table's ten columns. Words kept byte for byte; ZERO `src/` lines

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-rescope-ABC-165`, at `main` `5277babd`), split from `ABC-165`. That
> ticket's own `A1` printed 96 rows, not 10. `ABC-165` keeps the 11 rows that hide text, the note and two line
> breaks. This ticket takes the other 85. All 85 were appended after the 2026-10-17 cut: hop rows (`(QE)`,
> `(Security/NFR)`, Engineer and Architect hops) and `(merge)` rows. Each hop chose its own cell layout. The
> forward row rule (`bapm-rescope-ABC-165` decision `…d2b9bf09`, and `ABC-165` Scope 2) stops new ones. This ticket repairs
> the ones already there.

> **Re-ruled 2026-10-21 by BA/PM** (subtask `bapm-rule-QE-165`, at `main` `3d36999b`) after QE-165-a
> (`qe-ABC-165` `…482f15f6`). **The pain below does not hold today.** These rows sit after the table's end at
> `:496` (blank line, then an HTML comment), so they render as paragraph text, not under any header. It holds once
> `ABC-186` joins the table back (repeated header above `:629`, blank lines `:740` and `:742` removed). Then
> every word shows, but under the wrong header. **So this ticket waits on `ABC-186` merged** (Backlog until then).
> The owner may still close it as won't-do once the table renders. At `3d36999b` `A1-cells` prints 86 names: the
> 85 below plus `ABC-184` (`:1253`). Line numbers below are at `5277babd`; add 11 for `3d36999b`.

## Problem

*User:* anyone who reads the trace in a Markdown renderer and scans it by column, such as "which branch and sha
delivered `ABC-174`" (the Code column) or "where is `ABC-163` now" (the Status column).

*Pain.* The table at `plans/traceability.md:425` has ten columns: `Ticket | Title | Epic | Feature | NFRs |
Code (PR/files) | Tests | UAT | Release | Status`. At `5277babd`, 85 rows from `:1132` to `:1241` have 5, 6, 7 or 9
cells. Under the GFM tables extension a short row is padded with empty cells, so every word still shows, but
under the wrong header. In the most common layout (33 rows) the branch sits under **Epic**, the files under
**Feature**, the gates under **NFRs** and the status under **Code**. The layouts, by cell count and by the cell that
holds the branch at a sha (`@ <7+ hex>`, or `main (merge of …`):

| cells | branch in cell | rows | lines at `5277babd` |
|---:|---:|---:|---|
| 6 | 3 | 33 | 1132–1138, 1142, 1143, 1147, 1151, 1157, 1165, 1193, 1196, 1199, 1201, 1203, 1205, 1208–1210, 1212, 1217, 1222, 1226–1228, 1230, 1233, 1235, 1237, 1241 |
| 7 | 4 | 22 | 1140, 1153, 1176, 1180–1184, 1192, 1194, 1202, 1204, 1211, 1213, 1216, 1218, 1220, 1229, 1231, 1232, 1234, 1240 |
| 7 | 3 | 11 | 1141, 1154, 1164, 1168, 1187, 1189–1191, 1214, 1219, 1221 |
| 5 | 2 | 6 | 1144–1146, 1148, 1158, 1239 |
| 7 | none | 5 | 1172, 1173, 1177–1179 |
| 9 | none | 4 | 1156, 1163, 1167, 1170 |
| 5 | 3 | 2 | 1150, 1166 |
| 6 | none | 1 | 1188 |
| 6 | 2 | 1 | 1197 |

There are 9 layouts. The first 3 cover 66 of the 85 rows. Within one layout the cell after the branch is not
always the same kind: sometimes files, sometimes gates, sometimes status. In 3 rows a second branch-at-sha cell
appears. A per-layout script therefore gives a first draft, not the answer.

*Value:* the trace's last 85 rows read by column like the table's 584 well-formed rows. Together with `ABC-165`,
`A1`'s command prints `[]`, so the forward rule's pre-append check becomes "it still prints `[]`".

## Scope

1. **Re-cell the 85 rows** listed above. Also re-cell any row that `A1-cells` (below) prints at the merged tip, if
   it was appended after `5277babd` and its Ticket cell is not one of `ABC-165`'s 11. Expect 0 such rows under the
   forward rule; count them in the delivery note. **One is already known:** `:1242`, `ABC-184` (5 cells, branch in
   cell 2). The Orchestrator appended it at `2b6b10b9` while this cut was being written, before the rule was in
   force. So N is at least 86, and `A1-cells` prints 97 names at `2b6b10b9`. Put each source cell under the header its content belongs to:
   - write `—` in a column with nothing in it;
   - when two source cells belong to one column (for example a branch cell and a files cell, both Code), join them
     with `<br>`;
   - move no word between cells beyond that.

   A script may apply one map per layout as a first draft. The Engineer then reads every row against the headers.
2. Nothing else.

## Out of scope

- **Any word of any trace cell.** No row is added, removed, merged or re-ordered.
- **`ABC-165`'s 11 rows**, the trace's note (`:370-378`), the blank line above the header, `plans/metrics.md`.
- **The forward row rule.** The Orchestrator applies it in briefs and done records; `ABC-165` writes it into the
  note.
- Every other `plans/` file, `src/`, `AGENTS.md`, the board.

## Acceptance (Given/When/Then)

`A1-cells` is the command defined in `ABC-165` § Acceptance. It prints the Ticket cell of every row that does not
split into 10.

- **`A1` (the short rows split into ten).** **Given** the head of the branch, merged with the latest `main`, **when**
  `A1-cells` runs, **then** every name it prints is one of `ABC-165`'s 11. If `ABC-165` has merged, it prints `[]`.
  At `5277babd` it prints 96 names, 85 of them outside that set.
- **`A2` (no word moved).** Pair each repaired row at base with its head row by Ticket cell and by order among rows
  with that Ticket cell. Remove every `|`, `\`, `—`, `<br>` and whitespace character from both. They are equal. The
  delivery note lists the N comparisons, N of N equal (N = 85 plus the Scope 1 extras).
- **`A3` (no row added or removed).** The number of lines starting with `|` is equal at base and head, apart from
  any row the delivering hop is told to append for itself.
- **`A4` (cells under the right header).**
  - (a) Each repaired row's Ticket cell equals its source row's first cell, byte for byte.
  - (b) Every source cell that matches `` @ *`?[0-9a-f]{7,} `` or starts `main (merge of` sits in the
    `Code (PR/files)` column. A row where that is wrong is named in the delivery note with its reason, and 0 rows
    are left unexplained.
  - (c) The delivery note carries the per-row map: line, then source cell → column, one line per row.
  - (d) QE reads at least one row of each of the 9 layouts and 5 more chosen at random, at least 14 rows in all,
    against the headers. 0 cells sit under a header their content does not match.
- **`A5` (fences).** `git diff --name-only main...HEAD` lists exactly `plans/traceability.md`. In
  `git diff -U0 main...HEAD`, the removed lines are exactly the N source rows. The added lines are exactly their N
  repairs, plus the hop's own appended row if it was told to append one.
- **`A6` (the table still renders).** At the merged tip, `ABC-186`'s `A1-fragments` prints `2 0`. A tail merge that
  leaves a blank line between rows fails here.

## Dependencies

- **Pull precondition: the forward row rule is in force.** The Orchestrator writes the 10-column template into its
  briefs and checks each append (decision `…d2b9bf09`; split `…e9a6c68a`; readings `…50929881`). Without it, each hop during the repair adds
  rows Scope 1 must chase. This is an Orchestrator action, not a ticket.
- **`ABC-165`: merged** (`17f64ea4`). `A1` must print `[]`.
- **`ABC-186`: pull after it merges.** The lines don't overlap (it edits `:349–396` and `:628–742`; this ticket edits
  `:1143` onward at `3d36999b`), so it does not block the build. It blocks the value: until the table renders, a
  re-celled row looks the same as a short one, and `A4 (d)` has no rendered headers to read against.
- **How this hop avoids racing with the Orchestrator's appends.** These rows run to the table's last line, where the
  Orchestrator appends, so:
  1. Branch from the latest `main`.
  2. Merge the latest `main` into the branch before the QE hop and again before merge. If the table's tail
     conflicts, keep `main`'s appended rows verbatim below the repaired rows, then re-run `A1`–`A5` at the merged
     tip.
  3. **Short freeze:** the Orchestrator appends no trace row between that final `A1`–`A5` run and the merge commit.
     A row due in that window waits in its done record and is appended after the merge, under the pre-append check.

## Security / NFR triggers

- **Not triggered.** Records only. 0 test files, 0 tests, 0 production lines.

## Test notes

1. **Read `A1`, `A2`, `A4 (a)`, `A4 (b)` and `A5` with scripts, not by eye.** The 85 rows hold 44,682 characters;
   the longest is 1,483.
2. **`A4 (d)` is a reading, not a script.** QE names the rows it read, and reads them in a GFM render (`marked`
   15.0.12, as `qe-ABC-165` did), not in the raw source.
3. **Gates:** lint, typecheck, build, `npm test`. A QE hop is owed. The UAT waiver is expected (0 production lines).

## Size and priority

**`M`:** 85 rows in 9 layouts, about 45,000 characters. Every row needs its cells mapped to columns, and within one
layout the cells after the branch vary in kind. That is about 8 times `ABC-165`'s rows. **Not `S`:** `ABC-165` is
`S` at 11 rows. **Not `L`:** one file, no code, the first 3 layouts cover 66 rows, and `A2` and `A5` are
script-checked.

**`P3`:** every word of these rows already shows in a renderer, just under the wrong header, and this project
renders nothing (local only). That is lower value than `ABC-165`, whose rows hide text. **Not `P2`:** no gate or
test reads the trace's columns. Pull it after `ABC-186` merges, or close it as won't-do if the owner judges an `M`
hop not worth misplaced-but-visible text. The forward rule alone stops the growth either way.

## Definition of Ready

BA/PM, 2026-10-21 at `5277babd`. **Result: 10 of 10.** Re-scored 2026-10-21 at `3d36999b` (`bapm-rule-QE-165`):
**10 of 10**, rows 1, 4, 5 and 10 re-read below. Placed in **Backlog**, waiting on `ABC-186`.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** 85 (+1) rows listed by line in 9 layouts; once `ABC-186` merges, their text renders under the wrong headers (today: paragraph text, QE-165-a) |
| 2 | scope and out-of-scope clear | **✅** re-cell the 85 (plus extras at the tip, expected 0); no word changes; `ABC-165`'s 11, the note and the metrics line excluded |
| 3 | INVEST-shaped | **✅** independent of `ABC-165` (disjoint lines; `A1` holds in either order) |
| 4 | acceptance testable and measurable | **✅** `[]` (`ABC-165` merged); N of N equal; equal row count; 0 unexplained branch cells; at least 14 rows read in a render with 0 misplaced cells; one file in the diff; `A1-fragments` `2 0` |
| 5 | dependencies known | **✅** forward rule in force (Orchestrator, since 2026-10-21); `ABC-165` merged; pull after `ABC-186` merges; merge `main` at the tip and a short freeze at merge |
| 6 | security/NFR triggers with a measurable target | **✅** not triggered |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `M` |
| 9 | priority assigned | **✅** `P3` |
| 10 | no major unresolved blocker | **✅** none outside the factory: the one wait is `ABC-186`, a Ready `XS` |

Column moves are the Orchestrator's. Owner: **the Orchestrator** (routes the build to the Software Engineer), then
QE.

## QE

**`qe-ABC-185`, 2026-10-21. Verdict: PASS_WITH_GAPS (4 INFO, 0 blocking).** Branch `grugops/qe-ABC-185`, from the tip `3d166e01`.
I merged `main` `a78c353a` at **`6273bed2`** with no conflict; `main`'s tail rows are kept verbatim. Every criterion was run at that merge with QE's own
scripts. Line numbers are the same at base `bf6fc623` and at the merge. Notes are under `.grugops/context/qe-ABC-185/`.

- **A1 MET:** `A1-cells` prints 86 at base and at `main`, and `[]` at `745c6225` and `6273bed2`.
- **A2 MET:** QE found the source rows itself (short at base). Exactly 86 lines changed, and they are those rows. Paired by
  Ticket cell and order, 86 of 86 are equal after the strip.
- **A3 MET:** `|` lines are 705 = 705 (base → code) and 708 = 708 (`main` → merge).
- **A4:** (a) MET, 86/86 byte-equal. (b) MET: each row aligned back to its source cells; 3 exceptions (`:1239`, `:1244`, `:1250`),
  all named; 0 unexplained. (c) The SE's map matches QE's on 84/86 rows. At `:1192` and `:1198` a trailing bare `—` reads as UAT or Status, and both render
  the same. (d) **MET:** `marked` 15.0.12 `--gfm -o` gives 2 tables and 706 `<tr`, each row with 10 cells. QE read 14 rows (seed 185): one per layout,
  `:1152 :1191 :1174 :1156 :1189 :1180 :1176 :1198 :1207`, then `:1142 :1190 :1194 :1226 :1250`. That is 140 cells, 0 avoidably misplaced.
- **Rulings:** the SE's 3 named exceptions and the other word-order placements (`:1145 :1146 :1155 :1160 :1176 :1177
  :1180 :1187–:1189 :1198 :1229 :1231`, and the mixed EPIC/ADR cells) are accepted. For each, no order-keeping map is better,
  and a better one would need a word move, which is out of scope.
- **A5 MET:** one file excluding `.grugops/`; in `-U0`, removed = the 86 sources and added = the 86 repairs. **A6 MET:** `2 0` at base, code, `main` and merge.
- **Gates** (code tree identical to `745c6225`): lint, typecheck and build 0. `npm test` 59 / 1987, and `last-run.json` shows success, 0 failed / pending / todo.
  Skip-count 0: `No findings.` UAT waiver reading empty (0 production lines).
- **Gaps:** QE-185-a: 5 branch references outside Code, all forced, all named (`:1177`, `:1180` are missed by A4 (b)'s regex). QE-185-b: other
  word-order fragments. QE-185-c: `branch<br>—` in Code at `:1190` and `:1194`, cosmetic. QE-185-d: the A4 (c) map is one of two equal readings at `:1192`
  and `:1198`.
- **Short freeze** from `6273bed2`. If `main` moves before the merge, merge it again and re-run `A1-cells` and `A1-fragments`.
