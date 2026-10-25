---
subtask: qe-polish-ABC-216
role: qe-e2e
ticket: plans/tickets/ABC-216-a-short-readme-tells-a-first-time-visitor-what-skytalix-is-and-how-to-play-it.md
ref: .grugops/context/qe-polish-ABC-216/
branch: new grugops/qe-polish-ABC-216 from grugops/se-polish-ABC-216 (c627a411), worktree ../wt-qe-polish-ABC-216
width: 2 of 3 (beside se-integrate-ABC-205; no timing)
---

# QE short re-check: ABC-216 polish

## Do
- Merge current `main` first (report sha). Verify QE-216-a..e as ruled in `qe-ABC-216/…23afedde`, the SE's `se-polish-ABC-216/…29bf4547`, `…22e0722c`.
- Confirm the `package*.json` diff is exactly the two `engines.node` lines (no dependency, script, bin or other lock change) — the Orchestrator rules no Security hop on that basis; say if it doesn't hold.
- Re-run A2, A3 (art byte-identical), A4 on your own fresh clone, A5–A9. Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips. Verdict.

## Fences
- Only your worktree and `<scratchpad>/qe216p/`. No edits outside records. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task qe-polish-ABC-216). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
