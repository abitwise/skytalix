---
id: 20260925T145500Z-architect-design-observation-probe-reproduced-every-number-plus-pvs-identity-d5-4e2b9c70
kind: observation
by: architect-design
at: 2026-09-25T14:55:00Z
verified_by:
confidence: high
refs:
  - ADR-0026
  - ABC-121
  - ABC-080
  - ABC-081
  - .grugops/context/ruling-abc121-lmr-oracle/probe/
  - .grugops/context/validate-adr0026/probe/faithful.jsonl
  - .grugops/context/validate-adr0026/probe/identity-d3.jsonl
  - .grugops/context/validate-adr0026/probe/identity-d4.jsonl
  - .grugops/context/validate-adr0026/probe/identity-d5.jsonl
  - .grugops/context/validate-adr0026/probe/lmr-d4.jsonl
  - .grugops/context/validate-adr0026/probe/lmr-d5.jsonl
  - .grugops/context/validate-adr0026/probe/ratios.jsonl
  - .grugops/context/validate-adr0026/probe/nodes-to-d7.jsonl
supersedes:
---

# Every `ADR-0026` number reproduces exactly, and PVS value identity now also holds at depth 5

Hand-authored, no `seal` (degraded posture per `AGENTS.md`). The independent re-run was taken at
`61fec59` on this hop's own worktree, with node v24.12.0 on an Apple M3. The load average was
4–122 from parallel hops. That affects only the `ms` fields, which are not used here.

**Method.** I copied the ruling's `probe/lmr.ts` and `probe/run.ts` into this task's `probe/` and
re-ran them unchanged. The only later edit adds a `bug` switch to `lmr.ts`, and that switch is
inert when unset. I compared each output file with the ruling's copy after dropping the `ms` key.

| reading | original (ruling `…3b7e1a52` / `…8d25f0c6`) | re-measured | match |
|---|---|---|---|
| probe faithful to `search()` (48 cells: score, nodes, move) | 0 mismatches | 0 mismatches | byte-identical |
| PVS vs `search()` / table on vs off / deepen vs fixed, d3 | 0 / 0 / 0 of 190 (2 equal-score move diffs) | same | byte-identical |
| same, d4 | 0 / 0 / 0 of 190 (6 equal-score move diffs) | same | byte-identical |
| LMR drift vs PVS-only, d4: within 25 cp, max, mate flips | 98.40%, 50 cp, 0 | 98.40%, 50 cp, 0 | byte-identical |
| LMR drift, d5 | 99.47%, 45 cp, 0 | 99.47%, 45 cp, 0 | byte-identical |
| `ABC-080` `A3` with PVS on both sides | 47.49% vs 40.5%; 6.59% / 4.19% vs 4% | same | byte-identical |
| `ABC-081` `A3` with PVS on both sides | 77.31% / 77.01% vs 70% (position-6 43.65% passes) | same | byte-identical |
| cumulative nodes to d7, PVS+LMR (kiwipete / position-6) | 532 363 / 467 461 | same | byte-identical |
| margin vs QE `ABC-081` 3 s capacity 892 682 / 853 278 | 1.68x / 1.83x | 1.677x / 1.825x | arithmetic re-done; capacity NOT re-measured |

**New reading, which closes the ruling's own unverified item 2 (`…0f93c6b1`).** At depth 5, PVS vs
`search()`, table on vs off, and deepen vs fixed are all **0 / 190**. There are 22 move
differences at equal score, and `ABC-078` `A3`'s licence already covers them. Total nodes PVS /
base: 0.770 (`identity-d5.jsonl`). The ruling assumed PVS had the base value at d5, and now that
is measured.

**Engine-shape drift, new.** This compares deepened PVS+LMR with deepened PVS, both with a warm
table and killers:

| depth | within 25 cp | max | mate flips |
|---|---|---|---|
| d4 | 99.47% | 35 cp | 0 |
| d5 | 99.47% | 45 cp | 0 |

Both depths are inside `ADR-0026`'s bars (`oracle-d4deepen-correct.jsonl`,
`oracle-d5deepen-correct.jsonl`). So the same bars can bind `chooseMove`, as `ABC-121` `A1`
already words it.
