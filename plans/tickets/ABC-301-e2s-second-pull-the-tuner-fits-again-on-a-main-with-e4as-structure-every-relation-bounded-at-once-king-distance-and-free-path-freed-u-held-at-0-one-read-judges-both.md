---
id: ABC-301
title: "E2's second pull: the tuner fits again on a main with E4a's structure. Every relation is bounded at once (ADR-0067 d6 amendment: one fit, no refit). King distance and free path are freed (eg ≥ 0, mg 0), and U is held at 0. Four preconditions first (QE-271-h, -g, -i, -f). One read judges both E2 and E4a (B-T7, B-T8)"
status: ready
column: Ready
size: L
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0067 (ACCEPTED 2026-11-03, in force as the method; the d6 amendment ADOPTED 2026-11-04 and B-T8 re-confirmed for this pull by the owner's word, orch-2026-10-30a …dda43b71, '1. yes; 2. yes'; lines arch-second-pull-1104 …4917f0f7) and ADR-0070 (ACCEPTED 2026-11-04 in form (a), structure only; in force since ABC-271 merged 872e5ffc; d7: this pull fits king distance and free path and holds U at 0; one read judges both)"
---

# ABC-301: E2's second pull, one bounded fit over E4a's structure, one read

> **P1'S ROW FORM, PROVISIONAL UNTIL `qe-ABC-301-s0` READS IT; TEST NOTE 4 GAINS TWO PINS AT SCOPE 4, 2026-11-04, by
> BA/PM** (task `bapm-lines-1104b`, records only, at `main` `732a0cea`; nothing run). Sources: the Orchestrator's ruling
> `orch-2026-10-30a` `…878035ca` items 1, 3 and 5, and `se-ABC-301-s0` `…8fb36960`, `…534a582c`.
> - **P1:** the written row reads 31 / 44 on the build. The row built runs each fixture at its own phase and reads
>   44 / 44. This corrects the row's specification; the bar stays exact on 44 of 44. **Provisional:** because it changes
>   a row after a red, QE confirms or rejects it before the fit. A rejection is a STOP. Scopes 1–4 follow the confirmation.
> - **Test note 4:** the two `ABC-271` "every half 0" rows are pins of the value-0 table, handled at scope 4.
> - **Not written here:** `ADR-0070` d4's dated line and `ADR-0067`'s precondition still spell the written form.
> - No bar level, size or priority moves. **DoR 10/10, unchanged.** The column move is the Orchestrator's.

> **A DEFAULT-LANE BUDGET OF ≤ +0.1 s; SCOPE 0 BUILDS AFTER `ABC-302` MERGES; THE `NFR-008` HEADROOM IS NOW KNOWN,
> 2026-11-04, by BA/PM** (task `bapm-ABC-302-cut`, records only, at `main` `9ee778b9`; nothing run). Sources: the
> Orchestrator's ruling `orch-2026-10-30a` `…112cd856` items 2 and 3, and Security/NFR `secnfr-nfr008-1104`
> `…1184fec4` (`NFR-008` MET at 9.84 s graded, 0.16 s headroom; `R-N8H-1` MEDIUM).
> - **Budget:** the default-lane delta is ≤ +0.10 s. No new test file goes in the default lane. Any default-lane row
>   of ≥ 50 ms goes to its file's deep lane (§ NFR triggers, dated line).
> - **Order:** scope 0 builds after `ABC-302` (the headroom ticket) merges (§ Dependencies). § Open item 3 is answered.
> - No bar, row, size or priority moves. **DoR 10/10, unchanged.** The column move is the Orchestrator's.

> **Cut 2026-11-04 by BA/PM: DoR 10/10, Ready** (task `bapm-ABC-301-cut`, records only, at `main` `d7cd6871`;
> nothing run). Source: the Architect's owed lines `arch-second-pull-1104` `…4917f0f7` § 5, written here as given,
> with § 1–4 of the same note and `ADR-0067`'s dated line of 2026-11-04 under its bars table. **No bar is added or
> loosened.** Where the note is silent, this page says so (§ Open, not bars). The id `ABC-301` was checked free on
> every local branch at the cut.
> - **It is a new attempt under `ADR-0067` F6,** with its own PREREG. `ABC-239`'s first pull closed NOT MET
>   (`…4c76bf7a`). This page does not re-open it; it carries `ABC-239`'s bars by reference.
> - **Kept apart from any bundle** (`arch-second-pull-1104` `…a5d74f70`): its scope is owner-confirmed as it stands.
> - **The column moves are the Orchestrator's.** The front matter reads Ready, the BA/PM exit.

## Problem

- **User:** the owner at level 5, and every later read of this epic.
- **Pain:** `main`'s evaluation weights are rule-made (E1, `ADR-0064`). The first pull (`ABC-239`) fitted a set that
  beat E1 offline (B-T2 0.9905 ×), and it closed NOT MET on two rows:
  - **F3:** pawns A2 read 53 against ≤ 50. It was green by less than its margin on the box-only fit, so the
    one-refit procedure did not bound it, and the refit moved it.
  - **F4:** `zugzwang.001` played e1e5 at depths 9–11. The cause was joint, in the fitted endgame halves, and the
    passer part needed free-path and king-distance features the engine lacked (`arch-ABC-239-f3f4` `…4eae0fd3`).
- **What changed since:** E4a's three terms are on `main` as structure at 0 (`ABC-271`, merged `872e5ffc`). The
  owner adopted the d6 amendment, so every relation row is bounded from the first fit and the F3 path above cannot
  recur (`…dda43b71` item 1).
- **Value:** fitted weights, E4a's included, judged on play. **One read judges both E2 and E4a's values**
  (`ADR-0070` d7). Whether a fit over E4a keeps `zugzwang.001` at e1f1 is `UNKNOWN - verify` until the fit runs.
- **Intent: GAIN** (C2′ ≥ 50.0 of 100), named before any read and never re-classed after a score.

## Scope

0. **Four preconditions, each met and read green before the fit is taken** (`ADR-0067`'s dated line):
   1. **`QE-271-h`, the hot-path row** (`ADR-0070` d4's dated line). Test-only, default lane.
   2. **`QE-271-g`, the caller-guard row for `pawnStructureForTest`.** Same Software Engineer hop.
   3. **`QE-271-i`:** `tools/tune`'s emitter writes the four E4a exports (`PASSED_KING_ENEMY`, `PASSED_KING_OWN`,
      `PASSED_FREE`, `PASSED_UNSTOPPABLE`) in the file's present shape, so **13 exports become 17**, with U written
      at its held 0. The tracer traces E4a's features (`ADR-0067` d5's line of 2026-11-04), with its tracer row.
   4. **`QE-271-f`, the endgame `G2` row**, written into the PREREG (B-T4 below).
1. **The `tools/tune` changes above, plus the bound-set enumeration:** every relation row's FEN as a constant, and a
   source row that checks each FEN appears literally in its test file.
2. **The PREREG, sealed first.** It lists the bound set and its count, the free set, the data and player names, the
   base SHA, the bars and the endgame `G2` row.
3. **One fit and the emission of `src/evaluate-params.ts`.** The free set is `ADR-0067` d6 with its dated lines: the
   first pull's set, the queen-on mg pairs (`ABC-270`), and E4a's king distance and free path (eg ≥ 0, mg 0), with U
   held at 0. The C-S / C-F rule re-runs on this pull's data. The data is d9's rule and § Addendum's pin at the fit
   commit.
4. **B-T4's re-pins, old → new, in one PR table**, plus the rows retired at `ABC-239`, which now retire here (none
   retired there, because it did not merge).
