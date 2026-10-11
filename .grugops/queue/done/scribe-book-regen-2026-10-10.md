---
task: wave-2026-09-25
subtask: scribe-book-regen-2026-10-10
role: agents-md-scribe
workflow: agent-factory/workflows/07-backlog-refinement.md (AGENTS.md upkeep)
ref: .grugops/context/scribe-book-regen-2026-10-10/
source_refs: .grugops/context/ticket-to-pr-ABC-093/notes/*a6cb510f.md (the drafted line), .grugops/context/qe-ABC-093/notes/ (QE-093-a), plans/tickets/ABC-093-*.md (§ Scope), memory-bank/50-decisions/ADR-0037*
enqueued_by: orchestrator
enqueued_at: 2026-10-10T19:00:14Z
branch: grugops/scribe-book-regen-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: Scribe — the opening-book regeneration line (QE-093-a)

ABC-093 is merged (`ac83c3fd`). Its § Scope owes one `AGENTS.md` line telling agents how to regenerate
`data/opening-book/book.json` (`node tools/opening-book/compile.ts <dir>` against the pinned source in
`data/opening-book/ATTRIBUTION.md`). The engineer drafted it in note `…a6cb510f`; verify it against the merged
tree (run the command once into a scratch dir and `cmp` against the committed file), then place it where
`AGENTS.md`'s commands live. Update the `Test (all)` receipt to the tip (expected 53 files / 1680 tests — run it).
Log in `memory-bank/90-agents-md-command-log.md`. Size cap 24,576 B (now 23,216).

## Fences
`AGENTS.md`, `memory-bank/90-agents-md-command-log.md`, your notes and a trace row only. Never merge; never
push. Own worktree; link `node_modules` into YOUR worktree only. Commit-message file in a PRIVATE scratchpad
subdirectory. Real UTC stamps. Trailer `Co-Authored-By:` naming the model you actually are. Quoted heredocs
only (`<<'EOF'`).

## Publish
Note per Workflow 16, trace row at the END of `plans/traceability.md`. Queue pending → claimed → done (by hand,
main checkout, uncommitted). Report: the line (before/after bytes), cmp result, test count, size, branch + sha.
