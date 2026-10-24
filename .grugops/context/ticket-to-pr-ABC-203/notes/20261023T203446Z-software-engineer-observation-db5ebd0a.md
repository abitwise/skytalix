---
id: 20261023T203446Z-software-engineer-observation-db5ebd0a
kind: observation
by: software-engineer
at: 2026-10-23T20:34:46Z
verified_by: 
confidence: high (each row run on the worktree; outputs kept in the SE scratchpad)
refs:
  - ticket-to-pr-ABC-203
  - ABC-203
  - EPIC-006
  - ADR-0047
  - grugops/ABC-203
  - 5e23e249
  - 55a8f4ef
  - arch-design-ABC-203/…e6de1e00
  - src/pgn.test.ts
  - src/cli.test.ts
supersedes: 
seal: sha256:0763fd0af624e89e3a10f71800c0eee34cd634ad04c24c7d538ea1fcf0143e23
---

# ABC-203 per criterion, red-first, plants P1-P7 (branch grugops/ABC-203 @ 5e23e249, from main 55a8f4ef)

**Red-first.** src/pgn.test.ts red at base (module src/pgn.ts missing, suite fails to load). src/cli.test.ts with the new pins and guard rows: 7 rows red at base (A9 process census, ABC-044 A6 mate tail, ABC-044 A6 sink.write count, ABC-045 A4 resigns tail, and 3 new ABC-203 rows); the other 92 rows were green with every child moved to the mkdtemp cwd. After the build one further existing row went red: ABC-101 A8' "Read once, used once" (difficulty occurrences in cli.ts 2 -> 3). It is a source-reading row on cli.ts counting what ABC-203 adds, so it is in the class the ruling's A14 clarification licenses; edited with a dated reason, like the process census (10 -> 11) and the sink.write count (1 -> 2). No other existing test went red. STOP did not fire.

**Per criterion.**
- A1 MET: pgn.test.ts (8 outcomes + white resignation: Result tag/token per table, Termination normal); cli.test.ts: exactly mate, resigns, engineThrows, engineForeign print PGN saved, once each.
- A2 MET: both faults give Result "*", Termination unterminated, token * (pgn.test.ts); engine-fault children save one file each.
- A3 MET: no other child prints a PGN line; neutral games/ count = saved-line count; existing quit/EOF/usage/internal-error pins unedited and green; extra reading, base vs branch, scratch cwd: usage error and EOF bytes and exit codes identical, no games/ created.
- A4 MET: ten tags exact and in order, Human/skytalix (difficulty N), no SetUp/FEN, one empty line.
- A5 MET: N. only before White moves (independent replay), headline comment then token, greedy wrap <= 79, single spaces, LF only, one final LF, printable ASCII; checked over game 1, the round-trip game and a 300-ply LCG game.
- A6 MET: a 47-ply fixture with O-O, O-O-O, en passant hxg6, bxa8=Q, checks, Qaxf7#: words resolve with parseSan, moves equal, final FEN equal.
- A7 MET: game 1 movetext equals the sample's (whitespace normalised, comment removed); comment {Black wins by checkmate.}; the seven tags.
- A8 MET: in the writer child; .gitignore holds games/.
- A9 MET: -2 then -3, all pre-existing bytes and mtimes unchanged; 99 taken -> EEXIST, nothing new.
- A10 MET at the holder (games a regular file -> errno code; 0555 -> EACCES; 0 new files; uid non-root) plus a cli.ts source row (stderr line carries only the code). NOT spawned through the CLI: the ruling adds no child, so the CLI-level stdout/exit-0 reading on a failed write is owed to QE.
- A11 MET: outcome children's stdout = screen then exactly one final SAVED_LINE, stderr empty, exit 0.
- A12 MET: source-order row (one new Date( before runTurnLoop(, formatPgn( and writePgnFile( after renderResultScreen(, gated on reason !== null).
- A13 OWED: QE hand reading on the host.
- A14 MET: package.json, src/uci.ts, src/turn-loop.ts untouched; renderResultScreen rows unchanged (result-screen tests green; it calls the renamed export).

**Plants (each applied to a copy, run, restored byte-identical):** P1 write also when reason is null -> 8 cli.test rows red incl. both guard rows and A12; P2 "w" -> both A9 rows red; P3 (number before Black / no numbers) -> A5 and A7 red; P4 limit 80 -> A5 wrap row red; P5 fault Termination normal -> A2 red, token unequal -> A2 and A5 red; P6 a write before the loop -> A12 red; P7 message instead of code -> A10 red.
