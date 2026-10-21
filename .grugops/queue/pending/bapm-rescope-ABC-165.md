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
