---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T17:25:10Z
subtask: bapm-ABC-302-cut
role: ba-pm
ref: .grugops/context/bapm-ABC-302-cut/
branch: new grugops/bapm-ABC-302-cut from main — worktree .claude/worktrees/bapm-ABC-302-cut
width: records only; nothing run.
---
# Cut ABC-302: NFR-008 headroom, about −0.55 s (form S, test-only)
Source: Security/NFR decision secnfr-nfr008-1104 …1184fec4 (rows, ms each, the per-row proposed remnants, the must-stay list) and the Orchestrator ruling …112cd856. Precedent: ABC-281's page.
Cut ABC-302 (S, P1, test-only, no src production lines):
- Part 1: the seven named rows to their own files' existing deep lanes.
- Part 2: the two no-gate rows (cli.test ABC-241 A4; engine.capacity ABC-122 A8) to existing lanes in other files, placement by the Architect.
- Each moved row keeps a default-lane remnant where the decision proposes one, confirmed by the Architect with mutant reads.
- AC: QE re-grades NFR-008 with twin arms, target median ≤ 9.4 s (the probe says ~9.3 s), and every moved row passes in its lane with expected counts.
- No new test file and no new AGENTS.md lane line.
DoR: row 10 waits on the Architect's remnant confirmation (arch-ABC-302), so Backlog 9/10.
Also add lines to ABC-282 and ABC-301: a default-lane budget of ≤ +0.1 s each, rows ≥ 50 ms go deep, no new default-lane file, W1's identity slice goes deep; both build after ABC-302 merges. Add EPIC-011 (or the epic that owns NFR-008 work; check ABC-281's) rows and the ids line.
Fences: plans/tickets, plans/epics, your records. No board, ADR, catalog or src edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task bapm-ABC-302-cut, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result

_by: ba-pm (claude-opus-5-5, bapm-ABC-302-cut) at 2026-11-04T17:34:08Z_. Records only. Nothing was run, built or timed
except the records path check. The edits are confined to `plans/tickets`, `plans/epics`, this task's notes, the trace
row and the queue. No board, ADR, catalog, `AGENTS.md` or `src/` edit.

- **`ABC-302` (new page): S, P1, DoR 9/10, Backlog.**
  - **Problem:** `NFR-008` 9.84 s graded [9.78, 10.00]: 0.16 s of headroom under a 0.3–0.5 s window spread; `R-N8H-1`
    MEDIUM.
  - **Value:** about −0.50 to −0.55 s, so `main` would sit near 9.3 s.
  - **Scope, Part 1:** R1–R7, each to its own file's existing deep lane, with titles and lines read at `9ee778b9`.
  - **Scope, Part 2:** R8 (`cli.test` `ABC-241` A4) and R9 (`engine.capacity` `ABC-122` A8) go across to existing
    lanes, and the Architect places them.
  - **Remnants:** each row keeps a default-lane remnant (form S). W needs measured parity, and K drops the row.
  - **Fences:** no new file, lane line or environment variable. The null-move and futility counts in `AGENTS.md` are
    the tip's (0 B).
  - **Acceptance:**
    - A1 name-only, production-lines grep empty;
    - A2 bodies byte-identical;
    - A3 lane total base − W, one name out and one in per S row;
    - A4 seven `-t` lines "1 passed", the rows' `ADR-0046` rule lines (item 3);
    - A5 `AGENTS.md` ≤ 18 432 B;
    - A6 a frozen mutant matrix with the remnant named;
    - A8 twin-arm graded, **target H ≤ 9.4 s**. 9.4 < H ≤ 10 is MET with a gap, routed by the Orchestrator and not
      re-played. ≥ 9.6 is `Q-N8H-1` (b). > 10 goes to the owner;
    - A9 `R-N8H-1` by Security/NFR.
  - **Read from source, for the Architect:**
    - R9's file mocks `./legal.ts`, `./zobrist.ts` and `./search.ts` at file scope (`vi.mock`), and `src/engine.test.ts`
      has none. So R9 cannot move there byte-identical. The options are (i) a rewrite, (ii) an `ENGINE_DEEP` gate in
      its own file, or (iii) K. New risk `R-302-a` (LOW).
    - R8 under `uci-session`'s engine spy.
    - R6 / R7 possibly already held by `ABC-281`'s `QE-087-d (slice)`.
