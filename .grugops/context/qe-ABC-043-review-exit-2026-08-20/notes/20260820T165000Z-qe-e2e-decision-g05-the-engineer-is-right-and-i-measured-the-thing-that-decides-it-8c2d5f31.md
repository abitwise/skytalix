---
id: 20260820T165000Z-qe-e2e-decision-g05-the-engineer-is-right-and-i-measured-the-thing-that-decides-it-8c2d5f31
kind: decision
by: qe-e2e
role: qe-e2e
task: qe-ABC-043-review-exit-2026-08-20
at: 2026-08-20T16:50:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - src/cli.ts
  - src/cli.test.ts
supersedes:
---

# `G-05`: **the ENGINEER is right and the prior QE hop's count is wrong.** It is the same RULE and a different MECHANISM, and one measurement decides it

## The disagreement, stated once

- **QE, 2026-08-19:** *"four of those five are guards that pass by being unable to look — that is one
  shape, recurring, and it is the thing to fix rather than seven separate things."* (`G-02`, `G-03`,
  `G-04`, `G-05`.)
- **The engineer, 2026-08-20:** `G-02`/`G-03`/`G-04` are one shape **and one mechanism**; `G-05` is
  the same shape and a **different mechanism** — *"a guard that was never written"* — and he
  explicitly refused to reclassify it to make the count come out at one.

**I was told not to split the difference. I am not: the engineer is right, and the prior QE reading
of `G-05` is the one that has to move.**

## The measurement that decides it — `D1b`

The engineer's claim is falsifiable in exactly one way: if `G-05` were a **blinded derivation**, then
some derivation-based guard would have been *looking at* the exit codes and failing to see them, and
removing the two rows he added would leave that guard behind. If it were an **absent guard**, removing
those two rows leaves **nothing at all**.

- **`D1`** — the two non-zero exits swapped (`USAGE_EXIT_CODE` on the catch arm,
  `INTERNAL_ERROR_EXIT_CODE` on the usage arm), `tsc --noEmit` clean:
  **RED — 1 failed / 54 passed, `ABC-043 A3`.**
- **`D1b`** — the identical mutant, with **only** these two lines deleted from `A3`:

  ```ts
  expect(child.status, "a crashed session is `EX_SOFTWARE`").toBe(70);
  expect(CHILDREN.badColour.status, "a refused command line").toBe(1);
  ```

  **GREEN — 55 passed / 55.** Nothing else in the file sees it. Not `A3`'s `not.toBe(0)`, not its
  `not.toBe(CHILDREN.badColour.status)`, not `A8`'s number transcription, not `ABC-066`'s
  refusal-derivation row, not `ABC-042`'s usage rows.

**Corroboration from history, so it does not rest on my reading of one file:**
`git show 46457b8:src/cli.test.ts` — the delivered pre-repair suite — contains **no `toBe(70)` and no
`toBe(1)` over any child's `status`** anywhere. There was no derivation to blind. There was no guard.

## And the converse half, measured too, because the engineer's claim has two halves

He also claimed `G-03` and `G-04` are **the same mutant**, closed by **one** repair (`windowOf`).
Re-planted by me at `main`:

| build | result |
|---|---|
| `D2` — hoist + `as` cast (`G-04`) | **RED on `A1` and `G6`** |
| `D3` — hoist + `void options.input(…)` (`G-03`) | **RED on 7 rows, `A1` and `G6` among them** |

Both mutants require the **same hoist**, both die on the **same** `windowOf` throw, and no assertion
was written for `G-03` beyond the clause that reuses that window. **One repair, two mutants —
reproduced.**

## The adjudication

**One rule — *a derivation must prove it preserved the evidence, or the guard must assert over the
evidence itself*. Two mechanisms — three guards that derived a view and lost the evidence, and one
guard that did not exist.** The engineer's count is the accurate one and his refusal to collapse it
was correct: calling an absent guard a blinded one would have hidden the only gap in the set that a
`withoutStringText`/`windowOf`-shaped repair could never have closed.

**This costs the prior QE hop nothing it should mind.** Its find was right, its severities were right,
all five survivors are dead, and the shape it named is real. What it got wrong is a **taxonomy**, and
the engineer caught it with a measurement rather than an argument — which is the behaviour this
project has been paying to install.
