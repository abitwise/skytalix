---
task: wave-2026-09-25
subtask: ruling-abc082-levels
role: architect-design
workflow: agent-factory/workflows/04-ticket-to-pr.md (stop condition → design ruling)
ticket: plans/tickets/ABC-082-evaluation-pawn-structure.md
ref: .grugops/context/ruling-abc082-levels/
build_ref: .grugops/context/ticket-to-pr-ABC-082/   (on grugops/ABC-082-pawn-structure @ bef7d43; notes …9bdc69b3, …7040acad, …a00b6aaa)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T16:35:47Z
branch: grugops/ruling-abc082-levels
base: grugops/ABC-082-pawn-structure @ bef7d43
---

# Subtask: rule the two LEVEL rows `ABC-082` reddened, and the row-8 fixture swap

The Engineer stopped under the brief's stop rule (`BLOCKED_NEEDS_FIX`). No level literal was
edited and no weight tuned. Read the build notes; do not re-derive what they measured.

1. **Row 21 — `ABC-079` `A1` at depth 3: 2/24 (level ≤ 1, base 0/24).** One position + mirror,
   `4k3/8/8/8/8/b7/1p6/1R2K3 w`: with a 100 cp bonus for Black's passed b2 pawn on its 7th rank, the
   engine plays Rxb2 Bxb2 into a K+B v K draw (0) instead of keeping a position it scores ≤ −40.
   The Engineer shows re-weighting (80, 60) does not clear it; only switching the passed term off
   does. **Is the corpus row's "losing capture" label still true under a pawn-aware evaluator?**
   Rule: the label holds (then what must change in the build), or the row is mis-labelled (then
   what replaces it so `A1` still guards what `ABC-079` meant — and show its mutant still reds).
2. **Row 17 — `ABC-081` `A2`: position-6 TT hit rate at depth 5 = 14.46% vs ≥ 15% (base 15.38%;
   kiwipete 15.63%).** Invariant across weight variants; it follows the doubled/isolated terms
   reshaping the tree. Rule whether the level measures a property this change legitimately moves
   (and how it is re-levelled, and by whose word — a level move may need the owner) or a defect.
3. **Row 8 — the Engineer swapped `ABC-121` `A4`'s `search()` fixture to `h5h6` `[10, "b1c1"]`
   because the old one no longer needs the re-search at fixed depth; six re-search mutants red on
   the new one. Keep or revert.**

The kiwipete depth-7 WARN (`NFR-005`, 1/3 rounds vs base 3/3; +14.6% nodes to depth 7) is NOT
yours — Security/NFR then the owner. Note it only if a ruling above changes it.

If a ruling needs an ADR or an amendment, write it `proposed`. Say exactly what the Engineer must
change (if anything) and what BA/PM must fold.

## Fences
No `src/` production edits (probes under `ref:` only), no `plans/board.md`, `AGENTS.md`,
`plans/nfr-catalog.md`, ticket criteria. Never merge; never push. Own `git worktree` under
`.claude/worktrees/` (symlink `node_modules`). Commit messages via a scratchpad file and
`git commit -F`. Real UTC in note stamps (`date -u`).

## Publish
`decision` note(s) under `ref:`, an ADR/amendment if needed (`proposed`), a trace row. Queue
pending → claimed → done per Workflow 17. Report: each ruling one line with evidence, what the
Engineer and BA/PM must change, any owner word owed, branch + sha, numstat.
