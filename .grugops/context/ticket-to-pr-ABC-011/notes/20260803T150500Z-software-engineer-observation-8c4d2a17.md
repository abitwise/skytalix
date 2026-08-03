---
id: 20260803T150500Z-software-engineer-observation-8c4d2a17
kind: observation
by: software-engineer
at: 2026-08-03T15:05:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-009
  - ABC-010
  - NFR-005
  - NFR-001
  - ADR-0005
  - src/legal.ts
  - src/zobrist.ts
  - src/legal.test.ts
  - src/zobrist.test.ts
  - src/zobrist.nfr.test.ts
  - src/perft.test.ts
  - 20260803T133500Z-architect-design-observation-9b2e4f17
supersedes: 
---

# What this pass measured itself, on what, and where the instrument gave out

Neutral record so the decision beside it can be checked rather than believed. Everything below was
run by me at this pass. **Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64 — `UNKNOWN - verify` on
any other hardware.** The machine-independent quantity is always the ratio measured in the same
process, never the absolute nanoseconds.

The "pre-fix" tree throughout is a copy of `src/` with the two guard lines deleted. I checked that
copy against the actually-shipped `584defa:src/legal.ts` rather than assuming: the only difference is
the hoisted `const captured`, which is the same expression moved out of the `Move` literal. Recorded
because a benchmark against a baseline nobody checked is a benchmark against nothing.

## 1. The six reproductions, reproduced BEFORE any code was written

Run against the shipped tree, full position state (128 board bytes + all five scalars) compared
before and after a single call. `pred` is the shipped `hasLegalEnPassant`, `oracle` is
`legalMoves(p).some(m => m.flags === FLAG_EN_PASSANT)`.

```
                                          pred   pure    oracle  o-pure  key==noEp
QE-1  4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1     true   FALSE   true    FALSE   false
QE-2  4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1    true   FALSE   true    FALSE   false
QE-3  4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1   true   FALSE   false   true    false
NEW   4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1     true   FALSE   true    FALSE   false
PURE1 4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1  true   true    false   true    false
PURE2 4k3/8/3n4/3pP3/8/8/8/4K3 w - d6 0 1  true   true    false   true    false
BOUND 4k3/8/8/8/8/8/1P6/4K3 w - a1 0 1     false  true    false   true    true
VALID 4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1    true   true    true    true    false
VALID 7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1     false  true    false   true    true
GEN   4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1  true   true    true    true    false
```

The four corruptions, printed rather than described:

```
4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1     ->  4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1      phantom BLACK pawn d5
4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1    ->  4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1      white pawn d5 turns BLACK
4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1   ->  4k3/8/8/8/3pP3/4P3/8/4K3 b - e3 0 1    phantom WHITE pawn e4
4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1     ->  4k3/8/8/8/8/8/pP6/4K3 w - a3 0 1       phantom BLACK pawn a2
```

**Every row reproduces the second design hop's table exactly**, including the two rows that separate
the two guards (`PURE1`/`PURE2`: pure, and still wrong) and the row that kills nothing (`BOUND`).
The `GEN` row is the `generateMoves` defect routed to BA/PM — it still reproduces, and this fix does
not touch it. After the fix every one of these answers `false`, is pure, and hashes equal to itself
with `-`.

## 2. The guards are proven load-bearing by deletion, on the FINAL tree

Each mutant applied to `src/legal.ts` in the repository, full suite run, then restored and the md5
re-checked.

```
both guards (shipped)          total 206  passed 206  FAILED  0   skipped 0
guard (a) deleted   (M-G1)     total 206  passed 202  FAILED  4   skipped 0
guard (b) deleted   (M-G2)     total 206  passed 199  FAILED  7   skipped 0
both deleted        (M-G0)     total 206  passed 193  FAILED 13   skipped 0
```

**M-G1's four failures, all of them:**

```
legal   > answers false and touches nothing (the ep target occupied by an enemy knight)
legal   > answers false and touches nothing (the same, mirrored)
zobrist > omits the ep component and returns the position intact (the ep target occupied by an enemy knight)
zobrist > omits the ep component and returns the position intact (the same, mirrored)
```

