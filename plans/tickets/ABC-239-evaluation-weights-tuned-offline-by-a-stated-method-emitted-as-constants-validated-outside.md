---
id: ABC-239
title: "The evaluation's weights are tuned offline by a stated method on a licensed position set, emitted as constants, and validated against an outside opponent"
status: done
column: Done
closed: "2026-11-04, CLOSED NOT MET (first pull), not shipped: step 6 on the fit of record 26d06118 read F3 (pawns A2 53 > 50) and F4 (zugzwang.001 e1e5 at d9–11) as written; path (iii), Orchestrator …4c76bf7a on arch-ABC-239-f3f4 …69f22167. main keeps E1's rule-made table; nothing from 26d06118 merges. The tool lands alone as ABC-280. A second pull is a new attempt under F6, after ABC-271 (bapm-ABC-239-close)"
size: L
priority: P2
epic: EPIC-011
adr: "ADR-0067 (ACCEPTED 2026-11-03 by the owner, orch-2026-10-30a …af126c04 item 1; IN FORCE as the method; § Addendum 2026-11-03, the Lichess data pin; arch-owner-answers-1103 …ab9f83a3). Data: own self-play games plus the Lichess 2017-03 export, CC0 (ADR-0048 d6 dated 2026-11-03; Q-3K-7 (a) yes, (b) no, (c) no). ABC-269 merged 54dee3f2; ABC-274 (E2-pre) merged 2410d4f7. Was: ADR-0067 PROPOSED (arch-ABC-239 …e4c34239, results …48ae6a93, PREREG …9ed1db11). 2026-11-03 (bapm-owner-answers-1103b): ADR-0068 ACCEPTED (E3a structure; the fit is taken on a main with ABC-270; queen-on mg free ≥ 0, eg held at 0) and ADR-0069 ACCEPTED (Q1, ABC-279; the filter keeps its own quiescence rules record; the candidate freeze waits on Q1), owner orch-2026-10-30a …401c3d09. 2026-11-03 (bapm-ABC-239-rulings): ADR-0067 rulings arch-ABC-239-rulings …2b428ce8 (F3 bound and one refit; zugzwang.001 stays e1f1 at d9; own games six names; two rows retired); Orchestrator …42c82347 (B-T4 pins) and …912ba57d (B1 (e) retires whole); da3f8599 not the fit of record"
---

# ABC-239: offline tuning of the evaluation weights

> **CLOSED NOT MET (FIRST PULL), 2026-11-04. Not shipped. Done (closed, not shipped)**, by BA/PM (task
> `bapm-ABC-239-close`, records only, at `main` `ac55ddf6`; nothing run). The pre-registered miss rule applied (§ What
> happens on a miss, F3 and F4). The Orchestrator took path (iii) (`orch-2026-10-30a` `…4c76bf7a`) on the Architect's
> rulings (`arch-ABC-239-f3f4` `…69f22167`, results `…4eae0fd3`; `ADR-0067`'s dated block of 2026-11-04). **No bar moved;
> the owner is notified, and no owner word was needed.** See § Close.
> - **Step 6 on `26d06118` (`se-ABC-239b` `…c3f94eab`):** B-T1, B-T2 (0.9905 ×) and B-T3 were MET. **F3:** pawns A2
>   read 53 against a bar of ≤ 50. **F4:** `zugzwang.001` played e1e5 at depths 9–11, the third fitted set in a row
>   to do so. Both are NOT MET as written.
> - **`main` keeps E1's rule-made table.** Nothing from `26d06118` merges: no fitted table, no re-pin, no retirement.
> - **The tool lands alone as `ABC-280`** (tools only, `src/` byte-identical to `main`), so a second pull starts from a
>   merged, tested tool.
> - **A second pull is a new attempt under F6**, with its own PREREG, on a `main` that has `ABC-271` (E4a). It needs the
>   owner's word then on `ADR-0067` d6's amendment (every relation row bounded at once).

> **RULINGS FOLDED: THE FIT WAITS ON `ABC-270`'S MERGE; F3'S BOUND IS WRITTEN; `zugzwang.001` STAYS e1f1; TWO ROWS
> RETIRE, 2026-11-03, by BA/PM** (task `bapm-ABC-239-rulings`, records only, at `main` `4230d409`; nothing run).
> Sources: the Architect's rulings `arch-ABC-239-rulings` `…2b428ce8` (§ 7 gives the next SE hop's steps) and owed
> lines `…c54dda72`; `ADR-0067`'s dated block of that task, below the bars table; the Orchestrator's rulings
> `orch-2026-10-30a` `…42c82347` (B-T4: pins are re-pinned, bars never are) and `…912ba57d` (B1 (e) retires whole).
> **No bar on this page moved. DoR stays 10/10.** The column is the Orchestrator's: Blocked, on `ABC-270`'s merge only.
> - **`da3f8599` is not the fit of record.** `se-ABC-239`'s first fit beat E1 offline (0.9905 ×, reproducible). It
>   also turned 93 tests red, most of them pins. That fit is dropped. The fit of record is taken again on a `main` that
>   contains `ABC-270` (`ADR-0068` d7). If `ABC-270` is declined or misses, the fit runs without the queen-on
>   features, and A2 (b) stays the phase-0 row.
> - **F3's bound is written** (A4). A red relation row becomes one linear inequality on the parameters, with a
>   rounding margin, so the emitted integer set holds it by construction. The one refit is a fixed procedure: a box-only
>   fit, then the relation rows, then each red row becomes a bound, then one refit gives the candidate. A relation that is
>   still red on the candidate is NOT MET.
> - **`zugzwang.001` is graded as written** (A5): e1f1 at depth 9. e1e5 is a safety failure (Stockfish 19 at d26:
>   forced e1e5 −633, forced e1f1 mate in 10). There is no accept set, no re-pin and no depth change.
> - **Pins and bars (B-T4, test note 6):** a test value that records the old table's output is a pin. Pins are
>   re-pinned old → new in one PR table. Relations, the zugzwang rows, the mate floor, `G1` and the identity gate are
>   bars, and they are never re-pinned.
> - **Two rows retire, each named in `ADR-0067`** (test note 7): the `differ` assertion of E1's "only the king's
>   square and the passers differ" row, and the whole of `ABC-269` B1 (e). B1 (d) is kept.
> - **Own games: six player names** (A1). The 58 probe games enter.
> - **A miss on F3 or F4 is NOT MET and goes to the Architect** (§ What happens on a miss). The next SE hop's steps
>   0–9 are listed under § Dependencies.

