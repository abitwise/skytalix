---
id: 20261025T124944Z-software-engineer-decision-71735f56
kind: decision
by: software-engineer
at: 2026-10-25T12:49:44Z
verified_by: 
confidence: high: built to the ruling; values not re-tuned
refs:
  - ABC-207
  - EPIC-008
  - ADR-0031
  - ADR-0028
  - plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md
  - arch-design-ABC-207/20261025T123306Z-architect-design-decision-a21b7cc9
  - arch-design-ABC-207/20261025T123306Z-architect-design-observation-439d6f8c
  - orch-2026-10-25aa/20261025T123439Z-orchestrator-decision-6eda769c
  - grugops/ABC-207
  - 26c43d28
  - 5050cce9
  - src/evaluate.ts
  - NFR-008
supersedes: 
seal: sha256:7fe6d9ddf62c3436ae78f721213e9643163a984b03f60c24836a597ecfdf9378
---

# ABC-207 built to the ruling: MOBILITY_WEIGHT [0,0,4,4,2,1,4] before the unchanged ±100 cp clamp; early-queen term 25 cp outside the clamp; no new export

Task `ticket-to-pr-ABC-207`, branch `grugops/ABC-207` (code `5050cce9`) from `main` `26c43d28` (whose `src/` is byte-identical to `5c91e2e4`). Built exactly to the page's `## Design ruling` (Architect `…a21b7cc9`, `…439d6f8c`; Orchestrator `…6eda769c`). Production diff: `src/evaluate.ts` only.

## Scope 1: weights
- `MOBILITY_WEIGHT: readonly number[] = [0, 0, 4, 4, 2, 1, 4]` by `pieceType` (N 4, B 4, R 2, Q 1, K 4 unchanged), under a `Rule:` comment. Not re-tuned.
- The multiply moved from the clamp line onto each piece's reach: `squaresReached(…) × MOBILITY_WEIGHT[type]`, then the same ±100 clamp. `squaresReached` is unchanged. The attack-map form of `ADR-0031` d2 stands: no form change, no ADR.
- `evaluateWithoutMobility` passes an all-zero array (`NO_MOBILITY`), so `evaluate − evaluateWithoutMobility` is still exactly the clamped term (`ABC-083` `A4` reads it unchanged).

## Scope 2: early-queen term
- `EARLY_QUEEN_PENALTY = 25` (a quarter pawn). Per side: a queen off its home square (d1 / d8; flag set in the existing walk, one compare per non-pawn piece) AND ≥ 2 of its four minors on b/c/f/g of its back rank → charged 25. Symmetric; subtracted after the clamp. No phase counter: the condition is the cut-off.
- One private helper `minorsHome`; read only when that side's queen is off home. No new export, no new walk, no state.

## Not done (fenced)
- No re-tune, no king weight change (flagged by the ruling, out of scope), no board edit, no real-clock timing, no `G6`, no game.
