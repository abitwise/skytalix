---
id: 20260818T203000Z-software-engineer-decision-g3-the-guard-is-the-argument-not-the-count-2e7b3355
kind: decision
by: software-engineer
at: 2026-08-18T20:30:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - NFR-003
  - N8-LANE
  - src/move-input.ts
  - src/move-input.test.ts
  - src/san.ts
  - src/legal.ts
supersedes:
---

# `G3`: `A5`'s guard now bites, and it bites on the ARGUMENT because the count structurally cannot

`toSan` is now a member of `MoveInputDeps` and `ambiguous()` renders through `deps.toSan`. That is
the whole production change for `G3`; the seam already existed and its own doc comment already said
it exists so `A5`'s cost can be spied.

**Why the count could never have been the guard.** `toSan(position, move, legal)` falls back to
`legal ?? legalMoves(position)` (`src/san.ts:78`) and imports `legalMoves` **directly** from
`./legal.ts`, outside the seam. So a build that drops the third argument re-derives the prompt
position once per candidate — QE measured 1 → 3 for two knights and 6 → 12 for six queens — while a
spy watching `deps.legalMoves` reports `1`, because nothing called `deps.legalMoves`. Adding a
second assertion on the same counter would have changed nothing. The observable that distinguishes
the two builds is **which array `toSan` was handed**, and it was not observable at all until now.

The new guard therefore asserts, on three ambiguities (two knights, the folded `BXC4`, and six
queens): one render per candidate, and every render received `seam.legal` **by reference**
(`toBe`, not `toEqual` — a freshly generated copy holding the same moves would pass `toEqual`, which
is precisely the build being guarded against).

**M11 now reds 3 tests.**

## The false comment, replaced with the real cost — this is the part that outlives the mutant

The block carried *"Every attempt is handed the ONE array, so no resolver derives its own either."*
**That was false**, and QE is right that fixing the guard without fixing the words would leave the
more expensive error in place. `toSan` **does** derive its own: for the `+`/`#` suffix it generates
the legal moves of the position **after** each checking candidate (`src/san.ts:105`).

The honest statement, now in the test block, in the module header, and on the ticket page:

- `legalMoves` is called **exactly once on the PROMPT POSITION** per submitted line. `A5` says this
  and `A5` holds as written — the surplus derives are of *other* positions.
- A prompt costs **`1 + O(candidates)`** derives in total. Six queens on `d4` measured **6**.
- **Do not quote "one derive per prompt" as a cost bound for an ambiguity** — for `NFR-003` or
  `N8-LANE` or anything else. That is the number that does not hold, and it is the reason this
  paragraph exists rather than a corrected sentence.

**I did not change the baseline cost.** QE called it defensible and did not ask for it; the brief
explicitly did not ask for it; and touching `src/san.ts` is outside `A7` in any case. `A5`'s guard
was asked to bite, and it bites.
