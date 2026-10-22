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
- **2026-10-10, `design-F-072-1`:** the limb list is **widened** by Security/NFR's ruling at
  `ABC-072`'s gate (`F-072-1`). See `### Widened limbs — 2026-10-10 (F-072-1)` at the end of
  § Canonical clause (b). The production-file set, the three limbs, (b1)'s unit and the unresolved
  rule there take precedence over the narrower words in this Status, in § Decision 2 and in the
  quoted clause. DELTA, (b2), the baseline rule and the fail-safe are unchanged. The canonical
  instrument moves to `.grugops/context/design-F-072-1/probe/clause-b.mjs`.
- **2026-10-12, `secnfr-ABC-095-placement`:** § Decision 3's trigger has fired. `src/book-file.ts`
  (`ADR-0037` § Addendum R1) is the fourth holder and the first limb-1 holder. Security/NFR rules it
  in `### S1 — the fourth holder — 2026-10-12` at the end of this file: (b2) gets **no** call-graph
  reach, and limb 1's (b1) unit widens to the holder file. DELTA, (b2), the baseline rule and the
  fail-safe are unchanged.

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
| 3 | **DELTA on (b1) alone**, with no edge rule | **Rejected.** It drops *"or any module in its runtime closure"* entirely. A module that starts importing `cli-options.ts` or `perft-bench.ts` gains a capability without writing a token. *(2026-10-10: the `cli-options.ts` example is wrong and the verdict is unchanged. See the correction in § Canonical clause (b) › "Two readings this block settles": `glyph-mode.ts` is the example that fits.)* |
| 4 | **DELTA with a full call-graph reach** (any new call path to a capability) | **Rejected on cost (coding rule 7).** It needs a parser and a resolver for a 3-file surface. Section 3 names the trigger at which it should be reconsidered |
| 5 | **Widen the limbs** (for example, the bare identifier `process` to catch `const p = process`, or `Worker`, or `node:` builtins named without the prefix) | **Not ruled here.** The limbs are a security bar. Recorded for Security/NFR at `ABC-072`'s gate. Widening would over-fire, which is the safe direction. *(2026-10-10: ruled WIDEN by Security/NFR; see § Canonical clause (b) › "Widened limbs — 2026-10-10 (F-072-1)".)* |

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

*2026-10-10 (`F-072-1`): read the quote above with the substitutions in "Widened limbs — 2026-10-10
(F-072-1)" below. Those substitutions cover the production files, the three limbs, (b1)'s unit and the
unresolved rule. The quote itself is kept as written, so the clause text still occurs once.*

### The instrument (`A3`): three commands, one per limb

*2026-10-10 (`F-072-1`): the commands below run `ABC-072`'s instrument. That instrument is kept
unchanged as the record of the readings in this section. **Route with the canonical instrument
instead:** `.grugops/context/design-F-072-1/probe/clause-b.mjs`, in "Widened limbs — 2026-10-10
(F-072-1)" below.*

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

### Widened limbs — 2026-10-10 (`F-072-1`)

Added by Architect/Design at `design-F-072-1` (branch `grugops/design-F-072-1`, from wave tip
`7f7e6b84`). It lands Security/NFR's Ruling 1 at `ABC-072`'s gate (PASS_WITH_RISKS, `F-072-1`
MEDIUM): `.grugops/context/secnfr-ABC-072/notes/…29849eeb`.
- **What it changes:** **what counts**, not when (b) fires. DELTA, (b2) and its closure reading, the
  baseline rule, the 0-production-files shortcut and the fail-safe sentence are unchanged.
- **Under STATE too.** The ruling holds under STATE as well, so the owner's open veto does not
  touch it.
- **Why widen.** As first written, 8 of Security/NFR's 13 plausible forms passed **silently**: no
  count, no word hit, nothing unresolved. An unseen form cannot be disputed.

**Read § The clause (`A2`) with these substitutions.** Cite this block beside it; do not copy either.

