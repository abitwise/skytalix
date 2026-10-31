---
id: 20261031T070536Z-architect-design-observation-ce01caa3
kind: observation
by: architect-design
at: 2026-10-31T07:05:36Z
verified_by: 
confidence: high: files and commit as written (recorded as an observation: no §14 gate run backs an artifact-ref here)
refs:
  - arch-g8-tranche2
  - ADR-0046
  - ADR-0035
  - ADR-0050
  - ADR-0040
  - NFR-008
  - EPIC-010
  - ABC-244
  - ABC-245
  - ABC-246
  - ABC-221
  - ABC-242
  - ABC-243
  - ABC-167
  - ABC-171
  - ABC-174
  - ABC-197
  - ABC-212
  - ABC-220
  - ABC-241
  - ABC-208
  - QE-245-b
  - QE-221-c
  - QE-208-a
  - QE-208-b
  - T2a
  - T2b
  - T2c
  - T2d
  - T2-R
  - W1
  - R1
  - R2
  - T-QEHOP-GROWTH
  - qe-ABC-245/20261031T064950Z-qe-e2e-observation-af467c7b
  - qe-ABC-245/20261031T064950Z-qe-e2e-observation-cf53b0ed
  - qe-ABC-244/20261030T230742Z-qe-e2e-observation-3c2ac5a2
  - qe-ABC-243/20261031T040755Z-qe-e2e-observation-99b6b89f
  - qe-ABC-242/20261031T051332Z-qe-e2e-observation-24035110
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-b348899a
  - se-ABC-244/20261030T224640Z-software-engineer-observation-ee17f704
  - se-ABC-244/20261030T224640Z-software-engineer-observation-1b63ff56
  - 38d02496
  - 4cd261c1
  - c48a6f83
  - 9c008db4
supersedes: 
seal: sha256:371474d63a66697cbe20793dad8e16806cf3083071dc282c47f6241f45e50e99
---

# What `arch-g8-tranche2` wrote: `ADR-0046` § Addendum 2026-10-31 (commit `38d02496`) and the census probe under `raw/probe/`

- **`memory-bank/50-decisions/ADR-0046-…md`:**
  - a § Status paragraph dated 2026-10-31;
  - the dated section at the end of the file: § Addendum 2026-10-31 (`arch-g8-tranche2`), covering the reading, the
    noise question, the census, the candidates, T2-R, W1, the owner framing, Consequences and Rollback.
  - The edit is insertions only (+214 lines). No earlier line is changed.
- **`.grugops/context/arch-g8-tranche2/raw/probe/`:**
  - `last-run-se-ABC-221-c48a6f83.json` (sha256 `8e4e281c…f8dd`), a byte copy of `se-ABC-221`'s lane report;
  - `rank.py`, a copy of `arch-g8-headroom`'s, with its output `rank.out`;
  - `rows.py` with `rows.out`;
  - `timeline.py` with `timeline.out`;
  - `uci-rows.out`.

  Every script reads the JSON. None runs vitest.
- **`raw/`:** the note bodies, `seal-spec.json` and `seal.mjs`, which is the sanctioned writer's wrapper copied from
  `arch-qe242a-ruling`.
- **Not touched:** `src/`, `tools/`, `data/`, `AGENTS.md`, ADR-0035, tickets and the board. Nothing was run, timed,
  pushed or merged.
