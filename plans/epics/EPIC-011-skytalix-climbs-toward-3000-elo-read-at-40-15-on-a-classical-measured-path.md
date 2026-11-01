---
id: EPIC-011
title: "`skytalix` climbs toward 3 000 Elo, read at 40/15 against Stockfish's `UCI_Elo`, on a classical path where every change is measured"
status: backlog
column: Backlog
priority: P2
size: XL
owner: BA/PM
---

# EPIC-011: the path toward 3 000 Elo, classical and measured (`ADR-0056`)

> **CREATED 2026-11-01 by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`). Nothing was run,
> built or timed, because `qe-ABC-223` holds the host STRICTLY ALONE. `src/`, `tools/`, `data/`, the board, the trace,
> the ADRs and `AGENTS.md` are untouched. An Architect hop (`arch-adr0056-owner-fold`) is folding the owner's answers
> into `ADR-0056` at the same time. Where this page needs a number that hop owns, it says so and does not guess.
>
> **The owner's word, 2026-11-01** (Orchestrator `orch-2026-10-30a` `…022fb66f`, verbatim): *"3000 elo target would be
> 22s per move or 15 minutes per 40 moves, not with 4s per move. But let's not benchmark all the time with those
> values, we can becnhmark with smaller values for faster feedback loop, can be also 0,5s per move to get faster
> readings. Otherwise i'm happy with where we are going, let's create new Epic yes and finish other epics before that.
> Go over previous epics and tickets to find conflicting work, no need to do the same work twice."* Earlier the same
> day (`…74216a44`): *"Set the goal to 3000 elo rating from current goal."*
>
> - **Status: backlog. It starts only after `EPIC-006`, `EPIC-009` and `EPIC-010` close** (his order). § Close-out of
>   the open epics says what each still owes.
> - **What is confirmed:** the goal is 3 000; **the claim is read at 40/15** (40 moves in 15 minutes, about 22 s a
>   move; Q-3K-1's time half); routine readings may use shorter controls, down to 0.5 s a move; `ADR-0056`'s direction
>   is accepted; a new epic, after the others (Q-3K-5).
> - **What is proposed and not yet confirmed by him** (marked *[proposed]* wherever it appears): the scale, Stockfish 19
>   `UCI_Elo` (the Orchestrator reads it as not contested, `…022fb66f` item 1, but he did not name it); the claim rule
>   (a 200-game reading at E = M scoring ≥ 50 %, `ADR-0056` D5 item 5); the milestones 2 200 … 2 800; the routine
>   control and its game counts (the Architect's, `arch-adr0056-owner-fold` item 3).
> - **Open owner calls:** Q-3K-2, Q-3K-3, Q-3K-4, Q-3K-6, Q-3K-7, Q-3K-8 and Q-SP-3 (§ Owner questions).
> - **The dedupe audit** of every epic and ticket against `ADR-0056` and against each other is § Dedupe audit. No work
>   on this page repeats work already done or held elsewhere.

## Problem

- **User:** the owner, who wants `skytalix` to be the best TypeScript / vibe-engineered chess engine (`EPIC-010` §
  Product goal, 2026-10-29) and has set the bar at 3 000 Elo, read at a tournament control.
- **Pain, from the records:**
  - Today's only outside number reads **≈ 2 074** on "Stockfish 19's `UCI_Elo` scale at R's pins on this host"
    (`skytalix` at 4 000 ms a move against E = 1 910 at `st=0.5`; head `51902be5` 72.00 % ± 6.11,
    `qe-EPIC-010-m1-batch-2` `…1a53a7f9`). That is not 40/15 and not equal time.
  - The engine is a correct 2010-era search core over an untapered, untuned evaluation (`ADR-0056` D1). About thirty
    known gaps stand between it and 3 000 (`ADR-0056` D2), and eight of them already have tickets in `EPIC-010`'s
    Backlog.
  - **No instrument on record can see the +5 to +40 Elo steps a classical climb is made of.** The smoke pair sees a
    collapse (≈ 250 Elo), a 200 + 200 R pair resolves ± 78, and an 800-game D resolves ± 16–23 at ≈ 34 h
    (`ADR-0056` § The measurement problem). Two outside point estimates in a row were negative, and no reading can
    say why.
- **Value:** a climb that can be steered: each change measured finely enough to keep or drop, milestone readings that
  show where the engine stands, and one claim reading at 40/15 that says whether 3 000 was reached.

## The goal and how it is read

| item | value | state |
|---|---|---|
| Goal | **3 000 Elo** | confirmed (owner, `…74216a44`) |
| Claim control | **40/15** (40 moves in 15 minutes, about 22 s a move), `skytalix` in `uci-clock-mode` (`EPIC-009`, `ADR-0052`) | confirmed (owner, `…022fb66f`) |
| Scale | Stockfish 19 `UCI_LimitStrength`, `UCI_Elo` E (≈ CCRL Blitz ± 100 by Stockfish's own calibration; tops out at 3 190) | *[proposed]* `ADR-0056` D5 item 1; read as not contested by the Orchestrator |
| Stockfish's side at high E | its time or depth such that its strength holds at E ≈ 3 000 (`ADR-0056` D5 item 3: at `st=0.5` the pick depth may not be reached) | the Architect's (`arch-adr0056-owner-fold` item 2); `UNKNOWN - verify` until it lands |
| Claim rule | milestone M is MET when a 200-game reading at E = M scores ≥ 50 %; the interval is reported, not graded | *[proposed]* `ADR-0056` D5 item 5; the owner's call |
| Milestones | 2 200, 2 400, 2 600, 2 800, 3 000 on the chosen scale; each a **reading** after a block of work, **never a gate on a ticket** | *[proposed]* `ADR-0056` D5 |
| Routine readings | shorter controls, down to 0.5 s a move, for the per-change test (M0) and the milestone trend | confirmed in principle (owner); the control(s) and game counts are the Architect's (`arch-adr0056-owner-fold` item 3) |
| What a routine reading can say about 40/15 | it predicts the trend, not the level: an engine's gain at a short control is not its gain at a long one, and a fixed-depth Stockfish pick does not scale with time the way `skytalix` does | the Architect states the caveat in the fold; this page claims nothing at 40/15 from a shorter reading |

**Cost of a 40/15 reading (BA/PM arithmetic, an estimate, not a reading; the Architect's figure in `ADR-0056` governs
once it lands):** each side has 15 minutes for its first 40 moves, so a game is up to about 30 minutes before move 40
and more after it. At width 1 a 200-game reading is **of the order of 100–200 h of host time**. That is why the owner's
fast routine readings matter, why the 40/15 reading is kept for the claim and for any milestone the Architect names,
and why Q-3K-3 (width) is his.

## The cheapest slice that proves the value

1. **M0 first** (`ABC-255`): a self-play SPRT lane on the existing harness (`tools/rating/`, `cutechess-cli`), which
   proves itself by stopping H1 on a known gain (`ABC-208`'s null move) and H0 on an identical pair. Without it, no
   later change can be told from noise (`ADR-0056` D3, "Without M0 the climb cannot be steered").
2. **B0** (`ABC-256`): one baseline reading on the routine milestone control, on `main` after `EPIC-010` closes, so the
   milestones have a starting point on the control they will be read on.
3. **The TT block** (`ABC-238`, `ABC-237`, `ABC-257`, `ABC-258`): one file, cheap, the "cheapest real gap in the
   search" (`ADR-0056` § EPIC-010's Backlog).

The epic can stop after any phase and hold only changes that passed the per-change rule in force.

## Phases, milestones and order (`ADR-0056` D6, re-based on this page)

`ADR-0056` D6's Phase 0 has three parts. **Two of them stay in `EPIC-010`**, because the owner's order closes
`EPIC-010` first: O1 (milestone 1b, `ABC-250`–`ABC-253`) and `ABC-249`. **The third, M0, is this epic's Phase 0.**
D6 says "the phase order is a recommendation … the Orchestrator and BA/PM may reorder by width and evidence"; the two
reorders made here are named in the "why" column.

| phase | `ADR-0056` row | ticket | page | why here |
|---|---|---|---|---|
| **0, instrument** | M0 | **`ABC-255`** SPRT self-play lane | full page (new) | everything after it is graded on it if Q-3K-2 says so; `tools/` only, no file collision |
| 0 | (D5 item 2) | **`ABC-256`** B0: baseline reading on the routine milestone control | full page (new) | the milestones need a starting point on the control they are read on. It runs even if that control is R's pins: milestone 1b is value-identical but faster, so at a fixed time the 2 074 figure is stale |
| **1, the TT** | T1 | `ABC-238` deeper stored entry may cut a shallower search | full page (moved in) | `ADR-0056`: the cheapest real gap, +15–40 (estimate). **First:** `ADR-0056` D6 order, adopted over `EPIC-010`'s `ABC-237` → `ABC-238` (§ Dedupe audit, C2) |
| 1 | T2 | `ABC-237` depth-preferred replacement | full page (moved in) | after T1 (same file) |
| 1 | T3 | **`ABC-257`** TT kept across the moves of a game, re-tried after T1 and T2 | full page (new; re-try of dropped `ABC-209`) | `ABC-209`'s NEUTRAL was read under exact-depth cutoffs, where a kept entry almost never cuts (`ADR-0056` D2 T3) |
| 1 | T4 | **`ABC-258`** a larger TT | full page (new) | at 40/15 (≈ 22 s, ≈ 14–20 M nodes a move at today's 0.63–0.90 M nodes/s) a 2^18-slot table (262 144 entries) is far too small; 8 MiB fits `NFR-009` today, more is Q-3K-6 |
| **2, pruning and reductions** | P2 | *stub:* reverse futility (static null move) | title only | top expected Elo per cost (`ADR-0056` D2) |
| 2 | P1 | *stub:* LMR by a log table of depth × move index, history-adjusted (amends `ABC-121`'s flat 1-ply LMR, `ADR-0026`) | title only | |
| 2 | P4 | *stub:* late-move (move-count) pruning | title only | after P1 |
| 2 | P3 | *stub:* futility pruning near the leaves | title only | after P2 |
| 2 | P5 | *stub:* null move whose R grows with depth and eval margin (amends `ADR-0050`; `ABC-208`'s fixed R = 3) | title only | |
| 2 | P6 | *stub:* razoring | title only | after P2 |
| — | reading | **R1**, milestone reading on the routine control | (a QE reading; ticket cut when Phase 2 closes) | `ADR-0056` D6 item 7 |
| **3, ordering** | O1h | `ABC-233` history heuristic after the killers | full page (moved in) | |
| 3 | O2c | *stub:* countermove and continuation history | title only | after `ABC-233` |
| 3 | O3s | `ABC-234` SEE orders captures, ordering only | full page (moved in) | |
| 3 | Q1 | *stub:* SEE pruning of losing captures, in quiescence and the main search | title only | after `ABC-234`; was fenced out of `EPIC-010` |
| 3 | Q2 | *stub:* delta pruning in quiescence | title only | was fenced out of `EPIC-010` |
| 3 | S1 | `ABC-236` aspiration windows at the root | full page (moved in) | after T1 (`ADR-0056` D2) |
| **4, evaluation** | E1 | *stub:* the full taper: every PST and material term in middlegame and endgame halves, blended by phase. **Folds `ABC-231` and `ABC-232`** | title only | `ABC-231`/`ABC-232` are subsets (§ Dedupe audit, C7) |
| 4 | E2 | `ABC-239` offline tuning, constants only | full page (moved in) | after E1; Q-3K-7 (data) |
| 4 | E3 | *stub:* king attack: attackers on the king zone, weighted, tapered (re-try of dropped `ABC-205`'s term) | title only | under the tuner; Q-3K-4 (`G6`) |
| 4 | E4 | *stub:* pawn and passer terms: backward, connected, passer king distance, free path, unstoppable | title only | builds on E1's passer scaling (`ABC-232`'s part) |
| 4 | E5 | *stub:* piece terms: bishop pair, rook on open and semi-open files, outposts, mobility per piece, tuned (re-try of dropped `ABC-207` by the tuner; rook activity was fenced out of `EPIC-010`) | title only | |
| 4 | E6 | *stub:* threats (pawn attacks on pieces, hanging pieces) and tempo | title only | |
| 4 | E7 | *stub:* endgame scaling and knowledge (opposite bishops, drawish material, mop-up) | title only | |
| — | reading | **R2**, milestone reading on the routine control | (QE reading, cut when Phase 4 closes) | |
| **5, extensions, time, speed** | X1 | *stub:* check extension at every depth (not `ABC-210`'s horizon form, which stays closed) | title only | |
| 5 | X2 | *stub:* singular extension (and IIR) | title only | after T1 |
| 5 | W1 | *stub:* time use under a clock: no doomed iteration started, a partial iteration's root move kept when it beat the incumbent, soft and hard limits | title only | **must land before the first 40/15 reading**, wherever that falls (reorder: the owner set 40/15 as the claim control, and `uci-clock-mode` today has no soft/hard limit, `ADR-0056` § Inventory, "Time use") |
| 5 | V2 | `ABC-254` lazy legality (O1-d) | full page (moved in) | **waits the owner's yes (Q-SP-3)**; after `EPIC-010`'s `ABC-252` (both rewrite `src/legal.ts`) |
| 5 | V3 | *stub:* staged move generation (hash move before generating; captures before quiets) | title only | after V2 |
| — | reading | **R3**, milestone reading; and **the 40/15 claim reading** when a routine reading points at 3 000 | (QE readings) | `ADR-0056` D6 item 7 |
| later | V4 | (not a stub) bitboards: re-opening `ADR-0001` | — | **Q-3K-8, the owner's**, only if the curve flattens below 3 000 after Phase 5 |

- **Milestone readings report which milestone (2 200 … 3 000) a reading meets; they gate nothing.** The 40/15 reading
  is taken for the claim and for any milestone the Architect's fold names; otherwise milestones are read on the
  routine control *[proposed]*.
- **Stubs get an id and a full page at their phase's refinement**, not before. Their estimates are `ADR-0056` D2's and
  are not readings.
- **Not cut, recorded:** `ADR-0055` O1-e (incremental material + PST): "not proposed now"; after E1 the evaluation has
  two halves, so it is re-read then, not here.

## The per-change rule (what a value-changing ticket needs before it merges)

- **Until the owner answers Q-3K-2, `EPIC-010` § The merge rule applies here unchanged, by reference** (his Q4 = (e),
  extended: a 10-game D smoke and a 10-game R smoke, S-1 to S-4, before the merge; the trend; batched readings).
  Value-identical tickets stay on S2 with 0 games.
- **If Q-3K-2 is yes,** M0's SPRT verdict joins the rule as he words it (beside the D smoke, or in its place). The
  smoke pair stays as the fault, time-loss and collapse guard (`ADR-0056` D5).
- **`G6` "≥ base" binds as today** (his word `…2ae5fc12`) until Q-3K-4 is answered. `NFR-005`'s depth-6 floor never
  moves.
- **Common gates:** `EPIC-008` § Common gates `G1`–`G11`, by reference, as `EPIC-010` uses them. Each ticket names
  the gates it owes.

## Scope

- One `tools/` change (`ABC-255`, M0) and readings by QE (`ABC-256`, R1–R3, the 40/15 claim).
- The engine changes of Phases 1–5, each in its own ticket, behind its own ADR or ADR reading and its own `ADR-0026`
  off-door where it changes values, each measured by the per-change rule above.
- **Re-opened here by the owner's Q-3K-5 answer** (a new epic; `ADR-0056` D7: "Either way, it re-opens fenced
  items"): re-tries of `ABC-209` (as `ABC-257`), `ABC-210` (X1, another form), `ABC-205`'s king-safety term (E3) and
  `ABC-207`'s piece weights (E5, by the tuner), SEE pruning (Q1), delta pruning (Q2), rook activity (E5). **They stay
  fenced in `EPIC-010`**, whose remaining scope holds none of them.
- `src/search.ts`, `src/engine.ts`, `src/quiescence.ts`, `src/evaluate.ts`, `src/transposition.ts`, `src/legal.ts`,
  `src/moves.ts` and `tools/rating/` change, each only in the ticket that names it.

## Out of scope

- **A neural network or any learned runtime component** (`EPIC-004` permanent non-goal; the owner's "without neural
  engine"). `ABC-239` emits constants only.
- **Syzygy tablebases** (`EPIC-010` Q1: deferred by the owner, 2026-10-30; `EPIC-004`'s non-goal stands).
- **Threads, pondering** (single-threaded by decision, `EPIC-010` § Out of scope; `ADR-0044` D5).
- **A language port** (`ADR-0055` O2, O3: not pursued, owner 2026-11-01). **Bitboards** unless the owner answers
  Q-3K-8 yes.
- **The levels and their budgets** (`LEVELS[1..7]`, `DEFAULT_LEVEL`, `HARD_CEILING_MS` byte-identical, `G9`;
  `ADR-0056` D7 "Not asked").
- **A user-visible Elo, a rating-list entry, CCRL** (`EPIC-008` § Out of scope; distribution is `ADR-0049` and his).
- **`EPIC-010` milestone 1b and `ABC-249`** (they close `EPIC-010`).

## Success measures *[proposed; the owner accepts or changes them]*

| # | measure | target | how it is read |
|---|---|---|---|
| G1 | **3 000, claimed at 40/15** | a reading at 40/15, `skytalix` in `uci-clock-mode` against Stockfish 19 `UCI_LimitStrength` at E = 3 000, meets the claim rule (*[proposed]*: ≥ 50 % over 200 games; the interval reported) | QE, ALONE, by the Architect's measurement plan (`ADR-0056` D5 as folded) |
| G2 | **The climb is visible** | a milestone reading after Phases 2, 4 and 5 names the highest milestone met | R1–R3 on the routine control |
| G3 | **Every value-changing merge passed the rule in force** | 100 % (the per-change rule above) | each ticket's `## Reading` and QE note |
| G4 | **Never loses on time at 40/15** | 0 losses on time and closest call ≥ 500 ms in every 40/15 reading (`EPIC-009` M1's bar, carried) | the 40/15 readings' PGNs; this replaces `EPIC-009`'s later "major validation" (§ Dedupe audit, C6) |
| G5 | **Nothing regressed** | `G1` ≥ 54/58, `G5`, `G7`, `G8`, `G9` green on `main` at each milestone reading | the gates' own instruments |
| G6 | **The owner's decisions stayed his** | 0 NFR bounds moved without his word; Q-3K-2…8 and Q-SP-3 answered before a ticket that waits on them leaves Backlog | ADR pages, owner-word notes |

**Close:** G1 MET, or the owner stops the epic after a milestone reading. If the curve flattens below 3 000 after
Phase 5, the next question is V4 and it is his (`ADR-0056` D6 item 7).

## Tickets

| order | id | title | size | priority | column | DoR | waits on |
|---|---|---|---|---|---|---|---|
| 1 | `ABC-255` | M0: a self-play SPRT lane on the rating harness that stops H1 on a known gain and H0 on an identical pair | M | P1 | Backlog | 8/10 | `EPIC-006`/`009`/`010` closed; Q-3K-2 (its use as a gate), Q-3K-3 (width); the Architect's routine control |
| 2 | `ABC-256` | B0: baseline reading of `main` on the routine milestone control, after `EPIC-010` closes | S | P2 | Backlog | 8/10 | the Architect's routine control; `EPIC-010` closed |
| 3 | `ABC-238` | A deeper stored entry may cut off a shallower search (T1) | M | P2 *(was P3)* | Backlog | 9/10 | the ADR revising `ABC-081` `A1`; `ABC-255` (if Q-3K-2 yes) |
| 4 | `ABC-237` | The TT prefers deeper entries when it replaces (T2) | S | P3 | Backlog | 9/10 | `ADR-0025` amendment; `ABC-238` merged or closed |
| 5 | `ABC-257` | The TT is kept across the moves of one game, re-tried after T1 and T2 (T3) | S | P3 | Backlog | 8/10 | `ABC-238`, `ABC-237`; `ADR-0025` d4 amendment (accepted 2026-10-26, not in force) re-read |
| 6 | `ABC-258` | A larger transposition table: 8 MiB inside `NFR-009`, more only on the owner's word (T4) | S | P3 | Backlog | 8/10 | `ABC-257`; Q-3K-6 for > 8 MiB |
| 7 | `ABC-233` | History heuristic after the killers (O1h) | M | P3 | Backlog | 9/10 | the ADR (`ADR-0026` d10) |
| 8 | `ABC-234` | SEE orders captures, ordering only (O3s) | M | P3 | Backlog | 8/10 | `ADR-0024` d4 re-open evidence; the ADR |
| 9 | `ABC-236` | Aspiration windows at the root (S1) | M | P3 | Backlog | 9/10 | new ADR; `ABC-238` |
| 10 | `ABC-231` | King table tapered by phase, alone | S | P3 | Backlog | 9/10 | **to be merged into E1** at Phase 4's refinement |
| 11 | `ABC-232` | Passed pawns by phase | S | P3 | Backlog | 9/10 | **to be merged into E1** (phase scaling) and E4 (passer terms) |
| 12 | `ABC-239` | Weights tuned offline, constants only, validated outside (E2) | L | P3 | Backlog | 8/10 | E1; Q-3K-7; `ADR-0048` licence; the method ADR |
| 13 | `ABC-254` | Lazy legality (V2, O1-d) | M | P2 | Backlog | 9/10 | **Q-SP-3**; the ADR amending `ADR-0003`; `EPIC-010`'s `ABC-252` (or where the O1-b chain stops) |

The stubs of § Phases get ids when their phase is refined. **Ids `ABC-255`…`ABC-258` are taken here; `ABC-224` stays in
the Orchestrator's pool.** No moved ticket was renumbered.

## Dedupe audit (2026-11-01; every epic, every ticket not plainly Done, and every Done ticket `ADR-0056` touches)

**Method.** Every page under `plans/epics/` and `plans/tickets/` was read for status, epic and scope, and checked
against the board's columns at `main` `2e9a2457` and against `ADR-0056` D2/D4/D6. Done tickets whose work `ADR-0056`
does not touch are grouped by epic. Verdicts: **keep** (where it is), **move** (to `EPIC-011`, re-homed with a dated
line, id unchanged), **merge into X**, **supersede**, **drop**, **close** (the epic).

### Epics

| epic | overlaps with | verdict | reason |
|---|---|---|---|
| `EPIC-001`, `002`, `003`, `005`, `007` | none | keep (done) | no `ADR-0056` row touches their scope |
| `EPIC-004` engine and AI | `ADR-0056`'s base (`ABC-075`…`087`); its permanent non-goals (neural, tablebases) | keep (done) | `EPIC-011` inherits the non-goals as § Out of scope; the "~1700" non-goal was already removed (2026-10-29) |
| `EPIC-008` stronger at the same levels | the harness (`ABC-204`), the R scale, the dropped `ABC-205`/`207`/`209`/`210` | keep (done) | `EPIC-011` reuses its harness and pins; the dropped tickets stay closed and are re-tried here under new ids or stubs |
| `EPIC-006` game session and packaging | none with `ADR-0056` | **close** (§ Close-out) | every cut ticket is Done; the save/resume slice is not earned |
| `EPIC-009` 40/15 clock | the claim control; W1; its "major validation" and "strength at 40/15, later" | **close** on `ABC-223`'s grade; three items move here | § Close-out; C4–C6 below |
| `EPIC-010` verified engine gaps | milestones 2 and 3 (`ABC-231`…`239`), `ABC-254`, Q6 and the 3 000 goal | **close** after milestone 1b; those items move here | § Close-out; `ADR-0056` D4 maps all eight Backlog tickets to its gap list |

### Tickets

| ticket | overlaps with | verdict | reason |
|---|---|---|---|
| `ABC-231` king taper alone | E1 (full taper); `ABC-205`'s taper half | **move**, then **merge into E1** | a subset of E1 (`ADR-0056` D2, D8: "`ABC-231` and `ABC-232` folded into E1"). Kept as a page until E1 is cut, so its acceptance rows (the `ABC-205` `G6` replay) carry over; then closed as merged |
| `ABC-232` passers by phase | E1 (phase scaling), E4 (passer terms) | **move**, then **merge into E1 / E4** | same; its phase scaling is E1's, any passer term beyond it is E4's |
| `ABC-233` history heuristic | O1h; O2c builds on it | **move** (Phase 3) | covered gap, no duplicate |
| `ABC-234` SEE ordering | O3s; Q1 (SEE pruning) needs it | **move** (Phase 3) | covered gap; its `ADR-0024` d4 evidence wait stands |
| `ABC-236` aspiration | S1 | **move** (Phase 3, after T1) | covered gap; `ADR-0056` makes it depend on T1 |
| `ABC-237` TT replacement | T2; order against `ABC-238` | **move** (Phase 1, second) | covered gap; order C2 |
| `ABC-238` deeper cutoffs | T1 | **move** (Phase 1, first; P3 → P2) | covered gap, the cheapest real one; order C2 |
| `ABC-239` offline tuning | E2; Q-3K-7 | **move** (Phase 4, after E1) | covered gap; its wait on "milestone 2's evaluation" becomes E1 |
| `ABC-254` lazy legality | V2; `ABC-235`'s struck cut 4 ("cheaper legality for non-captures") | **move** (Phase 5, whenever Q-SP-3 is yes) | it would hold `EPIC-010` open on an unanswered owner call; `ADR-0056` D6: "O1-d whenever the owner says yes (after O1-b)". Exception kept: on a yes plus its ADR before `ABC-250` enters development, the Orchestrator may pull it back into 1b, first (C11). Not a duplicate of `ABC-235`: cut 4 was struck, never built |
| `ABC-249` pre-root repetition row | `ADR-0056` Phase 0 | **keep** in `EPIC-010` | test-only, Ready, closes with `EPIC-010` |
| `ABC-250`…`ABC-253` milestone 1b | `ADR-0056` V1 / Phase 0 | **keep** in `EPIC-010` | `ADR-0055` D2/D4 and `ADR-0056` D6 both put O1 before every algorithm ticket, and the owner closes `EPIC-010` first, so the order holds without a move. `ABC-250` stays first (C3) |
| `ABC-223` `uci-clock-mode` smoke | `EPIC-011`'s 40/15 claim control | **keep** in `EPIC-009` | its 5 games prove the mode; the claim readings use it |
| `ABC-209` TT kept across moves (dropped) | T3 | **supersede by `ABC-257`**; stays dropped | re-tried after T1/T2 under a new id, reusing `grugops/ABC-209` `bb6cf451` and `ADR-0025` d4's accepted amendment. Its NEUTRAL +8.7 ± 18.3 stays on record |
| `ABC-210` horizon check extension (dropped) | X1 | **stays dropped**; X1 is a **different form** (every depth) | `ABC-228` covers the horizon case; re-running form (a) would do the same work twice |
| `ABC-205` king safety + taper (dropped) | E1 (taper half), E3 (king attack half) | **stays dropped**; E1 and E3 cite it | its forms on `grugops/ABC-205-final` `b5d5cea5` are input; it died on `G6` "≥ base" (Q-3K-4), not on play |
| `ABC-207` per-piece mobility (dropped) | E5 | **stays dropped**; E5 tunes, never hand-weights | D LOSS −18.3 ± 16.5 with hand weights; `ADR-0056` E5: "by the tuner, not by hand" |
| `ABC-211` deeper English book (dropped) | none (`ADR-0056` has no book row) | stays dropped | owner's O0 |
| `ABC-218` Skill 7 at 40/15 (dropped) | the 40/15 claim reading | stays dropped; **superseded** by `EPIC-011`'s 40/15 readings | the owner closed it; `uci-clock-mode` is the 40/15 setting now |
| `ABC-219` CLI tournament level (dropped) | none | stays dropped | CLI parity out of scope (`EPIC-009`) |
| `ABC-074` non-M3 spike (dropped) | none | stays dropped | hardware; unrelated |
| `ABC-038`, `052`, `060`, `108`, `111` (dropped) | none | stay dropped | unrelated to the engine path |
| `ABC-204` rating harness (Done) | M0 | **keep**; M0 builds on it | `ABC-204` fenced SPRT out of its own scope; M0 adds it as a mode of the same harness, not a second harness |
| `ABC-225` R pair (Done) | milestone readings, B0 | **keep**; reused | the milestone instrument |
| `ABC-208` null move (Done) | P5; M0's known-gain control | **keep** | P5 amends `ADR-0050`; its door pair is M0's H1 control |
| `ABC-121` PVS + LMR (Done) | P1 | **keep** | P1 amends `ADR-0026`'s flat 1-ply LMR; not a re-run |
| `ABC-215` own eval values (Done) | E2 | **keep** | E2 re-fits the values by a method; one untested hypothesis for the negative R estimates (`ADR-0056` § Context) |
| `ABC-081` TT (Done) | T1 revises its `A1` | **keep** | the revision is `ABC-238`'s ADR |
| `ABC-220`, `221`, `222` (Done) | the 40/15 control | **keep** | the setting the claim is read in |
| `ABC-206`, `227`, `235`, `240` (Done) | V1 | **keep** | speed already delivered; 1b continues it |
| `ABC-228`, `229`, `230`, `241`, `242` (Done) | none in `ADR-0056` D2 | **keep** | milestone 1's gaps, closed |
| `ABC-075`…`ABC-087` (Done, `EPIC-004`) | the base every row extends | keep | no row repeats one |
| `ABC-203`, `212`, `213`, `214`, `216`, `226`, `227`, `246` (Done) | — | keep; **page front matter folded** | their pages still read Ready / In Review / In Development; the board holds them Done. A stale "Ready" page invites the same work twice, so each gets `status: done`, `column: Done` and one dated line |
| every other ticket, `ABC-001`…`ABC-248` (Done) | none | keep | no `ADR-0056` row touches them |

### Conflicts found and how each is resolved

| # | conflict | resolution |
|---|---|---|
| C1 | `EPIC-010` § Out of scope fences the re-tries, SEE pruning, delta pruning and rook activity; `ADR-0056` wants them | they are `EPIC-011` scope (Q-3K-5 answered: a new epic); `EPIC-010` keeps its fence, because its remaining scope (1b, `ABC-249`) holds none of them |
| C2 | `EPIC-010` orders `ABC-237` → `ABC-238`; `ADR-0056` D6 orders T1 (`ABC-238`) → T2 (`ABC-237`), "T1 order free" | `ADR-0056`'s order adopted: the larger expected gain first, and the only coupling is the shared file. Both pages carry a dated line |
| C3 | `ADR-0056` D6 lists O1-a before O1-b; `ADR-0055` D4 and the board pull `ABC-250` (O1-b) first, `ABC-253` (O1-a) last | with the Architect (`arch-adr0056-owner-fold` item 4); `EPIC-010` keeps `ABC-250` first, as the Orchestrator's brief says, unless the Architect shows a reason |
| C4 | `EPIC-009` § Out of scope: "spending more time on a hard move (a search change)"; `ADR-0056` W1 | W1 is `EPIC-011`'s (Phase 5, before the first 40/15 reading). `EPIC-009` built the modes, not time management; nothing in it is redone |
| C5 | `EPIC-009` Q6: "no strength reading at 40/15 in this epic, later" | the later reading is `EPIC-011`'s claim, on the owner's 2026-11-01 word |
| C6 | `EPIC-009` § Out of scope: "major validation, ≥ 100 games at 40/15, later, its own ticket on the owner's word"; `EPIC-011`'s 40/15 readings | **merged:** a 200-game 40/15 reading counts losses on time and the closest call (G4 here), so it is the major validation. No separate ticket is cut; one set of games serves both. The owner may still ask for a dedicated one |
| C7 | `ABC-231`, `ABC-232` vs E1 | merged into E1 at Phase 4's refinement |
| C8 | `EPIC-010` Q5 "no Elo target" vs the 3 000 goal | no conflict: `EPIC-010` M2 stays "not LOSS"; the goal is `EPIC-011`'s |
| C9 | `EPIC-010` Q6 (the 3 000 scale and measure) | moved here; its time-control half is answered (40/15); the scale and the claim rule stay *[proposed]* |
| C10 | The R smoke (E = 1 910) loses meaning as the engine climbs (a 2 400 engine scores ≈ 95 % against it; S-4's 3.0 of 10 then guards nothing) | risk `RISK-EPIC011-03`; the Architect or QE proposes E for the smoke when a milestone reading moves past 2 200 (the game counts and pins inside the owner's rule are delivery, `EPIC-010` § Owner questions) |
| C11 | `ADR-0055` D4 puts O1-d (`ABC-254`) first in O1; `ADR-0056` D6 puts it "whenever the owner says yes (after O1-b)" | `ADR-0056`'s placement adopted (it is in `EPIC-011`), with `ADR-0055` D4's order kept as the exception on `ABC-254`'s page: yes plus ADR before `ABC-250` enters development pulls it back into `EPIC-010` 1b, first |

## Close-out of the open epics (the owner: finish them first)

### `EPIC-006` (game session and packaging)

- **What remains to Done:** nothing cut is open. All 24 ticket pages with `epic: EPIC-006` sit in the board's Done
  column (`ABC-041`…`046`, `ABC-100`…`102`, `ABC-112`…`115`, `117`, `119`, `120`, `148`, `161`, `200`, `201`, `203`,
  `213`, `216`; `ABC-060` dropped). Acceptance 1 is MET (`ABC-201`,
  Security/NFR 2026-10-23, fresh clone, `NFR-007` 220.9 ms), 2 (`ABC-102`), 3 (`ABC-044`) and 4 (`ABC-101`, `ABC-200`).
- **The negotiable slice (save/resume):** by the epic's own rule it is built "only if play-testing shows people abandon
  games mid-way". The log holds one game, relayed engine-against-engine, which "says little about abandonment"
  (`plans/uat/EPIC-006-play-test-log.md`). **Not earned, so not built at the close** (BA/PM ruling under the owner's
  delivery delegation; reversible). Re-opened as its own ticket only if a log row shows an abandoned game with
  "would have saved: y".
- **3 000-path work in it:** none. **Exit reading owed:** none.
- **Close:** a card move (the Orchestrator's). The 2026-08-13 recommendation "this should probably be two epics" is
  moot and withdrawn.

### `EPIC-009` (40/15 clock)

- **What remains to Done:** `ABC-223` (In Development, `qe-ABC-223` ALONE now), then BA/PM grades milestone 2 (M1, M2
  for `uci-clock-mode`, the 60 s ceiling) from its reading. `ABC-246` is Done (`0ce5041d`).
- **Moved to `EPIC-011`:** W1 (time management, C4), the strength reading at 40/15 (C5), and the major validation
  (C6, merged into the 40/15 readings). None of them was a ticket; nothing is renumbered.
- **Exit reading owed:** `ABC-223`'s 5 games at 40/15 (0 losses on time, closest call ≥ 500 ms, ≥ 75 % clock use,
  longest move ≤ 60 s). If it misses, the fix stays in `EPIC-009`: it is a defect in a built mode, not 3 000-path
  work.

### `EPIC-010` (verified engine gaps)

- **What remains to Done:** `ABC-249` (Ready, test-only), then milestone 1b: `ABC-250` (Ready; its A4 perft reading
  decides `ABC-251`'s form and whether `ABC-252` exists), `ABC-251`, `ABC-252`, `ABC-253` (Ready, pulled last).
- **Moved to `EPIC-011`:** `ABC-231`, `232`, `233`, `234`, `236`, `237`, `238` (milestone 2), `ABC-239` (milestone 3),
  `ABC-254` (it waits on Q-SP-3 and would hold the close), Q6 and the 3 000 goal.
- **Milestone 1b stays in `EPIC-010`, last,** because `ADR-0055` D2/D4 and `ADR-0056` D6 both place O1 before every
  ticket that edits `orderMoves`, the search or `evaluate`, and the owner closes `EPIC-010` before `EPIC-011` starts.
  So 1b lands first under either reading, `EPIC-011` is written on the packed base, and no file collision is ordered
  across two epics.
- **Exit readings owed:** one S2 nps reading per 1b ticket (≈ 1 h ALONE each, ≈ 4 h, estimate); `ABC-249`'s `G8`;
  a close hop on `main` reading M3 (the `Q-SET` rows) and M4 (`G1` ≥ 54/58, `G5`, `G6`, `G7`, `G8`, `G9`).
  **M2 needs no new batch:** milestone 1's batch (head `51902be5` vs the epic's first merge-base `ca6e675c`, NOT LOSS)
  read the last value change. `git log 51902be5..2e9a2457` shows no production `src/` change since, and 1b is
  value-identical by `G4`, so that batch stands as M2 at the close. This saves a ≈ 23 h ALONE batch.

## Owner questions (open; the Orchestrator takes them to him)

| Q | asked | default until he answers | blocks |
|---|---|---|---|
| **Q-3K-2** | Does M0's SPRT verdict join his Q4 = (e) per-change rule, beside the D smoke or in its place? | the smoke pair rules (`EPIC-010` § The merge rule); M0 is built and reports, but grades nothing | `ABC-255`'s use as a gate (not its build) |
| **Q-3K-3** | Test width: SPRT and 40/15 readings at width 1 are slow (an SPRT ≈ 10–30 h, a 200-game 40/15 reading of the order of 100–200 h, estimates); more cores breaks "one at a time" | width 1 | the pace of everything here |
| **Q-3K-4** | `G6` "≥ base": keep it, or judge value-changing tickets on play (M0) with `NFR-005`'s depth-6 floor and depth-7 WARN | "≥ base" binds | E1–E7 most (every eval term costs nodes; `ABC-205` died on it) |
| **Q-3K-6** | `NFR-009` above 16 MiB for T4 (he pre-offered 128 MiB, 2026-09-25) | 16 MiB; `ABC-258` goes to 8 MiB only | `ABC-258` beyond 8 MiB |
| **Q-3K-7** | Tuning data: the project's own games (allowed by default), Lichess exports (CC0), a Stockfish-labelled set (a product-identity question) | own games only | `ABC-239`'s data source |
| **Q-3K-8** | Re-open `ADR-0001` (bitboards), only if the readings call for it | no | V4 |
| **Q-SP-3** | Amend `ADR-0003` so lazy legality may be built | not built | `ABC-254` |
| (part of Q-3K-1) | Confirm the scale (Stockfish 19 `UCI_Elo`) and the claim rule (≥ 50 % over 200 games at E = M) | *[proposed]* as written | G1's wording |

## Dependencies

- `ADR-0056` (accepted in direction; the owner fold is the Architect's, in flight) and `ADR-0055` (ACCEPTED, O1).
- `EPIC-009`'s `uci-clock-mode` (`ADR-0052`): the 40/15 setting.
- `ABC-204`'s pinned host tools (`cutechess-cli` 1.5.1, Stockfish 19); paths out of the records (`ADR-0049` d4).
- `EPIC-010` closed: 1b's packed base is what every Phase 1+ ticket edits.
- Within the epic: `ABC-238` → `ABC-237` → `ABC-257` → `ABC-258` share `src/transposition.ts`; `ABC-233` → O2c →
  `ABC-234` → Q1 share `orderMoves` and the capture path; E1 → `ABC-239` → E3–E7 share `src/evaluate.ts`; `ABC-254` →
  V3 share `src/legal.ts` and `src/moves.ts`.

## Risks

- **`RISK-EPIC011-01`: 3 000 may not be reachable in TypeScript.** `ADR-0056` D3: central landing ≈ 2 550–2 800 on
  R's scale (estimate), 3 000 at the optimistic edge; probability with O1 alone < 1 in 4 (judgement). No public
  TypeScript engine with a list rating was found. Mitigated by milestone readings that show the curve, and by the
  owner's V4 question if it flattens.
- **`RISK-EPIC011-02`: host hours.** A 40/15 reading is of the order of 100–200 h at width 1 (estimate); SPRT tests ≈
  10–30 h each (`ADR-0056` D5). Mitigated by fast routine readings (owner) and Q-3K-3.
- **`RISK-EPIC011-03`: the R smoke stops guarding** as strength rises (C10).
- **`RISK-EPIC011-04`: self-play gains do not transfer outside** (`RISK-EPIC008-03`). Mitigated by the milestone R
  readings.
- **`RISK-EPIC011-05`: short-control gains do not carry to 40/15.** Mitigated by keeping the claim at 40/15 and
  reading nothing at 40/15 from a shorter control.

## NFR triggers

- **`NFR-005`** (depth floor 6 at the default budget): at risk from every value-changing ticket; `G6` reads it.
- **`NFR-009`** (≤ 16 MiB, ≤ 1 MiB growth): `ABC-257` (table kept across moves, growth over a game), `ABC-258` (size),
  `ABC-233`/O2c (history tables).
- **`NFR-004`** (per-move ceilings, incl. `uci-clock-mode`'s 60 s): W1 and every 40/15 reading.
- **`NFR-008`** (`npm test` ≤ 10 s): new rows on the virtual clock or at fixed depth only; readings never run in
  `npm test`.
- **Security (ASVS L1):** `ABC-255` reads only artifacts it builds; no new input path in the engine.

## Test notes

- Readings run in QE's scratch clone, ALONE, outside `npm test`, as `ABC-204`/`ABC-225`.
- Search and evaluation tickets use the `ADR-0026` door pattern (`G4`: the door reproduces base node for node).
- Value-changing tickets owe UAT; the QE verdict signs it (owner delegation `…5aaf7cec` item 2).
- W1 cannot be graded at a fixed time per move; its test needs a clock control (named at its refinement).
