---
id: 20260925T225500Z-qe-e2e-decision-abc122-pass-with-findings-1a9b3e6f
kind: decision
by: qe-e2e
at: 2026-09-25T22:55:00Z
verified_by:
confidence: high
refs:
  - ABC-122
  - qe-ABC-122
  - ticket-to-pr-ABC-122
  - amend-abc122-a4-pin
  - plans/tickets/ABC-122-gate-hardening-bounded-timeout-and-capacity-guard-test.md
  - .grugops/context/qe-ABC-122/notes/20260925T225000Z-qe-e2e-observation-abc122-hostile-cases-mutants-gates-a11-base-8f1c4d02.md
supersedes:
---

# ABC-122 QE verdict: PASS WITH FINDINGS

Hand-authored and unsealed (`scripts/context-io.ts` / `mcp__grugops__propose_note` absent from
this install; `context.human_admission` is `off`, per `AGENTS.md`'s no-`finding` note). A
`decision`, not a stamp: this hop's own recorded verdict per the `qe-e2e` role's "clear
pass/fail with gaps named".

## Verdict: **PASS WITH FINDINGS**

All 12 acceptance criteria (`A1`–`A12`) reproduced independently and MET, at commit `1fee8ff`'s
base (`ca9f42d` is the delivered code commit). 6 hostile cases against the wrapper all passed
(readings in `8f1c4d02`). 2 of 6 claimed guard mutants re-applied by hand, both matching the
build hop's reported readings exactly, byte for byte on the failure signature. The `A11` base
question is ruled: the wave merge-base (`0bc31e1`) is the correct fence-reading base, confirmed
by git history, not merely re-asserted. `lane-inventory.js`'s exit-1 finding is confirmed
pre-existing (`b324cb6`, before this branch existed) and not `ABC-122`'s.

**"WITH FINDINGS" because five gaps are named, none of which reopens a criterion:**
1. `tools/grugops/run-bounded.js`'s own header comment is stale ("NOT YET WIRED IN"), post-`A4`.
2. `N8-LANE` / the process-kill security surface are Security/NFR's to rule, not re-measured here.
3. `A6`/`A8` were not test-first (disclosed by the build hop; mutants substitute for red-first).
4. Windows and Linux remain unexercised (macOS-only project, unchanged since the build hop).
5. `AGENTS.md`'s `### Test` line is still owed to the Scribe.

None of the five is a regression, a correctness gap, or grounds to fail the gate — each is either
inert (1), explicitly out of this hop's ownership by the queue task itself (2), already disclosed
and independently substituted for by watched-red mutants (3), an unchanged pre-existing limit (4),
or a already-named, already-owed doc follow-up outside this hop's fence (5).

## Recommendation

`ABC-122` is ready to move `In Review → In Security/NFR` (Workflow 05's next hop; the Orchestrator
makes the board move — fenced from this hop). Security/NFR should re-read `N8-LANE` (sign 5/8 at
n=8, medium confidence per the build's own reading) and rule on the process-kill / `N8-SPAWN`
surface, per this hop's own queue task instruction.

Full readings, the hostile-case table, the two reproduced mutants and the `A11` base ruling are in
observation `8f1c4d02`, not restated here.
