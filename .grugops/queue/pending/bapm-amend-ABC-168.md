---
subtask: bapm-amend-ABC-168
role: ba-pm
ticket: plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
ref: .grugops/context/bapm-amend-ABC-168/
width: 3 (beside qe-ABC-187 and qe-ABC-172)
---

# BA/PM: amend ABC-168's page per the Architect's D8 ruling (option (a))

The Architect ruled option (a) (`.grugops/context/arch-ABC-168-D8/notes/`: `…5a20f1f5` readings, `…ce80739a` ruling, `…618fccad` exact page text) and added `ADR-0044` § Addendum 2026-10-21 (`816b9082`): `dist/` may hold the files tsc emits for type-only imports (`turn-loop.js`, `history.js`, `frame.js`, `render.js`); `A7` and M9 read what `dist/uci.js` loads; D8 gains `"include": []`.

## Do
- Amend the ABC-168 page exactly as `…618fccad` gives: Scope 2, `A7` bullet 2, `A7`'s away-from-clone bullet, Out of scope, Test note 4. Date the amendment and cite the ruling.
- **Do NOT edit `EPIC-007` M9.** M9 is owner-accepted; the Orchestrator is asking the owner to confirm its rewording. On the page, note that `A7`'s new wording depends on that confirmation, and that the fallback if he declines is option (b) (another ADR amendment).
- Re-score DoR (the Architect expects 10/10). Move the card from Blocked to Ready if 10/10; size S and P1 unchanged.

## Fences
- Records only: the ABC-168 page, `plans/board.md` (the ABC-168 card, header counts, one `_Updated:` line prepended above the first existing one; re-read the board right before editing), notes. No `EPIC-007`, ADR, `src/`, `AGENTS.md` or `plans/traceability.md` edits. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-amend-ABC-168`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/bapm-amend-ABC-168.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**:
  `| ABC-168 (BA/PM) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