**M-G2's seven failures, all of them:**

```
legal   > answers false and touches nothing (no pawn to capture at all)
legal   > answers false and touches nothing (a WHITE pawn where the captured black one should be)
legal   > answers false and touches nothing (an ep square on the wrong rank for the side to move)
legal   > is pure for EVERY ep square value, not merely the reachable ones
zobrist > omits the ep component and returns the position intact (no pawn to capture at all)
zobrist > omits the ep component and returns the position intact (a WHITE pawn where the captured black one should be)
zobrist > omits the ep component and returns the position intact (an ep square on the wrong rank for the side to move)
```

**Disjoint.** M-G0's 193 passing is exactly the pre-fix baseline, which is the cross-check that the
13 new tests are the only ones that move.

Two facts the counts deserve. **M-G1's failures include the key level**, where the design hop's own
sandbox saw only the predicate level fail — because my key-level assertion is "the ep component is
omitted", not only "the position is intact", and on those two FENs purity holds while the *answer*
does not. **M-G2's count is 7 rather than 8** because QE-3's ep target is occupied, so guard (a)
closes it too; that FEN kills only M-G0.

## 3. TDD was red first, and the red was measured

The 13 new tests run against the unmodified tree before either guard existed:

```
src/legal.test.ts + src/zobrist.test.ts:  13 failed | 33 passed (46)
```

The 33 are every pre-existing test in those two files, green before and after — which is how the two
regression guards (the real-capture control and `src/zobrist.test.ts:33-37`) are known not to have
been disturbed.

## 4. The guards change nothing reachable — exhaustive walk, a fifth independent script

`src/perft.test.ts`'s own table at its own `fast` depths, pre-fix and guarded trees imported side by
side in one process, each hashing its own freshly parsed copy. The table was read out of
`src/perft.test.ts` rather than recalled — the design hop lost time to recalled FENs for
`position-5` and `position-6` and recorded it so nobody would repeat it.

```
startpos     depth 4  nodes  206604
kiwipete     depth 3  nodes   99950
position-3   depth 4  nodes   46256
position-4   depth 3  nodes    9738
position-5   depth 3  nodes   63910
position-6   depth 3  nodes   92016

TOTAL nodes visited                            : 518474
nodes with epSquare set                        : 81397   (15.70%)
GUARDS change the predicate's answer on        : 0
GUARDS change zobristKey's key on              : 0
guard (a) (ep target occupied) would fire on   : 0
guard (b) (captured pawn absent) would fire on : 0
pre-fix predicate vs ruled oracle, disagree    : 0
guarded predicate vs ruled oracle, disagree    : 0
pre-fix predicate impure at a node             : 0
guarded predicate impure at a node             : 0
```

**518,474 / 81,397 to the number, a fifth independent time** (design, dev, QE, design-2, and now
this). Neither guard fires once on the reachable population, so they are a precondition rather than a
behaviour change — `ADR-0005`'s falsifier **F5**.

## 5. Cost — and the instrument, which is the part worth reading

**My first protocol was wrong and I am recording it rather than only its replacement.** Two
alternating measurements per variant with min/max put the two `NFR-005` anchors — where the delta is
**structurally zero**, because the caller's `epSquare !== NO_SQUARE` short-circuit never enters the
predicate — at **1.022–1.141x (startpos)** and **1.072–1.263x (kiwipete)**. A guard that is not
executed cannot cost 26%. That is the instrument, and any ep-set number from the same run would have
been worthless.

Re-run with **9 alternating rounds per cell and medians**, keeping the two anchors as an explicit
**null control**:

**Isolated on `hasLegalEnPassant`, 2,000,000 iterations per measurement (ns/call):**

| cell | pre-fix | guarded | delta | ratio |
|---|---|---|---|---|
| ep set, no capture at all | 6.49 | 7.19 | **+0.69** | 1.107 |
| ep set, capture available | 117.32 | 119.90 | **+2.58** | 1.022 |
| ep set, pinned capturer | 126.42 | 128.82 | **+2.40** | 1.019 |
| ep set, two candidates | 211.50 | 211.18 | **−0.32** | 0.998 |
| INVALID: no pawn to capture | 127.04 | **6.32** | −120.72 | **0.050** |
| INVALID: ep target occupied | 150.98 | **6.01** | −144.98 | **0.040** |

