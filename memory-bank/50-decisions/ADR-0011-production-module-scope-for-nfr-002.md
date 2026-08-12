# ADR-0011: What a "production module" is for `NFR-002`'s structural premise — and the two different properties its two guards actually hold

## Status

**accepted** — 2026-08-12 by Architect/Design at task `design-ABC-029-2026-08-12`, subtask
`design-ABC-029-production-module`, Workflow 07, on the open design question `ABC-029` was cut
carrying and the internal contradiction BA/PM flagged at `refinement-ABC-019-a11`.

**AMENDED 2026-08-12 at task `design-ABC-029-loss-2026-08-12`, subtask `design-ABC-029-loss-record`
— the kill LEDGER's count is corrected, clause 1 and clause 3 gain measured bounds they did not
carry, and one containment is ADOPTED. Clauses 1–4 are unchanged in what they RULE.** The ruling
survives its own audit; its arithmetic did not. A §14 gate measured *"LOST — exactly one"* to be
wrong **by four times**, and the corrections are written into this file as blocks rather than in
place of the original, because the way the count went wrong is more instructive than the number.
Still `accepted`, still no target and no level, still zero production lines. **The one change that
reaches code — widening the regex to two textual forms it misses — is a TEST-file change and it
routes to the Engineer; this ADR rules it and does not write it.**

**AMENDED AGAIN 2026-08-12 at task `design-ABC-029-max-2026-08-12`, subtask `design-ABC-029-maximum`,
Workflow 07 — one RATIONALE sentence is struck as OVERSTATED and the alternative it dismissed is
re-measured, priced and REJECTED ON ITS MERITS. No clause, no verdict, no criterion row and no line
of the Engineer's hop changes.** BA/PM flagged at `refinement-ABC-029-rows` that *"6 of 12 is the
**maximum** a textual guard may recover"* over-reaches in the same shape as the word *"non-static"*
this file already corrected — the sentence states the ceiling for the class of guard that was
**considered** as the ceiling for **all** textual guards. **BA/PM marked that `UNKNOWN - verify` and
said plainly it had not built or run it. It was built and run here: the counterexample is CORRECT and
recovers 12 of 12 while breaking no accepted criterion.** The sentence is struck and bounded; a new
**alternative 11** records the rule, and a priced **rejection** records why it is still not adopted —
it false-positives on a construct this file's own `A3` ruling calls not-a-breach. **This is the third
instance of one defect shape in this file, and the second reason the fix is a bound rather than a
reversal: the RULING was right all three times, one of its reasons was not.**

**No target moves and no level is set, so no owner ratification is owed** — the same distinction from
`ADR-0008` that `ADR-0009` and `ADR-0010` both draw. `ADR-0008` needed **Olger Oeselg** because it
fixed a budget *level* a human has to value; there is no level here. Every claim below is
gate-adjudicable: it either fails on the constructed builds in `## Context` or it does not, and
**every one was run** — 15 builds against a byte-verified replica of `ABC-019`'s red tip.
**`ADR-0004`'s by-delegation ratification is NOT relied on and NOT extended**, exactly as `ADR-0008`'s
Status section requires.

> **The ratification question was RE-ASKED at the amending hop, not inherited, because the obvious
> challenge to it is that accepting a residual is a level.** It is not, here, and the reason is
> countable. The residual this amendment leaves is the **two dynamic forms** in unlicensed,
> off-frame-path modules — and that residual was already ruled, in this file's `A3` ruling
> (`WPERFT-DYN` **not a breach**) and scored through `ABC-029`'s Definition of Ready. **No new risk is
> accepted.** The one genuinely new risk the gate found — `WLAUNDER`, an unlicensed module becoming a
> runtime importer, which clause 3 asserts cannot happen — is **closed by this amendment, not
> accepted.** Every correction below moves the record toward a **stricter** guard and a **larger**
> admitted loss. Nothing here asks a human to value anything, so nothing here is escalated, and
> **no ratification was manufactured.**

**ZERO production lines and ZERO test lines are written by this decision.** It rules; the build hop
writes. `ADR-0002`, `ADR-0008`, `ADR-0009` and `ADR-0010` are **read, not re-opened**. `ABC-017` is
**not re-opened, not moved, not edited** — its `A11` was MET and stays discharged.

## Context

`NFR-002`'s `< 16 ms` target rests on a **structural** premise, and the catalog row states that
premise in its own words: *"If a **renderer** ever pulls the repetition derive into a **frame**, the
frame is `O(plies)` again and this row's `O(window)` statement is void"*, and *"The quantity belongs
to the LOOP (`ABC-019`), not to a frame."*

`ABC-017`'s `A11` guards that premise with two instruments in `src/history-pane.nfr.test.ts`, and
they were fused under one criterion because both mention `src/history.ts`:

| instrument | site | file set today |
|---|---|---|
| the **regex** guard | `:236-250` | every `.ts` that is not a `.test.ts` — **includes** `perft-bench.ts` |
| the **load probe** (`RF-1`) | `:276-328` | the same list **minus** `history.ts` **minus** `perft-bench.ts` |

The criterion above them says *"production modules"* and never says what one is. `D27` defined
*"runtime importer"* exhaustively and left the other half of the phrase open. That undefined word has
now bitten twice from opposite sides: `RISK-ABC017-04` is *a file the criterion covers and the
instrument does not*; `src/turn-loop.ts` is *a file both instruments cover and the property does not*.

### Everything below was measured at this hop, out of tree, on a byte-verified replica

`ABC-019`'s tip was reconstructed from the git object database — **17 non-test `.ts` files, all 17
`cmp`-identical to `grugops/ABC-019-turn-loop-skeleton`**, `src/turn-loop.ts` md5
`bd793612476c9d0eac28b75e1e3297cc`, which is the figure BA/PM recorded. **The `ABC-019` worktree was
never opened.** The probe's child script was transcribed verbatim from
`src/history-pane.nfr.test.ts:295-304`. **No file in any repository worktree was written by any
measurement.**

**1. The parent hop's figures reproduce.** The render closure rooted at the five renderers
(`frame`, `render`, `history-pane`, `status-panel`, `glyph-mode`) is **11 modules** — `apply`, `fen`,
`frame`, `glyph-mode`, `history-pane`, `legal`, `moves`, `position`, `render`, `san`, `status-panel`
— and **`history.ts` is NOT among them**; the arming control reports `history.ts`; the delivered
15-root probe **does** report it, so the red is real and the instrument is not blind. `A11`'s regex
over the 17 files returns **exactly `["turn-loop.ts"]`**.

