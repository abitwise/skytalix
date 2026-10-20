---
id: 20261020T140000Z-architect-design-decision-adr0046-proposed-uci-rows-coarser-steps-abc177-58fa35f0
kind: decision
by: architect-design
task: arch-lane-under-10s
at: 2026-10-20T14:00:00Z
verified_by:
confidence: high (ranking, levers and fences); estimate (every saving below); UNKNOWN - verify (class L and H′ parity at step 1 000)
sealed: false
refs:
  - R-174-1
  - NFR-008
  - NFR-010
  - N8-LANE
  - ADR-0046
  - ADR-0035
  - ADR-0040
  - ADR-0008
  - ABC-177
  - ABC-167
  - ABC-171
  - ABC-173
  - SEC-174-2
  - RISK-ABC144-FCAP
  - 20261020T135900Z-architect-design-observation-lane-cost-uci-session-61pct-throughput-bound-534e376f
  - 20261019T203000Z-security-nfr-decision-abc174-gate-pass-with-risks-6b1e94d2
  - 20261019T190000Z-software-engineer-decision-abc173-lightened-rows-and-steps-a7c3d910
  - memory-bank/50-decisions/ADR-0046-the-default-lane-gets-under-10-s-by-coarser-virtual-clock-steps-on-the-uci-rows-whose-bounds-read-no-step.md
supersedes:
---

# `R-174-1` remedy: **`ADR-0046` PROPOSED**. Cheapen the UCI rows whose bounds read no step (fold prefix dialogues, then the coarsest kill-set-preserving step in {1, 10, 100, 1 000}). BA/PM cuts **`ABC-177`**

Hand-authored and unsealed: the sanctioned writer is absent. This is a `decision`, with no stamp. It is a record
only: no lane, no timing, no commit. Data: `…534e376f`.

## Ranked options (every saving is an ESTIMATE; wall ≈ in-thread ÷ 2 on 2 slots)

| # | option | in-thread | wall | risk | owner | size |
|---|---|---:|---:|---|---|---|
| **1** | **O1: fold the A6 prefix dialogues, and give class H/H′/L rows the coarsest step in {1, 10, 100, 1 000} that keeps their kill set** | −1.5..−2.8 s | **−0.75..−1.4 s** | LOW: test-only, one file, parity per row, no bound or row moves | SE; BA/PM word on the step set; QE parity | **S** |
| 2 | O3: move the class P/C bulk to a new `UCI_DEEP` lane | −1.0..−1.4 s | −0.5..−0.7 s | MEDIUM: the D4 time rule leaves the default lane; new lane line, `A3` pin | BA/PM ruling, SE, Scribe | M |
| 3 | O2: the fold alone | −0.6 s | −0.3 s | very low | SE, QE | XS |
| 4 | O4: move `cli.test.ts` module-scope children to `CLI_DEEP` | ~−0.07 s per child, `UNKNOWN - verify` | ~−0.035 s per child | MEDIUM-HIGH: delivered-command coverage, `N8-SPAWN` pin | BA/PM, Architect | M |
| 5 | O5: merge small test files (per-file overhead) | ~−0.09 s per file | ~−0.045 s per file | HIGH: isolation-dependent files, pins | SE, QE | L |

O3 ranks above O2 because O2 alone leaves about 9.7 s, roughly one twin R of headroom, which is not enough.

**Rejected outright.** Each would loosen a cap or pin, or is the owner's alone:
- `maxWorkers: 3`: the owner's heat word, and `NFR-010` (2 more isolates break 2 048 MiB).
- `isolate: false`: `ADR-0040`.
- Asynchronous spawns: `C2`.
- `NODES_PER_CLOCK_CHECK` or `HARD_CEILING_MS`: production code, and `NFR-004`.
- File ordering: the lane is throughput-bound.
- Re-levelling W: the owner's call.

## Recommendation: O1, as `ADR-0046` (status **proposed**)
- **Predicted `npm test` median: 8.6–9.3 s, an estimate.**
- **Headroom target: ≤ 9.2 s.** That is 10 s − 3 × the full-lane twin R (0.28 s). It is a design target, not an NFR
  level.
- Outcomes:
  - **≤ 10 s:** `NFR-008` MET, and `R-174-1` is discharged.
  - **> 9.2 s:** tranche 2 (O3) goes to BA/PM.
  - **> 10 s:** it goes to the owner.
- **Measurement plan:** `ADR-0046` D5.
  1. A node census, which is not timing.
  2. Mutation parity.
  3. `N8-LANE` on the ONE-FILE narrow set `src/uci-session.test.ts`, flag 400.
  4. A full-lane B/T/H/H2 twin in a quiet window. Each second tree gets its own `npm ci`, and power is recorded per
     run.
  - Do not read `R-173-1` or `R-173-2` on these arms.

## The ticket BA/PM should cut: **`ABC-177`** (not cut here)
- **Title:** "`npm test` back under `NFR-008`'s 10 s: fold the A6 prefix dialogues, and give the UCI rows whose bounds
  read no step the coarsest kill-set-preserving step (`ADR-0046`)".
- **Type:** NFR remedy, test-only.
- **Size:** S.
- **Suggested priority:** P1. Every gate inherits `R-174-1` until this lands.
- **Scope:** `src/uci-session.test.ts` only.
- **Criteria to carry:**
  - Fold the A6 stop and ponderhit rows into one dialogue each, with the same three observations.
  - Rule {1, 10, 100, 1 000} for classes H, H′ and L. This is BA/PM's word, under the `bapm-amend2-ABC-167` rule.
  - Classes P and C stay byte-identical.
  - The row count stays 126, and no assertion bound or title changes.
  - Report a node census per changed row.
  - QE shows kill-set parity per changed row.
  - Take the D5 timing.
- **Owners:** SE builds it; QE runs parity and D5; Security/NFR rules on the `NFR-008` state; Architect/Design records
  any `F` move.

## Owner questions
1. **Accept `ADR-0046`?** Recommended: yes. It moves no level, cap or pin.
2. **Power source (`SEC-174-2`).** Should `NFR-008`'s declared stack name AC power for readings?
   - QE's at-the-bar reading was on battery.
   - Recommended: yes, AC from the next reading on, forward-only. Readings already taken stay as taken.
   - This is the owner's call because the stack declaration rests on his word.

## Still open, not settled here
- The `F` wording conflict, "outright" against "on MET" (`…6b1e94d2` § 4). The D5 own-install twin gives the reading
  that settles it, and Architect/Design settles it at that hop.
- `RISK-ABC144-FCAP` stays open.
