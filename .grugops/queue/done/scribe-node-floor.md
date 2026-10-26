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

## Result
- Branch `grugops/scribe-node-floor`, commit `40d59864`, worktree `../wt-scribe-node-floor`, from `main` `08b44f94`. Not merged, not pushed. 1 source file (`AGENTS.md`, +1 / -1) plus 1 sealed note.
- `AGENTS.md` § Stack: "TypeScript on Node (>= 22), ESM." -> "TypeScript on Node (>= 22.18), ESM." (17,098 -> 17,101 B). Matches `engines.node` `>=22.18` in `package.json` and `package-lock.json` (ABC-216, `39b93505`). No dated line: AGENTS.md has no such convention in § Stack. Nothing else moved; no `src/`, no `package*.json`, no board edit; no npm, vitest or timing run.
- Notes (decision, 1): `20261026T041438Z-agents-md-scribe-decision-77871c72`, sealed by `admitAndAppend` with the worktree as context root, in `.grugops/context/scribe-node-floor/notes/` on the branch.
- Claim: bare `mkdir` of `claimed/scribe-node-floor/`.

### Trace row (10 cells, header order)

| AGENTS.md § Stack (Node floor) | AGENTS.md Scribe: Stack floor "Node (>= 22)" -> "(>= 22.18)" to match `engines.node` | EPIC-006 | ABC-216 | — | `grugops/scribe-node-floor` @ `40d59864` (records only)<br>`.grugops/context/scribe-node-floor/notes/` (…77871c72) | records only; no gate run (no npm/vitest by fence) | — | — | DONE; merge is the Orchestrator's |
