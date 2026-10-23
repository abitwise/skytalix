---
subtask: qe-ABC-203
role: qe-e2e
ticket: plans/tickets/ABC-203-at-game-end-npm-run-chess-writes-the-game-as-a-standard-pgn-file-under-games.md
ref: .grugops/context/qe-ABC-203/
branch: grugops/ABC-203 (5900d100)
width: 2 (beside bapm-cut-engine-strength, records only)
---

# QE gate for ABC-203 (PGN file at game end)

## Do
- Own worktree `../wt-qe-ABC-203` on `grugops/qe-ABC-203` from `grugops/ABC-203` (`5900d100`); merge current `main` in first (merge, not rebase) and report the sha; own `npm ci --ignore-scripts`.
- Re-verify the SE's A1–A12, A14 independently (read the tests, re-run the plants you judge load-bearing). Then the owed items:
  - **A10 through the CLI:** a write failure as the player sees it — screen bytes unchanged, one stderr line `PGN not saved: <CODE>`, exit 0, no partial file.
  - **A13:** the page's hand reading on the host — play to a real end under a pty, open the written file, check it parses (e.g. replay with the project's SAN code or load it in Stockfish/cutechess as a sanity check), and check it in `games/`.
  - **≤ 50 ms write** at 300 plies, as the page states (method + numbers).
  - **Pin audit:** the SE moved three `cli.ts` source-count rows (process 10→11, `sink.write` 1→2, `difficulty` 2→3). Rule whether each counts only what this ticket adds (A14's ruled class). Anything else is a finding.
  - Tree-clean: after the lane, no `games/` in the worktree or main's checkout.
- Gates at your merge: lint, typecheck, build; `npm test` + `last-run.json`; skip capture → `test-skip-integrity.js`; `CLI_DEEP`. Heap 128 / 400.
- Verdict PASS / PASS_WITH_GAPS / FAIL with findings (severity). UAT: production lines, so your verdict signs it under the delegation; list what the owner should try by hand.

## Fences
- Work only in `../wt-qe-ABC-203` and `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe203/`. Commit notes + a dated `## QE` addendum on the ABC-203 page. No `src/` edits (findings only), no `package*.json`, board, trace. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `qe-ABC-203`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**`PASS_WITH_GAPS`.** Branch `grugops/qe-ABC-203` in `../wt-qe-ABC-203` (own `npm ci --ignore-scripts`). **Merge `8fa09e14`**
= `5900d100` + `main` `bcf9ce95` (merge, no conflict, no `src/` from main). **Tip `730666fb`** (notes, raw, `## QE` on
the page). Not pushed, not merged. No `src/` edit.

- **A1–A14: all MET.** I re-read the lane and re-ran it at the merge. My own base-vs-branch readings through the CLI: `A3` on 7 no-write paths (byte-identical, no `games/`) and `A11` on 4 outcome paths (base stdout + exactly one saved line, stderr empty).
- **A10 via the CLI:** a `games` file gives `EEXIST`, a `0555` `games/` gives `EACCES`, and 99 taken names give `EEXIST`. Each gives one stderr line, a screen equal to the success run's minus its saved line, exit 0 and 0 new files. Extra: `EFBIG` after the open also leaves no partial file.
- **A13:** `npm run chess` in a clone, under a real pty. 54 plies, ended by mate. The readers are `cutechess-cli` 1.5.1 (0 warnings) and python-chess 1.11.2 (0 errors). Both give the screen's final FEN `6k1/4ppbp/3p2p1/7P/2b1P3/Pr6/1r1q1PP1/3K3R w - - 0 28`, and the clone stayed clean.
- **Write time:** max **8.39 ms** of 5 cold runs at 300 plies (bar 50 ms).
- **Pin audit:** the three rows each add one hit, the ticket's own line, so all three are in class.
- **Plants:** P1, P2, P6 and P7 red. X1 and X2 green.
- **Gates:** lint, typecheck and build 0. `npm test` 62 / 2038, success. Skips 0, `No findings.`. `CLI_DEEP` 11/11.
- **Tree:** clean.
- **Findings:** QE-203-a LOW (`A10` at the CLI is not pinned by the lane), -b LOW ("no partial file" is not pinned), -c LOW (a double fault: the cleanup `unlinkSync` throw escapes as exit 70 and leaves the file; reproduced by injection), -d INFO (wrap splits `N.` from its move; a comment can span lines), -e INFO (`games`-as-file and 99-taken share `EEXIST`).
- **Notes** (in `../wt-qe-ABC-203/.grugops/context/qe-ABC-203/notes/`, seals verified): `…5b146b4b`, `…1f3c2e3d`, `…2f8e789e`, decision `…f28588e1`.

**Trace row** (for the Orchestrator):

| ABC-203 (qe-ABC-203) | QE: A1–A14 MET at merge 8fa09e14; A10 via the CLI (EEXIST/EACCES/EEXIST-99, one stderr line, screen = success minus saved line, exit 0, 0 files; EFBIG leaves no partial); A13 real pty game via npm run chess in a clone, 54 plies to mate, cutechess-cli 1.5.1 0 warnings + python-chess 1.11.2 0 errors, FEN = screen; write max 8.39 ms of 5 at 300 plies | EPIC-006 | — | ADR-0047 (D5 vs QE-203-c double fault → Security/NFR); write ≤ 50 ms MET; NFR-008 one reading 9.87 s vitest, not N8-LANE; QE-203-a/-b/-c LOW, -d/-e INFO | grugops/qe-ABC-203 @ 730666fb (merge 8fa09e14)<br>.grugops/context/qe-ABC-203/notes/ (4) + raw/; ABC-203 page ## QE | plants P1/P2/P6/P7 red, X1/X2 green (lane gaps); pin audit 3 rows in class; lint/typecheck/build 0; npm test 62/2038 success; skips 0 No findings.; CLI_DEEP 11 | signs UAT under …5aaf7cec item 2 (production lines); owner try list in …f28588e1 | — | In Review → In Security/NFR (ruling's 5 items + QE-203-c) |
