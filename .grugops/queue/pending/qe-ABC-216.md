---
subtask: qe-ABC-216
role: qe-e2e
ticket: plans/tickets/ABC-216-a-short-readme-tells-a-first-time-visitor-what-skytalix-is-and-how-to-play-it.md
ref: .grugops/context/qe-ABC-216/
branch: new grugops/qe-ABC-216 from grugops/ABC-216 (16c14409), worktree ../wt-qe-ABC-216
width: 3 of 3 (beside ticket-to-pr-ABC-217, qe-fix-ABC-204; no timing)
---

# QE gate for ABC-216 (README)

## Do
- Merge current `main` into your branch first (report sha); own `npm ci --ignore-scripts`.
- Verify A1–A10 independently: your own fresh clone (A4, every shown command, stdin /dev/null), facts vs code constants, A6/A8 scans with the A8 plant, links resolve to tracked files, A3 art rule (lines, columns, ASCII bytes, alignment in a monospace render — a local Markdown preview or a column-by-column check; GitHub render after the owner pushes is the owner's look).
- Rule on the SE's one deviation: the clone line names its target folder (`… skytalix.git skytalix`).
- Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips. Verdict; UAT (waiver applies only if 0 `src/` files — confirm).

## Fences
- Only your worktree and `<scratchpad>/qe216/`. No README edits (findings only). Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task qe-ABC-216). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
