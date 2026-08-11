---
id: 20260812T164000Z-qe-e2e-observation-rf1-probe-soundness-3c92b7e5
kind: observation
by: qe-e2e
at: 2026-08-12T16:40:00Z
verified_by:
confidence: high
refs:
  - quality-gate-ABC-017-narrow
  - ABC-017
  - NFR-002
  - NFR-008
  - EPIC-006
  - src/history-pane.nfr.test.ts
  - src/perft-bench.ts
  - 20260812T153000Z-software-engineer-decision-rf1-instrument-and-its-own-defect-c4b70e58
  - 20260812T154000Z-software-engineer-observation-lane-cost-measured-a20f5c73
supersedes:
---

# The `RF-1` load probe: SOUND and DETERMINISTIC. It cannot pass for a wrong reason inside its roots — but it CAN go red for one, twice, and one root is missing.

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp. The probe's own child script was transcribed verbatim out of
> `src/history-pane.nfr.test.ts:295-304` and re-executed standalone against varied root sets, so the
> claims below about its controls are measurements of the delivered instrument rather than readings
> of it.

## Verdict: the instrument is HONEST

It measures the property `A11` actually states — *"evaluating this file causes `src/history.ts`'s
module body to be evaluated"* — as a set-membership question over a **real Node ESM load graph**,
in a fresh child process, against the **delivered source files** rather than a vitest transform. That
is the right instrument for the property, it is blind to none of the five forms, and it needs no list
of syntaxes kept up to date. **The Engineer's own defect and its `?arming` fix are both verified
below rather than accepted.**

## DETERMINISTIC — 12/12, and the reason is structural

| runs | verdict | in-test duration |
|---|---|---|
| 12 consecutive | **12 passed, 0 failed, 0 flaky** | 56.9 – 70.0 ms, median ~61 ms |

**There is no wall-clock assertion, no concurrency, no ordering dependence and no timeout option on
the `execFileSync` call**, so a loaded machine costs the probe TIME and not CORRECTNESS. The child is
a fresh process every run with a fresh module cache. **The brief's worry — "a flaky child process on
a loaded machine" — does not reproduce**, and the reason it does not is that nothing in the probe
compares a duration to anything.

## The `?arming` fix WORKS, and that was verified rather than taken on trust

The Engineer's first version reported *"the probe is ARMED: expected [] to include 'history.ts'"* on
a build that genuinely pulled the module — the instrument announcing its own breakage when the truth
was a violated property. On the delivered version, run against the two builds that caused it:

| build | which assertion reports | so the arming control… |
|---|---|---|
| `WDYNIMP` | *"history.ts was evaluated in a production closure"* | **passed** — it is the 3rd assertion and the 4th is what fails |
| `WBAREIMP` | same | **passed** |

**The measurement is the assertion that reports, on both builds, which is exactly what the fix was
for.** Standalone re-execution confirms the mechanism: the arming control returns
`armed = ["history.ts"]` in **every** root configuration including `roots = []`, because a distinct
URL is a distinct module instance and the arming import is therefore independent of what the closure
phase loaded.

## Its three controls are FALSIFIABLE, not vacuous — proven by re-execution

The probe's own child script, run standalone against varied roots:

| roots | closure | `has history-pane.ts` | `has san.ts` | `armed has history.ts` | measurement |
|---|---|---|---|---|---|
| **delivered — 14 production modules** | 14 | PASS | PASS | PASS | PASS |
| `[]` — a probe that looks at nothing | 0 | **FAIL** | **FAIL** | PASS | (would pass vacuously) |
| `[san.ts]` — pane absent | 5 | **FAIL** | PASS | PASS | (would pass vacuously) |
| `[history-pane.ts]` — the pane alone | **7** | PASS | PASS | PASS | PASS |
| delivered **+ `history.ts` itself** | 15 | PASS | PASS | PASS | **FAIL** |

**The two positive controls are exactly what stops a vacuous pass, and they genuinely fire when the
closure is empty or narrow.** The `[history-pane.ts]` row reproduces the *"pane's runtime closure is
exactly seven modules"* figure independently; the last row confirms the Engineer's reason for
excluding `history.ts` from the roots is not stylistic — including it makes the probe permanently and
correctly red.

## Its REACH is wider than the record claims — three further forms, measured

Beyond `WDYNIMP` and `WBAREIMP`, all killed by the probe with the measurement message:

| build | form | verdict |
|---|---|---|
| `WQUERY` | `void import("./history.ts?v=2")` — a query-suffixed dynamic specifier | **KILLED** — the query-stripping in `seen()` works |
| `WREEXPORT` | `export { newGame } from "./history.ts";` — form 3 of the five | **KILLED** |
| `WINDIRECT` | a bare import inside `glyph-mode.ts` — a TRANSITIVE pull through a non-pane production module | **KILLED** |

`WINDIRECT` is the important one: **the probe guards the whole production graph, not just the pane.**
That is stronger than `A11`'s clause strictly requires and it is a genuine asset.

## THE GAP IN ITS SCOPE — `perft-bench.ts` is not a root, and a runtime pull there passes

| build | verdict | caught by |
|---|---|---|
| `WPERFT-DYN` — `void import("./history.ts")` in `perft-bench.ts` | **SURVIVES 744/744** | **nothing** |
| `WPERFT-STATIC` — `import { newGame } from "./history.ts";` in `perft-bench.ts` | **KILLED ×1** | **the delivered REGEX alone** — *expected [ 'perft-bench.ts' ] to deeply equal []* |

Two consequences, and the second is a correction to the record:

