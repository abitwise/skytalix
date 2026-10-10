---
id: 20261010T105455Z-architect-design-decision-qe-119-a-ruled-bound-checked-only-above-floor-narrow-file-set-nfr008-breached-both-clauses-recommend-rescope-16f50d6f
kind: decision
by: architect-design
at: 2026-10-10T10:54:55Z
verified_by:
confidence: high
refs:
  - QE-119-a
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - ADR-0035
  - ADR-0019
  - ADR-0014
  - ADR-0017
  - ADR-0008
  - AR-N8LANE-079
  - ABC-119
  - ABC-111
  - ABC-108
  - ABC-083
  - ABC-087
  - ABC-085
  - ABC-036
  - ABC-051
  - ABC-127
  - ABC-128
  - memory-bank/50-decisions/ADR-0035-a-timing-bound-is-checked-only-above-its-instruments-measured-floor-and-nfr-008s-breach-goes-back-to-the-owner.md
  - 20261010T105455Z-architect-design-observation-floors-from-the-record-full-lane-r-0p45-3p12s-one-file-0p13-0p17s-lane-24p9-26p0s-45cf4e0d
  - .grugops/context/qe-ABC-119/notes/20261010T103438Z-qe-e2e-observation-abc119-gap-register-b300968a.md
  - .grugops/context/rule-abc119-a2/notes/20261010T100852Z-ba-pm-decision-9f278676.md
supersedes:
---

# `QE-119-a` is ruled in `ADR-0035` (proposed). A bound is checked only when the twin's spread R ≤ the bound, per-ticket cost is read on the narrowest file set, and a cut may not set a bound below the instrument's floor. `NFR-008` is **BREACHED on both clauses**. **Recommended to the owner: re-scope to one wall level (W = 10 s), with CPU reported**

This note is hand-authored. The ADR is the authority, and the evidence is `…45cf4e0d`. This is the
summary the next hop reads first.

## Ruled (Architect/Design's; the ADR is `proposed`, and acceptance is owed)

1. **Resolution clause.**
   - The admissibility rule (twin median ≤ 1.5 %, sign at chance) **stays, and a second test is
     added.**
   - A reading checks bound `b` only if the twin's **R ≤ `b`**. R is read from the twin's per-round
     deltas: at n = 8, drop the single most extreme delta at each end and take the larger magnitude
     left. That is 93 % coverage, and the ADR has the table for other n.
   - **The reading's state:**
     - **MET:** resolves `b` and median ≤ `b`.
     - **NOT MET:** resolves `b` with median > `b`, **or** the treatment's own lower interval end
       is > `b` at any R.
     - **UNRESOLVED:** anything else. It is neither a pass nor a fail. Its charge is written "at most"
       the treatment's upper interval end.
   - **Every paired reading reports R.**
2. **The instrument for per-ticket cost is the narrowest file set.**
   - **The set:** the files the ticket adds or modifies, plus the output of
     `npx vitest related --run <modified src files>` (checked at this hop: 2 files for
     `src/line-input.ts`).
   - **The harness:** the three-tree harness, n ≥ 8, with load1 logged and never gated.
   - **An added file** is read against a **one-assertion placeholder** at the same path, which is
     `ABC-084`'s `E` arm. That reading is already net, so **do not subtract 160 ms again.**
   - **What is timed:** the floor is charged by file count × 160 ms and the spawn account by child
     count. Only the content is timed. **The full lane is the instrument for the `NFR-008` total
     only.**
3. **Refused at cut.**
   - No per-ticket timing bound below the instrument's floor `F`. `F` is the median R of the last three
     readings.
   - **Today:** full-lane CPU **1.72 s**, full-lane wall **3.25 s**, one-file CPU **0.17 s**, one-file
     wall **0.27 s**.
   - A wall bound must name the failure mode it catches. If that mode has a count, **the count is the
     pin** (`ADR-0017`).
4. **`QE-119-a` answered, forward-only.**
   - `ABC-119` `A2`(ii) reads UNRESOLVED at 0.30 s in both sets (R 3.12 s and 1.72 s).
   - **No ticket is re-opened.**
