---
id: ABC-140
title: The composer tripwire's scan and comparator are unpinned — a filter or a containment there drops the second-composer kill and the whole suite stays green (ADR-0011 R5d)
status: in-review
column: In Review
size: XS
priority: P3
epic: —
feature: —
---

# ABC-140 — pin the composer tripwire's scan statement and comparator in the drift tripwire, and make clause 1's docblock count three instruments

> **Cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-r5d-qe139a-2026-10-10`) at wave tip
> `75dcc0f5`. The source is `ADR-0011` `R5d` (§ Pointers P7). Architect/Design ruled it a ticket and specified it
> in `.grugops/context/design-qe137-2026-10-10/notes/…e86924d7` §§ 1 and 3. The gap is QE's `QE-137-a`
> (`.grugops/context/qe-ABC-137/notes/…853f77e5`), widened by the Architect to the comparator. **What this page
> pins is the Architect's; the spelling is the Engineer's.** BA/PM's readings at the tip:
> `.grugops/context/bapm-r5d-qe139a-2026-10-10/probe/RUN.txt`.

## Problem

*User*: the next hop that edits `src/history-pane.nfr.test.ts`. That hop trusts the drift tripwire to red when a
guard stops measuring the set it claims.

*Pain*: the composer tripwire is the **only** holder of the second-composer kill (`WSC` planted reds it alone,
1607/1608). Neither its scan statement (`:591–593`) nor its comparator (`:595–598`) is pinned. Re-measured at
`75dcc0f5` (file blob `ed2cd2b0`, unchanged since the Architect's `eae04388`), with the Architect's planter
`plant.mjs` and BA/PM's own ledger loop, one fresh `git archive` per build, lint 0 and tsc 0 on every build:

| build | `src/history-pane.nfr.test.ts` | whole suite |
|---|---|---|
| `CONTROL` | exit 0, 12/12 | 52 files, 1608/1608 |
| `WSC` (a second composer, armed) | exit 1, composer tripwire only | — |
| `N591-HEAD` / `-TAIL` / `-WRAP` `+FMT+WSC` | exit 0, 12/12 each | `-TAIL`: 1608/1608 |
| `C-CONTAIN` / `C-OPERAND` `+FMT+WSC` | exit 0, 12/12 each | `C-OPERAND`: 1608/1608 |

A filename filter before or after the scan, a wrapper around the helper, `toEqual` → `toContain`, or a narrowed
operand inside the `expect` each removes the kill with every gate green. The filter shape is the one `ABC-029`
deleted, so it reads as tidying, not tampering.

*Value*: the edit that disarms the second-composer kill reds at the site and tells its author to re-run the
witnesses. The two comments that describe this file's pins and clause 1's readers say what is true.

## Scope

All in `src/history-pane.nfr.test.ts`:
1. **Two framed literals** (`ABC-057` `D1` framing: leading newline, `\n` escapes, so neither matches itself):
   - **(a)** the composer tripwire's **whole scan statement**, `:591–593`, from its leading newline through
     `    );\n`. Whole, so a filter appended after `)` reds; a first-line pin would not.
   - **(b)** its **whole comparator statement**, `:595–598`, `expect(` through `.toEqual([COMPOSITION_ROOT]);`.
     Whole, so `C-OPERAND` reds; a pin on the `toEqual` line alone would not.
   - **Placement (recommended):** in the drift tripwire `it`, after the `R5c` literal, so the file keeps one pin
     site. An Engineer may put them in the composer tripwire's own `it` instead and must say why.
2. **The drift tripwire's reach comment** (`:483–491`, "it pins five spans by TEXT") goes to **seven** spans, and
   names the composer tripwire's two spans as that guard's own (not the licence guard's, not clause 1's).
3. **Clause 1's docblock** (`:151–162`) stops saying "Both guards" and "THE TWO GUARDS HOLD DIFFERENT PROPERTIES".
   After the edit it says: **three instruments** derive their set from this function (the frame-path probe, the
   composer tripwire, the licence guard), and they hold **two** properties. The probe and the composer tripwire
   both apply `COMPOSITION_ROOT`, and the tripwire is what makes the probe's one root fail closed (`ADR-0029`
   decision 2). The licence guard applies `LICENSED_DRIVERS`.

## Out of scope

- **Any change to the composer tripwire's code, `bindsAssembleFrame`, the helper or any call site.** The pins
  read text and change no character of what they read.
- **`bindsAssembleFrame`'s reach.** That belongs to `ADR-0029`'s `AR-053-COMPOSER` (owner BA/PM). Its pre-ruled
  fix widens that regex, so pinning it here would freeze it.
- **The probe's call site (`:653`).** It fails closed (`N653-DROPROOT` red), and `N653-NARROW` has no kill to
  drop. Ruled "no witness, no pin" until `:653`'s `production` feeds more than one existence check.
- **`QE-137-b`'s class** (`H-SHADOW`, `H-FSMOCK`): accepted residual, `QE-136-c` class. A text pin does not
  reach it.
- **Every other file**, including `ABC-030`'s line (`:115`), and the raw readers `src/cli.test.ts` `A12` and
  `src/render-seam.test.ts` `A9`.

## Acceptance (Given/When/Then)

"Planted" means `.grugops/context/design-qe137-2026-10-10/probe/plant.mjs` (sha256 `b6b5e458…57bd`, unchanged)
run on one fresh `git archive` tree per build. That tree gets `biome check src`, `tsc --noEmit` and
`vitest run src/history-pane.nfr.test.ts`. **Or an independent harness that reproduces the base rows** of
`## Problem`'s table and `A2`'s list at the build's base (`QE-137-d`). The Architect's committed `ledger.sh`
hardcodes the Architect's private scratch paths, so use your own loop around the planter.
"Collapsed text" is `ABC-134`'s definition (`.grugops/context/bapm-owed-batch-2026-10-10/probe/phrases.mjs`).

- **`A1` (the five survivors red).** **Given** the delivered tree with each of `N591-HEAD`, `N591-TAIL`,
  `N591-WRAP`, `C-CONTAIN` and `C-OPERAND` planted, each `+FMT+WSC`, **then** each run exits 1 and the failed
  test is the `it` holding the new pins. *(At `75dcc0f5`: each exits 0, 12/12.)*
- **`A2` (nothing else in the ledger moved).** **Given** the same harness on the delivered tree:
  - `CONTROL` and `+FMT` exit 0 with **12** tests, as at `75dcc0f5`;
  - `WSC` still fails exactly the composer tripwire, and `WPS` exactly the licence guard, by name;
  - `N653-NARROW+FMT`, `H-SHADOW+FMT+WPS` and `H-FSMOCK+FMT+WPS` are **recorded**. Green is expected and accepted;
  - no build prints `PLANT-FAILED`, so every planter anchor still occurs exactly once;
  - the existing five `expect(instrument, …)` statements in the drift tripwire (the expression, `R5`, both `R5b`
    and `R5c`) are byte-identical to the base. That keeps `ABC-136`'s and `ABC-137`'s rows as they were.
- **`A3` (the reach comment states seven).** **Then** "it pins five spans by TEXT" occurs **0** times in collapsed
  text (**1** at `75dcc0f5`). **And** the reach comment names `R5d` (**0** at `75dcc0f5`), states seven spans, and
  attributes the two new spans to the composer tripwire. If the pins sit in the composer tripwire's own `it`, the
  comment says which `it` holds which pin.
- **`A4` (clause 1's docblock counts three).** **Then** in collapsed text, "Both guards at the bottom of this file"
  and "THE TWO GUARDS HOLD DIFFERENT PROPERTIES" each occur **0** times (**1** each at `75dcc0f5`). **And** the
  docblock above `productionModulesIn` names all three instruments (the probe, the composer tripwire, the licence
  guard) and both rule names, `COMPOSITION_ROOT` and `LICENSED_DRIVERS`, in any spelling. It says the composer
  tripwire and the probe share `COMPOSITION_ROOT`.
- **`A5` (test-only, one path, the pinned text untouched).**
  - `git diff --name-only <base>..<delivered> -- src` lists exactly `src/history-pane.nfr.test.ts`: 0 production
    lines, 0 new files.
  - Lines `:163–164` (the helper) and the composer tripwire's statements `:591–598` are byte-identical to the base.
  - The `biome-ignore` count is **at most 2** (1 at `75dcc0f5`). The scan literal holds `${`, so 2 is expected,
    stated here rather than discovered.
- **`A6` (gates).** **Then** lint, typecheck, build and `npm test` exit 0, with **52** files and **1,608** tests (as
  at `75dcc0f5`), skip count 0, and integrity `No findings.`

## Dependencies

- **None open. Pullable now.** At `75dcc0f5` no unmerged ticket edits this file: `ABC-138` (In Review, fix-forward
  in flight) is `src/cli.test.ts` only, and `ABC-010` is FEN.
- **Never in parallel with another hop on `src/history-pane.nfr.test.ts`** (the `R5b` fence).
- **`ABC-030` (Backlog)** edits `:115`. That is merge order only; the second one rebases.

## Security / NFR triggers

- **`N8-LANE` — ≤ 650 ms CPU net.** No new file, no new `it`, no spawn. Two `toContain` calls on a string the `it`
  already reads cost about 0.
- **`NFR-002` — not triggered.** No instrument's code changes.
- **Security — not triggered.** `ADR-0036` (DELTA) clause (b): 0 production files. (a) no manifest, (c) no spawn,
  network or write, (d) one test file.
- **UAT: WAIVED by the standing 2026-08-17 rule** (`.test.ts` only). The QE hop applies.

## Test notes

1. **Frame both literals with a leading `\n` and write them with `\n` escapes.** A literal with real newlines
   matches its own source. It would also make `plant.mjs`'s `N591-HEAD`/`C-CONTAIN` anchors occur twice, which
   prints `PLANT-FAILED` in `A2`.
2. **Keep the docblock's opening `/**\n * \`ADR-0011\` CLAUSE 1`.** `plant.mjs`'s `H-SHADOW` anchors on it. A
   reworded first line prints `PLANT-FAILED`. In that case, re-anchor in your own harness and say so.
3. **Three readers take this file raw:** `src/cli.test.ts` `A12` (first `const LICENSED_DRIVERS: readonly
   string[]`), `src/render-seam.test.ts` `A9` (`^const COMPOSITION_ROOT = "render-seam\.ts";$`), and the tripwire
   itself. Neither literal, and no new comment, may spell either declaration.
4. **The comparator literal holds the failure message** "a second frame composer: make it import the seam, or
   declare it as the root". Rewording that message now reds the tripwire, as intended. Say so in the comment.
5. A buildable prototype is `.grugops/context/design-qe137-2026-10-10/probe/architect-r5d-prototype.patch`. It is a
   reading aid, not the spelling. It reds all five survivors at `75dcc0f5` (`PIN+…` rows in BA/PM's `RUN.txt`).

## Size and priority rationale

**`XS` (1).** Two framed literals, one comment sentence and one docblock paragraph, in one test file. The planter
and the base ledger exist. It calibrates with `ABC-137` (`XS`, one literal + comment). **Not `XL`. No split.**

**`P3`.** Graded LOW by QE and Architect/Design. No hop edits the composer tripwire today, and the risk predates
this wave. **Promote:** if a ticket is cut or pulled that edits the composer tripwire or `bindsAssembleFrame`
(e.g. `AR-053-COMPOSER`'s option 1), this ticket goes first or folds into it, and takes its priority.

## Definition of Ready

Assessed by BA/PM at the cutting hop, **2026-10-10**, wave tip `75dcc0f5`. **Result: 10 of 10, 0 ⚠️ — MET →
`Ready`.** The board move is the Orchestrator's.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** five survivors re-run at the tip, whole suite green on two of them |
| 2 | scope and out-of-scope clear | **✅** two literals, one comment, one docblock. Fenced: tripwire code, `bindsAssembleFrame`, `:653`, `QE-137-b`, other files |
| 3 | INVEST-shaped | **✅** independent (nothing open on the file), small, testable by an existing planter |
| 4 | acceptance testable and measurable | **✅** five builds that must exit 1 (0 today), named verdicts kept, five byte-identical pins, four phrase counts, path list, `biome-ignore` ≤ 2, gate counts |
| 5 | dependencies known | **✅** none open. Fence: never in parallel on this file; `ABC-030` is merge order |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms (≈ 0). `NFR-002` and security not triggered. UAT waived by rule |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P3`, with a promotion trigger |
| 10 | no major unresolved blocker | **✅** none |
