---
id: 20260809T131300Z-security-nfr-observation-b95cd581
kind: observation
by: security-nfr
at: 2026-08-09T13:13:00Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - A10
  - NFR-001
  - src/moves.ts
  - src/apply.ts
  - plans/nfr-catalog.md
supersedes: 
---

# The instrument that CAN resolve the per-cell question, and what it says about guard ordering

The Engineer concluded that the instrument cannot resolve a per-cell claim and therefore claimed
none. That is honest and it is correct **about that instrument**. It is not the end of the road, and
this note is the road: the question is moved off the clock and onto a **count**, which is the same
move `plans/nfr-catalog.md` already made for `NFR-005`'s call-count sub-bar when a whole-key
benchmark could not resolve a sub-0.15% delta.

## Why perft cannot see this, quantified rather than asserted

`npm run perft` dilutes the two added lines twice: **97.18% of the nodes it counts are free leaves**
that never generate at all (measured, companion note), and every generating node also pays the
make/test/unmake legality filter the catalog prices at ~71% of per-node cost. The signal is buried
about 35x before the noise floor is even reached.

## Instrument A — the COUNT. Exact, and it carries no noise floor.

A counting tree was built from the delivered tree by patching only `addCastlingMoves`, with the
anchor asserted **unique** and the bytes asserted **changed** (the discipline QE's driver used), and
verified to differ from the delivered tree in `moves.ts` and nothing else. Run over the exact
`npm run perft` population:

```
cell            perft nodes   generating nodes   option iters   right held   kingGuard fails   rookGuard fails
startpos            197,281              9,323         18,646       18,646                 0                 0
kiwipete          4,085,603             99,950        199,900      160,475                 0                 0
position-3          674,624             46,256         92,512            0                 0                 0
position-4          422,333              9,738         19,476       16,446                 0                 0
position-5        2,103,487             63,910        127,820        2,608                 0                 0
position-6        3,894,594             92,016        184,032            0                 0                 0

TOTAL             11,377,922            321,193        642,386      198,175                 0                 0
```

- **The two added lines execute 198,175 times EACH — 396,350 in total — across 11,377,922 counted
  nodes.** That is **0.0348 added executions per counted node**.
- **Neither guard rejects anything, in any cell: 0 failures out of 198,175 executions each.** The
  Engineer's structural argument — `makeMove` only ever clears rights (`src/apply.ts:142`,
  `position.castling &= ~(...)`; confirmed by reading), so a held right in a reachable position
  implies both pieces are home — is now confirmed **empirically over 11.4 million nodes** rather than
  by reading alone.
- **position-3 and position-6 execute the added lines ZERO times**, which is the structurally-zero
  property established by count instead of by argument.

## Instrument B — the ISOLATED COST, with its own null control

Exporting `addCastlingMoves` in the scratch copies removes both dilutions: the function under test IS
the function the change touches. Six trees in one process (pre-fix, delivered, identity twin, and the
three ordering variants), 12 rounds with round 0 discarded, tree and cell order rotated, `parseFen`
hoisted out of every clock, 200,000 iterations per cell per round, medians, two samples.

```
tree                  kiwipete KQkq   startpos KQkq     R3K2R KQ   position-6 (none)   K7 KQ invalid
pre                       419.8/422.4     32.15/32.11  503.7/508.8      26.48/26.44     522.3/525.7
post (delivered)          416.9/420.0     33.44/33.84  502.9/504.6      26.72/26.76      27.9/28.1
twin (null control)       419.7/418.0     33.56/33.62  502.7/504.8      26.80/26.50      28.0/27.7
```

**post − pre, nanoseconds per call, beside the null control on the same cell:**

```
cell                post-pre           twin-post (TRUE VALUE 0)
startpos KQkq       +1.30 / +1.73 ns   +0.12 / -0.22 ns   <- RESOLVED: signal 6-8x its local floor
position-6 (none)   +0.24 / +0.33 ns   +0.09 / -0.26 ns   <- structurally zero, reads ~zero
kiwipete KQkq       -2.89 / -2.39 ns   +2.77 / -2.01 ns   <- still noise-dominated (a 420 ns call)
R3K2R KQ            -0.82 / -4.17 ns   -0.21 / +0.24 ns   <- still noise-dominated (a 503 ns call)
```

