---
id: 20261011T091155Z-qe-e2e-decision-abc114-control-and-a4-strike-5d58ace9
kind: decision
by: qe-e2e
role: qe-e2e
task: qe-ABC-114
at: 2026-10-11T09:11:55Z
verified_by:
confidence: high
refs:
  - ABC-114
  - ABC-113
  - ABC-043
  - 20261011T091155Z-qe-e2e-observation-abc114-readings-94a87a28
  - 20261011T084936Z-software-engineer-decision-abc114-a4-strike-and-the-control-7d1f3a90
supersedes:
---

# QE `ABC-114`: three rulings. The substituted control is valid. `A4` STRIKE is right. `S` → `XS`

This note is hand-authored and unsealed. The readings are in `…94a87a28`.

## 1. The substituted control (`cc037b3e^` in place of `main:`): VALID, read per row

- **The literal clause was degenerate from the cut, not since.** `cc037b3e` (`ABC-113`) is an
  ancestor of the cut commit `b03658f`. The repair is comment-only, so `main:` was always this
  instrument, executably. The SE's "byte-identical to the tip" is slightly off: `main:` matches the
  base `7411f73a`, and the tip differs by its comment lines.
- **What the clause is for** (`## Test notes`): to see the shorthand row's own status on `M9`. That
  status is invisible from this instrument, because the count row stops `vitest` first. Any control
  without the count row answers the question. `cc037b3e^` lacks it and keeps the anchored shorthand
  row, so it is a valid control. It has two confounds. It is 12 tests shorter, and it carries 2 drift
  reds (`ABC-042` `A9`, `A10`). So it must be read per row, which the SE did.
- **The cleaner control is a one-variable ablation**: the tip file with only the count `expect`
  removed. I ran it. It agrees with `cc037b3e^` row for row: `M9` reds the shorthand row, and `D3` is
  67/67 green.
- **For `A3`, `cc037b3e^:src/result-screen.test.ts` is exactly the right control.** It is the
  pre-retarget instrument, and it reads 13/13 on the delivered build with no drift.
- **For BA/PM:** amend the control clause in `A1`, `A3` and `## Test notes`. Name the ablation for
  `A1` and `cc037b3e^` for `A3`. A future hop should not re-argue this.

## 2. `A4` STRIKE: RIGHT. The scope is narrower than "in Node"

- RE-MEASURE needs BOTH reachable outcomes written from this hop's own runs. I ran 13 runs: white at
  6 timings, black at 4, and an anonymous pipe ×3. `G03` played the move in all 13. The eaten outcome
  was not observed, so RE-MEASURE could not be earned. STRIKE is the honest branch.
- One source reading, not a measurement (`UNKNOWN - verify`): `runTurnLoop` reaches
  `await input(history)` with no macrotask yield after the orphan read. A `data` event therefore may
  never find the orphan holding the slot on the current code. If that is right, "eaten" is not a
  race here at all. Nothing in the comment depends on it.
- **The scope.** The ticket's `A4`(b) wording, "for any program", is FALSE. `cat`, `wc` and `python3`
  saw end of input, and so did Node's own `fs.readFileSync(0)`. A blanket "in Node", as in the SE's
  note, is still too broad. The precise scope is Node's `process.stdin` stream. **The delivered
  comment states exactly that**: "neither the product nor a bare `process.stdin` reader in Node".
  So the comment is right and the criterion's words are not (gap `QE-114-c`, owner BA/PM).
- The kept figures (3 boards, 3 prompts, 1483 bytes; delivered 3 / 2 / 1481) reproduced in all my
  white runs. So they pass `A4`'s "reproduces 3/3" bar. They are white-specific: black reads 4 boards.

## 3. The re-size: the trigger FIRED. `S` → `XS`, for BA/PM to record

`## Size and priority` pre-registers it: "if the repair hop takes `A4`'s STRIKE branch … this ticket
is `XS`." The SE took STRIKE in `67296100`, and this hop confirms it on measurement. **The re-size is
`S` → `XS`. The priority stays `P2` by that trigger.** I have not edited the size line or the front
matter. Separately, the **`P1` promotion trigger** ("a fifth false sentence found in the same two
files") is met on my reading (`QE-114-a`). Promotion is BA/PM's call, not mine.
