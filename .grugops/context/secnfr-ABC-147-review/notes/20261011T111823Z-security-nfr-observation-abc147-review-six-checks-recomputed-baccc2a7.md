---
id: 20261011T111823Z-security-nfr-observation-abc147-review-six-checks-recomputed-baccc2a7
kind: observation
by: security-nfr
at: 2026-10-11T11:18:23Z
verified_by:
confidence: high
refs:
  - ABC-147
  - NFR-008
  - plans/tickets/ABC-147-how-much-of-npm-tests-cpu-is-vitests-per-node-engine-overhead.md
  - .grugops/context/ticket-to-pr-ABC-147/probe/METHOD.md
  - .grugops/context/ticket-to-pr-ABC-147/probe/analyze.mjs
  - .grugops/context/ticket-to-pr-ABC-147/probe/raw/a1-lane.tsv.txt
  - .grugops/context/ticket-to-pr-ABC-147/probe/raw/a2-pairs.tsv.txt
  - .grugops/context/ticket-to-pr-ABC-147/probe/raw/a3-estimate.txt
  - .grugops/context/secnfr-ABC-147-review/notes/raw-recompute147.mjs.txt
  - .grugops/context/secnfr-ABC-147-review/notes/raw-recompute147.out.txt
supersedes:
---

# `ABC-147` review: six checks on method, admissibility and arithmetic. All six hold; every graded figure reproduces from the committed raw files

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). This
hop **ran no lane and no test**. Every number below was recomputed by `raw-recompute147.mjs.txt` from
the files committed at `4c634f09`; its output is `raw-recompute147.out.txt`. The recompute is
independent of the Engineer's aggregator, which is not committed (gap G2 in `…44c6cd6d`).

## 1. Method committed before the graded runs: **HOLDS**

- `METHOD.md`, `analyze.mjs` and `a147-lane.mjs` were committed at `d152298f`, 10:25:49Z (author and
  committer dates are equal).
- The first lane run (round 0, the warm-up) is logged at 10:25:54Z, 5 s later. The first **graded** run
  (6 P) is at 10:51:26Z.
- The `A2` scripts were committed at `188cb6c3`, 10:32:01Z. The first `A2` process is at 11:09:34Z.
- The one earlier run (feasibility, "Start at 13:22:32" local = 10:22:32Z) is disclosed in `METHOD.md`
  as ungraded. Its output is committed.
- `analyze.mjs` is **unchanged** after `d152298f`. Its url→bucket map, native-frame billing, `(idle)`
  exclusion and worker/main/child classing match `METHOD.md` rule for rule.
- `4c634f09` edited both drivers after the method. The diff adds only a logged load1 wait gate
  (`WAIT_LOAD`, at most 300 s), a `waited_s` column and a stdout dump. The `usable` predicate
  (`load1 ≤ 8 && exit 0 && failed 0`) is byte-unchanged. The gate changes **when** a run starts, not
  **which** runs are graded. It is disclosed in the code comment and in `…144c6b5d`.
- Limit: commit dates are self-reported by the committer. No independent clock exists for them.

## 2. Run exclusions follow the page's own rules: **HOLDS, but the published count is wrong**

- I re-applied the declared rule to all 36 lane rows. **0 mismatches** with the `usable` column.
- Used: P 6, 13, 14, 15, 16, 17 (n = 6). U 7, 8, 10, 12, 13, 14, 15, 16, 17 (n = 9). Both ≥ 3.
- Unused: **21**, not the 24 the notes, the ticket's § Delivery and the trace row state.
  - 20 started at load1 > 8: all 12 of rounds 0–5, plus 6U, 7P, 8P, 9U, 9P, 10P, 11U and 11P.
  - 5 hit the 60 s bound (exit 124): 0P, 3P, 7P, 10P and 12P. Four of them are also in the load1 > 8
    set. Only 12P (load1 5.79) is excluded for the hang alone.
  - The ticket's "15 at load1 > 8, plus the 5 hangs" is also wrong: 20 runs were at load1 > 8.
  - No graded figure moves. This is gap G1.
- Round extension: rounds 0–5 gave 0 usable P runs and rounds 6–11 gave 1. `METHOD.md` orders more
  rounds when fewer than 3 are usable, so both extensions were triggered. Rounds 12–17 ran as one
  fixed batch (`START=12 ROUNDS=6`), and every usable run in it is kept. I see no optional stopping.
- **Exclusions do not favour the arm.** The 7 completed P runs that were excluded for load have
  (i-w) of 40.10–47.79 %. Adding them would not lower the minimum, 37.27 % (run 17).
- Run 17 P started at thermal pressure 2. Neither the ticket nor `METHOD.md` has a thermal rule, so it
  is rightly kept. Dropping it would **raise** the lower edge to 31.90 %.
