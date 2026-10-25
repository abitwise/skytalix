---
subtask: se-polish-ABC-216
role: software-engineer
ticket: plans/tickets/ABC-216-a-short-readme-tells-a-first-time-visitor-what-skytalix-is-and-how-to-play-it.md
ref: .grugops/context/se-polish-ABC-216/
branch: new grugops/se-polish-ABC-216 from grugops/qe-ABC-216 (50b23aa4), worktree ../wt-se-polish-ABC-216
width: 2 of 3 (beside se-integrate-ABC-205; no timing)
---

# ABC-216 polish before merge (QE-216-a..e)

## Do
Per Orchestrator `qe-ABC-216/…23afedde` (on main) and QE `…869bfdbe`, `…261bbc49`:
- **a:** `package.json` `engines.node` → `>=22.18`; matching root `engines` in `package-lock.json` (no other lock change — check with `git diff`); README Requirements line → "Node.js 22.18 or later". Nothing else in `package*.json` moves.
- **b:** the first line after the art names the project as text (e.g. "**skytalix** — command-line chess against a club-strength engine.").
- **c:** state the colour default (white) where the flags are described.
- **d:** Levels row label "Time per move".
- **e:** one short credit line in the Licence section: the title's letters use FIGlet's standard font. Correct your earlier note with a dated note (letters = FIGlet standard glyphs set by hand; rook hand-drawn).
- Keep A2 (≤ 100 lines, ≤ 9 `## `), A3 (art unchanged), A5–A9. Re-run A4 on a fresh clone of your tip.
- Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips.

## Fences
- Only `README.md`, `package.json` (engines only), `package-lock.json` (root engines only), your worktree and `<scratchpad>/se216p/`. No `src/`. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task se-polish-ABC-216). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
