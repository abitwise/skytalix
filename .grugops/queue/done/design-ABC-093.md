---
task: wave-2026-09-25
subtask: design-ABC-093
role: architect-design
workflow: agent-factory/workflows/02-feature-to-design.md (In Design hop) + 07-backlog-refinement.md
ticket: plans/tickets/ABC-093-compile-the-opening-book-into-a-static-checked-in-artifact.md
ref: .grugops/context/design-ABC-093/
source_refs: .grugops/context/rescore-p1-backlog-2026-10-10/notes/20261010T172705Z-ba-pm-decision-p1-backlog-two-in-design-two-backlog-0e4da324.md (D1, D2, D3; owner questions 4, 5), memory-bank/50-decisions/ADR-0012*, ADR-0023*, ADR-0036*
enqueued_by: orchestrator
enqueued_at: 2026-10-10T18:12:08Z
branch: grugops/design-ABC-093
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: Architect — design the opening-book chain (D1 for ABC-093; D2 for ABC-094 and D3 for ABC-095 ride along)

ABC-093 is In Design. BA/PM's note names three open structural decisions. D1: the book format — key (Zobrist
`bigint`, FEN or truncated hash; this decides `A2`'s method), weight encoding, where the name field lives
(ABC-096), and where the artifact and its compiler live. Placement decides two gates: a non-test compiler in
`src/` needs the owner's UAT word, and with a Node builtin import it fires ADR-0036 (b1). D2: the probe takes an
injected `() => number` built from `seededRandom`, or `seededRandom` first leaves `src/levels.ts`. D3: where the
per-session book seed comes from at the composition root (`src/cli.ts`). Re-verify each premise at the tip
first. ABC-010 (stricter `parseFen`) is merged — weigh that if D1 keys on FEN.

Record as **ADR-0037** (number reserved for this hop; a parallel hop holds ADR-0038), plus a decision note. Say
what each decision means for the gates (UAT waiver, In Security/NFR under ADR-0036) and what BA/PM must fold
into each page. Owner questions 4 and 5 in BA/PM's note stay the owner's; say whether D1 changes them.

## Fences
Docs only. Zero `src/`. No `plans/board.md`, `AGENTS.md`, ticket pages, or ticket columns (BA/PM folds). Never
merge; never push. Own worktree. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps.
Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. A probe on your own harness may import `src/`
read-only.

## Publish
Note per Workflow 16, trace row at the END of `plans/traceability.md`. Queue pending → claimed → done (by hand,
main checkout, uncommitted). Report: D1/D2/D3 rulings, gate consequences, fold list per page, branch + sha.
