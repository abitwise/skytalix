---
id: 20261010T130840Z-software-engineer-observation-abc087-r1-clamp-pin-qe087d-draw-pin-14ec8ea7
kind: observation
by: software-engineer
at: 2026-10-10T13:08:40Z
verified_by:
confidence: high
refs:
  - ABC-087
  - QE-087-c
  - QE-087-d
  - NFR-004
  - ADR-0032
  - ADR-0035
  - N8-LANE
  - src/levels.test.ts
  - .grugops/context/secnfr-ABC-087/notes/
  - .grugops/context/qe-ABC-087/notes/20261010T123857Z-qe-e2e-observation-abc087-gap-register-62d79e31.md
  - 20261010T124744Z-software-engineer-observation-abc087-qe-fix-forward-a-b-e-closed-26fd4d9d
supersedes:
  - 20261010T124744Z-software-engineer-observation-abc087-qe-fix-forward-a-b-e-closed-26fd4d9d
---

# `ABC-087` at `1160b063`: Security/NFR R1 (QE-087-c) and QE-087-d pinned in the default lane; M4 and M5b red; `N8-LANE` MET at +0.545 s (0.53-0.56), R 0.030 s

Hand-authored, unsealed. Supersedes `…26fd4d9d` for the gate, the deep lane and the cost. Only
`src/levels.test.ts` changed, on Security/NFR's `c35f38bf`.

## Rows

- **R1 / QE-087-c (default lane, new row, 6 ms).** This is Security/NFR's measured shape: a
  `{ budgetMs: 20 000, blunderRate: 1 }` level on `6k1/8/8/8/8/8/1R6/6K1 b` (5 legal moves) with
  `virtualClock(250)`. It requires a non-engine move and `elapsedMs ≤ HARD_CEILING_MS + 4·250`.
- **QE-087-d (optional, taken; no new row, no new search).** It sits inside `A9`'s existing `it`, on
  each seed's 30 moves. Move k is a non-engine move iff the k-th draw of a fresh `seededRandom(seed)`
  is below the rate. This is `ADR-0032` d2, "the seed is consumed once per move".

## Mutants (QE's `mutate.cjs`, out of tree on `git archive HEAD` plus this test file; default lane; load1 3.2-3.3)

| tree | default lane | failing row(s) |
|---|---|---|
| pristine | exit 0, 22/22 | — |
| `M4_clamp_removed` | **exit 1, 1 failed / 21** | R1 only: `expected 20750 to be less than or equal to 6000` |
| `M5b_extra_draw_per_root_move` | **exit 1, 1 failed / 21** | `A9` (the QE-087-d check) only |

Raw files: `probe/raw-mutant-1160b063-*.default.log`.

## Gate, deep lane, cost (at `1160b063`)

- **Gate:**
  - lint, typecheck and build: exit 0;
  - `npm test`: **52 files / 1603 passed / 0 skipped**, 6.45 s at load1 3.18;
  - skip count 0; integrity `No findings.`;
  - lane inventory 52 = 52.
- **`ENGINE_DEEP=1 npx vitest run src/levels.test.ts`:** exit 0, **28 passed (22 default)**, 202.0 s
  at load1 8.86 → 8.35. Readings:
  - `A4`: 39.7 % and 39.4 %;
  - `A2`: unchanged;
  - `A5`: 30/30, max 4,521 ms;
  - `A3`: 35 vs 58.
- **`N8-LANE`, narrow set** (same harness; n = 8, k = 2; `runs-r1.tsv`):
  - treatment **+0.545 s**, sign 8/8, interval 0.53-0.56;
  - twin +0.33 % at 4/8, admissible;
  - **R 0.030 s**; load1 min / median / max 8.41 / 8.94 / 9.54;
  - **MET.** It rests on `ADR-0035` (`proposed`).
  - The +0.555 s → +0.545 s step is within R, so these rows cost nothing measurable.
