---
id: 20260803T200500Z-security-nfr-observation-1bb8967d
kind: observation
by: security-nfr
at: 2026-08-03T20:05:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-010
  - NFR-005
  - EPIC-004
  - EPIC-006
  - src/legal.ts
  - src/zobrist.ts
  - src/position.ts
  - src/perft.test.ts
  - src/zobrist.nfr.test.ts
  - plans/nfr-catalog.md
  - 20260803T124500Z-security-nfr-observation-a2f19d63
  - 20260803T160500Z-qe-e2e-observation-346a1b30
  - 20260803T150500Z-software-engineer-observation-8c4d2a17
supersedes: 
---

# What this gate measured itself, and the explicit confirm / could-not-confirm split against the interrupted run

Neutral record so the verdict beside it can be checked rather than believed. Everything below was run
by me at this pass on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** — `UNKNOWN -
verify` on any other hardware. The machine-independent quantity is the ratio measured in the same
process, never the absolute nanoseconds. Scripts ran from the session scratchpad against extracted
trees; the repository's own `src/` was mutated only transiently, backed up first, restored after, and
each restore md5-verified.

## 1. Gates, exactly as they ran

```
npm test            214 passed / 9 files / 0 failed / 0 skipped
skip count          0    npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'
                         (reported pending 0, todo 0, total 214, passed 214, failed 0)
npm run lint        exit 0   (2 pre-existing biome config-schema infos)
npm run typecheck   exit 0
npm run build       exit 0
```

Machine captured rather than assumed: `hw.model` = **Mac15,13**, `machdep.cpu.brand_string` =
**Apple M3**, `uname -mrs` = **Darwin 25.5.0 arm64**, `node -v` = **v24.12.0**.

## 2. The benchmark protocol, because it is the known trap on this ticket

Three protocols have already hit this wall — the Engineer's first read **1.26x** on a delta that is
structurally zero. So this run carried a null control and gave the timing run a process of its own.

**Four trees imported in ONE process:** merged `4c6ed7d`, pre-guard `584defa`, shipped, and a
**BYTE-IDENTICAL TWIN of the shipped tree** (md5-verified identical) used as a **null control by
identity** — any shipped-minus-twin reading is pure instrument error. 15 rounds × 100,000 iterations
per cell, **rotated tree AND cell order every round**, reduced by median, two full samples. Each tree
parsed its own `Position` instance, because the shipped key transiently mutates and the baseline does
not.

## 3. NFR-005's two bar positions — MET WITH ROOM

| cell | merged | pre-guard | **shipped** | twin | ship−twin | ship−preguard | ship/merged |
|---|---|---|---|---|---|---|---|
| **startpos — no ep** | 295.5 / 296.9 | 297.4 / 302.6 | **296.8 / 299.3** | 297.8 / 299.6 | −1.00 / −0.21 | −0.69 / −3.24 | 1.0043 / 1.0081 |
| **kiwipete — no ep** | 305.2 / 309.5 | 306.3 / 314.6 | **304.7 / 307.4** | 305.8 / 310.2 | −1.07 / −2.88 | −1.54 / −7.25 | 0.9985 / 0.9931 |
| position-3 — no ep | 171.2 / 169.0 | 170.4 / 174.1 | 174.6 / 170.7 | 171.5 / 171.8 | +3.12 / −1.13 | +4.23 / −3.50 | 1.0197 / 1.0097 |
| ep set, no capture | 310.0 / 315.3 | 313.0 / 318.8 | 315.0 / 314.8 | 313.7 / 316.4 | +1.32 / −1.67 | +2.02 / −4.06 | 1.0161 / 0.9984 |
| ep set, capture available | 301.4 / 303.1 | 422.1 / 438.9 | 422.2 / 427.9 | 424.7 / 426.9 | −2.53 / +0.99 | +0.09 / −11.01 | **1.4008 / 1.4116** |

**The bar, read off the ticket's own `## Security / NFR triggers` block rather than recalled:**
`zobristKey` within **1.5x** of the audit's **288–306 ns** at kiwipete (→ 432–459 ns) and **~300 ns**
at startpos (→ ~450 ns).

**startpos 296.8–299.3 ns and kiwipete 304.7–307.4 ns — BOTH MET, with better than 30% headroom.**

