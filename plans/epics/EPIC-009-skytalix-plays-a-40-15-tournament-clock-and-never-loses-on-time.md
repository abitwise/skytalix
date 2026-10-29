---
id: EPIC-009
title: "`skytalix` plays a 40/15 tournament clock: two settings, `simple-tournament` and `uci-clock-mode`, that use the clock and never lose on time"
status: backlog
column: Backlog
priority: P2
size: M
owner: BA/PM
---

# EPIC-009: `skytalix` plays a 40/15 tournament clock, uses it, and never loses on time

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-amend-epic009`, records only, at `main` `a5d70e35`; `src/`, `data/`
> and `tools/` are byte-identical to `51c85f49`). The owner answered Q1–Q8 and closed `ABC-218` on 2026-10-29
> (`orch-2026-10-29g` `…a67f71ac`, his words verbatim; they govern). This page now follows those answers.
>
> - **Accepted.** The owner accepted the epic and its measures (Q8: "ok"). Status `proposed` → `backlog`.
> - **Two new settings, not levels:** `simple-tournament` (a fixed T a move under a 22.5 s hard ceiling, milestone 1)
>   and `uci-clock-mode` (the real clock, a margin, a hard stop and a 60 s ceiling, milestone 2, later). The owner
>   picked option (a) first and option (b) later (Q2).
> - **Levels 1–7 are unchanged.** So are the default (5) and the `Skill Level` default (5). Owner: "Let the difficulty
>   setting stay."
> - **UCI is the surface** (Q1: cutechess matches). CLI parity is out of scope (§ CLI parity).
> - **Proposed T for `simple-tournament` is 22.0 s**, under the 22.5 s ceiling (§ The budget T). The owner is told
>   the number; the ceiling is his and does not move.
> - **Readings:** each setting gets a 5-game smoke reading at 40/15. Major validation (≥ 100 games, 24–48 h) and any
>   strength reading come later and are out of this MVP.
> - **The input form for both settings is the Architect's** (`arch-epic009-settings`, running in parallel; no note had
>   landed when this page was amended). Every row below reads "form per the Architect's ruling" where it needs one.
> - **Tickets:** `ABC-218` closed by the owner, not run. `ABC-219` retired. `ABC-220` re-scoped to
>   `simple-tournament`. `ABC-221` re-scoped to `uci-clock-mode`. `ABC-222` re-scoped to `simple-tournament`'s smoke
>   reading. `ABC-223` is new: `uci-clock-mode`'s smoke reading. `ABC-224` is unused.
> - The notes are in `.grugops/context/bapm-amend-epic009/notes/`.
>
> **Cut 2026-10-29 by BA/PM** (task `bapm-epic009-tournament`, records only, at `main` `51c85f49`). The cut's notes
> are in `.grugops/context/bapm-epic009-tournament/notes/`.
>
> **Owner word that started it** (`ideas-2026-10-29/input/owner-ideas.md` § A, transcribed by the Orchestrator): *"add
> new difficulty to allow 40/15 move rule of tournaments: https://computerchess.org.uk/4040/index.html , basic
> solution would be to use 22.5 seconds per move, currently difficulty level 7 allows 30s per move. New difficulty
> could be named "tournament" or 40-15"*. § B item 4 of the same file (real clock management) came from an external
> chat model and is **UNKNOWN - verify** as a claim. The owner now asks for a clock mode himself (Q2, Q3), so it is
> built from his word and the System Analyst's map, not from § B.
>
> **Owner's answers, 2026-10-29, verbatim** (`…a67f71ac`): *"Close ABC-218 - no need to measure it, it is not
> deterministic and we can't anyway use it for tournament. Let the difficulty setting stay. My answers: 1. cutechess
> matches. For simpler tests use much less matches, 5 or 10, just to make sure things work, major validation with 100
> or more games comes later since it can run over 24 or 48 hours. 2. Initially let's add 22.5 second separate
> difficulty setting and use that, later UCI clock mode ; 3. it might make sense to use 2 new difficulty settings
> then, 22.5s one could be simple-tournament and other one uci-clock-mode (maybe separate inputs) ; 4. 22.5 ceiling ;
> 5. increase to 60s ; 6. not yet, let's do that after other improvements are done ; 7. no ; 8. ok"*

## How today's engine handles time (System Analyst `sa-ideas-verify` `…1ccf0010`, confirmed against BA/PM's reading)

The source is the System Analyst's time-behaviour note, `sa-ideas-verify` `…1ccf0010` (2026-10-29 19:58Z, read at
`main` `51c85f49`; committed on `grugops/sa-ideas-verify` @ `c28054cc`, not yet merged when this page was cut). BA/PM
read the same code independently before it landed, and the two readings agree on every row below. Where they differ in detail, the SA's note wins. The SA's probes P1–P5 are
single searches, not games: at `Skill Level` 7, `go wtime 900000 btime 900000 movestogo 40` spent **22 500 ms**
(P1); at level 5 the same `go` spent 3 000 ms (P2); `movestogo 1` with 2 000 ms left spent 1 951 ms (P4).

| # | fact | where |
|---|---|---|
| T1 | A level is a per-move budget plus a blunder rate. Level 7 is 30 000 ms, rate 0. The default is 5 (3 000 ms) | `src/levels.ts:49-60` |
| T2 | The CLI (`npm run chess -- --difficulty 1..7`) has **no game clock** for either side. The engine thinks its level's budget each move; the human has unlimited time. The PGN's `Difficulty` tag carries the ordinal | `src/cli.ts:113`, `:214`, `src/pgn.ts:86` |
| T3 | The UCI session already reads `wtime`/`btime`/`winc`/`binc`/`movestogo`. Its budget is `G = max(1, min(time / (movestogo ?? 20) + inc / 2, time − 50 ms))` | `src/uci-session.ts:67-69`, `:217-225` |
| T4 | **`G` is then capped at the `Skill Level`'s budget**: `min(G, LEVELS[skill].budgetMs)`. The default `Skill Level` is 5, so 3 000 ms | `src/uci-session.ts:285-287`, `:359` |
| T5 | The engine clamps every search at `HARD_CEILING_MS` = 32 000 ms and checks the clock every 1 024 nodes. The overshoot past the deadline was measured at ≤ ~31 ms (`AR-NFR004-A`; 30 004 ms at level 7, QE `qe-ABC-212` `A4`) | `src/engine.ts:44-55`, `:141`, `:151`; `plans/nfr-catalog.md` `NFR-004` |
| T6 | One thread: `isready` and `stop` during a search are answered up to one budget late (`ADR-0044` D5, accepted with no worker) | `src/uci-session.ts:14-19` |
| T7 | A book move answers at once, with no search, so it costs ~0 s of clock | `src/uci-session.ts:289-294` |
| T8 | The engine spends its whole budget even with one legal move (`ABC-212` OQ-212-2, ruled "spends 30 s"; SA probe P5: one legal move, 1 000 ms spent) | `ABC-212` § "Up to 30 s"; SA § 4 |

**What follows from T3–T4 under a 40/15 clock** (arithmetic, not a measurement; `UNKNOWN - verify`; `ABC-218`, which
was to read it, was closed by the owner, not run), at the first move of a period (900 000 ms left, `movestogo` 40,
so `G` = 22 500 ms):

| `Skill Level` | per-move budget | engine time over 40 moves (upper bound) | share of the 15 min |
|---|---|---|---|
| 1–4 | 100–1 000 ms | 4–40 s | ≤ 4 % |
| 5 (default) | 3 000 ms | 120 s | 13 % |
| 6 | 5 000 ms | 200 s | 22 % |
| 7 | 22 500 ms (the clock's share; the 30 s cap does not bind) | ≤ 900 s | ≤ 100 % |

- **So a GUI that sends a 40/15 clock with `movestogo` already gets about 22.5 s a move at `Skill Level` 7 today**,
  the owner's "basic solution", without a new level. At the default `Skill Level` 5 it gets 3 s and leaves 87 % of the
  clock unused. That is the pain a GUI user sees.
- **The margin is thin at a period's last move.** With `movestogo` 1, `G` = remaining − 50 ms. The in-process
  overshoot is ≤ ~31 ms (T5), and the pipe and GUI latency is `UNKNOWN - verify`. A loss on time is possible there.
- **Book moves bank time** (T7), so later moves in a period get a little more than 22.5 s, up to level 7's 30 s.
- If the GUI does **not** send `movestogo`, the session spreads the clock over 20 moves (T3). It cannot run the clock
  below 50 ms by arithmetic, but it spends unevenly. Which GUIs send it for a repeating control is `UNKNOWN - verify`.

## What 40/15 means on this page

- **40/15 = 40 moves in 15 minutes, repeating**: after each 40th move the side's clock gains another 15 minutes. No
  increment. In `cutechess-cli` this is `tc=40/900` (spelling `UNKNOWN - verify` against the pinned 1.5.1 at
  `ABC-222` `A1`).
- **A fixed 22.5 s a move is exactly 900 s over 40 moves**, so it has **zero margin** on a real clock. On a clock, any
  fixed budget needs to be below 22.5 s, or it relies on T3's arithmetic to stop it.
- **CCRL's own rules are not confirmed here** (no web access at this hop). Each item below is **UNKNOWN - verify**, and
  nothing on this page depends on it:
  - whether the CCRL 40/15 time is adjusted to a reference machine, and by how much;
  - whether pondering is on or off;
  - the thread count, hash size, opening book, tablebases and adjudication rules;
  - the GUI it uses, whether that GUI sends `movestogo`, and its time margin before a loss on time;
  - whether the linked page (`/4040/`) describes the 40/15 list or an older 40/40 list.
- **Entering CCRL itself is out of scope** (§ Out of scope). This epic makes `skytalix` able to *play* a 40/15 clock.

## Problem

- **User:** a `cutechess-cli` (or other UCI GUI) match at a CCRL-style 40/15 clock, engine against engine (Q1).
- **Pain.**
  - At the default `Skill Level` 5, a 40/15 clock is 87 % unused: the engine plays 3 s moves (T4).
  - `Skill Level` 7 gets about 22.5 s a move, but nothing names it as the 40/15 setting. Its margin at a period's last
    move is 50 ms (T3), so it can lose on time. Its time per move depends on the clock the GUI sends.
- **Value:** two named settings that a match picks for 40/15. Each uses most of the clock and never loses on time.
  The human-facing levels 1–7 stay as they are.

## The two settings (Q2, Q3)

| | `simple-tournament` (milestone 1) | `uci-clock-mode` (milestone 2, later) |
|---|---|---|
| what it does | Thinks a fixed T each move, blunder rate 0 | Spends the real clock: remaining ÷ `movestogo` (a fallback without it), a safety margin on every move, a hard stop before the flag |
| per-move ceiling (owner's) | **22.5 s**, hard, never exceeded (Q4) | **60 s**, replacing the 32 s clamp for this mode only (Q5) |
| budget | **T = 22.0 s, proposed** (§ The budget T) | From the clock, ≤ 60 s |
| surface | UCI (cutechess). Form per the Architect's ruling | UCI. Form per the Architect's ruling |
| build ticket | `ABC-220` | `ABC-221` |
| smoke reading | `ABC-222` | `ABC-223` |

- **Form.** The owner allowed "maybe separate inputs". Whether each is its own UCI option, a value outside 1–7, or
  something else is the Architect's ruling (`arch-epic009-settings`). So is the exact `option.<Name>=<value>` line
  that `cutechess-cli` sends to select each. The constraint is the owner's: levels 1–7 stay unchanged, and they stay
  ordered weakest to strongest (SA `…1ccf0010` § 8).
- **How `simple-tournament` meets a `go` clock** (whether a GUI clock caps it, or it ignores `wtime`) is the
  Architect's ruling too. § The budget T shows that M1 and M2 hold at 40/15 either way.

## The budget T for `simple-tournament` (Q4 with Q8)

The owner set a 22.5 s ceiling (Q4) and accepted a closest call ≥ 500 ms (Q8). A fixed 22.5 s a move is exactly
900 s over 40 moves. So 22.5 s cannot meet both, and T must sit below the ceiling. **The ceiling does not move.**

- **Model.** Each move costs the clock `s = T + o`. Here `o` is the per-move overhead:
  - the in-process overshoot past the deadline, ≤ ~31 ms (`AR-NFR004-A`; measured 4 ms at 30 s, `qe-ABC-212` `A4`;
    1 ms at 22.5 s, SA probe P1);
  - the pipe and GUI latency: **`UNKNOWN - verify`**, read by `ABC-222`.
- **The clock left after a period's 40th move** (no book moves): `c = 900 000 − 40 × (T + o)` ms.
- **Q8 holds** when `c ≥ 500`, so `T + o ≤ 22 487.5 ms`.
- **Q4 holds** when `T + 31 ≤ 22 500` (the overshoot bound), so `T ≤ 22 469 ms`.
- **At T = 22 500 ms**, `c` would be −40 × `o`. Today's `go` rule (`G = remaining − 50` on the last move) saves the
  flag, but the closest call is ~50 ms less `o`. That misses Q8. It is the 50 ms the cut found.
- **At T = 22 000 ms (proposed):**
  - `c = 20 000 − 40 × o`. That is 18 760 ms at `o` = 31 ms. Q8 still holds while `o` ≤ 487 ms a move. The unknown
    latency has about 16 × the room of the known overshoot.
  - The headroom under the 22.5 s ceiling is 500 ms a move. That is ≥ 16 × the 31 ms overshoot bound.
  - **M2 holds.** A period with no book moves uses 40 × 22 000 / 900 000 = **97.8 %**. The book stops at ply 12
    (`data/opening-book/book.json` `maxPly`), so at most 6 of a side's first-period moves are free. Then 34 × 22 000 /
    900 000 = **83.1 %**. M2's 75 % fails only if 10 or more moves in a period cost ~0 s. The book cannot cause that.
  - **The cost** against 22.5 s is 0.5 s a move, 2.2 % of the clock.
- **Today's `go` rule never binds at 40/15 with `movestogo`.** With `s < 22 500`, the share `remaining / movestogo`
  stays ≥ 22 500 ms on every move. So a GUI cap, if the Architect rules one, gives T on every move.
- **If `cutechess-cli` sends no `movestogo`** (`RISK-EPIC009-03`, `UNKNOWN - verify`), there are two cases.
  - A GUI cap, if ruled, spreads the clock over 20 moves (T3). T binds for the first 21 moves, then `remaining / 20`
    applies. That leaves ~165 s after the 40th move and uses ~81.6 % (no book).
  - With no cap, the result is as above: 18.8 s left and 97.8 % used.
  - So M1 and M2 hold either way.
- **Why not closer to the ceiling.** T = 22 450 ms would leave `c` = 760 ms at `o` = 31 ms. Only 260 ms would remain
  for the unread latency. A smoke reading of 5 games cannot vouch for that.
- **The number the owner is told:** `simple-tournament` thinks **22.0 s a move**, never more than 22.5 s. At 40/15 it
  ends a period with about 18–19 s left, and uses about 98 % of the clock (83 % in the first period when the book plays
  6 moves). The Architect may refine T in the same ADR. If his T differs, the page follows his ruling and the
  owner is told the new number. The numbers above hold for any T ≤ 22 000 ms.

## CLI parity: out of scope

The call (the Orchestrator's brief asked whether it is worth keeping): **not kept.** CLI parity is neither cheap nor
clean.

- **No user.** Q1 names `cutechess-cli` matches. No one plays the 40/15 setting in the CLI. Q7 ("no" think time in
  the CLI) points the same way.
- **Nothing to honour.** The CLI has no clock (T2). A "tournament" setting there is only a 22 s pace with no flag to
  lose. Level 7 (30 s) already gives a slow CLI opponent.
- **Not cheap.** It is the whole of the retired `ABC-219`, size M:
  - the `Difficulty` union and the ordinal-only, exact-equality lookup in `src/cli-options.ts`;
  - the usage line and the refusal text;
  - the start-up question (`ABC-200`);
  - the PGN `Difficulty` tag and the player name;
  - the test suites `src/cli.test.ts`, `src/startup-questions.test.ts` and `src/render.test.ts`.
- **Not clean.** If the Architect rules a separate UCI option (the owner's "maybe separate inputs"), the CLI would need
  a second input of its own for a mode with no clock to spend. That is two shapes for one setting.
- **If the owner later wants it,** it is a new small ticket on his word. Nothing here blocks it.

## Scope

- `ABC-220`: `simple-tournament` over UCI, at T (22.0 s proposed) under a 22.5 s hard ceiling. Milestone 1.
- `ABC-222`: the 5-game smoke reading of `simple-tournament` at 40/15. Milestone 1.
- `ABC-221`: `uci-clock-mode` over UCI, with the real clock, a margin, a hard stop and a 60 s ceiling for this mode
  only. Milestone 2, later (Q2).
- `ABC-223`: the 5-game smoke reading of `uci-clock-mode` at 40/15. Milestone 2.
- The Architect writes the ADR text: amendments to `ADR-0044` and `ADR-0045`, or a new ADR, status PROPOSED. It covers
  the input form, T, the `go` interaction, the two ceilings and the `NFR-004` lines. The owner accepts or declines it.
  BA/PM does not pre-empt it.

## Out of scope

- **Changing levels 1–7, the default (5), their budgets or their 32 s clamp.** Gate: `LEVELS[1..7]` and `DEFAULT_LEVEL`
  are byte-identical, and the `Skill Level` default stays 5.
- **CLI parity** (§ CLI parity), and a clock in the CLI.
- **Major validation:** ≥ 100 games at 40/15, 24–48 h (Q1). It comes later, as its own ticket on the owner's word.
- **A strength reading or claim at 40/15** (Q6: "not yet, let's do that after other improvements are done"). No setting
  claims an Elo.
- **Showing think time in the CLI** (Q7: no).
- **Spending more time on a hard move** (a search change). Pondering, threads, and a worker for `isready`/`stop`
  (`ADR-0044` D5 stands).
- **Entering CCRL or any rating list.** That is distribution: `ADR-0049` and the owner's call.
- **`EPIC-010`'s improvements** (`ABC-225..239`).

## Success measures (accepted by the owner, Q8, 2026-10-29)

| # | measure | target | how it is read |
|---|---|---|---|
| M1 | **Never loses on time** | In each setting's smoke reading, `skytalix` loses **0** games on time, and its closest call (the least clock left after any of its moves) is **≥ 500 ms** | `cutechess-cli` 1.5.1, `timemargin=0`, 5 games at `tc=40/900` (`ABC-222`, `ABC-223`) |
| M2 | **Uses the clock** | Over each completed 40-move period, `skytalix` uses **≥ 75 %** of the 900 s it was given, book moves included, per side | per-move times from the PGN, summed per period |
| M3 | **The human-facing levels are unchanged** | `LEVELS[1..7]` and `DEFAULT_LEVEL` are byte-identical to base. `Skill Level` default is 5. At `Skill Level` 1–7 with neither setting selected, `G` over one simulated 40/15 period equals base, row for row | `git diff`; each build ticket's identity row |
| M4 | **The owner's decisions stayed his** | 0 NFR bounds moved without his word: 22.5 s and 60 s are his. Each new ADR text is reported to him when it lands. T is told to him | the ADR pages and the owner-word notes |

- **Each setting's per-move ceiling is read too.** The longest move is ≤ 22 500 ms (`simple-tournament`) or ≤ 60 000 ms
  plus `AR-NFR004-A`'s ≤ ~31 ms (`uci-clock-mode`).
- **A smoke reading shows that it works, nothing more** (Q1). Five games cannot bound a forfeit rate. That needs the
  later major validation.
- **Strength is not a measure** (Q6). Self-play does not stand in for an outside opponent (`RISK-EPIC008-03`,
  `arch-epic008-rd` `…0c5d62f4`).

## Tickets (order is the pull order; the pages are under `plans/tickets/`)

| order | id | title | size | priority | column | DoR | depends on | waits on |
|---|---|---|---|---|---|---|---|---|
| — | `ABC-218` | Reading: today's `Skill Level` 7 under a 40/15 clock | S | P2 | Done (dropped) | — | — | **closed by the owner 2026-10-29, not run** |
| — | `ABC-219` | A named tournament level in the CLI | M | P2 | Done (dropped) | — | — | **retired 2026-10-29**: CLI parity out of scope; its core moved into `ABC-220` |
| 1 | `ABC-220` | `simple-tournament` over UCI: a fixed T a move (22.0 s proposed) under a 22.5 s hard ceiling | M | P2 | Backlog | 9/10 | — | **only the Architect's ruling** (`arch-epic009-settings`: the form, the `go` interaction, T) |
| 2 | `ABC-222` | Smoke reading: `simple-tournament` plays 5 games at 40/15 with 0 losses on time | S | P2 | Backlog | 9/10 | `ABC-220` merged; an idle board | `ABC-220` |
| 3 | `ABC-221` | `uci-clock-mode` over UCI: the real clock, a margin, a hard stop, a 60 s ceiling | M | P3 | Backlog | 9/10 | milestone 1 done (owner: "later") | **the Architect's ruling** (`ADR-0044` D4/D5 for the mode) |
| 4 | `ABC-223` | Smoke reading: `uci-clock-mode` plays 5 games at 40/15 with 0 losses on time | S | P3 | Backlog | 9/10 | `ABC-221` merged; an idle board | `ABC-221` |

- **Milestone 1** is `ABC-220` then `ABC-222`. **Milestone 2** is `ABC-221` then `ABC-223`, after milestone 1 and on
  the owner's "later".
- `ABC-221` is P3 because the owner sequenced it after milestone 1. It needs no other code from `ABC-220`. They share
  `src/uci-session.ts`, so whichever merges second rebases.
- **`ABC-224` is unused.** It goes back to the Orchestrator's pool.

## Owner questions (all answered 2026-10-29, `…a67f71ac`)

| Q | asked | answer (2026-10-29) | what it changed |
|---|---|---|---|
| Q1 | Who plays the 40/15 setting? | "cutechess matches". Smoke readings of 5 or 10 games. Major validation (≥ 100 games, 24–48 h) later | UCI is the surface. CLI parity is out. Smoke readings are 5 games. Major validation is out of the MVP |
| Q2 | Which option? | "Initially … 22.5 second separate difficulty setting …, later UCI clock mode" | (a) first (`ABC-220`), then (b) later (`ABC-221`). Option (o) and `ABC-218` are gone |
| Q3 | The name? | "2 new difficulty settings … simple-tournament and … uci-clock-mode (maybe separate inputs)" | The names are fixed. The form is the Architect's |
| Q4 | T and its ceiling | "22.5 ceiling" | The hard ceiling is 22.5 s. T = 22.0 s is proposed under it (§ The budget T); the owner is told |
| Q5 | The clock mode's per-move ceiling | "increase to 60s" | 60 s for `uci-clock-mode` only. The 32 s clamp stays for levels 1–7 |
| Q6 | A strength reading at 40/15? | "not yet, … after other improvements are done" | None in this epic |
| Q7 | Think time in the CLI? | "no" | Out of scope |
| Q8 | Accept the epic and M1–M4? | "ok" | Accepted: 0 losses on time, closest call ≥ 500 ms, ≥ 75 % per period |

- **No owner question is open.** Two items are reported to the owner and not asked: T = 22.0 s, and the Architect's
  ADR text when it lands (he accepts or declines it).
- **Not a question for the owner:** how the clock mode's margin is built, the readings' exact command lines, and the
  thermal rule. That is delivery under his delegation (`…5aaf7cec` item 1).

## Options as cut (history, superseded 2026-10-29 by Q2)

The cut framed (o) nothing new, (a) a fixed-budget level, (b) clock-based allocation over UCI, and (c) both. The owner
picked **(a) first, then (b) later**, as two separate settings. That is close to (c) without the CLI half. The
original table is in git at `f45aea95`.

## Dependencies

- **The Architect, `arch-epic009-settings`** (running in parallel). It rules the input form of both settings, the
  `go` interaction for `simple-tournament`, the clock mode's rule, its margin and stop, and the ceilings. It also
  writes the `NFR-004` change. `ABC-220` and `ABC-221` wait on it, and on the owner's acceptance of the ADR.
- `ABC-204`'s pinned host tools (`cutechess-cli` 1.5.1), re-pinned on this host on 2026-10-28. Their paths come from
  the environment and stay out of the records (`ADR-0049` d4).
- `tools/rating/rating.ts` plays a fixed time per move (`st=`). It has no `tc=40/900` mode, so `ABC-222` and `ABC-223`
  run `cutechess-cli` directly in QE's scratch clone. No `tools/` edit is needed.
- `ABC-220` and `ABC-221` touch `src/uci-session.ts`, `src/levels.ts` and/or `src/engine.ts`, as the Architect rules.
  No open ticket holds them today.
- `sa-ideas-verify` `…1ccf0010` is the source of § "How today's engine handles time".

## Risks

- **`RISK-EPIC009-01`: a loss on time at a period's last move.** With `simple-tournament` at T = 22.0 s, the margin
  there is ~18.8 s by arithmetic. With `uci-clock-mode`, the margin is a requirement. The pipe and GUI latency is
  unread. `ABC-222` and `ABC-223` read it in 5 games each. Only the later major validation bounds it.
- **`RISK-EPIC009-02`: a GUI gives up on `isready` or `stop` mid-search.** An answer can be one budget late
  (`ADR-0044` D5): up to 22.5 s for `simple-tournament` and up to 60 s for `uci-clock-mode`, against level 7's 32 s
  today. `ADR-0045` A4 records `cutechess-cli` killing an engine at its 15 000 ms `IdleTimeout` after a mid-search
  `stop`. It sends one at a game end or when pondering. The Architect rules on this residual. The smoke readings
  count such kills.
- **`RISK-EPIC009-03`: a GUI that does not send `movestogo`.** § The budget T shows that M1 and M2 hold for
  `simple-tournament` either way. `uci-clock-mode` needs a fallback rule (the Architect's). The smoke readings log what
  `cutechess-cli` sends.
- **`RISK-EPIC009-04`: wall time and heat.** A 5-game 40/15 smoke reading is ≤ ~5 h at width 1 (games capped at 80
  moves; § `ABC-222`). This host ran a Tctl median of 73–80 °C at width 1 over hours (`…ef6ab697`). Each reading runs
  ALONE, on AC, with a thermal and frequency log. A frequency fall over 5 % makes it UNRESOLVED.
- **`RISK-EPIC009-05`: a strength story slips in.** "A slower setting must be stronger" is a forecast, not a reading.
  Q6 keeps strength out.
- **`RISK-EPIC009-06`: a forced move costs a full 22.0 s.** `simple-tournament` spends T on one legal move too (T8).
  This is accepted. A clock with banked time can absorb it; `simple-tournament` banks nothing.
- **`RISK-EPIC009-07` (new): 60 s searches and memory.** `NFR-009` (≤ 16 MiB held, growth ≤ 1 MiB) was read MET at
  30 s (`ABC-212`). A 60 s ceiling is outside that reading, so `ABC-221` owes a re-read.

## NFR triggers

- **`NFR-004` (owner's).**
  - `simple-tournament`: a ceiling of **22.5 s** (Q4). This departs from `ABC-212`'s "budget + 2 s" rule, by the
    owner's word.
  - `uci-clock-mode`: **60 s** (Q5), above today's 32 s clamp, for this mode only. Levels 1–7 keep their rows and the
    32 s clamp.
  - The Architect names the change, and Security/NFR places the text. `AR-NFR004-A` (≤ ~31 ms) is re-read at each gate.
- **`NFR-009`:** 22.5 s is inside `ABC-212`'s 30 s reading, so `ABC-220` owes no re-read. 60 s is outside it, so
  `ABC-221` owes one (≤ 16 MiB, growth ≤ 1 MiB).
- **`NFR-008`: `npm test` wall ≤ 10 s at load1 ≤ 8.** New rows run on the virtual clock only. There are 0 real-clock
  rows in the default lane.
- **`NFR-005`, `NFR-011`, `NFR-012`: untouched.** Their referent is `Skill Level` 5, which does not change.
- **`ADR-0044` D5 latency:** ≤ 22.5 s and ≤ 60 s (`RISK-EPIC009-02`). The Architect rules on it.
- **Security (ASVS L1):** each setting is one value in a closed set, in the form the Architect rules. `go`'s numeric
  tokens are already parsed and refused today. Security/NFR confirms at each gate.

## Test notes

- Readings never run in `npm test` (`NFR-008`). They run in QE's scratch clone, ALONE, like `ABC-202` and `ABC-204`.
- The clock arithmetic is pinned on the virtual clock (`src/virtual-clock.ts`, `ADR-0027`), one whole simulated 40/15
  period per row, with the injected `now`.
- Each build ticket changes production lines, so UAT is owed. The QE verdict signs it under the owner delegation
  (`…5aaf7cec` item 2). The owner may play a match; nothing waits on it.