**2. THE MEASUREMENT THIS ADR TURNS ON, and it refuted the first design I tried.**
**`src/frame.ts` imports NOTHING — its runtime closure is exactly ONE module, itself.**

```
frame.ts        ->  0   (closure = { frame.ts })
glyph-mode.ts   ->  0
render.ts       ->  1   position.ts
history-pane.ts ->  6   apply, fen, legal, moves, position, san      (the "exactly seven" figure)
status-panel.ts ->  6   apply, fen, legal, moves, position, san
turn-loop.ts    ->  9   apply, fen, frame, gameend, history, legal, moves, position, zobrist
```

**A frame is composed by INJECTION, not by import.** `frame.ts` receives rows as data and never
imports a producer; nothing in `src/` imports a renderer. `turn-loop.ts`'s own header states the same
contract from the other side — *"IT COMPOSES NO FRAME"*, *"the panels sit behind the one render
seam"* (`ADR-0009` clause 9b).

**So frame membership is not an import fact, and no closure of any single module yields the frame
path.** That is the real reason *"production module"* was never definable from the module graph, and
it is why rooting the probe at `frame.ts` — the elegant one-root answer — is refuted by construction.

**3. `src/perft-bench.ts` is the only production module with ZERO exports** (the other 16 have 1 to
23). It is a command, not a library: it calls `main()` at module scope (`:114`) and prints.

**4. The delivered coverage is not nested** — reproduced independently on the merged 16-file tree,
agreeing with QE's recorded table on all seven builds: `WPERFT-STATIC` dies on the **regex alone**;
`WINDIRECT`, `WDYNIMP`, `WBAREIMP`, `WQUERY`, `WREEXPORT` die on the **probe alone**; `WSTDOUT` makes
the probe the sole red via the shared stdout channel; `WSTDERR` correctly survives; **`WPERFT-DYN`
survives everything.**

## Decision

**The word was carrying three separate attributes. They are separated, and each guard gets the one it
is actually about.**

### Clause 1 — the definition, and it is the ONE expression

> **A *production module* is every `.ts` file under `src/` that is not a `.test.ts`.**

No exclusions, no exceptions, no filenames. `src/turn-loop.ts` is a production module.
`src/perft-bench.ts` is a production module. `src/history.ts` is a production module. **Both guards
derive their file set from this one expression**, which is what `A1` demands, and each then applies
**one named rule** about it — the shape `A1`'s own trap note sanctions (*"name a SET plus a per-guard
rule about it"*).

**Being a production module is not the same as being in scope for `NFR-002`, and conflating those two
is the whole defect.** The next two clauses are the per-guard rules.

> **[AMENDED 2026-08-12 at `design-ABC-029-loss-record` — the clause says *"under `src/`"* and the one
> expression implements *"directly IN `src/`"*. RULED: the CLAUSE is right, the INSTRUMENT
> under-implements it, and the gap has TWO independent causes rather than the one the record names.]**
>
> **The wording does NOT move to match the code, and that is the ruling.** *"Under `src/`"* is what
> the property needs: `ADR-0002` clause 4 is a **whole-tree** invariant, so a module in
> `src/engine/` that imports `history.ts` is a runtime importer and must be inside clause 3's reach.
> Narrowing the clause to *"directly in"* would **write the hole into the ADR** — amending the rule to
> match what shipped is the defect this project keeps refusing, and it is refused here too.
>
> **The instrument's gap, measured rather than reasoned — and it is NOT just the `readdirSync`.** The
> record hands this on as *"clause 1 says under `src/` but the instrument uses a non-recursive
> `readdirSync`"*. That names one of two causes:
>
> | cause | measured |
> |---|---|
> | **1. enumeration** — `readdirSync(directory)` is non-recursive | on today's flat tree, recursive and non-recursive return the **identical 16-file set**; with `src/engine/probe-victim.ts` added, only the recursive form sees it |
> | **2. the specifier is DEPTH-FIXED** — the pattern requires `"./history.ts"` | `"../history.ts"` is matched by **neither** the delivered nor the widened expression |
>
> **So making the enumeration recursive changes nothing on its own.** Measured on the real instrument:
> `WSUBDIR` (`src/engine/probe-victim.ts` holding a **static** `import { newGame } from "../history.ts";`,
> off the frame path) is **green under all three variants — delivered, widened, and
> recursive+widened.** A fix therefore needs a depth-aware specifier as well as a recursive
> enumeration; it is **two changes, not one flag**, and the record's cost estimate was low.
>
> **DEFERRED, and this is a decision with a reason rather than an omission.** It is **latent and
> pre-existing** — green under the delivered instrument too, so `ABC-029` did not cause it — and
> `src/` is flat for `.ts` today (its only subdirectory, `__snapshots__`, holds none). The probe
> still backstops it whenever the subdirectory module is **on the frame path** (measured: probe
> **RED** under all three variants). There is no file for the fix to catch, and building one would
> mean adding a production module no ticket asked for. **Owner: Architect/Design. Trigger: the first
> `.ts` file added under a subdirectory of `src/` — which `EPIC-006`'s entry point may well be, so
> the trigger is checked THERE and is not deferred to it.**

### Clause 2 — `NFR-002`'s structural premise is a property of the FRAME PATH, and the probe roots there

> The **frame path** is the module closure of the frame's producers. `NFR-002`'s premise is:
> **`src/history.ts`'s module body is never evaluated in the frame path.** No other module set is in
> scope for this row.

The frame path is **DECLARED, not derived** — clause 2 of the measurements above proves it cannot be
derived, because the composition is by injection. The declaration is the catalog row's own
enumeration of a frame (board + labels + status panel + history pane + message region), stated once
at the probe's site and checkable by reading against the `Applies to` cell.

**Both hand-maintained filename exclusions are DELETED, not replaced.** `history.ts` is not a frame
producer, so it needs no exclusion; `perft-bench.ts` is not a frame producer, so it needs no
exclusion. **The two literals `A1` forbids disappear, and no third one is created** — `turn-loop.ts`
never appears in the probe at all.

`src/turn-loop.ts` is therefore green **by the property, not by an exemption**: it is a production
module that legitimately imports `history.ts`, and it is simply not on the frame path.

### Clause 3 — the regex holds a DIFFERENT property, `ADR-0002` clause 4, and that is why it must NOT be narrowed

