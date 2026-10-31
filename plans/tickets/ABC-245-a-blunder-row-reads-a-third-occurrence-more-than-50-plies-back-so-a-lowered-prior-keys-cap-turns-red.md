---
id: ABC-245
title: "A blunder-level row reads a third occurrence whose earlier occurrences lie more than 50 plies back, so lowering the 100-key cap turns the lane red; the `src/levels.test.ts` header count is corrected (test-only)"
status: ready
column: Ready
size: XS
priority: P3
epic: EPIC-010
---

# ABC-245: pin `ABC-242`'s 100-key cap with one far-repeat row (QE-242-b)

> **Cut 2026-10-31 by BA/PM** (task `bapm-ABC-242-close`, records only, at `main` `d58f2d77`; nothing run). Source:
> QE gap **QE-242-b** (LOW, a regression gap) in `qe-ABC-242` `…b9f3cd67` and the plants note `…93eb0bf9`, plus
> SE-242-f (INFO) in `se-ABC-242` `…c0e5e0fa`. `ABC-242` met its acceptance as worded and is Done (`af5b2b49`). This is
> a lane gap, not a build fault. **Waits in Backlog on one thing: the Architect's QE-242-a ruling** (§ Dependencies).

> **RE-SCORED 2026-10-31 by BA/PM** (task `bapm-ABC-245-rescore`, records only, at `main` `caf96441`; nothing run or
> timed, because an SE shares the host; `src/`, `tools/` and `data/` untouched). **The wait is met:** `ADR-0046`
> § Ruling 2026-10-31 (`arch-qe242a-ruling`, commit `1b142ea0`, merged `10492743`) rules that `ABC-244`'s condition 2
> reads a blunder **per level call**: its one budget and its one shared deadline (`ADR-0032` d1). **DoR 9/10 → 10/10,
> Ready.** The board move is the Orchestrator's. What the ruling changes on this page (dated marks in place):
>
> - **The step (§ NFR triggers).** Level 1's 100 ms at step 10 is 10 intervals per level call, which is ≥ 2. At step 100
>   it is 1, so step 10 is the coarsest step condition 2 admits. The row takes step 10 if it keeps A1, A3 and A2's kill
>   set {Q6, Q8} there. Otherwise it takes step 1, and the SE reports the lane cost before going on.
> - **The ruling's limit does not fire on this row as worded.** The row asserts no child search's depth. Its property
>   under test, the far-repeat move's 0, is set by `ABC-242`'s check at the blunder's root, before any child, and that
>   check reads no clock (`src/levels.ts` `blunder`, byte-identical from `d58f2d77` to `caf96441`). The child-search
>   count (legal − 1) is counted by the level call, not inside a child. **A3's base score is computed inside a child
>   search**, so A3 is read at the row's own budget and step, against the head reading, as `ABC-242` A1 was read in
>   the form the ruling admitted. **The limit fires if the row** asserts a child's depth, or asserts any in-child value
>   (another root move's score, or base's far-repeat score) other than as a comparison with a reference run at the
>   same step. That value is then read per child, which admits only step 1.
> - **R1 census line (Test note 3).** One line for the one row: title, budget, step, and reads **per level call**,
>   labelled as such. A per-child figure, if given, is the budget each child was actually handed, as read, never the
>   nominal slice.
> - **Estimate.** At step 10, under +0.05 s: `ABC-242`'s ten rows summed 0.085 s in-thread at step 10 (`se-ABC-242`
>   `…712a6bb4`). `UNKNOWN - verify` until `G8` reads it.

## Problem

- **User:** the SE or QE who next edits `src/levels.ts` `blunder`, and the owner playing levels 1–4.
- **Pain:** `ABC-242`'s check walks the child's prior keys at `−4, −6, …`, bounded by `min(child clock, list length,
  PRIOR_KEYS_WINDOW)`, where `PRIOR_KEYS_WINDOW = 100` (`src/levels.ts:160`, `ADR-0054` § amendment). QE's plants
  **Q6 (cap 8) and Q8 (cap 50) survive every lane row**. Every `ABC-242` fixture has a 7-ply history, with its two
  matches at −4 and −8, so no row reads past −8.
- **Why it matters:** a third occurrence whose earlier occurrences lie further back is game-reachable. A 6-ply
  cycle already reads −6 and −12, which a cap of 8 misses. A lowered cap would silently stop the level from seeing
  that repeat, and the default lane would stay green.
