---
id: 20261019T095300Z-qe-e2e-artifact-ref-abc167-uat-pack-af06cf1f
kind: artifact-ref
by: qe-e2e
task: uat-ABC-167
at: 2026-10-19T09:53:00Z
verified_by:
confidence: high
refs:
  - ABC-167
  - ABC-168
  - ABC-171
  - ADR-0044
  - ADR-0027
  - EPIC-007
  - NFR-004
  - NFR-008
  - R-167-1
  - R-167-2
  - src/uci-session.ts
  - plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
  - 20261019T094500Z-orchestrator-decision-owner-word-qe146a-qe166a-r1672-uat167-by-qe-5d7c2e18
  - 20261018T211300Z-qe-e2e-decision-abc167-recheck-verdict-pass-with-gaps-c02ebd96
  - 20261019T085800Z-security-nfr-decision-abc167-pass-with-risks-99713c0e
  - .grugops/context/uat-ABC-167/probe/
supersedes:
---

# UAT pack `ABC-167`: the capability-free UCI session, as a GUI would talk to it

This note is hand-authored and unsealed. `context-io.ts` is not on this install and `human_admission` is `off`
(`AGENTS.md` § Test and UAT authority), so no `finding` is admissible. It points at a throwaway harness, not a UAT
spec, so it carries no `sha`, `gate_run` or `content_hash`.

