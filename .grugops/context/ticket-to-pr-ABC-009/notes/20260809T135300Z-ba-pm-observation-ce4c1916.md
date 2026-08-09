---
id: 20260809T135300Z-ba-pm-observation-ce4c1916
kind: observation
by: ba-pm
at: 2026-08-09T13:53:00Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - A5
  - A6
  - A7
  - A11
  - A12
  - src/moves.ts
  - src/moves.castling.test.ts
  - src/moves.castling.hardening.test.ts
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
supersedes: 
---

# Ten mutants of the DELIVERED diff: `A7` is inert, `G-2` is order-dependent, and `G-1` is WIDER than it was routed

Re-derived rather than accepted, because the routing note for this hop names three items measured by
other roles and this board's own history is that every hop which re-derived found something its
predecessor had missed. Two of the three came out differently here.

**Instrument.** A copy of the repository's `src/` in this session's scratchpad with `node_modules`
symlinked. Every mutant asserts its anchor occurs **exactly once** in the pristine source and that the
bytes actually changed (otherwise it is reported as a harness error, never as a survivor), runs
`npx tsc --noEmit` so a broken build cannot be scored as a legitimate survivor, and restores the file
afterwards with `src/moves.ts` re-hashed to `0e247853ab2c05887c76105ff83d8621` — the digest the
Engineer published and QE and Security/NFR each re-verified. Both test files are run per mutant with a
JSON reporter so failures are attributed by criterion rather than eyeballed. **No file under `src/` in
this repository was modified at any point:** `git status --short -- src/` is empty and `src/moves.ts`
still hashes `0e247853ab2c05887c76105ff83d8621`. **No production code and no test was written by this
role.** Machine: Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64; every figure below is an
integer count or a test verdict and is machine-independent.

**Calibration before trusting anything of my own.** The two guard-deletion mutants reproduce the
Engineer's and QE's tables exactly: deleting the **king** guard fails `A4` + `A5` and nothing else
(8 + 8 = 16 assertions), deleting the **rook** guard fails `A3` + `A6` and nothing else (1 + 4 = 5).
Third instrument, same numbers.

## 1. `A7` — measured inert on all ten. Independently, and it is inert BY CONSTRUCTION.

**Not one `A7` row failed on any of the ten mutants**, including the two that break real behaviour
badly and the four that pass everything else. QE measured 0 kills of 62; this is 0 of 10 more, on a
differently-built instrument.

```
mutant of the delivered diff                         acceptance   A7 rows red   hardening
delete the KING identity guard                        17/33        0            15/19
delete the ROOK identity guard                        28/33        0             9/19
KING square as "own KING or QUEEN"                    33/33        0            15/19
ROOK square as "own ROOK or QUEEN"                    33/33        0            15/19
ROOK guard continue -> break                          33/33        0            16/19
KING guard continue -> break                          33/33        0            19/19
KING square as "own KING or own ROOK"                  33/33        0            19/19
KING square as "own KING or own PAWN"                  33/33        0            19/19
ROOK square as "own ROOK or own PAWN"                  33/33        0            19/19
ROOK square as "own ROOK or own KNIGHT"                32/33        0            19/19
```

**The reason is structural, which is why it is not a wording problem.** `A7`'s population is the six
perft positions — all **legally reachable**. `makeMove` only ever *clears* a castling right, so a held
right in a reachable position implies both pieces are home, and the two guards this ticket added
**never fire there** (Security/NFR counted it exactly: 198,175 executions each, 0 rejections). A
criterion whose entire population never executes the branch under test cannot discriminate any
mutation of it.

**And the claim `## Test notes` 2 made for it was never true, on evidence already sitting on this
board.** It called `A7` *"the guard that would have caught the defect originally"*. The original defect
also required a semantically-invalid position, which is exactly what `A7`'s population excludes — and
the Engineer's red-before-green run already recorded **10 of 33 new tests passing on the UNFIXED tree,
those 10 being the four legal-castle controls plus the six `A7` rows**. `A7` was green on the broken
code. Nobody had connected that figure to the claim.

## 2. `G-2` — real, and the discrimination is ORDER-DEPENDENT. Half a plausible criterion is inert.

Reproduced: `continue` → `break` on the **rook** guard turns
`4k3/8/8/8/8/8/8/R3K3 w KQ - 0 1` from **16 moves with exactly `[e1c1]`** into **15 moves with no
castle** — a legal move silently deleted — while passing all 33 acceptance rows.

**What re-derivation added.** The harm appears **only when the loop reaches the invalid option first**.
Kingside precedes queenside in both `WHITE_CASTLES` and `BLACK_CASTLES`, so:

```
4k3/8/8/8/8/8/8/R3K3 w KQ - 0 1   h1 empty -> K bogus FIRST    delivered 16/[e1c1]  mutant 15/[]  RED
4k3/8/8/8/8/8/8/4K2R w KQ - 0 1   a1 empty -> Q bogus SECOND   delivered 15/[e1g1]  mutant 15/[e1g1]  inert
```

Exactly **three of QE's six** two-rights rows go red on that mutant, and they are the three where the
bogus option is the earlier one. A criterion phrased only as *"one right valid, one bogus"* could
therefore be satisfied entirely by rows that discriminate nothing — **the same
sampled-where-the-rule-quantifies defect as `G-1`, one level down.** That clause is now in `A12`.

