---
task: wave-2026-09-25
subtask: design-ABC-150
role: architect-design
ticket: plans/tickets/ABC-150-vitest-runs-the-engine-5x-slower-than-node-find-why-then-cut-the-lanes-cpu.md
ref: .grugops/context/design-ABC-150/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/design-ABC-150
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: ABC-150 D1–D3. Why does vitest run the engine ~5x slower than node, and which ONE setting removes it?

The ticket page is the contract. ABC-147's probe (`.grugops/context/ticket-to-pr-ABC-147/`) and Security/NFR's review (`.grugops/context/secnfr-ABC-147-review/`) are on main.
- **D1:** re-read the factor on workloads E and S plus a third, `moves.ts`-heavy workload, as paired, interleaved ratios with equal digests. A pair reading below 1.67x → STOP and return to BA/PM.
- **D2:** test one candidate at a time (transform/sourcemaps, worker thread flags, module interop; the pool type is already ruled out). A candidate explains the factor if it removes ≥ 50 % of the excess on both files.
- **D3:** an ADR (PROPOSED) naming ONE setting (config value, `test` script, or dependency version), with no `src/` and no test content. If no runner setting removes the factor, rule that, and the ticket closes at the ruling.

D1 and D2 are paired ratios, so they need no quiet window, as ABC-147 A2 showed. Log load1 and the thermal pressure level before each process. **Do not take L1–L4 readings**: those are the build's, in a no-other-hop window.
QE on ABC-144 is running in parallel. Never set `--cpu-prof` on the full lane (RISK-ABC147-01). Probe scripts go under `ref:`.
Do not touch `src/`, `vitest.config.ts`, `package.json` or `plans/board.md`. Never merge or push. Publish notes per Workflow 16 and a trace row at the END of `plans/traceability.md`.
