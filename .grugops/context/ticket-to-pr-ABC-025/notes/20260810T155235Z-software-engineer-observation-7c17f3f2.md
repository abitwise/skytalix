---
id: 20260810T155235Z-software-engineer-observation-7c17f3f2
kind: observation
by: software-engineer
at: 2026-08-10T15:52:35Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - ABC-013
  - src/san.ts
  - src/san.qualifier.hardening.test.ts
  - plans/tickets/ABC-025-san-qualifier-minimality-net.md
supersedes: 
---

# The delivered rows, measured: 13 mutants re-run, every verdict and every count reproduces BA/PM's table exactly

Everything here was measured on this hop against `src/san.ts` md5
`cbcc3be37c21414d16e8e6b4d0c68959` (148 lines), Apple M3 / Node v24.12.0 / darwin arm64. **Nothing is
inherited from the cutting hop; the 13 mutants were re-specified from the ticket's descriptions, not
copied from a script that does not exist in this repository.** Wall-clock figures are
machine-dependent; the counts are integers and are not.

**Harness discipline.** Mutants applied to a copy of `src/` held **outside** the repository with
`node_modules` symlinked. Every anchor asserted to occur **exactly once** in the pristine source and
the bytes asserted to have changed, or the run is a harness error and never a survivor. `tsc
--noEmit` per mutant — **exit 0 on all 13**, so no broken build was ever scored. **One fresh OS
process per tree state** for every typecheck, every vitest run and every probe. `src/san.ts` restored
from a pristine byte copy and re-hashed to `cbcc3be3…` after every single mutant, and the
repository's own copy re-hashed at the end. **No file under `src/` in the repository was written by
the harness.** The whole sweep was re-run a second time after `biome` reformatted the delivered file,
so the verdicts below are the DELIVERED file's, not a draft's.

## 1 — the table

