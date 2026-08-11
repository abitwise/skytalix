---
id: 20260811T180500Z-ba-pm-observation-b93f5a17
kind: observation
by: ba-pm
at: 2026-08-11T18:05:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - A6
  - A7
  - A9
  - A13
  - src/status-panel.ts
  - src/gameend.ts
  - src/san.ts
supersedes:
---

# Every number in this hop was RUN — the mutant/criterion matrix, the spied depths, and the source reads

> **Hand-authored**; an `observation` and not a `finding` — no verification stamp is issuable to me.
> The harness was **out of tree**: four scripts in the session scratchpad importing `src/` by
> absolute path, plus one temporary `probe/` directory at the **worktree root, never under `src/`**,
> which is **deleted**. `git status --porcelain -- src/` was read after the delete and is **empty**.

## Environment, re-verified rather than taken from the brief

Branch `grugops/ABC-016-status-panel`, `git rev-list --count HEAD..main` = **0**,
`git rev-list --count main..HEAD` = 11. Full suite re-run here: **708/708 on 24 files**. Node
v24.12.0, vitest 3.2.7.

## `G2` — `A7`'s fixture, measured at the delivered test's own construction

```
busy ["Black to move  1...", "last: e4  material: 0", "thinking..."]   widest = 21
idle ["Black to move  1...", "last: e4  material: 0", "           "]   widest = 21
row 3: busy 11, idle 11 — and row 3 is NEVER the widest row here
idle cell DROPPED entirely  ->  widest still 21   =>  A7 as worded PASSES it
```

QE's numbers reproduce exactly. `widestOf(idle) === widestOf(busy)` is `21 === 21` in all three
builds, so the reservation `A7` exists to pin is invisible to `A7`.

## The matrix that decided `G1` and `G2` — five thinking-axis builds against two candidate closes

Each build is a parameterised re-implementation of the delivered panel with one cell mutated;
`m00` is the unmutated control and must survive every column or the candidate is wrong about
delivered code.

| build | QE's close (a thinking+in-check `CASES` entry, swept by `A10`/`A11`/`A12`) | the clause taken |
|---|---|---|
| `m00` control | survives (**required**) | survives (**required**) |
| `m06` drops `CHECK` while thinking | **survives** | **KILLED** (at "in check") |
| `m23` idle thinking cell dropped — `D7`'s own target | **survives** | **KILLED** (at "start position") |
| `m29` drops the claim cell while thinking | **survives** | **KILLED** (at "threefold claimable") |
| `m37` emits `U+2718` in the check cell while thinking | KILLED (`A12`) | **KILLED** (at "in check") |
| `m46` drops the side-to-move cell while thinking | **survives** | **KILLED** (at "start position") |

**1 of 5 against 5 of 5.** The clause taken also holds on delivered code for **every** case in
`CASES` plus the two this amendment adds — verified row-length by row-length:

```
start position      busy=[17,11,11] idle=[17,11,11]      in check          busy=[26,12,11] idle=[26,12,11]
after 1.e4          busy=[19,21,11] idle=[19,21,11]      played check      busy=[26,25,11] idle=[26,25,11]
threefold claimable busy=[17,23,50] idle=[17,23,50]      both claimable    busy=[18,23,67] idle=[18,23,67]
PROPOSED check+claim busy=[27,12,45] idle=[27,12,45]     PROPOSED Nexd4    busy=[19,25,11] idle=[19,25,11]
```

## `G3` — the piece values, all six `A6` rows rendered by the delivered panel

| FEN | renders | pins |
|---|---|---|
| `rnbqkbnr/…/RNBQKBNR w KQkq - 0 1` | `material: 0` | the zero |
| `…/RNB1KBNR w KQkq - 0 1` | `material: -9` | `QUEEN` |
| `rnbqkbnr/pppppppp/8/8/7Q/8/PPPPPPP1/RNBQKBNR w KQkq - 0 1` | `material: +8` | `QUEEN − PAWN`, so `PAWN` |
| `r1bqkbnr/pppppppp/…` (black minus b8 knight) | **`material: +3`** | **`KNIGHT`** |
| `rn1qkbnr/pppppppp/…` (black minus c8 bishop) | **`material: +3`** | **`BISHOP`** |
| `1nbqkbnr/pppppppp/… w KQk - 0 1` (black minus a8 rook) | **`material: +5`** | **`ROOK`** |

The joint alternative, built correctly on the third attempt:
`3qkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQk - 0 1` reads **`material: +11`**. `KNIGHT=4`,
`BISHOP=4`, `ROOK=6` each read `+12` there and die; **`KNIGHT=4, BISHOP=2` reads `+11` and
survives**. The three-row form kills it on the first row.

`KING` is provably unpinnable: both sides always have exactly one, `parseFen` refuses otherwise
(`"position must have exactly one white king, found 0"`), and a `KING = 9` build diverged 0/400 in
QE's fuzz. **After these rows all five observable integers are pinned and the sixth is proven
unobservable.**

