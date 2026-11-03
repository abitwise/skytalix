---
kind: adr
id: ADR-0068
---
# ADR-0068: E3a (`ABC-270`) lands as structure only, before the tuner. Three queen-on exposure pairs are added at 0, so the build is value-identical and node-identical to `main` and has no switch, no doors and no games. `ABC-239`'s first pull fits them, with the exposure endgame halves it already frees. The `ADR-0031` addendum's rule values (× 3, endgame half 0) are not shipped, and its shelter gate (A3) is out

## Status

**PROPOSED 2026-11-03.** Recorded by Architect/Design (task `arch-ABC-270`, on `grugops/arch-ABC-270` from `main`
`dc7dc15d`). **Acceptance is the owner's:** this is a new ADR, and it changes `ABC-270`'s scope from a value-changing
ticket to a structure ticket (`memory-bank/45-standing-rulings.md`, 2026-10-22).

- **Why now:** the owner's item 8 of 2026-11-03 (`orch-2026-10-30a` `…af126c04`): "`ABC-270` design may start now, ahead of
  `ABC-239`'s build".
- **The probe:** it ran under the PREREG `…117475f9` (commit `6bdd433b`), sealed before any measured run, and one
  addendum `…3f24d8a0` (commit `9b3859be`), sealed before its diagnostic. It ran on a scratch copy of `main`'s `src/`
  (tree `4cb84035`), outside the repository, under the host lock, about 5.5 min of host time in all. Nothing was
  committed to `src/` or `tools/`. Scripts and outputs: `.grugops/context/arch-ABC-270/raw/probe/`.
- **The verdict, by the pre-registered choice rule: rule 3.** Neither rule-value form is eligible. QX (scope 1 + 2) and
  X (scope 1 alone) both fail E3, the mate floor at d5 against d5: 2 / 190 and 1 / 190. Every other eligibility row
  holds. So the ADR proposes the structure only, value-identical to `main`, with values owned by the tuner.
- **The answer that settles it:** *"accept ADR-0068"* or *"decline it"*.
- **Reading (b)** (the `ADR-0064` / `ADR-0067` precedent): the build may start while this ADR is PROPOSED. The merge waits
  for acceptance.
- **Default without an answer:** `ABC-239`'s fit does not wait past its own readiness. If this ADR is not accepted by
  then, the tuner fits without the queen-on terms. E3a's structure then enters at a later pull, at the price of one
  more fit and read.