5. **The reads** (B-T5–B-T8).

## Out of scope

- U freed or given a value (`ADR-0070` d7: a later attempt with its own PREREG).
- E4a's middlegame halves (held at 0 at every pull, `ADR-0070` d1).
- Material (frozen).
- R1, the king's rank symmetry, unless the PREREG adds it before the fit.
- Any `src/` change beyond `src/evaluate-params.ts`, the B-T4 re-pins and the replacement provenance row.
- `ABC-272` (E7a): it goes one at a time on the evaluation files.
- F2's named cost cut (`ADR-0070` d3): a possible value-identical speed ticket of its own, not a precondition.
- Any bundle (`…a5d74f70`).

## Acceptance criteria

The bars are `ADR-0067` B-T0–B-T8 **by reference, at their levels** (its bars table and the dated line of
2026-11-04 under it). They are not loosened after Ready. This section names what is new for this pull and makes each
precondition measurable.

- **P1 (`QE-271-h`).** **Given** QE's 44 frozen fixtures (`qe-ABC-271` `…d0f7af61`), **when** each is evaluated
  inside `withParametersForTest` at `ADR-0070` d1's probed values, **then** the white-POV `evaluateAtPhase(p, 0)`
  minus the same at the shipped values equals the seam's white (king distance + free + unstoppable) minus its black,
  **exactly, on 44 / 44**. It kills mutants E14–E16. A unit row, no search, default lane.
  - *2026-11-04 (`bapm-lines-1104b`; `…878035ca` 1): **the row's form, PROVISIONAL until `qe-ABC-301-s0` reads it.** The
    sentence above stands until then; QE's confirmation replaces its equation with this one, and a rejection is a STOP.
    As written it reads **31 / 44** on the build, all 13 misses exactly ± 400, on fixtures of phase 1–5: U fires on the
    phase argument, and the seam reads `phaseOf`. **The form:** each fixture runs at its own phase k, white POV, and
    `evaluateAtPhase(p, k)` at the probed values equals mg + trunc((D + e) × (24 − k) / 24), **exactly, on 44 / 44**. mg
    is `evaluateAtPhase(p, 24)` and D is `evaluateAtPhase(p, 0)` − mg, both at the shipped values. e is the seam's white
    minus black at the probed values, minus the same at the shipped values. At k = 0 this is the written equation. It
    kills E14–E16 and H1 (a hot path that passes phase 0). The bar is not loosened: no tolerance, 44 of 44.*
