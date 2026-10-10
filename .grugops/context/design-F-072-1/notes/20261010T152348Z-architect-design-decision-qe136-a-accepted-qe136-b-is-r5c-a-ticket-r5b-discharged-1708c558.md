---
id: 20261010T152348Z-architect-design-decision-qe136-a-accepted-qe136-b-is-r5c-a-ticket-r5b-discharged-1708c558
kind: decision
by: architect-design
at: 2026-10-10T15:23:48Z
verified_by:
confidence: high
refs:
  - QE-136-a
  - QE-136-b
  - QE-136-c
  - R5b
  - R5c
  - R5
  - R3
  - ABC-136
  - ABC-134
  - ABC-057
  - ABC-029
  - ABC-030
  - ADR-0011
  - src/history-pane.nfr.test.ts
  - memory-bank/50-decisions/ADR-0011-production-module-scope-for-nfr-002.md
  - .grugops/context/design-F-072-1/probe/qe136-ledger.out.txt
  - 20261010T150202Z-qe-e2e-observation-abc136-gap-register-f3fd60a0
  - 20261010T150202Z-qe-e2e-decision-abc136-verdict-pass-with-gaps-b5b3f575
  - 20261010T134751Z-architect-design-decision-six-owed-rulings-pointers-r5b-ticket-delta-95c73721
  - 20261010T152348Z-architect-design-observation-f0721-readings-fixtures-plants-qe136-qe104d-gates-f8dee48b
supersedes:
---

# `QE-136-a` is an ACCEPTED residual with a trigger. `QE-136-b` is registered as `ADR-0011` `R5c` and goes to a TICKET, sequenced after `ABC-134`. `R5b` is discharged

This note is hand-authored and unsealed. Both survivors were **re-measured at the wave tip
`7f7e6b84`** with QE's runner and planters, unchanged (`…f8dee48b` O5). Recorded in `ADR-0011`
§ Pointers P6, with one line in the Status index.

## My own earlier statement was too wide, corrected first

**What I wrote.** In `…95c73721` § 3, I wrote the `R5b` property as "**any** gate-clean edit
between `productionModulesIn(directory)` and the comparator that changes the scanned set or the
importer set reds the drift tripwire". I then prescribed two statement pins, which cannot deliver
"any".

**The property, at the width of what was built.** Three texts are pinned: the scan pair, the
importer statement and the comparator. An edit to any of them reds the tripwire. **`R5b` is
DISCHARGED by `ABC-136`** (merged `f87f0b6f`): `QSCAN-NARROW` and `QLHS-INTERSECT` are RED at
`7f7e6b84`. This note narrows the earlier sentence; the earlier note stays as written (append-only).

## `QE-136-a` (`XSPLICE`): ACCEPTED, LOW, owner Architect/Design

**The survivor.** A new statement after the pinned importer statement narrows the array in place.
It keeps every pinned text.
- **It is the class the tripwire's own comment names.** "A weakening that keeps the pinned text …
  just has to show in the diff". `QE-136-c` records four members of that class (`XSHADOW-HELPER`,
  `XSHADOW-READ`, `XDEAD-COPY2`, `XLICENCE-PUSH`), all accepted. `XSPLICE` differs only in where
  it sits.
- **Why no pin now.**
  - A contiguous pin from the scan line to `toEqual` would close this one form and leave the four
    others open.
  - It would over-pin the comparator's five-line comment.
  - It would put a fourth overlapping literal on the same span.
  - It is low plausibility: an in-place `splice` reads as tampering, which is QE's own read.
- **Trigger:** the first diff that adds or edits an executable line between the guard's importer
  statement and its `toEqual` (`src/history-pane.nfr.test.ts` `:366`–`:374` at `7f7e6b84`). That
  hop's QE reads it as an `R5b` question, and the contiguous pin is cut then. The trigger is visible
  in `git diff`, and QE reviews every ticket.

## `QE-136-b` (`XHELPER-NARROW`): registered as `R5c`, LOW, owner Architect/Design. **Ruled a TICKET**

**The survivor.** Clause 1's helper narrowed with a filename exclusion is gate-clean after FMT.
With `WPERFT-STATIC` planted, the **whole suite stays green: 52 files / 1608 passed** (re-measured).

**Why it is not `QE-136-a`'s class.** It edits the operand's **definition**, not the text around a
pin. Three facts set it apart:
1. **Blast radius.** It weakens all three guards that derive from the helper at once: the licence
   guard (`:361`), the composer tripwire (`:573`) and the frame-path probe (`:635`).
2. **It reads as tidying.** A filename exclusion in this exact place is the shape `ABC-029`
   deleted ("the two hand-maintained filename exclusions … are DELETED"). So it is the plausible
   regression, not the adversarial one.
3. **`R5`'s argument applies unchanged.** The equality is only a kill if something notices when an
   operand stops being the whole set.

**What the ticket pins (BA/PM writes the page; the spelling is the Engineer's).**
- **One more framed literal in the drift tripwire `it`:** clause 1's two-line helper definition,
  exactly as at `:163`–`:164`, with its leading newline (`ABC-057` `D1`: written with `\n` escapes,
  so it cannot match itself). The message says that clause 1's one expression is unchanged.
- **The reach comment** either names the helper pin or is narrowed to the truth.
- **Kill ledger, on QE's planters:**
  - RED on head: `XHELPER-NARROW+FMT+WPERFT-STATIC`.
  - Green: `CONTROL`.
  - Unchanged: `QSCAN-NARROW`/`QLHS-INTERSECT` (`+FMT+WPERFT-STATIC`) RED; `M15`/`M15SUB` RED; the
    `A2` witnesses' reds.
  - `XSHADOW-HELPER` stays green: it is the `QE-136-c` class, accepted.
- **Raw readers stay safe.** The literal spells neither `const LICENSED_DRIVERS: readonly string[]`
  nor `const COMPOSITION_ROOT`, so `src/cli.test.ts` `A12` (`:1694`) and `src/render-seam.test.ts`
  `A9` (`:397`) are unaffected.
- **Fences:**
  - 1 path, `src/history-pane.nfr.test.ts`.
  - 0 production lines and 0 new files, so the UAT waiver applies and the QE hop applies.
  - `N8-LANE`: one `toContain` on an already-read string, ≈ 0.
- **Size and priority (BA/PM's call):** `XS`, `P3`.
- **Sequencing:** **after `ABC-134` merges**, which is the same file and is being built now. Never in
  parallel (`R5b` fence). `ABC-030` (`:115`) is merge-order only.
- **`R3` interaction, intended.** The eventual recursive-enumeration fix for clause 1 must update
  this literal in the same diff. That is the change showing, not a cost.
- **Not in scope:** the separate copies of the clause 1 expression in `src/cli.test.ts` and
  `src/render-seam.test.ts`. Each holds its own file's guard. Pinning across files would be a new
  design question, and none is raised.

## Follow-ups

- **BA/PM:** cut the `R5c` ticket from § `QE-136-b` above. If it is not cut, `R5`'s trigger
  applies: the next hop that opens `src/history-pane.nfr.test.ts` after `ABC-134` folds it in.
- **QE:** none now. Watch `QE-136-a`'s trigger on any diff that touches the guard's `:366`–`:374`.
