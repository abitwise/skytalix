# `AGENTS.md` § Commands — verification receipts

_Created 2026-09-26 by the AGENTS.md Scribe (task `scribe-abc109-restructure`, `ABC-109` `A1`–`A4`/
`A6`–`A8`)._ `AGENTS.md` was approaching the inherited 32,768-byte silent-truncation cap (`ABC-109`).
This file is the extraction target the ticket named as available raw material: the long
`<!-- RUN … -->` provenance comments that sat inline after each command slot in `AGENTS.md` §
Commands, moved here **verbatim in substance** (comment delimiters dropped, wording unchanged) so no
directive, trap or measurement is lost — only relocated. Since `ABC-164` (2026-10-21) `AGENTS.md` keeps each
command line except the three listed in § "On-demand commands" below, carries a fact only in the comments of the
`Dev / run` and `npm test` slots, and points here; every other command's comment is in its section below.

Moved from `AGENTS.md` § Mission by `ABC-164` (2026-10-21), word for word: the sentence that followed "**Byte budget: this file targets ≤ 24,576 B.**"

The 32,768-byte reader cap it guards against is
**inherited** — sourced from the AGENTS.md Scribe's 2026-08-19 observation, not measured in this
repository — and its overflow is silent and eats the file from the tail (`ABC-109`).

**Reader:** the `AGENTS.md` Scribe, before adding or amending any Commands-section line (so a new
receipt is appended in the right place and stale receipts are visible together); any role that needs
the full history behind a command's exit code beyond the little `AGENTS.md` carries inline (see the preamble).
Not read on every hop — `AGENTS.md` § Commands is the command index every role reads (every command line but
the three in § "On-demand commands"); this file holds the comments and receipts behind it. Since `ABC-164` it is also read by QE (lane triggers, the lane table and
the traps behind them, from § "On-demand commands") and by the Software Engineer (a lane's section, before
changing the file that lane guards).

_Reconciled 2026-10-10 by the AGENTS.md Scribe (task `scribe-command-log-2026-10-10`) against `git log
-- AGENTS.md` since this file's last touch (`ea68a2d8`, 2026-09-26): four commits, each with its entry
below and a row in § "Reconciliation ledger, 2026-10-10" at the end._

_Headroom pass 2026-10-10 by the AGENTS.md Scribe (task `scribe-headroom-2026-10-10`), after `ABC-087`
merged (`25f6d92d`): stale counts refreshed at the wave tip `5d55cc48`, the Levels deep lane given its
entry, two prose cuts to `AGENTS.md`. See § "Headroom pass, 2026-10-10" at the end._

## On-demand commands

Commands and lane triggers that one role or one trigger needs, so `AGENTS.md` does not make every session read them. Moved from
`AGENTS.md` by `ABC-164` (2026-10-21); the command lines are word for word.

- Perft harness (move-gen correctness + nodes/sec, ABC-006): `npm run perft`
- Spike benchmark (throwaway, ABC-008): `npm run spike:perft [depth]`
- Regenerate the opening book (ABC-093): `node tools/opening-book/compile.ts <dir>`

The opening-book command's RUN comment is in § "Regenerate the opening book" below. The `PERFT_DEEP` line stays in `AGENTS.md`
(`ABC-173` `A3` parses it there). Every other lane keeps its command line in `AGENTS.md` § Test; its comment is in the heading
this table names.

| Lane, as `AGENTS.md` § Test spells it | Who runs it, after which change | Heading in this file holding its text |
|---|---|---|
| Perft deep counts (opt-in slow suite) | — | — |
| Search deep lane (opt-in, ABC-077) | Run at QE and after any src/search.ts change. | § "Search deep lane" |
| Engine deep lane (opt-in, ABC-078) | Run after any src/engine.ts or src/virtual-clock.ts change. | § "Engine deep lane" |
| Levels deep lane (ABC-087, `src/levels.test.ts`) | Run after any src/levels.ts, src/engine.ts or src/virtual-clock.ts change. | § "Levels deep lane" |
| Input-seam deep lane (opt-in, ABC-037) | Run after any src/line-input.ts change. | § "Input-seam deep lane" |
| Transposition deep lanes (ABC-081, `src/transposition.test.ts`), the `SEARCH_DEEP=1` line | — | § "Transposition deep lanes" |
| Transposition deep lanes (ABC-081, `src/transposition.test.ts`), the `ENGINE_DEEP=1` line | — | § "Transposition deep lanes" |
| Zobrist deep lane (ABC-075) | — | § "Zobrist deep lane" |
| Quiescence deep lane (ABC-079) | — | § "Quiescence deep lane" |
| Puzzle suite, strength gate (opt-in, ABC-084) | TRIGGER (owner, option B, 2026-10-09): QE runs it during review when the change touches engine code (`src/engine.ts`, `src/search*.ts`, `src/evaluate*.ts`, `src/quiescence.ts`, `src/transposition.ts`, move ordering). | § "Puzzle-suite strength gate" |
| PVS/LMR deep lane (ABC-121, `src/search.pvs-lmr.test.ts`) | Run after any PVS/LMR change to src/search.ts or src/engine.ts. | § "PVS/LMR deep lane" |
| Real-engine CLI lane (opt-in, ABC-119) | Run at QE and after any src/cli.ts or src/engine.ts change. | § "Real-engine CLI lane" |
| Self-play ladder lane (opt-in, ABC-085, ADR-0038) | — | § "Self-play ladder lane" |
| Coverage | — | § "Coverage — `npx vitest run --coverage`" |
| Coverage (`src/` only — the other denominator; neither is agreed) | — | § "Coverage (`src/` only) — `npx vitest run --coverage --coverage.include='src/**'`" |

How to read it: column 2 is copied from the lane's moved comment, or `—` when that comment held no trigger. Column 3 is the
heading in this file with the lane's text, or `—` when it has none.

## Dev / run — `npm run chess`

Verified 2026-08-14 at `ABC-042`: prints the start position (23 rows) on stdout and exits 0.
Optional arguments, the complete set: `--colour white|black|random`, `--ascii`, `--unicode`.

IT PLAYS A GAME as of `ABC-043` (2026-08-19) — the line above described a board-printer and is kept
for the row count and the option set, which are unchanged. It prints the board, prompts with `> `,
reads one line per turn and answers with the merged engine, which occupies UP TO 3 SECONDS PER MOVE
(`DEFAULT_BUDGET_MS`): `--colour black` opens with the engine, so the first board sits there thinking
before the prompt appears, and that is the product working. RUN 2026-08-19 at the `ABC-043` branch
tip: `node src/cli.ts` on a closed stdin prints one board, the prompt and `input ended`, and exits 0
(real 0.07 s); `--colour black` on a closed stdin prints two boards and exits 0 (real 3.09 s, one
engine ply). EXIT CODES: 0 when the session ran, 1 for a refused command line, 70 for an internal
error — a bug that ended the session, which is never a chess result.

Pass an option AFTER `--`: `npm run chess -- --colour black` — RUN 2026-08-15 at `4e9ed1d`, exit 0,
black-bottom board. The separator is load-bearing; do not tidy this example away. Without it npm
keeps the flag: `npm run chess --ascii` (RUN 2026-08-15 at `4e9ed1d`, npm 11.7.0) warns `Unknown cli
config "--ascii"` on stderr, runs `node src/cli.ts` with NO arguments, prints the DEFAULT board and
exits 0 — the option is silently discarded and stdout looks like success.

WRITING RULES for this slot (`ABC-069`, commit `6117a2a4`, 2026-10-10; comment-only, `AGENTS.md`
23,464 -> 23,879 B, collected option set unchanged at three tokens, 0 files under `src/`, guard not
touched). `ABC-065`'s block in `src/cli.test.ts` reads the slot's RAW text, so it binds how the slot
is written as well as what it says, and until `ABC-069` neither coupling was written where a Scribe
would see it. (1) Keep the invocation inside backticks: the guard strips the fence with
`.split("`")[0]`, so a separator example written without backticks runs past the invocation and eats
the prose after it (QE's `N15`, red at `A1`). (2) Name an option in the slot only if the program
accepts it, even to say it does not: the collector cannot tell "documented as available" from "named
as unavailable", so "There is no `--help`." reds `A3` (QE's `N16`); write that sentence elsewhere in
`AGENTS.md`. The same block requires exactly ONE `- Dev / run:` slot (`ABC-071`, counted, so a
duplicate reds wherever it sits) and a comment that closes before the next top-level list item
(`ABC-067`). The guard was NOT loosened — QE's ruling at `ABC-065` (ticket `ABC-069`'s fence) was "the cost of
the coupling is a diagnosable false red once; the cost of relaxing it is a silent pass forever", and
`ABC-069` documents the cost instead of removing it. Since `ABC-164` the slot's own comment in
`AGENTS.md` carries only a pointer here; the rules are in the "WRITING RULES" paragraph below, and this entry is their receipt.

Moved from `AGENTS.md` § Commands by `ABC-164` (2026-10-21), word for word, comment delimiters dropped:

WRITING RULES for this slot, enforced by
  `ABC-065`'s block in `src/cli.test.ts`: (1) keep the invocation inside backticks - the guard
  reads to the first backtick after it; (2) name an option here only if the program accepts it,
  even to say it does not - write that sentence elsewhere in `AGENTS.md`. The same block requires
  exactly one such slot (`ABC-071`) and a comment that closes inside it (`ABC-067`).

## Regenerate the opening book (`ABC-093`) — `node tools/opening-book/compile.ts <dir>`

RUN 2026-10-10, `scribe-book-regen-2026-10-10`, wave tip `39d87491`. The five source files were fetched
from the raw URLs in `data/opening-book/ATTRIBUTION.md` at the pinned commit `a6189a30` into a private
scratchpad directory outside the repository; their sha256 all match the table there. Command:
`node tools/opening-book/compile.ts <that directory>` run from the worktree root. Exit 0, 0.4 s wall.
`cmp` of the result against `git show HEAD:data/opening-book/book.json`: **exit 0**; 356,526 B, sha256
`3802f52f3ced9d6911875c778c42246854893afbc4bcdae18b5b01454d4bb41d`. Run twice, same bytes.

TRAPS, read from `tools/opening-book/compile.ts` (lines 139-146) and run:
- `<dir>` is the SOURCE directory, not an output directory. The output path is fixed (resolved from
  `import.meta.url` to `data/opening-book/book.json`): the compiler REWRITES THE COMMITTED FILE IN
  PLACE. The brief's "run into a scratch dir and `cmp`" cannot be done by argument; the check is
  `git diff --stat -- data/opening-book/book.json` (empty) or `cmp` against `git show HEAD:...`.
- No argument: prints the usage line, exit 1, writes nothing.
- The compiler pins `SOURCE_COMMIT` in its own source; it does not re-check the five sha256 values at
  compile time (`QE-093-b`, LOW). A different upstream commit in `<dir>` compiles without complaint.
  Moving to a newer commit means editing `SOURCE_COMMIT` and `ATTRIBUTION.md` together.
