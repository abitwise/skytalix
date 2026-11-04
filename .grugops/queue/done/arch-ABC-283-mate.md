---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T13:58:05Z
subtask: arch-ABC-283-mate
role: architect-design
ref: .grugops/context/arch-ABC-283-mate/
branch: new grugops/arch-ABC-283-mate from grugops/ABC-283 — worktree .claude/worktrees/arch-ABC-283-mate
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Probes ≤ 30 min each, ≤ 1 h total; no games. Host paths only as placeholders.
---
# Diagnose the bundle's mate-floor miss (ABC-283 history part) and rule on ADR-0063 F2
Read the Orchestrator ruling …19583086, se-ABC-283's notes (…0b0b135f failed-attempt, …0d3e1e5b acceptance, …d64042c4 design), ADR-0063 (incl. F2), ADR-0064 d7 and the code on grugops/ABC-283 (src/search.ts, src/engine.ts, src/search.bundle.test.ts).
The miss: search() d5 loses 1/190 mates (6k1/R7/5K2/8/8/8/8/8 w - - 2 2, 29995 → 652); chooseMove d5 loses 2/188. All are KRK, and history alone causes them.
1. Diagnose, under a PREREG sealed first. Trace why the mating line is lost, e.g.:
   - LMR reductions or futility skips that history's order now hits;
   - history in check or mate-threat nodes;
   - malus from mate-score cutoffs;
   - a pre-existing LMR or futility flaw that history only unmasks.
   Name the mechanism with evidence (node trace, move index of the mating move, door-by-door).
2. Rule on F2:
   - (i) a structural fix within ADR-0063's intent, not a value tune: for example, which nodes or moves history may affect, or keeping LMR and futility keyed to the pre-history move index. State it exactly and show on a scratch copy that the floor holds (search and chooseMove d5, and the chooseMove d6 report) with all three parts on, P0 unchanged.
   - (ii) or no such fix: ADR-0063 F2 fires.
   Write it as a dated line in ADR-0063, still PROPOSED, and give the SE build lines.
Fences: memory-bank/50-decisions, your records, scratch copies. No committed src or tests; no ticket, EPIC or board edits. No push, force, amend, rebase or merge into main or into grugops/ABC-283. Leave nothing running.
Publish: sealed notes (task arch-ABC-283-mate, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result

**2026-11-04, Architect/Design. F2 ruled (i), a structural fix: K3, history may promote a quiet move, never demote one. Its ordering key is max(0, h). The mate floor holds with all three parts on, and P0 is exact. ADR-0063 stays PROPOSED.** Branch `grugops/arch-ABC-283-mate` from `grugops/ABC-283` `4e7ddcca`. Commits: claim `9a1a51a5`, PREREG `6ad10900`, then this records commit. Nothing was pushed or merged, no game was played, nothing was left running, and nothing was committed to `src/`.

- **PREREG `…07f1eb6d`**, sealed and committed before any run.
- **Mechanism (observation `…c8e90c3c`):** LMR on a mating quiet move that the malus sank below the zero-history moves.
  - At the White depth-3 null-window node, the mating move moves from pre-history index 1–2 to index 9–16. It is reduced and scores ≤ α, so it is never re-searched. The −9 cells come from mate-band cutoffs.
  - Door by door: LMR off restores every row; futility and aspiration do not.
  - It is a pre-existing order-sensitivity that history unmasks: the door with its quiet tier reversed loses 6 / 190, and with LMR off it loses 0.
- **Candidates:**
  - K2 misses zugzwang (`zugzwang.001`). K1 / K1L miss a KQK floor row. K1F changes nothing.
  - **K3 meets B1–B6:**
    - `search()` d5 0 / 190 and `chooseMove` d5 0 / 188;
    - the older rows 0;
    - P0 6 / 6 exact;
    - zugzwang 7 / 7;
    - G1 54 / 58, none newly missed.
  - Reports: d6 2 / 209 (was 4); drift max 28 cp (the build as it stands reads 44, above ADR-0063 d8's 42); d8 ratios 0.8657 / 0.5758 / 0.9234 / 1.1595.
- **Ruling and SE build lines (decision `…05ef9fc9`):**
  - One production line, `orderKey`: `return history ? Math.max(0, HISTORY[historyIndex(move)] as number) : 0;`, with its comments.
  - The bundle order row re-pinned old → new, plus one negative-cell assertion.
  - Every mate-floor row goes green without a re-pin. Re-read P0, zugzwang, G1, drift and ratios; `npm test` ≤ 10 s.
  - Then QE's PREREG and the one 100-game read follow.
- **ADR-0063:** dated lines in § Status, decision 4 and the F2 row.
- **Residual risk:** the floor holds on the 287, not by construction (the d6 report).
