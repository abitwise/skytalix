---
subtask: scribe-node-floor
role: agents-md-scribe
ref: .grugops/context/scribe-node-floor/
branch: new grugops/scribe-node-floor from main, worktree ../wt-scribe-node-floor
width: 1 of 2 (records only — no npm, vitest or timing)
---

# AGENTS.md § Stack: Node floor is >= 22.18 (QE-216-h)

## Do
- `package.json` / `package-lock.json` have declared `"engines": { "node": ">=22.18" }` since ABC-216 merged (39b93505). AGENTS.md § Stack still says "Node (>= 22)". Make it match, with a dated line if the file's convention asks for one. Nothing else moves.

## Fences
- Only AGENTS.md, your worktree and `<scratchpad>/scribe-node/`. No `src/`. No npm/vitest/timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task scribe-node-floor). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
