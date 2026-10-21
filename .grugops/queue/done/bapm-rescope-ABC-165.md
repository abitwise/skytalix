---
subtask: bapm-rescope-ABC-165
role: ba-pm
ticket: plans/tickets/ABC-165-ten-traceability-rows-do-not-render-as-ten-columns-and-a-metrics-header-runs-into-the-next.md
ref: .grugops/context/bapm-rescope-ABC-165/
width: 2 (beside ticket-to-pr-ABC-184; disjoint files)
---

# BA/PM: re-scope ABC-165. Its trace defect grew from 10 rows to 96, and is still growing

The Orchestrator ran ABC-165's own `A1` command at `main` (after `4f1f7c06`) before pulling it. It prints **96** lines, not the page's 10. By cell count: 7 cells ×38, 6 ×36, 5 ×8, 11 ×6, 9 ×6, 13 ×1, 2 ×1. The 86 new rows date from after the cut at `1671f24f`; most are the 6- and 7-column hop and merge rows that roles write into their done records and the Orchestrator appends (for example the `(QE)`, `(Security/NFR)` and `(merge)` rows of today's tickets). So the page fails DoR items 1, 4 and 8 as written, and every hop that runs during a repair adds more rows that fail `A1`.

## Decide
1. **The forward rule first.** What shape must a newly appended row have, so the defect stops growing? Options include: every appended row fills the table's 10 columns (name them, with a template line); or hop rows go to a separate, differently-shaped table or section of the file; or something else. Say who writes the template into the brief/done-record convention (Orchestrator briefs, and an `AGENTS.md` line through the Scribe), and whether the Orchestrator runs `A1`'s count as a pre-append check.
2. **The repair.** Re-cut ABC-165 against today's count: size it honestly, and split it if it is no longer S (e.g. the original 10 plus the paragraph and metrics line, separately from the 86 hop rows, or a mechanical repair of the hop rows by a script). Keep "no word moved" (`A2`) and the fences. State how the repair hop avoids racing with the Orchestrator's appends (e.g. the Orchestrator freezes appends to that table during the hop, or the repair runs at the tip and re-runs `A1` before merge).
3. **Re-score DoR** for each resulting ticket and place it (Ready at 10/10). Next free id is ABC-185 (verify in `plans/tickets/`).

## Fences
- Records only: the ABC-165 page, any new ticket page(s), `plans/board.md` (cards, header counts, one `_Updated:` line prepended above the first existing one), notes. Do not edit `plans/traceability.md` or `plans/metrics.md` yourself.
- No `src/` or `AGENTS.md` edits. Never push or merge. Do not touch `../wt-ABC-184` or `src/cli.real-engine.test.ts`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`; task `bapm-rescope-ABC-165`). **Pass the main checkout as the context root explicitly** (the default root is the plugin's own directory). Take every `at` from `date -u`.
- Write `.grugops/queue/done/bapm-rescope-ABC-165.md` (brief + `## Result` + a trace row in the 10-column shape if you rule it, otherwise one `| ABC-165 | … |` line) and `.claim.md`, uncommitted on main.

## Result

**DONE.** Records only, uncommitted on `main` (base `5277babd`; `main` moved to `2b6b10b9` during the hop). Notes in
`.grugops/context/bapm-rescope-ABC-165/notes/`, sealed with `admitAndAppend` (context root passed explicitly) and
read back with `readContext`:
- `20261021T115746Z-ba-pm-observation-50929881`: readings.
- `20261021T115747Z-ba-pm-decision-d2b9bf09`: the forward row rule.
- `20261021T115748Z-ba-pm-decision-e9a6c68a`: the re-cut and split.

### 1. Forward rule (decided; `…d2b9bf09`)

Every row appended to the trace table fills its 10 columns in header order:

`| {ticket} ({hop}) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

- Write `—` for an empty cell, `\|` for a literal pipe (code spans too), and join two facts with `<br>` or `; `.
- **Who writes it.** The Orchestrator puts the template in every brief's Publish section and in the done-record
  convention, starting with its next brief. The Orchestrator is the single appender: it re-cells a failing
  done-record row with no word changed, or returns it, and never appends a failing row.
- **Pre-append check.** The Orchestrator runs `A1` before and after each append, and the two outputs must be equal.
- **Where it is recorded.** `ABC-165` Scope 2 writes the rule into the trace's own note. `AGENTS.md` has only 16 B
  free (24,560 of 24,576; `src/cli.test.ts:2484`), so at most a pointer fits there, for example ` (10 cells/row)` on
  `:181`. The Orchestrator decides whether to dispatch the Scribe for it.
- A separate hop table was rejected. It would mean moving rows, two conventions in one file, and a per-table `A1`.

### 2. Repair (re-cut; `…e9a6c68a`)

**Readings.** `A1` printed 96 rows at `5277babd`. At `2b6b10b9` it prints 97: `:1242` `ABC-184` (5 cells) was
appended during this hop.

**Split rule.** GFM drops the cells past the tenth, so text is hidden. It pads short rows, so the words show under
the wrong headers.

**`ABC-165`: Ready, S, P3, DoR 10/10 (re-scored).**
- *Rows:* the 10 original rows plus `ABC-157 (QE)` `:1121`. These are all 7 rows that hide text, plus the 4
  original short rows.
- *Note:* rewritten with the GFM count and the forward rule. It names no row by id.
- *Also:* a blank line above the header (`:424` is a blockquote line; render effect UNKNOWN - verify), and
  `plans/metrics.md:2-3`.
- *Acceptance:* `A1` is re-stated over `A1-cells`, which prints the Ticket cells of failing rows. The 11 named cells
  must be absent. "No word moved" (`A2`) and the fences are kept.
- *Racing:* none. It touches nothing below `:1121`. Merge `main` at the tip before QE and before merge.

**`ABC-185` (new): Ready, M, P3, DoR 10/10.**
- *Rows:* the 85 short rows at `:1132-1241` in 9 layouts, plus `:1242`, plus any later extra.
- *Acceptance:* `A2` is N of N with `<br>` allowed. Branch cells land in Code. A per-row map is published. QE reads at
  least 14 rows.
- *Pull precondition:* the forward rule is in force.
- *Racing:* merge `main` at the tip before QE and before merge, keeping `main`'s appended rows verbatim on a tail
  conflict. Short freeze: no trace append between the final acceptance run and the merge commit.
- *Independence:* it does not depend on `ABC-165` (disjoint lines; either order works).

**Corrections.**
- The 2026-10-17 page's "rows up to 1,644 bytes" was wrong: `ABC-066` is 16,051 bytes.
- Its frontmatter said Backlog while the board said Ready. Both now say Ready.

### Files (uncommitted, `main`)
- `plans/tickets/ABC-165-ten-traceability-rows-do-not-render-as-ten-columns-and-a-metrics-header-runs-into-the-next.md` (re-cut; filename kept)
- `plans/tickets/ABC-185-eighty-five-hop-rows-in-the-trace-carry-5-to-9-cells-and-render-under-the-wrong-headers.md` (new)
- `plans/board.md`: one `_Updated:` line prepended, the `ABC-165` card rewritten, an `ABC-185` card added, and the
  Ready count 1/8 → 2/8. Next free id: `ABC-186`.
- `.grugops/context/bapm-rescope-ABC-165/notes/` (3 notes).
- Not touched: `plans/traceability.md`, `plans/metrics.md`, `src/`, `AGENTS.md`, `../wt-ABC-184`.

### For the Orchestrator
1. Adopt the forward rule in briefs now.
2. Decide on the `AGENTS.md` pointer.
3. Decide, with the owner, whether `ABC-185` (M) is worth a hop or should close as won't-do. Its text is visible;
   only the column alignment is wrong.

### Trace rows (10-column shape; both checked to split into 10; for the Orchestrator to append)

| ABC-165 (re-cut) | Re-cut at `5277babd` after its own A1 printed 96 rows (97 at `2b6b10b9`): the 10 original rows + `ABC-157 (QE)` (all 7 rows that hide text), the trace note rewritten with the GFM count and the forward row rule, one blank line above the header, `plans/metrics.md:2-3` | — | — | QE-040-c, QE-156-a; not triggered | — (not started; `plans/traceability.md`, `plans/metrics.md`) | A1–A7 on page; QE hop owed | waiver expected (0 production lines) | — | Ready, `S`/`P3`, DoR 10/10 (re-scored 2026-10-21 in `bapm-rescope-ABC-165`; notes `…50929881`, `…d2b9bf09`, `…e9a6c68a`) |
| ABC-185 | 85 hop and merge rows at `:1132-1241` (+ `:1242` appended at `2b6b10b9`) carry 5, 6, 7 or 9 cells; re-cell them into the 10 columns, no word moved | — | — | split from ABC-165 (QE-040-c); not triggered | — (not started; `plans/traceability.md` only) | A1–A5 on page; QE hop owed (at least 14 rows read against the headers) | waiver expected (0 production lines) | — | Ready, `M`/`P3`, DoR 10/10 (cut 2026-10-21 in `bapm-rescope-ABC-165`; pull once the forward row rule is in force; owner may close as won't-do) |
