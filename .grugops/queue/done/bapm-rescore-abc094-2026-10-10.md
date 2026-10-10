---
task: wave-2026-09-25
subtask: bapm-rescore-abc094-2026-10-10
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/bapm-rescore-abc094-2026-10-10/
source_refs: plans/tickets/ABC-094-*.md, memory-bank/50-decisions/ADR-0037* (D2: injected random), ADR-0036*, ADR-0012*, .grugops/context/qe-ABC-093/notes/, .grugops/context/ticket-to-pr-ABC-093/notes/, data/opening-book/book.json + tools/opening-book/ (merged `ac83c3fd`)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T19:03:01Z
branch: grugops/bapm-rescore-abc094-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: BA/PM — re-score ABC-094 now that ABC-093 is merged

ABC-093 is Done (`ac83c3fd`): `data/opening-book/book.json` exists with ADR-0037's format, and the shipped
compiler fixes the output path. ABC-094's only open DoR item was 10 (waiting on ABC-093). Re-read every premise
against the merged artifact (key format, weights field, `maxPly`, name field, file size) and re-score. Say
whether ABC-094 is Ready, its expected gates (owner UAT word; In Security/NFR under ADR-0036 (b1) if the probe
imports `node:fs`, and the Architect's unruled inject-the-reader option), and any file overlap with ABC-083
(`src/evaluate*`, being built now). Note the owner's open weights veto (`WEIGHT_POLICY`) and whether ABC-094
depends on its answer.

Do NOT touch other ticket pages.

## Fences
`plans/tickets/ABC-094-*.md`, trace row, your notes only. No `src/`, `plans/board.md`, ADRs, `AGENTS.md`, or
`column:`/`status:` frontmatter. Never merge; never push. Own worktree. Commit-message file in a PRIVATE
scratchpad subdirectory. Real UTC stamps. Trailer `Co-Authored-By:` naming the model you actually are. Quoted
heredocs only (`<<'EOF'`).

## Publish
Note per Workflow 16, trace row at the END of `plans/traceability.md`. Queue pending → claimed → done (by hand,
main checkout, uncommitted). Report: DoR, column recommendation, gates, overlap, owner questions, branch + sha.