5. **`NFR-008`: both clauses ruled BREACHED.**
   - **CPU:** over 15 s since 2026-09-25, on the reference stack. This is `ADR-0019` trigger (a): 18.61
     → 22.29 s at `ABC-079`, and 22.85–23.46 s at `ABC-122`. Today it reads 24.86–26.04 s,
     1.66–1.74x.
   - **Wall:** 6.52–7.16 s today. **CPU ÷ 8 cores = 3.11 s, so no protocol choice gets it under
     3 s.** `ABC-111` no longer decides it.
   - **`N8-LANE`** is a rate limit (`ADR-0014` decision 4).
   - **Stack re-declared to Node v26.11.0.** v24.12.0 is not installed.
   - **`Applies to`** lists all seven `*_DEEP` variables.

## Recommended (the owner's word; no agent moves a level)

**R-1, recommended: re-scope.**
- `NFR-008` keeps one levelled clause: **`npm test` wall ≤ W at load1 ≤ 8** on the declared stack,
  read at each Security/NFR gate.
- **Suggested W = 10 s.** Today is 6.5–7.2 s, which leaves ~20–30 average files of runway.
- **The CPU total is reported and not levelled.** The CPU level was derived from the wall so that
  per-ticket deltas could be read. Decision 2 now reads those on the narrow set.
- `N8-LANE`'s 650 ms is unchanged.

**The other options put to him:**
- **R-2, re-level both:** CPU ≤ 32 s / wall ≤ 9 s, about 25 % over today. On three weeks' growth
  (+10 s CPU, +11 files) it lasts weeks. This would be the third escalation of one number.
- **R-3, re-sized lever (i):** move test files behind opt-in lanes. It needs ~40 % of the lane's
  CPU out of the default lane. **The size is `UNKNOWN - verify`, and the sizing hop is owed before it
  can be offered.**
- **R-4, decline:** both clauses stay BREACHED and every gate writes so. The row governs nothing, as it
  has not since 2026-09-25.

## Proposed `plans/nfr-catalog.md` wording (for the row's owner to apply after acceptance; NOT applied here)

**(a) The `NFR-008` row, `Applies to` cell.** Replace the cell's opening, *"`npm test` (= `vitest
run`) with `PERFT_DEEP` **unset**"*, with:

> `npm test` with **every opt-in lane variable unset**: `PERFT_DEEP`, `SEARCH_DEEP`, `ENGINE_DEEP`,
> `INPUT_DEEP`, `ZOBRIST_DEEP`, `PUZZLE_DEEP`, `CLI_DEEP` (seven at `2320269b`; the list is
> `grep -rhoE 'process\.env\.[A-Z_]+_DEEP' src | sort -u`), measured as `npx vitest run --dir src`.

Then replace *"**NOT** the `PERFT_DEEP=1` lane"* with *"**NOT** any opt-in lane"*.

**(b) The `NFR-008` row, `Target` cell.** After the reference-machine clause, insert:

> **Reference stack RE-DECLARED 2026-10-10 (`ADR-0035`): Apple M3 (Mac15,13) / 8 logical cores /
> Darwin 25.5.0 arm64 / Node v26.11.0 / vitest 3.2.7. v24.12.0 is no longer installed on this machine;
> figures taken on it are history.** **Clause state 2026-10-10: CPU BREACHED (24.86–26.04 s), WALL
> BREACHED (6.52–7.16 s). Both are ruled in `ADR-0035`. The levels are unchanged and are the owner's.**

**(c) `N8-LANE` block.** Replace the *"Instrument"* bullet with:

> - **Instrument: CPU (user + sys) of the NARROWEST FILE SET containing the change, NOT the whole lane
>   (`ADR-0035` decision 2).**
>   - The set is the test files the ticket adds or modifies, plus `npx vitest related --run <modified
>     src files>`.
>   - An added file is read against a one-assertion placeholder at the same path. That reading is
>     already net of the per-file floor.
>   - The whole lane stays the instrument for `NFR-008`'s total.

Replace the *"Admissible only with an identity null control"* bullet with:

> - **Admissible only with an identity null control** (a `cmp`/`diff -r` twin in the same interleaved
>   harness) **whose median reads ≤ 1.5 % with its sign at chance.**
> - **It RESOLVES a bound `b` only if the twin's spread R ≤ `b`.** At n = 8, R is the larger magnitude
>   of the 2nd-smallest and the 2nd-largest per-round twin delta. Other n are in `ADR-0035` decision 1.
> - The states are MET, NOT MET (including a treatment lower interval end > `b` at any R) and
>   UNRESOLVED.
> - UNRESOLVED is never written MET. Every reading reports R.

Replace the *"NET of the per-file floor"* bullet's first sentence with *"**The per-file floor is
charged by COUNT** (160 ms × test files added) to the floor account and is never timed per ticket."*

Replace the *"Scope … Denominator"* bullet with *"**Scope and denominator:** the narrow set at `<base>`
vs `HEAD`, three out-of-tree trees, n ≥ 8, load1 logged before every run and never gated."*

**(d) After `## NFR-008's CPU LEVEL IS 15 s …`, append this section:**

