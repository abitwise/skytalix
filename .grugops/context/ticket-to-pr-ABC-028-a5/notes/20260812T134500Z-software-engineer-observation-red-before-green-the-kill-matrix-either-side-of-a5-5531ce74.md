---
id: 20260812T134500Z-software-engineer-observation-red-before-green-the-kill-matrix-either-side-of-a5-5531ce74
kind: observation
by: software-engineer
at: 2026-08-12T13:45:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-02
  - src/history-pane.test.ts
supersedes:
---

# RED before GREEN — the kill matrix either side of `A5`, every cell run

The mutants were built from **the ticket's own definitions**, not from QE's harness, per the brief.
One generator parameterised on the axis itself (`TAIL` = how many trailing move identities join
`moves.length` in the key), so `WCACHE-LEN`, `WCACHE-LAST` and `WCACHE-LAST2` are the same code at
`TAIL` 0, 1 and 2 and cannot differ by a transcription slip. It pins **this tip's** pane
`c4653c4c…` and throws otherwise.

## Config (a) — `src/history-pane.test.ts` ALONE, the nfr file NOT LOADED

This is the configuration that answers *"is the guard owned by the file that owns the property, or is
it still an accident in another file?"*

```
build          BEFORE A5        AFTER A5              what kills it after
WCACHE-LEN     1 failed / 24    3 failed / 26         A1, A5 row 1, A5 row 2
WCACHE-LAST    24 passed        2 failed / 26         A5 row 1, A5 row 2
WCACHE-LAST2   24 passed        1 failed / 26         A5 row 2 ONLY
```

**`WCACHE-LAST` went from NOTHING to two kills in the file that owns the property.** That is the
whole point of the criterion, and it is the sentence `A5` was written to make true.

## Full suite, 26 files

```
build          BEFORE A5                     AFTER A5
delivered      750 passed                    752 passed
WCACHE-LEN     3 failed / 750 (A11x2 + A1)   5 failed / 752 (A11x2 + A1 + A5 row1 + A5 row2)
WCACHE-LAST    2 failed / 750 (A11x2 ONLY)   4 failed / 752 (A11x2 + A5 row1 + A5 row2)
WCACHE-LAST2   2 failed / 750 (A11x2 ONLY)   3 failed / 752 (A11x2 + A5 row2)
```

`A5`'s lane clause is met exactly as written: on `WCACHE-LAST` the suite now reports a failure **in
`src/history-pane.test.ts`**, the count rises, and at least one kill is in the file that owns the
property — where before, both kills were in the nfr file.

## `A1` was re-run and still kills `WCACHE-LEN`

Required by the brief and confirmed in both configurations above (`1 failed / 24` alone; present in
the full-suite list). **`A5` did not disturb `A1`** — it is a sibling on the same axis, not a
supersession, and `A1`'s `it` was not opened.

## The delivered pane is GREEN on both rows

`752 / 752` on 26 files, skip 0. The two `A5` rows pass on the delivered pane and fail on every build
in their class — which is the discrimination `## Test notes` 5 demands and `D27` bars the absence of.

## What this does NOT establish, stated because the ticket's whole subject is over-claiming

It does not close `RISK-ABC028-02`'s standing hazard for the **whole** class. The restated bound is
*bounded for every cache class with an owned guard in `src/history-pane.test.ts`, unbounded for every
class without one*. **This hop moved exactly two classes across that line** — the length-and-last-
identity cache and the length-and-last-two cache. A cache keyed on the last **three** identities
still has no owned guard, and rebuilding the nfr fixtures per test would still lose nothing for it,
because it was never caught there either.
