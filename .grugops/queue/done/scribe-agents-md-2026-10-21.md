---
subtask: scribe-agents-md-2026-10-21
role: agents-md-scribe
ref: .grugops/context/scribe-agents-md-2026-10-21/
width: 3 (beside bapm-rule-QE-159 and security-nfr-ABC-162)
---

# AGENTS.md Scribe: three stale lines

Work on branch `grugops/scribe-agents-md-2026-10-21` in worktree `../wt-scribe-agents-md` from `main`. The Orchestrator merges.

## Fix
1. **Note writer (~lines 29–33).** The text says `scripts/context-io.ts`, `scripts/claim.js` and `mcp__grugops__propose_note` are absent, so notes are hand-authored. That has misled two SE agents today (QE-160-c, QE-159-g) into writing unsealed notes. What is actually true:
   - The sanctioned writer exists at `~/.claude/plugins/cache/grugops/grugops/2.1.0/scripts/context-io.js` (`admitAndAppend`, `readContext`).
   - `claim.js` sits beside it (`transition`).
   - The Orchestrator has the `mcp__plugin_grugops_grugops__propose_note` tool.
   - `context.human_admission` is still `off`, so no `finding` is admissible. Keep that part.

   Verify each of these before writing it. State the path without a hard-coded version if you can, but name how to find it.
2. **Real-engine CLI lane comment (~lines 123–126).** It says "Two real children", but the lane starts 6 at `main`: 5 CLI sessions and 1 heap probe. That is QE-ABC-162 G-4 (`…315eb7f0`). Prefer wording that doesn't carry a count that tickets keep making stale. ABC-164 is that exact problem.
3. **Heap rule.** If AGENTS.md doesn't already say it plainly, state that `--max-old-space-size=400` is for one-file vitest runs, and that whole-suite or multi-file runs use 128, as `npm test` sets itself; the heap guard refuses 400 there. Source: SE note `…c7a671d8` and QE-159-b. If it's already there, leave it.

## Budget
- AGENTS.md has a 24,576-byte budget and is at 24,353 bytes now.
- Stay at or under it. Trim neighbouring stale prose if needed, and say what you trimmed.
- Don't change the 12 coding rules, the kit overrides or the merge-authority text.

## Fences
- `AGENTS.md` only, plus notes. No `src/` or `plans/` edits. Never push or merge.

## Publish
- Seal notes with that writer (task `scribe-agents-md-2026-10-21`).
- Write `.grugops/queue/done/scribe-agents-md-2026-10-21.md` (brief + `## Result`: diff summary, byte count, branch tip, trace row) and `.claim.md`, uncommitted on main.

## Result

Done. Branch `grugops/scribe-agents-md-2026-10-21`, tip `59ce86b9` (one commit from `main` 63f09a81, worktree `../wt-scribe-agents-md`, not pushed, not merged). `AGENTS.md` only.

- **Fix 1, note writer.** Blockquote rewritten. Verified in the installed plugin before writing: `scripts/context-io.js` exports `admitAndAppend` and `readContext`; `claim.js` exports `claimTask` and `transition`; the plugin declares the MCP server whose tool is `mcp__plugin_grugops_grugops__propose_note`; `human_admission` is `off` (config line 62). No hard-coded version; the plugin is found through `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`. Kept: no-`finding` rule, bare `mkdir` as the atomic claim act, "do not invent a stamp". Dropped: the hand-authoring instruction and the install-escalation sentence.
- **Fix 2, real-engine lane.** "Two real children" now carries no count; it points at the test file.
- **Fix 3, heap rule.** Was not stated. Added a Test bullet "Heap flag (ABC-173)": 400 for one-file runs only; whole-suite or multi-file runs use 128 as `npm test` sets itself; the heap guard refuses 400 there.
- **Bytes.** 24,353 before, 24,554 after (budget 24,576). Trimmed to fit: the two coverage readings (`99.43 % lines`, `95.55 % lines`) in their comments (receipts stay in `memory-bank/90-agents-md-command-log.md`). 12 rules, kit overrides, merge-authority text untouched.
- **Guards.** `src/cli.test.ts -t "AGENTS.md"`: 8 passed (Dev/run slot, ABC-109 byte budget, ABC-173 A3 heap-flag rows).
- **Notes** (sealed through `admitAndAppend`, task `scribe-agents-md-2026-10-21`): `20261021T082642Z-agents-md-scribe-observation-1ab99dce`, `20261021T082642Z-agents-md-scribe-decision-334f909d`, `20261021T082700Z-agents-md-scribe-observation-1945c1c4`. An `artifact-ref` for the delivery was refused (needs gate sha/gate_run/content_hash, none exist), so it is an observation.
- **Trace row (for the Orchestrator to append; `plans/` was fenced):** AGENTS.md substrate updated 2026-10-21 by scribe-agents-md-2026-10-21 at 59ce86b9: note-writer/claim/propose_note paths, real-engine lane comment without a count, heap-flag rule.
- **Left for the Orchestrator.** AGENTS.md could still use a child-kind clarification in the lane comment ("CLI sessions plus a heap probe") but there were only 22 B spare.
