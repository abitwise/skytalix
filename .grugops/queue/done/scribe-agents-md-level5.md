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

## Result
- **Level 5:** `AGENTS.md` Dev / run slot, line 56: `level 5 (≤3 s/move, ADR-0045;` -> `level 5 (≤4 s/move, ADR-0053 d10, was 3 s under ADR-0045;`. Levels 6 and 7 (5 s, 30 s) unchanged.
- **Deep lanes:** no lane has an `npm run` script, so none was re-spelled. The scripts are typecheck, test, test:watch, lint, lint:fix, format, build, chess, uci, perft, spike:perft. `npm test` pins heap 128 and a 60 s bound; `test:watch` pins heap 128; a deep lane needs heap 400 and runs longer. No lane has a script (PERFT, SEARCH, ENGINE, INPUT, ZOBRIST, PUZZLE, CLI, UCI, LADDER). `package.json` not edited. The npx lines stay.
- **Added one line** under the Heap flag bullet stating this, and that a brief fencing out npx cannot run these lanes. It holds no backticked npx-vitest span, so `src/cli.test.ts` A3's parser does not read it.
- **Size:** 17 286 -> 17 648 B (budget 18 432). Records only; no build or test run.
- **Note:** `.grugops/context/scribe-agents-md-level5/` (one sealed decision).