> The regex scans **every** production module and asserts that the set of runtime importers of
> `src/history.ts` **equals the declared licence set**. A module may hold a runtime import of the
> history module only if it is the game-owning driver `ADR-0002` clause 4's single-supplier rule
> requires. **Today the licence set is exactly `{ turn-loop.ts }`**, and each entry carries its
> citation.

`ADR-0002` clause 4 — *"`gameStatus`'s `positionCounts` gets exactly one supplier: the history
module. No other caller constructs that map"* — is a **whole-tree** invariant, unlike `NFR-002`,
which is frame-scoped. `turn-loop.ts` satisfies it by construction (`gameStatusOf(history)` at every
evaluation, never bare `gameStatus`), which is what `ABC-019`'s `A3` names.

**This is the clause that keeps `perft-bench.ts` in the regex's reach without a filename**, and it is
why narrowing the regex to the frame path is forbidden: **the regex was never an `NFR-002` guard.**
The delivered note calling it *"not load-bearing any more"* is false for a deeper reason than the one
QE recorded — it is not redundant with the probe because **it is not measuring the same property.**

The assertion is an **equality**, not a subset, so the licence cannot rot silently: if
`turn-loop.ts` ever stops importing `history.ts`, the guard goes red on a **stale licence**. That is
a kill the delivered rule does not have (measured below).

> **[AMENDED 2026-08-12 at `design-ABC-029-loss-record` — clause 3 asserted MORE THAN ITS INSTRUMENT
> DETECTS, and the bound on its licence is differently shaped than this file said. Both are stated
> here rather than left for the next reader to find.]**
>
> **1. The detection reach, which this clause did not state and should have.** *"The set of runtime
> importers"* is `D27`'s phrase and `D27` defines it over **five** forms. The delivered expression
> implements **one**. That mismatch was harmless while the probe covered all five over 14 modules —
> and it became load-bearing the moment clause 2 narrowed the probe to 11, because the regex then
> became the **sole holder** of this property over `gameend.ts`, `perft.ts` and `zobrist.ts`. **That,
> not the arithmetic, is the real defect this amendment repairs**, and `WLAUNDER` is its witness. With
> the containment adopted the reach is **3 of 5**; the residual is the two dynamic forms, and it is
> named rather than implied. **Clause 3 should be read as an equality over the forms the expression
> detects, and the honest way to keep it true is to keep those two numbers written down.**
>
> **2. The bound, measured precisely — it is NOT *"a deleted licence is vacuous"*.** Measured on the
> real instrument, both trees:
>
> | licence | verdict |
> |---|---|
> | `["turn-loop.ts", "ghost-driver.ts"]` — **one name with NO FILE** | **green / green, 8/8** |
> | `["turn-loop.ts", "a.ts", "b.ts", "c.ts", "d.ts", "e.ts"]` — **five names with no file** | **green / green, 8/8** |
> | `["turn-loop.ts", "zobrist.ts"]` — **one name that DOES have a file** | **RED** — `expected [] to deeply equal [ 'zobrist.ts' ]` |
>
> **In one sentence: the licence is unverifiable in the OVER-LISTING direction for any entry whose
> file does not exist, and the number of such entries is UNBOUNDED and SILENT — while over-listing an
> entry whose file DOES exist is caught immediately.** So the guard is tight exactly where it can be:
> **a licence cannot be quietly widened to admit an existing module.** It is blind only to names that
> name nothing, and the declaration can accumulate dead entries indefinitely with no instrument
> noticing — the *"guard that fails by omission"* class, on the licence side.
>
> **Owner: Architect/Design. Trigger: the first licence entry added after `turn-loop.ts`** — that is
> the moment a second name can be wrong and nothing will say so. **`EPIC-006` is the WRONG expiry for
> this half**: clause 2's declaration is deleted there when the frame path becomes a real closure, but
> the licence is not, so **clause 3's bound outlives clause 2's.**

### Clause 4 — an ENTRY POINT is a production module with no exports

> A **entry point** is a production module that exports nothing. It ships, so it is a production
> module; nothing can import a binding from it, so it is **never on the frame path**; and it runs
> when loaded, so it can **never be a probe root**.

Mechanical, no filename, and measured: `perft-bench.ts` is the only one today. This is also the
**dated trigger `A2` names** — `EPIC-006`'s CLI entry point will be the second, and clause 4 classes
it correctly the day it lands.

### The ruling on `A3`, and on its internal contradiction

**`src/perft-bench.ts` IS a production module** (clause 1), **IS an entry point** (clause 4), and
**is NOT on the frame path** (clause 2). Those are three separate facts and the single word was being
asked to carry all three.

- **The question `A3` asks is under-specified, and neither form as written is adopted.** *"Is the
  benchmark harness a production module for this property?"* fuses *membership of the scanned set*
  with *membership of the property's subject*.
- **Form (a) is rejected.** It requires the probe to root `perft-bench.ts`; rooting it corrupts the
  probe's channel (reproduced at this hop:
  `CHANNEL CORRUPT (not valid JSON): "ABC-006 perft harness…"`), costs a benchmark run, and would
  pull a `main()`-guard production change into `src/perft-bench.ts`. **It also guards nothing**: the
  harness is not on the frame path, so a pull there is not an `NFR-002` breach.
- **Form (b) is adopted with its second clause DENIED, and that is what resolves the contradiction.**
  Form (b) says the harness is out of scope *"and the regex guard excludes it too"*. **That clause is
  wrong and is dropped.** The harness is out of scope for the **property** (clause 2) and stays in
  scope for the **regex's file set** (clause 3), because the regex holds a different property.
- **Therefore the *"either way, `WPERFT-STATIC` must still die, and it must die on the regex"*
  sentence is HONOURED, not dropped.** No measured kill is lost and no loss has to be swallowed —
  which is the outcome BA/PM's flag said was available only if a per-guard rule could be reconciled
  with `A1`'s one-expression demand. Clauses 1–3 are that reconciliation.
- **`RISK-ABC017-04` / `WPERFT-DYN` is RULED NOT A BREACH.** `void import("./history.ts")` in the
  harness evaluates the module without constructing a `positionCounts` map, so it breaches neither
  `NFR-002` (off the frame path) nor `ADR-0002` clause 4 (it is not a caller). **It survives, and it
  is correct that it survives.** This costs nothing measurable: it is caught by **nothing** today
  (QE: *"SURVIVES 744/744 — caught by nothing"*), so ruling it not-a-breach removes a
  false obligation rather than a guard.

## Alternatives

Each was constructed and run, not reasoned about.