> **`ADR-0068` AND `ADR-0069` ACCEPTED: THE FIT WAITS ON `ABC-270`, THE CANDIDATE FREEZE WAITS ON Q1 (`ABC-279`),
> 2026-11-03, by BA/PM** (task `bapm-owner-answers-1103b`, records only, at `main` `0bf243df`; nothing run). Sources:
> the owner's *"yes, accept ADR-0068 and ADR-0069"* (`orch-2026-10-30a` `…401c3d09`), `ADR-0068` d7–d8 and
> `ADR-0069` d6 and § Consequences (the Architect's owed lines, `arch-ABC-270` `…c858b5a5` § 5 and
> `arch-Q1-see-pruning` `…5e73b0d4` § 5). **No bar on this page moved. DoR stays 10/10.** The column is the
> Orchestrator's (In Development, `se-ABC-239`).
> - **The fit is taken on a `main` that contains `ABC-270`** (E3a structure: three queen-on exposure pairs at
>   `{ 0, 0 }`), or after `ABC-270`'s failed disposition (`ADR-0068` d7, F2). The tool build does not wait; the fit
>   that is graded and emitted does.
> - **The first pull fits the queen-on pairs:** mg is free and ≥ 0; eg is held at 0 at the first pull (`ADR-0068` d8).
>   The Architect folds this into `ADR-0067` d4–d6 (`arch-owner-answers-1103b`, in flight).
> - **The position filter names the quiescence rules record it calls** (`ADR-0069` d6). With `seePruning` absent, a Q1
>   merge does not move the data set. Opting in is a decision for this page, never an accident of merge order.
> - **The PR prints, as reports on the emitted set:** S1–S3 (`TAPER_KP_SHELTER_STRESS`; `QE-269-a` moves here from
>   `ABC-270`; whether they clear 20 cp is `UNKNOWN - verify`) and game 1's move 13 (`ADR-0068` d8, § Consequences).
> - **The candidate is frozen for B-T7 / B-T8 only after Q1 (`ABC-279`) merges or misses** (the owner's order,
>   `…401c3d09`). B-T8 runs as **one `rpair`**, paired in one session. That is the Orchestrator's ruling (board,
>   2026-11-03; the `se-ABC-239` brief), and it closes this page's `UNKNOWN - verify` on `rpair` against two `r` reads.

