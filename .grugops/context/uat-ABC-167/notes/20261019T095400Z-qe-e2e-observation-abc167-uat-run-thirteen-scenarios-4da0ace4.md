---
id: 20261019T095400Z-qe-e2e-observation-abc167-uat-run-thirteen-scenarios-4da0ace4
kind: observation
by: qe-e2e
task: uat-ABC-167
at: 2026-10-19T09:54:00Z
verified_by:
confidence: high
refs:
  - ABC-167
  - ADR-0044
  - NFR-004
  - UAT-167-a
  - UAT-167-b
  - UAT-167-c
  - grugops/ABC-167
  - 20261019T095300Z-qe-e2e-artifact-ref-abc167-uat-pack-af06cf1f
  - .grugops/context/uat-ABC-167/probe/harness-RUN-1.txt
  - .grugops/context/uat-ABC-167/probe/harness-RUN-0-excerpt.txt
supersedes:
---

# UAT run `ABC-167` at `660a0d50`: 13 of 13 scenarios PASS, 2876 of 2876 checks, two runs byte-identical

This note is hand-authored and unsealed. The command was
`node .grugops/context/uat-ABC-167/probe/uat-harness.ts <worktree>` in `../wt-uat-ABC-167` (tree `660a0d50`). It ran
on Node v26.11.1, on virtual clocks only. **No wall-clock reading was taken, and none is reported.** RUN-1 and RUN-2
are byte-identical: sha256 `8033c6ea1fbbeae42a2c5ce4b4e2ded5fa02c9e8c6220accb3f0b1d0df295435`, both.
`src/uci-session.ts` had md5 `b05800c2601b5b83165690c56598f8fd` before and after.

| scenario | checks | what was seen (virtual figures; `time` is node-count time) |
|---|---|---|
| S1 handshake | 23/23 | `uci` → exactly 3 lines; `isready`, `isready\r`, `  isready  ` → `readyok`. No `option` line (`ABC-171`) |
| S2 two games on a clock | 1142/1142 | 3+2 on step 100: 60 plies, every `time` 3 100 (G capped at 3 000), lowest clock 147 000. 10+0.1 on step 10: 40 plies, each in its D4 window as the clocks fell, lowest clock 4 040. 100 answers, all legal, pv = bestmove |
| S3 FEN and move lists | 91/91 | Kiwipete; black to move by FEN and by `moves e2e4` both give `d7d5 cp -50`; `e1g1 e8c8`; en passant `e5d6`; `a7a8q` / `a7a8n`; a 20-ply Ruy Lopez. With a pawn on a7 the engine answers `a7a8q` |
| S4 depth / nodes / mate | 93/93 | comparator `movetime 1000` reaches depth 6; `depth 4` → 4; `depth 1` → 1; `nodes 20000` → 20 501; `nodes 1` → depth 1; `mate 2` → `mate 2`, `d5g8`; `mate 1` → `mate 1`, `a1a8`; `depth 3 mate 5` → 3; `depth 1 mate 2` → 1 |
| S5 17 GUI time controls | 153/153 | each `time` in [G, G + 2·step]. `movetime 2000` → 2 100; `movetime 10000`, 3+2, 1+0 and 40/90 → 3 100 (capped); 1.5 s left → 90 (G 75), for white and for black; `winc`-heavy → 610 (G 600); black with `binc 0` → 110 (G 100); `movestogo 2` → 1 600; `movestogo 1` → 960 (G 950, the overhead binds); 40 ms and 0 ms left → 2 (G 1) |
| S6 infinite / ponder | 36/36 | `go infinite` and `go ponder` hold (`time` 3 100); `isready` and `foo` while held answer at once or not at all; `stop` / `ponderhit` release exactly once; `go depth 3 infinite` holds at depth 3 |
| S7 held answer released | 46/46 | `position`, `ucinewgame` and `quit` write `bestmove h8g8` first; a new `go` writes held, info, new; a refused `position` writes the bestmove, then the `info string` (QE-167-j order) |
| S8 bad input | 745/745 | 19 ignored lines, 11 refused positions and 27 `go` value lines: no exception, `isready` always answers, one `bestmove` per `go`. `e2e4\x1b[31m` is echoed as `e2e4[31m`. `go movetime depth 3` → one `info string`, then depth 3 |
| S9 mate and stalemate | 47/47 | fool's mate, a back-rank mate and the page's stalemate → `bestmove 0000` only; `go infinite` there holds `0000` until `stop`; mated next move → `score mate -1`, `h8g8`; mate in 1 → `score mate 1`, `a1a8` |
| S10 quit | 5/5 | `quit` → `"quit"`, nothing written; ten other lines → `"continue"` |
| S11 new game | 28/28 | after `ucinewgame`, after a refused position, and in a new session, the answer is legal from the start |
| S12 repeatability | 464/464 | two `go`s on Kiwipete write identical lines; the 10+0.1 game replays move for move |
| S13 every line | 3/3 | all 648 lines start with an allowed word and are printable; 277 `go` lines and 277 `bestmove` lines |

**Engine work** (reported, not graded): 242 searched answers, 5 726 989 nodes, 277 `go` lines and 0 child
processes, per run.

## Findings that are not defects (INFO)

- **`UAT-167-a` INFO, a fixture error of mine, disclosed.** RUN-0, the first run, failed 4 checks (S4 90/92, S9
  45/47). All four came from one fixture: `k7/8/1K6/8/8/8/8/1Q6 w`, which I took for a mate in 1. It is a mate in
  2, because the king on b6 blocks the b-file. An exhaustive check with the generator finds no mate in 1 and 18
  mate-in-2 keys, `b1b2` among them. **The engine was right both times**: `cp 932` at depth 1 under `go mate 1`,
  and `score mate 2` with `b1b2` under `go movetime 100`. RUN-1 uses `6k1/5ppp/8/8/8/8/8/R5K1 w` (`a1a8#`), and the
  harness now checks that the fixture has a mate in 1 before using it. Nothing else changed. The excerpt is in
  `probe/harness-RUN-0-excerpt.txt`.
- **`UAT-167-b` INFO, repetition** (ADR-0044 D6, by design). In the 3+2 game, the position after ply 40 recurs after
  plies 44 and 48. A GUI would call a threefold-repetition draw there. The search does not see the game's history.
- **`UAT-167-c` INFO, a promotion with no letter is refused.** `position fen 8/P6k/… moves a7a8` writes one
  `info string` (`illegal move a7a8`), and the next `go` writes `bestmove 0000`. UCI always writes the letter
  (`a7a8q`), so this conforms. A GUI that left the letter off would get `0000`.

**Defects found: 0.**
