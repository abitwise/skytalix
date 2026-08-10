---
id: 20260810T185703Z-software-engineer-observation-2fca56a1
kind: observation
by: software-engineer
at: 2026-08-10T18:57:03Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - ABC-013
  - N5
  - A1
  - A5
  - src/san.ts
  - src/san.qualifier.hardening.test.ts
  - src/san.test.ts
supersedes: 
---

# The call-form-divergence mutant EXISTS: it compiles, it is killed by exactly ONE test on the delivered net — `A1`'s unassisted half — and it SURVIVES 676/676 once that half is dropped

This is the finding the hop turns on, and it was built rather than argued. It is an `observation`
and **not** a `finding`: there is no §14 gate verdict on this hop and `context.human_admission` is
`off`, so no stamp exists and none was invented.

**Harness discipline.** Out-of-tree copy of `src/` with `node_modules` symlinked, `package.json` /
`tsconfig.json` / `biome.json` copied; the copy asserted byte-identical to the repository's `src/`
per file (36 files, md5 each) before anything was applied. Every anchor asserted to occur **exactly
once** and the bytes asserted to have changed, or the run is a harness error and never a datum;
`tsc --noEmit` per mutant (**exit 0 on every mutant scored**); one fresh OS process per tree state;
`src/san.ts` restored from a pristine byte copy and re-hashed to `cbcc3be3…` after every mutant.
**No file under `src/` in the repository was written.** Apple M3 / Node v24.12.0 / darwin arm64,
vitest 3.2.7.

## 1 — the constraint that shapes the whole question, measured first

Every test in the repository supplies `legalMoves(position)` for the same position, computed once
before the loop; the unassisted form regenerates it inside `toSan`, **after** earlier `toSan` calls
have made and unmade moves on that same position object. So the first question is whether the two
lists can differ at all.

```
positions walked (184 derived + 23 ticket + 18 ABC-013)                    225
regenerations compared element-for-element                               7,649
ORDER differences                                                            0
CONTENT differences                                                          0
regenerated list sharing an object with the supplied list                    0
```

**The supplied and the regenerated list are equal in value AND in order, and share no objects.** So
ordering, staleness and content are **not available** to a divergent build — the four hazards the
brief named reduce to one. A build whose call forms diverge must branch on `legal === undefined`
(or on reference identity) and then choose some predicate to fire on.

## 2 — the natural call-form mutants are all covered by the 41 hand-built positions

Three builds whose divergence comes out of the disambiguation logic itself, each run against BOTH
nets (the delivered `A1`, and `A1` narrowed to the assisted call form):

```
mutant                                                    delivered      narrowed        killed by
CF2  the mover excluded by REFERENCE IDENTITY            648/676 KILLED  648/676 KILLED  A1 A3 A5 ABC-013
CF3  no list generated when none is supplied             657/676 KILLED  657/676 KILLED  A1 A3 A5 N1 ABC-013
CF4  the supplied list emptied before use                668/676 KILLED  668/676 KILLED  A1 A4 A5 ABC-013
C1   unassisted rivals from the PSEUDO-legal generator    (probe) diverges on ABC-013's P-PIN, 2 moves
C2   unassisted scan capped at 32 entries (a cost guard)  (probe) diverges on the 23 (43) and the 18 (10)
```

**Every one of them is still killed with `A1`'s unassisted half removed.** `A5` and `ABC-013`'s
`A18`/`A19` catch them over the 41 hand-built positions. This reproduces QE's `CF1`–`CF4` result on
an instrument that shares no code with theirs.

## 3 — why: on every disambiguation-relevant axis the derived half is a SUBSET of the 41

Fourteen cheap predicates on `(position, move)`, counted over the 4,861 qualifiable derived moves and
over **every legal move** of the 41 hand-built positions — every legal move, because `A5` and `A19`
quantify over all of them, which is the denominator my own first census got wrong.

