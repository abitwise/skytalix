---
id: 20260810T185704Z-software-engineer-observation-4a1053f2
kind: observation
by: software-engineer
at: 2026-08-10T18:57:04Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - ABC-026
  - N5
  - N6
  - A6
  - src/san.ts
  - src/san.qualifier.hardening.test.ts
  - src/san.suffix.hardening.test.ts
supersedes: 
---

# `N5` on a SIXTH instrument, under the re-derived protocol: delivered tree **NET +7.3% / +8.2%** against `≤5%` — NOT MET. The candidate does not clearly buy compliance either (**net +5.2%**), and the coverage-preserving restructure buys **nothing measurable** — its sign flips between two admissible runs

Nothing here is inherited. Own trees, own harness, own aggregators. It is an `observation` and not a
`finding`: no §14 gate verdict on this hop, `context.human_admission` `off`, no stamp exists and none
was invented. Apple M3 / Node v24.12.0 / darwin arm64, vitest 3.2.7; `UNKNOWN - verify` elsewhere.

## The protocol, followed rather than reconstructed

BA/PM's wording: `≤5%` of the default lane's **CPU (user+sys)**, **net of the fixed floor for the
same number of added test files**, median of paired per-round deltas, n ≥ 7 interleaved rounds, round
0 discarded, order rotated, one fresh OS process per run, every run asserting its own test count, the
runner invoked **directly** so no package-manager startup sits in the denominator, denominator = the
lane with this ticket's files removed. **Admissible only if a null control by identity reads ≤1% and
the fixed floor is measured and subtracted, both reported.**

Runner invoked as `/usr/bin/time -p node_modules/.bin/vitest run` — no `npm`. Every run asserts its
own **test count AND file count**; a run whose tree state is not what its label claims is a harness
error and never a datum. Conditions:

```
A    the lane without ABC-025's two files                    652 tests / 20 files   (denominator)
A'   IDENTITY NULL CONTROL — byte-identical tree to A        652 / 20               (admissibility)
Z    FIXED FLOOR — A plus TWO trivial one-assertion files     654 / 22
C    the DELIVERED tree                                      676 / 22
R    RESTRUCTURED, both call forms intact                    676 / 22
N    A1 narrowed to assisted-only (THE CANDIDATE), 2 files   676 / 22
RN   restructured + narrowed                                 676 / 22
```

The four variants of the test file were **md5-checked as four distinct files** before every harness,
because the first attempt at this measurement silently substituted the delivered file under two
different labels (see §4).

## 1 — four harness runs, one of them DISCARDED as inadmissible

```
run   n    conditions          null control A'   floor Z    verdict
1     8    A A' Z C R          +0.1%  sign 4/8   +5.0%      ADMISSIBLE
2     8    A A' Z (variants)   +2.1%  sign 7/8   +4.5%      NOT ADMISSIBLE — DISCARDED, not reported
3    10    A A' Z R N RN       -0.6%  sign 4/10  +4.7%      ADMISSIBLE
4    10    A A' Z C R          -0.8%  sign 3/10  +3.6%      ADMISSIBLE
```

Run 2 is discarded because its null control by identity read **+2.1%**, above the bar's own
admissibility ceiling. Its numbers are not carried anywhere. **The rule was applied against my own
run rather than to someone else's** — that is the whole point of an admissibility clause.

On the three admissible runs the null control reads **+0.1% / −0.6% / −0.8%** with the sign at
**4/8, 4/10, 3/10** — chance. The instrument resolves.

## 2 — the numbers

```
                                       CPU paired median   sign      NET of floor    vs <= 5%
run 1  (floor +5.0%, lane 6,565 ms CPU)
  C   the DELIVERED tree                     +12.3%       8/8         +7.3%          NOT MET
  R   restructured, both call forms          +11.7%       8/8         +6.7%          NOT MET
run 3  (floor +4.7%, lane 6,450 ms CPU)
  R   restructured, both call forms          +14.1%      10/10        +9.4%          NOT MET
  N   THE CANDIDATE, assisted-only            +9.9%      10/10        +5.2%          NOT MET
  RN  restructured + narrowed                 +9.2%      10/10        +4.5%          MET
run 4  (floor +3.6%, lane 6,655 ms CPU)
  C   the DELIVERED tree                     +11.8%      10/10        +8.2%          NOT MET
  R   restructured, both call forms          +12.5%      10/10        +8.9%          NOT MET
```

**The delivered tree does not meet the re-derived bar: net +7.3% and +8.2% on two independent
admissible runs, sign positive in 18 of 18 rounds, at 1.5–1.6x the bar.** That reproduces BA/PM's
net +7.8%, which sits between my two readings, on a harness that shares no code with theirs.

