---
id: ABC-239
title: "The evaluation's weights are tuned offline by a stated method on a licensed position set, emitted as constants, and validated against an outside opponent"
status: backlog
column: Backlog
size: L
priority: P3
epic: EPIC-011
adr: "ADR-0067 (PROPOSED 2026-11-03, arch-ABC-239 decision …e4c34239, results …48ae6a93, PREREG …9ed1db11; acceptance is the owner's, PENDING). Data: ADR-0048 (licence) with Q-3K-7 (a)/(b)/(c) PENDING; own games by default. Waits ABC-269 → ABC-274 (E2-pre)"
---

# ABC-239: offline tuning of the evaluation weights

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
- **A5 (gates).** `G1`, `G5`, `G6` "≥ base" (floor 6), `G8`, `G9`, `G10`.
  *2026-11-03 (`bapm-E2pre-cut`, `ADR-0067`):* read as **B-T5** (`ADR-0050` d9's zugzwang rows 7 / 7 at their depths; mate floor 0 violations in
  `ADR-0064` B2's form; `G1` ≥ 54 / 58 with no NEWLY-MISSED line; `ADR-0061`'s futility audit, flips ≤ 0.5 % and 0
  flips ≥ 200 cp) and **B-T6** (`G6` under `Q-3K-4` = (b), as a value-changing evaluation ticket: `LEVELS[5]`, ≥ 5
  interleaved rounds, every run at depth ≥ 6 (FAIL below), depth 7 a WARN, the median against base reported, not
  graded). `G5`, `G8`, `G9` and `G10` stay as listed.
