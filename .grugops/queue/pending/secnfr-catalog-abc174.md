---
subtask: secnfr-catalog-abc174
role: security-nfr
tickets: [ABC-174]
ref: .grugops/context/secnfr-catalog-abc174/
---

# Security/NFR catalog follow-up after ABC-174's merge (records only)

ABC-174 merged to main as `8522609d`, with UAT accepted (`…ecff6698`). The NFR-004 lines from `secnfr-ABC-174` are applied (`ffa1f4ce`).

## Do, in `plans/nfr-catalog.md` only
1. **SEC-174-1:** line ~:1405, THE LEVEL LAYER, still defines "at default difficulty" as `LEVELS[3]`. Add a dated note in the same style as `ffa1f4ce`, now true from `8522609d`.
2. **NFR-008, first verdict on the current 10 s clause: NOT MET.** `npm test` median wall 10.010 s, R 0.28 s, CPU 27.73 s, load1 3.10–6.01, on the combined tree `be6a5599`. Source: `qe-ABC-174` `…5d9a0f63`; your own recompute is `secnfr-ABC-174` `…6b1e94d2`.
   - Record **R-174-1** as owner-accepted (`…bdff4d33`), owner Olger Oeselg.
   - Say that Architect/Design owes a remedy (`arch-lane-under-10s`, running in parallel).
   - **R-173-1 stays open.** Keep F and RISK-ABC144-FCAP unchanged, as you ruled.
3. Hash every other row before and after, and report them byte-identical.

## Fences
- Edit `plans/nfr-catalog.md` and your notes only. Leave them uncommitted.
- No timing and no lane runs.
- Do not touch `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or ADRs.
- Never push or merge.

## Publish
- Notes under `ref:`, including a `kind: decision`. Use the sanctioned writer if available.
- `.grugops/queue/done/secnfr-catalog-abc174.md` (brief + `## Result`) and `.claim.md`, uncommitted.
