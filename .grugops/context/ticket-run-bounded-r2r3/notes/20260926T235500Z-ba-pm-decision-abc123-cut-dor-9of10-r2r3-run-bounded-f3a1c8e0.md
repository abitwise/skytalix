---
id: 20260926T235500Z-ba-pm-decision-abc123-cut-dor-9of10-r2r3-run-bounded-f3a1c8e0
kind: decision
by: ba-pm
at: 2026-09-26T23:55:00Z
verified_by:
confidence: high
refs:
  - ABC-123
  - ABC-122
  - tools/grugops/run-bounded.js
  - tools/grugops/run-bounded.proof.js
  - tools/grugops/run-bounded.hang-fixture.js
  - plans/tickets/ABC-123-run-bounded-timeout-ceiling-and-stale-header.md
  - plans/tickets/ABC-122-gate-hardening-bounded-timeout-and-capacity-guard-test.md
  - .grugops/context/secnfr-ABC-122/notes/20260925T151300Z-security-nfr-decision-abc122-pass-with-accepted-risk-n8lane-met-k3-k4-closed-2749a2e6.md
  - .grugops/context/secnfr-ABC-122/notes/20260925T151200Z-security-nfr-observation-abc122-kill-surface-no-mistarget-no-shell-tree-escapes-sigkill-class-stops-284db7df.md
  - .grugops/context/wave-2026-09-25/notes/20260926T235000Z-orchestrator-decision-c99c5919.md
supersedes:
---

# ABC-123 cut: `run-bounded.js` — reject `N` above the timer's `2^31 − 1` ceiling (R2), correct the stale header (R3). DoR 9/10, 1 ⚠️ — pullable today

Hand-authored and unsealed: a `decision`, not a stamp. There is no `scripts/context-io.ts` on
this install and `human_admission` is `off` (`.grugops/factory.config.json`), the same posture
every prior hop in this worktree recorded under.

## Owner's word and source, not re-derived

Owner (Olger Oeselg), 2026-09-26, verbatim: **"both"** — in answer to the Orchestrator's dispatch
naming R2 + R3 in `tools/grugops/run-bounded.js` for BA/PM
(`.grugops/context/wave-2026-09-25/notes/20260926T235000Z-orchestrator-decision-c99c5919.md`).

R2 and R3 are named, rated and scoped entirely by Security/NFR's own `ABC-122` gate note
(`…2749a2e6.md`, `…284db7df.md`): both LOW, no ASVS L1 failure, both deferred to "the next
licensed touch of `tools/grugops/`" with the Software Engineer as owner and the Orchestrator as
scheduler. **R1 (the SIGKILL-class session-escape residual) was accepted by the owner separately
and is out of scope here** — this cut does not reopen it, and the ticket page fences it explicitly
in three places (`## Out of scope`, `## Dependencies`, the DoR row for item 3).

## What was cut

One new ticket, `ABC-123` (`XS`, `P2`, `EPIC-004`), at
`plans/tickets/ABC-123-run-bounded-timeout-ceiling-and-stale-header.md`. Two scoped fixes in one
file: a numeric upper-bound guard (R2) and a comment-only header correction (R3), bundled on the
owner's own word the same way `ABC-122` itself was bundled on the owner's and Orchestrator's word.
Eight acceptance criteria (`A1`–`A8`), each testable and measurable — three exact `N` values with
an exit-code assertion, a boundary-exactness check, a red-then-green demonstration discipline
(mirroring `ABC-122` `A3`/`A7`/`A9`), two grep-checkable doc-accuracy assertions, a comment-only
line-class check, and a git-diff fence.

## DoR score: 9/10, 1 ⚠️ — PULLABLE TODAY

Full table is on the ticket page. The one ⚠️ (item 10) is a deliberate open judgment call, not a
blocker: `A5`'s exact replacement prose for the header's process-model sentence is not supplied —
BA/PM names the checkable facts (the word "session" present, R1's reason named) and leaves the
exact wording to the delivering hop, the same shape `ABC-122`'s own DoR ⚠️ used for `A4`'s
formula-not-constant default timeout.

## Checked for overlap

No other ticket currently in `Backlog` touches `tools/grugops/run-bounded.js`,
`run-bounded.hang-fixture.js` or `run-bounded.proof.js` — checked by reading `plans/board.md`'s
`Backlog` section and `plans/tickets/`, not by name alone.

## Board and traceability

Board row text proposed for the Orchestrator (not written to `plans/board.md` here, per this
role's fence): a `Backlog` entry for `[ABC-123]`, DoR 9/10 ⚠️x1, size `XS`, priority `P2`, epic
`EPIC-004`. One row appended to `plans/traceability.md` (`ABC-123 (cut)`), nothing touched in
place.
