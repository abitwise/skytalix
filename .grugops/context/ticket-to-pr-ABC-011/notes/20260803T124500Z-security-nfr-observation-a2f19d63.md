---
id: 20260803T124500Z-security-nfr-observation-a2f19d63
kind: observation
by: security-nfr
at: 2026-08-03T12:45:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-009
  - ABC-010
  - ABC-020
  - NFR-005
  - EPIC-004
  - EPIC-006
  - src/zobrist.ts
  - src/legal.ts
  - src/position.ts
  - src/apply.ts
  - src/fen.ts
  - src/zobrist.nfr.test.ts
  - plans/nfr-catalog.md
supersedes: 
---

# What this gate measured itself, the ASVS L1 sweep, and the two defect mechanisms

Neutral record so the verdict beside it can be checked rather than believed. Everything below was run
by me on **Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64**, `UNKNOWN - verify` on any other
hardware. Benchmarks and mutation probes ran from the session scratchpad against the repo's `src/` by
absolute path plus a `git archive` extract of `4c6ed7d`; the repository's own `src/` was mutated only
transiently, with both files backed up and restored, and `git status` confirmed clean afterwards.

## 1. Gates, exactly as they ran

```
BEFORE my test (branch tip 6c6b6d6)   189 passed / 8 files / 0 failed / 0 skipped
AFTER  my test                        193 passed / 9 files / 0 failed / 0 skipped
skip count      0        npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'
npm run lint    exit 0   (2 pre-existing biome config-schema infos, present at 4c6ed7d)
npm run typecheck exit 0
npm run build     exit 0
```

Machine captured rather than assumed: `sysctl hw.model` = **Mac15,13**, `machdep.cpu.brand_string` =
**Apple M3**, `uname -mrs` = Darwin 25.5.0 arm64, `node -v` = **v24.12.0**. Same machine class the
baseline and both prior hops used, so the ratios are comparable.

## 2. NFR-005 per-call cost — my own run

Both trees imported in ONE process; separate `Position` instances per tree, because the shipped key
transiently mutates and the baseline does not, so sharing one object would let one tree's behaviour
leak into the other's cell. 300,000 iterations per cell after a 50,000 warm-up. Each cell sampled
twice, **base→shipped then shipped→base**, so drift hits both variants equally.

| position | merged (`4c6ed7d`) | ABC-011 | ratio | key vs merged |
|---|---|---|---|---|
| startpos — no ep | 296.8–340.7 ns | **297.2–298.4 ns** | 0.872–1.006 | same |
| kiwipete — no ep | 318.4–334.0 ns | **323.5–330.9 ns** | 0.969–1.039 | same |
| position-3 — no ep | 165.8–165.8 ns | 166.2–166.8 ns | 1.003–1.007 | same |
| ep set, no capture at all | 309.1–310.1 ns | 307.4–378.2 ns | 0.991–1.224 | **CHANGED** |
| ep set, capture available | 300.6–301.6 ns | 417.6–420.8 ns | **1.385–1.400** | same |
| ep set, pseudo-legal only (divergence FEN) | 147.8–148.2 ns | 260.6–261.0 ns | 1.759–1.766 | **CHANGED** |

The two `CHANGED` rows are the fix working and are the correct direction: the ep component no longer
enters the key where no legal capture exists. The `same` row at "capture available" is the regression
guard holding.

**Reported as measured, not smoothed:** the "ep set, no capture" shipped cell sampled 307.4 and 378.2
ns on the two runs — a wide spread on one cell. It is not a bar position; both samples are far under
any ceiling. I did not re-run it to get a tidier number.

**Cross-check against the two prior hops** (their numbers, not re-derived here — this is the
comparison, not a re-measurement):

