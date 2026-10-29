---
id: EPIC-010
title: "`skytalix` closes the engine gaps the owner's ideas named and the System Analyst verified, and a value-changing change ships only on the outside-opponent reading the owner sets"
status: proposed
column: Backlog
priority: P2
size: L
owner: BA/PM
---

# EPIC-010: the verified engine gaps, closed one measured change at a time, against an outside opponent

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`. `main`'s `src/`,
> `data/` and `tools/` are unchanged since `3ad6bc10`, the commit the SA read). The rulings are in
> `.grugops/context/bapm-epic010-improvements/notes/`. This hop ran no test, no game and no probe.
>
> **Source and evidence.** The owner's 10 external ideas (`ideas-2026-10-29/input/owner-ideas.md` § B) are the
> **input, not the evidence**. The owner asked that they be checked. Every fact on this page comes from the System
> Analyst's verified notes: the claims table `sa-ideas-verify` `…306a4012`, the decision on which items stand
> `…837e6fa8`, and the time note `…1ccf0010` (item 4 only). The measurement question comes from the Architect's
> `arch-epic008-rd` `…0c5d62f4` / `…9d172446`. A fact no note verified is marked `UNKNOWN - verify`.
>
> **Routing:** Orchestrator `orch-2026-10-29g` `…ccb72dbe` (deferred until the SA and the Architect landed), `…a8bfb3be`,
> `…183a5bbc` (owner: no R gauntlet; EPIC-008 accepted as is; "i will run longer-thinking games in the future") and
> `…27fae3c4` (routed, with owner questions 1–4).
>
> **What is the owner's here:** the pre-merge measurement rule (Q4), the two `EPIC-004` non-goals (Q1, Q2), re-opening
> `ADR-0020` d2 (Q3) and this epic's measures (Q5). Nothing on this page picks them. Until he answers, only the two
> records-and-probe tickets `ABC-226` and `ABC-227` are `Ready`; no engine value changes.

## Which ideas this epic carries (SA `…837e6fa8`)

| § B item | SA verdict | Here |
|---|---|---|
| 1 Quiescence | **Stands**, one correction: the leaf (ply 0) is checked for mate and stalemate | `ABC-228` (evasions in check), `ABC-229` (quiet promotions) |
| 2 Evaluation process | Facts true; **already in hand** (`arch-epic008-rd`); paired openings already exist | **The measurement rule (Q4)** and `ABC-225` (the reading it needs) |
| 3 Game history into search | **Stands**; never tried. The ep-late point is an owner ruling (`ADR-0020` d2) | `ABC-226` (records scan first), `ABC-230` (the build). The ep point is Q3 |
| 4 Tournament clock | Stands, corrected | **Not here: `EPIC-009`** (`ABC-218`–`ABC-222`). Cross-referenced, not duplicated |
| 5 Phase-aware evaluation | **Stands**. `ABC-205` failed on depth cost (`G6`), not on play | `ABC-231` (king table taper only), `ABC-232` (passed pawns by phase) |
| 6 Move ordering | **Stands**. SEE is fenced (`ADR-0024` d4); under LMR an order change changes values | `ABC-233` (history heuristic), `ABC-234` (SEE for capture order, behind its fence) |
| 7 Cost per node | **Stands in part**: captures-only legality is done (`ABC-206`) | `ABC-227` (profile first), `ABC-235` (value-identical cuts) |
| 8 Offline tuning | **Stands; never tried** | `ABC-239`, last |
| 9 TT and aspiration | **Stands in part**: TT kept across a game is already tried (`ABC-209`) | `ABC-236` (aspiration), `ABC-237` (depth-preferred replacement), `ABC-238` (deeper-entry cutoffs) |
| 10 Syzygy | **Against a permanent non-goal** (`EPIC-004`) | Nothing cut. Q1 |

**Not re-proposed as it was tried** (SA `…837e6fa8` § Already tried):
- `ABC-209`'s TT kept across one game (NEUTRAL +8.7 ± 18.3, 800 games). `ABC-237`/`ABC-238` change how one search uses
  the table, and the table is still cleared per search (`ADR-0025` d4 as in force).
- `ABC-210`'s horizon check extension, form (a) (NEUTRAL −4.8 ± 16.2). `ABC-228` searches evasions *inside*
  quiescence, which was never built. Where they overlap (a frontier node in check), `ABC-210` is the nearest prior
  evidence, and it was NEUTRAL (`RISK-EPIC010-02`).
- `ABC-205`'s design (king-safety term plus a tapered king table, closed on `G6` at `position-6`). `ABC-231` is the
  taper alone, with no king-safety term, and must first replay `ABC-205`'s failing `G6` reading (its `A1`).
- `ABC-207`'s mobility weights and early-queen term (LOSS −18.3 ± 16.5). Nothing here re-tunes them by hand.
  `ABC-239` would tune all weights by a stated method, last.

## Problem

- **User:** the owner, who plays `npm run chess` at level 5 (3 s a move) and drives `skytalix` from a UCI GUI.
- **Pain, from the records:**
  - `EPIC-008` shipped two value-changing changes on self-play (D) readings, and its outside reading (R, Stockfish 19
    at E = 1 910, `skytalix` at 3 000 ms) **fell**: −82.9 ± 73.8 (`M1` NOT MET). The Architect ranks "the changes did
    not transfer from self-play to Stockfish" first (`arch-epic008-rd` `…0c5d62f4`). **A ship rule that reads only D
    can ship a loss.** That is the first pain this epic addresses.
  - The search has code-proven gaps (SA `…306a4012`): quiescence stands pat **in check** (probe Q2: `quiesce` =
    static = −548 with only a quiet king evasion), skips **quiet promotions** (probe Q3: `quiesce` 212 against
    `chooseMove` 1 033), and the search never sees **the game's earlier positions** (rows 3a–3c), so it cannot know
    that a move repeats a position from the game.
  - The evaluation is untapered (5a, 5b), ordering has no quiet-move history (6b), and the TT and root window are
    basic (9a–9e). Each is a known gap; none has a play effect on record (`UNKNOWN - verify`).
- **Value:** a stronger opponent at the same levels, where every change that alters a value is shown not to lose
  against an outside opponent at the product's own 3 s budget before it merges. "Stronger" here is a reading, never a
  forecast.

## The cheapest slice that proves the value

1. **Measure first, at no game cost:** `ABC-226` scans the 14 reading PGNs already in the records (4 R, 10 D) for repetitions the search
   could not see; `ABC-227` profiles where a node's time goes. Both are `Ready` now.
2. **Then the rule:** the owner sets Q4. Under (b) or (c), `ABC-225` makes the interleaved R pair one command.
3. **Then the one proven tactical gap:** `ABC-228`, evasions in check inside quiescence, behind an ADR, an
   `ADR-0026` door and the Q4 reading. If it does not pass the rule, it does not ship, and the epic has still bought a
   ship rule that EPIC-008 lacked.

The epic can stop after any ticket and hold only changes that passed the owner's rule.

## Measurement first: the pre-merge outside-opponent rule (Q4, the owner's)

**Why.** The Architect's ranking (`…0c5d62f4`): (1) opponent dependence, not separable from (3) time per move; (2)
chance on R's size, not its sign (joint p 0.001–0.002 that R and D measure the same thing). Under (1) and (3), the
conclusion is the same: *"a change that alters values should not ship on self-play alone. Its ship rule needs an
outside-opponent reading at the product budget, before merge."* The owner declined a gauntlet on `EPIC-008` and
asked that this lesson be carried here as a rule for him to set (`…183a5bbc`).

**The readings, as pinned** (`EPIC-008` § The two readings; tools re-pinned on this host in `ABC-204` § Dependencies,
2026-10-28; no pin moves here):
- **R:** the built `skytalix` (level 5, 3 000 ms, `OwnBook` on) against Stockfish 19 `UCI_LimitStrength` at
  E = 1 910, 200 games (100 openings, both colours). Y ≈ 50–55 at the scores read so far.
- **R pair:** R on the base and R on the candidate, **interleaved in blocks** on one host in one window (the order
  and drift confound `EPIC-008`'s close carried), difference X ± √(Y₁² + Y₂²) ≈ ± 70–75 at EPIC-008's Y. Reported
  with the opening-paired (pentanomial) error beside the tool's Y (`…0c5d62f4` explanation 2: −82.9 ± 64.3 against
  ± 73.8).
- **D:** candidate against base, self-play, 400 games at the frozen B = 1 500 ms. Y ≈ 23.

**This host's costs** (from the records; estimates where marked):

| reading | games | wall | heat (Tctl) | source |
|---|---|---|---|---|
| R, width 2 | 200 | 4.3–4.5 h (44–46 games/h) | median 82–83 °C, max 84–87 °C | `qe-epic008-close`; `…0c5d62f4` |
| R pair, width 2 | 400 | **≈ 9 h + ≈ 1 h QE** | as R, for ≈ 9 h | the line above, ×2 |
| D, width 1 | 400 | **≈ 17 h** (23.3 games/h on the 100-game look) | median 74–76 °C; max 95.5 °C under foreign load | `qe-epic008-q4c` `…311eb14b` |
| D, width 2 | 400 | ≈ 9 h, `UNKNOWN - verify` (never read at width 2 here) | ≈ as R | estimate from R's rate |
| a NEUTRAL extension (S1) | +400 D | the same again | the same again | `EPIC-008` S1 |

**Options** (per value-changing ticket; a value-identical ticket stays on `EPIC-008`'s S2 in every option):

| | rule | host time per ticket | what it catches | what it misses |
|---|---|---|---|---|
| **(a)** | `EPIC-008`'s S1 as is: D GAIN (one NEUTRAL extension); R only at the epic's close | ≈ 9–17 h (+ the same on a NEUTRAL) | small self-play gains (Y ≈ 23) | exactly `EPIC-008`'s failure: a change that wins self-play and loses outside |
| **(b)** | S1 on D, **then an R pair before merge: merge only if the R pair is not LOSS** (X + Y ≥ 0) | ≈ 19–27 h (D + ≈ 9 h + 1 h) | a non-transferring drop larger than ≈ 70–75 Elo, at the product budget, same opponent | a drop smaller than ≈ 70: R at 200 + 200 cannot see it |
| **(c)** | **the R pair replaces D:** merge if X > 0 and X + Y ≥ 0 | ≈ 10 h | the sign that matters, at the product budget | precision: a change worth 0 passes about half the time |
| **(d)** | **hold:** no value-changing ticket of this epic merges until the owner sets (a)–(c) or gives other evidence (for example his own longer-thinking games, `…183a5bbc`) | 0 h | — | nothing ships |

- **BA/PM's reading, offered and not picked: (b).** It keeps D's precision for the gain and adds the outside check
  that `RISK-EPIC008-03`'s mitigation (`M1` is R) applied only at the close, after the merges. Its cost is real:
  milestone 1 has three value-changing tickets (`ABC-228`, `229`, `230`), so ≈ 60–80 h of ALONE host time at
  82–87 °C, spread over idle windows (`EPIC-008` Q2: whenever idle).
- **Default without an answer: (d).** BA/PM does not apply a rule on its own. Every value-changing ticket stays in
  `Backlog`; the records tickets (`ABC-226`, `ABC-227`) and the value-identical `ABC-235` are unaffected.
- **Not decided here:** a longer budget (the owner's "for promising changes, longer" in § B item 2). The owner plans
  longer-thinking games himself; when they exist they are evidence for this epic, and a ship reading only on his word.
- The thermal rule of `EPIC-009` (`RISK-EPIC009-04`) applies to every reading: ALONE, on AC, thermal and frequency
  log, a frequency fall over 5 % makes the reading UNRESOLVED.

## Milestones and order (the external list's #1–#3 order is one input, not a ruling)

**Milestone 1, "measure, then the proven gaps":**

| order | id | why here |
|---|---|---|
| 1 | `ABC-226` | Records only, 0 games, minutes of CPU. It tells whether item 3 costs games at all (the SA's named probe), which sets `ABC-230`'s priority |
| 2 | `ABC-227` | Probes only, single positions, 0 games. Item 7's "success is playing results, not nps alone" needs a profile before any cut. Feeds `ABC-235` |
| 3 | `ABC-225` | `tools/` only. Needed before any value-changing reading **only under Q4 (b) or (c)**. The external list's #2, and it goes first among builds: every later reading depends on it |
| 4 | `ABC-228` | The external list's #1, and the strongest code evidence (probe Q2, row 1b). Never built in this form. **ADR first:** `ADR-0024` d4 and `ABC-079`'s recorded decision (`src/quiescence.ts:21-24`), plus an `ADR-0026` d10 door |
| 5 | `ABC-229` | Same ADR as `ABC-228` (one amendment can name both), separate mechanism, so its own reading. Small |
| 6 | `ABC-230` | The external list's #3. Proven gap (rows 3a–3c), never tried. **ADR reading first:** `ADR-0002` clause 3 already speaks of seeding the per-ply array from history, and `ABC-081` `A6` forbids importing `src/history.ts` into the search, so keys are handed in; `ADR-0044` D3 for the UCI parser. Behind `ABC-226` |
| 7 | `ABC-235` | Value-identical, so S2 and no playing reading: the cheapest engine change. Behind `ABC-227` |

**Milestone 2, "evaluation by phase, ordering, TT and window"** (each value-changing, each its own reading, each
`Backlog` on an ADR and Q4): `ABC-231` → `ABC-232` (evaluation; after milestone 1's quiescence changes settle the node
budget that `G6` reads, because `ABC-205` failed on exactly that), `ABC-233`, `ABC-234` (ordering; `ABC-234` behind
`ADR-0024` d4's own re-open condition), `ABC-236`, `ABC-237`, `ABC-238` (TT and window).

**Milestone 3:** `ABC-239`, offline tuning. Item 8 itself says "after the phase-aware design settles". It is the
costliest (High in § B), it needs a data licence ruling (`ADR-0048`), and self-play non-transfer (`…0c5d62f4`) bears
directly on how a tuned set is judged.

**Why this order and not § B's.**
- § B ranks #2 second; here it is the rule (Q4) plus `ABC-225`, ahead of every value-changing build, because
  `EPIC-008` shows a reading that measures the wrong thing ships losses.
- Items 1 and 3 have code-proven gaps and were never tried; items 5, 6 and 9 are known gaps with no play evidence, and
  item 5's last try failed on cost. Records and probes (0 games) come before builds that each cost ≈ 10–27 h of heat.
- Item 4 is `EPIC-009`'s. Its `ABC-218` reading and this epic's readings both run ALONE; the Orchestrator orders them.

## Scope

- One `tools/` change (`ABC-225`), one records scan (`ABC-226`), one probe (`ABC-227`).
- Twelve engine changes (`ABC-228`–`ABC-239`: eleven value-changing, one value-identical, `ABC-235`), each in its own ticket, behind its own ADR
  or ADR reading, each measured by the Q4 rule (value-identical: S2).
- `src/quiescence.ts`, `src/search.ts`, `src/engine.ts`, `src/evaluate.ts`, `src/transposition.ts`, `src/legal.ts`,
  `src/uci-session.ts`, `src/cli.ts` change, each only in the ticket that names it.

## Out of scope

- **Item 4, the tournament clock:** `EPIC-009`.
- **Item 10, Syzygy:** `EPIC-004`'s permanent non-goal, unless the owner re-opens it (Q1).
- **The levels and their budgets:** `LEVELS[1..7]`, `DEFAULT_LEVEL` and `HARD_CEILING_MS` byte-identical (`G9`).
- **Re-runs of what was tried:** `ABC-209`'s TT retention, `ABC-210`'s horizon extension, `ABC-205`'s design,
  `ABC-207`'s weights (above).
- **Stalemate detection inside quiescence** (part of § B item 1): it needs a full legal-move count at every quiescence
  node that is not in check. Not cut; `ABC-228` gets mate in check for free (no evasion = mate).
- **Rook activity by phase** (part of § B item 5), **SEE pruning** (§ B item 6 calls it a separate, riskier change),
  **incremental evaluation as a value change**, **delta pruning**, **threads, pondering.**
- **Normalising `epSquare` for repetition** (§ B item 3's ep point): only if the owner re-opens `ADR-0020` d2 (Q3); a
  ticket is then cut from the pool.
- **A user-visible Elo, rating lists, CCRL entry** (`EPIC-008` § Out of scope, unchanged).
- **A neural network or any learned runtime component** (`EPIC-004` permanent non-goal; § B assumes none). `ABC-239`
  emits constants only.

## Common gates

`EPIC-008` § Common gates `G1`–`G11`, **unchanged, by reference**, on this host (`G6` read by its rule: 5 interleaved
runs per board per build, the median, "≥ base" graded on the owner's word `…2ae5fc12`, any run below depth 6 FAILs).
`G2`'s 1 100 ns was set on the previous host; it is read against base in the same session, so only the relative
clause binds here (`UNKNOWN - verify` as an absolute). Each ticket names the gates it owes.

**`Q-SET`, the dedicated position set (new, test-only).** The SA's three probe positions (`sa-ideas-verify/raw/
qprobe.mts`: Q1 capture-mate, Q2 in check with only a quiet evasion, Q3 quiet promotion) plus at least three more
per gap, chosen by QE and frozen before the first build: ≥ 6 rows "in check inside quiescence", ≥ 6 "a capture that
mates", ≥ 6 "a quiet promotion decides". It reads `quiesce` and `chooseMove` at a fixed depth, never the clock.
`ABC-228` and `ABC-229` own it.

## Success measures (proposed; the owner's, Q5)

| # | measure | target | how it is read |
|---|---|---|---|
| M1 | **Every value-changing merge passed the owner's rule** | 100 % of this epic's value-changing merges carry the Q4 reading and meet it; value-identical merges meet S2 | each ticket's `## Reading` and QE note |
| M2 | **Not weaker outside, at the close** | an interleaved R pair, `main` at close against `main` at this epic's first merge-base, on this host: **not LOSS** (X + Y ≥ 0). **No Elo target** unless the owner sets one | `ABC-225`'s mode (or two sequential R under Q4 (a)), the `EPIC-008` pins |
| M3 | **The proven gaps are closed** | `Q-SET`: every in-check row's `quiesce` ≠ stand pat and every mate row scores a mate (`ABC-228`); every quiet-promotion row reflects the promotion (`ABC-229`); every repetition fixture reads the draw (`ABC-230`) | the tickets' acceptance rows, on `main` at close |
| M4 | **Nothing regressed** | `G1` ≥ 54/58, `G5`, `G6`, `G7`, `G8`, `G9` green on `main` at close | the gates' own instruments |
| M5 | **The owner's decisions stayed his** | 0 NFR bounds moved without his word; every ADR reported when it lands; Q1–Q4 answered before a ticket that waits on them leaves `Backlog` | ADR pages, owner-word notes |

