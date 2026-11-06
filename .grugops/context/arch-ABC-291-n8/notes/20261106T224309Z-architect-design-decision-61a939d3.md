---
id: 20261106T224309Z-architect-design-decision-61a939d3
kind: decision
by: architect-design
at: 2026-11-06T22:43:09Z
verified_by: 
confidence: high that a row move merged first leaves H - B unchanged, by the bar's own definition; medium on the supply, whose kept and saved ms are unbuilt estimates, UNKNOWN - verify; the moved bar is named, not ruled
refs:
  - arch-ABC-291-n8
  - ABC-291
  - ABC-290
  - ABC-292
  - ABC-293
  - ABC-307
  - ABC-305
  - ABC-303
  - EPIC-011
  - ADR-0075
  - ADR-0046
  - ADR-0035
  - NFR-008
  - R-N8H-1
  - R-N8H-3
  - K0
  - K1
  - K2
  - K3
  - K4
  - K5
  - K7
  - H3
  - G-WITH
  - G-GO
  - 70d931ab
  - 780d9021
  - 35a694ee
  - fcc59889
  - qe-ABC-291/20261106T222838Z-qe-e2e-observation-024bbd63
  - qe-ABC-291/20261106T222838Z-qe-e2e-decision-5826dcf6
  - qe-ABC-291/20261106T221245Z-qe-e2e-decision-51558b04
  - qe-ABC-291/20261106T210624Z-qe-e2e-decision-a49d69d7
  - orch-2026-10-30a/20261106T223014Z-orchestrator-decision-a9e7118e
  - orch-2026-10-30a/20261106T220610Z-orchestrator-decision-ceb1125e
  - orch-2026-10-30a/20261104T203850Z-orchestrator-decision-f30bd604
  - orch-2026-10-30a/20261105T123040Z-orchestrator-decision-f40ce634
  - orch-2026-10-30a/20261105T135350Z-orchestrator-decision-ad217a34
  - secnfr-census-1105/20261105T115526Z-security-nfr-decision-b9038a14
  - secnfr-census-1105/20261105T122931Z-security-nfr-decision-19cea480
  - secnfr-ABC-307-a10/20261105T215450Z-security-nfr-observation-f627093d
  - se-ABC-305/20261105T124015Z-software-engineer-observation-2adad06f
  - se-ABC-305/20261106T131126Z-software-engineer-observation-9c9e2a35
  - qe-ABC-303/20261106T180618Z-qe-e2e-observation-9e2facfa
  - arch-ABC-307-reads/20261105T134134Z-architect-design-observation-f8c13d49
supersedes: 
seal: sha256:bacde085df64d371b718c72e171a50966580864afe1f7ca075e750bedef70042
---

# arch-ABC-291-n8 decision: the route as proposed cannot work if the rows merge first, because they land in both arms. Rows alone cannot buy the aim. They reach the bar at the edge at best, on the branch. So this goes to the owner as a named moved bar. I rule no bar, and I stop there

Architect/Design, task `arch-ABC-291-n8`. Readings: this task's observation. Nothing was run. No bar, value, NFR level or line of any ADR moved. Every ms and second of forecast below is an estimate, `UNKNOWN - verify` until read.

## The route, tested
`…a9e7118e` says a row move first, then a new graded read. **It holds in one form only.**
- **On its own ticket, merged to `main` first, as `ABC-307` did: it fails by construction.** B would be the new merge-base and would carry the same rows. H − B would still read about +0.16 s, after a build, a QE hop and the last rows.
- **Reading H against the old base, `780d9021`, after such a merge: I stop here.** B is sealed as the merge-base (`…a49d69d7` § 2). Keeping it after the base moves changes what the bar's words mean, so that is a moved bar by another name. It is not mine to read that way.
- **Riding on `grugops/ABC-291`, in the one merge: it works.** B stays the merge-base, H carries the move, and the words stand. G-WITH's "merged first or in the same merge" and `…f40ce634` 1's "before or with" both allow it.
- **The standing rule is not what is firing.** `…f30bd604` 2 and `…ad217a34` 4 are written for a lane at or above 9.6 s, and H is 9.30 s. The route is the Orchestrator's reading, which is his to make, and it should be stated as one.

