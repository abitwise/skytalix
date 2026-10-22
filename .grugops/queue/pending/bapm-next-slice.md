---
subtask: bapm-next-slice
role: ba-pm
ref: .grugops/context/bapm-next-slice/
inputs: plans/board.md; plans/epics/EPIC-003..007; plans/tickets/*; plans/traceability.md; owner delegation …5aaf7cec; owner "go forward with the project" 2026-10-22
width: 2 (beside ticket-to-pr-ABC-199)
---

# Find what is left of the product, and cut the next slice

The owner said "go forward with the project". EPIC-007 is nearly done: only ABC-178 is in review, and ABC-197 and ABC-199 are open. Choose the next deliverable product slice from the **existing** epics and requirements.

## Do
1. **Record drift.** About 40 ticket pages have a `status:` that disagrees with `plans/board.md`. Among them are ABC-094, ABC-096, ABC-101, ABC-085 and ABC-145, plus many older ones. EPIC-003 to 006 read `status: backlog`, yet tickets were cut from them.
   - List each mismatch: ticket, page status, board column, and the merge evidence.
   - Fix only the page front matter where the board and the merge record agree.
   - Put anything ambiguous in a list. Do not guess.
2. **What is left of each epic** (003–007): which acceptance or measure is met, and which is still open.
   - Cite the requirement or measure ids.
   - Note what depends on what (for example, EPIC-005's value needs EPIC-004).
3. **Pick the next slice.** Choose the highest-value open, user-visible work and cut it as Ready tickets: DoR 10/10, sized XS–M, no XL into dev, ids from ABC-200. Name the builder role.
   - Cut only inside existing epic scope.
   - A new requirement, a scope change, an NFR-bound change, or a new or reversed ADR is the owner's call. Do not cut those: list them as owner questions, with your recommendation.
4. Close EPIC-007 if every measure is met once ABC-178, ABC-197 and ABC-199 are settled. Otherwise say exactly what is still owed.

## Fences
- Records only (`plans/`, `memory-bank/` only where your role owns it). No `src/`, `tools/`, `package*.json` or `AGENTS.md` edits. **No test or timing runs.** The host is reserved for an ABC-178 timing hop. Read-only commands like `git log` and `grep` are fine.
- On `plans/board.md`: one `_Updated` line, plus new cards under Ready. Leave column headers alone.
- Work on `grugops/bapm-next-slice` (worktree `../wt-bapm-next-slice` from `main`). Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm-slice/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `bapm-next-slice`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a trace row into this brief, then move it to `done/`.
