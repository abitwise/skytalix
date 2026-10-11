---
id: 20261011T222155Z-qe-e2e-observation-abc152-delta-gap-register-e0c0d051
kind: observation
by: qe-e2e
at: 2026-10-11T22:21:55Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - QE-152-a
  - QE-152-b
  - QE-152-c
  - QE-152-d
  - QE-152-e
  - QE-152-f
  - QE-152-g
  - QE-152-h
  - QE-152-i
  - QE-152-j
  - QE-152-k
  - RISK-ABC152-SPY-QUERY
  - RISK-ABC152-PUZZLE-SPY
  - 20261011T212237Z-qe-e2e-observation-abc152-gap-register-8bfb6cb5
  - 20261011T214847Z-architect-design-decision-abc152-qe-rulings-e50fbbe3
supersedes:
---

# QE `ABC-152` delta: gap register. `-h`, `-a` and `-d` closed; 3 new (`-i` LOW to the Architect, `-j` and `-k` INFO); nothing blocking

This note is hand-authored and unsealed. It updates the first hop's register `…8bfb6cb5`. It does not restate the
rows that have not moved.

## Closed by the repair

| id | was | now |
|---|---|---|
| `QE-152-h` | HIGH, blocking | **closed.** Weakened is red on the gate row at 15/58 with A3 green, and all 97 per-row lines equal base 3.2.7's. Plant (a) flips the red to A3, and "no leak reader" is confirmed (`…9dc4714f`) |
| `QE-152-a` | LOW | **closed.** 0 `deprecat` lines in 13 consoles, and the reporter adds no console line (`…29f4d3e9`) |
| `QE-152-d` | INFO | **closed for its 8 lines** (ruling 10). Its one missed sibling is now `QE-152-i` |

## New

| id | severity | owner | gap |
|---|---|---|---|
| `QE-152-i` | **LOW** (not blocking) | **Architect** (a ruling 10 extension, or a follow-up); then the SE for one comment-only commit if admitted | **`src/cli.test.ts:6`, "nothing here re-routes the module graph", is stale.** The file's `vi.mock("./glyph-mode.ts", { spy: true })` re-routes the graph for every test in the file (`ABC-030`'s definition), and the A5 "selectGlyphMode is not called" guard (expected 0) sees `cli-options.ts`'s call only through that re-route. Stale since `88009d0b` (R1). QE's first hop missed it in `QE-152-d`. The SE flagged it and stayed inside ruling 10's sites, correctly. **QE did not fix it** |
| `QE-152-j` | INFO (pre-existing, not a regression) | Architect / QE (`RISK-ABC152-SPY-QUERY`, ruling 11) | **The query-import route-around at the weakened site.** A production `?` import of `evaluate` in `src/quiescence.ts` makes weakened **fully** blind (54/58, the gate row green, A3 red), **at the tip and on base 3.2.7 alike**. The graded reading and A3 both catch it. Only an exit-code reader misses it, as on base. It adds a concrete reading to the residual; it does not widen it |
| `QE-152-k` | INFO | Orchestrator (at merge) | **The dry-run merge with `main` `9ad2c5f5` conflicts on `plans/traceability.md`.** Both sides append rows at the same table tail. Union-resolvable (keep both); the merged tree is green. This hop's trace row adds one more branch-side tail row |

## Unchanged (first-hop register stands)

- `QE-152-b` (`RISK-ABC152-NEGWORKERS`, widened by ruling 11).
- `QE-152-c` (`RISK-ABC152-COV-MARGIN`): it still reads 99.43% lines at the tip.
- `QE-152-e`, `QE-152-f` (now `RISK-ABC152-SPY-QUERY`) and `QE-152-g`.

## Ruling 7

**0 cases.**
