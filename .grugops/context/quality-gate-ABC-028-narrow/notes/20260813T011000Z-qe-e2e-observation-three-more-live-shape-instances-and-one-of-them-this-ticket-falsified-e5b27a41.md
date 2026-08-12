---
id: 20260813T011000Z-qe-e2e-observation-three-more-live-shape-instances-and-one-of-them-this-ticket-falsified-e5b27a41
kind: observation
by: qe-e2e
at: 2026-08-13T01:10:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A4
  - ABC-028-A5
  - ABC-017-A9
  - RISK-ABC017-01
  - RISK-ABC028-02
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - src/zobrist.nfr.test.ts
  - src/status-panel.nfr.test.ts
  - src/gameend.nfr.test.ts
supersedes:
---

# YES, THERE ARE MORE: three further live instances in `src/` — and the sharpest one was falsified by **this ticket's own `A4`**, one day after it was written

> **Hand-authored, no stamp.** Every claim below was measured on this tip. **Nothing was repaired:**
> `src/` is fenced for a gate as it was for BA/PM, `git diff -- src/` is EMPTY, and all digests are
> unchanged. These are REPORTED AND ROUTED.

BA/PM found two live instances by hunting the SHAPE rather than the STRING, and recorded that a
four-string blacklist returns **117 false positives and both of these as false negatives**. The
Orchestrator asked whether there are more. **I built the instrument instead of grepping, and the
answer is three more — one of them worse in kind than a stale number.**

## THE INSTRUMENT, and why it is not another blacklist

The defect shape is *a sentence claiming more than what was measured*. In a **comment**, that is
almost always one of three mechanically checkable things, so I checked all three exhaustively over
every comment in every one of the 42 `src/*.ts`:

1. **A source citation (`path.ts:NN`) that no longer points where it says.**
2. **A tree count (`N modules`, `N files`, `all N tests there`) the tree no longer has.**
3. **A suite/lane figure the suite no longer reports.**

**Its false-positive count does NOT grow when the rule is discussed** — which is the exact property
BA/PM's `grep` failed on, and the reason this is an instrument and that one is a census.

**Result on (1): 27 citations in `src/` comments, ZERO broken.** Every one resolves, and I printed
the cited line for each. That is a clean negative and it is worth as much as the positives — it says
`## Test notes` 13's discipline is actually being kept in `src/`.

## Instance 3 — `src/history-pane.test.ts:493`, and it is the one that matters

> *"Measured: `WPOS` — a pane that corrupts the caller's `history.position` once per object and
> changes no rendered byte — **passes 732/732 on 26 files** against the shared fixtures, **with zero
> catchers anywhere in the project**, and fails here."*

Present tense, and **load-bearing**: it is the stated reason `buildAllCases()` is called inside each
`A9` test.

**Both halves are now false, and the second half is the finding.**

```
built here: a pane that corrupts the caller's history.position once per object and changes
no rendered byte (the pane parses initialFen itself and never READS history.position)

  WPOS on this tip:  2 failed / 755 on 26 files
    FAIL  A9 — neither render touches the caller's position, its move count or its ANCHOR
    FAIL  A4 — no write reaches the caller's graph during a render, at all ten lengths
```

- **The denominator is stale**: `732/732` against a suite of **755**.
- ***"With zero catchers anywhere in the project"* IS FALSE.** There is a second catcher and it is
  **`ABC-028`'s own `A4`** — `describe("ABC-028 acceptance")` at `:766`, the `it` at `:946`,
  introduced by **`8de988d` on 2026-08-12**. The sentence was written at **`0b508a2` on
  2026-08-11**. **This ticket falsified it the next day, in the same file, and neither the build hop,
  the comment hop, nor my own whole-ticket gate noticed.**

**This is the first instance on this stack whose falsifier is `ABC-028` itself**, and it is a
different and worse kind than the other four: BA/PM's two are a stale *number* and an over-wide
*reassurance*; this one is a claim of **exhaustiveness** (*"zero catchers anywhere"*) that a later
criterion silently made untrue. **A number going stale is visible to anyone who re-runs it. An
exhaustiveness claim going stale requires somebody to build the mutant.**

**It is not a code defect and no criterion is unmet.** `A9` is correct, `A4` is correct, `WPOS` dies
to both, and the extra catcher makes the tree STRONGER than the comment says. **The defect is
entirely in the record.**

## Instances 4 and 5 — a whole CLASS, in the `*.nfr.test.ts` files' standing justification

