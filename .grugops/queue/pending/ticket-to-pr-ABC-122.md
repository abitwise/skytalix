---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-122
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-122-gate-hardening-bounded-timeout-and-capacity-guard-test.md
ref: .grugops/context/ticket-to-pr-ABC-122/
cut_ref: .grugops/context/cut-abc122-gate-hardening/
source_refs: .grugops/context/qe-ABC-081/  .grugops/context/secnfr-ABC-081/  (K3, K4)
enqueued_by: orchestrator
enqueued_at: 2026-09-25T20:10:00Z
branch: grugops/ABC-122-gate-hardening
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-122` — bounded test gate + direct capacity-guard tests

DoR 9/10; the Orchestrator reads the one ⚠️ (item 10: `A4`'s timeout is a formula — ≥ 5× the
measured median lane wall, ≤ 120 s — fixed at delivery) as non-blocking: the checklist item is
"no major unresolved blocker", and the formula is measurable with a hard ceiling. **Measure the
median lane wall and state the constant you choose, with the reading, in the code comment and
your note.**

The ticket page is the contract (`A1`–`A12`, Scope, fences, test notes, `N8-LANE` line).

## Stop conditions (hand up, do not trim or widen)
- Any change needed outside the ticket's Scope (notably the root `!(depth >= 1)` guard, any search
  behaviour, `AGENTS.md`).
- The wrapper cannot kill the whole process tree portably with Node builtins on macOS.
- `N8-LANE` over its line: measure and report, do not trim tests.

## Fences
Never merge; never push. Do not touch `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs.
Own `git worktree` under `.claude/worktrees/` (symlink `node_modules` from the main checkout).
Commit messages via a scratchpad file and `git commit -F`; probes as node scripts. Parallel hops
(Architect/Design on `ABC-121`, Scribe on `AGENTS.md`) run on other branches.

## Publish
`decision` + `observation` + `claim` notes under `ref:`, a trace row, a ticket § Delivery. Queue
pending → claimed → done per Workflow 17. Report: gates (lint / typecheck / build / files / passed
/ skipped / skip-integrity) run THROUGH the wrapper, each criterion MET or not with its reading,
the chosen timeout + the lane-wall reading behind it, mutants and which rows red them, the
synthetic-hang proof (elapsed, exit code, orphan check), `N8-LANE` charge with load average, sha,
numstat.
