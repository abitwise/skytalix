---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T23:38:43Z
subtask: arch-phase1-replan
role: architect-design
ref: .grugops/context/arch-phase1-replan/
branch: new grugops/arch-phase1-replan from grugops/ABC-238 (772153a7) — worktree .claude/worktrees/arch-phase1-replan
width: records + short measurements (≤ 5 min each, under `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock`); nothing else of this session is running.
---
# Architect: re-plan EPIC-011 Phase 1 after ABC-238's F4 stop
## Facts
se-ABC-238 (records on main: .grugops/context/se-ABC-238/; failed-attempt …db17e44b, acceptance …3beb1ada): T1 built correctly (0 diffs on doors, drift max 3/10 cp, 0 mate flips) but depth-8 nodes only 0.9939× / 0.9958× (bar ≤ 0.95×, F4); deeper entries settle 0.18–0.21 % of probes at depth 6; kiwipete search() makes 0 deeper cuts. SE hypothesis (UNKNOWN - verify): ADR-0058's three sources mostly leave shallower entries; always-replace evicts the rest.
## Do
1. Measure on throwaway scratch patches over the ABC-238 branch (never committed to src): probe statistics and depth-8 node ratio for (a) T1 alone, (b) T1 + T2 depth-preferred, (c) T1 + T2 + T3 (table kept across a short game's moves), (d) T2 alone. Report why deeper entries are rare (which of reductions / null move / transpositions produce them).
2. Rule: is there a combined attempt whose premise the numbers support (state its bar), or does Phase 1's TT strand end here with ADR-0058 "accepted, not in force" if the owner accepts it? Do not loosen F4 for T1 alone; a combined ticket needs its own pre-registered bar.
3. Update ADR-0058 / the ADR-0025 T2 amendment with a dated status line (both stay PROPOSED pending the owner). Say what BA/PM must change (ABC-238 / 237 / 257 / 258 pages, Phase 1 order) and which Phase 2+ ticket should go next if the TT strand pauses.
## Fences
memory-bank/50-decisions/ADR-0058*, ADR-0025* (status/addendum only), your notes, scratch patches outside the repo. No src/ commits, no plans/, board. No push, force, amend, rebase, merge into main. Queue moves inside your worktree. Leave nothing running; delete scratch.
## Publish
Sealed notes (task arch-phase1-replan, contextRoot = worktree's .grugops/context, never the plugin cache), commit, ## Result + trace row, brief + claim to done/.

## Result
- **By:** Architect/Design (claude-opus-5-5), branch `grugops/arch-phase1-replan` from `grugops/ABC-238` `772153a7`.
  Records only. The measurements ran on a scratch copy of the branch's `src/`, outside the repository, under the host
  lock, each run 7–90 s. The scratch is deleted. Nothing was committed to `src/`.
- **Instrument check:** the patched tree reproduces `se-ABC-238`'s node counts to the node, and its depth-6 hit count
  (262 545).
- **Fixed depth 8, nodes / door, kiwipete / position-6** (observation `…c0e9f5a0`):

  | variant | `search()` | `chooseMove` to 8 |
  |---|---|---|
  | (a) T1 alone | 0.9939 / 0.9958 | 0.9587 / 0.9986 |
  | (b) T1 + T2 | 0.9943 / 0.9950 | 0.9466 / 1.0013 |
  | (d) T2 alone | 1.0004 / 1.0028 | 0.9940 / 1.0012 |

  - **(c) T1 + T2 + T3** was measured on three short games (kiwipete, position-6, startpos), 9 engine-side searches
    each at depth 8, with the table kept. It read **0.885× pooled**, 0.916× geometric mean, and 0.877× over searches
    2–9.
  - **Extras:** T1 + T3 0.910×, 0.904× over searches 2–9; T3 alone 0.975×.
  - **Noise:** the per-search sd of the log ratio is 0.12–0.25.
- **Probes, depth 6 on the 190:** T1 deeper cuts are 0.212 % (`search()`) and 0.176 % (`chooseMove`). T2 adds
  nothing (0.213 % / 0.176 %).
- **Why deeper entries are rare** (observation `…64bcf436`):
  - Each source searches shallow first: LMR re-searches deeper, iterative deepening goes up, and null move runs its
    reduced subtree before the moves.
  - So a deeper-then-shallower order needs two lines to one key:
    - LMR transpositions give 65–80 % of deeper cuts;
    - tempo-losing transpositions across plies give 20–35 %;
    - null move contributes only at depth 8, as the lost tempo.
  - Eviction is not the cause. Another key evicted 12 of 3 275 deeper results (depth 6, the 190), and 0–1 per depth-8
    search.
- **Corrections found** (observation `…5ea73b5c`):
  - Only 3–5 % of nodes store, so table pressure is about 20× below ADR-0025's T2 arithmetic (4 s: about 18 % of
    stores collide, not "≤ 91 %").
  - T2 pays only on a loaded table: 0.77× at 2^14.
  - Kept entries do cut under exact depth: 17–23 % of exact cuts. ADR-0056 D2's T3 rationale needs correcting (owed by
    a later ADR-0056 hop).
