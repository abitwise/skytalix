---
subtask: ticket-to-pr-ABC-216
role: software-engineer
ticket: plans/tickets/ABC-216-a-short-readme-tells-a-first-time-visitor-what-skytalix-is-and-how-to-play-it.md
ref: .grugops/context/ticket-to-pr-ABC-216/
branch: new grugops/ABC-216 from main, worktree ../wt-ABC-216
width: 2 of 3 (beside se-fix-ABC-204 and the other ticket; no real-clock timing)
---

# Build ABC-216

## Do
- Own worktree and `npm ci --ignore-scripts`. Build exactly to the page's criteria; red-first where the page names a plant.
- README only (plus records). Owner asked for: clean, short, a nice-looking title, ASCII art (owner word `owner-word-2026-10-24/…619938c5` item 4); the page's outline and A3 art rule are the spec. Verify every shown command as the page says. The clone URL is the repository's own public HTTPS URL (ruling `bapm-cut-readme/…baffa6f8`). Read it from `git remote get-url origin` and write it as an https URL with no credentials.
- Gates: lint, typecheck, build; `npm test` + `last-run.json` (note Duration); skips. Anything red outside the page's scope → STOP.

## Fences
- Only your worktree and `<scratchpad>/se216/`. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only — no hostnames, IPs, personal paths (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task ticket-to-pr-ABC-216). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
