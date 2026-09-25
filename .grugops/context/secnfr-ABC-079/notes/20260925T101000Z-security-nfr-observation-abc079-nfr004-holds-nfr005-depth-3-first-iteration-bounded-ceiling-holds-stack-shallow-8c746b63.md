---
id: 20260925T101000Z-security-nfr-observation-abc079-nfr004-holds-nfr005-depth-3-first-iteration-bounded-ceiling-holds-stack-shallow-8c746b63
kind: observation
by: security-nfr
at: 2026-09-25T10:10:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - NFR-004
  - NFR-005
  - ADR-0024
  - AR-NFR004-A
  - src/quiescence.ts
  - src/engine.ts
  - src/cli.ts
supersedes:
---

# `ABC-079` at `cb5540d`: NFR-004 holds at p95 3 003.5 ms. NFR-005 reaches depth 3 on both named positions. The unabortable first iteration is bounded at about 33k nodes / 130 ms on reachable boards. The 5 s ceiling binds through `quiesce`. Recursion peaks at about 21 frames.

**Not a stamp.** A hand-authored `observation`. No `finding` is admissible on this install.

Tree: `grugops/secnfr-ABC-079` @ `d232047`, whose `src/` is `cb5540d`'s. Machine: Apple M3, 8
logical cores, Node v24.12.0, plain `node` (not vitest). `UNKNOWN - verify` on any other
hardware. All probes live beside this note as `raw-harness-*.mjs.txt`, with outputs as
`raw-out-*.txt`. They import `src/` read-only. **Zero `src/` lines were written.**

## Scope note: the subtask's range is wider than the ticket

`diff_under_review: 4f0ef01..cb5540d -- src` also carries the merges of `ABC-034`, `ABC-045`,
`ABC-046`, `ABC-075`, `ABC-107`, `ABC-118` and `ABC-120` (21 files). `ABC-079` is four commits:
`ead14eb`, `700730b`, `33b9a02` and `9d2306c`. `git log 4f0ef01..cb5540d` over its seven files
returns only those four, and those four touch nothing else under `src/`. This gate reviewed the
seven files: `src/quiescence.ts`, `src/quiescence.test.ts`, `src/search.ts`,
`src/search.test.ts`, `src/search.qe.test.ts`, `src/engine.ts` and `src/engine.test.ts`.

## NFR-004: `chooseMove` at `DEFAULT_BUDGET_MS`, 5 rounds x 8 positions (`raw-out-nfr004.json.txt`)

Load was 2.9 to 4.4. Wall time is measured outside the engine.

| position | wall ms (5 rounds) | completed depth | nodes | move |
|---|---|---|---|---|
| startpos | 3 000.9 – 3 003.5 | 6 | 748k – 785k | b1c3 |
| kiwipete | 3 000.5 – 3 002.1 | **3** | 1.10M – 1.12M | e2a6 |
| position-3 | 2 999.6 – 3 002.9 | 6 | 963k – 981k | b4f4 |
| position-4 | 3 000.6 – 3 001.9 | 4 | 1.12M – 1.17M | c4c5 |
| position-5 | 2 999.4 – 3 003.6 | 3 | 764k – 781k | d7c8 |
| position-6 | 3 000.6 – 3 001.5 | **3** | 964k – 982k | c3d5 |
| capture-dense middlegame (16 legal captures, 28 pieces) | 2 999.7 – 3 001.5 | 4 | 1.13M – 1.16M | f2f1 |
| worst first-iteration board (below) | 2 999.5 – 3 004.0 | 3 | 1.07M – 1.09M | b4c5 |

- **n = 40. p50 3 001.2 ms, p95 3 003.5 ms, max 3 004.0 ms.** 36 of 40 calls ran past 3 000 ms,
  by at most 4.0 ms.
- That overshoot is the abort granularity already accepted as `AR-NFR004-A` (ABC-078's gate: ≤ 31
  ms / 1.03%). This reading is well inside it.
- The capture-dense middlegame is `rnb1k1r1/1pp2pp1/P4n2/B2Pp3/3P1P2/b7/PQ2Pq1p/RNK2BNR b q - 2 16`.
  It had the most legal captures among the ≥ 24-piece boards in the 20 096-position sample below.
- The chosen move was stable across all five rounds on every position. Kiwipete `e2a6` and
  position-6 `c3d5` match `A5`'s depth-3 oracle pins.
- **`nfr.perf_p95_ms` (300 ms) does not apply.** `plans/nfr-catalog.md` records it as an untrue
  bootstrap default for API endpoints this project does not have. An iterative-deepening search
  spends its budget by design, so its p95 is the budget. The p95 is reported here and not graded
  against 300 ms.

## NFR-005: the depth reached (the same run)

- **Kiwipete reaches depth 3 and position-6 reaches depth 3, at 3 s, in plain node, on every round.**
  The ratified FAIL floor is depth 6 (WARN below 7, PROVISIONAL).
