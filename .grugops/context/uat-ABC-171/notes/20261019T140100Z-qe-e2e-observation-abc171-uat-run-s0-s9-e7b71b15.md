---
id: 20261019T140100Z-qe-e2e-observation-abc171-uat-run-s0-s9-e7b71b15
kind: observation
by: qe-e2e
task: uat-ABC-171
at: 2026-10-19T14:01:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - ADR-0044
  - ADR-0032
  - NFR-004
  - QE-171-e
  - QE-171-f
  - UAT-171-a
  - UAT-171-b
  - UAT-171-c
  - UAT-171-d
  - grugops/ABC-171
  - 20261019T140000Z-qe-e2e-artifact-ref-abc171-uat-pack-f340102a
  - .grugops/context/uat-ABC-171/probe/harness-RUN-1.txt
  - .grugops/context/uat-ABC-171/probe/harness-RUN-0-excerpt.txt
supersedes:
---

# UAT run `ABC-171` at `5dee231c`: S0–S9 and X1 PASS, 4061 of 4061 checks, two runs byte-identical

This note is hand-authored and unsealed. The command was
`node .grugops/context/uat-ABC-171/probe/uat-harness.ts <worktree>`, run in `../wt-uat-ABC-171` (tree `5dee231c`) on
Node v26.11.1, on virtual clocks only. **No wall-clock reading was taken, and none is reported.** RUN-1 and RUN-2 are
byte-identical: sha256 `f704c86b952685f2f54befaecfa4f8933e0ff4b16bb5129e42d18c04473d1d29`, both.
`src/uci-session.ts` had md5 `0d63103d546fa1a2d983d183667fb98c` before and after.

| scenario | checks | what was seen (virtual figures; `time` is node-count / clock-read time) |
|---|---|---|
| S0 fixtures | 12/12 | The tree's `LEVELS` equals the brief's table: 100/0.4, 500/0.2, 3000/0, 4000/0, 4500/0. Default 3, ceiling 5 000. `K_ENGINE` = 1 (first level draw 0.694); `K_BLUNDER` = 2 (0.166). The transposition pair shares the key `63e6a47b…`. The shipped book is 356 526 bytes, with the start position in book |
| S1 option lines | 17/17 | `uci` writes exactly the 5 lines, twice, with 0 reads. Both option lines follow the UCI grammar. After both options are changed, `uci` still shows the defaults. A fresh session plays level 3 (3 100 at step 100) and answers from the book |
| S2 setoption | 588/588 | 4 name spellings × 5 levels: each plays at that level, as do extra spaces and a trailing space. 4 `OwnBook` spellings switch off (0 reads) and back on. 20 bad `Skill Level` lines × 2 starting values, and 13 bad `OwnBook` lines × 2 directions: each writes exactly one printable `info string` and keeps the value. 19 other or malformed lines write nothing, and the level and the book are unchanged |
| S3 book on | 425/425 | A3's two lines, by `startpos` and by FEN. **f3:** `go movetime x`, `go depth 0 nodes x` and `go searchmoves …` at level 3, and `go depth x` at level 1, write their bad-token `info string`s first, then `info string book`, then `bestmove e2e4`. There is no "ignores" line and 0 draws; `go depth 3` at level 1 on a hit gives just the 2 lines. The book answers first under 8 `go` forms × 5 levels with 0 draws (40 sessions). The transposition, a FEN and a FEN+moves hit, 5 answers on 1 read. Reads go 0 → 1 → 1, or reach 1 at the first `go` with no `isready`. Toggling `OwnBook` never re-reads. LINE game: `e2e4` `g1f3` `f1b5` from the book, then 5 searched legal answers. Shipped book: `b2b3` `b7b5` from the book, then 28 searched legal plies, 1 read per session, 0 warnings |
| S4 book off | 247/247 | 4 books (one with a throwing `read`) × 2 spellings. Every `go` searches, levels 1–2 play the level line, `go infinite` holds and `stop` releases. **0 reads and 0 warnings** in all 8 sessions, and no `info string book` anywhere. Off after warming: still 1 read |
| S5 bad book | 882/882 | 9 bad books × 4 flows = 36 sessions. Every `go` writes one legal `bestmove`; `handleLine` never threw; `warn` was called **exactly once** in all 36. The text is fixed, e.g. `opening book could not be read; playing on without it`, and carries none of the planted bytes (`SECRET`, `ENOENT`, `PLANTED`, `passwd`, `e2e5`). No written line names the book |
| S6 levels | 1317/1317 | **Engine-path budgets at step 100, levels 1–5:** `movetime 10000` → 200 / 600 / 3 100 / 4 100 / 4 600; A6's G = 3 500 → 200 / 600 / 3 100 / 3 600 / 3 600; a bare `go` → as `movetime 10000`; black at G = 1 402.5 → 200 / 600 / 1 600 / 1 600 / 1 600. **At step 10 with G = 75,** 90 at every level. All are in `[B, B + 2·step]`, none above 5 000 + 2·step. **Blunder draws:** the session equals `createLevel` in move, depth, nodes and time (`UAT-171-a`). **Determinism:** k = 1..8 × levels 1 and 2 give identical lines twice. The D11 seed oracle matches **64/64** at each level, with 1 draw per `go`; level 1 drew 10 blunders and 22 engine moves, level 2 drew 2 and 30. **Dropped limits:** 9 `go` lines × 2 levels write exactly 3 lines; the one `info string` names each limit; the search runs on time. Levels 3–5: `depth 3` → 3, `nodes 1` → 1, `mate 2` → `score mate 2` `d5g8`. A mid-session change applies from the next `go` |
| S7 infinite on a hit | 49/49 | `go infinite`, `go ponder` and `go movetime 100 infinite` on a hit write only `info string book`. `isready`, `foo` and `setoption` while held behave as in ABC-167. `stop` / `ponderhit` → `bestmove e2e4` once. `position`, `ucinewgame`, `quit` (returns `"quit"`) and `go` release it first. Levels 1–2: a held hit draws 0; a held level line (`time` 110 / 510) draws 1 |
| S8 no reseed | 27/27 | `setoption`, 4 × `ucinewgame` and `isready` draw 0. Each level-1/2 `go` draws 1, and levels 3–5 draw 0. With k = 2, the `go` after `ucinewgame` plays `e2e4`, the second seed's move; the first seed's move is `b1c3`. A session without `ucinewgame` writes the same lines. `ucinewgame` keeps `OwnBook false` and level 1, with 1 read |
| S9 two games | 494/494 | Both games use the shipped book, with a seeded-random scripted opponent and the GUI as referee. **Level 1, engine white, 3+2, step 10:** 47 plies, ended by checkmate (white wins). 1 book answer (`b2b3`), 23 level answers, all legal. One draw per level `go`, 1 read, no warning. **Level 3, engine black, 10+0.1, step 10:** 26 plies, ended by checkmate (black wins). 1 book answer, 12 searched, lowest engine clock 5 780. Both replay move for move |
| X1 every line | 3/3 | All 1 793 lines start with an allowed word and are printable. 677 `go` lines, 677 `bestmove` lines |

