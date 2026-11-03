---
id: 20261103T095012Z-architect-design-observation-ffe76d35
kind: observation
by: architect-design
at: 2026-11-03T09:50:12Z
verified_by: 
confidence: high (deterministic fixed-depth and maxNodes runs on a scratch copy of main's src 58fa3eb4; the door reproduces ADR-0061 d9's counts to the node; 42 + 8 jobs, every exit 0)
refs:
  - arch-ABC-234
  - grugops/arch-ABC-234
  - ABC-234
  - EPIC-011
  - O3s
  - Q1
  - ADR-0065
  - ADR-0024
  - ADR-0056
  - ADR-0061
  - ADR-0063
  - ADR-0050
  - ADR-0026
  - NFR-005
  - NFR-009
  - e72487e1
  - 17725732
  - arch-ABC-234/20261103T093240Z-architect-design-decision-9ac61a7a
supersedes: 
seal: sha256:8dbd4815156c95058e165f1c5ae576dc53ef1d168620c2568b03d3e2cf40dc13
---

# arch-ABC-234 results: O3s (SEE ordering only) on `main` (src `58fa3eb4`, futility in force). The premise mechanism is real, but every form misses the pay gate. S1m reads d8 0.9011 / 0.9428 in `search()` and 0.9864 / 0.9548 in `chooseMove` (≤ 0.95 needed on all four). Every form is safe. DIAGNOSTIC: Q1 (SEE pruning in quiescence) reads +0.88 ply of reach

By the rules of PREREG `…9ac61a7a` (commit `9ca30923`). Scratch copy of `main` `17725732`'s `src/`, deleted after. 42 jobs plus 8 DIAGNOSTIC jobs, one at a time under the host lock, every exit 0. Deterministic counts; no timing was read. Raw: `raw/probe/out/`, `raw/probe/out4/`.

## Instrument checks
- **Door:** exact. `search()` d8 888 786 / 1 262 046; `chooseMove` 1 306 981 / 391 451; reach 5.837; zugzwang `.004` 905 900, `.005` 1 310 019; `G1` 54 / 58.
- **SEE:** 24 / 24 `HANGING_CORPUS` losing moves read `see < 0`. Five of the six hand rows match as sealed (+100, −220 CPW x-ray, −800, 0, −10).
  - **Row 4 was a PREREG arithmetic error, not an instrument fault.** It was sealed as +500. R×R, R×R is an even trade, so the correct value is 0, and the instrument returned 0. The code was not changed. This is an instrument check, not a gate, so no bar moved.

## The premise on `main` (door, `search()` d6 over the 190 + 6, losing = `see < 0`)
- **Where losing captures sit:**
  - 69.0 % of full-width nodes (387 489 of 561 784) hold a losing capture.
  - In 387 465 of those, it is ordered ahead of a quiet move.
- **What happens to them:** 267 506 are searched. 82.8 % are refuted, 1 732 raise alpha, and **44 229 cut**. That is **9.1 % of all cutoffs**.
- **The nodes under them:** 39.1 % of nodes sit under losing captures, and 22.4 % under refuted ones. Nested subtrees are counted at each level, so these shares are not a partition.
- First-move cutoff rate: 81.9 %.
- **The sealed expectation** (≥ ~5 % of nodes recoverable) did not rule the gate out.
- **Quiescence (report, Q1):**
  - 31.3 % of quiescence moves are losing captures, and **96.9 % of them are refuted**.
  - Nested share of quiescence nodes under them: 83.4 %, an upper bound.
  - `quiesce` today neither orders by nor prunes on SEE.

## Gates (d8 ratios head / door: `search()` kiwi / pos-6; `chooseMove` kiwi / pos-6)
| form | pay `search()` | pay `chooseMove` | reach 47 000 | drift d5 `search()` / `chooseMove` | mate d4→d5 / d5→d5 | zug | `G1` | audit d6 |
|---|---|---|---|---|---|---|---|---|
| S1 (`see<0`, after killers) | 0.9143 / **1.3232** | **0.9936** / **1.4028** | +0.026 | 100 %, 0 / 100 %, 21 | 0/163; 0/189 | 7/7 | 54/58 | 0 / 32 600 flips |
| S2 (`see<0`, after all quiets) | **1.5840** / **2.1451** | **1.4333** / **2.5143** | −0.058 | 98.4 %, 56 / 98.4 %, 56 | 0/163; 0/189 | 7/7 | 54/58 | 6 / 63 480 (0.01 %), 0 ≥ 100 cp |
| S1m (`see<−50`, after killers) | 0.9011 / 0.9428 | **0.9864** / **0.9548** | +0.068 | 100 %, 0 / 100 %, 21 | 0/163; 0/189 | 7/7 | 54/58 | 0 / 30 999 flips |
- **Safety:** passed by all three forms.
- **Pay:** missed by all three forms.
- **Verdict:** no form passes, so the verdict is premise not met. No form is chosen and none is tuned. The root move and score at d8 are unchanged in every form.

## Reports
- **d7 (the ticket's `A3` depth):**
  - S1m: `search()` 0.8463 / 0.7671, `chooseMove` 0.9899 / 0.9142.
  - S1: 0.8583 / 1.0590 and 0.9914 / 1.3577.
  - S2: 1.2633 / 2.7041 and 1.2149 / 2.0529.
  - The ticket's literal `A3` (two cold `search()` readings) would pass for S1m. The pre-registered four-reading d8 gate does not, and it stands.
- **d8 on other roots (S1m, `search()` / `chooseMove`):** position-4 1.019 / 0.986; position-5 0.998 / 1.014; startpos 0.930 / 0.923.
- **Reach at 20 000:** S1m 4.842 → 4.905; S1 → 4.837; S2 → 4.663.
- **Head premise counters at d6:**
  - S1m: nodes 0.9074×, first-move cutoffs 92.6 %, cutoffs by losing captures 0.4 %.
  - S1: 0.9593×, 92.4 %.
  - S2: 2.0003×.

## DIAGNOSTIC (after the miss; not pre-registered; cannot change the verdict)
- **S1m at d10:** `search()` 0.8678 / 0.7871, `chooseMove` 0.9216 / 1.0603. There is no trend to the gate, so a deeper NEUTRAL bar is not supported.
- **Q1 over `main`** (quiescence skips `see < 0` captures, out of check):
  - **Nodes:** d8 `search()` 0.6782 / 0.3227, `chooseMove` 0.5876 / 0.2239.
  - **Reach: 5.837 → 6.721 (+0.884 ply**; 128 deeper, 1 shallower).
  - **Drift:** d5 `search()` 96.26 % within 25 cp, max 69 cp.
  - **Safety rows:** mate 0 / 163, zugzwang 7 / 7, `G1` 54 / 58.
  - **Kiwipete's d8 root:** e2a6 (−60) → d5e6 (−89).
- **S1m over Q1:** `search()` 0.8646 / 0.8679, `chooseMove` 0.9611 / 1.0953.
