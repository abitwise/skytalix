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

## Result

**Branch `grugops/scribe-amend-90` (worktree `../wt-scribe-amend-90`), from `main` `bf6fc623`.**
- Code tip: **`d7752d53`** (`memory-bank/90-agents-md-command-log.md` only; +32/-12). Branch tip: **`99369cd7`** (adds only `.grugops/context/scribe-amend-90/`, two sealed notes: observation `…1965e8de`, decision `…4ce69de2`; `at` from `date -u`, worktree as context root). Nothing pushed or merged. The `node_modules` symlink is git-ignored.
- Fence held: no `AGENTS.md`, `src/` or `plans/` line changed.

**Before / after (the four sentences, QE-164-a).**
1. Preamble. Before: "`AGENTS.md` keeps each command line plus the single most load-bearing fact (exit code / count / timing) and a pointer to the matching section below." After: since `ABC-164` it keeps each command line except the three in § "On-demand commands", a fact only in the `Dev / run` and `npm test` comments, and points here; every other command's comment is in its section below.
2. Reader. Before: "… beyond the one-line summary `AGENTS.md` carries inline. … `AGENTS.md` § Commands is the one-line-per-command index every role reads; this file is its footnoted detail." After: "… beyond the little `AGENTS.md` carries inline (see the preamble). … the command index every role reads (every command line but the three in § "On-demand commands"); this file holds the comments and receipts behind it."
3. § Dev / run. Before: "`AGENTS.md` carries the rules in the slot's own comment; this entry is their receipt." After: the slot's comment in `AGENTS.md` carries only a pointer here; the rules are in the "WRITING RULES" paragraph below; this entry is their receipt.
4. § Regenerate the opening book. Before: "`AGENTS.md` carries the line and one fact; the URLs and hashes stay in `ATTRIBUTION.md`". After: `AGENTS.md` carries neither the command line nor this comment, only a pointer to § "On-demand commands" (where the line is); the URLs and hashes stay in `ATTRIBUTION.md`.

**QE-164-b.** In the `scribe-ABC-164` pass, the miss list now reads "four kinds" (the `O1` insertion split of the `installed_plugins.json` line added as item 4; both halves stay in `AGENTS.md`); the QE-hop comment is no longer counted as a miss (found whole in `40-contributing.md`). Marked "Corrected 2026-10-21, `scribe-amend-90`".

**History row.** New section `scribe-amend-90 pass, 2026-10-21` at the end of `90` (before/after table above, in the file's pass-section form).

**Flag.** The Reader's "one-line summary" clause was changed with its sentence (same split made it false); the brief fenced the change to the four sentences. Revert that clause if QE reads the fence strictly. Decision note carries it. QE-164-c, QE-164-d untouched (out of fence).

**Gates on the code tip (no timing).** lint exit 0; typecheck exit 0; build exit 0; `npm test` exit 0, **59 files / 1987 tests**, `.test-results/last-run.json` `success` true; pending + todo 0; `test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings.". UAT waiver: zero `src/` lines (only `memory-bank/90-...md` and context notes change).

**Trace row (for the Orchestrator to append; 10 cells):**
`| ABC-164 (Scribe amend-90) | Made four present-tense sentences in memory-bank/90 true for the post-split layout; corrected the ABC-164 miss list (O1 split added, QE-hop comment removed); added a history section | — | — | QE-164-a, QE-164-b | grugops/scribe-amend-90 @ 99369cd7<br>memory-bank/90-agents-md-command-log.md; .grugops/context/scribe-amend-90/ | lint, typecheck, build exit 0; npm test 59 files / 1987 tests, last-run success; skip-count 0 "No findings." | waived (0 src/ lines) | — | QE-164-a closed; ready for merge |`
