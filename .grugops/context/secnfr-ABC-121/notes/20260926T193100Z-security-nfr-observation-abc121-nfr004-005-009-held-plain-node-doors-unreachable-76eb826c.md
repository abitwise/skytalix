---
id: 20260926T193100Z-security-nfr-observation-abc121-nfr004-005-009-held-plain-node-doors-unreachable-76eb826c
kind: observation
by: security-nfr
at: 2026-09-26T19:31:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - NFR-004
  - NFR-005
  - NFR-009
  - AR-NFR004-A
  - ADR-0026
  - ADR-0025
  - src/engine.ts
  - src/search.ts
  - src/cli.ts
  - .grugops/context/secnfr-ABC-121/notes/raw-nfr-probe.ts.txt
  - .grugops/context/secnfr-ABC-121/notes/raw-out-nfr-time.jsonl.txt
  - .grugops/context/secnfr-ABC-121/notes/raw-out-nfr-mem.jsonl.txt
supersedes:
---

# `NFR-004`, `NFR-005` and `NFR-009` hold on plain node at `ada4093`. The four test-only doors cannot be reached from the CLI

Hand-authored and unsealed. This install has no sanctioned writer (`scripts/context-io.js` is
absent, and there is no `propose_note` tool in this session), and `human_admission` is `off`.
It is an `observation`, not a `finding`.

Machine: Apple M3 (4P+4E), Darwin 25.5.0 arm64, node v24.12.0. `UNKNOWN - verify` on any other
hardware. `src/` at `ada4093` is byte-identical to QE's `312a188`, because
`git diff --stat 312a188 ada4093 -- src` is empty.

## `NFR-005`: floor MET, and depth 7 reached (plain node, `chooseMove`, `DEFAULT_BUDGET_MS`)

This is my own probe (`raw-nfr-probe.ts.txt`), not the build's or QE's. It imports the reviewed
tip's `src/engine.ts` read-only. 3 rounds, arm order alternating. Load1 was 6.8–15.1: the
machine was still decaying from my lane harness.

| position | `chooseMove` depth, 3 rounds | pre-`ABC-121` door depth | nodes (`chooseMove`) |
|---|---|---|---|
| kiwipete | 7 / 7 / 7 | 6 / 6 / 6 | 788 220 – 790 268 |
| position-6 | 7 / 7 / 7 | 6 / 6 / 6 | 812 457 – 823 721 |
| startpos | 8 / 8 / 8 | — | 696 340 – 708 628 |
| position-3 | 12 / 12 / 12 | — | 1 082 382 – 1 091 598 |
| position-4 | 9 / 9 / 9 | — | 881 612 – 896 972 |
| position-5 | 8 / 8 / 8 | — | 721 987 – 728 131 |

- **The depth-6 FAIL floor is MET, with one ply of margin, on both named positions in every
  round.** This is the third independent reading of 7 against 6: the build `…4acb5c4b`, QE
  `…7c2df89a`, and this one. At a higher load than QE's (3.2–3.4), the depth was unchanged.
- **The depth-7 WARN level is reached on this machine.** It stays PROVISIONAL (M3 only), so the
  marker does not lift. After merge, the catalog's `NFR-005` status sentence (*"Depth 7 not
  reached (WARN, still PROVISIONAL)"*, placed at `ABC-081`) will be stale. That is a
  catalog-owner follow-up. This gate does not edit it.

## `NFR-004`: both clauses inside `AR-NFR004-A`

- **The 3 s clause:** 24 calls across the table above. The outer wall clock (`performance.now`
  around the call) read at most **3 005.3 ms** (position-6, door) and at most **3 004.8 ms** on
  `chooseMove`. `elapsedMs` read at most 3 005. That is ≤ 5 ms over, inside `AR-NFR004-A`'s
  measured ≤ 31 ms / 1.03% bound. PVS and LMR add no new abort path: the one abort is still
  `countNode` at `NODES_PER_CLOCK_CHECK`, and every recursion in `searchMove` sits inside the
  `try/finally` that unmakes the move.
- **The 5 s ceiling (`RF-1` clamp):** `chooseMove(kiwipete, { budgetMs: 10 000 })` returned at
  **5 000.6 ms** wall (`elapsedMs` 5 000), depth 7. The clamp still binds through the new code.

