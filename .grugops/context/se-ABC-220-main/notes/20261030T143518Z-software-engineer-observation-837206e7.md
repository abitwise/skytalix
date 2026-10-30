---
id: 20261030T143518Z-software-engineer-observation-837206e7
kind: observation
by: software-engineer
at: 2026-10-30T14:35:18Z
verified_by: 
confidence: high: commands run in the worktree at 9ac8b365's tree, output quoted
refs:
  - se-ABC-220-main
  - ABC-220
  - ABC-241
  - EPIC-009
  - ADR-0052
  - ADR-0020
  - ADR-0044
  - grugops/ABC-220
  - 9ac8b365
  - 8f444cc4
  - a649fbc4
  - arch-ABC-220-a14
  - src/uci-session.ts
  - src/uci-session.test.ts
  - src/uci.real-engine.test.ts
supersedes: 
seal: sha256:6a96d42cb1b3ad224ff28d9373aa120a542f1a627c8cf6350c10141322762688
---

# Software Engineer observation, se-ABC-220-main: gates on the merged tree

Run through `npm run …` in `.claude/worktrees/se-ABC-220`, after the merge and before its commit (the committed tree is the same):
- `npm run lint`: biome checked 129 files, no fixes, exit 0.
- `npm run typecheck`: tsc --noEmit, no output, exit 0.
- `npm run build`: tsc -p tsconfig.build.json, no output, exit 0.
- `npm test` (the unit run; package.json has no `unit` script): 63 files passed, **2 297 tests passed (2 297)**, none failed and none listed as skipped. That is 2 271 + 26, as the brief expects.
- Deep lanes not run: A11 is ENGINE_DEEP, A12 is the wall, A14 is UCI_DEEP, and A14b is the probe. They are QE's, in the ALONE window. No timed read was made.
- `git diff a649fbc4 9ac8b365 -- src` shows exactly ABC-220's three files (733+/12−), the same counts as `68ba364c`. The merge adds nothing beyond the two tickets.
- Seen, not acted on: BA/PM owes `ADR-0044` D5's simple-tournament fold line at ABC-220's merge (arch-ABC-220-a14 observation). It is outside this hop's fences.
