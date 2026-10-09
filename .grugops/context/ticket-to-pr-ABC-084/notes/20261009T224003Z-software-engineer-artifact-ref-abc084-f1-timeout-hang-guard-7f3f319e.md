---
id: 20261009T224003Z-software-engineer-artifact-ref-abc084-f1-timeout-hang-guard-7f3f319e
kind: artifact-ref
by: software-engineer
at: 2026-10-09T22:40:03Z
verified_by: 
confidence: high
refs:
  - ABC-084
  - src/puzzle-suite.test.ts
  - .grugops/context/secnfr-ABC-084/notes/20261009T223632Z-security-nfr-decision-abc084-pass-with-risks-n8lane-met-a6-stays-default-a5-timeout-false-red-fix-c3a91e57.md
supersedes: 
---

# `ABC-084` `F1` applied: gate and `A3` rows get a 300 000 ms hang guard; the gate row no longer claims "<= 60 s"

Hand-authored, no seal (no sanctioned writer; `human_admission` off). Subtask
`ticket-to-pr-ABC-084-f1`, base `e426e91`. Fix as sized in Security/NFR decision `…c3a91e57`.

## Diff (`src/puzzle-suite.test.ts` only, 3 lines)

- Gate row renamed `"the gate: solved >= the recorded baseline, in <= 60 s (A5)"` →
  `"the gate: solved >= the recorded baseline"`.
- Gate row timeout `60_000` → `300_000` (the `src/engine.test.ts` hang-guard shape).
- `A3` row timeout `60_000` → `300_000`.

Not touched: `solved >= baseline`, `src/puzzle-suite.baseline.json` (`git diff e426e91` empty),
any row's lane. `A5` stays the printed wall line plus the baseline file's wall and load; there is
no wall-clock assertion.

## Re-runs (load1 4.3–5.3, Apple M3, Node v26.11.0)

| command | result |
|---|---|
| `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts` | exit 0, **12 passed**, 40/40 solved, wall 12.09 s |
| `PUZZLE_DEEP=weakened npx vitest run src/puzzle-suite.test.ts` | **exit 1**, 1 failed / 10 passed (11), **10/40** solved, gate row red on `expected 10 to be greater than or equal to 40` (not a timeout), wall 10.75 s (`raw-out-f1-weakened.txt`) |
| `npx vitest run src/puzzle-suite.test.ts` (default) | exit 0, **9 passed** |
| `npm test` | exit 0, 50 files / 1539 passed |
| `npm run lint` | exit 0, 97 files, no fixes |
| `npm run typecheck` | exit 0 |

Not re-measured: the load-50 condition that produced the false red. The fix's claim is
structural — 300 s is above every gating-run wall recorded (max 79.40 s at load1 49–54, `…c3a91e57`).
