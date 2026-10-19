---
id: 20261019T140000Z-qe-e2e-artifact-ref-abc171-uat-pack-f340102a
kind: artifact-ref
by: qe-e2e
task: uat-ABC-171
at: 2026-10-19T14:00:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - ABC-167
  - ABC-168
  - ABC-174
  - ADR-0044
  - ADR-0045
  - ADR-0032
  - ADR-0027
  - EPIC-007
  - NFR-004
  - NFR-008
  - R-167-1
  - R-167-2
  - R-171-1
  - QE-171-e
  - QE-171-f
  - src/uci-session.ts
  - plans/tickets/ABC-171-the-uci-session-offers-ownbook-and-skill-level.md
  - 20261019T160000Z-orchestrator-decision-owner-word-r1711-uat171-by-qe-2b7f4c88
  - 20261019T131500Z-qe-e2e-decision-abc171-recheck-verdict-pass-d60ef4d9
  - 20261019T132100Z-security-nfr-decision-abc171-pass-with-risks-9a89caf5
  - .grugops/context/uat-ABC-171/probe/
supersedes:
---

# UAT pack `ABC-171`: `OwnBook` and `Skill Level` over UCI, as a GUI would use them

This note is hand-authored and unsealed. `context-io.ts` is not on this install, and `human_admission` is `off`
(`AGENTS.md` § Test and UAT authority). So no `finding` is admissible. The note points at a throwaway harness, not a
UAT spec, so it carries no `sha`, `gate_run` or `content_hash`.

