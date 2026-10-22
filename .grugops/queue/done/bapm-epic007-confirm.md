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

## Result

**DONE.** Records only, uncommitted on `main` (base `01836fff`). No stop: the confirmed wording on record is unambiguous. The M3 and `RISK-EPIC007-05` text is verbatim in `…20cc2ffe`. The scope of the M9 swap ("'no turn-loop.js' becomes …") is given by the Architect's `…618fccad`, so the `*.test.js` and `cli.js` clauses stay, as they do in `A7` bullet 2.

Notes are in `.grugops/context/bapm-epic007-confirm/notes/`. They were sealed with `admitAndAppend`, with the context root passed explicitly as the main checkout's `.grugops/context`, and read back with `readContext` (2 notes, findings `[]`):
- `20261021T161717Z-ba-pm-decision-a4c4959c`: the rewordings, as written.
- `20261021T161717Z-ba-pm-observation-5c60fecf`: the files touched, with the exact before and after text.

**Files touched:**
- `plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md`: 3 places, +4/−3. Each carries the date, the owner record id `…4ab163ef` and its superseded text inline (the M10 precedent).
  - **M9 target.** Before: "`dist/` holds no `*.test.js`, no `cli.js` and no `turn-loop.js`." After: "`dist/` holds no `*.test.js` and no `cli.js`, and `dist/uci.js` loads no `turn-loop.js`, as `A7` measures."
  - **M3 "how it is read".** Before: "The opt-in real-child lane in `ABC-168`. Security/NFR places it as `ADR-0044` candidate row (i) and may change the numbers. The book-load cost on this host is `UNKNOWN - verify` until that lane reads it." After: "One QE hand reading in `ABC-168`, by an async probe outside vitest (`ABC-168` test note 6), recording host and load1. Security/NFR places it as `ADR-0044` candidate row (i) and may change the numbers. The book-load cost on this host is `UNKNOWN - verify` until that probe reads it." The targets are unchanged.
  - **`RISK-EPIC007-05`.** Before: "… until `ABC-168`'s lane reads it." After: "… until `ABC-168`'s QE probe reads it."
  - Nothing else in the epic changed. M4, M6 and the ABC-168 row still name the real-child lane. That is correct, because the lane still runs `A5` and M4.
- `plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md`:
  - one dated top line marking both confirmations met (QE/UAT may read `A7` as M9's proof; `A6` may be cited as M3's proof; fallbacks (b) and route (1) are not taken);
  - one added sentence each in DoR rows 5 and 10.
  There is no re-score (still 10/10). `A8`–`A10` are untouched. S, P1 and Ready for UAT are unchanged. The two "The owner confirms …" Dependencies lines are left as written, and the top line marks them met.
- `plans/board.md`: one `_Updated:` line prepended. No card moves.

Not touched: `src/`, `AGENTS.md`, `memory-bank/`, `plans/traceability.md`, the ADRs, branches, `../wt-ABC-191`, `../wt-ABC-176`, the pending brief and the claimed dir.

### Trace row for the Orchestrator to append (10 cells, header order)

| ABC-168 (BA/PM, bapm-epic007-confirm) | Wrote the owner-confirmed rewordings into EPIC-007: M9 "`dist/uci.js` loads no `turn-loop.js`, as `A7` measures"; M3 "how it is read" and RISK-EPIC007-05 name ABC-168's QE probe (test note 6). Marked both confirmations met on ABC-168 (dated line, DoR rows 5/10 text) | EPIC-007 | — | RISK-EPIC007-05; ADR-0044 § Addendum 2026-10-21; owner `…4ab163ef`; `…618fccad`; `…20cc2ffe` | `main` @ `01836fff` (uncommitted, records only)<br>`plans/epics/EPIC-007-…-play-it.md`, `plans/tickets/ABC-168-…-dist-artifact.md`, `plans/board.md` | — (records only) | — (A8–A10 still owed by the owner) | — | no move (stays Ready for UAT; DoR 10/10) |