| # | alternative | verdict |
|---|---|---|
| 1 | **Root the probe at `frame.ts` alone** — one root, no list, the frame's own module | **REFUTED BY MEASUREMENT.** `closure(frame.ts) = 1`. `frame.ts` imports nothing; the composition is by injection. This was my preferred design until it was measured |
| 2 | **Narrow the regex to the frame path too** (one rule, both guards) | **REJECTED — loses a measured kill.** `perft-bench.ts` is not on the frame path, so `WPERFT-STATIC` goes RED → green. This is the trap `A1`'s own note names and `## Out of scope` forbids |
| 3 | **Delete the regex as redundant** | **REJECTED.** Same lost kill, plus it mistakes "redundant over the frame path" for "redundant". Clause 3 shows it holds a different property |
| 4 | **Add a third literal, `file !== "turn-loop.ts"`** | **REJECTED.** `A1` forbids it by name; it leaves `ABC-029` a partly-done job. `ABC-019`'s hop was offered this and refused it |
| 5 | **Per-root closures so all 15 roots keep their reach** | **REJECTED ON COST AND MECHANISM.** One child cannot attribute a closure per root (the module cache defeats it after the first, the same effect the `?arming` query exists for); N children cost ~20 ms of spawn each, measured, against `N8-LANE`'s ~75 ms of remaining margin |
| 6 | **Licence whatever the regex finds** (derive the licence set instead of declaring it) | **REJECTED.** A guard that licenses its own findings catches nothing — it would have admitted `turn-loop.ts` silently and never raised this question at all |
| 7 | **Replace the probe with a static transitive-import walk** (~1 ms) | **REJECTED**, and not re-derived — QE measured it loses `WQUERY`, `WDYNIMP` and `WBAREIMP` and cannot see a computed specifier. `## Out of scope` already fences it |
| 8 | **Form (a) of `A3`** | **REJECTED** — see the ruling above; channel corruption reproduced, and it would move the ticket's size off `S` |
| 9 | **ADDED 2026-08-12. Widen the regex to the DYNAMIC literal spellings too** (`import("./history.ts")`, `import("./history.ts?v=2")`), recovering all 12 rather than 6 | **REJECTED, and the first reason is binding.** It turns **`WPERFT-DYN` RED**, and `A3` — written on this ADR — requires it to **pass**; adopting it would break an accepted criterion to fix an accepted ADR. Second, it is evaded by a computed specifier (`import(someVar)`), so it buys **false confidence** rather than reach. ~~The dynamic forms are recoverable only by rooting the probe outside the frame path, which is alternative 2 under a different name~~ **CORRECTED 2026-08-12 at `design-ABC-029-maximum` — the struck *"only"* is false; see alternative 11. The VERDICT on this alternative is unchanged and was re-measured: applied uniformly it still reds `WPERFT-DYN` on both trees** |
| 11 | **ADDED 2026-08-12. Widen to the dynamic literal ONLY IN A MODULE THAT EXPORTS SOMETHING** — clause 4's discriminator, textual and filename-free, recovering all 12 (BA/PM's counterexample at `refinement-ABC-029-rows`) | **MEASURED, PRICED, REJECTED — and it DOES work, which is why alternative 9's *"maximum"* sentence is struck.** It recovers **12 of 12** and breaks no accepted criterion. Rejected on three measured costs — it reds `WPERFT-DYN-EXPORTING`, a construct the `A3` ruling calls not-a-breach; it pre-authorises `EPIC-006`'s entry point as an evasion; and its dynamic half cannot be anchored, so it reds a comment and a string quoting the specifier, uncontained by `lint`. Full block under `## Consequences` |
| 10 | **ADDED 2026-08-12. Restore the delivered root set** so the twelve come back | **REJECTED — it re-reds `ABC-019` and reinstates the `turn-loop.ts` false positive.** This is the state the ruling was asked to resolve. The corrected count is an argument for containing the loss, never for reverting the ruling |

## Consequences

### The kill ledger — measured on 15 builds, every one run

