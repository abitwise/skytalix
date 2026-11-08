---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T18:08:56Z
subtask: arch-search-rank
role: architect-design
ref: .grugops/context/arch-search-rank/
branch: new grugops/arch-search-rank from main — worktree .claude/worktrees/arch-search-rank
width: records only; one ranking read for the owner. Nothing run. No ADR status change, no ticket, EPIC, board or src.
---
# Which held search ticket, if any, is worth the next try
The owner skipped P1 (my note at 2026-11-08T18:08:56Z under orch-2026-10-30a) and wants step-by-step gains at 100 ms. Read your …569849c4 and …9ae6cff1, ADR-0056 D2/D6, and each page: X1 ABC-296, X2 ABC-297, V3 ABC-298, T3 ABC-257, P5 ABC-285, P6 ABC-287, T4 ABC-258 / ABC-237.
For each, on today's main: what it is in one line; the rows that have caught this kind of change before (zugzwang 7/7, both mate floors, drift cap, G1, node ratios, NFR-008); whether a reason beyond a guess says it passes them; whether 100 ms can see its gain; cost (ADR, freeze, probe, build, 100 games); and odds, honestly.
Then rank them and pick one, or say plainly that none is worth host time. Plain words, a table, under a page, in a sealed decision note. If a pick needs an ADR, say so; do not write it in this hop.
Fences: your records and one trace row. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.

## Result

**2026-11-08, Architect/Design. Records only, on `grugops/arch-search-rank` from `main` `e8ea9a46` (`src/` tree `bba42fb7`). Note `…5a155b2c` (decision, sealed). No test, build, engine or probe run. No ADR status, ticket, EPIC, board or `src/` edit. Nothing pushed or merged. No bar moved.**

- **Ranking (odds are judgement):** 1 V3 `ABC-298`; 2 T3 `ABC-257`; 3 P5 `ABC-285`; 4 X2 `ABC-297`; 5 X1 `ABC-296`; 6 P6 `ABC-287` (held, not takeable); 7 T4 / T2 `ABC-258` / `ABC-237` (parked by his word, not live).
- **Pick: V3, in its narrowest form, or none.** The hash move is checked and searched before the list is built. Otherwise everything is built and ordered as today, so the search is node-identical. The play checks hold by SG1's exact count, not by a guess. The gain is nodes per second at 100 ms, and no 100 games are needed. It is small (+3 to +15 Elo, estimate; speed bar about even or lower). If identity cannot hold, it stops and does not become a move-changing ticket.
- **The rest:** T3, P5 and X2 would not show a gain at 100 ms. X1 already failed `G1`, zugzwang, drift and the node bound as `ADR-0051`'s every-node form. P6 has no tuned table to wait on. T4 and T2 are parked.
- **Next for the pick:** its own ADR (new, the owner accepts; not written here); BA/PM's SG3 number (DoR 10/10); QE's freeze before the build; M build; perft deep, SG1, SG2 and S2 on a held host. The Orchestrator may put d6's `kingExposure` cut in the same timing session.
- **Path check:** `node tools/grugops/records-path-check.js --base main` exit 0 at `8fd41ae1`, before this last commit.
