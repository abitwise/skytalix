---
subtask: scribe-agents-md-level5
role: agents-md-scribe
ref: .grugops/context/scribe-agents-md-level5/
branch: new grugops/scribe-agents-md-level5 from main e42b637b (worktree .claude/worktrees/scribe-agents-md-level5)
width: records only, no CPU
---
# Scribe: AGENTS.md — level 5 = 4 000 ms; deep lanes without npx
## Do
1. AGENTS.md's level-5 line: 3 000 → 4 000 ms per ABC-228 merge e42b637b (ADR-0053 d10; ticket § Follow-ups row).
2. AGENTS.md spells the deep lanes with `npx`, contradicting the briefs' fence (no bare npx / npm exec). Re-spell them via
   `npm run …` scripts that exist in package.json; if none exists for a lane, say so in your note (do not edit package.json).
## Fences
AGENTS.md only (and your notes). No board edits. Never push/force/amend/rebase/merge into main. No host paths.
## Publish
Sealed notes (task `scribe-agents-md-level5`), commit on the branch, `## Result` here, brief + claim to done/.