1. **`A11`'s own guard classifies `perft-bench.ts` as a production module** — its filter at
   `src/history-pane.nfr.test.ts:237-239` is *"`.ts` and not `.test.ts`"*, which includes it — while
   the probe's roots at `:282` exclude it. **So the criterion and the instrument disagree about what
   "production module" means**, and `WPERFT-DYN` breaches `A11` as written while the suite is green.
   That is a scope question, and it is BA/PM's: either the benchmark harness is out of scope for
   `A11` and the criterion should say so, or it is in scope and the probe cannot currently reach it.
2. **The Engineer's note says *"the regex is not load-bearing any more and nothing rests on its
   reach — that is the point of the probe"*. That is measurably FALSE.** `WPERFT-STATIC` is killed by
   the regex and by nothing else. The two instruments' coverage is **not nested**: the regex reaches a
   file the probe does not, and the probe reaches four forms the regex does not. **His decision to KEEP
   the regex was right for a better reason than the one he gave**, and the reason is worth correcting
   because the note as written invites a later hop to delete it as redundant.

## IT CAN GO RED FOR A WRONG REASON — two routes, both measured

### Route 1: stdout is a shared channel. **The probe would be the SOLE red in 744 tests.**

The probe parses the child's stdout as JSON. Any production **root** that writes to stdout at module
scope corrupts it.

| mutant | full-suite result | the message |
|---|---|---|
| `WSTDOUT` — `console.log(...)` at `glyph-mode.ts` module scope | **KILLED ×1 of 744** | `SyntaxError: Unexpected token 'g', "glyph-mode"... is not valid JSON` |
| `WSTDERR` — `console.error(...)` at module scope | **SURVIVES 744/744** | (stderr is not the channel — benign) |

**A production module gaining a module-scope banner breaks nothing in this project, and the ONLY
thing that goes red is `A11`'s structural guard, reporting a JSON parse error.** That is a symptom in
the wrong place — the exact misdiagnosis class this ticket has spent hops on, and the same shape as
the Engineer's own first-version defect.

**The trigger is named and dated rather than hypothetical.** Adding `perft-bench.ts` to the roots
today reproduces it exactly (`CHILD FAILED: Unexpected token 'A', "ABC-006 pe"... is not valid JSON`)
— which is the *real* reason that root cannot simply be added to close the gap above, and it is a
stronger reason than the one recorded at `:280-282`. **`AGENTS.md` records that there is no CLI entry
point until `EPIC-006`; the first module that prints at import will land there.**

### Route 2: vitest's default `testTimeout` DOES fire on a synchronous body — proven, with the margin measured

`execFileSync` blocks the event loop, so it is fair to ask whether vitest can time it out at all. It
can: a scratch test whose synchronous body blocks for 8 s fails with **`Error: Test timed out in
5000ms`** under the default configuration (this repo has no `vitest.config.*`, so `testTimeout` is
the 5,000 ms default).

| quantity | value |
|---|---|
| measured in-test duration | **56.9 – 70.0 ms** (12 runs) |
| default `testTimeout` | **5,000 ms** |
| **margin** | **~71× to ~88×** |

**So it is a real failure mode with a large margin, not an imaginary one and not a present risk.** If
it ever fires, the message is *"Test timed out in 5000ms"*, which names neither `history.ts` nor the
property. **I am not requesting a change** — an explicit timeout argument on the `it` would make the
guard say what it means, and that is the Engineer's call, not mine.

## CAN IT PASS FOR A WRONG REASON? Not inside its roots — and I looked for it

Every route I could construct is closed by the controls: an empty or narrowed root set fails the two
positive controls; a blind recorder fails them too; the arming control proves `history.ts` is
reportable; a query-suffixed or re-exported or transitive pull is caught. **The single
pass-for-a-wrong-reason is the `perft-bench.ts` root exclusion above**, and it is a scope gap rather
than an instrument defect.

## CAN IT BE MADE CHEAPER WITHOUT LOSING WHAT IT CATCHES? Measured, and the answer is essentially NO

The brief asked for a measurement rather than a preference, so here is the breakdown (wall, median of
9):

| configuration | cost |
|---|---|
| bare `node -e 0` spawn | **19.0 ms** |
| bare `node --input-type=module -e` spawn | 18.9 ms |
| probe with **1 root** (`history-pane.ts`, closure 7) | 52.1 ms |
| probe with the **delivered 14 roots** | **55.7 ms** |

**Narrowing the probe from 14 roots to 1 saves 3.6 ms of 55.7 ms — 6.5% — and it costs the `WINDIRECT`
kill**, which is the only assertion in the project that sees a transitive pull through a non-pane
production module. **The cost is structural: process spawn (19.0 ms, 34%) plus type-stripping the
modules, not the root count.** The honest cheaper alternative the Engineer named — a static
transitive-import walk at ~1 ms — loses `WQUERY`, `WDYNIMP` and `WBAREIMP`, which is three of the five
forms `A11` now enumerates, and cannot see a computed specifier at all.

**So: the probe is already near the floor of its own instrument class, and the ~102 ms CPU it costs
buys coverage that nothing cheaper reproduces.** If `N8-LANE` is ever breached, the Engineer's
instinct to revisit this first is right about where the cost IS and wrong about it being removable
without loss — and that is now a measurement rather than either of our opinions.

## One version floor, confirmed as the Engineer recorded it

`module.registerHooks` requires Node >= 22.15; this project runs v24.12.0 and `AGENTS.md` declares
Node >= 22. On an older 22.x the child throws and the test **fails loudly**, which is correct for a
guard — it must never pass by being unable to look — and it is deliberately not wrapped in a skip
(`quality.gate_enforcement` is `blocking`, skip count stays 0). **Agreed, unchanged, and not a gap.**