## 1. Where the wall goes
- **Supported:** the cost is real. 15 of 16 CPU pairs and 13 of 16 wall pairs are positive, both arms read over, and order is flat. Noise alone does not explain it. Its size is about +0.16 s, give or take 0.06 s, so the bar sits inside that spread: a true cost of +0.10 s is not excluded.
- **Supported:** the added rows are not it, at about +0.017 s of wall.
- **Supported as a part:** shared rows, +53 to +98 ms in-thread, +0.03 to +0.05 s of wall. The tree's +2.70 % nodes at depth 8 is enough to cover that. It is not shown to cause it.
- **`UNKNOWN - verify`:** the other +0.09 to +0.13 s of wall and 0.3 to 0.6 s of CPU. It lies outside row bodies: start-up and import, spawned children, or V8's threads. `uci-session`'s +83 ms is H's alone, with no twin beside it.
- **So rows would pay for this cost, not remove it,** and on this reading a later term may bring it back. QE's files in `<scratch>/qe291/out/a1/n8/runs` can answer the import question with no lock and no run. That read is the cheapest next step.

## 2. Row supply
**The aim.** With a read noise of 0.06 s, reading ≤ +0.10 s 90 % of the time needs a true H − B of about +0.02 s, and 95 % needs about 0. From +0.155 to +0.175 s that is **−0.13 to −0.175 s realised**. At a return of 0.37 to 0.50 that is **260 to 470 ms in-thread saved.**

**The candidates.** ms are `se-ABC-305`'s census at `35a694ee`. Kept and saved are my estimates. No remnant is built and no mutant is read.

| # | row | ms | form, lane | remnant | saved | mutant to read |
|---|---|---:|---|---|---:|---|
| N1 | `ABC-170` A3, four of the six roots | 135 | W on four, `ENGINE_DEEP`, own file | the two lightest roots stay as they are | 95 | M15, which the row's comment says breaks all six on step 5, read on the two that stay |
| N2 | `san` "emits only strings of the SAN grammar" | 42 | S, option (ii) | every fourth corpus position | 31 | a new plant in `toSan` outside `SAN_SHAPE`; the DISTINCT row, 12 ms, stays whole |
| N3 | `king-mobility` A6 purity | 35 | S, option (ii) | the perft roots and a named king subset | 25 | a plant that writes the position; `evaluate.pawns` A6, 11 ms, stays |
| N4 | `levels` `ABC-242` A6, no keys | 26 | S, `ENGINE_DEEP`, own file | the first of `THIRD`'s fixtures | 18 | a plant that reads the prior list when it is empty |
| N5 | `ABC-025` A1 qualifier | 26 | S, option (ii) | a subset that keeps the named kills | 17 | Q33, Q34, Q35, Q27, Q38 red; Q22, Q24, Q29, Q40 green, as the row's comment requires |
| N6 | `book` `ABC-094` A2 | 21 | S, `ENGINE_DEEP`, own file | 20 picks, not 100 | 16 | a plant that keeps module state in the pick |
| N7 | `zobrist` byte-pure walk | 22 | S, `ZOBRIST_DEEP`, own file | two of the six positions | 14 | a plant in `zobristKey` that writes the position |
| N8 | `levels` A10 seed threaded | 22 | S, `ENGINE_DEEP`, own file | 4 of the 10 fens | 13 | M6, whose named holders include this row (`ADR-0046` R6), so the remnant must keep that kill; and a module-global random source |
| N9 | `perft` startpos perft(4) | 20 | W, `PERFT_DEEP`, `fast` 4 → 3 | none; perft(3) and `position-3` perft(4) stay | 20 | a plant only depth 4 sees, to be written |
| | **sum** | **349** | | | **249** | |

- **Scaled by `ABC-307`'s own miss (592 measured of 651 estimated), about 225 ms. At 0.37 to 0.50 that is −0.08 to −0.11 s realised.**
- **H − B would then land near +0.045 to +0.095 s.** A read lands under the bar about 53 to 82 % of the time. That is the edge, not a margin. If it misses, no row is left, and the same question comes back after a build and a QE hop.
- **Plainly: rows alone cannot buy the aim.** They fall short of the aim's low end, 260 ms, and they are the last rows of 20 ms or more outside the exclusions.
- **`ABC-307`'s −0.350 s on 592 is a return of 0.59.** At that rate these rows give −0.13 s, the aim's low end. One read's figure is not a plan, and 0.59 is above the two-worker return of 0.5 that the census's structure predicts.
- **Rows opened only by moving an exclusion are not on this list:** the fine-step rows, about 1.0 s. That would move a sealed rule, and I do not propose it.
- **Run rule:** 12 moved rows take the set from 23 lines to about 35.

