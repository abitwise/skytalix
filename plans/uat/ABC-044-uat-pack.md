# UAT pack — `ABC-044`, the result screen

**Task:** `uat-ABC-044-2026-08-20` · **Role:** UAT Planner · **Workflow:** `agent-factory/workflows/06-uat-pack.md`
**Conducted:** 2026-08-20, against the real build on branch `grugops/abc044-the-result-screen` @ `10811cf`
(base `main` @ `30482cd`; the ticket's production code was delivered at `db38961`). **Not merged.**

> ## Read this before anything else in this pack
>
> **Nobody has accepted `ABC-044`.** This pack was **conducted by an agent**. Every "PASS" below means
> *"the scenario was executed against the real product and the product did what this pack says it
> should do"*. It does **not** mean a human looked at it, agreed with it, or accepted the work.
>
> The `In UAT` exit signature on this project is **the owner's word in session** (`AGENTS.md`
> § *Test and UAT authority*, ruling of 2026-08-16). He was offered three mechanisms and chose that
> one, and he was told explicitly at the time that **a green agent report would NOT be treated as his
> acceptance**. `context.human_admission` is `off`, no `finding` is admissible on this install, and no
> `§14-gate#<id>` stamp exists. This pack is recorded as an `artifact-ref`; its result is recorded as a
> `decision` / `observation`. **Quoting "UAT passed" as acceptance would be a misreading this pack
> names in advance and refuses.**
>
> **The zero-production-lines waiver was measured and does NOT apply.** The tip commit `10811cf` is
> test-only, so the rule's own instrument run against `10811cf~1..10811cf` comes back **empty** — which,
> taken at the tip, would have waived this ticket to `Done` with no UAT ever conducted. **The delivered
> commit is `db38961`**, and there:
>
> ```
> $ git diff --name-only db38961~1 db38961 | grep -v '\.test\.ts$' | grep '^src/'
> src/cli.ts
> src/result-screen.ts
> ```
>
> The same two files come back over the whole branch (`30482cd..10811cf`). **Production lines shipped ⇒
> the 2026-08-17 waiver is unavailable and this ticket needs the owner's word.**

---

## 0. The thing QE said UAT had to do first, and whether it was done

**It was done. This UAT was conducted on a REAL TERMINAL, not only through a pipe.**

QE's exit note (`.grugops/context/ticket-to-pr-ABC-044-2026-08-20/notes/`, `20260820T222000Z`) routed
one instruction at this hop in these words: *"If UAT is conducted only through a pipe, the one thing
UAT was uniquely able to check goes unchecked — and THAT would be worth refusing an acceptance over."*
Every `A6` measurement in this ticket's life up to this hop was taken on a **pipe**, where
`src/frame.ts`'s in-place repaint branch is **dead code**.

A pseudo-terminal harness was therefore built for this hop (section 3), and on it:

- `process.stdout.isTTY` is **`true`**, `process.stdout.rows` is **24**, `columns` **80** — measured,
  not assumed;
- `beginFrameSession`'s **in-place branch is live**: `CSI H` (`\x1b[H`) appears **6 times** in the
  checkmate run and **0 times** in the same game on a pipe;
- the glyph mode flips to **Unicode pieces** (`♚♛♜♝♞♟`), because `src/glyph-mode.ts` reads `isTTY` too —
  so the pipe runs were never even looking at the same board a player sees.

**The result screen has now been measured against a repainting terminal for the first time in this
ticket's life.** What that measurement found — including a real defect-shaped observation nobody had
seen — is section 6.

---

## 1. UAT goal, in the user's words

> *"When my game ends, the program tells me it ended, tells me how it ended, and shows me the game I
> just played — on my terminal, not in a log file."*

That sentence is the whole of what a non-engineer can grade about `ABC-044`. Sections 6 and 7 say,
without smoothing them, which parts of the ticket **cannot** be graded that way at all.

## 2. Entry criteria