- Thresholds near the bar: 7U (load1 7.60) and 8U (7.96) are inside the rule.

## 3. `A1` buckets sum and are attributed correctly: **HOLDS**

- Every used run's five shares sum to 100.000 ± 0.001. Its `bucketS` seconds sum to `sampledBusyS`.
  Its (i) equals (i-w) + (i-child) + (i-main). Its where-split sums to 100.
- Medians recomputed: (i) 42.93 (37.68–44.19), (ii) 1.43, (iii) 12.15, (iv) 42.08, (v) 1.82. **The sum
  of medians is 100.41**, inside 100 ± 2. (i-w) 42.62 (37.27–43.91). All match `a1-summary.txt`.
- The top five production files (`moves.ts` 19.62, `legal.ts` 7.06, `position.ts` 5.51, `apply.ts`
  2.29, `evaluate.ts` 2.24) and the per-test-file ranking (`engine.test.ts` 1, `search.test.ts` 2)
  match.
- 61 worker profiles in every run. 7–8 per run name no single test file, and they hold 0 % of (i).
- Counts: 54 files / 1715 tests / 0 failed / exit 0 on every used run, equal to round 0U.
- Lane CPU: 28.10 s (26.88–30.78), n = 9 unprofiled. P/U is 1.166.
- **Attribution limit:** the `.cpuprofile` files were deleted. The bucket map can be audited only as
  code, not against the real frame urls. This is gap G3.

## 4. `A2` pairs interleaved, digests equal: **HOLDS**

- Order, as logged: E0 n→v, S0 n→v, E1 v→n, S1 v→n, E2 n→v, S2 n→v, E3 v→n, S3 v→n, E4 n→v,
  S4 n→v. The order alternates per pair, and E and S interleave.
- Digests: E `f66389c97154ff65` and S `0f86f021e96f607d`, the same on all 20 processes. **10/10 pairs
  usable, 0 void.** `workload.mjs` also throws if any timed call's digest differs from the warm-up's.
- Every logged `median_ms` equals the median of its five `ms`. Every exit is 0, and load1 is
  5.18–5.95 (≤ 8).
- Ratios recomputed: E **5.093 (4.929–5.379)**, S **5.028 (4.948–5.184)**. The file medians are within
  1.013x, so the 2x rule is not triggered.
- Both sides import the same `src/*.ts` through one `workload.mjs`. The vitest side uses a probe-only
  config with `pool: "threads"` under `.grugops/`, which the lane excludes. `vitest.config.ts` is
  untouched.

## 5. `A3` band arithmetic, including the cold-call lower edge: **HOLDS**

| reading | point R % | band % | band s at 28.10 s |
|---|---|---|---|
| declared, share (i-w), warm ratios | 34.20 | **29.71**–35.75 | 8.35–10.04 |
| letter, share (i), warm ratios | 34.45 | 30.04–35.98 | 8.44–10.11 |
| sensitivity, (i-w), cold first-call ratios | 31.61 | **26.00**–33.31 | 7.30–9.36 |

- The cold lower edge is 37.267 × (1 − 1 ÷ 3.306) = **25.995 % → 26.0 %**. 3.306 is pair E3's
  165.97 ÷ 50.20. **It reproduces.**
- The pooled warm median is 5.0606 and the pooled cold median is 3.8705, as published.
- Rounding differences against the page are under 0.01 (35.98 vs 35.97; 7.98 vs 7.99 s).

## 6. Does the ≥ 15 % arm hold under every reading the page allows: **YES**

The lowest lower edges, with what each needs to fall below 15 %:

- declared (i-w), warm: **29.71 %**;
- letter (i), warm: **30.04 %**;
- (i-w), cold first call (sensitivity, not declared): **26.00 %**; (i), cold: 26.28 %;
- (i-w) at `ABC-085`'s recorded 4.23x: 28.46 %;
- with the load-excluded runs added: 29.71 % (the minimum is unchanged);
- with run 17 dropped: 31.90 %.
- **Break-even:** at the minimum share, 37.27 %, the factor would have to be ≤ **1.67x** for R to fall
  under 15 %. At the lowest warm ratio, the share would have to be ≤ **18.8 %**. The lowest observed
  ratio anywhere is 3.31x, and the lowest observed share is 37.27 %.
- **One reading the page does NOT allow** brings it under 15 %: suppose the factor held only where it
  was measured, in E and S, and was 1 everywhere else. Their (i-w) share is 14.52 % (median; minimum
  13.34 %), so R would be 11.65 % (lower edge 10.63 %), which is the middle arm. `A3`'s formula
  multiplies the whole share, so this is not a permitted reading. It is the estimate's load-bearing
  assumption. Risk `RISK-ABC147-02` in `…44c6cd6d`.
