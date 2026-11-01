---
kind: adr
id: ADR-0056
---
# ADR-0056: The path toward 3 000 Elo stays classical and measured. A fast self-play SPRT lane comes first, then the transposition table, pruning, ordering and a tuned, tapered evaluation, interleaved with ADR-0055's O1 cuts. 3 000 is a stretch on any scale, and the scale is the owner's

## Status

**ACCEPTED IN DIRECTION** 2026-11-01 by the owner. Folded by Architect/Design (task `arch-adr0056-owner-fold`,
records only, at `main` `2e9a2457`). Nothing was run.

- **His words, verbatim** (`orch-2026-10-30a` `…022fb66f`): *"3000 elo target would be 22s per move or 15 minutes per
  40 moves, not with 4s per move. But let's not benchmark all the time with those values, we can becnhmark with
  smaller values for faster feedback loop, can be also 0,5s per move to get faster readings. Otherwise i'm happy with
  where we are going, let's create new Epic yes and finish other epics before that. Go over previous epics and tickets
  to find conflicting work, no need to do the same work twice."*
- **What "in direction" accepts:** the classical path (D1–D4), measuring on a named scale with a per-change instrument
  (D5), and the phase order (D6) as a recommendation. Each step still brings its own ticket, and its own ADR where an
  existing decision changes. Nothing in D7 that he did not answer is accepted.
- **Answered:**
  - **Q-3K-1, the time part.** The 3 000 claim is read at **40/15** (40 moves in 15 minutes, about 22 s a move), not
    at 4 s a move. That replaces D5 item 2's "one 120 + 1 reading at the claim". The scale (Stockfish 19 `UCI_Elo`)
    and the claim rule (D5 item 5) were not contested. They stand as proposed, accepted in direction. The claim plan
    is under D5 (dated block, 2026-11-01).
  - **Routine readings use shorter controls, down to 0.5 s a move** (his word). The controls proposed are under D5
    (dated block). The claim stays at 40/15.
  - **Q-3K-5, scope.** A **new epic** (`EPIC-011`, created by BA/PM, task `bapm-epic011-dedupe`). It **starts after
    the open epics close**, and no work is done twice (his dedupe word, BA/PM's audit).
- **Still open (his):** Q-3K-2 (SPRT in the per-change rule), Q-3K-3 (test width, cores), Q-3K-4 (`G6` "≥ base"),
  Q-3K-6 (`NFR-009` above 16 MiB), Q-3K-7 (tuning data), Q-3K-8 (bitboards, later), and `ADR-0055`'s Q-SP-3
  (`ABC-254`, the `ADR-0003` amendment). See D7's dated lines.
- **One order line is corrected:** D6 Phase 0's "O1-a, then O1-b/c" yields to `ADR-0055` D4 as BA/PM cut it.
  `ABC-250` (O1-b part 1, the gate reading) comes first and `ABC-253` (O1-a) after. See D6's dated line.
- **One estimate is corrected:** D5 item 3's pick depth at E ≈ 3 000 is **14**, not 18–20 (read from Stockfish's
  `search.h` at `sf_19`). See D5's dated block.

*Original status, kept:* **PROPOSED** 2026-11-01 by Architect/Design (task `arch-algo-analysis`, records and reading only, at `main` `bae25131`).
**Nothing is decided here.** Nothing was run, built, benchmarked or played: `qe-ABC-223` holds the host STRICTLY ALONE.
Every Elo figure below is either quoted from a sealed reading (named) or is an **estimate** with its basis. An
estimate is not a reading.

- **Source of the question.** The owner, 2026-11-01, verbatim (`orch-2026-10-30a` `…74216a44`): *"Analyze current
  state of algorithms, maybe this needs separate spike ticket, also I remember some tickets addressing similar topics,
  check if they are done and do we need to analyze algorithm side. As we can see it is possible to reach 3000 elo
  rating without neural engine? Set the goal to 3000 elo rating from current goal."*
- **What is the owner's:** the scale and time control a "3 000" is read on (D5); any change to his `EPIC-010` merge
  rule (Q4 = (e)); the `G6` "≥ base" reading rule (his word `…2ae5fc12`); the test width (his "one at a time",
  `…65848126`); scope changes, including re-running what `EPIC-010` § Out of scope fences; any NFR level (`NFR-009`
  above 16 MiB); re-opening `ADR-0001` (bitboards). D7 lists them. No agent marks any part of this ADR accepted.
- **What this ADR amends if accepted:** nothing by itself. It proposes an order (D6). Each step brings its own ticket,
  and its own ADR where an existing decision changes.
- **Companion:** `ADR-0055` is ACCEPTED (O1) by its dated status line of 2026-11-01. This ADR does not change it.

## Context

### Today's outside reading

- Milestone 1's batch (`qe-EPIC-010-m1-batch-2` `…1a53a7f9`): head `51902be5` scored **72.00 % ± 6.11** (141/53/6) at
  4 000 ms a move against Stockfish 19 `UCI_LimitStrength` E = 1 910 at `st=0.5`. That is E + 164 ≈ **2 074 on
  "Stockfish 19's `UCI_Elo` scale at R's pins on this host"** (`EPIC-008` § The two readings). Base `ca6e675c` read
  78.25 %. The pair is NOT LOSS but its point estimate is −58.3 ± 77.9.
- `EPIC-008`'s close R fell −82.9 ± 73.8 (`bapm-close-EPIC-008`). **Two consecutive outside readings after value
  changes have negative point estimates.** No reading isolates the cause (`UNKNOWN - verify`). One untested hypothesis
  is `ABC-215`'s rule-derived values, which replaced Michniewski's tables (D NEUTRAL +15.6 ± 23.8 in self-play).
- **The "8× time odds" is nominal.** With `UCI_LimitStrength`, Stockfish 19 picks its move once, at depth 1 + level,
  and keeps it (`ABC-204` § The pins, `search.cpp:557-559`, `625-628`, `search.h:247-268` at `sf_19`). Its strength is
  pinned by depth, not time. 0.5 s matters only as headroom for that depth.
- **The scale's calibration** (`ABC-204`): Stockfish's README says *"calibrated at a time control of 120s+1.0s and
  anchored to +- 100 Elo to CCRL Blitz"*; `search.h` says *"Skill 0 .. 19 now covers CCRL Blitz Elo from 1320 to
  3190, approximately"*. R's control is not 120 + 1, so R is not CCRL.

### Inventory of `src/` at `bae25131`: search

Two recursions hold one algorithm: `src/search.ts` (`search` plus 11 test-only doors) and the shipped, abortable copy
in `src/engine.ts` (`chooseMove` plus 5 doors), held together by the `ABC-078` identity sweep.

