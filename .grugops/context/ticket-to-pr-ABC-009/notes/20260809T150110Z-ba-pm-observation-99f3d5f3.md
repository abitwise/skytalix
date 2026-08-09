---
id: 20260809T150110Z-ba-pm-observation-99f3d5f3
kind: observation
by: ba-pm
at: 2026-08-09T15:01:10Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - A5
  - A6
  - A11
  - A12
  - src/moves.ts
  - src/moves.castling.hardening.test.ts
  - src/moves.castling.test.ts
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - 20260809T143100Z-qe-e2e-observation-34f21e73
  - 20260809T143916Z-orchestrator-decision-3634c6ad
supersedes: 
---

# `A11` verified INDEPENDENTLY and it is MET: 17 mutants, the exhaustiveness clause re-derived from `parseFen`, and the quantifier itself falsified

Re-derived rather than accepted. The routed claim was QE's and the Orchestrator's; **the mutant set below
was derived from `A11`'s own TEXT** — every own non-`KING` piece type on the king's home square, every own
non-`ROOK` type on the rook's — **not from anyone's published table**, so agreement is evidence rather than
an echo. Three roles in a row mis-certified a sample as a dimension on this ticket; the fourth check does
not get to be a reading.

**Instrument.** A copy of `src/` outside the repository, `node_modules` symlinked, `src/moves.ts` verified
byte-identical to the repository's before any mutation (`cmp`, plus md5
`0e247853ab2c05887c76105ff83d8621`). Every mutant asserts its anchor occurs **exactly once** in the
pristine source and that the bytes **actually changed** — otherwise `HARNESS-ERROR`, never `SURVIVED` — runs
`tsc --noEmit` so a broken build can never be scored a legitimate survivor, runs the full suite with a JSON
reporter so failures are attributed **by test name and file** rather than eyeballed, and restores
`src/moves.ts` with a re-hash afterwards. **No file under `src/` in this repository was modified at any
point:** `git status --short -- src/` is empty and the digest is unchanged. Machine: Apple M3 (Mac15,13) /
Node v24.12.0 / Darwin 25.5.0 arm64; every figure is an integer count or a test verdict and is
machine-independent.

**Baseline first, on the branch tip:** typecheck 0, suite **371 passed (371) on 16 files**, skip **0**,
acceptance 33/33, hardening 34/34. Also re-run in the repository itself by `npm test`: 371/371 on 16 files.

## 1. Discrimination — 17 mutants, 12 killed, 4 survived, 0 verdict mismatches, 0 broken builds

```
own type admitted on the KING's home square    acceptance  hardening  suite    killed by
QUEEN                                            33/33       30/34    367/371  A11 rows
ROOK          <- passed the whole net before      33/33       32/34    369/371  A11 rows
BISHOP                                           29/33       32/34    365/371  A11 + A5
KNIGHT                                           31/33       32/34    367/371  A11 + A5
PAWN          <- passed the whole net before      33/33       32/34    369/371  A11 rows
own type admitted on the ROOK's home square
QUEEN                                            33/33       30/34    367/371  A11 rows
BISHOP                                           31/33       30/34    365/371  A11 + A6 + A12
KNIGHT                                           32/33       32/34    368/371  A11 + A6
PAWN          <- passed the whole net before      33/33       32/34    369/371  A11 rows
own PAWN on the king's square only when BLACK    33/33       33/34    370/371  A11 rows (one row)
own KNIGHT on the rook's square only QUEENSIDE   32/33       33/34    369/371  A11 + A6
MUST SURVIVE — colour-blind king / rook / both, and king guard `continue`->`break`
                                                 33/33       34/34    371/371  all four SURVIVED
CALIBRATION — king guard deleted                 17/33       22/34    343/371  killed (matches prior hops)
HARNESS CONTROL — no-op replacement              -           -        -        HARNESS-ERROR, as required
```

**The load-bearing row of that table is the "was open" one.** The three builds that passed all 33
acceptance rows, all 19 previous hardening rows, all 356 tests and the deep lane at the second hop now die,
and they die **to `A11`'s rows alone** — acceptance stays 33/33 on all three, hardening drops to 32/34, two
rows each. **The claim under test — a mutant admitting any single wrong own piece type on either home square
dies — holds on all nine.**

**The four survivors carry as much weight as the twelve kills.** `A11`'s rows kill **zero** of the
behaviour-equivalent mutants, so they pin observable behaviour rather than the shape of the implementation.
A row that had killed the colour-blind or the `break` variant would be the theatre this board has refused
three times.

**The calibration mutant reproduces the Engineer's, QE's and this role's second-hop numbers** (deleting the
king guard fails `A4`+`A5` and nothing else in the acceptance file) — a fourth instrument, same figures.

## 2. The exhaustiveness clause, on this role's OWN domain probe rather than the suite's

`A11` requires the enumeration to be *"exhaustive over piece type"* with *"both colours to move and both
castling sides ... across the table"*. Checked without using the suite's own helpers:

