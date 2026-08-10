---
id: 20260810T124325Z-software-engineer-observation-a9485707
kind: observation
by: software-engineer
at: 2026-08-10T12:43:25Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - src/san.ts
  - src/san.test.ts
supersedes: 
---

# Red-before-green, stage by stage — and the four criteria that were green before the code they exist for was written

The module was built in six inner-loop steps, `src/san.test.ts` run after each. This is the record,
with the already-greens named rather than folded into the kills. **A row green before my change is
already-green, not a kill**, and four of the twenty were.

## The staged record

| stage | what the code gained | criteria that went RED → GREEN | still red |
|---|---|---|---:|
| 0 | *(tests only, no `src/san.ts`)* | — collection error, whole file red | 20 |
| 1 | piece letter + destination square | **A1, A2** | 14 |
| 2 | captures: `x`, pawn origin file, from `move.captured` | **A9, A10, A11** | 11 |
| 3 | promotion `=Q` after the destination | **A12** | 10 |
| 4 | castling `O-O` / `O-O-O` by destination file | *(none — `A3` still needs the suffix)* | 10 |
| 5 | disambiguation: none / file / rank / full square | **A4, A5, A6** | 7 |
| 6 | the `+` / `#` suffix, appended to every shape | **A3, A13, A14, A15, A16, A17, A20** | 0 |

`A20` flips at stage 6 because that is when the module first imports all four of its declared
modules — before it, the import set was a subset and the criterion was red for the right reason.

## The four already-greens, and what they actually kill

**`A7` and `A8` were GREEN AT STAGE 1** — on a build with **no disambiguation code at all**. Both
criteria's expected strings are unqualified (`Ne4`, `Nd2`, `Kd2`, `Bd2`, `Qd2`), so a build that
never qualifies anything satisfies them. That is not a defect in the criteria; it is what they are
*for*. They kill a **wrong** disambiguation (rivals from the pseudo-legal list; rivals not filtered
by piece type) and they are the only rows that can. **`A4`, `A5` and `A6` are what kill a MISSING
one.** The two groups are not interchangeable and neither is redundant — worth stating because a
reader scanning "A7 passed on the first build" could easily draw the opposite conclusion.

**`A18` and `A19` were GREEN AT STAGE 1 VACUOUSLY.** A `toSan` that reads only `move` and never
touches `position` is trivially pure, and returns the same string with or without the `legal`
argument because it consults neither. They become load-bearing only from stage 5 (`A19`, when the
list is first read) and stage 6 (`A18`, when the position is first mutated). They were never red on
any build I wrote, and I am not claiming them.

## One instrument check the tests caught, recorded because it was mine

At stage 2 I imported `EMPTY` from `./moves.ts`, which does not export it — `EMPTY` lives in
`position.ts`. Node's type stripping does not typecheck, so `move.captured !== undefined` was
silently always true and **every criterion went red at once**, including four that had been green.
A whole-file red on a one-token change is the shape of an instrument fault rather than a logic
fault, and it is what sent me to the import line instead of the capture rule. Recorded because
`npm run typecheck` would also have caught it, later — the test file caught it first and cheaper.

## What this record does NOT establish

That each criterion kills the specific wrong build the ticket assigns to it. The staged build shows
a criterion going green when the rule it names is added, which is weaker. The mutation note is the
stronger evidence, and even that is my own mutant set — **ten mutants, chosen by the person who
wrote the code**, which is exactly the dependency QE's independent hop exists to break.
