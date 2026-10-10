---
id: 20261010T161218Z-qe-e2e-observation-abc137-gap-register-853f77e5
kind: observation
by: qe-e2e
at: 2026-10-10T16:12:18Z
verified_by:
confidence: high
refs:
  - ABC-137
  - ADR-0011
  - ADR-0029
  - R5c
  - QE-136-c
  - QE-137-a
  - QE-137-b
  - QE-137-c
  - QE-137-d
  - src/history-pane.nfr.test.ts
  - 20261010T152348Z-architect-design-decision-qe136-a-accepted-qe136-b-is-r5c-a-ticket-r5b-discharged-1708c558
supersedes:
---

# `ABC-137` QE gap register: one LOW gap and one LOW in-class residual, both routed to Architect/Design, plus two INFO items

Hand-authored and unsealed. Readings: `…01c2d8fc` and `../probe/`. None of these gaps blocks `A1`–`A4`.

## `QE-137-a` — LOW — routed to Architect/Design (owner of the `R5` series and of `ADR-0029`)

**What survives.** The composer tripwire narrows its scanned set at its own call site (`:591`), which nothing pins:

```ts
const composers = productionModulesIn(directory)
  .filter((file) => file !== "perft-bench.ts")
  .filter((file) =>
```

- With a second value-importer of `assembleFrame` planted (`QF-SECOND-COMPOSER`), the result is exit 0 12/12 and
  the whole suite is green (52 / 1608). The tree is gate-clean: biome 0, tsc 0.
- The witness is armed: alone, it reds the composer tripwire ("a second frame composer").
- `H-WRAP-CALLS` reaches the same result through a module-level wrapper that replaces the helper at the composer and
  probe call sites.
- It is green at base `2946e22a` as well, so it **predates `ABC-137`**. It is also outside this ticket's fences
  ("Any change to … the three call sites" is out of scope).

**Why it matters.** It is `QSCAN-NARROW`'s twin, aimed at the other guard. `R5b` pinned the licence guard's call; the
composer tripwire's call has no pin. The new reach comment correctly says that the composer tripwire *scans* clause
1's helper. A reader may still infer the composer's scanned set is held, and it is held only up to the call. It
does not read as tidying: a filename filter in front of the composer predicate is the shape `ABC-029` deleted.

**Not measured.** The frame-path probe's call (`:653`) is also unpinned. Its `production` set feeds only "the
declared composition root exists", so QE did not build a probe-specific witness. `UNKNOWN - verify` whether a
narrowing there can drop a kill.

**Options (the Architect's).**
- Accept it as a residual under "has to show in the diff".
- Or add a framed pin for `:591`'s call, the way `R5b` pinned `:369` (a new `R5d`?).

## `QE-137-b` — LOW — the `QE-136-c` class, recorded; routed to Architect/Design for the record

**What survives.** `H-READDIR-SHADOW` leaves the helper's text byte-identical and rebinds its callee:
- `import { readdirSync as listDirectory, readFileSync } from "node:fs";`
- plus a module-scope `const readdirSync = (directory: string): string[] => listDirectory(directory).filter((file) =>
  file !== "perft-bench.ts");` above clause 1's docblock.

It is gate-clean (biome 0, tsc 0). With `WPERFT-STATIC` the whole suite stays green (52 / 1608), and it narrows
**all three** scanned sets at once. That is `R5c`'s blast radius, reached without touching `R5c`'s pin.

**Why it is not FAIL.** It keeps the pinned text and weakens around it. That is the class the ticket fences out
(`QE-136-c`) and the tripwire comment states. It is the module-scope analogue of `XSHADOW-READ`. Unlike
`XSHADOW-HELPER`, it reaches three guards, not one. It reads as tampering, not tidying: an aliased `node:fs` import
plus a filename filter.

**Option.** Record it in `ADR-0011` P6's accepted residuals beside `QE-136-c`. A text pin on the `node:fs` import line
would close this one spelling and not the class.

## `QE-137-c` — INFO — the block-comment survivor is the stated class

`H-COMMENTED` keeps the helper's two lines verbatim inside `/* … */` and declares a narrowed live helper below. It
is green across the whole suite. The tripwire comment already says this: "a weakening that keeps the pinned text
(in a block comment, say) survives it". No action.

## `QE-137-d` — INFO — "planted" could not be honoured literally, by either hop

The ticket defines "planted" as QE's runner with `plantqe136.py`/`plantqe057.py` copied unchanged. The SE's
permission layer refused to execute them, and QE's refused even the copy. Two independent harnesses agree on every
shared row (`…01c2d8fc`). The SE's harness is a line port; QE's has its own anchors, its own spellings and a JSON
reporter. Owed (`UNKNOWN - verify`): one run of the unchanged scripts, on a host that permits them. Probe hygiene:
future ticket pages that name a planter could also accept "or an independent harness that reproduces the base
ledger". That wording is BA/PM's call.

## Pre-existing, noted only

Clause 1's docblock (`:152–153`) says "Both guards at the bottom of this file derive their scanned set from this
function". Since `ADR-0029` there are three consumers, the composer tripwire included. This predates `ABC-137`, and
the ticket's fence on clause 1 covers it. No action asked.
