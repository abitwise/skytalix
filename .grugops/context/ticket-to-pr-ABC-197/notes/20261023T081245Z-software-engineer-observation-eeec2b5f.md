---
id: 20261023T081245Z-software-engineer-observation-eeec2b5f
kind: observation
by: software-engineer
at: 2026-10-23T08:12:45Z
verified_by: 
confidence: high (every figure was run; counts only, no timing)
refs:
  - ABC-197
  - QE-177-b
  - ABC-167
  - EPIC-007
  - ABC-177
  - ABC-178
  - src/uci-session.test.ts
  - 051d557a
  - 20e397c8
  - qe-ABC-177/probe/gap/gp.mjs
  - ticket-to-pr-ABC-177/probe/census.mjs
supersedes: 
seal: sha256:7855aaccab67da6f3aa872c99d3d5326fcffdf3371d681fbc86294aff87a80c1
---

# `ABC-197` A1–A4 readings, red-first and plants. Base `main` `051d557a`, tip `grugops/ABC-197` `20e397c8`. Counts only, no timing

## A1 (R2): MET
- The row is `it("ABC-197 R2: go depth 0 on step 100 searches G = 3 000, time in [3 000, 3 200]")`. It sits in `describe("ABC-167 A7 — the D12 limits")`, directly after U7's `for` loop and outside it.
- Dialogue `["position startpos", "go depth 0"]`, step 100.
- It asserts:
  - `out` has length 3;
  - `out[0]` matches `/^info string /`;
  - `3 000 ≤ time ≤ 3 200` on `out[1]`;
  - `out[2]` is `bestmove ${info.move}`.
- Read on the correct build: `info depth 5 score cp 55 nodes 25621 time 3100 nps 8265 pv g1f3`, then `bestmove g1f3`.

## A2 (additive, one file): MET
- `git diff --name-only 051d557a 20e397c8` prints exactly `src/uci-session.test.ts`.
- `-U0` has one hunk, `@@ -435,0 +436,11 @@`, and **0 `-` lines**. Its 11 `+` lines are:
  - one comment line citing `ABC-197` and `QE-177-b`;
  - the 9-line row;
  - one blank separator line.
- **Flag:** the blank line is neither R2 code nor a comment. ABC-178 R1 carried the same blank line, flagged the same way. U7's loop and step are byte-identical.

## A3 (row count): MET
- The default lane (`npm test`) ran at base (scratch `git archive 051d557a` tree) and at the tip (worktree).
- Base: 61 files / 2 018, `success` true. Tip: 61 / 2 019, `success` true. Both: 0 pending, 0 todo.
- `src/uci-session.test.ts`: 127 → 128, all passed.
- Names are compared as multisets, with paths relative to each tree root. Base ⊆ tip, and tip − base is exactly R2's full name.
- Sorted lists: base sha256 `3955c73a…`, tip `6342db0f…`. The two pre-existing duplicate names in `moves.enpassant.hardening` sit in both lists.

## A4 (node census): MET
- Instrument: `ticket-to-pr-ABC-177/probe/census.mjs`, byte-copied (`cmp` equal) and run on scratch archives of base and tip.
- R2 reads **25 621 nodes**, against a bound of 26 000 and an expected 25 621.
- The other 127 rows are unchanged node for node. Sum 579 269 → 604 890 (Δ +25 621). Nothing was committed.

## Red-first and plants (one file, step 100, scratch trees, source restored and `cmp`-checked after each)
- The plant is QP6's two edits, verbatim from `qe-ABC-177/probe/gap/gp.mjs`, with G as a parameter.

| plant | base file (127 rows) | tip file (128 rows) |
|---|---|---|
| none | 127/127 green | 128/128 green |
| **QP6, G 2 500** | 127/127 green (the gap) | **1 red: R2 only**, "expected 2600 to be greater than or equal to 3000" |
| QP6-2900 | 127/127 green | **128/128 green: R2 survives** |
| QP6-3300 | 127/127 green | **128/128 green: R2 survives** |

- **G scan of R2's dialogue (step 100, start position), reading `time` on `out[1]`:**
  - G 2 800 → 2 900 (red);
  - G 2 850 → 3 000, and G 2 900 → 3 000 (green under `≥ 3 000`);
  - G 2 950, 2 999, 3 000, 3 001, 3 100 and 3 300 → 3 100 (green).
- G > 3 000 is clipped by `Math.min(request.budgetMs, level.budgetMs)` (`uci-session.ts` `go`; level 5 = 3 000 = the highest level's budget).

## M4 sweep (A8's part)
- The `ABC-167 A11` M4 row is green at the tip.
- The scratch plant `write(answer); write("done");` reds it ("expected 'done' to match /^(id|option|uciok|readyok|info|bestmo…/"), with 87/128 red in all.
- The source was restored and `cmp`-equal to base.
