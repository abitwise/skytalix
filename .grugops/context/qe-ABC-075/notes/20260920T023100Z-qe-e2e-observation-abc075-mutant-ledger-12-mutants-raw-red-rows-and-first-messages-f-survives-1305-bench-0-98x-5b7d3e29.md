---
id: 20260920T023100Z-qe-e2e-observation-abc075-mutant-ledger-12-mutants-raw-red-rows-and-first-messages-f-survives-1305-bench-0-98x-5b7d3e29
kind: observation
by: qe-e2e
at: 2026-09-20T02:31:00Z
verified_by:
confidence: high
refs:
  - ABC-075
  - ADR-0020
  - ADR-0006
  - NFR-005
  - src/zobrist.ts
  - src/zobrist.test.ts
  - src/zobrist.nfr.test.ts
supersedes:
---

# `ABC-075` mutant ledger — twelve mutants against `src/zobrist.ts`, raw red rows and first failure messages; (f) is the one survivor and the bench reads it at 0.98x

**Not a stamp.** Read, run and reverted at this hop. Harness: `raw-mutants-harness.mjs.txt`
(exact-string patch → assert the anchor matched exactly once → `npx vitest run src/zobrist.test.ts
src/zobrist.nfr.test.ts --reporter=json` → if 0 red, `npx vitest run --dir src --reporter=json` →
`git checkout -- src/zobrist.ts` → assert `git status --porcelain -- src` EMPTY and the file's bytes
equal the original). Full JSON with every red row: `raw-mutants-summary.json.txt`. Row names are
vitest `fullName`s; the "expected […(N)]" form is the `mismatches`/`drift` array's length, capped
at `MAX_REPORTED = 10`. Load 1-min 6.8–12.9 across the campaign (per-mutant sample in the JSON).

## The twelve, with the patch each made

| id | patch (in `zobristKeyAfterMove` unless said) | numstat | red / green (two files) |
| --- | --- | --- | --- |
| (a) | `position.epSquare !== NO_SQUARE && capturerAdjacent(position)` on the incoming ep file, with a 9-line helper that looks for a side-to-move pawn beside the pushed pawn | +13 −1 | **4 / 31** |
| (b) | `const castlingChanged = undo.castling ^ undo.castling;` | +1 −1 | **5 / 30** |
| (c) | `FLAG_EN_PASSANT` branch body emptied | +1 −1 | **5 / 30** |
| (d) | landing XOR uses `move.piece` instead of `board[move.to]` | +1 −1 | **1 / 34** |
| (e) | `let key = keyBefore;` (no `BLACK_TO_MOVE`) | +1 −1 | **9 / 26** |
| (f) | first statement `if (keyBefore === keyBefore) return zobristKey(position);` | +1 −0 | **0 / 35**, then **0 / 1305** |
| (g) | the two rook XORs replaced by `void rook; void rookFrom;` | +2 −2 | **2 / 33** |
| (h) | the `undo.epSquare` line deleted | +0 −1 | **7 / 28** |
| (i) | `enPassantCaptureSquare`: `isBlack ? -16 : 16` | +1 −1 | **5 / 30** |
| (j) | `const kingside = fileOf(move.to) !== 6;` | +1 −1 | **2 / 33** |
| (k) | in `zobristKey`: `epSquare !== NO_SQUARE && hasLegalEnPassant(position)` + the `legal.ts` import back | +2 −1 | **19 / 16** |
| (l) | ordinary-capture `else if` body emptied | +1 −1 | **5 / 30** |

## Red rows per mutant (first message, truncated)

**(a)** `A1/A2 — 0 mismatches and 0 drift within 2 plies of every perft position` :: `expected [ …(10) ] to deeply equal []`; `A3/A4 … ep set, no capture at all (1.e4)` :: `[…(10)]`; `A3/A4 … ep set, capture legal (d4xe3)` :: `[…(10)]`; `A3 — the ep-capture delta itself was exercised …` :: `[…(7)]`. Note what is GREEN under (a): the pinned pair (`7k/8/8/K1Pp3r`), e5xd6 and the b-file pair — on those boards a capturer IS adjacent, so the mutant agrees with the oracle there. The 1.e4 row is the one that pins the "no capturer at all" half of `A3` class 1 through the delta.

