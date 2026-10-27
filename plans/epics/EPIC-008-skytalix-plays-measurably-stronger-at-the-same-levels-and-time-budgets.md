---
id: EPIC-008
title: "`skytalix` plays measurably stronger at the same levels and time budgets, measured by a rating harness and not by one game"
status: backlog
column: Backlog
priority: P2
size: L
owner: BA/PM
---

# EPIC-008: `skytalix` plays measurably stronger at the same levels and time budgets

> **Cut 2026-10-23 by BA/PM** (task `bapm-cut-engine-strength`, records only, at `main` `55a8f4ef`). The rulings are in
> `.grugops/context/bapm-cut-engine-strength/notes/`.
>
> **Owner word.** `owner-word-2026-10-23` `…7feb0553`, item 2: all eight improvement proposals of Architect/Design's
> game-1 analysis (`…f1771bb3`, `memory-bank/analysis/2026-10-23-game-1.md` § 6) are accepted. The note also says
> that the owner's acceptance of a proposal is the go-ahead for the ADR work it needs. Each ADR text is still reported
> to him when it lands, and moving an NFR bound stays his.
>
> **No Elo target is set here.** The owner gave none. One is proposed as owner question Q1, below.
>
> **Updated 2026-10-24 by BA/PM** (task `bapm-cut-levels-6-7`, records only, at `main` `6c0ab29e`). The owner's word
> `owner-word-2026-10-23` `…e44d2903`: *"1. +100 target ok ; 2. run whenever idle ; I think we can add 2 more
> difficulty settings …"*.
> - **Q1 answered: M1's target is ≥ +100 Elo** (point estimate), with the 95 % interval above 0. See § Success
>   measures.
> - **Q2 answered: readings run whenever the board is idle,** one at a time, on AC, alone among agent hops (as
>   `ABC-202` ran). No owner window is needed.
> - **Levels 6 and 7 are not in this epic.** They are cut as `ABC-212` under `EPIC-004`'s levels line, because this
>   epic holds the levels fixed. `G5` and `G9` are re-read below, and nothing else in this page moves.

## Problem

- **User:** the owner, who plays `npm run chess` at the default level 5 and drives `skytalix` from a UCI GUI.
- **Pain:** in game 1, `skytalix` lost to Apple Chess. It left its king in the centre while the centre opened
  (13.d4??). From move 10 to move 29 it judged itself 3 to 5.5 pawns better off than Stockfish did. The analysis puts it
  at roughly 1400-1900, centred near 1650. That figure comes from one game, with an error of at least ±300.
- **Value:** a stronger opponent at the same levels and time budgets, shown by a number with an error bar and not by
  one game. Every change is measured before it ships. A change that does not measurably help does not ship.

## The cheapest slice that proves the value

Ticket `ABC-204` builds the harness first, and every later ticket is measured with it. A ticket ships only on its own
reading, so a later ticket never carries an earlier one's unmeasured change. The epic can stop after any ticket and
still hold only measured gains.

## Scope

- One rating harness under `tools/`, outside `npm test` (`ABC-204`).
- Seven engine changes, one per accepted proposal, each behind its own reading (`ABC-205` to `ABC-211`).
  - *2026-10-25 (BA/PM, `bapm-close-ABC-205`):* proposal 1 (`ABC-205`, king safety) is **not shipped**. It was
    closed unmerged under S1, because `G6` "≥ base" missed on `position-6` (`…234d9814`, `…912bcb0d`, `…154f2ced`).
    Six engine changes remain (`ABC-206` to `ABC-211`), and `ABC-206` is Done.
  - *2026-10-26 (BA/PM, `bapm-s1-ABC-207`):* proposal 4 (`ABC-207`, per-piece mobility weights and the early-queen
    term) is **not shipped**. It was closed unmerged under S1, because D was LOSS: pooled over 800 games, −18.3 ±
    16.5 (`…cc744e8c`, `…243de4b1`). Four engine changes remain unbuilt (`ABC-208` to `ABC-211`), and `ABC-206` is Done.
  - *2026-10-26 (BA/PM, `bapm-close-ABC-211`):* proposal 8 (`ABC-211`, the deeper English book) is **not shipped**. It
    was closed undelivered on the owner's pick O0 (`…58bcd17c`): there is no new source, and the pinned source has no line
    that reaches 3...b6 (`…7bb8daf1`). Three engine changes remain (`ABC-208` to `ABC-210`). The owner accepted
    `ADR-0050`, and `ABC-208` is in its reading.
  - *2026-10-27 (BA/PM, `bapm-s1-ABC-209`):* proposal 6 (`ABC-209`, the transposition table kept across one game) is
    **not shipped**. It was closed unmerged under S1, because D was NEUTRAL after the one extension: pooled over 800
    games, +8.7 ± 18.3 (`…e32e0ee4`, `…0932c037`). One engine change remains unbuilt (`ABC-210`). `ABC-206` is Done,
    and `ABC-208` is Done (merged `b5c67ab7`).
  - *2026-10-27 (BA/PM, `bapm-s1-ABC-210`):* proposal 7 (`ABC-210`, a check extension at the horizon) is **not
    shipped**. It was closed unmerged under S1, because D was NEUTRAL after the one extension: pooled over 800 games,
    −4.8 ± 16.2 (`…b953e670`, `…86b45c13`). **No engine change remains.** Of the seven, two shipped: `ABC-206` (the
    speed-up, value-identical) and `ABC-208` (null move). Five did not: `ABC-205`, `207`, `209` and `210` under S1, and
    `ABC-211` on the owner's O0. The provenance change `ABC-215` shipped under S3. The epic's close path is under
    § Tickets.
