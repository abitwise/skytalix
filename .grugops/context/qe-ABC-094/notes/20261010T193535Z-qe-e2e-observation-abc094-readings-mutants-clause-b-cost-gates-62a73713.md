---
id: 20261010T193535Z-qe-e2e-observation-abc094-readings-mutants-clause-b-cost-gates-62a73713
kind: observation
by: qe-e2e
at: 2026-10-10T19:35:35Z
verified_by:
confidence: high
refs:
  - ABC-094
  - ADR-0035
  - ADR-0036
  - NFR-004
  - NFR-006
  - NFR-007
  - NFR-008
  - N-LOAD
  - src/book.ts
  - src/book.test.ts
  - .grugops/context/qe-ABC-094/probe/harness-RUN.txt
  - .grugops/context/qe-ABC-094/probe/mutants-RUN-1-delivered-suite.tsv
  - .grugops/context/qe-ABC-094/probe/mutants-RUN-2-final-suite.tsv
  - .grugops/context/qe-ABC-094/probe/cost-RUN-1.txt
  - .grugops/context/qe-ABC-094/probe/cost-RUN-2.txt
  - .grugops/context/qe-ABC-094/probe/timing-RUN.txt
supersedes:
---

# QE `ABC-094`: per-criterion readings, mutants, clause (b), cost, timings and the gates

This note is hand-authored and unsealed. Machine: Apple M3 (Mac15,13), Darwin 25.5.0, Node v26.11.0. All
readings were RUN by QE, and none is asserted. load1 is recorded with every timing. The host was shared with
the `ABC-083` and `ABC-142` builds.

## Per criterion (QE's harness `qe-harness.ts`, on `8cf395fc` source; 119 checks, 0 fails, `harness-RUN.txt`)

- **A1 MET.**
  - A full sweep of every book position reachable over book moves: 5,679 keys reached, which covers all 5,390
    keys in the file.
  - 3,626 in-book entries each returned a legal move from their own `m`, with `inBook` true.
  - 1,764 entries with an empty `m` each returned nothing, with `inBook` false.
  - 3,620 children with an absent key each returned nothing.
  - 0 throws and 0 warnings.
  - 330 of the reached keys have a leading zero.
  - The file holds the start key `99116e4984517620` with 20 moves. The compiler's key encoding
    (`tools/opening-book/compile.ts:56`) and the probe's agree.
- **A2 MET.** QE ran the check literally, in **two separate OS processes**, with seed 2026: 100 picks on the
  start position and 100 after `1. e4`, identical element for element. The in-process sequence equals the
  child-process one. The SE's suite does it in-process with two fresh module instances, which the ticket's
  `NFR-008` note sanctions.
- **A3 MET.** Seeds 1–10 after `1. e4` give 4 distinct replies: `e7e5`×6, `e7e6`, `b8c6`, `c7c5`×2. This
  equals BA/PM's prediction of 4 for a cumulative picker in file order.
- **A4 MET.**
  - Seed 42 reads 796 / 106 / 98. Seeds 1 and 2026 are also within ±5 pp.
  - An evenly spaced [0, 1) sweep of 1,000 draws lands exactly 800 / 100 / 100.
- **A5 MET (in-module).**
  - A real `readFileSync` of an absent path. 0 reads at construction.
  - 50 `bookMove` and 10 `inBook` calls: 0 throws, 50 × nothing, `inBook` false, exactly 1 warning, 1 read.
  - In-process writes to stdout and stderr: 0 and 0.
  - A reader that throws a non-Error: 0 throws, 1 warning.
  - QE's child-process stderr binding: stdout 0 B, stderr 1 line.
  - The delivered root binding is `ABC-095`'s (`QE-094-a`).
- **A6 MET.** 89 corrupt inputs, each called 50 times (`bookMove` on two positions, plus `inBook`). Every one
  gave 0 throws, nothing or only legal moves, exactly 1 warning, and printable ASCII only. The inputs:
  - the empty file;
  - 64 truncation points across the real file;
  - 16 garbage payloads: key 15/17 hex, uppercase, `__proto__`; `m` a string; a triple; weight 0, −1,
    1.5, `"1"`, 2^53; UCI `E2E4` and `e7e8k`; format `"1"`; positions an array; `null`;
  - 4 illegal-move shapes, including `e2e5` appended to the real book's start entry;
  - the real book padded to 1,048,577 B;
  - 3 EXTRA inputs: invalid UTF-8 inside a string, 1 MB of nested arrays, and a weight sum past 2^53.

  The illegal move is never returned, even when the draw lands on it. An illegal entry met later gives legal
  moves before it, nothing after it, and 1 warning. Boundary: exactly 1,048,576 B is accepted.
- **A7 MET.**
  - TypeScript AST of `src/book.ts`: 0 hits for `eval`, `Function`, `require`, dynamic `import()`, `fetch`,
    `WebSocket`, `XMLHttpRequest`, `EventSource`, `process`, `globalThis`, `import.meta` and `.constructor`.
  - Import specifiers: `./legal.ts`, `./moves.ts`, `./position.ts`, `./zobrist.ts`.
  - The network globals were stubbed to counters: 0 calls over every check.
- **EXTRA.** Promotions `e7e8q`/`n`/`r`/`b` map to piece types 5/2/4/3. The shipped book holds 0 promotions.

## Mutants (34, `mutants.tsv`; runner `mutants.sh`; out-of-tree copy; `src/book.ts` `cmp` 0 after)

