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