- *2026-10-24 (BA/PM, `bapm-ABC-214-path-a`):* one provenance change, `ABC-215`. It re-derives the CC BY-SA 3.0
  values on the owner's path A (`…fb0468ff`) and is measured under S3.
- *2026-10-24 (BA/PM, `bapm-cut-readme`):* one test-only follow-up, `ABC-217` (Ready, XS, P3). It moves `ABC-206`'s
  `QE-206-a`/`-b` catches into the default lane and rewords two stale `gameStatus` texts. It carries `ABC-212`'s
  `QE-212L-a` along. No engine value changes, so no reading or ship rule applies.
- `src/evaluate.ts`, `src/engine.ts`, `src/search.ts`, `src/quiescence.ts`, `src/gameend.ts`, `src/transposition.ts`
  and `data/opening-book/` change, each only in the ticket that names it.

## Out of scope

- **The levels and their budgets.** `src/levels.ts` `LEVELS`, `DEFAULT_LEVEL` and `HARD_CEILING_MS` stay byte-identical
  (gate `G9`). "The same levels and time budgets" is what this epic holds fixed.
  - *2026-10-24 (BA/PM, `bapm-cut-levels-6-7`):* the owner's new levels 6 (5 s) and 7 (30 s) are `ABC-212`, under
    `EPIC-004`. No ticket of this epic edits them. `ABC-212` is value-identical at levels 1–5 (its `A3`: 50 of 50
    `(move, kind, depth, nodes)` equal to base), so its merge does **not** stale a D reading under § "When a D reading
    goes stale". Its real-clock readings (about 8 min, width 1) never overlap a harness reading.
- **A user-visible Elo.** The harness's number is a reading kept in the records. No level, option or screen claims an
  Elo (`src/levels.ts` header; `EPIC-007` § Success measures).
- **Entering a rating list or a competition.** That means distributing the engine to third parties. It touches
  `ADR-0007`, `ADR-0018` and `ADR-0044` D8, and it is the owner's call (`…7feb0553` item 4). The harness runs only on the
  owner's Mac and publishes nothing.
- Threading, aspiration windows, SEE, delta pruning and a king-zone attacker term. The analysis offers the attacker
  term as a later option ("if it is still needed"). It is not cut.
- Tuning against game 1. Game 1's positions are reported (gate `G11`), never graded.

## The two readings (pinned by `ABC-204`; defined here once)

Every number is the output of `cutechess-cli` 1.5.1 at its pinned path (`ABC-202` § The tool, pinned; sha256
`fb4fc2aa…6e1c`). Its result line `Elo difference: X +/- Y` gives `Y` as the half-width of the 95 % interval
(`projects/lib/src/elo.cpp:44-49` at `5e84232b`: `phiInv(0.025)`, `phiInv(0.975)`). The harness computes no Elo of its
own.

- **R, the rating reading** (the epic's measure). It plays the built `skytalix` (`dist/uci.js`, default options:
  `OwnBook` on, `Skill Level` 5) against Stockfish 19 (`/opt/homebrew/bin/stockfish`, sha256 `dc2f18c3…251f`), set
  to `UCI_LimitStrength true` and a fixed `UCI_Elo` **E**. `skytalix` gets level 5's 3 000 ms per move. The reading is
  **200 games**: 100 pinned openings, each played with both colours. The rating is E + X ± Y, **on Stockfish 19's
  `UCI_Elo` scale at the harness's time control on this host**. It is not FIDE and not CCRL. E is fixed once by
  `ABC-204` and then frozen for the epic.
