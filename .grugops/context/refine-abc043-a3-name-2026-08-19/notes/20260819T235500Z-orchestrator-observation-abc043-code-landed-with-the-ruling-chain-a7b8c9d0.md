---
id: 20260819T235500Z-orchestrator-observation-abc043-code-landed-with-the-ruling-chain-a7b8c9d0
kind: observation
by: orchestrator
at: 2026-08-19T23:55:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ADR-0015
  - src/cli.test.ts
supersedes:
---

# `ABC-043`'s code is on `main`, and it carries a rig `ADR-0015` refuses. My doing, stated plainly.

## What happened

The branch chain was `delivery → QE → design-rig-licence`. Merging the **ruling** therefore merged
the **delivery** underneath it. Measured on `main` at `9567243`:

- `src/cli.ts` and `src/cli.test.ts` are in the tree; the game plays (`1. e4 Nc6`, exit 0).
- `src/cli.test.ts:369-372` still substitutes `"command-input.ts"` in the `parserBug` child — **the
  exact substitution `ADR-0015` refuses**, merged in the same commit as the ADR that refuses it.

**I should have anticipated this when I stacked the ruling on the QE branch, and I did not.** The
same chain shape merged `ABC-078` and `ABC-037` cleanly, so I stopped checking.

## Why I am NOT reverting

1. **The refused rig is a TEST, not product behaviour.** No production line depends on it; `src/cli.ts`
   exports 0 and the seven merged modules are byte-identical. **There is no product defect on `main`.**
2. **Reverting would also revert `ADR-0015`, `ADR-0014` context, QE's five notes and the ruling that
   makes the repair possible** — that is a worse state, not a better one.
3. **The repair is already dispositioned** by the ruling itself, and it is small: `ADR-0015` found
   that `createLineInputSeam` **is** passed as `input:` at `src/cli.ts:155`, so a double returning an
   `InputSeam` that throws passes the new fence, costs one spawn, and matches `A3`'s own Given
   (*"an `InputSeam` that throws"*) **more literally than the rig that shipped**.

## What is therefore TRUE and must not be smoothed

- **`ABC-043` is NOT `Done` and NOT accepted.** It stays `In Review`. Its code being on `main` does
  not advance it one column.
- **`A3` is currently asserted by a refused instrument.** Its *behaviour* is right — QE ran the child
  by hand — but its instrument is out of contract until repaired.
- **`G-02`–`G-05` are open**: an interpolation-blind row-count guard, a third orphaning shape that
  **hangs on live stdin**, a vacuous `A1` window, and an exit-code rule stated in three places and
  asserted in none.

## The one open question, and it is bounded

`ADR-0015` **found no structural obstacle** to rebuilding `A3` on the `line-input` throwing seam and
**deliberately did not lift BA/PM's name-refusal of `./line-input.ts`** — lifting a name to unblock a
ticket is what two roles already correctly declined. So: **does BA/PM's refusal, written for `A2`/`A5`
where the reader is load-bearing, extend to `A3`, whose subject is the entry point's handler and whose
reader is merely the instrument?**

All three branches are pre-dispositioned so nothing deadlocks: name lifted → rebuild, `G-01` closes;
name extends → BA/PM re-scopes or moves it opt-in; **no answer → default: `A3` left unbuilt and
recorded as a named uncovered anti-property.** Under all three the `parserBug` child comes out.