- Source files are not checked in. Since `ABC-164` `AGENTS.md` carries neither the command line nor this comment, only a
  pointer to § "On-demand commands" (where the line is); the URLs and hashes stay in
  `ATTRIBUTION.md` (single source, not restated).

UPDATE 2026-10-12 (`ABC-145`, `scribe-lines-2026-10-12`): the third TRAP above ("it does not re-check the five
sha256 values at compile time", `QE-093-b`) is overtaken; the words stay, as dated. The compiler now carries
`SOURCE_SHA256` and refuses a source file whose sha256 differs, naming the file and both hashes, exit 1,
writing nothing. The no-argument run is unchanged: usage line, exit 1 (re-run this hop, writes nothing).
Receipt: QE's `A4` RUN, `qe-ABC-145` note `…0d24876c`, 2026-10-12 (cited, not re-run here; it needs the five
sources fetched over the network): five files fetched from the raw URLs at `a6189a30…`, every sha256 equal
the pins, `node tools/opening-book/compile.ts <dir>` exit 0, `cmp` 0 against `git show main:data/opening-book/book.json`.
Negative runs on copies, each followed by `cmp` 0 on `book.json`: `x` appended to `b.tsv`, exit 1, `Error:
b.tsv: sha256 is 1a104c25…e951, expected 1d5ed134…f623`; one byte flipped in place in `c.tsv`, exit 1, naming
`c.tsv` and both hashes; `e.tsv` missing, exit 1 (`ENOENT`); an extra `f.tsv`, exit 0, ignored (only the five
`SOURCE_FILES` are read). Exit 1 on a refusal is Node's status for an uncaught `throw`, not a deliberate code
(`QE-145-e`: the base compiler also exits 1 on the appended-byte copy, so only the hash text tells the two apart).

Moved from `AGENTS.md` § Commands by `ABC-164` (2026-10-21), word for word, comment delimiters dropped:

RUN 2026-10-10:
  exit 0, 0.4 s; rewrites `data/opening-book/book.json` IN PLACE, `cmp` 0 against the committed file.
  `<dir>` = the five source files `a.tsv`..`e.tsv` fetched OUTSIDE the repo at the pinned CC0 commit
  (URLs, sha256: `data/opening-book/ATTRIBUTION.md`). No `<dir>`: usage, exit 1. Wrong sha256: refused, exit 1, nothing written (ABC-145).

## Test (all) — `npm test`

`node tools/grugops/run-bounded.js 60000 vitest run` (`ABC-122`). RUN 2026-09-25: exit 0, 47 files,
1446 tests, 5.45 s. A hung lane exits 124 within the 60 s bound — stop it with Ctrl-C/SIGTERM, never
SIGKILL (owner-accepted R1: SIGKILL/SIGHUP can orphan a hung vitest). `*_DEEP` lanes run via `npx
vitest run` directly, never through `npm test` (`ENGINE_DEEP` alone is ~99 s, over the bound).
Wrapper's own proof: `node tools/grugops/run-bounded.proof.js` (RUN 2026-09-25: exit 0, all rows
held).

RE-MEASURED, twice since. (1) 2026-10-09, `ABC-084` `A8` (commit `5a15fb4f`, Scribe branch
`grugops/scribe-abc084-lane` @ `e426e91` base): exit 0, 50 files, 1539 tests, 6.66 s — the figure
`AGENTS.md` carries today. (2) 2026-10-10, this hop, wave tip `9128e7a3`, load1 8.2 at start: exit 0,
**51 files, 1584 tests, 5.52 s**. The count is a moving figure: 47/1446 (09-25) -> 50/1539 (10-09) ->
51/1584 (10-10); `ABC-119`'s own Scribe hop read 51/1541 on its branch, before the `ABC-127` merge
added its rows. `AGENTS.md` still reads 50/1539 and is one lane-count stale; the refresh is owed to the next
Scribe edit of `AGENTS.md` (this hop may not touch it — `ABC-087` is in UAT with its own edit). Not a
gate on the count: only the exit code and 0 failed are.

RE-MEASURED once more, 2026-10-10, `scribe-headroom-2026-10-10`, wave tip `5d55cc48`, load1 ~11 at
start: exit 0, **52 files, 1608 tests, 7.84 s**. `ABC-087`'s merge (`25f6d92d`) had already refreshed
`AGENTS.md` to 52/1603 (its own branch reading, 5.9 s); the five-test difference is test rows from
other tickets merged into the wave since (`ABC-133`, `ABC-135`, `ABC-136` touched tests; not attributed row by row). `AGENTS.md` now reads 52/1608, 7.8 s (a loaded
reading; the quiet ones are 5.5-6.7 s). Moving figure: 47/1446 -> 50/1539 -> 51/1584 -> 52/1603 -> 52/1608.
`ABC-131`'s own branch will move it again when it merges (not applied: unmerged).

RE-MEASURED once more, 2026-10-10T18:40Z, `scribe-receipts-2026-10-10`, wave tip `a9bfd27c` (`ABC-131`
merged as `231d1288`), load1 ~6: exit 0, **52 files, 1663 tests, 6.49 s**. `AGENTS.md` now reads
52/1663, 6.5 s. `ABC-131` itself added +0 files and +0 rows (its page, `A7`: 52/1608 at base and tip);
the +55 over the last reading is test rows from other tickets merged since (not attributed row by
row). Moving figure: 47/1446 -> 50/1539 -> 51/1584 -> 52/1603 -> 52/1608 -> 52/1663.

RE-MEASURED once more, 2026-10-10T19:05Z, `scribe-book-regen-2026-10-10`, wave tip `39d87491` (`ABC-093`
merged as `ac83c3fd`): exit 0, **53 files, 1680 tests, 8.09 s** (a loaded reading). `AGENTS.md` now reads
53/1680, 8.1 s. The +1 file is `tools/opening-book/book.test.ts`; the +17 tests over 1663 are its 17
(13 engineer + 4 QE). Moving figure: ... -> 52/1663 -> 53/1680.

RE-MEASURED once more, 2026-10-12, `scribe-lines-2026-10-12`, `main` `d8794608` (the `ABC-145` / `ABC-148` /
`ABC-117` / `ABC-116` merges in): exit 0, **56 files, 1743 tests**. Counts only; no wall time was taken (three
hops shared the host). `AGENTS.md` now reads 56/1743 and carries no time figure; the last quiet time, 6.15 s
`real` / 5.73 s `Duration`, is in the `ABC-152` pass below (taken at 1741 tests). The +2 over 1741 is
`ABC-145`'s two tests in `tools/opening-book/book.test.ts` (QE: base 56/1741, head 56/1743). `ABC-148`,
`ABC-117` and `ABC-116` added no tests. Moving figure: ... -> 53/1680 -> 56/1741 -> 56/1743.

## Vitest worker cap and module runner

The cap itself (`test.maxWorkers: 2`, never raise it, env may only lower it) stays in `AGENTS.md` § Test. The rest of that
bullet, moved from `AGENTS.md` § Test by `ABC-164` (2026-10-21), word for word, starting at the parenthesis that followed
"`VITEST_MAX_WORKERS` 1..2":

(`VITEST_MAX_THREADS` is read by
  nothing on 4.x). Runner off (ABC-152): `test.experimental.viteModuleRunner: false`, pinned.
  `RISK-ABC152-NEGWORKERS`: a negative `VITEST_MAX_WORKERS` makes `npm test` exit 0 having run nothing
  (result file: `success` false, `testResults` 0).

The `ABC-152` pass at the end of this file holds the receipts for the runner and the risk.

## Search deep lane (`ABC-077`) — `SEARCH_DEEP=1 npx vitest run src/search.test.ts`

RUN 2026-08-17 at the `ABC-077` branch tip: exit 0, 41 passed (28 in the default lane), 23.0 s.
Unset, the deep cases are NOT DEFINED rather than skipped, so the gate's skip count stays 0 — the
same shape as `PERFT_DEEP`. It holds the expensive REPETITIONS of A1–A7 (the depth-3 sweep on five of
the six perft positions, A2's own kiwipete-depth-3 case, the 204-position broad corpus, and the
depth-7 mate-in-2-vs-mate-in-4 case); every criterion is also answered in the default lane. Run it at
the QE hop and after any change to `src/search.ts`.

Moved from `AGENTS.md` § Commands by `ABC-164` (2026-10-21), word for word, comment delimiters dropped:

Unset: NOT DEFINED, not skipped (gate skip-count stays 0). Run at
  QE and after any src/search.ts change.

## Engine deep lane (`ABC-078`) — `ENGINE_DEEP=1 npx vitest run src/engine.test.ts`

RUN 2026-08-18 at the `ABC-078` branch tip: exit 0, 23 passed (17 in the default lane), 98.7 s.
Unset, NOT DEFINED rather than skipped, same shape as `PERFT_DEEP` and `SEARCH_DEEP`. It holds every
WALL-CLOCK case, which is why it is opt-in: `plans/nfr-catalog.md`'s standing rule keeps wall-clock
assertions out of the default lane, and the default lane runs entirely on an INJECTED clock. It
carries A1's 30-position run at the 3 s budget (90.4 s of the 98.7), `NFR-005`'s depth-in-budget
measurement, and the real-clock repetitions of A2, A3, A5 and A7. Run it after any change to
`src/engine.ts`.

REFRESHED 2026-10-09 (`ABC-084` `A8`, `AGENTS.md` commit `5a15fb4f`): the "98.7 s" above went stale
when `ABC-086` shipped the virtual clock (`1ae52841`) and added 300-run virtual-clock cases to the
lane. Exit 0, **45 passed (32 default), 318.6 s wall** at load1 10.0 -> 7.6 (QE and Security/NFR were
running tests on the machine at the same time); `ABC-086`'s QE receipts at load1 ~7-8 read **291.9 s**
(user 284.3 s, load1 6.8 -> 8.1) and 291.4 s. The lane is about FIVE MINUTES, not ~100 s, and the
`AGENTS.md` line records both the loaded and the quiet reading. The trigger gained
`src/virtual-clock.ts`: run the lane after any change to it as well as to `src/engine.ts`.

