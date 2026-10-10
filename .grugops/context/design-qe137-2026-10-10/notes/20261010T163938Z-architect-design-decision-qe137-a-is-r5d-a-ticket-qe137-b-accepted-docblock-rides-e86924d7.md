---
id: 20261010T163938Z-architect-design-decision-qe137-a-is-r5d-a-ticket-qe137-b-accepted-docblock-rides-e86924d7
kind: decision
by: architect-design
at: 2026-10-10T16:39:38Z
verified_by:
confidence: high
refs:
  - QE-137-a
  - QE-137-b
  - QE-137-c
  - QE-137-d
  - QE-136-c
  - R5
  - R5b
  - R5c
  - R5d
  - AR-053-COMPOSER
  - ABC-137
  - ABC-136
  - ABC-057
  - ABC-029
  - ABC-030
  - ADR-0011
  - ADR-0029
  - src/history-pane.nfr.test.ts
  - memory-bank/50-decisions/ADR-0011-production-module-scope-for-nfr-002.md
  - .grugops/context/design-qe137-2026-10-10/probe/RUN.txt
  - .grugops/context/design-qe137-2026-10-10/probe/architect-r5d-prototype.patch
  - 20261010T163938Z-architect-design-observation-qe137-readings-call-sites-shadows-prototype-pins-ca8c4b23
  - 20261010T161218Z-qe-e2e-observation-abc137-gap-register-853f77e5
  - 20261010T152348Z-architect-design-decision-qe136-a-accepted-qe136-b-is-r5c-a-ticket-r5b-discharged-1708c558
supersedes:
---

# Rulings: `QE-137-a` is registered as `ADR-0011` `R5d` and goes to a TICKET, widened to the composer tripwire's comparator. `QE-137-b` is CONFIRMED in the `QE-136-c` class. The clause 1 docblock fix rides with `R5d`'s ticket

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). Subtask
`design-qe137-2026-10-10`, Workflow 07. Every premise was **re-measured at the wave tip `eae04388`** on the
Architect's own harness (readings: `…ca8c4b23`, `../probe/RUN.txt`). Recorded in `ADR-0011` § Pointers, as
**P7**, with one line in the Status index. **Scope:** `src/history-pane.nfr.test.ts`'s scan pins only. No
production line, NFR target or `ADR-0029` decision moves. **Risks** are named per item below.

## 1. `QE-137-a` → `R5d`, LOW, owner Architect/Design. **Ruled a TICKET**

**What was measured.** QE's survivor reproduces in three spellings at `eae04388`. Each one is gate-clean, and with the
second-composer witness `WSC` planted the **whole suite stays green (52 files / 1608)**:
- a filter before the predicate;
- a filter appended after the statement's `)`;
- a module-level wrapper around the helper.

`WSC` alone is red only on the composer tripwire (1607/1608), so **that tripwire is the second-composer kill's
only holder.**

**This ruling's width is not QE's.** The composer tripwire's **comparator** (`:595–598`) is also unpinned:
- `toEqual([COMPOSITION_ROOT])` → `toContain(COMPOSITION_ROOT)` (`C-CONTAIN`) is green on the whole suite with `WSC`.
- So is narrowing the asserted operand inside the `expect` (`C-OPERAND`).
- This is `M15`'s twin on the other guard. Pinning the call without the comparator would replay `R5` → `R5b` in
  reverse: two tickets for one guard.

**Why a ticket and not an accepted residual.**
- The `R5b` and `R5c` reasons transfer unchanged. A filename filter in front of a scanned set is the shape
  `ABC-029` deleted. It reads as **tidying**, so it is the plausible regression, not the adversarial one. The
  equality is only a kill if something notices when an operand or the operator stops being one.
- It is not `QE-136-a`'s class. It needs **no** pinned text kept: nothing on this guard is pinned at all.
- The cost is `XS`: two framed literals in the existing drift tripwire, which already reads the file.

**Bounds that stay, named so no one re-sweeps them.**
- `ADR-0029`'s `AR-053-COMPOSER` (owner BA/PM) keeps the predicate's reach. That covers six spellings of a
  second composer the predicate does not count. That risk's pre-ruled fix (option 1) is unchanged.
