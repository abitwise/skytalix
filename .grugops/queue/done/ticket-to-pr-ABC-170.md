---
result: delivered
branch: grugops/ABC-170
tip: 64b07741
code_commit: e29f7951
base: 358810ac
---

ABC-170 is delivered on its branch, in the worktree `/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ABC-170`.
Base `main` `358810ac` has the same `src/` as the brief's `a0c6db6c` (0 `src` files differ). Nothing was pushed or merged.
**No timing was read.**

- `A1` MET. On `kp-vs-k` at 10 ms with `tickingClock(1)`, the unlimited engine reaches depth 7 (≥ 6).
  - `maxDepth: 3` gives depth 3, `e1f2` 151, which equals `search(p, 3)`.
  - `maxDepth: 1` gives depth 1 and a legal move.
- `A2` MET. On Kiwipete with `maxNodes: 20000`:
  - depth 3, 20 058 nodes (the bound is 21 024), and the move and score equal `search(p, 3)`;
  - more nodes than a `maxDepth: 3` run, so the depth-4 iteration was entered and then discarded.
  - `maxNodes: 1` gives depth 1 and a legal move.
- `A3` MET. On the six perft roots at 50 ms, a run with no limits and a run with `maxDepth: 1000, maxNodes: MAX_SAFE_INTEGER`
  match in all five fields. Every row outside `A4` is unedited and green.
- `A4` MET. Only the two named checks changed (`:517`, and `:520-523`, clock first). The export list, arity, `budgetMs`
  and behavioural rows are unedited and green. The only other hunk is appended rows (`:1200+`).
- `A5` MET. The `RF-1` rows are unedited and green. New rows:
  - an `Infinity` budget with `maxDepth: 1000` gives the same consultation count and the same result;
  - `budgetMs: 5` with `maxDepth: 50` gives the same depth and move.
- `A6` OPEN. It is owed in a quiet window. It was not read and not estimated.
- `A7` MET. The `src` diff is exactly `src/engine.ts` and `src/engine.test.ts`. No limb token appears on the `+` lines.

Gates on `e29f7951` (`src` is the same at tip `64b07741`):
- lint, typecheck, build and `npm test` all exit 0: 58 files, 1839/1839;
- `last-run.json` success is true;
- skip-integrity `--skip-count 0` gives `No findings.`;
- `CLI_DEEP=1` cli.real-engine 10/10, and `PERFT_DEEP=1` perft 32/32;
- the deep `A3` identity sweep alone (`ENGINE_DEEP=1 -t "the full sweep, with breadth"`, virtual clock) 2/2;
- `merge-tree` against `main` is clean.

Production-lines measurement: `git diff --name-only a0c6db6c...64b07741 | grep -v '\.test\.ts$' | grep '^src/'` gives
`src/engine.ts`. That file is in scope (+28/-2), so the count is **not zero**, the comment-only check does not apply,
and the UAT waiver does not apply.

Notes are in `.grugops/context/ticket-to-pr-ABC-170/notes/` on the branch (`…7c1e4a90`, `…3b9d52e1`, `…e8f04d26`).
The ticket page has a Delivery section. `plans/board.md` and `plans/traceability.md` were not touched.

Trace row: `| ABC-170 | EPIC-007 / ADR-0044 D12 | grugops/ABC-170 @ 64b07741 (code e29f7951) | src/engine.ts, src/engine.test.ts | engine.test.ts A4 amended (2 checks) + ABC-170 A1/A2/A3/A5 (9 rows) | A1-A5, A7 MET; A6 OPEN (quiet window) | In Development → In Review (Orchestrator) |`
