<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: secnfr-nfr008-headroom

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-04T02:56:51Z | decision | security-nfr | high: recommendation grounded in the two readings above; no level, bar, test or config moved |  | # Security/NFR decision, secnfr-nfr008-headroom: PASS_WITH_RISKS. Move three named rows to their files' existing deep lanes (≈ −0.4 s wall, measured); do not re-state `NFR-008` now; one owner question held, not escalated |
| 2026-11-04T02:56:51Z | observation | security-nfr | medium: paired 7 vs 7, 7/7 negative, scratch copy outside the repo; no twin arm, an estimate for a cut |  | # Security/NFR observation, secnfr-nfr008-headroom: a scratch probe with three named rows skipped reads −0.38 s paired median wall (7 of 7 pairs lower) and −1.09 s CPU against main in the same window |
| 2026-11-04T02:56:51Z | observation | security-nfr | high: 15 scored npm test runs on main 08843504 inside the host lock, exit 0, 2650/2650; diag reporter 3 scored runs; not a graded verdict (no twin) |  | # Security/NFR observation, secnfr-nfr008-headroom: main's default lane read ALONE — median 9.77 s (n 8) and 9.90 s (n 7) wall, 0 of 15 over 10 s; CPU 32.4 s; `src/cli.test.ts` is 30 % of the lane's slot time, all of it child start-up at collect |
