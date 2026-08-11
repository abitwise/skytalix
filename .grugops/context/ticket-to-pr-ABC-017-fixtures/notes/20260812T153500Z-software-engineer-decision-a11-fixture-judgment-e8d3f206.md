---
id: 20260812T153500Z-software-engineer-decision-a11-fixture-judgment-e8d3f206
kind: decision
by: software-engineer
at: 2026-08-12T15:35:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-017-fixtures
  - ABC-017
  - src/history-pane.nfr.test.ts
  - src/history-pane.test.ts
  - 20260812T144000Z-ba-pm-observation-g2-trap-resolved-6e13a8d5
  - 20260812T100500Z-qe-e2e-observation-mutants-9f2b41c7
supersedes:
---

# `A11`'s per-test-fixture tidy-up: DECLINED — and BA/PM's resolution VERIFIED rather than taken on trust

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp.

BA/PM's ruling gave me a freedom, not an instruction: *"`A11` may now be tidied to per-test fixtures
freely and nothing is lost. Do that only if you judge it right, and say so either way."* This is the
judgment, and the load-bearing half of it is a measurement rather than a preference.

## First: is the premise true? MEASURED, and it is

The whole ruling rests on `A14` owning freshness so that `A11`'s incidental catcher stops being
load-bearing. I did not assume it. `WCACHE` was run against **`src/history-pane.test.ts` alone, with
`A11`'s file not loaded at all**:

```
× ABC-017 acceptance > A14 — the caller is still USABLE after a render, and the next render is FRESH
  Tests  1 failed | 17 passed (18)
```

**`A14` kills a caching pane with `A11`'s fixtures nowhere in the process.** The two directions QE
found pointing at each other no longer do, and that is now a demonstrated fact rather than an
argument. On the full suite `WCACHE` fails **three** tests — `A14` plus the two incidental `A11`
ones — so the guard is now **redundant**, which is exactly the state the ruling was aiming for.

## The judgment: leave `A11`'s fixtures shared

**Declined, for three reasons in the order they carry weight.**

**1. It is not one of the four edits, and the cheapest diff is the one a reviewer can verify.** The
subtask names four edits; this is a fifth, optional, and it touches a file the narrow Security/NFR
re-gate is about to read. `AGENTS.md` rules 5, 9 and 10 — only requested features, preserve adjacent
code, do not refactor working code — all point the same way.

**2. It costs something real and buys nothing.** Measured: one full rebuild of `A11`'s eight
fixtures is **9.3 ms warm, of which 6.0 ms is the 2,000-ply knight shuffle**. Five of `A11`'s tests
use the heavy fixtures, so per-test rebuilding is on the order of **~50 ms** of the 650 ms content
allowance — spent to delete a guard that is now redundant rather than wrong. Against that, the thing
tidying would buy is nothing: BA/PM's ruling says nothing is **lost**, and it nowhere says anything is
**gained**.

**3. The reason `D23` forced fresh fixtures on `A9` does not apply to `A11`.** `D23` is about a
snapshot taken over an object an earlier unrelated test already rendered. `A11` takes no snapshot; it
counts calls and clears its spies in `beforeEach`. The hazard `D23` names is not present here, so
"generalise the `D23` remedy" was always an analogy rather than a consequence.

## What I did instead, and why it is the part that matters

The danger QE actually named is **not** that the fixtures are shared — it is that the next person to
tidy them would remove a guard **without knowing it existed**. Leaving the fixtures alone does not fix
that; it just postpones it. So the fact is now recorded **at the fixture site**, where the tidy-up
would begin:

> `THE SHARING HERE IS NO LONGER LOAD-BEARING, and that is now measured rather than argued. … `A14`
> now owns that property explicitly, with its own deliberately shared object, and it kills a caching
> pane with THIS FILE not even loaded. So these may be rebuilt per test freely; measured, doing so
> costs ~9.3 ms per rebuild (6.0 ms of it the 2,000-ply shuffle) and buys nothing, which is why it
> was declined rather than forgotten.`

**"Declined rather than forgotten" is the whole point of writing it there.** A future reader
inheriting a bare shared fixture cannot tell a decision from an oversight, and on this ticket that
ambiguity has been a recorded defect more than once.

## `A14`'s own sharing is deliberate and is NOT a `D23` regression

Recorded so a later sweep does not "fix" it. `A14` builds its own object inside the test, renders it,
mutates it with `playMove`, and renders **the same object** again. `D23` is about an object an
**earlier, unrelated** test rendered before a snapshot was taken; `A14` has no snapshot and no earlier
test. **The sharing IS the assertion** — freshness is a statement about a sequence, and a fresh object
has no previous render to be stale against. The docblock at the test says so.