**One lead that is not a row.** Folding `src/san.suffix.hardening.test.ts` into `src/san.qualifier.hardening.test.ts`, and `src/moves.enpassant.hardening.test.ts` into `src/moves.castling.hardening.test.ts`, would buy about −0.05 s each by `R-N8H-3`'s figure. With the rows that makes −0.18 to −0.21 s, which reaches the aim. **No record has read a fold, so I do not count it.** It would change the file count and every path that cites those rows, and it needs one probe on a held host before anyone plans on it. Whether any row pins 71 files is `UNKNOWN - verify`.

**So this goes to the owner, as a named moved bar. I name it and do not rule it.**
- **The bar:** `ABC-291`'s H − B leg, `…a49d69d7` § 5, reads ≤ +0.20 s, for this ticket only, on `…024bbd63`'s read. There would be no new lane read. 10 s, 9.6 s, 9.5 s and `…b9038a14`'s G rule stand.
- **What is against it:** the figure is named after the read, and `…f40ce634` 1 warns about that. +0.20 s is the pooled +0.175 s rounded up, not fitted to +0.155 s. It would be a stated move, in the owner's words, and no waiver.
- **What it spends:** about 0.06 to 0.10 s more lane than the budget allowed. The lane stays at 9.30 s: 0.20 s under 9.5 s, 0.30 s under 9.6 s, 0.70 s under 10 s.

**The cost to `ABC-290`, `ABC-292` and `ABC-293`,** arithmetic from 9.30 s, in that order:

| each term costs | 1st | 2nd | 3rd | what fires |
|---|---:|---:|---:|---|
| +0.10 s | 9.40 | 9.50 | 9.60 | 9.5 s at the 2nd, 9.6 s at the 3rd |
| +0.155 s | 9.455 | 9.61 | 9.765 | both at the 2nd |
| +0.10 s, rows spent now (about −0.10 s) | 9.30 | 9.40 | 9.50 | 9.5 s at the 3rd |
| +0.155 s, rows spent now | 9.355 | 9.51 | 9.665 | 9.5 s at the 2nd, 9.6 s at the 3rd |

- **None reaches 10 s.** All carry the term's cost as `UNKNOWN - verify`: the pages say "units only", and this ticket's page said the same.
- **Rows buy the same level now or later.** Spent now they clear a budget line at 9.30 s, when no level mark is near. Held, they are there when the lane nears 9.5 or 9.6 s. Spent now, a lane at 9.6 s goes straight to the owner (`…ad217a34` 4).
- **The larger question.** If terms cost what this one did, each of the three reads UNRESOLVED on +0.10 s too, and the supply pays for one at most. Moving the bar for `ABC-291` alone does not answer that. The owner should be told, and the three pages carry no budget line today.

**My recommendation, which is not a ruling:** the moved bar, unless QE's no-lock read or a probe shows otherwise. It keeps the reserve for a level mark, which is what the rows are for.

## 3. Ride, or its own ticket
**It rides on `grugops/ABC-291`, in the one merge, if any row moves at all.** As its own ticket merged first it buys the bar nothing (above).
- `ABC-307` was its own ticket because the lane's level was the line, and it had to land before the next merge. Here the line is paired.
- It needs a dated line on `ABC-291`'s page, for the rows and K2, which is BA/PM's. DoR's measured-remnant row is read as `ABC-307`'s was: PREREG, mutants, whole-lane parity, about 25 min of lock.
- A separate page for the cut, delivered on that branch, is fine if BA/PM wants one. Delivery is the point, not the page. Merged alone it would still be a good lane ticket, but not an answer to this.
- A test-only row move on `grugops/ABC-291` keeps every production blob. UAT is owed for `ABC-291` either way.

**A cost in the order, which is the Orchestrator's to weigh.** Rows first spends the last supply, a cut, a mutant read, a build and a QE hop before anyone knows `ABC-291` merges. C2′ needs ≥ 50.0 of 100 and has not been played. H3 is an order, and `…a49d69d7` § 0 says it holds "unless the later brief says otherwise before the first game". The page has the census gating the merge, not the games. C2′, S′ and the Levels lane read production files only, so a later test-only move leaves them standing by item 4's identity. **Games first moves no bar, and a miss would close this question for free.** It needs his line and the owner's window, which `…a9e7118e` says must be asked again anyway. The owner's merge question on K1 (c) is also still open, so one ask can carry both.

