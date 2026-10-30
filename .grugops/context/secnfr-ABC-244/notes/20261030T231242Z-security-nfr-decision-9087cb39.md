---
id: 20261030T231242Z-security-nfr-decision-9087cb39
kind: decision
by: security-nfr
at: 2026-10-30T23:12:42Z
verified_by: 
confidence: high: gate read from QE's sealed readings and the code diff; nothing re-run at this hop
refs:
  - secnfr-ABC-244
  - ABC-244
  - NFR-008
  - N8-LANE
  - NFR-010
  - ADR-0046
  - ADR-0035
  - SEC-REBASE-b
  - QE-244-a
  - QE-244-c
  - QE-244-d
  - EPIC-010
  - qe-ABC-244/20261030T230742Z-qe-e2e-decision-4fe9bfe1
  - qe-ABC-244/20261030T230742Z-qe-e2e-observation-3c2ac5a2
  - qe-ABC-244/20261030T230742Z-qe-e2e-observation-98d5d2e4
  - arch-g8-headroom/20261030T223415Z-architect-design-decision-e15a97a2
  - grugops/qe-ABC-244
  - a66d20ab
  - 25282ad4
  - d59e3194
  - plans/nfr-catalog.md
supersedes: 
seal: sha256:a248bfda4341f74226aa4d1e71057873d9eda1fb43c87904a27df1f94c0f7cf4
---

# Security/NFR on `ABC-244` at `25282ad4` (base `d59e3194`): **PASS.** Security not triggered (test-only). `NFR-008` MET at head 9.25 s; design target ≤ 9.4 s MET; `N8-LANE` MET

| item | state | reading (`qe-ABC-244` `…3c2ac5a2`) |
|---|---|---|
| Security (ASVS L1, `block_on: high`) | not triggered | diff is 2 `STEP_MS` literals + 4 comments in `src/cli.test.ts`, `src/uci-session.test.ts`; no production file, config, input surface, secret or dependency |
| `NFR-008` (R-1, ≤ 10 s at load1 ≤ 8) | **MET** | `G8` H 9.25 s, B 9.69 s, H−B −0.44 s; 6/6 rc 0; load1 ≤ 1.94; CPU H 29.89 s reported |
| `ADR-0046` § Addendum 2026-10-30 design target (≤ 9.4 s) | **MET** by 0.15 s | tranche 2 does not fire |
| `N8-LANE` (650 ms CPU, two-file set) | **MET** | H−B CPU −1.145 s [−1.220, −1.070], sign 0/−8 |
| two-file set `F` | **0.250 s CPU / 0.100 s wall** | first admissible twin; replaces the provisional 16 % (1.807 s) |

- **Triggers standing** (Orchestrator's `NFR-008` watch): a later `G8` head > 9.6 s opens tranche 2; > 9.7 s after it,
  or > 10 s, goes to the owner (`ADR-0035` D6).
- **Stale sentence:** the `NFR-008` row's "the wall clause is a function of core count" is struck and kept, with a dated
  note (per-thread speed under the by-value cap), on `ADR-0035` § Addendum 2026-10-30 (routed `…e15a97a2`).
- **Carry `QE-244-a` (LOW, test strength):** owners BA/PM (R4 DoR line at each cut) and Architect/Design (tranche 2).
- No accepted risk, no required fix. No owner item. UAT waived by QE (0 production lines); this gate is the last before merge.
- Records: `plans/nfr-catalog.md` (one `_Updated` line, `NFR-008` row dated lines, one per-set `F` bullet, § `ABC-244`).
