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

## Result

**DONE: QE-216-a..e fixed. Branch `grugops/se-polish-ABC-216` @ `c627a411`** (from `grugops/qe-ABC-216` `50b23aa4`;
`0a5862b5` build, `65b52557` notes, `c627a411` index). Not pushed and not merged. Worktree `../wt-se-polish-ABC-216`.

- **a:** `package.json` `engines.node` `>=22` → `>=22.18`; `package-lock.json` root `engines` the same, 1 line each, no
  other lock change. README: "Node.js 22.18 or later. npm comes with it."
- **b:** tagline "**skytalix**: command-line chess against a club-strength engine." (a colon keeps the file ASCII).
- **c:** flag table "`white` (default), `black` or `random`" (`resolveOptions`, `src/startup-questions.ts`).
- **d:** Levels row "Time per move"; the sentence above ends "The times are approximate:". "grugops kit files" kept.
- **e:** "The title's letters use FIGlet's standard font." on its own line at the end of Licence. Dated correction
  note `…22e0722c` (the letters are FIGlet standard glyphs set by hand; the rook is hand-drawn).
- **A2** 88 lines, 8 `## `. **A3** lines 1-9 match `50b23aa4`, 64 cols max, 0 non-ASCII in the file. **A5-A9** hold
  (A6 0; A8 0/0/0, 1 own URL; A9 3/3 tracked; Node line = `engines.node`).
- **A4 (fresh clone `<scratchpad>/se216p/a4v/`, URL → local branch path, the only edit; checked out `0a5862b5`):**
  10/10 exit 0. Three `npm run chess` lines 0 stderr B. `npm install` 381 B `npm warn install-scripts`. `dist/uci.js`
  present. `npm test` 2073/2073. Clone `git status` clean after install. No `games/`.
- **Gates (worktree):** `npm ci --ignore-scripts` 0; lint 0, typecheck 0, build 0; `npm test` 0, 62 files,
  2073/2073; `last-run.json` success, pending 0, todo 0; skips 0; integrity `No findings.`
- **Not run:** Node 22.x (host has v26 only); the 22.18 bound is from ADR-0042/ADR-0044, `UNKNOWN - verify` by a run.
- **Flag for the Orchestrator:** `package*.json` now changes (engines only), so the ticket's ABC-041 (a) "untouched"
  premise no longer holds literally. Whether a Security hop is triggered is your read.
- **Notes (grugops 2.1.0 `admitAndAppend`, worktree context root, 0 findings, index rendered):**
  `20261025T032713Z-software-engineer-decision-29bf4547`, `…-decision-22e0722c`, `…-observation-f98e5d30`,
  `…-observation-60778a05`. Branch note recorded as an `observation` (no gate verdict for an `artifact-ref`).
- **STOP:** none.

### Trace row (10 cells, header order)

| ABC-216 (SE polish) | README polish QE-216-a..e: Node 22.18 line, name in tagline, colour default, "Time per move", FIGlet font credit; `engines.node` `>=22.18` | EPIC-006 | — | none moves; ADR-0049 d3/d4 (A6, A8 at 0) | `grugops/se-polish-ABC-216` @ `c627a411` (`0a5862b5`)<br>`README.md` (88 lines), `package.json` + `package-lock.json` (engines, 1 line each)<br>`.grugops/context/se-polish-ABC-216/notes/` (…29bf4547, …22e0722c, …f98e5d30, …60778a05) | no test (docs + engines); A4 fresh clone 10/10 exit 0, chess lines 0 stderr B; lane 2073/2073, skips 0, integrity `No findings.`; lint, typecheck and build green | WAIVED by measurement (0 `src/`); QE re-check owed | — | In Review (polish done; QE re-check next) |