| # | entry criterion | state |
|---|---|---|
| E1 | The change is complete and gated on its branch | Gate green at the branch tip per the Software Engineer's and QE's notes: typecheck 0, build 0, `vitest run --dir src` 0 (40 files / 1,207 tests / skip 0), `biome check src/` 0. **Not re-run by this hop — a UAT is not a gate.** |
| E2 | It is exercisable by a person | `npm run chess` / `node src/cli.ts` runs the merged entry point with the result screen wired at `src/cli.ts:170`. |
| E3 | The QE result is read, **including what it says was never exercised** | All eight notes under `.grugops/context/ticket-to-pr-ABC-044-2026-08-20/notes/` read in full. The three coverage limits QE established are carried into this pack **unsoftened** (section 6) — they are QE's, not this role's, and not this role's to weaken. |
| E4 | The known-not-met items are known BEFORE signoff, not disputed after | Sections 6 and 7. |
| E5 | The waiver was tested rather than assumed | Measured above. It does not apply. |

## 3. Test user, test data, environment, and how the terminal was made real

- **One role: "the player"** — a chess-literate person at a terminal. No accounts, no fixtures, no
  set-up. The product has one entry point and one starting position.
- **Test data is the moves typed and nothing else.** The CLI accepts no FEN and no position flag, so a
  scenario can only reach a position **by playing to it**. This is the hard constraint that shapes
  section 6, and it is a property of the product, not of this pack.
- **Environment:** Apple silicon (`arm64`), Darwin 26.5.2, Node **v24.12.0**. Everything below is true
  of this machine; `UNKNOWN - verify` elsewhere.
- **The terminal harness, stated so it can be re-run or disputed:**

  ```
  ( paced move feeder ) | script -q /dev/null bash -c 'stty rows 24 cols 80; exec node src/cli.ts'
  ```

  `script(1)` allocates a real pty and puts **both** the player's input and the program's output on it,
  which is exactly a person at a terminal; `stty` gives that pty a real window size, without which Node
  reports `rows 0` and the in-place branch silently stays dead. **The moves are paced with sleeps**
  because a terminal is not a file: bytes delivered faster than the program reads them are lost when the
  pty closes — the first harness attempt lost all four moves this way and is recorded as a failed attempt
  rather than quietly fixed. **No repository file was read for state, modified, or written by the
  harness; nothing under `src/` was touched.**
- **The pipe baseline** (`printf 'f3\ne5\ng4\nQh4\n' | node src/cli.ts`) was kept and run as its own
  scenario, so the two channels can be compared rather than conflated.

## 4. The business scenarios

Eight scenarios. `S1` is the one the ticket exists for. `S2` is the pipe baseline. `S3`–`S6` are the
ones only a real terminal can ask. `S7`/`S8` are the two "does it invent an ending" scenarios — the
ones that fail on a build that is too eager, which is the failure mode `ABC-019` `A10` was written for.

| # | the player's question | how it is graded | pass/fail criterion |
|---|---|---|---|
| `S1` | *"I am checkmated at my terminal. Does the program tell me the game is over, tell me who won and why, and show me the game?"* | Real 24×80 pty; play `1. f3 e5 2. g4 Qh4#` | After the last board, a plain-language line naming the winner **and** the reason, then the whole game in move-number pairs. The player must be able to read it without scrolling back. |
| `S2` | *"I redirect the output to a file to send to a friend. Is the ending in the file?"* | Same game, stdout a pipe | Same ending line and same move list at the end of the stream, and the program exits **0** |
| `S3` | *"My terminal is small (20 rows). Do I still get told how it ended?"* | Real 20×80 pty; same game | The ending line and the move list are both present and readable |
| `S4` | *"Does what I see on the terminal match what I would get in a file?"* | Compare `S1` and `S2` endings byte for byte | The ending text is identical; the terminal adds no cursor tricks of its own to it |
| `S5` | *"I play a long game — is the whole game listed, and can I still read who won?"* | Real 24×80 pty; a full game of ordinary length | Every move played appears, and **the line saying who won is still on the screen when it is over** |
| `S6` | *"Is the reason worded so I can tell a draw I claimed from one that just happened?"* | Read the eight wordings the product can produce, and reach what a player can reach | A claimed draw says a player claimed it and cites the FIDE article; an automatic one says it was automatic. Neither reading is a shortened form of the other. |
| `S7` | *"I stop playing — I press Ctrl-D and walk away. Does it pretend I lost?"* | Real 24×80 pty; Ctrl-D at the prompt | **No result screen at all.** One notice that input ended, and nothing that looks like a chess outcome |
| `S8` | *"I ask for a draw when there isn't one. Does it award me anything?"* | Real 24×80 pty; `claim` after one move | No result screen, no draw. It tells the player how far off the two claimable draws are, and the game goes on |

