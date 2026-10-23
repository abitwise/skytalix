---
id: 20261023T072556Z-security-nfr-observation-d4582dad
kind: observation
by: security-nfr
at: 2026-10-23T07:25:56Z
verified_by: 
confidence: high (QE instrument output, checked against the committed readouts; arithmetic only; nothing re-timed)
refs:
  - ABC-178
  - security-nfr-ABC-178
  - NFR-008
  - N8-LANE
  - 00f77f26
  - a93c1e72
  - d9308e4f
  - plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
  - plans/nfr-catalog.md
  - B7
  - B8
  - 20261023T071821Z-qe-e2e-observation-22b92995
  - 20261023T071821Z-qe-e2e-observation-03c392fc
  - 20261023T071821Z-qe-e2e-observation-25efab27
  - 20261023T071842Z-qe-e2e-decision-39e59d96
  - 20261021T072314Z-security-nfr-decision-b4d5793f
supersedes: 
seal: sha256:88b167e893dea923280e61896ff6a6a393b3c3a7d68f84492a494b4b5fa9d07a
---

# `security-nfr-ABC-178`: the readings this gate rules on, the floor arithmetic, and the published headroom. Records only. Nothing was run or timed

Every figure is QE's, copied from `qe-timing-ABC-178` (`…22b92995` preconditions, `…03c392fc` B7, `…25efab27` B8, `…39e59d96` verdict). I checked each against the committed readouts on `grugops/qe-timing-ABC-178` `d9308e4f`: `probe/n8/n8-a1/readout-n8-lane{,-a}.out` and `probe/full/full-a1/readout-nfr008-full.out`. They match. I ran no vitest, no lane, no probe and no timing.

## B8: `NFR-008` R-1, full lane, merge `00f77f26`
- H median wall **9.010 s**, x(2)..x(7) [8.86, 9.03]; every scored H run 8.80–9.08 s; CPU 25.655 s (reported).
- H/H2 twin: CPU +0.070 s ≤ 0.385 s, sign p 0.727, **admissible**; wall R **0.100 s**.
- B (`main` `a93c1e72`, vitest 4.1.12) median wall **8.985 s** [8.76, 9.01]. B/T twin CPU +0.235 s (0.92 %), sign 7/8 (p 0.070): admissible, near the sign edge. Wall R 0.190 s.
- H−B wall +0.035 s [−0.100, +0.230]. R1's cost cannot be resolved at this set's resolution. The page estimated +0.002 s.
- Conditions: AC 36/36; load1 3.98–7.88 on scored runs (≤ 8); thermal 0 in every round (0/8 warm); 0 foreign window polls (181); 0 foreign vitest at every check; all four arms, each with its own `npm ci`; heap cap on; Node v26.11.1 / vitest 4.1.12; pre-registration `preregistration-qe178t.txt` written 06:59:25Z, before the first gate poll.
- No flag travels with this reading. That is unlike `ABC-177` t3-r1 (9.395 s: warm 5/8, foreign window, strict view VOID, non-blind re-read).

## B7: `N8-LANE`, ONE-FILE set `src/uci-session.test.ts`
- Charge H−B CPU **+0.010 s**, x(2)..x(7) [−0.010, +0.020], against **650 ms**. Wall −0.010 s [−0.060, +0.020].
- T−B twin: CPU +0.010 s (0.24 %), p 0.453, **R 0.030 s**, admissible. Wall R 0.050 s.
- The readout prints: `per-set F = 0.654 s (provisional 16 % of this window B CPU median); 650 ms >= F: False` and `resolves 650 ms (R <= b): True; ... median +0.010 s <= b: True`, `STATE at 650 ms CPU: MET`.

## Floor arithmetic for this set
- The provisional F is 16 % × 4.090 s = 0.654 s. That is 4 ms (0.6 %) above the 650 ms bound.
- Admissible twins on this set on record: `ABC-177` A8, R **0.070 s** CPU (vitest 4.1.11, foreign load logged); `ABC-178` B7, R **0.030 s** CPU (vitest 4.1.12). The catalog rule for a set with readings is "the median R of its three most recent, or the largest if it has fewer than three". That gives **0.070 s** if both count, and 0.030 s if the runner change starts a new series. **Which one applies is `UNKNOWN - verify`, and it is Architect/Design's to rule.** Either value is at least 9× under 650 ms.
- The measured noise in this window (R 0.030 s) is 22× under the bound. The upper end of the charge's interval (+0.020 s) is 0.630 s under the bound.

## Published headroom (arithmetic on published readings)
| quantity | value | basis |
|---|---:|---|
| W | 10.000 s | `NFR-008` R-1 |
| H median wall, merge `00f77f26` | 9.010 s | `…25efab27` |
| **headroom to W on H** | **0.990 s** | 10.000 − 9.010 |
| in H/H2 wall R units | ≈ 9.9 R | 0.990 ÷ 0.100 |
| margin to `ADR-0046` D4's 9.2 s on H | 0.190 s | 9.2 − 9.010 |
| B (`main` `a93c1e72`) to W | 1.015 s | 10.000 − 8.985 |
| B to 9.2 s | 0.215 s | 9.2 − 8.985 |
| previous published headroom | 0.605 s | 10.000 − 9.395 (`ABC-177`, warm-flagged) |

- **Where it holds.** On the tree that lands, and only while `git diff --name-only 00f77f26 <merged main> -- src tools package.json package-lock.json vitest.config.ts tsconfig.json` is empty. At `main` `be4e1f73`, `git diff --stat a93c1e72 main` over those paths is empty, so `main` has not moved a lane input since the arms' base.
- **Who reads it next.** `ABC-199`, `ABC-200`, `ABC-197` and `ABC-201`, in merge order. Every later lane-input merge spends this headroom on an estimate until a full-lane reading is taken. The 9.2 s margin (0.190 s) is the tighter one. It is shared, and the merge order spends it.

## Security surface
- `git diff --stat a93c1e72 00f77f26` outside `.grugops/` is `src/uci-session.test.ts` (+9, 0 removed lines) and the ticket page. No production byte, no import, no I/O, no secret. No ASVS L1 requirement is in reach.