`SUITE` is the whole default lane; the baseline is now **672** (652 + this ticket's 20). `A1`…`A5`
are this ticket's criteria as delivered; `INJ` is the pre-existing
`src/san.test.ts:347` injectivity test. The counts in brackets are this hop's own instrument:
qualifier mismatches over 5,524 qualifiable moves, rows red of 63, and colliding positions of 207.

```
mutant                                        SUITE     A1              A2   A3          A4       A5   INJ
Q33  full origin square, ROOK has a rival     669/672   RED [412]       ok   RED [12]    ok       ok   ok
Q34  full origin square, BISHOP has a rival   669/672   RED  [24]       ok   RED  [8]    ok       ok   ok
Q35  full origin square on a qualified capture 663/672  RED [110]       ok   RED [18]    ok       ok   ok
Q27  full origin square when the mover is BLACK 667/672 RED [536]       ok   RED [18]    ok       ok   ok
Q38  full origin square, BLACK on the rank rung 667/672 RED  [30]       ok   RED [10]    ok       ok   ok
Q28' the `x` dropped for a BLACK piece capture 668/672  green   **      ok   RED [12]    ok       ok   ok
Q13  castle side from the ABSOLUTE destination 669/672  green           ok   RED  [1]    RED [44] ok   RED
Q14  qualifier skipped on a capture            661/672  RED [116]       ok   RED [24]    RED [53] ok   RED
Q36  ROOKS under-qualified                     667/672  RED [412]       ok   RED [12]    RED [50] ok   RED

CONTROLS — behaviour-equivalent, and they MUST stay alive
Q22  rivals matched on piece TYPE, not the byte 672/672  green  green  green  green  green  green
Q24  capture read from the board + the ep flag  672/672  green  green  green  green  green  green
Q29  castle detected by the king's two-square hop 672/672 green green  green  green  green  green
Q40  full origin square for a KING with a rival 672/672  green  green  green  green  green  green
```

**Every one of those numbers is BA/PM's number.** `Q33` 412/12, `Q34` 24/8, `Q35` 110/18, `Q27`
536/18, `Q38` 30/10, `Q28'` 12 rows, `Q13` 1 row and 44 positions, `Q14` 116/24/53, `Q36` 412/12/50 —
the ticket's `PROP-NEW`, `ROWS` and injectivity cells reproduce **exactly**, from a re-specified
mutant set, a re-transcribed row table and an independently written property. That is corroboration
of BA/PM's instrument by an instrument that did not share its code.

**Three things the table settles that were previously assertions:**

1. **`A1`'s discriminating requirement is MET and so is its converse.** `Q33` `Q34` `Q35` `Q27` `Q38`
   each turn `A1` red; all four equivalent controls leave it green, **killed count zero on every one
   of the five new lanes**. No delivered row pins implementation shape.
2. **`A2` is red for NO mutant** — 44/44 cells filled, 0 rook-square, 5 derived, identical under all
   13. The criterion states that no wrong build can witness it; that is now measured over 13 builds
   rather than argued. Its witness is the narrowed corpus, and both directions are asserted in-suite.
3. **`A5` is red for NO mutant either** — corroboration, not a mutant-killer, exactly as the ticket
   records it. Recorded here so nobody later reads `A5` as a guard.

`Q28'` is the row that justifies `A3`'s existence and it behaves as predicted: it passes the suite's
652 pre-existing tests, passes injectivity, passes `A1` on the widened corpus, and dies **only** on
hand-typed strings.

## 2 — gates on the branch tip

```
npm test                672 passed / 672 on 21 files   (652 → 672, +20; no pre-existing test failed)
skip count              0                              (vitest --reporter=json, numPending + numTodo)
npm run lint            exit 0                         (after `npx biome check --write` on the ONE new
                                                        file; `quality.lint.autofix` is true. The 2
                                                        remaining infos are PRE-EXISTING — measured by
                                                        stashing the new file: 38 files, same 2 infos)
npm run typecheck       exit 0
npm run build           exit 0
PERFT_DEEP=1 …          32 passed / 32 in 37.93 s      (exact counts, `N6`'s standing number)
```

## 3 — `A6`, verified at line level rather than by inspection

```
md5 -q src/san.ts                          cbcc3be37c21414d16e8e6b4d0c68959   (unchanged)
git diff --numstat main -- src/            655  0  src/san.qualifier.hardening.test.ts  (ONE file)
git diff -U0 main -- src/ | grep -c '^-[^-]'   0 deletion lines
git diff -U0 main -- 'src/*.ts' :(exclude)src/san.qualifier.hardening.test.ts   EMPTY
git diff --name-only main -- 'src/*.test.ts' :(exclude)…   EMPTY — no existing test file touched
git ls-files --others --exclude-standard -- src/   src/san.qualifier.hardening.test.ts  (the only one)
git diff --name-only main -- package.json package-lock.json   (empty)
delivered diff                             +655 / −0, additions only
```

No existing test row is modified or deleted anywhere, because no existing test file is touched at
all. **No row proved the delivered code wrong**, so `A6` does not fail by design on this hop.

## 4 — the external oracle, re-run rather than inherited

`chess.js@1.4.0`, `npm install`ed in a scratchpad **outside** the repository. All 63 expected strings
were first re-derived by hand from each FEN's geometry, then put to the oracle:

```
positions offered      23     refused              0
hand-typed strings     63     DISPUTED             0
legal moves compared  677     MISMATCHES           0
toFen round-trips      23     failures             0
package.json / package-lock.json md5 before == after, and both byte-identical to `main`
```

**The hand-derivation is corroboration, not proof, and the reason is worth stating:** I derived the
63 strings after having read the ticket's table, so anchoring is possible. The oracle is the check
that does not share that bias, and it is a widely-used implementation rather than the PGN
specification text — where it and this repository could be wrong in the same way, both checks are
blind.

## 5 — corpus and census, as delivered

```
corpus                          207 positions   7,314 legal moves   5,524 qualifiable   44 of 44 cells
the derived half alone          184 positions                                            5 of 44 cells
this ticket's 23 positions       23 positions     677 legal moves
ROOK × square cells                                                                       0 (theorem)
leave-one-out over the 16 ladder positions: all 16 load-bearing (each empties ≥ 1 cell)
```