- **Evidence:** QE's synthetic X2 (matches at −98 and −100) kills both plants. A post-hoc run of QE's differential
  sweep read 0 FAIL against a cap-50 copy and 280 FAIL against a cap-6 copy
  (`qe-ABC-242/raw/oracle/posthoc-oracle-cap{6,50}.txt`).
- **Value:** the ADR's 100 bound is held by a row, not by memory. Cost: one row in one test file.

## Scope

1. **One far-repeat row** in `src/levels.test.ts`. On a forced blunder at level 1, one legal root move makes a third
   occurrence whose **two** earlier occurrences both lie **more than 50 plies** before the child position, inside the
   child's halfmove clock and inside the 100 trimmed prior keys plus the root key a production caller hands in.
2. **The header count.** The `src/levels.test.ts` header line "DEFAULT (`npm test`, 19 tests)" (line 15) has been
   stale since before `ABC-242` (SE-242-f). It is corrected to the file's default-lane test count as the run reports
   it, or the number is dropped from the line.

## Out of scope

- Any change under `src/` other than `src/levels.test.ts`. `src/levels.ts` and `PRIOR_KEYS_WINDOW` do not change.
- Any `ABC-242` row: it is not edited. The cap's **removal** (Q7) is equivalent for every trimmed caller (QE and the
  SE agree), so no row is owed for it.
- Q18 (the check spends a clock read): unpinned by `ABC-242`'s design, INFO.
- QE-242-a itself (the step form of the blunder rows): the Architect's (`arch-qe242a-ruling`).

## Acceptance criteria

- **A1 (the far repeat scores 0).** **Given** the Scope 1 fixture, handed to the level as a production caller hands
  it (trimmed prior keys plus the root key, ≤ 101 keys), **when** the blunder path scores the root moves, **then** the
  far-repeat move scores **exactly 0**, and the number of child searches is the number of legal moves minus 1. The
  row asserts that both earlier occurrences lie more than 50 plies back and within the child's halfmove clock.
- **A2 (it kills the cap plants).** **Given** QE's plants Q6 (`PRIOR_KEYS_WINDOW` 100 → 8) and Q8 (100 → 50), each
  applied alone, **then** the A1 row turns red under each. At 100 it is green. Read once by the SE out of tree and
  re-read by QE; the plants are never committed.
