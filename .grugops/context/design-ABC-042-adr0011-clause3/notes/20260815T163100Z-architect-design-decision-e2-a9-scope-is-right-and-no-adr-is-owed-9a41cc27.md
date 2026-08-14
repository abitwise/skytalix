---
id: 20260815T163100Z-architect-design-decision-e2-a9-scope-is-right-and-no-adr-is-owed-9a41cc27
kind: decision
by: architect-design
at: 2026-08-15T16:31:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - E2
  - A9
  - ADR-0011
  - R3
  - src/cli.ts
  - src/cli.test.ts
  - src/glyph-mode.ts
supersedes: 
---

# `E2` RULED — `A9`'s scope IS right and must NOT be widened. The rule it tests is whole-tree in intent, its instrument is not, and that gap is LOW, latent, owned and dated. No ADR.

> **Hand-authored `decision`.** `src/cli.test.ts` is the concurrent hop's file and was **not opened for
> writing**; everything below is read-only or a reading of the ticket page.

## The ruling, in three parts

> **1. `A9`'s scope — the two NEW production modules — is CORRECT as delivered, and widening it on
> `ABC-042` would be a defect, not a strengthening.**
>
> **2. The rule `A9` tests is whole-tree in intent and its instrument reaches two files. That is a real
> under-implementation. It is LOW and NOT LIVE.**
>
> **3. No ADR is owed. Owner: Architect/Design. Trigger: the first MERGED production module that
> acquires `process.argv`, or `process.stdout`/`process.stderr` as a writable handle. When it fires the
> instrument belongs to the ticket that adds that module, widened to the tree — never retro-fitted to a
> closed `ABC-042`.**

## Why the scope is right — measured, not argued

`A9` reads over *"the new PRODUCTION modules"*. A whole-tree textual reading is **false against merged
code**, at three sites read at this hop over all 20 production modules:

| site | what it is |
|---|---|
| `src/glyph-mode.ts:117` | `Boolean(process.stdout.isTTY)` — a genuine **read of an ambient signal**, the one merged exception `A9`'s parenthetical already names |
| `src/frame.ts:21,25,209` | `process.env` / `process.stdout` / `process.stdout.columns` **in docblocks only**, three of them saying the module never reaches for it |
| `src/turn-loop.ts:151` | `process.stdout` **in a docblock**, describing what satisfies a sink |

So a tree-wide occurrence test reds on a correct tree in three places, two of them on comments that exist
to state the rule `A9` enforces. **This is the same defect class the ticket already repaired twice**
(`RF-9`/`Q5`, bar 1b counting occurrences instead of call sites; and the `process.execPath` reading that
forced `A9`'s scope in the first place). Widening `A9` would re-introduce it, and would also breach `A12`.

## Why it is not live

**`process.argv` occurs in exactly ONE production module — `src/cli.ts` — and in zero merged ones**
(read at this hop over all 20; the fix hop reported the same and it reproduces). There is no file for a
tree-wide guard to catch. **Building one would mean either writing a guard with no subject, or adding a
production module no ticket asked for** — which is, word for word, the reason `ADR-0011` clause 1's own
instrument gap (`R3`) was DEFERRED rather than fixed: *"There is no file for the fix to catch, and
building one would mean adding a production module no ticket asked for."*

**`E2` is `R3`'s shape exactly**: a rule stated whole-tree, an instrument that reaches less than the
rule, latent, pre-existing, no live instance, owner and trigger named. I am ruling it the same way the
file already rules that shape, which is the point of having the precedent.

## Why NO ADR — the reason, not a shrug

| candidate | why not |
|---|---|
| put `E2` in `ADR-0011` | **off-subject.** `ADR-0011` rules what a production module IS and who may import `src/history.ts`. `A9` borrows only its **file-set expression** (clause 1). The handle rule is not this ADR's property and smuggling it into an amendment I am writing for another reason would be the worst kind of convenience |
| a new `ADR-0012` for the process-handle boundary | **refused twice already on evidence, and nothing has changed to reverse it.** The architecture audit ruled the `process.stdout` twin *"does not need an ADR … writing it a fourth time would be ceremony"*, and my own `design-ABC-042-stderr` hop refused it for `process.stderr` as *"a restatement of what merged code already does"*. Since then the rule has acquired a **first enforcer** (`A9`, in `src/cli.test.ts`, which stays in the tree after the ticket closes) and a **stated home** (`src/cli.ts`'s docblock, THE TWO HANDLES). A rule that just gained an enforcer and a home needs **less** ceremony, not more |
| widen `A9` on `ABC-042` | ruled against above: measurably false against merged code, and `A12` bars the diff anyway |

## What I am NOT claiming, so this is not read as more than it is

- **`E3` is untouched and stays with Security/NFR.** `A9`(2) is asserted **entirely textually**; a second
  read introduced at runtime — a loader, a `--require` hook, a dependency — is invisible to the row and
  to any widening of its scope. Widening `A9` to the tree would not close `E3`, and nothing here says it
  would.
- **This note is a weaker home than a register row**, and I say so rather than pretend otherwise. I judged
  it sufficient because there is no live instance, no instrument to write, and no clause to hang it on —
  and because inventing an ADR to give a trigger somewhere to live is exactly the ceremony this project
  has twice declined. If the trigger fires, it fires on a ticket, and the ticket is where it will be seen.
