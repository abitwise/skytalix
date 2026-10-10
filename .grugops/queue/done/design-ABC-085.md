---
task: wave-2026-09-25
subtask: design-ABC-085
role: architect-design
workflow: agent-factory/workflows/02-feature-to-design.md (In Design hop) + 07-backlog-refinement.md
ticket: plans/tickets/ABC-085-self-play-ladder.md
ref: .grugops/context/design-ABC-085/
source_refs: .grugops/context/rescore-p1-backlog-2026-10-10/notes/20261010T172705Z-ba-pm-decision-p1-backlog-two-in-design-two-backlog-0e4da324.md (D4; the step probe table; owner questions 1–3), .grugops/context/rescore-p1-backlog-2026-10-10/probe/, memory-bank/50-decisions/ADR-0025*, ADR-0027*, ADR-0035*
enqueued_by: orchestrator
enqueued_at: 2026-10-10T18:12:08Z
branch: grugops/design-ABC-085
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: Architect — D4 for ABC-085 (the self-play ladder's virtual-clock step)

ABC-085 is In Design. D4: name the virtual step (or steps) for `A1`/`A2`/`A6`; say what a virtual-clock verdict
claims about the shipped real-clock levels (ADR-0027: "a virtual millisecond is not a real one"); name the
opt-in lane. BA/PM's probe: below step 120, level 5 never differed from level 4 (0/50 at steps 30/10/4), and
level 4 differed from level 3 on 2–4/50. Real cost per L5 move grows to ~6.5 s at step 4. Re-verify the premise
at the tip first. ABC-083 (king safety and mobility) is about to be built and changes evaluation values — say
whether the verdict must be taken after it merges.

Record as **ADR-0038** (number reserved for this hop; a parallel hop holds ADR-0037), plus a decision note. Frame
the owner's choices for questions 1–3 in BA/PM's note (levels 4/5 options a/b/c; cost vs fidelity in machine
hours; P1 or P0) as a short, plain menu with your recommendation — the Orchestrator puts them to the owner.

## Fences
Docs only. Zero `src/`. No `plans/board.md`, `AGENTS.md`, ticket pages, or ticket columns (BA/PM folds). Never
merge; never push. Own worktree. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps.
Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. A probe on your own harness may import `src/`
read-only; keep any run under 10 minutes of wall time.

## Publish
Note per Workflow 16, trace row at the END of `plans/traceability.md`. Queue pending → claimed → done (by hand,
main checkout, uncommitted). Report: D4 ruling, lane name, what the verdict claims, the owner menu, fold list,
branch + sha.