> ## `NFR-008` IS BREACHED ON BOTH CLAUSES, AND A PER-TICKET BOUND IS CHECKED ONLY ABOVE ITS FLOOR — 2026-10-10 by Architect/Design (`ADR-0035`, task `wave-2026-09-25`, subtask `ruling-timing-protocol`)
>
> **CPU (≤ 15 s): BREACHED since 2026-09-25.** That is `ADR-0019` trigger (a), fired at `ABC-079` on
> the v24.12.0 reference: 18.61 → 22.29 s, null +0.59 % 6/8; and at `ABC-122`, 22.85–23.46 s. Today
> it reads **24.86 / 26.04 s** (`ABC-084` runs 1 and 3, load1 median 7.1 / 7.5, v26.11.0, 49 files).
>
> **WALL (≤ 3 s): BREACHED** at 6.52 / 7.16 s.
> - It is bounded below by CPU ÷ 8 cores = 3.11 s, and by 3.85 s with CPU deflated 22 % at the best
>   parallelism ever measured (5.29x).
> - **The warm/cold choice (`ABC-111`, a ±0.3 s straddle) does not decide this verdict.**
>
> **The levels are the owner's and did not move.** `N8-LANE` is a rate limit (`ADR-0014` decision 4).
> The owner has the re-scope, re-level, remedy and decline options with numbers (`ADR-0035`
> decision 6).
>
> **Floors `F`** (median R of the last three readings; the source is
> `.grugops/context/ruling-timing-protocol/probe/floors.out.txt`):
>
> | instrument | CPU | wall |
> |---|---|---|
> | full lane | **1.72 s** | 3.25 s |
> | one file | **0.17 s** | 0.27 s |
>
> **A cut may not set a per-ticket timing bound below `F` for its instrument.** A wall bound must name
> the failure mode it catches, and where that mode has a count, the count is the pin (`ADR-0017`).
> Architect/Design re-reads `F` from the R that every reading reports.

**(e) Only if the owner takes R-1.** Replace the `Target` cell's level sentence with:

> **`npm test` wall ≤ W s at load1 ≤ 8** on the declared stack (W = <his figure>, <date>, his words
> quoted). **The CPU total is REPORTED at each gate, not levelled.** Per-ticket cost is `N8-LANE` on
> the narrow set.

## Hand-offs (each with an owner; nothing edited here)

- **Orchestrator.** Put `ADR-0035` and R-1–R-4 to Olger Oeselg in one sitting. Until he answers, gates
  write `NFR-008` BREACHED / BREACHED and `N8-LANE` as a rate limit.
- **BA/PM.**
  - Re-score **`ABC-108`**: recommend closing it as superseded. Its scope is answered by `ADR-0014`,
    `ADR-0019` and `ADR-0035`, and its `A1` is unsatisfiable.
  - Re-score **`ABC-111`**: its verdict question is moot under decision 5. Its demotion trigger needs
    the owner's words, so re-derive against W if he takes R-1.
  - At the next pull of **`ABC-083` / `ABC-087` / `ABC-085`**, state the related set. Expect
    UNRESOLVED at 650 ms when it is most of the lane.
- **QE and Security/NFR.**
  - From acceptance, report R beside every paired reading and use the narrow set for per-ticket
    charges.
  - A full-lane reading stays valid for a large charge (NOT MET at any R) and for the total.
- **Architect/Design (this role), after acceptance.** Apply (a)–(d) to the catalog, and (e) on the
  owner's word.
- **Not mine, flagged.** `AGENTS.md`'s `Test (all)` receipt says nothing of `NFR-008`, so no Scribe hop
  is owed by this ruling.

## Fence kept

- Nothing was written under `src/` or `tools/`, nor to `vitest.config.ts`, `plans/board.md`,
  `plans/nfr-catalog.md`, any ticket page or `AGENTS.md`.
- **No lane was run.** The one `vitest related --run` was a command check (2 files, 96 tests), not a
  reading.
- `isolate: false` stays forbidden.
- Nothing was merged or pushed.