- **`ABC-282` and `ABC-301`:** dated lines, each with:
  - a default-lane budget of ≤ +0.10 s (`N8-LANE` H − B);
  - no new default-lane file;
  - rows ≥ 50 ms go deep;
  - for `ABC-282` only, W1's identity slice goes to `ENGINE_DEEP`;
  - the build (ABC-301: scope 0) waits on `ABC-302`'s merge.
  `ABC-301` § Open 3 is answered. DoR 10/10 on both, unchanged.
- **`EPIC-011`:** a top block; rows 34 and 53 dated; new row 54; the ids line. The id was checked free on all 276 local
  branches.
- **Owed:**
  - **Architect (`arch-ABC-302`, row 10):**
    - a form and a confirmed remnant per row, by mutant reads;
    - A6's mutants;
    - R8 / R9 placement with their `-t` lines;
    - the R9 mock ruling.
  - **Orchestrator:**
    - the board card `ABC-302` (Backlog);
    - A4's lines (plus R8 / R9's) in every QE brief the `ADR-0046` run rule fires on;
    - `Q-N8H-1` to the owner;
    - optionally, the decision's "or offset in the same ticket" clause, which the ruling's text did not carry.
  - **BA/PM:** the dated line on `ABC-302` when `arch-ABC-302` lands.
- **Commits:** claim `7e53d613`; records `e50c7355`; notes `f5f8c32a`. This Result, the trace row and the move to done/
  are in the closing commit. Not pushed, not merged.
- **Notes** (sealed via `admitAndAppend`; contextRoot = this worktree's `.grugops/context`; `at` 2026-11-04T17:33:42Z
  from `date -u`; 3 of 3 read back with `sealVerdict` ok; index rendered):
  - decision `20261104T173342Z-ba-pm-decision-0ea9a948`: the `ABC-302` cut;
  - decision `20261104T173342Z-ba-pm-decision-e48b5667`: the `ABC-282` / `ABC-301` budget and order lines;
  - observation `20261104T173342Z-ba-pm-observation-41216b8d`: the artifacts and what is owed.

### Trace row (10 cells, header order)

Appended to `plans/traceability.md`, the row headed `bapm-ABC-302-cut`.
| bapm-ABC-302-cut | NFR-008 headroom cut as ABC-302 on Security/NFR …1184fec4 and Orchestrator ruling …112cd856 items 1–3: nine rows to existing deep lanes in ABC-281's form S (Part 1 R1–R7 to their own files' lanes: null-move A2, uci-session ABC-241 A5, futility "the rule changes the work", zobrist ABC-075 ep property, engine ABC-170 A5, levels A7 and ABC-174 A3; Part 2 R8 cli.test ABC-241 A4 and R9 engine.capacity ABC-122 A8 across, placed by the Architect), each with a default-lane remnant confirmed by mutant reads; no new file, lane line or env var; A4 seven -t lines "1 passed" (ADR-0046 rule item 3); A8 twin-arm graded, target H ≤ 9.4 s (≤ 10 s MET); S, P1, DoR 9/10, Backlog; R-302-a (R9 file-scoped vi.mock); ABC-282 / ABC-301 default-lane budget ≤ +0.10 s (N8-LANE H − B), no new default-lane file, rows ≥ 50 ms deep, W1 identity slice to ENGINE_DEEP, both after ABC-302; EPIC-011 rows 34, 53, 54 + ids line | EPIC-011 | — | NFR-008 (9.84 s graded, target ≤ 9.4 s), NFR-010 (untouched); ADR-0046 form S + run rule; ADR-0035 D1/D6 | `grugops/bapm-ABC-302-cut` (claim `7e53d613`, records `e50c7355`, notes `f5f8c32a`) | records only; nothing run | — (records) | — | Records done (BA/PM); Architect: arch-ABC-302 (forms, remnants, A6 mutants, R8/R9 placement + -t lines, R9 mock ruling); Orchestrator: board card ABC-302 (Backlog), the -t lines in QE briefs, Q-N8H-1 to the owner |