- **What it amends (dated lines written here, records only):** `ADR-0031` § Addendum status (A1's rule values not
  proposed; A3 out); `ADR-0064` d10 (E3a's pointer); `ADR-0061` § Consequences (the futility drift instrument on a
  tapered `main`). **Owed, not edited here:** `ADR-0067` (d6 free set, d4 tracer, B-T5's risk), `ADR-0056` (row E3),
  `EPIC-011`, the `ABC-270` and `ABC-239` pages (decision `…c858b5a5` § 5).

## Decision log

| date (UTC) | by | what | record |
|---|---|---|---|
| 2026-11-03 | Architect/Design | PREREG sealed before any measured run | `arch-ABC-270` `…117475f9`, `6bdd433b` |
| 2026-11-03 | Architect/Design | A, B read; QX and X fail E3; choice rule 3; addendum before one diagnostic | `…3f24d8a0`, `9b3859be` |
| 2026-11-03 | Architect/Design | PROPOSED; results and artifacts | `…c858b5a5`, `…947a9f3b`, `…401f8fcf` |

## Context

### What `main` is (E1 + E2-pre)

- `src/evaluate-params.ts` holds every term as an mg / eg pair. Since `ABC-274`, every term enters the blend, packed
  (eg × 2^16 + mg). `kingExposure` already returns a packed pair. **So scope 1 of `ABC-270` (the exposure endgame halves)
  is a data change only.** It needs no code, and `ADR-0067` d6 already frees those halves for the tuner's first pull.
- The queen scale (`ADR-0031` addendum A1) is the only part of E3a that the tuner cannot create. It needs a feature
  (the king's exposure counts while the enemy has a queen) that does not exist today.
- **The shelter gate (A3) gates nothing on `main`.** It pays "a positive middlegame king-table value" only while no
  shelter file is missing. `ABC-215`'s `KING_MG` (`max(−50, −10 d − 10 (R − 1))`) has no positive cell: b1 / g1 are 0 and
  every other cell is negative. `ABC-205` gated Michniewski's +20 / +30 castled cells (`grugops/ABC-205-final`
  `b5d5cea5`). Those cells are gone. This was settled by reading, before any run.

### The probe (PREREG `…117475f9`)

**Forms:** BASE (`main`); X (the three exposure endgame halves 0); Q (queen-on pairs = 2 × the base pair, so × 3 in each
half); QX (both, the candidate).

**I1, the instrument, exact.** BASE equals the unpatched `main` on all nine count rows (nodes, score, move). Both equal
`ADR-0064` B0's recorded counts.

**Counts** (`chooseMove`, frozen clock; ratio to BASE; the root move is unchanged on every row):

| board, depth | BASE nodes | X | Q | QX |
|---|---:|---:|---:|---:|
| kiwipete 8 | 1 296 788 | 0.9820 | 1.0146 | 1.0936 |
| kiwipete 9 | 2 733 330 | 0.9942 | 1.1123 | 1.1423 |
| position-6 8 | 404 930 | 0.9961 | 0.9034 | 0.9145 |
| position-6 9 | 926 005 | 0.9700 | 1.0008 | 1.1447 |
| position-6 10 | 1 692 669 | 0.9955 | 0.9367 | 1.0401 |
| `search()` d8 kiwipete / position-6 | 839 514 / 1 533 901 | 0.9737 / 1.0641 | 1.0002 / 0.9148 | 1.0831 / 0.8348 |

S (QX) = 1.1447, a report. Under `Q-3K-4` = (b) it would grade nothing.

**Eligibility (all rows must hold):**

| row | QX | X |
|---|---|---|
| E1 mirror, `Object.is`, 214 positions | 0 | 0 |
| E2 `K1 (b)`, 9 frozen endings ≥ 20 cp (BASE: S1–S3 +13 / +13 / +23) | **9 / 9, min 110** | 9 / 9, min 110 |
| E3 mate floor, d4 → d5 | 0 / 163 | 0 / 163 |
| **E3 mate floor, d5 → d5** | **2 / 190** | **1 / 190** |
| E4 zugzwang | 7 / 7 | 7 / 7 |
| E5 `G1` | 54 / 58, none newly missed | 54 / 58, none newly missed |
| E6 queen pairs × 3 per half (364 pairs) | 364 / 364 | — |

- **Not an artifact.** `search()` clears its table on every call, and killers and history are per search. X changes
  data only.
- **The lost mates** (addendum diagnostic, decides nothing) are all KQK at mate-in-5-plies (`8/6k1/8/6K1/8/8/8/6Q1 w`,
  `8/7k/8/7K/8/8/8/6Q1 w`). BASE finds them at d5, and both forms find them at d6. Cause: the exposure term charges a
  bare king up to 105 cp in a pawnless ending, so the pruning margins move with it.

**Reports (decide nothing):**
- **Game 1** (`plans/uat/EPIC-006-game-1.pgn`). QX plays **Ng4 instead of 13.d4??** at d7 and d8. That is Stockfish's
  move (`memory-bank/analysis/2026-10-23-game-1.md`). BASE plays d4. QX's static white exposure there is 75 cp,
  against BASE's 25.
- Drift at d5 QX against BASE: 42.25 % within 25 cp, max 132, 12 root moves differ. Reach at 47 000: 5.868 against
  5.879.
- **Batch E** (the default lane with QX wired into every path): 28 reds in 7 files. They are pins and fixture
  properties (quiescence Q-SET 11, engine `ABC-230` / `ABC-249` 5, `ABC-269` B1 (a)'s M-negzero property and B1 (c) /
  `ABC-274` A3 rows 4, futility `QE-268-b` 3, transposition 3, ordering 1), plus one relation: **`ABC-083` A2 (b)**. The
  g6 pawn reads +12 over g2 at phase 0, so the conflict that the addendum's rejected alternative names is real (test
  note 2).
