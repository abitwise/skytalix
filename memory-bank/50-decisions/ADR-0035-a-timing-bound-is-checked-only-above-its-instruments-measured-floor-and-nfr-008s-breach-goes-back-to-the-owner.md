# ADR-0035: A timing bound is checked only above its instrument's measured floor; per-ticket cost is read on the narrowest file set; `NFR-008` is BREACHED on both clauses and goes back to the owner with a re-scope recommended

## Status

`accepted` — 2026-10-10, by Olger Oeselg (owner), verbatim "2. accept" (note
`.grugops/context/wave-2026-09-25/notes/20261010T173005Z-orchestrator-decision-owner-word-eight-answers-6a1f3d92.md`).
Decision 6 is taken as **option R-1** for `NFR-008`: wall ≤ 10 s is the gate; CPU is reported, not gated.
The catalog wording is applied by the `NFR-008` row's owner (Security/NFR) in its next catalog hop.

**Pointers 2026-10-11** (`design-low-batch-2026-10-11`). Three readings and one erratum are in
`§ Pointers 2026-10-11` at the end of this file:
- P1: the clause's file set is what `npm test` collects, `tools/` included;
- P2: the `ABC-084` count, 49 and not 51;
- P3: the reading of `N8-LANE`'s 5 %.

No decision is changed.

**Floors after `ABC-152`, 2026-10-12** (`design-ABC-144-fcap`; this applies `ADR-0042` ruling 6, which the owner
accepted, and `ADR-0040` addendum 2 item 6). vitest 4.1.11 with the module runner off merged at `7a920ca5`, so
decision 3's recorded floors are pre-merge data.
- **The full lane keeps `F` = 1.72 s CPU / 3.25 s wall** until the first full-lane twin R is read on 4.1.11,
  runner off, at k = 2. That R replaces it outright, because with fewer than three readings the largest is used.
- `ABC-152` `V9`'s twin R is 0.440 s CPU / 0.190 s wall, read on 3.2.7 at k = 2. It is listed and not used.
- Every narrow set, the one-file row included, takes the provisional 16 % until its first 4.1 reading.

No decision is changed and nothing was measured. Note
`.grugops/context/design-ABC-144-fcap/notes/20261011T231917Z-architect-design-decision-abc144-fcap-floors-after-abc152-dd7a6ec9.md`.

**Per-set floor, 2026-10-12** (`design-2026-10-12-fold`; this applies the paragraph above and decision 3's
amendment). **`src/cli.test.ts`: `F` = 0.100 s CPU / 0.180 s wall**, on vitest 4.1.11, runner off,
`maxWorkers: 2`.
- **Source.** `ABC-116`'s A2 identity twin (`ticket-to-pr-ABC-116` `probe/a2-runs.tsv`). Its base is
  `3c38a8ea`, which carries `7a920ca5`. n = 8 scored rounds, order statistic k = 2 (coverage 92.97 %). It was
  recomputed at this hop from the raw rows, not copied from the summary.
  - Sorted twin − base CPU deltas: −0.24, **−0.10**, −0.03, −0.01, 0.01, 0.04, **0.06**, 0.47, so R = 0.100 s.
  - Wall: −0.08, **−0.03**, 0.00, 0.01, 0.01, 0.03, **0.18**, 1.39, so R = 0.180 s.
- **Admissible.** The twin median is 0.000 s CPU (0.00 % of the 5.610 s base) with sign 4/8, and 0.010 s wall
  (0.25 %) with sign 5/8.
- **It replaces the provisional 16 %** (0.898 s CPU on this base). It is this set's only 4.1 reading, so the
  largest R is used. From the third 4.1 reading on, the median of the three most recent governs.
- **One condition, stated.** The twin and base shared one symlinked `node_modules`. Decision 2's harness asks
  only for a `cmp`/`diff -r` twin. The separate `npm ci` in the paragraph above is a full-lane condition, and
  it is not extended to narrow sets here. If a later reading with separate installs reads wider, `F` rises by
  the median-of-three rule.
- **What it changes at the cut.** On this file, a 650 ms `N8-LANE` bound and the 0.30 s per-child clause are
  both at or above `F`, so neither is refused at the cut any longer. The count stays the pin where a count
  exists (decision 3).
- **What it does not change.** The other per-set floors stay provisional until their own 4.1 readings. The
  full lane keeps 1.72 s / 3.25 s, and `RISK-ABC144-FCAP` stays open: a one-file R is a different instrument
  and is not a full-lane reading.

No decision is changed and nothing was measured. Note `.grugops/context/design-2026-10-12-fold/notes/`.

**Addendum 2026-10-12 (`design-ABC-105-lane`, after `ABC-105` merged as `f6400877`).** Three items, in
`§ Addendum 2026-10-12` at the end of this file:
- **A1 amends decision 1, forward-only (`QE-105-ab`).** The admissibility limit becomes max(1.5 %, one tick), and
  the sign test counts only non-zero deltas. Decision 1 is a protocol clause, and the protocol is this role's
  (below). No level moves. Windows graded before it stay as graded.
- **A2:** the per-set `F` for `tools/grugops/qe-hop-integrity.test.ts` is 0.020 s CPU / 0.020 s wall.
- **A3:** that set's cost grows with `.grugops/context`, so its re-read is triggered at 4,000 note files. This is
  a risk with a trigger, not `N8-LANE` text.

Nothing was measured. Notes are in `.grugops/context/design-ABC-105-lane/notes/`.

**Addendum 2026-10-12, second (`design-ABC-154-close`, after `ABC-154` merged as `4537fb11`).** Four items, in
`§ Addendum 2026-10-12 (after ABC-154)` at the end of this file:
- **B1 (`QE-154-b`):** A1's forward-only clause is met by a pre-registration that is committed before the window's
  first run, on a commit that has the addendum as an ancestor, and that reaches `main` unchanged. The wording is
  clarified. No recorded state moves.
- **B2 (`QE-154-c`):** a third admissible R (0.030 s). The median of three governs, so `F` stays 0.020 s CPU /
  0.020 s wall.
- **B3:** `RISK-ABC105-LANE` closes on `qe-ABC-154`'s MET. A3's 4,000-note re-read survives as its own named
  trigger on the set, `T-QEHOP-GROWTH`.
- **B4 (`QE-154-d`):** load1 8.88 does not bear on admissibility. There is no new rule.

Nothing was measured. Notes are in `.grugops/context/design-ABC-154-close/notes/`.

