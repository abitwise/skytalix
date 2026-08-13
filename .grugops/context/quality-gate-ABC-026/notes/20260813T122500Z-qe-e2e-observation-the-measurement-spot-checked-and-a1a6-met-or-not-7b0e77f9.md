---
id: 20260813T122500Z-qe-e2e-observation-the-measurement-spot-checked-and-a1a6-met-or-not-7b0e77f9
kind: observation
by: qe-e2e
at: 2026-08-13T12:25:00Z
verified_by:
confidence: high
refs:
  - ABC-026
  - ABC-026-A1
  - ABC-026-A2
  - ABC-026-A3
  - ABC-026-A4
  - ABC-026-A5
  - ABC-026-A6
  - quality-gate-ABC-026
  - NFR-008
  - ADR-0008
  - H5
  - plans/nfr-catalog.md
supersedes:
---

# The measurement spot-checked, `A1`–`A6` reported **MET / NOT MET with evidence**, and **one real weakness in the `~7` planning number**

An `observation`. **I do NOT tick off `A1`–`A6` — those are BA/PM's to tick, and the prior hop was
right to refuse to mark its own criteria.** This is QE's verdict with the evidence attached.

## The arithmetic, recomputed from the published inputs — **it all reproduces**

```
13 - 10.390                 = 2.610 s     note says 2.610          OK
2.610 / 0.1582              = 16.5        note says 16.5 -> ~16    OK
2.610 / 0.185               = 14.1        note says 14.1           OK
3.025 / 0.159               = 19.0        note says 19.0           OK  <- NOTE the numerator
10.390 / 28                 = 371.1 ms    note says 371            OK
2.610 / 0.371               = 7.04        note says 7.0 -> ~7      OK
2.610 / 0.650               = 4.02        note says 4.0 -> ~4      OK
fit at 28: 5.920 + 0.1582*28 = 10.350 s   vs measured 10.390 s     internally consistent to 0.04 s
```

**Every figure reproduces exactly.** One thing a reader should not miss: **the `14–19` band switches
sample mid-band** — `14.1` uses sample A's remaining (2.610 s) with the pessimistic slope, `19.0` uses
sample **B**'s remaining (3.025 s) with the optimistic one. That is a legitimate outer band and **the
note shows both numerators**, so it is disclosed rather than hidden. It is easy to skim past, and a
restatement that quotes "band 14–19" without the samples would be quoting two different trees.

## **The real weakness: `~7` is a MEAN on a distribution that has no typical member**

`A2` derives *"files at TODAY's ALL-IN cost"* from `10.390 ÷ 28 = 371 ms per file`. **That average is
arithmetically correct and describes almost no file in this repository.** Per-file in-worker duration
on the delivered tree — a different unit from CPU, used here for **shape only, never blended with the
CPU clause**:

```
mean    309.0 ms          median   94.2 ms       mean is 3.3x the median
max    2224.4 ms  perft.test.ts     = 25.7% of all file time IN ONE FILE
min       1.1 ms  glyph-mode.nfr.test.ts
files above the mean:  7 of 28      spread max/min ~ 1966x
```

**So the planning number is a coin-flip on WHICH KIND of file the next ticket adds**, and the band
`A2` publishes does not carry that risk because its band comes from slope and sample variation, not
from file-weight variation:

- eight **median-weight** files (~94 ms of content over the ~158 ms floor) fit with room to spare;
- **two or three `perft`-weight files do not fit at all**;
- `EPIC-003`'s eight tickets imply 7–8 files, and **nothing yet says which kind they are.**

**This does not move any target and I am not proposing one.** It is a reading instruction:
**`~7` is sound as a planning number and unsound as a guarantee, and the variable it is most sensitive
to — file weight — is not in its published band.** `N8-LANE`'s 650 ms-per-ticket bar is the control
that actually catches a `perft`-weight addition, which is an argument for `A3`'s inheritance work
rather than against `A2`. **Severity low, owner BA/PM at the next cut.**

## The one thing I could not check