## `NFR-009`: MET, with 0 growth

The probe ran under `node --expose-gc`, reading after `gc(); gc()`. Each position ran a 1 s, a
3 s and a second 3 s `chooseMove`.

| position | `arrayBuffers` (1 s / 3 s / 3 s) | `heapUsed` growth 1 s→3 s | 3 s→3 s |
|---|---|---|---|
| kiwipete | 4.010 / 4.010 / 4.010 MiB | −0.017 MiB | +0.010 MiB |
| position-6 | 4.010 / 4.010 / 4.010 MiB | −0.015 MiB | +0.023 MiB |
| position-3 | 4.010 / 4.010 / 4.010 MiB | +0.023 MiB | −0.014 MiB |

- 4.01 MiB is against the 16 MiB level, and growth ≤ 0.023 MiB is against the 1 MiB clause.
- The suite's own `NFR-009` row also ran green:
  `ENGINE_DEEP=1 npx vitest run src/transposition.test.ts -t A7` (`ABC-081` `A7`). Kiwipete read
  1 s depth 6 at 7.97 / 4.01 MiB, and 3 s depth 7 at 7.96 / 4.01 MiB.
- `A6` holds by construction: PVS and LMR add a loop index and a `Heuristics` pair to the
  per-search `Budget`, and allocate nothing that outlives the search.

## The test-only doors cannot be reached from production (queue item 3)

- **Static, the import graph:**
  - The only production entry point is `src/cli.ts` (`npm run chess`). It exports nothing, and
    from `./engine.ts` it imports only `createEngine` and `DEFAULT_BUDGET_MS`.
  - `createEngine` calls `chooseMove(history.position, options)`, and `chooseMove` calls
    `deepen(..., { pvs: true, reductions: true })` with **literals**.
  - Across every non-test file under `src/`, no line outside `search.ts`/`engine.ts` names
    `searchWithoutPvsOrReductions`, `searchWithoutReductions`,
    `chooseMoveWithoutPvsOrReductions` or `chooseMoveWithoutReductions`. The one hit was a doc
    comment in `src/search.mate-corpus.ts`, which no production module imports.
- **No option can switch the heuristics.**
  - `EngineOptions` gained no field.
  - `deepen` spreads `...heuristics` as the budget initialiser's last member and never spreads
    `options`. So even a caller passing an extra `pvs` or `reductions` key could not turn PVS
    or LMR off.
  - This is `ADR-0026` decision 2's rejected alternative, kept rejected in code.
- **`search()` likewise** passes literal `pvs: true, reductions: true`. Every pre-`ABC-121` door
  passes `false, false`, which is decision 3's ladder rule.
- **Residual (info):** the doors are ordinary named exports of production modules, so any future
  production importer could call one. That is the `ADR-0024` decision 7 precedent, already
  accepted. `ABC-077` `A6`'s export-list pin is what makes a new export visible. Not a risk
  today.

## Other items in the diff (queue item 4)

- **I1 (info): `lateMoveReduction` makes and unmakes the move with no `try/finally`.** If
  `makeMove` or `isInCheck` threw between the two, the position would be left mutated. That is
  unreachable today:
  - the engine's only throw is `ABORTED` from `countNode`, which the predicate never calls;
  - neither callee throws on a legal move.

  It is noted so a future abort point inside the predicate is not added without one.
- **I2 (info): `src/search.mate-corpus.ts`** is a 321-line test-only data module under `src/`.
  `tsc` and Biome check it, and nothing at runtime loads it. The package is `private: true`, so
  nothing publishes it.
- **Security (ASVS L1, 70 requirements, filtered at read time): no applicable requirement and no
  finding.**
  - The diff touches no input path. `src/cli.ts`, `cli-options.ts` and `line-input.ts` are
    unchanged, and no FEN or budget reaches the engine from a player.
  - It also touches no authentication, session, crypto, file, network, logging, secret or
    configuration surface.
  - No dependency changed (`package.json` and `package-lock.json` are not in the diff), so
    V15.1.1 and V15.2.1 are unchanged.
  - The requirements were filtered by surface, not ticked one by one. None applies.
