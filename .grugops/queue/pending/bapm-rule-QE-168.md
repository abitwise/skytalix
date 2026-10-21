---
subtask: bapm-rule-QE-168
role: ba-pm
ticket: plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
ref: .grugops/context/bapm-rule-QE-168/
width: 3 (beside qe-ABC-187 and security-nfr-ABC-168)
---

# BA/PM: rule QE-168-a and QE-168-d (records only)

QE on ABC-168 (`.grugops/context/qe-ABC-168/notes/` on `grugops/qe-ABC-168` @ `7e831392`):
- **QE-168-a (LOW):** the delivery diff also lists `memory-bank/90-agents-md-command-log.md` (the Scribe's Scope 5 lane comment, per the ABC-164 layout). `A12`'s file list does not name it, so `A12` is not met as written. Rule: amend `A12` (dated, citing the ABC-164 layout) or require the line moved; say whether `A12` is then met at `b71f8902`.
- **QE-168-d (INFO):** the ABC-171 page's `A1` still says Skill Level `default 3`; `ADR-0045` changed it to 5. Rule: a dated erratum on ABC-171's page, or no action.
- QE-168-b and QE-168-c go to Security/NFR (running in parallel); do not rule them.

## Fences
- Records only: the ABC-168 and ABC-171 pages, notes. No `EPIC-007`, ADR, `src/`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md` edits. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rule-QE-168`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/bapm-rule-QE-168.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**:
  `| ABC-168 ({hop}) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