- **A3 (base reads it otherwise).** **Given** the same fixture on `ABC-242`'s base tree `4387d4e8` (read out of
  tree) or the SE's test-local `base()`, **then** the far-repeat move's score is not 0, as in `ABC-242` A1.
  *(If base already scores it 0 from inside the child search, as SE-242-b describes for a plain 2-cycle, the fixture is
  re-chosen until it does not: the loser's repeat, or an asymmetric shuttle.)*
  *(2026-10-31, `bapm-ABC-245-rescore`: base's far-repeat score is computed inside a child search, so A3 is read at
  the row's own budget (100 ms) and step, against the head reading at the same step, as `ABC-242` A1 was. If A3 holds
  only at another step, the fixture is re-chosen first. The step moves to 1 only if no fixture holds at step 10.)*
- **A4 (the header).** The `src/levels.test.ts` header's default-lane count equals the count the run reports for that
  file, or the line carries no count.
- **A5 (gates).** lint, typecheck and build exit 0. `npm test` green with 0 skips and skip-integrity clean. The
  `ABC-242` and `ABC-230` rows pass unedited. `G8` ≤ 10 s.

## NFR triggers

- **`NFR-008`:** a fixed-seed, virtual-clock row; 0 real-clock rows. The default lane stays **≤ 10 s**. `G8` read
  9.41 s at `ABC-242` (QE), so the headroom is 0.59 s. If the head median reads > 9.6 s, `ABC-244`'s tranche-2 trigger
  fires.
  - The row follows `ADR-0046` § Addendum R1–R4: an R1 census line (title, budget, step, reads per search); level
    1's own 100 ms; the coarsest step in {1, 10, 100, 1 000} that keeps its assertions and its kill set; not QE's
    probe set-up (R4).
  - ~~**How `ABC-244`'s condition 2 reads a blunder** (per level call, or per child search) is QE-242-a, pending with
    the Architect. The row's step follows that ruling.~~ Estimate: under +0.05 s at step 10; at step 1 about a tenth of
    the +2.5 s QE read for `ABC-242`'s ten rows, `UNKNOWN - verify` until `G8` reads it.
  - *(2026-10-31, `bapm-ABC-245-rescore`: ruled in `ADR-0046` § Ruling 2026-10-31, merged `10492743`.)* **Condition 2
    reads this row per level call:** level 1's 100 ms is 10 intervals at step 10 and 1 at step 100, so **the row's step
    is 10**, or 1 if step 10 loses A1, A3 or a plant of A2. The ruling's limit applies: if the row asserts a child
    search's depth, or an in-child value that is not compared with a reference run at the same step, that read is
    counted per child and only step 1 is admitted. A3 is read at the row's own budget and step.
- **`NFR-004` / `G5` / `NFR-009`:** no production line changes, so none moves.
- **Security (ASVS L1):** no input path.

## Test notes

1. The fixture is the SE's to build. A legal reversible move list from a FEN is preferred, because QE called the far
   repeat game-reachable. A synthetic key list like QE's X2 is acceptable only if it is a list a production caller
   could hand (`≤ 101` keys). Whether `src/gameend.ts` would end such a game earlier (the 50-move rule) is
   `UNKNOWN - verify`; the level is called on the position either way, as `ABC-242`'s rows are.
2. QE re-runs Q6 and Q8 (A2) and reads `G8`. No production line: no UAT. S2 with no smoke (levels 1–4 are not played
   by `tools/rating/rating.ts`, as `ABC-242` A8).
3. *(2026-10-31, `bapm-ABC-245-rescore`; `ADR-0046` § Addendum R1 and § Ruling 2026-10-31.)* **The R1 census line.**
   The build note carries one line for the row: title, budget (level 1's 100 ms), step, and reads **per level call**
   (⌈100 ÷ step⌉: 10 at step 10), labelled "per level call". A per-child figure, if the line gives one, is the budget
   each child was actually handed, as read, never the nominal slice. The line also says whether A2's kill set and A3
   hold at the chosen step.

## Size and priority

- **Size: XS.** One row and one comment line in one test file.
- **Priority: P3.** It guards a bound nothing in flight touches. Not in milestone 1, and the batch plays level 5
  only.

## Dependencies

- **`ABC-242` Done** (`af5b2b49`).
- **The QE-242-a ruling** (`arch-qe242a-ruling`, claimed 2026-10-31). It sets how condition 2 reads a blunder row,
  and so the step this row takes. When it lands, BA/PM re-scores row 10 of the DoR. *(2026-10-31,
  `bapm-ABC-245-rescore`: **landed**, `ADR-0046` § Ruling 2026-10-31, commit `1b142ea0`, merged `10492743`. Per level
  call, so step 10. Row 10 re-scored ✅.)*
- **Shared file:** `src/levels.test.ts` only. `ABC-221` (In Development, `se-ABC-221`) names `src/uci-session.ts`,
  its test and `src/engine.ts` on its page, not this file. Its actual diff is `UNKNOWN - verify` at the pull.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ Q6 and Q8 survive the lane; QE's X2 kills both |
| 2 | scope and out-of-scope | ✅ 2 items; `src/levels.ts` and the `ABC-242` rows untouched; Q7 and Q18 out |
| 3 | INVEST | ✅ one row; XS; testable by the plants |
| 4 | testable, measurable acceptance | ✅ A1 exactly 0 and legal − 1 child searches, both matches > 50 plies back; A2 red under Q6 and Q8, green at 100; A3 ≠ 0 on base; A4 count equal; A5 gates, `G8` ≤ 10 s |
| 5 | dependencies known | ✅ `ABC-242` Done; the QE-242-a ruling. *2026-10-31:* ruling landed (`10492743`) |
| 6 | NFR triggers with targets | ✅ 0 real-clock rows; R1–R4; `G8` ≤ 10 s, tranche 2 at 9.6 s. *2026-10-31:* condition 2 per level call, step 10 (1 if step 10 loses A1, A3 or a plant); R1 census line per level call owed in the build note; est. < +0.05 s |
| 7 | test notes | ✅ 2. *2026-10-31:* 3 (the R1 line) |
| 8 | size | ✅ XS |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ✅ *2026-10-31:* the QE-242-a ruling landed (`ADR-0046` § Ruling 2026-10-31, `10492743`): per level call, step 10 admitted; the limit does not fire on this row as worded. `ABC-221`'s actual diff against `src/levels.test.ts` is checked at the pull (§ Dependencies), an order check, not a wait |

~~**DoR 9/10 (2026-10-31, `bapm-ABC-242-close`). Backlog.** It goes to Ready when the QE-242-a ruling lands.~~

**DoR 10/10 (2026-10-31, `bapm-ABC-245-rescore`). Ready.** The board move is the Orchestrator's.
