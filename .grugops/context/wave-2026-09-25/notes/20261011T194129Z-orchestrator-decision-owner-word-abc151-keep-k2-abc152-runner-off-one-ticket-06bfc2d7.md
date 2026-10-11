---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-11T19:41:29Z
sealed: false
refs: [ABC-151, ADR-0040, ABC-152, ADR-0042, ABC-150, ADR-0041, QE-151-a, QE-149-a, QE-149-c]
---

# Owner word, 2026-10-11: keep k = 2 and merge ABC-151; ABC-152 = vitest 4.1 + runner off + test rework, one ticket; guard test delegated

Verbatim: "ABC-151 decisions: 1. keep 2 workers and merge ; Vitest - upgrade and fix/upgrade tests as well, use one ticket for it, include CPU saving. Regarding guard test, you decide."

1. **ABC-151: keep k = 2, merge.** Accepts `RISK-ABC151-HEAT-NOGAIN` (A5: k = 2 not separable from k = 3 on heat) and
   `RISK-ABC151-WALL-MARGIN` (9.27/9.38 s vs W = 10 s; hot back-to-back runs exceed 10 s). Merged to main after gates.
2. **ABC-152: one ticket, the runner-off route WITH the test rework, CPU saving in scope.** This is the owner's D4 pick
   on ADR-0042's fired split — neither "4.1 runner-on" nor "stay 3.2.7". "fix/upgrade tests as well" is read as
   covering R1–R5 rewrites (spy forms, static imports, `{ spy: true }` factories, `vi.fn` wrapper), the
   `san.test.ts` A20 key-order assertion change, and re-grounding `book.test.ts` ABC-094 A2 (`vi.resetModules()` is a
   no-op without the runner) — each rewrite must keep its guard armed (plant-checked). Deleting or skipping a test
   is NOT read as included; any such case returns to the owner. The ticket carries the CPU bar (ABC-150's ≤ −15 %).
3. **Guard test (`deps.external` over `src/`): delegated to the Orchestrator.** Decision: no separate ticket. With the
   module runner off, `deps.external` no longer governs how `src/` loads, so the hazard it guarded is moot on the
   chosen route; ABC-152's rewritten config pin (ADR-0042 D2: `VITEST_MAX_WORKERS`, no `projects`) also asserts the
   runner stays off, which is the guard that matters after the upgrade. If ABC-152's split ever lands on runner-on, the
   guard is re-opened then.
4. Folded into ABC-152: QE-151-a (hex env raise — the 4.x pin reads a different variable), QE-149-a (READ IT query
   wrap), QE-149-c (M9b: V2 must run the exit-code-only row).
5. This is the Orchestrator's transcription of the owner's word in session, not a stamp.
