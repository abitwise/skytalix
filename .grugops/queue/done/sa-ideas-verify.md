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

## Result

**Done, on `grugops/sa-ideas-verify` (worktree `../wt-sa-ideas-verify`, from main `51c85f49`): records `c28054cc`
(time note, committed first) and `3d19a6bd` (claims table + decision). Not merged; nothing pushed.** Main's
`src`/`data`/`tools` equal `3ad6bc10`. A copy of the time note is also in main's
`.grugops/context/sa-ideas-verify/notes/` for `bapm-epic009-tournament`.

- **Notes (task `sa-ideas-verify`, all sealed):**
  - `20261029T195803Z-system-analyst-observation-1ccf0010`: time behaviour (level budgets, CLI and UCI rule, `go` tokens, 32 s clamp, blockers for a 22.5 s level and for clock-based time).
  - `20261029T200022Z-system-analyst-observation-306a4012`: the claims table (item, sub-claim, verdict, evidence, history).
  - `20261029T200049Z-system-analyst-decision-837e6fa8`: which items stand.
- **Verdicts:**
  - 1 stands: in-check stand pat, no terminal test past the leaf, no quiet promotions. The leaf itself is checked. A horizon check extension was tried (`ABC-210`, NEUTRAL).
  - 2: facts true, already in hand via `arch-epic008-rd`. Paired openings already exist.
  - 3 stands. The ep point is the owner's `ADR-0020` d2.
  - 4 stands, corrected: the clock is honoured, then capped by the level. Level 7 already spends 22.5 s a move under 40/15 when `movestogo` is sent.
  - 5 and 6 stand.
  - 7 stands in part (`ABC-206` did captures-only legality).
  - 8 stands; never tried.
  - 9 stands in part: TT kept across a game was already tried (`ABC-209`).
  - 10 is a permanent non-goal of `EPIC-004`.
- **Probes:** single-position only, no games, about 41 s of CPU, no cutechess running. Raw files are in `raw/`.
- **UNKNOWN - verify:** whether cutechess sends `movestogo` for 40/900; the 50 ms forfeit margin; the play effect of items 1, 3, 6, 7 and 9. Each has a named probe.
- **Owner questions surfaced:** reopen item 10? Does `EPIC-004`'s "Strength above ~1700" non-goal line still stand? Re-open `ADR-0020` d2?
- **STOP:** none.

### Trace row (10 cells, header order)

| sa-ideas-verify | SA: owner's 10 external ideas verified against main (src = 3ad6bc10) and history; time behaviour mapped for EPIC-009 (level 7 already ~22.5 s/move under 40/15 with movestogo; UCI clock honoured then level-capped; 32 s clamp; CLI has no clock) | EPIC-009 (and the deferred strength epic) | — | NFR-004, NFR-005, NFR-009 cited, none moved | grugops/sa-ideas-verify @ 3d19a6bd (records only): .grugops/context/sa-ideas-verify/notes/ (3) + raw/ (2 probe scripts, 2 outputs) | no gates run (records only); 5 UCI time probes + 3 quiescence probes, single position, ~41 s CPU, no games | — | — | done (records; not merged) |
