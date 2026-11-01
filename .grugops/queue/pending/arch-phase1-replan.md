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
