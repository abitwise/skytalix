---
id: 20260723T205627Z-orchestrator-decision-562bb8c9
kind: decision
by: orchestrator
at: 2026-07-23T20:56:27Z
verified_by: 
confidence: high
refs:
  - ABC-003
  - ABC-001
  - ABC-002
  - EPIC-001
  - NFR-001
  - plans/board.md
supersedes: 
---

Routing decision for ABC-003 (apply/undo a move) through workflow 04 (ticket-to-pr).

**Readiness gate: PASS.** Checked against `definition-of-ready.md`: problem/user/value stated, scope + out-of-scope explicit, INVEST-shaped, five Given/When/Then acceptance criteria each measurable (a FEN identity, an ep square, a clock delta), dependencies named (ABC-001 FEN oracle, ABC-002 move source) and both Done on main, NFR trigger marked with a construction-level target, test notes present (property test named), size M, priority P0, no blocker. Pulled straight from Ready — no analysis or design hop needed.

**Board:** `Ready → In Development` (Ready 1→0/8, In Development 0→1/3). WIP respected without a written exception.

**Roles activated: Software Engineer → QE/E2E, sequential.** The change is one small in-memory function pair; the flow is linear, not parallel, so width stays 1.

**Security/NFR deliberately skipped, with reason.** The ticket marks "No security trigger." Its only NFR trigger is NFR-001 (throughput): make/unmake is the hottest path in the engine, once per search node. That NFR is satisfied *by construction* — the required approach (in-place mutation + a small fixed-size undo record, full position copying explicitly rejected) is baked into the implementation contract, and ABC-008's spike already established the 0x88 representation clears NFR-001 with headroom. QE verifies the no-copy property in its pass. In lean mode the In Security/NFR column stays empty unless a risk-bearing surface fires; none does here.

**Next:** SE implements test-first on `grugops/ticket-to-pr-ABC-003`, runs the mandatory gate (lint, typecheck, unit, build), then QE breaks it. Autonomy=pr — the factory stops at a reviewable branch/PR; humans hold merge.