**(b)** the four above (1.e4, d4xe3 with `[…(10)]`; `A3` delta `[Array(1)]`) plus `A3/A4 … castling right survives a blocked rook` :: `[…(10)]`.

**(c)** `A1/A2` :: `[Array(1)]` (exactly one ep capture within 2 plies of the six perft positions); `d4xe3` `[…(10)]`; `e5xd6` `[…(10)]`; `b-file` `[…(7)]`; `A3` delta `[Array(1)]`.

**(d)** `A1/A2` :: `[…(10)]` — the only row. The promotions come from position-4 and position-5; no `HAND_PICKED` position promotes within 2 plies. One row is enough to kill, and it is the walk the criterion names; recorded so the next reader knows the promotion component hangs on one row in the default lane (and on the deep row, 80,444 promotions).

**(e)** `A1/A2`, all six `A3/A4` `it.each` rows, `A3` delta, and `A4 — hashes castling RIGHTS, not availability` :: `expected 11793289236348601331n to be 6344976365718358346n`.

**(f)** none. Two files 35 / 35; whole lane `--dir src` **42 files / 1305 / 0 failed**. Bench (`raw-a5-bench-mutant-f.txt`): `zobristKey` 439.6 ns, `zobristKeyAfterMove` 450.4 ns, **ratio 0.98** (tip: 454.1 / 48.9 = **9.29**, `raw-a5-bench-tip.txt`). `oracleMismatchesInSample: 0` in both — the mutant is correct, and it bought nothing.

**(g)** `A1/A2` `[…(10)]`; `blocked rook` `[…(10)]`. **(j)** the same two rows.

**(h)** `A1/A2` and every one of the five ep-set `HAND_PICKED` rows (1.e4, pinned, d4xe3, e5xd6, b-file) and the `A3` delta row, all `[…(10)]` — the pinned pair is red HERE and green under (a): it is the ep file going OUT on the next ply that this row pins.

**(i)** exactly (c)'s five rows with the same counts.

**(k)** `NFR-005 — zobristKey never consults hasLegalEnPassant … asks nothing on any input` :: `ep set, no capture at all: expected "hasLegalEnPassant" to be called +0 times, but got 1 times`; `separates an ep square no capture can use — ABC-075 A3` :: `expected 18311490354223382796n not to be 18311490354223382796n`; `separates an ep square whose only capture is illegal — ABC-075 A3, second case` :: `expected 285777158189409886n not to be …`; `ABC-075 property — the ep component tracks the ep FIELD` :: `rnbqkbnr/1ppppppp/8/p7/8/2N5/PPPPPPPP/R1BQKBNR w KQkq a6 0 2 — ep square carried: true: expected true to be false`; **all six `CONTRADICTORY_EP` rows and all four `EP_CONTRADICTED_BY_THE_WRONG_PIECE` rows** (`carries the ep component and returns the position intact (…)` :: `expected <key>n not to be <key>n`, e.g. `4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1: expected 7032954216434971868n not to be 7032954216434971868n`); then `A1/A2`, 1.e4, pinned, d4xe3 (`[…(10)]`) and the `A3` delta (`[…(7)]`). 19 red / 16 green. The purity half of every one of the ten rows stayed green under (k) — they fail on the KEY line only, which is the line the re-point changed.

**(l)** `A1/A2`, 1.e4 `[…(6)]`, d4xe3, e5xd6, blocked-rook.

## What the ledger says about the suite

- Every delta component named in the `src/zobrist.ts:99–105` docblock has at least one mutant that
  reds at least one row: mover/landing (d), captured (l), ep-captured (c, i), rook's leg (g, j),
  castling flags (b), ep out (h), ep in (a), side (e).
- The oracle rows carry the whole campaign: no mutant of the DELTA reds a row outside the
  `ABC-075 — zobristKeyAfterMove equals the full-scan oracle` block except (e), which also reds the
  direct `A4` row. That is the shape the ticket asked for (the full scan is the oracle) and it means
  the oracle's correctness is load-bearing — which (k) covers from the other side: break the oracle
  and 19 rows say so, ten of them the re-pointed ones.
- (f) is invisible to every assertion in the repository. Not a defect in the build; a gap in the
  instrument, named `G1` in the sibling `decision`.