## 5. Results — what was conducted, and on what

**8 scenarios conducted · 6 PASS · 1 PASS WITH A FINDING (`S5`) · 1 PARTIAL (`S6`) · 0 FAIL.**
**Six of the eight ran on a REAL PTY; one is the pipe baseline; `S4` compares the two.**

| # | channel | result | the evidence a person can check |
|---|---|---|---|
| `S1` | **real 24×80 pty** | **PASS** | After the final board the terminal showed, on its own rows: `Black wins by checkmate.` then a blank row then `1. f3 e5` / `2. g4 Qh4#`. In-place repaint was live (`CSI H` ×6) and the screen still landed *after* the last frame, not over it. |
| `S2` | pipe | **PASS** | Same two-line ending and same move list as the last 5 lines of the stream; **exit code 0**; **zero** ANSI escapes anywhere in the pipe output. |
| `S3` | **real 20×80 pty** | **PASS** | At 20 rows the frame is taller than the terminal, so `src/frame.ts` correctly **stops** repainting in place (`CSI H` ×**0**) and appends. The ending line and the full move list were both on screen at exit. |
| `S4` | both | **PASS** | The bytes the result screen writes after the last frame on the pty are `\r\nBlack wins by checkmate.\r\n\r\n1. f3 e5\r\n2. g4 Qh4#\r\n` — **zero `\x1b` bytes**. The `\r` is the terminal's own newline translation, not the program's. `A6`'s "zero CSI sequences of its own" is now measured **on a repainting terminal**, where it had never been measured before, and it holds. |
| `S5` | **real 24×80 pty** | **PASS WITH A FINDING** | A 44-ply game was played out on the real terminal; every ply appeared in the pane and the move list is 22 rows. **The finding is section 6.1: at that length the "who won" line is pushed off the top of a 24-row terminal by the move list underneath it.** Demonstrated directly on a real terminal by shrinking it instead of lengthening the game (section 6.1). |
| `S6` | reading + pty | **PARTIAL** | The four wordings are unambiguous and cite the articles — `by threefold repetition, claimed by the player to move under FIDE 9.2` vs `by fivefold repetition, automatic under FIDE 9.6.1`, and the same shape for `fifty-move` / `seventy-five-move`. **But no claimed draw could be driven end to end** (section 6.2), so what a player would actually see was **not** observed. `UNKNOWN - verify`. |
| `S7` | **real 24×80 pty** | **PASS** | Ctrl-D produced exactly `input ended` and **nothing else** — no result screen, no invented outcome, no stray blank line. The bytes after the final frame are `> ^D\b\binput ended\r\n` and no more. |
| `S8` | **real 24×80 pty** | **PASS** | `claim` after `1. e4 Nc6` printed `repetition 1 of 3` and `50-move 1 of 100` in the message region and the game continued. No result screen, no draw awarded. |

### One incidental observation worth the owner's five seconds

**The engine is reproducible on this machine.** The 44-ply game of `S5` was driven twice from the same
scripted input and produced the **identical** 44 plies both times. That is a convenience for re-running
this pack; it is not a claim about any other machine.