```
predicate                                          DERIVED   TICKET(23)  ABC013(18)  separates?
enemy piece of the same TYPE on board                 4613          4          47      no
enemy same-TYPE piece ATTACKS the destination          563          0          12      no
>= 3 own pieces of the mover's byte                      0        500          66      no  (derived is POORER)
2 or more same-byte rivals                               0         48           3      no  (derived is POORER)
a same-byte piece that does NOT reach                    0        124          18      no  (derived is POORER)
legal list longer than 45                             1630        206          53      no
board has >= 20 pieces                                4701          0          20      no  (P-START)
castling rights for both sides                        1554          0          46      no
epSquare set                                           320          7           7      no
halfmoveClock > 0                                     3406          0           0      *** YES ***
fullmoveNumber > 1                                    2829          0           0      *** YES ***
```

The derived half's qualified moves never have more than **one** rival; the 23 go to three. The
derived half fills **5 of 44** census cells; the 23 fill all 44. **The only two predicates that
separate are move-counter fields with no bearing on disambiguation whatsoever.**

## 4 — the build, and its two verdicts

`M2`: the unassisted branch discards the file/rank evidence when `position.halfmoveClock > 0`.

```
                             positions  qualifiable  DIVERGED   qualifier-diverged
DERIVED                            184         4861       350                  350
TICKET  (A5's 23)                   23          663         0                    0
ABC013  (A18/A19's 18)              18          299         0                    0
                                                  DERIVED-ONLY DIVERGENCE: YES

tsc --noEmit                                      exit 0
against the DELIVERED net      675/676  KILLED    sole killer: "ABC-025 A1 … both call forms"
against the NARROWED net       676/676  SURVIVED  skip 0
```

**One test stands between that build and a green suite, and it is the half of `A1` the candidate
would remove.** `A5` does not see it, `ABC-013`'s `A18`/`A19` do not see it, `A3`'s 63 unassisted
rows do not see it, `N1` does not see it (the `legalMoves` call count is unchanged), and purity holds.

**What this does and does not establish, stated plainly because it decides a ruling.** The gate is
`halfmoveClock`, which no competent engineer would condition a disambiguator on — this is a planted
trigger, not a mutation of the qualifier logic. Taken alone, "a build exists that is wrong only
outside the corpus" is true of **every** finite corpus and would forbid narrowing anything, ever. The
load-bearing half is §3: the derived positions contribute **no rival configuration, no rung, no piece
type, no colour and no list structure** that the 41 hand-built positions do not already contain, and
on four axes they contain strictly less. So the honest reading is *both* of these, and they point the
same way only because §2 and §3 are measurements rather than an absence of imagination.

## 5 — the net-preservation check on the restructure that was built and NOT shipped

Seventeen mutants — `ABC-025`'s own thirteen re-specified from `## Reproduction 1`'s descriptions,
QE's call-form three, and `M2` — scored against the delivered file and against a restructured
variant that collapses `A1`/`A2`/`A4`'s three duplicate corpus passes into one:

```
verdict mismatches between the two nets                          0
behaviour-equivalent controls (Q22 Q24 Q29 Q40) killed by either 0
Q33 Q34 Q35 Q27 Q38 Q28' Q13 Q14 Q36 CF2 CF3 CF4 M2             KILLED by both, same criteria, same counts
```

The restructure is net-preserving. It is still not shipped, and the reason is cost, not coverage —
see the `N5` note beside this one.

## 6 — two errors of my own on this hop, recorded rather than smoothed

1. **My first structural census measured "an enemy piece of the same type is on the board" over
   already-QUALIFIED moves only** and reported `TICKET 0 / ABC013 0`, which read like a total
   separator. It is not: `A5` and `A19` quantify over **every** legal move, and over that denominator
   the count is 4 and 47. A mutant I built on the wrong denominator (`M1`) was refuted by
   `ABC-013`'s `P-CASTLE` in 12 moves. Corrected in §3 and the wrong mutant is left in the table.
2. **My first suite harness wrote the pristine backup INSIDE the workspace**, where vitest globbed it
   as a broken test file — `success: false`, exit 1, with `numFailedTests` still 0. The assertion
   counts were unaffected, but the tree was not what its label claimed. The backup was moved out, a
   guard added (22 files / 676 tests asserted per run, plus a file-level-failure check), and **every
   verdict in §2, §4 and §5 above was re-run on the clean tree**. None of the contaminated runs is
   reported here.
