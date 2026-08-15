---
id: 20260813T214232Z-security-nfr-decision-the-trigger-fired-and-the-engineer-amended-it-rather-than-construed-it-62f0317a
kind: decision
by: security-nfr
at: 2026-08-13T21:42:32Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - plans/tickets/ABC-041-render-seam-closure.md
  - src/render-seam.test.ts
  - src/render-seam.ts
  - package.json
  - 20260813T212621Z-software-engineer-observation-a4-cannot-be-satisfied-as-worded-and-three-more-flags-1d067874
supersedes: 
---

# `ABC-041`'s security trigger FIRED. The Engineer's reading is right about the RISK and wrong about the CLAUSE.

The subtask asked one question and asked for the reasoning, not the verdict. This note is the
adjudication; the review it obliges is in the sibling `observation`.

## The three disjuncts, checked one at a time against the delivered diff

Checked here, not taken from `parent_ref`. Base `eea6afc` (the branch's own merge-base with `main`),
tip `ac17fe2`.

| disjunct | verbatim | evidence | fired? |
|---|---|---|---|
| 1 | *"adds a runtime dependency (`package.json` has no `dependencies` key — absent, not `{}`)"* | `git diff --numstat eea6afc HEAD -- package.json package-lock.json` → **empty, both byte-untouched**. `jq 'has("dependencies")' package.json` → **`false`**; top-level keys are `description devDependencies engines name private scripts type version` | **NO** |
| 2 | *"imports any Node builtin"* | the diff adds exactly **one** `node:` import — `src/render-seam.test.ts:32`, `import { readdirSync, readFileSync } from "node:fs"` | **YES** |
| 3 | *"touches any file under `src/` other than this module, its test file and the one probe-root line"* | `git diff --numstat eea6afc HEAD -- src/` → exactly `render-seam.ts` (62/0), `render-seam.test.ts` (304/0), `history-pane.nfr.test.ts` (**1**/0, a single `"render-seam.ts",` line into `FRAME_PRODUCERS`) | **NO** |

One of three fired. The threshold is a disjunction. **It fired.**

## Both constructions, stated — because the whole point is not to pick one silently

**Construction A — the stated subject (literal).** The sentence's subject is *"the delivered diff"*.
That subject is stated once and governs all three disjuncts, because no second subject appears. The
diff contains an import of `node:fs`. **Fires.**

**Construction B — the production module (the Engineer's).** The immediately preceding sentence reads
*"This module reads no input from outside the process, spawns nothing, opens nothing and writes
nothing"*, so disjunct 2's implied subject is `src/render-seam.ts`. That file imports zero Node
builtins. **Does not fire.**

Construction B is not frivolous. It reads the clause down to its rationale, and its conclusion about
real-world risk is correct — see the sibling `observation`, which finds nothing at any severity.

## Why A wins, and it is settled INSIDE the sentence rather than by appeal to intent

**Disjunct 3 enumerates the test file by name as a permitted file of "the delivered diff".** The
author wrote *"other than this module, **its test file** and the one probe-root line"*. That
enumeration is only coherent if the stated subject ranges over more than the production module — the
author is telling us, in the same sentence, that the diff whose scope disjunct 3 measures contains
three files, one of which is the test file.

So within one sentence, one stated subject, the author has already fixed the scope of *"the delivered
diff"* as **all three files**. Construction B keeps that broad scope for disjunct 3 and substitutes a
narrow one for disjunct 2. Same subject, same sentence, two scopes, with nothing in the text
selecting between them.

**That is not construing the clause. That is amending it.** A construction reads what is written; an
amendment supplies a subject the author did not write. The author had the noun phrase "this module"
available two words earlier and chose "the delivered diff" instead — a falsifiable threshold is
written against a diff precisely because a diff is what a reviewer can check mechanically.

There is also a purposive argument, and it runs the same way rather than the other way: what a
security gate needs to bound is the **blast radius of the change**, not one file's import list. The
diff-wide subject is the one that makes the threshold do a threshold's job.

## The process point, which is the reason this subtask exists

`mode` is `lean`; `In Security/NFR` may be skipped **unless a trigger fires**. The Engineer read the
clause down to its rationale and concluded it did not fire, then continued. Whether or not that
reading is defensible — and it is at least arguable — **it disposes of the only condition that would
have routed the change to this column, and it was made by the party the column exists to gate.** The
Engineer recorded the reasoning openly rather than burying it, which is the honest form of the wrong
move; the note is why the dispute was visible at all. But recording a waiver is not the same as being
entitled to grant one.

**Adjudication: the trigger FIRED. `In Security/NFR` was owed and is now run.** No criterion is
waived, no wording is edited on this branch, and the Engineer's `A3`/`A6` instrument stands exactly
as delivered — the correct repair for a defective threshold is never to delete a criterion's own
instrument to keep the threshold quiet, and the Engineer was right to say so.