- At the 5 s ceiling kiwipete reaches depth 4 (`raw-out-ceiling.jsonl.txt`).
- ABC-078's gate recorded kiwipete 4 and position-6 3 before quiescence. So this ticket costs
  kiwipete one ply and position-6 none. QE and the engineer read the same numbers.
- This matches `ADR-0024` decision 6: with a measured quiescence factor near 45, depth 6 in 3 s
  needs about 850k nodes/s. The measured rate here is 250k–390k nodes/s.

## Security probe 1: the UNABORTABLE first iteration now carries depth-1 quiescence (`raw-out-first-iteration-summary.json.txt`)

`chooseMove` disarms the clock for iteration 1 (`nextCheck: Infinity`), so depth 1 always
completes. Since `ead14eb`, every depth-1 leaf runs `quiesce`. `budgetMs: 0` isolates exactly that
iteration.

- **The sample:** 20 096 distinct positions.
  - 96 are the six perft roots and all their one-ply children.
  - 20 000 come from seeded (mulberry32) random legal playouts of 12 to 51 plies from the start
    position.
  - Playouts choose both sides' moves, so they cover more than a CLI user can reach, since the
    user controls only one side.
- **Nodes:** p50 189, p95 1 573, p99 3 993, **max 32 980**.
- **Wall:** p50 0.63 ms, p95 4.14 ms, p99 10.2 ms, **max 129.5 ms** (load 3.8).
- The worst boards were `5bn1/2rbk2r/3p1p1p/ppp1p1p1/PPPPPP1P/R7/1B1NBK2/1Q4NR w - - 0 25` (most
  nodes) and `q1bk2n1/rp2pp2/2n2Ppb/2pp3P/1PP4P/P4P2/2QP1K2/R1B2BNR w - - 1 20` (slowest).
- **`A3`'s sixteen-queens rig** is built to capture forever and is not a position a game reaches.
  It reads **87 231 nodes and 277 ms** for the whole unabortable iteration.
- **Every sampled position reached the cap (8) and none exceeded it.** A full-window `quiesce` at
  the root, observed through its own visitor, was deepest at exactly 8.
- **The measured worst case is about 2.6% of the 5 s ceiling (rig: 5.5%).** Architect/Design's
  multiplier ruling had already accepted this bound for kiwipete (5 888 nodes). This measurement
  confirms that acceptance over a far wider set.

## Security probe 2: the 5 s hard ceiling still binds with the abort inside `quiesce` (`raw-out-ceiling.jsonl.txt`)

| position | budgetMs | wall ms | completed depth | nodes |
|---|---|---|---|---|
| kiwipete | `Infinity` | 5 000.1 | 4 | 1 914 613 |
| position-4 | `1e9` | 5 002.1 | 5 | 2 027 449 |
| queens rig | `Infinity` | 4 999.8 | 3 | 1 523 903 |

`countNode` is shared by the full-width nodes and, through `budget.visit`, by the quiescence nodes,
so the abort can land inside a capture sequence. `Math.min(budgetMs, HARD_CEILING_MS)` is
unchanged from ABC-078's `RF-1`.

## Security probe 3: recursion and stack depth (`raw-out-stack.jsonl.txt`)

- Stack depth is at most the completed full-width depth, plus the root, plus `QUIESCENCE_MAX_PLY`
  (8). The cap is a hard `if (qply >= QUIESCENCE_MAX_PLY) return standPat` before any capture is
  generated.
- Sparse endgames go deepest under iterative deepening. At the 5 s ceiling they completed:
  - KPvK: depth 12, so at most about 21 search frames;
  - KNvK: depth 11;
  - KRvK: depth 8.
- In the same process, Node's frame budget for a trivial recursive function was **10 387**. The
  search uses about 0.2% of it.
- `quiesce` unmakes in `finally`, so a throw leaves the position byte-identical. `A6` asserts this
  and QE re-ran it.

## Security probe 4: the input path from the CLI into search (static, read at `cb5540d`)

- **Where the positions come from:**
  - The only production `newGame` call is `src/cli.ts:166`, `newGame(START_FEN)`, and
    `START_FEN` is a constant.
  - Every other production `parseFen` call (`history.ts`, `history-pane.ts`, `status-panel.ts`,
    `result-screen.ts`) re-reads `history.initialFen`, which is that same constant.
  - **No CLI flag, prompt command or file supplies a FEN.**
- **The budget:** `src/cli.ts:175` passes the constant `DEFAULT_BUDGET_MS`. No user input
  reaches `budgetMs`.
- **What a user can supply:** only moves, and each is resolved against `legalMoves` before it is
  applied (unchanged by this ticket). So the user can steer the game into a capture-dense
  position, and probe 1 bounds what that costs.
- **The ABC-079 production files have:**
  - no `eval`, `new Function`, dynamic `import()` or `require`;
  - no `process.*`, `fs`, `net`, `child_process` or `console`;
  - only intra-repository imports.
- `package.json` and `package-lock.json` are unchanged over the whole range.