- **A6 (the reading).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the smoke pair and the 200 + 200 R pair at 4 000 ms that this row named.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time at the 50 ms margin, and the score meets `ADR-0056` C2′ (merged `94f1504c`): ≥ 50.0 of 100 for a GAIN, ≥ 43.0 for a NEUTRAL, the intent declared at design. A miss is NOT MET and is not re-played. *(2026-11-01, `bapm-owner-answers`, the owner's answers 1 and 3: the epic read is now 400 games head-to-head, so it is no longer an outside check, and the pair this row named has no epic shape left to borrow.)* **And the Stockfish smoke beside it:** 10 games, the candidate at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`, through `ABC-255` (`EPIC-011` § The per-change rule): 10 of 10 complete, 0 faults, 0 losses on time, and S-4 at ~~E 1 650~~ *E 1 810 (2026-11-02, `bapm-records-1102c`; `ADR-0056` S′ amendment)*: ≥ 3.0 of 10, below that 10 more games and ≥ 7.0 of 20 (`ADR-0056` S′; `skytalix` `timemargin` 50 ms; ~~`r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`~~ `r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`) *(was the fold's bar, `UNKNOWN - verify`; merged `a0f9297e`, `bapm-reconcile-adr0056`)*. *(2026-11-01, `bapm-reconcile-adr0056`, `ADR-0056` R-TC part 2: the owner's "works on different difficulty settings".)* **And the Levels deep lane on the candidate head:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, QE, host alone, beside the 100-game read (≈ 9 min): exit 0 with every test passed (41 at `ADR-0056`'s count; QE counts its own run). A failure is a defect, back to the Software Engineer. **And an outside read before the merge, asked of the owner first** (a tuned set judged by self-play alone repeats `EPIC-008`'s failure, `RISK-EPIC010-05`): the interleaved pair (`rpair`), the candidate head against its merge-base, each 200 games against Stockfish 19 `UCI_LimitStrength` at the 0.5 s smoke control (`ABC-255`), one game at a time; MET when the pair's point estimate is ≥ 0 (C3′'s decision rule, kept for this owner-asked pair; *2026-11-01, `bapm-reconcile-adr0056`: the merged fold, `a0f9297e`, supersedes C3′ only as the epic read, by C3″*); *(`bapm-reconcile-adr0056`: the fold gives the 0.5 s control to `r` alone (`--budget-ms 500`) and leaves `rpair` unchanged, so on the owner's yes this pair is two `r <build> <out> --budget-ms 500 --rounds 100 --concurrency 1` reads, the candidate then its merge-base, not interleaved, unless a harness ticket gives `rpair` the control first; which one is the Orchestrator's, `UNKNOWN - verify`)*; about ± 58–78 Elo (C3′'s figure for a 200 + 200 pair). Estimated ≈ 5 h (BA/PM arithmetic: ≈ 85 plies a game at 0.5 s a side; not a reading), over 1 h, so **it is asked of the owner before it starts**; if he declines, this ticket merges on the 100-game read and the smoke, and `RISK-EPIC010-05` stays open for it (no outside read with resolution follows at the epic's close). Reported: W/L/D, score and Elo ± error of each read, the pair's X ± Y, `G11`.
  *2026-11-03 (`bapm-E2pre-cut`, `ADR-0067`):* this row is B-T7 (the 100-game read, intent **GAIN**, S′ at E 1 810, the Levels deep lane) and **B-T8**
  (the outside pair, point estimate ≥ 0). **B-T8 was put to the owner 2026-11-03 (board): PENDING**, and the Architect
  recommends yes. A6's read and the merge also wait on *"accept ADR-0067"* (PENDING). F6: **no set is ever re-fitted on
  play results**, and the configuration and λ are never chosen on play.

## NFR triggers

- **`NFR-008`:** the tool's tests outside the default lane. **`G2`:** A4. **Security:** the tool reads local files
  only; no network fetch at run time.
- *2026-11-03 (`bapm-E2pre-cut`, `ADR-0067`):* `NFR-008`: `vitest run tools/tune`, outside the default lane (identity gate on a fixture, determinism,
  split disjointness, emission round-trip). `G2` ≤ 1.02 × after `ABC-274`. `NFR-005`: B-T6. `NFR-009`: unchanged (no
  memory added). Security: every PGN comment is ignored on read, and the Lichess file, on a yes, stays outside the
  repository with its URL and sha256 recorded. No new NFR row.

## Test notes

1. ~~The fit is reproducible from a seed; the seed and the set's hash are recorded.~~ *2026-11-03 (`bapm-E2pre-cut`, `ADR-0067`):* the fit has no random
   number generator (full batch, fixed order; d4). The **data manifest's sha256** (over repository-relative paths and
   file hashes) and the **split strings** ("ABC-239/split/v1", "ABC-239/inner/v1") are recorded in the provenance
   header and the PR. Two runs give one file (B-T3).
2. UAT is owed. The QE verdict signs it.

## Size and priority

- **Size: L.** A tool, a data set and its licence, a fit, a validation. Not split: each part alone ships nothing
  measurable. If design shows more than one new tool module, BA/PM splits the data set into its own ticket from the
  pool. *2026-11-03 (`bapm-E2pre-cut`): `ADR-0067` d10 has one tool module, so the split does not fire. The blend change
  is cut apart as `ABC-274` (S), a `src/` ticket, not a tool module. Effort (`…e4c34239` § 6): the tool ≈ 800–1 000
  lines of TypeScript with tests; one fit takes minutes; the reads ≈ 0.7 h plus `G6` and the futility audit; B-T8 adds ≈
  5 h if asked.*
- **Priority: P3.**

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

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 8b |
| 2 | scope and out-of-scope | ✅ constants only |
| 3 | INVEST | ⚠ L; depends on milestone 2 *2026-11-03 (`bapm-E2pre-cut`): L; depends on `ABC-269` and `ABC-274`; one tool module (the split rule does not fire)* |
| 4 | testable, measurable acceptance | ✅ every row measurable; A6 is the 100-game read plus, on the owner's yes, the 400-game outside pair (pass lines: `ADR-0056` C2′ and C3′) *(2026-11-01)* *2026-11-01 (`bapm-owner-answers`): plus the 0.5 s smoke; the outside pair is at 0.5 s and graded by C3′'s point-estimate rule; the smoke's bar is the owner-answers fold's, scored as the C2′ line was while pending.* *2026-11-01 (`bapm-reconcile-adr0056`): the fold merged (`a0f9297e`); the smoke's bar is S′'s S-4 at ~~E 1 650~~ E 1 810 (2026-11-02, `bapm-records-1102c`), the row adds the Levels deep lane (exit 0, every test passed), and the outside pair is two `r` reads unless `rpair` gains the control. Score unchanged.* |
| 5 | dependencies known | ✅ *2026-11-03 (`bapm-E2pre-cut`): `ABC-269` → `ABC-274` → this; `ADR-0067` (PROPOSED; acceptance pending); Q-3K-7 (a)/(b)/(c) pending; B-T8 pending* |
| 6 | NFR triggers with targets | ✅ `G2` ≤ 1.02 × *(after `ABC-274`; `NFR-005` floor 6 by B-T6; `NFR-008` out of the default lane)* |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ L |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ ~~data licence; ADR; milestone 2~~ *2026-11-03 (`bapm-E2pre-cut`): method ADR → **`ADR-0067` PROPOSED** (reading (b): the build may start; A6's read and the merge wait on acceptance, PENDING); data → **Q-3K-7** (a)/(b)/(c) PENDING, own games allowed by default under `ADR-0048`, so it does not block the build; milestone 2 → **`ABC-269` and `ABC-274` not merged** (the blocker)* |

**DoR 8/10 (re-scored 2026-10-29). Backlog.** *2026-11-03 (`bapm-E2pre-cut`): **8/10, unchanged.** Row 10 now waits on
`ABC-269` and `ABC-274` merging; the owner items are pending and gate A6's read and the merge only.*
