---
subtask: scribe-ABC-176
role: agents-md-scribe
tickets: [ABC-176]
branch: grugops/ABC-176 (tip bfe1ff4a; SE code ffd53f41; base 01836fff) — commit ON THIS BRANCH in the SE's worktree ../wt-ABC-176
ref: .grugops/context/scribe-ABC-176/
width: 2 (beside qe-ABC-191)
---

# Scribe: ABC-176's two `AGENTS.md` comment edits (A5) — the `Test (all)` comment stops quoting the unprefixed wrapper (QE-173-f), and the skip-count comment gains the history pointer

The Orchestrator ruled (brief `ticket-to-pr-ABC-176`) that the SE proposes the `AGENTS.md` text and the Scribe applies it on the SE's branch. The SE has finished and touches nothing more.

## Read first
- The ticket page `plans/tickets/ABC-176-a-refused-run-never-reads-as-a-clean-skip-count-or-a-quiet-result-file.md` § Scope (option b, the pointer clause) and A5.
- The SE's proposal: decision note `.grugops/context/ticket-to-pr-ABC-176/notes/20261021T162606Z-software-engineer-decision-af9fc531.md` on `grugops/ABC-176` (exact before/after strings, +191 B, 15,606 → 15,797).
- `memory-bank/90-agents-md-command-log.md` (the lane-comment home after ABC-164) — log the change there if that file's own rule asks for it.

## Do
- In `../wt-ABC-176`, apply the two comment edits. You own the wording: you may tighten the SE's text if it keeps every fact, but **the skip-count command itself does not change**, and you add **no new backticked `npx vitest` text** (ABC-173 A3 must still count exactly 17 commands).
- A5: `wc -c AGENTS.md` ≤ 18,432 (`AGENTS_MD_BUDGET_BYTES`); report the exact bytes. ABC-173 A3 green and counting 17; ABC-173 A4's refusal regex still matches.
- Gates on the new tip: lint, typecheck, build; `npm test` + `last-run.json` success (1992 / 1992 expected, 59 files); skip-integrity `--skip-count 0`. One-file vitest runs use `NODE_OPTIONS=--max-old-space-size=400`; whole-suite 128. No timing.

## Fences
- Only those two `AGENTS.md` comments (and, if its rule requires, one row in `memory-bank/90-agents-md-command-log.md`). No `src/`, `tools/`, `plans/`. Commit on `grugops/ABC-176` only. Never push, merge or `--force`. Do not touch `../wt-ABC-191`, `../wt-qe-ABC-191`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `scribe-ABC-176`). **Pass the worktree `../wt-ABC-176` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells. Put it in your done record (`.grugops/queue/done/scribe-ABC-176.md` + `.claim.md`, main's tree, uncommitted); the Orchestrator appends it.
