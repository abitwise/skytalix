---
id: 20260820T162000Z-software-engineer-observation-abc050-a2-the-widening-catches-and-i-can-name-which-tool-and-which-does-not-9d3c04f7
kind: observation
by: software-engineer
at: 2026-08-20T16:20:00Z
verified_by: ""
confidence: high
refs:
  - ABC-050
  - vitest.config.ts
  - src/glyph-mode.nfr.test.ts
supersedes: ""
type: observation
task: ticket-to-pr-ABC-050-2026-08-20
role: software-engineer
ticket: ABC-050
created: 2026-08-20T16:20:00Z
tree: grugops/abc050-lane-runner-guard
---

# `A2` and `A5`, the two criteria that decide whether this ticket bought anything — both proved by a WRONG BUILD and a WATCHED RED, never by a green run

## `A2` — the widening CATCHES. Typecheck caught it. Lint did NOT.

**First attempt FAILED as a criterion test and is recorded rather than hidden.** The ticket's own
worked example — *"an option value of the wrong type on an existing key"* — was tried literally:
`12345` appended to the `exclude` array. `npm run typecheck` caught it (`TS2769`, *"Type 'number'
is not assignable to type 'string'"*), **but `npm test` exited 1**: vitest crashed in
`globTestFiles`. So it is **not** a defect that leaves the suite green, and it does not answer
`A2` as written. Discarded.

**Second attempt is the real one, and it is the exact class the ticket's `## Problem` §1 names —
a mistyped option key.** `pool:` misspelled as `poool:` in `vitest.config.ts`:

| command | with the defect | after revert |
|---|---|---|
| `npm test` | **exit 0, 1207/1207 passed, 40 files — FULLY GREEN** | exit 0 |
| `npm run lint` | **exit 0 — DID NOT CATCH IT** | exit 0 |
| `npm run typecheck` | **exit 2** — `vitest.config.ts(73,5): error TS2769 ... 'poool' does not exist in type 'InlineConfig'. Did you mean to write 'pool'?` | **exit 0** |
| `npm run build` | **exit 2**, identical error (same `tsc --noEmit`) | **exit 0** |

**WHICH TOOL CAUGHT IT: `npm run typecheck` (and `npm run build`, which is the same command).
`npm run lint` did not, and never will — Biome is not a type checker and an unknown key in a
config object is not a lint finding.**

This is the strongest available demonstration, not a lucky one: the defect **silently discards
`pool: "threads"`** and the lane falls back to the default pool. The suite is green, every count
is unchanged, and before this ticket **nothing in the repository would have said a word.** `A2`
is met and the widening is **not cosmetic**.

Honest limit on what `A2` establishes: the guard is a **type** guard. A defect that is type-valid
— a wrong glob string in `exclude`, `isolate: false`, a wrong number — is still caught by neither
tool. `A2` proves the class of mistyped/mistyped-key defects is now visible, not that every defect
in this file is.

## `A5` — the armed control was WATCHED RED before its green was quoted

The probe was authored **outside the repository** (agent scratchpad), mutates both ambient signals
at **module load** and never restores them, and is **NOT committed** — `git status --porcelain`
was re-checked clean of it after every run. It was copied into `src/` for the duration of a run
only and deleted immediately; it is padded so vitest's size-descending sequencer loads it first.

```
npx vitest run --no-isolate \
  --poolOptions.threads.maxThreads=1 --poolOptions.threads.minThreads=1 \
  <probe> src/glyph-mode.nfr.test.ts
```

**RED, as required:** exit 1, `Test Files 1 failed | 1 passed`, `Tests 2 failed | 2 passed` —
**`src/glyph-mode.nfr.test.ts` reports 2 failures**, which is >= 1.

```
AssertionError: ambient process.stdout.isTTY: expected true to be falsy
```

**SECOND ARMING RUN, because the first only proved ONE of the two assertion lines can fail.** The
`isTTY` assertion fires first and short-circuits the `it()`, so the *mode* assertion was never
reached — quoting the first run as proof that both lines are armed would have been the very
"green that cannot fail" this ticket is about. A copy of the test file with the `isTTY` line
removed was run against the same probe:

```
AssertionError: ambient glyph mode: expected 'unicode' to be 'ascii'   (x2)
```

**Both assertions are independently armed and both were watched RED.** Under the delivered
configuration the full suite is **GREEN, 1207/1207, exit 0** — the second half of `A5`.
