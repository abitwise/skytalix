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
