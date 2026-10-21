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
