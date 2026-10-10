---
id: 20261010T150202Z-qe-e2e-decision-abc136-verdict-pass-with-gaps-b5b3f575
kind: decision
by: qe-e2e
at: 2026-10-10T15:02:02Z
verified_by:
confidence: high
refs:
  - ABC-136
  - ABC-057
  - ABC-134
  - ADR-0011
  - R5b
  - QE-057-a
  - QE-136-a
  - QE-136-b
  - QE-136-c
  - src/history-pane.nfr.test.ts
  - 20261010T150202Z-qe-e2e-observation-abc136-ledger-pins-spans-gate-cost-2f217343
  - 20261010T150202Z-qe-e2e-observation-abc136-gap-register-f3fd60a0
  - 20261010T144820Z-software-engineer-decision-abc136-two-framed-operand-pins-and-a-reach-comment-5b359211
  - 20261010T144820Z-software-engineer-observation-abc136-gates-ledger-a1-a5-cost-881e15e2
supersedes:
---

# `ABC-136` QE: **PASS_WITH_GAPS**. `A1`–`A5` are MET on QE's own trees, no test added, and two LOW gaps are routed to Architect/Design

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).

- **Scope.** Subtask `qe-ABC-136`, Workflow 04 review exit.
  - Branch `grugops/ABC-136-licence-operands`: tip `520fa185`, code `b50b0e2b`, base `c715b3c2`.
  - The authoritative scope and risks are the ticket's `## Scope` / `## Out of scope`.
- **Method.**
  - Every reading was taken on a fresh `git archive` tree, using QE-057's planter unchanged plus QE's own `plantqe136.py`.
  - Readings: `…2f217343`. Gaps: `…f3fd60a0`. Raw files: `../probe/`.

## Verdict per criterion

| | verdict | the evidence, in one line |
|---|---|---|
| `A1` | **MET** | `QSCAN-NARROW+FMT`, and the same with `+WPERFT-STATIC`: exit 0 12/12 at base → **exit 1** at the tip, on the tripwire ("scans EVERY production module") |
| `A2` | **MET** | `QLHS-INTERSECT+FMT`, and the same with `+WPERFT-STATIC`: exit 0 → **exit 1** on the tripwire. With the scan pin deleted, the importer pin alone still kills both |
| `A3` | **MET** | `CONTROL` 12 = base. `M15`/`M15SUB` red on the tripwire. `WLAUNDER` 3, `WSTALELICENCE` 1 and `WPERFT-STATIC` 1 fail the same tests by name. No `PLANT-FAILED` in 54 builds, and each anchor counts 1 |
| `A4` | **MET** | The phrase count goes 1 → **0**. The tripwire's `//` comment names `R5b`, `productionModulesIn` and `runtimeImporters`, and says "not tamper-proof" |
| `A5` | **MET** | Base → code is one path, +16/−2 with 6 executable lines. The guard's three framed statements count 1 at base and at the tip. QE-057's seven spans hash identically. The gate is green |

## Decisions

- **The `biome-ignore` is endorsed.**
  - It is justified: removing it yields exactly one `noTemplateCurlyInString` warning, on the pinned literal.
  - It is scoped to one node: a second `${`-in-string placed right after it in the same `it` is still flagged.
- **No test is added.**
  - Every surviving narrowing is either the residual the ticket fences out ("a weakening that keeps the pinned text") or a span the Architect placed outside `R5b` (clause 1's helper).
  - Closing either one would change *what is pinned*, which is the Architect's ruling and not QE's spelling. Folding it here would be hidden scope.
- **`QE-136-a` (LOW).** A gate-clean in-place `splice` placed after the importer statement survives with `WPERFT-STATIC`, across the full suite.
  - It sits inside `R5b`'s ruled property: "any gate-clean edit between `productionModulesIn(directory)` and the comparator that changes … the importer set reds the drift tripwire".
  - The two pins that the ticket scoped do not reach it.
  - Routed to Architect/Design.
- **`QE-136-b` (LOW).** Narrowing clause 1's helper `productionModulesIn` (`:163-164`) is gate-clean and drops the kill.
  - No test pins the helper's text.
  - The new comment and the message "scans EVERY production module" read wider than the call-site pin.
  - Routed to Architect/Design.
- **Cost: UNKNOWN - verify.**
  - Both `ADR-0035` sets were inadmissible: twin +1.73 % and +1.92 %, at load1 median 14.50 and 13.26.
  - No figure is claimed against the 0.058 s floor.
  - Structurally, the two added scans cost 0.37 µs. That is an observation, not a reading.
- **The board move is the Orchestrator's.**
  - The ticket may leave `In Review`.
  - UAT is WAIVED by the standing rule (0 production lines, measured).
  - `ABC-134` may follow on this file.
  - Not merged, not pushed.
