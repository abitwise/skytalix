---
kind: adr
id: ADR-0036
---
# ADR-0036: `ABC-041` clause (b) is a DELTA test: it fires when a diff adds or changes a capability line in production code, or a new import edge to a module that holds one

## Status

**accepted**, 2026-10-10, by Architect/Design (task `wave-2026-09-25`, subtask
`design-owed-rulings-2026-10-10`, Workflow 07). This answers `ABC-072` `A1`, the ⚠️ on `ABC-072`
DoR item 10. Through `ABC-072`, it also clears the ordering ⚠️ on `ABC-073`.

- **Why this role accepts it.** `ABC-072` gives the ruling to Architect/Design by name. The owner's
  standing directive of 2026-08-03 (`memory-bank/60-progress.md` § "Standing directive — who
  decides") lets this role ratify an architecture decision.
- **No level, target, product promise or cost moves.** The owner may still veto it. His question
  is in the decision note `…95c73721`: STATE would send every ticket through `In Security/NFR`.
- **Scope of this ADR.** It rules the shape (STATE or DELTA) and defines the delta. It does **not**
  write `ABC-072`'s canonical paragraph (`A2`), run its three instruments (`A3`), retire the
  prediction (`A4`) or edit any ticket's Security bullet (`ABC-073`). Those remain the tickets'
  hops.
- **Limb definitions.** The limb list (builtin import, `process.`, the six call names) is copied
  from clause (b) unchanged. Whether it is complete is a security bar, which makes it Security/NFR's
  question, at `ABC-072`'s gate.
- **Not edited:** `ABC-041`, `ABC-042`, `ABC-065` and `ABC-066`. Their gated wording stays
  permanently (`ABC-072` § Where the corrected wording lands).

## Context

Clause (b) (`plans/tickets/ABC-041-render-seam-closure.md:220-224`) is worded as a STATE predicate
over the whole tree. Its printed instrument covers one of its three limbs. Its prediction (*"`ABC-042`
is the hop that ends it"*) is false. `ABC-072` lays out both readings.

**Measured at `37ca6ae2` (35 production files), comment lines stripped:**
- limb 1 (`from "node:`): **0** files;
- limb 2 (`process.`): **3** files, `cli.ts`, `glyph-mode.ts` and `perft-bench.ts`;
- limb 3 (spawn, exec, execFile, fork, fetch, eval, `new Function`): **0** call sites. The
  `RegExp.prototype.exec` hits are excluded.

This is BA/PM's 0 / 3 / 0 from `f76e041`, unchanged. **So under STATE, clause (b) fires on every
ticket, forever.**

**The three other clauses are already delta tests.** Each one takes the diff as its subject:
- (a): *"`package.json` … touched"*;
- (c): *"a **test** file in the diff introduces"*;
- (d): *"the diff touches"*.

(b) is the only one written over the tree. The paragraph's own repair note explains why the subjects
were split in the first place: the old form *"measured the repo rather than the change"*. Read as
STATE, (b) brings that defect back.

**Practice already treats it as a delta.** `ABC-066` answered a delta. Five pages answered with a
file-touch test (`ABC-073`'s table). Since August the board has routed tickets to `In Security/NFR`
on what each diff adds, not on what the tree holds. For example, `ABC-053` went for clause (d), and
`ABC-057` and `ABC-054` did not go.

## Decision

### 1. DELTA

Clause (b) is a test on **what the diff does to the production capability surface**. The tree's
standing capability (the 0 / 3 / 0 above) is a **baseline to record, not a trigger**.

### 2. The test, stated once

The diff runs from `<base>` to `<head>`. Production files are the non-`.test.ts` `.ts` files under
`src/`, including new and renamed files. **Clause (b) FIRES if either of these holds:**

- **(b1) A capability line is added or changed.** In a production file, the diff's added side
  (`git diff -U0 <base> <head>`, `+` lines) holds a line of **executable code** with any limb token:
  - an import of a Node builtin (static or dynamic);
  - `process.`;
  - a call to `spawn`, `exec`, `fetch`, `eval` or `new Function`. Clause (b)'s names are kept
    as written, and the `child_process` family (`spawnSync`, `execSync`, `execFile`, `fork`)
    counts as `spawn`/`exec`.

  A capability line that is **moved**, or **edited in place**, counts. For example, an existing
  `process.env.X` read rewritten to `process.env.Y` fires.
- **(b2) A new import edge reaches a capability.** A production file gains a **value or bare
  import** of a local module that holds a limb in executable code at `<head>`. This is how the
  clause's own phrase *"this module or any module in its runtime closure"* reads as a delta: the
  capability does not have to be new to the tree. It only has to be newly reachable from a module
  that could not reach it before.

**Does not fire:**
- a diff with **0 production files**;
- a production diff whose `+` lines hold no limb token in code and add no edge of (b2)'s kind;
- a limb word that appears **only in a comment** or string prose. That is a word hit: the
  instrument lists it and does not fire on it (`ABC-072` test note 2).

**The fail-safe sentence stays.** *"Whichever way a reading is disputed, it fires and the gate
resolves it."* A dispute about whether a hit is code or comment is a dispute.

### 3. The consequence this ruling accepts, named

**This trigger is narrower than the clause's words.** It does **not** fire on a diff that only
**calls an existing function** that already holds a capability, through an import edge that already
existed. An example is a new call into an existing `perft-bench.ts` path from a module that already
imports it.

What bounds that case:
- clause (d) (blast radius), when the ticket names its files;
- QE's review of every ticket;
- the tree's small capability surface, which is 3 files.

**The residual is accepted here as Architect/Design's, LOW.** **Trigger:** the first production module
outside `cli.ts`, `glyph-mode.ts` and `perft-bench.ts` that holds a limb in code. At that point the
surface is no longer small, and Security/NFR should rule whether (b2) needs a call-graph reach.

### 4. What follows for the records `ABC-072` names (`A5`; the hop writes the sentence)

- **`ABC-065`: under DELTA, clause (b) did NOT fire.** It touched 0 production files. The
  Orchestrator's skip note measured this: `.grugops/context/pull-abc065-066-2026-08-16/notes/20260816T030000Z-orchestrator-decision-abc065-merged-and-why-security-nfr-was-skipped-9f2b81d4.md`,
  row "production files touched". The skip was **consistent with this reading**, although it cited
  a file-touch test. Under DELTA, "0 production files touched" is a sufficient condition for "does
  not fire". It is not a necessary one. **Not re-opened.**
- **`ABC-042`** applied STATE to this limb, and that was correct under the text it was gated on
  (`ABC-072` test note 4). **Not re-opened.**
- **The file-touch wording is not a misreading under DELTA,** provided the page touches 0 production
  files. It is the sufficient shortcut. A page that touches production files must answer (b1) and
  (b2). `ABC-073`'s repair is mostly a citation swap. `ABC-053`'s self-contradiction (it quotes the
  STATE words under a "not triggered" heading) still needs its own fix (`ABC-073` `A4`).

## Alternatives

| # | alternative | verdict |
|---|---|---|
| 1 | **STATE**, as worded. (b) fires on every ticket while the tree holds 3 `process.` readers | **Rejected.** A trigger that is always on carries no information. It moves every real filter into "fires, then cleared on the merits", which is noise at every gate. The board has never honoured it either: tickets go to Security/NFR on what their diff adds. Writing STATE down would make the record disagree with every routing since August |
| 2 | **File-touch**: fires if any production file is touched | **Rejected as the test; kept as the shortcut.** It is right whenever it says "not touched". It over-fires on every comment-only or logic-only production edit, which is most of them |
| 3 | **DELTA on (b1) alone**, with no edge rule | **Rejected.** It drops *"or any module in its runtime closure"* entirely. A module that starts importing `cli-options.ts` or `perft-bench.ts` gains a capability without writing a token |
| 4 | **DELTA with a full call-graph reach** (any new call path to a capability) | **Rejected on cost (coding rule 7).** It needs a parser and a resolver for a 3-file surface. Section 3 names the trigger at which it should be reconsidered |
| 5 | **Widen the limbs** (for example, the bare identifier `process` to catch `const p = process`, or `Worker`, or `node:` builtins named without the prefix) | **Not ruled here.** The limbs are a security bar. Recorded for Security/NFR at `ABC-072`'s gate. Widening would over-fire, which is the safe direction |

## Consequences

- **`ABC-072`:** DoR item 10's ⚠️ is answered by this ADR (re-score: BA/PM).
  - `A1` is met.
  - The hop still owes:
    - `A2`, the canonical paragraph, citable by name. It may be added to this file as a dated block
      or written into a decision note; `A6`'s path list allows either.
    - `A3`, three commands, one per limb, run and recorded, each counting call sites in code. For
      DELTA they run on a `<base>..<head>` diff. The 0 / 3 / 0 state counts are recorded beside
      them as the baseline.
    - `A4`, retiring the prediction.
    - `A5`, from §4.
- **`ABC-073`:** its ordering ⚠️ clears with `ABC-072`'s paragraph. **The live set has shrunk.** At
  `37ca6ae2`, `ABC-053`, `ABC-054`, `ABC-057` and `ABC-058` are `Done`. That leaves `ABC-055`
  (`Ready`) and `ABC-059` (`In Review`). BA/PM re-measures; the page's own text allows folding it
  into `ABC-072`'s hop.
- **Routing:** the Orchestrator routes on (b1)/(b2) from now on, and cites this ADR, not a copied
  paragraph.
- **`plans/nfr-catalog.md`:** not opened. No NFR row carries this trigger.

## Rollback

Edit this file to read STATE. Nothing is built on it. Under STATE every open ticket's Security bullet
reads "fires", and the Orchestrator routes every ticket through `In Security/NFR`. **What would
falsify DELTA:** a ticket that passes (b1) and (b2) quietly and is later found to have shipped a
capability change that Security/NFR would have blocked. Re-open at the first such case.