- **Ruling** (decision `…64e95bfa`): **pause the Phase 1 TT strand.**
  - F4 is not loosened, and `ABC-238` does not merge.
  - A combined T1 + T3 attempt is defined with its bar pre-registered: held-out lines from position-3, position-4 and
    position-5; searches 2–9 pooled ≤ 0.93× the door; no game above 1.00×.
  - It resumes only if the owner answers yes to the C2′ NEUTRAL-bar question or allows a longer-control read. At
    100 ms, T1 adds nothing over T3, so that read would re-read `ABC-209`'s NEUTRAL.
- **ADRs:** both stay PROPOSED, pending the owner.
  - ADR-0058: recommend he accept it, so it reads "accepted, not in force".
  - ADR-0025 T2 amendment: recommend he park it with `ABC-258`.
- **BA/PM owes** (decision `…64e95bfa`):
  - `ABC-238`: closed unmerged on F4, and the `ABC-081` A1 line marked not in force.
  - `ABC-237`: parked, to be re-read with `ABC-258`.
  - `ABC-257`: re-scoped to T1 + T3 with the new bar, paused; drop its `ABC-237` dependency and strike its "never
    cuts" premise.
  - `ABC-258`: premise restated with the store fraction; T2 folded in.
  - `ABC-236`: its T1 dependency lifted.
  - `EPIC-011`: Phase 1 marked paused, Phase 2 next, row T3 corrected.
- **Next ticket:** Phase 2 P2, reverse futility (static null move). ADR-0056 D2 puts it at +30–60, size S, and the
  100 ms read can see it. BA/PM cuts it under a new id; the Architect writes its ADR. Fallback with a full page:
  `ABC-233`.
- **For the Orchestrator, to the owner:**
  - "accept / decline ADR-0058";
  - "park the ADR-0025 T2 amendment";
  - the C2′ NEUTRAL-bar question;
  - the pause itself, because it changes ADR-0056 D6's Phase 1 order.
- **Commits:** claim `2ec504c0`; ADRs + notes `cf16591d`. This Result, the trace row and the move to done/ are in the
  closing commit. Not pushed, not merged.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at` 2026-11-02T00:02:40Z
  from `date -u`; 4 of 4 read back):
  - observation `20261102T000240Z-architect-design-observation-c0e9f5a0` (the four variants);
  - observation `20261102T000240Z-architect-design-observation-64bcf436` (why deeper entries are rare);
  - observation `20261102T000240Z-architect-design-observation-5ea73b5c` (pressure, T2 under load, kept-entry cuts);
  - decision `20261102T000240Z-architect-design-decision-64e95bfa` (the ruling).

### Trace row (10 cells, header order)

| arch-phase1-replan | EPIC-011 Phase 1 re-plan after ABC-238's F4: four variants measured on scratch (d8 search T1 0.9939/0.9958, T1+T2 0.9943/0.9950, T2 1.0004/1.0028; T1+T2+T3 over three short games 0.885 pooled); deeper entries rare because each source searches shallow first (LMR 65–80 %, ply transpositions 20–35 % of deeper cuts; eviction ~0); ruling: Phase 1 TT strand PAUSED, combined T1+T3 pre-registered (held-out, searches 2–9 pooled ≤ 0.93×, no game > 1.00×) behind the owner's C2′ answer; next P2 reverse futility | EPIC-011 | ADR-0058 (PROPOSED; F4 fired; recommend accepted, not in force); ADR-0025 T2 amendment (PROPOSED; recommend park with ABC-258); names ADR-0056 C2′/D2/D6 (T3 rationale correction owed) | NFR-005 (A4/F4 read), NFR-009 (store fraction 3–5 % of nodes; pressure arithmetic corrected); no NFR file | `grugops/arch-phase1-replan` (records only; claim `2ec504c0`, ADRs + notes `cf16591d`) | scratch measurements only (deleted); node counts reproduce se-ABC-238 to the node | waived (0 production lines); QE verdict signs | — | Records done (Architect); awaits the owner (ADR-0058, ADR-0025 T2, C2′ question, the pause), BA/PM page deltas, QE hop |
