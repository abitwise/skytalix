---
id: 20261022T141255Z-software-engineer-observation-8392960f
kind: observation
by: software-engineer
at: 2026-10-22T14:12:55Z
verified_by: 
confidence: high (every figure was run; counts only, no timing)
refs:
  - ABC-178
  - QE-177-a
  - ABC-167
  - EPIC-007
  - ABC-177
  - ABC-197
  - 43e4996f
  - efaa0a76
  - 20261022T134641Z-ba-pm-decision-8165d1ba
  - 20261022T134635Z-ba-pm-observation-d5e744dd
  - 20261020T220000Z-ba-pm-decision-qe177-a-b-cut-abc178-c-accepted-7c41e9a2
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - src/uci-session.test.ts
supersedes: 
seal: sha256:fc3bded9dc4acb20e1171ee2c4f4d3c36d62187163fa822b55eb1a9e583e255a
---

# ABC-178 red-first (B6 rows QP0/QP1, SE pre-check): QP1 survives the whole lane at base and goes red on R1 alone at the tip

- **Harness:** `qe-ABC-177/probe/gap/gp.mjs`, byte copy (`cmp` equal; sha256 `69b2e0ba…76ce`). Only QP0 and QP1 were run. QP6 belongs to `ABC-197`.
- **Trees (scratch):** B = `git archive 43e4996f`; H = B plus the R1 test file (`diff -rq` on `src/` shows only `src/uci-session.test.ts`). Each tree has its own full `cp -R` copy of `node_modules`.
- **Results (counts only; the probe's seconds are contended and not claimed):**

| tree | mode | probe | exit | total | red |
|---|---|---|---:|---:|---|
| B | lane | QP0 | 0 | 1 995 | 0 |
| B | lane | QP1 | 0 | 1 995 | **0** (the gap is real at base) |
| H | lane | QP0 | 0 | 1 996 | 0 |
| H | lane | QP1 | 1 | 1 996 | **1**: `ABC-167 A6 … ABC-178 R1: a hold left in one session is not released by a fresh session` |
| H | file | QP0 | 0 | 127 | 0 |
| H | file | QP1 | 1 | 127 | 1 (R1 only) |

- `gp.mjs` restored and compared production after each probe (no RESTORE FAILED).
- B6 itself is QE's gate. This is the SE's red-first, not QE's verdict.