**Engine work** (reported, not graded): 503 answers checked, 677 `go` lines, 0 child processes per run.

## Findings that are not defects (INFO)

- **`UAT-171-a` INFO: the blunder path's virtual `time` is clock reads, not thinking.**
  - Level 1 from the start: 103 virtual ms at step 1, 810 at step 10 and 8 100 at step 100, against B = 100.
    Level 2: 503 at step 1 and 820 at step 10, against 500.
  - The cause is ADR-0032's construction. A blunder scores all 20 root moves with one `chooseMove` each, and each
    child pays a fixed number of clock reads (ADR-0032 § Context, "about 4–6 steps per child"). So the overshoot
    scales with the step, and at step 100 it passes the 5 000 ceiling **on the virtual clock**.
  - The session adds nothing: S6 shows the session's move, depth, nodes and time equal `createLevel`'s on the same
    step. `src/levels.ts` is not `ABC-171`'s to edit (page § Out of scope).
  - On a real clock, `secnfr-ABC-087` measured level-1 blunder moves at a maximum of 498–589 ms
    (`plans/nfr-catalog.md`, the level-layer block).
  - What a GUI's clock sees at levels 1–2 is observable only at `ABC-168`. The same effect would appear in any
    virtual-clock GUI referee at a coarse step. S9 used step 10 for that reason.
- **`UAT-171-b` INFO: a `go` at a blunder level on a mated position draws one seed.** `position startpos moves
  f2f3 e7e5 g2g4 d8h4` at level 1, then `go`, writes `bestmove 0000` and draws **1** seed: the `go` reaches the
  level, which finds no move. With no position held, it draws **0**. This is consistent with A8's wording, "each
  `go` that plays through a blunder level". It does not change a move, since there is none to play.
- **`UAT-171-c` INFO: the advertised `default 3` is a literal.** The session starts at `DEFAULT_LEVEL`. The two
  agree today: S1 checks that the advertised default is the level a fresh session plays. ADR-0045 (D3's fold) moves
  both to 5 and reads the line from `DEFAULT_LEVEL`, and that is `ABC-174`'s. Control C12 (`…be4d3860`) shows S1
  catches a line that says one level while the session plays another. For `ABC-174`'s QE: pin the pair together.
- **`UAT-171-d` INFO: the bad-book warning stays in `warn`.** In all 36 bad-book sessions the session wrote nothing
  for it. That is QE-171-e, accepted for `ABC-171` and routed to `ABC-168`, where `uci.ts` binds `warn` to
  `info string`.

## RUN-0 (disclosed): two errors of mine, not the engine's

RUN-0 failed 5 checks, 4050 of 4055: S0 11/12, S3 412/415 and S6 1320/1321. The excerpt is in
`probe/harness-RUN-0-excerpt.txt`.

1. **The transposition fixture.** My second order, `g1f3 b8c6 e2e4 e7e5`, ends on a double pawn push. That sets an
   en-passant square, so it has a different key from `e2e4 e7e5 g1f3 b8c6`. The S0 precondition caught it, and
   S3's 3 FAILs follow from it: the engine rightly searched an out-of-book position. RUN-1 uses `g1f3 e7e5 e2e4
   b8c6`, which ends on `b8c6` as the book's order does, and S0 shows the keys are equal.
2. **"A blunder is not the engine-path move."** Nothing promises that. At step 1 the strict second-best by child
   scores is `d2d4`, the move the deeper engine path also plays. The session still matched `createLevel` exactly.
   RUN-1 reports it as an OBS line. That removed 4 checks (1 failing and 3 passing), so S6 has 1317 checks.

**One addition, made after RUN-0 and disclosed:** S3's f3 block, 10 checks (QE-171-f f3, bad `go` tokens on a
book hit). RUN-0 did not exercise f3, and the owner's checklist row 2 asks about it. Nothing else changed between
RUN-0 and RUN-1.

**Defects found: 0.**