- **Run 1, the delivered 26-test suite** (load1 5.75–9.87). 8 non-equivalent mutants stayed green:
  - M01, padStart dropped from the key encoding;
  - M23, size bar `>=`;
  - M25, UTF-8 decoding not fatal;
  - M26, the overflow check removed;
  - M27, the pair-length check removed;
  - M28, the key regex accepts uppercase;
  - M29, promotion letters `n`/`q` swapped;
  - M32, the warning carries the key. The SE's ESC test never reaches the key path:
    `JSON.parse` rejects a raw ESC first ("Bad control character").

  M30 (UCI regex loosened) was green too. It is equivalent only while the garbage sits at the probed key.
  The suite caught:
  - wrong key encodings (M02, M03);
  - every off-by-one in the pick (M04–M07) and ignored weights (M08);
  - an empty-`m` entry counted as in book (M10);
  - a non-book move returned when out of book (M12);
  - illegal moves slipping through (M13, M14);
  - a throw on corrupt input or out of book (M16, M18);
  - a read at construction (M19);
  - a second warning (M20, M21, M22);
  - no size bar (M24), `Math.random` in place of the injected `random` (M31), weight 0 (M33), and `inBook`
    always true (M34).
- **Run 2, the final 35-test suite at `58726139`** (load1 4.00–5.36): **32 of 34 red.** The 2 survivors are
  behaviourally equivalent:
  - M11 keeps empty entries in the map, and `bookMoves` still returns `[]`;
  - M17 removes the inner JSON catch, and the outer catch still turns the error into the warning (only the
    text changes).

  M09 (reverse order) is spec-equivalent. The SE's exact 796/106/98 pin kills it.
- Before the added tests, QE's harness on its own already killed M01 and M25–M29. It did not kill M15
  (spec-equivalent), M23, M30 or M32. The added tests kill M23, M30 and M32.

## `ADR-0036` clause (b) (QE's run of `.grugops/context/design-F-072-1/probe/clause-b.mjs`)

- On `97223dfe..8cf395fc`, limbs 1/2/3: (b1) 0 / 0 / 0. (b2) has 3 new edges (`book.ts` → `legal.ts`,
  `position.ts`, `zobrist.ts`), and 0 of them reach a holder. **All three limbs read "does not fire".**
  `97223dfe..59358836` reads the same.
- Baseline: 37 production files. The limb-2 holders are `cli.ts`, `glyph-mode.ts` and `perft-bench.ts`.
- **Confirmed 0 / 0 / 0.**

## Numstat and overlap

- `97223dfe..59358836 -- src/` reads `src/book.ts` 153/0 and `src/book.test.ts` 359/0. The other changes are
  the ticket, the trace row and `.grugops/context/ticket-to-pr-ABC-094/`.
- `ABC-083`'s branch tip `489c549e` is an ancestor of `97223dfe`. Its uncommitted working set is
  `engine.test.ts`, `evaluate.pawns.test.ts`, `evaluate.ts`, `quiescence.test.ts`, `search.ordering.test.ts`,
  `search.pvs-lmr.test.ts`, `transposition.test.ts` and `evaluate.king-mobility.test.ts`. **Intersection: 0
  files.**
- QE's commit touches `src/book.test.ts` only.

## Cost (`ADR-0035` decision 2; narrow set = `src/book.test.ts`; QE's own `cost.sh`, 4 arms, 9 rounds, round 0 dropped, rotated, counts asserted 1/35/35/26)

- **Run 1, load1 4.14–10.86 (median 4.93): ADMISSIBLE.**
  - The twin median is +0.020 s, which is **1.42 %** of the 1.410 s file CPU (limit 1.5 %). Signs 6+/1−/1
    zero. **R 0.070 s**, which resolves 650 ms.
  - Head − base (QE's 35 tests): **median +0.345 s**, interval +0.330..+0.370.
  - The SE's 26 tests: +0.310 s (+0.300..+0.350).
  - **MET** against 650 ms. The margin on admissibility is thin (0.08 pp).
- **Run 2, load1 9.20–11.56 (median 9.43): INADMISSIBLE.**
  - The twin median is −0.025 s, which is −1.76 % (QE reads the magnitude). Signs 2+/6−.
  - No state is written. Treatment +0.385 s (+0.360..+0.400); SE +0.350 s.
- **Counts:** 1 test file (pin ≤ 2) and 0 spawns (pin ≤ 2). The floor account is 1 × 160 ms, by count.

## Timings outside the suite (`timing-RUN.txt`, 5 runs, load1 10.16)

- **`N-LOAD` MET in its first form:** 0 reads at construction, 0.062–0.077 ms.
- The lazy first call (read + parse + schema + hit) takes 5.36–6.01 ms, which is also under 100 ms.
- 1,000 hits: median 0.013–0.014 ms, p99 0.060–0.063 ms, max **0.75–1.70 ms**. Against the 30 ms bar this is
  **MET on this host**. The reference is Node v24.12.0, so the reference reading is `UNKNOWN - verify`.

## Gates

**At `59358836`, load1 11.8–13.0:**
- lint exit 0 (104 files); typecheck exit 0; build exit 0.
- `npm test` exit 0: 54 files, 1,706 tests, 9.31 s (real 9.94, user 33.63, sys 2.90).
- JSON reporter: 1,706 / 0 failed; skip 0; integrity "No findings."

**At `58726139`, load1 8.75–9.85:**
- lint, typecheck and build exit 0.
- `npm test` exit 0: **54 files, 1,715 tests**, 6.47 s (real 6.92, user 26.95, sys 2.29).
- JSON: 1,715 / 0 failed; skip 0; `test-skip-integrity.js` "No findings."; `lane-inventory.js` "No findings."
  (54 / 54).

**Not run or not applicable:**
- `host-protection.js` exit 2: `UNKNOWN - verify` (gh returned no readable status).
- No `*.uat.spec.ts`, so uat-spec-integrity does not apply.
- `scripts/check-uat-oracles.js` is absent: `UNKNOWN - verify`, non-blocking.
- `PUZZLE_DEEP` is not triggered.