> **OWNER ANSWERS FOLDED; DATA PINNED; DoR 10/10, READY, 2026-11-03, by BA/PM** (task `bapm-owner-answers-1103`,
> records only, at `main` `bdecb7e1`; nothing run). Sources: the owner's answers `orch-2026-10-30a` `…af126c04`
> ("1. yes ; 2. yes ; 3. no ; 4. no ; 5. ok yes ; …"), the Architect's fold `arch-owner-answers-1103` (decision
> `…ab9f83a3`, owed lines `…e81f6b25`) and `ADR-0067` § Addendum 2026-11-03. **No bar on this page moved**
> (the addendum's re-read: B-T0–B-T8 and F1–F7 hold).
> - **`ADR-0067` ACCEPTED, in force as the method** (item 1). `ABC-274` (E2-pre) merged at `2410d4f7` on QE
>   `…fa87f74d`; F8 did not fire, so A3 and A4 hold as written.
> - **Data (A1):** own self-play games **plus** one Lichess month, `lichess_db_standard_rated_2017-03.pgn.zst`
>   (2 169 142 067 bytes; sha256 `b319297e…4320`, full value in `ADR-0067` § Addendum), CC0, training only, at most
>   1 000 000 positions, own games 0.5 of the loss (item 2). **No Stockfish-labelled position** (item 3) and **no game
>   against Stockfish** (item 4) is ever training data.
> - **A6:** B-T7 (100 games at 100 ms, S′, Levels) **and B-T8, the 200 + 200 outside pair, approved** (item 5); both
>   run before the merge.
> - **Four data-stage stops** (§ What happens on a miss), each a STOP to Architect/Design, not a bar.
> - **DoR 8/10 → 10/10:** row 10 (the merges and the owner items) is answered; row 3 is met now that both
>   predecessors merged (`ABC-215`'s precedent: L with a stated split that does not fire). **Front matter → Ready**,
>   BA/PM's exit. The brief asks for **Ready for Dev**; that board move is the Orchestrator's.
> - **Priority P3 → P2** (BA/PM, at this re-score): it is the next pull on the board, and `ABC-270` (P2) waits on it.

> **ALIGNED TO `ADR-0067` (PROPOSED), 2026-11-03, by BA/PM** (task `bapm-E2pre-cut`, records only, at `main`
> `0b87f2d5`; nothing run). Source: the Architect's `arch-ABC-239` decision `…e4c34239` § 5 (the owed lines for this
> page, applied one by one below), results `…48ae6a93` and `ADR-0067`. **The bars below are `ADR-0067`'s B-T0–B-T8,
> fixed there and not loosened after Ready.**
> - **The method is written:** a Texel-style logistic fit of game results, with cross-entropy as the loss, K fixed
>   first, and Newton steps on a traced linear model behind an identity gate. Material is frozen at the first pull, and
>   the free set is sign-bounded. `tools/tune/` writes only `src/evaluate-params.ts`.
> - **The prototype** (E1 as built, own games, 254 485 positions): the loss moves, **0.9863 ×** E1's outer-validation
>   cross-entropy. But free material is unsafe (queen 2 593 / 137 mg / eg). With material frozen and sign bounds, the
>   move left is **0.9960 ×** on the inner split, about 0.4 %, likely near C2′'s ± 48 Elo noise. F6 may fire on own
>   games alone (`ADR-0067` § Consequences, "Expected size").
> - **Order:** `ABC-269` (E1) merged → **`ABC-274` (E2-pre**, the blend of every half, value-identical) merged → this
>   ticket. That order keeps A3 and A4 true as written.
> - **Intent: GAIN (≥ 50.0 of 100)**, named by `ADR-0067` d11 before any read and never re-classed after a score.
> - **Owner items, each PENDING and not assumed** (the Orchestrator asked them 2026-11-03, board):
>   - *"accept ADR-0067"* / *"decline it"*. Under reading (b) the build may start after `ABC-274` merges; A6's read and
>     the merge wait on acceptance.
>   - **Q-3K-7 (a), Lichess CC0 for training only** (Architect recommends yes).
>   - **Q-3K-7 (b), a Stockfish-labelled set** (recommends no).
>   - **Q-3K-7 (c), games against Stockfish as training data** (recommends no).
>   - **B-T8, the 200 + 200 outside pair (≈ 5 h) before the merge** (recommends yes).
>   - Without answers: own games only, `ADR-0067` d9's default, which A1 already allows. The tool's shape does not
>     depend on the data answer.
> - **DoR 8/10, unchanged** (row 3 ⚠ L; row 10 ❌ `ABC-269` and `ABC-274` not merged). Rows 5 and 10 now name
>   `ADR-0067`.

> **RE-HOMED 2026-11-01 to `EPIC-011` by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`). The
> owner asked for a new epic for the 3 000 path, started after the open epics close, and for no work done twice
> (`orch-2026-10-30a` `…022fb66f`). `ADR-0056` D4 maps this ticket to its gap list, so it leaves `EPIC-010` rather
> than holding that epic's close. **Id unchanged; nothing below this block is edited.** `ADR-0056` row E2, "the
> largest single eval lever". `EPIC-011` Phase 4, after E1. **Its wait on "milestone 2's evaluation" becomes a wait on
> E1** (the full taper, which folds `ABC-231`/`ABC-232`). The data question is now the owner's Q-3K-7 (own games
> allowed by default, as its `A1`; Lichess CC0 exports; a Stockfish-labelled set raises a product-identity question).
> `ADR-0056`: M0's games (`ABC-255`) may serve as data.

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 8,
> verified (SA `…306a4012` rows 8a, 8b): every table is written from a stated rule, never tuned. Never tried.
> **Waits in Backlog on** milestone 2's evaluation tickets (§ B item 8: "after the phase-aware design settles"), a data
> licence ruling (`ADR-0048`), a method ADR, and the owner's Q4. Milestone 3, the last pull.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** milestone 2's evaluation tickets, the `ADR-0048` data licence and a method ADR. Milestone 3. DoR 7/10 → 8/10.

## Problem

- **User:** the owner at level 5.
- **Pain:** the weights are hand-picked by rule (`src/evaluate.ts:52-145`; `ABC-215`). `ABC-207`'s hand change lost
  (−18.3 ± 16.5).
- **Value:** weights fitted to data, with no runtime learned component (`EPIC-004` non-goal holds: constants only).

## Scope

1. A tuning tool under `tools/` (not shipped in `dist/`): a stated method (for example logistic fit of game results
   against the static eval), on a position set with a recorded licence, split into training and validation.
   *2026-11-03 (`bapm-E2pre-cut`, `ADR-0067`):* the method is `ADR-0067` d1–d7 (logistic fit of game results, cross-entropy, K fixed first, Newton
   on a traced linear model behind the identity gate, material frozen, a sign-bounded free set). It is **one tool
   module**, `tools/tune/` (d10), so the split rule under § Size does not fire.
   *2026-11-03 (`bapm-owner-answers-1103`):* the tool also reads the pinned Lichess export by `ADR-0067` § Addendum
   (streamed through `node:zlib` zstd, never decompressed to disk; the game filters and position rules as written
   there). Still the same module, so the split rule still does not fire.
   *2026-11-03 (`bapm-owner-answers-1103b`; `ADR-0069` d6, `ADR-0068` d8):* the "quiescence equals static" position
   filter **names the quiescence rules record it passes to `quiesce`** (its own literal, with no `seePruning` field),
   so Q1 (`ABC-279`) merging does not move the data set. The traced model gains
   the three queen-on features (exposure count × enemy-queen flag), and the identity gate covers them (trivially at 0).
2. Its output: a constants file in `src/` with the provenance header `ABC-215` set.
   *2026-11-03 (`bapm-E2pre-cut`, `ADR-0067`):* only `src/evaluate-params.ts`, in its present shape, with `ADR-0067` d7's header (manifest sha256,
   split strings, K, configuration, λ, losses, tool commit). **`ABC-215` A2's rebuild-from-rule rows retire for the
   tuned arrays.** A provenance row replaces them in the build: each tuned array equals the tool's output for the
   recorded data hash (`ADR-0067` d6). No other test bar is edited.
3. Validation outside, never self-play alone (`RISK-EPIC010-05`): ~~the smoke pair and, before the merge, its batched R pair (A6)~~ *2026-11-01:* the 100-game read and, asked of the owner first, the 400-game pair against Stockfish before the merge (A6). *2026-11-01 (`bapm-owner-answers`): the 100-game read, the 10-game Stockfish smoke at 0.5 s, and, asked of the owner first, a 200 + 200 pair against Stockfish at 0.5 s before the merge (A6).*

## Out of scope

- A runtime network or any learned runtime component. New terms. Tuning search parameters.

## Acceptance criteria

- **A1 (licence).** **Given** the position set, **then** its source and licence are recorded and accepted under
  `ADR-0048` before any fit runs. Positions from this project's own games are allowed by default.
  *2026-11-03 (`bapm-E2pre-cut`, `ADR-0067`):* **B-T0.** The data follows `ADR-0067` d9. By default: own self-play games (both players this engine;
  today 3 431 games, 254 485 positions, manifest `6e8d0ab0…`; licence Apache-2.0 under `ADR-0048`, openings CC0 under
  `ADR-0023`). **Lichess CC0 exports enter for training only, and only on the owner's recorded yes to Q-3K-7 (a)
  (PENDING).** Validation then stays own games, and every comment is ignored, `[%eval]` included. A
  Stockfish-labelled set (Q-3K-7 (b), PENDING) and games against Stockfish (Q-3K-7 (c), PENDING) are not used without
  his yes; `ADR-0067` d9 excludes (c) by default. The source, licence and data manifest's sha256 are in the PR before
  any fit.
  *2026-11-03 (`bapm-owner-answers-1103`; owner `…af126c04` items 2–4; `ADR-0067` § Addendum):* **the data is own
  self-play games plus the Lichess `2017-03` export** (`https://database.lichess.org/standard/lichess_db_standard_rated_2017-03.pgn.zst`,
  2 169 142 067 bytes, sha256 as pinned in the addendum), CC0, admitted under `ADR-0048` d6's dated line. **Given** the
  data manifest, **then** it carries the Lichess entry by URL, byte length and sha256 (never a local path), and the
  provenance header carries every game-filter and position-rule count, K_own and K_lichess, the own weight 0.5 and the
  licence line "Lichess database export, CC0 (database.lichess.org)". **When** the local file's sha256 differs from the
  pin, **then** the tool exits non-zero and writes nothing. Lichess rows are training only; outer and inner validation
  stay own games, unchanged, and a Lichess key equal to an own-validation key leaves the Lichess rows. **No
  Stockfish-labelled position is a training target** (Q-3K-7 (b): no), **and no game against Stockfish is training
  data** (Q-3K-7 (c): no); every PGN comment, `[%eval]` included, is dropped unread.
  *2026-11-03 (`bapm-ABC-239-rulings`; `ADR-0067` ruling (d)):* **the own-games set is every PGN tracked at the fit
  commit whose two players are both this engine.** **Given** the tool's player list (`OWN_PLAYERS`), **then** it holds
  exactly six names: `skytalix` and `base` (the prototype's pair) plus `skytalix-a`, `skytalix-b`, `sky-a` and `sky-b`
  (this engine against itself in the QE smoke and time-control reads `qe-ABC-222`, `qe-ABC-223`, `qe-read-ABC-202` and
  `qe-tc-depth-probe`). The provenance header lists the six. The 58 probe games enter, and de-duplication still applies.
  *The base count they join is 3 431 in `ADR-0067` d9 and 3 531 in the ruling: `UNKNOWN - verify`. The header records
  the count the tool reads.*
- **A2 (split).** **Then** training and validation sets share no game; the fit's loss on validation is reported and
  is ≤ the hand weights' loss on the same set.
  *2026-11-03 (`bapm-E2pre-cut`, `ADR-0067`):* **B-T2.** The split is **by opening**: fnv1a32("ABC-239/split/v1\n" + start FEN) mod 5 = 0 is
  validation, a key seen in training leaves validation, and the inner split is mod 4 on "ABC-239/inner/v1". So no
  game is shared. The emitted **integer** set's **cross-entropy** on the outer validation is **< 1.000 ×** the base
  table's on the same rows, reported to 4 places, with training against validation. *(`ADR-0067` B-T2 reads "< 1.000
  × (A2 as written)"; this row said "≤". The strict "<" governs, which is the tighter bar.)* **The fit is
  reproducible:** `extract` + `fit` + `emit` run twice give a byte-identical `src/evaluate-params.ts` (B-T3). The
  identity gate (B-T1) has 0 misses on the full set at the base values before any fit.
- **A3 (constants only).** `dist/` holds no tuning code (`git diff` on the built tree); `src/` gains constants only.
- **A4 (relations).** `G3` mirror and purity; `G2` ≤ base × 1.02 (only constants change).
  *2026-11-03 (`bapm-E2pre-cut`, `ADR-0067`):* **A3 and A4 hold as written once `ABC-274` (E2-pre) has merged.** It puts every term in the blend at E1's
  values, and this ticket depends on it. B-T4: the diff under `src/` is `src/evaluate-params.ts` only, plus the
  provenance row that replaces `ABC-215` A2's rule rows (scope 2). A relation test that turns red on the emitted set
  becomes a bound, with one refit; a second red is NOT MET (`ADR-0067` d6, F3).
  *2026-11-03 (`bapm-ABC-239-rulings`; `ADR-0067` ruling (b)):* **F3's bound and the one refit.**
  - **A relation row** is B-T4's relation class: a sign or order relation (L scores below H), or a threshold relation
    such as B1 (d)'s ≥ 20 cp. A pin is not a relation.
  - **The bound.** **Given** a relation row that is red on the box-only fit, **then** it becomes one linear inequality
    on the parameters it reads: a = trace(L) − trace(H) under d4's model (each term's count difference × w/24 on its
    mg parameter and × (24 − w)/24 on its eg parameter, each position at its own w; Δm on W_mg / W_eg; tied cells
    summed). A threshold row carries its threshold on the right side. The row is tightened by ½ ‖a‖₁ (rounding), plus 1
    for each position with 0 < w < 24 (the blend's trunc), plus 1 for a strict sign. So **the emitted integer set holds
    the row by construction.**
  - **The solve:** d4's projected Newton, with the active rows as equalities (the KKT form is in `ADR-0067` ruling
    (b)). There is no penalty term and no parameter freeze. For one active row with an unbounded C-F cell, a tie on that
    cell is allowed.
  - **The procedure, which is the one refit:** (1) fit box-only and emit to scratch, never committed; (2) run the
    relation rows of every `src/evaluate*.test.ts`; (3) each red row is a bound, and one refit with all of them gives
    the candidate (with no red row, step 1's emission is the candidate and no refit runs); (4) **a relation red on the
    candidate is NOT MET** (F3's second red).
  - **Then** the provenance header lists each bound row: test file, row, a's nonzero terms, right side and μ.
  - **The known case:** `ABC-083` A2 (b) read +8 (red) on `da3f8599`. It crosses pawn PST g6 / g2 (tied b6 / b2),
    `KING_SHELTER_MISSING` and W. After `ABC-270` the row is its phase-24 twin. That twin crosses the same terms' mg
    halves, plus `KING_SHELTER_MISSING_QUEEN` mg if it holds an enemy queen. It is forecast red on `da3f8599`'s mg
    values (`UNKNOWN - verify` until the twin exists).
- **A5 (gates).** `G1`, `G5`, `G6` "≥ base" (floor 6), `G8`, `G9`, `G10`.
  *2026-11-03 (`bapm-E2pre-cut`, `ADR-0067`):* read as **B-T5** (`ADR-0050` d9's zugzwang rows 7 / 7 at their depths; mate floor 0 violations in
  `ADR-0064` B2's form; `G1` ≥ 54 / 58 with no NEWLY-MISSED line; `ADR-0061`'s futility audit, flips ≤ 0.5 % and 0
  flips ≥ 200 cp) and **B-T6** (`G6` under `Q-3K-4` = (b), as a value-changing evaluation ticket: `LEVELS[5]`, ≥ 5
  interleaved rounds, every run at depth ≥ 6 (FAIL below), depth 7 a WARN, the median against base reported, not
  graded). `G5`, `G8`, `G9` and `G10` stay as listed.
  *2026-11-03 (`bapm-ABC-239-rulings`; `ADR-0067` ruling (c)):* **`zugzwang.001` is graded as written.** **Given** the
  candidate's emitted set, **when** `chooseMove` searches `zugzwang.001` (`8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0
  1`) at depth 9, **then** it plays **e1f1**. Any other move is F4. e1e5 is a safety failure, not a second sound move:
  Stockfish 19 at d26 (`ADR-0050` d9's instrument) scores forced e1e5 at −633 and forced e1f1 at mate in 10.
  `da3f8599` played e1e5 at depths 9–11 and e1f1 only from depth 12; the base table plays e1f1 at 9–12. There is **no
  accept set, no re-pin and no depth change**. The row is read twice: at step 6 (fail fast, before any re-pin) and
  under B-T5.
- **A6 (the reading).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the smoke pair and the 200 + 200 R pair at 4 000 ms that this row named.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time at the 50 ms margin, and the score meets `ADR-0056` C2′ (merged `94f1504c`): ≥ 50.0 of 100 for a GAIN, ≥ 43.0 for a NEUTRAL, the intent declared at design. A miss is NOT MET and is not re-played. *(2026-11-01, `bapm-owner-answers`, the owner's answers 1 and 3: the epic read is now 400 games head-to-head, so it is no longer an outside check, and the pair this row named has no epic shape left to borrow.)* **And the Stockfish smoke beside it:** 10 games, the candidate at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`, through `ABC-255` (`EPIC-011` § The per-change rule): 10 of 10 complete, 0 faults, 0 losses on time, and S-4 at ~~E 1 650~~ *E 1 810 (2026-11-02, `bapm-records-1102c`; `ADR-0056` S′ amendment)*: ≥ 3.0 of 10, below that 10 more games and ≥ 7.0 of 20 (`ADR-0056` S′; `skytalix` `timemargin` 50 ms; ~~`r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`~~ `r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`) *(was the fold's bar, `UNKNOWN - verify`; merged `a0f9297e`, `bapm-reconcile-adr0056`)*. *(2026-11-01, `bapm-reconcile-adr0056`, `ADR-0056` R-TC part 2: the owner's "works on different difficulty settings".)* **And the Levels deep lane on the candidate head:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, QE, host alone, beside the 100-game read (≈ 9 min): exit 0 with every test passed (41 at `ADR-0056`'s count; QE counts its own run). A failure is a defect, back to the Software Engineer. **And an outside read before the merge, asked of the owner first** (a tuned set judged by self-play alone repeats `EPIC-008`'s failure, `RISK-EPIC010-05`): the interleaved pair (`rpair`), the candidate head against its merge-base, each 200 games against Stockfish 19 `UCI_LimitStrength` at the 0.5 s smoke control (`ABC-255`), one game at a time; MET when the pair's point estimate is ≥ 0 (C3′'s decision rule, kept for this owner-asked pair; *2026-11-01, `bapm-reconcile-adr0056`: the merged fold, `a0f9297e`, supersedes C3′ only as the epic read, by C3″*); *(`bapm-reconcile-adr0056`: the fold gives the 0.5 s control to `r` alone (`--budget-ms 500`) and leaves `rpair` unchanged, so on the owner's yes this pair is two `r <build> <out> --budget-ms 500 --rounds 100 --concurrency 1` reads, the candidate then its merge-base, not interleaved, unless a harness ticket gives `rpair` the control first; which one is the Orchestrator's, `UNKNOWN - verify`)*; about ± 58–78 Elo (C3′'s figure for a 200 + 200 pair). Estimated ≈ 5 h (BA/PM arithmetic: ≈ 85 plies a game at 0.5 s a side; not a reading), over 1 h, so **it is asked of the owner before it starts**; if he declines, this ticket merges on the 100-game read and the smoke, and `RISK-EPIC010-05` stays open for it (no outside read with resolution follows at the epic's close). Reported: W/L/D, score and Elo ± error of each read, the pair's X ± Y, `G11`.
  *2026-11-03 (`bapm-E2pre-cut`, `ADR-0067`):* this row is B-T7 (the 100-game read, intent **GAIN**, S′ at E 1 810, the Levels deep lane) and **B-T8**
  (the outside pair, point estimate ≥ 0). **B-T8 was put to the owner 2026-11-03 (board): PENDING**, and the Architect
  recommends yes. A6's read and the merge also wait on *"accept ADR-0067"* (PENDING). F6: **no set is ever re-fitted on
  play results**, and the configuration and λ are never chosen on play.
  *2026-11-03 (`bapm-owner-answers-1103`; owner `…af126c04` items 1 and 5):* **A6 reads, before the merge, in this
  order:** (1) **B-T7**, the per-change rule: 100 games at 100 ms a move against the merge-base, intent GAIN, MET at
  ≥ 50.0 of 100 (C2′), with the S′ smoke at E 1 810 and the Levels deep lane as written above; (2) **B-T8, approved by
  the owner**: the candidate and its merge-base, each 200 games against Stockfish 19 at 0.5 s (≈ 5 h, QE, host alone),
  MET on a point estimate ≥ 0. Both MET, or no merge. The "if he declines" branch above is void. Whether B-T8 runs as
  `rpair` or as two `r` reads stays the Orchestrator's (`UNKNOWN - verify`, as above). `ADR-0067` is accepted, so
  nothing here waits on the owner. B-T8's games, like S′'s, never enter training (Q-3K-7 (c)).
  *2026-11-03 (`bapm-owner-answers-1103b`; owner `…401c3d09`; `ADR-0069` design note § 3):* **the candidate is frozen
  for B-T7 and B-T8 only after Q1 (`ABC-279`) has merged or recorded NOT MET**, and that freeze is on a `main` that
  contains `ABC-270` (or its failed disposition). So both reads are taken on the search and the structure that will
  ship. B-T8 runs as **one `rpair`**, the candidate and its merge-base interleaved in one session (the Orchestrator's
  ruling, board 2026-11-03). The `UNKNOWN - verify` above is closed. **Reports in the PR beside B-T7, not bars:** S1–S3
  on the emitted set (`QE-269-a`, moved from `ABC-270` by `ADR-0068` § Consequences; if they read under 20 cp, QE
  records the gap, and E3b or a later pull owns it) and game 1's move 13 (`plans/uat/EPIC-006-game-1.pgn`; the probe's
  QX played Ng4, Stockfish's move, where `main` plays 13.d4).

## What happens on a miss

*Added 2026-11-03 (`bapm-owner-answers-1103`).* A bar miss takes `ADR-0067` § What would falsify this (F1–F8), unchanged.
**The four data-stage stops** (`ADR-0067` § Addendum, § The re-read) are not bars and grade nothing. Each one is a
**STOP to Architect/Design** with its count, before any fit is read or any game is played:
1. **Fewer than 250 000 Lichess rows** survive the position rules (before any fit). A smaller slice or a second month
   is a new dated decision in `ADR-0067`.
2. **The reader drops over 0.1 %** of the games that reach replay (game filter 7). A reader defect, fixed first (F1).
3. **One `extract | fit | emit` run takes over 30 min** (each stage under `timeout 1800`); reported with the stage
   times. The slice is not cut inside the build.
4. **The heap goes over the 3 000 MB flag** (`--max-old-space-size=3000`). The fault is in the row storage; the slice
   is not shrunk to fit.

*Added 2026-11-03 (`bapm-ABC-239-rulings`; `ADR-0067` rulings (b) and (c)).* **Two play-sanity misses are NOT MET,
and each goes to Architect/Design.** Both are read at step 6 of § Dependencies, on the candidate and before any
re-pin, so a miss spends no re-pin work and no games:
1. **F3:** a relation row is red on the candidate, after the one refit. There is no second refit, and no bar moves.
   The STOP carries the row, its a, its right side and its read.
2. **F4:** `zugzwang.001` does not play e1f1 at depth 9 on the candidate. A defect check comes first (the identity
   gate on the emitted file, then B-T3). If the miss is real, it is NOT MET. No set is re-fitted to pass it (F6:
   nothing is fitted on play).

## NFR triggers

- **`NFR-008`:** the tool's tests outside the default lane. **`G2`:** A4. **Security:** the tool reads local files
  only; no network fetch at run time.
- *2026-11-03 (`bapm-E2pre-cut`, `ADR-0067`):* `NFR-008`: `vitest run tools/tune`, outside the default lane (identity gate on a fixture, determinism,
  split disjointness, emission round-trip). `G2` ≤ 1.02 × after `ABC-274`. `NFR-005`: B-T6. `NFR-009`: unchanged (no
  memory added). Security: every PGN comment is ignored on read, and the Lichess file, on a yes, stays outside the
  repository with its URL and sha256 recorded. No new NFR row.
- *2026-11-03 (`bapm-owner-answers-1103`; `ADR-0067` § Addendum):* the data stage's targets: one `extract | fit | emit`
  run ≤ 30 min (estimate 10–15 min, `UNKNOWN - verify`), inside `--max-old-space-size=3000`, with peak RSS recorded;
  B-T3 runs it twice under the same limits. The 2.17 GB file is downloaded once by hand (URL, then `sha256sum -c`),
  outside the repository, and is never committed; the tool makes no network call. No new NFR row.

## Test notes

1. ~~The fit is reproducible from a seed; the seed and the set's hash are recorded.~~ *2026-11-03 (`bapm-E2pre-cut`, `ADR-0067`):* the fit has no random
   number generator (full batch, fixed order; d4). The **data manifest's sha256** (over repository-relative paths and
   file hashes) and the **split strings** ("ABC-239/split/v1", "ABC-239/inner/v1") are recorded in the provenance
   header and the PR. Two runs give one file (B-T3).