## 4. The instrument's own limit, which is the part worth reading

**The whole-key instrument CANNOT resolve the two guards' cost, so no number is claimed from it.**
Every `shipped − preguard` delta above sits inside the identity twin's own per-cell band, and the
deltas **flip sign between the two samples** (startpos −0.69 then −3.24; kiwipete −1.54 then −7.25).
The twin's per-round band on byte-identical code ran from **−83.79 to +272.36 ns** at its worst cell.
A quantity whose sign is not stable is not a measurement.

**Measured instead on the predicate in isolation, in a process that does nothing else** — no Proxy
probe, no equivalence sweep, both of which are known on this ticket to poison inline caches — 21
rounds × 500,000 iterations, medians, where the identity twin reads **±0.04 ns** on the tight cells:

| cell | pre-guard | shipped | twin | NULL | **guards** | noearly | L11 | inloop | G16 |
|---|---|---|---|---|---|---|---|---|---|
| NO ep square at all | 4.40 | 4.33 | 4.36 | −0.04 | −0.08 | 5.99 | +1.67 | 4.34 | +0.01 |
| ep set, no capture at all | 8.42 | 9.30 | 9.30 | −0.01 | **+0.88** | 10.93 | +1.63 | 8.70 | −0.59 |
| ep set, capture available | 138.13 | 131.41 | 135.73 | −4.33 | −6.73 | 133.88 | +2.47 | 133.53 | +2.12 |
| ep set, pseudo-legal only | 129.25 | 130.80 | 130.13 | +0.67 | +1.56 | 133.74 | +2.93 | 129.76 | −1.05 |
| INVALID: no pawn to capture | 123.38 | 5.35 | 5.52 | −0.17 | **−118.03** | 6.29 | +0.94 | 8.47 | +3.12 |
| INVALID: ep target occupied | 123.26 | 5.39 | 5.55 | −0.16 | **−117.87** | 6.28 | +0.89 | 8.48 | +3.09 |

**What this supports:** the guards cost **about +0.9 ns** on the ep-set/no-capture shape = **≤ +0.15
ns amortized per node** at the measured 15.70% ep frequency, about **0.05%** of a ~305 ns key; they
are **below resolution** where a capture exists; and they are **23x cheaper (123.4 → 5.4 ns)** on the
invalid-FEN class they exist for.

**What it does NOT support, and this is a second null control — by structure, not by identity:** the
`L11` column reads **+0.89 to +2.93 ns on cells where that deletion's delta is STRUCTURALLY ZERO**
(an ep square is set, so the deleted early return is never taken). Two different-but-equivalent module
texts differ by 1–3 ns from compilation shape alone, which the identity twin cannot catch because the
twin is the *same* text. **So no point estimate for the early-return deletion survives** — including
the "+1.6 ns" the interrupted run wrote into `src/zobrist.nfr.test.ts`, which I withdrew.

## 5. The call-count sub-bar — reproduced to the node

`zobrist.ts` copied outside the repo with **one import specifier** changed, its body verified
identical to the shipped file by diff after excluding that line, importing a shim that counts and
delegates to the real predicate. The walk's roots and depths were **read out of `src/perft.test.ts`**
rather than recalled.

```
startpos     depth 4  nodes 206604  ep 64698
kiwipete     depth 3  nodes  99950  ep  4196
position-3   depth 4  nodes  46256  ep  2295
position-4   depth 3  nodes   9738  ep   677
position-5   depth 3  nodes  63910  ep  5432
position-6   depth 3  nodes  92016  ep  4099

TOTAL nodes hashed                      518474
nodes carrying an ep square              81397   (15.70%)
nodes with NO ep square                 437077
hasLegalEnPassant calls                  81397
  ... of those, on a NO-EP node              0     <- THE SUB-BAR
max predicate calls per zobristKey call       1
calls == ep-set nodes ?                    true
zobristKey impure at a node                   0
```

**My first attempt at this walk recursed one level short and returned 18,357 nodes.** I am recording
that rather than only its replacement: the earlier figures count nodes at depths 0..`fast`, mine
initially counted 0..`fast−1`. Corrected, it reproduces **to the node**.

## 6. The purity attack, and its control