**Per-set floors, 2026-10-23** (`arch-floor-reread`, `R-178-1`). This applies decision 3's amendment and the series rule
of `ADR-0042` ruling 6 and `ADR-0040` decision 4: a series breaks when a change moves per-file cost or file queueing.
- **`src/uci-session.test.ts` (ONE-FILE, heap 400): `F` = 0.070 s CPU / 0.090 s wall.** It has two admissible twins, so
  the largest R governs: `ABC-177` A8 (vitest 4.1.11) read 0.070 / 0.090 s, and `ABC-178` B7 (4.1.12) read
  0.030 / 0.050 s. This replaces the provisional 16 % (0.654 s at B7). From the third admissible reading on, the median
  of the three most recent governs.
  - **The 4.1.11 → 4.1.12 patch bump (`ABC-198`) does not start a new series.** `vitest.config.ts` is identical between
    the two bases, so the runner mode, pool, `maxWorkers` and isolation are unchanged. QE's paired bisect
    (`…1478c7fc`) reads no shift without coverage, and `N8-LANE` arms run without coverage. The new-series answer
    (0.030 s) is the smaller `F`, so this ruling is the stricter of the two at a cut.
  - **The content change between the readings is no break either.** `ABC-177` cut the file's base CPU from 7.10 s to
    4.09 s. `F` is keyed by set, and decision 3's own table reads one set across bases.
