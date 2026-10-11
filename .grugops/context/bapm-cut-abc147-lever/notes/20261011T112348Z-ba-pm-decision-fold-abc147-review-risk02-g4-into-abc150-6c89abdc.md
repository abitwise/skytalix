---
id: 20261011T112348Z-ba-pm-decision-fold-abc147-review-risk02-g4-into-abc150-6c89abdc
kind: decision
by: ba-pm
at: 2026-10-11T11:23:48Z
verified_by:
confidence: high
refs:
  - ABC-150
  - ABC-147
  - RISK-ABC147-01
  - RISK-ABC147-02
  - plans/tickets/ABC-150-vitest-runs-the-engine-5x-slower-than-node-find-why-then-cut-the-lanes-cpu.md
  - plans/traceability.md
  - .grugops/context/secnfr-ABC-147-review/notes/20261011T111823Z-security-nfr-decision-abc147-review-verdict-pass-with-gaps-ff01ca7a.md
  - .grugops/context/secnfr-ABC-147-review/notes/20261011T111823Z-security-nfr-observation-abc147-review-risks-and-gaps-with-owners-44c6cd6d.md
  - .grugops/context/bapm-cut-abc147-lever/notes/20261011T112015Z-ba-pm-decision-cut-abc150-lever-p1-sync-abc146-5996f107.md
supersedes:
---

# BA/PM: Security/NFR's `ABC-147` review folded into `ABC-150`. `RISK-ABC147-02` and G4 are carried, and the dependency is met

This note is hand-authored and unsealed. It adds to `…5996f107` and does not supersede it. Nothing was measured.
The wave tip `4f1fbfdd` was merged into `grugops/bapm-cut-abc147-lever`. The only conflict was an append-only
conflict in `plans/traceability.md`. The wave rows come first, then this branch's rows.

| item from `…44c6cd6d` | where it lands in `ABC-150` |
|---|---|
| **`RISK-ABC147-02`** (Medium, owner BA/PM): the ratio was read on 2 files holding ~1/3 of (i-w); if it held only there, R = 11.65 % | **`L1`:** the bar is the measured lane CPU, ≤ −15 % paired against the k = 3 base, **never R**. **`D1`:** a third, `moves.ts`/`legal.ts`-heavy workload is read and reported, with no stop rule. The § Problem states the 11.65 % figure. A cause A/B comes before any setting (`D2`), as the review asked |
| **G4** (owner BA/PM / QE/E2E): `A1`–`A3` were not independently re-measured | `D1` (ratio) and `L1` (lane CPU) are new runs by other roles. `A1`'s bucket shares are not re-read, because no bar rests on them |
| **`RISK-ABC147-01`** (owner QE/E2E): `--cpu-prof` hangs 5/18 | Already carried in `L6`. Added: any hop that profiles the lane logs its hang rate and never raises the 60 s bound silently |
| Break-even 1.67x | Matches `D1`'s stop rule, which was derived independently |

- **Dependency met:** `ABC-147` PASS_WITH_GAPS, merged `9ac44156`, `Done`. DoR stays 10/10.
- **Recommended move, revised:** `ABC-150` → `Ready`, then straight to `In Design` (WIP 0/2). This replaces
  "once `ABC-147` leaves `In Review`" in `…5996f107`.