| element | as quoted above | reads now |
|---|---|---|
| production files | `.ts` under `src/`, not `.test.ts` | **every JS/TS source under `src/`**: `.ts .mts .cts .js .mjs .cjs`. Excluded: tests (`.test.<ext>`) and declaration files (`.d.ts .d.mts .d.cts`). An `.mjs` escapes Biome and `tsc` but not this clause |
| limb (1) | a `node:` specifier | **any import whose specifier is not local** (does not start with `.`): a Node builtin with or without `node:`, or any package. Static, `export … from`, literal `import()`, and literal `require()`. `import type` / `export type` do not count. The repository has 0 runtime dependencies, so any package import from production is new reach |
| limb (2) | a `process.` read | **any value reference to the global `process`**: member read, element access, destructuring, aliasing, shorthand, and `globalThis.process`. A declaration, property name or type position spelled `process` is not a reference |
| limb (3) | `spawn` / `exec` / `fetch` / `eval` / `new Function`, plus the `child_process` family | **adds `Function(…)` without `new`** (the same as `new Function`, `V1.3.2`) **and `new WebSocket`** (network with no import, the same class as `fetch`). Bare, or through `globalThis.`. A `child_process` function counts through any binding: an `import`, a `require()`, or an `await import()` |
| (b1)'s unit | the callee line | **the whole span** of a counted occurrence. Editing an argument line of an existing `spawn`/`exec`/`fetch` call fires (`V1.2.5`; (b1)'s "edited in place") |
| unresolved | listed, while the verdict could still say "does not fire" | **FIRES (disputed)**. Scoped to the diff: a non-literal `import()`/`require()` in a file the diff touches, or a **new** edge to a local path that is not a production file at `<head>`. **The verdict never says "does not fire" while anything is disputed** |
| `Worker` | (§ Alternatives 5's question) | **no separate entry.** Node has no global `Worker`; it is reachable only through `worker_threads`, which limb (1) counts |
| word hits | listed, never a trigger | **unchanged.** Computed forms stay listed word hits and are not counted: `(0, eval)(…)`, `globalThis["eval"]`, `Reflect.apply(eval, …)` (`AR-072-WORDHIT`, Security/NFR's, with its trigger) |

**Four instrument points beyond the ruling's words, inside its intent.** Each one only over-fires,
the safe direction. Each has its own plant, and the plants are in the readings below:
- **`require()` counts as an import (F1–F3).** The ruling made `.cjs`/`.cts` production, and
  `require()` is how those files import. In ESM, `createRequire` makes it a real import too.
- **A `child_process` binding made by `require()` or `await import()` (F5, F6)** is tracked the way an
  ESM import binding already was.
- **`new globalThis.WebSocket(…)` (F4)** is the global `new WebSocket`. This mirrors the ruling's
  `globalThis.process`.
- **`.d.mts`/`.d.cts` are declaration files (F8)**, as `.d.ts` already was.

#### The instrument, canonical from this date

```sh
node .grugops/context/design-F-072-1/probe/clause-b.mjs <base> <head> 1  # counts non-local import statements in code
node .grugops/context/design-F-072-1/probe/clause-b.mjs <base> <head> 2  # counts references to the global process in code
node .grugops/context/design-F-072-1/probe/clause-b.mjs <base> <head> 3  # counts capability call spans in code
```

- **What it is built from.** It is `design-ABC-072/probe/clause-b.mjs` with Security/NFR's
  `limb-ruling.patch` applied, plus `probe/architect-delta.patch` (the four points above, and a
  verdict line that reads one variable).
- **The old path stays.** It is unchanged, as `ABC-072`'s record, so its readings above stay
  reproducible.
- **Pair choice and output are unchanged.** It takes about 1.0 s per limb at load1 ≈ 6.

#### What it read at this hop (`.grugops/context/design-F-072-1/probe/RUN.txt`)

| run | result |
|---|---|
| baseline at `7f7e6b84` (wave tip), 36 production files | **0 / 3 / 0**, with the same holders: `cli.ts`, `glyph-mode.ts`, `perft-bench.ts`. Raw word hits are 3 / **11** / 6. Limb 2's regex is now `\bprocess\b`, so its raw count rises from 9 |
| baseline at `f76e041`, 35 files | **0 / 3 / 0**, the same holders |
| the 7 recorded pairs × 3 limbs (`ABC-042`, `ABC-082`, `ABC-059`, `ABC-065`, `088e48db`, `6bfc7b29..5f48753f`, `f76e041`) | **21 of 21 rows unchanged** against the `ABC-072` instrument: the same verdict, (b1), edge count, (b2) and holders. Only limb 2's raw word count moves |
| the Architect's nine (`design-ABC-072/probe/mutants.sh` at `6bfc7b29`) | **byte-identical** to `design-ABC-072/probe/mutants.out.txt` (sha-256 `9ca110f1…`). Verdicts are the same at `7f7e6b84` |
| Security/NFR's 13 (`sec-mutants.sh` at `5f48753f`, and again at `7f7e6b84`) | **S1–S12 FIRE**, and S11 reads "FIRES (disputed …)". **S13 is a listed word hit.** At `5f48753f` this is byte-identical to Security/NFR's demonstration (`sec-mutants.widened.out.txt`) |
| this hop's plants F1–F9 (`probe/f-mutants.sh` at `7f7e6b84`) | **F1–F6 FIRE** where the demonstration is silent or lists a word hit. **F7a does not fire:** a dispute in a file the diff does not touch is not inherited. **F7b FIRES (disputed).** **F8 and F9 do not fire** (a declaration file; a type-only package import, listed as a word hit) |
| every output file of this hop | **0 rows** read "unresolved > 0" together with "does not fire" |

#### What this leaves, and who owns it

- **`AR-072-LIMBS`** (MEDIUM until `F-072-1` lands; owner the Orchestrator). Its condition is met
  when this block merges. The Orchestrator records the close.
- **`AR-072-WORDHIT`** (LOW; owner Security/NFR). Unchanged.
- **§ Decision 3's residual** (a new call over an existing edge; LOW; owner Architect/Design).
  Unchanged. The widened limbs leave the holders at the same 3 files, so its trigger does not move.
- **`O-072-a`.** Closed: § Alternatives row 3 now points at the correction.
- **Rollback.** Strike this block and route with the old path. Nothing else is built on it.

### S1 — the fourth holder — 2026-10-12

Ruled by Security/NFR (task `wave-2026-09-25`, subtask `secnfr-ABC-095-placement`, branch
`grugops/secnfr-ABC-095-placement` from `main` `d0cde2e2`). It answers `ADR-0037` § Addendum's S1.
The readings are in `.grugops/context/secnfr-ABC-095-placement/notes/…f0bf8b4a`. They come from
plants in a scratch clone outside the repository, read with the canonical instrument. No timing was
read.

**The trigger.** `src/book-file.ts`, as `ADR-0037` R1 contracts it, is the first production module
outside `cli.ts`, `glyph-mode.ts` and `perft-bench.ts` that holds a limb. It is also the first
production file that holds **limb 1**: the limb-1 baseline has been 0 since the repository began.

**Ruling 1: (b2) gets no call-graph reach.** The delta test stands for (b2) as written.
- **The residual that a reach would close** is a new call over an existing edge (§ Decision 3). For
  this holder it reaches one function that takes no parameter and reads one fixed path, read-only.
  A new call re-reads the same bytes, so no new input reaches the capability.
- **Measured:** a new `readBookFile()` call in `cli.ts` does not fire, and it carries no new
  exposure. A second importer of `book-file.ts` (`render-seam.ts -> book-file.ts`) **fires** (b2).
- **Cost.** § Alternatives 4's reason stands: a parser and a resolver, now for 4 files.

**Ruling 2: limb 1's (b1) unit is the HOLDER FILE.** For limb 1 only, (b1) also fires when a `+`
line of `git diff -U0 --no-renames <base> <head>` falls anywhere in a production file that holds
limb 1 in code at `<base>` or at `<head>`. A comment-only edit fires too, which is the safe
direction.
- **Why limb 1 differs.** For limb 2, every use carries the token `process`. For limb 3, every use is
  a counted call span. For limb 1, the counted occurrence is the import statement, and the uses of
  the imported binding (`readFileSync(…)`) carry no token. Until now no production file held limb 1,
  so this gap had nothing to hide.
- **Measured: two diffs that break R1's contract fire NOTHING on any limb under the instrument as it
  stands:**
  - the holder reads `/etc/passwd` instead of the book;
  - the holder takes `path: string`, and `cli.ts` passes a value derived from its options.

  The second is the path-from-input shape that `ADR-0037` R1 option 4 rejected (`V12.3.1` [L1]).
  Under Ruling 2 both fire, because both touch `src/book-file.ts`. An edit to the import line (for
  example, adding `writeFileSync`) already fires.
- **Cost.** The holder set for limb 1 is `src/book-file.ts`, about 5 lines. Limb 2 and limb 3
  holders are not affected.
- **Severity of the gap, if Ruling 2 did not land:** MEDIUM (`F-095-1`). It is the class of
  `F-072-1`: a form that passes silently. It does not block (`block_on: high`).

**How to apply Ruling 2 before the instrument carries it.** Take the limb-1 holders from the
instrument's own `baseline at <head>` line for `<head>`, and from the same line run as
`<base> <base> 1` for `<base>`. Then run
`git diff --name-only --no-renames <base> <head> -- <those paths>`. A non-empty output means limb 1
FIRES (b1). Folding this into `.grugops/context/design-F-072-1/probe/clause-b.mjs` belongs to
Architect/Design, the instrument's owner. Until the fold lands, the Orchestrator applies the by-hand
check when it routes (`AR-095-L1UNIT`).

**§ Decision 3's trigger is re-armed:**
- at the first holder that exports a function taking a caller-supplied value which reaches a
  capability, because from then on a new call over an existing edge can carry new input; or
- at a fifth holder.

**What this leaves, and who owns it.**
- **`F-095-1`** (MEDIUM): closed by Ruling 2 when this block merges. The Orchestrator records the
  close.
- **`AR-095-L1UNIT`** (LOW; owner the Orchestrator, who routes by hand until the fold lands; the fold
  is owed by Architect/Design). It closes when `clause-b.mjs` fires on a `+` line in a limb-1 holder.
  The fold needs at least the two plants above, and they must fire.
- **§ Decision 3's residual** (LOW; owner Architect/Design). Unchanged, apart from the re-armed
  trigger.
- **Rollback.** Strike this block. `F-095-1` then re-opens at MEDIUM, owned by the Orchestrator.

#### S3 reading — 2026-10-12

Read by Security/NFR at `ABC-095`'s gate (subtask `secnfr-ABC-095-s3`, branch `grugops/secnfr-ABC-095-s3`
off the QE tip `e1444f23`), on the delivered pair `0974102f..2307fc11`. The readings are in
`.grugops/context/secnfr-ABC-095-s3/notes/…c24fec8e`, and the result is in `…b65b11b7`. **Nothing ruled above
changes.**
- **The prediction held.** Limb 1 FIRES: (b1) the `node:fs` import in `src/book-file.ts`, and (b2)
  `cli.ts -> book-file.ts`. Limb 2 FIRES on the warn's `process.stderr` in `cli.ts`. Limb 3 does not fire.
  The edges to `book.ts` and `book-engine.ts` reach no holder. **The holder set is 4.**
- **Ruling 2, applied by hand, FIRES.** The holders are none at `<base>` and `src/book-file.ts` at `<head>`.
- **The by-hand method's empty case.** The method takes the holders at `<base>` **and** `<head>`. If both
  are empty, Ruling 2 does not fire, and the `git diff` is **not run**. With an empty pathspec,
  `git diff --name-only <base> <head> --` lists every changed file (21 at this pair), which reads as a
  false "fires". The fold owed under `AR-095-L1UNIT` should include this case as a plant that does not
  fire.
- **`AR-095-L1UNIT` is still open.** `clause-b.mjs` is unchanged since `341da4c1`.

#### Ruling 2 folded — 2026-10-21 (`ABC-163`)

Commit `87d3897d` edits `.grugops/context/design-F-072-1/probe/clause-b.mjs` **in place**, so the canonical
pointer above is unchanged. Readings taken before it reproduce from that file at `341da4c1`. For limb 1, (b1) now also
fires on any `+` line, comments included, in a production file that holds limb 1 at `<base>` or `<head>`. The output
prints "fired by Ruling 2". With no holder at either end, Ruling 2 adds nothing and runs no pathspec diff. Limbs 2
and 3 print byte-identical output. Limb 1 prints one added line, `(b1) Ruling 2 …`, plus one indented line for each
holder file it names.
- **Byte comparisons.** The record harnesses take the instrument path as an argument. A byte comparison with a
  pre-fold record runs them on the `341da4c1` copy.
- **Re-runs on this copy.** The harnesses that `grep '(b1)'` also match the Ruling 2 line, so their limb-1 rows split
  in two. Grep `(b1) capability` for the old row. Plants F5, F6 and S10 move from `L3` to `L1 L3` by design, because
  each edits a file that holds limb 1. The recorded outputs are not edited.

**One case the by-hand method caught and the fold does not.** A file that holds limb 1 at `<base>` or `<head>` and is
touched only by deleted lines has no `+` line, so Ruling 2 does not fire. The by-hand `--name-only` listed it.
- **QE's plants** (`qe-ABC-163`, `G-1`). A holder's guard line deleted, its import line deleted, or the holder renamed
  with its import dropped. Ruling 2 fires on none of the three. The by-hand check fired on all three.
- **Today's holder** takes no parameter and reads one fixed path in one line, so no deletion can widen what it reads.
- **When the case becomes live** (`AR-163-DELONLY`'s trigger): a limb-1 holder gains a guard, with or without a
  parameter; a parameter or caller-supplied value reaches the read; a read spans more than one line; or a second
  limb-1 holder appears. Owed before that ticket merges: Ruling 2 widens to any changed line, `+` or `−`, and the
  instrument drops its `!lines.size` skip. Until then the Orchestrator runs the by-hand `--name-only` check.
- **Pre-existing, not from this fold** (`AR-163-UNCOMMENT`, LOW, owner Architect/Design; QE's `G-2`). Deleting the
  comment delimiters around an import makes a new holder with no `+` line. Nothing fires on it, before or after this
  commit. The same blind spot holds on every limb. It becomes live when a production block comment holds limb code
  that would compile without its delimiters.
- Security/NFR accepted the risk as `AR-163-DELONLY`: LOW, latent; owner the Orchestrator, fix by Architect/Design
  (`security-nfr-ABC-163`).

**The by-hand Ruling 2 check is no longer needed once this commit is on `main`, until `AR-163-DELONLY`'s trigger
fires without its fix.** QE read `A1`–`A3` MET with its own
plants (`qe-ABC-163`, PASS_WITH_GAPS at `dc4d4f15`), so `AR-095-L1UNIT` closes when this commit merges. The
Orchestrator records the close. Until then the Orchestrator keeps the by-hand check, holders at both ends.
`AR-180-VALIDATED` names this merge in its close condition. Readings: `.grugops/context/ticket-to-pr-ABC-163/notes/`,
`.grugops/context/qe-ABC-163/notes/`, `.grugops/context/arch-ABC-163-adr/notes/` and
`.grugops/context/arch-ABC-163-adr-text/notes/`.

#### Ruling 2 widened — 2026-10-21 (`ABC-188`)

Worded by Security/NFR at `ABC-168`'s gate (`.grugops/context/security-nfr-ABC-168/notes/…decision-75a45be0` § 2),
when `AR-163-DELONLY`'s trigger (iv) fired: `ABC-168` makes `src/uci.ts` a second limb-1 holder. Commit `d722a6b6`
folds it into `.grugops/context/design-F-072-1/probe/clause-b.mjs` **in place**, so the canonical pointer above is
unchanged. Readings taken before it reproduce from that file at `87d3897d`.
- **(i) The unit.** For limb 1, (b1) fires on any changed line, `+` or `−`, comments included, in a production file
  that holds limb 1 in code at `<base>` or `<head>`. This replaces "a `+` line" in Ruling 2. Limbs 2 and 3 are
  unchanged.
- **(ii) A holder deleted or renamed away at `<head>` counts.** It held limb 1 at `<base>`, and under
  `git diff -U0 --no-renames` every line of it is a `−` line.
- **(iii) The empty case is kept.** With no holder at either end, Ruling 2 adds nothing and runs no pathspec diff.
- **(iv) The by-hand `--name-only` check retires when this merges.**
- **(v) `AR-163-DELONLY` closes on QE's read of `ABC-188`'s `A2`–`A7`** (D1 and D2 included). The Orchestrator
  records the close.
- **(vi) `UNC1` covers `AR-163-UNCOMMENT` on limb 1 only**, because the uncommented file is a holder at `<head>`. On
  limbs 2 and 3 the risk stays open, LOW, owner Architect/Design.

**Output.** Each file line under `(b1) Ruling 2` prints its `+` and `-` counts, and the head line counts
`holder files with changed lines (+ or -)`. Limbs 2 and 3 print byte-identical output to `341da4c1` on all 10 plants of
`r2-mutants.sh`, where `G1-IMP` and `G1-GRD` flip to FIRES by design and `G1B`, `UNC1` and `REN` are added.

**Rollback.** Revert `d722a6b6`. `AR-163-DELONLY` re-opens at MEDIUM while a second holder stands, and the by-hand check
returns. Readings: `.grugops/context/arch-build-ABC-188/notes/`.

#### Binary-flagged files read as text — 2026-10-21 (`ABC-191`)

Accepted by Security/NFR at `ABC-188`'s gate as `AR-188-BINARY` (`.grugops/context/security-nfr-ABC-188/notes/…decision-f5843a71`
§ 3, from QE's `QE-188-a`). Commit `11245e3d` edits `.grugops/context/design-F-072-1/probe/clause-b.mjs` **in place**,
so the canonical pointer above is unchanged. Readings taken before it reproduce from that file at `d722a6b6`.
- **(i) The instrument's one diff call reads `--text --no-textconv`.** So a production file git treats as binary (a NUL
  byte, or a `-diff` attribute from any attributes source) shows its changed lines on every limb, and a textconv driver
  no longer changes the line map. Measured: a NUL byte in the holder's JSDoc, a committed `.gitattributes`
  `src/** -diff`, and the same line in `.git/info/attributes` each blinded every limb before this commit. A
  `diff=<driver>` with a configured `textconv` changed the `+`/`−` counts. No limb's unit changes, and Ruling 2 is
  untouched.
- **(ii) The Orchestrator's `--numstat` stand-in** (`git diff --numstat <base> <head> -- src | awk '$1=="-"'`, owner
  record `…orchestrator-decision-9f5ca4b4`) **retires when this merges.**
- **(iii) `AR-188-BINARY` closes on QE's read of `ABC-191`'s `A2`–`A7`.** The Orchestrator records the close.

**Harness.** `r2-mutants.sh` has 12 rows. `BIN-NUL` and `BIN-ATTR` (X1's edit plus each mark) FIRE, and neither fires on
the instrument before this commit. `341da4c1` is blind to both marks, so on those two rows limbs 2 and 3 are compared
with `341da4c1`'s output on X1, plant ids masked. The other 10 rows keep the byte comparison on the same plant.

**Rollback.** Revert `11245e3d`, and the `--numstat` stand-in returns at every routing and merge. Readings:
`.grugops/context/arch-build-ABC-191/notes/` and `.grugops/context/bapm-cut-AR-188-BINARY/notes/`.

#### Git config, environment and quoted names no longer steer clause (b) — 2026-10-21 (`ABC-193`)

Accepted by Security/NFR at `QE-191-a` as `AR-191-GITENV` and `AR-191-QUOTEPATH`
(`.grugops/context/security-nfr-QE-191-a/notes/…decision-7c1f3590` § 2–3; owner record `…orchestrator-decision-eb401873`).
Commit `63eadabe` edits `.grugops/context/design-F-072-1/probe/clause-b.mjs` **in place**, so the canonical pointer
above is unchanged. Readings taken before it reproduce from that file at `11245e3d`.
- **(i) The instrument ignores git config and environment.** The one diff call reads `--no-ext-diff --no-color
  --src-prefix=a/ --dst-prefix=b/`, and every git call reads `-c core.quotePath=false`. So git config or environment
  in any checkout or worktree (colour, an external diff, a diff driver's `command`, prefixes) no longer changes what the
  instrument reads. A production file whose name holds a non-ASCII byte is read like any other. Measured: each of
  `color.diff=always`, `diff.external`, `GIT_EXTERNAL_DIFF`, `diff.ext.command` with `.git/info/attributes`
  `src/** diff=ext`, and `diff.srcPrefix`/`dstPrefix` made the instrument before this commit read
  `production files changed: 0` and `does not fire` on a widening (a `node:fs` import plus a `fetch` call).
- **(ii) Quoted paths are disputes.** A path the diff still prints C-quoted (git quotes a name holding `"`, `\`, a tab
  or a newline even with `core.quotePath=false`) makes the limb FIRE (disputed). The unresolved line names the path as
  git printed it, `"src/q\"t.ts" (C-quoted by git; not read)`. A C-quoted file the pair does not change adds nothing.
- **(iii) The stand-in retires.** The Orchestrator's GITENV stand-in (`git config --get-regexp
  '^(color\.(ui|diff)|diff\.(external|srcprefix|dstprefix)|diff\..+\.command)$' | grep -v -E
  '^color\.(ui|diff) (auto|true|false|never)$'; printenv GIT_EXTERNAL_DIFF`, owner record `…eb401873`) **retires when
  this merges.**
- **(iv) `AR-191-GITENV` closes on QE's read of `ABC-193`'s `A2`–`A4`.** The Orchestrator records the close.
- **(v) `AR-191-QUOTEPATH`'s instrument half closes on QE's read of `QU`, `QE2` and `A6`'s C-quoted plants.** The
  `AGENTS.md` waiver form stays owed as the owner's text.

No limb's unit changes, and Ruling 2 is untouched. **Harness.** `r2-mutants.sh` has 20 rows. `ADD` (a control with no
route), the five route rows on `ADD`'s plant (`G-COLOR`, `G-EXT`, `G-ENV`, `G-DRV`, `G-PFX`), `QU` and `QE2` FIRE; on the
instrument before this commit only `ADD` fires. A route is set in the harness's scratch clone (or one run's
environment) around the head instrument's runs only, so the route rows compare limbs 2 and 3 with `341da4c1` on the
same plant with the route off; `QU` and `QE2` compare with `341da4c1` run with `core.quotePath=false` in its
environment. The 12 earlier rows print what they printed before.

**Rollback.** Revert `63eadabe`, and the GITENV stand-in and the `AR-191-QUOTEPATH` dispute-line rule return at every
routing and merge. Readings: `.grugops/context/arch-build-ABC-193/notes/` and `.grugops/context/bapm-cut-AR-191/notes/`.

#### Hunk lines and spaced names no longer steer clause (b)'s line map — 2026-10-21 (`ABC-195`)

Accepted by Security/NFR at `QE-193-a`/`QE-193-b` as `AR-193-SPACEPATH` and `AR-193-HUNKHDR`
(`.grugops/context/security-nfr-QE-193/notes/…decision-5719a86d` § 1–3; owner record `…orchestrator-decision-73e94c9f`).
Commit `0dfd17b3` edits `.grugops/context/design-F-072-1/probe/clause-b.mjs` **in place**, inside `changedLines` only,
so the canonical pointer above is unchanged. Readings taken before it reproduce from that file at `63eadabe`.
- **(i) The header window.** `changedLines` reads a `---`/`+++` line, and the C-quoted test, as a header only between a
  `diff --git ` line and that file's first `@@`. So an added line whose text starts `++ ` (printed `+++ …` under `-U0`)
  or a removed one starting `-- ` is a hunk line, and no longer changes the file that later hunks count against.
  Measured: `PP-TPL` (a `++ ` template line, then a later hunk with a `process.env` read and a `fetch`) and `PP-REDIR`
  now fire limbs 2 and 3, and `PP-EDIT` (an in-place edit of a `process` read in a limb-2 holder, which § Decision 2
  counts) fires limb 2; none did before this commit. `PP-REDIR` (`++ b/src/glyph-mode.ts`) names only the real file
  (`production files changed: 1`, not 2). `RA-PLUS` (`++ "quoted" note`) raises no dispute, so `R-193-a` is gone, and
  fires on its real lines. A removed `-- ` line no longer drops its file's later `-` counts (QE's `PM`: Ruling 2 reads
  `2 - lines`, not 1).
- **(ii) The TAB.** An unquoted header path (one not starting `"`) drops one trailing TAB; a C-quoted path is left as git
  printed it. git adds the TAB only to a name holding a space, and C-quotes any name holding a real TAB, so this is
  unambiguous. A production file whose name holds a space is read like any other: `SP-N5` (a reached `src/q t.ts`
  gaining a `node:fs` import, a `process.env` read and a `fetch`) fires limbs 1, 2 and 3, Ruling 2 naming `src/q t.ts`;
  before this commit it fired none.
- **(iii) Block (i) of the `ABC-193` block, its scope stated exactly (`QE-193-c`).** Its flags and `-c
  core.quotePath=false` cover colour, an external diff, a diff driver's `command`, prefixes and quoting.
  `GIT_DIFF_OPTS` still changes what the instrument reads: it overrides `-U0`, so hunks carry context lines and the
  `+`/`−` counts rise. That can only raise a verdict. The instrument does not clear it.
- **(iv) The stand-in retires.** The Orchestrator's HUNKHDR stand-in (owner record `…73e94c9f`) **retires when this
  merges**:
  `git -c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ <base> <head> -- src | awk '/^diff --git /{h=0} /^@@/{h=1} /^(\+\+\+|---) / && (h || /\t$/)'`
- **(v) `AR-193-HUNKHDR` closes on QE's read of `PP-TPL`, `PP-EDIT`, `PP-REDIR` and `RA-PLUS`** as in `ABC-195`'s
  `A2`/`A4`, with the 20 earlier rows unchanged; **`AR-193-SPACEPATH` closes on QE's read of `SP-N5`.** The
  Orchestrator records both closes.

No limb's unit changes, and Ruling 2 is untouched. **Harness.** `r2-mutants.sh` has 25 rows. `PP-TPL`, `PP-REDIR`,
`RA-PLUS`, `PP-EDIT` and `SP-N5` are Security/NFR's plants. `341da4c1` reads them as the instrument before this commit
does (blind), so each compares limbs 2 and 3 with `341da4c1` on its twin: the same plant with the `++` as `x`, or the
same two commits with `src/q-t.ts`, read back as `src/q t.ts`, the pair ids of the `  diff` line masked. A plant check
exits 2 unless the stand-in's awk prints at least one line on each plant's diff and none on its twin's. The Ruling 2
file list splits a name at the two spaces before `(fired by Ruling 2:`. The 20 earlier rows print what they printed
before.

**Rollback.** Revert `0dfd17b3`, and the HUNKHDR stand-in and the `AR-193-SPACEPATH` trigger rule (a `src/` path
holding whitespace routes by hand as fired on every limb) return at every routing and merge. Readings:
`.grugops/context/arch-build-ABC-195/notes/` and `.grugops/context/bapm-cut-AR-193/notes/`.
