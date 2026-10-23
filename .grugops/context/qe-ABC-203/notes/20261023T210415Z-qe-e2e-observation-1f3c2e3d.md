---
id: 20261023T210415Z-qe-e2e-observation-1f3c2e3d
kind: observation
by: qe-e2e
at: 2026-10-23T21:04:15Z
verified_by: 
confidence: high (each reading run on this host at merge 8fa09e14; raw under raw/a10, raw/a13, raw/write-timing-300-plies.jsonl)
refs:
  - qe-ABC-203
  - ABC-203
  - EPIC-006
  - ADR-0047
  - grugops/qe-ABC-203
  - 8fa09e14
  - 5900d100
  - 5e23e249
  - ticket-to-pr-ABC-203/…db5ebd0a
  - ticket-to-pr-ABC-203/…881df473
  - ticket-to-pr-ABC-203/…b1c5b861
  - arch-design-ABC-203/…e6de1e00
  - A10
  - A13
  - NFR-007
  - cutechess-cli 1.5.1
  - Stockfish 19
  - python-chess 1.11.2
supersedes: 
seal: sha256:8d2a6140bb5e3b2edd8c2194b03dd90ccd769f60b91f770ca7835c447aad4c8a
---

# ABC-203 owed readings: A10 through the CLI, A13 on a real pty game, the write time at 300 plies

**A10 through the CLI.** `node src/cli.ts --colour white --difficulty 1` with stdin "resign", in its own scratch cwd for each case. One success run was the reference.
- `games` a regular file: stderr exactly "PGN not saved: EEXIST", 1 line. stdout == the success run's stdout minus its final saved line (cmp). Exit 0. games stays the same 9-byte file with an unchanged mtime.
- `games/` mode 0555 (uid non-root): "PGN not saved: EACCES", same stdout, exit 0, 0 entries.
- All 99 names taken: "PGN not saved: EEXIST", same stdout, exit 0, nothing new.
- Extra, write fails after the open (RLIMIT_FSIZE 100 bytes, SIGXFSZ ignored): "PGN not saved: EFBIG", same stdout, exit 0, games/ empty. So the partial file was removed. The X1 plant on the same reading leaves a 100-byte partial file, so the reading discriminates.
- No stack trace and no message text on stderr in any case.

**A13 hand reading.** Clone of 8fa09e14. `npm run chess` under a real pty (python pty.fork). The startup questions were answered on the pty: colour "random" resolved to black, difficulty 1. The human's moves came from Stockfish 19 (go movetime 60). The engine's replies were recovered by diffing the drawn board, and no product code was used to drive. The game ended 0-1 by checkmate in 54 plies (27...Qxd2#). The last line was "PGN saved: games/skytalix-20261023-234523.pgn", and git status in the clone gave 0 lines. File sha256 c070e2a8…55b6f9, 552 bytes.
- Reader 1, cutechess-cli 1.5.1 (sha256 fb4fc2aa…, ABC-202's pin), `-openings file=<f> format=pgn plies=1000`: 0 warnings, exit 0. -epdout end position 6k1/4ppbp/3p2p1/7P/2b1P3/Pr6/1r1q1PP1/3K3R w - - 0 28. Controls: an illegal SAN (h9) gives "Warning: Illegal move: h9". On a mate, cutechess parses the mating ply and drops it so as not to start from a finished position: the fool's-mate control shows 3 {book} + engine Qh4#, and our file shows 53 {book} + Qxd2#. So all 54 plies parsed.
- Reader 2, python-chess 1.11.2 (isolated venv): errors 0, 54 plies, is_checkmate True, same FEN, last comment "Black wins by checkmate.". The corrupted control gives 1 error.
- Screen: the last frame's board, parsed from the pty bytes, is the same placement, "White to move 28. CHECK", "last: Qxd2#". Stockfish's replay of the driver's own move list gives the same FEN.
- **Pinned reader for A13:** cutechess-cli 1.5.1 `-openings ... format=pgn` plus python-chess 1.11.2 as the no-trim second reader.
- Edge shapes through both readers, 0 errors and 0 warnings: a zero-ply resignation ("{Black wins by resignation.} 0-1"), a fault comment that wraps over two lines, and the longest draw headline (threefold, FIDE 9.2).

**Write time, <= 50 ms at 300 plies.** Method: 5 fresh node processes on an Apple M3, Node 26.11.1, load1 6.3-7.3. Each process builds a 300-ply LCG history (not timed), then times formatPgn + writePgnFile once, cold, in a fresh mkdtemp cwd (performance.now). Headline: fivefold, the longest one-line headline. The file is 2134 bytes.
- Cold totals: 8.39 / 5.82 / 7.20 / 6.93 / 7.85 ms. **Max 8.39 ms against a 50 ms bar: MET.**
- Split: format 5.4-7.7 ms, write 0.37-0.87 ms. Warm (50 repeats per process): median 2.2-2.7 ms, max 15.0 ms (one GC outlier).
- This is a single reading as the page asks. It is not a catalog row.