- **D, the delta reading** (each ticket's measure). It plays the candidate artifact (branch head) against the base
  artifact (the branch's merge-base on `main`), with the same options, the same per-move budget and the same openings.
  The reading is **400 games**, and its result is X ± Y Elo for the candidate. The per-move budget is 3 000 ms, unless
  `ABC-204` `A6` rules a shorter fixed one. It cannot go below 1 000 ms, and once ruled it is frozen for the epic.

**States of a D reading:**
- **GAIN:** X − Y > 0.
- **LOSS:** X + Y < 0.
- **NEUTRAL:** anything else.
- **UNRESOLVED:** an illegal move, a disconnect, a stall or a time forfeit by either side. Fewer games than pinned, a
  missing raw file, or a watchdog stop also make it UNRESOLVED. The cause is named, and the reading is re-run once.

**Ship rules:**
- **S1, for value-changing tickets (`ABC-205`, `207`, `208`, `209`, `210`).**
  - GAIN is MET.
  - NEUTRAL gets one extension: 400 more games with the same pins, pooled, and the pooling is reported. GAIN after
    the extension is MET.
  - Anything else is NOT MET. The branch is not merged, a `failed-attempt` note records the reading, and the ticket
    goes back to BA/PM. BA/PM allows at most one re-tune round per ticket, then closes or re-cuts it.
- **S2, for value-identical and data-only tickets (`ABC-206`, `ABC-211`).** The ticket meets its own mechanical bar,
  and its D reading is not LOSS.
- **S3, for a provenance change (`ABC-215`).** *Added 2026-10-24 by BA/PM (`bapm-ABC-214-path-a`).* D is not LOSS.
  A NEUTRAL with X < 0 gets the one extension (pooled), and it must still be not LOSS. LOSS is NOT MET, with at most
  one re-tune round. This is a delivery call, flagged as cheap to reverse like S1. Why it is not S1 or S2:
  `ABC-215` § Acceptance.

**When a D reading goes stale.** A reading is valid against the base it was read on. A value-identical merge
(`ABC-206`) or a records-only merge in between leaves it valid. A value-changing merge into `src/` or `data/` in
between makes it stale. The Orchestrator then asks for a re-read on the new base.

**Host.** Every reading runs on AC power, alone among agent hops (width 1), with a host log and a watchdog. This is
the `ABC-202` § Host preconditions pattern. Load from other processes slows both engines and adds noise, but it does
not favour either side. A FAIL-class fault on a host that is not quiet is UNRESOLVED, not a result.

## Common gates (each ticket names the ones it owes)

| gate | what | bar | source |
|---|---|---|---|
| `G1` | Puzzle suite, `PUZZLE_DEEP=1` | solved **≥ 54 of 58** | `src/puzzle-suite.baseline.json`. A red is classed per row under `ADR-0034`. Raising the baseline is QE's; lowering it needs the owner's word |
| `G2` | Complete evaluation cost | mean **≤ 1 100 ns** per call, with the base read in the same session | `ABC-083` `A5`; `ADR-0031`'s near-bar rule: a mean of 990–1 210 ns is read again in a second session in reverse order |
| `G3` | Evaluation relations | `ABC-083` `A1` (mirror, exact equality), `A2`, `A3`, `A4` (mobility within **±100 cp**) and `A6` (purity, byte-identical) stay green | `src/evaluate*.test.ts` |
| `G4` | Search identity and oracles | `ABC-078` `A3` identity sweep green. The `ADR-0026` bounded oracle is green. Every test-only door that exists before the ticket reproduces its pre-ticket search node for node | `src/engine.test.ts`, `src/search*.test.ts` |
| `G5` | `NFR-004` | **≤ 3 s** a move at level 5; **5 s** hard ceiling at any level. ***Re-read 2026-10-24:* 5 s at levels 1–5,** once the owner accepts `ABC-212`'s `NFR-004` text (OD-212-1). Level 5's bars do not move | the existing instruments, unchanged |
| `G6` | `NFR-005` | `kiwipete` and `position-6` in plain `node` at 3 s: depth **≥ 6** (FAIL floor), depth 7 (WARN), and **≥ the base build's** completed depth, same machine, same session. ***How it is read, 2026-10-25* (BA/PM `bapm-epic008-g6-rule`, finding `QE-215-a`; a reading rule, no bound moves): 5 runs per board per build, interleaved; "≥ base" is graded by the median; any run below depth 6 FAILs.** In detail: 5 rounds, each a `kiwipete` pair and then a `position-6` pair, base first in odd rounds and head first in even rounds; one fresh process per search, `chooseMove` at 3 000 ms on the real clock, completed depth = `choice.depth`; "≥ base" = head's median completed depth ≥ base's, per board, on both boards; depth 7 WARN is reported; graded over all runs, with load1 recorded; QE pre-registers the reading before the first run. This is `ABC-205`'s "How `G6` is read", as `qe-ABC-205` and `qe-ABC-215` ran it. Whether "≥ base" is graded or only reported stays the owner's open question `QE-205-c`; until he answers, it is graded ***Owner's word, 2026-10-26* (BA/PM `bapm-records-owner-b`; Orchestrator `owner-word-2026-10-26b` `…2ae5fc12`, item 2): "≥ base" stays a graded pass/fail rule (option A). `QE-205-c` is closed; the graded reading now rests on his word, not on the default above. No bound or reading rule moves.** | catalog row; `ABC-083` `A7`'s non-regression rule |
| `G7` | `NFR-009` | search-held memory **≤ 16 MiB**; growth **≤ 1 MiB** between a 1 s and a 3 s search | catalog row |
| `G8` | `NFR-008` | `npm test` wall **≤ 10 s** at load1 ≤ 8 on the declared stack; the ticket's `N8-LANE` on its narrow set is reported | catalog row, `ADR-0035` |
| `G9` | Levels and budgets | `src/levels.ts` `LEVELS`, `DEFAULT_LEVEL` and `HARD_CEILING_MS` byte-identical to base. ***Re-read 2026-10-24 (owner `…e44d2903`; BA/PM `bapm-cut-levels-6-7`):* levels 1–5 byte-identical: `LEVELS[1..5]` and `DEFAULT_LEVEL` (5) unchanged, and level 5's ceiling is 5 000 ms. Levels 6–7, `HARDEST_LEVEL` and the clamp move only through `ABC-212`, and no ticket of this epic edits them** | `git diff` |
| `G10` | A level the change reddens | ruled under `ADR-0028`: fixture first, then one headroom, then the owner. Catalog NFR levels never move under it | `ADR-0028` |
| `G11` | Game-1 replay, **reported, not graded** | the level-5, 3 s choice at the five error positions (before 4.Qa4, 8.e5, 10.Ne4, 13.d4 and 17.Kc1), against base | the FENs replayed from `plans/uat/EPIC-006-game-1.pgn` |

## Success measures

| # | measure | target | how it is read |
|---|---|---|---|
| M1 | **Stronger on an external scale** | R at the epic's close minus R at its start (the `ABC-204` `A4` baseline): the difference's 95 % interval lies **above 0**. Its half-width is √(Y₁² + Y₂²) | two R readings with E, the openings and the pins unchanged, on this host. ~~**The size of the gain is not set: owner question Q1**~~ **2026-10-24, owner-set (Q1, `…e44d2903`): the point estimate (R at close − R at baseline) is ≥ +100 Elo, AND the interval lies above 0. Both must hold for MET** |
| M2 | **Every shipped change was measured** | each merged ticket of this epic carries a D reading that meets its ship rule (S1 or S2; S3 for `ABC-215`, added 2026-10-24) | the ticket's `## Reading` section and its QE note |
| M3 | **Nothing regressed** | `G1`, `G5`, `G6`, `G8` and `G9` green on `main` at close | the gates' own instruments |
| M4 | **The owner's decisions stayed his** | 0 NFR bounds moved without his word. Every new or changed ADR of this epic was reported to him when it landed | the ADR pages and the owner-word notes |

> **2026-10-25, `M1` baseline (QE/E2E, `qe-ABC-204`, `ABC-204` `A4`):** R = **2 061.3 ± 50.3** on `main` `3497aad2`, at
> `UCI_Elo` E = **1 910** (frozen), 200 games, 0 faults. The D budget is frozen at **B = 1 500 ms** (`A6`). See
> `ABC-204` § Reading.
>
> **2026-10-25, after `ABC-205`'s close (BA/PM, `bapm-close-ABC-205`):**
> - **`M1`: the baseline stands.** `3497aad2` never carried `ABC-205`'s code, and `main`'s `src/` and `data/` still
>   equal `ABC-205`'s base `d5690c5c`. The closing R is read as planned. Proposal 1 is no longer a source for the +100. It
>   was the largest measured cause of the loss in game 1 (721 of 1 428 cp).
> - **`M2` and `M3`: untouched.** Nothing of `ABC-205` merged, so nothing shipped unmeasured, and no gate on `main`
>   moved.
>
> **2026-10-25, `M2` (BA/PM, `bapm-epic008-g6-rule`):** `ABC-215` shipped measured. It merged as `5c91e2e4` with D
> **NEUTRAL, X = +15.6 ± 23.8** (400 of 400 games, 0 faults): not LOSS, and X ≥ 0, so **S3 is met** without the extension
> (QE `…c2c3540f`; Orchestrator `…ccf209d9`).
>
> **2026-10-26, after `ABC-207`'s close (BA/PM, `bapm-s1-ABC-207`):**
> - **`M1`: the baseline stands.** `ABC-207`'s code never reached `main`: `git diff 7020cca3 23181cc2 -- src data
>   tools` is empty. Proposal 4 is no longer a source for the +100. The +100 now rests on `ABC-208` to `ABC-211`, on
>   top of what has merged (`ABC-206`, value-identical, and `ABC-215`, D +15.6 ± 23.8).
> - **`M2` and `M3`: untouched.** Nothing of `ABC-207` merged, so nothing shipped unmeasured, and no gate on `main`
>   moved.
>
> **2026-10-27, after `ABC-209`'s close (BA/PM, `bapm-s1-ABC-209`):**
> - **`M1`: the baseline stands.** `ABC-209`'s code never reached `main`: `git diff 64394974 a5306773 -- src data
>   tools` is empty. Proposal 6 is no longer a source for the +100. The +100 now rests on `ABC-210`, on top of what
>   has merged (`ABC-206`, value-identical; `ABC-215`, D +15.6 ± 23.8; `ABC-208`, D +38.4 ± 23.3).
> - **`M2` and `M3`: untouched by `ABC-209`.** Nothing of it merged, so nothing shipped unmeasured, and no gate on
>   `main` moved.
> - **`M2`, `ABC-208`** (recorded here, because no line on this page carried it): `ABC-208` shipped measured. It merged
>   as `b5c67ab7` with D **GAIN, +38.4 ± 23.3** (400 games), so **S1 is met** without the extension (QE `…0477ac64`).
>
> **2026-10-27, after `ABC-210`'s close (BA/PM, `bapm-s1-ABC-210`):**
> - **`M1`: the baseline stands.** `ABC-210`'s code never reached `main`: `git diff a17d5945 06c1ecc8 -- src data
>   tools` is empty. Proposal 7 is no longer a source for the +100. **The +100 now rests only on what has merged:**
>   `ABC-206` (value-identical, faster; its D was waived, `…cb10c36c`), `ABC-215` (D +15.6 ± 23.8) and `ABC-208`
>   (D +38.4 ± 23.3). The closing R reading decides `M1`.
> - **A forecast, not a measurement (`UNKNOWN - verify`):** the shipped D point estimates sum to about +54. D is
>   self-play at 1 500 ms and R is against Stockfish at 3 000 ms, so the D figures do not add up into R, and `ABC-206`'s
>   speed is unpriced. Still, the "≥ +100" clause looks unlikely to hold. If the closing R's Y is near the baseline's
>   50.3, `M1`'s half-width is about 71, so "above 0" needs a gain of about +71 or more. Nothing here moves the bar
>   (Q1, the owner's).
> - **`M2` and `M3`: untouched by `ABC-210`.** Nothing of it merged, so nothing shipped unmeasured, and no gate on
>   `main` moved.

## Tickets (order is the pull order; the pages are under `plans/tickets/`)

| order | id | title | size | priority | column | depends on | ADR touch point (routed to the owner when written) | NFR bound moved? |
|---|---|---|---|---|---|---|---|---|
| 1 | `ABC-204` | Rating harness: `skytalix` against Stockfish `UCI_LimitStrength` and against its own base, in `cutechess-cli`, outside `npm test` | M | P2 | Ready | none | none | none. `NFR-008` untouched: 0 lane files |
| 2 | `ABC-205` | King safety bites while queens are on, and the king table is tapered | M | P2 | Ready | `ABC-204` for its D reading only | **`ADR-0031` addendum** | none planned. `G2` and `G6` are re-read |
| 3 | `ABC-206` | The search runs faster with identical answers | M | P2 | Ready | `ABC-204` for its D reading only | none expected (value-identical) | none planned. `NFR-001`'s leaf clause is re-read |
| 4 | `ABC-207` | Mobility is weighted per piece, and an early queen trip costs | S | P3 | Backlog | `ABC-205` merged | none, if `ADR-0031` D2's attack-map form stays. A different form is an `ADR-0031` change | none planned |
| 5 | `ABC-208` | Null-move pruning, behind a test-only off door, with a zugzwang guard | M | P2 | Backlog | `ABC-206` merged | **new ADR, plus an `ADR-0026` door** | none planned |
| 6 | `ABC-209` | The transposition table is kept across the moves of one game | S | P3 | Backlog | `ABC-208` merged | **`ADR-0025` decision 4 amendment** | none planned. `G7` (`NFR-009` growth clause) is re-read |
| 7 | `ABC-210` | Checks at the horizon: a check extension or checks in quiescence | M | P3 | Backlog | `ABC-209` merged | **reverses `ABC-079`'s recorded decision (`src/quiescence.ts:21-24`): an ADR, plus an `ADR-0026` door** | none planned |
| 8 | `ABC-211` | The opening book goes deeper in the English lines | S | P3 | Backlog | a source ruling | **`ADR-0023` (source and licence): a new source is needed. Probed: the current CC0 source does not hold game 1's 3...b6. This touch point is not in the brief** | none planned. `NFR-006` is re-read |
| 9 | `ABC-215` | The evaluation's material values and piece-square tables are our own, each made by a stated rule, and the CC BY-SA 3.0 carve-out leaves `NOTICE` and the header | L | P2 | Backlog | `ABC-214` merged; `ABC-205` Done or closed; `ABC-204` Done | none expected (values only). It ends the licence ADR's path-A carve-out. *Added 2026-10-24 (`bapm-ABC-214-path-a`), on the owner's word `…fb0468ff` (OD-214-1 = A). Its ship rule is S3* | none planned. `G2` and `G6` are re-read |

*2026-10-25 (BA/PM, `bapm-close-ABC-205`):* the table's columns are as cut. Today:
- `ABC-205` is closed unmerged under S1 (not delivered);
- `ABC-207`'s "`ABC-205` merged" and `ABC-215`'s "`ABC-205` Done or closed" both read as met by that close, and both
  tickets are Ready;
- the D base of each of the two is its own merge-base on `main`;
- the two share `src/evaluate.ts`, so they are built and read one at a time, and the Orchestrator picks the order
  (`ABC-215` § Dependencies);
- each now carries a frozen-clock pre-check before its real-clock `G6` reading. It is a process step and moves no
  bound.

*2026-10-25 (BA/PM, `bapm-epic008-g6-rule`):* row 9, `ABC-215`, is **Done**: merged `5c91e2e4`, D NEUTRAL +15.6 ± 23.8,
S3 met (see `M2`). The row's cells are as cut.

*2026-10-26 (BA/PM, `bapm-s1-ABC-207`):* row 4, `ABC-207`, is **closed unmerged under S1** (not delivered; that page's
§ Close). The row's cells are as cut. The tickets that remain:
- **`ABC-208`** (`M`, `P2`): its Ready trigger, "`ABC-206` reaches Done", has been met since 2026-10-24 (`0a9390e5`).
  No record re-scored its DoR, so its row 10 sequence hold is out of date. One page cite has moved: `src/engine.ts:69-71`
  is now `:73-74`, and the text is unchanged. **It is the one pullable ticket, once BA/PM re-scores its DoR on its
  page.** That re-score is owed and is not done here. It goes In Design first (a new ADR and an `ADR-0026` door), and
  it shares no file with `ABC-207`.
- **`ABC-209`** and **`ABC-210`**: not pullable. Each waits for its predecessor (`ABC-208`, then `ABC-209`) to reach
  Done or to be closed under S1.
- **`ABC-211`**: not pullable. It waits on an Architect/Design source ruling (`ADR-0023`, then the owner), and no hop
  for it has been routed. It is data only and shares no file with the engine tickets, so the ruling can run beside them.
- The closing `M1` R reading comes at the epic's close.

*2026-10-26 (BA/PM, `bapm-close-ABC-211`), on the owner's word `…58bcd17c`:*
- **Row 8, `ABC-211`, is closed undelivered (O0).** There is no new source, and `ADR-0023` is unchanged. The pinned source
  cannot meet `A1` (`…7bb8daf1`). The row's cells are as cut.
- **`ABC-208`:** the owner accepted `ADR-0050`, and the ALONE reading (`qe-ABC-208`) is running. Its merge waits on the
  QE verdict under S1.
- **`ABC-209` and `ABC-210`** stay chained. Each waits for its predecessor (`ABC-208`, then `ABC-209`) to reach Done
  or to be closed under S1.

*2026-10-27 (BA/PM, `bapm-s1-ABC-209`):* row 5, `ABC-208`, is **Done** (merged `b5c67ab7`, D GAIN, S1 met; see `M2`).
Row 6, `ABC-209`, is **closed unmerged under S1** (not delivered; that page's § Close). The rows' cells are as cut. The
ticket that remains:
- **`ABC-210`** (`M`, `P3`): **pullable once BA/PM re-scores its DoR.** Its Ready trigger, "`ABC-209` reaches Done, or
  BA/PM closes it under S1", is met by this close once it is on `main`. Its row 10 sequence hold is out of date, and
  no record re-scored it. The re-score is owed and is not done here. It needs:
  - row 10: the hold is gone;
  - rows 3 and 5: "`ABC-209` merged" reads as met by the close. The D base is its own merge-base on `main`, which
    carries `ABC-208` and not `ABC-209`;
  - a cite re-read: `src/quiescence.ts:21-24` holds at `a5306773` (same text);
  - the reading lines its siblings carry: one reading, final (`…4c3f7639`); the frozen-clock pre-check; ALONE, with
    `QE-207-g` and `QE-209-f` (host power).
  - Then In Design first: an ADR that reverses `ABC-079`'s recorded decision, plus an `ADR-0026` door. The owner's
    acceptance gates the ALONE reading and the merge, as it did for `ABC-208` and `ABC-209` (reading (b)).
- It is the epic's last engine change. The closing `M1` R reading comes after it, at the epic's close.

*2026-10-27 (BA/PM, `bapm-s1-ABC-210`):* row 7, `ABC-210`, is **closed unmerged under S1** (not delivered; that page's
§ Close). The row's cells are as cut. **No ticket of this epic is left to pull:** every row is Done or closed, and
`ABC-217` (test-only) is Done. **The epic's close path**, in order. Nothing here runs it; the Orchestrator routes each
step.
1. **Orchestrator: land the close.** Merge this close (`bapm-s1-ABC-210`) and the Architect's
   `arch-adr0051-not-in-force`. `ABC-210` goes to Done (dropped), and the trace row lands. The owner is told that
   `ABC-207`, `ABC-209` and `ABC-210` are closed, with his vetoes open. A veto that comes before step 3 starts holds
   step 3 until that one re-tune round has its QE verdict. Nothing else waits on the vetoes.
2. **Architect/Design: the full re-pass of `memory-bank/30-architecture.md`** (the close item already on the card,
   `orch-2026-10-26m`, `…cdc1fb61`). It is records only and reads the as-built code, which is now final for this epic.
   It includes whether `virtual-clock.ts` counts as a production module (42 or 43 of 46, `UNKNOWN - verify`). It goes
   before step 3, so that the reading runs ALONE and any finding lands before the close.
3. **QE/E2E: the closing `M1` R reading, plus the `M3` gate reads, on one `main` sha** whose `src/` and `data/` equal
   `b5c67ab7`'s (QE confirms it before the first game).
   - **R by `ABC-204` `A4`'s protocol with every pin frozen** (`ABC-204` § Reading, "Frozen for `EPIC-008`"): E =
     **1 910**, 200 games, `openings.epd` sequential with both colours, `skytalix` at `st=3`, Stockfish at its pins, and
     `cutechess-cli` and Stockfish at the sha256 values in § Dependencies. **E does not move:** `A4`'s 25–75 % band and
     its one E step belong to the baseline only, and `M1` needs E unchanged.
   - **ALONE** (width 1), on AC, quiet host, host log and watchdog. QE pre-registers before the first game. It is one
     run, and its written result is final (`…4c3f7639`). An UNRESOLVED result is reported, and a re-run is the owner's
     word. About 4.4 h at `ABC-204` `A6`'s rate.
   - **`M3`:** `G1`, `G5`, `G6`, `G8` and `G9` on the same sha, each by its own instrument. `G6`'s "≥ base" has no
     candidate at close, so it reads `main` at close against the `M1` baseline sha `3497aad2`, by the `G6` row's rule (5
     interleaved runs per board per build, the median, floor 6). That is BA/PM's reading of "nothing regressed", and no
     bound moves.
4. **BA/PM: grade `M1`–`M4` and write the epic's close.**
   - **`M1`:** both clauses must hold (Q1, `…e44d2903`): the point estimate (R at close − 2 061.3) is **≥ +100**, and
     the interval, half-width √(50.3² + Y₂²), lies **above 0**.
   - **`M2`:** each merged ticket's ship rule: `ABC-208` S1 (GAIN), `ABC-215` S3, and `ABC-206` S2 read under its
     waiver (`…cb10c36c`, accepted risk LOW, the Orchestrator's), which is stated as such. `ABC-204` and `ABC-217`
     change no engine value and owe no D.
   - **`M3`** from step 3. **`M4`:** 0 NFR bounds moved; each ADR of the epic was reported when it landed.
   - The page's front-matter goes to Done, with `M1` MET or NOT MET. The stale front-matter on the Done pages is
     synced in the same hop.
   - **If `M1` is NOT MET, the epic still closes.** All eight proposals are spent, and none is left to re-tune here.
     Whether more strength work follows is the owner's call (a new epic on his word). It is not cut here.
5. **Orchestrator:** the board (`EPIC-008` → Done), the trace row, and the `M1` result to the owner.

**Why this order.**
- The brief sets two places: the harness first, then king safety.
- The rest follow the analysis's rank (§ 6): speed-up 3, mobility 4, null move 5, TT 6, checks 7, book 8.
- Ready holds the three that touch disjoint files: `tools/` (204), `src/evaluate.ts` (205) and the search modules
  (206). Their builds can run side by side, but their readings cannot (width 1).
- `ABC-207` shares `src/evaluate.ts` with `ABC-205`. `ABC-208`, `209` and `210` share `src/engine.ts` with `ABC-206`
  and with each other. Each waits for its predecessor's merge, and that merge is also the base its D reading needs.

**Why eight and not fewer.** Each proposal moves strength by its own mechanism, so each needs its own D reading.
Bundling two would hide which one helped, and S1 would then ship a passenger. None is `XL`, so none is split.

**Why not more.** The speed-up's three hot spots stay in one ticket (`ABC-206`), because they share one identity
oracle and one timing bar. Each can land as its own value-identical commit.

## Owner questions

- **Q1 (proposed Elo target, as the brief asks).** Should EPIC-008 carry a number?
  - **Proposal:** M1's point estimate is **≥ +100 Elo** on the harness scale, and its 95 % interval lies above 0.
  - **Why +100.** The analysis lists two "medium" and "medium to high" gains (the speed-up and null move), plus the king-safety
    term that turned 3 of the 5 errors in game 1. At 200 + 200 games, M1's half-width is about ±70, so +100 is about
    the smallest target that the two R readings can tell apart from "no change".
  - **Options:** (a) +100 as proposed; (b) another number; (c) no number, so M1's "interval above 0" is the only bar.
  - **Default without an answer: (c).** The epic runs, and nothing waits on this question.
  - **ANSWERED 2026-10-24: (a), +100** (`…e44d2903`, *"+100 target ok"*). M1 now carries the number. The ±70 above is
    an estimate. If the two R readings' combined half-width √(Y₁² + Y₂²) comes out above 100, a +100 point estimate
    can still miss "above 0". Both conditions are read, and neither is relaxed without the owner.
- **Q2 (machine time, an environment fact).**
  - **What the epic needs.** About 10 readings on your Mac, each unattended for several hours, on AC, alone among
    agent hops: 1 baseline R, 1 A/A check, about 7 D readings (plus any extensions) and 1 closing R. The exact hours
    are `UNKNOWN - verify` until `ABC-204` `A6` measures them. The caps are 10 h for an R reading and 8 h for a D
    reading.
  - **The question.** Should readings run only in windows you name (for example overnight), or whenever the board
    is otherwise idle?
  - **Default without an answer:** whenever the board is idle, at width 1, as `ABC-202` ran.
  - **ANSWERED 2026-10-24: whenever idle** (`…e44d2903`, *"run whenever idle"*). That is the default as written: one
    reading at a time, on AC, alone among agent hops, with the host log and watchdog. The Orchestrator schedules it.

**Delivery calls, flagged as cheap to reverse (not questions):**
- **The S1 ship rule:** a value-changing change that is not GAIN after one extension does not ship, even though you
  accepted the proposal. "Accepted" is read as "build it and measure it". "Measurably stronger" is the epic's goal.
- **The D reading** is candidate against base, head-to-head. It costs a quarter of the games that two R readings
  would need for the same error. Self-play can overstate a gain, which is why the epic's own measure, M1, is R.

## Dependencies

- `cutechess-cli` 1.5.1 at `<local build dir>/cutechess-cli` (sha256
  `fb4fc2aa8d3457ccce2368446a080517be42be69a8a446765b9693833e766e1c`). Re-read 2026-10-23: present, and `--version`
  prints `1.5.1`. *[2026-10-25, Security/NFR (task `security-nfr-lic-pub-1`): the absolute host path is replaced by
  a placeholder under `ADR-0049` decision 4. The version and sha256 are unchanged. Older versions of this page keep
  the path as history.]*
- Stockfish 19 at `/opt/homebrew/bin/stockfish` → `../Cellar/stockfish/19/bin/stockfish` (sha256
  `dc2f18c34ae962dff591b66147d220ec06e61d756b93d8a4f5e04fd8e55c251f`). Re-read 2026-10-23: it offers `UCI_LimitStrength`
  and `UCI_Elo` from 1320 to 3190.
- Both are host tools, never repo dependencies (`EPIC-007` § Test notes).
- `ABC-203` (PGN export) is being built in parallel. It shares no file with this epic.

## Risks

- **`RISK-EPIC008-01`: one game is the only evidence for every proposal.** Mitigated by design: S1 ships only on GAIN.
- **`RISK-EPIC008-02`: wall time.** At 3 s a move, a 400-game D reading may exceed a night. Mitigated by `ABC-204`
  `A6`: a shorter D budget (≥ 1 000 ms, frozen) is allowed, and M1 stays at the full 3 s. *2026-10-24:* Q2 lets a
  reading start whenever the board is idle, with no owner window. Other alone-when-idle work (`qe-timing-ABC-203`,
  and `ABC-212`'s real-clock readings) queues behind or ahead of it, never beside it.
- **`ABC-204`'s `timemargin` rule under `ABC-212`.** The rule "5 000 − budget" is read as "level 5's ceiling −
  budget". Level 5's ceiling stays 5 000 ms under the proposed `NFR-004` text, so every pinned invocation is
  unchanged. If the value of the clamp constant moves, BA/PM writes a dated erratum on `ABC-204`'s derivation line at
  `ABC-212`'s merge.
- **`RISK-EPIC008-03`: self-play overstates gains.** Mitigated by M1 being an R reading.
- **`RISK-EPIC008-04`: an evaluation change moves cost or depth.** Covered by `G2` and `G6`. A miss stops to
  Architect/Design and is never re-derived (`ADR-0031`).
- **`RISK-EPIC008-05`: search changes break the deterministic and identity oracles.** Mitigated by `G4` and the
  `ADR-0026` door pattern.

## NFR triggers

- No ticket plans to move an NFR bound. Every ticket re-reads the gates it names.
- A ticket that could only meet its goal by moving a bound stops to the owner through the Orchestrator. The bounds at
  risk are `NFR-005`'s depth floor (`ABC-205`, `207`, `210`), `NFR-009` (`ABC-209`), `NFR-001`'s leaf clause
  (`ABC-206`), `NFR-006` (`ABC-211`) and the puzzle baseline (all of them).

## Test notes

- Readings never run in `npm test` (`NFR-008`). They run in the QE hop's scratch clone, like `ABC-202`.
- Each value-changing ticket changes production lines, so UAT is owed. The QE verdict signs it under the owner
  delegation (`…5aaf7cec` item 2). The owner may play-test, but nothing waits on that.
