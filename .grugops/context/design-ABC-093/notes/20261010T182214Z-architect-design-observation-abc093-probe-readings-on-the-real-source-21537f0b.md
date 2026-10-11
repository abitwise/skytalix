---
id: 20261010T182214Z-architect-design-observation-abc093-probe-readings-on-the-real-source-21537f0b
kind: observation
by: architect-design
at: 2026-10-10T18:22:14Z
verified_by:
confidence: high
refs:
  - ABC-093
  - ABC-094
  - ABC-096
  - NFR-006
  - NFR-008
  - N-LOAD
  - ADR-0037
  - ADR-0023
  - .grugops/context/design-ABC-093/probe/measure.ts
  - .grugops/context/design-ABC-093/probe/RUN.txt
supersedes:
---

# `ABC-093` format candidates measured on the real source: Zobrist keys come to 356,295 B (34%), FEN keys to 592,320 B; the replay walk examines 5,390 of 5,390 entries, and 0 are illegal

**How the readings were taken.**
- This note is hand-authored and unsealed.
- **Harness.** `probe/measure.ts` ran on the Architect's own harness. It imports `src/` read-only from
  the worktree at `489c549e` and writes nothing into the repository.
- **Source.** `lichess-org/chess-openings` `a.tsv`…`e.tsv`, fetched from master into a private
  scratchpad (not committed). The sha256 of each file is in `RUN.txt`. The master head read through
  the GitHub API was `a6189a30` (2026-10-06).
- **Host.** Node v26.11.0, Apple M3, load1 ≈ 14, so every millisecond figure is diagnostic only.

| reading | value |
|---|---|
| source rows / SAN rejected | 3,865 / **0** |
| lines over 12 plies (longest) | 1,012 (36); their names are not attached |
| positions at ≤ 12 plies / with ≥ 1 move | 5,390 / 3,626 |
| positions with > 1 source name / Zobrist collisions against 4-field FEN | **0 / 0** |
| bytes: Zobrist hex + names + line-count weights | **356,295** (34.0% of 1,048,576) |
| bytes: the same with uniform weights / 4-field FEN keys / Zobrist without names | 355,778 / 592,320 / 211,370 |
| replay walk from the start position | **5,390 of 5,390** entries, 5,825 moves, **0 illegal**, about 106 ms |
| compile (parse every SAN, build, emit) | about 478 ms; two emits in one process are byte-identical |
| `JSON.parse` of the artifact | 3.5 ms (one reading) |
| first moves | 20. Line-count shares: `e2e4` 52.6%, `d2d4` 34.5%, `c2c4` 5.2%, `g1f3` 2.8%. Uniform: 5.0% each |
| after `1. e4` | 19 replies; named "King's Pawn Game" |

**What these readings do not show.**
- **The delivered artifact.** The build pins its own SHA, so `A5`'s figure stays `UNKNOWN - verify`
  until that file is measured.
- **A lane cost under `NFR-008`'s protocol.** The walk ran in-process, once, on a loaded host.
- **Probe-time cost for `ABC-094`'s 30 ms / 5 ms bars.** Not measured.