**The fixed floor for two added test files is +5.0% / +4.7% / +3.6%** — the same phenomenon BA/PM
found (+5.4% / +6.1%), lower on my session and with a wider spread. Two files that assert `1 === 1`
still cost roughly the whole `≤5%` budget, so the bar's *net* form remains the only one that can be
met at all.

## 3 — the two results that decide the hop

**(a) The candidate does not clearly buy compliance.** The record's arithmetic —
`gross +7.4% − floor +5.8% = net ~1.6%` — **subtracts a TWO-file floor from a ONE-file gross.**
Security/NFR's `Bn` was the delivered file alone (672 tests / 21 files); BA/PM's floor `Z` was two
trivial files. Measured at matching file counts, the candidate reads **gross +9.9%, net +5.2%** —
**at the bar, not comfortably inside it**, and on the wrong side of it. Only narrowing *and*
restructuring together (`RN`, +4.5%) lands inside, and 4.5 against 5.0 is inside the instrument's own
between-run spread. Security/NFR reached the same conclusion for their variant on the bar as it then
stood — *"it breaches the bar too"* — and it survives the correction of the floor.

**(b) The coverage-preserving restructure buys nothing measurable.** It collapses `A1`/`A2`/`A4`'s
three duplicate passes over the corpus into one: 414 duplicate `parseFen` + `legalMoves` pairs, 5,524
duplicate ladder searches and 5,524 duplicate assisted renders removed, with **every** position, move
and call form still quantified over (17 mutants, **0 verdict mismatches**, all four equivalence
controls alive — the note beside this one). Paired against the delivered file in the same rounds it
measures **−0.6 points in run 1 and +0.7 points in run 4**. *The sign flips between two admissible
runs.* Its benefit is indistinguishable from zero, it costs **+38 lines** (`src/` diff 823 → 861,
cutting Security/NFR's risk #8 margin from 77 lines to 39), and it would put a file three roles have
already gated back through QE and Security. **It is built, measured and NOT shipped.** Shipping a
change whose benefit does not survive its own instrument is the failure this board keeps naming.

## 4 — the wall clock, again, and an error of mine

The wall column reproduces BA/PM's ordering violation on my session too: in run 1 the **null control
by identity** read **−6.1%** on the wall while the delivered tree read **−0.3%** — a change that is
literally nothing measuring six points *cheaper* than the lane, and the whole delivered ticket
measuring free. **Wall cannot adjudicate this bar in either direction**, which is why the re-derived
bar names CPU.

**My own harness error, recorded.** My first attempt at the candidate measurement substituted the
condition file by a `String.replace` that silently no-ops when the anchor does not match, so the
delivered file was measured under the label `N` and read `+12.2%` — indistinguishable from `C`, which
is exactly what a no-op looks like. Caught because the number was implausible, then fixed with an
md5 distinctness guard over the four variants. That run was **also** the one whose null control
failed admissibility, so nothing from it is reported either way.

## 5 — `A6` and `N6`, re-checked on my own instrument at the branch tip

```
md5 -q src/san.ts                          cbcc3be37c21414d16e8e6b4d0c68959   UNCHANGED
git diff --numstat main -- src/            655/0 + 168/0 = +823 / -0, two files, both *.test.ts
deletion lines under src/                  0
non-*.test.ts files under src/ in the diff NONE
untracked files under src/                 0
package.json / package-lock.json           untouched
md5 san.qualifier.hardening.test.ts        856ebab15128d8b5945c3038401eeda5  (= QE's and Security's)
md5 san.suffix.hardening.test.ts           c8beb69c1c4169bde319196c3e138eac  (= Security's)
npx vitest run                             676 passed / 676 on 22 files, exit 0, SKIP 0
npm run lint                               exit 0  (40 files, the same 2 PRE-EXISTING infos)
npm run typecheck / npm run build          exit 0 / exit 0
PERFT_DEEP=1 npx vitest run perft          32 passed / 32 EXACT in 37.77 s   -> N6 MET
```

**`A6` HOLDS**, and this hop adds nothing to `src/` at all: it is the first hop on this ticket whose
`src/` delta is zero lines in both directions. No row proved the delivered code wrong.

## What these figures do NOT establish

**Not a figure for any other machine** — one machine, one session, `UNKNOWN - verify` elsewhere.
**Not that the between-run level is stable:** the same condition `R` read net +6.7%, +9.4% and +8.9%
across three admissible runs — a **2.7-point** spread that the paired-median statistic does not
remove, because it controls within-round drift and not between-session level. The delivered tree's
NOT-MET verdict survives that spread (7.3% and 8.2%, both well clear of 5%); the `RN` MET verdict at
4.5% does **not** clearly survive it, and is reported as at-the-bar rather than inside it.
**Not a re-measurement of `NFR-001`–`NFR-007`** — `plans/nfr-catalog.md` is not edited and no catalog
target moved. **Not a new reading of the per-file floor curve** — two points at one file count, which
is `ABC-026`'s to establish.
