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
