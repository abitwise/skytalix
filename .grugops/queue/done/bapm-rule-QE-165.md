---
subtask: bapm-rule-QE-165
role: ba-pm
ticket: ABC-165 (Done, merged 17f64ea4); ABC-185 (Ready)
ref: .grugops/context/qe-ABC-165/
width: 2 (beside scribe-trace-row-pointer; disjoint files)
---

# BA/PM: rule QE-165-a and QE-165-b, and decide ABC-185's fate (owner go, 2026-10-21)

QE on ABC-165 (`qe-ABC-165`, notes in `.grugops/context/qe-ABC-165/notes/` on `main`) found:
- **QE-165-a (MEDIUM):** rendered, the trace table ends at the blank line `:496`. Every `|` line from `:629` on renders as paragraph text. So the 11 rows ABC-165 repaired never hid text, and ABC-185's 86 rows will render as paragraph text however they are re-celled, unless the table is re-joined.
- **QE-165-b (LOW):** the old counting rule at `:371-372` disagrees with the new note and calls 21 well-formed rows malformed.
- QE-165-c, QE-165-d: INFO.

## Decide
1. **QE-165-a.** What is between `:496` and `:629`, and between later table fragments (headings, prose, blockquotes, blank lines)? Can the table be re-joined without moving any word (e.g. moving interleaved prose out of the table region, or re-heading each fragment with the 10-column header and separator)? Name the shape and size it.
2. **ABC-185.** Options: fold it into the re-join ticket (one hop does both, since re-celling only matters once rows render as a table); keep it separate and ordered after the re-join; or close it as won't-do if the re-join is not worth it. Recommend one, with a reason the owner can read in two lines.
3. **QE-165-b.** Cut it (likely XS, records only, possibly folded into the re-join ticket) or rule it otherwise.
4. **Racing.** Any ticket that edits the trace table must state how it avoids colliding with the Orchestrator's appends (the ABC-185 page's rule is a template).
5. **DoR** for each resulting ticket; place them. Next free id is ABC-186 (verify in `plans/tickets/`).

