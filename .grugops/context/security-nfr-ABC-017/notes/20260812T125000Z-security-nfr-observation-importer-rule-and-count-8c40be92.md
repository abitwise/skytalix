---
id: 20260812T125000Z-security-nfr-observation-importer-rule-and-count-8c40be92
kind: observation
by: security-nfr
at: 2026-08-12T12:50:00Z
verified_by:
confidence: high
refs:
  - security-nfr-ABC-017
  - ABC-017
  - ABC-016
  - NFR-002
  - src/history.ts
  - src/history-pane.ts
  - src/history-pane.nfr.test.ts
  - src/status-panel.nfr.test.ts
  - 20260812T101500Z-qe-e2e-observation-record-corrections-5c93e2b1
  - 20260812T042500Z-ba-pm-observation-importer-count-three-c05f8e26
supersedes:
---

# The importer re-verification: my RULE first, then my number. Production **ZERO**, test files **FOUR** — and the guard protecting it is blind in two directions.

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`.**
> This is the item the brief says the record has already been wrong on twice, so every number below
> is this gate's own and the ticket's bold **THREE** was treated as suspect, not as input.

## THE RULE, stated before the number

A file **F** is a **runtime importer** of `src/history.ts` if evaluating **F** causes
`src/history.ts`'s module body to be **evaluated**. That is the only definition under which
`NFR-002`'s premise means anything — the premise is *"nothing pulled the repetition derive into a
frame"*, and a module that is never evaluated cannot derive anything.

**Counts as an importer** (five forms, all checked):

1. static **value** import — `import { x } from "./history.ts"`, incl. `import * as ns` and mixed
   `import { type T, value }`
2. **bare side-effect** import — `import "./history.ts";`
3. **re-export** — `export … from "./history.ts"`
4. **dynamic** `import("./history.ts")` in a value position
5. `vi.mock("./history.ts", factory)` **where the factory actually calls `importOriginal()`** — that
   call evaluates the real module

**Does NOT count:** `import type { … } from` (erased — `verbatimModuleSyntax: true`, confirmed in
`tsconfig.json`); a type-position `import("./history.ts").GameHistory` or
`typeof import("./history.ts")`; and mentions in comments or strings. `require()` is N/A —
`package.json` is `"type": "module"`.

**One trap named because it nearly matters:** under `verbatimModuleSyntax`, a statement whose
bindings are *all* type-qualified (`import { type A, type B } from "x"`) is preserved as
`import {} from "x"` — a side-effect import, hence rule 2. **No such statement exists here**, but a
rule that did not cover it would be wrong the first time one is written.

## THE METHOD — I did not settle this by `grep` alone

The ticket asks for a `grep`. I ran one, exhaustively — every `.ts`/`.js`/`.json` file in the repo,
for every textual occurrence of `history.ts`, plus separate sweeps for re-exports, bare imports and
extensionless/aliased paths (`from "./history"`). **Zero re-exports, zero bare imports, zero
extensionless paths.** So the textual surface is fully enumerated and nothing can hide from the
classification below.

But the record has been wrong twice **by counting syntax**, so the load-bearing half was measured
instead: a **`node:module` load recorder** over the real module graph.

## PRODUCTION RUNTIME IMPORTERS: **ZERO** — measured, not grepped

| probe | modules loaded | `history.ts` loaded |
|---|---|---|
| roots = all **14** non-test production modules (excl. `history.ts` itself and the self-executing `perft-bench.ts`) | 14 | **0** |
| root = `history-pane.ts` alone | 7 | **0** |

The pane's entire runtime closure is exactly seven modules: `apply`, `fen`, `history-pane`,
`legal`, `moves`, `position`, `san`. **`history.ts` is not in it, and neither is `gameend.ts`.**

**Controls, because a zero is worthless without them:**

- **Positive:** `history-pane.ts` loads (1) and `san.ts` loads (1) — the probe sees what it should.
- **Arming (negative control):** a throwaway module carrying `import "./history.ts";` was loaded
  through the same recorder → **`history.ts` loaded: 1 ⇒ INSTRUMENT IS ARMED.** The zero above is a
  real zero, not a blind one.
- **My own first probe was defective and is discarded:** it imported `history.ts` *as a root*, so
  its load was self-inflicted and proved nothing. Corrected by excluding it from the roots.

**`NFR-002`'s `O(window)` structural premise HOLDS on delivered code.** This is a stronger result
than the ticket asked for: not "no line matches a regex" but "the module is never evaluated".

## TEST-FILE RUNTIME IMPORTERS: **FOUR**

| file | form | rule | whose |
|---|---|---|---|
| `src/history.test.ts:15-23` | multi-line static **value** import (`gameStatusOf`, `keyHistory`, `newGame`, `playMove`, `repetitionCounts`, `takeBack`) | 1 | pre-existing |
| `src/status-panel.nfr.test.ts:16,17,49` | `vi.mock` + `importOriginal()` + `await import` | 5, 4 | **`ABC-016`'s — already on `main`** |
| `src/history-pane.test.ts:27` | static value import (`newGame`, `playMove`, `takeBack`; `GameHistory` type-qualified) | 1 | `ABC-017` |
| `src/history-pane.nfr.test.ts:43,44,59` | `vi.mock` + `importOriginal()` + `await import`; its static import at `:25` is type-only | 5, 4 | `ABC-017` |

Correctly **excluded**: `src/status-panel.test.ts:33` and `src/status-panel.ts:42` and
`src/history-pane.ts:61` are all `import type`; `src/status-panel.nfr.test.ts:58` is a type-position
`import(...)`; `src/san.ts:16` is a comment.

**FOUR. QE is right and the ticket's bold THREE is wrong**, for exactly the reason QE gives — the
ticket's table is scoped to the files this ticket touches while the sentence above it claims a
total. **This ticket takes the count from two to four, not from one to three.** I re-ran it rather
than inheriting it, and I reached QE's number independently.

## THE PART THAT IS MINE, AND IT IS A REQUIRED FIX

`A11`'s structural half is guarded in-suite by
`/^import\s+(?!type\b)[^;]*from\s+"\.\/history\.ts";/m` over production files
(`src/history-pane.nfr.test.ts:219-242`). **It implements rule 1 only.** Measured on delivered code,
both mutants built and reverted:

| mutant | what it injects into `src/history-pane.ts` | `npm test` | this gate's load probe |
|---|---|---|---|
| `WDYNIMP` | `void import("./history.ts");` | **SURVIVED 740/740** | **CAUGHT** — `history.ts` loaded: 1 |
| `WBAREIMP` | `import "./history.ts";` | **SURVIVED 740/740** | **CAUGHT** — `history.ts` loaded: 1 |

Both are genuine runtime pulls that void the premise, and **the guard sees neither.** QE found both;
I reproduced both independently and, more usefully, showed that a strictly better instrument exists
and is cheap. Confirmed HEALTHY in the same regex and recorded so nobody re-sweeps it: multi-line
`import { … }` blocks and `import * as ns` **are** matched.

**Why this is a Security/NFR item and not a criteria-wording item.** `A11`'s *clause* is right and
BA/PM already ruled it stays — I agree and propose no change to it. What is wrong is the **reach of
the guard that protects an NFR row's structural premise**, and the health of `NFR-002` is this
gate's. So it is named here as a required fix rather than routed to BA/PM as a criteria gap.

**The fix, specified but NOT implemented** (the brief forbids me writing a fixture, and I have not):
replace the regex with a load-closure assertion — import the pane in a recorder and assert
`history.ts` never loads. It is blind to none of the five forms, it needs no list of syntaxes to
keep up to date, and it asserts the property `NFR-002` actually depends on rather than a proxy for
it.

- **Severity: medium.** Not `high`, and the reason is stated rather than assumed: nothing is broken
  today — production importers are zero, measured — so this is a regression-detection gap, not a
  violated bar. It fails no ASVS L1 requirement, so the L1→`high` default does not apply, and
  `security.block_on` is `high`. **It does not block this merge.**
- **Owner: BA/PM (if any criterion text moves) and the Software Engineer (the guard itself), at the
  `G1`/`G2` fixture hop** — the hop QE already identified as the one that returns to the Engineer
  for fixtures only.
- **Trigger: the next edit to `src/history-pane.nfr.test.ts`, or `ABC-019`'s `ADR-0009` cl. 9f
  re-gate against real panels, whichever comes first.** `ABC-019` is the live consumer that would
  first pay for a voided `O(window)` claim.