## `G4` — `A13` re-spied out of tree at four depths, against two builds

Delivered panel, spied `isInCheck` difference and spied `squareAt`:

| history | withSan | sanAlone | difference | `squareAt` |
|---|---|---|---|---|
| 1 ply `Nf3` | 2 | 1 | **1** | 67 (sparse anchor) |
| 2 plies | 2 | 1 | **1** | 67 |
| 4 plies | 2 | 1 | **1** | 67 |
| 5 plies, last move CHECKS | 2 | 1 | **1** | — |
| 4 plies from the start position | — | — | — | **96** |

The two builds the delivered depth cannot see:

| build | difference @ 1 ply | difference @ 4 plies | `squareAt` @ 1 ply | `squareAt` @ 4 plies |
|---|---|---|---|---|
| delivered | 1 PASS | 1 PASS | 67 PASS | 67 PASS |
| a second `isInCheck` from ply 2 on | **1 PASS** | **2 FAIL** | 67 | 67 |
| the 64-square scan twice from ply 2 on | 1 PASS | 1 PASS | **67 PASS** | **131 FAIL** |

**Both survive at the delivered depth and both die at 4 plies, while the delivered panel is green at
every depth.** The scan count is **ply-independent**: it is 64 plus the occupied squares of
`initialFen`, because `parseFen` places one piece per occupied square (`src/fen.ts:90`) and
**`grep -n 'squareAt' src/apply.ts` returns nothing — `makeMove` never calls it.**

Where the delivered file measures today, read at source: `src/status-panel.nfr.test.ts:130-132`
(empty history), `:140-149` (**1 ply**, `["g1f3"]`), `:157-163` (two **empty** histories),
`:169-175` (**1 ply**, `["e1e2"]`). **0 and 1 ply only — QE's reading confirmed exactly.**

## `G5` — the constructed case, rendered by the delivered panel

```
FEN    4k3/8/8/8/8/8/8/4R1K1 b - - 100 60
status {"result":"in-progress","reason":null,"claimable":{"by":"black","draws":["fifty-move"]}}

"Black to move  60...  CHECK"
"material: +5"
"             Black may claim: fifty-move rule"        3 rows === STATUS_ROWS
```

## `G6` — read at source, and the closing case measured

`grep -n 'by: position.blackToMove' src/gameend.ts` → **`170:    claimable: { by: position.blackToMove ? "black" : "white", draws },`**. QE's cite is exact.

The forged input, rendered:

```
position 6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 100 60      (blackToMove = false, WHITE to move)
status   { claimable: { by: "black", draws: ["fifty-move"] } }

delivered:  "             Black may claim: fifty-move rule"     <- reads `by`
inferring:  "             White may claim: fifty-move rule"
```

## `G7` — the disambiguator, and the three cases NOT taken

QE's report names the divergence `last: Nexd4 → last: Nxd4` but **no position for it**. Constructed
here: `4k3/8/8/8/3p4/8/2N1N3/4K3 w - - 0 1` — white knights on **c2 and e2, both able to reach d4** —
played through the single ply `e2d4`.

```
delivered:  "last: Nexd4  material: +6"
empty-legal-list build: "last: Nxd4  material: +6"
```

Rendered and correct, and declined as bloat: castle `last: O-O`, promotion `last: a8=Q+`,
en-passant `last: exd6`.

## The four stale-comment sites, found by grep rather than taken from the report

`grep -rn "frame breathe\|widest panel row\|frame's \`W\`\|frame.ts:179" src/ plans/tickets/ABC-016-status-panel.md`:

| site | staleness | owner |
|---|---|---|
| `src/status-panel.nfr.test.ts:134-139` | calls `A13` unsatisfiable after it was ruled; cites `src/san.ts:101` for a specific call | **dev hop** |
| `src/status-panel.ts:95-101` | *"a cell that shrinks makes the whole frame breathe"* — false after `ADR-0010` cl. 1; named by the ADR, unfixed | **dev hop** |
| `src/status-panel.test.ts:263-265` | the same sentence, in `A7`'s own test — **named by nobody** | **dev hop** |
| the ticket's `A7` rationale | the same sentence | **fixed here** |

`src/san.ts` read at source: **`:101` is `function suffix(position, move): string {`** (the
declaration), **`:104` is `const check = isInCheck(position);`** (the call). QE's correction is
right. The ticket's own `:146`/`:147` cites are also verified correct — `:146` declares `toSan`,
`:147` is the return that calls `suffix`.

## `A14` and the code

Not re-measured here — QE re-measured it independently this hop at 5.66 / 8.21 / 10.06 µs (0.40x,
1.78x) and nothing in this ruling touches the panel. **No production line is asked for by any of the
seven**, and `git status --porcelain -- src/` is empty at the end of this hop.