## Tickets (order is the pull order; the pages are under `plans/tickets/`)

| order | id | title | size | priority | column | DoR | depends on / ADR | waits on |
|---|---|---|---|---|---|---|---|---|
| 1 | `ABC-226` | Records scan: how often the R and D games repeated a position the search could not see | S | P2 | Ready | 10/10 | the committed PGNs | nothing |
| 2 | `ABC-227` | Profile: where a node's time goes, on the fixed boards, at 3 s | S | P2 | Ready | 10/10 | none | nothing |
| 3 | `ABC-225` | One command reads an interleaved R pair (base and candidate against Stockfish), with the opening-paired error and a host log | M | P2 | Backlog | 9/10 | `ABC-204`'s pins | Q4 = (b) or (c) |
| 4 | `ABC-228` | In check, quiescence searches every evasion and scores none as mate | M | P2 | Backlog | 8/10 | ADR: `ADR-0024` d4 + `ABC-079`'s decision; `ADR-0026` d10 door | ADR; Q4; `ABC-225` under (b)/(c) |
| 5 | `ABC-229` | Quiescence searches quiet promotions to a queen | S | P2 | Backlog | 8/10 | the same ADR; door | ADR; Q4; after `ABC-228` |
| 6 | `ABC-230` | The game's earlier positions reach the search, from the CLI and from UCI, so it sees a repetition the game already holds | M | P2 | Backlog | 8/10 | `ADR-0002` c3 reading; `ABC-081` `A6`; `ADR-0044` D3 | ADR reading; Q4; `ABC-226` |
| 7 | `ABC-235` | Value-identical cuts in cost per node, from `ABC-227`'s profile | M | P2 | Backlog | 9/10 | `ABC-227`; Architect confirms value-identical | `ABC-227` |
| 8 | `ABC-231` | The king table is tapered by phase, alone, with no king-safety term | S | P3 | Backlog | 8/10 | `ADR-0031` addendum scope; door | ADR ruling; Q4 |
| 9 | `ABC-232` | Passed pawns are worth more as material comes off | S | P3 | Backlog | 8/10 | `ABC-231`'s phase | `ABC-231`; Q4 |
| 10 | `ABC-233` | A history heuristic orders quiet moves after the killers, cleared per search | M | P3 | Backlog | 8/10 | `ADR-0026` d10; `ABC-080` `A6` | ADR; Q4 |
| 11 | `ABC-234` | SEE orders captures in the full-width search (ordering only, no pruning) | M | P3 | Backlog | 7/10 | `ADR-0024` d4 re-open evidence | evidence; ADR; Q4 |
| 12 | `ABC-236` | Aspiration windows at the root, with a stated re-search | M | P3 | Backlog | 8/10 | new ADR; door | ADR; Q4 |
| 13 | `ABC-237` | The transposition table prefers deeper entries when it replaces | S | P3 | Backlog | 8/10 | `ADR-0025` (falsifier `T2`) | ADR; Q4 |
| 14 | `ABC-238` | A deeper stored entry may cut off a shallower search | M | P3 | Backlog | 8/10 | `ABC-081` `A1` revised; `ADR-0025`; door | ADR; Q4; after `ABC-237` |
| 15 | `ABC-239` | Evaluation weights tuned offline by a stated method, emitted as constants, validated outside | L | P3 | Backlog | 7/10 | `ADR-0048` data licence; new ADR | milestone 2's evaluation done; Q4 |

