---
subtask: arch-design-ABC-213
role: architect-design
ticket: plans/tickets/ABC-213-a-failed-pgn-save-reports-its-first-error-code-even-when-the-cleanup-also-fails-and-leaves-no-partial-file.md
ref: .grugops/context/arch-design-ABC-213/
width: 3 of 3 (records + light probes)
---

# Design ruling for ABC-213 (PGN cleanup guard): the test rig under ADR-0015

## Do
- Answer the page's one question: which fault-injection rig ADR-0015 allows — (a) hook inside the existing writer child (0 spawns, 0 files; recommended by BA/PM), (b) a `vi.mock` test file (+1 file), (c) a new child (+1 spawn). Probe (a) on a scratch copy. A change to an accepted ADR (e.g. clause (S)) is PROPOSED and STOPs to the owner.
- Dated `## Design ruling` on the page; recommend the next move.

## Fences
- Worktree `../wt-arch-design-ABC-213` from `main`. Only the ABC-213 page, a proposed ADR if needed, your notes. No `src/`/tests. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/design213/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `arch-design-ABC-213`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