- **P2 (`QE-271-g`).** **Given** the source row that holds `passerTermsForTest` to test files, **then** it also
  names `pawnStructureForTest`, and it finds **0 callers** of either in any non-test file under `src/`, any `tools/`
  file or any script.
- **P3 (`QE-271-i`).** **Given** `main`'s table as the base values, **when** the emitter writes it, **then** the file
  has **17 exports**, equal to `main`'s **value for value** (U at 0), and `npm run typecheck` passes on it. B-T1 holds
  at the base values with E4a's features traced: **0 misses**.
- **P4 (`QE-271-f`).** **Given** the sealed PREREG, **then** it names the endgame `G2` row: the set, the level and the
  instrument, as in B-T4 below.
- **F3's new form, the procedure** (`ADR-0067` d6's amendment; it replaces "a bound and one refit" and the old steps
  1–4):
  1. The bound set is listed in the PREREG **before any fit**: every relation row of `src/evaluate*.test.ts` (file,
     row, a's non-zero terms, right side) and the count. E4a's weights enter each row's a by d6's rule of
     2026-11-04. Each row carries ruling (b)'s margin (½ ‖a‖₁, plus 1 per position with 0 < w < 24, plus 1 for a
     strict sign).
  2. **One fit** with box, sign and relation bounds. Its emission is the candidate. There is no box-only scratch fit.
  3. The relation rows run on the emission. **A red relation is a defect** (as F1), fixed in the tool; the same
     procedure re-runs on the fixed tool.
  4. **Infeasible: STOP** to Architect/Design. No row is dropped.
  5. The gates follow in their written order, unchanged.