| quantity | design hop | dev hop | **this gate** |
|---|---|---|---|
| startpos, no ep | 1.00–1.07x | 302.9–306.5 ns | **297.2–298.4 ns** |
| kiwipete, no ep | 1.00–1.07x | 309.1–315.6 ns | **323.5–330.9 ns** |
| worst-case per-call shape | 1.45–1.48x | 1.357–1.383x | **1.385–1.400x** |
| divergence FEN | — | 1.771–1.858x | **1.759–1.766x** |

My worst-case figure sits **between** the other two, which is the useful result: the design hop and
the dev hop did not disagree, they bracketed it.

## 3. The sub-bar, spied on my own instrument

`zobrist.ts` copied outside the repo with only its two import specifiers changed — body verified
identical to the shipped file with `cmp` after stripping the import block, not by eye — importing a
shim that counts and delegates to the real predicate. Depth-3 walk of all six perft roots:

```
nodes hashed                 277,955
nodes carrying an ep square   17,663
nodes with NO ep square      260,292
hasLegalEnPassant calls       17,663
  ... on a NO-EP node:             0     <- the sub-bar
max predicate calls per zobristKey call: 1
calls == ep-set nodes ?               true
```

**Identical to the Engineer's figures to the node.** Two scripts written independently, same six
numbers.

## 4. The new guard, and proof that each assertion bites

`src/zobrist.nfr.test.ts`, 4 assertions. Each mutant was applied to the repository's own `src/`, the
new file run, and both files restored from backup:

| mutant | applied to | result | which assertion failed |
|---|---|---|---|
| `Z1` reorder `hasLegalEnPassant(p) && p.epSquare !== NO_SQUARE` | `zobrist.ts` | **KILLED** | `expected "hasLegalEnPassant" to be called +0 times, but got 1 times` |
| `Z4` drop the `epSquare` guard, predicate only | `zobrist.ts` | **KILLED** | same assertion |
| `L11` delete `if (target === NO_SQUARE) return false;` | `legal.ts` | **KILLED** | both probe cases |

Under `L11` the two probe FENs fail differently, which is the point of having both:

```
probe 1  4k3/8/8/8/8/8/p7/4K3 b - - 0 1   AssertionError: expected true to be false
probe 2  4K3/8/8/8/8/k7/p7/R7 b - - 0 1   AssertionError: expected [ 4, +0, ... ] to deeply equal [ 4, +0, ... ]
```

**Probe 2 is this gate's own construction and it is the one that justifies the byte assertion.** Its
geometry: black pawn a2 is the only ep-probe candidate; the black king on a3 is discovered to the
white rook on a1 the moment that pawn steps off. So under `L11` the probe move is illegal, the
predicate returns the **correct** `false`, and only the board tells you anything happened. Verified
directly before writing the test:

```
FEN  4K3/8/8/8/8/k7/p7/R7 b - - 0 1
epSquare  -1     returns  false   <- CORRECT even under the mutant
changed indices  [15]    index 15: 0 -> 1   onBoard=false
```

## 5. The off-board write mechanism, traced rather than accepted

Under `Z1`+`L11` on `4k3/8/8/8/8/8/p7/4K3 b - - 0 1`:

```
changed board indices after ONE zobristKey call: [15]
  index 15: 0 -> 1   onBoard(0x88 test)=false   withinAllocation(<128)=true
toFen before  4k3/8/8/8/8/8/p7/4K3 b - - 0 1
toFen after   4k3/8/8/8/8/8/p7/4K3 b - - 0 1
toFen sees it? NO — the damage is invisible to toFen
```

Mechanism: `epSquare` is `NO_SQUARE` = **-1**; with the internal guard gone, `target = -1` and
`rank = target + 16 = 15`; `from = 15 + 1 = 16` is square a2, which holds the black pawn, so the
probe runs. `makeMove` clears the "captured" pawn's square at `to + 16 = 15`; `unmakeMove`'s
`undoSpecial` writes the assumed white pawn back onto **15**. The `to = -1` writes themselves are
discarded by the runtime.

**Runtime behaviour of an out-of-allocation typed-array write, probed directly:**

