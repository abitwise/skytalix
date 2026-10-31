---
subtask: qe-ABC-243
role: qe-e2e
ticket: ABC-243
ref: .grugops/context/qe-ABC-243/
branch: grugops/ABC-243 @ 4a9a264b (code 8772cf36; base 4bd9ac6a); QE commits on new grugops/qe-ABC-243 from 4a9a264b (worktree .claude/worktrees/qe-ABC-243)
width: ALONE for G8 (a records-only BA/PM may still be finishing; no other CPU work scheduled)
---
# QE ABC-243 (XS, test-only): A2/A6 plants red, A3/A4 diff, A5 gates + G8
Read the ticket (A1–A6), se-ABC-243 notes (`…c408ef9e`, `…9c3d34df`, `…a66447b8`, `…fd162ca2` — QE handoff), qe-ABC-241 mutate.mjs (QM3),
ABC-244's G8 triggers (> 9.6 s head median → tranche 2; > 10 s → STOP, owner).
Do: PREREG first; A2 re-plant L=4/6/7 (red) + no-plant green; A6 QM3 red; A3/A4 diff check; A5 gates via `npm run …`, ENGINE_DEEP row once;
G8 interleaved b h h b b h ALONE (base 4bd9ac6a, head 8772cf36), wait-clear via `kill -0` (never `while pgrep -f`). UAT waived (test-only).
Fences: no src/, tools/, data/ edits. Never push/force/amend/rebase/merge into main. No board edits. Never bare npx/npm exec. No host paths. Scratch `qe-243/`.
Publish: sealed notes (task `qe-ABC-243`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-10-31, QE/E2E. QE verdict: PASS** at `8772cf36` (base `4bd9ac6a`). ALONE for the `ENGINE_DEEP` row and `G8`. PREREG committed `3cd91179` before any head run. Not merged, nothing pushed.
Notes (task `qe-ABC-243`): decision `…2d790e40`; plants/diff `…ead81a11`; gates/deep/`G8` `…99b6b89f`; findings `…cf057dd1`; artifacts `…02fe5106`.
- **A1 MET.** The Hash row's level half: bare `go`, `time` bounded by `expectWithin(…, LEVELS[5].budgetMs)` (4 000..4 200), green with no plant.
- **A2 MET.** QE's own plant site (an early return in `setOption`): L4 red (`1100 ≥ 4000`), L6 red (`5100 ≤ 4200`), L7 red (`30100 ≤ 4200`), Hash row only; no plant green 201/201. B: L4 red (a parse fail), L6/L7 green (SE-228ii-a). QE extension: L1–L3 red, L5 green.
- **A3 MET.** 3 lines (`:19`, `:660`, `:667`), `3 s` → `DEFAULT_BUDGET_MS` (4 s); no code token.
- **A4 MET.** Diff = the 2 test files; 2 322 → 2 323; one name added (A6), none removed; other names byte-equal.
- **A5 MET.** lint, typecheck, build exit 0; `npm test` green ×3 at H, skips 0, skip-integrity "No findings."; `ENGINE_DEEP` row green once (5 095 ms; growth 0.02 / 0.00 MiB).
- **A6 MET.** `go depth 4` → `cp 0`, `bestmove d1e1`; raw list ≠ 0. QM3 @ H: whole suite red on the A6 row only (`cp -875`); QM3 @ B green (QE-241-a reproduced).
- **`G8`:** B 9.23 s, H **9.28 s**, H − B +0.05 s (estimate +0.03 s); 6/6 rc 0, load1 ≤ 1.17. `NFR-008` MET (≤ 10 s); ABC-244's tranche-2 trigger (> 9.6 s) **not fired**; no STOP.
- **Findings:** QE-243-a LOW (QE harness: `host.mjs`'s `[/]vitest` matches the wrapper shell of a line that also runs vitest; the deep row's wait hit its 60-min cap; `G8` unaffected). QE-243-b INFO (SE-243-b confirmed: the row no longer checks `score`). QE-243-c INFO (the deep row still prints `3 s (depth 8)` at `:695` and names the search `three`; outside A3's fence; carry with the `NFR-009` catalog wording). SE-243-a/-e confirmed; SE-243-c corrected to 118 chars. None blocks.
- **UAT:** waived (0 production lines); the QE verdict is the gate.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-243 | Hash row reads a bare go on LEVELS[5].budgetMs (catches a jump to any level); TT memory row names DEFAULT_BUDGET_MS; UCI row for a FEN carrying an uncapturable ep square (QE-241-a) | EPIC-010 | ADR-0046 § Addendum 2026-10-30 R1 | NFR-008 G8 MET H 9.28 s (B 9.23 s, +0.05 s; tranche-2 trigger 9.6 s not fired); NFR-009 deep row green, growth 0.02 MiB; R1 census A1 = 40 reads | grugops/ABC-243 @ 8772cf36: src/uci-session.test.ts, src/transposition.test.ts (test-only) | npm test 63 files / 2 323 pass ×3, skips 0; QE plants L4/L6/L7 red (L1–L3 too) on the Hash row, QM3 red on A6 only; ENGINE_DEEP deep row green | QE PASS (UAT waived: 0 production lines; the QE verdict signs) | — | In Review → QE PASS (branch, not merged) |
