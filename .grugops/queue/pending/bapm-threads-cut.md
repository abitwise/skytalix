---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T13:52:30Z
subtask: bapm-threads-cut
role: ba-pm
ref: .grugops/context/bapm-threads-cut/
branch: new grugops/bapm-threads-cut from main (9dc320b1) — worktree .claude/worktrees/bapm-threads-cut
width: records only; no test, build or engine run.
---
# Fold owner answers into EPIC-011 pages; cut the thread tickets
## Read
Owner decision …81ae2db4 (.grugops/context/orch-2026-10-30a/), ADR-0057 § "Inputs for the thread tickets", ADR-0056 C2′/C1/D6, ADR-0058/0025 status lines, arch-owner-answers-1102 notes (…1b50793b, …a0df22b8, …c0591ef8).
## Do (plans/ only)
- EPIC-011: lift the "Threads" half of § Out of scope (pondering stays out); record P (phase 1 paused, owner order), C2′ (NEUTRAL bar named on the page before the read), the 40/15 claim labelled 1 CPU / N CPU (OQ-3 c, Threads 1 first), NFR-009 reading (OQ-4 a), OQ-5 no, OQ-6 later. Place the thread strand per ADR-0057 (after Phase 2 + R1, before Phase 3; TH-1 may run beside Phase 2).
- Cut TH-1 (shared table), TH-2 (worker pool + UCI Threads option, default 1), TH-3 (tests/lanes; may fold into TH-2) as ABC tickets with acceptance rows from the ADR-0057 inputs, sizes, falsifiers, reads (TH-1: no game read, G4 identity + G6; TH-2: Threads N vs Threads 1 GAIN read, hardware gain). Mark DoR honestly — TH-1 needs its ADR-0025 amendment written before Ready.
- ABC-264 page: A2 wording per ADR-0059 QE-264-b fix (static bound ≤ 10 885 cp).
- ABC-237/257/258 pages: status lines for P/A/B (paused / accepted-not-in-force / parked).
## Fences
plans/ and your records only; no src/tests/memory-bank/board edits. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task bapm-threads-cut, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