| technique | present? | parameters and form | cite |
|---|---|---|---|
| Negamax alpha-beta | yes | fail-soft; score for the side to move | `search.ts:428-552`, `engine.ts:375-468` |
| Iterative deepening | yes | depth 1 unabortable; clock read every 1 024 nodes; an aborted iteration is discarded whole; the root move list is generated once | `engine.ts:170`, `:302-312`, `:698-760` |
| Time use | basic | `level`: a fixed budget a move (level 5 = 4 000 ms, `levels.ts:55-61`); clock share `time / movestogo + inc / 2`; `uci-clock-mode` `safeClockShare`. **No soft/hard limit, no "will the next iteration finish" test, no use of a partial iteration** | `uci-session.ts:216-217`, `:295-320`; `engine.ts:733-751` |
| PVS | yes | null window for every move after the first; full re-search on a fail-high inside the window | `search.ts:570-648`, `engine.ts:477-501` |
| Aspiration windows | **no** | full window every iteration ("aspiration windows … none requested") | `engine.ts:96-98`, `:538` |
| LMR | yes, minimal | **1 ply, flat**, at index ≥ 3, remaining depth ≥ 3, not root, not capture/promotion, not in check, not giving check; reduced fail-high re-searched at full depth | `search.ts:307-336` |
| Null move | yes | **R = 3 fixed**; off at root, after a null move, depth < 2, in check, and with < 3 non-pawn pieces; returns beta; null-window nodes only; no verification search | `search.ts:338-374`, `engine.ts:405-429` |
| Futility, reverse futility, razoring, late-move pruning | **no** | — | (absent in `search.ts`, `engine.ts`) |
| Check extension | **no** | `ADR-0051` accepted, not in force: `ABC-210` closed unmerged | `ADR-0051` § Status |
| Singular extension, IID/IIR, mate-distance pruning | **no** | — | — |
| Quiescence | yes | captures (MVV-LVA, insertion sort); in check: every legal move, none = mate (`ABC-228`); quiet queen promotions (`ABC-229`); stand pat out of check; cap 8 plies; no TT in quiescence | `quiescence.ts:132`, `:169-221` |
| Delta pruning, SEE, quiet checks in quiescence | **no** | "a recorded decision rather than an omission" | `quiescence.ts:40-44`; `ADR-0024` d4 |
| Move ordering | yes | hash move (3 000 000) > captures and promotions by `mvvLvaKey` (victim + promotion − attacker/1000) > 2 killers per ply (quiet only, kept across iterations of one move) > generation order | `search.ts:163-243`; `quiescence.ts:75-89` |
| History / countermove / continuation history | **no** | — (`ABC-233` Backlog) | — |
| SEE for ordering | **no** | — (`ABC-234` Backlog, fenced) | — |
| Transposition table | yes | 2^18 slots × 16 B = **4 MiB**; full 64-bit key verified; **cleared at every `chooseMove`**; **always replace**; **cutoff only at exactly the stored depth** (`entryDepth(slot) !== depth`); mate scores ply-adjusted; hash move matched against the legal list | `transposition.ts:17-33`, `:42-45`, `:79-87`, `:156-170` (`:163`) |
| Repetition | yes | in-tree: one earlier occurrence on the path = 0; before the root: two earlier occurrences (`ABC-230`, `ADR-0054`); window ≤ 100 plies | `search.ts:146-153`; `engine.ts:228`, `:350-362`, `:388-394` |
| 50/75-move, dead position at the leaf | yes | `leafEndReason`: no legal move, insufficient material, 75-move | `gameend.ts:206-211` |
| Move generation and legality | 0x88; one heap object per move; make/test/unmake of every pseudo-legal move; captures-only generator for quiescence; `givesCheck` without a move played | `legal.ts:69-83`, `:116`, `:194`; `ADR-0003` |
| Opening book | yes | Zobrist-keyed JSON (`ADR-0037`) | `book.ts`, `book-engine.ts` |
| Threads, pondering | no | single-threaded by decision | `EPIC-010` § Out of scope |

### Inventory: evaluation (`src/evaluate.ts`)

One pass over the board; score for the side to move. **Nothing is tapered.**

| term | present? | values | cite |
|---|---|---|---|
| Material | yes | P 100, N 325, B 325, R 500, Q 900 | `:46-54` |
| Piece-square tables | yes, one per piece, **untapered** | rule-derived (`ABC-215`): pawn `2e(R−2)`; knight `10n−50`; bishop `10·ring−10`; rook +20 on the 7th only; queen `5·ring−5`; king prefers b1/g1 in **every** phase | `:66-148` |
| Pawn structure | yes | doubled −15, isolated −10; memoised by pawn masks (2^14 slots) | `:188-189`, `:333-436` |
| Passed pawns | yes, rank only | 0, 5, 10, 20, 35, 60, 100 | `:190`, `:199-214` |
| King safety | pawn shelter only | per file around the king: no shelter pawn −15, half-open −10, open −20. **No attacker count, no king zone** | `:222-224`, `:282-313` |
| Mobility | yes, crude | 4 cp per reachable square, all pieces alike, total clamped to ±100 | `:232-233`, `:244-275`, `:527` |
| Bishop pair, rook on (semi-)open file, outposts, threats, hanging pieces, space, tempo, backward/connected pawns, passer king distance, endgame scaling (opposite bishops, drawish material), mop-up | **no** | — | — |
| Incremental evaluation | no | full recompute per call | `:482-536` |

### What was tried before (from the records)

| ticket | what | outcome | what the records say it is worth |
|---|---|---|---|
| `ABC-075`…`ABC-087` (`EPIC-004`) | Zobrist, eval, negamax, ID, quiescence, ordering, TT, pawn terms, king safety + mobility, puzzles, ladder, levels | Done | the engine's base |
| `ABC-121` | PVS + LMR | Done | `ADR-0026`; graded on work and a drift oracle |
| `ABC-205` | king-safety term while queens are on + tapered king table | **dropped** 2026-10-25: `G6` "≥ base" missed on `position-6` (median depth 7 vs 8); D never run | cost, not play: the forms sit on `grugops/ABC-205-final` `b5d5cea5` |
| `ABC-206` | value-identical speed-up | Done | D waived |
| `ABC-207` | mobility weighted per piece, early-queen term | **dropped**: D LOSS −18.3 ± 16.5 (800 games) | hand weights lost |
| `ABC-208` | null move R = 3 | Done: D GAIN +38.4 ± 23.3 | the one value change with a measured self-play gain |
| `ABC-209` | TT kept across the moves of a game | **dropped**: D NEUTRAL +8.7 ± 18.3; code on `grugops/ABC-209` `bb6cf451`; `ADR-0025` d4 amendment accepted, not in force | read **under exact-depth cutoffs** (see D3, row T3) |
| `ABC-210` | check extension at the horizon, form (a) | **dropped**: D NEUTRAL −4.8 ± 16.2; `ADR-0051` not in force | the horizon case is now covered by `ABC-228` |
| `ABC-211` | deeper English book | dropped (owner O0) | — |
| `ABC-215` | own, rule-derived eval values | Done: D NEUTRAL +15.6 ± 23.8 | EPIC-008's R fell −82.9 ± 73.8 over the epic; share unknown |
| `ABC-228`, `229`, `230`, `241`, `242` | quiescence evasions, quiet promotions, game history in search, ep key, blunder-path repetition | Done (milestone 1); smokes passed | milestone 1 batch −58.3 ± 77.9 (NOT LOSS) |
| `ABC-227`, `235`, `240` | profile, value-identical cuts | Done: 1.20–1.28× and 1.09–1.12× | S2 |