## Fences
- Records only: ticket pages (new, ABC-185's), `plans/board.md` (cards, header counts, one `_Updated:` line prepended above the first existing one), notes. Do not edit `plans/traceability.md` or `AGENTS.md`.
- Never push or merge. Do not touch other worktrees.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rule-QE-165`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/bapm-rule-QE-165.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace rows: exactly 10 cells each, in header order** (rule `…d2b9bf09`), one per ticket you cut or change:
  `| {ticket} (BA/PM) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result

**DONE.** Records only, uncommitted on `main` (base `054627a9`; `main` was at `3d36999b` on finish, and the trace and
board did not move except for the Scribe's tail row at `89fd4e83`). Notes are in `.grugops/context/bapm-rule-QE-165/notes/`,
sealed with `admitAndAppend` (context root passed explicitly) and read back with `readContext` (2 notes):
- `20261021T124928Z-ba-pm-observation-411b3032`: the readings (structure, four shapes rendered, the 21 rows).
- `20261021T124943Z-ba-pm-decision-1636e62c`: the ruling.

**Files touched:** `plans/tickets/ABC-186-the-trace-table-stops-rendering-at-line-496-so-632-of-its-690-rows-render-as-paragraph-text.md`
(new), `plans/tickets/ABC-185-…` (re-ruled), `plans/board.md` (one `_Updated:` line prepended above
`bapm-rescope-ABC-164`'s, the Ready card ABC-185 → ABC-186, the ABC-185 card at the top of Backlog; Ready stays 1/8).
Not touched: `plans/traceability.md`, `AGENTS.md`.

### 1. QE-165-a: shape and size

- **What lies between the fragments** (at `3d36999b`; the trace is byte-equal at `89fd4e83`):
  - `:496` blank, `:497–627` an HTML comment (EPIC-001 / ADR notes), `:628` blank. Then rows `:629–739`.
  - `:740` blank (from `28cd099f`), `:741` one row, `:742` blank (from `1f348e54`), rows `:743–1262`.
  - No headings, prose or blockquotes sit between rows.
- **Today:** `marked` 15.0.12 renders 1 table with 59 `<tr>`. 632 of 690 rows are paragraph text.
- **Shape: re-head.** Insert copies of `:436`/`:437` above `:629` and remove `:740`/`:742`.
  - Measured: 2 tables, 692/692 `<tr>`, 0 rows outside a table, 4 lines changed, no word moved.
  - Rejected: moving the comment (1 table, but 132 moved lines nobody sees), and removing blanks alone (the comment
    still ends the table, measured).
- **Size `XS`, `P3`.**

### 2. ABC-185: keep separate, ordered after ABC-186

The re-join is an `XS` that makes 632 rows readable as a table on its own, so it should not wait behind an `M`.
Re-celling only shows once rows render, so ABC-185 goes after it, and the owner judges it on the rendered table and
may still close it. ABC-185 moved Ready → Backlog, "Waits: `ABC-186` merged". It gained `A6` (`A1-fragments` prints
`2 0` at the tip), and `A4 (d)` is now read in a render.

### 3. QE-165-b: folded into ABC-186

Delete `:371–376` (ELEVEN `|`, plain split; 21 rows misjudged, re-measured), mark `:364` as history, and replace the
no-renderer sentence (`:369–370`) with `…482f15f6`'s reading. The check is `A5-note`: base `1 1 1 0 0 0` → head
`0 0 0 1 1 1`. QE-165-c and QE-165-d (INFO): not cut.

### 4. Racing

ABC-186 carries ABC-185's rule: branch from the latest `main`; merge `main` before QE and before merge, keeping
appended rows verbatim and re-running A1–A7; then a short freeze on appends at merge. Its edits (`:349–396`,
`:628–742`) are far from the tail. Scope 4 adds to the forward rule: "append directly below the last row; a blank
line or HTML comment ends the table". The appender's check becomes `A1-cells` + `A1-fragments` unchanged.

### 5. DoR and placement

| Ticket | Column | Size | Priority | DoR |
|---|---|---|---|---|
| ABC-186 | Ready | XS | P3 | 10/10 |
| ABC-185 | Backlog (waits ABC-186 merged) | M | P3 | 10/10, re-scored |

Next free id after this hop: **ABC-187** (`bapm-rescope-ABC-164`, running beside this hop, must take it if it cuts).

### Owner decision

After `ABC-186` merges, pull `ABC-185` (`M`) or close it as won't-do. Then 86 rows will show every word, but under the wrong headers.

### Trace rows for the Orchestrator to append (10 cells each, A1-checked)

| ABC-186 (BA/PM) | Cut from QE-165-a + QE-165-b: re-head the trace's second fragment above `:629` with copies of `:436`/`:437`, drop blank lines `:740`/`:742` (632 of 690 rows render as paragraph text today), and leave the note one counting rule; rows `…411b3032`, ruling `…1636e62c` | — | — | QE-165-a, QE-165-b; not triggered | — (records only; page `plans/tickets/ABC-186-…`, uncommitted on main @ 3d36999b) | — (acceptance A1–A7 measured on scratch copies: `A1-fragments` 4 3 → 2 0, `marked` 59 → 692/692 `<tr>`) | — (waiver expected, 0 production lines) | — | → Ready (XS, P3, DoR 10/10) |
| ABC-185 (BA/PM) | Re-ruled after QE-165-a: kept separate and ordered after `ABC-186` (its rows render as paragraph text until the table is re-joined); `A6` added (`A1-fragments` 2 0 at the tip), `A4 (d)` read in a render; 86 short rows at `:1143–1253` | — | — | QE-165-a; not triggered | — (records only; page `plans/tickets/ABC-185-…`, uncommitted on main @ 3d36999b) | — | — | — | Ready → Backlog (M, P3, DoR 10/10 re-scored; waits `ABC-186` merged) |
