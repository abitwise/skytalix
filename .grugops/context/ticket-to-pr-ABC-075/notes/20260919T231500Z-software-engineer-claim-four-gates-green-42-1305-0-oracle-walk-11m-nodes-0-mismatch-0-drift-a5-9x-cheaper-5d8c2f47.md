---
id: 20260919T231500Z-software-engineer-claim-four-gates-green-42-1305-0-oracle-walk-11m-nodes-0-mismatch-0-drift-a5-9x-cheaper-5d8c2f47
kind: claim
by: software-engineer
at: 2026-09-19T23:15:00Z
verified_by:
confidence: high
refs:
  - ABC-075
  - ADR-0020
  - ADR-0006
  - NFR-001
  - NFR-005
  - src/zobrist.ts
  - src/zobrist.test.ts
  - src/zobrist.nfr.test.ts
  - src/legal.ts
  - .grugops/test-skips.md
supersedes:
---

# `ABC-075` — the four gates, the oracle walk, and `A5`'s per-node cost, raw

**NOT A STAMP — a `claim`.** No `finding` is admissible on this install (`AGENTS.md`). The
Software Engineer's own runs on branch `grugops/ABC-075-incremental-zobrist` (off
`grugops/wave-2026-09-19` @ `b65f5f1`), in the isolated worktree with the main checkout's
`node_modules` symlinked, every command through a node script (`scratchpad/abc075/gates.mjs`,
`run.mjs`; the hook refuses `npm run`/heredocs). Raw logs beside this note as `raw-*.txt`.
Machine: darwin arm64, Node v24.12.0; two sibling hops live throughout (`qe-ABC-120`,
`ruling-abc079-multiplier`), 1-min load 4.2–7.6 during every run below.

## Gates at the working tree that became the commit (src/ unchanged between run and commit)

| gate | command | result |
| --- | --- | --- |
| lint | `npx biome check .` | exit 0 — `Checked 76 files in 108ms. No fixes applied.` |
| typecheck | `npx tsc --noEmit` | exit 0, no output |
| build | `npx tsc --noEmit` (the build slot's command) | exit 0, no output |
| unit | `npx vitest run --dir src` | exit 0 — **42 files passed (42), 1305 tests passed (1305)**, duration 4.66 s; base **42 / 1297 / 0** → **+0 files, +8 tests** |
| skip count | `--reporter=json` → `numPendingTests + numTodoTests` | **0** (pending 0, todo 0, failed 0, 264 suites) |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.` |
| the two files alone | `npx vitest run src/zobrist.test.ts src/zobrist.nfr.test.ts` | 35 passed (32 + 3); `tests 217ms`, duration 420 ms |

`+8` = `zobrist.test.ts` 23 → 32 (+9: `A1/A2` walk, six `A3`/`A4` `it.each` rows, `A3`
ep-capture-delta row, `A4` rights row; the re-pointed property keeps its count) and
`zobrist.nfr.test.ts` 4 → 3 (two spy rows → one structural row). `self_fix_attempts` spent on
gates: **0** — every gate was green on its first full run. The only red seen was the deliberate
probe run of `zobrist.test.ts` before the new blocks existed (10 failed / 13 passed), which is § 7
of the sibling `decision`.

## `A1`/`A2` — the oracle walk, POST-ruling oracle

- **Default lane (depth 2, six perft positions + six hand-picked):** 0 mismatches, 0 drift; every
  delta component exercised (`epCaptures`, `castles`, `promotions`, `captures`, `epSet`,
  `castlingChanged` all `> 0` asserted).
- **`ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts` (depth 4, the criteria's depth):** exit 0,
  33 passed, **11,024,485 nodes, 0 mismatches, 0 drift**; `epCaptures` 2,104, `castles` 140,151,
  `promotions` 80,444, `captures` 1,665,166, `epSet` 654,732, `castlingChanged` 1,091,068.
  `/usr/bin/time -p`: real 40.61 s, user 40.64 s, sys 0.40 s (load 4.17 at start). The walk feeds
  each node's incremental key to its children (the `ABC-081` array shape), so 0 mismatches at
  depth 4 is 0 mismatches with compounding.

## `A3` — both ep classes, against the post-ruling oracle

Class "ep set, no legal capture": `zobrist.test.ts:49` (the 1.e4 pair) and `:73` (pinned c5xd6),
both flipped to `not.toBe`; walked at depth 2 in `HAND_PICKED` with 0 mismatches. Class "ep set,
capture legal": the d4xe3 pair, the second-capturer pair and the b-file pair, walked at depth 2 with
0 mismatches and the ep-capture delta asserted exercised (`epCaptures > 0` at depth 1).

## `A4` — rights, not availability

`r3k2r/8/8/8/8/8/8/R3KB1R w KQkq` vs `w Qkq`: keys differ with the kingside castle blocked in
both. `f1e2` (castle becomes available, rights unchanged): `undo.castling === position.castling`
and the delta matches the oracle. ADR-0006 not re-opened.

## `A5` — per-node cost, interleaved in ONE process (ticket test note 3)

`scratchpad/abc075/bench.ts` run as `node src/zobrist-bench-abc075.tmp.ts` inside the worktree
(then deleted; not committed). Sample: **6,637** (keyBefore, after, move, undo) tuples reachable
within 2 plies of the six perft positions, cloned once; 0 oracle mismatches in the sample; 20 reps
per round, 9 rounds with the order alternated, 2 warm-up rounds discarded; `process.hrtime.bigint`.

| function | median ns/call | rounds |
| --- | --- | --- |
| `zobristKey` (full scan) | **340.7** | 337.8, 344.0, 336.8, 340.7, 341.6, 343.1, 335.3, 346.9, 332.7 |
| `zobristKeyAfterMove` | **37.1** | 37.1, 37.6, 38.0, 34.8, 36.7, 37.4, 35.6, 36.8, 37.5 |

**Ratio 9.19x** against the ticket's ≥ 5x bar (**met**). The full scan reads 340.7 ns here against
the ticket's 295–304 ns baseline — same order, this machine under sibling load; the ratio is the
number the bar is about and both sides were timed in the same process.

## `A6` — nothing else moved

- `git diff --numstat b65f5f1 -- src/legal.ts` → empty (byte-identical).
- `export function zobristKey(position: Position): bigint` — signature unchanged, `src/zobrist.ts:69`.
- `src/apply.ts`, `src/moves.ts`, `src/position.ts`: 0 occurrences of `zobrist` (graph acyclic, `F6`).
- Suite green, skip 0 (above).
- "`zobrist.test.ts` and `zobrist.nfr.test.ts` pass unchanged" — FALSE as written, per the ticket's
  own § "Ruling applied"; what changed is enumerated in the sibling `decision` § 7–8.

## `NFR-001` / `NFR-005`

`legalMoves` call count per operation: unchanged by construction — the hash no longer calls into
`legal.ts` at all (the structural spy row asserts 0 calls on seven positions). `NFR-005`'s no-ep
path: identical code to before; the ep-set path lost the probe. No catalog target moved; the
catalog was not opened.