2. UAT is owed. The QE verdict signs it.
3. *2026-11-03 (`bapm-sec-cut`; `QE-274-b`, INFO, `qe-ABC-274` gaps `…d4c26218` on `grugops/ABC-274`):* **widen
   `ABC-274`'s A3 rows before tuning.** This ticket relies on `ABC-274` A3 (every family's offset blended exactly)
   holding at the emitted values. Today five families (PST pawn, rook, king, ISOLATED, KING_FILE_HALF_OPEN) read all
   six rows from one position and its 1-ply children at phase 4; KING_FILE_OPEN reads phase 2 only, PST queen phase
   18 only, DOUBLED 4 rows. Before the first fit is emitted, QE (or the Architect's brief) adds frozen rows only (no
   row changed, `ABC-274` A7) so each family reads ≥ 3 distinct positions at ≥ 2 distinct phases in 1–23. Not a DoR
   row; the Architect may rule it unnecessary in writing.
4. *2026-11-03 (`bapm-owner-answers-1103`; `ADR-0067` § Addendum, § Test strategy):* `vitest run tools/tune`, outside
   the default lane, gains six rows:
   - **comment blindness** (the evidence for Q-3K-7 (b)): a fixture game carrying `[%eval]`, `[%clk]` and free-text
     comments gives rows byte-identical to the same game with every comment stripped;
   - **the export's known issue:** a game with no `Round` or `Date` tag, and no black move numbers after comments,
     parses;
   - **filter counts:** one fixture game per game-filter drop reason, with the expected counts;
   - **the sha256 refusal:** a byte-changed copy makes the tool exit non-zero and write nothing;
   - **leakage direction:** a Lichess key equal to an own-validation key leaves the Lichess rows, and validation is
     unchanged;
   - **the zstd stream:** one small `.pgn.zst` fixture (CC0 games, or games written by hand).