**The asymmetry holds as reported:** the identical mutation on the **king** guard passes all 33
acceptance rows **and all 19 hardening rows** (both of a side's options share `kingFrom`), so it is
behaviour-equivalent and no criterion should chase it.

## 3. `G-1` — WIDER than routed. QE's rows closed the QUEEN INSTANCE, not the dimension.

The queen mutants behave exactly as QE and the Orchestrator reported: 33/33 acceptance, killed only by
the hardening file, and on `4k3/8/8/8/8/8/8/K3Q2R w K - 0 1` one `legalMoves` call yields
`4k3/8/8/8/8/8/8/K3K2R w K - 0 1` — **the white queen destroyed and a white king written over it** —
against the delivered code's byte-identical 31 moves and zero castles. Confirmed in a fresh process per
tree.

**Then the part nobody had measured.** A guard admitting one further own type — any type, not the queen
— is the same shape, and **three of them pass the ENTIRE net**:

```
mutant                                       acceptance  hardening  full suite      deep lane
KING's square as "own KING or own ROOK"       33/33       19/19      356/356 skip 0  32/32 exact
KING's square as "own KING or own PAWN"       33/33       19/19      356/356 skip 0  (not run)
ROOK's square as "own ROOK or own PAWN"       33/33       19/19      356/356 skip 0  (not run)
ROOK's square as "own ROOK or own KNIGHT"     32/33       19/19      —               —
```

The first is the most plausible mis-implementation on the list — the two guards are adjacent and
compare against locals named `king` and `rook` — and it is **the very reading the routed gap statement
used as its example** (*"the mover's KING/ROOK or QUEEN"*), with `QUEEN` swapped for the byte one line
below. Only the own-`KNIGHT` admission dies, to `A6`'s knight row. **So the piece-type dimension is
open; the queen is closed.**

## 4. The delivered code satisfies the quantified rule on every row — measured, so `A11` asks for no behaviour change

Full own-piece-type space on both home squares, on the delivered tree, `FLAG_CASTLE` counted in
`generateMoves` **and** `legalMoves`, state compared over all 128 board bytes and all five scalars:

```
KING's home square, matching rook present        legalMoves  castles gen/legal  state
own QUEEN   4k3/8/8/8/8/8/8/K3Q2R w K - 0 1          31          0 / 0          pure
own ROOK    4k3/8/8/8/8/8/8/K3R2R w K - 0 1          24          0 / 0          pure
own BISHOP  4k3/8/8/8/8/8/8/K3B2R w K - 0 1          19          0 / 0          pure   (= A5 row 1)
own KNIGHT  4k3/8/8/8/8/8/8/K3N2R w K - 0 1          16          0 / 0          pure
own PAWN    4k3/8/8/8/8/8/8/K3P2R w K - 0 1          13          0 / 0          pure

ROOK's home square, king already home
own QUEEN   4k3/8/8/8/8/8/8/4K2Q w K - 0 1           21          0 / 0
own BISHOP  4k3/8/8/8/8/8/8/4K2B w K - 0 1           12          0 / 0          (= A6 row 1)
own KNIGHT  4k3/8/8/8/8/8/8/4K2N w K - 0 1            7          0 / 0
own PAWN    4k3/8/8/8/8/8/8/4K2P w K - 0 1            6          0 / 0
```

Both-colour and both-side variants of the queen and pawn rows were measured too (`R3Q2K w Q` 32,
`k3q2r b k` 31, `r3p2k b q` 14, `p3k3 b q` 6, and the rest) — all zero castles, all pure.
**`parseFen` accepts every one of them**, checked by running it: it asserts one king of each colour and
performs no rights/board consistency check, so a pawn on the first rank is accepted. That is
`ABC-010`'s boundary, not this ticket's.

**Two shapes are excluded on measurement, so nobody writes a row for them.** The mover's own `KING` on
the **rook's** home square is not constructible — with the king also home it needs two same-colour
kings and `parseFen` rejects it, and with the king elsewhere the king guard already refuses. An
**enemy-colour** occupant of either square is unreachable: re-measured here, `K3q2R w K` and `4K2q w K`
offer zero castles at gen 13 / legal 3 and gen 5 / legal 3, refused by the pre-existing through-check
test on both trees.

## 5. The fifteen `A1`–`A6` counts, re-derived a SIXTH time, and the suite on the tip

All fifteen hold, each over all 128 board bytes and all five scalars with zero bytes changed, castle
count 0 in `generateMoves` **and** `legalMoves` on every row; the four legal castles read
15 / 16 / 15 / 16 with exactly one castle each. **No discrepancy against the five prior derivations and
nothing was adjusted.** `npm test` on the repository tip by this role: **356 passed (356) on 16 files**,
skip count **0** by the `AGENTS.md` command.

## What this note does NOT establish

- **That ten mutants is a campaign.** It is not. QE ran 62 and called that not-a-proof; this is ten,
  chosen to attack the three routed items and the dimension behind them. **A further class may exist**,
  and the honest expectation after this hop is unchanged: expect one.
- **That `A11`'s enumeration is complete as a criterion.** It is exhaustive over *piece type* on the two
  home squares. It samples colour-to-move and castling side, because `A4`/`A5`/`A6` already vary those
  and the type dimension is the one measured open.
- **Any `NFR-001` figure.** `npm run perft` was not run by me and no throughput number here is mine.
  Security/NFR's discharge stands; the count-based argument was read, not re-measured.
- **That the deep lane passes on the two mutants where it says "(not run)".** It was run for one of the
  three, at 32/32 exact. For the other two the structural argument (a held right implies both pieces
  home, so the guard never fires) says it cannot see them, but **only one was measured** and the others
  are recorded as not run rather than assumed.
