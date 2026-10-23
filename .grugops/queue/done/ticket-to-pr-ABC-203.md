---
subtask: ticket-to-pr-ABC-203
role: software-engineer
ticket: plans/tickets/ABC-203-at-game-end-npm-run-chess-writes-the-game-as-a-standard-pgn-file-under-games.md
ref: .grugops/context/ticket-to-pr-ABC-203/
inputs: BA/PM …0c2867c1; Architect …e6de1e00 (## Design ruling); ADR-0047 (owner-accepted …7feb0553)
width: 2 (beside bapm-cut-engine-strength, records only)
---

# Build ABC-203: write the finished game as a PGN file under games/

## Do
- Create worktree `../wt-ABC-203` on `grugops/ABC-203` from `main`, with its own `npm ci --ignore-scripts`. Never run npm in main's checkout.
- Build exactly to the page and its `## Design ruling` / ADR-0047: `src/pgn.ts` (pure), `src/pgn-file.ts` (sole `node:fs` holder), wiring in `src/cli.ts`, the headline export from `src/result-screen.ts`, `.gitignore` gains `games/`, tests as ruled (temp-cwd children, the writer's one spawned child, the guard rows). Red-first on the page's plants where it names them. A14's widened class only as the ruling allows; any other existing test that fails is a STOP back to Architect.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json`; skip capture → `test-skip-integrity.js`; `CLI_DEEP` (cli.test.ts) and `INPUT_DEEP` if line-input is touched. Heap 128 multi-file, 400 one-file. After the lane, `git status` in your worktree must show no `games/` (tree-clean guard).
- **No timing claims** beyond what the page asks the SE for; the ≤ 50 ms write reading is QE's.

## Fences
- Only the files the page/ruling name (+ `.gitignore`). No `package*.json`, `tools/`, `AGENTS.md`, ADRs, `plans/board.md`, `plans/traceability.md`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se203/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `ticket-to-pr-ABC-203`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**Delivered, no STOP.** Branch `grugops/ABC-203` in worktree `../wt-ABC-203` (own `node_modules`, `npm ci --ignore-scripts`), from `main` `55a8f4ef`. Tip **`5900d100`**: `5e23e249` (code and tests), then `5900d100` (notes). Not pushed, not merged. No timing claim; the ≤ 50 ms write reading is QE's.

Notes, sealed via `admitAndAppend` with `contextRoot` = the worktree's `.grugops/context`, read back 3/3 by `readContext`, in `../wt-ABC-203/.grugops/context/ticket-to-pr-ABC-203/notes/`:
- observation `…db5ebd0a`: criteria, red-first, plants P1–P7;
- observation `…881df473`: gates;
- decision `…b1c5b861`.

### Per criterion
| crit | result |
|---|---|
| A1 | **MET**. 8 outcomes + white resignation: `Result` tag/token per table, `Termination normal` (pgn.test.ts). In cli.test.ts exactly `mate`, `resigns`, `engineThrows`, `engineForeign` print `PGN saved:`, once each |
| A2 | **MET**. Both faults: `Result "*"`, `Termination "unterminated"`, token `*` |
| A3 | **MET**. No other child prints a PGN line. The neutral `games/` count equals the saved-line count. Existing quit/EOF/usage/exit-70 pins are unedited and green. Extra reading (base vs branch, scratch cwd): usage error and EOF bytes and exit codes are identical, and no `games/` is created |
| A4 | **MET**. 10 tags exact and in order; no `SetUp`/`FEN`; one empty line |
| A5 | **MET**. `N.` only before White moves; headline comment, then the token; greedy wrap ≤ 79; LF only; one final LF; printable ASCII. Checked over 3 histories (one of 300 plies) |
| A6 | **MET**. A 47-ply fixture with O-O, O-O-O, en passant `hxg6`, `bxa8=Q`, checks and `Qaxf7#`. Words resolve, moves are equal, final FEN is equal |
| A7 | **MET**. The movetext equals the sample's (normalised); comment `{Black wins by checkmate.}`; the 7 tags |
| A8 | **MET** (writer child); `.gitignore` holds `games/` |
| A9 | **MET**. Writes `-2`, then `-3`; pre-existing bytes and mtimes unchanged; with all 99 taken → `EEXIST` and no new file |
| A10 | **MET at the holder** (`games` is a file → errno code; `0555` → `EACCES`; 0 new files; non-root), plus a cli.ts source row. **Owed to QE:** the CLI-level reading (stdout as a success run minus the saved line, one stderr line, exit 0). The ruling adds no child for it |
| A11 | **MET**. Outcome children: the screen, then exactly one final saved line; stderr empty; exit 0 |
| A12 | **MET**. Source-order row; P6 reds it |
| A13 | owed: QE hand reading on the host |
| A14 | **MET**. `package.json`, `uci.ts` and `turn-loop.ts` untouched; `renderResultScreen` rows unchanged |

**Red-first:** pgn.test.ts failed to load at base (missing module). In cli.test.ts, 7 rows were red at base and the 92 others stayed green with the new cwd. **Licensed source-count edits** (A14 clarification class, each with a dated reason): process 10 → 11; `sink.write` 1 → 2; ABC-101 `A8′` `difficulty` 2 → 3. The ruling did not name the last two, but both are cli.ts source rows that count what this ticket adds. No other existing row went red.

Plants: P1 → 8 cli rows incl. both guards + A12; P2 → A9 ×2; P3 → A5, A7; P4 → A5 wrap; P5 → A2 (+A5); P6 → A12; P7 → A10. Each was restored byte-identical.

Gates at tip:
- lint, typecheck and build: exit 0.
- `npm test`: 62 files / 2 038 tests, `last-run.json` `success: true`. Base: 61 / 2 019.
- Skips: 0, and the integrity check prints `No findings.`
- CLI_DEEP: 11/11. INPUT_DEEP not run (line-input untouched).
- Heap 128 for multi-file runs, 400 for one-file runs.
- Tree clean: `git status --porcelain` is empty and no `games/` exists.

**UAT is not waived** (production lines). Files: `.gitignore` +1, `src/cli.ts` +21, `src/result-screen.ts` +8/−4, new `src/pgn.ts` 102, new `src/pgn-file.ts` 74, new `src/pgn.test.ts` 448, `src/cli.test.ts` +115/−11, `src/cli.real-engine.test.ts` +4/−1.

### Trace row
| ABC-203 (ticket-to-pr-ABC-203) | at game end, write the finished game as PGN under `games/` by exclusive create; `PGN saved:` / `PGN not saved: <CODE>` (EPIC-006) | EPIC-006 | — | ADR-0047; ADR-0036 (b1) pgn-file.ts 6th holder, (b2) cli.ts→pgn-file.ts → Security/NFR owed; NFR-008 +1 file +1 spawn (not read); NFR-007/002 untouched (A12) | grugops/ABC-203 @ 5900d100 (code 5e23e249)<br>new src/pgn.ts, src/pgn-file.ts, src/pgn.test.ts; edited src/cli.ts, src/result-screen.ts, src/cli.test.ts, src/cli.real-engine.test.ts (header), .gitignore; .grugops/context/ticket-to-pr-ABC-203/notes/ (3) | pgn.test.ts 15 rows + cli.test.ts 4 guard rows + 3 tail pins; red-first: missing module, 7 cli rows red; plants P1–P7 each red; lint/typecheck/build 0; npm test 62/2038, success true; skips 0, No findings.; CLI_DEEP 11 | not waived (production lines); QE A1–A14 incl. A13 host reading and the A10 CLI reading signs under …5aaf7cec item 2 | — | In Development → In Review (QE, then Security/NFR) |
