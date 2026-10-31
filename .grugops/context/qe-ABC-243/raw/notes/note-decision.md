# QE on `ABC-243` at `8772cf36` (base `4bd9ac6a`): **PASS.** A1–A6 MET; `G8` H 9.28 s (`NFR-008` MET; ABC-244's 9.6 s tranche-2 trigger not fired)

Width ALONE for the `ENGINE_DEEP` row and `G8` (no other CPU work; wait-clear by PID with `kill -0`). Nothing pushed, merged,
amended or rebased. No `src/`, `tools/`, `data/` or board edit. PREREG committed (`3cd91179`) before any head run.
Read first (WF16): the ticket (A1–A6, all FOLDED blocks) and `se-ABC-243` `…c408ef9e`, `…9c3d34df`, `…a66447b8`, `…fd162ca2`;
`qe-ABC-241` `mutate.mjs` (QM3); `qe-ABC-244` `g8.mjs`/`host.mjs`. No prior `qe-ABC-243` context existed.

| criterion | grade | reading |
|---|---|---|
| A1 Hash row discriminates | **MET** | bare `go` after `setoption name Hash value 64`, `time` bounded by `expectWithin(…, LEVELS[5].budgetMs)` (4 000..4 200, step 100); green with no plant |
| A2 plants L = 4, 6, 7 | **MET** | QE's own plant site: red at H for all three (1 100 ≥ 4 000 fails; 5 100 and 30 100 ≤ 4 200 fail), Hash row only; none → green 201/201. B: L4 red, L6/L7 green (SE-228ii-a). QE ext.: L1–L3 red, L5 green |
| A3 title | **MET** | 3 lines (`:19`, `:660`, `:667`), `3 s` → `DEFAULT_BUDGET_MS` (4 s); no code token |
| A4 fences | **MET** | diff = the 2 test files only; 2 322 → 2 323; one name added (A6), none removed; the rest byte-equal (sha256/12 `0729b47e8a08`) |
| A5 gates | **MET** | lint, typecheck, build exit 0; `npm test` green ×3, skips 0, skip-integrity "No findings."; `ENGINE_DEEP` row green once (5 095 ms) |
| A6 FEN's own key | **MET** | `go depth 4` → `cp 0`, `bestmove d1e1`; raw `keyHistory` base half ≠ 0. QM3 @ H: whole suite red on the A6 row only (`cp -875`); QM3 @ B green 2 322 (QE-241-a reproduced) |
| `G8` | **MET** | medians B 9.23 s, H 9.28 s, H − B +0.05 s (estimate +0.03 s); 6/6 rc 0, load1 ≤ 1.17. ≤ 10 s; not > 9.6 s, so tranche 2 does not fire; no STOP |

- **Findings:** QE-243-a LOW (QE harness self-match in `host.mjs`; cost 60 min idle, no reading affected); QE-243-b, -c
  INFO; SE-243-a, -c (corrected to 118 chars), -e confirmed INFO. None blocks.
- **UAT:** waived. `git diff --name-only 4bd9ac6a 8772cf36` = 2 `*.test.ts` files, 0 production lines; this verdict is the gate.
- **Next:** merge is the humans'. The rebase order with `ABC-221`/`ABC-242` (shared `src/uci-session.test.ts`) is the
  Orchestrator's; any rebase re-runs A4's count check.
