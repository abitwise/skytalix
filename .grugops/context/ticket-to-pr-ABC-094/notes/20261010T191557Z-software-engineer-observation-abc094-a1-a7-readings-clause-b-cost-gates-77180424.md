---
id: 20261010T191557Z-software-engineer-observation-abc094-a1-a7-readings-clause-b-cost-gates-77180424
kind: observation
by: software-engineer
at: 2026-10-10T19:15:57Z
verified_by:
confidence: high
refs:
  - ABC-094
  - ADR-0037
  - ADR-0036
  - ADR-0035
  - NFR-004
  - NFR-006
  - NFR-007
  - NFR-008
  - N-LOAD
  - src/book.ts
  - src/book.test.ts
  - .grugops/context/ticket-to-pr-ABC-094/probe/clause-b-RUN.txt
  - .grugops/context/ticket-to-pr-ABC-094/probe/harness.sh
  - .grugops/context/ticket-to-pr-ABC-094/probe/runs-1.tsv
  - .grugops/context/ticket-to-pr-ABC-094/probe/runs-2.tsv
  - .grugops/context/ticket-to-pr-ABC-094/probe/timing.ts
  - .grugops/context/ticket-to-pr-ABC-094/probe/timing-RUN.txt
  - 20261010T191557Z-software-engineer-decision-abc094-injected-reader-and-warn-sink-probe-holds-no-limb-d14f72cb
supersedes:
---

# `ABC-094`: A1–A7 readings, clause (b), the narrow-set cost, timings and the gates

Base `97223dfe` (wave tip), code commit `8cf395fc`. Apple M3 (Mac15,13), Darwin 25.5.0, Node v26.11.0.
All RUN, none asserted.

**Premise re-verified at `97223dfe`. Not stale.** `book.json` 356,526 B, sha256 `3802f52f…41d`; `format` 1,
`maxPly` 12; 5,390 keys; start position 20 moves; after `1. e4` 19 replies, `n` "King's Pawn Game"; 1,764
empty-`m` entries; `seededRandom` at `src/levels.ts:61`; 0 production `node:` importers; no `src/book*`.
**No overlap with `ABC-083`:** this diff is `src/book.ts` and `src/book.test.ts` only, and imports
`legal.ts`, `position.ts`, `zobrist.ts` (production) plus `levels.ts`, `apply.ts`, `fen.ts` (test).

**Red first (test note 2).** Against a stub that always returns nothing and never warns: 21 of 26 red.
`A5` and all of `A6` were red on the warning count (exactly 1), so the always-nothing stub did NOT pass
them for the wrong reason (test note 3). Green on the stub: the two out-of-book `A1` rows, the `A7` pair
and the oversize-fixture sanity row, as expected.

**Per criterion (`src/book.test.ts`, 26 tests, one file, 0 spawns):**
- **A1.** Start position: the returned move is in `legalMoves(startpos)` and among the file's `m` for that
  key (read from the file, no literal pin). Absent key (K+R endgame, asserted absent from the file) and
  present-with-empty-`m` (found by breadth-first walk over book moves): nothing, 0 throws, 0 warnings.
- **A2.** Two fresh module instances (`vi.resetModules()` + `import()`), each with its own reader and
  `seededRandom(2026)`: 100 picks on the start position, identical element for element. In-process,
  as the page prefers; 0 spawns.
- **A3.** After `1. e4`, seeds 1–10, one pick each: distinct count asserted ≥ 3 (count only).
- **A4.** 8:1:1 fixture, seed 42, 1,000 draws: **796 / 106 / 98**, each within ±5 pp, pinned exactly.
  Matches BA/PM's independent reading in `…fe340299`. Plus the cumulative mapping at 0, 0.79, 0.8, 0.9999.
- **A5.** Reader is a real `readFileSync` of an absent path: 0 reads at construction; 50 calls, 0 throws,
  50 × nothing, **exactly 1** warning, 1 read in total; `process.stdout.write` and `process.stderr.write`
  spied, **0 calls** each. The stderr binding is `ABC-095`'s (decision `…d14f72cb`).
