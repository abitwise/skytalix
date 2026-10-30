---
subtask: se-ABC-240
role: software-engineer
ticket: ABC-240
ref: .grugops/context/se-ABC-240/
workflow: agent-factory/workflows/ticket-to-pr (SE hop; QE follows)
branch: new grugops/ABC-240 from main (1364e66e or later), own worktree
---

# ABC-240: move ordering without per-move allocation, value-identical (cut 6, split from ABC-235)

Build ABC-240 to its ticket page and the Architect's cut-6 ruling in `arch-ABC-235/…7fc1b90c` (form, oracle) and
`…eebca902` (gate set). The BA/PM split is in `bapm-ABC-235-split`. ABC-235 (cuts 1, 3, 5) is merged at `baf99a7c`, so
build on top of it.

## Do
- Make `orderMoves` and quiescence's ordering stop allocating per move, with the same output order. A1 identity is out of
  tree in plain `node` against the merge base, byte-equal (move, score, depth, nodes, clock reads). No golden file is
  committed.
- A2 oracle rows (P1, P2, C1–C4) go in the existing test files, with the deep walk behind `ENGINE_DEEP=1`.
- A3: the nps figures are indicative only, and QE's interleaved read decides. Measure only when `pgrep -x cutechess-cli`
  is empty AND `pgrep -f "[/]vitest"` shows no foreign vitest (wait-clear, max 30 min, else report "not measured").
  Record load1 and Tctl.
- A4 gates: lint, typecheck, `npm test` and build green at every commit; G1, G5, G7, G8, G9 as the ticket says. Leave G6's
  5 interleaved runs to QE, named.
- If A3 misses on your indicative read, still hand back. QE decides.

## Fences
- Edits in `src/` (as the design names) plus tests, the ticket's dated result line, and your context. No `data/` or
  `tools/` edits. `src/quiescence.ts` is shared with ABC-228/229 (not started): ordering only.
- Own `npm ci --ignore-scripts`. Linters only via `npm run …`. **Never a bare `npx`.** **No games** (host thermal stop
  tonight, orch …6db452d1).
- Never push, force, amend or rebase. Never merge into main. No board edits. **No host paths in any commit**, not even an
  intermediate one: leak-scan for /home/, /tmp/claude and olgeroeselg before every commit.

## Publish
- Seal notes (task `se-ABC-240`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a 10-cell trace
  row into this brief, then move it and its claim.md to done/.

## Result

**2026-10-30, Software Engineer. Done. Branch `grugops/ABC-240` (from main `0e0ef856`): item 1 `69e19fc4`, item 2 `7913499d`, notes, raw and ticket line `220ab978`. Not merged; nothing pushed. No game was played; no `cutechess-cli` ran (wait-clear checked before every nps run).**

- **Items** (decision `…626a3c3a`):
  - Item 1: `orderMoves` keys each move once into a fixed 256-slot `Float64Array` scratch and insertion-sorts one fresh copy, moving only past a strictly smaller key.
  - Item 2: quiescence's `orderCaptures` does the same in place on the frame's own `captures`.
  - C1–C4 hold by construction. `orderKey` and `mvvLvaKey` are untouched.
- **A1** (observation `…79fe0aa4`): out of tree, plain `node`, against `0e0ef856`. 6 021 rows, sha256 `812f86ae…bd000` for the base, item 1 and item 2, `cmp` byte-identical, 0 impure. A depth-5 sample of the unpruned doors (264 rows) is equal too. G1's 58 rows are equal (`ade68870…`).
- **A2**: P1 (`src/search.ordering.test.ts`) and P2 (`src/quiescence.test.ts`) run against verbatim references, depth 1 in the lane and the 285 074-node walk under `ENGINE_DEEP=1`. Each of C1–C4 has a row. Planted red, then restored: non-strict `<`, float32 keys, and an in-place input sort.
- **A3, indicative** (observation `…ba9b4b1f`): tip/base median nps is kiwipete 1.117, position-6 1.109, start 1.076. load1 1.7–2.9, Tctl 75–81 °C. These exceed the Architect's bound, and the cause is `UNKNOWN - verify`. QE decides.
- **Gates** (observation `…78815fa3`):
  - lint, typecheck and build exit 0 at each commit. `npm test` 2 144 / 2 148 (base 2 139). Skips 0, `No findings.`
  - Deep lanes green.
  - G1 54/58. G7 2 × 2 KiB fixed, counted. G8 7.93 s and 7.76 s. G9 empty diff.
- **QE owes**: the A3 interleaved reading, G6's 5 interleaved runs, an A1 re-run at the tip, and G5's real-clock read.
- **Publishing**: `propose_note` was not available as a tool. Notes went through the plugin's `handleProposeNote` → `context-io` `admitAndAppend`, with the plugin path resolved at run time. 4/4 admitted. No bare `npx`.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-240 | Move ordering without per-move allocation, value-identical (cut 6): orderMoves key scratch + stable insertion sort; quiescence orderCaptures in place | EPIC-010 | — | NFR-004 clock reads byte-equal (A1); NFR-005 G6 SE-indicative (depth equal); NFR-008 G8 7.93 s; NFR-009 +4 KiB fixed, counted, growth green; no ADR | grugops/ABC-240 @ 7913499d (+ notes/raw/ticket line 220ab978): src/search.ts (orderMoves), src/quiescence.ts (orderCaptures) | src/search.ordering.test.ts, src/quiescence.test.ts, src/transposition.test.ts, src/search.test.ts; A1 6 021 rows cmp-identical at each commit; npm test 63 files / 2 148 pass, skips 0; deep lanes green; G1 54/58 rows equal base | — (UAT owed; QE verdict signs, S2) | — | In Review (branch, not merged; A3/G6 QE readings pending) |