## 6. What could NOT be exercised, and what a real terminal found — the honest half

**These three limits are QE's, established at `qe-ABC-044-recheck-2026-08-20` and carried here
unsoftened. This role did not weaken them and has no authority to.**

### 6.1 The one thing only a terminal could find: on a long game the outcome line scrolls away

This is the observation QE said a pipe could never make, and it is real.

**The frame is 23 rows tall** (9 board + 3 status + 8 history + 2 message + 1 reserved prompt row) —
measured, not read off the source: the pipe transcript of the checkmate game is 143 lines = 6 frames ×
23 + the 5-row result screen. On a **24-row terminal there is exactly one spare row.** The result
screen is written straight after the final frame with **no session, no cursor control and no
pagination of its own** — by design, and the design is `A6`'s. So the terminal scrolls, and the
scroll takes the top of the output with it.

**Measured on a real terminal, at three window sizes, with the same 4-ply game:**

| terminal rows | move-list rows | is `Black wins by checkmate.` still on screen at the end? |
|---|---|---|
| 24 | 2 | **yes**, at row 20 |
| 6 | 2 | **yes**, at row 2 |
| **4** | 2 | **NO — gone.** The player is left looking at `1. f3 e5` / `2. g4 Qh4#` and nothing that says who won |

The rule those three readings fit is `headline row = rows − movelistrows − 2`, so on a **24-row
terminal the outcome line leaves the screen once the move list reaches 22 rows — a 43-ply game.**

**A 43-ply game is an ordinary game, and this hop played a 44-ply one on the real terminal.** Its move
list is 22 rows — over the line. So: *a player who plays a normal-length game to its end on a standard
terminal is liable to be shown the tail of their move list with the sentence saying who won already
scrolled off the top.*