RE-MEASURED 2026-10-10, this hop, wave tip `9128e7a3`, worktree alone on the lane, load1 13.1 at
start -> 4.8 at end: exit 0, **46 passed (33 default), 291.55 s** vitest duration (292.0 s real, user
285.3 s). The count moved by ONE since the 2026-10-09 line: `ABC-125` (`6a25164c`, "two live clocks at
different steps, interleaved") added a row to `src/engine.test.ts`. `AGENTS.md` still says "45
passed (32 default)" — stale by one; owed to the next Scribe edit of `AGENTS.md`. COUNT YOUR RUN: 46
is the whole lane now. The wall figure is load-dependent and is not a gate.

RE-MEASURED 2026-10-10 (`scribe-headroom-2026-10-10`, wave tip `5d55cc48`, load1 12.7 at start -> 11.6
at end, i.e. a LOADED machine): exit 0, **46 passed (33 default), 310.93 s**. That sits inside the
292-319 s range `AGENTS.md` carries, so the time stays; the count correction (45 -> 46 passed, 32 -> 33
default) that was owed above is now made in `AGENTS.md`, and its RUN date moves to 2026-10-10.

Moved from `AGENTS.md` § Commands by `ABC-164` (2026-10-21), word for word, comment delimiters dropped:

Wall-clock cases + 300-run
  virtual-clock cases; the default lane uses an injected clock. Run after any src/engine.ts or
  src/virtual-clock.ts change.

## Levels deep lane (`ABC-087`, `src/levels.test.ts`) — `ENGINE_DEEP=1 npx vitest run src/levels.test.ts`

`ABC-087` (difficulty levels, `src/levels.ts`) landed this line in `AGENTS.md` at `25f6d92d`; this is
its entry (the Levels section did not exist in this file before). Opt-in: unset, the deep cases are
NOT DEFINED, not skipped (same shape as `PERFT_DEEP`/`SEARCH_DEEP`), so the gate's skip count stays 0.
What the 28 hold beyond the 22 default: `A4`'s evidence over two corpora (the ENDGAMES set, 204 moves,
and the perft + puzzles set, 246 moves: easiest level never plays the worst move, plays the strict
second-best, blunder rate within +/-5 pp of 40 %), `A2` on a virtual clock, `A3` (the easiest level
solves strictly fewer puzzles than the default, counted on one run of the suite in the tree) and
`A5` (the hardest level, 30 positions, every move <= 5 s on the REAL clock — 135 s of the lane, the
reason it is opt-in).

Receipts. (1) `ABC-087` Engineer, 2026-10-10, at `1160b063`: exit 0, 28 passed (22 default), 202.0 s at
load1 8.86 -> 8.35; `A4` 39.7 % / 39.4 %, `A5` 30/30 max 4,521 ms, `A3` 35 vs 58 of 62. (2)
`scribe-headroom-2026-10-10`, 2026-10-10, wave tip `5d55cc48` (no byte of `src/levels*.ts`,
`src/engine.ts`, `src/virtual-clock.ts` differs from `1160b063`), load1 10.2 -> 9.3: exit 0, **28
passed (22 default), 224.95 s**; `A4` 39.7 % (80 blunders + 1 no-candidate / 204) and 39.4 % (97 / 246),
`A5` 30/30 max 4,541 ms, 135.4 s, `A3` **36** vs 58 of 62. So `AGENTS.md` says "202-225 s" and "A3
(35-36 vs 58 of 62)": the time and the easiest level's puzzle count are both load- and wall-clock-
dependent, and are not gates; the gate is the exit code and 28 passed. COUNT YOUR RUN: 28 is the whole
lane. Trigger: run it after any change to `src/levels.ts`, `src/engine.ts` or `src/virtual-clock.ts`.

APPLIED 2026-10-10, `scribe-receipts-2026-10-10` (the former OWED paragraph): `ABC-131` merged
(`231d1288`, UAT accepted by the owner) and changed the figures this entry quoted. `AGENTS.md` now says
`A4` perft + puzzles **242 moves** (was 246) and `A3` **35 vs 54 of 58** (was 35-36 vs 58 of 62), per
`QE-131-c`. Source, not re-run (the lane is ~3.5 min and `src/levels*.ts`, `src/engine.ts`,
`src/virtual-clock.ts` are untouched by `ABC-131`): QE's levels run on `96f3168d`
(`.grugops/context/qe-ABC-131/notes/raw-qe-levels-tip.txt`, 2026-10-10T14:42Z, load1 6.2-7.9): exit 0,
**28 passed**, 213.26 s real; `A4` 39.7 % of 204 and 39.7 % (96 + 0 / 242); `A5` 30/30, max 4,780 ms;
`A3` easiest **35/58**, default **54/58**. 213 s sits inside "202-225 s", so that range stands. The old
"35-36" collapses to "35": the "36" was a 62-row reading, and `A3` is wall-clock-dependent either way.

Moved from `AGENTS.md` § Commands by `ABC-164` (2026-10-21), word for word, comment delimiters dropped:

Holds A4's evidence (ENDGAMES 204 + perft/puzzles 242 moves), A2 on a virtual clock, A3 (31
  vs 54 of 58). Run after any src/levels.ts, src/engine.ts or src/virtual-clock.ts change.

## Input-seam deep lane (`ABC-037`) — `INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts`

RUN 2026-08-19 at `298bb95`: exit 0, 33 passed, 0.28 s. RE-MEASURED 2026-09-26 in this worktree: exit
0, 34 passed, 0.34 s — a test was added to the file between those two runs. COUNT YOUR RUN: 34 is now
the whole lane; 33 means `NODE_OPTIONS` was dropped and the external-memory retention guard did not
run — it exits 0 either way, so the count is the only signal. 30 is the default lane (re-measured
2026-09-26; the 2026-08-19 run recorded 29). Unset, NOT DEFINED rather than skipped, same shape as
`PERFT_DEEP`, `SEARCH_DEEP` and `ENGINE_DEEP`. It holds the BREADTH plus that
guard: a 16 MiB unterminated-flood survival row, the chunk-boundary permutation sweep, the
10,000-character totality row. Every ACCEPTANCE criterion is answered in the default lane. It is
opt-in because `ABC-108` has the default lane at or over `NFR-008`'s 13 s CPU clause, so this ticket
did not claim `N8-LANE`'s 650 ms. Run it after any change to `src/line-input.ts` — QE 2026-08-19
measured two mutants that die in this lane and in nothing else.

TRAP, and read all of it: `heapUsed` must never be how a memory bound gets asserted here. A build
retaining a 16,777,216-character line reports 0.01 MiB of `heapUsed` growth, so a `heapUsed` row is
green whichever build it runs against; one was written, watched NOT fail, and DELETED rather than
shipped green — do not put it back. But the bound IS testable, and `heapUsed` is not blind to
cons-strings: it accounts a FLATTENED 16 MiB string in full. An unflattened rope does read ~0.02 MiB,
so that account was HALF TRUE, and half-true aimed at the wrong field is worse than wrong: it ends
the search. The retained leaves are EXTERNAL string data, and `process.memoryUsage().external` after
a `gc()` separates the builds 0.00 vs 32.00 MiB (33,554,472 B, reproduced to the byte from a second
tree) — which is why `--expose-gc` is in the command. Numbers and the guard itself are in
`.grugops/context/quality-gate-ABC-037-qe-2026-08-19/notes/` and its `repair-ABC-037-2026-08-19/`
sibling, not restated here. The rule this cost us: never ship a memory guard you have not watched go
RED.

Moved from `AGENTS.md` § Commands by `ABC-164` (2026-10-21), word for word, comment delimiters dropped:

34 is the whole lane; 33 = NODE_OPTIONS dropped,
  retention guard did not run (exits 0 either way). TRAP: never assert this guard on heapUsed —
  blind to an unflattened rope (0.00 vs 32.00 MiB via process.memoryUsage().external after gc(),
  which is NOT blind). Run after any src/line-input.ts change.

## Transposition deep lanes (`ABC-081`, `src/transposition.test.ts`)

`SEARCH_DEEP=1 npx vitest run src/transposition.test.ts` — RUN 2026-09-25 at `54565e8`: exit 0, 40
passed (25 default), 47.7 s. Holds A1/A2/A3/A4/A5's depth-4/5 hit-rate, node-savings and mate-reuse
pins.

`ENGINE_DEEP=1 npx vitest run src/transposition.test.ts` — RUN 2026-09-25 at `54565e8`: exit 0, 26
passed (25 default), 4.8 s. Holds A7's 1 s vs 3 s `heapUsed`/`arrayBuffers` growth reading. Same two
vars as `src/search.test.ts` / `src/engine.test.ts` above, applied to this file; unset, NOT DEFINED
rather than skipped, same shape as `PERFT_DEEP`.

## Zobrist deep lane (`ABC-075`) — `ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts`

RUN 2026-09-25 at `54565e8`: exit 0, 33 passed (32 default), 37.0 s. Unset, NOT DEFINED rather than
skipped, same shape as `PERFT_DEEP`. Holds A1/A2's `zobristKeyAfterMove`-vs-full-scan-oracle walk
(11,024,485 nodes, 0 mismatches, 0 drift) within 4 plies of every perft position.

## Quiescence deep lane (`ABC-079`) — `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts`

RUN 2026-09-25 at `54565e8`: exit 0, 37 passed (29 default), 1.8 s. Same var as
`src/search.test.ts` / `src/transposition.test.ts` above, applied to this file. Holds A3's
200+-position corpus sweep under the `QUIESCENCE_MAX_PLY` cap and A5's depth-2/3 node-count-multiplier
pins (kiwipete, position-6).

## PVS/LMR deep lane (`ABC-121`, `src/search.pvs-lmr.test.ts`) — `SEARCH_DEEP=1 npx vitest run src/search.pvs-lmr.test.ts`

RUN 2026-09-26 (default lane, this worktree, HEAD `652ed49`): exit 0, 20 passed, 0.6 s. Deep lane
NOT re-run here — QE's UAT run (`SEARCH_DEEP=1 npx vitest run src/search.pvs-lmr.test.ts`, 2026-09-26,
worktree `.claude/worktrees/ABC-121-pvs-lmr`, HEAD `6570343`) took 926.18 s wall under load, over the
10-minute bound this role works under; its receipt is cited instead:
`.grugops/context/uat-run-ABC-121/notes/20260926T220000Z-qe-e2e-observation-gate-and-a1-a5-deep-lane-reproduced-77854a65.md`
— exit 0, 29/29 passed (20 default), every figure (`A1` mate floor, `A1` `search()`/`chooseMove`
depth-5 corpus, `A2` node-count companions, `A5` kiwipete/position-6 node-savings) reproduced to the
exact number against the build's and QE's own earlier runs. Same var as `src/search.test.ts` /
`src/transposition.test.ts` / `src/quiescence.test.ts` above; unset, NOT DEFINED rather than skipped.
Only `src/search.pvs-lmr.test.ts` moved rows under `ABC-121` — `src/search.test.ts`,
`src/quiescence.test.ts` and `src/transposition.test.ts` were NOT touched by this ticket's diff (the
software-engineer's `…9bdce84b` decision moved two of four proposed rows into this file's
`SEARCH_DEEP` gate and kept two default; the ledger proof is `…17a0830d`), so their deep lanes above
are unchanged and were not re-run for this entry.