5. *2026-11-03 (`bapm-owner-answers-1103b`; `ADR-0069` d6):* **a filter row:** the rules record the position filter
   passes to `quiesce` has no `seePruning` field (or has it false), read from the source, so a Q1 merge leaves the
   filtered row count unchanged.
6. *2026-11-03 (`bapm-ABC-239-rulings`; the Orchestrator's B-T4 ruling `…42c82347`):* **pins and bars.** B-T4 grades
   the shipped change: the only production `src/` diff is `src/evaluate-params.ts`, plus the provenance test.
   - **Pins:** test values that record the old table's exact output (scores, node counts, chosen moves in rows that are
     not safety rows, set-up values). Each is re-pinned old → new in `ADR-0064` d7's form, with a dated comment. **Then**
     the PR holds one table of every re-pin: file, row, old, new. The quiescence deep pins and `ORACLE_AT_DEPTH_3` are
     re-pinned only by re-running the oracle.
   - **Bars, never re-pinned:** the zugzwang rows, the mate floor, `G1`, the identity gate and the relation tests (sign
     or order relations, such as king-mobility A2). They stay under F3 / F4 as written.
   - **Lost fixture properties are re-found under `ADR-0028` d2, never loosened:** king-mobility A4's rig, B1 (a)
     M-negzero-a, `QE-208-a`, and the ordering, futility and transposition "fixture bites" rows.