**EPIC-010's Backlog (milestones 2 and 3), all still standing, all DoR 8–9/10, none started:**

| ticket | covers | waits on | still stands? |
|---|---|---|---|
| `ABC-231` | king table tapered by phase, alone | `ADR-0031` addendum ruling | yes, but it is a subset of a full taper (D3, E1) |
| `ABC-232` | passed pawns by phase | `ABC-231` | yes; subset of E1 |
| `ABC-233` | history heuristic after killers, cleared per search | ADR (`ADR-0026` d10) | yes |
| `ABC-234` | SEE for full-width capture ordering only | `ADR-0024` d4 re-open evidence (A0), ADR | yes; SEE pruning is fenced out of `EPIC-010` |
| `ABC-236` | root aspiration windows from depth 5 | new ADR | yes |
| `ABC-237` | depth-preferred TT replacement | `ADR-0025` amendment | yes |
| `ABC-238` | deeper stored entry may cut a shallower search | ADR revising `ABC-081` `A1`; after `ABC-237` | yes; **the cheapest real gap in the search** |
| `ABC-239` | offline eval tuning, constants only, outside validation | milestone 2's eval, data licence (`ADR-0048`), method ADR | yes; the largest single eval lever |

Every one of these is a real gap, and none is done. Every one is gated on `G6` "≥ base" (floor 6), and each is graded
on the smoke pair, which "cannot see a loss of tens of Elo" (`EPIC-010` § What 10 games can and cannot see).

### The measurement problem, stated once

- A classical engine climbs by many changes of +5 to +40 Elo each. Every instrument on record resolves far coarser:
  the smoke pair sees ≈ 250 Elo collapses; the 200 + 200 R pair resolves ± 77.9 (`…1a53a7f9`); the 800-game D reading
  resolved ± 16–23 and cost ≈ 34 h at 23.3 games/h.
- Two negative outside point estimates in a row, with no instrument able to say which change caused them, are what
  that looks like in practice.
- The engines that reached 2 700–3 400 classically were developed with sequential tests (SPRT) over thousands of fast
  games per change (Blunder's changelog quotes self-play gains to ± 16–38 per version; Texel's tuning gains were each
  read on 32 000 games at 1 s + 0.08 s).

## Decision

**PROPOSED, decides nothing.** D1–D4 are analysis. D5–D6 are the proposal the owner may accept, change or refuse.

### D1. What skytalix has, in one paragraph

A correct, conservative 2010-era search core (PVS, ID, 1-ply LMR, R = 3 null move, killers, MVV-LVA, a small
exact-depth TT, a sound quiescence with evasions) over an untapered, untuned, rule-derived evaluation (material, one
PST per piece, three pawn terms, a pawn-shelter king term, a capped mobility count), on a 0x88 object-move board at
0.63–0.90 M nodes/s (`qe-ABC-240`). It reads ≈ 2 074 on R's scale.

### D2. What it lacks, by area (the gap list toward 3 000)

**How to read the Elo column.** Each figure is an **estimate** of the self-play gain at about this engine's strength
and 4 s a move, informal and low confidence. Outside (R) gains are expected smaller (`RISK-EPIC008-03`). Gains do not
add: they overlap, and each later one is worth less. The basis column names the source.

Bases: **[B]** Blunder's changelog (a Go HCE engine from 2 038 CCRL at v5 to ≈ 2 700 at v8.5.5; self-play gains per
version, often bundled); **[T]** Texel's tuning record on CPW (+99.6 in seven steps on an already hand-tuned engine,
32 000 games each); **[t]** tomitankChess 4.0 (pure JavaScript, before its NN in 5.0) at 2 820 ± 27 CCRL 40/15
(2020-05-02), with "see pruning", "better lmr"; **[D]** `ADR-0055`'s 50–100 Elo per speed doubling; **[R]** this
repo's own readings; **[J]** Architect judgement from common practice (lowest confidence).

