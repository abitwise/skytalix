---
id: 20261022T134635Z-ba-pm-observation-d5e744dd
kind: observation
by: ba-pm
at: 2026-10-22T13:46:35Z
verified_by: 
confidence: high (published readings and git, read verbatim); every row cost is an estimate; today's main lane wall UNKNOWN - verify
refs:
  - ABC-178
  - ABC-197
  - ABC-177
  - QE-177-a
  - QE-177-b
  - NFR-008
  - N8-LANE
  - ADR-0046
  - ADR-0035
  - O3
  - R-177-1
  - FIX-177-1
  - EPIC-007
  - 4debc07d
  - f81bf03c
  - a7857e0b
  - 20261021T072212Z-security-nfr-observation-4bb78960
  - 20261021T072314Z-security-nfr-decision-b4d5793f
  - 20261021T071940Z-architect-design-observation-e8b4d26d
  - 20261021T071942Z-architect-design-decision-ee7527cc
  - 20261021T071943Z-architect-design-decision-74d39535
  - 20261020T220000Z-ba-pm-decision-qe177-a-b-cut-abc178-c-accepted-7c41e9a2
  - 20261020T150000Z-orchestrator-decision-bfdc97e5
  - 20261022T133720Z-orchestrator-decision-0b63d92f
  - 20261021T080255Z-qe-e2e-decision-dae138b1
  - plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
  - plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
  - plans/board.md
supersedes: 
seal: sha256:de567a71129bae054fca2b7365b672e142e17bf927bd17e6f2981bd3fd829431
---

# ABC-178 re-rule inputs: the published headroom at `f81bf03c`, and the fact that today's `main` lane is unread

Records only. No lane, no timing, no probe. Every reading is QE's as Security/NFR printed it; every row cost is an estimate from `bapm-rule-QE-177-ab` `…7c41e9a2`. Git facts read at `main` `a7857e0b`.

## Published reading (`…4bb78960`, `…b4d5793f`)
- `NFR-008` R-1 bound W = 10.000 s.
- H median wall at `f81bf03c` = 9.395 s (x(2)..x(7) 9.21..9.52; max H 9.55 s). Twin wall R (H/H2) 0.250 s. AC on every run. Warm-flagged 5/8; the strict registered view is VOID; graded under the ABC-177-only thermal exception `…31ab7d2d`.
- Headroom to W: 10.000 − 9.395 = **0.605 s** (≈ 2.4 R).
- Against `ADR-0046` D4's 9.2 s: 9.2 − 9.395 = **−0.195 s**. That is the miss that fired `ABC-178`'s wait clause.
- Tranche 2 (O3) was not opened (Architect `…ee7527cc`). No tranche 2 headroom reading exists.

## Row costs (estimates, 2-slot model, wall ≈ in-thread ÷ 2)
- R2: 25 621 nodes, ≈ 150 ms in-thread → ≈ +0.075 s wall. That is 0.075 / 0.605 ≈ 12.4 % of the headroom, and 2.5 × `ABC-174`'s +0.03 s.
- R1: 655 nodes, ≈ 4 ms in-thread → ≈ +0.002 s wall (≈ 0.3 %).
- Both: ≈ 9.47 s, headroom ≈ 0.53 s (≈ 2.1 R). R1 alone: ≈ 9.40 s, headroom ≈ 0.60 s.

## Today's `main` lane is not the lane that was read
- `ABC-177` merged as `4debc07d`. `git diff --stat 4debc07d a7857e0b` over `src tools package.json package-lock.json vitest.config.ts tsconfig.json`: 11 files, +449 / −41. That includes `src/cli.test.ts` +307 lines, `src/cli.real-engine.test.ts`, `tools/opening-book/book.test.ts`, `tools/grugops/heap-guard.js`, `result-file-reporter.js`, four `*.nfr.test.ts`, and `package.json`/`package-lock.json`.
- 14 first-parent merges since `4debc07d` touch those paths (ABC-160, 159, 162, 179, 180, 181, 183, 161, 184, 172, 187, 176, 192, 194). The suite went from 59 files / 1 987 tests to 59 / 1 994 (handoff `…3d4ab371`). None of these hops took a full-lane timing.
- So **today's full-lane wall on `main` is `UNKNOWN - verify`.** The Architect's rebased 8.4–8.6 s (`…e8b4d26d` § 2) is an estimate.
- `src/uci-session.test.ts` is unchanged since `4debc07d` (`git diff` empty; 126 tests per `ABC-177`).

## Gate-time state
- `FIX-177-1` (sampler crash) is folded (`qe-redact-SEC-177-1` `…dae138b1`).
- The Architect's thermal question for `ABC-178` B8 (`…74d39535`) has no owner answer on record. Under the strict rule, four of four full stages VOIDed on this host.
