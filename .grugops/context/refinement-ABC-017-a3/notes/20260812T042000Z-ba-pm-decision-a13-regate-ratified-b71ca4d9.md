---
id: 20260812T042000Z-ba-pm-decision-a13-regate-ratified-b71ca4d9
kind: decision
by: ba-pm
at: 2026-08-12T04:20:00Z
verified_by:
confidence: high
refs:
  - refinement-ABC-017-a3
  - ABC-017
  - ABC-016
  - ABC-019
  - ABC-027
  - ADR-0009
  - src/frame.test.ts
  - 20260812T010200Z-software-engineer-decision-5a70c3be
supersedes:
---

# `A13`'s deferral is RATIFIED, and its trigger has already fired — `ABC-016` merged and `main` moved

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`.**

## The disposition is right, and it was reproduced rather than accepted

With `src/status-panel.ts` absent, adding the import produces, run at this hop:

```
src/frame.test.ts(61,29): error TS2307: Cannot find module './status-panel.ts' or its corresponding type declarations.
```

`typecheck` is project-wide `tsc --noEmit` under `gate_enforcement: blocking`, so this reds the whole
project's gate — **the exact cost `ADR-0009`'s `## Context` measured and refused to pay.** The
Engineer left the shadow and flagged it. **Correct, and ratified.** It is a re-gate obligation, not a
gap, exactly as the Orchestrator routed it.

## But the premise the brief and the notes rest on is now STALE

- **`main` is `505216c`**, not `98c8a8d`.
- **`ABC-016` merged at `149d643`** — *"grug merge ABC-016, first of four"*. `src/status-panel.ts`
  exists on `main` and exports `STATUS_ROWS = 3`.
- **This branch is rebased onto `98c8a8d`**, which was `main` when the build hop ran. `git merge-base
  HEAD main` is `98c8a8d`; `main` has 19 commits past it.
- **`ABC-027` has NOT landed** — `git log 98c8a8d..main -- src/frame.ts` is empty.
- The re-gate figure **697/697 on 24 files is against the OLD `main`** and was re-verified at this hop
  on this worktree. Against current `main` the tree is 26 test files.

**So `A13` is satisfiable in full today.** It is no longer a future obligation waiting on a merge.

## Both owed edits applied out of tree against merged `ABC-016`, and gated

1. `const STATUS_ROWS = 3` → `import { STATUS_ROWS } from "./status-panel.ts"`.
2. **`statusStub` sized from `STATUS_ROWS`** instead of returning a hardcoded three-element array.

> **`tsc --noEmit` clean. 732 / 732 on 26 files.** Neither edit conflicts.

## Edit 2 is load-bearing, and "the trap" is measured rather than rhetorical

On `M1` (status ships 4):

| | failures | what the FIRST failure says |
|---|---|---|
| **both edits applied** | **4** | `expect(HEIGHT).toBe(23)` — *"expected 24 to be 23"*. `A13`'s tripwire, naming the right quantity |
| **edit 1 only, `statusStub` left hardcoded** | **15** | `expect([...counts]).toEqual([HEIGHT])` — *"expected [23] to deeply equal [24]"*, then a cascade about frame row counts, screen contents and the sanitizer |

**Doing edit 1 without edit 2 turns a four-line diagnosis of a panel's row count into a fifteen-failure
cascade naming the wrong subsystem.** The Engineer predicted this from reading and declined to split
the two across hops; the prediction is confirmed. **They are one change and must land together.**

## Where the obligation is recorded, and why that was not yet enough

It was in a docblock at the constant's own site in `src/frame.test.ts` and in two context notes. **A
docblock is only read by someone who has already decided to open that file, and nothing fails to send
them there** — the shadow `STATUS_ROWS = 3` compiles and equals the real value, so a rebase is green
and silent. **The ticket is what a rebase hop reads**, and it did not say `A13` was met in part.

**Now recorded on the ticket**, at `A13`'s own site: the met-in-part status, the ratified reason, the
fired trigger, both edits, the gate figures and the `M1` table. The `ABC-016` dependency line's
future-tense sentence is corrected at its site too.

## Not decided here

**Merge order, the rebase itself, and whether `A13` is re-homed are the Orchestrator's.** This note
establishes that the work is available, small, and measured — not that it should happen now.
`ADR-0009` and `ADR-0010` were not re-opened; `ABC-016`, `ABC-019` and `ABC-027` were not edited.
