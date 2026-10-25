---
subtask: arch-design-ABC-207
role: architect-design
ticket: plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md
ref: .grugops/context/arch-design-ABC-207/
branch: new grugops/arch-design-ABC-207 from main (5c91e2e4), worktree ../wt-arch-design-ABC-207
width: 1 of 2 agents (same Architect as arch-adr0048-status; no real-clock timing, no G6, no games)
---

# Design ABC-207: per-piece mobility weights + early-queen term (ruling before build)

## Do
- Same pattern as `arch-design-ABC-215` (`…e04234f4`). On `main` `5c91e2e4` (ABC-215's rule-made values), rule:
  - the per-piece weights (queen lowest per square) and the early-queen term's form and size, inside ADR-0031 D2's attack-map form and the ±100 cp mobility cap (A1–A3). A form change → STOP: it is an ADR-0031 change for the owner.
  - G2 by construction (≤ 1 100 ns), stated `UNKNOWN - verify`.
  - Moved-pin probe: run head-as-designed against main's tests on a scratch clone. List every row that moves, with its route (re-pin / ADR-0028 d2 re-find / oracle rule). Any ADR-0026 level or NFR bound move → STOP.
  - The page's Test note 4 frozen-clock d7/d8 node counts (kiwipete, position-6; base and head). Predict G6 for the record only.
  - Size check (S; split if it grows).
- Write the ruling into the page's `## Design ruling` section.

## Fences
- Only your worktree, scratch clones and `<scratchpad>/arch207/`. No product code is committed. Default and deterministic deep lanes only; no real-clock rows. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task arch-design-ABC-207). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