| build | delivered regex / probe | **ruled** regex / probe |
|---|---|---|
| **BASE** (`ABC-019`'s tip, 17 files) | **RED / RED** | **green / green** |
| `WPERFT-STATIC` static import in the harness | RED / green | **RED** / green |
| `WINDIRECT` bare import in `glyph-mode.ts` | green / RED | green / **RED** |
| `WDYNIMP` · `WBAREIMP` · `WQUERY` · `WREEXPORT` in the pane | green / RED | green / **RED** |
| `WSTDOUT` module-scope `console.log` in a renderer | green / RED | green / **RED** (channel) |
| `WSTDERR` module-scope `console.error` | green / green | green / green |
| `WPERFT-DYN` `void import` in the harness | green / green | green / green — **ruled not a breach** |
| **`WLOOPINFRAME`** a renderer imports the loop | — | green / **RED** |
| **`WSTALELICENCE`** the loop stops importing `history.ts` | green / green | **RED** / green |
| `WOFFFRAME-STAT` static import in `zobrist.ts` | RED / RED | **RED** / green |
| `WOFFFRAME-DYN` `void import` in `zobrist.ts` | RED / **RED** | green / green |

**`ABC-019` is unblocked, measured: both guards green on the correct build.**

~~**Every kill is preserved, two are gained, and exactly one is lost.**~~
**CORRECTED 2026-08-12 — see the block below. Every kill is preserved, two are gained, and TWELVE are
lost across THREE modules and FOUR forms.**

> ### **[CORRECTED 2026-08-12 at `design-ABC-029-loss-record` — THE COUNT ABOVE IS WRONG BY FOUR TIMES, IT IS WRONG IN AN `accepted` ADR, AND A §14 GATE FOUND IT RATHER THAN THIS ROLE.]**
>
> **What the original sentence actually counted, stated plainly because a future hop will cite it.**
> It counted **the fifteen builds in the table immediately above** — the builds *this hop had run*. Of
> those fifteen, exactly one (`WOFFFRAME-DYN`) goes delivered-**RED** → ruled-**green**. **That is a
> true statement about that table and a false statement about the ruling's reach**, and the
> Consequences section presented it as the second. The table was never a census of what the probe
> could catch; it was a census of what I had thought to construct.
>
> **The measurement that corrects it** (QE at `quality-gate-ABC-029-qe`, by real module-graph load
> over 60 vitest runs on two trees; the load-bearing rows re-run independently at this hop):
>
> | | roots | closure |
> |---|---|---|
> | **delivered** probe | 15 | **14** modules |
> | **ruled** probe | 5 | **11** modules |
>
> **Three modules lost probe coverage entirely: `gameend.ts`, `perft.ts`, `zobrist.ts`.** Only
> `zobrist.ts` is ever named in this file. In each of the three, **four** of `D27`'s five runtime-import
> forms are now caught by nothing:
>
> | | bare `import "./history.ts";` | `export … from` (re-export) | `void import(…)` | `import(…?v=2)` |
> |---|---|---|---|---|
> | `gameend.ts` · `perft.ts` · `zobrist.ts` | **LOST** | **LOST** | **LOST** | **LOST** |
>
> **3 modules × 4 forms = TWELVE lost kills.** The delivered instrument killed **all 15** of QE's
> builds; the ruled build kills **3** — the static ones, on the regex. `WOFFFRAME-DYN` is **one of the
> twelve**, and it is the only one this file named.
>
> **THE ROOT CAUSE IS ONE WORD, AND IT IS MINE.** The original sentence bounds the loss to *"a
> **non-static** runtime pull"*, and the build hop's note repeats the same word. **Two of the four lost
> forms are STATIC ESM syntax** — a bare `import "./history.ts";` and an `export { … } from
> "./history.ts";` are static import statements that evaluate the module body. *"Non-static"* sounds
> like *"dynamic only"*, which is one form; the truth is four. **The loss was recorded as one because
> the word made three of them invisible.** The honest class statement is: *the loss is every runtime-import
> form OTHER than a bindings-carrying `import … from`, in an unlicensed, off-frame-path module.*
>
> **What does NOT change.** The ruling is still right and this correction does not reopen it. Every
> one of the twelve is off the frame path, so `NFR-002`'s premise is intact; the probe's narrowing is
> still forced by clause 2; reverting still re-reds `ABC-019`. **One of the twelve is nevertheless not
> a removed false positive, and that is the sharp end — see `WLAUNDER` below.**

- **Gained — `WLOOPINFRAME`.** A renderer importing `turn-loop.ts` pulls `history.ts` into the frame
  closure and the probe goes RED. **This is `NFR-002`'s actual void-condition, and it has never been
  guarded before** — under the delivered rule the guard is red on the correct build, so it cannot
  discriminate the void-condition from the architecture. This verifies by construction BA/PM's claim
  that no second criterion on `ABC-019` is needed.
- **Gained — `WSTALELICENCE`.** The licence set is an equality, so a licence that stops being true
  goes red. The delivered rule is blind to it.
- ~~**LOST — exactly one, and it is stated as a loss.** A **non-static** runtime pull of `history.ts`
  into a production module that is neither on the frame path nor licensed (`WOFFFRAME-DYN`, e.g.
  `void import("./history.ts")` in `zobrist.ts`) is caught by the delivered probe and by nothing
  under this ruling. **It is not a breach of either property** — off the frame path, and not a caller
  under clause 4 — so this is a removed false positive rather than a lost guard. **It is
  nevertheless a genuine narrowing of reach and it is recorded here rather than discovered.** The
  static form of the same pull is still caught, by clause 3.~~
- **LOST — TWELVE, corrected 2026-08-12; see the block above for the count and for how it came out as
  one.** Eleven of the twelve are defensible exactly as the struck text says: off the frame path and
  not a caller under `ADR-0002` clause 4, so removed false positives rather than lost guards — a
  genuine narrowing of reach, recorded rather than discovered. **The twelfth is not, and it is the
  reason this amendment exists.**
- **`WLAUNDER` — the one lost build that BREAKS THIS FILE'S OWN CLAUSE 3.** Two lines, no new file:
  `src/zobrist.ts` re-exports `repetitionCounts` from `./history.ts`, and `src/perft.ts` consumes it
  from `zobrist.ts`. **An unlicensed production module is now a runtime importer of `src/history.ts`
  — precisely what clause 3 asserts cannot happen** — and the guard written to assert that equality
  reports **green on both trees, 8/8**. The delivered probe was **RED on both**. The re-export
  republishes `history.ts`'s API from an unlicensed module, so a third module reaches the repetition
  machinery **without ever naming `history.ts`**. *(Checked and NOT claimed: this is not an `ADR-0002`
  clause 4 breach — the map is still constructed by `repetitionCounts`, the history module, so the
  single-supplier sentence is intact. What breaks is clause 3 **as literally worded**, which is the
  property the regex became the sole holder of over these three modules the moment the probe
  narrowed.)* **This one is contained below rather than accepted.**

### THE CONTAINMENT — **ADOPTED 2026-08-12**, and it routes to the Engineer

**Ruled: the regex guard is widened to the two textual forms it misses.** It is one expression, no
filename, no exclusion, and it recovers **6 of the 12** including `WLAUNDER`. Priced by QE and
**re-measured independently at this hop — 28 real runs of the real instrument under real vitest on
two out-of-tree trees, plus a full-suite run.**

```
delivered   /^import\s+(?!type\b)[^;]*from\s+"\.\/history\.ts";/m
widened     /^(?:import|export)\s+(?!type\b)(?:[^;]*from\s+)?"\.\/history\.ts";/m
```

| build | tree | delivered (as shipped) | **widened** |
|---|---|---|---|
| **BASE** | 16 **and** 17 | green / green | **green / green, 8/8 both trees** |
| **`WLAUNDER`** | 16 **and** 17 | green / green | **regex RED both** — `expected [ 'zobrist.ts' ] to deeply equal []` |
| `WOFFFRAME-BARE` | 16 | green / green | **regex RED** |
| `WREEXPORT-STAR` (`export * from`) | 16 | green / green | **regex RED** |
| `WPERFT-STATIC` | 16 **and** 17 | regex RED | **regex RED** — unchanged |
| `WSTALELICENCE` | 17 | regex RED | **regex RED** — unchanged |
| `WOFFFRAME-STAT` | 16 | regex RED | **regex RED** — unchanged |
| **`WPERFT-DYN`** | 16 **and** 17 | green / green | **green / green** — `A3` requires this and it holds |
| `WOFFFRAME-DYN` · `WQUERY` | 16 | green / green | green / green — **not recovered** |
| **`export type { … } from "./history.ts";`** | 16 | green | **green — the type-blindness holds on BOTH keywords** |

**Full suite under the widened expression: 750 passed (750) on 26 files** — same count as delivered,
duration inside noise in both directions across single rounds. **No `N8-LANE` verdict is claimed and
none is owed here**; `MET`/`MISS` is Security/NFR's and `ABC-026` owns the lane total.

**Why this is not the thing clause 1's principle forbids, since that objection is the obvious one.**
*"No exclusions, no filenames, one expression"* is a rule about **which files are SCANNED** — the set
clause 1 defines. The widening changes **which import FORMS count as a runtime importer** inside each
scanned file, which is `D27`'s definition, not clause 1's. **They are different questions.** The
widened form adds no filename, removes no file, and stays one expression. It moves the regex from
**1 of `D27`'s 5 forms to 3 of 5** — strictly closer to what clause 3 already claims in words.

**Why it stops at three forms, which is a ruling and not a shrug.** Two reasons, and the first is
binding:

1. **`A3` forbids the fourth.** A pattern reaching the dynamic literal spelling `import("./history.ts")`
   would turn **`WPERFT-DYN` RED**, and `A3` — written on this ADR and scored through `ABC-029`'s DoR
   — requires it to **pass**. ~~So 6 of 12 is not a compromise; it is the **maximum a textual guard may
   recover without breaking an accepted criterion.**~~ **CORRECTED 2026-08-12 — the struck sentence is
   FALSE and refuted by measurement; see the block below. What is true, and all the reason supports:
   6 of 12 is the maximum recoverable by an expression that TREATS EVERY SCANNED FILE ALIKE, which
   the delivered and the ruled expressions both do.**
2. **The record's reason is nearly right and is corrected here.** QE recorded the other six as
   *"dynamic and unreachable by any pattern"*. Measured: a pattern **can** match the literal
   `void import("./history.ts")`. What no pattern can match is a **computed specifier**
   (`import(someVar)`), so such a rule would buy **false confidence** rather than reach. ~~The dynamic
   forms need the probe's roots back, which is the whole-tree proxy clause 2 deliberately removed.~~
   **CORRECTED 2026-08-12 — also false, and by the same measurement: the literal dynamic forms do
   NOT need the probe's roots back. Reason 2 survives in full and is the ground that actually
   carries this ruling; only its final sentence is struck.**

> ### **[CORRECTED 2026-08-12 at `design-ABC-029-maximum` — *"the MAXIMUM a textual guard may recover"* IS OVERSTATED, IT IS OVERSTATED IN THE SAME SHAPE AS *"non-static"* ONE SECTION ABOVE, AND BA/PM FOUND IT RATHER THAN THIS ROLE.]**
>
> **The shape, stated plainly because it is now the third instance in this file.** *"Non-static"*
> described the class the delivered regex **happened to match** rather than the class it **named**.
> *"The maximum a textual guard may recover"* states the ceiling for the class of guard that was
> **considered** — expressions applying one rule uniformly to every scanned file — as the ceiling for
> **all** textual guards. Reason 1's argument only ever supported the narrower claim. **The
> conclusion is still right; this reason was doing more work than it can carry, and reason 2 was
> always the one holding it up.**
>
> **The counterexample, constructed and RUN.** `ADR-0011` clause 4 supplies a textual, filename-free
> discriminator — *an entry point is a production module that exports nothing* — and `perft-bench.ts`
> is still the only one (re-measured this hop: 16 production modules, `perft-bench.ts` has **zero**
> `export` tokens, the other 15 have 1 to 23). A rule counting the dynamic literal **only in a module
> that exports something** was built and measured on both trees:
>
> ```
> widened  (ruled)   /^(?:import|export)\s+(?!type\b)(?:[^;]*from\s+)?"\.\/history\.ts";/m
> exports  (this)    widened  ||  ( /^export\b/m  &&  /\bimport\(\s*"\.\/history\.ts(?:\?[^"]*)?"\s*\)/ )
> ```
>
> | build | tree | ruled `widened` | **`exports`** |
> |---|---|---|---|
> | **BASE** | 16 **and** 17 | green / green | **green / green, 8/8 both** |
> | **`WPERFT-DYN`** — the crux, `A3`/`A6.2` require GREEN | 16 **and** 17 | green | **green both** |
> | `WOFFFRAME-DYN` · `WQUERY-OFFFRAME` (`zobrist.ts`) | 16 | green | **regex RED** |
> | `WGAMEEND-DYN` · `WGAMEEND-QUERY` (`gameend.ts`) | 16 | green | **regex RED** |
> | `WPERFTMOD-DYN` · `WPERFTMOD-QUERY` (`perft.ts`) | 16 | green | **regex RED** |
> | `WLAUNDER` (`A6.1`) | 16 **and** 17 | regex RED | **regex RED both** |
> | `WOFFFRAME-BARE` · `WREEXPORT-STAR` (`A6.1`) | 16 | regex RED | **regex RED** |
> | `WTYPEREEXPORT` · `WTYPEREEXPORT-PANEL` (`A6.2`) | 16 | green | **green** |
> | `WPERFT-STATIC` · `WOFFFRAME-STAT` · `WSTALELICENCE` | 16 / 17 | regex RED | **regex RED** |
>
> **It recovers 12 of 12 and breaks NO accepted criterion** — every `A6.1` row RED, every `A6.2` row
> green, `A5`'s rows unmoved, BASE green on both trees, **full suite 752 passed (752) on 26 files**.
> The control confirms the original reason applies where it was aimed: the same dynamic rule applied
> **uniformly** (alternative 9 as this file states it) reds `WPERFT-DYN` on both trees
> (`expected [ 'perft-bench.ts' ] to deeply equal []`). **So the sentence is false as written and the
> alternative it was written about is still correctly rejected.**
>
> ### **The ruling: the recovery is MEASURED, PRICED, and DECLINED. The containment stands at 6 of 12.**
>
> A priced *no* rather than a shrug. Three costs, each constructed and run:
>
> **1. It false-positives on a construct THIS FILE RULED CORRECT.** `WPERFT-DYN-EXPORTING` — the
> harness keeps the `void import("./history.ts")` that the `A3` ruling calls **not a breach**, and
> gains one unrelated `export const PERFT_BENCH_VERSION = 1;` — goes **regex RED on both trees** under
> `exports`, and **green** under the ruled containment. **The `A3` ruling turns on *"it is not a
> caller"* and *"off the frame path"*; neither changes when the harness gains an export.** So
> *"exports something"* is a **proxy** that fits today's tree rather than the property the ruling
> names — **the same defect shape as *"non-static"* and as *"the maximum"*, and adopting it would
> write that shape into the CODE instead of into a sentence.** That is the binding reason.
>
> **2. The hole it opens is DATED, not hypothetical.** `WENTRY-DYN` — a new zero-export production
> module holding `void import("./history.ts")` — is **green** under `exports` and **RED** under the
> uniform dynamic rule. Clause 4 above names **`EPIC-006`'s CLI entry point as the second entry
> point**, so the rule would be buying its `WPERFT-DYN` green by pre-authorising the exact evasion at
> the exact site this file already has on a schedule.
>
> **3. A false-positive surface that CANNOT be closed, because a dynamic import cannot be anchored.**
> The static halves are anchored (`^`, `/m`), which is what fences them from block-comment
> continuation lines. A dynamic import is an **expression**, so its ordinary position is indented
> inside a function body — measured: `WOFFFRAME-DYN-INDENTED` is caught only by the unanchored form.
> Unanchored matches comments and strings. Measured under `exports`, all on the 16-file tree:
>
> | build | `exports` | comment-aware variant |
> |---|---|---|
> | `WCOMMENT-DYN` — a comment quoting the literal | **RED (false positive)** | green |
> | `WSTRING-DYN` — the literal inside a template string | **RED** | **RED** |
> | `WTRAILING-DYN` — a trailing comment on a code line | **RED** | **RED** |
> | `WPERFT-DYN-EXPORTING` — cost 1 above | **RED** | **RED** |
>
> **A comment-aware variant reduces the surface and does not remove it, at the price of a harder
> expression, and it does not touch cost 1 at all.** **None of these is contained by the `lint`
> gate** — QE's containment argument covers `biome check` violations (a single-quoted specifier, a
> missing semicolon, an indented import); **the contents of a comment are not a biome violation.**
> This file's own prose, `ABC-029`'s ticket and the instrument's docblock all quote
> `void import("./history.ts")` verbatim, so **a maintainer documenting the guard inside a production
> module would red the build.**
>
> **What the recovery is worth, which reason 2 bounds and which is why the price is not worth
> paying.** Measured: `WOFFFRAME-COMPUTED` (`const spec = "./history" + ".ts"; void import(spec);` in
> `zobrist.ts`) is **green under `exports` AND under the uniform dynamic rule.** The containment's six
> are **closed forms** — `export … from` and a bare `import` cannot be evaded, because ESM requires a
> literal specifier there. The extra six are **one spelling of an open form.** So the recovery buys
> reach against a careless dynamic import and none against an evasive one: **`false confidence` names
> it exactly, and the six that are already contained are the six worth having.**
>
> **Cost, measured and NOT the reason for the ruling:** the added predicate is **+20 µs per full
> 16-file scan** (77.7 µs against 57.4 µs, regex work only, 20,000 iterations, files pre-read) —
> **inside the noise of a single vitest boot and irrelevant next to the probe's ~20 ms spawn.**
> Cheapness was never the question. **No `N8-LANE` verdict is claimed and none is owed here.**
>
> **This changes NOTHING that is being built.** `A6.2` is written as a required **verdict**
> (`WPERFT-DYN` green), not as a ban on a technique, so the wider expression satisfies it too —
> **measured, not assumed.** The Engineer's hop lands the ruled `widened` expression unchanged and
> **no criterion row moves.** If a future hop ever wants the other six, it is **a new row on a new
> ticket, not a change to this one**: BA/PM writes the row, the Engineer builds it, and **this block
> is the price they must beat** — costs 1 and 3 above, not the arithmetic.
>
> **Measured this hop:** 57 runs of the real instrument under real vitest across two out-of-tree
> trees, plus one full-suite run out of tree and one on the branch tip. The 17-file tree is
> `ABC-019`'s `turn-loop.ts` (md5 `bd793612476c9d0eac28b75e1e3297cc`, reproducing the recorded
> figure) restored from the git object database over the current tree; **no repository worktree other
> than this one was opened and nothing under `src/` was written.** *(Precision, since this file's
> own instrument claims it: the current 16 and `ABC-019`'s tip differ in **one** file,
> `history-pane.ts`, and the difference is **one sentence of a docblock** — the `import type` line is
> byte-identical, so no guard on either side can see it.)*

