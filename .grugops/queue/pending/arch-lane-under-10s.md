---
subtask: arch-lane-under-10s
role: architect-design
tickets: []
ref: .grugops/context/arch-lane-under-10s/
---

# Architect: size a remedy to bring the default lane under NFR-008's 10 s (R-174-1)

The owner accepted R-174-1 with option (a) (`…bdff4d33`): ABC-174 merges on the risk, and Architect/Design sizes a remedy. Since then ABC-174 has merged (`8522609d`).

## Read first
- `plans/nfr-catalog.md`: NFR-008, NFR-010, R-173-1/-2.
- ADR-0035 (the N8-LANE instrument).
- ADR-0008 and its heap-cap addendum (ABC-173's 2 executors and heap ceiling).
- The QE timing note `.grugops/context/qe-ABC-174/notes/…5d9a0f63` and its `probe/` raw data, which give per-file costs where available.
- `secnfr-ABC-174`'s decision `…6b1e94d2`.
- `AGENTS.md`'s lane lines.

## Do (records only)
1. **Find where the ~27.7 s CPU / ~10.0 s wall goes.** Use the existing raw data and vitest reports already on disk. Rank the files and rows by cost. Where data is missing, say UNKNOWN - verify; do not time anything.
2. **Propose ranked remedy options** that bring the lane to ≤ 10 s with headroom, without loosening any pin or skipping any row. Examples: move rows to deep lanes with a BA/PM ruling, cheapen clocks or steps, restructure files, change vitest pool or isolation settings within the ADR-0008 caps. For each option give:
   - the expected saving, labelled as an estimate;
   - the risk;
   - the owner role;
   - its size (XS–XL).
3. **Recommend one.** Write it as an ADR, PROPOSED, in `memory-bank/50-decisions/`, with the next free ADR number. Include the measurement plan QE would use: N8-LANE plus a full-lane twin in a quiet window.
4. Name the ticket BA/PM should cut. The next free id is **ABC-177**. Do not cut it yourself.

## Fences
- No timing and no lane runs; another hop runs in parallel.
- Do not touch `src/`, `tools/`, `AGENTS.md`, `vitest.config.ts`, `plans/` or `nfr-catalog.md`.
- Work in records only, on main's working tree, and leave them uncommitted.
- Never push or merge.

## Publish
- Notes under `ref:`, including a `kind: decision`.
- `.grugops/queue/done/arch-lane-under-10s.md` (brief + `## Result`) and `.claim.md`, uncommitted.
- List any owner questions plainly.