- **`ABC-200`'s 5-file set** (`src/cli.real-engine.test.ts src/cli.test.ts src/engine.test.ts src/line-input.test.ts
  src/startup-questions.test.ts`, heap 128, 4.1.12): **`F` = 0.050 s CPU / 0.050 s wall.** It is the set's first
  admissible reading (`…f636dfd0`), which replaces the provisional 1.316 s outright. No window is owed for it.
- **Cut checks.** 650 ms CPU is at or above both floors. `ABC-197` `A6` is not refused.
- Every figure was recomputed from the committed per-run TSVs (sha256 `43117fbaa2fb`, `6b5e0392983d`, `f5764cd4f2d6`) in
  integer centiseconds, and each agrees with the published figure.

No decision is changed and nothing was measured. Notes are in `.grugops/context/arch-floor-reread/notes/`
(`…8ccdcfaa`, `…578a9290`).

Previously `proposed` — 2026-10-10, by Architect/Design (task `wave-2026-09-25`, subtask `ruling-timing-protocol`),
the owner of `NFR-008`'s protocol, its floor account and its spawn account. It rules `QE-119-a` (MEDIUM,
QE at `ABC-119`) and the `NFR-008` clause state that has been unruled since `ADR-0019` trigger (a) fired.

**Proposal text amended 2026-10-10 (`design-owed-rulings-2026-10-10`).** Decision 3's `F` is keyed
per narrow set (the block under decision 3). The status is still `proposed`, and the owner's question
is unchanged.

**Decisions 1–5 are this role's.** They cover the protocol, the instrument, the cut rule, and the clause
state on the row's own protocol. They take effect when this ADR is accepted. **Decision 6 is a
recommendation.** The level of `NFR-008` (15 s CPU / 3 s wall) is **Olger Oeselg's**, and nothing here
moves it.

**Scope fence.**
- No `src/`, `vitest.config.ts`, `package.json` or `AGENTS.md` byte changes.
- No ticket page, `plans/board.md` or `plans/nfr-catalog.md` changes. The catalog wording is
  *proposed* in the decision note for the row's owner to apply after acceptance.
- `N8-LANE`'s 5 % and 650 ms, the 160 ms floor and `N8-SPAWN`'s 0 ms are unchanged. The admissibility
  clause (null median ≤ 1.5 %, sign at chance) is kept, and one clause is added to it.
- `isolate: false` stays forbidden (`ADR-0008` decision 7).
- No lane was run for this ADR. Every figure is arithmetic over per-run files already committed by
  other hops, re-derived by `.grugops/context/ruling-timing-protocol/probe/floors.mjs` →
  `floors.out.txt`.

## Context

**The protocol failure (`QE-119-a`).** At `ABC-119` `A2`(ii), QE ran two pre-registered three-tree sets.
Both passed the catalog's identity-null admissibility rule: the twin read −0.32 % and −0.20 %, signs 5/5.
**But the two sets put `HEAD − base` CPU on opposite sides of a 0.30 s bound:** −0.715 s and
+0.725 s. The rule tests only the twin's *median*, and a symmetric noise distribution centres near 0
however wide it is. Its 1.5 % allowance at a ~33 s lane is 0.50 s, which is already wider than the
bound it was admitting. Every ticket today that read `N8-LANE` or a paired cost on the full lane hit
the same wall:
- `ABC-036`: +130 ms net under heavy load, not re-measured by QE.
- `ABC-051`: −410 ms, read as "no detectable cost".
- `ABC-128`: full-lane null +1.76 %, inadmissible.
- `ABC-127`: +225 ms, with sign 5/8 and rounds swinging ±2 s.
- `ABC-119`: the straddle above.

**The floor, measured from the record.** Per null twin I computed R, the larger magnitude of the
order-statistic interval for the median: drop the single most extreme per-round delta at each end at
the standing n = 8, which gives 93.0 % coverage. All rows are CPU, user + sys.

```
instrument  reading (date, load1 median)              lane / file CPU   null R
full lane   ABC-110  2026-09-19  load1 4.5            14.9 s            0.22 s
full lane   ABC-079  2026-09-25  4.5   (Node v24.12)  22.1 s            0.31 s
full lane   ABC-122  2026-09-25  12.6  (Node v24.12)  23.3 s            0.12 s
full lane   ABC-082  2026-10-09  17.2  (n = 14)       30.8 s            0.45 s
full lane   ABC-084  2026-10-09  7.1 / 7.6 / 7.5      24.9-26.2 s       0.99 / 1.58 / 1.03 s
full lane   ABC-128  2026-10-10  not logged (n = 7)   35.0 s            2.89 s
full lane   ABC-127  2026-10-10  26.5                 35.1 s            0.76 s
full lane   ABC-119  2026-10-10  22.5 / 29.7          33.4 s            3.12 / 1.72 s
one file    ABC-128  2026-10-10  not logged           2.0 s             0.17 s
one file    ABC-127  2026-10-10  20.1                 1.5 s             0.13 s
```

- **On the full lane in October, no set resolves 0.30 s, and only one of seven resolves 650 ms.**
- **Run alone, the touched file resolves both at load1 ~20.**
- `ABC-084`'s file-against-a-one-assertion-empty-file arm read +0.280 s with a ±0.02 s interval.
- In September, at load1 ≈ 4.5 and a ~15–23 s lane, the full lane resolved 0.12–0.31 s. The factory
  now runs parallel hops and the lane has grown, and that regime is gone.

**The total.** `ADR-0019` set CPU ≤ 15 s on the owner's word and read it MET by 60 ms at 40 files. It
also wrote down trigger (a), a conforming median over 15 s. **That trigger fired on 2026-09-25 at
`ABC-079`**, on the reference stack (Node v24.12.0), and Security/NFR recorded it:
- Base 18.61 s at 42 files. With the ticket: 22.29 s, null +0.59 %, sign 6/8, admissible.
- `ABC-122` that day: 22.85 s / 23.46 s.

The owner accepted that ticket's charge (`AR-N8LANE-079`, *"3. accept"*, 2026-09-25). **The level
question went unanswered, and the catalog still ends at "MET by 60 ms".** Today the conforming base
arms read 24.86 s and 26.04 s CPU, and 6.52 s and 7.16 s wall (`ABC-084` runs 1 and 3, load1 median 7.1
and 7.5). That is 51 files and 1 541 tests *[erratum 2026-10-11: 49 files / 1 530 tests; see
§ Pointers 2026-10-11 P2]*. `ABC-084` run 2 is inadmissible: its null is +1.66 %.

**The reference stack is gone.** `node --version` is v26.11.0. Homebrew carries only `node@26`, and
v24.12.0 is not installed. Every October reading is on v26.11.0, and the row says `UNKNOWN - verify`
for that stack.

**The row's `Applies to` cell names only `PERFT_DEEP`.** At `2320269b` there are seven opt-in variables:
`PERFT_DEEP`, `SEARCH_DEEP`, `ENGINE_DEEP`, `INPUT_DEEP`, `ZOBRIST_DEEP`, `PUZZLE_DEEP` and `CLI_DEEP`.

## Decision

**1. A reading checks a bound `b` only when its instrument resolves `b`. The admissibility rule gains one
clause.**
- **Admissible** (unchanged): the identity twin's median delta is ≤ 1.5 % of the lane or file CPU, with
  its sign at chance.
- **Resolves `b`** (new): the twin's spread **R ≤ `b`**, in the bound's own unit.
  - R is computed from the twin's per-round deltas, sorted. It is the larger magnitude of `x(k)` and
    `x(n+1−k)`, where `k` is the largest index whose binomial coverage `1 − 2·Σ_{i<k} C(n,i)/2ⁿ` is
    ≥ 92 %.
  - At the standing n = 8 (nine rounds, round 0 discarded), `k` = 2: drop the most extreme delta at
    each end and read the larger magnitude left. At n = 9–10, `k` = 2. At n = 11–13, `k` = 3. At
    n = 14, `k` = 4. **Below n = 8 the rule gives `k` = 1, which is the full range.**
- **The reading's state follows:**
  - **MET:** admissible, resolves `b`, and the treatment median is ≤ `b`.
  - **NOT MET:** admissible, and either it resolves `b` with the treatment median > `b`, or the
    treatment's own lower interval end `x(k)` is > `b` at any R. A large charge needs no fine
    instrument: `ABC-079`'s +3.6 s read +3.48..+3.70.
  - **UNRESOLVED:** anything else that is admissible. **It is neither a pass nor a fail.** The record
    writes the twin's R, the treatment interval, and "at most `x(n+1−k)`" as the charge. What a gate
    does with an UNRESOLVED line is the gate's own rule. It is never written "MET".
- **Every paired reading reports R beside the median and the sign.** That is one more number.

**2. Per-ticket cost is read on the NARROWEST FILE SET that contains the change. The full lane is the
instrument for `NFR-008`'s TOTAL only, which is a ~2x question.**
- **The set:**
  - every test file the ticket adds or modifies;
  - plus, when it modifies a production file under `src/`, the files that
    `npx vitest related --run <modified src files>` runs. That command was checked at this hop:
    `src/line-input.ts` → 2 files.
- **The harness** is unchanged in shape. Three out-of-tree trees: base, head, and a `cmp`/`diff -r`
  twin. Run `npx vitest run <set>`, CPU = user + sys, one fresh process per run, n ≥ 8 scored rounds,
  rotated order, round 0 discarded, counts asserted, and load1 logged before every run. **Load is
  logged, never gated.** Quiet cannot be bought here (`ABC-108` `A1`).
- **For an ADDED file,** the base arm runs a one-assertion placeholder at the same path. `ABC-084`'s
  `E` arm is the precedent. The placeholder carries that instrument's own start-up and per-file cost,
  so **the reading is already net, and the 160 ms is NOT subtracted again.** The 160 ms per added file
  is charged to the floor account by count, with no timing.
- **The count/per-file model, in one line:** the floor is charged by file count × 160 ms, the spawn
  account by child count (`N8-SPAWN`), and the content by the narrow-set reading. **Only the content
  is timed.**

**3. A cut may not set a per-ticket timing bound below its instrument's recorded floor.**
- **The floor `F`** of an instrument and unit is the median R of the three most recent recorded
  readings on this machine. With fewer than three, it is the largest R recorded.
- **Today:**

| instrument and unit | F |
|---|---|
| full-lane CPU | **1.72 s** (`ABC-127` 0.76, `ABC-119` 3.12 / 1.72) |
| full-lane wall | 3.25 s |
| one-file CPU | **0.17 s** (0.13, 0.17) |
| one-file wall | 0.27 s |

- **So a full-lane per-ticket bound below 1.72 s CPU is refused at the cut.** That covers `N8-LANE`'s
  650 ms and `ABC-119`'s 0.30 s, and it is why both move to the narrow set. `N8-LANE` is unchanged in
  number.
- **A per-ticket wall bound is refused unless it names the failure mode it catches.** When that mode
  has a count (children spawned, files added, a `[*_DEEP]` log line), **the count is the pin, and the
  wall bound is not written.** This is `ADR-0017`'s shape. `ABC-119`'s wall bound was there to catch
  `AR-N8SPAWN-DRIFT` (+3.1 s). The full-lane wall R in QE's sets was 3.25 s and 4.39 s, so the bound
  could not see that drift. The 0 `[CLI_DEEP]` lines and 0 spawned children did see it.
- **A bound the cut cannot place above any floor is written as a count, or not at all.**
- **Owner of `F`:** Architect/Design, from the R that every reading now reports. BA/PM reads it at the
  cut, and Security/NFR checks it at the gate.

> **[AMENDED 2026-10-10 while `proposed` (task `wave-2026-09-25`, subtask
> `design-owed-rulings-2026-10-10`): `F` is keyed PER NARROW SET, not one figure for every single
> file. Still `proposed`. The owner has not ruled.]**
>
> **Why.** QE (`qe-ABC-058` `…904bdd2d`) and Security/NFR (`secnfr-ABC-058` `…ae61a3cb`) routed
> this. `src/cli.test.ts` spawns 27 children. Its twin R read 0.254 s and 1.097 s, which is above the
> one-file `F` of 0.17 s. That `F` came from lighter files.
>
> **The rule:**
> - **A set with readings.** A narrow set's `F` comes from **that set's own admissible readings**, by
>   the rule above: the median R of its three most recent, or the largest if it has fewer than three.
> - **A set with none.** It takes a provisional `F` of **16 % of its base CPU** (one run of the
>   harness). Its first admissible reading replaces it.
> - **Why 16 %.** It is the largest R ÷ base CPU on record: `src/cli.test.ts` set 2, 1.097 ÷ 6.95 s.
> - **Inadmissible sets.** Their R is listed but not used. Decision 1 gives them no state.
>
> **Why per set and not per "child-heavy" class: on the record, the spread follows the set's CPU,
> not its child count.**
>
> | narrow set | children | base CPU | admissible twin R | R ÷ CPU |
> |---|---|---|---|---|
> | `src/cli.test.ts` (`ABC-058` sets 1 and 2) | 27 | 7.99 s / 6.95 s | 0.254 s / 1.097 s | 3.2 % / 15.8 % |
> | `src/history-pane.nfr.test.ts` (`ABC-057` set 2) | 1 | 1.120 s | 0.058 s | 5.2 % |
> | `history-pane.nfr` + `render-seam.test` (QE `ABC-054`) | 1 | 1.371 s | 0.038 s | 2.8 % |
> | `ABC-128`'s file / `ABC-127`'s file (the table above) | 0 | ~2.01 s / ~1.51 s | 0.17 s / 0.13 s | 8.5 % / 8.6 % |
>
> - The one-child file reads a **smaller** ratio than the child-free files. A class keyed on children
>   would misfile it.
> - `ABC-059`'s two `src/cli.test.ts` sets were inadmissible (R 1.126 s and 0.662 s). Counted
>   anyway, they would not move that file's `F`: the median of the three most recent is still
>   1.097 s.
>
> **Floors today, per set:**
> - **`src/cli.test.ts`: `F` = 1.097 s.** A 650 ms `N8-LANE` reading on that file alone is refused
>   at the cut. Two other ways to bound it are already in use, and they stay:
>   - the pin is the count: `N8_SPAWN` 27 and the file count, as `ABC-058` `A7` does;
>   - or the content is timed directly, in process: `ABC-058`'s 0.154 ms, and `ABC-133` `A4`'s
>     ≤ 250 ms. "Only the content is timed" (decision 2).
> - **`src/history-pane.nfr.test.ts`:** `F` = 0.058 s.
> - **The two-file `history-pane.nfr` + `render-seam.test` set:** `F` = 0.038 s, the median of
>   0.052, 0.035 and 0.038 (`ABC-053` and `ABC-054`).
> - **The one-file row of the table above** (0.17 s) stays as the record of the two files it was
>   measured on.
>
> **Unchanged:** decision 1. Every reading still states its own R and is MET, NOT MET or UNRESOLVED
> on that R. This amendment changes only which bounds a cut may write.

**4. `QE-119-a` is ANSWERED, forward-only.**
- Under decision 1, `ABC-119` `A2`(ii) reads **UNRESOLVED at 0.30 s in both sets**. Set A's R is
  3.12 s and set B's is 1.72 s.
- The narrow set is `src/cli.real-engine.test.ts` against a placeholder, and it would have resolved
  the bound.
- `ABC-119` is `Done`, and QE's verdict stands as the rule was then written. **Nothing is re-opened.**
  The same holds for `ABC-036`, `ABC-051`, `ABC-127` and `ABC-128`'s recorded lines.

**5. `NFR-008` clause state — RULED on the row's own protocol. Both clauses are BREACHED.**
- **CPU (≤ 15 s): BREACHED since 2026-09-25.**
  - This is `ADR-0019` trigger (a), fired on the reference stack: 18.61 s and then 22.29 s at
    `ABC-079`, and 22.85–23.46 s at `ABC-122`. The full-lane R on those readings was 0.12–0.31 s,
    so they resolve the clause.
  - Today it reads 24.86–26.04 s on v26.11.0, which is 1.66–1.74x the level.
  - **Arithmetic check, labelled as a projection and not a reading:** `ADR-0019`'s 14.94 s at 40 files,
    plus 11 files × ~0.37 s, gives ~19.0 s on any stack. That is over 15 s with no Node effect at all.
- **WALL (≤ 3 s): BREACHED, by a bound that no warm/cold choice can move.**
  - Wall cannot be below CPU ÷ 8 logical cores. 24.86 ÷ 8 = **3.11 s**, even at perfect parallelism.
  - At the best parallelism ever measured on this lane (5.29x, warm, 2026-08-19), it is ≥ 4.70 s.
  - Deflate the CPU by the row's own +22 % thermal fence (24.86 → 20.4 s), and the wall is still
    ≥ 20.4 ÷ 5.29 = **3.85 s**.
  - The readings are 6.52–7.16 s. `ABC-111`'s warm/cold straddle was ±0.3 s.
  - **`ABC-111` no longer decides this verdict.** It would matter again only if a wall level were set
    within about R of a reading.
- **`N8-LANE` is a rate limit, not a grant** (`ADR-0014` decision 4, as `ADR-0019` Rollback (a)
  says). The standing sentence holds: write the measured ms, then the clause state.
- **The reference stack is re-declared as Apple M3 (Mac15,13) / 8 cores / Darwin 25.5.0 / Node
  v26.11.0 / vitest 3.2.7.** That is the stack that exists. v24.12.0 figures stay as history.
- **`Applies to` lists all seven opt-in variables unset.** The list is whatever
  `grep -rhoE 'process\.env\.[A-Z_]+_DEEP' src | sort -u` prints.

**6. RECOMMENDED to the owner (his word; no agent moves the level): re-scope rather than re-level.**
- **Keep ONE levelled clause, on what a human waits for:** `npm test` wall ≤ **W** at load1 ≤ 8 on
  the declared stack.
  - It is read as a trip-wire at each Security/NFR gate, which already reads the lane. A reading over
    W goes back to him.
  - **Suggested W = 10 s.** Today is 6.5–7.2 s. At ~0.10–0.14 s of wall per average file, that is
    ~20–30 files of runway.
- **The CPU total is REPORTED beside it and not levelled.**
  - The CPU level was derived from the wall: the 13 s is 3 s × the measured 4.15–5.07x, and the 15 s
    was his "for now" raise on it. It exists so that per-ticket deltas could be read in CPU.
  - Decision 2 now reads those deltas on the narrow set, so CPU stays the per-ticket instrument where it
    resolves.
  - The row's "each clause bounds the other's degenerate optimum" argument does not survive here. A
    wall-only bar is met by buying cores, and the reference machine is fixed. The CPU-only escape
    (`--no-file-parallelism`) is not reachable from a wall bar.

## Alternatives

- **Re-level both clauses, keeping the shape** (put to the owner as R-2). Suggested **CPU ≤ 32 s and
  wall ≤ 9 s**, about 25 % over today's lowest conforming medians.
  - Not recommended. The lane grew 14.9 → ~25 s and 40 → 51 files in three weeks, so the level would be
    exhausted on the same arc as 13 → 15. This would be the third escalation of one number.
- **Take a re-sized lever (i)** (R-3): move test files behind opt-in lanes.
  - Closing ~10 s of a ~25 s lane means ~40 % of default-lane CPU and a large coverage price.
  - QE's `OPT-1` (2.55 s at 40 files) no longer closes it, as Security/NFR noted at `ABC-079`.
  - **The size is `UNKNOWN - verify`.** It needs its own sizing hop and is not sized here.
- **Decline** (R-4). Both clauses stay BREACHED and `N8-LANE` stays a rate limit, and every gate
  writes so. The cost is a row that governs nothing, which is the state since 2026-09-25.
- **Test the twin's bootstrap CI** (QE's suggestion). It is equivalent in purpose and rejected for
  form: it needs a seeded resampler at every gate. The order statistic is hand-checkable from the
  eight deltas already in every TSV.
- **Raise n until the full lane resolves 0.30 s.** Rejected. At an R of 1–3 s, shrinking it ~5–10x
  needs on the order of 25–100x the rounds (R falls about as 1/√n). At 3 arms × ~10 s per run under
  load, that is ~2–7 hours per gate.
- **Gate on load (wait for load1 < 4).** Rejected. `ABC-108` `A1` measured that quiet cannot be bought
  here: the harness alone lifts load1 above 1.0. `ABC-127`'s gate waited 120 s and still ran at 16–25.

## Consequences

- **BA/PM at each cut:**
  - Write per-ticket timing bounds on the narrow set and at or above `F`.
  - Write a count where a count exists.
  - `N8-LANE ≤ 650 ms` lines need no re-cut. They are read on the narrow set from acceptance.
  - For value-changing engine tickets (`ABC-083`, `ABC-087`), the related set may be most of the lane.
    In that case expect UNRESOLVED at 650 ms unless the effect is large, and state the related set at
    the pull.
- **QE and Security/NFR at each gate:**
  - Report R. Report UNRESOLVED as UNRESOLVED.
  - A full-lane reading is still the right instrument for the total and for a large charge (decision 1,
    NOT MET at any R).
- **`ABC-108`** (re-measure on a quiet machine and rule the 13 s clause) is overtaken. The clause was
  ruled by `ADR-0014`, re-levelled by `ADR-0019` and ruled BREACHED here, and its `A1` is
  unsatisfiable. Recommend that BA/PM close it as superseded.
- **`ABC-111`** (warm/cold for the wall clause) no longer decides the verdict (decision 5). Recommend a
  BA/PM re-score. Its own demotion trigger needs the owner's words, so if he takes W, re-derive against
  W then.
- **The owner is asked once,** with the four options and their numbers beside them.

## Rollback

- **Decision 1:** if a later record shows R ≤ `b` readings flipping sides of `b` (the `QE-119-a`
  defect reappearing), the resolution clause is wrong. Revert to the median-only rule and re-open
  this question. Nothing in code changes either way.
- **Decision 3's floors are data, not policy.** They fall when load falls or the instrument changes,
  and are re-read from the next three readings.
- **Decision 5 flips to MET** on a conforming reading with median CPU ≤ 15 s (and wall ≤ 3 s) at a
  named commit. A reading at or below 13 s also triggers `ADR-0019` (b).
- **Decision 6 is the owner's.** If he declines it, R-4 holds, and this ADR's decisions 1–5 stand
  without it.

## § Pointers 2026-10-11

Written by Architect/Design (task `wave-2026-09-25`, subtask `design-low-batch-2026-10-11`), the owner of
this protocol. These are readings and one erratum. **No decision changes, no level moves, and nothing was
measured at this hop.** Notes: `.grugops/context/design-low-batch-2026-10-11/notes/`.

**P1. The clause's file set is what `npm test` collects, and that includes `tools/` (note `…7bf3d1ce`).**
- **The question.** The `NFR-008` row says the lane is *"measured as `npx vitest run --dir src` (`ADR-0035`
  decision 5)"*. `ADR-0037` placed `tools/opening-book/book.test.ts` outside `src/`, and `vitest.config.ts`
  does not exclude `tools/`.
- **The reading.** R-1's levelled clause is *"`npm test` wall ≤ W"*, and its subject is what a human waits
  for. That is every file `npm test` collects, which includes `tools/opening-book/book.test.ts`. The CPU
  total reported beside it is read on the same set.
- **This ADR never named `--dir src`.** It has 0 occurrences here. The row's attribution to decision 5 is a
  transcription slip. The form comes from the `ADR-0017` and `ADR-0019` protocols, written when the two
  sets were equal.
- **The instrument for the total** is `npm test`, or `npx vitest run` at the repository root with no
  `--dir`. Its count is the set `node tools/grugops/lane-inventory.js` collects. A `--dir src` run after
  `ac83c3fd` (the `ABC-093` merge) is one file short (52 against 53), so it is not a reading of the
  clause. Label it if one is taken.
- **History stands.** No test file outside `src/` was collected before `5332f501`, the commit that added
  the first one. The `.grugops/` probes are excluded. So every `--dir src` reading before `ac83c3fd` was a
  reading of the same set.
- **Decision 2 is unchanged.** A ticket that adds or modifies a `tools/` test file puts it in its narrow
  set. Whether `npx vitest related` also pulls `book.test.ts` in for a change to a `src/` module that
  `tools/opening-book/compile.ts` imports is `UNKNOWN - verify`. It was not run at this hop.
- **Owed (Security/NFR, at the next catalog hop):** replace the row's *"measured as `npx vitest run --dir
  src` (`ADR-0035` decision 5)"* and its flag *"0 today"* with this reading.

**P2. Erratum: `ABC-084`'s base arm is 49 files and 1 530 tests, not 51 and 1 541 (note `…a727a0fb`).**
- **What the runs read.** Security/NFR's `ABC-084` runs 1 and 3 (`secnfr-ABC-084`,
  `raw-out-lane-run1-summary.txt` and `raw-out-lane-run3-summary.txt`) give the figures 24.86 s / 6.52 s
  and 26.04 s / 7.16 s. Both are base arm B, `7b54dae`, and the harness asserted **49 / 1530** on every
  run.
- **The git recount at `7b54dae` agrees.** It finds 49 `*.test.ts` outside `.grugops/`, or 51 counting
  the two committed probes that the lane excludes.
- **Which one is stale.** The stale one is this ADR's Context sentence, now marked inline. The 51 is the
  lane at this ADR's own base, `2320269b` (git count, 51). The 1 541 matches no harness-asserted arm in
  the `ABC-084` files, so where it came from is `UNKNOWN - verify`. The proposal note `…45cf4e0d` and the
  catalog's 2026-10-10 section both read 49, and both are right.
- **No verdict moves.** Decision 5's projection reads about 18.3 s at 49 files (14.94 + 9 × 0.37). That is
  still over 15 s, and the verdict is history under R-1 anyway. The Alternatives line "40 → 51 files" is
  the lane at `2320269b`, and it stands.
- **Owed (Security/NFR, at the next catalog hop):** retire the catalog's *"File-count note, flagged rather
  than resolved"* with a pointer here.

**P3. `N8-LANE`'s 5 % is 5 % of the 13 s CPU level, and 650 ms is now a fixed number (note
`…5ad29a76`).**
- **The question.** `N8-LANE` reads *"at most 5 % of `NFR-008`'s TOTAL — ≤ 650 ms CPU while the CPU clause
  is 13 s"*. Under R-1 there is no CPU level for it to be 5 % of.
- **The level it is read at:**
  - **The 13 s CPU level** that the owner ratified on 2026-08-11. `ADR-0014` decision 4 fixed 650 ms
    there.
  - **Not 15 s.** The 2026-09-19 section refused to run 750 ms into the bar.
  - **Not W.** W is wall, and the row measured a per-ticket wall delta as unmeasurable by construction:
    −15 to +3 ms per added file.
- **Under R-1, the bar is the number:** ≤ 650 ms CPU on the narrow set, a rate limit (`ADR-0014`
  decision 4). The "5 %" is its provenance and no longer arithmetic over a live level. This is the
  reading this ADR's Scope fence and Consequences already imply. It is written down here.
- **The load level: none.** A reading is taken at whatever load1 the harness logs, which decision 2 logs
  and never gates. Load enters only through R. A reading resolves 650 ms only when the twin's R is
  ≤ 650 ms (decision 1). On today's per-set floors, `src/cli.test.ts` (1.097 s) cannot resolve it, and
  the count is its pin (the amendment under decision 3).
- **Re-derivation trigger.** If a CPU total is levelled again, re-derive `N8-LANE` at that hop by the
  row's own rule (*"Where 5 % comes from"*). The owner's lane-CPU goal (handoff #5 item 3) may end in such
  a level. Until then 650 ms stands.
- **Owed (Security/NFR, at the next catalog hop).** Replace *"≤ 650 ms CPU while the CPU clause is 13 s"*
  with *"≤ 650 ms CPU, fixed at 5 % of the 13 s level ratified 2026-08-11. Under R-1 no CPU level exists,
  and 650 ms stands as a number (`ADR-0035` § Pointers 2026-10-11 P3)"*. Then retire the paragraph
  *"Recorded, not ruled: what `N8-LANE`'s 5 % means under R-1"*.

## § Addendum 2026-10-12

Written by Architect/Design (task `wave-2026-09-25`, subtask `design-ABC-105-lane`), the owner of this protocol,
after `ABC-105` merged as `f6400877`. **Nothing was measured at this hop.**
- **Source of the figures.** Every figure was recomputed from the raw per-run TSVs of `qe-ABC-105`,
  `qe3-ABC-105-lane` and `qe4-ABC-105` by this hop's own script, in integer centiseconds
  (`.grugops/context/design-ABC-105-lane/probe/recompute.py` → `recompute.out.txt`).
- **Agreement with QE.** The recompute agrees with QE's readouts on every figure QE graded.
- Notes are in `.grugops/context/design-ABC-105-lane/notes/`.

### A1. `QE-105-ab`: the admissibility limit gets a one-tick floor. Decision 1 is amended, forward-only

**The defect.**
- `/usr/bin/time -p` prints user and sys in 10 ms ticks. CPU is user + sys, so every per-round twin delta is a
  whole number of ticks, and the median of eight is a multiple of 5 ms.
- On this set the B median is 0.570–0.575 s, so 1.5 % is 8.55–8.63 ms. **A twin median of ±0.010 s always
  fails. Only 0.000 or ±0.005 s can pass.** The clause asks for a resolution finer than the instrument
  prints.
- The defect binds wherever the B median is below 0.667 s (0.010 ÷ 0.015).

**What it cost on the record.** Two of the four non-void windows on this set failed on it, each by a single
tick: QE3 w1 (+0.010 s = 1.739 %) and QE4 w2 (+0.010 s = 1.754 %).

**Ruled.**
- **Admissible** means |twin median| ≤ **max(1.5 % of the B median, one tick)**, in the unit's own
  instrument.
  - The tick is 0.010 s for `/usr/bin/time -p`, for CPU and wall alike. A different timer states its own tick.
  - At a base of 0.667 s or more, this is the 1.5 % clause unchanged. The full lane and `src/cli.test.ts`
    (5.61 s) are not affected.
- **"Sign at chance"** is the two-sided sign test on the **non-zero** deltas, at p > 0.05. A zero delta lies
  inside one tick, so it has no sign.
  - QE's readout scripts (`readout105.py`, `readout-qe3.py`, `readout-qe4.py`) count the positives against
    everything else, which treats a zero as a negative. That can admit a twin that the test above refuses:
    6 positive and 2 zero reads p 0.289 by the scripts and p 0.031 by the rule.
  - On the six `ABC-105` windows, and on `ABC-116`'s `src/cli.test.ts` twin, the two conventions give the same
    admissibility. **No recorded state moves.**
- **Forward-only.**
  - The rule applies to a window whose pre-registration lands on `main` after this addendum does. A window
    with no pre-registration counts from its first run.
  - A window already graded stays as graded. Changing an admissibility rule after the window has been seen,
    and then grading that window, is the fault a pre-registration exists to stop.
  - **So QE3 w1 and QE4 w2 stay INADMISSIBLE, with no state.**

**What each would read under the amended clause.** This is recorded, not regraded:

| window | code | twin CPU: median, signs, R | admissible under A1? | treatment H − B: median, x(2)..x(7) | would read at 650 ms |
|---|---|---|---|---|---|
| QE3 w1 | `db1cfb6c` | +0.010 s (1.739 %); 7 +, 1 −; p 0.070; R 0.010 s | yes | +0.670 s, +0.660..+0.700 | NOT MET (the lower end is over the bound by one tick) |
| QE4 w2 | `8fd0c233` | +0.010 s (1.754 %); 5 +, 2 −, 1 zero; p 0.453; R 0.030 s | yes | +0.370 s, +0.370..+0.400 | MET |

- **The QE4 w2 line is not a MET.**
  - That window was graded inadmissible under the rule in force when it ran, and the line above is only what
    A1 would say about it.
  - `N8-LANE` at `8fd0c233` stays **NOT READ** (QE4 `…6a647762`).
  - The merge rests on the owner's ruling, not on this line. See the catalog section "`N8-LANE` at `ABC-105`".
- **The QE3 w1 line** agrees with QE3 w3's graded NOT MET at the same code. `8fd0c233` superseded `db1cfb6c`.

**Alternatives rejected.**
- **Keep 1.5 % as it is.**
  - It refuses one-tick medians on every set under 0.667 s. That refuses windows for quantisation, not for
    bias.
  - It also wastes width-1 windows, which this factory cannot buy at will. QE3 needed three windows and QE4
    needed two.
- **A two-tick floor (20 ms).**
  - One delta's quantisation error can reach ±20 ms, because each arm truncates twice.
  - But no window here failed by more than one tick, and two ticks is 3.5 % on this set. It is wider than
    needed.
- **Change the timer** (microsecond `getrusage` of the child).
  - This is the real fix for resolution.
  - But it changes the harness, which every per-set floor and pre-registration names by sha256 (`lane144b.mjs`,
    `652b7793…c80c7c`). Every recorded `F` would then need a re-read.
  - **It becomes the route if a bound is ever cut within a few ticks of a reading.** That is not the case at
    650 ms.

**Rollback.** Apply decision 1's own rollback test. If a twin that only the floor admits (a one-tick median) is
followed by readings that flip sides of a bound, revert to 1.5 % and take the timer route.

### A2. Per-set `F`: `tools/grugops/qe-hop-integrity.test.ts` = 0.020 s CPU / 0.020 s wall

**The set.**
- The file, against the one-assertion placeholder at the same path (`qe-ABC-105/probe/placeholder.test.ts`,
  `cmp` 0 in all three hops).
- vitest 4.1.11, runner off, `maxWorkers: 2`.
- A symlinked, shared `node_modules`, which is the condition stated in the § Status per-set paragraph.

**Admissible twin readings** (decision 1 as written when they ran; n = 8, k = 2):

| reading | code / notes in the arm | load1 | twin CPU, sorted (x(2), x(7) bold) | CPU R | wall R |
|---|---|---|---|---|---|
| `qe-ABC-105` | `60415a8a` / 2624 | 5.10–5.31 | −0.13, **−0.01**, −0.01, 0.00, 0.00, 0.01, **0.01**, 0.01 | 0.010 s | 0.010 s |
| QE3 w3 | `db1cfb6c` / 2636 | 3.13–3.28 | −0.01, **−0.01**, 0.00, 0.00, 0.00, 0.00, **0.02**, 0.03 | 0.020 s | 0.020 s |

- **The wall twins are admissible too:** −0.005 s (−1.16 % of 0.430 s) and 0.000 s.
- **There are two readings, so the largest R governs: `F` = 0.020 s CPU / 0.020 s wall.**
  - It replaces the provisional 16 %, which is 0.091–0.092 s on these bases.
  - From the third admissible reading on, the median of the three most recent governs.
- **Listed, not used:**
  - QE3 w1 (R 0.010 / 0.010) and QE4 w2 (R 0.030 / 0.020) are inadmissible.
  - QE3 w2 and QE4 w1 are void.
- **What it changes at the cut.**
  - A CPU bound on this set at or above 0.020 s is not refused, and 650 ms is far above that.
  - A wall bound must still name its failure mode (decision 3).
  - The count pins stay: 1 file, 0 spawns, 0 `src/` files.
- Both twin arms run the placeholder, so the file's own growth (A3) does not move `F`.

### A3. A set whose cost grows with the record: a re-read trigger on the record's size, not `N8-LANE` text

**The mechanism.**
- The file's content cost is mostly whole-tree reads of the real notes (`QE-105-x`).
- Since `fix2-ABC-105` there are 2 reads per run. QE4 counted 5366 note files read, which is 2.032 × 2641.
- Each read costs in proportion to `.grugops/context`, and every hop grows that. **So the cost moves after
  the merge, with no ticket to charge it to. `N8-LANE` assumes a cost that is fixed at merge.**

**Projection.** This is arithmetic over two admissible readings. It is not a reading and has no state.
- The two windows: +0.475 s with 3 reads at 2624 notes, and +0.690 s with 5 reads at 2636 notes.
- The 2 extra reads cost 0.215 s, so one whole-tree read is about 0.1075 s at ~2630 notes, or ~41 µs a note.
  That leaves ~0.153 s that is not a read.
- At 2 reads, the content is about 0.153 + 0.215 × N / 2630 s. **That crosses 650 ms at N ≈ 6,100 notes.**
- **Limits.**
  - The two windows ran at different loads (5.1–5.3 and 3.1–3.3), and they are not paired.
  - The projection assumes the cost is linear in N.
  - QE4 w2's ungraded +0.370 s is not used.

**How fast the record grows.** This is a git count of `.grugops/context/*/notes/*.md` at each commit:

| commit | date | notes |
|---|---|---|
| `81add970` | 2026-08-21 | 1682 |
| `90457728` | 2026-09-27 | 1970 |
| `0ff618be` | 2026-10-11 | 2513 |
| `6ae6dd27` | 2026-10-12 | 2645 |

- That is ~39 notes a day over the last fortnight, and 132 on 2026-10-12 alone.

**Ruled: the trigger is 4,000 note files**, counted by `find .grugops/context -path '*/notes/*.md' | wc -l` on
`main`.
- At 4,000 notes the projection reads ~0.48 s. That is about the share of the bound the first MET read
  (73–74 %), so a re-read at the trigger still has room to land under the bound.
- At ~39 notes a day, the trigger is about five weeks away.

**Not `N8-LANE` text.**
- `N8-LANE` is the standing bar that every ticket inherits, and this is one file.
  `tools/grugops/qe-hop-integrity.test.ts` is the only test file that reads `.grugops/context` (a grep over the
  `src/` and `tools/` test files at `6ae6dd27`).
- One file is a risk with a trigger, not a clause. It is recorded in the catalog as `RISK-ABC105-LANE`.
- **If a second test file reads the record, lift this into `N8-LANE`**, worded as: "a set that reads
  repository data states that data's size beside the reading, and the reading holds at that size."

## § Addendum 2026-10-12 (after ABC-154)

Written by Architect/Design (task `wave-2026-09-25`, subtask `design-ABC-154-close`), the owner of this protocol,
after `ABC-154` merged as `4537fb11`. **Nothing was measured at this hop.**
- **Source of the figures.** This hop's own script recomputed every figure from the raw per-run TSVs of
  `qe-ABC-154` w1, `qe-ABC-105`, QE3 w3 and QE4 w2, in integer centiseconds
  (`.grugops/context/design-ABC-154-close/probe/recompute.py` → `recompute.out.txt`).
- **Agreement with QE.** The recompute agrees with QE's `…4e153e76` on every figure.
- Notes are in `.grugops/context/design-ABC-154-close/notes/`.

### B1. `QE-154-b`: A1's forward-only clause is met by a pre-registration that reaches `main` by merge

**The question.** A1 applies "to a window whose pre-registration lands on `main` after this addendum does".
`qe-ABC-154`'s pre-registration was committed on QE's branch and reached `main` only through the merge.

**The facts, from git:**
- The addendum (merge `e7d8a09f`) was committed at 10:58:38Z.
- The pre-registration was committed at 11:25:18Z as `b9a5c957`, and `e7d8a09f` is its ancestor.
- The gate started at 11:25:25Z, and the first lane run was at 11:26:11Z.
- `b9a5c957` is an ancestor of `main`. The file's blob is `5b865730` at `b9a5c957` and on `main`, and no other
  commit touches it.

**Ruled: this satisfies A1.**
- The clause exists so that a rule cannot be chosen after the window has been seen (A1, "Forward-only").
- What that requires is an order: the rule is public, then the pre-registration is fixed, then the window runs.
  The pre-registration also has to reach the record unchanged.
- "Lands on `main`" was a stand-in for that order. QE never merges, so a QE pre-registration reaches `main` only
  by someone else's merge, after the window.

**The wording, clarified.** The old text is kept above and is read as follows from this date:
> A1 applies to a window whose pre-registration is committed **before the window's first run**, on a commit that
> **has this addendum as an ancestor**, and that reaches `main` **with the same blob**. A window with no
> pre-registration counts from its first run.

**No recorded state moves:**
- `qe-ABC-105` and QE3 w1–w3 ran before `e7d8a09f` existed.
- QE4's pre-registration `9ed227fa` does not have `e7d8a09f` as an ancestor. So QE4 w1 and w2 stay as graded, and
  QE4 w2 stays inadmissible.
- `qe-ABC-154` w1 is A1's, as QE applied it.
- That window is also admissible under the pre-A1 rule: −0.870 % is inside 1.5 %, and the old convention gives
  p 0.070. So no state here hangs on B1 at all.

### B2. `QE-154-c`: the set's `F` stays 0.020 s CPU / 0.020 s wall

**The admissible twin readings on `tools/grugops/qe-hop-integrity.test.ts`**, oldest first (n = 8, k = 2):

| reading | code | twin CPU, sorted (x(2), x(7) bold) | CPU R | wall R |
|---|---|---|---|---|
| `qe-ABC-105` | `60415a8a` | −0.13, **−0.01**, −0.01, 0.00, 0.00, 0.01, **0.01**, 0.01 | 0.010 s | 0.010 s |
| QE3 w3 | `db1cfb6c` | −0.01, **−0.01**, 0.00, 0.00, 0.00, 0.00, **0.02**, 0.03 | 0.020 s | 0.020 s |
| `qe-ABC-154` w1 | `0f8036f9` | −0.04, **−0.03**, −0.02, −0.01, 0.00, 0.00, **0.00**, +0.02 | 0.030 s | 0.030 s |

- **This is the third reading, so the median of the three most recent governs.**
  - CPU: 0.010, 0.020 and 0.030 give **0.020 s**.
  - Wall: 0.010, 0.020 and 0.030 give **0.020 s**.
  - **`F` is unchanged.** Its basis changes from "the largest of two" to "the median of three".
- **The value depends on A1's forward-only clause, and that is stated here rather than hidden.**
  - QE4 w2 (R 0.030 CPU / 0.020 wall) is inadmissible as graded and is not counted.
  - If it were counted, the last three would be QE3 w3, QE4 w2 and `qe-ABC-154` w1, and CPU `F` would be 0.030 s.
  - Neither value is anywhere near a cut. 650 ms is 22–33 × either.
- Both twin arms run the placeholder, so `F` does not move with the file's content or with the record's size.

### B3. `RISK-ABC105-LANE` closes. A3's re-read trigger survives it as `T-QEHOP-GROWTH`

**The closure.**
- The catalog's rule for `RISK-ABC105-LANE` was "MET: write the reading and close the risk".
- `qe-ABC-154` w1 reads **MET at 650 ms CPU**: +0.380 s (+0.350..+0.410), twin −0.005 s, R 0.030 s.
- The code read was `0f8036f9`, which is on `main` through `4537fb11`. The reading was owed under trigger T-b.
- The catalog records the reading and closes the risk (`plans/nfr-catalog.md` § "`N8-LANE` at `ABC-105`").

**Why the 4,000-note trigger survives.**
- T-c was written as one of the risk's triggers, but it guards a different thing.
  - The risk was "no graded reading exists at the merged code". The MET discharges that.
  - T-c guards A3's mechanism: the set's content cost grows with `.grugops/context`, after the merge, with no
    ticket to charge it to.
- The MET does not touch that mechanism. The record had 2656 note files in the arm, and `main` has 2660 at
  `b89b3fd2`.
- **Dropping T-c with the risk would lose the only guard on a cost that moves by itself.** So it is re-homed.

**`T-QEHOP-GROWTH`: a named re-read trigger on the set `tools/grugops/qe-hop-integrity.test.ts`.**
- **Fires** when `find .grugops/context -path '*/notes/*.md' | wc -l` on `main` reaches **4,000**.
- **Does:** the set's `N8-LANE` is re-read at `main`'s tip, on the method of the `qe-ABC-154` pre-registration.
  - **MET:** write the reading. Architect/Design sets the next threshold by the same arithmetic.
  - **NOT MET:** it goes to the owner. The lever is the count of whole-tree reads.
  - **NOT READ:** the trigger stays armed.
- **Roles:** Architect/Design owns the record, QE/E2E reads, and the Orchestrator dispatches. Severity LOW. It is a
  scheduled re-read, not an open defect.
- **A changing ticket's own reading resets nothing.** It is owed at its QE anyway, and the threshold stays 4,000.

**The projection, re-anchored.** This is arithmetic, not a reading, and it has no state
(`probe/projection.py`):
- A3's model gives 0.153 + 0.215 × N / 2630 s at 2 reads, which is **0.370 s at 2656 notes**. The reading is
  +0.380 s (+0.350..+0.410). The model is not contradicted. The 60 ms interval cannot validate it either.
- Anchored on the new reading, with A3's slope of 81.75 µs a note at 2 reads:
  - at 4,000 notes it projects **~0.49 s** (75 % of 650 ms), or ~0.52 s from the interval's upper end;
  - it crosses 650 ms at N ≈ 5,960 (≈ 5,590 from the upper end).
- **4,000 stays.** The re-read lands with room under the bound, and it is ~34 days out at A3's ~39 notes a day.
- The limits are A3's own. The slope comes from two unpaired windows at different loads, and linearity in N is
  assumed.

**A3's lift clause is carried unchanged.** If a second test file reads the record, `T-QEHOP-GROWTH` becomes
`N8-LANE` text. At `b89b3fd2` the set is still the only one. The `src/` test files name `.grugops/context` in
comments only, and `vitest.config.ts` excludes `.grugops/**`.

### B4. `QE-154-d`: load1 8.88 during w1 does not bear on admissibility

**Ruled: no bearing, and there is no new rule.**
- Decision 2 says load is logged and never gated.
- § Pointers 2026-10-11 says "The load level: none". Load enters only through R.
- R-1's "load1 ≤ 8" is the levelled full-lane wall clause (decision 6). It does not apply to a narrow-set
  `N8-LANE` reading.
- The void rule in the pre-registration lists the conditions that discard a round: status, counts, foreign runner,
  thermal and power. Load is not one of them. 0 rounds were discarded, and the sampler shows 0 bad rows in the lane
  interval.

**What the TSV shows** (`probe/recompute.out.txt`, per-round table):
- **The high-load rounds do not read higher.**
  - Round 1, with load1 3.21 before every arm, reads H−B +0.41. Round 2 reads +0.41, with B and T at 3.21 and H
    at 8.88.
  - Rounds 3–8 (load1 7.90–8.88) read +0.34..+0.42, median +0.36.
- **The load shows in the twin, which is its control.**
  - Its three negative deltas, −0.04, −0.03 and −0.02, are rounds 6–8, with load1 7.90–8.33 before the runs. In
    those rounds B ran 0.02–0.04 s CPU slower than T.
  - That is why R is 0.030 s, the largest of the three admissible readings. The median-of-three rule in B2 absorbs it.
- **Inference, `UNKNOWN - verify`.** load1 decays from 8.88 to 7.51 over ~16 s. That is how a one-minute average
  behaves after a short burst, not under a sustained load near 9. The cause of the burst is not known.

**Rollback.**
- B1: restore the literal reading of "lands on `main`". No recorded state changes, because w1 is admissible under
  the pre-A1 rule as well.
- B2 is arithmetic.
- B3: folding `T-QEHOP-GROWTH` back into a risk changes only where it is written.
- B4 adds nothing to roll back.
