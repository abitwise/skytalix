---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T15:39:01Z
subtask: arch-ABC-266
role: architect-design
ref: .grugops/context/arch-ABC-266/
branch: new grugops/arch-ABC-266 from main (at dispatch) — worktree .claude/worktrees/arch-ABC-266. Prototypes may use grugops/ABC-265 (cad6ae13, shared table, in QE) in a scratch checkout.
width: records; probes ≤ 5 min each, wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. Multi-worker probes count against "one core": keep them short; no timing reads while a QE hop holds the host — node/property counts only.
---
# Design ABC-266 (TH-2): Lazy SMP worker pool + UCI Threads option
## Read
plans/tickets/ABC-266*.md, ABC-267 page, ADR-0057 (ACCEPTED; § Inputs for the thread tickets; owner OQ-1..4 answers), ADR-0044 (D3/D5; D5 reversal accepted under OQ-1), ADR-0025 shared-table amendment (PROPOSED; verified-copy rule), arch-ABC-265 notes (…e396e5ab: clear/stop ordering and buffer hand-off left to TH-2).
## Do
- Write the new ADR amending ADR-0044 D3/D5 — **use number ADR-0062** (a parallel hop may take 0061). PROPOSED. Settle: Threads 1 starts no worker and stays node-equal; max threads (rec. 12, or 8); worker 0's move is played; stop slot via the injected clock; clear vs stop ordering; how workers receive the SharedArrayBuffer; isready/stop during search; error/exit handling; NFR-009 summed over workers (OQ-4 a); NFR-008 default-lane bound.
- Settle the read for ABC-266: can ABC-255's `d` set Threads per side (tools-only change?) — name the N and the exact command; S′ and Levels stay Threads 1.
- Decide whether ABC-267 folds into ABC-266 and add the multi-writer probe-then-cutoff stress case to its rows.
- Name what BA/PM needs for ABC-266 (and 267) to reach DoR 10/10.
## Fences
memory-bank/50-decisions and your records only; no src/tests/plans/board; don't edit ADR-0025's amendment text or ADR-0060. No push, force, amend, rebase, merge into main. Leave nothing running; delete scratch copies.
## Publish
Sealed notes (task arch-ABC-266, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
