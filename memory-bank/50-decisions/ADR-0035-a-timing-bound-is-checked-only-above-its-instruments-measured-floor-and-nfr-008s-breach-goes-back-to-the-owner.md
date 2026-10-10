# ADR-0035: A timing bound is checked only above its instrument's measured floor; per-ticket cost is read on the narrowest file set; `NFR-008` is BREACHED on both clauses and goes back to the owner with a re-scope recommended

## Status

`proposed` — 2026-10-10, by Architect/Design (task `wave-2026-09-25`, subtask `ruling-timing-protocol`),
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
and 7.5). That is 51 files and 1 541 tests. `ABC-084` run 2 is inadmissible: its null is +1.66 %.

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