| id | gap | est. Elo | basis | cost | risk | depends on | ticket |
|---|---|---|---|---|---|---|---|
| **M0** | **SPRT self-play lane** (short control, sequential test, thousands of games) | enabler, 0 | [B], [T] method | M (`tools/`) | low code; host time high | owner: width, rule (D7) | **none — new ticket** |
| T1 | TT cutoff at stored depth ≥ requested | +15–40 | [J] | M | medium (revises `ABC-081` `A1`) | `ADR` | `ABC-238` |
| T2 | depth-preferred replacement (or two-slot bucket) | +5–15 | [B] 8.0 buckets; [J] | S | low | T1 order free | `ABC-237` |
| T3 | TT kept across moves, re-tried **after T1** (its NEUTRAL was read under exact-depth cutoffs, where a kept entry almost never cuts) | +10–30 after T1 | [R] `ABC-209` +8.7 ± 18.3; [J] | S (code exists, `bb6cf451`) | low | T1, T2; scope (fenced) | `ABC-209` re-cut (owner: scope) |
| T4 | larger TT (16–64 MiB) | +5–15 at 4 s | [J] | XS | low | `NFR-009` (16 MiB now; owner pre-offered 128 MiB, 2026-09-25) | none — new ticket |
| P1 | LMR by a log table of depth × move index, history-adjusted | +40–100 | [B] 7.1 (LMR + futility + SEE +115.6 ± 25.1), 7.3; [t] | S–M | medium | ordering helps | **none — new ticket** |
| P2 | reverse futility (static null move) | +30–60 | [B] 6.0 (RFP + history +80–100) | S | low–medium | eval scale | **none — new ticket** |
| P3 | futility pruning near the leaves | +15–40 | [B] 7.1 | S | medium | P2 | **none — new ticket** |
| P4 | late-move (move-count) pruning | +20–40 | [B] 7.5 (≈ +30) | S | medium | P1 | **none — new ticket** |
| P5 | null move: R grows with depth (and eval margin) | +10–30 | [B] 7.3; [J] | S | low (`ADR-0050` amend) | — | none — new ticket |
| P6 | razoring | +5–15 | [B] 8.0 | S | medium | P2 | none — new ticket |
| O1h | history heuristic (+ malus) | +20–50 | [B] 6.0, 7.6 | M | low | — | `ABC-233` |
| O2c | countermove / continuation history | +10–30 | [J] | M | low | O1h | none (out of `ABC-233` scope) |
| O3s | SEE for capture ordering | +10–30 | [B] 7.1; [J] | M | low | — | `ABC-234` (fenced, A0) |
| Q1 | SEE pruning of losing captures (quiescence and main) | +20–50 | [t] "see pruning"; [J] | S after O3s | medium | O3s; `ADR-0024` d4 | none (fenced out of `EPIC-010`) |
| Q2 | delta pruning in quiescence | +5–20 | `ADR-0024` (1.5× trim measured) | S | low | — | none (fenced out of `EPIC-010`) |
| S1 | aspiration windows | +10–30 | [J] | M | low | T1 | `ABC-236` |
| X1 | check extension at every depth (not `ABC-210`'s horizon form) | +10–30 | [J]; [R] `ABC-210` −4.8 ± 16.2 (other form) | S | medium | — | `ABC-210` re-cut, other form (owner: scope) |
| X2 | singular extension (+ IIR) | +20–50 | [B] 8.0, 8.5.5 | M | high | T1 | none — new ticket |
| W1 | time use: no doomed iteration started; keep a partial iteration's root move when it beat the incumbent; soft/hard limits under a clock | +10–40 | [B] 7.4 time management; [J] | S–M | low | — | none (`EPIC-009` built modes, not this) |
| V1 | O1-a/b/c speed (1.08–1.35×) | +5–45 | [D], `ADR-0055` | 3–5 tickets | low | — | being cut now (`bapm-goal3000-o1-cut`) |
| V2 | O1-d lazy legality (1.25–1.85× with O1) | +15–90 total | [D] | M | medium | `ADR-0003` amend (owner) | O1-d (Backlog) |
| V3 | staged move generation (hash move before generating; captures before quiets) | +10–30 | [J] | M | medium | V1, V2 | none — new ticket |
| V4 | bitboards (re-open `ADR-0001`) | +50–150 (2–3× node rate, `UNKNOWN - verify`) | [D]; [J] | XL | high | everything | none (owner: architecture) |
| E1 | **full taper**: every PST and material term in middlegame and endgame halves, blended by phase | +40–120 | [B] 3.0 (taper + killers + perft TT ≈ +207), 5.0; [J] | M | low | — | `ABC-231` + `ABC-232` are subsets |
| E2 | **offline tuning** of all weights (Texel / logistic fit) | +100–250 here (rule-derived start) | [T] +99.6 on an already-tuned engine; [B] 7.0, 7.3 | L | medium (data, overfit) | E1; data licence (`ADR-0048`); M0 helps (games = data) | `ABC-239` |
| E3 | king attack: attackers on the king zone, weighted, tapered | +40–100 | [B] 7.3, 7.4; [R] `ABC-205` died on `G6` | M | medium | E2 | none (`ABC-205` dropped) |
| E4 | pawn and passer terms: backward, connected/phalanx, passer king distance, free path, unstoppable | +20–60 | [B] 7.3, 7.4 | M | low | E1, E2 | `ABC-232` (part) |
| E5 | piece terms: bishop pair, rook on open/semi-open file, outposts, mobility per piece (tuned) | +30–80 | [B] 7.4, 8.0; [R] `ABC-207` hand weights lost | M | low | E2 | none (`ABC-207` dropped) |
| E6 | threats (pawn attacks on pieces, hanging pieces), tempo | +20–50 | [J] | M | low | E2 | none — new ticket |
| E7 | endgame scaling and knowledge (opposite bishops, drawish material, mop-up) | +10–30 | [B] 6.1, 8.0 | M | low | E1 | none — new ticket |

**Top gaps by expected Elo per cost** (estimates): P2 reverse futility, P1 log LMR, P4 move-count pruning and T1
deeper cutoffs (each S–M, each +15–100); then E1 + E2, the taper and the tuner (M + L, together +140–370, the
largest block); then O1h history, T2/T3/T4 (S, cheap once T1 is in), Q1 SEE pruning, S1 aspiration; then the eval
terms E3–E7, each best added under the tuner; then X2 singular extensions and V3/V4 speed.

### D3. Is 3 000 reachable without a neural network?

- **For a classical engine, yes, in principle.** Stockfish 11, the last hand-crafted Stockfish, reads ≈ 3 430 CCRL
  40/15 (1 CPU). Fruit 2.1 reads ≈ 2 695. Several C/C++ hand-crafted engines sit above 3 000.
- **For a single-threaded TypeScript engine, 3 000 would be beyond the best public precedent found.** tomitankChess
  4.0, pure JavaScript and hand-crafted, read **2 820 ± 27 CCRL 40/15** after years of work. Its author estimated
  "over 2900" for the same engine in C. Lozza (JavaScript, Fruit-inspired) is lower. No TypeScript engine with a list
  rating was found (`UNKNOWN - verify`; not exhaustive).
- **The arithmetic** (estimates): D2's rows sum to roughly +520 to +1 330 in self-play. Discounted for overlap and
  self-play inflation (× 0.5–0.7), that is ≈ +260 to +930 outside, on today's ≈ 2 074. **Central landing ≈ 2 550–2 800
  on R's scale; 3 000 at the optimistic edge.** Blunder's path (2 038 → ≈ 2 700 CCRL with most of D2's search and
  eval rows, on bitboards) is the nearest worked example and agrees.
- **The honest answer:** reachable without a neural network, as a stretch goal. It needs essentially all of D2, a
  tuned evaluation, an instrument that sees +5 to +20 Elo (M0), and very likely a speed step beyond O1 (O1-d, staged
  generation, perhaps bitboards). Without M0 the climb cannot be steered: changes of that size are invisible to every
  instrument on record. Probability of 3 000 on R's scale with O1 alone: low (judgement, < 1 in 4). Confidence in
  every number here: low.
- **Caveats.** The scale is unnamed (D5). Readings against `UCI_LimitStrength` Stockfish are not engine-list ratings;
  the mapping is approximate by Stockfish's own words (± 100) and unmeasured on this host. A longer think time would
  raise skytalix's R reading without making it stronger at a fixed control, so the time must be part of the scale.

### D4. Ticket coverage, summarised

- **Covered by `EPIC-010`'s Backlog:** T1, T2, O1h, O3s, S1, E2, and parts of E1/E4 (`ABC-231`, `ABC-232`).
- **Tried and dropped, worth a re-try because a precondition changed:** T3 (`ABC-209`, after T1), X1 (`ABC-210`, at
  every depth rather than the horizon), E3 (`ABC-205`, if `G6` is read differently), E5 (`ABC-207`, by the tuner, not
  by hand). Each is fenced by `EPIC-010` § Out of scope ("Re-runs of what was tried").
- **Fenced by `EPIC-010` § Out of scope:** Q1 SEE pruning, Q2 delta pruning, rook activity by phase (part of E5).
- **Not covered anywhere:** M0, P1–P6, O2c, X2, W1, T4, V3, V4, E6, E7.
- **Speed:** V1 is being cut by `bapm-goal3000-o1-cut`; V2 waits the owner's yes on `ADR-0003`.

### D5. Measuring a 3 000 goal

**Today:** skytalix at 4 000 ms a move against Stockfish 19 E = 1 910 at `st=0.5`, 200 games, reads ≈ 2 074 (+57 / −50 from the ± 6.11-point interval) on
R's scale.

**What a "3 000" reading needs:**
1. **A named scale, the owner's call.** The proposal: Stockfish 19 `UCI_Elo` (≈ CCRL Blitz ± 100 by Stockfish's own
   calibration), because it is the instrument this repo already runs and it reaches 3 190. Alternatives: CCRL 40/15 or
   Blitz via a gauntlet against list-rated engines (foreign binaries: an owner yes on downloads); FIDE (not applicable
   to engines); Lichess bot (a different, human-dominated pool).