## 4. What carries to the new read
Only if rows ride and the key below holds. **The ruling must come before any new figure exists,** as `…9e2facfa`'s did.

**The key.** Not `…9e2facfa`'s: `src`'s tree will differ. sha256 of `git ls-tree -r <commit> -- src tools data package.json package-lock.json vitest.config.ts tsconfig.json AGENTS.md biome.json` with `*.test.ts` lines removed, equal at `70d931ab` and the new tip. If any line differs, nothing carries.

| row | carries? | why, and the condition |
|---|---|---|
| K4 | **yes** | `g2.ts` loads production files only. It is spent, so carrying is also the only lawful way to keep it |
| K5 | **yes** | `timed.mjs` loads production files only |
| K0 (a)–(c) | **yes** | `drv291.ts` reads the doors and the head |
| K3 | **yes** | `floor`, `zug`, `g1` by the driver; `src/puzzle-suite.test.ts` must be untouched |
| K1 | **yes, if `src/evaluate.pawns.test.ts` is untouched** | no candidate touches it. Its count reads again in the gates |
| K7 | **yes, if `tools/tune/tune.test.ts` is untouched** | no candidate touches it |
| K2 | **no, in part** | it reads test files. Arm T carries; the title comparison and the removed-line read are redone on the new diff. Bounded: the moved rows and nothing else |
| gates, the run rule | **no** | test files moved. The set grows by each moved row |
| `NFR-008` | **no** | it is the point of the read |
| PR10's reports | yes | reports |
| C2′, S′, Levels | not played | when played, they read the candidate's production files either way |

- **§ 7 still stands.** K0 to K3 and K7 are read again on the merged tree, about 20 min, no quiet host. A carry reaches the new read. It does not replace § 7.
- **What identity does not cover:** the host. K4 met by 0.0033, within one session spread. Carrying means it is not read again, not that it has margin.
- **If `main`'s production files move first,** nothing carries: the stale rule fires.
- **§ 7's test** lists `src` by name, so a test-only merge would show there. The rule's words say "value-changing". A ride does not move `main`, so this does not arise.

## 5. `n8-grade.py`
For the new read's PREREG, by a new sha256, sealed before the read:
1. **One state line, from § 5's four legs.** MET needs the twin admissible, H's median ≤ 10 s, wall R ≤ 10 s, **and** paired H − B ≤ +0.10 s. NOT MET is H's median > 10 s **or H's x(k) > 10 s**. VOID is an inadmissible twin, under 8 rounds, or over 2 flagged. Otherwise UNRESOLVED.
2. **The old line is renamed** `ADR-0035 D1 legs:`, and it never prints "NFR-008 MET".
3. **The grader reads the flagged-round count,** so a void read cannot print MET (`…2adad06f`).
4. **The budget compares `round(paired, 3) <= 0.10`.** Today an exact +0.10 s can read OVER by floating-point error, as 9.05 − 8.95 does.
5. **It prints B's commit and H's,** and the PREREG's id on the state line.

If the bar moves, leg 4's figure is the only change, and it comes from the owner's word. No earlier read is re-graded. `…024bbd63` read the state by § 5's words and stands.

## For the Orchestrator
1. Rule out rows-on-`main`-first for this bar, or tell me where I read it wrong.
2. Ask QE for the no-lock read of `<scratch>/qe291/out/a1/n8/runs`, before those files go.
3. Rule H3: games first, or stands.
4. Take the moved bar to the owner, with the table above and K1 (c)'s question.
5. If rows are still wanted: one probe first, N1–N9 skipped, and N1–N9 plus the two folds, on a held host, about 4.5 min, an estimate and never a grade. By `…b9038a14`'s × 0.90 it needs a skip read near −0.20 s. Then `arch-…-reads` for remnants and mutants.
6. Rule item 4's key before any new figure.

**Owed by BA/PM if ruled:** `ABC-291`'s page for the rows and the bar; a budget line, or a stated none, on `ABC-290`, `ABC-292` and `ABC-293`.
**Records:** no ADR is edited. Nothing here is decided yet that needs a dated line. `ADR-0046` takes its section when rows are measured, and the bar's line follows the owner's word.
