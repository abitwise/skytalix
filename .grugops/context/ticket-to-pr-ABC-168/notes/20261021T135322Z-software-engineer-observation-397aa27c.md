---
id: 20261021T135322Z-software-engineer-observation-397aa27c
kind: observation
by: software-engineer
at: 2026-10-21T13:53:22Z
verified_by: 
confidence: high
refs:
  - ABC-168
  - ADR-0044
  - EPIC-007
  - grugops/ABC-168
  - 94795bce
  - plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
  - wip-ABC-168-uci-entry-point.patch
supersedes: 
seal: sha256:b791ac381111925a1153943a11020428e07afdb8eeab1636383c4c46b26f4246
---

# ABC-168: the WIP is kept as a patch, not committed

.grugops/context/ticket-to-pr-ABC-168/wip-ABC-168-uci-entry-point.patch (106 lines added, 1 removed) holds src/uci.ts (the Scope 1 composition), tsconfig.build.json (D8 plus "include": []) and package.json (bin, build, uci). It is `git diff` against 94795bce and `git apply --check` passes.
Not started: the Scope 6 pin edits to src/cli.test.ts, and the real-child lane file. The planned lane flag is UCI_DEEP=1, in src/uci.real-engine.test.ts, with an async spawn so that A6 can time each reply. Two dialogues: book on, and OwnBook false before isready.
The worktree ../wt-ABC-168 is clean apart from these notes. dist/ is git-ignored and has been removed. node_modules is a symlink to the main checkout's and is git-ignored.