7. *2026-11-03 (`bapm-ABC-239-rulings`; `ADR-0067`'s retired rows; the Orchestrator's ruling `…912ba57d`):* **exactly
   two rows retire**, each with a dated comment pointing to `ADR-0067`:
   - **(i)** `src/evaluate.taper.test.ts`, "every pair holds two halves of one shape; only the king's square and the
     passers differ". **Only its `differ` assertion retires.** It is E1's structure, and `ABC-274` blends every half.
     The shape assertions (the PST keys, each eg length equal to its mg length) stay, in a row renamed "every pair holds
     two halves of one shape".
   - **(ii)** `src/evaluate.taper.test.ts`, "ABC-269 B1 (e) — the passers …", **whole**: the 36 pair rows and "by
     array". It pins E1's rule-made table (eg = 2 × mg on the passer band), not play quality. The passers' blend stays
     graded by `ABC-274` A3 and, at phase 24, by `ADR-0064` B1 (b).
   - **Kept:** B1 (d), a relation, green on `da3f8599` (106–227 cp on D1–D6, bar 20). Its `mainCentreMinusCorner`
     door literal is a pin and is re-pinned. Passed-pawn play stays guarded by B1 (d), the relation rows (bounded per
     F3), the mate floor, zugzwang and `G1`.
   - **Then** QE checks that the PR's retired rows are exactly these two.