All fifteen reserved ids are used. None is `XL`; `ABC-239` is the one `L` and is the last pull.

## Owner questions

- **Q1. Syzygy (§ B item 10) against `EPIC-004`'s permanent non-goal: re-open or keep out?**
  - (a) **Keep out.** The non-goal stands; nothing is cut. (b) **Re-open as a later epic.** It brings either a
    runtime dependency (the package has 0 today) or our own prober, tablebase files of several GB that a git clone
    cannot carry, and a distribution ruling (`ADR-0018`, `ADR-0049`). Sizes are `UNKNOWN - verify`.
  - **Default: (a).**
- **Q2. `EPIC-004`'s "Strength above ~1700 — the requester's 'not too complex' constraint binds here".** `EPIC-008`
  went past it on your word (`…7feb0553`, `…e44d2903`), and R now reads ≈ 2 000–2 100 on Stockfish's scale.
  - (a) **Cite your EPIC-008 word** here; `EPIC-004`'s line stays as written. (b) **Amend the line:** BA/PM writes a
    dated amendment on `EPIC-004` (the old text struck through and kept) naming your word.
  - **Default: (a).** BA/PM's reading: (b) is cleaner for a future reader, and it is your line to change.
- **Q3. Re-open `ADR-0020` d2 (the en-passant repetition key)?** Today a position with an uncapturable ep square
  hashes differently, so a repetition counts one occurrence late: a draw is deferred, never falsely declared (SA 3d).
  `ADR-0020`'s own reconsider trigger (a) names the remedy: normalise `epSquare` upstream in `src/apply.ts`.
  - (a) **Keep the ruling.** `ABC-230` hands the keys over as they are. (b) **Re-open:** Architect/Design amends
    `ADR-0020`, and BA/PM cuts one S ticket from the pool.
  - **Default: (a).**
