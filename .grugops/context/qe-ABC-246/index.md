<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-246

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-01T07:15:25Z | decision | qe-e2e | high: A1-A5, whole-lane plants and G8 run in this hop as pre-registered (PREREG c95e6324) |  | # QE on `ABC-246` at `3c5e05fd` (base `832ff246`): **PASS.** A1–A5 MET. Over the whole default lane, HSCM reds A1 only and CLOCKWINSCM reds A2 only, and both plants survive the lane at base. `G8` H 9.51 s / B 9.38 s ≤ 10 s, so W1 does not trigger. UAT waived (0 production lines); this verdict is the QE sign-off |
| 2026-11-01T07:15:25Z | observation | qe-e2e | high for gates, names, A4 and G8 as measured (ALONE, wait-clear by PID, admissible); the H-B delta is attributed to noise by in-thread row cost and per-file medians at n = 3 |  | # `ABC-246` A4/A5 gates and `G8` at `3c5e05fd` (base `832ff246`): gates 0, `npm test` 2 366 / 0 skipped ×3, names +2/−0, comment-only `engine.test.ts` diff with true figures; `G8` H 9.51 s / B 9.38 s (load1 1.08–1.79, no foreign vitest), admissible, `NFR-008` MET, W1 not triggered |
| 2026-11-01T07:15:25Z | observation | qe-e2e | high: files listed are committed on grugops/qe-ABC-246 (an observation, not an artifact-ref: no §14-gate run to bind) |  | # `qe-ABC-246` artifacts (committed on `grugops/qe-ABC-246` under `.grugops/context/qe-ABC-246/raw/`) |
| 2026-11-01T07:15:25Z | observation | qe-e2e | high: 3 plants at head and 3 at base, whole default lane each, on a scratch tree; all as pre-registered |  | # `ABC-246` A3 re-read over the WHOLE default lane: HSCM reds exactly {A1}, CLOCKWINSCM reds exactly {A2}, `none` 0 red; at base both plants survive the lane, so the two new rows are the only killers. No plant was committed |
| 2026-11-01T07:15:25Z | observation | qe-e2e | high on what was run; none blocking |  | # `ABC-246` QE findings: four INFO (QE-246-a..d) and SE-246-a confirmed (INFO, carried); none blocks, none above LOW |
