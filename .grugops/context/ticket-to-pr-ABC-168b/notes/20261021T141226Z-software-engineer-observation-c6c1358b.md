---
id: 20261021T141226Z-software-engineer-observation-c6c1358b
kind: observation
by: software-engineer
at: 2026-10-21T14:12:26Z
verified_by: 
confidence: high (hand readings and gate runs as listed; not a §14 verdict)
refs:
  - ABC-168
  - ADR-0044
  - EPIC-007
  - grugops/ABC-168
  - 6232cfa7
  - 0cdad4d5
  - plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
  - A1
  - A2
  - A3
  - A5
  - A7
  - A11
  - A12
  - QE-184-c
  - UAT waiver
supersedes: 
seal: sha256:e3db68af0738e601c35447cde967eb889209de310ce0bd2efa9483afd2b3fc46
---

# ABC-168 (hop b): gates and readings at tip 6232cfa7 (base main 0cdad4d5; Node v26.11.1, tsc 5.9.3, Apple M3)

Gates, run one at a time on the tip:
- lint 0 (119 files); typecheck 0; build (tsc -p tsconfig.build.json) 0.
- npm test exit 0: 60 files / 1988 tests passed (base 59 / 1987; +1 file, +1 default-lane row). last-run.json success true, 0 failed, 0 pending.
- test-skip-integrity --skip-count 0: no findings, exit 0. lane-inventory: 60 collected = 60 tracked, exit 0.
- CLI_DEEP=1 (heap 400, --reporter=verbose): 11/11, 6 [CLI_DEEP] children, exit 0.
- PERFT_DEEP=1 (heap 400): 32/32, exit 0.
- UCI_DEEP=1 (heap 400, verbose): 5/5, exit 0; child spawn to exit 1099 ms. Negative controls (reverted, never committed): a stray stdout line reds M4; a book read that throws reds A5 book-on.

Hand readings:
- A1: node src/uci.ts x exits 1, 0 bytes on stdout. A2: uci/quit gives the 5 lines, exit 0; uci with no quit exits 0.
- A3: printf 'uci\nisready\nquit\n' | node src/uci.ts | head -1: child exit 0, 0 bytes stderr. Also with 200 000 isready lines into head -1: exit 0, 0 bytes stderr.
- A4: no test seam reaches it; the catch sets process.exitCode = 70 without process.exit, in cli.ts's shape. A review check for QE.
- A7, fresh git clone of grugops/ABC-168 in scratch: npm ci 0, npm run build 0, dist/uci.js line 1 is the shebang; 22 files, none *.test.js, cli.js or line-input.js; turn-loop/history/frame/render present (type-only, allowed); grep -l 'import(' dist/*.js prints nothing; node dist/uci.js uci/quit: 5 lines, exit 0; npm link under a SCRATCH global prefix (npm_config_prefix, not the user's global) then skytalix: the same 5 lines, exit 0; git check-ignore dist/uci.js prints it; typecheck 0. Away from the clone, after rm -f of the four: 5 lines, one "info string opening book could not be read; playing on without it", readyok, info depth 5, bestmove g1f3, exit 0. Negative control: search.js removed gives ERR_MODULE_NOT_FOUND.
- A11: D2 no-edit files unchanged from base (0 paths); npm run chess starts the board, exit 0 on quit. Armed pin: with package.json's bin removed, src/cli.test.ts has exactly one red row, ABC-042 A10 (1 failed / 88).
- A12: git diff --name-only 0cdad4d5 tip lists package.json, src/cli.test.ts, src/uci.real-engine.test.ts, src/uci.ts, tsconfig.build.json, plus the first hop's four .grugops/context/ticket-to-pr-ABC-168/ records (notes and the WIP patch, committed at 2f02d158). cli.test.ts numstat 4/2. package-lock.json unchanged.
- UAT waiver (AGENTS.md form): over base..tip it prints src/uci.ts (90 production lines), so the waiver does NOT apply; UAT is owed to the owner. The literal <delivered>~1 <delivered> form on the tip commit alone prints nothing, because the tip commit only touches the test file. Measure over the delivered range or the merge, never the tip commit.
- A8, A9, A10: UNKNOWN - verify (owner, UAT on his Mac). A6: UNKNOWN - verify (see the A6 note).