**This is a change to `src/history-pane.nfr.test.ts` and it routes back to the Engineer.** Two sites:
the executable expression, and the docblock above the probe, which currently states the misses as a
completed list (*"sees neither `void import(…)` nor a bare `import "./history.ts";`"*) and does not
mention re-export at all — **that silence is what made `WLAUNDER` invisible, and it must be corrected
with the code.** **No production line is involved.** The criterion rows that must exist before it is
built are BA/PM's and are named in `## What this changes elsewhere`.

### Cost

**The probe gets cheaper, and it cannot get more expensive by construction** — the ruled root set
(5) is a strict subset of the delivered one (15) and its closure is 11 modules rather than 16.
Measured, 24 usable interleaved rounds with the order rotated and round 0 discarded:
**64.2 ms against 64.5 ms, a delta of −0.3 ms (−0.5%)**, which is inside this harness's noise band;
bare spawn 20.4 ms, reproducing QE's ~19 ms. **No `N8-LANE` verdict is claimed and none is owed
here** — `MET`/`MISS` is Security/NFR's and `ABC-026` owns the lane total. The direction is the one
that helps.

**The probe's other bars are untouched:** no wall-clock assertion exists or is added, so determinism
is unchanged; both positive controls (`history-pane.ts`, `san.ts`) remain inside the 11-module
closure and still fire when the root set is emptied; the arming control still reports `history.ts`;
the `?arming` query stays load-bearing; the pane's own runtime closure is **still exactly seven
modules**; and `WSTDERR` still survives, so nothing over-reaches onto stderr.

