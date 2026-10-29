---
subtask: sa-ideas-verify
role: system-analyst
ref: .grugops/context/sa-ideas-verify/
input: .grugops/context/ideas-2026-10-29/input/owner-ideas.md
branch: new grugops/sa-ideas-verify from main, worktree ../wt-sa-ideas-verify
width: records only; routing orch-2026-10-29g/…ccb72dbe
---

# Verify the owner's 10 external improvement claims against main's code and history

The owner gave a list of improvement ideas from external chat models and said they must be checked, not taken as
valid (`input/owner-ideas.md` § B). Main's `src/`, `data/` and `tools/` are byte-identical to `3ad6bc10`, the
commit the list reviewed.

## Do
- For each of the 10 items, and for each factual sub-claim inside it, give a verdict: **TRUE / PARTLY / FALSE /
  ALREADY DONE / ALREADY TRIED**. Back it with `file:line` at main, and test or ticket refs where they exist.
  - Examples of sub-claims: "quiescence stands pat in check"; "no mate/stalemate detection in quiescence"; "quiet
    promotions excluded"; "UCI does not pass game history to search"; "zobrist ep counts repetitions late";
    "level 5 = 3 s, level 7 = 30 s, 32 s ceiling"; "UCI ignores wtime/btime/movestogo beyond the level cap"; "TT
    4 MiB always-replace, exact-depth cutoffs"; "no history heuristic / SEE"; "king PST untapered".
- Find the project's history for each item: tickets, ADRs, EPIC-008 rows and closed-unmerged attempts (ABC-205,
  ABC-207, ABC-209, ABC-210 and others). Say which ideas were tried and how they measured, and which ADRs or
  standing rulings constrain them.
- For item 4 and the owner's own § A (a 40/15 "tournament" level), map today's time behaviour exactly:
  - every level's budget;
  - how CLI and UCI pick the per-move time;
  - which `go` parameters are honoured (wtime/btime/winc/binc/movestogo/movetime/infinite);
  - the hard ceiling and where it is enforced;
  - what blocks a level with a 22.5 s per-move budget, or clock-based allocation.
  - Write this as one observation note, so that BA/PM's `bapm-epic009-tournament` can cite it.
- Don't rank or propose solutions; BA/PM and the Architect do that. Say plainly when you can't settle a claim
  from code alone (it then needs a probe or a measurement) and name the probe.

## Fences
- Records only, in your worktree and scratchpad. No `src/`, `data/` or `tools/` edits. No games and no `rating.ts`.
  Single-position engine probes are allowed, under 5 min of CPU in total, and only when `ps` shows no cutechess.
- Never push, force, amend or rebase. Never merge into main. No board edits. Linters only via `npm run …`; never a
  bare `npx <name>`. No host paths or usernames in records.

## Publish
- Seal notes (task `sa-ideas-verify`) with `at` from `date -u`: the time-behaviour observation; one claims-verdict
  observation (a table: item, sub-claim, verdict, evidence, history); and a `kind: decision` that summarises which
  items stand. Commit on your branch.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
