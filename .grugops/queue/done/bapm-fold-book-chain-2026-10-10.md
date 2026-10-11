---
task: wave-2026-09-25
subtask: bapm-fold-book-chain-2026-10-10
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/bapm-fold-book-chain-2026-10-10/
source_refs: memory-bank/50-decisions/ADR-0037*, .grugops/context/design-ABC-093/notes/ (decision …d06f5ba8 = the per-page fold list; observation …21537f0b), .grugops/context/rescore-p1-backlog-2026-10-10/notes/ (…0e4da324), plans/tickets/ABC-141-*.md
enqueued_by: orchestrator
enqueued_at: 2026-10-10T18:24:17Z
branch: grugops/bapm-fold-book-chain-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: BA/PM — fold ADR-0037 into the book chain; re-score ABC-141

1. Fold ADR-0037 (D1/D2/D3) into ABC-093, ABC-094, ABC-095 and ABC-096 using the Architect's per-page fold
   list in note `…d06f5ba8`. Re-score each page's DoR at the tip. Recommend each ticket's column (ABC-093
   expected → Ready for Dev if 10/10). Say whether ABC-093 should go through In Security/NFR for its
   untrusted-input bullets (the Architect left this to the Orchestrator) — recommend, do not decide.
2. Re-score ABC-141 now that ABC-010 is merged (`8a2d41a8`); recommend its column.
3. Owner questions: restate the live ones for the book chain (Q4 sign third-party CC0 data; Q5 book vs level;
   the D1 weights default, which the owner may veto) in plain words, one line each.

Do NOT touch `plans/tickets/ABC-083-*.md` — it is In Development; its page note is deferred.

## Fences
Ticket pages + trace rows + your notes only. No `src/`, `plans/board.md`, ADRs, `AGENTS.md`, or ticket
`column:`/`status:` frontmatter (the Orchestrator moves columns). Never merge; never push. Own worktree.
Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Quoted heredocs only (`<<'EOF'`).

## Publish
Note per Workflow 16, trace row at the END of `plans/traceability.md`. Queue pending → claimed → done (by hand,
main checkout, uncommitted). Report: DoR per page, column recommendations, the Security/NFR recommendation for
ABC-093, owner questions, branch + sha.
