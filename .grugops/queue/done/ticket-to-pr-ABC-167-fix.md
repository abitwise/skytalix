---
subtask: ticket-to-pr-ABC-167-fix
role: software-engineer
ticket: ABC-167
branch: grugops/ABC-167
tip: 20a9fc5d
merge: 060f87cc (git merge --no-ff main @ 0e3d8538)
status: BLOCKED — gate red; needs a BA/PM ruling on the step-1 fixture
---

# ABC-167 fix hop: code done, gate red on the page-mandated step 1

## What changed (src/uci-session.ts)
- `position`, `ucinewgame`, `quit` call `release()` first (A6-e2, A6-e3, A6-e4).
- `parseGo` reads a keyword's value through `valueAfter(index)`: the next token only if it exists and is not in
  `GO_KEYWORDS`; otherwise the keyword is valueless, warns once, and the next token is parsed as a keyword (A7-f1).

## Rows (all 21 written in src/uci-session.test.ts)
| row | at tip 4dbbfbd8 (scratch) | at 20a9fc5d |
|---|---|---|
| A3-h1, A4-a1, A4-a2, A5-b2..b5, A5-c1, A6-d1, A6-e1, A6-e5, A7-f2, A7-h1, A9-h1, A11-g1 | pass | pass |
| A6-e2, A6-e3, A6-e4, A7-f1 | **fail** (as the page says) | pass |
| A5-b1 | pass with --testTimeout=60000 | **fails: 5 s per-test timeout** |
| A7-f3 | pass with --testTimeout=60000 | **fails: 5 s per-test timeout** |

With `--testTimeout=60000` the file is 64/64 green at 20a9fc5d.

## Why BLOCKED
The page says the A5-b/c rows and A7-f1/f3/h1 run on step 1. The engine reads the clock every
`NODES_PER_CLOCK_CHECK` = 1024 nodes, so a budget of G on step 1 is about G × 1024 nodes: about 600k for A5-b1 and
about 3M for A7-f3's bare-go half (3 000 ms on step 1). Those two go over vitest's 5 s per-test timeout. The other
step-1 rows pass, but they also make the default lane much heavier (NFR-008). No timing reading was recorded.
I did not raise the timeout or change the step, because the page fixes both and that is BA/PM's call.
**A cheap option for BA/PM to rule on:** keep the bound G ≤ time ≤ G + 2·step, with a coarser step where the
wrong-build values still fall outside it. For example, step 10 on A5-b1 gives 600..620 and kills 100/1 100. Step
100 on A7-f3's bare-go half gives 3 000..3 200 and kills 100, the same as A7-f2. Step 1 stays only where G is small
(c1 = 50, M02 = 100).

## Mutants checked (scratch copies only)
- Tip source with the new tests: exactly A6-e2, A6-e3, A6-e4 and A7-f1 fail.
- A11-g1 kills M47–M51: `import "./turn-loop.ts"`, `import './book-file.ts'`, `import("./line-input.ts")`,
  `import "./book-engine.ts"` and `import "./level-seam.ts"` each fail the row.
- M02–M06, M11, M12, M15 and M29 were not run as mutants in this hop (UNKNOWN - verify). Each row asserts the
  figure the page gives, and the page's wrong-build values fall outside those bounds.

## Gates at 20a9fc5d
- lint, typecheck, build: OK.
- `npm test`: exit 1. `.test-results/last-run.json` shows `success: false`, 1908 total, 1906 passed, 2 failed
  (A5-b1, A7-f3, both timeouts), 0 pending.
- `test-skip-integrity --skip-count 0`: "No findings.", exit 0.
- `CLI_DEEP=1` and `PERFT_DEEP=1`: **not run** (the hop stopped at the red lane).
- N8-LANE: OWED, not measured.

## Measurement
`git diff --name-only 0e3d8538...20a9fc5d | grep -v '\.test\.ts$' | grep '^src/'` → `src/uci-session.ts` (only).
The src diff is exactly `src/uci-session.ts` and `src/uci-session.test.ts` (A12).

## Trace row (proposed; plans/traceability.md not touched)
| ABC-167 | grugops/ABC-167 @ 20a9fc5d | src/uci-session.ts, src/uci-session.test.ts | +21 amended rows (QE-167-a..h); A6-e2/e3/e4 + A7-f1 fixed | lane RED: A5-b1, A7-f3 timeout on step 1 — BLOCKED on BA/PM step ruling |
