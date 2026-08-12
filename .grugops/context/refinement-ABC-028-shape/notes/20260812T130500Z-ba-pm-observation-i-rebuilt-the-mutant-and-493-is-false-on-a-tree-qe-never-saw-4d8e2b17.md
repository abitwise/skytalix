---
id: 20260812T130500Z-ba-pm-observation-i-rebuilt-the-mutant-and-493-is-false-on-a-tree-qe-never-saw-4d8e2b17
kind: observation
by: ba-pm
at: 2026-08-12T13:05:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A4
  - ABC-017-A9
  - ABC-016
  - src/history-pane.test.ts
  - src/history-pane.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# I rebuilt the mutant rather than transcribing the number — `:493` is FALSE on a tree QE never saw, and the mechanism is the finding: **an exhaustiveness claim is invisible to every instrument that reads text**

> **Hand-authored, no stamp.** Every cell below was RUN on my own lane, built from scratch and pinned
> by md5 to this tip. **Nothing was landed:** `src/history-pane.test.ts` is `9533f050…` at the start
> and the end of this hop, all three digests are unmoved, and `git diff -- src/` is **EMPTY**. The
> mutant existed only out of tree, under a fresh uniquely-named scratchpad root.

## Why I re-measured something QE had already measured

`## Test notes` 4 says re-measure before writing a number, and `## Test notes` 14 says name no
instrument you have not run. **I was about to route work into `src/` on the strength of a number
somebody else took.** So I wrote my own lane builder (`artifacts/mk.mjs`), my own mutant
(`artifacts/wpos-check.mjs`), and a **null control**, and ran both.

**I did not run QE's harness.** Its `lane.mjs` expects a `pristine/` tree beside itself and would have
written lanes into the context `artifacts/` directory. Mine copies from the worktree, symlinks
`node_modules`, and lives entirely in a fresh scratchpad root — the shared-scratchpad hazard two hops
have now reported.

## The measurement

```
NULL CONTROL (no mutant)   0 failed / 807 on 28 files    <- the lane is calibrated, not blind
WPOS                       2 failed / 807 on 28 files
  FAIL  A9 — neither render touches the caller's position, its move count or its ANCHOR
  FAIL  A4 — no write reaches the caller's graph during a render, at all ten lengths
```

Pins verified before measuring — `src/history-pane.ts` `c4653c4c…`, `src/history-pane.test.ts`
`9533f050…`, `src/history-pane.nfr.test.ts` `16bf2f50…` — and the rig throws rather than measuring a
tree that does not match.

**QE measured the same two catchers at `755` on a tree without `ABC-019`'s turn loop; I measured them
at `807` on one with it. The same two kills on two different trees is a stronger result than either
alone:** the sentence is false about the **tree**, not about a **tip**.

## What is false, and the two halves fail differently

`src/history-pane.test.ts:493`, inside the `A9` doc comment (`:486-500`), present tense, and the
stated reason `buildAllCases()` is called inside each test:

> *"Measured: `WPOS` … **passes 732/732 on 26 files** against the shared fixtures, **with zero
> catchers anywhere in the project**, and fails here."*

- **The denominator is STALE** — `732/732 on 26 files` against `807` on `28`.
- ***"with zero catchers anywhere in the project"* is FALSE** — `ABC-028`'s own `A4`
  (`describe("ABC-028 acceptance")` at `:766`, the `it` at `:946`) kills it too. The sentence was
  written at `0b508a2` on 2026-08-11; `8de988d` added `A4` on 2026-08-12, **in the same file, one day
  later.**

**It is not a code defect and no criterion is unmet.** `A9` is correct, `A4` is correct, and the extra
catcher makes the tree **stronger** than the comment says. The defect is entirely in the record — and
it errs in the safe direction, which is why nobody noticed.

## THE MECHANISM, and it is worth more than the fix — it bounds what any future control can do

The defect shape splits in two, and only one half is reachable by anything that reads TEXT:

| half | example | how it is detected |
|---|---|---|
| a claim that **CITES** — a count, a total, a line number | *"all 13 tests there"*, *"752/752"*, *"`history.ts:152`"* | **mechanically, from the tree** — resolve it, count it, run it. QE's `shapehunt` does exactly this and works |
| a claim that **QUANTIFIES** — a negative over the whole project | *"with zero catchers anywhere in the project"* | **only by CONSTRUCTING THE COUNTEREXAMPLE.** There is nothing in the text to resolve; the sentence is about builds that do not exist yet |

**`:493` is the second kind. That is why three hops walked past it:**

- it contains **none of the four banned strings**, so candidate control **(a)** — the comment-content
  guard — would not have fired;
- it cites **no line and no count**, so QE's `shapehunt` — the instrument that found the other four —
  **would not have fired either, and did not: `:493` was found by the mutant, not by the census**;
- it says nothing about fixture scope, so candidate control **(b)** — the structural guard — is
  orthogonal to it.

**THE BOUND: no control that reads source TEXT can catch an exhaustiveness claim going stale, because
the fact that falsifies it is not in the text.** A mutation campaign catches it, at one mutant per
claim. Nothing cheaper does. **This does not argue against buying (a) or (b); it prices what they can
and cannot buy** — which is the *"refuse with the number attached"* that `F4` asks for.

**The one free disposition is a WRITING rule and is labelled as one:** a comment justifying a test's
structure should state the **mechanism** that makes the structure necessary, never a **census of the
rest of the project**. `:493`'s real content — *a snapshot over an already-rendered module-scope
singleton is blind to a once-per-object corruption* — is true of the code in front of the reader and
cannot be falsified by anyone's commit. **Nothing enforces this; it is a convention exactly like the
one `F4` demoted, and no later hop may cite it as a guard.**

## What I did NOT do

- **I did not repair it.** `src/` is fenced for BA/PM. It is routed to the Engineer as `## Test notes`
  15 with obligations and a four-line done-condition.
- **I did not mint an `A6`.** A criterion of the form *"the comment says only what is true"* is a
  one-time verdict wearing a standing tense — this page has already ruled that twice. Minting it would
  knowingly rebuild the object `F4` demoted.
- **I did not refresh the total to `807`.** That buys one hop of accuracy and re-arms the same defect.