```
probe[-1]=9  -> read back undefined    (write DISCARDED, no memory touched)
probe[999]=9 -> read back undefined    (write DISCARDED, no memory touched)
probe.length still 128, byteLength 128
```

So index 15 is **inside** a 128-byte allocation, and the two ways an index could leave that
allocation are both no-ops. **Not a memory-safety issue in this runtime.** The invariant it breaks is
`src/position.ts`'s own (`"Off-board squares stay EMPTY and are never read"`), which
`kingSquareOf`'s whole-array `board.indexOf(KING | colour)` scan explicitly cites as its
justification. The mutant writes a PAWN byte (1), not a KING byte (6 / 14), so this mutant does not
fool that scan — but it is the invariant the scan depends on.

## 6. QE's new defect, reproduced here against both trees

| FEN | ABC-011 `zobristKey` | merged `zobristKey` | ruled ORACLE | `generateMoves` offers ep? | predicate |
|---|---|---|---|---|---|
| `4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1` | **CORRUPTED** → phantom black pawn d5 | unchanged | `true`, **corrupts identically** | yes | `true` — agrees |
| `4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1` | **CORRUPTED** → d5 pawn turns black | unchanged | `true`, **corrupts identically** | yes | `true` — agrees |
| `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` | **CORRUPTED** → phantom white pawn e4 | unchanged | `false`, **stays clean** | **no** | `true` — **DIVERGE** |

Both of QE's claims are confirmed: the first two are the oracle's own pre-existing fault reproduced
faithfully, and the third is a genuine predicate-vs-oracle divergence that belongs to `ABC-011`. The
`merged` column is mine and is the one that establishes the property is **new** — the pre-`ABC-011`
key is pure on all three.

**Reachability, traced to every write site rather than argued.** `grep` for `epSquare = ` across
non-test `src/` returns exactly two:

```
src/fen.ts:175    position.epSquare = square;      // parseFen — validates the field is a square NAME only
src/apply.ts:163  position.epSquare = undo.epSquare;  // unmakeMove — restores a prior value
src/apply.ts:139  position.epSquare = isPawn && Math.abs(move.to - move.from) === DOUBLE_PUSH
                                        ? (move.from + move.to) / 2 : NO_SQUARE;
```

`apply.ts:139` derives the square as the **midpoint of a double push**, which guarantees both the
capturable pawn and the empty target. `parseFen` performs no board-consistency check at all. So the
trigger class is **invalid FEN only** — `ABC-010`'s surface, which this ticket's `## Out of scope`
carries.

## 7. ASVS L1 sweep — 70 requirements, and what is honestly applicable

The checklist ships all 345 ASVS 5.0 rows; filtered at `security.asvs_level: L1` the active set is
**70**. Counted from the file rather than estimated: V1 × 8, V2 × 4, V3 × 8, V4 × 2, V5 × 4, V6 × 13,
V7 × 6, V8 × 4, V9 × 4, V10 × 5, V11 × 3, V12 × 3, V13 × 1, V14 × 2, V15 × 3. V16 and V17 have **no**
L1 rows.

**Not-applicable by absence of the surface they name — said plainly rather than padded into a table
of passes.** This is a dependency-free chess rules library with no entry point until `EPIC-006`:
no authentication (V6, 13 rows), no sessions (V7, 6), no authorization (V8, 4), no tokens (V9, 4), no
OAuth/OIDC (V10, 5), no web frontend / browser / cookies (V3, 8), no file handling (V5, 4), no
network or TLS (V12, 3), no API surface (V4, 2), no sensitive or personal data (V14, 2). Most of V1
likewise: no HTTP responses, no URLs, no SQL, no OS calls, no HTML, no XML parser.

**Verified rather than assumed, for the rows where absence is checkable:**

```
eval / new Function / vm / child_process / require in src/   none
fs / readFile / writeFile / http / https / net / fetch /
  process.env / os in src/                                    none
dependencies changed 4c6ed7d..HEAD (package.json, lockfile)   none — diff is empty
runtime dependencies declared                                 NONE
secret-shaped strings in the 4c6ed7d..HEAD diff               none
```

