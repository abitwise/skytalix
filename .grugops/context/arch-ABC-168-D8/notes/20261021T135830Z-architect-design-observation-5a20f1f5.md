---
id: 20261021T135830Z-architect-design-observation-5a20f1f5
kind: observation
by: architect-design
at: 2026-10-21T13:58:30Z
verified_by: 
confidence: high (hand readings in a scratch extract, not gates)
refs:
  - ABC-168
  - ADR-0044
  - ADR-0044 D8
  - EPIC-007
  - EPIC-007 M9
  - A7
  - grugops/ABC-168
  - 2f02d158
  - 41f5b366
  - src/engine.ts:97
  - tsconfig.build.json
supersedes: 
seal: sha256:9a06d47ba909d0f9feec0610f16e1c384651197779488be11adf091a6403f5b8
---

# ABC-168 D8: what the build emits and what dist/uci.js loads (main 41f5b366 + WIP patch, tsc 5.9.3, Node v26.11.1)

Read in a scratch extract (git archive main, the SE's wip patch applied, node_modules symlinked). Not gates.

- With D8 plus "include": [], the build exits 0 and emits 22 files to dist/. That set includes turn-loop.js, history.js, frame.js and render.js, because of the type-only import at src/engine.ts:97. There is no *.test.js, cli.js or line-input.js. dist/uci.js line 1 is the shebang. This confirms SE …319de31a.
- The static runtime closure from dist/uci.js is 18 files: apply book-file book coordinate-move engine evaluate fen gameend legal levels moves position quiescence search transposition uci-session uci zobrist. It is a walk of the relative import/export-from specifiers in the emitted JS. verbatimModuleSyntax erases every import type, so those specifiers are the runtime edges. None of the four is in the closure. grep -l 'import(' over dist/*.js prints nothing.
- Run test: a cp -R of dist/ with the four deleted, run from scratch, printf 'uci\nisready\nposition startpos\ngo movetime 100\nquit\n'. Output: 5 uci lines, one "info string opening book could not be read; playing on without it", readyok, info depth 5, bestmove g1f3, exit 0. Negative control: the same copy with search.js deleted fails at start with ERR_MODULE_NOT_FOUND.
- In the clone, the same dialogue gives info string book, then bestmove d2d4.
- In the four files, "process." appears only in comments. There is no node: import, Math.random or Date.now. Together they are 43 137 bytes.
- (c1) noResolve with files = the 18 and "include": []: tsc exits 2. TS2307 at engine.ts:97 ./turn-loop.ts, and node:fs and node:readline lose their types (TS2307/TS2304/TS2591). The build gate would be red.
- ABC-172's diff against main (grugops/ABC-172 @ 2eaf1a1c) is package.json, package-lock.json and its own notes. It does not touch build, tsconfig* or bin.
- EPIC-007 M9 (accepted 2026-10-18) carries the same words as A7: "dist/ holds no *.test.js, no cli.js and no turn-loop.js".