**Who wrote this pack.** QE/E2E wrote it, because the owner chose that role on 2026-10-19 (`…5d7c2e18`: *"4. go
over UAT items using quality engineer"*). The UAT Planner and BA/PM hops of Workflow 06 were not run, by the
owner's word. The shape follows the `ABC-170` precedent (`.grugops/context/uat-ABC-170/`). **Only the owner's own
word signs this UAT.** This pack does not sign it, and neither does a green run.

**The waiver does not apply.** `git diff --name-only main...grugops/ABC-167 | grep -v '\.test\.ts$' | grep '^src/'`
gives `src/uci-session.ts`, which is production code.

## Scope / Risks (cited from the ticket page, authoritative)

- Scope: `src/uci-session.ts` exports `createUciSession({ write, now })` → `{ handleLine(line) }`. It handles the D3
  commands without options, at the fixed level 3 with no book. It applies the D4 time rule capped at 3 000 ms and the
  D12 `depth` / `nodes` / `mate` mapping, and writes one `info` line and one `bestmove` per `go`.
  `src/uci-session.test.ts` is the one new lane file.
- Risks carried in: R-167-1 (LOW, accepted: bracket access to globals evades `A11`'s text guard) and R-167-2 (LOW,
  accepted by the owner, `…5d7c2e18`: the N8-LANE delta is OWED).

## UAT goal

Decide whether what a UCI GUI would get from this session is what `ABC-167` promises. That covers the handshake, a
legal `bestmove` for every `go` in a game, FEN positions, a budget that follows the GUI's clock and never leaves
3 s, `depth` / `nodes` / `mate`, `infinite` and `ponder` held until told, bad input answered rather than crashed
on, mate and stalemate, and `quit`.

## What this ticket can and cannot show

`ABC-167` is the **session logic only**. The `skytalix` binary, `src/uci.ts` and real stdin/stdout are `ABC-168`'s,
so **no chess GUI can talk to it yet**. Each scenario is therefore a **UCI dialogue**: the lines a GUI would send,
fed to `handleLine` one by one, with the lines `write` receives collected as the GUI would read them. A harness under
`ref:` stands in for the GUI. For S2 it also plays the GUI's referee: it keeps the clocks, sends `position startpos
moves …` and `go wtime … btime … winc … binc …`, subtracts the reported `time`, and adds the increment.

Every session runs on a **virtual clock** (`ADR-0027`, `virtualClock(step)`). A virtual millisecond is not a real
one. "time 3100" below is a node-count figure, so **no timing reading was taken**. N8-LANE stays OWED (R-167-2).
What only `ABC-168` / `ABC-171` can show is listed in `…19c7115a`, and none of it is graded here.

## Entry criteria

| criterion | state |
|---|---|
| Built and QE'd | QE `PASS_WITH_GAPS` at `4dbbfbd8` (`…e100c23c`), re-check `PASS_WITH_GAPS` at `6922f772` (`…c02ebd96`). QE-167-i rows added at `660a0d50` |
| Security/NFR | `PASS_WITH_RISKS` at `660a0d50` (`…99713c0e`). R-167-1 and R-167-2 accepted; NFR-004 MET |
| Waiver tested | production line present (`src/uci-session.ts`), so the UAT is conducted |
| Tree under test | `grugops/ABC-167` @ `660a0d50`, in a fresh worktree on `grugops/uat-ABC-167`. `src/uci-session.ts` md5 `b05800c2…` before and after every run |
| Gate at that tip | lint, typecheck, build exit 0; `npm test` exit 0, 59 files, 1915/1915, `last-run.json` `success: true`; integrity at skip 0 `No findings.`; merge-tree clean (`…530eb78c`) |

## Who and what

- **Signer:** the owner, Olger Oeselg, by his own word in session (`AGENTS.md`, 2026-08-16 ruling).
- **Conductor:** QE/E2E (agent). It runs the harness and reports the result. It never signs.
- **The legality oracle:** the tree's own perft-proven generator (`fen.ts`, `legal.ts`, `apply.ts`,
  `coordinate-move.ts`), which `ABC-167` does not edit. The harness writes moves in its own UCI text (`e1g1` for
  castling, a lowercase promotion letter). **The D4 oracle is written from the ADR's text**, not from the module.
- **Test data (fixed before the first run; one fixture was corrected after it; see `…4da0ace4`):**
  - start position; `AFTER_E4` `rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1`;
  - Kiwipete `r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1`;
  - smothered mate in 2 `5r1k/6pp/7N/3Q4/8/8/8/6K1 w - - 0 1` (`src/puzzle-corpus.ts:128`, `d5g8`);
  - mated next move `7k/8/6K1/8/8/8/8/R7 b - - 1 1` (the page's `A8` FEN; the only move `h8g8`);
  - stalemate `7k/5Q2/6K1/8/8/8/8/8 b - - 0 1` (the page's `A4` FEN);
  - back-rank mate in 1 `6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1` (`a1a8`; checked by the harness before use);
  - promotion `8/P6k/8/8/8/8/8/K7 w - - 0 1`; fool's mate `f2f3 e7e5 g2g4 d8h4`; a 20-ply Ruy Lopez line;
  - GUI clocks: 3+2 (180 000 / 2 000), 10+0.1 (10 000 / 100), bullet 1+0, 40 moves in 90 min, 1.5 s left,
    40 ms and 0 ms left, `movestogo` 1 and 2, a fractional clock, an absurd clock, and `movetime` 2 000 and 10 000;
  - clock steps: 1, 10 and 100 virtual ms per read. The window rule is the ticket's, G ≤ `time` ≤ G + 2·step
    (`bapm-amend2-ABC-167`);
  - bad input: 19 ignored lines, 11 refused positions, 27 `go` value lines, including ESC, NUL, BEL, CR, tabs,
    U+2654 and lines of 10 000 characters.

## Scenarios, expected results and pass/fail

| # | a GUI user's words | criteria | passes when |
|---|---|---|---|
| S1 | **The engine answers the handshake.** `uci`, `isready` (also with CRLF and spaces), `ucinewgame`, then a move | A1, A2, A10 | `uci` writes exactly `id name skytalix`, `id author Olger Oeselg`, `uciok`; each `isready` writes exactly `readyok`; the first `go` answers |
| S2 | **It plays a whole game on a clock.** Two sessions play each other, as cutechess-cli would drive them: 60 plies at 3+2 on step 100, and 40 plies at 10+0.1 on step 10 | A3, A3-h1, A5, A10, NFR-004 | every `go` writes exactly `info …` then `bestmove M`, with pv = M and M legal in the GUI's position; `time` sits in the D4 window for the GUI's clocks at that ply, and within 3 000 + 2·step; no side's virtual clock reaches 0; `quit` writes nothing |
| S3 | **It takes a position as FEN, or as moves with castling, en passant and promotion.** | A3, A9 | each answer is legal in the GUI's own copy of the position; the same position sent as FEN or as moves gets the same move and score; a promotion answer carries its letter |
| S4 | **It honours `go depth` / `nodes` / `mate`.** | A7, A8 | `depth 4` reports 4 where the clock alone reaches ≥ 5; `depth 1` reports 1; `nodes 20000` ≤ 21 024; `nodes 1` gives depth 1; `mate 2` gives `score mate 2` and `d5g8`; `mate 1` gives `score mate 1` and a mating move; `depth 3 mate 5` reports 3; `depth 1 mate 2` reports 1 |
| S5 | **It spends the time a GUI clock implies, and never more than 3 s.** 17 time-control lines, white and black | A5, NFR-004 | `time` in [G, G + 2·step] for G from the ADR-text oracle (`movetime` wins; the side to move's clock and increment; `movestogo`; 50 ms overhead; the 1 ms floor; the 3 000 cap) |
| S6 | **Analysis and pondering wait to be told.** `go infinite` + `stop`, `go ponder` + `ponderhit`, `isready` and junk while held, `go depth 3 infinite` | A6, A6-d1, A6-e5 | no `bestmove` until `stop`/`ponderhit`; then exactly one, equal to the pv; a second `stop`/`ponderhit` writes nothing; `isready` still answers at once |
| S7 | **A held answer is never lost when the GUI moves on.** `position`, `ucinewgame`, `quit`, a new `go`, a refused `position`, and `setoption` while held | A6-e1..e5, QE-167-j | the held `bestmove` is written first, then the command runs; `quit` returns `"quit"` after writing it; `setoption`/`isready` leave it held |
| S8 | **Bad input never crashes it, and it always answers.** | A4, A4-a1, A4-a2, A7 value rules, A9 | no exception; ignored lines write nothing; a refused `position` writes exactly one printable `info string` that echoes the input with the ESC dropped, and the next `go` writes only `bestmove 0000`; a faulty `go` value writes one `info string` first, then a normal answer with the budget the rest of the line implies; `isready` answers after every line |
| S9 | **Mate and stalemate are answered properly.** | A4, A8 | mated or stalemated side to move: `go` writes only `bestmove 0000`, and `go infinite` holds `0000` until `stop`; being mated next move: `score mate -1`, `h8g8`; mate in 1: `score mate 1` and the move mates |
| S10 | **`quit` ends the session.** | A10 | `quit` returns `"quit"` and writes nothing when nothing is held; every other line returns `"continue"` |
| S11 | **A new game starts from the start position.** | A9, A9-h1 | after `ucinewgame` (also after a refused position), and in a new session with no `position`, the answer is legal from the start |
| S12 | **The same dialogue gives the same answer.** | A3 (repeatability) | two `go`s on one position write identical lines; the 10+0.1 game replays move for move |
| S13 | **Nothing but protocol lines is ever written.** Every line from S1–S12 | A11 (M4), D3 | every line starts with `id`/`option`/`uciok`/`readyok`/`info`/`bestmove`; every line is printable; one `bestmove` per `go` over the whole run |

**`A11`'s text half** (no limb token, no banned import) and **`A12`** (fences) are not caller-visible. At entry I
read `src/uci-session.ts` in full: its eight imports are all on D2's allowed list, and it has no `process`, no
`Date.now` and no `Math.random`. The diff from the merge base `32f8fc4a` lists exactly the two named files. Both
are pinned in the lane, which was green at the tip. R-167-1 stands as accepted.

## Known limitations (said before signing, not after)

1. **No GUI, no process and no real clock.** Nothing here runs `skytalix`, reads stdin or speaks to cutechess-cli,
   En Croissant or Lichess. The harness stands in for the GUI (`…19c7115a`).
2. **No timing reading.** Every `time` is virtual. Whether a real GUI flags this engine on a real clock, and how
   late `isready`/`stop` are answered during a search (D5: up to one budget), cannot be observed until `ABC-168`.
   N8-LANE is OWED (R-167-2, accepted by the owner).
3. **No options, book or levels.** `uci` writes no `option` lines, `setoption` is ignored, and the strength is fixed
   at level 3 with no book. `OwnBook` and `Skill Level` are `ABC-171`'s.
4. **The engine does not see the game's repetitions** (ADR-0044 D6; the terminal game has the same gap). In S2's
   3+2 game, from ply 41 the two sessions shuffle `d1d4 b4b5 d4d1 b5b4`. The position after ply 40 recurs after
   plies 44 and 48, so a GUI would adjudicate a threefold-repetition draw at ply 48. This is by design for v1, not a defect (`UAT-167-b`).
5. **`ponderhit` is `stop` in v1** (D3). No `Ponder` option is offered, so a GUI should not send `go ponder`. S6
   checks only that it holds and releases.
6. **The legality oracle is the engine's own move generator.** It is perft-proven and not edited by this ticket,
   but it is not independent of the engine.
7. **No committed `uat/*.uat.spec.ts`.** There is no browser e2e lane and no process to drive. The harness is kept
   under `ref:` as an authoring aid. The suite's 1915 rows, `src/uci-session.test.ts` among them, are the
   re-runnable evidence, and they were green at the tip.
8. **Not graded:** mutants and coverage (QE's), lane cost, speed, and the playing strength of the moves.

## Rollback

Nothing ships. `ABC-167` is unmerged on `grugops/ABC-167`, and no entry point imports the session (`ABC-168` will).
To roll back, do not merge the branch, or remove the two new files. No existing file changes.

## Signoff checklist (the owner answers each with one word)

| # | question | the owner's word |
|---|---|---|
| 1 | Do S1–S13, as written above, describe what you want a UCI GUI to get from this session? | |
| 2 | Do you accept the held-`bestmove` rulings marked "owner may overrule" on the page (A6-e2, A6-e3, A6-e4: write the held move first on `position` / `ucinewgame` / `quit`), as S7 observed them? | |
| 3 | Do you accept that the binary, real stdin/stdout, a real GUI and real timing are proven on `ABC-168`, and the options, book and levels on `ABC-171`, not here? | |
| 4 | Do you accept the run's result (`…4da0ace4`): 13 of 13 scenarios PASS, 2876 of 2876 checks, with N8-LANE still OWED under R-167-2? | |
| 5 | **Overall: do you accept `ABC-167`?** (accept / reject) | |

## Exit criteria

- **Accepted** when the owner gives his word in session to question 5 (or to the one-line question in
  `…da3cca56`). The agent then transcribes that word; it is never a `human:<name>` stamp.
- **Not accepted** on a "no" or "reject" to any row. The reason goes back to the Orchestrator, who routes it.
- The board move out of `In UAT` is the Orchestrator's. This pack moves nothing.

## Where things are

| path | what |
|---|---|
| `probe/uat-harness.ts` | The harness. `node uat-harness.ts <tree root>` runs S1–S13 and prints PASS/FAIL/OBS lines. It writes nothing |
| `probe/harness-RUN-1.txt` | The recorded run at `660a0d50`. A second run was byte-identical (sha256 `8033c6ea…` both) |
| `probe/harness-RUN-0-excerpt.txt` | The first run's FAIL lines and summary: a fixture error of mine, disclosed in `…4da0ace4` |
| `probe/controls.txt` | Eight negative controls on scratch copies of the tip (C1–C8): what the harness catches and what it misses |
