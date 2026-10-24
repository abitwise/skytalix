---
subtask: scribe-adr0049-rows
role: agents-md-scribe
ref: .grugops/context/scribe-adr0049-rows/
adr: memory-bank/50-decisions/ADR-0049-the-source-is-public-on-github-and-the-engine-still-deploys-nowhere-and-publishes-no-package.md
branch: new grugops/scribe-adr0049-rows from main, worktree ../wt-scribe-adr0049-rows
width: 1 of 3 (beside qe-ABC-204 ALONE and bapm-cut-readme; records only — no npm, vitest or build)
---

# ADR-0049 (ACCEPTED) rows owned by the Scribe: 28, 29, 35

## Do
- Owner accepted ADR-0049 (`owner-word-2026-10-24/…619938c5` item 1; Architect `arch-accept-adr0049/…1e9e06f0`). Apply § Records rows 28, 29 and 35 exactly as each disposition says (dated lines; history stays). Log the pass in `memory-bank/90-agents-md-command-log.md` if any `AGENTS.md` line moves.
- Touch no other row; BA/PM owns 20–24 (sibling branch), Security/NFR owns 34.

## Fences
- Only your worktree and `<scratchpad>/scribe0049/`. No `src/` edits. Do NOT run npm, vitest or builds. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4); scan your diff.

## Publish
- Commit on your branch. Seal notes (task scribe-adr0049-rows). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