- **B-T4 gains one graded row, the endgame `G2`:** on `qe-ABC-271`'s endgame report set (six positions, phases 3–8,
  each with a passer), the candidate's `evaluateAtPhase` per call **≤ 1.02 ×** the pull's base, read with the A5
  instrument (two sessions in reverse order, a `main`-copy control; `ADR-0067` d8). Expected about 1.00: the diff is
  constants only, and E4a's loop does the same work at any value. **Reported, not graded:** ns per node in search on
  the same six at depth 9. E4a's own 1.12 × is on `main`, accepted under `ADR-0070` K3, and is not graded again.
- **The rest of B-T4–B-T7, unchanged:** the `src/` diff as in § Scope; `G3` mirror; `G2` ≤ 1.02 × on its own six
  roots; pins re-pinned old → new under B-T4's rule, and never a zugzwang depth, the mate floor, `G1`, the identity
  gate or a relation row. B-T5: zugzwang 7 / 7 at their depths (`zugzwang.001` e1f1 at depth 9), mate floor 0, `G1` ≥
  54 / 58 with none newly missed, the futility audit (flips ≤ 0.5 %, 0 ≥ 200 cp). B-T6: every `G6` run at depth ≥ 6
  at `LEVELS[5]`. B-T7: C2′ 100 games at 100 ms against `main` at the candidate freeze, **GAIN ≥ 50.0**, never
  re-played; S′ at E 1 810; the Levels deep lane exit 0.
- **B-T8, re-confirmed** (`…dda43b71` item 2): the candidate and its merge-base, each 200 games at 0.5 s against
  Stockfish 19 (about 5 h, before the merge); **MET on a point estimate ≥ 0**. His approval covers this run over 1 h.
  The harness form is § Open item 1.
- **Falsifiers:** `ADR-0067` F1–F8, with F3 restated as above. **`ADR-0070` F4:** each E4a eg half the fit leaves at
  its 0 bound is recorded as dead weight. **`ADR-0070` F5:** a NOT MET read means not merged; the structure stays,
  value-identical; nothing is re-fitted on play.
- **Disposition:** B-T0–B-T8 all MET → merge. Any NOT MET → not merged (§ What happens on a miss).
- **Standing gates:** lint, typecheck, unit and build (`quality.mandatory_gates`), the QE hop, and merge on green.

## What happens on a miss

