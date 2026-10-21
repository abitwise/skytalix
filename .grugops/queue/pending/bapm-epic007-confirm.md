---
subtask: bapm-epic007-confirm
role: ba-pm
tickets: [ABC-168]
branch: main (records only; commit nothing — the Orchestrator commits)
ref: .grugops/context/bapm-epic007-confirm/
width: 3 (beside arch-build-ABC-191 and ticket-to-pr-ABC-176)
---

# BA/PM (records only): write the owner-confirmed M9 and M3 / RISK-EPIC007-05 rewordings into `EPIC-007`; mark both confirmations met on ABC-168's page

## Read first
- Owner record `.grugops/context/ticket-to-pr-ABC-168b/notes/20261021T161340Z-orchestrator-decision-4ab163ef.md` (both rewordings CONFIRMED; fallbacks (b) and route (1) not taken).
- ABC-168's page (§ amended 2026-10-21, DoR rows 5 and 10, the M9 and `A6` passages); your own notes from `bapm-amend-ABC-168` and `bapm-rule-ABC-168-A6`; `EPIC-007`.

## Do
- Edit `EPIC-007`: M9's wording as confirmed; M3's "how it is read" cell and `RISK-EPIC007-05` as confirmed. Dated, with the owner record's id. Nothing else in the epic changes.
- On ABC-168's page: one dated line marking both confirmations met (they gated QE/UAT reading `A7` and the M3 citation). Do not re-score DoR beyond rows 5/10's text; do not touch A8–A10 (owner UAT, still owed).
- One `_Updated:` line at the top of `plans/board.md` (records only). No card moves.

## Fences
- Only `plans/epics/` (EPIC-007), ABC-168's page, `plans/board.md` (one line), and your notes. No `src/`, `AGENTS.md`, `memory-bank/`, branches or worktrees. Do not commit — leave the edits in main's tree for the Orchestrator. Other agents are working in their own worktrees; touch nothing of theirs.
- **Stop and report** if the confirmed wording on record is ambiguous.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass your worktree (or, for records-only hops, this repo root) as the context root explicitly** — never the plugin dir. Take every `at` from `date -u` (UTC, never local time). Include a `kind: decision`. `artifact-ref` needs a §14 gate run, so record artifacts as `observation`. Task `bapm-epic007-confirm`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, `—` for empty, `\|` for a literal pipe. Put it in your done record; the Orchestrator appends it.
