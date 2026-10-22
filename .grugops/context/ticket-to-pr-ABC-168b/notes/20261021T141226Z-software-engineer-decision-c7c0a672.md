---
id: 20261021T141226Z-software-engineer-decision-c7c0a672
kind: decision
by: software-engineer
at: 2026-10-21T14:12:26Z
verified_by: 
confidence: high
refs:
  - ABC-168
  - ADR-0044
  - EPIC-007
  - grugops/ABC-168
  - 6232cfa7
  - 0cdad4d5
  - plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
  - ADR-0044 D2
  - ADR-0044 D8
  - ADR-0044 D9
  - ABC-173 C2
  - UCI_DEEP
supersedes: 
seal: sha256:bfb2dd6d7d21886df4327e5d60715fa734176f2d6d8a28b62657c84e1245f354
---

# ABC-168 (hop b): built to the amended page; the lane flag is UCI_DEEP, and the lane spawns synchronously

- Merged main 0cdad4d5 into grugops/ABC-168 (merge 683129f7, not a rebase), then applied the first hop's WIP patch unchanged: src/uci.ts (Scope 1), tsconfig.build.json (D8 plus "include": [], ADR-0044 § Addendum 2026-10-21), package.json bin/build/uci. "private": true and "license" (ABC-169) kept.
- Scope 6: exactly the four pin edits in src/cli.test.ts (numstat 4 added, 2 removed). "bin" sits after "engines" in AT_HEAD.
- Scope 3: src/uci.real-engine.test.ts, flag UCI_DEEP=1 (unset = NOT DEFINED, the ABC-119 form; one default-lane row that spawns nothing and can fail). One spawn, one scripted dialogue: uci, isready, position startpos, go movetime 1000 (book on), isready, setoption name OwnBook value false, isready, position startpos, go movetime 1000 (book off), quit. Rows: A5 book on, A5 book off, M4 keyword set, quit exit 0 / no signal / empty stderr. Each bestmove is checked against parseCoordinateMove from the start position; no move literal.
- The lane uses spawnSync, not spawn: ABC-173 C2 (src/cli.test.ts, ADR-0008 addendum 2026-10-19, owner-accepted) fails the default lane on any asynchronous child_process form in src/**/*.test.ts. Measured: my first async version turned npm test red on exactly C2 (1 failed / 1988). A11 forbids any cli.test.ts edit beyond Scope 6, so C2 stands and the lane conforms.
- Lane flag for the Scribe (Scope 5): command `UCI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci.real-engine.test.ts`; trigger: run at QE and after any change to src/uci.ts, src/uci-session.ts, src/book-file.ts or src/engine.ts.
