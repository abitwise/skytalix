---
id: 20261021T135322Z-software-engineer-observation-319de31a
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
  - A1
  - A2
  - A3
  - A7
supersedes: 
seal: sha256:77896966f30b10ede163cfaa78c070cad9adb77e93778e60e8b508309f3a58fe
---

# ABC-168: readings on the WIP, at base 94795bce (Node v26.11.1, tsc 5.9.3). These were hand runs, not gates

- A1: `node src/uci.ts x` exits 1 with 0 bytes on stdout. The usage line goes to stderr.
- A2: `printf 'uci\nquit\n' | node src/uci.ts` writes id name skytalix, id author, two option lines and uciok, then exits 0. `printf 'uci\n' |` exits 0.
- A3: `printf 'uci\nisready\nquit\n' | node src/uci.ts | head -1`: the child exits 0 and writes 0 bytes to stderr.
- Book hit from startpos: info string book, then bestmove e2e4.
- Build with D8's config exactly as written (no include override): exit 1 (TS5055 and TS6059 on tools/, spike/ and vitest.config.ts) and test files emitted. It left stray .js files under spike/, tools/ and the root of the worktree, which I removed.
- Build with "include": [] added: exit 0. dist/uci.js line 1 is #!/usr/bin/env node. No *.test.js, cli.js or line-input.js. **turn-loop.js IS present.** frame.js, history.js and render.js are also present. The runtime import closure from uci.js is 18 files, and none of these four is in it.
- `printf 'uci\nquit\n' | node dist/uci.js` gives the same 5 lines and exits 0. `git check-ignore dist/uci.js` prints dist/uci.js. `npx tsc --noEmit` exits 0.
- Away from the clone (cp -R dist to scratch/d, run from scratch): exactly one "info string opening book could not be read; playing on without it", then readyok, an info depth line and bestmove g1f3. Exit 0.
- Not run: lint, npm test, skip-integrity, CLI_DEEP, PERFT_DEEP, the real-child lane (not written), npm link, a fresh clone. All UNKNOWN - verify.