- **Q4. The pre-merge outside-opponent rule** (§ Measurement first): (a) D only, as `EPIC-008`; (b) D, then an R pair
  that must not be LOSS; (c) the R pair instead of D; (d) hold. **Default: (d).** BA/PM's reading: (b).
- **Q5. Accept this epic and its measures M1–M5** (EPIC goals and M-criteria are yours, `…5aaf7cec` item 3).
  (a) As written, with **no Elo target**; (b) other measures, or a target for M2. **Default: (a).**
- **Not questions for you:** which form an ADR takes, the door's shape, `Q-SET`'s extra rows, and the game counts
  inside a rule you set. Those are delivery, under your delegation (`…5aaf7cec` item 1).

## Dependencies

- `ABC-204`'s pinned host tools (`cutechess-cli` 1.5.1, Stockfish 19), re-pinned on this host. Paths stay out of the
  records (`ADR-0049` d4).
- `EPIC-009` runs beside this epic. Its readings and this epic's share the host: one ALONE reading at a time. Its
  files (`src/levels.ts`, `src/cli-options.ts`, `src/uci-session.ts`) overlap `ABC-230` on `src/uci-session.ts` only;
  whichever merges second rebases.
- Within this epic: `ABC-228` → `ABC-229` share `src/quiescence.ts`; `ABC-233`, `ABC-234` share `orderMoves`;
  `ABC-237` → `ABC-238` share `src/transposition.ts`; `ABC-231` → `ABC-232` share `src/evaluate.ts`. A value-changing
  merge stales any D or R read on the old base (`EPIC-008` § When a D reading goes stale).

