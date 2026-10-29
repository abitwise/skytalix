---
subtask: se-ABC-227
role: software-engineer
ticket: ABC-227
ref: .grugops/context/se-ABC-227/
branch: new grugops/se-ABC-227 from main, worktree ../wt-se-ABC-227
---

# ABC-227: profile where a node's time goes at 3 s (no code change)

Work the ticket `plans/tickets/ABC-227-…` exactly: its scope, its acceptance and its test notes. It is a measurement
ticket: `node --cpu-prof` plus heap sampling on the fixed boards, scripts and outputs under your context `raw/`. No
`src/` change. Read EPIC-010 and BA/PM `bapm-epic010-improvements/…12cb550d`, plus `sa-ideas-verify/…306a4012` (item 7).

## Fences
- About 1 min of CPU per board, as the ticket says. Record load1 per run. Run only when `ps` shows no cutechess; if
  one appears, wait. No games and no `rating.ts`.
- Own `npm ci --ignore-scripts`. Linters only via `npm run …`; never a bare `npx <name>`.
- Your worktree and scratchpad only. No `src/`, `data/` or `tools/` edits. Never push, force, amend or rebase. Never
  merge into main. No board edits. No host paths or usernames in records or profiles (redact `.cpuprofile` URLs).

## Publish
- Seal notes (task `se-ABC-227`) with `at` from `date -u`, answering each acceptance criterion. Commit on your branch.
- Write a dated result line into the ticket on your branch, plus `## Result` and a 10-cell trace row into this brief
  in main's queue, then move it and its claim.md to done/.

## Result

**2026-10-29, Software Engineer. Done. Branch `grugops/se-ABC-227` @ `a9a8ae4a` (local, not pushed, not merged).** This
was measurement only, at `main` `193447bc`. The branch's `src`/`data`/`tools` equal main's, and are unchanged on main
since. No game was played and `rating.ts` was not run. The ticket page carries a dated result line.

- **Notes** (task `se-ABC-227`, sealed): `20261029T203901Z-software-engineer-observation-7175ebdf` (answers A1-A5) and
  `20261029T203901Z-software-engineer-decision-e56997fd` (method). `admitAndAppend` was called directly because the
  `propose_note` tool was not surfaced; it is the same call the tool makes.
- **Runs:** 5 `--cpu-prof` and 5 heap-sampling fresh processes per board, 20:33:21-20:34:57 UTC. No process named
  cutechess ran during them. load1 was 0.92-1.64, recorded per run.
- **A1:** median nps was kiwipete 572 859 (depth 8), position-6 605 729 (depth 10) and start 467 292 (depth 10). The
  top 15 functions by self time are in the note and `raw/analysis.txt`. Every board's top 5 comes from
  isSquareAttackedBy, whiteMinusBlack, kingSquareOf, generateMoves, squaresReached and raySliderAttacks.
- **A2:** holds. The top-5 rank spread is at most 2 on kiwipete and at most 1 on position-6 and start, so no extra
  runs were needed.
- **A3** (k/p6/s): move generation 47.4/44.9/50.5, evaluation 31.5/32.8/27.0, ordering 5.5/6.6/6.5, make/unmake
  4.2/4.1/4.0, TT 1.1/1.3/2.0, other 10.3/10.3/10.1. The sum is 100 ± 0.1.
- **A4:** 2 737/2 807/4 019 bytes per node (1.6-1.9 GB/s). `orderMoves` holds 8.6/9.6/12.8 % of bytes and move
  generation 76-78 %. GC is ≤ 1.9 % of time.
- **A5:** three buckets clear 5 % on at least two boards: move generation, evaluation and ordering. Six cuts are
  named, each read as value-identical by the profiler:
  - king-square tracking;
  - check/pin-aware legality;
  - a captures-only generator in generation order;
  - incremental material+PST;
  - a pawn-structure cache;
  - keyed in-place stable ordering.
  Architect/Design confirms at `ABC-235`'s design hop.
- **Gates:** `npm run lint` passed (129 files). `npm run typecheck` passed. No tests were run, because no code
  changed. Profiles are redacted (ADR-0049 d4), and a scan found no host path or username in any record or profile.
- **UNKNOWN - verify:** the speed-up each cut actually buys; how much self time V8 inlining moves between functions;
  and the shares on warm, mid-game or other-budget searches.
- **STOP:** none.

### Trace row (10 cells, header order)

| ABC-227 | Profile: where a node's time goes on the fixed boards at 3 s, and which cuts are worth a value-identical ticket | EPIC-010 | — | none moved (measurement only; ADR-0049 d4 no host paths held; load1 recorded, no cutechess) | grugops/se-ABC-227 @ a9a8ae4a (measurement only): .grugops/context/se-ABC-227/notes/ (2) + raw/run.mts, profile.sh, redact.mts, analyse.mts, analysis.txt/json, profiles/ (15 cpuprofile.gz, 15 heapprofile.gz); ticket result line | 15 cpu + 15 heap fresh-process runs at main 193447bc: nps k 572 859 / p6 605 729 / s 467 292; A2 holds (≤ 2); buckets movegen 45-51 %, eval 27-33, ordering 5.5-6.6, make/unmake ~4, TT 1-2; 2.7-4.0 kB/node, orderMoves 8.6-12.8 % of bytes; A5 six value-identical candidate cuts for ABC-235; lint + typecheck pass, no tests (no code) | — | — | done (measurement; not merged) |