- **Void:** the `fut` mode. Since `ABC-269`, the futility doors also turn `taper` off, so it did not read futility
  drift (`raw/probe/README.md`; `ADR-0061` dated line).

**D5, a tuner diagnostic** (own games, inner split, bounded C-S; decides nothing). I2 is exact: D4r reproduces
`arch-ABC-239`'s D4 bit for bit (CE ratio 0.9960083928, the same parameters). D5 adds the three queen-on pairs, free
and ≥ 0:
- The whole middlegame shelter weight moves into the queen-on term: shelter (0, 0), shelter with the queen (29, 0).
  D4r read shelter (29, 0).
- Half-open with the queen (2, **140**): an implausible endgame half, the same data pathology as `ADR-0067`'s queen at
  2 593. Open with the queen (0, 0); open (13, 21).
- Inner cross-entropy 0.99932 × D4r: a small move. The king tables stay about 3.5 × (mg) and 2.8 × (eg) the rule's.
- **Read plainly:** the tuner can fit these terms. On today's data it puts the queen dependence where A1 says (shelter,
  mg) and the shelter's endgame half at 0, where scope 1's rule says. Some endgame halves need holding.

## Decision

1. **E3a is structure only, value-identical.** This is the PREREG's choice rule 3.
   - `src/evaluate-params.ts` gains three pairs, `KING_SHELTER_MISSING_QUEEN`, `KING_FILE_HALF_OPEN_QUEEN` and
     `KING_FILE_OPEN_QUEEN`, each `{ mg: 0, eg: 0 }`. Each is added, per file, to the matching base term of a king's
     exposure **while the enemy has at least one queen**.
   - Their comment records the rule they start from: "start (prior): 0. The `ADR-0031` A1 rule, 2 × the base pair
     (× 3 in all), was probed and not shipped (`ADR-0068`)".
   - The three existing exposure pairs keep E1's values (endgame half = middlegame half). The tuner owns all six
     pairs.
2. **The form: additive pairs, not a factor.** The pairs are linear in their weights, so `ADR-0067` d4's traced Newton
   model fits them as they are, one feature each: the exposure count × the enemy-queen flag. A fixed × 3 factor would
   be a constant that the tuner cannot fit.
3. **Per-node cost: no new per-piece operation.**
   - The walk's `type === KING` test becomes `type >= QUEEN`, with KING / QUEEN told apart inside it. That is the same
     one compare per non-pawn piece, and it gathers the two queen flags. The probe's patch is this form.
   - `kingExposure` takes the enemy-queen flag and adds the packed queen-on terms once per king, before its file loop.
   - The packed int16 range row (`ABC-274` A9) reads the new pairs' maxima too.
   - Cut C1 stays intact: the phase stays an argument, and no phase add returns to the walk.
4. **No switch and no doors.** The build is value-identical (the `ABC-274` / `ADR-0067` d8 precedent), and a door
   would reproduce a path that does not differ. **`ABC-270`'s scope 4 is struck.** So the `ADR-0031` addendum's
   owner levels `OD-205-1` / `OD-205-2` cannot move. They sit on older doors (`searchWithoutPvsOrReductions`,
   `searchWithoutNullMove` / `…Reductions`), which read `main`'s values in any case.
5. **`ABC-083` A2 (b) and A3 (b) are re-found at phase 24** (`ADR-0028` d2, tests only, in `ABC-270`).
   - Their claim is middlegame king safety, but their fixtures are pawn endings (phase 0). That is the
     conflict that the addendum's rejected alternative cites, and batch E reddens A2 (b).
   - Re-found with the same pawn shapes and the same equal material, plus symmetric heavy pieces, so that the rows grade
     the term where it is meant. Each new row must read **red with its term zeroed** through `withParametersForTest`
     (the fixture bites).
   - Done before the tuner emits, so `ADR-0067` d6's rule ("a red relation becomes a bound") cannot bind the endgame
     exposure through an accidental fixture.
   - The pawn-ending rows go once their phase-24 twins are green on `main`. Both are green before and after, so no
     expectation moves.