- **A precondition red (P1–P4):** a defect for the Software Engineer. The fit is not taken until all four are green.
- **A non-linear relation row at PREREG step 1, or an infeasible bound set:** a STOP to Architect/Design.
- **A relation red on the emission:** a defect (F3's new form). It is fixed in the tool and the procedure re-runs.
- **The four data-stage stops** (`ADR-0067` § Addendum; `ABC-239` § What happens on a miss): a STOP each, not a bar.
- **B-T5 (F4), `zugzwang.001` included:** a defect check first (the identity gate on the emitted file, B-T3). If the
  miss is real: NOT MET. Never a re-pin, a deeper depth or a refit on play.
- **B-T7 or B-T8 below its bar:** NOT MET (`ADR-0067` F6, `ADR-0070` F5). Not merged and not re-played; QE records a
  `failed-attempt`. A new attempt is a new data set or free set under a new PREREG.

## NFR triggers

- **`NFR-001` / `G2`:** B-T4, two sets, each ≤ 1.02 × (`G2`'s six roots; the endgame six).
- **`NFR-005`:** B-T6 (`Q-3K-4` (b)): every `G6` run at depth ≥ 6, depth 7 a WARN, the median reported.
- **`NFR-008`** (`npm test` ≤ 10 s): P1 and P2 are units in the default lane; the tool's tests stay outside it
  (`TUNE_DEEP`). **Flag:** on `ABC-283`'s branch the lane median read 9.60 s (`QE-283-a`, `R-N8H-1` MEDIUM,
  `Q-N8H-1`'s trigger fired), and the merged tree read 9.77 s ungraded (`se-ABC-283-merge` `…f7f63e1d`). **The
  headroom is `UNKNOWN - verify`** until Security/NFR's `secnfr-nfr008-1104` (in flight) reports. That hop sizes the
  target for this pull's rows.
  - *2026-11-04 (`bapm-ABC-302-cut`): **reported.** `NFR-008` is MET at 9.84 s graded, with 0.16 s of headroom
    (`…1184fec4`). **This ticket's default-lane budget is ≤ +0.10 s** (`…112cd856` ruling 2). It is read as an
    `N8-LANE` H − B median wall, with an admissible twin, at the gate. No new test file goes in the default lane. Any
    default-lane row of ≥ 50 ms, by its duration in the tip's vitest JSON report, goes to its file's deep lane. Over
    budget, the ticket goes back to the SE to move rows deep. No NFR level moves.*
  - *2026-11-04 (`bapm-lines-1104`; `…f30bd604` 1): **the budget holds at ≤ +0.10 s,** read as the head-minus-base median wall. Added aim, not a gate: rows this ticket adds or changes sum to ≤ 90 ms
    in-thread, none added to `src/cli.test.ts`. Rows of ≥ 50 ms go deep. No new default-lane file.*
- **`NFR-009`:** unchanged; constants only.
- **Security:** no new surface. The tool reads local files only, and the Lichess file stays outside the repository,
  checked against its pinned sha256.

## Test notes

1. **The PREREG before any fit** (scope 2), sealed and committed. Then one fit.
2. **Recommended to QE (it grades nothing):** B-T5 before B-T7 and B-T8, so that a safety miss spends no games.
3. **Pins and bars:** `ABC-239` test note 6 and `ADR-0067` B-T4's re-pin rule, by reference. One PR table of every
   re-pin (file, row, old → new). Lost fixture properties are re-found under `ADR-0028` d2, never loosened.
4. **Retired rows, exactly those named in `ADR-0067`:** the `differ` assertion of E1's "only the king's square and the
   passers differ" row, the whole of `ABC-269` B1 (e), and `ABC-215` A2's rule rows for tuned arrays under d6
   (replaced by the provenance row). QE checks the PR retires exactly these.
   *2026-11-04 (`bapm-lines-1104b`; `…878035ca` 3): **two further rows, outside `ADR-0067`'s list, are pins at scope 4.**
   Both are in `src/evaluate.passer.test.ts`: "PASSED_KING_ENEMY, PASSED_KING_OWN, PASSED_FREE: by own rank in PASSED's
   shape, every half 0" and "at the shipped values (every half 0) every part is 0 on every fixture". They pin the
   value-0 table under ruling `…42c82347` and go red as soon as a fit frees king distance and free path. Each is
   re-pinned or retired at scope 4 and listed old → new in the PR table. QE's check above covers these two as well.*
5. **Carried from `ABC-239`'s close, not bars** (BA/PM judgment, flagged): `954d44fb` (`QE-270-e`, a test-only change
   to the K1 (e) bite rows) is owed by this pull, since it goes red once a fit frees a queen-on mg. If step 7 is
   reached, K1 (c) takes form (A) (`ABC-239` § Close).
6. **Host:** every fit, lane and read under the host lock, one job at a time. The Lichess file is downloaded by hand
   outside the repository and checked with `sha256sum -c` before the first extract (`ADR-0067` § Addendum).
7. **UAT is owed** (`src/evaluate-params.ts` is a production line). QE's verdict signs it (2026-10-22 delegation).

## Size and priority

- **Size: L.** The tool change (the bound-set enumeration, the four exports, the tracer's E4a features), one fit, the
  re-pins and the reads. One tool module, so `ABC-239`'s split rule does not fire. Host time: the fit takes minutes,
  B-T7 about 0.7 h, B-T8 about 5 h (owner-approved).
- **Priority: P2.** It is E2's lever in Phase 4, and `ABC-287` and `ABC-290`–`ABC-293` wait on it.

## Dependencies

- **Met:** `ABC-271` (E4a structure, merged `872e5ffc`), `ABC-280` (the tool, merged `0c8b385a`) and `ABC-283`
  (merged `58e90d07`, before the candidate freeze as the Architect required). `ADR-0067` d6 amendment and B-T8: the
  owner's yes (`…dda43b71`).
- **The candidate freeze:** B-T7's base is `main` at the freeze. A value-changing merge after the freeze makes B-T7
  stale (C2′'s stale rule). The PREREG names the base SHA.
- **After `ABC-302`** *(2026-11-04, `bapm-ABC-302-cut`; `…112cd856` ruling 3)*: scope 0 builds after the headroom
  ticket (nine rows to deep lanes, about −0.5 s) merges.
- **File collisions:** `src/evaluate.ts` and `src/evaluate-params.ts` with `ABC-272`, one at a time.
- **Blocks:** `ABC-287` (P6, after this pull), `ABC-290`–`ABC-293` (after this pull merges or closes).

## Open, not bars (for the Orchestrator)

1. **B-T8's harness form.** The first pull's ruling was one `rpair` (`ABC-239` A6). On `main`, `rpair` takes no
   `--budget-ms`: it plays 4 000 ms at `Skill Level` 6 (`tools/rating/rating.ts` header, `ABC-247`, `ABC-255`). The
   0.5 s control is `r --budget-ms 500` only. So B-T8 is two `r` reads, or a harness ticket comes first. `UNKNOWN -
   verify`; the choice is the Orchestrator's.
2. **The endgame `G2` row's miss disposition.** F1–F8 do not name one. If it reads above 1.02 ×, the Architect
   rules (`UNKNOWN - verify`).
3. **`NFR-008` headroom:** `secnfr-nfr008-1104`, in flight. *2026-11-04 (`bapm-ABC-302-cut`): answered. 9.84 s
   graded; a budget of ≤ +0.10 s (§ NFR triggers); after `ABC-302` (§ Dependencies).*

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ the first pull missed on F3 and F4; E4a's features are now on `main` and the d6 amendment is adopted; one read judges both |
| 2 | scope and out-of-scope | ✅ scope 0–5; U, mg halves, material, R1 (unless the PREREG adds it), other `src/`, `ABC-272` and bundles out |
| 3 | INVEST | ✅ L, one tool module (the split rule does not fire); every dependency merged; valuable and testable by P1–P4 and B-T0–B-T8 |
| 4 | testable, measurable acceptance | ✅ P1 44 / 44 exact; P2 0 callers; P3 17 exports value for value, typecheck, 0 misses; P4 in the PREREG; endgame `G2` ≤ 1.02 ×; B-T0–B-T8 at their levels (C2′ ≥ 50.0; B-T8 ≥ 0) |
| 5 | dependencies known | ✅ `ABC-271`, `ABC-280`, `ABC-283` merged; the freeze rule; `ABC-272` one at a time |
| 6 | NFR triggers with targets | ✅ `G2` ≤ 1.02 × on two sets; `NFR-005` depth ≥ 6; `NFR-008` ≤ 10 s, headroom flagged to `secnfr-nfr008-1104` |
| 7 | test notes | ✅ 1–7 |
| 8 | size | ✅ L |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ `ADR-0067` (with the d6 amendment) and `ADR-0070` d7 accepted; B-T8 re-confirmed; no owner question open. § Open items do not block the build or the fit |

**DoR 10/10: Ready.** The column move is the Orchestrator's. *2026-11-04 (`bapm-ABC-302-cut`): scope 0 waits on
`ABC-302`'s merge (`…112cd856` ruling 3). That is an ordering, not a DoR row. Row 6 gains the ≤ +0.10 s default-lane
budget. **DoR 10/10, unchanged.***
