---
id: 20261010T124744Z-software-engineer-observation-abc087-qe-fix-forward-a-b-e-closed-26fd4d9d
kind: observation
by: software-engineer
at: 2026-10-10T12:47:44Z
verified_by:
confidence: high
refs:
  - ABC-087
  - QE-087-a
  - QE-087-b
  - QE-087-e
  - ADR-0027
  - ADR-0032
  - ADR-0035
  - N8-LANE
  - src/levels.test.ts
  - .grugops/context/qe-ABC-087/notes/20261010T123857Z-qe-e2e-observation-abc087-gap-register-62d79e31.md
  - 20261010T120729Z-software-engineer-observation-abc087-rehop-option-a-n8-lane-met-69fa98d1
supersedes:
  - 20261010T120729Z-software-engineer-observation-abc087-rehop-option-a-n8-lane-met-69fa98d1
---

# `ABC-087` QE fix-forward at `026a7373`: QE-087-a, -b and -e closed, all in the default lane. M3a and M8 are red there; `N8-LANE` is still MET at +0.555 s (0.52-0.57), R 0.030 s

This note is hand-authored and unsealed. It supersedes `…69fa98d1` for the gate, the deep lane and
the cost reading. Only `src/levels.test.ts` changed; `src/levels.ts` is untouched. The base is QE's
`a2850bd0`.

## Rows: where each landed, and why

- **QE-087-a (default lane).**
  - A pass-through `vi.mock("./engine.ts")` records every `chooseMove` call's options and calls the
    real engine unchanged. Every other row still reads the real engine.
  - New row `QE-087-a — the seed never reaches the engine`, on one light position for 8 seeds:
    - The engine path, at the default level (rate 0), makes exactly 1 call with `{ budgetMs: 3000,
      now: <the caller's clock> }` and keys `["budgetMs", "now"]` only.
    - The blunder path makes one call per scored move, each with the same two keys and the caller's
      clock.
  - Cost: 9 ms, with no search added beyond 16 depth-1 moves. I chose QE's `I1` shape over a finer
    step, because a step that resolves ±10 % costs ~10 k nodes per call. That would be over the
    ~115 ms of headroom.
- **QE-087-b (default lane).**
  - New row `QE-087-b — the scored list is the engine's`, on `4k3/8/8/3q4/8/8/8/3QK3 w` (Qxd5 wins
    the queen).
  - One always-blunder move runs on a coarse clock, so every child is depth 1. Then:
    - every `scored[i].score === −chooseMove(child, { budgetMs: 0 }).score`, with the child at
      depth 1;
    - the list matches `legalMoves` in length;
    - `d1d5` is alone at the top.
  - Cost: 23 ms.
- **QE-087-e.** The moved `A4` `ENDGAMES` run now logs `A4 [ENGINE_DEEP, ENDGAMES]`.

## Mutants (QE's `mutate.cjs`, planted out of tree on `git archive HEAD` plus this test file; default lane; load1 4.31)

| tree | default lane | which rows go red |
|---|---|---|
| pristine | exit 0, 21/21 | — |
| `M3a_seed_perturbs_engine_budget` | **exit 1, 1 failed / 20 passed** | `QE-087-a` only (`budgetMs: 2701.64…` vs `3000`) |
| `M8_child_score_sign_flipped` | **exit 1, 1 failed / 20 passed** | `QE-087-b` only (`expected 5 to be -5`) |

The raw logs are `probe/raw-mutant-*.default.log`.

## Gate, deep lane and cost (at `026a7373`)

- **Gate:**
  - lint, typecheck and build: exit 0;
  - `npm test`: **52 files / 1602 passed / 0 skipped**, 6.91 s real at load1 3.78;
  - skip count 0; integrity `No findings.`;
  - lane inventory 52 = 52.
- **`ENGINE_DEEP=1 npx vitest run src/levels.test.ts`:** exit 0, **27 passed (21 default)**, 197.6 s
  real at load1 12.50 → 3.58.
  - `A4`: `ENDGAMES` (80 + 1)/204 = 39.7 %; perft + puzzles (97 + 0)/246 = 39.4 %.
  - `A2`: unchanged.
  - `A5`: 30/30, max 4,536 ms.
  - `A3`: 35/62 vs 58/62.
- **`N8-LANE`**, narrow set (same harness, n = 8, k = 2, `runs-qefix1.tsv`):

  | treatment median | sign | interval | twin | twin sign | R | load1 (min / median / max) | state |
  |---:|---:|---|---:|---:|---:|---|---|
  | **+0.555 s** | 8/8 | 0.52-0.57 | −0.66 % | 3/8 | **0.030 s** | 8.96 / 13.5 / 14.97 | **MET** (admissible, R ≤ 0.65 s, median ≤ 0.65 s) |

  That is +0.020 s over the re-hop's +0.535 s, which is within twice R. It was read under heavy
  load, which is logged and not gated (`ADR-0035`). It rests on `ADR-0035` (`proposed`).
- **Not closed here (not asked):** QE-087-c (LOW, clamp unpinned, equivalent on today's table) and
  the rest of QE's register.
