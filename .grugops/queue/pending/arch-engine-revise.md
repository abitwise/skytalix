---
subtask: arch-engine-revise
role: architect-design
from: main HEAD (cfd496dd)
branch: grugops/arch-engine-revise
worktree: ../wt-arch-engine-revise
---

# Revise ADR-0044 against the owner's Q1-Q11 answers (records only)

Read first: the owner-word note `.grugops/context/wave-2026-09-25/notes/20261018T093000Z-orchestrator-decision-owner-word-engine-q1-q11-answered-a41c7e02.md`,
ADR-0044, and your own notes `…3f1a9c20`, `…7b2e4d18` and `…c5d07e91`.

Revise ADR-0044 in place (keep it PROPOSED; add a dated revision section and update the decisions):

1. **Q4, book on.** Decide how the UCI session uses the existing `src/book.ts` / `src/book-engine.ts` / `src/book-file.ts` from a
   `position … moves …` history. Pick the default for UCI option `OwnBook`. Say whether the book file is loaded once at startup and
   how a missing or unreadable file degrades.
2. **Q5, strength.** Expose `src/levels.ts` levels 1-5 as a UCI option, either a `spin` `Skill Level` or the standard
   `UCI_LimitStrength`/`UCI_Elo`. KISS: prefer a spin over the existing ordinals and claim no Elo. Say how a level's `budgetMs` combines
   with `go` time limits (take the minimum?), and how the blunder seed is set (`ucinewgame`?).
3. **Q6, depth/nodes.** Map out what the engine already has: iterative deepening, the `search(position, depth)` recursion, the node
   counter, `chooseMove`'s options. Decide `go depth N` (cap the iterative deepening at N, still under `HARD_CEILING_MS`), `go nodes N`
   (stop at a completed iteration or at the node budget?) and `go mate N` (ignore with an `info string`, or map it to depth 2N-1?).
   Name any engine edit this needs. If `src/engine.ts` or `src/search.ts` must change, that drops the "core unchanged" claim, so say so
   plainly and keep the edit minimal (a new optional field, defaulted to today's behaviour).
4. **Q7, bridge.** Replace D8. The web UI's own backend spawns the engine CLI over stdio. This repo ships a buildable engine artifact:
   decide its form (for example `npm run build` emitting `dist/uci.js` plus a `package.json` `bin` entry `skytalix`, run with `node`).
   KISS: no native single binary unless a reason exists. The session module stays capability-free so a Worker remains possible later,
   but that route is no longer v1.
5. **Q8, GPL-3.0-or-later.** Check the licence compatibility of everything bundled: the book data (where did `data/` come from?), any
   copied tables, devDependencies (not shipped). Report anything that blocks GPL.
6. **Q9, name.** `id name skytalix`, `id author Olger Oeselg`. The artifact or bin is named `skytalix`. Do not rename the package, repo
   or terminal game; list that as an open owner item.
7. Update the owner-questions section: mark Q1-Q11 answered, and list any NEW questions this revision raises (keep them few).

Deliverables: the revised ADR-0044 and one decision note under `.grugops/context/arch-engine-revise/notes/` (repo-fit facts plus the
decisions). Records only.

Fences:
- `git diff --name-only cfd496dd HEAD -- src tools package.json package-lock.json vitest.config.ts` must be empty.
- Do not touch `plans/board.md`, `plans/traceability.md` or EPIC files; BA/PM owns those next.
- No test or timing runs. Nothing pushed or merged.
- When finished, write `.grugops/queue/done/arch-engine-revise.md` and `.claim.md`, uncommitted, in main's working tree, and include a
  trace row in your handoff.
