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
- **2026-10-10, `design-ABC-072`:** § Canonical clause (b) is added below. It answers `ABC-072`
  `A2`–`A5`. § Decision is unchanged; the block settles two readings of it, stated there.

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

## Canonical clause (b) — 2026-10-10

Added by Architect/Design at `design-ABC-072` (branch `grugops/ABC-072-clause-b-delta`, from wave tip
`6bfc7b29`). It delivers `ABC-072` `A2`–`A5`. The ruling above is unchanged, and the owner may still
veto it (§ Rollback).

**Cite this block; do not copy it.** A ticket page answers clause (b) by citing
`memory-bank/50-decisions/ADR-0036-abc041-clause-b-is-a-delta-test-on-the-production-capability-surface.md`
§ Canonical clause (b). It then gives **its own** (b1) and (b2) facts: its own production paths and
its own counts. Copying another page's answer is the failure `ABC-073` exists to end.

### The clause (`A2`), stated once

> **(b) Production capability — a DELTA test.** Production files are the `.ts` files under `src/`
> that are not `.test.ts`, at `<base>` and at `<head>`. Three limbs: **(1)** an import of a Node
> builtin (a `node:` specifier: static, `export … from`, or dynamic `import()`); **(2)** a
> `process.` read; **(3)** a call to `spawn` / `exec` / `fetch` / `eval` / `new Function`, with the
> `child_process` family (`spawnSync`, `execSync`, `execFile`, `fork`) counted as `spawn`/`exec`.
> Over the diff `<base>..<head>`, (b) **fires** if, for any limb:
> - **(b1)** an added or changed line of **executable code** in a production file carries the limb;
>   or
> - **(b2)** a production file gains a **runtime** import edge (a value or bare import, or a
>   re-export; `import type` and `export type` are not edges) to a local module whose runtime
>   closure at `<head>`, that module included, holds the limb in executable code.
>
> A limb word in a comment or a string is a **word hit**: listed, never a trigger. The tree's
> standing capability is a **baseline**: recorded, never a trigger. 0 production files touched is
> enough for "does not fire". **Whichever way a reading is disputed, it fires and the gate resolves
> it.**

### The instrument (`A3`): three commands, one per limb

Run from the repository root. Each command reads git objects only, so any commit pair works.

```sh
node .grugops/context/design-ABC-072/probe/clause-b.mjs <base> <head> 1  # counts import statements in code
node .grugops/context/design-ABC-072/probe/clause-b.mjs <base> <head> 2  # counts process. read sites in code
node .grugops/context/design-ABC-072/probe/clause-b.mjs <base> <head> 3  # counts call sites in code
```

- **What each counts.** Each command counts **occurrences in executable code**, found on the
  TypeScript AST. Comments and strings are not code. Each command prints its unit, the (b1) lines,
  the (b2) edges with the holder each one reaches, and the word hits (listed, not counted). It also
  prints the STATE baseline at `<head>` beside the verdict.
- **Which pair to run.** For a branch, `<base>` is its merge-base and `<head>` is its tip. For a
  merge commit, use `<merge>^1 <merge>`.
- **Known limits, stated.**
  - A renamed file counts every line as added (`--no-renames`). It over-fires, the safe direction.
  - A non-literal `import()` is listed as unresolved. Under the fail-safe, that is a dispute.
  - § Alternatives 5's widenings (a bare `process`, unprefixed builtins, `Worker`) are not counted.
    Where the word matches they show as word hits. Whether to count them stays Security/NFR's
    question.

**What it read at this hop.** Full output: `.grugops/context/design-ABC-072/probe/RUN.txt`.

| run | limb 1 | limb 2 | limb 3 | (b) |
|---|---|---|---|---|
| baseline at `6bfc7b29`, 36 production files | 0 files | **3** files in code: `cli.ts`, `glyph-mode.ts`, `perft-bench.ts` (9 by raw word hit) | 0 files; the 3 `RegExp.prototype.exec` calls are not counted | recorded, not a trigger |
| baseline at `f76e041`, 35 production files | 0 | 3, the same files (9 raw) | 0 | recorded, not a trigger |
| `dbaf972f^..dbaf972f` (`ABC-042`) | 0 | (b1) **4** lines, `cli.ts:73`, `:76`, `:81`, `:90`; (b2) `cli.ts -> glyph-mode.ts`, which holds it | 0 | **FIRES** |
| `34c9c026^..34c9c026` (`ABC-082`) | 0 | 0 lines; 4 new edges, none reaching a holder | 0 | does not fire |
| `4c33b72b^1..4c33b72b` (`ABC-059`) | 0 production files | 0 | 0 | does not fire |

- **One count differs from BA/PM's rough reading.** `ABC-082` adds **4** new edges, not 3. The
  fourth is a multi-line `import { … } from "./position.ts"`, which a line grep cannot see. It
  reaches no holder, so the answer is the same.
- **A mutant ledger proves the cases history does not hold:** limbs 1 and 3, a transitive edge,
  `import type` against an inline `type`, an in-place edit, and word hits. Nine plants, 9 of 9 as
  designed (`probe/mutants.sh`, `probe/mutants.out.txt`).

### The retired prediction (`A4`)

`ABC-041`'s parenthetical predicted that `ABC-042` would end the `node:` baseline. **The measured
fact:** `ABC-042` merged @ `dbaf972`. Limb 1 is still **0** across all **36** production files at
`6bfc7b29`, and across 35 at `f76e041`. `ABC-042` added `process.` reads (limb 2), not a `node:`
import. This block makes no prediction.

### `ABC-065` (`A5`)

**Under DELTA, clause (b) did NOT fire on `ABC-065`: its merge `460b9f58` touches 0 production
files and reads 0 / 0 / 0 on the three commands, so `ABC-065`'s merge is not re-opened.** The
Orchestrator's skip paragraph is
`.grugops/context/pull-abc065-066-2026-08-16/notes/20260816T030000Z-orchestrator-decision-abc065-merged-and-why-security-nfr-was-skipped-9f2b81d4.md`,
row "production files touched". This is a record. No Security/NFR verdict is re-run.

### Two readings this block settles

- **(b2) reads "holds" as "holds, or reaches at runtime".** § Decision 2 names a module that holds
  a limb, then says the capability "only has to be newly reachable". The closure covers every case
  the rule names, because a holder is in its own closure. So it only widens, which is the safe
  direction. **At `6bfc7b29` it changes no answer.** Only the three holders reach a holder at
  runtime. The one runtime edge into a holder is `cli.ts -> glyph-mode.ts`.
- **§ Alternatives 3's example is corrected.** `cli-options.ts` holds no limb in code and reaches
  none at runtime. Its only import of `glyph-mode.ts` is `import type`, and its "spawn" is a word
  in a comment. The example that fits is `glyph-mode.ts`. The row's verdict is unchanged.

`ABC-042`'s paragraph applied STATE and was right under the text it was gated on. It is not
re-opened (§ 4; `ABC-072` test note 4).
