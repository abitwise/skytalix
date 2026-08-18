---
id: 20260818T164500Z-qe-e2e-observation-verdict-gaps-and-what-this-hop-could-not-prove-2a5f8e39
kind: observation
by: qe-e2e
at: 2026-08-18T16:45:00Z
verified_by: ""
confidence: high
refs:
  - ABC-106
  - src/san.parse.test.ts
supersedes: ""
---

# Verdict per criterion, gaps by severity, and the honest limit of this hop

## Verdict

- **`A1` — PASS, after repair.** The `:382` block and its three rows say the behaviour is ruled;
  the stale-ruling sweep returns nothing; each of the three names where it was ruled (`ABC-032`
  § Scope entries 4 and 5; `ABC-034` `A8`). The `A8` citation was overstated as delivered and is
  now accurate.
- **`A2` — PASS.** `src/san.parse.test.ts` is the only `src/` file changed across the branch;
  **0** changed lines outside a comment or an `it`/`describe` title; test count of that file
  **unchanged at 30**; suite green, skip **0**; `PERFT_DEEP=1` **32/32** exact.
- **`A3` — PASS.** `Ne4g5` → `rejected`, `o-o` → `rejected`, `e8=P` → `unreadable`, all three
  verbatim and passing.

## Gaps, with severity

- **LOW — `ABC-106`'s page still calls it a "re-classification".** The page is now less accurate
  than the code it produced. Cosmetic on a ticket heading to `Done`; a one-word repair if BA/PM
  wants it.
- **LOW — the ruling note's HEADING is the root of the wording** and, being append-only, stays.
  Anyone reading the ruling and not its body will re-introduce this word on the next hop that
  cites it. **This is the one that can recur.** A superseding note from BA/PM is the instrument.
- **LOW / STRUCTURAL — no gate in this project reads a comment.** Lint, tsc, vitest and the skip
  checker are all blind to a false citation in prose. `ABC-106` exists because a human noticed.
  The defect class that produced `ABC-106` remains unguarded and undetectable by the mandatory
  gates. Named, not fixed — a detector is `ABC-105`'s subject, which sits in `Backlog`.

## What this hop could NOT prove

- **That `A8` will in fact leave `e8=K` as `no-such-move`.** I proved only that `A8` PERMITS it.
  `ABC-034` decides, and that ticket is not built. My comment says exactly that and no more.
- **That the file's OTHER comments — the ones this ticket did not touch — are all true.** I swept
  `src/san*.test.ts` and all of `src/*.test.ts` for the *stale-ruling* pattern specifically
  (`undisclosed|unruled|pending a ruling|not a demanded tolerance|characteriz|does not name|
  provisional|awaiting|whoever rules`) and found exactly one live hit, which I fixed. **A comment
  can be false in ways no grep spells.** I did not open and re-derive every comment in the file
  against its source; I opened every comment the branch CHANGED.
- **That the `999` figure is complete coverage of anything.** It is a count of passing tests, not
  a coverage measure. No coverage run was made this hop; a comment-only change cannot move it.
- **Nothing about `ABC-033` / `ABC-034` behaviour.** Neither exists. The claim that these rows are
  what those authors will read is an expectation, not a measurement.