- **A6.** 12 inputs × 50 calls, each 0 throws, all nothing, exactly 1 warning: empty; truncated
  mid-record (the real file cut inside an `m`, in memory); not an object; format 2; key not 16 hex; `m`
  not pairs; weight 0; weight 1.5; move not UCI; **`e2e5` under the start key (illegal)**; **1,048,577 B**
  (the real book space-padded, so only size refuses it); invalid UTF-8. Plus: an illegal move beside a
  legal one weighted 1,000,000 is never returned; an illegal move met later returns legal before and
  nothing after with 1 warning; a hostile key with ESC yields a warning of printable ASCII only.
- **A7.** Comment-stripped source of `src/book.ts`: 0 `eval`, `Function(`, `import(`, `require`, `fetch`,
  `WebSocket`; every import specifier starts `./`; 0 `process`.

**Mutations (each applied to a copy of `src/book.ts`, restored, `cmp` verified):** M1 skip the legality
re-check → 3 red; M2 warn on every call → 16 red; M3 weights ignored → 2 red; M4 always the first move
→ 3 red; M5 read at construction → 14 red; M6 no size bar → 1 red; M8 `Math.random()` instead of the
injected `random` → 3 red (A2, A4 ×2). M7 (a module counter) changed no output; a no-op, not evidence.

**`ADR-0036` clause (b)** (`node .grugops/context/design-F-072-1/probe/clause-b.mjs 97223dfe 8cf395fc 1|2|3`,
`probe/clause-b-RUN.txt`): production files changed 1 (`src/book.ts`). Limb 1: (b1) 0, (b2) 3 new edges
reaching 0 holders. Limb 2: (b1) 0, (b2) 0 reaching a holder. Limb 3: (b1) 0, (b2) 0. Word hits 0.
**All three: "does not fire".** Baseline at head: 37 production files; limb-2 holders still `cli.ts`,
`glyph-mode.ts`, `perft-bench.ts`.

**`N-LOAD` and the 30 ms hit bar** (outside the suite, `probe/timing.ts`, 5 runs, load1 ≈ 9): construction
0 reads, 0.036–0.044 ms. First call (read + decode + `JSON.parse` + schema + one hit) **6.93–8.13 ms**.
1,000 hits alternating start / after `1. e4`: median 0.016–0.018 ms, p99 0.073–0.083 ms, max **0.74–0.88
ms**. `N-LOAD`: **MET in its first form** (0 filesystem operations at construction), and the lazy load is
also under 100 ms. Hit bar ≤ 30 ms: MET on this machine. The reference names Node v24.12.0; this host has
v26.11.0, so the reference reading is `UNKNOWN - verify`.

**Cost (`ADR-0035` decision 2; narrow set = `src/book.test.ts`, added; no `src/` file modified).** By path,
three out-of-tree trees (base = one-assertion placeholder, no `src/book.ts`; head; twin `diff -r -x
node_modules` identical), 9 rounds, round 0 dropped, rotated, counts asserted (1 / 26 / 26).
- Run 1 (load1 8.47–9.55): treatment median **+0.400 s**, x(2)..x(7) +0.34..+0.60; twin median +0.050 s =
  **3.1%** of the 1.64 s file CPU, signs 5+/2−/1 zero, R 0.42 s.
- Run 2 (load1 8.55–10.66): treatment median **+0.480 s**, +0.40..+0.68; twin median +0.060 s = **3.3%**,
  signs 4+/4−, R 0.23 s.
- **Both readings are INADMISSIBLE** (twin median > 1.5%), so no state is written: not MET, not NOT MET.
  Neither lower interval end exceeds 650 ms. Re-read on a quieter host is owed. The host was shared with
  `ABC-083`'s build.
- Counts: **1** new test file (pin ≤ 2), **0** spawns (pin ≤ 2). Floor account: 1 × 160 ms by count.

**Gates at `8cf395fc`.** `npm run lint` exit 0 (104 files); `npm run typecheck` exit 0; `npm run build`
exit 0; `npm test` exit 0, **54 files, 1,706 tests** (53 / 1,680 + 1 / 26), 6.93 s (real 7.47 s, user
33.65 s, sys 3.09 s, load1 7.4); skip count 0; `test-skip-integrity.js` "No findings."; `lane-inventory.js`
"No findings." after commit. `PUZZLE_DEEP` not triggered (no engine file touched).
