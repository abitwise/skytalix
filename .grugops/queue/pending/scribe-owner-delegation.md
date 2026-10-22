---
subtask: scribe-owner-delegation
role: agents-md-scribe
tickets: []
branch: grugops/scribe-owner-delegation (from main @ the main tip at your start); worktree ../wt-scribe-owner-delegation
ref: .grugops/context/scribe-owner-delegation/
width: 3 (beside qe-ABC-196 and ticket-to-pr-ABC-178; disjoint files)
---

# Scribe: write the owner's 2026-10-22 delegation into the standing rulings, so no agent blocks on a human signature the owner no longer gives

## Read first
- The ruling: `.grugops/context/owner-delegation-2026-10-22/notes/20261022T140148Z-orchestrator-decision-5aaf7cec.md` (the owner's verbatim words, plus the Orchestrator's reading in four numbered points). That note is the source. Do not widen or narrow it.
- `memory-bank/45-standing-rulings.md` (all sections, especially § Test and UAT authority and § QE validation authority); `AGENTS.md` § Standing rulings and § Safety rules; `memory-bank/90-agents-md-command-log.md` (preamble, and how earlier Scribe passes are logged, e.g. `scribe-waiver-quotepath`).
- The `AGENTS.md` guards in `src/cli.test.ts`: the byte budget (`AGENTS_MD_BUDGET_BYTES = 18_432`), and ABC-187 A5's closer count (the comment says 9; see `plans/tickets/ABC-187-*.md` A5 for the script).

## Do
- In `memory-bank/45-standing-rulings.md`, add a dated 2026-10-22 ruling. The 2026-08-16 "owner's word IS the In UAT signature / a green agent report does NOT count" rule is **superseded**: mark it superseded in place, without deleting it, and point to the new ruling. State what is delegated, what QE verdict signs `In UAT` and how it is recorded (a `decision` naming the QE verdict note, never a stamp), what still escalates to the owner, and what is unchanged (blocking gates, the QE hop on every ticket, merge-on-green, `production_requires_human_confirmation` stays `true`).
- In `AGENTS.md` § Standing rulings, replace the 2026-08-16 bullet's operative sentence with the 2026-10-22 one, in the same verbatim-sentence style. Fix every other line that still says the owner's word or a human must sign UAT. Keep it short: the file must stay ≤ 18,432 B, and **add no closer** that changes ABC-187 A5's count of 9. Re-run that script and report the number. If it can't stay 9, stop and report rather than editing `src/`.
- Log the pass in `memory-bank/90-agents-md-command-log.md` as earlier Scribe passes are logged (bytes before and after).
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (base count at your start); skip-count capture as spelled → `test-skip-integrity.js`. Heap 128. No timing.
- UAT waiver form must print nothing (no `src/` lines).

## Fences
- Only `AGENTS.md`, `memory-bank/45-standing-rulings.md`, `memory-bank/90-agents-md-command-log.md` (plus your notes). No `src/`, `plans/`, `.grugops/factory.config.json`, the kit, git config, other worktrees. Commit on `grugops/scribe-owner-delegation` only. Never push, merge or `--force`.
- **Stop and report** if any existing guard test goes red.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass your worktree's `.grugops/context` as the context root explicitly**, never the plugin dir. Take every `at` from `date -u` (UTC). Include a `kind: decision`. Append-only; record artifacts as `observation` (no §14 gate run, no `finding`).
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |`, exactly 10 cells, as a plain table line. Write your done record as `.grugops/queue/done/<subtask>.md` (this brief plus a `## Result` section) and `.claim.md`, in main's tree, uncommitted. Leave the pending file and the claim directory alone.
