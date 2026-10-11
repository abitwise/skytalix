---
id: 20261010T190649Z-ba-pm-decision-abc094-dor-10-of-10-ready-fe340299
kind: decision
by: ba-pm
at: 2026-10-10T19:06:49Z
verified_by:
confidence: high
refs:
  - ABC-094
  - ABC-093
  - ABC-083
  - ABC-095
  - EPIC-005
  - ADR-0037
  - ADR-0036
  - ADR-0012
  - N-LOAD
  - NFR-008
  - WEIGHT_POLICY
  - data/opening-book/book.json
  - tools/opening-book/compile.ts
  - 20261010T185733Z-qe-e2e-decision-abc093-verdict-pass-with-gaps-8fe9708a
  - 20261010T183947Z-software-engineer-decision-abc093-compiler-shape-weight-switch-strict-san-79cc28a5
  - 20261010T183052Z-ba-pm-decision-book-chain-folded-abc093-ready-for-dev-abc141-ready-46534e0b
  - .grugops/queue/pending/bapm-rescore-abc094-2026-10-10.md
supersedes:
---

# `ABC-094` re-scored after `ABC-093`'s merge: DoR 10/10, recommended column `Ready`, M / P1. It does not depend on the weight veto

**How this note was made.**
- It is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- Task `wave-2026-09-25`, subtask `bapm-rescore-abc094-2026-10-10`, Workflow 07.
- Branch `grugops/bapm-rescore-abc094-2026-10-10`, from wave tip `a7e25407`.
- The page's `## Scope` and `## Security / NFR triggers` are authoritative. This note cites them.

## Decision

| item | was | now | why |
|---|---|---|---|
| 10 no major blocker | ⚠️ ordering on `ABC-093` | **✅** | `ABC-093` merged at `ac83c3fd`; every premise holds on the file (below) |
| 1–9 | ✅ | ✅ | three clarifying folds (A1, A3, test notes 6–7); scope unchanged |

**Result: 10 of 10.** Size `M` and priority `P1` hold. **Recommended column: `Ready`.** The board
move is the Orchestrator's. No `In Design` hop is owed: `ADR-0037` D1 and D2 are ruled, and where the
read sits is the Engineer's call.

## Premises re-read against the merged artifact

The method was a private scratchpad script. It imports `src/` read-only, plus `toUci` from the
compiler, and reads `data/opening-book/book.json` at `a7e25407`.

- **Size and hash.** The file is **356,526 B**, sha256 `3802f52f…41d`, which matches QE's reading.
  The compiler writes only this path (`tools/opening-book/compile.ts:145`).
- **Header.** `format` is 1, `maxPly` is **12**, and `attribution` is `"ATTRIBUTION.md"`.
- **Keys.** There are 5,390 keys. **All of them are 16 lowercase hex digits**: 0 malformed.
- **Entry fields.** Each entry has only `m` and `n`: 0 other fields.
- **Weights.** There are **5,825** pairs. All are `[uci, positive safe integer]`: 0 malformed.
- **In-book and named entries.** 3,626 entries have a non-empty `m`. **1,764 have an empty `m`**,
  which is the second "out of book" shape, now folded into `A1`. 2,853 entries carry an `n`.
- **The start position.** Its key is `99116e4984517620`. It has 20 moves, all in `legalMoves`, and
  no `n`.
- **After `1. e4`.** Its key is `3c9a1e3dcc88de6c`. It has 19 replies, totalling weight 2,031, and
  `e7e5` takes 50.9%. Its `n` is "King's Pawn Game".
- **`A3`'s sensitivity to the seed.** The test used a cumulative picker in `m` order with
  `seededRandom`:
  - Seeds 1 to 10 give **4** distinct replies under line-count weights and **7** under uniform.
  - Over 10,000 disjoint ten-seed blocks, **4.70%** give fewer than 3 distinct replies under
    line-count weights, and **0.00%** do under uniform.
  - So the seeds are now named as 1 to 10 on the page, which stops anyone shopping for seeds.
- **`A4` is feasible.** An 8:1:1 fixture, seed 42, gave 1,000 draws of 796 / 106 / 98. Each share
  is within ±5 pp.
- **Timings (informative only, not the bar).** Node v26.11.0, M3, load1 about 9:
  - read plus `JSON.parse`: 4.2 ms;
  - 1,000 key-and-pick operations: 14.5 ms.
- **UCI.** The only `toUci` is in `tools/opening-book/compile.ts`, which imports `node:fs`. The
  probe must not import it. This is on the page.

## Gates (expected)

- **UAT.** It needs the owner's word, because the ticket adds a new `src/` module.
- **`In Security/NFR` under `ADR-0036`.**
  - **Holders at `a7e25407`.** There are still 0 production `node:fs` importers. The holders are
    still `cli.ts`, `glyph-mode.ts` and `perft-bench.ts`; `frame.ts`, `render.ts` and
    `status-panel.ts` match only in comments.
  - **The sharpening: any limb counts.** (b1) fires on any limb, not only `node:fs`. A
    `process.stderr.write` warning, or a `node:url` or `node:path` import, makes the probe the
    fourth holder too. That trips § Decision 3.
  - **The two branches.**
    - With an injected reader **and** an injected warn sink, the probe holds no limb. Then (b) fires
      on `ABC-095`, when `src/cli.ts` gains the read.
    - Otherwise it fires here.
  - **Either way the chain passes through once.** Whether to send the hop anyway, on the page's
    hostile-input content, is the Orchestrator's call.
- **Mandatory gates.** These are unchanged. `NFR-008` pins: ≤ 2 new test files, ≤ 2 spawns, and
  ≤ 650 ms CPU on the narrow set.
- **`PUZZLE_DEEP`.** It is not triggered if the module avoids `src/search*.ts` and
  `src/evaluate*.ts` and touches no engine file (test note 7).

## File overlap with `ABC-083` (In Development)

**None by file.** `ABC-083`'s tree at `.claude/worktrees/ticket-to-pr-ABC-083` touches:
- `src/evaluate.ts`;
- `src/evaluate.pawns.test.ts`;
- `src/search.ordering.test.ts`;
- `src/search.pvs-lmr.test.ts`;
- `src/transposition.test.ts`;
- a new `src/evaluate.king-mobility.test.ts`.

`ABC-094` adds one new module and one or two new test files. It imports only `legal.ts`,
`zobrist.ts` and `position.ts`, and `ABC-083` edits none of them. The only files both touch are the
appended `plans/traceability.md` and the board, and both are the Orchestrator's to merge.

## The owner's `WEIGHT_POLICY` veto

It is **still open**, and **`ABC-094` does not depend on its answer.**
- `A1` and `A2` read whatever weights the file holds.
- `A3` only gets easier under uniform weights.
- `A4` uses its own fixture.

The one way to create a dependency is to pin literal picks from the shipped book. Test note 6 forbids
that. **No new owner question.**