- `R5d` does **not** pin `bindsAssembleFrame`. Weakening the predicate edits unpinned text inside `ADR-0029`'s
  own bound, and pinning it would freeze the very regex option 1 is pre-ruled to widen.

**What the ticket pins (BA/PM writes the page; the spelling is the Engineer's).** A buildable prototype is in
`../probe/architect-r5d-prototype.patch`.
- **(a) The composer tripwire's scan statement, whole.** It runs from the leading newline through `    );\n`
  (`:591–593`), written with `\n` escapes. Pinning the whole statement is what reds a filter **appended**
  after `)`. A first-line pin would not.
- **(b) The comparator, whole.** It is the `expect(\n      composers,\n      "<message>",\n    ).toEqual([COMPOSITION_ROOT]);`
  statement (`:595–598`), framed the same way. The whole statement is what reds `C-OPERAND`. A pin on the
  `toEqual` line alone would not.
- **Placement (recommended).** Put both in the drift tripwire `it`, after the `R5c` literal, so the file keeps
  one pin site and one reach comment. The reach comment changes from "five spans" to seven, and it names the
  composer tripwire's two spans as that guard's own. An Engineer may instead place them in the composer
  tripwire's own `it` and say why. In that case the reach comment must say which `it` holds which pin.
- **Kill ledger, on the Architect's planters** (`../probe/plant.mjs`) **or an independent harness that
  reproduces the base rows.** That wording answers `QE-137-d`'s hygiene point for this page. It is BA/PM's to adopt.
  - RED on head: `N591-HEAD`, `N591-TAIL`, `N591-WRAP`, `C-CONTAIN` and `C-OPERAND`, each `+FMT+WSC`.
  - Green: `CONTROL` and `+FMT`.
  - Unchanged: `WSC` red on the composer tripwire; `WPS` red on the licence guard; the `ABC-136`/`ABC-137`
    rows (`XHELPER-NARROW`, `QSCAN-NARROW`, `QLHS-INTERSECT`, `M15`/`M15SUB`) red.
  - Stay green, accepted: `H-SHADOW` and `H-FSMOCK` (§ 2); `N653-NARROW` (below).
  - Measured on the prototype: exactly these verdicts, whole suite 52 / 1608.
- **Raw readers stay safe.** Neither literal spells `const LICENSED_DRIVERS: readonly string[]` or
  `const COMPOSITION_ROOT =`. So `src/cli.test.ts` `A12` and `src/render-seam.test.ts` `A9` are unaffected,
  which the prototype's whole-suite run measured.
- **Stated, not hidden:** the scan literal holds `${`, so `biome-ignore` count goes **1 → 2**, as `R5b`'s
  importer pin did.
- **Fences.**
  - 1 path, `src/history-pane.nfr.test.ts`.
  - 0 production lines and 0 new files, so the UAT waiver and the QE hop both apply.
  - `N8-LANE` ≈ 0: two `toContain` calls on a string already read.
- **Size and priority (BA/PM's call):** `XS`, `P3`.
- **Sequencing.** Never in parallel with another hop on this file (the `R5b` fence). Nothing is in flight on it
  at `eae04388`: `ABC-138` is `src/cli.test.ts` and `ABC-010` is FEN. `ABC-030` (`:115`) is merge-order only.

**The probe's call site (`:653`): NO witness and NO pin, ruled now.** QE left this `UNKNOWN - verify`, and it is
answered by data flow and measured:
- `production` at `:653` feeds exactly one read, `:661`'s `toContain(COMPOSITION_ROOT)`.
- A narrowing of a set can only turn that check green → red, never red → green.
  - `N653-NARROW` (perft excluded) has no kill to drop, and is green.
  - `N653-DROPROOT` reds: it fails closed.
- Only a **widening** could mask it, and it is double-held. With the root renamed and `production` widened to
  include it (`W653-WIDEN+ROOT-RENAMED`), the child's own import of the root fails and the probe reds anyway.
- **Trigger to revisit:** the first diff that makes `:653`'s `production` feed anything besides that one
  existence check. Then it is an `R5d` question, and a witness comes first.

**If the ticket is not cut:** `R5`'s trigger applies. The next hop that opens `src/history-pane.nfr.test.ts` folds it in.

## 2. `QE-137-b`: CONFIRMED in the `QE-136-c` class. ACCEPTED, LOW, owner Architect/Design

**Measured.** QE's survivor reproduces in an own spelling (`H-SHADOW`: aliased `node:fs` import plus a
module-scope `readdirSync` that filters). With `WPS` planted, the whole suite stays green.

**A second spelling, `H-FSMOCK`, also survives.** It is a `vi.mock("node:fs", …)` whose `readdirSync` filters,
and it leaves `:24` **byte-identical**. That is the file's own idiom: four `vi.mock` factories already open it.
The `PIN` prototype leaves both green.

**Why the blast radius does not move it to `R5c`'s side.** `R5c` was ruled a ticket on three facts together:
- radius (three guards);
- it reads as tidying;
- one text pin closes it.

Only the first holds here.
- **Reads as tampering.** Both spellings rebind or mock a Node built-in and attach a filename filter to it.
  No one tidies into that.
- **No pin closes the class.** A pin on `:24` misses `H-FSMOCK`. A pin forbidding `vi.mock("node:fs"` misses a
  `vi.spyOn`, a re-export from a helper module, or a `globalThis` rebind. Each extra pin closes one spelling
  and leaves the class open. That is `QE-136-a`'s argument, verbatim.

**Alternative REJECTED: an independent second enumeration of `src/`.**
- In-process, it is reachable by the same mock.
- Done properly, in a child process, it adds a spawn: `N8-LANE`. It also puts a second enumeration in this
  file, against clause 1's "from this function and from nothing else".

Either is priced over a LOW, tampering-class residual.

**Trigger:** the first diff to `src/history-pane.nfr.test.ts` that does any of these:
- changes the `node:fs` import (`:24`);
- adds a module-scope binding named `readdirSync`;
- adds a `vi.mock`/`vi.spyOn` of `node:fs`.

That hop's QE reads it as an `R5c` question. It is visible in `git diff`, and QE reviews every ticket.

## 3. Clause 1's docblock (`:152–153`): rides with `R5d`'s ticket, not a ticket of its own

- **Why it rides.**
  - It is the same file, under the same never-in-parallel fence.
  - `R5d` is exactly the change that makes the composer tripwire's dependence on clause 1 load-bearing.
  - It is comment-only in a test file, so the UAT waiver holds.
  - A standalone ticket would be a full hop for two lines.
- **Width of the stale text (re-measured).** "Both guards … derive their scanned set" is stale. So is the next
  sentence: "Each guard then applies exactly ONE named rule … the two rules differ because THE TWO GUARDS HOLD
  DIFFERENT PROPERTIES".
- **What must be true after the edit** (wording is the Engineer's):
  - three instruments derive their set from clause 1;
  - they hold **two** properties: the probe and the composer tripwire both apply `COMPOSITION_ROOT`, and the
    tripwire is what makes the probe's one root fail closed (`ADR-0029` decision 2); the licence guard applies
    `LICENSED_DRIVERS`.
- **Safe to edit.** The `R5c` literal starts at `\nconst productionModulesIn`, so the docblock is outside every
  pin. No other test file reads that text (grep, 0 readers).

## Follow-ups

- **BA/PM:** cut the `R5d` ticket from § 1, carrying § 3 as its own criterion. Adopt the
  "or an independent harness" planter wording (`QE-137-d`) on that page.
- **Engineer (at that ticket):** two framed literals, the reach comment and the docblock. The prototype patch is
  a reading aid, not the spelling.
- **QE:** watch `QE-137-b`'s trigger (§ 2) and `:653`'s trigger (§ 1) on any diff to this file. `QE-137-d`'s
  literal run of `plantqe136.py`/`plantqe057.py` stays `UNKNOWN - verify` and is not made a gate here.
- **Architect/Design:** none further. `ADR-0029` gets one dated pointer line so its readers find `R5d`. No
  `ADR-0029` decision changes.

## Gates on `grugops/design-qe137-2026-10-10` (own worktree, docs-only diff)

Recorded in the commit message and the hand-back. Lint and `npm test` were run on the branch as committed.
