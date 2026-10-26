---
subtask: scribe-null-move-lane
role: agents-md-scribe
ref: .grugops/context/scribe-null-move-lane/
branch: new records branch grugops/scribe-null-move-lane from main, worktree ../wt-scribe-null-move-lane
width: 1 of 2 — records only (you may run the one lane command once to confirm it; nothing else)
---

# AGENTS.md: the SEARCH_DEEP lane line for the null-move tests (ABC-208)

## Do
- Read Orchestrator `orch-2026-10-26q/…836cb92d` and QE `qe-ABC-208/…0477ac64` (lane run: 44/44 in 46.0 s).
- Add the lane line to AGENTS.md beside the existing SEARCH_DEEP lane lines, in their format and voice:
  `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.null-move.test.ts`
  with a short purpose in the same style as its neighbours (the ABC-208 null-move rows: door, zugzwang guard, oracle).
- Check that the file exists on main at `b5c67ab7` and that the command's flags match how the neighbouring lines are written. If they differ, follow the neighbours and say so.
- Keep AGENTS.md's 12 coding rules untouched.

## Fences
- Work only in your worktree. AGENTS.md only, plus your notes.
- Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `scribe-null-move-lane`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

Done. One line added to `AGENTS.md` § Commands; nothing else touched. The lane was not re-run (QE's run is the evidence).

- Branch `grugops/scribe-null-move-lane` from main `3357c882`, worktree `../wt-scribe-null-move-lane`. Tip `5c163296` (one commit: the line plus the note). Not pushed, not merged.
- Line, after the PVS/LMR deep lane line: `- Null-move deep lane (opt-in, ABC-208, door / zugzwang guard / oracle rows, 44 rows): SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.null-move.test.ts`.
- Checks: `src/search.null-move.test.ts` exists on main at `b5c67ab7`. Flags match the neighbouring SEARCH_DEEP lines exactly, so there is no difference to report. The 12 coding rules are untouched. AGENTS.md 17,101 -> 17,286 B (budget 18,432).
- Evidence: `qe-ABC-208/…0477ac64` (N8-LANE 44/44, 46.0 s) and `orch-2026-10-26q/…836cb92d`.
- Note (task `scribe-null-move-lane`, sealed with `appendNote`): `20261026T122954Z-agents-md-scribe-decision-d8bd845a` (decision).
- Claim: `claimTask` and `transition` from the plugin's `claim.js`, in main's working-tree queue. Nothing committed on main.
- Not touched: `src/`, `plans/`, board, ADRs. No stops, no fence breach.

### Trace row (10 cells)

| ABC-208 (scribe-null-move-lane) | AGENTS.md § Commands gains the null-move SEARCH_DEEP lane line for src/search.null-move.test.ts | EPIC-008 | null-move pruning (ADR-0050) | N8-LANE 44 rows (qe-ABC-208 …0477ac64); note …d8bd845a | grugops/scribe-null-move-lane @ 5c163296<br>AGENTS.md | docs only; lane not re-run | — | — | lane line applied |
