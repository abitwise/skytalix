---
id: 20260810T083348Z-security-nfr-observation-dc358c57
kind: observation
by: security-nfr
at: 2026-08-10T08:33:48Z
verified_by: 
confidence: high
refs:
  - ABC-023
  - A4
  - src/moves.castling.hardening.test.ts
  - src/moves.ts
  - agent-factory/checklists/security-nfr-checklist.md
  - 20260810T082408Z-orchestrator-decision-5e9c6b73
supersedes: 
---

# All 749 added lines READ FOR RISK, not for mutants — the first review of this diff that asked any question other than "do the right mutants die"

Three hops have looked at these lines and every one asked the same question. This hop asked the
other one: **test code is still code.** Below is what was looked for, what was found, and the
evidence for each — the mechanical scan is reported beside the reading, not instead of it, because
the Orchestrator's own scan came back empty and it said itself that was evidence and not a gate.

## What was actually read

`git diff main -- src/moves.castling.hardening.test.ts` → **749 added lines, 0 removed, one file**.
Every added line was read. The diff is seven hunks: six small table extensions (`A3`'s nine
`A3_ADDED_*` rows spread into the four impostor tables, +105 lines) and one 655-line block at the
end of the file carrying the engineer's `A1`/`A2`/`A3` suites and QE's regions 7–9.

## The danger list, each one answered with evidence rather than an impression

Scan run over the **added lines only** (`git diff | grep '^+'`), so a pre-existing pattern cannot
launder a new one:

```
new imports / require() / dynamic import()          NONE   the 749 lines add ZERO dependency edges
process.* / child_process / spawn / exec / fork     NONE
fs / readFile / writeFile / unlink / mkdir / path.  NONE
fetch / http(s) / socket / dns / any "://" at all   NONE
eval / new Function / setTimeout / setInterval      NONE
secret-shaped tokens (key, token, password, AKIA…)  NONE
Math.random / Date.now / performance.now / crypto   NONE
try / catch / .catch / finally                      NONE
.only / .skip / todo / xit / expect.soft            NONE   (whole file, not just the diff)
@ts-ignore / @ts-expect-error / biome-ignore        NONE   (whole file)
toMatchSnapshot / console.*                         NONE
while / do — unbounded loop shapes                  NONE
```

**The zero-imports result is the load-bearing one and it was checked at the source.** The file's
entire import surface is unchanged: `vitest` plus four local modules (`./fen.ts`, `./legal.ts`,
`./moves.ts`, `./position.ts`). A 749-line addition that adds no package, no node builtin and not
even a new local module has no new exposure to add. `package.json` is untouched on this branch.

## The risks that are specific to TEST code, which is where this diff could actually have hurt

A test file cannot leak a customer record here — there are no customers, no I/O and no user
surface. What it *can* do is quietly stop the suite from being able to fail. That was the real
review, and the file defends against it structurally:

1. **No `.only` anywhere in the file.** One `it.only` would silently disable the other 65 tests in
   it and every gate downstream would still read green. Checked across the whole file, not the diff.
2. **No suppression comments.** Nobody silenced the typechecker or the linter to land 749 lines.
3. **No vacuous quantifiers.** The four aggregate tests loop over tables and assert *inside* the
   loop — the classic way to ship a green test that checks nothing is a loop over an empty set.
   Every one is pinned by an explicit count assertion first: `pairs === 13`, `added.length === 9`,
   `gappedBeforeTheseRows === 9`, `shortBeforeTheseRows === 11`, `rows.length === 2` per family.
   A future edit that empties a table turns those red instead of vacuously green.
4. **Deterministic.** No clock, no RNG, no timer, no I/O — so the 66 added tests introduce **zero**
   new flake vectors. A flaky test is a gate that gets ignored three sprints later.
5. **No shared-state mutation.** The two places that mutate a board mutate a **copy**
   (`{ ...position, board: position.board.slice() }`), never the parsed position under assertion and
   never module-level state, so no test can contaminate another.
6. **Fails loud, not open.** `expectPairSetup`, `expectLandingSquareIsTheOnlyRefuser` and
   `expectNamedAttackerIsTheMechanism` each `throw new Error` on a row that does not hold exactly
   one castling right. Every `expect` carries a message naming the offending FEN, so a failure is
   diagnosable without a debugger — the "a failure mode with no log is the incident nobody can
   diagnose" bar, met.

## Bounds and cost, measured

The only counted loop in the diff is `for (let square = 0; square < 128; square++)` over the 0x88
board — bounded by construction. Every other loop is `for…of` over a literal array of at most 20
rows. No recursion. Measured cost of the whole addition: suite **625 tests in 1.10 s** (was 559),
deep lane 46.92 s. Nothing here is a resource risk.

## What this observation does NOT establish

- **Not that a pattern scan is a proof.** The scan is reported *beside* the reading because it can
  only find what it was told to look for. The 749 lines were read line by line as well; that
  reading is what the risk judgement rests on.
- **Not anything about the pre-existing 779 lines of this file.** Only the diff was reviewed. Rows
  that were already on `main` were read only where the added code calls them.
- **Not that the added rows are correct chess.** That is `A1`–`A5` and QE's harness, already ruled.
  This hop reviewed the lines for danger, not for mutant kill.