**On startpos the two guards ARE resolved: +1.30 and +1.73 ns per call against a null-control floor
of ±0.22 ns.** Both rights are held there, so one call runs 2 options × 2 guards = **4 executions**,
giving **~0.33–0.43 ns per guard execution**. The cells that stay unresolved are exactly the
expensive ones (420–503 ns calls dominated by attack scans), which is the expected shape.

## The two combined — LABELLED AS ARITHMETIC, NOT AS A MEASUREMENT

```
396,350 executions  x  0.33-0.43 ns  =  0.131-0.170 ms
                                        against a 1.854-1.887 s sweep
                                     =  0.0070% - 0.0091%
```

**The true `post/pre` ratio for the whole change is therefore about 0.99991–0.99993** — call it
**0.01%**, against a bar that allows **2%**. This is arithmetic over a measured count and a measured
per-execution cost, exactly as `NFR-003`'s fence labels its own composite; it is **not** a direct
measurement of the perft ratio and is not offered as one.

**It is robust to a large error in the multiplier**, which is the point of stating it: even at **4 ns
per execution** — ten times the measured figure and implausible for a `Uint8Array` index read plus an
integer compare — the total is **0.085%**, still more than 20x inside the bar and still below the
instrument's floor.

**For kiwipete specifically**, the cell the Engineer flagged: 2 × 160,475 = **320,950** added
executions over its ~0.66 s subtree = **0.0194%**, so its true ratio is **≈ 0.9998**. The measured
0.9930 is about **35x** the true deviation, and this gate's own 1.0228 is about **115x** it in the
other direction. **Both readings are noise; the truth is 0.9998.**

## Guard ordering — the cost half, measured

**Selectivity over the reachable population**, which is what a conjunction's ordering should be tuned
to and which nobody had measured:

```
guard 1  RIGHT held      (pre-existing)  runs 642,386   rejects 444,211  = 69.2% selective
guard 2  KING identity   (ADDED)         runs 198,175   rejects       0  =  0.0% selective
guard 3  ROOK identity   (ADDED)         runs 198,175   rejects       0  =  0.0% selective
guard 4  EMPTY           (pre-existing)  runs 198,175   rejects  34,937  = 17.6% selective
guard 5  THROUGH-CHECK   (pre-existing)  runs 163,238   rejects  23,087  = 14.1% selective
castles actually emitted 140,151
```

**Added-guard executions under each ordering, exactly:**

```
guards ABOVE the right test      1,284,772   (3.24x the delivered order)
DELIVERED                          396,350
guards BELOW the empty test        326,476   (17.6% fewer)
guards BELOW the through-check     280,302   (29.3% fewer)
```

**And the invalid-position class, where the ordering is worth something large.** On
`4k3/8/8/8/8/8/8/K7 w KQ - 0 1`, `addCastlingMoves` costs **522–526 ns pre-fix** and **27.9–28.1 ns
delivered** — the cheap byte compare rejects before the attack scan ever runs, an **~18x** saving.
Move the two guards **below the through-check** and it returns to **509 ns (+481 ns)**; below the
empty test costs **+9.5 ns**; above the right test is unchanged.

## What this note does NOT establish

- **That 0.33–0.43 ns/execution generalises off startpos.** It is one resolved cell; the expensive
  cells could not resolve it. The arithmetic is presented with a 10x robustness bound for that reason.
- **A cause for the twin's aggregate systematic.** Not attributed.
- **Any figure for non-M3 hardware.** `UNKNOWN - verify`.
- **That the counting and export patches measure the shipped bytes.** They measure copies **outside
  the repository** that differ from the delivered tree by exactly the counter lines / one `export`
  keyword, asserted unique and asserted changed. `src/moves.ts` in this repo was never touched and
  still hashes `0e247853ab2c05887c76105ff83d8621`.
