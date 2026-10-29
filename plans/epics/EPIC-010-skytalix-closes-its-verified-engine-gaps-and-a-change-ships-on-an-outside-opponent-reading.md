---
id: EPIC-010
title: "`skytalix` closes the engine gaps the owner's ideas named and the System Analyst verified, and a value-changing change ships only on the outside-opponent reading the owner sets"
status: backlog
column: Backlog
priority: P2
size: L
owner: BA/PM
---

# EPIC-010: the verified engine gaps, closed one measured change at a time, against an outside opponent

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only, at `main` `4dcb353e`; `src/`, `data/` and
> `tools/` untouched by this hop). The owner answered Q2, Q4 and Q5 on 2026-10-29 (`orch-2026-10-29g` `…278e149b`,
> verbatim; his words govern): *"Selecting Q4 option e, extend a bit, let's set 10 games self-play + 10 games vs
> stockfish ; 1. not sure, explain ; 2. remove that goal, I would set another goal - be the best vibe-engineered or
> TypeScript-based chess-engine (not sure what exists out there, we can put goal to 2700 elo rating or more, world
> record is 3650). It can be that in the future we need to rewrite to Rust, but let it be for now, this is big
> undertaking. ; 3. not sure, explain ; 4. accept without elo target, elo target is hard to reach, but try to
> understand if things get worse."* (His 1–4 are this page's Q1, Q2, Q3 and Q5; Q4 he answered first.)
>
> - **Accepted** (Q5): `proposed` → `backlog`. M1–M5 as written, **no Elo target**. His intent, "understand if things
>   get worse", is answered by § The merge rule's three layers.
> - **Q4 = (e), extended:** a 10-game D smoke and a 10-game R smoke per value-changing ticket before its merge, and a
>   batched major validation later. § The merge rule (in force) writes it out, with the caveat that 10 games catch
>   crashes, time losses and collapses, not a loss of tens of Elo.
> - **Q2:** `EPIC-004`'s "strength above ~1700" non-goal is removed (dated amendment on that page). The new product
>   goal is in § Product goal: aspirational, no ticket bound to it, its scale `UNKNOWN - verify`. A Rust rewrite is
>   out of scope.
> - **Q1 and Q3 stay open**, with their defaults: (a) keep Syzygy out; (a) keep `ADR-0020` d2.
> - **`ABC-225` re-scoped, not retired:** it is the batched validation's instrument, no longer the per-ticket reading.
>   `Backlog` → `Ready`, DoR 10/10.
> - **Every other ticket:** Q4 is removed from its wait, its next real wait is named, and its DoR is re-scored
>   (value-changing tickets +1: row 4 now has a measurable reading). `ABC-226` is Done (SA `sa-ABC-226` `…cc53fc79`:
>   484 costed games, R 26), so `ABC-230` stays in milestone 1.
> - **Milestone 1 re-costed:** ≈ 15 h of host readings, ≈ 12 h of it ALONE, against ≈ 60–80 h under (b).
> - The notes are in `.grugops/context/bapm-owner-words-b/notes/`.

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
> records-and-probe tickets `ABC-226` and `ABC-227` are `Ready`; no engine value changes. *(As cut. Since 2026-10-29:
> Q2, Q4 and Q5 are answered and Q1 and Q3 stay open; see the amendment above.)*

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
- **Value:** a stronger opponent at the same levels. Every change that alters a value is shown to work against an
  outside opponent at the product's own 3 s budget before it merges (no fault, no loss on time, no collapse), and the
  merged changes are read in batches for a fall (the owner's Q5: "try to understand if things get worse"). "Stronger"
  here is a reading, never a forecast. *(Amended 2026-10-29 for Q4 = (e); the cut read "shown not to lose".)*

## The cheapest slice that proves the value

1. **Measure first, at no game cost:** `ABC-226` scans the 14 reading PGNs already in the records (4 R, 10 D) for repetitions the search
   could not see; `ABC-227` profiles where a node's time goes. Both are `Ready` now.
2. **The rule is set** (owner, Q4 = (e), extended, 2026-10-29): two 10-game smokes per value-changing ticket on
   today's harness, and a batched R pair later. `ABC-225` makes the batch one command.
3. **Then the one proven tactical gap:** `ABC-228`, evasions in check inside quiescence, behind an ADR, an
   `ADR-0026` door and the Q4 reading. If it does not pass the rule, it does not ship, and the epic has still bought a
   ship rule that EPIC-008 lacked.

The epic can stop after any ticket and hold only changes that passed the owner's rule.

## The merge rule (in force from 2026-10-29: owner Q4 = (e), extended)

**The owner's word** (`…278e149b`): *"Selecting Q4 option e, extend a bit, let's set 10 games self-play + 10 games vs
stockfish"*, and for Q5 *"accept without elo target … but try to understand if things get worse."* His `EPIC-009` word
sets the shape: smokes "just to make sure things work", major validation of 100 or more games later (`…a67f71ac`).

### Per value-changing ticket: two smokes before the merge

After the ticket's own gates are green, QE reads both smokes on the candidate head, rebased on `main` as it will merge.
Both run ALONE, on AC, with the thermal and frequency log; a frequency fall over 5 % makes a smoke UNRESOLVED, and it
is re-run once (`RISK-EPIC009-04`). Both use today's harness as it is: no `tools/` change.

| smoke | who plays | command (`tools/rating/rating.ts`) | games | width | wall on this host |
|---|---|---|---|---|---|
| **D** | the candidate against base (base = the candidate's merge-base on `main`), both at the frozen B = 1 500 ms | `d <candidate> <base> <out> --budget-ms 1500 --rounds 5 --concurrency 1` | 10: openings 1–5, both colours | 1 | ≈ 26 min (23.3 games/h, `qe-epic008-q4c` `…311eb14b`) |
| **R** | the candidate (level 5, 3 000 ms, `OwnBook` on) against Stockfish 19 `UCI_LimitStrength` E = 1 910 | `r <candidate> <out> --elo 1910 --rounds 5 --concurrency 2` | 10: openings 1–5, both colours | 2 | ≈ 13–14 min (44–46 games/h, `qe-epic008-close`) |

**The merge rule.** A value-changing ticket merges only if all four hold:

- **S-1 (faults).** The candidate makes 0 faults in the 20 games: no illegal move, crash, disconnect or stall
  (`EPIC-008`'s states). A fault by base or by Stockfish makes that smoke UNRESOLVED; it is re-run once, and a base
  fault is routed as a defect on `main`.
- **S-2 (time).** The candidate loses 0 games on time in the 20.
- **S-3 (D, no collapse).** The candidate scores **≥ 3.0 of 10** against base.
- **S-4 (R, no collapse).** The candidate scores **≥ 3.0 of 10** against Stockfish.
- **Below 3.0 on S-3 or S-4:** that smoke plays 10 more games, and all 20 are judged together: **≥ 7.0 of 20** passes,
  below is NOT MET. The first 10 still count; this is a confirmation, not a second try for luck.

**What follows a miss.**
- S-1 or S-2 missed: NOT MET. It is a defect, so the ticket goes back to the Software Engineer, and both smokes are
  read again after the fix.
- S-3 or S-4 missed: NOT MET. QE records a `failed-attempt` note. The ticket goes back to BA/PM and does not merge.
- **Stale smokes:** a smoke read on a base that another value-changing merge has since moved is stale, and it is read
  again (≈ 1 h; `EPIC-008` § When a D reading goes stale, scaled down).
- **Value-identical tickets** (`ABC-235`) stay on `EPIC-008`'s S2 and play no smoke.
- **Where it is recorded:** QE's smoke note carries one row of § The smoke ledger. The ticket's `## Reading` cites
  that note.

### What 10 games can and cannot see (the Orchestrator's caveat)

**10 games catch a crash, an illegal move, a loss on time and a collapse. They cannot see a loss of tens of Elo.**
BA/PM's arithmetic (exact over win/draw/loss, from the recorded scores; not a measurement):

- `main`'s R reference is `EPIC-008`'s R(close): 64.75 % (W/L/D 125/66/9) at `38536a34`. `main`'s `src/` and `data/`
  are identical to that build today (`git diff` empty).
- **10 R games read the score to about ± 29 points of percentage (95 %), so ± 200 Elo or wider.**
- An unchanged candidate is stopped by S-4 about 7 times in 10 000, and by S-3 about 1 time in 60 to 160 (it depends on
  the D draw rate, 30–50 %).
- A candidate that truly fell to 30 % against Stockfish (≈ 250 Elo below `main`'s +105 over E = 1 910) is stopped
  about **4 times in 10**. A fall to 20 % is stopped about 7 times in 10, and a fall to 15 % about 85 times in 100.
- So a smoke stops a broken change and a gross collapse. It lets every small loss through.

### "Did things get worse?": the trend and the batched validation

Three layers answer it. Each sees a different size of fall, and none sees a fall of tens of Elo.

| layer | what it reads | what it can see | what it does |
|---|---|---|---|
| **1. The smoke** (per ticket) | S-1 to S-4 | a fault, a loss on time, a collapse (≈ 250 Elo or more at R) | the ticket does not merge |
| **2. The trend** (across tickets) | the **pooled R smoke score** of every value-changing merge since the last batch, in § The smoke ledger, against the R reference | a cumulative fall of **≈ 140 Elo** or more, once ≥ 30 R games are pooled | **The trend flag:** pooled ≥ 30 games and pooled score ≤ reference − 20 points (≤ 44.75 % today). The batch is then pulled forward, and no further value-changing merge happens until it reads |
| **3. The batch** (major validation) | an interleaved R pair (`ABC-225`): the batch's head against its base, 200 + 200 games | a fall larger than **≈ 70–75 Elo**, the pair's half-width at `EPIC-008`'s Y | not LOSS (X + Y ≥ 0) passes. LOSS: see below |

- **The trend's own error** (same arithmetic): with nothing changed, the flag fires about 1 time in 100 per check. At a
  true fall to 44.75 % (≈ 140 Elo) it fires about half the time; at 40 %, about 7 times in 10. A fall to 55 % (≈ 70
  Elo) fires it about 1 time in 9.
- **The batch: when.** At each milestone's close, after its value-changing merges (milestone 1: after `ABC-228`,
  `ABC-229` and `ABC-230`). Earlier if the trend flag fires, or on the owner's word. The epic-close batch is M2.
- **The batch: what.** Base = `main` just before the batch's first value-changing merge (for the first batch, the
  epic's first merge-base, so milestone 1's batch is also M2 if the epic stops there). E = 1 910, 3 000 ms, the R
  pins, width 2, ALONE: ≈ 9 h plus ≈ 1 h of QE. That is the owner's "100 or more games" at the R pins.
- **After a passing batch,** its head's own R score becomes the trend's reference, and the pool restarts.
- **A batch that reads LOSS** cannot say which merge caused it. Then no further value-changing merge of this epic
  happens. The ledger names the suspects, the merges in the batch with their R smoke scores, for information only.
  BA/PM frames three options for the owner: (i) revert the suspects; (ii) bisect with one R pair per merge, ≈ 10 h
  each; (iii) accept. Heat and hours are his (`…a8bfb3be`, `…183a5bbc`).
- **Tens of Elo stay invisible.** Seeing them needs a bigger batch (400 + 400 games: about ± 50, ≈ 18 h plus 1 h),
  or the owner's own longer-thinking games (`…183a5bbc`). Either one runs only on his word.

### The smoke ledger

QE appends one row per smoke pair, in its smoke note. BA/PM folds the rows in here at its next hop on this page, and
always before a batch. The pooled score and the flag are QE's to compute at each smoke.

| ticket | candidate sha | base sha | D W/L/D (score) | R W/L/D (score) | faults | time losses | pooled R since last batch | flag | Tctl median / max |
|---|---|---|---|---|---|---|---|---|---|
| — | | | | | | | | | |

*Reference: R(close) 64.75 % at `38536a34` (`EPIC-008`). No row yet.*

### Cost on this host

- **Per value-changing ticket:** about 0.7 h of ALONE games (D ≈ 26 min at Tctl median 74–76 °C; R ≈ 13–14 min at
  82–83 °C), plus about 0.5 h of QE: **about 1.2 h.** A confirmation smoke adds up to 0.45 h. The harness clones and
  builds once per run; that time is not in the records (`UNKNOWN - verify`; minutes).
- **Per batch:** ≈ 9 h ALONE plus ≈ 1 h of QE.
- **Against the framed options:** (b) was ≈ 19–27 h per ticket; (a) was ≈ 9–17 h.

## Measurement first: the options as framed for Q4 (history; the owner picked (e), extended, 2026-10-29)

*This section is the cut's text, kept as framed. § The merge rule above is in force.*

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
- **INFO for Q4, not applied (owner word on `EPIC-009`, Orchestrator `…a67f71ac`, Q1):** *"For simpler tests use much
  less matches, 5 or 10, just to make sure things work, major validation with 100 or more games comes later since it
  can run over 24 or 48 hours."* He said it of `EPIC-009`. If he means the same here, it is a fifth option, **(e):** a
  5–10-game smoke per ticket (no faults, no illegal moves), and one batched outside validation later. Cost ≈ 0.5 h per
  ticket. It shows a change works; at ± 200 Elo or wider it cannot show a gain or catch a per-ticket loss, so a later
  batch that reads LOSS cannot say which merge caused it. Asked under Q4, not assumed.
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
| 3 | `ABC-225` | `tools/` only, `Ready`. **Re-scoped 2026-10-29:** it is the batch's instrument and is on no ticket's path. It must be Done before milestone 1's batch; it may be pulled whenever width allows |
| 4 | `ABC-228` | The external list's #1, and the strongest code evidence (probe Q2, row 1b). Never built in this form. **ADR first:** `ADR-0024` d4 and `ABC-079`'s recorded decision (`src/quiescence.ts:21-24`), plus an `ADR-0026` d10 door |
| 5 | `ABC-229` | Same ADR as `ABC-228` (one amendment can name both), separate mechanism, so its own reading. Small |
| 6 | `ABC-230` | The external list's #3. Proven gap (rows 3a–3c), never tried. **ADR reading first:** `ADR-0002` clause 3 already speaks of seeding the per-ply array from history, and `ABC-081` `A6` forbids importing `src/history.ts` into the search, so keys are handed in; `ADR-0044` D3 for the UCI parser. Behind `ABC-226` |
| 7 | `ABC-235` | Value-identical, so S2 and no playing reading: the cheapest engine change. Behind `ABC-227` |
| close | the batch | An interleaved R pair (`ABC-225`), milestone 1's head against the epic's first merge-base (§ The merge rule) |

**Milestone 1, re-costed 2026-10-29 under Q4 = (e)** (this host; the `G6` real-clock gates each ticket owes are the
same under every option and are not counted):

| item | reading | host time |
|---|---|---|
| `ABC-226` | Done: a records scan, 3.7 s of CPU | 0 |
| `ABC-227` | a profile, 0 games | 0 games |
| `ABC-228`, `ABC-229`, `ABC-230` | one smoke pair each | ≈ 3 × 1.2 h ≈ 3.6 h (≈ 2.1 h ALONE) |
| `ABC-235` | S2, no playing reading | 0 games |
| `ABC-225` | its A5 run, 40 games | ≈ 1 h ALONE |
| milestone 1's batch | an interleaved R pair, 200 + 200 | ≈ 9 h ALONE plus ≈ 1 h |
| **total** | | **≈ 15 h, of which ≈ 12 h ALONE** (R heat: Tctl median 82–83 °C, max 84–87 °C) |

Under (b), the same milestone was ≈ 60–80 h ALONE. A confirmation smoke adds ≤ 0.45 h per ticket that needs one.

**Milestone 2, "evaluation by phase, ordering, TT and window"** (each value-changing, each with its own smoke pair, each
`Backlog` on an ADR; Q4 no longer holds them since 2026-10-29): `ABC-231` → `ABC-232` (evaluation; after milestone 1's quiescence changes settle the node
budget that `G6` reads, because `ABC-205` failed on exactly that), `ABC-233`, `ABC-234` (ordering; `ABC-234` behind
`ADR-0024` d4's own re-open condition), `ABC-236`, `ABC-237`, `ABC-238` (TT and window).

**Milestone 3:** `ABC-239`, offline tuning. Item 8 itself says "after the phase-aware design settles". It is the
costliest (High in § B), it needs a data licence ruling (`ADR-0048`), and self-play non-transfer (`…0c5d62f4`) bears
directly on how a tuned set is judged.

**Why this order and not § B's.**
- § B ranks #2 second; here it is the rule (Q4, set 2026-10-29 as (e)), ahead of every value-changing build, because
  `EPIC-008` shows a reading that measures the wrong thing ships losses. `ABC-225` now serves the batch.
- Items 1 and 3 have code-proven gaps and were never tried; items 5, 6 and 9 are known gaps with no play evidence, and
  item 5's last try failed on cost. Records and probes (0 games) come before builds (each ≈ 1.2 h of smokes under (e); ≈ 10–27 h under the cut's options).
- Item 4 is `EPIC-009`'s. Its `ABC-218` reading and this epic's readings both run ALONE; the Orchestrator orders them.

## Product goal (owner, 2026-10-29, Q2): aspirational, with no ticket bound to it

- **His words** (`…278e149b`): *"remove that goal, I would set another goal - be the best vibe-engineered or
  TypeScript-based chess-engine (not sure what exists out there, we can put goal to 2700 elo rating or more, world
  record is 3650). It can be that in the future we need to rewrite to Rust, but let it be for now, this is big
  undertaking."*
- **The goal:** `skytalix` aims to be the best vibe-engineered / TypeScript-based chess engine, at 2 700 Elo or more.
- **It is aspirational.** No ticket, measure or gate of this epic is bound to it. M2 stays "not LOSS", with no Elo
  target (Q5). No ticket is cut to chase it.
- **Its scale is `UNKNOWN - verify`.** He does not name the scale or rating list that 2 700, or his "world record
  3 650", is on, nor its time control. This repo's only outside number is R: Stockfish 19 `UCI_LimitStrength` at
  E = 1 910, `skytalix` at 3 000 ms a move. That read 2 015.6 ± 49.5 at `EPIC-008`'s close, on Stockfish's own scale.
  How that scale maps onto any list is `UNKNOWN - verify`. This page never compares a number on one scale with a
  number on another.
- **The field of comparison is `UNKNOWN - verify`.** Which TypeScript or "vibe-engineered" engines exist, and how
  strong they are, was not researched at this hop (no web access). The Architect or BA/PM researches it when it is
  routed. No ticket holds it.
- **A Rust rewrite is out of scope.** He calls it possible in the future, "but let it be for now". Nothing here
  prepares for it.
- `EPIC-004`'s "strength above ~1700" non-goal is **removed**, with a dated amendment on that page.

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
- **A Rust rewrite** (Q2, 2026-10-29: "let it be for now"). **Any ticket, gate or measure bound to the ≥ 2 700 goal**
  (§ Product goal: aspirational).
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

## Success measures (accepted by the owner 2026-10-29, Q5: as written, no Elo target)

| # | measure | target | how it is read |
|---|---|---|---|
| M1 | **Every value-changing merge passed the owner's rule** | 100 % of this epic's value-changing merges carry the Q4 reading (the smoke pair, S-1–S-4) and meet it; value-identical merges meet S2 | each ticket's `## Reading` and QE note |
| M2 | **Not weaker outside, at the close** | an interleaved R pair, `main` at close against `main` at this epic's first merge-base, on this host: **not LOSS** (X + Y ≥ 0). **No Elo target** unless the owner sets one | `ABC-225`'s mode, the `EPIC-008` pins (the epic-close batch, § The merge rule) |
| M3 | **The proven gaps are closed** | `Q-SET`: every in-check row's `quiesce` ≠ stand pat and every mate row scores a mate (`ABC-228`); every quiet-promotion row reflects the promotion (`ABC-229`); every repetition fixture reads the draw (`ABC-230`) | the tickets' acceptance rows, on `main` at close |
| M4 | **Nothing regressed** | `G1` ≥ 54/58, `G5`, `G6`, `G7`, `G8`, `G9` green on `main` at close | the gates' own instruments |
| M5 | **The owner's decisions stayed his** | 0 NFR bounds moved without his word; every ADR reported when it lands; Q1–Q4 answered before a ticket that waits on them leaves `Backlog` | ADR pages, owner-word notes |

## Tickets (order is the pull order; the pages are under `plans/tickets/`)

| order | id | title | size | priority | column | DoR | depends on / ADR | waits on |
|---|---|---|---|---|---|---|---|---|
| 1 | `ABC-226` | Records scan: how often the R and D games repeated a position the search could not see | S | P2 | **Done** (2026-10-29) | — | the committed PGNs | done: SA `sa-ABC-226` `…cc53fc79`, 484 games (R 26); `ABC-230` stays in milestone 1 |
| 2 | `ABC-227` | Profile: where a node's time goes, on the fixed boards, at 3 s | S | P2 | **Done** (2026-10-29) | — | none | done: SE `se-ABC-227`, merged `f4301d0c`; six value-identical cuts handed to `ABC-235` |
| 3 | `ABC-225` | One command reads an interleaved R pair (base and candidate against Stockfish), with the opening-paired error and a host log. **Re-scoped 2026-10-29: the batch's instrument** | M | P2 | **Ready** | **10/10** | `ABC-204`'s pins | nothing. Done before milestone 1's batch |
| 4 | `ABC-228` | In check, quiescence searches every evasion and scores none as mate | M | P2 | Backlog | **9/10** | ADR: `ADR-0024` d4 + `ABC-079`'s decision; `ADR-0026` d10 door | the ADR (In Design) |
| 5 | `ABC-229` | Quiescence searches quiet promotions to a queen | S | P2 | Backlog | **9/10** | the same ADR; door | the ADR; after `ABC-228` |
| 6 | `ABC-230` | The game's earlier positions reach the search, from the CLI and from UCI, so it sees a repetition the game already holds | M | P2 | Backlog | **9/10** | `ADR-0002` c3 reading; `ABC-081` `A6`; `ADR-0044` D3 | the ADR reading |
| 7 | `ABC-235` | Value-identical cuts in cost per node, from `ABC-227`'s profile | M | P2 | In Design (`arch-ABC-235`) | 9/10 | `ABC-227` (Done); Architect confirms value-identical | the Architect's value-identity ruling |
| 8 | `ABC-231` | The king table is tapered by phase, alone, with no king-safety term | S | P3 | Backlog | **9/10** | `ADR-0031` addendum scope; door | the ADR ruling |
| 9 | `ABC-232` | Passed pawns are worth more as material comes off | S | P3 | Backlog | **9/10** | `ABC-231`'s phase | `ABC-231` |
| 10 | `ABC-233` | A history heuristic orders quiet moves after the killers, cleared per search | M | P3 | Backlog | **9/10** | `ADR-0026` d10; `ABC-080` `A6` | the ADR |
| 11 | `ABC-234` | SEE orders captures in the full-width search (ordering only, no pruning) | M | P3 | Backlog | **8/10** | `ADR-0024` d4 re-open evidence | the evidence; the ADR |
| 12 | `ABC-236` | Aspiration windows at the root, with a stated re-search | M | P3 | Backlog | **9/10** | new ADR; door | the ADR |
| 13 | `ABC-237` | The transposition table prefers deeper entries when it replaces | S | P3 | Backlog | **9/10** | `ADR-0025` (falsifier `T2`) | the ADR |
| 14 | `ABC-238` | A deeper stored entry may cut off a shallower search | M | P3 | Backlog | **9/10** | `ABC-081` `A1` revised; `ADR-0025`; door | the ADR; after `ABC-237` |
| 15 | `ABC-239` | Evaluation weights tuned offline by a stated method, emitted as constants, validated outside | L | P3 | Backlog | **8/10** | `ADR-0048` data licence; new ADR | milestone 2's evaluation done; the licence; the ADR. Its batch is read **before** its merge (its `A6`) |

*Re-scored 2026-10-29 (`bapm-owner-words-b`): Q4 is removed from every wait. Each value-changing ticket's DoR row 4
is now ✅, because its reading is the smoke pair. No ticket but `ABC-225` changes column on this hop. `ABC-227` (Done)
and `ABC-235` (In Design) moved on the Orchestrator's board during this hop (`ff416a56`).*

All fifteen reserved ids are used. None is `XL`; `ABC-239` is the one `L` and is the last pull.

## Owner questions (Q2, Q4, Q5 answered 2026-10-29, `…278e149b`; Q1 and Q3 open)

| Q | asked | answer | what it changed |
|---|---|---|---|
| Q1 | Syzygy (§ B item 10) against `EPIC-004`'s permanent non-goal: (a) keep out, (b) re-open as a later epic | **Open.** "not sure, explain" (2026-10-29). The Orchestrator explains in session | Nothing. **Default (a) holds:** the tablebase non-goal stands, and nothing is cut |
| Q2 | `EPIC-004`'s "Strength above ~1700": (a) cite his `EPIC-008` word, (b) amend the line | **2026-10-29:** "remove that goal", and a new goal: the best vibe-engineered / TypeScript-based engine, 2 700 Elo or more; Rust "let it be for now" | The non-goal is **removed** by a dated amendment on `EPIC-004`. § Product goal: aspirational, no ticket bound, scale `UNKNOWN - verify`. A Rust rewrite is out of scope |
| Q3 | Re-open `ADR-0020` d2 (the ep repetition key)? (a) keep, (b) re-open | **Open.** "not sure, explain" (2026-10-29). The Orchestrator explains in session | Nothing. **Default (a) holds.** SA `…cc53fc79` A6 is information for it: in 22 D games, cutechess counted the threefold one occurrence before the repository's key would |
| Q4 | The pre-merge outside-opponent rule: (a)–(d), and (e) from his `EPIC-009` word | **2026-10-29: (e), extended:** "10 games self-play + 10 games vs stockfish" | § The merge rule: S-1 to S-4 per value-changing ticket, the trend, and a batched R pair. `ABC-225` re-scoped. Q4 is removed from every ticket's wait |
| Q5 | Accept this epic and M1–M5, no Elo target | **2026-10-29: accepted, no Elo target:** "elo target is hard to reach, but try to understand if things get worse" | `proposed` → `backlog`. M1–M5 stand as written. The "worse" question is answered by § The merge rule's three layers |

- **The cut's text of Q1–Q5**, with the options and defaults, is in git at `542e8219` and in note
  `bapm-epic010-improvements` `…5ada23af`.
- **Not questions for him:** which form an ADR takes, the door's shape, `Q-SET`'s extra rows, and the game counts
  inside a rule he sets. Those are delivery, under his delegation (`…5aaf7cec` item 1). The 3.0-of-10 bar, the
  20-game confirmation, the trend flag and the batch's cadence are the game counts inside his rule (e).

## Dependencies

- `ABC-204`'s pinned host tools (`cutechess-cli` 1.5.1, Stockfish 19), re-pinned on this host. Paths stay out of the
  records (`ADR-0049` d4).
- `EPIC-009` runs beside this epic. Its readings and this epic's share the host: one ALONE reading at a time. Its
  files (`src/levels.ts`, `src/cli-options.ts`, `src/uci-session.ts`) overlap `ABC-230` on `src/uci-session.ts` only;
  whichever merges second rebases.
- **`EPIC-009`'s `uci-clock-mode` build** moves `HARD_CEILING_MS` from 32 000 to 60 000 (`ADR-0052` D6, PROPOSED).
  `G9` ("`HARD_CEILING_MS` byte-identical") binds this epic's own diffs. If both are in flight, whichever merges second
  rebases, and the Orchestrator orders them.
- Within this epic: `ABC-228` → `ABC-229` share `src/quiescence.ts`; `ABC-233`, `ABC-234` share `orderMoves`;
  `ABC-237` → `ABC-238` share `src/transposition.ts`; `ABC-231` → `ABC-232` share `src/evaluate.ts`. A value-changing
  merge stales any D or R read on the old base (`EPIC-008` § When a D reading goes stale).

## Risks

- **`RISK-EPIC010-01`: the rule cannot see small losses.** *(Restated 2026-10-29 for Q4 = (e).)* A smoke sees a
  collapse (≈ 250 Elo or more at R). The trend sees ≈ 140 Elo once 30 R games are pooled. A batch sees ≈ 70–75. A
  fall of tens of Elo is invisible to all three. Mitigated by the batch at each milestone's close and at M2, by the
  opening-paired error reported beside Y, and by a bigger batch or the owner's longer games, on his word.
- **`RISK-EPIC010-07` (new, 2026-10-29): a batch that reads LOSS cannot name its cause.** Several merges share it.
  The ledger's per-ticket R smokes point, but at ± 200 Elo they cannot convict. A bisect costs ≈ 10 h per merge.
  Mitigated by batching per milestone (3–7 merges, not 11) and by the trend flag, which pulls a batch forward.
- **`RISK-EPIC010-02`: in-check evasions repeat `ABC-210`'s NEUTRAL.** The frontier node in check is where `ABC-210`
  extended. `ABC-228`'s gain lies in checks that arise inside the capture sequence; its size is `UNKNOWN - verify`.
- **`RISK-EPIC010-03`: added quiescence nodes miss `G6` "≥ base"**, as `ABC-205` did on cost. Each quiescence ticket
  carries a node bar (≤ 1.5 × base at fixed depth 6, `ADR-0024` d3's headroom precedent) and the frozen-clock
  pre-check before the real-clock `G6`.
- **`RISK-EPIC010-04`: heat and hours.** *(Re-costed 2026-10-29 under (e).)* ≈ 1.2 h per value-changing ticket
  (≈ 0.7 h ALONE) and ≈ 10 h per batch, at Tctl median 74–83 °C, max 84–87 °C. Eleven value-changing tickets and
  three batches come to ≈ 45 h, against ≈ 200–300 h under (b). Milestone 1 is ≈ 15 h. The owner may stop the epic
  after any milestone.
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
