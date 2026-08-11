# ADR-0011: What a "production module" is for `NFR-002`'s structural premise — and the two different properties its two guards actually hold

## Status

**accepted** — 2026-08-12 by Architect/Design at task `design-ABC-029-2026-08-12`, subtask
`design-ABC-029-production-module`, Workflow 07, on the open design question `ABC-029` was cut
carrying and the internal contradiction BA/PM flagged at `refinement-ABC-019-a11`.

**No target moves and no level is set, so no owner ratification is owed** — the same distinction from
`ADR-0008` that `ADR-0009` and `ADR-0010` both draw. `ADR-0008` needed **Olger Oeselg** because it
fixed a budget *level* a human has to value; there is no level here. Every claim below is
gate-adjudicable: it either fails on the constructed builds in `## Context` or it does not, and
**every one was run** — 15 builds against a byte-verified replica of `ABC-019`'s red tip.
**`ADR-0004`'s by-delegation ratification is NOT relied on and NOT extended**, exactly as `ADR-0008`'s
Status section requires.

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

**Every kill is preserved, two are gained, and exactly one is lost.**

- **Gained — `WLOOPINFRAME`.** A renderer importing `turn-loop.ts` pulls `history.ts` into the frame
  closure and the probe goes RED. **This is `NFR-002`'s actual void-condition, and it has never been
  guarded before** — under the delivered rule the guard is red on the correct build, so it cannot
  discriminate the void-condition from the architecture. This verifies by construction BA/PM's claim
  that no second criterion on `ABC-019` is needed.
- **Gained — `WSTALELICENCE`.** The licence set is an equality, so a licence that stops being true
  goes red. The delivered rule is blind to it.
- **LOST — exactly one, and it is stated as a loss.** A **non-static** runtime pull of `history.ts`
  into a production module that is neither on the frame path nor licensed (`WOFFFRAME-DYN`, e.g.
  `void import("./history.ts")` in `zobrist.ts`) is caught by the delivered probe and by nothing
  under this ruling. **It is not a breach of either property** — off the frame path, and not a caller
  under clause 4 — so this is a removed false positive rather than a lost guard. **It is
  nevertheless a genuine narrowing of reach and it is recorded here rather than discovered.** The
  static form of the same pull is still caught, by clause 3.

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

### The residual risk, named with an owner and a trigger

**The declared frame path can go stale, and it fails OPEN.** A new renderer added without being
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

## Rollback

**Cheap and total, because nothing in `src/` depends on it.** The whole decision lives in one test
file's two instruments plus this record; reverting it means restoring the delivered root set and the
`toEqual([])` assertion, and the tree is unchanged. **No production line, no module, no dependency
and no data shape is introduced by this ADR**, so a reversal costs one revert and re-reds
`ABC-019` — which is the state this ruling was asked to resolve.

**The specific thing to revisit first if this proves wrong**: clause 2's *declared* frame path. If
the declaration is found stale in practice before `EPIC-006` lands, the honest response is not to
widen the probe back to the whole tree — that reintroduces the `turn-loop.ts` false positive — but to
bring the frame assembly forward so the closure can be derived. **Clause 3 is independent of that and
would stand unchanged.**
