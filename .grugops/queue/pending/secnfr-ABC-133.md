---
task: wave-2026-09-25
subtask: secnfr-ABC-133
role: security-nfr
workflow: agent-factory/workflows/05-pr-quality-gate.md (Security/NFR gate)
ticket: plans/tickets/ABC-133-count-the-spawn-pin-over-the-parser-view-not-a-stripped-string.md
ref: .grugops/context/secnfr-ABC-133/
source_refs: .grugops/context/ticket-to-pr-ABC-133/notes/, .grugops/context/qe-ABC-133/notes/ (…27801a15, …71511fc2, …f589327d) — on the ticket branch
enqueued_by: orchestrator
enqueued_at: 2026-10-10T14:29:16Z
branch: grugops/ABC-133-spawn-pin-parser-view (tip e542c574)
---

# Subtask: Security/NFR gate on `ABC-133` — the spawn pin (V1.2.5 drift guard / N8_SPAWN) now reads the parser view

The ticket page recommends this hop because the instrument behind V1.2.5 / `N8_SPAWN` changed. Rule:
does the new pin still discharge what the catalog and your earlier rulings rely on (`N8_SPAWN` = 27,
AR-058-STRIP)? Grade QE's gaps QE-133-a (loaders other than import/require, incl. `createRequire`, which
the file itself now imports) and QE-133-b (unwrapped callees): accepted risk with trigger, or a ticket
(say what it must pin; BA/PM cuts). Note A4's ~31 % headroom (QE-133-f) if it matters to NFR-008.

Verdict: PASS / PASS_WITH_RISKS / FAIL with required fixes. Test-only additions on the ticket branch only
if a required fix is small and inside the page's scope; otherwise route.

## Fences
No production `src/`. `plans/nfr-catalog.md` only if a catalog line must change (cite committed notes).
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into
YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Security/NFR. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, rulings on QE-133-a/b/f,
accepted risks with triggers, follow-ups with owners, gates, branch + sha.