8. *2026-11-03 (`bapm-ABC-239-rulings`; `ADR-0067` ruling (b), decision 10):* `vitest run tools/tune` gains **three
   rows and a source row**:
   - (1) a fixture whose box-only fit breaks a row: the bounded fit holds it on the rounded set;
   - (2) a row the box-only fit holds: the bounded fit is byte-identical to the box-only fit;
   - (3) B-T3 over a bounded run: two runs give one byte-identical file;
   - **the FEN source row:** each bound row's FEN is a constant in `tools/tune`, and it appears literally in its test
     file. `ABC-270`'s phase-24 twins carry theirs as literals for that reason.
   - The tracer also traces the three queen-on features and the K1 (c) count row (`ADR-0067` d5's dated line).

## Size and priority

- **Size: L.** A tool, a data set and its licence, a fit, a validation. Not split: each part alone ships nothing
  measurable. If design shows more than one new tool module, BA/PM splits the data set into its own ticket from the
  pool. *2026-11-03 (`bapm-E2pre-cut`): `ADR-0067` d10 has one tool module, so the split does not fire. The blend change
  is cut apart as `ABC-274` (S), a `src/` ticket, not a tool module. Effort (`…e4c34239` § 6): the tool ≈ 800–1 000
  lines of TypeScript with tests; one fit takes minutes; the reads ≈ 0.7 h plus `G6` and the futility audit; B-T8 adds ≈
  5 h if asked.* *2026-11-03 (`bapm-owner-answers-1103`): still L, still one module. The Lichess reader adds the
  streamed parse, the filters and six test rows inside `tools/tune/`; it ships nothing alone (its value is read only
  through the fit), so it is not split out. B-T8 is now approved: ≈ 5 h of QE host time before the merge. One data run
  ≤ 30 min (estimate 10–15 min, `UNKNOWN - verify`).*
- **Priority: ~~P3~~ P2** *(2026-11-03, `bapm-owner-answers-1103`: the next pull on the board; `ABC-270`, P2, waits on
  it).*

## Dependencies

- `ABC-231`, `ABC-232` Done or closed. `ADR-0048` (data licence). A method ADR. **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`).
- *2026-11-03 (`bapm-E2pre-cut`, `ADR-0067`):*
  - **Order: `ABC-269` merged → `ABC-274` (E2-pre) merged → this ticket's build.** Both hard. *2026-11-03
    (`bapm-269-done`): the first is met, `ABC-269` merged at `54dee3f2`; `ABC-274` is In Development.* `ABC-231` / `ABC-232`
    are closed, folded into `ABC-269`. Today `ABC-269` is held on `ADR-0064` F3 (`arch-ABC-269-F3`).
  - **The method ADR is `ADR-0067`, PROPOSED.** *"accept ADR-0067"* / *"decline it"* is PENDING. Under reading (b)
    it gates A6's read and the merge, not the build. Default: `main` keeps E1's rule-made table.
  - **Data: Q-3K-7 (a)/(b)/(c), PENDING.** The default is own games (A1, under `ADR-0048`). The build and a first fit
    do not wait; the fit uses whatever source is accepted at fit time.
  - **B-T8: PENDING**, asked before the merge.
  - **After this ticket:** `ABC-270` (E3a) and `ABC-271` (E4a), so that their new terms get fitted weights (if this
    ticket stalls on data, `ABC-270` may go first on its rule values and the tuner traces it). `ABC-272` (E7a) in any
    order. `ABC-273` (R1) is read after E1 and before this ticket merges (`ADR-0067` § Consequences).
- *2026-11-03 (`bapm-owner-answers-1103`), every hard dependency met:*
  - **`ABC-269` merged** (`54dee3f2`) and **`ABC-274` (E2-pre) merged** (`2410d4f7`, QE `…fa87f74d`; F8 not fired).
  - **`ADR-0067` ACCEPTED** 2026-11-03 (owner `…af126c04` item 1), in force as the method, with § Addendum.
  - **Data answered:** Q-3K-7 (a) yes, (b) no, (c) no (items 2–4); `ADR-0048` d6 admits the CC0 export as data.
  - **B-T8 approved** (item 5): it runs before the merge.
  - **`ABC-273` (R1) is Done** (merged `20d539e1`), so its "before this ticket merges" order is met.
  - **One manual precondition, not a blocker:** before the first extract, the Lichess file is downloaded by hand,
    outside the repository, and checked with `sha256sum -c` against the pinned line (`ADR-0067` § Addendum).
  - **After this ticket:** unchanged, except that `ABC-270`'s *design* may start now (owner item 8); the build order
    stays this ticket first, under the stall clause, and which build lands first is the Orchestrator's.
- *2026-11-03 (`bapm-owner-answers-1103b`; owner `…401c3d09`; `ADR-0068` d7, `ADR-0069`):* **the order is now set.**
  - **`ABC-270` (E3a structure, `ADR-0068` ACCEPTED) before the fit.** Its build runs beside this ticket's tool build.
    The fit that is graded (B-T1–B-T6) and emitted is taken on a `main` that contains `ABC-270`, or after its failed
    disposition. The stall clause above is void: `ABC-270` is now structure only, with no rule values to go first on.
  - **Q1 (`ABC-279`, `ADR-0069` ACCEPTED) before the candidate freeze.** It merges or misses before this ticket's
    candidate is frozen for B-T7 / B-T8, never between that freeze and this merge. There is no file collision:
    `ABC-279` edits `src/see.ts`, `src/quiescence.ts`, `src/search.ts` and `src/engine.ts`.
  - **File collision with `ABC-270`:** `src/evaluate.ts` and `src/evaluate-params.ts`. The tool writes the file's
    present shape, which then includes the three queen-on pairs.
- *2026-11-03 (`bapm-ABC-239-rulings`; `ADR-0067` rulings; the Architect's § 7, `…2b428ce8`; the Orchestrator's
  `…912ba57d`):* **one wait is left: `ABC-270`'s merge.**
  - **`ABC-270` merged on `main` before the fit** (`ADR-0068` d7). `da3f8599` is not the fit of record. If `ABC-270` is
    declined or misses, the fit runs without the queen-on features, and A2 (b) stays the phase-0 row.
  - **The tool is built** (`grugops/ABC-239`, tool commits `9eeb0314` and `03fcaaa0`). Nothing from that branch is merged
    into `main` by this hop.
  - **The next SE hop (`se-ABC-239b`), steps 0–9** (the Architect's § 7; `ADR-0067`'s dated block is authoritative):
    0. **Precondition:** `ABC-270` merged on `main`, or its decline or miss recorded (then no queen-on features).
    1. Rebase or cherry-pick the tool commits `9eeb0314` and `03fcaaa0` onto that `main`. Drop `da3f8599`.
    2. One tool commit, with the `TUNE_DEEP` lane green. The tracer traces the three queen-on features and the K1 (c)
       count row. The free set gets queen-on mg ≥ 0, with eg held at 0. `OWN_PLAYERS` is the six names (A1). The
       linear-inequality bounds come with the three tool rows and the FEN source row (test note 8).
    3. `extract | fit | emit`, box-only, emitted to scratch, under the host lock, with the four data-stage stops.
       B-T1 on the full set.
    4. In a scratch tree with that file, run the relation rows of each `src/evaluate*.test.ts`. The red ones are the
       bound set. Note `zugzwang.001` at depth 9 there; it is not graded yet.
    5. Refit once with the bound set, if it is not empty, and emit `src/evaluate-params.ts`. Then the identity gate
       re-runs on the emitted file, B-T2 is < 1.000 ×, and B-T3 holds (two full runs, byte-identical, the bounded refit
       included). Commit the candidate.
    6. **Fail fast, before any re-pin:** every relation row green (else F3: NOT MET, STOP to Architect), and
       `zugzwang.001` plays e1f1 at depth 9 (else F4: STOP).
    7. Tests: retire the two named rows (test note 7); re-pin every pin per B-T4 in one PR table (test note 6);
       re-find each lost fixture property under `ADR-0028` d2; then `npm test`, lint, typecheck and build.
    8. Deep lanes, one at a time under the lock: taper, search, quiescence, transposition (both), futility, null-move
       (zugzwang 7 / 7, `.004` / `.005` included), PVS/LMR, puzzle (`G1`) and engine. B-T5: mate floor 0, `G1` ≥
       54 / 58 with none newly missed, and the futility audit. Then B-T4's `G3` / `G2` ≤ 1.02 × and B-T6's `G6`.
    9. Hand to QE: B-T5 first. B-T7 / B-T8 run only after Q1 (`ABC-279`) has merged or missed (the freeze rule, A6).
  - **`EPIC-011`:** no new phase and no new order (`…c54dda72`). `ABC-270` structure → this ticket's fit; Q1 before
    the B-T7 / B-T8 freeze.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 8b |
| 2 | scope and out-of-scope | ✅ constants only |
| 3 | INVEST | ~~⚠ L; depends on milestone 2~~ *2026-11-03 (`bapm-E2pre-cut`): L; depends on `ABC-269` and `ABC-274`; one tool module (the split rule does not fire)* *2026-11-03 (`bapm-owner-answers-1103`):* ✅ **independent now** (both predecessors merged); L with a stated split rule that does not fire (one module; the Lichess reader ships nothing alone), as `ABC-215`; valuable and testable by B-T0–B-T8 |
| 4 | testable, measurable acceptance | ✅ every row measurable; A6 is the 100-game read plus, on the owner's yes, the 400-game outside pair (pass lines: `ADR-0056` C2′ and C3′) *(2026-11-01)* *2026-11-01 (`bapm-owner-answers`): plus the 0.5 s smoke; the outside pair is at 0.5 s and graded by C3′'s point-estimate rule; the smoke's bar is the owner-answers fold's, scored as the C2′ line was while pending.* *2026-11-01 (`bapm-reconcile-adr0056`): the fold merged (`a0f9297e`); the smoke's bar is S′'s S-4 at ~~E 1 650~~ E 1 810 (2026-11-02, `bapm-records-1102c`), the row adds the Levels deep lane (exit 0, every test passed), and the outside pair is two `r` reads unless `rpair` gains the control. Score unchanged.* *2026-11-03 (`bapm-ABC-239-rulings`): A4 gains F3's bound and the one-refit procedure; A5 gains `zugzwang.001` at e1f1, depth 9, with no accept set* |
| 5 | dependencies known | ✅ *2026-11-03 (`bapm-E2pre-cut`): `ABC-269` → `ABC-274` → this; `ADR-0067` (PROPOSED; acceptance pending); Q-3K-7 (a)/(b)/(c) pending; B-T8 pending* *2026-11-03 (`bapm-owner-answers-1103`): `ABC-269` and `ABC-274` merged; `ADR-0067` ACCEPTED; Q-3K-7 (a) yes / (b) no / (c) no; B-T8 approved; the manual download and `sha256sum -c` named* *2026-11-03 (`bapm-ABC-239-rulings`): one wait, `ABC-270` merged before the fit (`ADR-0068` d7 fallback); steps 0–9 written* |
| 6 | NFR triggers with targets | ✅ `G2` ≤ 1.02 × *(after `ABC-274`; `NFR-005` floor 6 by B-T6; `NFR-008` out of the default lane)* |
| 7 | test notes | ✅ 2 *(2026-11-03: 4, with the addendum's six rows)* *(2026-11-03, `bapm-ABC-239-rulings`: 6–8, pins and bars, the two retired rows, the three tool rows and the FEN source row)* |
| 8 | size | ✅ L |
| 9 | priority | ✅ ~~P3~~ P2 *(2026-11-03)* |
| 10 | no major unresolved blocker | ✅ *2026-11-03 (`bapm-owner-answers-1103`): answered. `ADR-0067` ACCEPTED (`…af126c04` item 1); data pinned (`ADR-0067` § Addendum; Q-3K-7 answered); `ABC-269` (`54dee3f2`) and `ABC-274` (`2410d4f7`) merged; B-T8 approved. No owner item left* ~~❌~~ ~~data licence; ADR; milestone 2~~ *2026-11-03 (`bapm-E2pre-cut`): method ADR → **`ADR-0067` PROPOSED** (reading (b): the build may start; A6's read and the merge wait on acceptance, PENDING); data → **Q-3K-7** (a)/(b)/(c) PENDING, own games allowed by default under `ADR-0048`, so it does not block the build; milestone 2 → **`ABC-269` and `ABC-274` not merged** (the blocker)* |

**DoR 8/10 (re-scored 2026-10-29). Backlog.** *2026-11-03 (`bapm-E2pre-cut`): **8/10, unchanged.** Row 10 now waits on
`ABC-269` and `ABC-274` merging; the owner items are pending and gate A6's read and the merge only.*

**DoR 10/10 (re-scored 2026-11-03, `bapm-owner-answers-1103`). Ready.** Rows 3 and 10 flip (both predecessors merged;
`ADR-0067` accepted; data pinned; B-T8 approved). Rows 5, 7 and 9 updated. The board move to Ready for Dev is the
Orchestrator's.

*2026-11-03 (`bapm-owner-answers-1103b`): **10/10, unchanged.** Row 5 gains the order (`ABC-270` before the fit; Q1,
`ABC-279`, before the candidate freeze; both ADRs ACCEPTED), and row 7 gains test note 5. Neither is a blocker: the
tool build proceeds, and the two waits order the fit and the freeze, not the build.*

*2026-11-03 (`bapm-ABC-239-rulings`): **10/10, unchanged.** Row 4 gains measurable lines: A4's bound and the one-refit
procedure, and A5's `zugzwang.001` at e1f1, depth 9. Row 5 gains the single wait (`ABC-270`'s merge, with
`ADR-0068` d7's fallback) and steps 0–9. Row 7 gains test notes 6–8. Row 10 stays ✅: every ruling the first attempt
needed is made (`…42c82347`, `…912ba57d`, `ADR-0067` rulings (b)–(d)), and no owner question is open. The `ABC-270`
wait is an ordered dependency with a written fallback, not an open question. The board's Blocked column is the
Orchestrator's.*

## Close

> **BA/PM, 2026-11-04** (task `bapm-ABC-239-close`, records only, at `main` `ac55ddf6`). Inputs: the Orchestrator's
> decision `orch-2026-10-30a` `…4c76bf7a`; the Architect's `arch-ABC-239-f3f4` results `…4eae0fd3` and rulings
> `…69f22167` (with the owed lines for this page); `se-ABC-239b` failed attempt `…c3f94eab`; `ADR-0067`'s dated block
> of 2026-11-04. Notes: `.grugops/context/bapm-ABC-239-close/notes/`.

**The first pull is closed NOT MET under § What happens on a miss.** That section's rule is that F3 or F4 on the
candidate is NOT MET and goes to Architect/Design. The Architect ruled both as written, and the Orchestrator closed the
pull (path (iii)). Status Done means closed and not shipped, in the form of `ABC-210`'s S1 close. It does not mean
merged.

- **Step 6 on the fit of record `26d06118`** (`src/evaluate-params.ts` sha256 `10581fb5…95af`; `grugops/ABC-239b`, tip
  `7e9fb4f7`):
  - **MET before step 6:** B-T1 (0 misses over 1 488 071 keys; 0 over 1 212 172 rows on the emitted file), B-T2
    (**0.9905 ×** on 45 158 own outer-validation rows) and B-T3 (two runs byte-identical). No data-stage stop fired.
  - **F3, NOT MET:** pawns A2 (the doubled-pawn gap) read **53 against ≤ 50**. It was green at 49 on the box-only fit,
    with a slack of 1 against its 2.5 margin, so the procedure did not bound it. The one refit moved it.
  - **F4, NOT MET:** `zugzwang.001` played **e1e5 at depths 9, 10 and 11** (e1f1 from depth 12). The defect check was
    clean. This is the third fitted set to play e1e5: `da3f8599`, the box-only set and `26d06118`.
- **The cause, as the Architect measured it (`…4eae0fd3`):** it is joint, in the fitted endgame halves. Four pairs
  drive it ({P, R}, {P, K}, {P, PASS} and {K, PASS}), and no single term does. At depth 9 the base plays e1f1 by an
  evaluation preference of 29 cp. Neither table sees White's win up to depth 16. The passer part needs a feature the
  engine lacks: whether a passer's path is free, and how far the kings are. That is `ABC-271` (E4a). Whether a fit over
  E4a holds the row is `UNKNOWN - verify`.
- **What stays and what goes:**
  - `main` keeps E1's rule-made table. Nothing from `26d06118` merges, and none of its tests change. No row is
    re-pinned and none retires.
  - The tool commits (`625b75fe`, `5ce4f870`, `def26997`, `8c03b713`) land alone as **`ABC-280`**, with `src/`
    byte-identical to `main`.
  - `954d44fb` (`QE-270-e`, a test-only change to the K1 (e) bite rows) does not land. It goes red only once a fit frees
    a queen-on mg, so it is owed by the second pull.
  - The branches stay unmerged: `grugops/ABC-239` (`da3f8599`) and `grugops/ABC-239b` (`26d06118`).
- **K1 (c), for any later step 7: form (A)** (`…69f22167` § 3). Each row runs inside `withParametersForTest`, with the
  six king-file pairs at the values its literals were frozen at (15 / 10 / 20 in both halves, queen-on 0). Every literal
  stays unchanged. Measured 5 / 5 green on `26d06118` and on the base. QE checks three things: the bite (each row is red
  with the queen-on term zeroed), that the seam is used in test files only, and that the "{ 0, 0 }" row is re-pinned as
  a pin. Re-pinning by halves is rejected.
- **The second pull is a new attempt, not a re-open of this one:**
  - It runs under F6's rule ("a new attempt is a new data set or free set with a new pre-registration"), with its own
    PREREG, on a `main` that has `ABC-271`.
  - **The owner's word is needed then** on `ADR-0067` d6's amendment: every relation row is bounded from the first fit,
    each with its margin, in one fit with no refit step. Adding R1 (rank symmetry of the king's centralization) as a
    relation row is also his.
  - B-T8's approval (200 + 200) went unused. It carries to the next candidate only if the owner confirms it then.
  - Paths not taken: (i) the re-open now (the owner's, forecast to fire F4 again), (ii) freezing the eg halves (a fit
    chosen on the row) and (iv) moving the row's depth (a bar moved after a miss).
- **Owed elsewhere, not on this page:** `ADR-0056` row E2's status line is `arch-ABC-271`'s. `plans/board.md` is the
  Orchestrator's.
