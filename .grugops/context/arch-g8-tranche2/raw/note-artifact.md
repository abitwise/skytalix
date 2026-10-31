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
