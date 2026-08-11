---
id: 20260812T153000Z-software-engineer-decision-rf1-instrument-and-its-own-defect-c4b70e58
kind: decision
by: software-engineer
at: 2026-08-12T15:30:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-017-fixtures
  - ABC-017
  - NFR-002
  - src/history-pane.nfr.test.ts
  - src/history.ts
  - 20260812T125000Z-security-nfr-observation-importer-rule-and-count-8c40be92
  - 20260812T144500Z-ba-pm-decision-rf1-verdict-2c74e9f0
supersedes:
---

# `RF-1`'s guard: a module-graph LOAD probe in a child process — and a defect in my OWN first version of it

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp.

BA/PM ruled the reach half of `RF-1` **the Engineer's alone** and added nothing to the instrument.
This note is that half.

## The instrument

A child `node` process registers a `node:module` load hook, imports the **14 non-test production
modules** as roots, and reports every `file:` URL that was loaded. `A11`'s property — "evaluating
this file causes `src/history.ts`'s module body to be evaluated" — is then a set membership question
rather than a pattern match, so it is blind to none of the five forms and needs no list of syntaxes
kept up to date.

Roots exclude two files, each for a stated reason: **`history.ts` itself**, because importing the
thing under test as a root is a self-inflicted load that proves nothing (Security/NFR's own first
probe had exactly this defect and discarded it, and I did not repeat it), and **`perft-bench.ts`**,
which calls `main()` at module scope (`:114`).

**Three controls, because a zero without controls is worthless:**

| control | assertion | why |
|---|---|---|
| positive | the closure contains `history-pane.ts` | an empty closure cannot pass vacuously |
| positive | the closure contains `san.ts` | the recorder sees transitive dependencies, not just roots |
| arming (negative) | a root whose closure *does* contain `history.ts` reports it | the recorder is not blind to the one module the test is about |

Measured on the delivered tree: the pane's closure is **exactly seven modules** — `apply`, `fen`,
`history-pane`, `legal`, `moves`, `position`, `san` — and the full 14-root closure is 14 modules with
**`history.ts` absent from both**. That reproduces Security/NFR's measurement independently.

## THE TRAP, and why the probe runs in a child

`src/history-pane.nfr.test.ts` **is itself a runtime importer of `src/history.ts`** — `vi.mock` +
`importOriginal()` at `:43-44` and `await import` at `:58-60`, which this file's own spies and `A7`'s
`takeBack` require. So a probe phrased as *"`history.ts` never loads in this process"* would fail in
the very file that holds it. The property is about the **pane's runtime closure**, not the test
process's, and a child process rooted at the production modules is that scoping made mechanical. This
is also why `A11` needed the word `PRODUCTION`: without it the correct fix reads as a contradiction
of the criterion.

## THE DEFECT IN MY OWN FIRST VERSION — reported rather than smoothed, because it is the exact shape this ticket exists to prevent

My first probe imported the arming root **after** the closure phase, in the same process and at the
same URL. It killed `WDYNIMP` and `WBAREIMP` — but with **the wrong message**:

> `AssertionError: the probe is ARMED: expected [] to include 'history.ts'`

The cause: a build that really does pull `history.ts` loads it during the **closure** phase, so by
the time the arming import runs the module is already cached and produces **no fresh load event**.
The arming control then reads as failed. **So the guard announced *"the instrument is broken"* when
the truth was *"the property is violated"* — a symptom reported in the wrong place, by the guard
written to stop symptoms being reported in the wrong place.** `AR-2`'s whole argument for running this
hop before the merge is that a misdiagnosis is more expensive than a failure, and my first instrument
produced one.

**The fix:** the arming root imports `history.ts?arming`. A distinct URL is a distinct module
instance, so the control always produces a fresh load event and is **independent of what the closure
phase loaded**. Re-run on both mutants afterwards: each now fails on the measurement itself —
*"history.ts was evaluated in a production closure"* — and the arming control passes. The `?arming`
query is load-bearing and the comment at its site says so, with the reason, so it is not "tidied away"
later.

## What I did NOT do: the delivered regex is KEPT, not replaced

Security/NFR specified *"replace the regex with a load-closure assertion"*. I **added** the probe as
its own `it` and left the existing assertion untouched. Three reasons:

1. **The brief forbids weakening or deleting any existing test.** Replacing a passing assertion is
   the kind of change that is defensible right up until it is the one that mattered; adding is not.
2. **The two report different things.** The regex names the realistic regression (someone writes
   `import { repetitionCounts } from "./history.ts"`) cheaply and legibly at the source line; the
   probe names the property. On a static-import regression both fire and agree.
3. **The project's own tripwire/requirement rule** says a narrower check and the requirement do not
   share an `it`. They are two `it`s, so each reports its own verdict.

The regex is **not** load-bearing any more and nothing rests on its reach — that is the point of the
probe — but it costs microseconds and removing it buys nothing.

## Cost, stated here because it is the one real trade in this hop

The probe spawns a process: **~102 ms CPU** measured (see the lane note), which is the dominant term
in this hop's whole lane cost and is **not** what BA/PM's estimate anticipated (*"small: replaces a
`readFileSync` scan of 14 production files with a load probe over a 7-module closure"*). `N8-LANE`
still holds with room. **If the lane bar is ever threatened, this is the item to revisit first**, and
the honest alternative is a static transitive-import walk — cheap, but it counts syntax, which is what
the record has already been wrong about twice and cannot see a computed dynamic specifier.

## One version floor, named rather than handled

`module.registerHooks` requires Node >= 22.15; this project runs **v24.12.0** and `AGENTS.md` declares
Node >= 22. On an older 22.x the child would throw and the test would **fail loudly**, which is the
correct behaviour for a guard — it must never pass by being unable to look. It is deliberately **not**
wrapped in a skip: `quality.gate_enforcement` is `blocking` and the skip count must stay 0.