6. **The bars of `ABC-270`, pre-registered** (fixed here; not loosened after Ready):
   - **K0, node identity:** `chooseMove` kiwipete d8 / d9 **1 296 788 / 2 733 330**; position-6 d8 / d9 / d10
     **404 930 / 926 005 / 1 692 669**; `search()` d8 **839 514 / 1 533 901**. These are this probe's I1 and `ADR-0064`
     B0's. If `main`'s `src/` has moved by the build, the Engineer re-reads them on the new base and puts both in the
     PR. Every older door reads its pre-ticket counts.
   - **K1, units (default lane):**
     - (a) the mirror, `Object.is`, `G3` + `TAPER_MIRROR_POSITIONS`, 0 mismatches;
     - (b) `evaluate` `Object.is`-equal to the pre-ticket `evaluate` over the frozen corpora (`G3`'s 184,
       `TAPER_DOOR_CORPUS`, the KP rows);
     - (c) the queen-on structure through the seam. With the pairs set to 2 × the base pairs, each king's exposure is
       exactly 3 × its queenless exposure in each half (≥ 6 pairs that differ only by the enemy queen, frozen by QE
       before the build). With the pairs at 0, (b) holds;
     - (d) the range row over the new maxima;
     - (e) decision 5's re-found rows, each red with its term zeroed.
   - **K2, zero re-pins** in every lane (default and deep). A row that needs one means the build is not value-identical:
     a defect.
   - **K3, `G2` ≤ 1.05 ×** `main`'s `evaluateAtPhase` per call. QE reads it under a PREREG sealed before timing, with
     `ADR-0067` d8's A5 instrument (two sessions, reverse order, a `main`-copy control).
   - **K4, `G6` "≥ base":** each board's median depth ≥ `main`'s, and every run at depth ≥ 6. `Q-3K-4` (b) does not
     apply, because no value changes (as `ABC-274`).
   - **No games.** S2 nps is reported only, if the Orchestrator rules as for `ABC-274` (`…690d3b30`). That ruling is
     his.
   - **A source row:** the queen flags come from the walk's existing non-pawn branch. No new per-piece operation.
7. **The order against `ABC-239`: `ABC-270` (structure) first, then `ABC-239`'s first pull fits it, and one read covers
   both.**
   - `ABC-270`'s build can run beside `ABC-239`'s tool build. `ABC-239`'s fit and emission are taken on a `main` that
     contains `ABC-270`, or its declined or failed disposition.
   - `ABC-270` has no 100-game read of its own. E3a's values are read in `ABC-239`'s read: C2′, S′, Levels and B-T8.
8. **What the tuner owes, as owed lines in `ADR-0067`** (written by its owner, not here):
   - d6's free set gains the queen-on pairs. **mg is free and ≥ 0; eg is held at 0 at the first pull** (D5's eg 140 is
     implausible), and freed at a later pull only by its own pre-registration;
   - d4 / d5: the tracer traces the three features, and the identity gate covers them (trivially at 0);
   - `ABC-239`'s PR prints S1–S3 and game 1's move 13 on the emitted set, as reports;
   - B-T5's mate-floor risk (Consequences).

## Alternatives