**Who wrote this pack.** QE/E2E wrote it, because the owner chose that role on 2026-10-19 (`…2b7f4c88`: *"QE runs
it, I sign (Recommended)"*). The UAT Planner and BA/PM hops of Workflow 06 were not run, by the owner's word. The
shape follows the `ABC-167` precedent (`.grugops/context/uat-ABC-167/`), with a harness in the GUI's seat of
`createUciSession` / `handleLine`. **Only the owner's own word signs this UAT.** This pack does not sign it, and
neither does a green run.

**The waiver does not apply.** `git diff --name-only main...grugops/ABC-171 | grep -v '\.test\.ts$' | grep '^src/'`
gives `src/uci-session.ts`, which is production code: +97/−15 against main.

## Scope / Risks (cited from the ticket page, authoritative)

- Scope: `createUciSession({ write, now, random, book })`. `uci` writes the `OwnBook` and `Skill Level` option lines.
  `setoption` matches both names case-insensitively and keeps the old value on a bad one, with one `info string`.
  The book comes before any search, is read once (at the first `isready` with `OwnBook` on, or at the first `go`), and
  is never touched with `OwnBook` off. The level caps the budget at `min(G, LEVELS[skill].budgetMs)`. A level with a
  blunder rate plays through `createLevel`, seeded `floor(random() · 2^32)` per `go`, and drops `depth` / `nodes` /
  `mate` with one `info string`. `ucinewgame` does not reseed.
- Risks carried in: R-167-1 (LOW, carried, Security/NFR), R-171-1 and R-167-2 (LOW, accepted by the owner: the
  N8-LANE delta is OWED), `AR-NFR004-A` (stands), and QE-171-e (INFO, routed to `ABC-168`).

## UAT goal

Decide whether what a UCI GUI gets from these two options is what `ABC-171` promises. That covers the option lines;
`setoption` with good and bad values; a book that answers the opening, is read once and then hands over to the
search; book off; a bad book; the five levels' budgets and the blunder path; `go infinite` on a book hit;
`ucinewgame` drawing no seeds; two full games; and ABC-167's behaviour, unchanged.

## What this ticket can and cannot show

`ABC-171` is **session logic only**, like `ABC-167`. The `skytalix` binary, `src/uci.ts` (which binds `readBookFile`,
`Math.random` and the book's `warn`) and real stdin/stdout are `ABC-168`'s. **No chess GUI can talk to it yet.**

Each scenario is a **UCI dialogue**: the lines a GUI would send are fed to `handleLine` one by one, and the lines
`write` receives are collected as the GUI would read them. The harness under `ref:` stands in for the GUI. In S9 it
also plays the GUI's referee and a scripted opponent.

Each session gets:
- a counted `random` (`seededRandom(k)`);
- the **real** `createBookProbe` over in-memory bytes, with a counted `read` and a recorded `warn`.

Every session runs on a **virtual clock** (`ADR-0027`, `virtualClock(step)`). A virtual millisecond is not a real
one, so **no timing reading was taken**. N8-LANE stays OWED (R-171-1, R-167-2). What only `ABC-168` / `ABC-174` can
show is listed in `…3cd487f4`. None of it is graded here.

## Entry criteria

| criterion | state |
|---|---|
| Built and QE'd | QE `PASS_WITH_GAPS` at `9ae31679` (`…9d61b7e3`). Re-check **PASS** at `5dee231c` (`…d60ef4d9`): QE-171-a..d closed by `A8` and `A13a`–`d` |
| Security/NFR | `PASS_WITH_RISKS` at `5dee231c` (`…9a89caf5`). Required fixes: none. NFR-004 MET on reading |
| Owner's word | R-171-1 accepted, and the UAT goes to QE (`…2b7f4c88`) |
| Waiver tested | production line present (`src/uci-session.ts`), so the UAT is conducted |
| Tree under test | `grugops/ABC-171` @ `5dee231c`, in a fresh worktree on `grugops/uat-ABC-171`. `src/uci-session.ts` md5 `0d63103d…` before and after every run |
| Gates at that tip | lint, typecheck and build exit 0. `npm test` exit 0: 59 files, 1962/1962, `last-run.json` `success: true`. Integrity at skip 0: `No findings.` merge-tree clean (`…be4d3860`) |

## Who and what

- **Signer:** the owner, Olger Oeselg, by his own word in session (`AGENTS.md`, 2026-08-16 ruling).
- **Conductor:** QE/E2E (agent). It runs the harness and reports the result. It never signs.
- **Oracles.**
  - Legality: the tree's perft-proven generator (`fen.ts`, `legal.ts`, `apply.ts`, `coordinate-move.ts`), which
    `ABC-171` does not edit.
  - The level table: **the brief's** (today's `LEVELS`, before `ABC-174`), compared with the tree's in S0.
  - D4's `G` and D11's cap: written from `ADR-0044`'s text.
  - D11's seed rule `floor(random() · 2^32)` per `go`: written from the text and fed to the tree's `createLevel`.
    `src/levels.ts` is not edited by this ticket, but it is not independent of the session either.
- **Test data (fixed before the first run; two fixture lines corrected after it, and one f3 block added; see `…e7b71b15`):**
  - **Books** (ABC-094 format 1, in memory):
    - `START_BOOK`, the page's: start → `e2e4`.
    - `LINE_BOOK`: start → `e2e4`; after `e2e4` → `e7e5` ×3 / `c7c5` ×1; then `g1f3`, `b8c6`, `f1b5`.
    - The **shipped** `data/opening-book/book.json` (356 526 bytes). The harness reads it and injects the bytes.
    - An empty valid book.
    - Nine bad books: `read` throws (an `Error` with a planted path, or a bare string); not UTF-8; not JSON; format 2;
      over 1 MB; a bad key; an illegal move; overflowing weights.
  - **Positions:** start; `AFTER_E4`; Kiwipete; the smothered mate in 2 (`d5g8`); `MATED_NEXT`; fool's mate. The
    transposition pair is `e2e4 e7e5 g1f3 b8c6` / `g1f3 e7e5 e2e4 b8c6`, and S0 checks that their keys are equal.
  - **Seeds:**
    - `K_ENGINE` = 1: the first level draw is 0.694, the engine path at both blunder levels.
    - `K_BLUNDER` = 2: the first level draw is 0.166, the blunder path at both.
    - k = 1..8 for the seed oracle. The book's own `random` is `seededRandom(7)`.
  - **Clocks:** steps 1, 10 and 100. GUI lines `movetime 10000`, A6's `G = 3 500`, a bare `go` (`G = 5 000`),
    black with `G = 1 402.5`, and a short clock (`G = 75`). The games are 3+2 and 10+0.1. The window rule is
    `ABC-167` `A5`'s, `B ≤ time ≤ B + 2·step`.
  - **Bad `setoption` values:**
    - `Skill Level`: 18 values, including `0`, `6`, `2.5`, `constructor`, `01`, `1.0`, `0x1`, `__proto__`, `５`,
      ESC and 5 000 characters, plus no value and no `value` keyword (20 lines).
    - `OwnBook`: 11 values, including `TRUE`, `1`, `true false` and ESC, plus the same two malformed forms (13 lines).
    - Other names: 19 lines, including `Hash`, `UCI_Elo`, `Skill Level2` and `Own Book`, and malformed lines.

## Scenarios, expected results and pass/fail

| # | a GUI user's words | criteria | passes when |
|---|---|---|---|
| S1 | **`uci` shows both options.** | A1, D3 | `uci` writes exactly the 5 lines in order. Both option lines follow the UCI grammar (check default true/false; spin min ≤ default ≤ max). `uci` reads no book. A later `uci` still shows the defaults. The advertised defaults are what a fresh session plays (level 3; book on) |
| S2 | **`setoption` takes good values, refuses bad ones, and is case-blind on names.** | A2, A13d, f1–f4 | 4 spellings × 5 levels each play at that level, read back by budget window and line shape. 4 spellings of `OwnBook` switch the book off and on. Each bad value writes exactly one printable `info string` and keeps the old value, from the default and from a changed value, in both directions for `OwnBook`. Other names and malformed lines write nothing and change nothing |
| S3 | **With the book on, games open from the book, read it once, then play on.** | A3, A5, A8 / A13b, D10 | A3's two lines exactly, also by FEN. Book first under 8 `go` forms × 5 levels, with 0 seeds drawn. A transposition, a FEN and a FEN+moves hit the entry. With bad `go` tokens on a hit, each token's `info string` comes first, then the book line (f3). The read count is 0 after `uci`, 1 after the first `isready` and stays 1, or becomes 1 at the first `go`. A book game gives 3 book answers, then 5 legal searched answers. Two sessions on the shipped book open from it, leave it, and play 30 legal plies |
| S4 | **With the book off, the engine searches and never reads it.** | A4 | over four books (a throwing one included) × 2 spellings: every `go` searches (`info depth …`), and there is no `info string book`, **0 reads** and 0 warnings over the whole session. Off after warming: no further read |
| S5 | **A bad book warns once, and the game is still legal.** | A9, D10 | over 9 bad books × 4 flows (`isready` first, no `isready`, level 1, `go infinite`): 3 `go`s each write exactly one legal `bestmove`; `handleLine` never throws; `warn` is called **once**; the text is the fixed `opening book …; playing on without it` and carries no planted byte; no written line names the book |
| S6 | **Skill Level 1–5 changes the budget and the play.** | A6, A7, A13a, A13c, D11, NFR-004 | the engine path's `time` sits in `[min(G, B_n), +2·step]` for 5 `go` forms × 5 levels, never above 5 000 + 2·step. On a blunder draw, the session's move, depth, nodes and time equal `createLevel`'s. At levels 1 and 2 × k = 1..8: two sessions write identical lines; every `bestmove` equals the D11 seed oracle (64 of 64 per level); one seed is drawn per `go`; both paths are exercised. Levels 1 and 2 drop `depth`/`nodes`/`mate`: exactly 3 lines, one `info string` naming each dropped limit, and a search on time. Levels 3–5 honour them |
| S7 | **`go infinite` on a book hit waits for `stop`.** | A10, ABC-167 A6 | `go infinite` / `go ponder` / `go movetime 100 infinite` on a hit write only `info string book`. `isready` answers while held. `stop` / `ponderhit` write `bestmove e2e4` once. `position`, `ucinewgame`, `quit` and `go` release the held answer first. Levels 1–2 hold a hit with 0 draws, and hold a level line with 1 |
| S8 | **`ucinewgame` draws no seeds.** | A8, D3, D11 | `ucinewgame` ×4 and `isready` draw 0. Each blunder-level `go` draws 1, and rate-0 levels draw 0. The `go` after `ucinewgame` plays the **second** seed's move, which differs from the first's for the chosen k. `ucinewgame` keeps both options and does not reload the book |
| S9 | **A full game at level 1 and one at level 3, against a scripted opponent.** | A3, A6, A7, M6, M7 | each game runs to an end the GUI recognises, with every engine answer legal and in shape. The engine's virtual clock never runs out. Seeds drawn are 1 per searched `go` at a blunder level and 0 otherwise. The book is read once with no warning. Each game replays move for move |
| S10 | **ABC-167 behaves as before.** | ABC-171 A12; ABC-167 A1–A11 | ABC-167's 13 UAT scenarios, re-run with only the two capabilities added and the 5-line `uci`, pass 2876/2876. The output equals ABC-167's recorded RUN-1 except in the `uci` lines and what follows from them |
| X1 | **Nothing but protocol lines is ever written.** | ABC-171 A11 (M4) | every line from S1–S9 starts with `id`/`option`/`uciok`/`readyok`/`info`/`bestmove` and is printable; one `bestmove` per `go` over the run |

**`A11`'s text half** (`book.ts` imported with `import type` only) and **`A12`** (fences) are not caller-visible.
At entry I read `src/uci-session.ts`'s nine imports. `import type { BookProbe } from "./book.ts"` is the only
`book.ts` import. There is no `process`, no `Date.now` and no `Math.random`. From the merge base `55a1e223`, the
diff lists exactly the two named files (`…be4d3860`).

## Known limitations (said before signing, not after)

1. **No GUI, no process and no real clock.** Nothing here runs `skytalix`, reads a book file, or speaks to
   cutechess-cli, En Croissant or Lichess (`…3cd487f4`).
2. **No timing reading.** Every `time` is virtual. N8-LANE is OWED (R-171-1 and R-167-2, accepted by the owner).
3. **The blunder path's virtual `time` is a clock-read count, not thinking time (`UAT-171-a`, INFO).**
   - At level 1 from the start position, a blunder move reads 103 virtual ms at step 1, 810 at step 10 and 8 100
     at step 100, against a budget of 100.
   - Each of the 20 child searches pays a fixed number of clock reads (ADR-0032 § Context). The session reports
     exactly what `createLevel` measures (S6).
   - On a real clock, `secnfr-ABC-087` read blunder moves at a maximum of 498–589 ms.
   - What a GUI's clock sees is `ABC-168`'s to observe.
4. **Varied openings are not observable here.** The book picks by its injected `random`. `uci.ts` binds
   `Math.random` (`ABC-168`), but here every session uses one fixed seed. So the same book entry gives the same reply
   each time (S3: `e7e5` 8 of 8 against `e7e5` ×3 / `c7c5` ×1). The weighting is `ABC-094`'s, not graded here.
5. **The level table is today's.** ADR-0045's re-cut table and `default 5` arrive with `ABC-174`. S0 pins today's
   table, so this harness will flag that change.
6. **The bad-book warning does not reach the GUI here.** The session writes nothing for it, and `warn` is a probe
   argument that `uci.ts` binds (QE-171-e, routed to `ABC-168`). S5 sees the `warn` calls only.
7. **The legality and level oracles are the tree's own modules.** `levels.ts` and the move generator are not edited
   by `ABC-171`, but they are not independent of the engine.
8. **No committed `uat/*.uat.spec.ts`.** There is no browser e2e lane and no process to drive. The harness is kept
   under `ref:` as an authoring aid. The suite's 1962 rows, the 118 in `src/uci-session.test.ts` among them, are
   the re-runnable evidence, and they were green at the tip.
9. **Not graded:** mutants and coverage (QE's), lane cost, speed, playing strength and Elo (no level claims one).

## Rollback

Nothing ships. `ABC-171` is unmerged on `grugops/ABC-171`, and no entry point imports the session (`ABC-168` will).
To roll back, do not merge the branch, or revert its two files to main's.

## Signoff checklist (the owner answers each with one word)

| # | question | the owner's word |
|---|---|---|
| 1 | Do S1–S10, as written above, describe what you want a UCI GUI to get from `OwnBook` and `Skill Level`? | |
| 2 | Do you accept the readings ruled on the page and observed in S2–S6? These are: `OwnBook` values case-sensitive (`TRUE` refused); `Skill Level` `01` / `1.0` / `0x1` refused; on a book hit, any bad-token `info string` comes before `info string book`; levels 1–2 drop `depth`/`nodes`/`mate` with one line | |
| 3 | Do you accept that the binary, a real book file, a real GUI, real time, varied openings (`Math.random`) and the bad-book warning reaching the GUI are proven on `ABC-168`, and the re-cut levels with `default 5` on `ABC-174`, not here? | |
| 4 | Do you accept the run's result (`…e7b71b15`, `…f59a723d`)? S0–S9 and X1 pass 4061 of 4061 checks. S10 (ABC-167 again) passes 2876 of 2876. N8-LANE is still OWED under R-171-1 | |
| 5 | **Overall: do you accept `ABC-171`?** (accept / reject) | |

## Exit criteria

- **Accepted** when the owner gives his word in session to question 5 (or to the one-line question in
  `…b2794b17`). The agent then transcribes that word; it is never a `human:<name>` stamp.
- **Not accepted** on a "no" or "reject" to any row. The reason goes back to the Orchestrator, who routes it.
- The board move out of `In UAT` is the Orchestrator's. This pack moves nothing.

## Where things are

| path | what |
|---|---|
| `probe/uat-harness.ts` | The harness. `node uat-harness.ts <tree root>` runs S0–S9 and X1, and prints PASS/FAIL/OBS lines. It writes nothing |
| `probe/harness-RUN-1.txt` | The recorded run at `5dee231c`. RUN-2 was byte-identical (sha256 `f704c86b…` both) |
| `probe/harness-RUN-0-excerpt.txt` | The first run's FAIL lines and summary: two errors of mine, disclosed in `…e7b71b15` |
| `probe/abc167-regression-harness.ts` | S10: ABC-167's harness with three marked edits (`ABC-171 S10`) |
| `probe/abc167-regression-RUN-1.txt` | S10's recorded run. A second run was byte-identical (sha256 `a747c0c1…` both) |
| `probe/abc167-regression-vs-uat167-RUN-1.diff` | `diff` against `uat-ABC-167/probe/harness-RUN-1.txt`: 9 lines each way: 7 `uci` lines, the S1 OBS line, and S13's line count (648 → 666, the 18 option lines) |
| `probe/controls.txt` | 13 negative controls on scratch copies of the tip (C1–C13): what the harness catches and what it misses |