**`A1`'s medians are not independently recomputable from the record.** The notes publish the median and
the spread (`2.210 s`, `1.880–2.970`) but **not the eight raw round values**, so *"median of n = 8,
round 0 discarded"* has to be taken on trust. Everything around it is verifiable and checks out — the
protocol, the machine, the counts, the arithmetic downstream — and my own independent lane readings
(`forks-28` median **10.570 s** CPU, `threads-28` median **9.760 s** under load 16–22) **bracket the
published 10.390 s exactly as the load difference predicts.** So I have no reason to doubt it and no
way to recompute it. **Recorded as a reproducibility gap, severity low, owner Architect/Design:
publish the raw per-round values, or say they were not retained.**

## `A1`–`A6`, QE's verdict

| | verdict | evidence |
|---|---|---|
| **`A1`** lane total measured, `H5` | **MET** | Protocol followed and stated; both clauses reported as medians with spreads and each marked MET; machine named. My independent readings bracket it. **The 3 s / 13 s levels are untouched.** |
| **`A2`** headroom in FILES with arithmetic shown | **MET** | Arithmetic shown and reproduces exactly; band published; the estimate it replaces is named and its 2.4x error owned. **Weakened, not failed, by the file-weight point above.** |
| **`A3`** `N8-LANE` inherited by name | **MET, spot-checked not re-censused** | I re-read `ABC-024` (states no lane bar — the row's own sentence makes that compliant) and `ABC-021` line 287 and `ABC-010` line 283 (both now carry explicit inheritance notes). The 12-cite / 1-silent / 0-looser census is consistent with what I sampled. **I did not re-read all 13.** |
| **`A4`** adopted or refused with measurement | **MET, and exceeded** | The criterion asks **≥ 20 consecutive green runs including all four `*.nfr.test.ts`**; the hop ran **24 against all SEVEN**, reading the census from disk rather than from the stale ADR sentence. **My 100 further runs add 0 red.** The self-caught predicate bug (`numTotalTestSuites` counts describe blocks) is **re-proved independently: 140 in every one of my 100 runs, against a true file count of 28.** |
| **`A5`** warning in `vitest.config.ts` and `ADR-0008`, NOT in the four files | **MET** | Present in both, absent from all four `*.nfr.test.ts` files (`src/` byte-identical proves the absence mechanically). **One sentence in it is inaccurate — "share a worker" should read "same module"** — see the mechanism note; low severity, does not fail the criterion. |
| **`A6`** `src/` byte-identical, nothing narrowed | **MET** | Re-verified by me, not inherited: 47 files under `src/`, `git diff --numstat 06c5427 HEAD -- src/` **empty**, `git status --short -- src/` **empty**, `src/` also identical to current `main`, 28 test files and 807 tests before and after, skip count 0. |

## No target, bar or level moved — checked mechanically

```
ADR-0008         +109 / -0     deletion lines: 0     PURE ADDITION
plans/nfr-catalog.md  +78 / -0  deletion lines: 0     PURE ADDITION
plans/traceability.md  +1 / -1  the ABC-026 row only
NFR-001..NFR-008 rows, sha256   63f667958eeabcaa884d45b18b513c7bbe9855266c4959dfd16f87b0802eca31
                                 == the hash the prior hop recorded, EXACTLY. 8 rows.
ADR-0008 Status                 "accepted - RATIFIED 2026-08-11 by Olger Oeselg", unchanged;
                                 the addendum states "Nothing above is edited."
```

**Zero deletion lines in both governed documents is the strongest available proof that nothing was
moved: nothing could be, because nothing was removed or rewritten.** The owner-ratified 3 s / 13 s
level stands verbatim. **I moved nothing either.**

## Baseline drift, reported because the brief's baseline said otherwise

The brief records `main` at **`be0f92b`**. `main` is now at **`f290b06`** — one commit further on
(`docs(board): grug send ABC-026 to review`), which touched **`plans/board.md` only, +3/−3**.
**`git diff --numstat 06c5427 main -- src/` is still empty and the file count is still 28, so the
measurement's arithmetic is unaffected**, exactly as the brief predicted — just from one commit
further along. Benign, recorded so the next reader is not confused by two different `main` hashes.
