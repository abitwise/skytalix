---
id: 20260812T121500Z-qe-e2e-observation-a2-four-added-obligations-checked-one-by-one-7e461f27
kind: observation
by: qe-e2e
at: 2026-08-12T12:15:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A2
  - RISK-ABC028-02
  - ABC-017-A11
  - ABC-017-A14
  - src/history-pane.nfr.test.ts
  - src/history-pane.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# `A2` re-run from scratch: MET, NOT vacuous — and one of the four obligations the rewrite ADDED cannot fail in either configuration it is asserted over

> **Hand-authored, no stamp.** I re-derived every figure rather than reading it out of the ticket,
> because a criterion rewritten to be satisfiable is exactly the one worth re-running. Both cache
> builds were re-specified from the ticket's own prose, `tsc` **0**, output-identity checked first.

## The measurement — both configurations, both builds, and the counterfactual nobody had to run

```
                                                      WCACHE-LEN     WCACHE (naive)
(a) src/history-pane.test.ts ALONE, nfr NOT loaded
      with A1                                         1 failed/24    2 failed/24
      with A1 REMOVED                                 23 passed      1 failed/23  (A14)
(b) FULL suite, nfr :121+ fixtures REBUILT PER TEST
      with A1                                         1 failed/750   2 failed/750
      with A1 REMOVED                                 749 passed     1 failed/749 (A14)
delivered tree, fixtures shared (calibration)
      with A1                                         3 failed/747   4 failed/746
      with A1 REMOVED                                 2 failed/749   3 failed/746
kills in (a) and (b): every one in src/history-pane.test.ts (ABC-028 A1; and A14 for naive WCACHE)
                      NOT ONE in src/history-pane.nfr.test.ts
```

**Every figure the build hop published reproduces**, on a harness built independently from the
ticket's prose. The `A11` `toSan` call-count killers on the shared-fixture tree reproduce too, and
the counterfactual — **remove `A1`, rebuild the fixtures, and `WCACHE-LEN` goes fully green** — is
the discriminating evidence that makes `A2` a real measurement rather than a formality.

## The four obligations the rewrite ADDED, checked one by one

1. **Both configurations required — an *or* became an *and*.** ✅ **HOLDS.** Both were run; both
   verdicts are as `A2` states. This one earns its place: (a) and (b) are genuinely different
   experiments and (b) is the one that isolates the sharing as a variable.
2. **"*every* surviving kill" rather than "the surviving kills".** ✅ **HOLDS** — and see below: it
   **cannot fail** in either configuration.
3. **The evidence must be locatable.** ✅ **HOLDS.** It is in `A2`'s own code fence, in the build
   hop's notes, and now — independently re-derived — here.
4. **The stale `:113` corrected to `:121`.** ✅ **HOLDS, verified at source.** `AT_0` is declared on
   line **121** of `src/history-pane.nfr.test.ts` (md5 `65f4f29a…`).

## The one that cannot fail — reported because this ticket's whole subject is criteria that cannot fail

**Obligation 2 was added to close *"a reading in which one stray kill in the nfr file would have
passed."* In neither required configuration can that clause report:**

- **In (a) the nfr file is NOT LOADED.** A kill there is impossible by construction.
- **In (b) the fixture rebuild IS the transformation that disables the nfr file's only catcher.**
  Measured: with `A1` removed and the fixtures rebuilt, the whole nfr file catches `WCACHE-LEN`
  **zero** times (`749 passed`). The clause asserts the nfr file does not kill, over the exact
  configuration defined to stop it killing.

**This is not harmful and it is not a reason to fail anything** — `A2`'s content lives in obligation
1 and in the `Then`. But an added clause that cannot report on any build is the same shape as the
`A3` vacuity the ticket's own blockquote warns about, and it entered through the repair.

## The honest status of `A2`, stated as a judgement rather than a tick

**`A2` is MET, and it is NOT vacuous** — I ran it, the verdicts could have gone the other way, and
removing `A1` flips (b) to green. **But its discriminating power is entirely `A1`'s.** In all four
required cells the killing test is `A1` (or `A14`). `A2` cannot fail unless `A1` fails.

**`A2` is therefore a corroborating measurement, not an independent criterion** — which is what its
own ruling says in different words (*"corroborates a structural fact; it does not stand in for a
missing guard"*). I agree with that reading, and I would add the consequence the ruling leaves
implicit: **`A2` inherits `A1`'s blind spot exactly.** `WCACHE-LAST` — the sibling note — passes
`A2`'s configuration (a) at `24 passed` and configuration (b) at `750 passed`, so **a build that
`A2`'s own configurations declare clean is caught only by the sharing `A2` certifies is no longer
load-bearing.**

## `RISK-ABC028-02`'s bound — correctly drawn for the build it names, understated for the class

**Correct as far as it goes, and I verified the mechanism it rests on:** `A1` is at
`src/history-pane.test.ts:785`, that file imports **nothing** from the nfr file (seven imports, all
production modules), and vitest isolates per file — so rebuilding the `:121`+ fixtures **cannot**
reach `A1`'s verdict. Measured: configuration (b) with `A1` present still kills `WCACHE-LEN`.

**Understated in one direction, and it is the direction that matters.** The risk says *"the exposure
is small and it is bounded by construction."* That is true of `WCACHE-LEN`. **It is not true of the
cache class**: for `WCACHE-LAST` the rebuild removes the only guard in the project, which is
precisely the exposure `RISK-ABC017-01` was cut for. **The residual is real, it is larger than
recorded, and it is `RISK-ABC017-01`'s hazard rather than a smaller successor to it.**

## The comment half — true on the narrow reading, with one stale number

`A2` requires the comment to say *"only what is true."* Checked clause by clause against my own runs:

- *"the property is owned in `src/history-pane.test.ts`"* — **TRUE**, and it names the file, which is
  the obligation.
- *"with `A1` absent and these fixtures rebuilt per test, a pane keyed on `moves.length` passes the
  whole suite"* — **TRUE** (I measure `749 passed`).
- *"shared, it fails the two `toSan` call-count assertions below"* — **TRUE** (I measure exactly those
  two).
- *"a pane keyed on `moves.length` passes the whole suite **744/744**"* — the **count** is stale. The
  tree it is written in runs **750**, and that experiment reads **749** here. The sentence is
  attributed to a dated hop, so it is a historical figure rather than a false claim, but a reader who
  reproduces it will not see `744`.
- *"With `A1` landed **the cache** dies in `src/history-pane.test.ts` either way, so rebuilding these
  per test would no longer lose a guard"* — **the class generalisation is FALSE.** See the sibling
  note; this is the one that matters.

## Line-map nit, since this page made line-map accuracy a rule

The ticket's live pointer says the comment block is `:102-120`. At source, line **102 is blank** and
the comment runs **`:103-120`**. Off by one at the start; `:121` is right.