Moved from `AGENTS.md` § Commands by `ABC-164` (2026-10-21), word for word, comment delimiters dropped:

Run after any PVS/LMR
  change to src/search.ts or src/engine.ts.

## Puzzle-suite strength gate (`ABC-084`, `ABC-127`) — `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts`

Added to `AGENTS.md` by `5a15fb4f` (2026-10-09, `ABC-084` `A8`); its receipt widened by `f063ebce`
(2026-10-10, `ABC-127` `A9`, merged into the wave by `d45a0261` on the owner's word, UAT accepted
2026-10-10). Unset, NOT DEFINED rather than skipped, same shape as the other `*_DEEP` lanes.

**What it is.** A regression gate on the engine's tactical strength: a corpus of puzzle rows
(`src/puzzle-corpus.ts`), a recorded baseline (`src/puzzle-suite.baseline.json`), and a run that
fails when the engine solves fewer rows than the baseline. A run prints `NEWLY-MISSED` /
`NEWLY-SOLVED` per row that differs from the baseline. `PUZZLE_DEEP=weakened` is the red
demonstration — it runs a weakened engine against the gate and EXITS 1 BY DESIGN (RUN 2026-10-09:
10/40, 1 failed and 10 passed, 20.9 s); a red from it is the lane working.

**Trigger (the owner's, option B, 2026-10-09, verbatim list).** QE runs it during review when the
change touches engine code: `src/engine.ts`, `src/search*.ts`, `src/evaluate*.ts`,
`src/quiescence.ts`, `src/transposition.ts`, move ordering. **Red = QE FAIL.** It is NOT a
`quality.mandatory_gates` entry. Source: orchestrator decision `…b61e0d35` in
`.grugops/context/wave-2026-09-25/notes/`.

**Baseline rule.** The baseline moves only in its own commit with a stated reason, never in a commit
that also changes engine code (no trigger-list file in it). RAISING it is QE's; LOWERING it needs the
owner's word. The 2026-10-10 move 40/40 -> 58/62 (`ABC-127`, 22 rows appended) is a raise in the
denominator, not a lowering. The four unsolved rows are the recorded headroom, each solved at 4x the
readings: mate in 3 seed 24 (black Q+N against P), seed 234 (white Q+R against P), seed 288 and seed
580 (white Q+B against a bare king). Budget 25, step 1.

**Receipts.**
- 2026-10-09, `ABC-084` (Scribe base `e426e91`), 40 rows: exit 0, 12 passed (9 default), 17.3 s at
  load1 ~11 (Engineer: ~13 s quiet).
- 2026-10-10, `ABC-127`, 62 rows: exit 0, **17 passed (12 default), 32-36 s** whole lane, **20-24 s**
  for the gating run, at load1 4-8. The range is the union of every conforming reading from two hops:
  the Engineer's 32.1 / 32.2 / 33.5 s (gating 20.3 / 20.4 / 20.8 s) and Security/NFR's 32.9 / 34.5 /
  36.2 s (gating 20.4 / 21.4 / 24.3 s, load1 3.8-5.4). The Engineer's draft read "32-34 s / 20-21 s";
  the Scribe widened it (`f063ebce`) because Security/NFR's quiet readings fell outside it. Notes:
  `.grugops/context/scribe-ABC-127-a9/notes/…c82bebe0`, `secnfr-ABC-127/` (`…6a3b6274`).
- RE-MEASURED 2026-10-10, this hop, wave tip `9128e7a3`, load1 4.3: exit 0, **17 passed**, 36.05 s
  vitest duration (36.5 s real); the gating run 22.4 s (mate-in-3 oracle rows 8.5 s, win-material
  4.8 s). Default lane, `npx vitest run src/puzzle-suite.test.ts src/cli.real-engine.test.ts`: 13
  passed in 2 files (12 + the 1 `cli.real-engine` default test, matching each file's stated default
  count). Inside both ranges.
- RE-MEASURED 2026-10-10T18:40Z, `scribe-receipts-2026-10-10`, wave tip `a9bfd27c` (after `ABC-131`'s
  merge `231d1288`), load1 ~6: exit 0, **18 passed (12 default)**, 34.37 s vitest duration. Default
  lane (`npx vitest run src/puzzle-suite.test.ts`): 12 passed, 0.45 s. Baseline
  `src/puzzle-suite.baseline.json` reads **54/58**, budget 25, step 1 (`ABC-131` dropped the four
  budget-edge rows, mate-in-3 seeds 1982, 1008, 1424 and 1075, all solved; the four unsolved rows
  above are unchanged). The 17 -> 18 is `ABC-131`'s `A6` row. `AGENTS.md` now says 18 passed and
  54/58; "32-36 s" stands (34.37 s inside it; the engineer reads the gating run faster, 19.2-23.9 s
  vs 25.5 s at base, printed and not asserted).
- `ABC-127` `A7` reads the lane's wall as <= 90 s and the gating run's as <= 45 s, NEVER ASSERTED;
  the only wall assertions are four `300_000` ms hang guards. A reading above 90 / 45 s at load1 > 8
  is load, not a breach.

**Not recorded in `AGENTS.md` on purpose** (outside `A9`; routed by the Orchestrator): Security/NFR's
`R1` / `AR-PUZZLE-EDGE` — at 4% fewer readings the budget edge goes red — which is a fact about the
engine's budget margin, not a `PUZZLE_DEEP` command fact.

Moved from `AGENTS.md` § Commands by `ABC-164` (2026-10-21), word for word, comment delimiters dropped:

Baseline `src/puzzle-suite.baseline.json` (54/58, budget 25,
  step 1). TRIGGER (owner, option B, 2026-10-09): QE runs it during review when the change touches
  engine code (`src/engine.ts`, `src/search*.ts`, `src/evaluate*.ts`, `src/quiescence.ts`,
  `src/transposition.ts`, move ordering). red = QE FAIL. Not a `quality.mandatory_gates` entry. The baseline moves only in its
  own commit with a stated reason, never with an engine change (no trigger-list file in that
  commit); raising it is QE's, lowering it needs the owner's word. `PUZZLE_DEEP=weakened` is the
  red demonstration: exits 1 by design, gate row red (15/58), A3 green; the exit code alone is not
  the reading.

## Real-engine CLI lane (`ABC-119`, `src/cli.real-engine.test.ts`) — `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`

Added to `AGENTS.md` by `46c986f7` (2026-10-10; Scribe branch `grugops/scribe-ABC-119-lane`, from
`f76e041d`). It closes QE's `QE-119-b` (LOW): the lane's only watcher is a human remembering to run
it — rows `M2` and `M3c` are green on the default lane and red only under `CLI_DEEP=1`, the lane is
not a mandatory gate, and before this line nobody reading `AGENTS.md` learned the lane existed.

**What it holds.** Two REAL children of `node src/cli.ts --colour black --ascii` against the real
engine (not a double), with an EMPTY child environment (`env: {}`) so a parent
`NODE_OPTIONS=--import=…` (for example from an `INPUT_DEEP` shell) cannot reach the child and slip
in a double. `played`: empty stdin, covers `A1`/`A3` (the reply is legal — the `last:` SAN is one of
`legalMoves(start).map(toSan)`, and the printed board equals `toFen` after `makeMove` — and the ply
advances by one). `rejected`: one `zz9` line, covers `A1`/`A4` (the refusal message comes from the
merged `rejectionMessage`, then the prompt returns and the session ends on `INPUT_ENDED_NOTICE`,
exit 0). Gated with `if (RUN_DEEP) { describe(...) }`; `describe.runIf` / `it.skipIf` / `.skip` are
never used, so unset is NOT DEFINED and the gate's skip count stays 0. The one DEFAULT-lane test
spawns nothing and can fail: it reds if anyone adds `--import` or a hook to the deep child's argv or
environment. Hang guard 4 x `HARD_CEILING_MS` (20 s).

**Trigger (written where a reader of `AGENTS.md` finds it, per `QE-119-b`).** Run at QE and after any
change to `src/cli.ts` or `src/engine.ts`.

**Receipts.**
- 2026-10-10, Scribe hop on `46c986f7`'s branch, load1 ~4.4: exit 0, **7 passed (1 default)**, 6.36 s;
  children 3099 and 3103 ms. QE (`…bc7d8341`): 6.3-6.5 s at load1 15-18, children 3116-3147 ms. Each
  child is one engine move at `DEFAULT_BUDGET_MS` (3 s) plus start-up, so ~3.1 s per child is the
  product working, and the lane's floor is ~6.2 s.
- RE-MEASURED 2026-10-10, this hop, wave tip `9128e7a3`, load1 4.5: exit 0, **7 passed**, 6.36 s;
  children 3097 and 3106 ms. COUNT YOUR RUN: 7 is the whole lane, 1 is the default lane.
- `node tools/grugops/lane-inventory.js`, RE-RUN 2026-10-10 this hop: exit 0, "The lane collects 51
  test files; git tracks 51. No findings." — the file is collected (`ABC-119`'s hop read the same 51).

Still owed elsewhere, not here: `NFR-008`'s variable list (six names missing, `CLI_DEEP` added) is
Architect/Design's. Notes: `.grugops/context/scribe-ABC-119-lane/notes/…61a7510f`,
`qe-ABC-119/`, `ticket-to-pr-ABC-119-r2/` (`…75c1c46a` for the lane shape).

Moved from `AGENTS.md` § Commands by `ABC-164` (2026-10-21), word for word, comment delimiters dropped:

Real children of
  `node src/cli.ts --colour black --ascii` (count: the test file). Unset: NOT DEFINED, not
  skipped. Run at QE and after any src/cli.ts or src/engine.ts change.

Counting the lane's children (owed line O2 of `ABC-164`; QE-184-c, QE verdict `…7b9ef6a7`, Orchestrator `…9fd3189b`):
children counted from `[CLI_DEEP]` lines need `--reporter=verbose` (or `--silent=false`) in an agent session, as in
`CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts --reporter=verbose`.
Vitest's agent mode hides a passing test's console output, and `CLAUDECODE` alone is not the switch. With the flag
the count is at least 1 (6 children at the `ABC-184` branch tip `c6f80c81`, QE's reading).

## Self-play ladder lane (`ABC-085`, ADR-0038) — `LADDER_DEEP=1 npx vitest run src/ladder.test.ts`

The short-mode lane line stays in `AGENTS.md` § Test. Its comment, moved from `AGENTS.md` by `ABC-164` (2026-10-21), word for
word, comment delimiters dropped, up to the sentence on the A1/A2 verdict:

Short mode, step 120:
  claims A3/A4/A5 only, never A1/A2. `-t "3v4"` re-runs one pair. Unset is the only off:
  `LADDER_DEEP=` and `=0` fail at load (QE-085-e). Unset: NOT DEFINED, not skipped.

**The A1/A2 verdict (owed line O3 of `ABC-164`, reworded; the old sentence is quoted in the `ABC-164` entry at the end of this
file).** It runs inside vitest, as route V of `ADR-0038` addendum 2 (2026-10-17):
`LADDER_DEEP=verdict NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose`. It takes
hours: run 2 took 40,823 s wall on a shared host. Run 2's reading is the Orchestrator's note `…4c1d8e27`
(`.grugops/context/abc146-verdict/notes/`). `--reporter=verbose` is part of the command: vitest 4.1.11's default reporter drops
the `console.log` of a passing test, so without it no `LADDER` score line prints (run 1 passed 17/17 and gave no score;
`ADR-0038` addendum 2, Architect `…b7e2c915`). The `NODE_OPTIONS` heap flag is the one-file shape's (`ABC-173`, Architect
`…7c31d5e8`). The first addendum's code move (route N) is not built; it stays the accepted fallback. Ruling to move this text:
Orchestrator `…6a2f9d03`.

## Coverage — `npx vitest run --coverage`

RUN 2026-08-15 at `daa20c4` (this hop changed no code): exit 0, 856/856 on 30 files.
`@vitest/coverage-v8` is in `devDependencies`; no npm script and no `vitest.config.ts` key invokes
it, and `coverage` is NOT in `quality.mandatory_gates` — a measurement you run, not a gate that runs
you. Figures, and which denominator decides whether this project meets `quality.coverage_threshold`
(`0.8`), are in `.grugops/context/owner-grants-2026-08-15/notes/` — read them before quoting a
number. TRAP from that note: `src/cli.ts`'s tests SPAWN it as a child process and v8 coverage does
not cross a process boundary, so it reads uncovered while being thoroughly tested.

Moved from `AGENTS.md` § Commands by `ABC-164` (2026-10-21), word for word, comment delimiters dropped:

LOADED files only (4.x: no `coverage.all`). Not in
  `quality.mandatory_gates` — a measurement, not a gate. TRAP: `src/cli.ts`'s tests SPAWN it as a
  child and v8 coverage does not cross a process boundary, so it reads uncovered while tested.

## Coverage (`src/` only) — `npx vitest run --coverage --coverage.include='src/**'`

The other denominator; neither is the agreed one. RUN 2026-08-15 at `daa20c4`: exit 0.

RE-MEASURED once more, 2026-10-12, `scribe-ABC-105-2026-10-12`, `main` `6ae6dd27` (`ABC-105` merged `f6400877`,
`ABC-153` merged `38e52f4d`): `npm test` exit 0, **57 files, 1775 tests**, `.test-results/last-run.json`
`success` true, 0 failed, 0 pending. Counts only; no wall time was taken (three hops shared the host). `AGENTS.md`
now reads 57/1775. The +1 file is `tools/grugops/qe-hop-integrity.test.ts`; the +32 tests over 1743 are its 32
(`ABC-105`'s own page: 1743 -> 1775). `ABC-153` added no file and no test row to the count (its test alters five
sources inside an existing case). Moving figure: ... -> 56/1741 -> 56/1743 -> 57/1775.

## Skip-count capture

`npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'` — verified
2026-07-22: returns an integer (0 with no tests). Requires jq, confirmed present. This is the host
runner's reported skipped-test COUNT (an integer) for the gate's test-integrity step. Examples by
runner — verify against yours, never fabricate: vitest `vitest run --reporter=json | jq
'.numPendingTests + .numTodoTests'`; jest `jest --json | jq '.numPendingTests'`; pytest `pytest
--json-report --json-report-file=- | jq '.summary.skipped'`; go `go test -json ./... | jq -s
'[.[]|select(.Action=="skip")]|length'` — examples only, never a hard command. If the count cannot be
determined, record `UNKNOWN - verify`, never a silent 0.

## Test-integrity check

`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count <N>` — verified
2026-08-13: `No findings.`, exit 0, at skip count 0. `.grugops/test-skips.md` is HUMAN-OWNED (kit:
"the agent may not self-author a justification to clear its own gate") — an agent may READ it and
RUN this, never write a row into it. Created by the owner 2026-08-13, discharging `H2`; before that
this step exited 2 (could not run) on every gate.

## QE-hop check (`ABC-105`) — `node tools/grugops/qe-hop-integrity.js --ticket ABC-xxx` | `--sweep`

Added to `AGENTS.md` § Commands 2026-10-12 (`scribe-ABC-105-2026-10-12`), after `ABC-105` merged (`f6400877`).
Exactly one of `--ticket ABC-xxx` or `--sweep`; `--json` for machine output. Exit 0 no in-scope finding, 1 at
least one finding (a ticket with no QE verdict note, or a note that does not meet the four conditions), 2 could not
run (bad arguments, a missing board or snapshot, an unreadable note). It is a completeness check on the record, not
proof a QE hop ran; the convention and the ceiling are in `memory-bank/40-contributing.md` § Conventions. The
Orchestrator runs `--ticket` at every move to `Done` (the dispatch brief's account of the practice from `ABC-105`
at `f6400877`; that run's output is not in the tree, so this entry does not re-attest it).

RUN 2026-10-12 at `main` `6ae6dd27`, in this hop's worktree, read-only on the tree, no timing taken:

| invocation | exit | reading |
|---|---:|---|
| `--sweep` | 1 | Done rows **133**, pre-cutover **38**, covered (qe-e2e) **78**, covered (security-nfr substitute) **2** (`ABC-072`, `ABC-147`), in-scope findings **15**, malformed front matter **0** |
| `--sweep --json` | 1 | `ok` false; same counts |
| `--ticket ABC-105` | 0 | `covered (qe-e2e)`, five covering notes (`qe-ABC-105`, `qe-recheck-ABC-105`, `qe2-ABC-105`, `qe3-ABC-105-lane`, `qe4-ABC-105`) |
| `--ticket ABC-038` | 1 | a `Done` row with no QE verdict note (one of the 15) |
| `--ticket ABC-999` | 1 | finding, "is not a row in `## Done`": a ticket with no note is a finding whether or not it is a `Done` row |
| no argument | 2 | `give exactly one of --ticket ABC-xxx or --sweep`, plus usage |

The brief expected `--sweep` to read 132/38/77/2/15. It reads **133/38/78/2/15**, and the difference is exactly
`ABC-105` itself: the build-tip reading (`ada10423`, note `…abc105-sweep-at-build-tip-and-hand-count-agree-59fc8af7`)
was taken while `ABC-105` sat in `In Review`; the board moved it to `Done` at `c1841b36` (one more `Done` row, one
more covered). `ABC-153` was already `Done` at the build tip (`38e52f4d` precedes it), so it is in both. The 15
findings are unchanged (`ABC-038` `044` `060` `070` `073` `074` `085` `092` `100` `108` `110` `111` `112` `113`
`150`); none was introduced by this ticket and none is this hop's to clear.

## Lint (all) — `npm run lint`

`biome check .`

## Typecheck (single file)

`UNKNOWN - verify` — `tsc` is project-wide; there is no single-file mode. Use the project-wide
command.

## Typecheck (project) — `npm run typecheck`

`tsc --noEmit`

## Build (use sparingly) — `npm run build`

Currently `tsc --noEmit`: the project is type-checked but emits nothing, because nothing is
published until `EPIC-006` packaging. Honest naming — this is a typecheck wearing the build slot's
name, not a real bundle.

## E2E

`UNKNOWN - verify` — no runnable game until `EPIC-006`; `quality.ui_e2e` is `ui-or-critical-path` and
this project has no UI surface yet.

## Command slots, provenance

Command slots filled 2026-07-22 during `ABC-008`. Every command was RUN before being recorded.
Slots that are still `UNKNOWN - verify` are genuinely unknown — nothing was guessed to make the
table look complete.

## Reconciliation ledger, 2026-10-10

Every `AGENTS.md` change since this file's last touch (`ea68a2d8`, 2026-09-26), from `git log --
AGENTS.md` on the wave. Nothing earlier than `ea68a2d8` is owed: its two predecessors (`a84948ce`,
`ea68a2d8`) already have their entries (INPUT_DEEP 34; PVS/LMR).

| commit | date | ticket | what it did to `AGENTS.md` | entry here |
|---|---|---|---|---|
| `5a15fb4f` | 2026-10-09 | `ABC-084` `A8` (+ `ABC-086` receipts) | added the `PUZZLE_DEEP` line (owner's trigger list, red = QE FAIL, baseline rule); refreshed `Test (all)` to 50 files / 1539; corrected `ENGINE_DEEP` to 45 passed, 318.6 s, trigger gains `src/virtual-clock.ts`. 22,451 -> 23,464 B | § Puzzle-suite; § Test (all); § Engine deep lane |
| `6117a2a4` | 2026-10-10 | `ABC-069` | the `Dev / run` slot's two WRITING RULES (backticks; name only accepted options) with the enforcer cited, plus the `ABC-071` / `ABC-067` closure rules. Comment only, 23,464 -> 23,879 B | § Dev / run |
| `f063ebce` | 2026-10-10 | `ABC-127` `A9` | `PUZZLE_DEEP` receipt: 17 passed (12 default), wall 32-36 s / 20-24 s, baseline 58/62. +169 B. Merged by `d45a0261` | § Puzzle-suite |
| `46c986f7` | 2026-10-10 | `ABC-119` (closes `QE-119-b`) | the `CLI_DEEP` real-engine CLI lane line with its QE trigger. 23,879 -> 24,264 B | § Real-engine CLI lane |
| `d45a0261` | 2026-10-10 | `ABC-127` | merge commit, no `AGENTS.md` change of its own beyond `f063ebce` | — |

**Result on the wave tip `9128e7a3`:** `AGENTS.md` is 24,433 B against the 24,576 B cap (143 B of
headroom). Two receipts in it are one count stale against re-measurement today and are NOT corrected
here (this hop does not edit `AGENTS.md`): `Test (all)` reads 50 files / 1539, the tree is 51 / 1584;
`ENGINE_DEEP` reads 45 passed (32 default), the tree is 46 (33 default).

Not a command slot, so no receipt is owed: the `pgrep -f` wait-loop rule (`a84948ce`, 2026-09-26) is a
prose safety rule in `AGENTS.md` § Test and is complete there.

Owed after `ABC-087` merges (its branch carries its own `AGENTS.md` edit and a `Levels deep lane`
line, `ENGINE_DEEP=1 npx vitest run src/levels.test.ts`, not on the wave yet): re-reconcile this
file against that merge, and decide the two stale counts above with the headroom proposal in
`.grugops/context/scribe-command-log-2026-10-10/notes/`.

## Headroom pass, 2026-10-10

Task `scribe-headroom-2026-10-10`, wave tip `5d55cc48`, after `ABC-087` merged. `AGENTS.md` 24,162 B ->
**23,633 B** (cap 24,576 B, `ABC-109`; headroom 414 -> **943 B**). Ranks 1 and 2 of the headroom proposal
(`.grugops/context/scribe-command-log-2026-10-10/notes/`, `…a023cfcd`); rank 3 is HELD (it rewrites the
owner's 2026-08-15 wording, no answer); ranks 4 and 5 stay in reserve.

| change to `AGENTS.md` | bytes | what it dropped / kept |
|---|---:|---|
| Rank 1: deleted the "Drafted by BA/PM at `home-the-gaps-2026-08-13`…" paragraph under § Role / workflow files; folded its one behavioural fact into the blockquote as one sentence ("Restoring the writer is an install-level fix (`node install/install.js --check`) escalated to the owner, not a ticket.") | -228 | dropped the story (who drafted it, who placed it, "eight consecutive hops re-derived it") — provenance, kept in the `home-the-gaps-2026-08-13` notes; the rule ("Do not re-derive this; do not invent a stamp.") and the install-level-fix fact stay. The paragraph was already 70 B tighter than the proposal measured (`ABC-087`'s pass), and the fold costs ~110 B, so the saving is below the proposal's 350 B |
| Rank 2: deleted the "> **Kit vs state invariant:**" blockquote at the end of § Kit vs state | -308 | it restated the four bullets directly above it, near-verbatim; the bullets are the clear-voice copy |
| `Test (all)` RUN: 52 files / 1603 tests / 5.9 s -> 52 / **1608** / 7.8 s | +0 | re-measured, see § Test (all) |
| `Engine deep lane`: RUN 2026-10-09, 45 passed (32 default) -> RUN 2026-10-10, **46 passed (33 default)** | +0 | re-measured, see § Engine deep lane |
| `Levels deep lane`: 202 s -> **202-225 s**; A3 "35" -> "**35-36**" | +7 | re-measured, see § Levels deep lane |

Net: 24,162 -> 23,633 B (-529 B). Guards read green: `src/cli.test.ts` (`ABC-109` byte cap, `ABC-059`
runnability, `ABC-065`/`ABC-069` `Dev / run` slot rules); the `Dev / run` slot and the `PUZZLE_DEEP`
`TRIGGER` text are byte-identical to the before-file.

Resolved by this pass: the two stale counts and the `Levels deep lane` entry that the ledger above
left owed. Still owed: `ABC-131`'s figures (see § Levels deep lane), when it merges.

## Receipts pass, 2026-10-10 (after `ABC-131`'s merge)

Task `scribe-receipts-2026-10-10`, branch `grugops/scribe-receipts-2026-10-10`, wave tip `a9bfd27c`.
`AGENTS.md` 23,633 B -> **23,216 B** (-417 B; cap 24,576 B, `ABC-109`; headroom 943 -> **1,360 B**).

| change to `AGENTS.md` | bytes | what it dropped / kept |
|---|---:|---|
| Rank 3 (owner-approved, "7. ok", Orchestrator note `…6a1f3d92`): Safety-rules "Deploy is allowed…" bullet -> a two-line pointer to `## Deployment posture` | -414 | kept the two-clause headline ("allowed, and nothing to deploy"), the owner and date (2026-08-15, one sentence), `production_requires_human_confirmation` stays `true` and "the grant did not flip it". Dropped: the "neither 'deploy freely' nor 'the old prohibition stands'" sentence, the "no artifact, no target, no release machinery" restatement, the `EPIC-006` pointer and "moving it is the owner's word, never an inference". Each is in `## Deployment posture` ("Nothing here relaxes anything"; the `EPIC-006` revisit trigger; "the grant deliberately did not flip it; moving it is the owner's word, never an inference") except the "neither…nor" sentence, which is gone |
| `Test (all)` RUN: 1608 tests / 7.8 s -> **1663** / 6.5 s | +0 | re-measured, see § Test (all) |
| `Levels deep lane`: perft + puzzles 246 -> **242** moves; `A3` "35-36 vs 58 of 62" -> **"35 vs 54 of 58"** | -3 | `ABC-131`'s figures, per `QE-131-c`; see § Levels deep lane |
| `PUZZLE_DEEP`: 17 -> **18** passed; baseline 58/62 -> **54/58** | +0 | re-measured, see § Puzzle-suite |

Net: 23,633 -> 23,216 B (-417 B). Guards: `src/cli.test.ts` 67 passed (`ABC-109` byte cap, `ABC-059`
runnability, `ABC-065`/`ABC-069` `Dev / run` slot rules); `npm run lint` exit 0. The `Dev / run` slot
and the `PUZZLE_DEEP` `TRIGGER` text are untouched.

Left out, on purpose (the brief: only where `AGENTS.md` already states the thing):
- `NFR-008` R-1 (wall <= 10 s, CPU reported), `NFR-005` depth 7 no longer provisional, `RISK-003` 0.8x:
  `AGENTS.md` mentions none of them (grep for `NFR-005`, `NFR-008`, `RISK-003`: 0 hits), so there is
  nothing to correct and no section was added.
- Reference runtime Node v26.11.0: `AGENTS.md` § Stack says "Node (>= 22)", a minimum and not the
  reference runtime; it stays true on v26.11.0. The Security/NFR note counts `AGENTS.md` v24 mentions
  at 0. Left as is.
- ADRs 0035, 0036, 0037, 0038: `AGENTS.md` has no ADR index (its only ADR pointer is `ADR-0007`, in
  § Deployment posture); `memory-bank/00-index.md` is the index and is outside this hop's fences. No
  pointer added.
- Lane and board state (`ABC-093` and others): not `AGENTS.md`'s.

## Book-regen pass, 2026-10-10

Task `scribe-book-regen-2026-10-10`, branch `grugops/scribe-book-regen-2026-10-10`, wave tip `39d87491`.
Closes `QE-093-a` (MEDIUM, `AGENTS.md` regeneration line owed) and the engineer's claim `…a6cb510f`.
`AGENTS.md` 23,216 B -> **23,609 B** (+393 B; cap 24,576 B, `ABC-109`; headroom 1,360 -> **967 B**).

| change to `AGENTS.md` | bytes | what it kept / dropped |
|---|---:|---|
| New `Development` slot "Regenerate the opening book (ABC-093)" after the Spike benchmark line | +393 | command, in-place rewrite, `<dir>` meaning, pinned-source pointer to `ATTRIBUTION.md`, no-arg exit 1. Not restated: URLs, sha256, the no-hash-check gap (`QE-093-b`) |
| `Test (all)` RUN: 52 files / 1663 tests / 6.5 s -> **53 / 1680 / 8.1 s** | +0 | re-measured, see § Test (all) |

The line was verified before it was placed: RUN, exit 0, `cmp` 0 against the committed file (see §
"Regenerate the opening book"). The engineer's draft said "`<dir holding a.tsv … e.tsv at the pinned SHA>`"; the
verification added the one thing the draft did not say and the brief assumed otherwise: the output is
written in place, not to the directory argument. Guards: `src/cli.test.ts` (`ABC-109` byte cap,
`ABC-059`, `ABC-065`/`ABC-069`/`ABC-071`/`ABC-067` `Dev / run` slot rules) run in the full lane, see
the commit.

## Ladder-lane and RISK pass, 2026-10-11

Task `scribe-lines-2026-10-11`, branch `grugops/scribe-lines-2026-10-11`, wave tip `2ae3b501`.
`AGENTS.md` 23,609 B -> **24,237 B** (+628 B; budget 24,576 B, `ABC-109`; headroom 967 -> **339 B**; the
inherited 32,768 B reader cap leaves 8,531 B). Nothing tightened, no rule dropped.

| change to `AGENTS.md` | bytes | source |
|---|---:|---|
| New `Test` lane "Self-play ladder lane (opt-in, ABC-085, ADR-0038)" after the Real-engine CLI lane | +~487 | The Engineer's draft, note `…8515e3e7`: its RUN receipt is CITED (exit 0, 14 passed / 9 default, 848 s, loaded host), not re-run: `npm test` was barred on a hot machine. `QE-085-e` added: unset is the only off, `LADDER_DEEP=` and `=0` fail at load (`stepForMode`, `src/ladder.test.ts`). The verdict route is `ABC-146`'s (plain node, accepted `ADR-0038` addendum), not this lane's |
| New safety bullet `RISK-ABC143-01` after "Do not change dependencies without reason" | +~141 | BA/PM's suggested text, note `…de5cd740`, verbatim |

Owed, NOT written: the `test.maxWorkers: 3` cap (`ADR-0040`, accepted) lands at `ABC-144`'s merge; `ABC-144` is
in QE. No line until then. Headroom 339 B is under one more lane line: the Scribe hop after `ABC-144` must
tighten wording or move receipts here first.

## `ABC-152` pass, 2026-10-12 (vitest 4.1.11, module runner off; merged `7a920ca5`)

Task `scribe-ABC-152`, branch `grugops/scribe-ABC-152` from `main` `6464bd2f`. `AGENTS.md` 24,485 B -> **24,494 B**
(+9 B; budget 24,576 B, `ABC-109`; headroom 91 -> **82 B**). Every figure below was RUN in this worktree
(`node_modules` symlinked from the main checkout, vitest 4.1.11, M3, load1 ~3.7), none cited.

| command | exit | reading |
|---|---:|---|
| `npm test` | 0 | 56 files, 1741 tests, `Duration` 5.73 s, `real` 6.15 s; no deprecation line (the reporter imports `vitest/node`) |
| `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts` | 0 | 18 passed; printed `PUZZLES shipped: solved 54/58 … wall 3.97 s`, `Duration` 5.78 s (was 32-36 s on 3.x; Security/NFR: B 19.95 s / H 3.96 s printed) |
| `PUZZLE_DEEP=weakened npx vitest run src/puzzle-suite.test.ts --reporter=verbose` | 1 | 1 failed, 13 passed. The failed row is the gate (`expected 15 to be greater than or equal to 54`, `solved 15/58`); A3 is ✓. Exit 1 alone proves nothing: at `a99e9845` it exited 1 with the gate row green at 54/58 (`QE-152-h`) |
| `npx vitest run --coverage` | 0 | `All files` 99.2 / 97.94 / 100 / **99.43** (stmts / branch / funcs / lines). 4.x dropped `coverage.all`: the denominator is the files LOADED, not 30 files; not comparable to the 3.2.7 "856/856 on 30 files" |
| `npx vitest run --coverage --coverage.include='src/**'` | 0 | 95.73 / 97.34 / 97.61 / **95.55** |
| `VITEST_MAX_WORKERS=-1 npm test` | 0 | nothing ran; `.test-results/last-run.json`: `success` false, `runState` "exited", `exitCode` 0, 0 `testResults`. `RISK-ABC152-NEGWORKERS` (QE-152-b), a class: any negative value |

Cut from `AGENTS.md` to pay for the above (all kept here or already in this file): the jest / pytest / go
skip-count examples (§ "Skip-count capture"); the Acceptance slot's comment (host runner examples
`cucumber-js` / `behave` / `bddgen && playwright test`, "examples only, never a hard command"); the
"Command slots filled 2026-07-22 (ABC-008)" comment (§ "Command slots, provenance"); the puzzle lane's
`NEWLY-MISSED` / `NEWLY-SOLVED` clause (printed per differing row; `src/puzzle-suite.test.ts` header).

Refreshed with no new RUN of their own: the `Test (all)` receipt (53 files / 1680 tests / 8.1 s ->
56 / 1741 / ~6 s) from the `npm test` row above. `RISK-ABC143-01` safety bullet re-worded: `ABC-152` ruling 5
rewrote the reporter for 4.x (`onTestRunEnd`) with a load-time check, so it no longer "breaks silently on
4.x"; the six-row regression plants (reporter header) are still owed on any vitest bump. Notes read:
`ticket-to-pr-ABC-152` (`…4567b6b5`, `…ac190931`), `qe-ABC-152`, `qe2-ABC-152`, `design-ABC-152*`
(`…e50fbbe3`), `secnfr-ABC-152-window` (`…bceca0ca`).

## `scribe-lines-2026-10-12` pass, 2026-10-12 (`ABC-145`, `ABC-148`, `ABC-117`, `ABC-116` merged)

Task `scribe-lines-2026-10-12`, branch `grugops/scribe-lines-2026-10-12` from `main` `d8794608`. `AGENTS.md`
24,494 B -> **24,545 B** (+51 B; budget 24,576 B, `ABC-109`; headroom 82 -> **31 B**).

| change to `AGENTS.md` | bytes | source |
|---|---:|---|
| `Test (all)` receipt "1741 tests, 6.2 s" -> "1743 tests" (time dropped, not re-taken) | -7 | one `npm test` run in this worktree, exit 0, 56 files / 1743 tests; counts only |
| book-compiler row gains "Wrong sha256: refused, exit 1, nothing written (ABC-145)." | +58 | `ABC-145`, QE's `A4` RUN (the entry under "Regenerate the opening book" above) |

Receipts owed and written here: `ABC-145` (the "Regenerate the opening book" entry, dated UPDATE); the 56/1743
count ("Test (all)" entry, RE-MEASURED). `ABC-116`: comment only on `ChildOptions` in `src/cli.test.ts` (its
hook-deletion re-measure, +3.08 s wall / +3.12 s CPU, is a test-lane cost in the ticket's notes, not a
command): no command changed, no `AGENTS.md` line, no receipt. `ABC-148`: a comment in `src/cli.test.ts`: none.
`ABC-117`: a correction of a record (the `EBADF` exit 1 is Node's unhandled-exception status, not
`USAGE_EXIT_CODE`); `AGENTS.md` does not carry the `EBADF` wording and its "1 refused command line" exit-code line
stays true (a refused command line does exit 1), so nothing was made false.

Checked for other lines the four merges made false, none found: the `Dev / run` slot (exit 0 / 1 / 70), the
worker-cap and `ABC-152` lines, the deep-lane receipts (none of the four touched `src/` production, `vitest.config.ts`
or `package.json`).

## `scribe-ABC-105-2026-10-12` pass, 2026-10-12 (`ABC-105` merged `f6400877`, `ABC-153` merged `38e52f4d`)

Task `scribe-ABC-105-2026-10-12`, branch `grugops/scribe-ABC-105-2026-10-12` from `main` `6ae6dd27`.
`AGENTS.md` 24,545 B -> **24,569 B** (+24 B; budget 24,576 B, `ABC-109`; headroom 31 -> **7 B**). The pointer line (+88 B) and
the command row (+215 B) cost +303 B, so 279 B were freed first, as follows (per-hunk byte differences measured
from `git diff`, summing to +24). No reading was lost:
each old text is quoted, and where a figure left `AGENTS.md` it is kept in this file.

| `AGENTS.md` change (old -> new) | bytes | where the reading stays |
|---|---:|---|
| "All work starts with the Orchestrator: `agent-factory/roles/orchestrator.md`." (own paragraph) deleted; step 2 "the routing contract; act as the Orchestrator." -> "the routing contract. All work starts here; act as the Orchestrator." | -57 | step 2 names the same file; the sentence moved into it (hunks: -79 and +22) |
| `Test (all)` "56 files, 1743 tests" -> "57 files, 1775 tests" | 0 | read at `main` above (`npm test`, exit 0) |
| Coverage comment "(4.x: no `coverage.all`; was 856/856 on 30 files)" -> "(4.x: no `coverage.all`)" | -25 | § "Coverage" above (RUN 2026-08-15, 856/856 on 30 files) |
| Branching model "…2026-08-15." — this is a pointer to them." -> "…2026-08-15."" | -31 | "Full text, the authority:" already says it |
| Kit override 1 of 3 "(count and the "reader who counts four" line: `## QE validation authority`)" -> "(count: `## QE validation authority`)" | -38 | the "reader who counts four" line is in `## QE validation authority` itself, unchanged |
| Kit override 2 of 3 "(see `## QE validation authority` for the count and its "reader who counts four" line)" -> "(count: `## QE validation authority`)" | -49 | same (includes a line re-wrap, 0 B) |
| UAT authority "— this is a pointer to them, not the text itself." -> "— pointers, not the text." | -24 | same meaning |
| Deployment "`ADR-0007…md` — the authority; this is a pointer." -> "— the authority." | -19 | same meaning |
| Safety "Running a ticket's tests and conducting its UAT are the agent's on the same terms — see `## Test and UAT authority`." -> "Tests and UAT are the agent's on the same terms — see `## Test and UAT authority`." | -36 | same, pointer kept |
| NEW pointer under `## QE validation authority`: "QE-hop record convention and ceiling: `memory-bank/40-contributing.md` § Conventions." | +88 | `A7` of the `ABC-105` page |
| NEW command row (`ABC-105`) `qe-hop-integrity.js --ticket ABC-xxx` / `--sweep`, exit 0 clean / 1 finding / 2 cannot run, `--json`, Orchestrator runs `--ticket` at every move to `Done` | +215 | § "QE-hop check" above |

(-57 -25 -31 -38 -24 -19 -49 -36 = -279; +88 +215 = +303; net +24; `wc -c AGENTS.md` = 24,569.)

Checked and left unchanged: the test-integrity row already states the full form,
`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count <N>` (`<N>` is the count; the bare
`--skip-count 0` form exits 2), so item 4 of the brief needed no edit. The `Dev / run` slot and the guards on it
(`ABC-065`, `ABC-067`, `ABC-071`) were not touched.


## `ticket-to-pr-ABC-173` pass, 2026-10-19 (`ABC-173`, the V8 heap ceiling; branch `grugops/ABC-173` from `68bbf33f`)

Software Engineer, task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-173`, ruled by `ADR-0008` § ADDENDUM 2026-10-19
(accepted by the owner). Every vitest command in `AGENTS.md` gains its shape's prefix: ONE-FILE
`NODE_OPTIONS=--max-old-space-size=400` (14 lines), SUITE `NODE_OPTIONS=--max-old-space-size=128` (2 coverage lines + the
skip-count capture), and `INPUT_DEEP` one quoted value `NODE_OPTIONS="--expose-gc --max-old-space-size=400"`. Without the
prefix `tools/grugops/heap-guard.js` refuses the run (exit 1, no test runs).

`AGENTS.md` 24,576 B -> **24,343 B** (budget 24,576 B, `ABC-109` `A5`; headroom 0 -> **233 B**). The prefixes cost **+635 B**
(16 x 38 B + 27 B for `INPUT_DEEP`). **-868 B** of RUN-receipt comment text left `AGENTS.md`, quoted verbatim below (JSON
strings, `\n` = the line break it had). Directives, traps and "Run after" lines stayed. The `Dev / run` slot was not
touched. One word moved case: "two real children" -> "Two real children" (0 B).

- **Test (all)** (-48 B, old -> new): "RUN\n  2026-10-12: exit 0, 57 files, 1775 tests." -> ""
- **Search deep lane** (-42 B, old -> new): "<!-- exit 0,\n  41 passed (28 default), 23.0 s. Unset:" -> "<!-- Unset:"
- **Engine deep lane** (-81 B, old -> new): "<!-- RUN 2026-10-10:\n  exit 0, 46 passed (33 default), ~5 min (292-319 s), not 100 s. Wall-clock" -> "<!-- Wall-clock"
- **Levels deep lane** (-73 B, old -> new): "<!-- RUN 2026-10-10: exit 0, 28 passed (22 default), 202-225 s (A5: 135 s).\n  Holds" -> "<!-- Holds"
- **Input-seam deep lane** (-38 B, old -> new): "<!-- RUN 2026-09-26: exit 0, 34 passed \u2014 34 is" -> "<!-- 34 is"
- **Transposition deep lanes (SEARCH_DEEP)** (-48 B, old -> new): "<!-- exit 0, 40 passed (25 default), 47.7 s -->" -> ""
- **Transposition deep lanes (ENGINE_DEEP)** (-47 B, old -> new): "<!-- exit 0, 26 passed (25 default), 4.8 s -->" -> ""
- **Zobrist deep lane** (-50 B, old -> new): "<!-- exit 0,\n  33 passed (32 default), 37.0 s -->" -> ""
- **Quiescence deep lane** (-49 B, old -> new): "<!-- exit 0,\n  37 passed (29 default), 1.8 s -->" -> ""
- **Puzzle suite** (-141 B, old -> new): "<!-- RUN 2026-10-12: exit 0, 18 passed (12 default), ~6 s (printed wall 4 s); ABC-127 A7 reads <= 90 / 45 s,\n  never asserted, 300 s hang guards. Baseline" -> "<!-- Baseline"
- **PVS/LMR deep lane** (-131 B, old -> new): "<!-- exit 0, 29 passed (20 default; 0.6 s). Deep 926.2 s wall,\n  cited from UAT (`uat-run-ABC-121#77854a65`), not re-run (over 10 min). Run after" -> "<!-- Run after"
- **Real-engine CLI lane** (-53 B, old -> new): "<!-- RUN 2026-10-10: exit 0, 7 passed (1 default), 6.4 s; two real children" -> "<!-- Two real children"
- **Self-play ladder lane** (-67 B, old -> new): "<!-- RUN 2026-10-11: exit 0, 14 passed (9 default), 848 s, loaded host. Short mode" -> "<!-- Short mode"

(-48 -42 -81 -73 -38 -48 -47 -50 -49 -141 -131 -53 -67 = -868; +635; net -233; `wc -c AGENTS.md` = 24,343.)

**Receipts at the cap, RUN 2026-10-19** (worktree `../wt-ABC-173`, node v26.11.1, vitest 4.1.11; each command exactly as
`AGENTS.md` now spells it; counts and exit codes only, NO timing taken):

| command | exit | counts |
|---|---:|---|
| `npm test` | 0 | 59 files, 1920 passed; `last-run.json` `success: true`, `exitCode` 0 |
| skip-count capture | 0 | 0 |
| `PERFT_DEEP` | 0 | 32 passed |
| `SEARCH_DEEP` `search.test.ts` | 0 | 57 passed |
| `ENGINE_DEEP` `engine.test.ts` | 0 | 60 passed |
| `ENGINE_DEEP` `levels.test.ts` | 0 | 28 passed |
| `INPUT_DEEP` | 0 | 34 passed |
| `SEARCH_DEEP` `transposition.test.ts` | 0 | 40 passed |
| `ENGINE_DEEP` `transposition.test.ts` | 0 | 26 passed |
| `ZOBRIST_DEEP` | 0 | 33 passed |
| `SEARCH_DEEP` `quiescence.test.ts` | 0 | 37 passed |
| `PUZZLE_DEEP` | 0 | 18 passed |
| `SEARCH_DEEP` `search.pvs-lmr.test.ts` | 0 | 29 passed |
| `CLI_DEEP` | 0 | 11 passed (10 + `ABC-173` `A6`'s probe) |
| `LADDER_DEEP` (short mode) | 0 | 18 passed |
| Test (single file), `<path>` = `src/fen.test.ts` | 0 | 82 passed |
| Coverage | **1**, then 0, 0 | first run: 1917 passed, **3 failed** (`Test timed out in 5000ms`: 2 in `src/engine.test.ts` `ABC-170 A3`, 1 in `src/uci-session.test.ts` `ABC-167 A5`); re-runs 1920 passed |
| Coverage (`src/` only) | **1**, then 0, 0 | first run: 1919 passed, **1 failed** (`Test timed out in 5000ms`, `src/engine.test.ts` `ABC-170 A3`); re-runs 1920 passed |

No lane printed a heap out-of-memory error or a guard refusal. The two coverage reds are reported to the owner, not
re-sized (his Q4); cause `UNKNOWN - verify`. They were 5 s per-test timeouts in rows that read the wall clock, while
another hop ran mutation tests on the same host (load1 4.5-6.4). The base tree `68bbf33f`, uncapped, read 1915 passed in
2 of 2 runs of `npx vitest run --coverage` in a scratch copy.

**Resumed 2026-10-19 on the owner's word** (`…6e1d9b47`: "Lighten the rows, keep cap"). Rows, flags and the 5 s timeout
are unchanged. The coverage-timeout rows moved to coarser virtual-clock steps (`48842a1f`): `ABC-170 A3` x6 from step 1
to step 5, and `ABC-167 A5` "movetime 100" from step 1 to step 10. Every command was then re-run exactly as spelled
(counts only, no timing):

| command | exit | counts |
|---|---:|---|
| `npm test` | 0 | 59 files, 1920 passed; `last-run.json` `success: true`; skip count 0; integrity `No findings.` |
| Coverage, run 1 / run 2 | 0 / 0 | 1920 / 1920 passed |
| Coverage (`src/` only), run 1 / run 2 | 0 / 0 | 1920 / 1920 passed |
| every `*_DEEP` line and single file | 0 each | PERFT 32, SEARCH search 57 / transposition 40 / quiescence 37 / pvs-lmr 29, ENGINE engine 60 / levels 28 / transposition 26, INPUT 34, ZOBRIST 33, PUZZLE 18, CLI 11, LADDER short 18, `src/fen.test.ts` 82 |

Both coverage lines also went green once more each in the peak-`heapUsed` observation pass (the same command with
`--import=<peak.mjs>` added to `NODE_OPTIONS`). No lane printed an out-of-memory error.

## `scribe-ABC-164` pass, 2026-10-21 (`ABC-164`, the owner's Option A split; branch `grugops/ABC-164` from `49dc490c`)

AGENTS.md Scribe, task `scribe-ABC-164`. Zero `src/` lines; five files: `AGENTS.md`, this file, `memory-bank/45-standing-rulings.md`
(new), `memory-bank/40-contributing.md`, `memory-bank/00-index.md`. The split is the ticket page's table (39 blocks: 26 kept whole,
10 split, 3 moved), with corrections C1 (the `PERFT_DEEP` line stays) and C2 (`## Safety rules` stays whole).

**Bytes.** `AGENTS.md` 24,575 B -> **15,606 B** (-8,969 B; 373 -> 216 lines), `A1` ceiling 18,432 B. Headroom against the unchanged
24,576 B budget constant (`ABC-109`): **8,970 B = 7.74 edits** at 1,159 B/edit (the page asks for at least 5.3). Against the 18,432 B
ceiling: 2,826 B (2.44 edits). Base was 1 B (0.0 edits). `vitestCommandsIn(AGENTS.md)` returns 17, among them one `PERFT_DEEP=1`
line, as at base.

**Where each moved block went.**

| block | now in `AGENTS.md` | moved to |
|---|---|---|
| `B02` budget paragraph | the bold budget sentence and a pointer to this file's preamble | the reader-cap sentence, this file's preamble |
| `B10` slot WRITING RULES | the slot's own pointer line (to § "Dev / run") | § "Dev / run" |
| `B11` perft lines | the `PERFT_DEEP=1` line | `npm run perft`, `npm run spike:perft [depth]`: § "On-demand commands" |
| `B12` book regeneration | nothing | command line: § "On-demand commands"; RUN comment: § "Regenerate the opening book" |
| `B17` worker cap | the cap, never raise, env may only lower, and a pointer | the rest: § "Vitest worker cap and module runner" (new) |
| `B18` 11 lane bullets | label and command, no comment | each lane's comment: that lane's section; the ladder's: § "Self-play ladder lane" (new); the table: § "On-demand commands" |
| `B20` coverage x2 | both command lines | the comment: § "Coverage — `npx vitest run --coverage`" |
| `B23` QE-hop | the command line and a pointer | the comment: `40-contributing.md` § Conventions |
| `B30`-`B34` five governance sections | `## Standing rulings`: a pointer line and the operative sentences, each verbatim in `45` | `memory-bank/45-standing-rulings.md`, same five headings, verbatim |
| `B35` Safety rules | whole; three `## X` references re-pointed to `45` | the three references' old text is in `45` as headings |

**Owed lines.** `O1`: `contextRoot` pointer in the note-writer blockquote (`AGENTS.md`; worded for the checkout you work in, so it
covers a worktree hop as well as the main checkout). `O2`: § "Real-engine CLI lane". `O3`: § "Self-play ladder lane" only;
`AGENTS.md` carries no `LADDER_DEEP=verdict`.

**`A4` (nothing lost), measured with `git diff -U0 49dc490c -- AGENTS.md`**, each removed run joined (newlines to spaces, spaces
collapsed, comment delimiters dropped), found in the union of `45`, this file and `40-contributing.md`. A removed run that is a
command line plus its comment is not found whole by construction (the command line stays in `AGENTS.md`), so the check was also
run on the removed words that the added lines do not carry (token alignment per hunk). Result: every moved comment, command line
and governance section is found word for word. **Misses: four kinds, none of them lost meaning.** (Corrected 2026-10-21, `scribe-amend-90`,
from QE's `QE-164-b`: this list said three kinds and named the QE-hop comment; see the end of item 3 and item 4.)
1. The `O3` rewording. Old sentence, kept here so it is not lost:
   "The A1/A2 verdict is not run here (~44 h in vitest): its route is ABC-146's (plain node, ADR-0038 addendum)."
2. The re-pointed references. Old text, in `AGENTS.md` § Safety rules: "see `## Branching model`", "see `## Test and UAT
   authority`" and "See `## Deployment posture`" (now `memory-bank/45-standing-rulings.md` § ...). `45` holds each of those
   headings verbatim.
3. Lines replaced by pointers: the `Dev / run` slot's receipts lead ("Full receipts (RUN dates, ...)" is now "Writing rules for this slot and
   full receipts (RUN dates, ...)"); the worker-cap bullet's "1..2" (now "1..2." before its pointer); the budget sentence's pointer.
   The QE-hop comment is not a miss: QE found it whole in `40-contributing.md` § Conventions (`QE-164-b`).
4. The `O1` insertion split one line of the note-writer blockquote in `AGENTS.md` (the `installed_plugins.json` line);
   both halves are still in `AGENTS.md`, so nothing is lost (`QE-164-b`).

**Gates on the tip** (worktree `../wt-ABC-164`, no timing taken): lint exit 0, typecheck exit 0, build exit 0; `npm test` exit 0, 59
files, 1987 tests (equal to base), `.test-results/last-run.json` `success` true; the `ABC-042`, `ABC-059`, `ABC-065`, `ABC-067`,
`ABC-071`, `ABC-109` and `ABC-173` rows all green; `test-skip-integrity.js --skip-count 0`: `No findings.` UAT waiver form
(`git diff --name-only <tip>~1 <tip> | grep -v '\.test\.ts$' | grep '^src/'`): prints nothing.

## `scribe-amend-90` pass, 2026-10-21 (`QE-164-a`, `QE-164-b`; owner go `…cba9c8eb`; branch `grugops/scribe-amend-90` from `bf6fc623`)

AGENTS.md Scribe, task `scribe-amend-90`. Records only: this file alone; no `AGENTS.md`, `src/` or `plans/` line changed. QE's verdict on
`ABC-164` (`…47cae669`) found that the split left present-tense sentences here that it had made false. Each was made true for the layout
after `ABC-164`; the sentences below were the only ones changed, besides the `QE-164-b` correction in the `scribe-ABC-164` pass.

| where | before | after |
|---|---|---|
| preamble | "`AGENTS.md` keeps each command line plus the single most load-bearing fact (exit code / count / timing) and a pointer to the matching section below." | Since `ABC-164`, `AGENTS.md` keeps each command line except the three in § "On-demand commands", a fact only in the `Dev / run` and `npm test` comments, and a pointer here. |
| Reader | "beyond the one-line summary `AGENTS.md` carries inline … the one-line-per-command index every role reads; this file is its footnoted detail." | "beyond the little `AGENTS.md` carries inline … the command index every role reads (every command line but the three in § "On-demand commands"); this file holds the comments and receipts behind it." |
| § Dev / run | "`AGENTS.md` carries the rules in the slot's own comment; this entry is their receipt." | The slot's comment carries only a pointer here; the rules are in the "WRITING RULES" paragraph below; this entry is their receipt. |
| § Regenerate the opening book | "`AGENTS.md` carries the line and one fact" | `AGENTS.md` carries neither the line nor this comment, only a pointer to § "On-demand commands". |

`QE-164-b`: in the `scribe-ABC-164` pass, the miss list now has four kinds (the `O1` line split added) and no longer counts the QE-hop comment
(found whole in `40-contributing.md`). The Reader's "one-line summary" clause was changed with its sentence because the same split made it false.
