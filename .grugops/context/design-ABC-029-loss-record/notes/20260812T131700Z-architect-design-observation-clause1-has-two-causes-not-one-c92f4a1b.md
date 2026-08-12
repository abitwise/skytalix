---
id: 20260812T131700Z-architect-design-observation-clause1-has-two-causes-not-one-c92f4a1b
kind: observation
by: architect-design
at: 2026-08-12T13:17:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ADR-0002
  - ADR-0011
  - EPIC-006
  - src/history-pane.nfr.test.ts
supersedes:
---

# Clause 1's gap has TWO independent causes, not the one the record names — so the fix is two changes, not one flag

> **`kind: observation`, not `finding`** — no `§14-gate` verdict record under this task,
> `human_admission` **`off`**. Every verdict is a real instrument run.

## The record's account, and what it misses

QE handed this on as: *"Clause 1 says **under `src/`** but the instrument uses a non-recursive
`readdirSync`. Pre-existing … either the clause means top-level and should say so, or the instrument
is wrong."* **That names one of two causes.** Measured:

| cause | measurement |
|---|---|
| **1. the enumeration** — `readdirSync(directory)` is non-recursive | on today's flat tree, `readdirSync(dir)` and `readdirSync(dir, { recursive: true })` return the **identical 16-file production set**. With `src/engine/probe-victim.ts` added, only the recursive form returns it (`engine/probe-victim.ts`) |
| **2. the SPECIFIER is DEPTH-FIXED** — the pattern requires the literal `"./history.ts"` | `"../history.ts"` is matched by **neither** the delivered expression **nor** the widened one. A subdirectory module imports its parent as `../history.ts` |

**So making the enumeration recursive changes nothing on its own.** Confirmed by real instrument runs
rather than by reading the regex:

| build | delivered | widened | **recursive + widened** |
|---|---|---|---|
| `WSUBDIR` — `src/engine/probe-victim.ts` with a **static** `import { newGame } from "../history.ts";`, off the frame path | regex green | regex green | **regex green** |
| `WSUBDIR-ONFRAME` — the same file, imported by `render.ts` (a declared frame producer) | **probe RED** | **probe RED** | **probe RED** |

**The probe backstops it whenever the subdirectory module is on the frame path**, under all three
variants — which is what QE measured and it holds.

## The ruling

**The CLAUSE is right; the INSTRUMENT under-implements it. The wording does NOT move.**

*"Under `src/`"* is what the property needs: `ADR-0002` clause 4 is a **whole-tree** invariant, so a
module in `src/engine/` that imports `history.ts` **is** a runtime importer and must be inside clause
3's reach. Narrowing the clause to *"directly in `src/`"* would **write the hole into the ADR**.
Amending a rule to match what shipped is the defect this project keeps refusing, and it is refused
here.

**DEFERRED, as a decision with a reason and not as an omission.** It is **latent and pre-existing** —
green under the delivered instrument too, so `ABC-029` did not cause it — and `src/` is flat for
`.ts` today (its only subdirectory, `__snapshots__`, holds none). There is **no file for the fix to
catch**, and constructing one means adding a production module no ticket asked for. The fix is
**two** changes rather than one flag, so the record's implied cost was low.

**Owner: Architect/Design. Trigger: the first `.ts` file added under a subdirectory of `src/`.**
`EPIC-006`'s entry point may well be that file, so **the trigger is checked THERE and is not deferred
to it** — this is not an `EPIC-006` expiry like clause 2's.

## Why this is not trimmed to avoid a hop

The Engineer hop this ruling schedules is for the **containment**, which is measured, cheap and closes
a real breach of clause 3. Bundling a depth-aware specifier into it would mean **shipping a guard
change with no build that can exercise it** — the widened forms all have named RED witnesses on the
tree, and a depth-aware specifier would have none. **I would rather the Engineer land a change every
row of which has a witness.** If the Orchestrator judges otherwise, the change is small and the
trigger is stated; it is a scheduling call and I am naming it rather than hiding it.