```
population                                                  cases    impure  threw
6 board shapes x 200 boards x 139 epSquare values x 2 sides
  plain / offBoardJunk / kingless / manyKings / allPawns / dense
  epSquare: NO_SQUARE, every index 0..127, -2, -16, -256,
    -999, 128, 256, 999, NaN, Infinity, -0.5, 0.5
  SHIPPED tree                                             336000         0      0
  PRE-GUARD tree 584defa (the code the owner declined)     336000    14341      0
  guard (a) deleted alone                                  336000         0      0
  guard (b) deleted alone                                  336000    >0 (impure on 5 of 13 known)
```

**0 against 14,341 on the identical population is the result.** The control is the real pre-guard
tree, not a synthetic one, which is the strongest available: it is exactly the code the owner refused.

All **13** known reproductions answer `false` and are byte-pure on the shipped tree. On the pre-guard
tree, 6 of those 13 corrupt — reproduced and printed, e.g. `4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1` →
`4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1` (a phantom black pawn on d5 from a single `zobristKey` call).

## 7. The two equivalent cost mutants, measured rather than argued

- **Both survive all 214 tests** — verified by applying each to the repository's own `src/` and
  running the suite (214 passed both times).
- **Both behaviour-equivalent over 83,400 inputs** of my own construction: `answerDiff=0`,
  `keyDiff=0`, `purityDiff=0` for each.
- **No spied call count distinguishes either: 0 of 9 call shapes**, at the predicate AND through
  `zobristKey`. `makeMove` / `unmakeMove` / `isSquareAttackedBy` read `0/0/0` on seven shapes and
  `1/1/1` on the two where a probe is played, identically for all three trees.
- **`zobristKey` is the ONLY production caller of `hasLegalEnPassant`** — grepped across non-test
  `src/`. Its `epSquare !== NO_SQUARE` guard short-circuits, so the early-return deletion's cost is
  structurally zero in production.
- **The Proxy instrument is unusable on this code.** A Proxy over the `Uint8Array` board **throws**:
  `TypeError: this is not a typed array`, from `kingSquareOf`'s `board.indexOf`. With a
  function-binding shim it runs and costs **11.09x / 13.20x / 13.60x** across three call shapes, and
  its mere presence in the process inflates the *un-instrumented* readings from 131.4 → 257.8 ns,
  9.3 → 27.6 ns and 5.4 → 13.1 ns (**2.0–3.0x**).

## 8. The deletion-combination table, re-derived on the test file's own probe FENs

```
                                        4k3/8/8/8/8/8/p7/4K3 b - - 0 1   4K3/8/8/8/8/k7/p7/R7 b - - 0 1
shipped (nothing deleted)               false, board untouched            false, board untouched
early return gone, both guards present  false, board untouched            false, board untouched
+ guard (a) gone                        false, board untouched            false, board untouched
+ guard (b) gone                        false, board untouched            false, board untouched
+ BOTH guards gone                      TRUE,  index 15: 0 -> 1           false, index 15: 0 -> 1
```

Confirmed against the real suite: with the early return and both guards deleted,
`src/zobrist.nfr.test.ts` reports **2 failed / 2 passed** — both cases of that block fail, the first
on its return value and the second on the byte assertion. `Z1` and `Z4` each report **1 failed /
3 passed**, the failure being the spied zero-call assertion.

## 9. CONFIRMED / COULD-NOT-CONFIRM against the interrupted run — the explicit split

**Confirmed independently, to the figure:**

- Suite **214 / 0 failed / 0 skipped** across 9 files; lint, typecheck, build all exit 0.
- The call-count sub-bar: **518,474 nodes / 81,397 ep-set (15.70%) / 437,077 no-ep / ZERO predicate
  calls on no-ep nodes / max 1 per key / 0 impure**. Reproduced to the node.
- **Both bar positions MET with room** — the verdict, not the digits.
- **The whole-key instrument cannot resolve the guards' cost.** Reached here by two independent
  routes: deltas inside the identity twin's band, and deltas that flip sign between samples.
- **The MEDIUM is closed at HIGH confidence** against a non-vacuous control.
- **`Z1` and `Z4` are killed by `src/zobrist.nfr.test.ts`.**
- **The uncommitted test-file edit is comment-only** and **its four-combination table is correct**.
- **No spied call count distinguishes the two cost mutants** (0/9), and both survive all 214 tests.
- **The guards' isolated cost of about +0.9 ns** on the ep-set/no-capture shape — I read **+0.88 ns**.
  This one the interrupted run's `claim.md` listed as *not* confirmed; on my protocol it reproduces.