2. **A fixed time for skytalix, part of the scale.** Either level 5's 4 000 ms a move (continuity with every reading on
   record) or Stockfish's calibration control, 120 s + 1 s a game (needs W1's time management, which does not exist).
   Recommended: 4 000 ms a move for the trend, plus one 120 + 1 reading at the 3 000 claim.
3. **Stockfish's `st` raised with E.** At E ≈ 3 000 Stockfish picks at depth 1 + level ≈ 18–20 (`UNKNOWN - verify`;
   level comes from a cubic fit). `ABC-204`'s probe read depth 12 at 250 ms, so `st=0.5` may not reach it, and its
   guard would make the reading UNRESOLVED. The fair setting is **equal time** (Stockfish `st` = skytalix's 4 s),
   which roughly doubles each game's wall time (estimate: ≈ 20–25 h ALONE per 200-game reading at width 1).
4. **E stepped up by `ABC-204`'s band rule** (keep the score in 25–75 %; E′ = E + X, clamped to 1 320–3 190). The cap
   does not block a 3 000 claim: E = 3 000 at ≥ 50 %, or E = 3 190 at ≥ 25 %, both read it.
5. **A claim rule, the owner's call.** Proposed: a milestone M is MET when a 200-game reading at E = M scores ≥ 50 %
   (point estimate ≥ M); the interval is reported, not graded.

**Milestones proposed:** 2 200, 2 400, 2 600, 2 800, 3 000 on the chosen scale. Each is a reading after a block of
D6 lands, not a gate on any ticket.

**Per-change measure (M0):** an SPRT lane, self-play at a short control (for example 10 s + 0.1 s a game, or fixed
nodes), bounds [0, 5] Elo for a gain and [−5, 0] for a simplification or speed change, a few thousand games per test.
The smoke pair stays as the fault, time-loss and collapse guard. Milestone R readings catch self-play non-transfer.
Throughput is the owner's call: at width 1 an SPRT test costs ≈ 10–30 h (estimate); with the CPU's spare cores in use
it costs a few hours, but the host is then not "one at a time".

#### Dated 2026-11-01 (owner fold, `arch-adr0056-owner-fold`): the claim at 40/15, and the fast routine controls

The owner set the claim's time control (Q-3K-1) and allowed shorter routine controls, down to 0.5 s a move
(`…022fb66f`). This block amends D5 items 2 and 3 and the per-change paragraph above. Items 1, 4 and 5 stand. Every
hour and game count below is an **estimate**, with its basis named. None is a reading. Nothing was run.

**Facts used** (from the records, not re-read on the host):
- Width 1 is the owner's rule, for heat. At width 2, Tctl read a median of 87.05 °C, and he moved readings to one game
  at a time (`…65848126`). At width 1, `ABC-222`'s 40/15 self-play read a Tctl median of 73.9 °C and a max of 76.1 °C.
  Its frequency fell ≤ 0.01 % over 3.44 h for 5 games, about 41 min a game with both sides on the clock and an 80-move
  cap (`qe-ABC-222` `…00cc4db1`). The longest clean run at width 1 on record is the milestone 1 R pair: 22.22 h,
  400 games, 18.0 games/h, 0 thermal pauses (`ADR-0053`). That is about 200 s a game at 4 s + 0.5 s a move.
- **Stockfish's pick depth, read from `search.h` at `sf_19`.** `level = clamp(((37.2473·e − 40.8525)·e + 22.2943)·e −
  0.311438, 0, 19)`, with e = (E − 1 320) / 1 870. The pick is made at depth 1 + int(level). This reproduces
  `ABC-204`'s two recorded values: level 2.56 at E 1 650, and depth 5 at E 2 000. It gives:

  | E | 2 200 | 2 300 | 2 400 | 2 600 | 2 800 | 2 900 | 3 000 | 3 190 |
  |---|---|---|---|---|---|---|---|---|
  | pick depth | 6 | 6 | 7 | 8 | 11 | 12 | **14** | 19 |

  D5 item 3's "≈ 18–20 at E ≈ 3 000" was wrong; it is 14. `ABC-204`'s probe read depth 12 at 250 ms, but that was on
  the previous host and from a probe position. So `st=0.5` holds the pick depth with headroom up to about E 2 600.
  Above that it is `UNKNOWN - verify` on this host.

**C1. The 3 000 claim reading, at 40/15.**
- **skytalix:** a real 40/15 clock (`cutechess-cli` `tc=40/900`). The time mode is `uci-clock-mode` if `ABC-223`
  reads it MET, because that mode spends the clock as a clock. Otherwise it is `simple-tournament` (22 s a move,
  capped by the clock; M1 and M2 were MET at `ABC-222`). Both are about 22 s a move, the owner's figure. Book on, as
  the product ships.
- **Time management (W1)** is not needed for the claim to be legal: both modes have never lost on time (`EPIC-009`
  M1). It is needed for strength. With no "will the next iteration finish" test, an iteration that cannot finish is
  aborted and thrown away. At a branching factor of about 2.5–3, that is often half or more of a move's time (estimate,
  `[J]`). W1 lands before the claim reading, inside `EPIC-011`. Its gain is graded at the fast control (C2): the waste
  is a share of the move's time, so it shows at 0.5 s as well.
- **Stockfish's side:** 19, `UCI_LimitStrength`, `UCI_Elo` = E, `Threads 1`, `Hash 16`, as `ABC-204` pins it. E is
  stepped by `ABC-204`'s band rule (D5 item 4). **Its move time is fixed (`st`), not a clock.**
  - Its play is pinned by depth: it picks at depth 1 + int(level) and keeps that move. So any time past that depth
    changes nothing in play (`ABC-204` § Q2). That holds just as much on the 120 + 1 clock its scale was calibrated
    on.
  - The fixed time is set at PREREG by a probe on this host. It is at least 4× the 95th percentile of
    time-to-pick-depth over the reading's openings, with a floor of 0.5 s. Estimate at E 3 000 (depth 14): about
    2–4 s (`UNKNOWN - verify`).
  - `ABC-204`'s depth guard stays: a Stockfish move below its pick depth makes the reading UNRESOLVED.
  - **The alternative is both engines on the same 40/15 clock.** That is the same strength for Stockfish and about
    twice the wall time. It is open to the owner if he prefers both sides on one clock to read the claim (see D7).
- **Games:** 200, at E = 3 000. MET when the score is ≥ 50 % (D5 item 5); E = 3 190 at ≥ 25 % reads it as well. At a
  50 % score, 200 games give about ± 40–45 Elo (95 %), by the spread of the R readings on record (± 6.11 points at
  200 games).
  - **Futility stop, pre-registered:** after 100 games, a score below 41 % (more than 2 SE under 50 %) stops the
    reading as NOT MET. That saves about 1.5 days. The stop can only fail a claim. It can never make one.
- **Host hours at width 1 (estimate):** skytalix spends about 20 min of clock a game (`ABC-222`'s 41 min for two
  sides). Stockfish spends about 2–3.5 min (≈ 50 moves × 2–4 s). That is about 22–24 min a game, and **≈ 75–80 h
  (about 3.2 days) ALONE for 200 games**. On the equal-clock alternative it is ≈ 130–140 h (about 5.5–6 days).
- **Heat:** width 1 only, on mains, with `ABC-222`'s A7 rule (a sampler ≤ 60 s, the Tctl median per quarter and the
  max, and a frequency fall > 5 % from the first quarter makes the session UNRESOLVED, re-run once).
  - The run is split into **sessions of 50 games** (≈ 19–20 h each, inside the 22 h the host has run clean), each a
    fixed, seeded slice of the openings. A cool-down gap between sessions waits until Tctl is back at its idle level
    (the level is pinned at PREREG).
  - A thermal or fault event then costs one session, not the reading. Holding Tctl near 74 °C for days is
    `UNKNOWN - verify`: nothing on record has run longer than 22.22 h.
- **When to spend it:** only when a 4 s trend reading, plus the measured 40/15 offset (C4), puts the point estimate
  at or above 3 000. Otherwise the 3 days buy a known NOT MET.

**C2. The per-change SPRT, the fast routine control** (the tool is M0; whether its verdict enters the per-change rule
is still Q-3K-2):
- **Control: 0.5 s a move on both sides** (`st=0.5`; `movetime` is the budget under level 5's cap), self-play,
  candidate against base. Each opening is played with both colours. The opening set is fixed and seeded, and larger
  than `ABC-204`'s 100 positions; its size is M0's. Width 1.
- **Bounds:** gain tests H0 Elo ≤ 0 against H1 Elo ≥ 10. Non-regression tests (a value change meant to be neutral,
  such as a simplification) use [−10, 0]. α = β = 0.05. Value-identical tickets stay on their S2 perft/nps reading,
  with no games.
  - D5's [0, 5] is **not affordable at width 1**. The arithmetic (estimate; logistic SPRT, about 30 % draws): [0, 5]
    needs about 4× the games of [0, 10]. [0, 10] needs about 700 games for a true +40, about 1 650 for +20, about
    5 000 for +10 or for 0, and about 7 300 at worst (+5).
  - D2's early rows (P1, P2, P4, T1) are estimated at +15 to +100. They end in the low thousands of games or fewer.
    Rows smaller than +10 need more width (Q-3K-3) or wait for the block reading.
  - D5's "a few thousand games per test" and "≈ 10–30 h" were optimistic for [0, 5]. This replaces them.
- **Throughput (estimate):** at 0.5 s a move, a game is about 90 plies × 0.5 s plus engine start, so ≈ 45–55 s, or
  **≈ 65–80 games/h at width 1** (scaled from the R pair's 200 s a game; `UNKNOWN - verify`, read on M0's first run).
  A +40 change ends in ≈ 10 h, a +20 change in ≈ 24 h, and a null change in ≈ 70 h. A **cap of 6 000 games
  (≈ 85 h)**: a test still running at the cap has not shown a gain.
- **Depth caveat at 0.5 s:** skytalix reaches about 2 plies less than at 4 s (median depth 7–8 at 4 s, `G6`; so about
  5–6, `UNKNOWN - verify`). Where a ticket's mechanism barely fires at that depth (X2 singular extensions, T4 a larger
  TT, depth-scaled null move P5), the Architect names a longer SPRT control at design. Use 2 s a move (about
  4× slower), and show the mechanism's firing rate at 0.5 s as the reason.
- The smoke pair stays as the fault, time-loss and collapse guard, as D5 says.

**C3. Milestone trend readings, against Stockfish:** R's instrument at **4 s a move** (level 5), Stockfish at E by the
band rule, with `st` held to the pick-depth headroom rule in C1 (0.5 s up to about E 2 600). 200 games, width 1,
≈ 11–12 h ALONE (18.0 games/h, `ADR-0053`).
- **Why 4 s and not 0.5 s:** it continues every outside reading on record (≈ 2 074, `…1a53a7f9`). It is also about
  2.5 doublings from 40/15 (22/4), where 0.5 s is about 5.5. So its offset to 40/15 is smaller and drifts less.
- A 0.5 s reading against Stockfish (≈ 3 h for 200 games) may be used as a quick check between milestones. It is
  labelled as such and is never a milestone.
- Milestones 2 200 … 2 800 are trend readings at 4 s, reported as "at 4 s a move", plus the latest measured offset.
  Only 3 000 is claimed, and only at 40/15 (C1).

**C4. The 40/15 anchor readings** (the readings the Architect names at 40/15 besides the claim):
- **A0, first reading of `EPIC-011`:** 100 games at 40/15 at the E the band rule picks (expected about 2 200–2 400).
  Stockfish `st=0.5` holds depth 6–7. It is paired with a 4 s trend reading on the same build, so the 40/15 offset is
  **measured**, not assumed. ≈ 35 h ALONE (about 20.5 min a game).
- **A1, after Phase 4** (the tuned evaluation; the change most likely to move how the engine scales): the same pair
  again, so the offset is re-measured before C1 relies on it.
- Nothing else is read at 40/15.

**What a shorter control can and cannot predict about 40/15** (the scaling caveat):
- **It can predict:**
  - the **sign** of most changes;
  - bugs, collapses and losses on time;
  - time-use changes (W1), which are a share of the move's time;
  - the trend's direction from milestone to milestone.
- **It cannot predict:**
  - **The size of a gain at 40/15.** Evaluation gains often shrink at longer controls. Gains from searching deeper
    (reductions, extensions, a larger TT) often grow, and may read zero or negative at 0.5 s.
  - **skytalix's absolute R at 40/15.** skytalix gains with its own time: about 50–100 Elo per doubling (`ADR-0055`
    [D]), less at depth. Limited Stockfish does not, because its play is depth-pinned. So a 4 s reading
    underestimates 40/15 by an offset. Estimate: about +120 to +250 at 2.5 doublings, low confidence. A 0.5 s
    reading underestimates it by more (≈ +270 to +550, lower confidence still).
  - **The offset after the engine changes.** Better pruning steepens the scaling curve, which is why C4 measures the
    offset twice.
  - **Self-play inflation.** Self-play gains overstate outside gains (`RISK-EPIC008-03`), at any control.
- So no fast reading is a claim. The claim rule stays at 40/15.

### D6. The order proposed (speed and algorithms interleaved)

Ordered by expected Elo per cost, by file collisions (`ADR-0055` D2), and by what each step needs measured.

1. **Phase 0, no games (now):**
   - O1-a, then O1-b/c (value-identical, S2), as BA/PM cuts them. O1-b changes the core's move type, so it lands
     before any ticket that edits `orderMoves`, `negamax` or `evaluate`.
   - **M0**, the SPRT lane (`tools/` only, beside O1, no file collision).
   - The owner calls in D7.
   - `ABC-249` (test-only), already recommended before milestone 2's search tickets.
2. **Phase 1, the TT (S–M, cheap, one file):** T1 (`ABC-238`) → T2 (`ABC-237`) → T3 (`ABC-209` re-try) → T4.
3. **Phase 2, pruning and reductions (S each, the largest search block):** P2 → P1 → P4 → P3 → P5 → P6, each graded
   by M0.
4. **Phase 3, ordering:** O1h (`ABC-233`) → O2c → O3s (`ABC-234`) → Q1, Q2. Then S1 (`ABC-236`).
5. **Phase 4, evaluation:** E1 (the full taper, folding `ABC-231`/`ABC-232`) → E2 (`ABC-239`, the tuner; M0's games
   are its data, positions from the project's own games are allowed by default) → E3–E7, each added and re-tuned.
6. **Phase 5:** X1, X2, W1. O1-d whenever the owner says yes (after O1-b). V3 after O1-d.
7. **Readings:** an R milestone reading after Phases 2, 4 and 5 (D5). If the curve flattens below 3 000 after Phase 5,
   V4 (bitboards) is the next question, and it is the owner's.

The phase order is a recommendation. Within the owner's calls, the Orchestrator and BA/PM may reorder by width and
evidence.

*Dated 2026-11-01 (owner fold, `arch-adr0056-owner-fold`):*
- **The O1 order line. Ruling: `ABC-250` first stands.** Phase 0's "O1-a, then O1-b/c" is withdrawn. O1 runs in
  `ADR-0055` D4's accepted order as BA/PM cut it: `ABC-249` → **`ABC-250`** (O1-b part 1, the perft gate reading) →
  `ABC-251` / `ABC-252` on its reading → **`ABC-253`** (O1-a). That is the board's queue. The reasons:
  1. `ADR-0055` is ACCEPTED, and this ADR's own status says it does not change it. D4 item 2 placed O1-b before O1-a,
     and its fold made the order "BA/PM's cut". So the "O1-a first" in Phase 0 was a slip, not a choice. No reason
     for it was given.
  2. `ABC-250` is the gate. Its ≥ 1.25× bar decides whether `ABC-251` and `ABC-252` exist at all. Reading it first
     settles the most open question for one M ticket.
  3. Its expected yield is the larger (bar 1.25× against `ABC-253`'s 1.02×).
  4. O1-b changes the core's move type, so Phase 0's own rule (land before any ticket that edits `orderMoves`,
     `negamax` or `evaluate`) holds either way.
  No file collision argues for O1-a first.
- **Phases 1–5 and M0 are `EPIC-011`'s** (Q-3K-5). By the owner's order they start after the open epics close. So
  Phase 0's "M0 … now" becomes "M0 first in `EPIC-011`". BA/PM's dedupe (`bapm-epic011-dedupe`) places the
  `EPIC-010` milestone 2 tickets (`ABC-231`…`ABC-239`). This ADR notes only one thing: a ticket graded before M0
  exists is graded by the current rule, with the resolution limits stated under § The measurement problem.
- **Readings (item 7), restated by D5's dated block:** 4 s trend readings after Phases 2, 4 and 5 (C3), 40/15 anchors
  A0 (first in `EPIC-011`) and A1 (after Phase 4) (C4), and the 40/15 claim (C1) only when the trend plus the offset
  reaches 3 000. W1 lands before the claim.

### D7. What is the owner's call

- **Q-3K-1, the scale and the time** a "3 000" is read on (D5 items 1, 2 and 5). The proposal is Stockfish 19
  `UCI_Elo` at 4 000 ms a move, equal time, with one 120 + 1 reading at the claim.
- **Q-3K-2, the per-change rule.** Adding an SPRT verdict (M0) to his Q4 = (e) rule, or putting it in place of the
  D smoke, is a change to his rule.
- **Q-3K-3, width.** SPRT at width 1 is slow; using more cores breaks "one at a time".
- **Q-3K-4, `G6` "≥ base".** It stopped `ABC-205` on cost alone and binds every Backlog ticket. Every eval term costs
  nodes. The proposal: value-changing tickets keep `NFR-005`'s floor (depth 6) and the WARN (depth 7), and are judged
  on play (M0) instead of "≥ base". `NFR-005`'s level does not move.
- **Q-3K-5, scope.** A new epic for the path to 3 000, or `EPIC-010` widened. Either way, it re-opens fenced items:
  re-tries of `ABC-209` and `ABC-210`, SEE and delta pruning, and rook activity.
- **Q-3K-6, `NFR-009` above 16 MiB** for T4. He pre-offered 128 MiB on 2026-09-25 ("if more is needed you can extend
  it to 128MiB"). Moving the level still needs his recorded word.
- **Q-3K-7, tuning data** for E2. The project's own games are allowed by default (`ABC-239` A1). Lichess game exports
  are CC0 by their page. A Stockfish-evaluated position set raises a product-identity question (labels from a neural
  engine). The licence and that question are his.
- **Q-3K-8, later:** re-opening `ADR-0001` (bitboards), only if the readings call for it.
- **Not asked:** any level or budget (`G9` holds), any NFR level other than Q-3K-6, any language change (`ADR-0055`
  O1 holds).

*Dated 2026-11-01 (owner fold, `arch-adr0056-owner-fold`; his word `…022fb66f`):*
- **Q-3K-1: answered (the time).** The claim is read at 40/15, not at 4 s. The scale (Stockfish 19 `UCI_Elo`) and the
  claim rule were not contested and stand, accepted in direction. One sub-choice is left open to him, only if he wants
  it: Stockfish on a fixed, depth-safe move time (recommended; about 3.2 days for 200 games), or on the same 40/15
  clock (the same strength for Stockfish, about 5.5–6 days). D5's dated block C1 uses the first.
- **Q-3K-2: open.** He allowed fast routine controls (down to 0.5 s). He did not say whether an SPRT verdict joins or
  replaces his Q4 = (e) rule. C2 proposes the control and bounds. The rule stays his.
- **Q-3K-3: open.** C2's arithmetic is the input: at width 1, a +20 change costs about 24 h and a null change about
  70 h. Rows below +10 need more width.
- **Q-3K-4: open** (`G6` "≥ base" for value-changing tickets).
- **Q-3K-5: answered.** A new epic, `EPIC-011`, after the open epics close, with no work done twice. Re-trying a
  dropped ticket (`ABC-209` after T1, `ABC-210` in another form, `ABC-205`/`ABC-207` under the tuner) is not "the same
  work twice" only where D4's changed precondition is recorded. BA/PM's audit records it per ticket.
- **Q-3K-6, Q-3K-7, Q-3K-8: open.**
- **`ADR-0055` Q-SP-3 (`ABC-254`, the `ADR-0003` amendment): open.**

### D8. What BA/PM would cut on a yes

- On Q-3K-2/3: the M0 ticket (`tools/` only; acceptance: an SPRT run on a known +gain pair such as `ABC-208`'s door
  terminates H1, and on an identical pair terminates H0).
- On Q-3K-5: a new epic, or `EPIC-010` milestone 2 re-ordered as D6 Phases 1–3, with new tickets P1–P6, O2c, Q1, Q2,
  T4, W1, X2, E3–E7 and re-cuts of T3/X1. `ABC-231` and `ABC-232` folded into E1.
- On nothing: `EPIC-010` milestone 2 proceeds as written, and this ADR's gap list stays a reference.

## Alternatives

- **A neural evaluation.** Rejected by the frame: `EPIC-004`'s permanent non-goal and the owner's question ("without
  neural engine"). E2 tunes constants only.
- **Keep the current per-change rule alone.** Possible (it is today's). It cannot see the +5 to +40 changes the climb is
  made of; the two negative outside point estimates on record are what that looks like.
- **Evaluation first, search later.** Not proposed: E2 needs E1 and data; the pruning rows are S tickets with large
  expected gains and no data wait. Phases 2 and 4 may swap if the owner rules Q-3K-7 first.
- **A port (O2/O3) for speed.** Closed by the owner's O1 choice. V4 (bitboards in TypeScript) is the speed question
  that remains, later.
- **Measure Elo per change on R batches.** Rejected: ± 78 per 200 + 200 games, ≈ 22–24 h ALONE each.

## Consequences

- **If accepted as proposed:** one `tools/` ticket (M0) and the owner's answers first; then about 20–30 S–M engine
  tickets in five phases, each graded on M0 plus the smoke guard, with three milestone R readings. Expected landing
  ≈ 2 550–2 800 on R's scale (estimate), 3 000 at the optimistic edge.
- **If not accepted:** `EPIC-010` milestone 2 proceeds as written (eight tickets), graded on smokes; its gains, if any,
  stay below every instrument's resolution until the epic-close batch.
- **Open `UNKNOWN - verify` items:** every Elo estimate in D2; the mapping of R's scale to any list; the depth
  Stockfish 19 needs at E ≈ 3 000 and the `st` that reaches it on this host; SPRT throughput on this host; the cause of
  the two negative outside point estimates; whether a TypeScript engine with a list rating exists.
- *Dated 2026-11-01 (owner fold):*
  - **Closed:** the pick depth at E ≈ 3 000 is 14 (`sf_19` `search.h`; D5's dated block).
  - **Added `UNKNOWN - verify`:**
    - the `st` that reaches depth 14 on this host;
    - games per hour at 0.5 s a move;
    - skytalix's depth at 0.5 s;
    - the 4 s → 40/15 offset (C4 measures it);
    - multi-day heat at width 1.
  - **Host cost of the claim path at width 1:** A0 ≈ 35 h + 11 h, A1 the same, three trend readings ≈ 11–12 h each,
    the claim ≈ 75–80 h, plus each SPRT test (≈ 10–85 h).

## Rollback

- **This ADR:** nothing to roll back; it changes no code and no level. Withdrawing it leaves `EPIC-010` as written.
- **Each later ticket:** behind its own `ADR-0026` off-door and its own revert, as today.

## Sources (web, read 2026-11-01)

- Blunder changelog (Christian Dean): https://raw.githubusercontent.com/algerbrex/blunder/main/docs/changelog.md;
  "rated close to 2700" on CCRL: the TalkChess thread "Progress on Blunder" (https://talkchess.com/viewtopic.php?p=930590
  and neighbouring posts; which post carries the sentence is `UNKNOWN - verify`)
- Texel's Tuning Method (CPW): https://www.chessprogramming.org/Texel%27s_Tuning_Method
- tomitankChess 4.0 CCRL 40/15 2 820 ± 27 (2020-05-02): https://talkchess.com/viewtopic.php?p=842843; its release
  note: https://www.talkchess.com/forum3/viewtopic.php?p=827061; tomitankChess 1.4 "~2500": https://talkchess.com/viewtopic.php?p=733981
- Lozza (CPW): https://www.chessprogramming.org/Lozza
- Stockfish 11 ≈ 3 430 CCRL 40/15 1 CPU and Fruit 2.1 ≈ 2 695 (2020-08-29 list): read from web-search extracts of CCRL
  list posts on TalkChess (for example https://talkchess.com/viewtopic.php?p=825477 and
  https://talkchess.com/viewtopic.php?p=855555). Snapshots, not current; the exact post per figure is `UNKNOWN - verify`;
  the live lists are at https://computerchess.org.uk/ccrl/4040/
- Lichess database licence (CC0): https://database.lichess.org/
- Stockfish `UCI_Elo` calibration and pick depth: quoted from `ABC-204` § The pins (repo record, read at `sf_19`).