**`A2` is NOT made moot and is still owed.** `WSTDOUT` in `glyph-mode.ts` — a frame-path root —
still corrupts the channel under this ruling. What the ruling removes is only the `perft-bench.ts`
route into that failure.

### The residual risks, named with owners and triggers

**AMENDED 2026-08-12: there are THREE, not one.** This section originally named only clause 2's
fail-open. Clause 3 carries a structurally similar one on the licence side, and clause 1 carries a
third in its instrument — both are recorded above at their own clauses and are indexed here so a
reader looking for the risk register finds all three.

| # | residual | owner | trigger |
|---|---|---|---|
| **R1** | **clause 2** — the declared frame path goes stale and fails OPEN | Architect/Design | the next hop that adds a frame producer; **dated expiry `EPIC-006`** |
| **R2** | **clause 3** — the licence over-lists with names that have **no file**: unbounded and silent | Architect/Design | the **first licence entry added after `turn-loop.ts`**. **`EPIC-006` is the wrong expiry** — clause 2's declaration dies there, the licence does not |
| **R3** | **clause 1** — the instrument reads *"directly in `src/`"* and the specifier is depth-fixed | Architect/Design | the **first `.ts` file under a subdirectory of `src/`** |
| **R4** | **the two DYNAMIC forms** in unlicensed, off-frame-path modules stay uncaught after the containment | Architect/Design | **the first production module that gains a dynamic import of any local module**, or `EPIC-006` when the frame path becomes a real closure and the probe's reach can be reconsidered |

