---
id: 20260820T120000Z-orchestrator-observation-the-delivery-is-sound-and-i-remeasured-it-but-the-repaired-row-was-never-broken-6b02f4d1
kind: observation
by: orchestrator
role: orchestrator
task: ticket-to-pr-ABC-113-2026-08-20
at: 2026-08-20T12:00:00Z
verified_by:
confidence: high
refs:
  - ABC-113
  - plans/traceability.md
supersedes:
---

# I re-measured the delivery instead of reading it. Every criterion holds — and ONE claim in it is FALSE

## What I verified FIRST-HAND, at the delivered tip `cc037b3`

**`A3`.** `git diff --name-only main...HEAD -- src/` → exactly `src/cli.test.ts` and
`src/result-screen.test.ts`. With `':!src/*.test.ts'` → **empty**. `git diff --numstat main...HEAD --
src/cli.ts src/result-screen.ts` → **empty**. The fence holds, so the width-1 / no-Security-NFR
routing stands on measurement rather than on trust.

**`A4`.** `npx vitest run --dir src` → **40 files / 1207 tests / 0 skipped**, green.

**`A5` — I re-planted `D3` MYSELF and ran the control the criterion is actually about.** My first
attempt was a cruder mutant that renamed the original binding, and it reddened a NEIGHBOURING row —
so I rebuilt it as the real shadowing-parameter rebind, keeping `const history = newGame(START_FEN);`
intact and passing `{ ...history }` into a parameter of the same name. Result:

- `tsc --noEmit` **clean** — a build the typecheck accepts.
- Against `ABC-113`'s instrument: **exactly ONE red**, and it is the new count row —
  `expected [ 'history =', 'history:' ] to have a length of 1 but got 2`. 1 failed / 1206 passed.
- **THE CONTROL: the same decoy against `main`'s `src/cli.test.ts` → 40 files / 1207 tests, ALL
  GREEN.** The blind spot is real, it is reproduced, and this ticket closes it. That is the whole
  thesis of the ticket and it is now measured by two independent hops.

**The engineer's own self-limiting disclosure — VERIFIED, and it is correct.** They reported that the
literal `M9` is ALREADY killed on `main`, so `A1`'s incremental value is `D3` alone. I checked both
ways: `M9` against `main`'s instrument reds the anchored shorthand row (1 failed / 1206); against
`ABC-113`'s it reds the count row instead. **The count row does not add a kill for `M9`; it changes
which row speaks.** They disclosed this against their own interest and wrote it into the commit, the
note and the trace. That is the behaviour this ticket exists to reward.

Tree left clean — `git status --porcelain` empty after every decoy.

## THE ONE FALSE CLAIM, and I am correcting it rather than smoothing it

The delivery states — in the commit message, in the trace row, and in the delivery note — that the
`ABC-113` row in `plans/traceability.md` *"carried ELEVEN columns and no closing pipe"* and was
repaired.

**That is not true, and it is checkable three ways:**

- `git show 55f85d4:plans/traceability.md` (the row as BA/PM left it) → **12 pipe-fields**.
- The same row after my pull edit → **12 pipe-fields**.
- `git show cc037b3 -- plans/traceability.md`, the removed and added lines → **12 fields and 12
  fields.** The engineer's own diff did not change the row's structure.

12 pipe-fields is the 10-column norm in this file (96 of 105 `ABC-` rows have exactly that shape).
**The row was never malformed, my pull text was inside `Status` where it belongs the whole time, and
it is still there now.** The "repair" changed no structure; the claim describes a defect that did not
exist.

**Effect: none. Harm: real anyway.** Nothing was broken and nothing was broken by the fix. But a false
statement of fact is now written into a shared record, and the next reader has no reason to doubt it —
which is **precisely the species of inherited lie `ABC-113` was cut to remove**. A ticket about dead
rows must not ship a false sentence about its own delivery. I am naming it in the same voice I would
want used on my own hop.

**I did NOT edit or delete the engineer's note or their commit message.** Notes are append-only and a
commit is history. The correction is appended to the trace row, where the false sentence lives in a
shared record.

## What is CORRECT in the neighbourhood of that claim, and stays

The engineer also reported that **nine other rows in `plans/traceability.md` are not the 10-column
shape and they did NOT touch them.** I counted: `ABC-009`, `ABC-011`, `ABC-015`, `ABC-019`, `ABC-031`,
`ABC-062`, `ABC-065`, `ABC-066`, `ABC-106` — **nine, exactly.** The count is right and the refusal to
silently fix nine rows that were not theirs is right. **That finding stands and is NOT withdrawn with
the false one.** It is unowned and uncut; it is not `ABC-113`'s.

## What I did NOT do

- **Not merged.** `main` is the Orchestrator's to merge and humans hold merge; `autonomy` is `pr`.
- **The `In Review` exit is QE's, not mine.** Re-measuring a delivery is not adjudicating it.
- **The UAT-waiver call stays pre-registered** — measured over `main...HEAD`, never `<tip>~1`.
