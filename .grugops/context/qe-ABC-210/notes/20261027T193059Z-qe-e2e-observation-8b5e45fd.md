---
id: 20261027T193059Z-qe-e2e-observation-8b5e45fd
kind: observation
by: qe-e2e
at: 2026-10-27T19:30:59Z
verified_by: 
confidence: high: one pre-registered session per reading; host sampled every 10 s
refs:
  - ABC-210
  - EPIC-008
  - ADR-0051
  - ADR-0050
  - ADR-0026
  - ADR-0024
  - ADR-0034
  - ADR-0031
  - ADR-0028
  - ADR-0049
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - G1
  - G2
  - G4
  - G5
  - G6
  - G7
  - G8
  - G9
  - G10
  - G11
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - S1
  - P1
  - P2
  - QE-210-a
  - QE-210-b
  - QE-210-c
  - QE-210-d
  - QE-207-g
  - plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
  - plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
  - memory-bank/50-decisions/ADR-0051-a-check-extension-arrives-at-the-horizon-once-per-line-behind-a-test-only-off-door-pair.md
  - arch-design-ABC-210/20261027T041209Z-architect-design-decision-c5d0e464
  - arch-design-ABC-210/20261027T041209Z-architect-design-observation-8e6a40c2
  - arch-accept-adr0051/20261027T062436Z-architect-design-decision-e83d5703
  - ticket-to-pr-ABC-210/20261027T065341Z-software-engineer-decision-8c4e8b4b
  - ticket-to-pr-ABC-210/20261027T065341Z-software-engineer-observation-548912ef
  - orch-2026-10-27j/20261027T065502Z-orchestrator-decision-334b383d
  - orch-2026-10-27f/20261027T041414Z-orchestrator-decision-75af453c
  - owner-word-2026-10-27/20261027T062043Z-orchestrator-decision-047d411f
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - owner-word-2026-10-26b/20261026T132424Z-orchestrator-decision-2ae5fc12
  - owner-delegation-2026-10-22/20261022T140148Z-orchestrator-decision-5aaf7cec
  - bapm-epic008-g6-rule/20261025T122057Z-ba-pm-decision-8e51ba1e
  - grugops/qe-ABC-210
  - d71fc369
  - a17d5945
supersedes: 
seal: sha256:0c1a2ae210d59bbeed91a628ecba8b0fc45540648072ffde5d0dc54fd0c7aa57
---

# QE ABC-210 readings before D: pre-check 8/8 equal to the ruling's table; G2 MET; G6 MET against "≥ base" (8 = 8, 9 = 9, n = 5); G11 choices equal; real-clock rows green; G5, G7, G9 MET, G10 none

Task `qe-ABC-210`, one pre-registered run (`raw/PREREG.txt`, written 2026-10-27T07:35:49Z, before any reading). Base `a17d5945`,
head `d71fc369`, plain node v26.11.1, one fresh process per measurement. Raw: `raw/pre`, `raw/g6`, `raw/rc`.

## Pre-check (test note 3; `chooseMove`, `now: () => 0`, `maxDepth: k`; one first search per fresh process)
| board | base d7 | base d8 | head d7 | head d8 |
|---|---:|---:|---:|---:|
| kiwipete | 590 489 | 1 259 463 | 610 577 | 1 302 377 |
| position-6 | 180 941 | 355 565 | 181 191 | 358 872 |
- **8 of 8 equal the ruling's table** (and the SE's). No STOP. Head needs more nodes at d7 and d8 on both boards, as predicted.

## Timing session, 07:36:11Z–07:39:05Z (`scripts/session.sh`)
- Preconditions met at the second poll (one foreign vitest from another project at the first poll, gone 15 s later).
- 18 samples: load1 3.35–5.06, AC throughout (battery 89–91 %), thermal level 1, **0 foreign-vitest samples**.
- **`G2` MET:** head 641.3 / 642.8 ns, base 645.1 / 641.5 ns (order base, head, head, base). Under 990, so no second session.
- **`G6` MET**, n = 5 per board per build, interleaved:
  - kiwipete: base 8 ×5, head 8 ×5. Median nodes base 1 561 453, head 1 569 645.
  - position-6: base 9 ×5, head 9 ×5. Median nodes base 1 641 058, head 1 631 842.
  - Medians 8 ≥ 8 and 9 ≥ 9. Every run ≥ 6; head 7 WARN does not apply. Wall per run ≤ 3 002 ms.
  - **0 of 20 runs overlapped a vitest window or touched load1 > 8.** All runs and the overlap-free runs grade the same.
  - Unlike `ABC-209`, `G6` reads the change here. Head is not node-equal to base, and the in-check test at each horizon node is
    priced only on the real clock. The prediction (`…c5d0e464`) held.
- **`G11` (reported, not graded):** the five game-1 choices are equal, base and head:
  - 4.Qa4: d3 both (d10; score 53 → 46);
  - 8.e5: Be2 both (d9, 76);
  - 10.Ne4: Be2 both (d9, 7);
  - 13.d4: d4 both (base d11 −122, head d10 −109);
  - 17.Kc1: Kc1 both (d11, −215).

## Real-clock rows, 07:39:23Z–07:54:00Z (`scripts/realclock.sh`; ENGINE_DEEP unfiltered, one file at a time)
- engine 60/60, levels 41/41, transposition 26/26, pvs-lmr 21/21, legal 37/37, gameend 47/47. The 11 rows the build filtered
  (engine 6, levels 3, transposition 1, pvs-lmr 1) ran and are green.
- CLI_DEEP 11/11, UCI_DEEP 5/5 (the delivered entry points, both on `chooseMove`).
- load1 ≤ 5.53, AC. The vitest samples are the lanes themselves.
- **`G5` MET (`NFR-004`):** engine `A1` worst 3 002 ms at d11 over 30 positions (ceiling 5 s); level 5 max 3 003 ms on 30/30;
  `ABC-212` `A4` level 6 max 5 002 ms (≤ 7 000), level 7 max 30 002 ms (≤ 32 000). `NFR-005` row: kiwipete d8, position-6 d9.
- **`G7` MET (`NFR-009`):** kiwipete 1 s (d6) → 3 s (d8): heapUsed 8.70 → 8.71 MiB, arrayBuffers 4.13 → 4.13 MiB.
- **`G8` MET:** 8.55 s (gate note).
- **`G9` MET:** `src/levels.ts` has no diff base..head (`LEVELS`, `DEFAULT_LEVEL` 5); `HARD_CEILING_MS` 32 000 on both.
- **`G10`:** no level reddened.
