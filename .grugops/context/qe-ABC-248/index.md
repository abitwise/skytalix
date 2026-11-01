<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-248

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-01T08:30:46Z | decision | qe-e2e | high: every lever condition and A3-A11 run in this hop as pre-registered (PREREG af00650c); verdict PASS_WITH_GAPS, no gap blocking |  | # QE on `ABC-248` at `18bad5fb` (code `71700836`, base `main` `46365ed0`): **PASS_WITH_GAPS, no gap blocking.** Every lever meets its condition and A5–A11 are MET. `G8` H 9.09 s / B 9.37 s, so W1 is not triggered and the 9.4 s design target is met. The one MEDIUM gap is in the ruling's text, not the delivered code. UAT is waived (0 production lines), and this verdict closes the gate |
| 2026-11-01T08:30:46Z | observation | qe-e2e | high for gates, names, deep lane, N8-LANE and G8 as measured ALONE (wait-clear, admissible, no foreign vitest); N8-LANE Tctl median 80.8 C logged, not gated |  | # `ABC-248` gates and timing as run, ALONE: gates 0; `npm test` 2 362 ×3, 0 skipped; `N8-LANE` MET (H−B CPU −0.635 s); `G8` H 9.09 s / B 9.37 s, admissible, `NFR-008` MET, design target met, W1 not triggered; the deep lane prints "4 passed" |
| 2026-11-01T08:30:46Z | observation | qe-e2e | high: fresh base and tip kill runs on a QE-written runner, 137 mutants and 26 plants, all base before any tip; node census and non-vacuity read in scratch |  | # `ABC-248` A5/A6/A7 as run by QE: T2a 120 → 120, T2d A4-a2 8 = 8, plants 26 → 26, per-row sets equal at B and H; `insideNull` 4, `underNull` 19/19; node census −435 052 |
| 2026-11-01T08:30:46Z | observation | qe-e2e | high on what was run; QE-248-d (equivalence of QPARITY) is reasoning from the code, UNKNOWN - verify as a proof; none blocking |  | # `ABC-248` QE findings: ruling 6's `-t` form is vacuous (QE-248-a, MEDIUM, carrier BA/PM); P-2 leaves QPLY4 alive across the whole lane (QE-248-c, LOW, pre-existing); five INFO. None blocks |
| 2026-11-01T08:30:46Z | observation | qe-e2e | high: files listed are committed on grugops/qe-ABC-248 (an observation, not an artifact-ref: no §14-gate run to bind) |  | # `qe-ABC-248` artifacts: branch `grugops/qe-ABC-248` (from `18bad5fb`), PREREG `af00650c`, raw evidence and scripts under `.grugops/context/qe-ABC-248/raw/` |