## Risks

- **`RISK-EPIC010-01`: the rule cannot see small losses.** An R pair at 200 + 200 has a half-width ≈ 70–75. Under
  (b) a drop smaller than that passes. Mitigated by M2's close reading and by reporting the opening-paired error.
- **`RISK-EPIC010-02`: in-check evasions repeat `ABC-210`'s NEUTRAL.** The frontier node in check is where `ABC-210`
  extended. `ABC-228`'s gain lies in checks that arise inside the capture sequence; its size is `UNKNOWN - verify`.
- **`RISK-EPIC010-03`: added quiescence nodes miss `G6` "≥ base"**, as `ABC-205` did on cost. Each quiescence ticket
  carries a node bar (≤ 1.5 × base at fixed depth 6, `ADR-0024` d3's headroom precedent) and the frozen-clock
  pre-check before the real-clock `G6`.
- **`RISK-EPIC010-04`: heat and hours.** Under (b), ≈ 19–27 h of ALONE host time per value-changing ticket at
  82–87 °C; eleven such tickets is ≈ 200–300 h. The owner may stop the epic after milestone 1.
- **`RISK-EPIC010-05`: self-play tuning repeats non-transfer** (`ABC-239`). Its validation is outside, by rule.
- **`RISK-EPIC010-06`: history keys widen the UCI input surface** (`ABC-230`): a `position … moves` list of any length
  now feeds the search. `KEY_ARRAY_CAPACITY` (128) bounds the per-ply array; the hand-over must be bounded too.

## NFR triggers

- **`NFR-005` (depth at 3 s):** at risk from every value-changing ticket. `G6` reads it; the depth-6 floor never moves.
- **`NFR-004` (per-move ceilings):** unchanged; `G5` reads it.
- **`NFR-009` (≤ 16 MiB search memory, ≤ 1 MiB growth):** `ABC-230` (history keys), `ABC-233` (history table),
  `ABC-237`/`238` (TT). 2^19 entries fits; 2^20 is a re-level, the owner's.
- **`NFR-008` (`npm test` wall ≤ 10 s at load1 ≤ 8):** new rows on the virtual clock or at fixed depth only; 0
  real-clock rows in the default lane.
- **Security (ASVS L1):** `ABC-230` is the only new input path (the UCI move list and the CLI's game history reach the
  search). Bounded length, no new parsing; Security/NFR confirms at its gate. No other ticket adds input.

## Test notes

- Readings never run in `npm test`. They run in QE's scratch clone, ALONE, as `ABC-202`/`ABC-204`.
- Search tickets use the `ADR-0026` door pattern: the door reproduces base node for node (`G4`), cross-build.
- Each value-changing ticket changes production lines, so UAT is owed. The QE verdict signs it under the owner
  delegation (`…5aaf7cec` item 2).
- The board lines this cut asks for are in the decision note; the board is the Orchestrator's.
