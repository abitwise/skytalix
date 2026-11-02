---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T00:15:20Z
subtask: arch-ABC-264
role: architect-design
ref: .grugops/context/arch-ABC-264/
branch: new grugops/arch-ABC-264 from main (worktree .claude/worktrees/arch-ABC-264)
width: records only (optional measurements ≤ 5 min under `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock`; scratch outside the repo, deleted after).
---
# Architect: ADR for ABC-264 (P2 reverse futility), and fix ADR-0056 D2's T3 rationale
## Read
plans/tickets/ABC-264*.md (A1–A6; BA/PM's proposed A4 0.90× is unconfirmed); ADR-0056 D2 (P2 stub, +30–60), D5 (reads), R-TC; ADR-0026 (doors), ADR-0050 d9 (zugzwang positions); src/search.ts, src/quiescence.ts, src/evaluate.ts as on main; arch-phase1-replan notes (T3 kept entries supply 17–23 % of exact cuts; only 3–5 % of nodes store).
## Do
1. Write the ADR (PROPOSED): margin formula and depth range, guards (root, in check, mate band, zugzwang/pawn-only material, PV/null-window choice), doors, value-safety analysis, falsifiers. Confirm or replace A4's 0.90× with a measured premise (a ≤ 5 min scratch probe is allowed and recommended — learn from ABC-238: measure the premise before the bar).
2. ADR-0056: dated correction of D2's T3 line ("a kept entry almost never cuts" → measured 17–23 %), and note Phase 1 paused / Phase 2 next pending the owner.
3. Say which ABC-264 DoR rows are met.
## Fences
memory-bank/50-decisions/ (new ADR; ADR-0056 dated lines only), your notes. No src/, plans/, board. No push, force, amend, rebase, merge into main. Queue moves inside your worktree. Leave nothing running.
## Publish
Sealed notes (task arch-ABC-264, contextRoot = worktree's .grugops/context, never the plugin cache), commit, ## Result + trace row, brief + claim to done/.

## Result
- **By:** Architect/Design (claude-opus-5-5), branch `grugops/arch-ABC-264` from `main` `ecc0331f`. Records only. The
  probe ran on a scratch copy of `main`'s `src/` outside the repository, under the host lock, each run 9–45 s; the
  scratch is deleted. Nothing was committed to `src/`.
- **Instrument check:** the door's depth-8 node counts reproduce `se-ABC-238`'s door to the node (kiwipete 1 116 785,
  position-6 1 602 457).
- **ADR-0059 (PROPOSED), the rule** (decision `…b48c5a3e`):
  - In both recursions, after the repetition checks, the leaf guard and the table probe, **before the null move**: at
    a **null-window node**, if `reverseFutilityCut(position, depth, ply, beta)` holds, **return beta, store nothing**.
  - The predicate (exported, pure, `src/search.ts`): false at the root (ply 0), at remaining depth **> 3**, when
    **|beta| ≥ `MATE_FLOOR`** (20 000), **in check**, or when the side to move has **fewer than three non-pawn pieces**
    (`ADR-0050` d6's count). Otherwise `evaluate(position) − 120 × depth ≥ beta`: **120 cp a ply**, depth **1–3**.
  - The static-score mate clause is vacuous (static eval < 10 000, asserted); `A2`'s row is met by that relation.
  - Doors `searchWithoutReverseFutility(position, depth)` / `chooseMoveWithoutReverseFutility(position, options)`;
    every older door off; export lists +2 (`ABC-077` `A6`) and +1 (`ABC-078` `A4`).
- **Measured premise** (observation `…1e9c2549`), depth 8, head / door:

  | | `search()` | `chooseMove` to 8 |
  |---|---|---|
  | kiwipete | 0.5901 | 0.6173 |
  | position-6 | 0.6373 | 0.6282 |

  - Drift d5 on the 190: 97.33 % within 25 cp in both recursions, max 107 cp, 0 mate flips. Mate floor 0/189.
    Zugzwang 7/7. `G1` 54/58 (no NEWLY line). Firing at depth 6 on the 190: 5.8 % of nodes cut, nodes 0.556×.
  - Measured choices: 75/100 cp sit on the drift bar (95.19 % / 95.72 % `chooseMove`); guard 0–1 loses
    `zugzwang.004`, guard 2 loses `zugzwang.005`; returning the static score reds drift (94.65 %, 166 cp); PV nodes
    too saves nothing; after the null move costs 0.74–0.78×; depth 1–5 adds 1–2 %.
- **The A4 bar, replaced:** **≤ 0.75× the door at depth 8 on kiwipete and position-6, in both recursions**, plus `G6`
  "≥ base". A faithful build reproduces the head counts to the node (658 971 / 1 021 190 / 972 596 / 299 183); a
  different count is explained before `A4` is read. 0.75 reds the "null move first" mis-build, which 0.90 would pass.
- **A3 tightened:** a cap of **none beyond 160 cp** (⌊1.5 × 107⌋). It reds the planted no-check-guard build in
  `chooseMove` (365 cp), which the 95 % clause alone passes.
- **Falsifiers F1–F7** (ADR-0059 table): F1 drift (fallback 150 cp a ply, owner's amendment), F2 mate sign, F3
  zugzwang rows, F4 A4 > 0.75× or `G6` below base, F5 C2′/S′, F6 doors, F7 `G1`. Named blind spot: a missing
  mate-band guard passes every oracle row; only the predicate's table catches it.
- **ADR-0056 correction** (observation `…bee0518c`): dated 2026-11-02 lines.
  - D2: row T3's "a kept entry almost never cuts" is false; kept entries supplied 17–23 % of exact cuts (`…5ea73b5c`).
    Row P2 is now `ABC-264` / `ADR-0059`.
  - D6: Phase 1 paused, Phase 2 next (P2 first), pending the owner. Item 2 stands as written until he answers.
- **ABC-264 DoR:** row 10 (the ADR) **met**: written, PROPOSED, build may start (reading (b)). Rows 4 and 6 are met with
  the replacement figures. **10/10 on reading (b)**, once BA/PM applies four page deltas: `A1` three export names;
  `A2` static-score row by argument; `A3` 160 cp cap and the zugzwang depths; `A4` 0.75× in both recursions. The board
  move to Ready is the Orchestrator's.
- **For the Orchestrator, to the owner:** "accept / decline ADR-0059" (gates `A6` and the merge); the Phase 1 pause
  line in ADR-0056 D6.
- **Commits:** claim `e910b270`; ADRs + notes `989f8cf4`. This Result, the trace row and the move to done/ are in the
  closing commit. Not pushed, not merged.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at` 2026-11-02T00:33:52Z
  from `date -u`; 3 of 3 read back, index rendered):
  - observation `20261102T003352Z-architect-design-observation-1e9c2549` (the probe);
  - decision `20261102T003352Z-architect-design-decision-b48c5a3e` (the rule, bars, falsifiers, DoR);
  - observation `20261102T003352Z-architect-design-observation-bee0518c` (artifacts; ADR-0056 correction).

### Trace row (10 cells, header order)

| arch-ABC-264 | ADR for ABC-264 P2 reverse futility: null-window nodes, depth 1–3, 120 cp a ply, returns beta, stores nothing, before null move; guards root / \|beta\| ≥ MATE_FLOOR / in check / < 3 non-pawn pieces; doors searchWithoutReverseFutility / chooseMoveWithoutReverseFutility; premise measured on scratch (d8 0.590/0.637 search(), 0.617/0.628 chooseMove; drift 97.33 %, max 107; mate 0/189; zugzwang 7/7; G1 54/58); A4 replaced by ≤ 0.75× both recursions; A3 + 160 cp cap; ADR-0056 D2 T3 corrected (17–23 %), D6 Phase 1 paused | EPIC-011 | ADR-0059 (PROPOSED; owner's); ADR-0056 dated D2/D6 lines; cites ADR-0026 d10, ADR-0050, ADR-0058 | NFR-005 (A4 ≤ 0.75×, G6 floor 6), NFR-004 (unchanged), NFR-008 (deep rows), NFR-009 (unchanged); no NFR file | `grugops/arch-ABC-264` (records only; claim `e910b270`, ADRs + notes `989f8cf4`) | scratch measurements only (deleted); door counts reproduce se-ABC-238 to the node | — (records) | — | Records done (Architect); awaits the owner (ADR-0059, the D6 pause), BA/PM page deltas (A1–A4), the Orchestrator's board move |
