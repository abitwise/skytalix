---
id: 20260817T134600Z-ba-pm-observation-the-narrowed-a3-residue-measures-vacuous-6716ea01
kind: observation
by: ba-pm
at: 2026-08-17T13:46:00Z
verified_by:
confidence: high
refs:
  - ABC-062
  - ABC-042
  - ABC-066
  - src/cli.test.ts
  - src/cli.ts
  - .grugops/context/ticket-to-pr-ABC-062-2026-08-17/notes/20260817T133000Z-orchestrator-observation-criteria-review-at-ready-for-dev-exit-4b1e77a2.md
supersedes:
---

# `A3`'s narrowed residue measures VACUOUS — the one place the dispatch's instruction was wrong

My work order (and the parent `observation`'s gap `G-2`) said to **narrow** `A3` to its unmet residue:
the six refusal children derived at `src/cli.test.ts:954` have their stderr usage line asserted but
not that their **stdout carries zero frame rows**, "asserted at `:418`, but over a **different,
hand-listed set of four** cases". **That is right about `:418` and wrong about the tree.** I ran it.

## The static half: the six are covered by name, in three places

Of the ten children in `CHILDREN` (`src/cli.test.ts:143`), exactly four exit `0` — `npmRun`, `white`,
`black`, `random` — so the six that `:954` derives with `filter((child) => child.status !== 0)` are
`conflict`, `difficulty`, `shortFlag`, `badColour`, `bareWord`, `escape`. Every one of those six
already has `expect(frameRowsIn(child.stdout)).toEqual([])` asserted against it **by name**:

| child | asserted at |
|---|---|
| `conflict` | `:403` (`ABC-042` `A5`) |
| `difficulty`, `shortFlag`, `badColour`, `bareWord` | `:418` (`ABC-042` `A6(iii)`, the hand-listed four) |
| `escape` | `:925` (`ABC-042` security bar 3) |

The gap analysis saw `:418` and stopped; `:403` and `:925` close the other two.

## The measured half: a refusing-and-printing build is RED today

Run in a throwaway detached worktree at `/private/tmp/abc062-a3-probe` (outside the repository,
`node_modules` symlinked from the shared tree, removed afterwards; **this repo's `src/` was never
touched**). Mutant — the refusal path also writes one real frame row to stdout, inserted in
`src/cli.ts` `main()` between the stderr write and `process.exitCode`:

```
process.stdout.write("8 .r:n.b:q.k:b.n:r   \n");
```

- Baseline, unmutated: `npx vitest run src/cli.test.ts` → **36 passed (36)**.
- With the mutant: **5 failed | 31 passed (36)** — failing at `:403`, `:418`, `:925` (and `:747`,
  `:771`, `ABC-042`'s `A9` source-shape rows).

The narrowed `A3`'s own stated failure mode — *"a build that refused **and** printed a board would
pass on all six"* — is therefore **false**. Such a build reds five ways before this ticket writes a
line.

## What the residue would actually have bought, and why it is not worth a criterion

A derived-set restatement differs from the by-name coverage in exactly one respect: it would also
cover an **eleventh** refusal child added later. `ABC-062`'s own `## Out of scope` calls an eleventh
child a defect and `A6` pins `spawned` at `10`, so the criterion would guard against something the
same page forbids. That is not an unmet criterion; it is a criterion asking to be reported MET with an
empty diff — **the same shape as `A4` and `A5`, which is what this whole exit review exists to
catch.**

## Not a defect in the parent review

`G-2` was a careful reading that landed one measurement short, and the parent note is explicit that it
ran the mutants it named — it did not name this one. Recorded as the third instance of the `ABC-061`
shape and, notably, **the first caught by re-measuring a gap rather than by re-reading the tree.**