**The four rows worth naming rather than dismissing:**

- **V11.4.1** — approved hash functions. **NOT-APPLICABLE**, and named precisely because it is the
  row a scanner or a hurried reviewer *would* flag: this change lives in a module called "hashing"
  that seeds its table from `splitmix64` with a hardcoded constant (`0x1234567890abcdefn`). The
  requirement's own scope is *"general cryptographic use cases, including digital signatures, HMAC,
  KDF, and random bit generation."* A Zobrist key is a position-identity key for game logic; no
  signature, no HMAC, no KDF, no security decision rests on collision resistance. The fixed seed is a
  deliberate **requirement** — the module documents that `Math.random` is avoided so keys are
  reproducible within and across runs — not a weak-randomness defect. Flagging it would be
  gold-plating; passing over it silently would leave the next reviewer to re-derive all of this.
  (The neighbouring **V11.5.1**, CSPRNG for non-guessable values, is L2 and would be n/a for the same
  reason.)
- **V2.1.1 / V2.2.1** — documented input-validation rules, and input validated to business
  expectations. **PARTIALLY MET**, and the row that genuinely connects to the defect above. FEN is
  this library's one externally-authored input format. `parseFen` validates **structure** — it throws
  `FenError` on a malformed ep field — but not **semantic consistency**: nothing checks that the ep
  target is empty or that a capturable pawn stands behind it. Pre-existing, already ticketed as
  **`ABC-010`**, and explicitly carried by this ticket. `ABC-011` does not create the gap; it adds
  one new consequence to it. Owner: `ABC-010`.
- **V15.1.1 / V15.2.1** — documented remediation timeframes for third-party components, and no
  component in breach. **NOT MET** at the project level: no such policy document exists.
  **Severity overridden from the L1 default `high` to `low`, with the reason stated as this role's
  hard limits require** — the project has **zero runtime dependencies**, this change adds none
  (verified above), and a documentation-policy gap the change neither touches nor degrades is not a
  defect of this change. Recorded so it stays visible rather than dropped, and deliberately **not**
  allowed to block an en-passant hashing fix. Owner: Architect/Design, at `EPIC-006` packaging.
- **V13.4.1** — deployed without source-control metadata. **DEFERRED, not passed.** Nothing is
  deployed and nothing is packaged until `EPIC-006`. Recorded rather than marked green.

**On logging**, since this role's own responsibilities name it: there is none in `src/`, and V16 has
**no L1 rows**, so none is required. For a pure computation library whose error path is a thrown
`FenError` that propagates to the caller, that is proportionate rather than a gap. Named so it is a
decision on the record and not an omission.

## 8. Purity re-verified across my own benchmark positions

`toFen` and all 128 board bytes compared before and after a single `zobristKey` call, on the shipped
tree, for every position in my benchmark table (startpos, kiwipete, position-3, ep-set-no-capture,
ep-set-capture-available, the divergence FEN): **board identical and FEN identical on all six.**

## 9. Harness

Six throwaway scripts in the session scratchpad, plus a `git archive` extract of `4c6ed7d` and a
mutation copy of `src/`: `secbench.ts` (per-call cost + purity), `spy/shim.ts` + `spy/zobrist.ts` +
`spy/walk.ts` (the call-count spy through a `cmp`-verified copy), `mut/offboard.ts` (the double-mutant
mechanism and the typed-array bounds probe), `mut/probe15.ts` (the second `L11` probe FEN),
`defect.ts` (QE's three FENs against both trees plus the oracle). **Not committed** — the same
posture every measurement on this project has taken. Every number is transcribed here with its
machine, so nothing depends on the scripts surviving.

The repository's own `src/` was mutated transiently three times to prove the new assertions fail;
both files were backed up first and restored after, and `git status` showed only the new untracked
test file afterwards.