- **QX on its rule values with its own 100-game read first (the brief's "270 build → 239 fit includes them").**
  Rejected by the pre-registered rule: it fails E3, which is `K2` of the ticket. The build would be NOT MET on `K2`
  (F4: never a deeper re-pin), after an M build and about 0.8 h of reads.
- **X alone (endgame halves 0), queen pairs at 0.** The same E3 miss (1 / 190). Rejected by the same rule.
- **`ABC-239` first, `ABC-270` after on hand values.** Rejected. A hand × 3 on top of a table fitted without the term
  double-counts king safety: the tuner already scales the king tables by 3–3.5 ×. Fitting the values instead needs a
  second pull and read (about 0.7 h, plus about 5 h if B-T8 is asked again).
- **A fixed × 3 factor as the structure** (`ADR-0031` A1 literally, a per-position constant). Rejected. The tracer can
  apply it (`ADR-0067` d4), but the tuner then cannot fit its size, which is the one number E3a is about.
- **The shelter gate (A3).** Out: it gates nothing on `ABC-215`'s table, and a re-form would be a new hand term with no
  rule. It re-opens only if a tuned `KING_MG` gains a positive cell (C-F can do that), by its own ADR.
- **A switch and a door pair** (`ABC-270` scope 4). Not needed for a value-identical change. They would come back with
  the first value-changing king-safety ticket that is not the tuner's.
- **Re-tuning the mate floor bar, or a d6 re-pin.** Not open (`ADR-0064` F4, the ticket's F4).

## What would falsify this

| # | clause | what would falsify it | if it fires |
|---|---|---|---|
| F1 | 1, 3, 4: value-identical | a node, score or move mismatch against `main`; an `Object.is` miss; a needed re-pin (K0–K2) | a defect, fixed before any cost bar; never re-pinned |
| F2 | 3: cheap | K3 `G2` > 1.05 ×, or K4 a `G6` median below `main`'s, or a run below depth 6 | STOP to Architect/Design: one value-identical cut, then one re-read under a PREREG (`ADR-0067` F8's pattern). A second miss: not merged, and the tuner fits without the queen-on terms |
| F3 | 2, 7: the tuner wants the term | `ABC-239`'s fit leaves every queen-on mg at its 0 bound on the accepted data | recorded. The structure is dead weight, and a later ticket may remove it. No re-fit on play |
| F4 | 7: one read covers both | `ABC-239`'s read is NOT MET | `ADR-0067` F6. The tuned set is not merged. The structure stays, value-identical. E3a's values are never fitted on play results |
| F5 | 5: the re-found rows | a phase-24 twin not red with its term zeroed, or not green on `main` | a defect in the fixture; re-found again before merge |

## Consequences

- **Host time.** `ABC-270`: about 0.2 h (two `G2` sessions, `G6` rounds, the lanes), with no games. Against the
  rule-value route: about 0.6 h less, and no M-sized build forecast NOT MET. E3a's play value is read only jointly with
  the tuner's. C2′'s ± 56 Elo could not resolve E3a's +15–50 slice alone anyway.
- **Size:** `ABC-270` goes from M to S (BA/PM).
- **`QE-269-a` (S1–S3) moves to the tuner.** `ABC-270` can no longer grade S1–S3 ≥ 20 cp, because they are 13 / 13 / 23
  on a value-identical build. They become a report in `ABC-239`'s PR. D4 / D5's fitted king endgame tables (about
  2.8 × the rule's) and shelter endgame half (0) forecast that they clear 20 cp, which is **`UNKNOWN - verify`** on the
  emitted set. If they do not, QE records the gap, and E3b or a later pull owns it.
- **Risk for `ABC-239`, B-T5 (mate floor, `ADR-0064` B2's form).** A three-number rule change lost same-depth KQK mates
  here (found one ply deeper). A tuned set moves far more, so the d5-against-d5 row may fire on pawnless rows. That
  bar is not moved. If it fires on KQK, the structural candidate is `ABC-272` (E7a's pawnless mop-up), not a re-pin.
- **Risk for `ABC-239`, migration.** Batch E shows that three moved numbers redden 28 pins and fixture properties. A
  tuned table moves the door paths too (older doors read the mg sum). B-T4's "the diff under `src/` is that file only"
  needs an explicit re-pin rule (`ADR-0064` d7: old → new in the PR). That is an owed line for `ADR-0067`.
- **NFRs.** `NFR-005`: K4. `NFR-001` / `G2`: K3. `NFR-008`: K1 rows are units with no search. `NFR-009`: six integers
  and no memory. Security: none. No new NFR file; `plans/nfr-catalog.md` is untouched.
- **Determinism (`ADR-0027`) and licence (`ADR-0048`):** unchanged. These are integer pairs of this project's own.
- **File collisions:** `src/evaluate.ts` and `src/evaluate-params.ts` with `ABC-239` (its tool writes the file's
  present shape, which then includes the new pairs), `ABC-271` and `ABC-272`.

## Rollback

- **Before acceptance:** mark this ADR `withdrawn`, and strike the dated lines in `ADR-0031`, `ADR-0064` and `ADR-0061`.
- **After the build merges:** revert the one commit. It is value-identical, so nothing else moves. If a tuned set has
  merged on top, revert that first (`ADR-0067` § Rollback).
