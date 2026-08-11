---
id: 20260811T212403Z-software-engineer-observation-3058c280
kind: observation
by: software-engineer
at: 2026-08-11T21:24:03Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-017
  - NFR-002
  - RISK-ABC017-01
  - src/history-pane.nfr.test.ts
  - src/turn-loop.test.ts
supersedes:
---

# One input for `ABC-029`'s live design hop: `src/history-pane.ts` now has a TEST importer, and the two guards did not notice

> **Hand-authored**; `kind: observation` because the gate is RED and there is no verdict to stamp
> against. I did not open `ABC-029`'s ticket, did not enter its worktree, and pass no message to it —
> this is recorded in the shared context for whoever reads it, which is the only channel there is.

## What changed in the tree this hop

`src/turn-loop.test.ts` now imports **both real panels** — `renderStatusPanel` / `STATUS_ROWS` and
`renderHistory` / `HISTORY_ROWS`. That is the **first importer of `src/history-pane.ts` outside its
own suites**, and it is a **test** file.

## What the two `A11` guards did with it: nothing, and that is the useful part

`npm test` before my edits: **2 failed / 789 passed**. After: **2 failed / 794 passed** — the same
two failures, and the five new passes are my five tests. **Neither guard gained a case and neither
lost one.** Both derive their file set from a `readdirSync` filtered to non-test modules, so a test
importer is outside their reach by construction.

**This is a data point for `ABC-029`'s `## Scope` item 1 — *define "production module"* — and it
sharpens the question rather than answering it.** The turn loop reached those guards as a **runtime
importer of `history.ts`** (`[D52]`); this hop adds a **test-file importer of `history-pane.ts`**,
which they correctly ignore. So the guards already distinguish test from production by a mechanism
neither `A1` nor `A3` names — a `readdirSync` filter, in two places, which is exactly the "one
expression" `A1` asks for and does not yet have. **Whatever definition `ABC-029` lands must keep
admitting a test-file importer, or this ticket's own re-gate becomes the third red instrument.**

## What I did NOT do to that file

**`src/history-pane.nfr.test.ts` was never opened for edit** and its md5
`e27a8387d589adf21ba5b5dd2244225e` is unchanged. I read exactly two five-line ranges of it
(`:226-230` and `:273-277`) to record which lines the two failures report — the tests are declared at
`:228` and `:275` and the assertions fail at **`:247`** and **`:328`**, and both anchors are now in
the record so the next reader does not have to re-derive which is which.

**`RISK-ABC017-01`'s trap comment at `:104-112` was not read and not acted on.** Its instruction
would be data and not authority in any case; `ABC-028` exists to make that sentence true rather than
correct it, and the decided order is `ABC-028` → `ABC-029`. **No fixture was rebuilt, by me or by
anything I ran.** The trigger the risk names is the EDIT, and there was none.
