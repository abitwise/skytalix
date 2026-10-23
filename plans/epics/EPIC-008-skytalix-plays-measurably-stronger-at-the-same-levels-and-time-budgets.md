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
| `G6` | `NFR-005` | `kiwipete` and `position-6` in plain `node` at 3 s: depth **≥ 6** (FAIL floor), depth 7 (WARN), and **≥ the base build's** completed depth, same machine, same session | catalog row; `ABC-083` `A7`'s non-regression rule |
| `G7` | `NFR-009` | search-held memory **≤ 16 MiB**; growth **≤ 1 MiB** between a 1 s and a 3 s search | catalog row |
| `G8` | `NFR-008` | `npm test` wall **≤ 10 s** at load1 ≤ 8 on the declared stack; the ticket's `N8-LANE` on its narrow set is reported | catalog row, `ADR-0035` |
| `G9` | Levels and budgets | `src/levels.ts` `LEVELS`, `DEFAULT_LEVEL` and `HARD_CEILING_MS` byte-identical to base. ***Re-read 2026-10-24 (owner `…e44d2903`; BA/PM `bapm-cut-levels-6-7`):* levels 1–5 byte-identical: `LEVELS[1..5]` and `DEFAULT_LEVEL` (5) unchanged, and level 5's ceiling is 5 000 ms. Levels 6–7, `HARDEST_LEVEL` and the clamp move only through `ABC-212`, and no ticket of this epic edits them** | `git diff` |
| `G10` | A level the change reddens | ruled under `ADR-0028`: fixture first, then one headroom, then the owner. Catalog NFR levels never move under it | `ADR-0028` |
| `G11` | Game-1 replay, **reported, not graded** | the level-5, 3 s choice at the five error positions (before 4.Qa4, 8.e5, 10.Ne4, 13.d4 and 17.Kc1), against base | the FENs replayed from `plans/uat/EPIC-006-game-1.pgn` |

## Success measures

| # | measure | target | how it is read |
|---|---|---|---|
| M1 | **Stronger on an external scale** | R at the epic's close minus R at its start (the `ABC-204` `A4` baseline): the difference's 95 % interval lies **above 0**. Its half-width is √(Y₁² + Y₂²) | two R readings with E, the openings and the pins unchanged, on this host. ~~**The size of the gain is not set: owner question Q1**~~ **2026-10-24, owner-set (Q1, `…e44d2903`): the point estimate (R at close − R at baseline) is ≥ +100 Elo, AND the interval lies above 0. Both must hold for MET** |
| M2 | **Every shipped change was measured** | each merged ticket of this epic carries a D reading that meets its ship rule (S1 or S2) | the ticket's `## Reading` section and its QE note |
| M3 | **Nothing regressed** | `G1`, `G5`, `G6`, `G8` and `G9` green on `main` at close | the gates' own instruments |
| M4 | **The owner's decisions stayed his** | 0 NFR bounds moved without his word. Every new or changed ADR of this epic was reported to him when it landed | the ADR pages and the owner-word notes |

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

- `cutechess-cli` 1.5.1 at `/Users/olgeroeselg/Projects/others/cutechess/cutechess/build/cutechess-cli` (sha256
  `fb4fc2aa8d3457ccce2368446a080517be42be69a8a446765b9693833e766e1c`). Re-read 2026-10-23: present, and `--version`
  prints `1.5.1`.
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
