---
id: ABC-229
title: "Quiescence searches quiet promotions to a queen, bounded, behind an off-door"
status: done
column: Done
closed: "2026-10-30, merged to main at 5953c631; QE PASS_WITH_GAPS (qe-ABC-229, 2afef8bf), which signs UAT"
size: S
priority: P2
epic: EPIC-010
---

# ABC-229: quiet promotions in quiescence

> **CLOSED 2026-10-31, Done, folded by BA/PM** (task `bapm-tranche2-ruling`, records only, at `main` `209f4c5f`;
> nothing run, built or timed). QE's verdict is **PASS_WITH_GAPS** at candidate `e196a281` (code `f6ff1c4a`), base
> `b92a3394` (`qe-ABC-229` `…2afef8bf`, by PREREG `…8ecd4ea6`, sealed before any timed read). It was merged at
> **`5953c631`** on 2026-10-30. **The QE verdict signs UAT** (Test note 2; the owner delegation of 2026-10-22).
>
> - **A1–A5 MET** (QE's table in `…2afef8bf`):
>   - A2 `Q-SET` 55 / 55 (`qe-ABC-229-qset` `…fd9819a5`);
>   - A1 door identity 0 of 114 differ;
>   - A3 1.019× / 1.000× against ≤ 1.2×;
>   - A4: lint, typecheck, build and `npm test` 2 322 / 2 322, 16 / 16 deep lanes, `G1` 54 / 58, `G5` max 4 001 ms,
>     `G9` identical, `G8` H 9.90 s (B 9.90 s), `G6` 8 = 8 and 10 = 10 at 4 000 ms;
>   - A5: S-1..S-4 MET, with D 2/3/5 = 4.5 / 10 and R 9/1/0 = 9.0 / 10 at 4 000 ms, recorded and not pooled
>     (`…cfb537cf`). The smoke-ledger row is folded on `EPIC-010` (`bapm-rpair-level6-cut`).
> - **`EPIC-010` M3's quiet-promotion row reads met at merge:** every `Q-SET` quiet-promotion row reflects the promotion.
>   M3 itself is read on `main` at the epic's close.
> - **The gaps, dispositioned:**
>   - **QE-229-a (MEDIUM, `G8` headroom 0.10 s): answered.** It was cut as `ABC-244` (tranche 1, merged `24b22339`,
>     `G8` head 9.25 s). The lane has since grown back, and tranche 2 is open as `ABC-248` (`ADR-0046` § Addendum
>     2026-10-31 and its § BA/PM ruling).
>   - **QE-229-b (LOW, host/method): recorded, no ticket.** The readings stand under the PREREG (no thermal stop; clock
>     fall ≤ 0.82 %). The wait-clear gates only the start of a run, so a long run's ALONE rests on the Orchestrator's
>     dispatch, as it already does ("STRICTLY ALONE" on the board). Whether QE should also poll for foreign load during
>     a run is a method question for QE's next PREREG. It is not owed here.
>   - **QE-229-c (INFO): closed.** The first R run was VOID and was re-run once, ALONE. The owner said the 17:43 kill
>     was probably his (`orch-2026-10-30a` `…c2752305`, as the board records).
>   - **QE-229-d (INFO, test strength): recorded, no ticket.** QE1 and QE2 are each red in the default lane, on one
>     list-shape row. A2 asks for value rows on `Q-SET` and they pass; no criterion asks a value row to red these
>     plants.

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 1,
> verified by the SA (`…306a4012` row 1d). **Waits in Backlog on:** the ADR shared with `ABC-228`, the owner's Q4, and
> `ABC-228`'s merge (same file).

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** the ADR shared with `ABC-228`, then `ABC-228`'s merge (same file). DoR 8/10 → 9/10.

> **FOLDED 2026-10-30 by BA/PM** (task `bapm-owner-adr-fold`, records only, at `main` `a046e839`). The owner
> **accepted `ADR-0053` as written** (`orch-2026-10-29g` `…3dd61448`). This ticket builds decisions 5–8: queen-only
> quiet promotions from the capture pass, appended, then the one stable `mvvLvaKey` sort, with their own door pair.
> OQ-228-1 ("build it fully"; the "3s to 4s" clause pending the owner) binds `G6` for both tickets (decision 9). The
> ADR is no longer the wait. **The wait is `ABC-228`'s merge.** DoR stays 9/10, and row 10 now names that merge.

> **RE-SCORED 2026-10-30 by BA/PM** (task `bapm-ABC-229-rescore`, records only, at `main` `ee3c7694`; `src/`, `data/`
> and `tools/` untouched). **The wait is met:** `ABC-228` merged at `e42b637b` under OQ-228-1 reading (ii)
> (`qe-ABC-228-ii` `…e39d190c`). **Level 5 is 4 000 ms on `main`** (`LEVELS[5]` = `{ 4000, 0 }`, `DEFAULT_BUDGET_MS`
> = 4 000, `ADR-0053` d10, `ADR-0045` FOLDED), and `ADR-0053` d6's doors can be built with evasions on. **DoR 9/10 →
> 10/10, Ready.** What (ii) changes on this page (dated marks in place):
>
> - **`A3`, `A4` (`G5`, `G6`, `G9`):** both sides of `G6` run at 4 000 ms (each build's own `LEVELS[5]`, both
>   4 000). `G5` reads level 5 at ≤ 4 s and the 5 s ceiling. `G9` reads against `main`'s (ii) values; this ticket has
>   no waiver. **OQ-228-1's answer is spent:** (ii) is on `main`, and `ADR-0053` names no step past 4 000 ms. So a
>   `G6` miss here is not pre-answered. The SE stops and reports, and the Orchestrator takes it to the owner, as
>   `ABC-228` `A9`'s above-133 % stop did. The reference reads 1.019× / 1.000× nodes (`ADR-0053` d9), so a miss is
>   not forecast.
> - **`A5` (the reading):** R plays at 4 000 ms. `tools/rating/rating.ts` already passes `4000` on `main`
>   (`ABC-228`), so this ticket makes no `tools/` change. S-4's bar (≥ 3.0 of 10) is absolute and does not move.
>   **No pooled R score is reported:** the 3 000 ms pool closed at `e42b637b`, and until milestone 1's batch sets the
>   4 000 ms reference, the R row is recorded at 4 000 ms, not pooled, and no flag is evaluable (`EPIC-010` § The smoke
>   ledger). `G11` is reported at 4 s.
> - **No 3 000 ms reference applies.** R(close) 64.75 % and the ≤ 44.75 % trend flag are never compared with this
>   ticket's readings.
> - **Test note 1 corrected:** `ABC-228`'s `Q-SET` freeze covered only its in-check and capture-mate rows (the SE's 12
>   plus QE's 6 and `QE-C4`; `qe-ABC-228` `…06163ef3`). **No quiet-promotion row is frozen yet.** QE freezes ≥ 6
>   before this build, of the kinds `ADR-0053` d9 lists.
> - **The ADR rules where this page is shorter:** `ADR-0053` d5–d8 and d9's `ABC-229` rows bind as written. These
>   are the one-pass spy row, the d5 drift bar (≥ 95 % within 25 cp, none beyond 12 cp), the re-pointed `ABC-228`
>   oracle rows, and the door ladder.
> - **Ordering, not a wait** (§ Dependencies): no production file is shared with `ABC-241`, `ABC-220` or `ABC-243`.
>   `ABC-241` is value-changing, so if it merges first, this ticket's smokes are read on a `main` that carries it.

## Problem

- **User:** the owner at level 5, mostly in endgames.
- **Pain:** `legalCaptures` keeps captures only (`src/legal.ts:90-103`); a capturing promotion is kept, a quiet one is
  not. SA probe Q3 (`8/P6k/8/8/8/8/8/K7 w - - 0 1`): `quiesce` = static = 212, while `chooseMove` sees the promotion
  (1 033). At the horizon, a pawn one step from queening is scored as a pawn.
- **Value:** quiescence sees a free queen at the horizon.

## Scope

1. Quiet promotions **to a queen only** join quiescence's move list, ordered after captures (or as the ADR rules).
2. An `ADR-0026` d10 off-door pair.
3. Bounded by `QUIESCENCE_MAX_PLY` (8).

## Out of scope

- Under-promotions in quiescence. Pawn pushes to the 7th. Anything `ABC-228` carries.

## Acceptance criteria

- **A1 (the door).** As `ABC-228` `A1`: node-equal, cross-build, on the `ABC-078` `A3` corpus (`G4`).
- **A2 (it sees the queen).** **Given** `Q-SET`'s ≥ 6 quiet-promotion rows (probe Q3 among them), **when** `quiesce`
  runs at qply 0 with a full window, **then** every row scores ≥ static + 600 cp where the promotion is safe, and the
  door scores the static eval.
- **A3 (growth).** **Given** `kiwipete` and `position-6` at fixed depth 6, **then** nodes ≤ **1.2 ×** the door's
  (promotions are rare in middlegames; the bar is BA/PM's, tighter than `ABC-228`'s 1.5). Frozen-clock pre-check, then
  `G6`. *(2026-10-30, `bapm-ABC-229-rescore`: `G6` runs both sides at 4 000 ms, each build's own `LEVELS[5]`.)*
- **A4 (gates).** `G1`, `G5`, `G6` "≥ base" (floor 6; a miss is read under the owner's answer to OQ-228-1, as
  `ADR-0053` decision 9 gates both tickets), `G8`, `G9`, `G10`. *(2026-10-30, `bapm-ABC-229-rescore`: OQ-228-1 was
  answered (ii) and is built on `main`. `G5` reads level 5 at ≤ 4 s and the 5 s ceiling. `G6` reads head and base
  both at 4 000 ms, and a miss is not pre-answered: the SE stops and reports, and it goes to the owner. `G9` reads
  `main`'s values, `LEVELS[5]` = `{ 4000, 0 }` included, byte-identical, with no waiver.)*
- **A5 (the reading).** The smoke pair of `EPIC-010` § The merge rule (owner Q4 = (e), extended, 2026-10-29), on the candidate head rebased on `main`, before the merge: S-1 0 faults, S-2 0 losses on time, S-3 D ≥ 3.0 of 10 (else ≥ 7.0 of 20), S-4 R ≥ 3.0 of 10 (else ≥ 7.0 of 20). Reported: each smoke's W/L/D and score, the ledger's pooled R score since the last batch, `G11`.
  *(2026-10-30, `bapm-ABC-229-rescore`: R plays at 4 000 ms, the `rating.ts` literal `ABC-228` merged, with no
  `tools/` change here. The 3 000 ms pool closed at `e42b637b`, so the R row is recorded at 4 000 ms and **not
  pooled**: no pooled score and no flag until milestone 1's batch sets the 4 000 ms reference (`EPIC-010` § The smoke
  ledger). `G11` is reported at 4 s.)*

## NFR triggers

- **`NFR-005`:** `G6`; floor 6 does not move. **`NFR-008`:** fixed-depth rows only. **Security:** none.
  *(2026-10-30, `bapm-ABC-229-rescore`: `NFR-005`'s referent is the default's 4 s from `ABC-228`'s merge. The
  catalog text is Security/NFR's. `NFR-004` (via `G5`): the default's bar is ≤ 4 s, and the 5 s ceiling at levels 1–5
  stays. `NFR-008`: `G8` read 9.61 s against 10 s at `ABC-228`'s gate, 0.39 s of headroom (`…e39d190c`), so new rows
  stay fixed-depth and few.)*

## Test notes

1. ~~`Q-SET`'s promotion rows are frozen with `ABC-228`'s.~~ *(2026-10-30, `bapm-ABC-229-rescore`: they were not.
   `ABC-228`'s freeze held its in-check and capture-mate rows only, `qe-ABC-228` `…06163ef3`.)* QE freezes ≥ 6
   quiet-promotion rows before the build and commits them as a test fixture. They cover `ADR-0053` d9's six kinds:
   Q3 (safe), a controlled square, a check-blocking promotion, an under-promotion-only win (stays unseen), a
   capturing under-promotion (unchanged), and a KPK row.
2. UAT is owed. The QE verdict signs it.

## Size and priority

- **Size: S.** One generator branch and a door, under an ADR already written for `ABC-228`.
- **Priority: P2.** Code-proven gap, cheap.

## Dependencies

- **`ADR-0053` ACCEPTED by the owner, 2026-10-30** (decisions 5–8 are this ticket's).
- **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`). `ABC-228` merged or closed first (shared `src/quiescence.ts`); its D base is its own merge-base.
  *(2026-10-30: if `ABC-228` closes unmerged, this ticket goes back to the Architect before it is pulled. `ADR-0053`
  decision 6 defines its doors with evasions on.)* **MET 2026-10-30:** `ABC-228` merged at `e42b637b`, so the
  closed-unmerged branch is moot.
- **Shared files and order** (2026-10-30, `bapm-ABC-229-rescore`). The predicted file set is `ABC-228`'s
  analogue: `src/legal.ts`, `src/quiescence.ts`, `src/search.ts`, `src/engine.ts`, and the tests that carry the rules
  record or the door lists. It is `UNKNOWN - verify` until the SE greps.
  - **`ABC-241`** (In Review, value-changing): no production file is shared. Its § Out of scope fences
    `src/legal.ts`, `src/search.ts`, `src/quiescence.ts` and `src/transposition.ts`. Its branch also edits
    `src/engine.test.ts`, in another `describe` (the clock-seam pin at about `:907`; this ticket's door list sits at
    about `:500`), so whichever merges second rebases. **Its merge moves the base:** smokes read before it merges go
    stale (`EPIC-010` § The merge rule). Read this ticket's smokes on a `main` that carries `ABC-241`, or read them again.
  - **`ABC-220`** (In Development): no shared file. Its scope is `src/uci-session.ts` and its test only. Its
    `TimeMode` is off by default. Whether its merge stales a level-5 smoke is the Orchestrator's ruling, and none is
    recorded here.
  - **`ABC-243`** (Backlog, test-only: `src/uci-session.test.ts`, `src/transposition.test.ts`): no shared file
    predicted. If a shipped-path value pin in `src/transposition.test.ts` moves here (`ADR-0053` d7's route;
    `UNKNOWN - verify`), whichever merges second rebases.
  - **The host:** this ticket's QE reads (`G6`, `G11`, the smokes) run ALONE, so they queue behind `qe-ABC-241`, which
    is held behind `se-ABC-220`. The Orchestrator schedules them.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ probe Q3 |
| 2 | scope and out-of-scope | ✅ queen only |
| 3 | INVEST | ✅ own mechanism, own reading; S |
| 4 | testable, measurable acceptance | ✅ every row measurable; A5 is the smoke pair (`EPIC-010` § The merge rule, S-1–S-4) |
| 5 | dependencies known | ✅ `ADR-0053` (ACCEPTED 2026-10-30); `ABC-228` merged `e42b637b` under (ii); shared files with `ABC-241`/`ABC-220`/`ABC-243` named (§ Dependencies) |
| 6 | NFR triggers with targets | ✅ nodes ≤ 1.2 ×; floor 6 |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ ~~`ABC-228` merged (shared file; `ADR-0053` d6's doors assume evasions on)~~ met 2026-10-30, `e42b637b`. None left. The `Q-SET` promotion freeze is QE's pre-build step (Test note 1). A `G6` miss at 4 000 ms is a named stop (`A4`) |

**DoR 10/10 (re-scored 2026-10-30, `bapm-ABC-229-rescore`). Ready.** *(Was 9/10, `bapm-owner-adr-fold`, waiting on
`ABC-228`'s merge.)* The board move `Backlog → Ready` is the Orchestrator's to make on the board.
