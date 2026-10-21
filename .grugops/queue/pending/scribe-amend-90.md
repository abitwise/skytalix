---
subtask: scribe-amend-90
role: agents-md-scribe
ticket: ABC-164 follow-up (QE-164-a)
branch: grugops/scribe-amend-90 (from main @ the main tip at your start); worktree ../wt-scribe-amend-90
ref: .grugops/context/scribe-amend-90/
width: 3 (beside ticket-to-pr-ABC-185 and bapm-cut-guard-18432; disjoint files)
---

# Scribe: amend the four present-tense sentences in `memory-bank/90-agents-md-command-log.md` that ABC-164's split made false (QE-164-a; owner go `…cba9c8eb`)

QE on ABC-164 (`.grugops/context/qe-ABC-164/notes/`, verdict `…47cae669`) found:
- § Dev / run: "`AGENTS.md` carries the rules in the slot's own comment; this entry is their receipt."
- § Regenerate the opening book: "`AGENTS.md` carries the line and one fact".
- the preamble's "keeps each command line" and the Reader's "one-line-per-command index".

## Do
- Make each sentence true for the post-split layout (what `AGENTS.md` now carries vs what this file carries). Change only those sentences; add one dated history row in `90`'s usual form.
- Also, if QE-164-b's miss list (the O1 line split omitted; the QE-hop comment listed though found whole in `40`) lives in `90`'s ABC-164 entry, correct it there.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987); skip-integrity `--skip-count 0`. No timing.

## Fences
- Only `memory-bank/90-agents-md-command-log.md`. No `AGENTS.md`, `src/`, `plans/` edits. Commit on your branch only. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `scribe-amend-90`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`. Write notes inside your worktree.
- Write `.grugops/queue/done/scribe-amend-90.md` (brief + `## Result`: tip, the four before/after sentences, gates) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| {ticket} ({hop}) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