**R4 is a residual this file already ruled on and is NOT a new acceptance** — `WPERFT-DYN` is ruled
not a breach above, for the same reason. It is listed because *"the loss is twelve, six of which are
contained"* is only honest if the other six have an owner.

> **[AMENDED 2026-08-12 at `design-ABC-029-maximum` — `R4` must not be read as *"nothing textual could
> catch these six"*, because that reading is now measured false.]** They **are** recoverable by a
> textual rule that does not treat every scanned file alike — **12 of 12, measured, breaking no
> accepted criterion** — and that recovery was **priced and DECLINED**, not overlooked. The owner and
> the trigger are unchanged. What changes is what a hop arriving at this row must do: **read the
> priced rejection under `## Consequences` and beat costs 1 and 3 there.** Re-deriving the recovery
> and re-proposing it is a wasted hop; this file has now measured it twice.

**R1 in full, as originally written.** **The declared frame path can go stale, and it fails OPEN.** A new renderer added without being
declared is silently unguarded — the "guard that fails by omission" class this catalog has recorded
before. Three things bound it, and none is a complete proof:

1. **`ADR-0009`'s frame-height identity is a partial tripwire.** It reads `renderBoard(...).length`,
   `STATUS_ROWS` and `HISTORY_ROWS` with a `= 23` tripwire and a `≤ 24` requirement, so a new panel
   that adds rows trips it. **A renderer that adds no rows would not**, so this is partial and is not
   claimed as more.
2. The declaration sits at one site beside the catalog row's own enumeration of a frame, so it is
   checkable by reading rather than by memory.
3. **Owner: Architect/Design, at the next hop that adds a frame producer.**

**EXPIRY, which is the real fix and is dated.** When `EPIC-006`'s entry point assembles a frame, the
composition becomes an import and **the frame path becomes a real closure**. At that point the
declaration is replaced by `closure(<assembly module>)` and **deleted**, and clause 2's
"declared, not derived" caveat dies with it. **This ADR should be revisited at `EPIC-006` and not
before.**

### What this changes elsewhere

- **`plans/nfr-catalog.md`** — `NFR-002`'s row needed no edit for this ruling and **got none**; it
  already scopes its void-condition to a renderer and a frame, which is precisely why the ruling
  reads it rather than moving it. **One note** was appended to the section recording that the first
  non-renderer production importer now exists — the fact that makes the row's renderer-scoping
  load-bearing rather than incidental. **No target, bar, level, measured figure or
  `UNKNOWN - verify` marker moved.**
- **`NFR-002`'s `MET`/`MISS` remains Security/NFR's.** This ADR rules structure, not verdicts, and
  `ABC-019` has never been through a Security/NFR gate.
- **`ABC-017`'s `A11` does not move** and is not re-opened. It was MET at its own gate; what this ADR
  repairs are the two live **instruments**, which is the split `ABC-029`'s `## Out of scope` already
  drew.
- **`ABC-029`'s acceptance criteria are BA/PM's** and none is written here. What the ruling leaves
  them is recorded in the subtask's context notes.

**ADDED 2026-08-12 — what the amendment changes elsewhere, and who owns each.**

- **`src/history-pane.nfr.test.ts` — the Engineer.** The widened expression at the executable site,
  and the probe's docblock, which lists the regex's misses as a completed set and never mentions
  re-export. **Two sites, one file, zero production lines.**
- **`ABC-029`'s acceptance criteria — BA/PM, and this amendment CHANGES WHAT `A5` MUST ASSERT, which
  is why it was sequenced first.** Three rows are now owed and **none is written here**: that the
  regex is **RED** on a bare import and on a re-export by an unlicensed module (`WLAUNDER` is the
  named build); that it stays **green** on `export type { … } from` and on `WPERFT-DYN`, so the
  widening cannot creep into the dynamic forms `A3` protects; and QE's drafted **`A5.6`** — the
  equal-cardinality/different-members row that a one-token `toEqual` → `toHaveLength` simplification
  survives. **The naming and wording of all three are BA/PM's.**
- **`plans/nfr-catalog.md` — NOT opened, and that is a decision.** No bar, target, level or
  `UNKNOWN - verify` marker moves. `NFR-002`'s premise is clause 2's and clause 2 is unchanged; the
  containment repairs clause 3, whose property is `ADR-0002` clause 4 and not an NFR row.
  **`NFR-002`'s `MET`/`MISS` remains Security/NFR's, and `ABC-026` still owns the lane total.**
  *(Flagged, not fixed: that row's note calls `ABC-029` `Backlog`, which is stale — the column is the
  Orchestrator's.)*
- **`ADR-0002`, `ADR-0008`, `ADR-0009`, `ADR-0010` — read, NOT re-opened.** None is implicated:
  `ADR-0002` clause 4's single-supplier sentence is intact on every build measured, including
  `WLAUNDER`, and no lane budget or frame constant is touched.

## Rollback

**Cheap and total, because nothing in `src/` depends on it.** The whole decision lives in one test
file's two instruments plus this record; reverting it means restoring the delivered root set and the
`toEqual([])` assertion, and the tree is unchanged. **No production line, no module, no dependency
and no data shape is introduced by this ADR**, so a reversal costs one revert and re-reds
`ABC-019` — which is the state this ruling was asked to resolve.

**ADDED 2026-08-12: the containment is independently revertible and costs one token to undo** — it is
one regex literal in one test file, with no data shape, no root set and no declaration behind it. If
it ever produces a false positive the fix is to restore the delivered expression, and the twelve-kill
ledger above stands unchanged as the record of what that costs.

**The specific thing to revisit first if this proves wrong**: clause 2's *declared* frame path. If
the declaration is found stale in practice before `EPIC-006` lands, the honest response is not to
widen the probe back to the whole tree — that reintroduces the `turn-loop.ts` false positive — but to
bring the frame assembly forward so the closure can be derived. **Clause 3 is independent of that and
would stand unchanged.**
