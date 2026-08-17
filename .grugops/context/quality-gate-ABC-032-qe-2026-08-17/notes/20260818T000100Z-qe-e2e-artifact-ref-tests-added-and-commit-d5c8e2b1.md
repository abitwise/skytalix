---
id: 20260818T000100Z-qe-e2e-artifact-ref-tests-added-and-commit-d5c8e2b1
kind: artifact-ref
by: qe-e2e
at: 2026-08-18T00:01:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - A7
  - src/san.parse.test.ts
supersedes:
---

# What this hop produced: one commit, eight rows, zero production lines

- **branch:** `qe-abc032-work`, branched from `grugops/abc032-parse-san` @ `da69986` (see the gate
  note for why the delivery branch itself could not be checked out).
- **commit:** `9490b62` — `test(san): grug break parse with mutants, and grug close five holes`.
- **files changed:** `src/san.parse.test.ts` only. **`git diff --name-only … | grep -v '\.test\.ts$' | grep '^src/'`
  is empty** — zero production lines, and no new test FILE, so the lane cost of this hop is nil.
- **suite:** 957 → **965** tests, 33 files unchanged, skip 0.

## The eight rows, and what each one kills

Under `describe("QE — mutants that survived the delivered suite")` in `src/san.parse.test.ts`:

| row | the surviving mutant it kills |
|---|---|
| `A7` gap: no hand-spelled piece-letter CHARACTER CLASS | `PIECE_MOVE` re-spelled `/^([NBRQK])…/` |
| `A7` gap: the castle strings are spelled on exactly one line of code | castle branch re-spelled `/^O-O(-O)?$/` |
| the capture marker must AGREE on the piece path | `(move.captured !== EMPTY) === (capture === "x")` deleted |
| a pawn's capture form must AGREE, in both directions | `(move.captured !== EMPTY) === (originFile !== undefined)` deleted |
| surrounding whitespace is trimmed | `text.trim()` removed |
| accepts a REDUNDANT qualifier (characterization) | — pins `G5` |
| accepts MIXED castle spellings (characterization) | — pins `G6`; also kills the `0-0`-tolerance mutant |
| codes `e8=K` as `no-such-move` (characterization) | — pins `G7` |

Each of the first five was confirmed **RED against its mutant and GREEN after the revert**. The
three characterization rows assert current behaviour and say so in their comments; they exist so
that a ruling by BA/PM has something written down to rule on, and they will need editing if that
ruling goes the other way. That is intended, and it is cheaper than the behaviour being discovered
by a player.

## Not done by this hop, deliberately

`plans/board.md` (the Orchestrator's), the `ABC-032` ticket page (BA/PM's), `.grugops/test-skips.md`
(the human's), `src/san.ts` and every other production file, `src/san.nfr.test.ts`,
`src/san.qualifier.hardening.test.ts`, `src/san.suffix.hardening.test.ts` (`A6`'s fences), the merge,
and `main`.
