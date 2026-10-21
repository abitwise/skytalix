---
subtask: scribe-snapshot-rule
role: agents-md-scribe
ref: .grugops/context/scribe-snapshot-rule/
width: queued; dispatched when a slot frees
---

# AGENTS.md Scribe: add the owner's snapshot-waiver clause (QE-159-f)

**Owner grant** (`…d9aa42b9`, 2026-10-21): amend the **third kit-override paragraph**. The override count stays three.

## Do
- Add the clause from the owner's 2026-10-17 rule (`…be910aa8`): a snapshot-only `src/` change keeps the UAT waiver only if the Orchestrator reads every changed `.snap` and records that in the Done note. Find the exact owner text in `…be910aa8` and the BA/PM ruling `…99559726`.
- Make AGENTS.md's waiver measurement the stated reference, with no `__snapshots__` filter.
- **Budget:** 24,576 bytes (now 24,554). Trim stale prose to fit and say what you trimmed. Don't touch the 12 rules or the merge-authority text.
- **Where to work:** branch `grugops/scribe-snapshot-rule`, worktree `../wt-scribe-snapshot`. Write the notes inside the worktree. Run `src/cli.test.ts -t "AGENTS.md"` as a one-file run at 400.

## Fences
- `AGENTS.md` and notes only. Never push or merge.

## Publish
- Seal the notes with the plugin writer (task `scribe-snapshot-rule`).
- Write `.grugops/queue/done/scribe-snapshot-rule.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.