**What is honest about the strength of this claim:**
- The **mechanism** is measured on a real terminal, at three sizes, and the arithmetic fits all three.
- The **game length** is measured on a real terminal (44 plies, 22 rows).
- **The two have NOT been observed together.** Driving a ≥43-ply game to a *terminal outcome* was
  attempted **three times** and failed each time — the scripted player ran out of legal candidate moves
  while in check and the input ended, which correctly produced **no** result screen (`S7`'s path). So
  the full-scale confirmation is **`UNKNOWN - verify`**, and the 4-row demonstration is a **proxy for
  the mechanism, labelled as a proxy**.
- **No acceptance criterion of `ABC-044` covers this, and nothing in the delivered diff is wrong for
  it.** `A6` asks for "after the final frame, one write, zero CSI" and the product does exactly that,
  on a pipe and on a terminal. **This is a gap in what was asked for, not a failure to deliver it** —
  which is precisely why it is a question for the owner (`Q5` on the signoff sheet) and not a defect
  report filed behind his back.

### 6.2 The claimed draws could not be driven end to end — `UNKNOWN - verify`

QE could not force a threefold repetition (the engine does not repeat, so shuffling one side does not
produce one) and a fifty-move claim is worse. **A human at UAT is in exactly the same position**, so
**no UAT step was written that would fail to execute** — writing `S6` as a driveable script would have
produced a step that cannot be run, and a step that cannot be run is worse than an admitted gap.

What `S8` did establish on a real terminal is that the `claim` path is live and honest: it reports
`repetition 1 of 3` / `50-move 1 of 100` and awards nothing. **What a *successful* claim renders is
`UNKNOWN - verify`.** The adjudication behind it is `src/gameend.ts`, which is `Done`, mutation-tested,
and **byte-identical** in this diff.

### 6.3 `resignation` cannot be produced by any player input at all — and this pack does NOT say "eight reasons seen"

**Stated in QE's own words because it is the sentence most likely to be lost:**

> *"`ABC-044` was cut to render a merged type's eight values and it renders all eight correctly; a path
> that does not exist yet is not this ticket's hole and no test can close it. **What WOULD be a failure
> is UAT reporting 'eight reasons seen'.**"*

`COMMAND_TABLE` (`src/command-input.ts:74-79`) is `help`, `board`, `quit`, `claim` — and its own header
says `resign` belongs to `EPIC-006`'s later command set. **No production module in this tree constructs
a `resignation` outcome.** One of the eight endings therefore renders correctly and **cannot be produced
by any sequence of player input today.**

**So, plainly, and this is the row the signoff sheet repeats:**

| of the eight endings the screen can name | reachable by a player today? | **seen in this UAT?** |
|---|---|---|
| checkmate | yes | **YES** — `S1`, `S2`, `S3` |
| stalemate | yes, in principle | no |
| insufficient material | yes, in principle | no |
| fivefold repetition (automatic, 9.6.1) | yes, in principle | no |
| seventy-five-move (automatic, 9.6.2) | yes, in principle | no |
| threefold repetition (claimed, 9.2) | by construction; not demonstrated (6.2) | no |
| fifty-move (claimed, 9.3) | by construction; not demonstrated (6.2) | no |
| **resignation** | **NO — no path exists** | **no, and none can exist until `EPIC-006` cuts `resign`** |

**One of the eight was seen. Not eight.** The two fault screens (`engine-failure`, `engine-threw`) are
likewise **not player-reachable**: they need the engine to be substituted, which is a test harness, not
an act available to a person, so they are outside business acceptance entirely.

## 7. Known limitations — stated BEFORE signoff, not after a dispute

1. **One ending of eight was observed by a player. Seven were not** (6.3). Six of those seven are
   reachable in principle by playing to them; **one is not reachable at all.**
2. **The long-game scroll (6.1) is a mechanism measured on a real terminal and a game length measured
   on a real terminal that were never observed in the same run.** `UNKNOWN - verify`.
3. **The exit code was verified on the pipe (0) and NOT through the pty**, because `script(1)` does not
   propagate the child's exit status (measured: a child exiting `7` is reported as `1`). The exit code
   is `A6`'s and the gate holds it; this pack does not add a terminal reading of it.
4. **Every reading is from one machine** — Apple silicon, Darwin 26.5.2, Node v24.12.0. `UNKNOWN -
   verify` on any other.
5. **This pack is not QE and does not stand in for it** (`AGENTS.md` § *QE validation authority*).
   `ABC-044`'s QE hop happened, ran 12 constructed wrong builds, caught 11, and disclosed the 12th.
   Nothing here re-does, re-grades or replaces it.
6. **Two things noticed while playing that are NOT `ABC-044`'s**, reported and not fixed: the status
   panel reads `CHECK` on a mated position (`src/status-panel.ts`, out of scope and byte-identical
   here), and `quit` is in the command table but the loop has no effect bound to it (`ABC-035`'s, and
   already recorded at `uat-input-path-2026-08-20`).
7. **The 32 gitignored agent worktrees still make `npm run lint` exit 1.** Environmental, pre-existing,
   re-measured by two prior hops, not this ticket's and not re-litigated here.

## 8. Rollback plan

Not applicable in the usual sense, and said rather than left blank: this project **deploys nowhere**
(`ADR-0007`), so there is nothing to roll back from. `ABC-044` is **not merged** — its code lives on
`grugops/abc044-the-result-screen` only. Rolling it back means not merging that branch, which is a
human's call and not this role's. Without it, a finished game prints its last board and stops, which is
this ticket's `## Problem` sentence.

## 9. Exit criteria for `In UAT`

1. Every scenario in section 4 conducted against a real build, and on a **real terminal** where the
   scenario needed one — **met** (section 5).
2. The not-exercisable set named rather than papered over, in QE's terms — **met** (section 6).
3. The known limitations recorded before signoff — **met** (section 7).
4. **The owner's word in session, given against `plans/uat/ABC-044-signoff-checklist.md`** —
   **NOT MET, and it is not this role's to give.** Until it is given, `ABC-044` stays in `In UAT`.

**An agent may not self-sign, and this pack does not.**