**Could NOT confirm — my figures are the record and the difference is stated:**

- **startpos `300.8–302.5 ns` / kiwipete `309.3–313.1 ns`.** I read **296.8–299.3** and
  **304.7–307.4**. Same order, about 1–1.5% apart. Both MET either way with >30% headroom.
- **The worst-case ep shape at `1.446–1.458x`, one round touching `1.510x`.** I read
  **1.401–1.412x**. The first gate read 1.385–1.400x. Three protocols, three answers about **±4%**
  apart — which is itself the evidence for that run's withdrawal of the earlier "the spread is
  resolved" claim. **I uphold the withdrawal.** Not a bar position.
- **The `+1.6 ns` early-return figure** written into `src/zobrist.nfr.test.ts` (and `+1.42–1.71 ns`
  in that run's own `claim.md`). **Not supportable by my instrument** — see §4's structural null
  control. **Withdrawn, not restated at a different number.**
- **The `2.5x` Proxy-deoptimisation figure.** I measure something different and larger: the Proxy
  **does not run at all** without a shim, costs **11.1–13.6x** when shimmed, and contaminates the
  un-instrumented path by **2.0–3.0x**. The conclusion is stronger than that run stated; the number
  is not mine.
- **The `133,200`-input hunt and `8,847`-impurity control**, and the `41,700`-input equivalence
  sweep. Different generators; not reproducible as figures. Mine are **336,000 / 14,341** and
  **83,400**. The conclusions match; I do not carry their numbers.
- **The `−157.81 ns` and `−27.42 ns` rejected protocol variants.** I did not run those protocols and
  cannot vouch for those figures. The underlying caution — carry a twin, give the timing run its own
  process — I reached independently and do endorse.
- **"Seventeen notes across four roles."** There are **31**, across **five**.
- That run's `claim.md` `moved:` line asserts the `claimed/ → done/` transition was completed. **It
  was not** — the subtask was still in `claimed/` when I picked it up. I completed it.

## 10. Security review: no finding at any severity

The ticket's "No security trigger" line is upheld on inspection rather than quoted, and re-checked
for what actually changed:

```
eval / new Function / vm / child_process / require in src/       none
fs / readFile / writeFile / http / https / net / fetch /
  process.env / os in src/                                       none
dependencies changed 584defa..HEAD (package.json, lockfile)      none — diff is empty
runtime dependencies declared                                    NONE
secret-shaped strings in the src/ diff 584defa..HEAD             none
imports added or widened in src/legal.ts                         none
executable delta in src/legal.ts                                 4 lines
executable delta in src/zobrist.ts                               0 (doc comment only)
```

**Where the change touches data it did not touch before** — the one genuinely new exposure — is two
board reads that can address out-of-array indices (`board[-1]`, `board[oob]`). On a `Uint8Array` those
return `undefined`; there is no pointer arithmetic and no adjacent memory. **Not a memory-safety
issue in this runtime**, so **V1.4.1 is NOT-APPLICABLE** (and is L2, outside this project's tier).
Saying otherwise would be the inflation this ticket warns against. `compliance_regime` is empty, so no
Compliance Officer hop is owed. There is no logging in `src/` and V16 has no L1 rows, so none is
required — named as a decision on the record, not left as an omission.

## 11. Harness

Nine throwaway scripts in the session scratchpad plus extracted trees (`git archive` of `4c6ed7d` and
`584defa`), a byte-identical twin, a one-import spy tree, three call-counting trees and eight mutant
trees: `bench.mjs` (whole-key, four trees, identity null control), `predbench.mjs` (isolated
predicate, own process), `walk.mjs` (the reachable-population spy), `purity.mjs` (the adversarial
hunt, run against five trees), `equiv.mjs` (the differential equivalence sweep), `callcount.mjs`
(spied call counts across nine shapes), `deltable.mjs` (the four-combination deletion table),
`proxy.mjs` (the Proxy instrument's own cost), `mutrun.sh` (transient mutation with md5-verified
restore). **Not committed** — the same posture every measurement on this project has taken. Every
number is transcribed here with its machine, so nothing depends on the scripts surviving.