```
parseFen's piece-type domain, probed over 26 letters x 2 cases x 4 probe boards
  -> exactly six types: PAWN KNIGHT BISHOP ROOK QUEEN KING
king's home square table   12 rows   covered PAWN KNIGHT BISHOP ROOK QUEEN   missing none   extra none
rook's home square table   10 rows   covered PAWN KNIGHT BISHOP QUEEN        missing none   extra none
rights across each table  K Q k q    sides to move  b w
configurations per type   king's: QUEEN 4 ROOK 2 BISHOP 2 KNIGHT 2 PAWN 2 · rook's: QUEEN 4 BISHOP 2 KNIGHT 2 PAWN 2
all 22 rows re-derived independently of `expectImpostorSetup`:
  0 rows whose label lies about its FEN · 0 rows where the OTHER precondition fails · 0 rows holding the wrong right
```

**The last line is the one worth having.** A row asserting *"no castle is offered"* also passes when its FEN
sets up something else, so I re-implemented the setup check rather than trusting the suite's — 22 rows, zero
discrepancies.

## 3. The quantifier FIRES — falsified, not trusted

The difference between a fourth sample and a quantifier is whether shrinking the enumeration is detected.
Three deliberate corruptions of the **suite file** in the scratch copy, production code pristine throughout,
suite file restored and re-hashed after each:

```
drop BOTH own-PAWN rows from the rook's-square table   -> RED  "expected [2,3,5] to deeply equal [1,2,3,5]"
drop ONE own-PAWN row                                  -> RED  "PAWN needs a second configuration"
relabel the h1 KNIGHT row as PAWN                      -> RED  "the impostor must stand on the square under test"
                                                          plus "KNIGHT needs a second configuration"
```

**A shrunken enumeration cannot pass, and a lying label cannot pass.** That is `A11` closed as a rule.

## 4. Every kill is a real defect — one FRESH OS PROCESS PER TREE STATE

```
tree state                    4k3/.../K3R2R w K        4k3/.../K3P2R w K       4k3/.../4K2P w K
PRISTINE (delivered)          24 · 0/0 · 0 bytes       13 · 0/0 · 0 bytes      6 · 0/0 · 0 bytes
king square admits own ROOK   25 · 1/1 · [4: 4->6]     13 · 0/0 · 0            6 · 0/0 · 0
king square admits own PAWN   24 · 0/0 · 0             14 · 1/1 · [4: 1->6]    6 · 0/0 · 0
rook square admits own PAWN   24 · 0/0 · 0             13 · 0/0 · 0            7 · 1/1 · 0 bytes
```

King's square: one `legalMoves` call **destroys the occupant and writes a king of the moving side over it**
(`K3R2R w K` ends `4k3/8/8/8/8/8/8/K3K2R w K - 0 1` — the own rook gone). Rook's square: the position is
**byte-identical** and the illegal `FLAG_CASTLE` offer is the only witness, which is `A6`'s structural
rationale confirmed on further types. Scalars unchanged on every row.

## 5. Both of this ticket's measurement traps were discharged, not dodged

- **One process per tree.** Every `vitest` and `tsc` run is its own OS process by construction, and the harm
  probe spawns a **fresh `node` per tree state**. The tell that it worked is in the table above: **the output
  differs per tree**. This role's own second-hop harm probe ran four trees in one process, Node's module
  cache served pristine `moves.ts` to all four, and identical output across trees was the tell it missed.
- **Verify the instrument before believing a red.** **This hop's first three equivalence controls did not
  compile** — `pieceType(position.board[i])` is `number | undefined` under `noUncheckedIndexedAccess` — and
  the harness scored them `BROKEN-BUILD` rather than letting me report three dead controls and conclude
  `A11`'s rows over-fit. Rebuilt with `?? EMPTY`, all three survive 371/371. That is the same class as the
  Orchestrator's `pieceTypeOf`, met in a different form, and the refusal path is why it cost nothing.

## 6. `A11`'s own excluded shape, re-measured

The mover's own `KING` on the **rook's** home square: `parseFen` refuses all three constructions —
`4K2K w K`, `K3K3 w K`, `4k2k b k` each raise *"position must have exactly one white/black king, found 2"*.
The exclusion holds and a row for it would be unfalsifiable. **The other exclusion this criterion carried
does NOT hold; that is its own note.**

## What this note does NOT establish

- **That 17 mutants is a campaign.** It is not. It is a targeted set aimed at one claim and the equivalence
  set that bounds it — engineer 5 → QE 62 → BA/PM 10 → QE 20 → this 17 plus 12.
- **That the nine equivalence arguments generalise.** I ran **four** of QE's nine controls and re-enumerated
  **none** of the corpora. *"Survives my suite"* is still weaker than *"is equivalent"*.
- **Any `NFR-001`, perft or deep-lane figure.** `npm run perft` was not run by this role and the
  `PERFT_DEEP=1` lane was not run by it either; **no throughput number anywhere in my output is mine.**
- **That the criteria set is complete.** It is not — see the companion `observation` note, which names a
  fourth dimension measured open at this hop.