**Whole key through `zobristKey`, 300,000 iterations per measurement (ns/call):**

| cell | pre-fix | guarded | delta | ratio |
|---|---|---|---|---|
| **startpos — no ep (NULL CONTROL, delta is structurally 0)** | 291.19 | 291.26 | **+0.06** | 1.000 |
| **kiwipete — no ep (NULL CONTROL, delta is structurally 0)** | 313.36 | 313.57 | **+0.20** | 1.001 |
| ep set, no capture at all | 321.20 | 321.86 | +0.66 | 1.002 |
| ep set, capture available | 436.92 | 436.51 | −0.42 | 0.999 |

**What this supports and what it does not.** The two guards cost **−0.3 to +2.6 ns per predicate
call** on the 15.70% of nodes carrying an ep square = **≤ +0.41 ns amortized per node**, **0.13%** of
a ~313 ns key. That sits **inside the design hop's published +0.9…+3.0 ns band without exceeding its
ceiling** — an independent agreement, on a script that copied none of theirs. The invalid class is
**20–25x cheaper** (127.0 → 6.3 and 151.0 → 6.0), reproducing their 20–27x. The whole-key ep-set
cells (+0.66 and −0.42 ns) are **the same size as the null control's own error**, so they are
reported as measured and no number is claimed from them; that is the same limit the design hop and
Security/NFR each hit, reached here by a different route.

**One caveat the INVALID cells earn:** the pre-fix tree corrupts its own fixture on call 1, so after
that it is timing the full make/unmake on a now-valid board. That *is* the work the guard avoids, so
the comparison is the right one, but it is not a like-for-like board and it should not be read as one.

**`NFR-005`'s bar:** guarded `zobristKey` at **291.3 ns (startpos)** against a ~450 ns bar and
**313.6 ns (kiwipete)** against a 432–459 ns bar — **MET**, with the caveat that the next column owns
the verdict. **The sub-bar is zero structurally**: my guards are inside the callee, after its own
`NO_SQUARE` early return, so a no-ep node executes byte-for-byte what it executed before this pass,
and `src/zobrist.nfr.test.ts`'s four call-count and byte-identity assertions pass **untouched**.

## 6. Gates, exactly as they ran

```
npm test           206 passed (9 files), 0 failed        [baseline on this branch: 193]
skip count         0                                     [npx vitest run --reporter=json | jq ...]
npm run lint       exit 0   (2 pre-existing biome config-schema infos, unchanged)
npm run typecheck  exit 0
npm run build      exit 0
```

`npm run lint` failed once, on my own formatting in `src/zobrist.test.ts` — `biome check --write` on
that one file fixed it, and the diff was re-checked afterwards to confirm it moved **only lines I had
just added** (`git diff` shows zero removed lines in that file).

**No existing test modified, at line level:** `git diff` reports **0** removed-or-changed
pre-existing lines in `src/legal.test.ts` and **0** in `src/zobrist.test.ts`. Both blocks are pure
appends and **no import was widened**, which is stricter than the first pass managed.

**`npm run perft` was deliberately NOT run.** The ticket states `NFR-001` is not at risk and that the
perft lane is not this change's oracle — `src/perft.ts` imports `apply`, `legal`, `moves` and
`position` and never calls `zobristKey`. `legalMoves` is byte-unchanged by this pass. Its 24 tests
are green in the ordinary suite.

## 7. Harness

Four throwaway scripts in the session scratchpad plus a guard-stripped copy of `src/`: `repro2.ts`
(the reproduction table), `sweep2.ts` (the exhaustive walk), `bench2.ts` (the first, wrong protocol,
kept because its null-control failure is the reason the second exists) and `bench2b.ts` (rounds and
medians). **Not committed** — the same posture every measurement on this project has taken. Every
number is transcribed here with its machine, so nothing depends on the scripts surviving; anyone
re-running them should expect to rebuild them from this note rather than find them.