Four `*.nfr.test.ts` files carry the same sentence shape: *"a `vi.mock` factory is hoisted to file
scope, so putting this in `X.test.ts` would re-route the module graph for **all N tests there** to buy
these."* **`N` is a live count of a sibling file and goes stale whenever anyone adds a test to it.**

```
site                            claims   MEASURED on this tip   verdict
src/gameend.nfr.test.ts:13      45       gameend.test.ts = 45   HOLDS
src/zobrist.nfr.test.ts:18      13       zobrist.test.ts = 23   STALE
src/status-panel.nfr.test.ts:11 26       status-panel.test.ts = 29   STALE
```

**The instrument discriminates** — one of the three holds, so this is not a blanket alarm.

**Both stale ones were EXACTLY RIGHT when written**, which is the whole point of the shape:

- **`zobrist.nfr.test.ts:18`.** At `584defa` — the commit that created the file — `zobrist.test.ts`
  had 13 `it(` and no `it.each`: **13, exact.** Then `2efe9ac` and `862c687` each added an `it.each`
  table → **23 today.** And `d74476b` later re-opened `zobrist.nfr.test.ts` and did not update the
  number.
- **`status-panel.nfr.test.ts:11`.** At `695a2e7` — the commit that created the file —
  `status-panel.test.ts` was **26** (13 static `it(` less the loop's own, plus 14 `CASES` entries;
  the same reconstruction gives 29 at HEAD, which matches vitest exactly). `a13d0f0` took it to 27,
  **`dc06b40` took it to 29 — and `dc06b40` edited the nfr file in the same commit** without moving
  the number.

**Twelve lines apart inside `zobrist.nfr.test.ts` sit the two forms, by the same author:** `:12` is a
DATED witness (*"Measured at the `ABC-011` QE gate: both mutations left all 189 tests green"*) and is
immune to staleness; `:18` is a LIVE claim and is stale. **That contrast is the repair, demonstrated
in one file rather than argued.**

## What I did NOT count as an instance, stated so the census can be trusted

**I excluded every PAST-TENSE dated witness** — *"that mutant passed all 271 tests"*, *"survived all
221 tests"*, *"six wrong builds pass all 652 tests on 20 files"*, the `559/559` and `578/578`
mutant-campaign tables. They describe a measurement at a named past hop and assert **nothing about
the current tree**. Counting them would have produced a second 117-false-positive instrument, which
is the failure this whole thread exists to avoid. **Roughly forty such lines were seen and
deliberately not reported.**

I also excluded `src/san.nfr.test.ts:19`'s *"the 52 rows in `san.test.ts`"*: `san.test.ts` has one
commit in its whole history (`1e39511`, *"all 52 string agree"*, `+371 / −0`) and **has never been
modified since**, so that number cannot have gone stale.

## The tally, and it is the number that decides the scope question

**Five live instances of the shape are now measured in `src/` on this tip. ONE of them is inside the
region the convention still binds.**

```
site                                  inside :103-123 ?   found by
src/history-pane.nfr.test.ts:115      YES                 BA/PM
src/history-pane.test.ts:1014         no                  BA/PM
src/history-pane.test.ts:493          no                  THIS HOP
src/zobrist.nfr.test.ts:18            no                  THIS HOP
src/status-panel.nfr.test.ts:11       no                  THIS HOP
```

**And `src/` still contains ZERO occurrences of the four banned strings** — re-measured here. **A
string census scores `src/` at 0; the shape census scores it at 5.** That is `F4`'s case restated
with a bigger denominator, and it is the measurement the sibling note uses.

## Owner and lean

**Owner: whoever next opens each block under a criterion that reaches it.** No date: latent, and
recorded as latent — the same disposition BA/PM gave its two, for the same reason.

**My lean, said plainly: instance 3 is worth a repair and the other two are not.** Instance 3's
sentence is load-bearing for a design decision and is now *false*, not merely stale, and the repair is
one clause (*"…and, since `ABC-028`, `A4` catches it too"* — or better, state the SHAPE: *"caught
only where the fixture is built inside the test"*). Instances 4 and 5 are stale numbers in a
justification whose ARGUMENT is unaffected — the `vi.mock` hoisting reason holds at 13, 23, 26 or 29
— and refreshing them buys one hop of accuracy and re-arms the same defect, which is BA/PM's own
ruling on its instance 1 and I apply it unchanged. **The durable repair for all three is the same:
state the SHAPE, not the total.**
